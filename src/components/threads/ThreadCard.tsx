'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ThreadProgressBar } from './ThreadProgressBar';
import { ThreadBadge } from './ThreadBadge';
import { ThreadActivityChip } from './ThreadActivityChip';
import { getThreadSuggestions } from '@/lib/thread-suggestions';
import { getStreakBadgeInfo } from '@/lib/thread-gamification';
import { THREAD_COLORS } from '@/lib/threads';
import type { Thread } from '@/lib/threads';

interface ThreadCardProps {
  thread: Thread;
  allThreads: Thread[];
  onClick?: () => void;
  onRemoveActivity?: (activityId: string) => void;
  className?: string;
}

export function ThreadCard({
  thread,
  allThreads,
  onClick,
  onRemoveActivity,
  className = '',
}: ThreadCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const suggestions = getThreadSuggestions(thread, allThreads);
  const streakBadge = getStreakBadgeInfo(thread.focusStreak);
  const colorHex = THREAD_COLORS[thread.color].hex;
  const [daysActive, setDaysActive] = useState(0);

  useEffect(() => {
    const { lastFocused } = thread;

    if (!lastFocused) {
      setDaysActive(0);
      return;
    }

    const updateDaysActive = () => {
      const elapsedDays = Math.floor(
        (Date.now() - new Date(lastFocused).getTime()) / (1000 * 60 * 60 * 24)
      );
      setDaysActive(Math.max(0, elapsedDays));
    };

    updateDaysActive();
  }, [thread.lastFocused]);

  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-surface to-bg-base p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colorHex}08 0%, ${colorHex}03 100%)`,
        borderColor: `${colorHex}20`,
      }}
      onClick={onClick}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              boxShadow: `0 8px 30px ${colorHex}15`,
            }
      }
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {thread.emoji && <span className="text-2xl">{thread.emoji}</span>}
          <h3 className="truncate text-lg font-semibold text-text">{thread.title}</h3>
        </div>
        {thread.isCore && (
          <ThreadBadge icon="⭐" variant="default">
            Core
          </ThreadBadge>
        )}
      </div>

      {/* XP Progress Bar */}
      <ThreadProgressBar xp={thread.xp} color={thread.color} className="mb-3" />

      {/* Stats row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {/* Focus streak */}
        {streakBadge && (
          <ThreadBadge icon={streakBadge.emoji} variant="streak">
            {streakBadge.label}
          </ThreadBadge>
        )}

        {/* Linked activities count */}
        {thread.activities && thread.activities.length > 0 && (
          <ThreadBadge icon="📚" variant="activity">
            {thread.activities.length} {thread.activities.length === 1 ? 'activity' : 'activities'}
          </ThreadBadge>
        )}

        {/* Days active */}
        {daysActive > 0 && (
          <ThreadBadge icon="⏱️" variant="default">
            Active {daysActive}d
          </ThreadBadge>
        )}
      </div>

      {/* Linked activities */}
      {thread.activities && thread.activities.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {thread.activities.slice(0, 3).map((ta) => (
              <ThreadActivityChip
                key={ta.id}
                threadActivity={ta}
                onRemove={onRemoveActivity}
              />
            ))}
            {thread.activities.length > 3 && (
              <span className="inline-flex items-center rounded-lg bg-bg-elevated px-2.5 py-1.5 text-xs text-text-muted">
                +{thread.activities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && suggestions[0].priority !== 'low' && (
        <div className="mt-3 border-t border-border-subtle pt-3">
          {suggestions.slice(0, 1).map((suggestion, i) => (
            <ThreadBadge key={i} priority={suggestion.priority}>
              💡 {suggestion.message}
            </ThreadBadge>
          ))}
        </div>
      )}

      {/* Core thread indicator glow */}
      {thread.isCore && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colorHex}10, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}
