import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DayPlannerView } from '@/components/planning/DayPlannerView';
import { loadCalendarEvents } from '@/features/planning/server/calendar-events';
import { toDateKey } from '@/lib/unified-scheduler';

export const metadata = {
  title: 'Day Planner | Personal LMS',
  description: 'Plan your day with daily anchors, events, and time blocks.',
};

interface PageProps {
  searchParams: Promise<{ date?: string; openTool?: string }>;
}

export default async function DayPlannerPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  // Get the date from URL or default to today
  const params = await searchParams;
  const initialDateKey = params.date || toDateKey(new Date());
  const openTool = params.openTool || null;

  const calendarEvents = await loadCalendarEvents(userId);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12 overflow-x-clip">
      <Suspense fallback={<div className="min-h-[40vh] animate-pulse rounded-2xl bg-bg-elevated/20" aria-hidden />}>
        <DayPlannerView
          events={calendarEvents}
          initialDateKey={initialDateKey}
          initialOpenTool={openTool}
          storageScope={userId}
        />
      </Suspense>
    </main>
  );
}
