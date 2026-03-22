'use client';

import type { CSSProperties } from 'react';
import { getAnchorColorPalette } from '@/lib/anchors';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineAnchorMarkerProps {
  item: TimelineItem;
  style?: CSSProperties;
  /** When true, label uses remaining timeline width (no max-width cap / ellipsis). */
  isMobile?: boolean;
}

function stemGradient(solid: string): string {
  return `linear-gradient(90deg, ${solid} 0%, color-mix(in srgb, ${solid} 45%, transparent) 55%, transparent 100%)`;
}

export function TimelineAnchorMarker({ item, style, isMobile = false }: TimelineAnchorMarkerProps) {
  const isDone = item.anchorStatus === 'done';
  const isSkipped = item.anchorStatus === 'skipped';
  const palette = getAnchorColorPalette(item.anchorColor, item.anchorIcon ?? 'calendar');
  const dotClass = isDone
    ? 'bg-secondary'
    : isSkipped
      ? 'bg-text-muted/40'
      : '';

  const stemStyle: CSSProperties | undefined = isDone
    ? { background: 'linear-gradient(90deg, var(--color-secondary) 0%, color-mix(in srgb, var(--color-secondary) 40%, transparent) 60%, transparent 100%)' }
    : isSkipped
      ? {
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--color-text-muted) 55%, transparent) 0%, transparent 100%)',
        }
      : { background: stemGradient(palette.solid) };

  return (
    <div
      className="flex w-full items-center px-1 sm:px-1.5 z-10 pointer-events-none group/anchor"
      style={style}
      title={`${item.label}`}
    >
      <div className="flex w-full min-w-0 items-center gap-1.5 sm:gap-2">
        <div
          className={`ml-[-3px] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-bg-surface shadow-sm ${dotClass}`}
          style={!isDone && !isSkipped ? { backgroundColor: palette.solid } : undefined}
        />
        {/* Short “stem” — not a full-width rule, so it won’t read as another time grid line */}
        <div
          className="h-1.5 w-9 shrink-0 rounded-full opacity-90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:w-11"
          style={stemStyle}
          aria-hidden
        />
        <div
          className={`flex min-w-0 items-center gap-1.5 rounded-full border px-2 py-[0.3125rem] shadow-sm ${
            isMobile ? 'flex-1' : 'max-w-[min(18rem,calc(100%-3.5rem))]'
          } ${
            isDone
              ? 'bg-[color-mix(in_srgb,var(--color-secondary)_14%,var(--color-bg-surface))] border-[color-mix(in_srgb,var(--color-secondary)_28%,transparent)] text-secondary'
              : isSkipped
                ? 'bg-bg-surface/78 border-border-subtle/45 text-text-muted'
                : ''
          }`}
          style={!isDone && !isSkipped ? { backgroundColor: palette.soft, borderColor: palette.border, color: palette.deep } : undefined}
        >
          <div
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
            style={!isDone && !isSkipped ? { backgroundColor: palette.solid } : undefined}
          />
          <span
            className={
              isMobile
                ? 'min-w-0 flex-1 text-left text-[9px] font-bold uppercase leading-snug tracking-[0.12em] [overflow-wrap:anywhere] whitespace-normal'
                : 'truncate text-[9px] font-bold uppercase tracking-[0.16em] sm:text-[9px] sm:tracking-[0.18em]'
            }
          >
            {item.label}
          </span>
        </div>
      </div>
    </div>
  );
}
