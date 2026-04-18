'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_QUARTERLY_PLANNER_STORE,
  archiveActiveQuarter,
  normalizeQuarterlyPlannerStore,
  reopenArchivedQuarter,
  startNewQuarter,
  updateQuarterCheckIn,
  updateQuarterField,
  updateQuarterGoal,
  type QuarterlyCheckIn,
  type QuarterlyGoal,
  type QuarterlyPlannerStore,
} from '@/lib/quarterly-planner';
import type { DateKey } from '@/lib/unified-scheduler';

export type { QuarterlyCheckIn, QuarterlyGoal, QuarterlyPlan, QuarterlyPlannerStore } from '@/lib/quarterly-planner';

function getStorageKey(storageScope: string): string {
  return `quarterly-planner:${storageScope}`;
}

async function persistToServer(store: QuarterlyPlannerStore, keepalive = false): Promise<void> {
  const response = await fetch('/api/quarterly-planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive,
    body: JSON.stringify({ store }),
  });

  if (!response.ok) {
    throw new Error('Failed to save quarterly planner');
  }
}

export function useQuarterlyPlanner(storageScope: string) {
  const [store, setStore] = useState<QuarterlyPlannerStore>(EMPTY_QUARTERLY_PLANNER_STORE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const isSavingRef = useRef(false);
  const readyToPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncingRef = useRef(false);
  const latestStoreRef = useRef(store);
  const hasPendingChangesRef = useRef(false);

  const storageKey = useMemo(() => getStorageKey(storageScope), [storageScope]);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    latestStoreRef.current = store;
  }, [store]);

  const loadFromServer = useCallback(async (isInitial = false) => {
    if (
      !isInitial &&
      (isSyncingRef.current || isSavingRef.current || saveTimerRef.current !== null || hasPendingChangesRef.current)
    ) {
      return;
    }

    if (isSyncingRef.current || isSavingRef.current) return;
    isSyncingRef.current = true;

    if (isInitial) setIsLoaded(false);

    try {
      const response = await fetch('/api/quarterly-planner', { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load quarterly planner from server');

      const payload = (await response.json()) as { store?: unknown; updatedAt?: string | null };
      const serverStore = normalizeQuarterlyPlannerStore(payload.store);
      setStore(serverStore);
      setLastSyncedAt(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
      setSaveError(null);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('[QuarterlyPlanner] Failed loading from server', error);
      if (isInitial && typeof window !== 'undefined') {
        const localRaw = window.localStorage.getItem(storageKey);
        if (localRaw) {
          setStore(normalizeQuarterlyPlannerStore(JSON.parse(localRaw)));
          hasPendingChangesRef.current = true;
        }
      }
      setSaveError('Sync is temporarily unavailable. Local changes will retry.');
    } finally {
      setIsLoaded(true);
      readyToPersistRef.current = true;
      isSyncingRef.current = false;
    }
  }, [storageKey]);

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
    if (typeof window === 'undefined' || !isLoaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(store));
  }, [isLoaded, storageKey, store]);

  useEffect(() => {
    if (!readyToPersistRef.current || !isLoaded || !hasPendingChangesRef.current) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      saveTimerRef.current = null;
      setIsSaving(true);
      setSaveError(null);
      try {
        await persistToServer(latestStoreRef.current);
        hasPendingChangesRef.current = false;
        setLastSyncedAt(new Date());
      } catch (error) {
        console.error('[QuarterlyPlanner] Failed to save to server', error);
        setSaveError('Could not save quarterly planner right now.');
      } finally {
        setIsSaving(false);
      }
    }, 500);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [isLoaded, store]);

  useEffect(() => {
    const flushPendingSave = () => {
      if (!readyToPersistRef.current || !hasPendingChangesRef.current) return;
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      void persistToServer(latestStoreRef.current, true)
        .then(() => {
          hasPendingChangesRef.current = false;
        })
        .catch((error) => {
          console.error('[QuarterlyPlanner] Failed flushing pending save', error);
        });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPendingSave();
      }
    };

    window.addEventListener('pagehide', flushPendingSave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', flushPendingSave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flushPendingSave();
    };
  }, []);

  const setPlannerStore = useCallback(
    (value: QuarterlyPlannerStore | ((prev: QuarterlyPlannerStore) => QuarterlyPlannerStore)) => {
      hasPendingChangesRef.current = true;
      setStore((prev) =>
        typeof value === 'function' ? (value as (prev: QuarterlyPlannerStore) => QuarterlyPlannerStore)(prev) : value,
      );
    },
    [],
  );

  const updateActiveQuarterField = useCallback(
    <K extends keyof QuarterlyPlannerStore['activeQuarter']>(field: K, value: QuarterlyPlannerStore['activeQuarter'][K]) => {
      setPlannerStore((prev) => ({
        ...prev,
        activeQuarter: updateQuarterField(prev.activeQuarter, field, value),
      }));
    },
    [setPlannerStore],
  );

  const updateGoal = useCallback((goalIndex: number, updates: Partial<QuarterlyGoal>) => {
    setPlannerStore((prev) => ({
      ...prev,
      activeQuarter: updateQuarterGoal(prev.activeQuarter, goalIndex, updates),
    }));
  }, [setPlannerStore]);

  const updateWeeklyCheckIn = useCallback((weekNumber: number, updates: Partial<QuarterlyCheckIn>) => {
    setPlannerStore((prev) => ({
      ...prev,
      activeQuarter: updateQuarterCheckIn(prev.activeQuarter, weekNumber, updates),
    }));
  }, [setPlannerStore]);

  const beginNewQuarter = useCallback((startDate?: DateKey) => {
    setPlannerStore((prev) => startNewQuarter(prev, startDate));
  }, [setPlannerStore]);

  const archiveCurrentQuarter = useCallback(() => {
    setPlannerStore((prev) => archiveActiveQuarter(prev));
  }, [setPlannerStore]);

  const reopenQuarter = useCallback((quarterId: string) => {
    setPlannerStore((prev) => reopenArchivedQuarter(prev, quarterId));
  }, [setPlannerStore]);

  return {
    plannerStore: store,
    activeQuarter: store.activeQuarter,
    archivedQuarters: store.archivedQuarters,
    setPlannerStore,
    updateActiveQuarterField,
    updateGoal,
    updateWeeklyCheckIn,
    beginNewQuarter,
    archiveCurrentQuarter,
    reopenQuarter,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    refresh: loadFromServer,
  };
}
