'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_SKINCARE_PLANNER_STORE,
  normalizeSkincarePlannerStore,
  type SkincarePlannerStore,
} from '@/lib/skincare-planner';

export type {
  SkincarePlannerStore,
  SkincareItem,
  SkincareItemCatalog,
  SkincareSlotKey,
  DayOfWeek,
} from '@/lib/skincare-planner';

function getLegacyStorageKey(storageScope: string): string {
  return `skincare-planner:${storageScope}`;
}

async function persistToServer(store: SkincarePlannerStore, keepalive = false): Promise<void> {
  const res = await fetch('/api/skincare-planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive,
    body: JSON.stringify({ store }),
  });
  if (!res.ok) throw new Error('Failed to save skincare planner');
}

export function useSkincarePlanner(storageScope: string) {
  const [store, setStore] = useState<SkincarePlannerStore>(EMPTY_SKINCARE_PLANNER_STORE);
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

  const storageKey = useMemo(() => getLegacyStorageKey(storageScope), [storageScope]);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    latestStoreRef.current = store;
  }, [store]);

  const loadFromServer = useCallback(
    async (isInitial = false) => {
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
        const response = await fetch('/api/skincare-planner', { method: 'GET', cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load skincare planner');

        const payload = (await response.json()) as { store?: unknown; updatedAt?: string | null };
        const serverStore = normalizeSkincarePlannerStore(payload.store);

        // Check if server has data (V2 format)
        const hasData = serverStore.items.length > 0 || Object.values(serverStore.itemCatalog).some((items) => items.length > 0);

        if (hasData) {
          setStore(serverStore);
        } else if (isInitial && typeof window !== 'undefined') {
          // Try loading from localStorage (may have V1 or V2 data)
          const legacyRaw = window.localStorage.getItem(storageKey);
          const legacyStore = normalizeSkincarePlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);
          const legacyHas = legacyStore.items.length > 0 || Object.values(legacyStore.itemCatalog).some((items) => items.length > 0);

          if (legacyHas) {
            setStore(legacyStore);
            await persistToServer(legacyStore); // Auto-migrate V1 -> V2 on server
            window.localStorage.removeItem(storageKey); // Clean up old storage
          }
        }

        setLastSyncedAt(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
        setSaveError(null);
      } catch (error) {
        console.error('[SkincarePlanner] Failed loading from server', error);
        if (isInitial && typeof window !== 'undefined') {
          const legacyRaw = window.localStorage.getItem(storageKey);
          const legacyStore = normalizeSkincarePlannerStore(legacyRaw ? JSON.parse(legacyRaw) : null);
          const legacyHas = legacyStore.items.length > 0 || Object.values(legacyStore.itemCatalog).some((items) => items.length > 0);
          setStore(legacyStore);
          hasPendingChangesRef.current = legacyHas;
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
        console.error('[SkincarePlanner] Failed to save to server', error);
        setSaveError('Could not save skincare planner right now.');
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
          console.error('[SkincarePlanner] Failed flushing pending save', error);
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
    (value: SkincarePlannerStore | ((prev: SkincarePlannerStore) => SkincarePlannerStore)) => {
      hasPendingChangesRef.current = true;
      setStore((prev) =>
        typeof value === 'function' ? (value as (prev: SkincarePlannerStore) => SkincarePlannerStore)(prev) : value,
      );
    },
    [],
  );

  return {
    plannerStore: store,
    setPlannerStore,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    refresh: loadFromServer,
  };
}
