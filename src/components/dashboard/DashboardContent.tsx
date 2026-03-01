'use client';

import { FocusHero } from './FocusHero';
import { FlatChecklist } from './FlatChecklist';
import { ContextSidebar } from './ContextSidebar';
import { useZenMode } from './useZenMode';
import { ClearFeaturedButton } from './';
import type { ChecklistItem } from './checklist-item.types';
import type { CalendarEvent } from './MiniCalendar';

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
          {/* Focus Hero */}
          <section className="animate-fade-in-up relative cosmic-hero-field">
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
