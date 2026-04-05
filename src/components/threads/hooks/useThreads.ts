'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import type { Thread, ThreadInput, ThreadStatus } from '@/lib/threads';

interface UseThreadsReturn {
  threads: Thread[];
  isLoading: boolean;
  error: string | null;
  // Actions
  createThread: (input: ThreadInput) => Promise<Thread | null>;
  updateThread: (id: string, updates: Partial<Thread>) => Promise<void>;
  updateThreads: (updates: Array<{ id: string } & Partial<Thread>>) => Promise<void>;
  deleteThread: (id: string, archive?: boolean) => Promise<void>;
  // Optimistic updates
  setThreadsOptimistic: (threads: Thread[]) => void;
  revalidate: () => Promise<void>;
}

export function useThreads(): UseThreadsReturn {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track pending saves to prevent race conditions
  const pendingSaveRef = useRef<AbortController | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch threads on mount
  const fetchThreads = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/threads');
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch threads:', res.status, errorText);
        throw new Error(`Failed to fetch threads (${res.status}): ${errorText.slice(0, 100)}`);
      }
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError(err instanceof Error ? err.message : 'Failed to load threads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Create a new thread
  const createThread = useCallback(async (input: ThreadInput): Promise<Thread | null> => {
    try {
      setError(null);
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create thread');
      }

      const data = await res.json();
      const newThread = data.thread as Thread;

      // Add to local state
      setThreads((prev) => [...prev, newThread]);

      return newThread;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thread');
      return null;
    }
  }, []);

  // Update a single thread
  const updateThread = useCallback(async (id: string, updates: Partial<Thread>) => {
    // Optimistic update
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );

    // Debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Cancel any pending save
        if (pendingSaveRef.current) {
          pendingSaveRef.current.abort();
        }

        const controller = new AbortController();
        pendingSaveRef.current = controller;

        const res = await fetch('/api/threads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error('Failed to update thread');
        }

        pendingSaveRef.current = null;
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
          // Revert on error
          fetchThreads();
        }
      }
    }, 300);
  }, [fetchThreads]);

  // Update multiple threads at once (for reordering)
  const updateThreads = useCallback(
    async (updates: Array<{ id: string } & Partial<Thread>>) => {
      // Optimistic update
      setThreads((prev) => {
        const updateMap = new Map(updates.map((u) => [u.id, u]));
        return prev.map((t) => {
          const update = updateMap.get(t.id);
          return update ? { ...t, ...update, updatedAt: new Date().toISOString() } : t;
        });
      });

      // Debounced save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          if (pendingSaveRef.current) {
            pendingSaveRef.current.abort();
          }

          const controller = new AbortController();
          pendingSaveRef.current = controller;

          const res = await fetch('/api/threads', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ threads: updates }),
            signal: controller.signal,
          });

          if (!res.ok) {
            throw new Error('Failed to update threads');
          }

          pendingSaveRef.current = null;
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            setError(err.message);
            fetchThreads();
          }
        }
      }, 300);
    },
    [fetchThreads]
  );

  // Delete or archive a thread
  const deleteThread = useCallback(
    async (id: string, archive = false) => {
      // Optimistic update
      if (archive) {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, status: 'archived' as ThreadStatus, updatedAt: new Date().toISOString() } : t
          )
        );
      } else {
        setThreads((prev) => prev.filter((t) => t.id !== id));
      }

      try {
        const res = await fetch(`/api/threads?id=${id}${archive ? '&archive=true' : ''}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete thread');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete thread');
        fetchThreads();
      }
    },
    [fetchThreads]
  );

  // Set threads optimistically (for drag operations)
  const setThreadsOptimistic = useCallback((newThreads: Thread[]) => {
    setThreads(newThreads);
  }, []);

  // Manual revalidate
  const revalidate = useCallback(async () => {
    await fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    isLoading,
    error,
    createThread,
    updateThread,
    updateThreads,
    deleteThread,
    setThreadsOptimistic,
    revalidate,
  };
}
