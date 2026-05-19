'use client';

import { DailyAnchorsTimeline } from '@/components/planning/DailyAnchorsTimeline';
import { CalendarPanelRestoreButton } from '@/components/shared/ContextSidebar';
import type { DailyAnchorsApi } from '@/components/daily-anchors/useDailyAnchors';
import type { CalendarPlannerApi } from '@/features/planning/hooks/useCalendarPlanner';
import type { CalendarEvent } from '@/features/planning/types';

interface FocusHeroProps {
  userName: string;
  isCalendarRestoreVisible: boolean;
  onRestoreCalendar: () => void;
  calendarEvents: CalendarEvent[];
  calendarPlanner: CalendarPlannerApi;
  dailyAnchors: DailyAnchorsApi;
}

function getSeason(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 12 && d >= 21) || m <= 2 || (m === 3 && d < 20)) return 'winter';
  if ((m === 3 && d >= 20) || (m <= 5) || (m === 6 && d < 21)) return 'spring';
  if ((m === 6 && d >= 21) || (m <= 8) || (m === 9 && d < 22)) return 'summer';
  return 'autumn';
}

export function FocusHero({
  userName: _userName,
  isCalendarRestoreVisible,
  onRestoreCalendar,
  calendarEvents,
  calendarPlanner,
  dailyAnchors,
}: FocusHeroProps) {
  // Format today's date for display
  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const nextYearStart = new Date(today.getFullYear() + 1, 0, 1);
  const dayMs = 24 * 60 * 60 * 1000;
  const dayOfYear = Math.floor((today.getTime() - yearStart.getTime()) / dayMs) + 1;
  const daysInYear = Math.round((nextYearStart.getTime() - yearStart.getTime()) / dayMs);
  const yearProgress = Math.round((dayOfYear / daysInYear) * 100);
  const dayProgress = Math.min(
    100,
    Math.round(((today.getHours() * 60 + today.getMinutes()) / (24 * 60)) * 100),
  );
  const weekdayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today);
  const dayLabel = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(today);
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(today);
  const season = getSeason(today);

  return (
    <div className="focus-hero-wrapper focus-hero-mobile-plain dashboard-date-hero relative">
      <div className="dashboard-date-hero-header hidden sm:grid">
        <h1 className="hidden sm:block text-page-title font-body leading-tight mb-1">
          <span className="dashboard-date-hero-full text-text relative">
            {dateLabel}
          </span>
          <span className="dashboard-date-hero-today-label" aria-hidden>
            TODAY · {dayProgress}% THROUGH
          </span>
          <span className="dashboard-date-hero-title" aria-hidden>
            <span className="dashboard-date-hero-title-weekday">{weekdayLabel},</span>
            <span className="dashboard-date-hero-title-date">{monthLabel} {dayLabel}</span>
          </span>
        </h1>
        <div className="dashboard-date-hero-header-right hidden sm:flex min-w-0 flex-row flex-nowrap items-center justify-end justify-self-end gap-2 lg:gap-3">
          <div className="dashboard-date-hero-day-progress hidden sm:flex" aria-hidden>
            <span>THE YEAR · {yearProgress}%</span>
            <div>
              <span style={{ width: `${yearProgress}%` }} />
            </div>
            <em>
              day {dayOfYear} of {daysInYear} · {season}
            </em>
          </div>
          {isCalendarRestoreVisible ? (
            <div className="hidden lg:flex shrink-0">
              <CalendarPanelRestoreButton isVisible onRestore={onRestoreCalendar} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Outer warm glow */}
      <div aria-hidden className="hidden sm:block absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/8 via-transparent to-accent/6 blur-xl pointer-events-none focus-hero-outer-glow" />

      <div className="focus-hero relative rounded-none sm:rounded-2xl overflow-visible sm:overflow-hidden">
        {/* Layered background effects */}
        <div aria-hidden className="hidden sm:block absolute inset-0 pointer-events-none focus-hero-nebula" />
        <div aria-hidden className="hidden sm:block absolute inset-0 pointer-events-none focus-hero-grain opacity-[0.03]" />

        <div className="relative px-0 py-0 sm:px-7 sm:py-8">
          {/* Timeline moved inside hero container */}
          <div className="pr-0">
            <DailyAnchorsTimeline
              calendarEvents={calendarEvents}
              calendarPlanner={calendarPlanner}
              dailyAnchors={dailyAnchors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
