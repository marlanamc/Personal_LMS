'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ThreadCard } from './ThreadCard';
import { RestingThreadCard } from './RestingThreadCard';
import { SuggestionBanner } from './SuggestionBanner';
import { sortThreads } from '@/lib/threads';
import type { Thread } from '@/lib/threads';

interface ThreadUpdate {
  id: string;
  order?: number;
  status?: string;
  lastFocused?: string;
  lastRested?: string;
}

interface ThreadGridProps {
  threads: Thread[];
  onReorder: (updates: Array<ThreadUpdate>) => void;
  onThreadClick: (thread: Thread) => void;
  onAddClick: () => void;
}

// Sortable wrapper for ThreadCard
function SortableThreadCard({
  thread,
  allThreads,
  onClick,
}: {
  thread: Thread;
  allThreads: Thread[];
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: thread.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ThreadCard thread={thread} allThreads={allThreads} onClick={onClick} />
    </div>
  );
}

// Sortable wrapper for RestingThreadCard
function SortableRestingThreadCard({
  thread,
  allThreads,
  onClick,
  onRevive,
}: {
  thread: Thread;
  allThreads: Thread[];
  onClick: () => void;
  onRevive: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: thread.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <RestingThreadCard
        thread={thread}
        allThreads={allThreads}
        onClick={onClick}
        onRevive={onRevive}
      />
    </div>
  );
}

export function ThreadGrid({ threads, onReorder, onThreadClick, onAddClick }: ThreadGridProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [restingSectionExpanded, setRestingSectionExpanded] = useState(true);

  const { active, resting } = sortThreads(threads);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) {
        return;
      }

      // Find the dragged thread and target thread
      const draggedThread = threads.find((t) => t.id === active.id);
      const targetThread = threads.find((t) => t.id === over.id);

      if (!draggedThread || !targetThread) {
        return;
      }

      // Determine status change
      const newStatus = targetThread.status;
      const statusChanged = draggedThread.status !== newStatus;

      if (statusChanged) {
        // Moving between zones
        const targetStatusThreads = threads.filter((t) => t.status === newStatus);
        const targetIndex = targetStatusThreads.findIndex((t) => t.id === over.id);

        const updates: ThreadUpdate[] = [
          {
            id: draggedThread.id,
            status: newStatus,
            order: targetIndex,
            ...(newStatus === 'active' ? { lastFocused: new Date().toISOString() } : {}),
            ...(newStatus === 'resting' ? { lastRested: new Date().toISOString() } : {}),
          },
        ];

        // Reindex all threads in target status
        targetStatusThreads.forEach((t, i) => {
          if (t.id !== draggedThread.id) {
            updates.push({
              id: t.id,
              order: i >= targetIndex ? i + 1 : i,
              status: newStatus, // Include status to satisfy type
            });
          }
        });

        onReorder(updates);
      } else {
        // Reordering within same zone
        const sameStatusThreads = threads
          .filter((t) => t.status === draggedThread.status)
          .sort((a, b) => a.order - b.order);

        const draggedIndex = sameStatusThreads.findIndex((t) => t.id === active.id);
        const targetIndex = sameStatusThreads.findIndex((t) => t.id === over.id);

        if (draggedIndex === targetIndex) {
          return;
        }

        // Reorder
        const newOrder = [...sameStatusThreads];
        const [removed] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, removed);

        const updates = newOrder.map((t, i) => ({
          id: t.id,
          order: i,
        }));

        onReorder(updates);
      }
    },
    [threads, onReorder]
  );

  const handleSuggestionAction = useCallback(
    (threadId: string, actionType: string) => {
      const updates: ThreadUpdate[] = [];
      if (actionType === 'rest') {
        updates.push({
          id: threadId,
          status: 'resting',
          lastRested: new Date().toISOString(),
        });
      } else if (actionType === 'revive') {
        updates.push({
          id: threadId,
          status: 'active',
          lastFocused: new Date().toISOString(),
        });
      } else if (actionType === 'archive') {
        updates.push({ id: threadId, status: 'archived' });
      }
      onReorder(updates);
    },
    [onReorder]
  );

  const handleRevive = useCallback(
    (threadId: string) => {
      const updates: ThreadUpdate[] = [
        {
          id: threadId,
          status: 'active',
          lastFocused: new Date().toISOString(),
        },
      ];
      onReorder(updates);
    },
    [onReorder]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full overflow-y-auto p-4 sm:p-6">
        {/* Smart Suggestions */}
        {threads.length > 0 && (
          <SuggestionBanner
            threads={threads}
            onActionClick={handleSuggestionAction}
            className="mb-6"
          />
        )}

        {/* Active Threads */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">
              Active Threads ({active.length})
            </h2>
          </div>

          {active.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border-subtle bg-bg-surface p-12 text-center">
              <p className="mb-4 text-text-muted">No active threads yet</p>
              <button
                type="button"
                onClick={onAddClick}
                className="rounded-full bg-primary px-6 py-2 font-medium text-white transition-transform hover:scale-105"
              >
                Create Your First Thread
              </button>
            </div>
          ) : (
            <SortableContext items={active.map((t) => t.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((thread) => (
                  <SortableThreadCard
                    key={thread.id}
                    thread={thread}
                    allThreads={threads}
                    onClick={() => onThreadClick(thread)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>

        {/* Resting Threads */}
        {resting.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">
                Resting Threads ({resting.length})
              </h2>
              <button
                type="button"
                onClick={() => setRestingSectionExpanded(!restingSectionExpanded)}
                className="text-sm text-primary hover:underline"
              >
                {restingSectionExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>

            <AnimatePresence>
              {restingSectionExpanded && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableContext items={resting.map((t) => t.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {resting.map((thread) => (
                        <SortableRestingThreadCard
                          key={thread.id}
                          thread={thread}
                          allThreads={threads}
                          onClick={() => onThreadClick(thread)}
                          onRevive={() => handleRevive(thread.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* FAB: Add Thread Button */}
        <button
          type="button"
          onClick={onAddClick}
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Add new thread"
        >
          +
        </button>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          <div className="opacity-80">
            {threads.find((t) => t.id === activeId)?.status === 'active' ? (
              <ThreadCard
                thread={threads.find((t) => t.id === activeId)!}
                allThreads={threads}
              />
            ) : (
              <RestingThreadCard
                thread={threads.find((t) => t.id === activeId)!}
                allThreads={threads}
              />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
