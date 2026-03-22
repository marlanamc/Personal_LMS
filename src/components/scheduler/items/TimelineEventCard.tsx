'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { CalendarDays, Play } from 'lucide-react';
import type { TimelineItem, TimelineItemStatus } from '@/lib/unified-scheduler';
import { formatMinuteOfDay } from '@/lib/unified-scheduler';

// Event type colors (matching MiniCalendar)
function getEventColor(type?: string): string {
  if (type === 'holiday') return 'var(--color-accent-sage)';
  return 'var(--color-accent-terracotta)';
}

interface TimelineEventCardProps {
  item: TimelineItem;
  style?: CSSProperties;
  status: TimelineItemStatus;
  onClick?: () => void;
  /** When set, shows a Play icon linking to the Focus Timer for this event's duration */
  startTimerHref?: string;
}

export function TimelineEventCard({
  item,
  style,
  status,
  onClick,
  startTimerHref,
}: TimelineEventCardProps) {
  const eventColor = getEventColor(item.eventType);

  return (
    <div
      role="article"
      aria-label={`${item.label}, ${formatMinuteOfDay(item.startMinute)} to ${formatMinuteOfDay(item.endMinute ?? item.startMinute + 60)}`}
      className={`rounded-lg border border-border-subtle/40 bg-bg-elevated/80 backdrop-blur-sm shadow-sm flex flex-col justify-center px-2.5 py-1.5 sm:px-3 transition-all duration-200 hover:shadow-md hover:z-10 overflow-hidden cursor-pointer ${
        status === 'completed' ? 'opacity-60' : ''
      }`}
      style={{
        ...style,
        minHeight: 36,
      }}
      onClick={onClick}
    >
      {/* Accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[6px] rounded-l-lg"
        style={{ background: eventColor }}
      />

      <div className="pl-2.5 flex-1 min-w-0 flex flex-row items-center justify-between gap-2 overflow-hidden group/card">
        <div className="min-w-0 flex flex-col justify-center flex-1">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={10} className="shrink-0" style={{ color: eventColor }} />
            <span className="text-[13px] sm:text-[15px] font-body font-bold text-text/90 truncate">
              {item.label}
            </span>
          </div>
          <span className="block text-[11px] sm:text-[15px] font-body font-normal text-text-muted/70 mt-0.5 pl-[18px] whitespace-nowrap">
            {formatMinuteOfDay(item.startMinute)} – {formatMinuteOfDay(item.endMinute ?? item.startMinute + 60)}
          </span>
        </div>
        {startTimerHref ? (
          <Link
            href={startTimerHref}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 inline-flex items-center justify-center rounded-md p-1.5 text-text-muted/70 hover:bg-bg-surface/60 hover:text-accent-teal transition-colors sm:opacity-0 sm:group-hover/card:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-teal/40"
            aria-label={`Start timer for ${item.label}`}
            title="Start focus timer"
          >
            <Play size={12} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
