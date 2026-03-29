'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ThoughtOrganizerStore } from '@/lib/thought-organization';

async function persistToServer(store: ThoughtOrganizerStore): Promise<void> {
  const res = await fetch('/api/thought-organizer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store }),
  });
  if (!res.ok) throw new Error('Failed to save organizer');
}

export function useThoughtOrganizer() {
  const [organization, setOrganization] = useState<ThoughtOrganizerStore>({
    bullets: [],
    projects: [],
  });
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
      const response = await fetch('/api/thought-organizer', {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Failed to load organizer from server');

      const payload = (await response.json()) as {
        store?: ThoughtOrganizerStore;
        updatedAt?: string;
      };

      setOrganization(payload.store || { bullets: [], projects: [] });
      setLastSyncedAt(payload.updatedAt ? new Date(payload.updatedAt) : new Date());
      setSaveError(null);
    } catch (error) {
      console.error('[ThoughtOrganizer] Failed loading from server', error);
      if (isInitial) {
        setSaveError('Sync is temporarily unavailable. Local changes will retry.');
      }
    } finally {
      setIsLoaded(true);
      readyToPersistRef.current = true;
      isSyncingRef.current = false;
    }
  }, []);

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

  // Auto-save with debounce
  useEffect(() => {
    if (!readyToPersistRef.current || !isLoaded) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await persistToServer(organization);
        setLastSyncedAt(new Date());
      } catch (error) {
        console.error('[ThoughtOrganizer] Failed to save to server', error);
        setSaveError('Could not save organizer right now.');
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
  }, [isLoaded, organization]);

  const updateOrganization = useCallback((updater: (prev: ThoughtOrganizerStore) => ThoughtOrganizerStore) => {
    setOrganization(updater);
  }, []);

  return {
    organization,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    updateOrganization,
    refresh: loadFromServer,
  };
}
