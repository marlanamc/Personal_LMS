'use client';

import { useMemo } from 'react';
import { FocusHero } from './FocusHero';
import { FlatChecklist } from './FlatChecklist';
import { ContextSidebar } from './ContextSidebar';
import { useZenMode } from './useZenMode';
import { ClearFeaturedButton } from './';
import type { ChecklistItem } from './checklist-item.types';
import type { CalendarEvent } from './MiniCalendar';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import { isAnchorScheduledForDate } from '@/lib/anchors';

interface DashboardContentProps {
  userName: string;
  currentStreak: number;
  totalPoints: number;
  hasActivityToday: boolean;
  storageScope: string;
  assignments: ChecklistItem[];
  calendarEvents: CalendarEvent[];
}

export function DashboardContent({
  userName,
  currentStreak,
  totalPoints,
  hasActivityToday,
  storageScope,
  assignments,
  calendarEvents,
}: DashboardContentProps) {
  const { isZenMode, toggleZenMode } = useZenMode();
  const { anchors } = useDailyAnchorsForToday(storageScope);

  const todaySummary = useMemo(() => {
    const now = new Date();
    const todaysAnchors = anchors.filter((anchor) => isAnchorScheduledForDate(anchor, now));
    const completedAnchors = todaysAnchors.filter((anchor) => anchor.status === 'done').length;
    const totalAnchors = todaysAnchors.length;

    const dateLabel = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(now);

    return {
      dateLabel,
      completedAnchors,
      totalAnchors,
      completionPercent: totalAnchors > 0 ? Math.round((completedAnchors / totalAnchors) * 100) : 0,
    };
  }, [anchors]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Main Content Column */}
        <div
          className={`
            space-y-6 transition-all duration-300 ease-in-out
            ${isZenMode ? 'md:col-span-12' : 'md:col-span-8 lg:col-span-9'}
          `}
        >
          <section className="md:hidden pt-1 pb-1 px-1.5">
            <h1 className="text-[2.15rem] leading-none font-display font-bold text-text">{todaySummary.dateLabel}</h1>
            <p className="mt-2 text-sm text-text-muted">
              {todaySummary.completedAnchors} of {todaySummary.totalAnchors} anchors complete
            </p>
            <div className="mt-2.5">
              <div className="h-1 rounded-full bg-bg-surface/70 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/55 transition-[width] duration-500 ease-out"
                  style={{ width: `${todaySummary.completionPercent}%` }}
                />
              </div>
            </div>
          </section>

          <div className="md:hidden flex items-center gap-3 mb-0.5" aria-hidden>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border-subtle to-border-subtle/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted/70">Daily Anchors</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border-subtle to-border-subtle/40" />
          </div>

          {/* Focus Hero */}
          <section className="animate-fade-in-up relative cosmic-hero-field focus-hero-mobile-plain-field">
            <FocusHero
              userName={userName}
              currentStreak={currentStreak}
              totalPoints={totalPoints}
              hasActivityToday={hasActivityToday}
              storageScope={storageScope}
              isCalendarRestoreVisible={isZenMode}
              onRestoreCalendar={toggleZenMode}
            />
          </section>

          <div className="md:hidden flex items-center gap-3 mt-6 mb-1.5" aria-hidden>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border-subtle to-border-subtle/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted/70">Checklist</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border-subtle to-border-subtle/40" />
          </div>

          {/* Flat Checklist */}
          <section id="daily-checklist" className="animate-fade-in-up delay-100 scroll-mt-24">
            <FlatChecklist
              assignments={assignments}
              title="Your Daily Checklist"
              actions={<ClearFeaturedButton />}
            />
          </section>

        </div>

        {/* Calendar Sidebar - sticky, aligned to top */}
        <aside
          className={`
            hidden md:block transition-all duration-300 ease-in-out min-w-0
            ${isZenMode ? 'md:col-span-0 w-0 overflow-hidden' : 'md:col-span-4 lg:col-span-3'}
          `}
        >
          <ContextSidebar
            calendarEvents={calendarEvents}
            isOpen={!isZenMode}
            onToggle={toggleZenMode}
          />
        </aside>
      </div>
    </>
  );
}
