'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SavedSpark } from './CurrentSparksPanel';
import type { MuseumItem } from './UnfinishedMuseum';

export type SparksStore = {
  savedSparks: SavedSpark[];
  museumItems: MuseumItem[];
};

const EMPTY_STORE: SparksStore = { savedSparks: [], museumItems: [] };

function normalizeSavedSpark(raw: unknown): SavedSpark | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as {
    id?: unknown;
    text?: unknown;
    emoji?: unknown;
    color?: unknown;
    createdAt?: unknown;
    sourcePromptId?: unknown;
  };

  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';
  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';

  if (!id || !text || !createdAt) return null;

  const validColors = ['sakura', 'teal', 'mint', 'amethyst'];
  const color =
    typeof candidate.color === 'string' && validColors.includes(candidate.color)
      ? (candidate.color as SavedSpark['color'])
      : 'sakura';

  const emoji = typeof candidate.emoji === 'string' ? candidate.emoji : undefined;
  const sourcePromptId =
    typeof candidate.sourcePromptId === 'string' ? candidate.sourcePromptId : undefined;

  return { id, text, emoji, color, createdAt, sourcePromptId };
}

function normalizeMuseumItem(raw: unknown): MuseumItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as {
    id?: unknown;
    title?: unknown;
    note?: unknown;
    createdAt?: unknown;
  };

  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const title = typeof candidate.title === 'string' ? candidate.title.trim() : '';
  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';

  if (!id || !title || !createdAt) return null;

  const note = typeof candidate.note === 'string' && candidate.note.trim() ? candidate.note.trim() : undefined;

  return { id, title, note, createdAt };
}

function normalizeSparksStore(raw: unknown): SparksStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return EMPTY_STORE;
  const source = raw as { savedSparks?: unknown; museumItems?: unknown };

  const savedSparks = Array.isArray(source.savedSparks)
    ? source.savedSparks.map(normalizeSavedSpark).filter((s): s is SavedSpark => s !== null)
    : [];

  const museumItems = Array.isArray(source.museumItems)
    ? source.museumItems.map(normalizeMuseumItem).filter((m): m is MuseumItem => m !== null)
    : [];

  return { savedSparks, museumItems };
}

function hasContent(store: SparksStore): boolean {
  return store.savedSparks.length > 0 || store.museumItems.length > 0;
}

function getStorageKey(storageScope: string): string {
  return `sparks:${storageScope}`;
}

async function persistToServer(store: SparksStore, storageScope: string): Promise<void> {
  const res = await fetch('/api/sparks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store, storageScope }),
  });
  if (!res.ok) throw new Error('Failed to save sparks');
}

async function loadFromServerFn(storageScope: string): Promise<SparksStore | null> {
  const res = await fetch(`/api/sparks?scope=${encodeURIComponent(storageScope)}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const payload = (await res.json()) as { store?: unknown };
  return normalizeSparksStore(payload.store);
}

export function useSparks(storageScope: string) {
  const [store, setStore] = useState<SparksStore>(EMPTY_STORE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const readyToPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storageKey = useMemo(() => getStorageKey(storageScope), [storageScope]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoaded(false);

      try {
        const serverStore = await loadFromServerFn(storageScope);
        if (serverStore && hasContent(serverStore)) {
          setStore(serverStore);
        } else {
          // Try localStorage fallback
          const localRaw = window.localStorage.getItem(storageKey);
          if (localRaw) {
            const localStore = normalizeSparksStore(JSON.parse(localRaw));
            if (hasContent(localStore)) {
              setStore(localStore);
              // Migrate to server
              await persistToServer(localStore, storageScope);
              window.localStorage.removeItem(storageKey);
            }
          }
        }
        setSaveError(null);
      } catch (error) {
        console.error('[Sparks] Failed loading from server', error);
        // Fallback to localStorage
        const localRaw = window.localStorage.getItem(storageKey);
        if (localRaw) {
          const localStore = normalizeSparksStore(JSON.parse(localRaw));
          setStore(localStore);
        }
        setSaveError('Sync is temporarily unavailable.');
      } finally {
        setIsLoaded(true);
        readyToPersistRef.current = true;
      }
    };

    load();
  }, [storageKey, storageScope]);

  // Auto-save on change
  useEffect(() => {
    if (!readyToPersistRef.current || !isLoaded) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await persistToServer(store, storageScope);
      } catch (error) {
        console.error('[Sparks] Failed to save', error);
        // Fallback to localStorage
        window.localStorage.setItem(storageKey, JSON.stringify(store));
        setSaveError('Could not sync. Saved locally.');
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
  }, [isLoaded, store, storageKey, storageScope]);

  // Spark actions
  const addSpark = useCallback((spark: Omit<SavedSpark, 'id' | 'createdAt'>) => {
    const newSpark: SavedSpark = {
      ...spark,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setStore((prev) => ({
      ...prev,
      savedSparks: [newSpark, ...prev.savedSparks],
    }));
  }, []);

  const removeSpark = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      savedSparks: prev.savedSparks.filter((s) => s.id !== id),
    }));
  }, []);

  const savedSparkIds = useMemo(
    () => new Set(store.savedSparks.filter((s) => s.sourcePromptId).map((s) => s.sourcePromptId!)),
    [store.savedSparks]
  );

  // Museum actions
  const addMuseumItem = useCallback((item: Omit<MuseumItem, 'id' | 'createdAt'>) => {
    const newItem: MuseumItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setStore((prev) => ({
      ...prev,
      museumItems: [newItem, ...prev.museumItems],
    }));
  }, []);

  const removeMuseumItem = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      museumItems: prev.museumItems.filter((m) => m.id !== id),
    }));
  }, []);

  return {
    // Sparks
    savedSparks: store.savedSparks,
    savedSparkIds,
    addSpark,
    removeSpark,
    // Museum
    museumItems: store.museumItems,
    addMuseumItem,
    removeMuseumItem,
    // Status
    isLoaded,
    isSaving,
    saveError,
  };
}
