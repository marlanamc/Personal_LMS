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
  const lineClass = isDone
    ? 'border-secondary'
    : isSkipped
      ? 'border-text-muted/35'
      : 'border-fuchsia-300/85 dark:border-accent-amethyst/75';
  const dotClass = isDone
    ? 'bg-secondary'
    : isSkipped
      ? 'bg-text-muted/40'
      : 'bg-fuchsia-300 dark:bg-accent-amethyst/80';

  return (
    <div
      className="flex items-center z-10 pointer-events-none group/anchor"
      style={style}
      title={`${item.label}`}
    >
      <div className={`ml-[-5px] mr-2 h-2.5 w-2.5 rounded-full border-2 border-bg-surface shadow-sm ${dotClass}`} />

      <div
        className={`flex-1 border-t-2 border-dashed opacity-75 ${lineClass}`}
      />

      <div
        className={`ml-3 flex max-w-[44%] items-center gap-1.5 rounded-full border px-2 py-[0.3125rem] shadow-sm shrink-0 sm:max-w-[18rem] ${
          isDone
            ? 'bg-[color-mix(in_srgb,var(--color-secondary)_14%,var(--color-bg-surface))] border-[color-mix(in_srgb,var(--color-secondary)_28%,transparent)] text-secondary'
            : isSkipped
              ? 'bg-bg-surface/78 border-border-subtle/45 text-text-muted'
              : 'bg-fuchsia-50/70 dark:bg-[color-mix(in_srgb,var(--color-accent-amethyst)_14%,var(--color-bg-surface))] border-fuchsia-200/80 dark:border-[color-mix(in_srgb,var(--color-accent-amethyst)_28%,transparent)] text-fuchsia-600/90 dark:text-accent-amethyst'
        }`}
      >
        <div
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClass}`}
        />
        <span className="truncate text-[9px] font-bold uppercase tracking-[0.16em] sm:text-[9px] sm:tracking-[0.18em]">
          {item.label}
        </span>
      </div>
    </div>
  );
}
