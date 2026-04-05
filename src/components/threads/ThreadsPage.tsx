'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useThreads } from './hooks/useThreads';
import { ThreadGrid } from './ThreadGrid';
import { AddThreadModal } from './AddThreadModal';
import { ThreadDetailsSheet } from './ThreadDetailsSheet';
import type { Thread, ThreadInput } from '@/lib/threads';

export function ThreadsPage() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    threads,
    isLoading,
    error,
    createThread,
    updateThread,
    updateThreads,
    deleteThread,
  } = useThreads();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  // Handle creating a new thread
  const handleCreateThread = useCallback(
    async (input: ThreadInput) => {
      await createThread(input);
    },
    [createThread]
  );

  // Handle reordering threads (from drag and drop)
  const handleReorder = useCallback(
    (updates: Array<{ id: string; order?: number; status?: string; anchorX?: number }>) => {
      updateThreads(updates as Array<{ id: string } & Partial<Thread>>);
    },
    [updateThreads]
  );

  // Handle updating a thread
  const handleUpdateThread = useCallback(
    (id: string, updates: Partial<Thread>) => {
      updateThread(id, updates);
    },
    [updateThread]
  );

  // Handle deleting a thread
  const handleDeleteThread = useCallback(
    (id: string, archive?: boolean) => {
      deleteThread(id, archive);
    },
    [deleteThread]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="threads-page flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-text-muted">Loading your threads...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="threads-page flex h-full items-center justify-center p-4">
        <div className="max-w-md rounded-2xl border border-error/20 bg-error/[0.05] p-6 text-center">
          <p className="text-sm font-medium text-error">Failed to load threads</p>
          <p className="mt-1 text-xs text-text-muted">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="threads-page flex h-full flex-col overflow-hidden bg-bg-base"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="threads-header shrink-0 border-b border-border-subtle px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text sm:text-3xl">Threads</h1>
            <p className="mt-1 text-sm text-text-muted sm:text-base">
              Your focused projects and learning paths
            </p>
          </div>
        </div>
      </header>

      {/* Main content - the grid */}
      <main className="flex-1 overflow-hidden">
        <ThreadGrid
          threads={threads}
          onReorder={handleReorder}
          onThreadClick={setSelectedThread}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Add thread modal */}
      <AddThreadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateThread}
      />

      {/* Thread details sheet */}
      <ThreadDetailsSheet
        thread={selectedThread}
        onClose={() => setSelectedThread(null)}
        onUpdate={handleUpdateThread}
        onDelete={handleDeleteThread}
      />
    </motion.div>
  );
}
