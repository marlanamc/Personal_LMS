'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_PROJECT_PLANNER_STORE,
  normalizeProjectPlannerStore,
  newProjectId,
  newTaskId,
  pushRecentEmoji,
  autoDistributeTasks,
  type ProjectPlannerStore,
  type Project,
  type ProjectTask,
  type TaskStatus,
  type DateKey,
} from '@/lib/project-planner';
import { toDateKey } from '@/lib/unified-scheduler';

export type {
  ProjectPlannerStore,
  Project,
  ProjectTask,
  ProjectStatus,
  TaskStatus,
} from '@/lib/project-planner';

function getLegacyStorageKey(storageScope: string): string {
  return `project-planner:${storageScope}`;
}

async function persistToServer(store: ProjectPlannerStore): Promise<void> {
  const res = await fetch('/api/project-planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store }),
  });
  if (!res.ok) throw new Error('Failed to save project planner');
}

export function useProjectPlanner(storageScope: string) {
  const [store, setStore] = useState<ProjectPlannerStore>(EMPTY_PROJECT_PLANNER_STORE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const isSavingRef = useRef(false);
  const readyToPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncingRef = useRef(false);

  const storageKey = useMemo(() => getLegacyStorageKey(storageScope), [storageScope]);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  const loadFromServer = useCallback(
    async (isInitial = false) => {
      if (isSyncingRef.current || isSavingRef.current) return;
      isSyncingRef.current = true;

      if (isInitial) setIsLoaded(false);

      try {
        const response = await fetch('/api/project-planner', { method: 'GET', cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load project planner from server');

        const payload = (await response.json()) as { store?: unknown; updatedAt?: string | null };
        const serverStore = normalizeProjectPlannerStore(payload.store);

        const hasData = serverStore.projects.length > 0 || serverStore.recentEmojis.length > 0;

        if (hasData) {
          setStore(serverStore);
        } else if (isInitial && typeof window !== 'undefined') {
          const legacyRaw = window.localStorage.getItem(storageKey);
          const legacyStore = normalizeProjectPlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);
          const legacyHas = legacyStore.projects.length > 0 || legacyStore.recentEmojis.length > 0;
          if (legacyHas) {
            setStore(legacyStore);
            await persistToServer(legacyStore);
            window.localStorage.removeItem(storageKey);
          }
        }

        setLastSyncedAt(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
        setSaveError(null);
      } catch (error) {
        console.error('[ProjectPlanner] Failed loading from server', error);
        if (isInitial && typeof window !== 'undefined') {
          const legacyRaw = window.localStorage.getItem(storageKey);
          const legacyStore = normalizeProjectPlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);
          setStore(legacyStore);
          setSaveError('Sync is temporarily unavailable. Local changes will retry.');
        }
      } finally {
        setIsLoaded(true);
        readyToPersistRef.current = true;
        isSyncingRef.current = false;
      }
    },
    [storageKey],
  );

  useEffect(() => {
    loadFromServer(true);
  }, [loadFromServer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadFromServer();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [loadFromServer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadFromServer();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadFromServer]);

  useEffect(() => {
    if (!readyToPersistRef.current || !isLoaded) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await persistToServer(store);
        setLastSyncedAt(new Date());
      } catch (error) {
        console.error('[ProjectPlanner] Failed to save to server', error);
        setSaveError('Could not save project planner right now.');
      } finally {
        setIsSaving(false);
      }
    }, 600);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [isLoaded, store]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Computed values
  // ─────────────────────────────────────────────────────────────────────────────

  const activeProjects = useMemo(
    () => store.projects.filter(p => p.status === 'active'),
    [store.projects],
  );

  const archivedProjects = useMemo(
    () => store.projects.filter(p => p.status === 'archived'),
    [store.projects],
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Project actions
  // ─────────────────────────────────────────────────────────────────────────────

  const createProject = useCallback(
    (
      name: string,
      startDate: DateKey,
      endDate: DateKey,
      options?: {
        emoji?: string;
        description?: string;
        categories?: string[];
        tasks?: ProjectTask[];
      },
    ): Project => {
      const now = new Date().toISOString();
      const project: Project = {
        id: newProjectId(),
        name: name.trim(),
        description: options?.description?.trim() || undefined,
        emoji: options?.emoji || undefined,
        startDate,
        endDate,
        status: 'active',
        tasks: options?.tasks || [],
        categories: options?.categories,
        createdAt: now,
        updatedAt: now,
      };

      setStore(prev => ({
        ...prev,
        projects: [project, ...prev.projects],
        recentEmojis: options?.emoji ? pushRecentEmoji(prev.recentEmojis, options.emoji) : prev.recentEmojis,
      }));

      return project;
    },
    [],
  );

  const updateProject = useCallback(
    (
      projectId: string,
      updates: Partial<Pick<Project, 'name' | 'description' | 'emoji' | 'startDate' | 'endDate' | 'status' | 'categories'>>,
    ) => {
      setStore(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === projectId
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p,
        ),
        recentEmojis: updates.emoji ? pushRecentEmoji(prev.recentEmojis, updates.emoji) : prev.recentEmojis,
      }));
    },
    [],
  );

  const archiveProject = useCallback((projectId: string) => {
    updateProject(projectId, { status: 'archived' });
  }, [updateProject]);

  const deleteProject = useCallback((projectId: string) => {
    setStore(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
    }));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Task actions
  // ─────────────────────────────────────────────────────────────────────────────

  const addTask = useCallback(
    (
      projectId: string,
      text: string,
      options?: { scheduledDate?: DateKey; estimatedMinutes?: number; category?: string },
    ): ProjectTask | null => {
      const trimmed = text.trim();
      if (!trimmed) return null;

      const task: ProjectTask = {
        id: newTaskId(),
        text: trimmed,
        scheduledDate: options?.scheduledDate,
        estimatedMinutes: options?.estimatedMinutes,
        category: options?.category,
        status: 'pending',
        order: Date.now(),
      };

      setStore(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === projectId
            ? { ...p, tasks: [...p.tasks, task], updatedAt: new Date().toISOString() }
            : p,
        ),
      }));

      return task;
    },
    [],
  );

  const updateTask = useCallback(
    (
      projectId: string,
      taskId: string,
      updates: Partial<Pick<ProjectTask, 'text' | 'notes' | 'scheduledDate' | 'estimatedMinutes' | 'category' | 'status' | 'order'>>,
    ) => {
      setStore(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.map(t =>
                  t.id === taskId
                    ? {
                        ...t,
                        ...updates,
                        completedAt:
                          updates.status === 'completed' && t.status !== 'completed'
                            ? new Date().toISOString()
                            : updates.status !== 'completed'
                              ? undefined
                              : t.completedAt,
                      }
                    : t,
                ),
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      }));
    },
    [],
  );

  const toggleTaskComplete = useCallback(
    (projectId: string, taskId: string) => {
      setStore(prev => ({
        ...prev,
        projects: prev.projects.map(p => {
          if (p.id !== projectId) return p;

          const task = p.tasks.find(t => t.id === taskId);
          if (!task) return p;

          const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';

          return {
            ...p,
            tasks: p.tasks.map(t =>
              t.id === taskId
                ? {
                    ...t,
                    status: newStatus,
                    completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
                  }
                : t,
            ),
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    [],
  );

  const deleteTask = useCallback((projectId: string, taskId: string) => {
    setStore(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId), updatedAt: new Date().toISOString() }
          : p,
      ),
    }));
  }, []);

  const moveTaskToDate = useCallback(
    (projectId: string, taskId: string, newDate: DateKey | undefined) => {
      updateTask(projectId, taskId, { scheduledDate: newDate });
    },
    [updateTask],
  );

  const autoDistribute = useCallback((projectId: string) => {
    const todayKey = toDateKey(new Date());

    setStore(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: autoDistributeTasks(p, todayKey),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────────

  return {
    store,
    setStore,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    refresh: loadFromServer,

    // Computed
    activeProjects,
    archivedProjects,

    // Project actions
    createProject,
    updateProject,
    archiveProject,
    deleteProject,

    // Task actions
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    moveTaskToDate,
    autoDistribute,
  };
}
