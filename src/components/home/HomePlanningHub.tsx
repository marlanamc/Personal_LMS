'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Sparkles, Timer, BookOpen } from 'lucide-react';
import { ContextSidebar } from '@/components/shared/ContextSidebar';
import { FocusHero } from './FocusHero';
import { TodaysAssignments } from '@/components/learning/TodaysAssignments';
import { AreaCard } from '@/components/home/AreaCard';
import { useZenMode } from '@/components/dashboard/useZenMode';
import { useTodayFlow } from '@/components/dashboard/useTodayFlow';
import { MobileCommandHeader } from '@/components/dashboard/MobileCommandHeader';
import { isAnchorScheduledForDate, parseHHMMToMinutes } from '@/lib/anchors';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import type { CalendarEvent } from '@/components/planning/MiniCalendar';
import type { ChecklistItem } from '@/components/dashboard/checklist-item.types';

interface HomePlanningHubProps {
  userName: string;
  storageScope: string;
  assignments: ChecklistItem[];
  calendarEvents: CalendarEvent[];
}

export function HomePlanningHub({
  userName,
  storageScope,
  assignments,
  calendarEvents,
}: HomePlanningHubProps) {
  const { isZenMode, toggleZenMode } = useZenMode();
  const [isLmsExpanded, setIsLmsExpanded] = useState(false);

  // Get anchors for passing to CaptureDock
  const { anchors } = useDailyAnchorsForToday(storageScope);
  const calendarPlanner = useCalendarPlanner(storageScope);
  const today = useMemo(() => new Date(), []);
  const todayAnchors = useMemo(
    () =>
      anchors
        .filter((anchor) => isAnchorScheduledForDate(anchor, today))
        .sort(
          (a, b) =>
            parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime)
        ),
    [anchors, today]
  );

  // Use the unified Today Flow hook
  const {
    thoughtDownload,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    todaySummary,
    updateThoughtDownload,
    addTask,
    addMomentEntry,
  } = useTodayFlow(storageScope, calendarEvents, calendarPlanner);

  const lastSyncedLabel = lastSyncedAt
    ? lastSyncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <div
      className={cn(
        'grid grid-cols-1 items-start gap-6',
        isZenMode ? 'lg:grid-cols-1' : 'lg:grid-cols-[1fr_300px]',
      )}
    >
      {/* Main content area */}
      <div className="space-y-5">
        {/* Mobile: date + next anchor line */}
        <MobileCommandHeader
          upNextAnchor={todaySummary.upNextAnchor}
          minutesUntilNext={todaySummary.minutesUntilNext}
        />

        {/* FocusHero with anchor timeline - shows on both mobile and desktop */}
        <section className="animate-fade-in-up relative cosmic-hero-field md:cosmic-hero-field focus-hero-mobile-plain-field">
          <FocusHero
            userName={userName}
            storageScope={storageScope}
            isCalendarRestoreVisible={isZenMode}
            onRestoreCalendar={toggleZenMode}
            calendarEvents={calendarEvents}
            calendarPlanner={calendarPlanner}
          />
        </section>

        {/* Four-Area Navigation */}
        <section className="animate-fade-in-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AreaCard
              title="Planning"
              icon={Calendar}
              href="/dashboard/day-planner"
              primaryLabel="Open day planner"
              color="blue"
              shortcuts={[
                { label: 'Calendar', href: '/dashboard/calendar' },
                { label: 'Anchors', href: '/dashboard/anchors' },
                { label: 'Meals', href: '/dashboard/meal-planner' },
              ]}
            />
            <AreaCard
              title="Thinking"
              icon={Sparkles}
              href="/dashboard/workspace"
              primaryLabel="Open workspace"
              color="purple"
              shortcuts={[
                { label: 'Thought Download', href: '/dashboard/thought-download' },
                { label: 'Organize', href: '/dashboard/organize' },
                { label: 'Moment Log', href: '/dashboard/interstitial-journalling' },
              ]}
            />
            <AreaCard
              title="Focus"
              icon={Timer}
              href="/dashboard/timer"
              primaryLabel="Start focus timer"
              color="orange"
              shortcuts={[
                { label: 'Crisis Mode', href: '/dashboard/crisis' },
                { label: 'Health Log', href: '/dashboard/health-tracker' },
              ]}
            />
            <AreaCard
              title="Learning"
              icon={BookOpen}
              href="/dashboard/subjects"
              primaryLabel="Open subjects"
              color="green"
              shortcuts={[
                { label: 'Spanish', href: '/dashboard/spanish-course-map' },
                { label: 'Coding', href: '/dashboard/coding-course-map' },
              ]}
            />
          </div>
        </section>

        {/* Today's Assignments */}
        {assignments.length > 0 && (
          <section className="animate-fade-in-up">
            <h2 className="text-lg font-semibold mb-4 px-1">Today's Assignments</h2>
            <TodaysAssignments initialAssignments={assignments} variant="cards" />
          </section>
        )}

        {/* Bottom spacing for mobile nav */}
        <div className="h-24 md:hidden" aria-hidden />
      </div>

      {/* Desktop Sidebar (Calendar) — visibility follows zen mode (see useZenMode, Cmd+\\) */}
      <aside className={isZenMode ? 'hidden' : 'hidden lg:block'}>
        <div className="space-y-4">
          <ContextSidebar
            calendarEvents={calendarEvents}
            isOpen={!isZenMode}
            onToggle={toggleZenMode}
          />
        </div>
      </aside>
    </div>
  );
}
