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

  // Convert hex to rgba with transparency for see-through effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div
      className={`absolute left-0 right-0 flex items-stretch rounded-lg border ${barClass} z-10 overflow-hidden`}
      style={!isDone && !isSkipped ? { ...style, backgroundColor: hexToRgba(palette.soft, 0.65), borderColor: palette.border } : style}
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
          style={!isDone && !isSkipped ? { color: palette.deep } : undefined}
        >
          {item.label}
        </span>
      </div>
    </div>
  );
}
