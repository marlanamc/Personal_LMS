'use client';

import { ArrowLeft, ArrowRight, SunMedium } from 'lucide-react';
import { getTodayKey } from '@/lib/unified-scheduler';

export interface DayPlannerHeaderDateNavProps {
  selectedDateKey: string;
  isSelectedToday: boolean;
  mobileDateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onPickDate: (dateKey: string) => void;
}

/**
 * Compact prev / date / next cluster for the sticky dashboard header (day planner route).
 */
export function DayPlannerHeaderDateNav({
  selectedDateKey,
  isSelectedToday,
  mobileDateLabel,
  onPrev,
  onNext,
  onPickDate,
}: DayPlannerHeaderDateNavProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full min-w-0 max-w-full">
      <button
        type="button"
        onClick={onPrev}
        className="shrink-0 rounded-full p-1.5 sm:p-2 transition-colors hover:bg-bg-elevated/40 active:scale-95 touch-manipulation"
        aria-label="Previous day"
      >
        <ArrowLeft size={18} className="text-text-muted" />
      </button>

      <label className="min-w-0 flex-1 cursor-pointer text-center px-0.5 sm:px-1 max-w-full">
        <span className="sr-only">Choose date</span>
        <span
          className={`pointer-events-none flex items-center justify-center min-w-0 ${
            isSelectedToday ? 'gap-0.5' : 'gap-0'
          }`}
        >
          {isSelectedToday && (
            <span
              className="inline-flex items-center justify-center size-4 shrink-0 rounded-full bg-accent-sakura/15"
              title="Today"
            >
              <SunMedium size={11} className="text-accent-sakura" />
            </span>
          )}
          <span className="text-[13px] min-[380px]:text-[15px] sm:text-base font-display font-semibold text-text leading-none whitespace-nowrap tabular-nums">
            {mobileDateLabel}
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
        className="shrink-0 rounded-full p-1.5 sm:p-2 transition-colors hover:bg-bg-elevated/40 active:scale-95 touch-manipulation"
        aria-label="Next day"
      >
        <ArrowRight size={18} className="text-text-muted" />
      </button>
    </div>
  );
}
