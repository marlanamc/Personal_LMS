'use client';

import type { CSSProperties } from 'react';
import { getAnchorColorPalette } from '@/lib/anchors';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineAnchorMarkerProps {
  item: TimelineItem;
  style?: CSSProperties;
}

export function TimelineAnchorMarker({ item, style }: TimelineAnchorMarkerProps) {
  const isDone = item.anchorStatus === 'done';
  const isSkipped = item.anchorStatus === 'skipped';
  const palette = getAnchorColorPalette(item.anchorColor, item.anchorIcon ?? 'calendar');
  const lineClass = isDone
    ? 'border-secondary'
    : isSkipped
      ? 'border-text-muted/35'
      : '';
  const dotClass = isDone
    ? 'bg-secondary'
    : isSkipped
      ? 'bg-text-muted/40'
      : '';

  return (
    <div
      className="flex items-center z-10 pointer-events-none group/anchor"
      style={style}
      title={`${item.label}`}
    >
      <div
        className={`ml-[-5px] mr-2 h-2.5 w-2.5 rounded-full border-2 border-bg-surface shadow-sm ${dotClass}`}
        style={!isDone && !isSkipped ? { backgroundColor: palette.solid } : undefined}
      />

      <div
        className={`flex-1 border-t-2 border-dashed opacity-75 ${lineClass}`}
        style={!isDone && !isSkipped ? { borderColor: palette.solid } : undefined}
      />

      <div
        className={`ml-3 flex max-w-[44%] items-center gap-1.5 rounded-full border px-2 py-[0.3125rem] shadow-sm shrink-0 sm:max-w-[18rem] ${
          isDone
            ? 'bg-[color-mix(in_srgb,var(--color-secondary)_14%,var(--color-bg-surface))] border-[color-mix(in_srgb,var(--color-secondary)_28%,transparent)] text-secondary'
            : isSkipped
              ? 'bg-bg-surface/78 border-border-subtle/45 text-text-muted'
              : ''
        }`}
        style={!isDone && !isSkipped ? { backgroundColor: palette.soft, borderColor: palette.border, color: palette.deep } : undefined}
      >
        <div
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClass}`}
          style={!isDone && !isSkipped ? { backgroundColor: palette.solid } : undefined}
        />
        <span className="truncate text-[9px] font-bold uppercase tracking-[0.16em] sm:text-[9px] sm:tracking-[0.18em]">
          {item.label}
        </span>
      </div>
    </div>
  );
}
