'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getTodayKey } from '@/lib/unified-scheduler';

export const DAILY_FOCUS_FIELD_MAX = 400;

export type DailyFocusFieldKey = 'must' | 'need' | 'want';

export type DailyFocusTriadState = {
  must: string;
  need: string;
  want: string;
  doneMust: boolean;
  doneNeed: boolean;
  doneWant: boolean;
  /** After saving from the guided modal, main line is read-only until edited again via the guide. */
  lockedMust: boolean;
  lockedNeed: boolean;
  lockedWant: boolean;
};

const emptyState = (): DailyFocusTriadState => ({
  must: '',
  need: '',
  want: '',
  doneMust: false,
  doneNeed: false,
  doneWant: false,
  lockedMust: false,
  lockedNeed: false,
  lockedWant: false,
});

function doneKeyFor(field: DailyFocusFieldKey): keyof Pick<
  DailyFocusTriadState,
  'doneMust' | 'doneNeed' | 'doneWant'
> {
  switch (field) {
    case 'must':
      return 'doneMust';
    case 'need':
      return 'doneNeed';
    case 'want':
      return 'doneWant';
  }
}

function storageKey(scope: string, dateKey: string): string {
  return `home-daily-focus:${scope}:${dateKey}`;
}

function clampField(s: string): string {
  return s.length > DAILY_FOCUS_FIELD_MAX ? s.slice(0, DAILY_FOCUS_FIELD_MAX) : s;
}

function parseStored(raw: string | null): DailyFocusTriadState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DailyFocusTriadState>;
    if (typeof parsed !== 'object' || parsed === null) return null;
    return {
      must: clampField(typeof parsed.must === 'string' ? parsed.must : ''),
      need: clampField(typeof parsed.need === 'string' ? parsed.need : ''),
      want: clampField(typeof parsed.want === 'string' ? parsed.want : ''),
      doneMust: typeof parsed.doneMust === 'boolean' ? parsed.doneMust : false,
      doneNeed: typeof parsed.doneNeed === 'boolean' ? parsed.doneNeed : false,
      doneWant: typeof parsed.doneWant === 'boolean' ? parsed.doneWant : false,
      lockedMust: typeof parsed.lockedMust === 'boolean' ? parsed.lockedMust : false,
      lockedNeed: typeof parsed.lockedNeed === 'boolean' ? parsed.lockedNeed : false,
      lockedWant: typeof parsed.lockedWant === 'boolean' ? parsed.lockedWant : false,
    };
  } catch {
    return null;
  }
}

function readFromStorage(scope: string, dateKey: string): DailyFocusTriadState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = window.localStorage.getItem(storageKey(scope, dateKey));
    return parseStored(raw) ?? emptyState();
  } catch {
    return emptyState();
  }
}

function writeToStorage(scope: string, dateKey: string, value: DailyFocusTriadState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(scope, dateKey), JSON.stringify(value));
  } catch {
    // ignore quota / private mode
  }
}

export function useDailyFocusTriad(storageScope: string) {
  const [dateKey, setDateKey] = useState<string>(() => getTodayKey());
  const [values, setValues] = useState<DailyFocusTriadState>(() => emptyState());
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateKeyRef = useRef(dateKey);
  const valuesRef = useRef(values);
  dateKeyRef.current = dateKey;
  valuesRef.current = values;

  const hydrateForDay = useCallback(
    (key: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setDateKey(key);
      setValues(readFromStorage(storageScope, key));
    },
    [storageScope],
  );

  useEffect(() => {
    hydrateForDay(getTodayKey());
  }, [hydrateForDay]);

  useEffect(() => {
    const checkDay = () => {
      const next = getTodayKey();
      if (next !== dateKey) {
        hydrateForDay(next);
      }
    };

    const onVis = () => {
      if (document.visibilityState === 'visible') checkDay();
    };

    window.addEventListener('focus', checkDay);
    document.addEventListener('visibilitychange', onVis);
    const id = window.setInterval(checkDay, 60_000);

    return () => {
      window.removeEventListener('focus', checkDay);
      document.removeEventListener('visibilitychange', onVis);
      window.clearInterval(id);
    };
  }, [dateKey, hydrateForDay]);

  const persist = useCallback((next: DailyFocusTriadState) => {
    writeToStorage(storageScope, dateKeyRef.current, next);
    setLastSavedAt(Date.now());
  }, [storageScope]);

  const schedulePersist = useCallback(
    (next: DailyFocusTriadState) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        persist(next);
      }, 420);
    },
    [persist],
  );

  useEffect(() => {
    return () => {
      if (!debounceRef.current) return;
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
      writeToStorage(storageScope, dateKeyRef.current, valuesRef.current);
    };
  }, [storageScope]);

  const setField = useCallback(
    (field: DailyFocusFieldKey, value: string) => {
      setValues((prev) => {
        const locked =
          field === 'must'
            ? prev.lockedMust
            : field === 'need'
              ? prev.lockedNeed
              : prev.lockedWant;
        if (locked) return prev;
        const clamped = clampField(value);
        const next = { ...prev, [field]: clamped };
        schedulePersist(next);
        return next;
      });
    },
    [schedulePersist],
  );

  const toggleDone = useCallback(
    (field: DailyFocusFieldKey) => {
      const dk = doneKeyFor(field);
      setValues((prev) => {
        const next = { ...prev, [dk]: !prev[dk] };
        schedulePersist(next);
        return next;
      });
    },
    [schedulePersist],
  );

  /** Set all three text fields in one update. Pass `fromGuide: true` when saving from the guided modal to lock the main lines. */
  const applyTextFields = useCallback(
    (
      text: Pick<DailyFocusTriadState, 'must' | 'need' | 'want'>,
      options?: { fromGuide?: boolean },
    ) => {
      setValues((prev) => {
        const next: DailyFocusTriadState = {
          ...prev,
          must: clampField(text.must),
          need: clampField(text.need),
          want: clampField(text.want),
          ...(options?.fromGuide
            ? {
                lockedMust: true,
                lockedNeed: true,
                lockedWant: true,
              }
            : {}),
        };
        schedulePersist(next);
        return next;
      });
    },
    [schedulePersist],
  );

  return {
    dateKey,
    values,
    lastSavedAt,
    setField,
    toggleDone,
    applyTextFields,
  };
}
