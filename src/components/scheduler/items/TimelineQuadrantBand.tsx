'use client';

import type { CSSProperties } from 'react';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineQuadrantBandProps {
  item: TimelineItem;
  style?: CSSProperties;
}

// Very subtle tints that blend with the timeline surface
const COLOR_MAP: Record<
  NonNullable<TimelineItem['quadrantColorToken']>,
  { bg: string; accent: string; chip: string }
> = {
  dawn: {
    bg: 'color-mix(in srgb, var(--color-accent-sakura) 4%, transparent)',
    accent: 'var(--color-accent-sakura)',
    chip: 'bg-accent-sakura/8 text-accent-sakura/80',
  },
  mint: {
    bg: 'color-mix(in srgb, var(--color-accent-mint) 5%, transparent)',
    accent: 'var(--color-accent-mint)',
    chip: 'bg-accent-mint/10 text-accent-mint/80',
  },
  sky: {
    bg: 'color-mix(in srgb, var(--color-accent-teal) 4%, transparent)',
    accent: 'var(--color-accent-teal)',
    chip: 'bg-accent-teal/8 text-accent-teal/80',
  },
  sand: {
    bg: 'rgba(217, 171, 102, 0.03)',
    accent: 'rgb(217, 171, 102)',
    chip: 'bg-[rgba(217,171,102,0.08)] text-[rgba(176,128,56,0.8)]',
  },
  rose: {
    bg: 'rgba(195, 116, 140, 0.03)',
    accent: 'rgb(195, 116, 140)',
    chip: 'bg-[rgba(195,116,140,0.08)] text-[rgba(182,99,125,0.8)]',
  },
};

export function TimelineQuadrantBand({ item, style }: TimelineQuadrantBandProps) {
  const colors = COLOR_MAP[item.quadrantColorToken ?? 'sky'];
  const focusItems = item.quadrantFocusItems ?? [];

  return (
    <div
      style={{
        ...style,
        background: `linear-gradient(180deg, ${colors.bg} 0%, transparent 100%)`,
      }}
      className="pointer-events-none z-0 overflow-hidden rounded-xl px-3 py-2 sm:px-3.5"
    >
      {/* Subtle left edge accent - replaces border */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-30"
        style={{ background: colors.accent }}
      />

      <div className="flex items-center gap-2">
        <p className="text-[10px] font-medium text-text-muted/50">{item.label}</p>
        {focusItems.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {focusItems.slice(0, 3).map((focus) => (
              <span
                key={focus}
                className={`inline-flex max-w-[8rem] truncate rounded-md px-1.5 py-0.5 text-[9px] font-medium ${colors.chip}`}
              >
                {focus}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
