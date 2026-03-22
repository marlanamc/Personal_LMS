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
  onPrev,
  onNext,
  onPickDate,
}: DayPlannerHeaderDateNavProps) {
  const isRail = variant === 'desktopRail';

  return (
    <div
      className={
        isRail
          ? 'flex w-full min-w-0 max-w-3xl items-center justify-center gap-2 sm:gap-3'
          : 'flex w-full min-w-0 max-w-full items-center justify-center gap-0'
      }
    >
      <button
        type="button"
        onClick={onPrev}
        className={
          isRail
            ? 'shrink-0 rounded-full p-2.5 text-text-muted transition-colors hover:bg-bg-elevated/50 active:scale-95'
            : 'shrink-0 touch-manipulation rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg-elevated/40 active:scale-95 sm:p-2'
        }
        aria-label="Previous day"
      >
        <ArrowLeft size={isRail ? 20 : 18} />
      </button>

      <label
        className={
          isRail
            ? 'min-w-0 max-w-full flex-1 cursor-pointer px-2 text-center'
            : 'min-w-0 max-w-full flex-1 cursor-pointer px-0.5 text-center sm:px-1'
        }
      >
        <span className="sr-only">Choose date</span>
        <span
          className={`pointer-events-none flex min-w-0 flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-2 ${
            isRail ? 'rounded-2xl border border-border-subtle/50 bg-bg-elevated/45 px-4 py-3 shadow-sm backdrop-blur-sm' : ''
          }`}
        >
          {isSelectedToday && (
            <span
              className={
                isRail
                  ? 'inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-sakura/18 text-accent-sakura ring-1 ring-accent-sakura/25'
                  : 'inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-sakura/15'
              }
              title="Today"
            >
              <SunMedium size={isRail ? 16 : 11} className="text-accent-sakura" />
            </span>
          )}
          <span
            className={
              isRail
                ? 'text-center font-display text-lg font-bold leading-snug tracking-tight text-text sm:text-xl'
                : 'whitespace-nowrap font-display text-[13px] font-semibold tabular-nums leading-none text-text min-[380px]:text-[15px] sm:text-base'
            }
          >
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
            : 'shrink-0 touch-manipulation rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg-elevated/40 active:scale-95 sm:p-2'
        }
        aria-label="Next day"
      >
        <ArrowRight size={isRail ? 20 : 18} />
      </button>
    </div>
  );
}
