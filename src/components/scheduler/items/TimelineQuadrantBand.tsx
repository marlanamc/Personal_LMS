'use client';

import type { CSSProperties } from 'react';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineQuadrantBandProps {
  item: TimelineItem;
  style?: CSSProperties;
}

const COLOR_MAP: Record<
  NonNullable<TimelineItem['quadrantColorToken']>,
  { bg: string; border: string; chip: string }
> = {
  dawn: {
    bg: 'color-mix(in srgb, var(--color-accent-sakura) 10%, transparent)',
    border: 'color-mix(in srgb, var(--color-accent-sakura) 26%, var(--color-border-subtle))',
    chip: 'bg-accent-sakura/12 text-accent-sakura',
  },
  mint: {
    bg: 'color-mix(in srgb, var(--color-accent-mint) 12%, transparent)',
    border: 'color-mix(in srgb, var(--color-accent-mint) 26%, var(--color-border-subtle))',
    chip: 'bg-accent-mint/15 text-accent-mint',
  },
  sky: {
    bg: 'color-mix(in srgb, var(--color-accent-teal) 10%, transparent)',
    border: 'color-mix(in srgb, var(--color-accent-teal) 25%, var(--color-border-subtle))',
    chip: 'bg-accent-teal/12 text-accent-teal',
  },
  sand: {
    bg: 'rgba(217, 171, 102, 0.08)',
    border: 'rgba(217, 171, 102, 0.24)',
    chip: 'bg-[rgba(217,171,102,0.12)] text-[rgb(176,128,56)]',
  },
  rose: {
    bg: 'rgba(195, 116, 140, 0.08)',
    border: 'rgba(195, 116, 140, 0.25)',
    chip: 'bg-[rgba(195,116,140,0.12)] text-[rgb(182,99,125)]',
  },
};

export function TimelineQuadrantBand({ item, style }: TimelineQuadrantBandProps) {
  const colors = COLOR_MAP[item.quadrantColorToken ?? 'sky'];
  const focusItems = item.quadrantFocusItems ?? [];

  return (
    <div
      style={{
        ...style,
        background: colors.bg,
        borderColor: colors.border,
      }}
      className="pointer-events-none z-0 overflow-hidden rounded-[1.4rem] border border-dashed px-3 py-2.5 sm:px-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/75">Section</p>
          <p className="mt-1 text-sm font-bold text-text">{item.label}</p>
        </div>
      </div>
      {focusItems.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {focusItems.slice(0, 5).map((focus) => (
            <span
              key={focus}
              className={`inline-flex max-w-full truncate rounded-full px-2 py-1 text-[10px] font-semibold ${colors.chip}`}
            >
              {focus}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
