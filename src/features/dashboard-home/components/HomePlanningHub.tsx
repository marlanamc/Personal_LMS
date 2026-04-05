'use client';

import { cn } from '@/lib/utils';
import { Calendar, Sparkles, Timer, BookOpen } from 'lucide-react';
import { ContextSidebar } from '@/components/shared/ContextSidebar';
import { FocusHero } from './FocusHero';
import { TodayMenu } from './TodayMenu';
import { AreaCard } from './AreaCard';
import { MobileCommandHeader } from '@/features/dashboard-home';
import { useZenMode } from '@/features/planning/hooks/useZenMode';
import { useTodayFlow } from '@/features/planning/hooks/useTodayFlow';
import { useCalendarPlanner } from '@/features/planning/hooks/useCalendarPlanner';
import type { CalendarEvent } from '@/features/planning/types';
import type { ChecklistItem } from '@/types/checklist-item';

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
  const calendarPlanner = useCalendarPlanner(storageScope);

  const {
    todaySummary,
  } = useTodayFlow(storageScope, calendarEvents, calendarPlanner);

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

        {/* Today's Menu - Meals & Now Items */}
        <section className="animate-fade-in-up">
          <TodayMenu storageScope={storageScope} />
        </section>

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
