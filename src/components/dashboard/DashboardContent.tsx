'use client';

import type { ChecklistItem } from './checklist-item.types';
import type { CalendarEvent } from './MiniCalendar';
import { HomePlanningHub } from './HomePlanningHub';

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
  return (
    <HomePlanningHub
      userName={userName}
      currentStreak={currentStreak}
      totalPoints={totalPoints}
      hasActivityToday={hasActivityToday}
      storageScope={storageScope}
      assignments={assignments}
      calendarEvents={calendarEvents}
    />
  );
}
