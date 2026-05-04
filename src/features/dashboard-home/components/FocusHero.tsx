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
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(today);

  return (
    <div className="focus-hero-wrapper focus-hero-mobile-plain relative">
      {/* Outer warm glow */}
      <div aria-hidden className="hidden sm:block absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/8 via-transparent to-accent/6 blur-xl pointer-events-none" />

      <div className="focus-hero relative rounded-none sm:rounded-2xl overflow-visible sm:overflow-hidden">
        <div className="hidden lg:block">
          <CalendarPanelRestoreButton isVisible={isCalendarRestoreVisible} onRestore={onRestoreCalendar} />
        </div>

        {/* Layered background effects */}
        <div aria-hidden className="hidden sm:block absolute inset-0 pointer-events-none focus-hero-nebula" />
        <div aria-hidden className="hidden sm:block absolute inset-0 pointer-events-none focus-hero-grain opacity-[0.03]" />

        {/* Decorative corner flourish */}
        <div aria-hidden className="hidden sm:block absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-2xl" />
        <div aria-hidden className="hidden sm:block absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-secondary/15 to-transparent blur-xl" />

        <div className="relative px-0 py-0 sm:px-7 sm:py-8">
          {/* Date Banner - pr-12 leaves room for calendar restore button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-7 pr-0 sm:pr-12">
            <h1 className="hidden sm:block text-page-title font-display leading-tight mb-1">
              <span className="text-text relative">
                {dateLabel}
                {/* Hand-drawn underline effect */}
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2 text-primary/40"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 25 2, 50 5 T 100 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </div>

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
