'use client';

import Link from 'next/link';
import { CalendarIcon, BookOpenIcon, PanelRightClose } from 'lucide-react';
import { MiniCalendar, type CalendarEvent } from './MiniCalendar';
import UpcomingEventsList from './UpcomingEventsList';

interface CalendarPanelProps {
  calendarEvents: CalendarEvent[];
  onToggle?: () => void;
  showJumpToToday?: boolean;
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
}

export function CalendarPanel({ calendarEvents, onToggle, showJumpToToday = false, selectedDate: selectedDateProp, onDateSelect }: CalendarPanelProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Use selected date for filtering when provided (calendar page); otherwise use actual today
  const focusDate = selectedDateProp ?? today;
  const focusDateStart = new Date(focusDate);
  focusDateStart.setHours(0, 0, 0, 0);
  const focusDateTomorrow = new Date(focusDateStart);
  focusDateTomorrow.setDate(focusDateTomorrow.getDate() + 1);

  // Events for the focus date (today/selected)
  const todayEvents = calendarEvents.filter((event) => {
    const eventStart = new Date(event.date);
    eventStart.setHours(0, 0, 0, 0);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
    eventEnd.setHours(0, 0, 0, 0);
    return eventStart <= focusDateStart && eventEnd >= focusDateStart;
  });

  // Future events (starting the day after focus date)
  const upcomingEvents = calendarEvents.filter((event) => {
    const eventStart = new Date(event.date);
    eventStart.setHours(0, 0, 0, 0);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
    eventEnd.setHours(0, 0, 0, 0);
    return eventEnd >= focusDateTomorrow && eventStart > focusDateStart;
  });

  return (
    <div
      className="rounded-2xl p-4 space-y-4 overflow-hidden relative elevation-2 border border-border-subtle/50"
      style={{
        background: "linear-gradient(180deg, color-mix(in srgb, var(--color-bg-elevated) 98%, white 2%) 0%, color-mix(in srgb, var(--color-bg-elevated) 94%, var(--color-accent-sakura) 2%) 100%)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-sakura via-accent-amethyst to-accent-teal opacity-60" />
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="glass-pill inline-flex items-center justify-center rounded-full bg-bg-surface/50 backdrop-blur-md border border-border-subtle px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase text-text-secondary shadow-sm">
            <CalendarIcon className="w-3 h-3 mr-1.5 text-accent-sakura shrink-0" />
            <span className="truncate">Schedule</span>
          </div>
        </div>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-bg-surface transition-all active:scale-90"
            aria-label="Close calendar panel"
            title="Close calendar (Cmd+\\)"
          >
            <PanelRightClose size={16} />
          </button>
        )}
      </div>

      {/* Mini calendar - now with its own container styling */}
      <div className="min-w-0">
        <MiniCalendar
          events={calendarEvents}
          showJumpToToday={showJumpToToday}
          selectedDate={selectedDateProp}
          onDateSelect={onDateSelect}
        />
      </div>

      {/* Today/Selected date's events section */}
      {todayEvents.length > 0 && (
        <div className="pt-3 border-t border-border-subtle/30 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-accent-sakura">
              {focusDateStart.getTime() !== today.getTime() ? "Selected" : "Today"}
            </span>
          </div>
          <div className="px-0.5 rounded-xl bg-accent-sakura/8 border border-accent-sakura/20 p-2">
            <UpcomingEventsList
              events={todayEvents}
              allowDelete={true}
            />
          </div>
        </div>
      )}

      {/* Upcoming events section */}
      {upcomingEvents.length > 0 && (
        <div className={`${todayEvents.length === 0 ? 'pt-3 border-t border-border-subtle/30' : 'pt-2'} space-y-2`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-muted">Upcoming</span>
            {(todayEvents.length + upcomingEvents.length) > 4 && (
              <Link
                href="/dashboard/calendar/upcoming"
                className="text-[10px] font-bold text-accent-sakura hover:underline transition-all"
              >
                All →
              </Link>
            )}
          </div>
          <div className="px-0.5">
            <UpcomingEventsList
              events={upcomingEvents.slice(0, todayEvents.length > 0 ? 2 : 4)}
              allowDelete={true}
            />
          </div>
        </div>
      )}

      {/* Empty state when no events */}
      {todayEvents.length === 0 && upcomingEvents.length === 0 && (
        <div className="pt-3 border-t border-border-subtle/30 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-muted">Upcoming</span>
          </div>
          <div className="px-0.5">
            <UpcomingEventsList
              events={[]}
              allowDelete={true}
            />
          </div>
        </div>
      )}

      {/* Quick links - refined as side-by-side buttons or clear actions */}
      <div className="pt-3 border-t border-border-subtle/30 grid grid-cols-2 gap-2">
          <Link
            href="/dashboard/calendar/new"
          className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-bg-surface border border-border-subtle hover:border-accent-sakura/40 hover:bg-bg-elevated transition-all group"
        >
          <CalendarIcon className="w-4 h-4 text-text-muted group-hover:text-accent-sakura transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-hover:text-text">Add</span>
        </Link>
        <Link
          href="/dashboard/subjects"
          className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-bg-surface border border-border-subtle hover:border-accent-teal/40 hover:bg-bg-elevated transition-all group"
        >
          <BookOpenIcon className="w-4 h-4 text-text-muted group-hover:text-accent-teal transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-hover:text-text">Study</span>
        </Link>
      </div>
    </div>
  );
}
