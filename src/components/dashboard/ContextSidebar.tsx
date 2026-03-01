'use client';

import { Calendar } from 'lucide-react';
import { CalendarPanel } from './CalendarPanel';
import type { CalendarEvent } from './MiniCalendar';

interface ContextSidebarProps {
  calendarEvents: CalendarEvent[];
  isOpen: boolean;
  onToggle: () => void;
}

export function ContextSidebar({ calendarEvents, isOpen, onToggle }: ContextSidebarProps) {
  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${!isOpen ? 'w-0 opacity-0 overflow-hidden' : 'w-full opacity-100'}
      `}
    >
      <div className="sticky top-6 min-w-0">
        <CalendarPanel calendarEvents={calendarEvents} onToggle={onToggle} />
      </div>
    </div>
  );
}

/** Button to open calendar panel when it's closed - positioned in hero */
export function CalendarPanelRestoreButton({
  isVisible,
  onRestore,
}: {
  isVisible: boolean;
  onRestore: () => void;
}) {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onRestore}
      className="cloud-surface absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-bg-elevated/90 backdrop-blur-sm border border-border-subtle shadow-md text-text-muted hover:text-text hover:border-accent-teal/45 transition-all hover:scale-105"
      aria-label="Open calendar panel"
      title="Open calendar (Cmd+\\)"
    >
      <Calendar size={18} />
    </button>
  );
}
