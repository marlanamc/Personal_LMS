'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_MEDIA_HUB_STORE,
  normalizeMediaHubStore,
  type MediaHubStore,
  type Podcast,
  type MediaItem,
  type MediaType,
  type MediaStatus,
} from '@/lib/media-hub';

function getStorageKey(storageScope: string): string {
  return `media-hub:${storageScope}`;
}

async function persistToServer(store: MediaHubStore, keepalive = false): Promise<void> {
  const res = await fetch('/api/media-hub', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive,
    body: JSON.stringify({ store }),
  });
  if (!res.ok) throw new Error('Failed to save media hub');
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useMediaHub(storageScope: string) {
  const [store, setStore] = useState<MediaHubStore>(EMPTY_MEDIA_HUB_STORE);
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
        const response = await fetch('/api/media-hub', { method: 'GET', cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load media hub from server');

        const payload = (await response.json()) as { store?: unknown; updatedAt?: string | null };
        const serverStore = normalizeMediaHubStore(payload.store);

        const hasData = serverStore.podcasts.length > 0 || serverStore.mediaItems.length > 0;

        if (hasData) {
          setStore(serverStore);
        } else if (isInitial && typeof window !== 'undefined') {
          const legacyRaw = window.localStorage.getItem(storageKey);
          const legacyStore = normalizeMediaHubStore(legacyRaw ? JSON.parse(legacyRaw) : null);
          const legacyHas = legacyStore.podcasts.length > 0 || legacyStore.mediaItems.length > 0;
          if (legacyHas) {
            setStore(legacyStore);
            await persistToServer(legacyStore);
            window.localStorage.removeItem(storageKey);
          }
        }

        setLastSyncedAt(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
        setSaveError(null);
      } catch (error) {
        console.error('[MediaHub] Failed loading from server', error);
        if (isInitial && typeof window !== 'undefined') {
          const legacyRaw = window.localStorage.getItem(storageKey);
          const legacyStore = normalizeMediaHubStore(legacyRaw ? JSON.parse(legacyRaw) : null);
          const legacyHas = legacyStore.podcasts.length > 0 || legacyStore.mediaItems.length > 0;
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
        console.error('[MediaHub] Failed to save to server', error);
        setSaveError('Could not save media hub right now.');
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
          console.error('[MediaHub] Failed flushing pending save', error);
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

  const setMediaHubStore = useCallback(
    (value: MediaHubStore | ((prev: MediaHubStore) => MediaHubStore)) => {
      hasPendingChangesRef.current = true;
      setStore((prev) => (typeof value === 'function' ? value(prev) : value));
    },
    [],
  );

  // Convenience actions
  const addPodcast = useCallback(
    (name: string, category?: string) => {
      const podcast: Podcast = {
        id: generateId(),
        name: name.trim(),
        category: category?.trim() || undefined,
        addedAt: new Date().toISOString(),
      };
      setMediaHubStore((prev) => ({
        ...prev,
        podcasts: [...prev.podcasts, podcast],
      }));
    },
    [setMediaHubStore],
  );

  const removePodcast = useCallback(
    (id: string) => {
      setMediaHubStore((prev) => ({
        ...prev,
        podcasts: prev.podcasts.filter((p) => p.id !== id),
      }));
    },
    [setMediaHubStore],
  );

  const addMediaItem = useCallback(
    (title: string, type: MediaType, status: MediaStatus = 'on-deck') => {
      const now = new Date().toISOString();
      const item: MediaItem = {
        id: generateId(),
        title: title.trim(),
        type,
        status,
        lastTouchedAt: now,
        addedAt: now,
      };
      setMediaHubStore((prev) => ({
        ...prev,
        mediaItems: [...prev.mediaItems, item],
      }));
    },
    [setMediaHubStore],
  );

  const updateMediaStatus = useCallback(
    (id: string, status: MediaStatus) => {
      const now = new Date().toISOString();
      setMediaHubStore((prev) => ({
        ...prev,
        mediaItems: prev.mediaItems.map((m) =>
          m.id === id
            ? {
                ...m,
                status,
                lastTouchedAt: now,
                finishedAt: status === 'finished' ? now : m.finishedAt,
              }
            : m,
        ),
      }));
    },
    [setMediaHubStore],
  );

  const removeMediaItem = useCallback(
    (id: string) => {
      setMediaHubStore((prev) => ({
        ...prev,
        mediaItems: prev.mediaItems.filter((m) => m.id !== id),
      }));
    },
    [setMediaHubStore],
  );

  const moveToActive = useCallback(
    (id: string) => {
      updateMediaStatus(id, 'active');
    },
    [updateMediaStatus],
  );

  const markAsFinished = useCallback(
    (id: string) => {
      updateMediaStatus(id, 'finished');
    },
    [updateMediaStatus],
  );

  const touchMediaItem = useCallback(
    (id: string) => {
      const now = new Date().toISOString();
      setMediaHubStore((prev) => ({
        ...prev,
        mediaItems: prev.mediaItems.map((m) =>
          m.id === id ? { ...m, lastTouchedAt: now } : m,
        ),
      }));
    },
    [setMediaHubStore],
  );

  return {
    store,
    setStore: setMediaHubStore,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    refresh: loadFromServer,

    // Podcast actions
    addPodcast,
    removePodcast,

    // Media item actions
    addMediaItem,
    updateMediaStatus,
    removeMediaItem,
    moveToActive,
    markAsFinished,
    touchMediaItem,
  };
}

export type { MediaHubStore, Podcast, MediaItem, MediaType, MediaStatus } from '@/lib/media-hub';
