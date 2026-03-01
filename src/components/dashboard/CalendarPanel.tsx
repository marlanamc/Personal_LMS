'use client';

import Link from 'next/link';
import { CalendarIcon, BookOpenIcon, PanelRightClose } from 'lucide-react';
import { MiniCalendar, type CalendarEvent } from './MiniCalendar';
import UpcomingEventsList from './UpcomingEventsList';

interface CalendarPanelProps {
  calendarEvents: CalendarEvent[];
  onToggle?: () => void;
}

export function CalendarPanel({ calendarEvents, onToggle }: CalendarPanelProps) {
  const upcomingEvents = calendarEvents.filter((event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
    eventEndDate.setHours(0, 0, 0, 0);
    return eventEndDate >= today;
  });

  return (
    <div className="cloud-panel bg-bg-elevated border border-border-subtle shadow-lg rounded-2xl p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-1 -mb-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="inline-flex items-center justify-center rounded-lg bg-bg-surface/70 border border-border-subtle px-2 py-1 text-xs font-semibold tracking-wide uppercase text-text-secondary">
            <CalendarIcon className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="truncate">Calendar</span>
          </div>
        </div>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-bg-surface transition-colors"
            aria-label="Close calendar panel"
            title="Close calendar (Cmd+\\)"
          >
            <PanelRightClose size={16} />
          </button>
        )}
      </div>

      {/* Mini calendar */}
      <div className="min-w-0">
        <MiniCalendar events={calendarEvents} />
      </div>

      {/* Upcoming events */}
      <div className="pt-2 border-t border-border/30 space-y-1.5">
        <div className="flex items-center justify-between text-meta text-text-secondary">
          <span className="font-semibold tracking-wide uppercase">Upcoming dates</span>
        </div>
        <UpcomingEventsList
          events={upcomingEvents.slice(0, 4)}
          allowDelete={true}
        />
        {upcomingEvents.length > 4 && (
          <Link
            href="/dashboard/calendar"
            className="mt-1 block text-meta text-primary hover:underline"
          >
            See all {upcomingEvents.length} events →
          </Link>
        )}
      </div>

      {/* Quick links */}
      <div className="pt-2.5 border-t border-border/30 space-y-1.5">
          <Link
            href="/dashboard/calendar/new"
          className="quick-link cloud-surface w-full px-3 py-1.5 text-text border border-border/50 rounded-lg flex items-center gap-2.5 hover:border-accent-teal/45 transition-colors"
        >
          <CalendarIcon className="w-4 h-4 shrink-0" />
          <span className="text-body font-semibold">New Event</span>
        </Link>
        <Link
          href="/dashboard/subjects"
          className="quick-link cloud-surface w-full px-3 py-1.5 text-text border border-border/50 rounded-lg flex items-center gap-2.5 hover:border-accent-teal/45 transition-colors"
        >
          <BookOpenIcon className="w-4 h-4 shrink-0" />
          <span className="text-body font-semibold">All Subjects</span>
        </Link>
      </div>
    </div>
  );
}
