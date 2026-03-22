'use client';

import type { CSSProperties } from 'react';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineQuadrantBandProps {
  item: TimelineItem;
  style?: CSSProperties;
}

/** Strong enough to read as a colored “slice” of the day; aligned with sections board / quadrants tool */
const BAND_MAP: Record<
  NonNullable<TimelineItem['quadrantColorToken']>,
  {
    shell: string;
    bar: string;
    label: string;
    chip: string;
  }
> = {
  dawn: {
    shell:
      'bg-gradient-to-b from-accent-sakura/26 via-accent-sakura/12 to-accent-sakura/[0.07] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent-sakura)_36%,transparent)]',
    bar: 'bg-accent-sakura',
    label: 'text-accent-sakura/92',
    chip: 'bg-accent-sakura/18 text-accent-sakura border border-accent-sakura/28',
  },
  mint: {
    shell:
      'bg-gradient-to-b from-accent-mint/26 via-accent-mint/12 to-accent-mint/[0.07] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent-mint)_38%,transparent)]',
    bar: 'bg-accent-mint',
    label: 'text-accent-mint/92',
    chip: 'bg-accent-mint/18 text-accent-mint border border-accent-mint/30',
  },
  sky: {
    shell:
      'bg-gradient-to-b from-accent-teal/24 via-accent-teal/11 to-accent-teal/[0.065] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent-teal)_34%,transparent)]',
    bar: 'bg-accent-teal',
    label: 'text-accent-teal/92',
    chip: 'bg-accent-teal/17 text-accent-teal border border-accent-teal/26',
  },
  sand: {
    shell:
      'bg-gradient-to-b from-[rgba(217,171,102,0.28)] via-[rgba(217,171,102,0.12)] to-[rgba(217,171,102,0.06)] shadow-[inset_0_0_0_1px_rgba(196,145,70,0.38)]',
    bar: 'bg-[rgba(196,145,70,0.95)]',
    label: 'text-[rgba(95,62,22,0.92)]',
    chip:
      'bg-[rgba(217,171,102,0.22)] text-[rgba(95,62,22,0.95)] border border-[rgba(196,145,70,0.4)]',
  },
  rose: {
    shell:
      'bg-gradient-to-b from-[rgba(195,116,140,0.26)] via-[rgba(195,116,140,0.11)] to-[rgba(195,116,140,0.055)] shadow-[inset_0_0_0_1px_rgba(175,90,118,0.38)]',
    bar: 'bg-[rgba(175,90,118,0.95)]',
    label: 'text-[rgba(105,48,68,0.92)]',
    chip:
      'bg-[rgba(195,116,140,0.2)] text-[rgba(105,48,68,0.95)] border border-[rgba(175,90,118,0.4)]',
  },
};

export function TimelineQuadrantBand({ item, style }: TimelineQuadrantBandProps) {
  const colors = BAND_MAP[item.quadrantColorToken ?? 'sky'];
  const focusItems = item.quadrantFocusItems ?? [];

  return (
    <div
      style={style}
      className={`pointer-events-none relative z-0 overflow-hidden rounded-xl px-3 py-2 sm:px-3.5 ${colors.shell}`}
    >
      <div
        className={`absolute left-0 top-2 bottom-2 w-1 rounded-full opacity-[0.72] ${colors.bar}`}
        aria-hidden
      />

      <div className="relative flex items-center gap-2 pl-1">
        <p className={`text-[10px] font-semibold tracking-tight sm:text-[11px] ${colors.label}`}>
          {item.label}
        </p>
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
