'use client';

import type { CSSProperties } from 'react';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineAnchorMarkerProps {
  item: TimelineItem;
  style?: CSSProperties;
}

export function TimelineAnchorMarker({ item, style }: TimelineAnchorMarkerProps) {
  const isDone = item.anchorStatus === 'done';
  const isSkipped = item.anchorStatus === 'skipped';

  return (
    <div
      className="flex items-center z-10 pointer-events-none group/anchor"
      style={style}
      title={`${item.label}`}
    >
      {/* Dashed line spanning timeline */}
      <div
        className={`flex-1 border-t-2 border-dashed opacity-70 ${
          isDone
            ? 'border-secondary'
            : isSkipped
              ? 'border-text-muted/40'
              : 'border-fuchsia-400 dark:border-accent-amethyst'
        }`}
      />

      {/* Anchor badge with label */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 shadow-sm border ${
          isDone
            ? 'bg-[color-mix(in_srgb,var(--color-secondary)_18%,var(--color-bg-surface))] border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] text-secondary'
            : isSkipped
              ? 'bg-bg-surface/80 border-border-subtle/50 text-text-muted'
              : 'bg-fuchsia-50/90 dark:bg-[color-mix(in_srgb,var(--color-accent-amethyst)_18%,var(--color-bg-surface))] border-fuchsia-200 dark:border-[color-mix(in_srgb,var(--color-accent-amethyst)_35%,transparent)] text-fuchsia-600 dark:text-accent-amethyst'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${
            isDone
              ? 'bg-secondary'
              : isSkipped
                ? 'bg-text-muted/40'
                : 'bg-fuchsia-400 dark:bg-accent-amethyst'
          }`}
        />
        <span className="text-[10px] sm:text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
          {item.label}
        </span>
      </div>
    </div>
  );
}
