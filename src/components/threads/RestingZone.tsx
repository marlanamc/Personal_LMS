'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ChevronDown, ChevronRight, X, Moon } from 'lucide-react';
import { RestingThread } from './Thread';
import type { Thread } from '@/lib/threads';

interface RestingZoneProps {
  threads: Thread[];
  collapsed: boolean;
  onToggle: () => void;
  onThreadClick: (thread: Thread) => void;
}

// Desktop sidebar version
export function RestingZoneSidebar({
  threads,
  collapsed,
  onToggle,
  onThreadClick,
}: RestingZoneProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { setNodeRef, isOver } = useDroppable({ id: 'resting-zone' });
  const threadIds = threads.map((t) => t.id);

  if (collapsed) {
    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
        transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2, ease: 'easeOut' }}
        className="hidden lg:flex w-12 shrink-0 flex-col items-center rounded-2xl border border-border-subtle/30 bg-bg-surface/20 p-2"
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-col items-center gap-3 py-4 text-text-muted transition-opacity hover:opacity-70"
          aria-label="Show resting threads"
        >
          <Moon className="h-4 w-4 opacity-50" />
          <span className="text-xs font-semibold tabular-nums">{threads.length}</span>
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted/70"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Resting
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2, ease: 'easeOut' }}
      className={`hidden lg:flex w-56 shrink-0 flex-col rounded-2xl border bg-bg-surface/30 p-3 transition-colors ${
        isOver ? 'border-primary/40 bg-bg-surface/50' : 'border-border-subtle/30'
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-text-muted/60" />
          <span className="text-sm font-semibold text-text">Resting</span>
          <span className="rounded-full bg-bg-elevated/80 px-2 py-0.5 text-[10px] font-semibold text-text-muted">
            {threads.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-border-subtle/50 p-1.5 text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
          aria-label="Collapse resting zone"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Explanation text */}
      <p className="mb-3 text-[11px] leading-relaxed text-text-muted/70">
        Threads at rest. Still important, just not right now.
      </p>

      {/* Thread list */}
      <div className="flex-1 overflow-auto">
        <SortableContext items={threadIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {threads.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-border-subtle/40 px-3 py-6 text-center"
                >
                  <p className="text-xs text-text-muted/60">
                    Drag threads here to let them rest
                  </p>
                </motion.div>
              ) : (
                threads.map((thread) => (
                  <RestingThread
                    key={thread.id}
                    thread={thread}
                    onClick={() => onThreadClick(thread)}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </SortableContext>
      </div>
    </motion.div>
  );
}

// Mobile bottom sheet version
export function RestingZoneSheet({
  threads,
  isOpen,
  onClose,
  onThreadClick,
}: {
  threads: Thread[];
  isOpen: boolean;
  onClose: () => void;
  onThreadClick: (thread: Thread) => void;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { setNodeRef, isOver } = useDroppable({ id: 'resting-zone' });
  const threadIds = threads.map((t) => t.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={setNodeRef}
            initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
            transition={
              prefersReducedMotion
                ? { duration: 0.01 }
                : { type: 'spring', damping: 25, stiffness: 300 }
            }
            className={`fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-hidden rounded-t-[1.5rem] border-t bg-bg-surface shadow-2xl lg:hidden ${
              isOver ? 'border-primary/40' : 'border-border-subtle'
            }`}
          >
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className="h-1 w-10 rounded-full bg-border-subtle" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 pb-3">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-text-muted/60" />
                <span className="text-base font-bold text-text">Resting</span>
                <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-xs font-semibold text-text-muted">
                  {threads.length}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border-subtle/70 p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                aria-label="Close resting zone"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-auto px-4 pb-8" style={{ maxHeight: 'calc(70vh - 80px)' }}>
              <SortableContext items={threadIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {threads.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border-subtle/40 px-3 py-8 text-center">
                        <p className="text-sm text-text-muted/60">
                          Drag threads here to let them rest
                        </p>
                      </div>
                    ) : (
                      threads.map((thread) => (
                        <RestingThread
                          key={thread.id}
                          thread={thread}
                          onClick={() => onThreadClick(thread)}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile trigger button
export function RestingZoneTrigger({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="resting-zone-trigger fixed bottom-20 left-4 z-30 flex items-center gap-2 rounded-full border border-border-subtle/60 bg-bg-surface/90 px-4 py-2.5 text-sm font-medium text-text-muted shadow-lg backdrop-blur-sm transition-all hover:bg-bg-elevated hover:text-text lg:hidden"
    >
      <Moon className="h-4 w-4" />
      <span>Resting</span>
      <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-xs font-semibold">
        {count}
      </span>
      <ChevronDown className="h-4 w-4 rotate-180" />
    </button>
  );
}
