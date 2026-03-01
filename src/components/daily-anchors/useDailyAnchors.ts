'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createDefaultDailyAnchorState,
  getActiveAnchor,
  getSleepRhythmDayComplete,
  isAnchorScheduledForDate,
  normalizeDailyAnchorsStore,
  resolveAnchorStatuses,
  toDateKey,
  type AnchorId,
  type DailyAnchor,
  type DailyAnchorState,
  type DailyAnchorTemplate,
  type DailyAnchorsStore,
} from '@/lib/anchors';

const STORE_VERSION = 1 as const;
const DAILY_ANCHORS_UPDATE_EVENT = 'daily-anchors:update';

function createEmptyStore(): DailyAnchorsStore {
  return normalizeDailyAnchorsStore(null);
}

function getLegacyStorageKey(storageScope: string): string {
  return `daily-anchors-state-v1:${storageScope}`;
}

function shiftDateKey(dateKey: string, offsetDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  date.setDate(date.getDate() + offsetDays);
  return toDateKey(date);
}

function ensureDailyState(store: DailyAnchorsStore, dateKey: string): DailyAnchorState {
  return store.states[dateKey] || createDefaultDailyAnchorState(dateKey, store.templates);
}

function mergeStateWithTemplates(state: DailyAnchorState, templates: DailyAnchorTemplate[]): DailyAnchorState {
  const existingById = new Map(state.anchors.map((anchor) => [anchor.id, anchor]));

  const anchors = templates.map((template) => {
    const existing = existingById.get(template.id);
    return {
      id: template.id,
      label: template.label,
      icon: template.icon,
      scheduledTime: template.scheduledTime,
      ...(template.daysOfWeek ? { daysOfWeek: template.daysOfWeek } : {}),
      status: existing?.status ?? 'waiting',
      actualTime: existing?.actualTime,
    } satisfies DailyAnchor;
  });

  const nextStateBase: DailyAnchorState = {
    ...state,
    anchors,
    sleepRhythmDayComplete: false,
  };

  return {
    ...nextStateBase,
    sleepRhythmDayComplete: getSleepRhythmDayComplete(nextStateBase),
  };
}

async function persistStoreToServer(store: DailyAnchorsStore): Promise<void> {
  await fetch('/api/daily-anchors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store }),
  });
}

export function useDailyAnchors(storageScope: string) {
  const [store, setStore] = useState<DailyAnchorsStore>(createEmptyStore);
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
        const response = await fetch('/api/daily-anchors', { method: 'GET', cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load daily anchors from server');

        const payload = (await response.json()) as { store?: unknown };
        const serverStore = normalizeDailyAnchorsStore(payload.store);

        if (!cancelled) {
          if (Object.keys(serverStore.states).length > 0) {
            setStore(serverStore);
          } else {
            const legacyRaw = window.localStorage.getItem(storageKey);
            const legacyStore = normalizeDailyAnchorsStore(legacyRaw ? JSON.parse(legacyRaw) : null);

            if (Object.keys(legacyStore.states).length > 0) {
              setStore(legacyStore);
              await persistStoreToServer(legacyStore);
              window.localStorage.removeItem(storageKey);
            } else {
              setStore(createEmptyStore());
            }
          }
        }
      } catch (error) {
        console.error('[DailyAnchors] Failed loading from server, using local fallback', error);
        const legacyRaw = window.localStorage.getItem(storageKey);
        const legacyStore = normalizeDailyAnchorsStore(legacyRaw ? JSON.parse(legacyRaw) : null);
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
    const handleUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ next: DailyAnchorsStore }>;
      if (!custom.detail?.next) return;
      setStore(custom.detail.next);
    };

    window.addEventListener(DAILY_ANCHORS_UPDATE_EVENT, handleUpdate as EventListener);
    return () => {
      window.removeEventListener(DAILY_ANCHORS_UPDATE_EVENT, handleUpdate as EventListener);
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
        await persistStoreToServer(store);
      } catch (error) {
        console.error('[DailyAnchors] Failed to save to server', error);
        setSaveError('Could not save daily anchors right now.');
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

  const updateStore = useCallback((next: DailyAnchorsStore) => {
    setStore(next);
    window.dispatchEvent(new CustomEvent(DAILY_ANCHORS_UPDATE_EVENT, { detail: { next } }));
  }, []);

  const getStateForDate = useCallback(
    (date: Date) => {
      const dateKey = toDateKey(date);
      const resolved = ensureDailyState(store, dateKey);
      return {
        ...resolved,
        anchors: resolveAnchorStatuses(resolved, new Date()),
      };
    },
    [store],
  );

  const sleepRhythmStreakDays = useMemo(() => {
    const todayKey = toDateKey(new Date());
    let streak = 0;
    let cursor = todayKey;

    while (true) {
      const day = store.states[cursor];
      if (!day?.sleepRhythmDayComplete) break;
      streak += 1;
      cursor = shiftDateKey(cursor, -1);
    }

    return streak;
  }, [store.states]);

  const setAnchorsForDate = useCallback(
    (date: Date, anchors: DailyAnchor[]) => {
      const dateKey = toDateKey(date);
      const currentState = ensureDailyState(store, dateKey);

      const nextStateBase: DailyAnchorState = {
        ...currentState,
        anchors,
        sleepRhythmDayComplete: false,
      };

      const nextState: DailyAnchorState = {
        ...nextStateBase,
        sleepRhythmDayComplete: getSleepRhythmDayComplete(nextStateBase),
      };

      updateStore({
        version: STORE_VERSION,
        templates: store.templates,
        states: {
          ...store.states,
          [dateKey]: nextState,
        },
      });
    },
    [store, updateStore],
  );

  const setAnchorTemplates = useCallback(
    (templates: DailyAnchorTemplate[]) => {
      const now = new Date();
      const todayKey = toDateKey(now);

      const nextStates: Record<string, DailyAnchorState> = {};
      const stateEntries = Object.entries(store.states);
      for (const [dateKey, state] of stateEntries) {
        nextStates[dateKey] = mergeStateWithTemplates(state, templates);
      }

      if (!nextStates[todayKey]) {
        nextStates[todayKey] = createDefaultDailyAnchorState(todayKey, templates);
      }

      updateStore({
        version: STORE_VERSION,
        templates,
        states: nextStates,
      });
    },
    [store.states, updateStore],
  );

  const toggleAnchorForDate = useCallback(
    (date: Date, anchorId: AnchorId) => {
      const dateKey = toDateKey(date);
      const currentState = ensureDailyState(store, dateKey);

      const nextAnchors = currentState.anchors.map((anchor) => {
        if (anchor.id !== anchorId) return anchor;
        const willComplete = anchor.status !== 'done';
        return {
          ...anchor,
          status: willComplete ? 'done' : 'waiting',
          actualTime: willComplete ? new Date().toISOString() : undefined,
        } satisfies DailyAnchor;
      });

      setAnchorsForDate(date, nextAnchors);
    },
    [setAnchorsForDate, store],
  );

  return {
    isLoaded,
    isSaving,
    saveError,
    anchorTemplates: store.templates,
    sleepRhythmStreakDays,
    getStateForDate,
    toggleAnchorForDate,
    setAnchorsForDate,
    setAnchorTemplates,
  };
}

export function useDailyAnchorsForToday(storageScope: string) {
  const {
    isLoaded,
    isSaving,
    saveError,
    anchorTemplates,
    sleepRhythmStreakDays,
    getStateForDate,
    toggleAnchorForDate,
    setAnchorsForDate,
    setAnchorTemplates,
  } = useDailyAnchors(storageScope);

  const today = new Date();
  const todayState = getStateForDate(today);
  const anchors = todayState.anchors;
  const anchorsScheduledToday = anchors.filter((anchor) => isAnchorScheduledForDate(anchor, today));
  const activeAnchor = getActiveAnchor(anchorsScheduledToday.length > 0 ? anchorsScheduledToday : anchors, today);

  const toggleAnchor = useCallback(
    (anchorId: AnchorId) => {
      toggleAnchorForDate(new Date(), anchorId);
    },
    [toggleAnchorForDate],
  );

  const setTodayAnchors = useCallback(
    (nextAnchors: DailyAnchor[]) => {
      setAnchorsForDate(new Date(), nextAnchors);
    },
    [setAnchorsForDate],
  );

  return {
    isLoaded,
    isSaving,
    saveError,
    anchors,
    activeAnchor,
    anchorTemplates,
    sleepRhythmDayComplete: todayState.sleepRhythmDayComplete,
    sleepRhythmStreakDays,
    toggleAnchor,
    setTodayAnchors,
    setAnchorTemplates,
  };
}
