'use client';

import { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { THREAD_COLORS, type Thread as ThreadType } from '@/lib/threads';

interface ThreadProps {
  thread: ThreadType;
  anchorX: number; // Pixel position
  threadLength: number;
  onClick?: () => void;
}

export const Thread = forwardRef<HTMLDivElement, ThreadProps>(function Thread(
  { thread, anchorX, threadLength, onClick },
  ref
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const colorConfig = THREAD_COLORS[thread.color];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: thread.id,
    data: {
      type: 'thread',
      thread,
    },
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: prefersReducedMotion ? 'none' : transition,
      zIndex: isDragging ? 100 : 1,
    }),
    [transform, transition, isDragging, prefersReducedMotion]
  );

  // Position the label at the bottom of the thread
  const labelStyle = useMemo(
    () => ({
      left: `${anchorX}px`,
      top: `${threadLength - 8}px`,
      transform: 'translateX(-50%)',
    }),
    [anchorX, threadLength]
  );

  return (
    <motion.div
      ref={(node) => {
        setNodeRef(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className="thread-item absolute"
      style={style}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.9 }}
      transition={prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 300, damping: 25 }}
      {...attributes}
      {...listeners}
    >
      {/* Thread label (pill at bottom of thread) */}
      <motion.button
        type="button"
        className={`thread-label absolute flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-all cursor-grab active:cursor-grabbing ${
          isDragging
            ? 'border-primary/40 bg-bg-elevated/95 ring-2 ring-primary/30 shadow-lg scale-105'
            : 'border-border-subtle/60 bg-bg-surface/85 hover:bg-bg-elevated hover:border-border-subtle'
        }`}
        style={{
          ...labelStyle,
          boxShadow: isDragging ? colorConfig.glow : 'none',
        }}
        onClick={(e) => {
          if (!isDragging && onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      >
        {thread.emoji && <span className="text-base">{thread.emoji}</span>}
        <span
          className="max-w-[120px] truncate text-text"
          style={{ color: isDragging ? colorConfig.stroke : undefined }}
        >
          {thread.title}
        </span>
      </motion.button>
    </motion.div>
  );
});

// Drag overlay preview
export function ThreadDragPreview({ thread }: { thread: ThreadType }) {
  const colorConfig = THREAD_COLORS[thread.color];

  return (
    <div
      className="thread-drag-preview flex items-center gap-1.5 rounded-full border border-primary/40 bg-bg-elevated/95 px-3 py-1.5 text-sm font-medium backdrop-blur-lg ring-2 ring-primary/30 shadow-2xl"
      style={{
        boxShadow: `${colorConfig.glow}, 0 8px 32px rgba(0, 0, 0, 0.4)`,
      }}
    >
      {thread.emoji && <span className="text-base">{thread.emoji}</span>}
      <span className="max-w-[140px] truncate" style={{ color: colorConfig.stroke }}>
        {thread.title}
      </span>
    </div>
  );
}

// Coiled/resting thread display
export function RestingThread({
  thread,
  onClick,
}: {
  thread: ThreadType;
  onClick?: () => void;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const colorConfig = THREAD_COLORS[thread.color];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: thread.id,
    data: {
      type: 'thread',
      thread,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: prefersReducedMotion ? 'none' : transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={`resting-thread group relative flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'border-primary/40 bg-bg-elevated ring-2 ring-primary/20 shadow-lg'
          : 'border-border-subtle/40 bg-bg-surface/50 hover:bg-bg-surface hover:border-border-subtle/70'
      }`}
      style={style}
      initial={prefersReducedMotion ? { opacity: 0.6 } : { opacity: 0, x: 20 }}
      animate={prefersReducedMotion ? { opacity: 0.6 } : { opacity: 0.6, x: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      whileHover={{ opacity: 1 }}
      {...attributes}
      {...listeners}
    >
      {/* Coil indicator */}
      <div
        className="coil-indicator h-6 w-6 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${colorConfig.stroke}40, ${colorConfig.stroke}20)`,
          boxShadow: isDragging ? colorConfig.glow : 'none',
        }}
      >
        {thread.emoji ? (
          <span className="text-xs">{thread.emoji}</span>
        ) : (
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="2"
          >
            <path d="M12 2 Q 20 8, 12 12 Q 4 16, 12 22" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Title */}
      <button
        type="button"
        className="flex-1 text-left text-sm text-text-muted group-hover:text-text truncate transition-colors"
        onClick={(e) => {
          if (!isDragging && onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        {thread.title}
      </button>
    </motion.div>
  );
}
