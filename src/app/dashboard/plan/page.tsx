import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { type CalendarEvent } from '@/components/dashboard';
import { PlanningCommandCenter } from '@/components/dashboard/PlanningCommandCenter';
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

  // Fetch calendar events (shared query used by calendar and day-planner pages)
  const ownedClasses = await prisma.class.findMany({
    where: { ownerId: userId },
    include: {
      assignments: {
        include: { activity: true },
      },
      calendarEvents: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const allAssignments = ownedClasses.flatMap((classItem) => classItem.assignments);
  const calendarEvents: CalendarEvent[] = [
    ...allAssignments
      .filter((assignment) => assignment.dueDate)
      .map((assignment) => ({
        id: assignment.id,
        date: assignment.dueDate as Date,
        endDate: null,
        type: (assignment.title || assignment.activity.title || '').toLowerCase().includes('quiz')
          ? ('quiz' as const)
          : ('due' as const),
        title: `${assignment.title || assignment.activity.title || 'Assignment'}`,
      })),
    ...ownedClasses.flatMap((classItem) =>
      classItem.calendarEvents.map((eventItem) => ({
        id: eventItem.id,
        date: eventItem.date,
        endDate: eventItem.endDate || null,
        type: (eventItem.type as CalendarEvent['type']) || 'holiday',
        title: eventItem.title,
        description: eventItem.description,
      })),
    ),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
