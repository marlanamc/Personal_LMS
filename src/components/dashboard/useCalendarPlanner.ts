'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type PlannerTask = {
  id: string;
  text: string;
  done: boolean;
};

export type DayPlan = {
  notes: string;
  tasks: PlannerTask[];
};

export type PlannerStore = Record<string, DayPlan>;

const EMPTY_DAY_PLAN: DayPlan = { notes: '', tasks: [] };

function normalizePlannerTask(raw: unknown): PlannerTask | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as { id?: unknown; text?: unknown; done?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text : '';
  if (!id || !text) return null;
  return { id, text, done: candidate.done === true };
}

function normalizeDayPlan(raw: unknown): DayPlan {
  if (!raw || typeof raw !== 'object') return { notes: '', tasks: [] };
  const candidate = raw as { notes?: unknown; tasks?: unknown };
  const notes = typeof candidate.notes === 'string' ? candidate.notes : '';
  const tasks = Array.isArray(candidate.tasks)
    ? candidate.tasks.map(normalizePlannerTask).filter((t): t is PlannerTask => t !== null)
    : [];
  return { notes, tasks };
}

function normalizePlannerStore(raw: unknown): PlannerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const source = raw as Record<string, unknown>;
  const store: PlannerStore = {};
  for (const [key, value] of Object.entries(source)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    store[key] = normalizeDayPlan(value);
  }
  return store;
}

function getLegacyStorageKey(storageScope: string): string {
  return `calendar-planner:${storageScope}`;
}

async function persistToServer(store: PlannerStore): Promise<void> {
  const res = await fetch('/api/calendar-planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store }),
  });
  if (!res.ok) throw new Error('Failed to save planner');
}

export function useCalendarPlanner(storageScope: string) {
  const [store, setStore] = useState<PlannerStore>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const readyToPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storageKey = useMemo(() => getLegacyStorageKey(storageScope), [storageScope]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoaded(false);
      try {
        const response = await fetch('/api/calendar-planner', { method: 'GET', cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load planner from server');

        const payload = (await response.json()) as { store?: unknown };
        const serverStore = normalizePlannerStore(payload.store);

        if (!cancelled) {
          if (Object.keys(serverStore).length > 0) {
            setStore(serverStore);
          } else {
            const legacyRaw = window.localStorage.getItem(storageKey);
            const legacyStore = normalizePlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);

            if (Object.keys(legacyStore).length > 0) {
              setStore(legacyStore);
              await persistToServer(legacyStore);
              window.localStorage.removeItem(storageKey);
            }
          }
        }
      } catch (error) {
        console.error('[CalendarPlanner] Failed loading from server, using local fallback', error);
        const legacyRaw = window.localStorage.getItem(storageKey);
        const legacyStore = normalizePlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);
        if (!cancelled) {
          setStore(legacyStore);
          setSaveError('Sync is temporarily unavailable. Changes will retry.');
        }
      } finally {
        if (!cancelled) {
          setIsLoaded(true);
          readyToPersistRef.current = true;
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

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
      } catch (error) {
        console.error('[CalendarPlanner] Failed to save to server', error);
        setSaveError('Could not save planner right now.');
      } finally {
        setIsSaving(false);
      }
    }, 280);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [isLoaded, store]);

  const getPlan = useCallback(
    (dateKeyStr: string): DayPlan => store[dateKeyStr] || EMPTY_DAY_PLAN,
    [store],
  );

  const updatePlan = useCallback(
    (dateKeyStr: string, plan: DayPlan) => {
      setStore((prev) => ({ ...prev, [dateKeyStr]: plan }));
    },
    [],
  );

  return {
    plannerStore: store,
    isLoaded,
    isSaving,
    saveError,
    getPlan,
    updatePlan,
  };
}
