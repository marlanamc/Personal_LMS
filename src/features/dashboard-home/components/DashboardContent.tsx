'use client';

import type { CalendarEvent } from '@/features/planning/types';
import type { ChecklistItem } from '@/types/checklist-item';
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
