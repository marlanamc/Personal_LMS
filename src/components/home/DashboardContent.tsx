'use client';

import type { ChecklistItem } from '@/components/dashboard/checklist-item.types';
import type { CalendarEvent } from '@/components/planning/MiniCalendar';
import { HomePlanningHub } from './HomePlanningHub';

interface DashboardContentProps {
  userName: string;
  storageScope: string;
  assignments: ChecklistItem[];
  calendarEvents: CalendarEvent[];
}

export function DashboardContent({
  userName,
  storageScope,
  assignments,
  calendarEvents,
}: DashboardContentProps) {
  return (
    <HomePlanningHub
      userName={userName}
      storageScope={storageScope}
      assignments={assignments}
      calendarEvents={calendarEvents}
    />
  );
}
