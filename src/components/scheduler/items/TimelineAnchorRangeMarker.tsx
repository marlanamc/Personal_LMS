'use client';

import type { CSSProperties } from 'react';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineAnchorRangeMarkerProps {
  item: TimelineItem;
  style?: CSSProperties;
}

export function TimelineAnchorRangeMarker({ item, style }: TimelineAnchorRangeMarkerProps) {
  const isDone = item.anchorStatus === 'done';
  const isSkipped = item.anchorStatus === 'skipped';
  const barClass = isDone
    ? 'bg-secondary/20 border-secondary/40'
    : isSkipped
      ? 'bg-text-muted/10 border-text-muted/25'
      : 'bg-fuchsia-100/60 dark:bg-accent-amethyst/15 border-fuchsia-200/50 dark:border-accent-amethyst/30';
  const orbClass = isDone
    ? 'bg-secondary border-secondary shadow-sm'
    : isSkipped
      ? 'bg-text-muted/50 border-text-muted/40'
      : 'bg-fuchsia-400 dark:bg-accent-amethyst border-fuchsia-300 dark:border-accent-amethyst/60 shadow-sm';

  return (
    <div
      className={`absolute left-0 right-0 flex items-stretch rounded-lg border ${barClass} z-10 overflow-visible`}
      style={style}
      title={item.label}
    >
      {/* Start orb */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-bg-surface ${orbClass}`}
        aria-hidden
      />
      {/* End orb */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full border-2 border-bg-surface ${orbClass}`}
        aria-hidden
      />
      {/* Label */}
      <div className="flex-1 flex items-center justify-center min-w-0 px-4 py-1">
        <span
          className={`truncate text-[10px] font-bold uppercase tracking-wider ${
            isDone
              ? 'text-secondary'
              : isSkipped
                ? 'text-text-muted'
                : 'text-fuchsia-700 dark:text-accent-amethyst'
          }`}
        >
          {item.label}
        </span>
      </div>
    </div>
  );
}
