'use client';

import { ArrowLeft, ArrowRight, SunMedium } from 'lucide-react';
import { getTodayKey } from '@/lib/unified-scheduler';

export type DayPlannerHeaderDateNavVariant = 'compact' | 'desktopRail';

export interface DayPlannerHeaderDateNavProps {
  selectedDateKey: string;
  isSelectedToday: boolean;
  /** Short string for the sticky header; use a long weekday/month string for `desktopRail`. */
  dateLabel: string;
  variant?: DayPlannerHeaderDateNavVariant;
  /**
   * Lighter, flatter treatment for use inside page content (not stacked under the shell toolbar).
   */
  embedded?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPickDate: (dateKey: string) => void;
}

/**
 * Prev / date / next cluster for the day planner (compact header or desktop rail).
 */
export function DayPlannerHeaderDateNav({
  selectedDateKey,
  isSelectedToday,
  dateLabel,
  variant = 'compact',
  embedded = false,
  onPrev,
  onNext,
  onPickDate,
}: DayPlannerHeaderDateNavProps) {
  const isRail = variant === 'desktopRail';

  const pillClass = embedded
    ? 'pointer-events-none flex min-w-0 flex-row flex-wrap items-center justify-center gap-1.5 rounded-xl border border-border-subtle/35 bg-bg-surface/50 px-3 py-1.5'
    : 'pointer-events-none flex min-w-0 flex-row items-center justify-center gap-2 rounded-2xl border border-border-subtle/50 bg-bg-elevated/45 px-4 py-2.5 shadow-sm backdrop-blur-sm sm:py-3';

  const sunClass = embedded
    ? 'inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-sakura/14 text-accent-sakura ring-1 ring-accent-sakura/20'
    : 'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-sakura/18 text-accent-sakura ring-1 ring-accent-sakura/25 sm:size-8';

  const labelTextClass = embedded
    ? 'text-balance text-center font-display text-sm font-semibold leading-snug tracking-tight text-text'
    : 'whitespace-nowrap text-center font-display text-base font-bold leading-snug tracking-tight text-text sm:text-lg md:text-xl';

  return (
    <div
      className={
        isRail
          ? 'flex w-full min-w-0 max-w-3xl items-center justify-center gap-2 sm:gap-3'
          : 'flex w-full min-w-0 max-w-full items-center justify-center gap-2'
      }
    >
      <button
        type="button"
        onClick={onPrev}
        className={
          isRail
            ? 'shrink-0 rounded-full p-2.5 text-text-muted transition-colors hover:bg-bg-elevated/50 active:scale-95'
            : embedded
              ? 'shrink-0 touch-manipulation rounded-full p-1 text-text-muted transition-colors hover:bg-bg-elevated/35 active:scale-95'
              : 'shrink-0 touch-manipulation rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg-elevated/40 active:scale-95 sm:p-2'
        }
        aria-label="Previous day"
      >
        <ArrowLeft size={isRail ? 20 : embedded ? 16 : 18} />
      </button>

      <label
        className={
          isRail
            ? 'min-w-0 max-w-full flex-1 cursor-pointer px-2 text-center'
            : 'min-w-0 max-w-full flex-1 cursor-pointer px-0.5 text-center sm:px-1'
        }
      >
        <span className="sr-only">Choose date</span>
        <span className={pillClass}>
          {isSelectedToday && (
            <span className={sunClass} title="Today">
              <SunMedium size={embedded ? 12 : 14} className="text-accent-sakura" />
            </span>
          )}
          <span className={labelTextClass}>
            {dateLabel}
          </span>
        </span>
        <input
          type="date"
          value={selectedDateKey}
          onChange={(event) => onPickDate(event.target.value || getTodayKey())}
          className="sr-only"
          aria-label="Choose date"
        />
      </label>

      <button
        type="button"
        onClick={onNext}
        className={
          isRail
            ? 'shrink-0 rounded-full p-2.5 text-text-muted transition-colors hover:bg-bg-elevated/50 active:scale-95'
            : embedded
              ? 'shrink-0 touch-manipulation rounded-full p-1 text-text-muted transition-colors hover:bg-bg-elevated/35 active:scale-95'
              : 'shrink-0 touch-manipulation rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg-elevated/40 active:scale-95 sm:p-2'
        }
        aria-label="Next day"
      >
        <ArrowRight size={isRail ? 20 : embedded ? 16 : 18} />
      </button>
    </div>
  );
}
