'use client';

import Link from 'next/link';
import type { ThreadActivityWithDetails } from '@/lib/threads';

interface ThreadActivityChipProps {
  threadActivity: ThreadActivityWithDetails;
  onRemove?: (activityId: string) => void;
  className?: string;
}

// Simple activity type icon mapping
const activityIcons: Record<string, string> = {
  quiz: '📝',
  'interactive-guide': '📖',
  'verb-quiz': '🔤',
  'numbers-game': '🔢',
  flashcards: '🎴',
  matching: '🎯',
  'fill-in-blank': '✍️',
  'word-scramble': '🔀',
  worksheet: '📄',
  default: '📚',
};

export function ThreadActivityChip({
  threadActivity,
  onRemove,
  className = '',
}: ThreadActivityChipProps) {
  const { activity } = threadActivity;
  const icon = activityIcons[activity.type] || activityIcons.default;

  return (
    <Link
      href={`/dashboard/activities/${activity.id}`}
      className={`group inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-surface px-2.5 py-1.5 text-xs font-medium text-text transition-all hover:scale-105 hover:border-primary/30 hover:bg-bg-elevated hover:shadow-sm ${className}`}
    >
      <span className="text-sm">{icon}</span>
      <span className="max-w-[120px] truncate">{activity.title}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(activity.id);
          }}
          className="ml-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Remove activity"
        >
          <span className="text-text-muted hover:text-error">×</span>
        </button>
      )}
    </Link>
  );
}
