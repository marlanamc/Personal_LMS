import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { PlanningCommandCenter } from '@/features/planning/components/PlanningCommandCenter';
import { loadCalendarEvents } from '@/features/planning/server/calendar-events';
import { toDateKey } from '@/lib/unified-scheduler';
import type { PlanningView } from '@/context/PlanningContext';

export const metadata = {
  title: 'Planning Command Center | Personal LMS',
  description: 'Your unified planning hub for daily anchors, calendar, and time blocks.',
};

interface PageProps {
  searchParams: Promise<{ date?: string; view?: string }>;
}

export default async function PlanPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  // Parse URL params
  const params = await searchParams;
  const initialDateKey = params.date || toDateKey(new Date());
  const initialView = (params.view as PlanningView) || 'day';

  const calendarEvents = await loadCalendarEvents(userId);

  return (
    <div className="min-h-screen bg-bg-base">
      <PlanningCommandCenter
        calendarEvents={calendarEvents}
        storageScope={userId}
        initialDateKey={initialDateKey}
        initialView={initialView}
      />
    </div>
  );
}
