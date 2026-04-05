'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ThreadBadge } from './ThreadBadge';
import { getThreadSuggestions } from '@/lib/thread-suggestions';
import { THREAD_COLORS } from '@/lib/threads';
import type { Thread } from '@/lib/threads';

interface RestingThreadCardProps {
  thread: Thread;
  allThreads: Thread[];
  onClick?: () => void;
  onRevive?: () => void;
  className?: string;
}

export function RestingThreadCard({
  thread,
  allThreads,
  onClick,
  onRevive,
  className = '',
}: RestingThreadCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const suggestions = getThreadSuggestions(thread, allThreads);
  const colorHex = THREAD_COLORS[thread.color].hex;

  const lastRestedText = thread.lastRested
    ? formatDistanceToNow(new Date(thread.lastRested), { addSuffix: true })
    : 'Recently';

  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-3 opacity-60 shadow-sm transition-all hover:opacity-100 hover:shadow-md ${className}`}
      style={{
        borderColor: `${colorHex}15`,
      }}
      onClick={onClick}
      initial={prefersReducedMotion ? { opacity: 0.6 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 0.6, scale: 1 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {thread.emoji && <span className="text-lg">{thread.emoji}</span>}
          <h4 className="truncate text-sm font-semibold text-text">{thread.title}</h4>
        </div>
      </div>

      {/* Rested time */}
      <p className="mb-2 text-xs text-text-muted">
        Rested {lastRestedText}
      </p>

      {/* Activities count */}
      {thread.activities && thread.activities.length > 0 && (
        <ThreadBadge icon="📚" variant="activity" className="mb-2">
          {thread.activities.length} linked
        </ThreadBadge>
      )}

      {/* Revive suggestion */}
      {suggestions.some((s) => s.type === 'revive') && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRevive?.();
          }}
          className="w-full rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          💡 {suggestions.find((s) => s.type === 'revive')?.message}
        </button>
      )}
    </motion.div>
  );
}
