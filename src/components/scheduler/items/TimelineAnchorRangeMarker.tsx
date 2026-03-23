'use client';

import type { CSSProperties } from 'react';
import { getAnchorColorPalette } from '@/lib/anchors';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineAnchorRangeMarkerProps {
  item: TimelineItem;
  style?: CSSProperties;
}

export function TimelineAnchorRangeMarker({ item, style }: TimelineAnchorRangeMarkerProps) {
  const isDone = item.anchorStatus === 'done';
  const isSkipped = item.anchorStatus === 'skipped';
  const palette = getAnchorColorPalette(item.anchorColor, item.anchorIcon ?? 'calendar');
  const barClass = isDone
    ? 'bg-secondary/20 border-secondary/40'
    : isSkipped
      ? 'bg-text-muted/10 border-text-muted/25'
      : '';
  const activeStyle = !isDone && !isSkipped
    ? {
        ...style,
        background: `linear-gradient(180deg, color-mix(in srgb, var(--color-bg-elevated) 84%, ${palette.solid} 16%) 0%, color-mix(in srgb, var(--color-bg-surface) 74%, ${palette.solid} 26%) 100%)`,
        borderColor: `color-mix(in srgb, var(--color-border-subtle) 45%, ${palette.solid} 55%)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${palette.solid} 16%, transparent)`,
      }
    : style;
  const activeLabelStyle = !isDone && !isSkipped
    ? {
        color: `color-mix(in srgb, var(--color-text-primary) 74%, ${palette.solid} 26%)`,
      }
    : undefined;

  return (
    <div
      className={`absolute left-0 right-0 flex items-stretch rounded-lg border ${barClass} z-10 overflow-hidden`}
      style={activeStyle}
      title={item.label}
    >
      {/* Label */}
      <div className="flex-1 flex items-center justify-center min-w-0 px-4 py-1">
        <span
          className={`truncate text-[10px] font-bold uppercase tracking-wider ${
            isDone
              ? 'text-secondary'
              : isSkipped
                ? 'text-text-muted'
                : ''
          }`}
          style={activeLabelStyle}
        >
          {item.label}
        </span>
      </div>
    </div>
  );
}
