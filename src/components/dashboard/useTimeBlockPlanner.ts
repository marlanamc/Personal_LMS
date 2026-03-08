'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type TimeBlockDayPlan,
  type TimeBlockPlannerStore,
  normalizeTimeBlockPlannerStore,
} from '@/lib/time-block-planner';

async function persistToServer(store: TimeBlockPlannerStore): Promise<void> {
  const response = await fetch('/api/time-block-planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store }),
  });

  if (!response.ok) {
    throw new Error('Failed to save time blocks');
  }
}

export function useTimeBlockPlanner() {
  const [store, setStore] = useState<TimeBlockPlannerStore>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const readyToPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoaded(false);
      try {
        const response = await fetch('/api/time-block-planner', { method: 'GET', cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load time blocks');
        }

        const payload = (await response.json()) as { store?: unknown };
        if (!cancelled) {
          setStore(normalizeTimeBlockPlannerStore(payload.store));
          setSaveError(null);
        }
      } catch (error) {
        console.error('[TimeBlockPlanner] Failed to load store', error);
        if (!cancelled) {
          setStore({});
          setSaveError('Sync is temporarily unavailable.');
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
  }, []);

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
        dirtyRef.current = false;
      } catch (error) {
        console.error('[TimeBlockPlanner] Failed to save store', error);
        setSaveError('Could not save this plan right now.');
      } finally {
        setIsSaving(false);
      }
    }, 300);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [isLoaded, store]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const setPlan = useCallback((dateKey: string, plan: TimeBlockDayPlan) => {
    dirtyRef.current = true;
    setStore((current) => ({
      ...current,
      [dateKey]: plan,
    }));
  }, []);

  return {
    plannerStore: store,
    isLoaded,
    isSaving,
    saveError,
    setPlan,
  };
}
