'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeCrisisMenuStore, DEFAULT_ITEMS, type CrisisMenuStore } from '@/lib/crisis-menu';

export type { CrisisMenuTab, CrisisMenuItem, CrisisMenuStore } from '@/lib/crisis-menu';

async function persistToServer(store: CrisisMenuStore): Promise<void> {
  const res = await fetch('/api/crisis-menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store }),
  });
  if (!res.ok) throw new Error('Failed to save crisis menu');
}

export function useCrisisMenu(_storageScope: string) {
  const [store, setStore] = useState<CrisisMenuStore>(DEFAULT_ITEMS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const isSavingRef = useRef(false);
  const readyToPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  const loadFromServer = useCallback(async (isInitial = false) => {
    if (isSyncingRef.current || isSavingRef.current) return;
    isSyncingRef.current = true;

    if (isInitial) setIsLoaded(false);

    try {
      const response = await fetch('/api/crisis-menu', { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load crisis menu from server');

      const payload = (await response.json()) as { store?: unknown; updatedAt?: string | null };
      const serverStore = normalizeCrisisMenuStore(payload.store);

      setStore(serverStore);
      setLastSyncedAt(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
      setSaveError(null);
    } catch (error) {
      console.error('[CrisisMenu] Failed loading from server', error);
      setSaveError('Could not load crisis menu right now.');
    } finally {
      setIsLoaded(true);
      readyToPersistRef.current = true;
      isSyncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadFromServer(true);
  }, [loadFromServer]);

  // Refetch on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadFromServer();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);

      return () => {
        window.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleVisibilityChange);
      };
    }
  }, [loadFromServer]);

  // Periodic refetch every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        loadFromServer();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadFromServer]);

  // Debounced autosave
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
        console.error('[CrisisMenu] Failed to save to server', error);
        setSaveError('Could not save crisis menu right now.');
      } finally {
        setIsSaving(false);
      }
    }, 600); // 600ms debounce

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [isLoaded, store]);

  return {
    menuStore: store,
    setMenuStore: setStore,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    refresh: loadFromServer,
  };
}
