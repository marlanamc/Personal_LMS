'use client';

import { useMemo, useState } from 'react';
import { ContextSidebar } from './ContextSidebar';
import { FocusHero } from './FocusHero';
import { useZenMode } from './useZenMode';
import { useTodayFlow } from './useTodayFlow';
import { CaptureDock } from './CaptureDock';
import { MobileCommandHeader } from './MobileCommandHeader';
import { LmsCompactStrip } from './LmsCompactStrip';
import { isAnchorScheduledForDate, parseHHMMToMinutes } from '@/lib/anchors';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import type { CalendarEvent } from './MiniCalendar';
import type { ChecklistItem } from './checklist-item.types';

interface HomePlanningHubProps {
  userName: string;
  currentStreak: number;
  totalPoints: number;
  hasActivityToday: boolean;
  storageScope: string;
  assignments: ChecklistItem[];
  calendarEvents: CalendarEvent[];
}

export function HomePlanningHub({
  userName,
  currentStreak,
  totalPoints,
  hasActivityToday,
  storageScope,
  assignments,
  calendarEvents,
}: HomePlanningHubProps) {
  const { isZenMode, toggleZenMode } = useZenMode();
  const [isLmsExpanded, setIsLmsExpanded] = useState(false);

  // Get anchors for passing to CaptureDock
  const { anchors } = useDailyAnchorsForToday(storageScope);
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
  } = useTodayFlow(storageScope, calendarEvents);

  const lastSyncedLabel = lastSyncedAt
    ? lastSyncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
      {/* Main content area */}
      <div
        className={`space-y-5 transition-all duration-300 ease-in-out ${
          isZenMode ? 'md:col-span-12' : 'md:col-span-8 lg:col-span-9'
        }`}
      >
        {/* Mobile: Simple header with "Next: X in Ym" */}
        <MobileCommandHeader
          completedAnchors={todaySummary.completedAnchors}
          totalAnchors={todaySummary.totalAnchors}
          completionPercent={todaySummary.completionPercent}
          activeAnchor={todaySummary.activeAnchor}
          upNextAnchor={todaySummary.upNextAnchor}
          minutesUntilNext={todaySummary.minutesUntilNext}
        />

        {/* FocusHero with anchor timeline - shows on both mobile and desktop */}
        <section className="animate-fade-in-up relative cosmic-hero-field md:cosmic-hero-field focus-hero-mobile-plain-field">
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

        {/* Desktop: Inline CaptureDock */}
        <section className="hidden md:block animate-fade-in-up">
          <CaptureDock
            thoughtDownload={thoughtDownload}
            onUpdateThoughtDownload={updateThoughtDownload}
            isLoaded={isLoaded}
            isSaving={isSaving}
            saveError={saveError}
            lastSyncedLabel={lastSyncedLabel}
            onAddTask={addTask}
            onAddMoment={addMomentEntry}
            activeAnchor={todaySummary.activeAnchor}
            anchors={todayAnchors}
            lmsItemCount={assignments.length}
            onOpenLms={() => setIsLmsExpanded(true)}
          />
        </section>

        {/* LMS Compact Strip */}
        <section className="animate-fade-in-up px-1 md:px-0">
          <LmsCompactStrip
            assignments={assignments}
            isExpanded={isLmsExpanded}
            onToggleExpanded={() => setIsLmsExpanded(!isLmsExpanded)}
          />
        </section>

        {/* Bottom spacing for mobile CaptureDock */}
        <div className="h-24 md:hidden" aria-hidden />
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden min-w-0 transition-all duration-300 ease-in-out md:block ${
          isZenMode ? 'md:col-span-0 w-0 overflow-hidden' : 'md:col-span-4 lg:col-span-3'
        }`}
      >
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
