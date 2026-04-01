import type { DailyAnchor } from '@/lib/anchors';
import type { CalendarEvent } from '@/components/planning/MiniCalendar';
import type { PlannerConstraintRule } from '@/lib/time-block-planner';

export interface DailyOverviewAcknowledgements {
  boundaries: string[];
  events: string[];
  sessions: string[];
}

export interface ComputeDailyOverviewProgressArgs {
  todayAnchors: DailyAnchor[];
  calendarEvents: CalendarEvent[];
  todayKey: string;
  activeConstraints: PlannerConstraintRule[];
  acknowledgements: DailyOverviewAcknowledgements;
  /**
   * When the overview lists time-block sessions, pass the same ids so progress matches the list.
   * (Today’s list may omit this until session rows are rendered.)
   */
  sessionOverviewEntries?: { id: string }[];
}

/**
 * Matches {@link DailyOverviewList} item counts: anchors (done), timed calendar events (ack),
 * active constraint boundaries (ack), optional session rows (ack).
 */
export function computeDailyOverviewProgress(args: ComputeDailyOverviewProgressArgs): {
  completed: number;
  total: number;
  percent: number;
} {
  const {
    todayAnchors,
    calendarEvents,
    todayKey,
    activeConstraints,
    acknowledgements,
    sessionOverviewEntries,
  } = args;

  let completed = 0;
  let total = 0;

  for (const anchor of todayAnchors) {
    total += 1;
    if (anchor.status === 'done') completed += 1;
  }

  const todayEvents = calendarEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const eventKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
    return eventKey === todayKey;
  });

  for (const event of todayEvents) {
    total += 1;
    const eventId = event.id ?? `event-${event.date}`;
    if (acknowledgements.events.includes(eventId)) completed += 1;
  }

  for (const constraint of activeConstraints) {
    total += 1;
    if (acknowledgements.boundaries.includes(constraint.id)) completed += 1;
  }

  if (sessionOverviewEntries?.length) {
    for (const row of sessionOverviewEntries) {
      total += 1;
      if (acknowledgements.sessions.includes(row.id)) completed += 1;
    }
  }

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}
