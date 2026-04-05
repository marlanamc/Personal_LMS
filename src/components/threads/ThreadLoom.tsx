'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Plus } from 'lucide-react';
import { Thread, ThreadDragPreview } from './Thread';
import { ThreadPath, ThreadGlowDefs } from './ThreadPath';
import { RestingZoneSidebar, RestingZoneSheet, RestingZoneTrigger } from './RestingZone';
import {
  sortThreads,
  isTangledState,
  getCompressedAnchors,
  calculateWeaveCrossings,
  type Thread as ThreadType,
  type ThreadCrossing,
} from '@/lib/threads';

interface ThreadLoomProps {
  threads: ThreadType[];
  onReorder: (updates: Array<{ id: string; order?: number; status?: string; anchorX?: number }>) => void;
  onThreadClick: (thread: ThreadType) => void;
  onAddClick: () => void;
}

const THREAD_LENGTH = 280; // Base length of threads in pixels
const LOOM_HEIGHT = 400; // Height of the loom area

function ActiveZone({
  threads,
  containerWidth,
  isTangled,
  onThreadClick,
}: {
  threads: ThreadType[];
  containerWidth: number;
  isTangled: boolean;
  onThreadClick: (thread: ThreadType) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'active-zone' });
  const threadIds = threads.map((t) => t.id);

  // Calculate anchor positions
  const anchors = useMemo(
    () => getCompressedAnchors(threads, containerWidth, isTangled),
    [threads, containerWidth, isTangled]
  );

  // Calculate weave crossings
  const crossings = useMemo(
    () => calculateWeaveCrossings(threads, anchors, THREAD_LENGTH),
    [threads, anchors]
  );

  return (
    <div
      ref={setNodeRef}
      className={`active-zone relative flex-1 transition-colors duration-300 ${
        isOver ? 'bg-primary/[0.03]' : ''
      }`}
      style={{ minHeight: LOOM_HEIGHT }}
    >
      {/* SVG layer for thread paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <ThreadGlowDefs />
        {threads.map((thread) => {
          const anchorX = anchors.get(thread.id) ?? containerWidth / 2;
          // Find crossings relevant to this thread
          const threadCrossings = crossings.filter(
            (c) => c.threadAId === thread.id || c.threadBId === thread.id
          );
          return (
            <ThreadPath
              key={thread.id}
              threadId={thread.id}
              color={thread.color}
              anchorX={anchorX}
              containerWidth={containerWidth}
              length={THREAD_LENGTH}
              isTangled={isTangled}
              isCore={thread.isCore}
              crossings={threadCrossings}
            />
          );
        })}
      </svg>

      {/* Thread labels (interactive layer) */}
      <SortableContext items={threadIds} strategy={horizontalListSortingStrategy}>
        <AnimatePresence mode="popLayout">
          {threads.map((thread) => {
            const anchorX = anchors.get(thread.id) ?? containerWidth / 2;
            return (
              <Thread
                key={thread.id}
                thread={thread}
                anchorX={anchorX}
                threadLength={THREAD_LENGTH}
                onClick={() => onThreadClick(thread)}
              />
            );
          })}
        </AnimatePresence>
      </SortableContext>

      {/* Empty state */}
      {threads.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <p className="text-lg font-medium text-text-muted/60">No threads yet</p>
            <p className="mt-1 text-sm text-text-muted/40">
              Add something that&apos;s pulling at your attention
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ThreadLoom({
  threads,
  onReorder,
  onThreadClick,
  onAddClick,
}: ThreadLoomProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [activeThread, setActiveThread] = useState<ThreadType | null>(null);
  const [restingCollapsed, setRestingCollapsed] = useState(true);
  const [restingSheetOpen, setRestingSheetOpen] = useState(false);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Account for resting zone sidebar
        const sidebarWidth = restingCollapsed ? 48 : 224; // w-12 or w-56
        setContainerWidth(Math.max(400, containerRef.current.offsetWidth - sidebarWidth - 32));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [restingCollapsed]);

  // Sort threads by status
  const { active, resting } = useMemo(() => sortThreads(threads), [threads]);

  // Check tangled state
  const isTangled = isTangledState(active.length);

  // Configure sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const thread = threads.find((t) => t.id === event.active.id);
    setActiveThread(thread || null);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveThread(null);
      const { active: dragActive, over } = event;

      if (!over) return;

      const draggedId = String(dragActive.id);
      const overId = String(over.id);
      const draggedThread = threads.find((t) => t.id === draggedId);

      if (!draggedThread) return;

      // Determine target zone and position
      const isOverRestingZone = overId === 'resting-zone';
      const isOverActiveZone = overId === 'active-zone';
      const overThread = threads.find((t) => t.id === overId);

      let newStatus = draggedThread.status;
      let targetIndex = draggedThread.order;

      if (isOverRestingZone) {
        newStatus = 'resting';
        const restingThreads = threads.filter((t) => t.status === 'resting');
        targetIndex = restingThreads.length;
      } else if (isOverActiveZone) {
        newStatus = 'active';
        const activeThreads = threads.filter((t) => t.status === 'active');
        targetIndex = activeThreads.length;
      } else if (overThread) {
        newStatus = overThread.status;
        const sameStatusThreads = threads
          .filter((t) => t.status === overThread.status)
          .sort((a, b) => a.order - b.order);
        targetIndex = sameStatusThreads.findIndex((t) => t.id === overThread.id);
      }

      // Skip if nothing changed
      if (newStatus === draggedThread.status && targetIndex === draggedThread.order) {
        return;
      }

      // Calculate new orders for affected threads
      const updates: Array<{ id: string; order?: number; status?: string; anchorX?: number }> = [];
      const targetStatusThreads = threads
        .filter((t) => t.status === newStatus && t.id !== draggedId)
        .sort((a, b) => a.order - b.order);

      // Insert dragged thread at target position
      targetStatusThreads.splice(targetIndex, 0, draggedThread);

      // Update all orders in target status
      targetStatusThreads.forEach((t, i) => {
        const update: { id: string; order: number; status?: string; anchorX?: number } = {
          id: t.id,
          order: i,
        };
        if (t.id === draggedId && newStatus !== draggedThread.status) {
          update.status = newStatus;
        }
        // Calculate new anchorX for active threads
        if (newStatus === 'active') {
          const count = targetStatusThreads.length;
          const padding = 0.15;
          update.anchorX = count === 1 ? 0.5 : padding + (i / (count - 1)) * (1 - padding * 2);
        }
        updates.push(update);
      });

      // If moving from a different status, update orders in original status too
      if (newStatus !== draggedThread.status) {
        const originalStatusThreads = threads
          .filter((t) => t.status === draggedThread.status && t.id !== draggedId)
          .sort((a, b) => a.order - b.order);

        originalStatusThreads.forEach((t, i) => {
          // Check if this thread is already in updates
          const existingUpdate = updates.find((u) => u.id === t.id);
          if (existingUpdate) {
            existingUpdate.order = i;
          } else {
            updates.push({ id: t.id, order: i });
          }
        });
      }

      onReorder(updates);
    },
    [threads, onReorder]
  );

  return (
    <div ref={containerRef} className="thread-loom relative flex h-full flex-col overflow-hidden">
      {/* Tangled state warning */}
      <AnimatePresence>
        {isTangled && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            className="tangled-warning mx-4 mt-4 rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3"
          >
            <p className="text-sm text-text">
              <span className="font-medium">You&apos;re holding a lot right now.</span>{' '}
              <span className="text-text-muted">
                Consider letting some threads rest — they&apos;ll still be there.
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loom bar */}
      <div className="loom-bar relative h-6 mx-4 mt-4">
        <div
          className="absolute inset-x-0 top-0 h-1.5 rounded-full"
          style={{
            background: 'linear-gradient(90deg, var(--color-border-subtle) 0%, var(--color-primary) 50%, var(--color-border-subtle) 100%)',
            opacity: 0.4,
          }}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-4 px-4 pb-4 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Active threads zone */}
          <ActiveZone
            threads={active}
            containerWidth={containerWidth}
            isTangled={isTangled}
            onThreadClick={onThreadClick}
          />

          {/* Resting zone (desktop sidebar) */}
          <RestingZoneSidebar
            threads={resting}
            collapsed={restingCollapsed}
            onToggle={() => setRestingCollapsed(!restingCollapsed)}
            onThreadClick={onThreadClick}
          />

          {/* Resting zone (mobile sheet) */}
          <RestingZoneSheet
            threads={resting}
            isOpen={restingSheetOpen}
            onClose={() => setRestingSheetOpen(false)}
            onThreadClick={onThreadClick}
          />

          {/* Drag overlay */}
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {activeThread && <ThreadDragPreview thread={activeThread} />}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Mobile resting trigger */}
      {resting.length > 0 && (
        <RestingZoneTrigger
          count={resting.length}
          onClick={() => setRestingSheetOpen(true)}
        />
      )}

      {/* Add thread button */}
      <button
        type="button"
        onClick={onAddClick}
        className="add-thread-btn fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 lg:bottom-6"
        style={{
          boxShadow: 'var(--glow-primary), 0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        aria-label="Add new thread"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
