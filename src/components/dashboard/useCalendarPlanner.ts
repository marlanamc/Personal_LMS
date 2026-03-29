'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ThoughtOrganization } from '@/lib/thought-organization';
import { normalizeOrganization } from '@/lib/thought-organization';

export type PlannerTask = {
  id: string;
  text: string;
  done: boolean;
};

export type InterstitialJournalEntry = {
  id: string;
  text: string;
  createdAt: string;
  tag?: string;
  tagMeta?: JournalTagMeta;
};

export type CustomTag = {
  id: string;
  label: string;
  color: 'peach' | 'sky' | 'mint' | 'periwinkle' | 'lavender' | 'rose' | 'coral' | 'sage' | 'blush' | 'slate';
};

export type JournalTagMeta = {
  id: string;
  label: string;
  color: CustomTag['color'];
};

export type DayPlan = {
  notes: string;
  tasks: PlannerTask[];
  thoughtDownload?: string;
  thoughtOrganization?: ThoughtOrganization;
  interstitialJournalEntries?: InterstitialJournalEntry[];
};

export type PlannerStore = Record<string, DayPlan> & {
  _customTags?: CustomTag[];
};

const EMPTY_DAY_PLAN: DayPlan = { notes: '', tasks: [], thoughtDownload: '', thoughtOrganization: undefined, interstitialJournalEntries: [] };

function normalizePlannerTask(raw: unknown): PlannerTask | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as { id?: unknown; text?: unknown; done?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text : '';
  if (!id || !text) return null;
  return { id, text, done: candidate.done === true };
}

function normalizeInterstitialJournalEntry(raw: unknown): InterstitialJournalEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as { id?: unknown; text?: unknown; createdAt?: unknown; tag?: unknown; tagMeta?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';
  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';
  if (!id || !text || !createdAt) return null;
  const tag = typeof candidate.tag === 'string' && candidate.tag.trim() ? candidate.tag.trim() : undefined;
  const rawTagMeta =
    candidate.tagMeta && typeof candidate.tagMeta === 'object' && !Array.isArray(candidate.tagMeta)
      ? (candidate.tagMeta as { id?: unknown; label?: unknown; color?: unknown })
      : null;
  const tagMeta =
    rawTagMeta &&
    typeof rawTagMeta.id === 'string' &&
    typeof rawTagMeta.label === 'string' &&
    typeof rawTagMeta.color === 'string' &&
    ['peach', 'sky', 'mint', 'periwinkle', 'lavender', 'rose', 'coral', 'sage', 'blush', 'slate'].includes(rawTagMeta.color)
      ? {
          id: rawTagMeta.id,
          label: rawTagMeta.label,
          color: rawTagMeta.color as JournalTagMeta['color'],
        }
      : undefined;
  return { id, text, createdAt, tag, tagMeta };
}

function normalizeCustomTag(raw: unknown): CustomTag | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const candidate = raw as { id?: unknown; label?: unknown; color?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const label = typeof candidate.label === 'string' ? candidate.label.trim() : '';
  const color = typeof candidate.color === 'string' ? candidate.color : '';
  if (!id || !label) return null;
  if (!['peach', 'sky', 'mint', 'periwinkle', 'lavender', 'rose', 'coral', 'sage', 'blush', 'slate'].includes(color)) {
    return null;
  }
  return { id, label, color: color as CustomTag['color'] };
}

function normalizeDayPlan(raw: unknown): DayPlan {
  if (!raw || typeof raw !== 'object') return { notes: '', tasks: [], thoughtDownload: '', thoughtOrganization: undefined, interstitialJournalEntries: [] };
  const candidate = raw as {
    notes?: unknown;
    tasks?: unknown;
    thoughtDownload?: unknown;
    thoughtOrganization?: unknown;
    interstitialJournalEntries?: unknown;
  };
  const notes = typeof candidate.notes === 'string' ? candidate.notes : '';
  const tasks = Array.isArray(candidate.tasks)
    ? candidate.tasks.map(normalizePlannerTask).filter((t): t is PlannerTask => t !== null)
    : [];
  const thoughtDownload = typeof candidate.thoughtDownload === 'string' ? candidate.thoughtDownload : '';
  const thoughtOrganization = normalizeOrganization(candidate.thoughtOrganization as ThoughtOrganization | undefined);
  const interstitialJournalEntries = Array.isArray(candidate.interstitialJournalEntries)
    ? candidate.interstitialJournalEntries
        .map(normalizeInterstitialJournalEntry)
        .filter((entry): entry is InterstitialJournalEntry => entry !== null)
    : [];
  return { notes, tasks, thoughtDownload, thoughtOrganization, interstitialJournalEntries };
}

function normalizePlannerStore(raw: unknown): PlannerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const source = raw as Record<string, unknown>;
  const store: PlannerStore = {};
  const customTags = Array.isArray(source._customTags)
    ? source._customTags.map(normalizeCustomTag).filter((tag): tag is CustomTag => tag !== null)
    : [];
  if (customTags.length > 0) {
    store._customTags = customTags;
  }
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
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const isSavingRef = useRef(false);
  const readyToPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncingRef = useRef(false);

  const storageKey = useMemo(() => getLegacyStorageKey(storageScope), [storageScope]);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  const loadFromServer = useCallback(async (isInitial = false) => {
    if (isSyncingRef.current || isSavingRef.current) return;
    isSyncingRef.current = true;
    
    if (isInitial) setIsLoaded(false);
    
    try {
      const response = await fetch('/api/calendar-planner', { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load planner from server');

      const payload = (await response.json()) as { store?: unknown; updatedAt?: string };
      const serverStore = normalizePlannerStore(payload.store);
      
      if (Object.keys(serverStore).length > 0) {
        setStore(serverStore);
      } else if (isInitial) {
        // Only attempt legacy migration on initial load if server is empty
        const legacyRaw = window.localStorage.getItem(storageKey);
        const legacyStore = normalizePlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);

        if (Object.keys(legacyStore).length > 0) {
          setStore(legacyStore);
          await persistToServer(legacyStore);
          window.localStorage.removeItem(storageKey);
        }
      }
      
      setLastSyncedAt(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
      setSaveError(null);
    } catch (error) {
      console.error('[CalendarPlanner] Failed loading from server', error);
      if (isInitial) {
        const legacyRaw = window.localStorage.getItem(storageKey);
        const legacyStore = normalizePlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);
        setStore(legacyStore);
        setSaveError('Sync is temporarily unavailable. Local changes will retry.');
      }
    } finally {
      setIsLoaded(true);
      readyToPersistRef.current = true;
      isSyncingRef.current = false;
    }
  }, [storageKey]);

  // Initial load
  useEffect(() => {
    loadFromServer(true);
  }, [loadFromServer]);

  // Sync on window focus / visibility change
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

  // Optional polling (every 5 minutes)
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
        console.error('[CalendarPlanner] Failed to save to server', error);
        setSaveError('Could not save planner right now.');
      } finally {
        setIsSaving(false);
      }
    }, 600); // Increased debounce slightly for better merge stability

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

  const updatePlanField = useCallback(
    <K extends keyof DayPlan>(dateKeyStr: string, field: K, value: DayPlan[K]) => {
      setStore((prev) => {
        const existing = prev[dateKeyStr] || EMPTY_DAY_PLAN;
        if (existing[field] === value) return prev;
        return {
          ...prev,
          [dateKeyStr]: {
            ...existing,
            [field]: value,
          },
        };
      });
    },
    [],
  );

  const setCustomTags = useCallback((tags: CustomTag[]) => {
    setStore((prev): PlannerStore => {
      if (tags.length === 0) {
        if (!prev._customTags) return prev;
        const { _customTags: _removed, ...rest } = prev;
        return rest as PlannerStore;
      }

      return {
        ...prev,
        _customTags: tags,
      } as PlannerStore;
    });
  }, []);

  const exportBulletsFromDay = useCallback(
    (dateKeyStr: string): import('@/lib/thought-organization').ThoughtBullet[] => {
      const plan = getPlan(dateKeyStr);
      return plan.thoughtOrganization?.bullets || [];
    },
    [getPlan]
  );

  return {
    plannerStore: store,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    getPlan,
    updatePlan,
    updatePlanField,
    setCustomTags,
    exportBulletsFromDay,
    refresh: loadFromServer,
  };
}
