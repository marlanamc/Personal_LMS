/**
 * Unified Scheduler Converters
 *
 * Functions to convert between existing data types (anchors, events, time blocks)
 * and the unified TimelineItem format.
 */

import type { DailyAnchor } from '@/lib/anchors';
import type { TimeBlockEntry } from '@/lib/time-block-planner';
import type { CalendarEventType, TimelineItem } from './types';
import { parseHHMMToMinutes } from './time-utils';

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Event Types (imported from MiniCalendar to avoid circular deps)
// ─────────────────────────────────────────────────────────────────────────────

export interface CalendarEventInput {
  id?: string;
  date: Date | string;
  endDate?: Date | string | null;
  type?: 'due' | 'holiday' | 'event' | 'reminder' | 'quiz';
  title?: string | null;
  description?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Anchor Converters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a DailyAnchor to a TimelineItem.
 * When endTime is set, the anchor is a block from scheduledTime to endTime; otherwise a point-in-time marker.
 */
export function anchorToTimelineItem(anchor: DailyAnchor): TimelineItem {
  const startMinute = parseHHMMToMinutes(anchor.scheduledTime);
  const endMinute =
    anchor.endTime && /^\d{2}:\d{2}$/.test(anchor.endTime)
      ? parseHHMMToMinutes(anchor.endTime)
      : undefined;
  const durationMinutes =
    endMinute != null && endMinute > startMinute ? endMinute - startMinute : undefined;

  return {
    id: `anchor-${anchor.id}`,
    type: 'anchor',
    label: anchor.label,
    startMinute,
    endMinute: endMinute != null && endMinute > startMinute ? endMinute : undefined,
    durationMinutes,
    anchorIcon: anchor.icon,
    anchorColor: anchor.color,
    anchorStatus: anchor.status,
    skipReason: anchor.skipReason,
  };
}

/**
 * Convert an array of DailyAnchor to TimelineItems.
 */
export function anchorsToTimelineItems(anchors: DailyAnchor[]): TimelineItem[] {
  return anchors.map(anchorToTimelineItem);
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Event Converters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse an event date, handling both Date objects and strings.
 */
function parseEventDate(input: Date | string): Date | null {
  if (typeof input === 'string') {
    // Handle YYYY-MM-DD format
    const match = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
    }
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Check if an event touches a specific date (for multi-day events).
 */
export function eventTouchesDate(event: CalendarEventInput, dateKey: string): boolean {
  const start = parseEventDate(event.date);
  if (!start) return false;

  const rawEnd = event.endDate ? parseEventDate(event.endDate) : null;
  const end = rawEnd && rawEnd.getTime() >= start.getTime() ? rawEnd : start;

  const target = new Date(`${dateKey}T12:00:00`);
  const targetStart = new Date(target);
  targetStart.setHours(0, 0, 0, 0);
  const targetEnd = targetStart.getTime() + 24 * 60 * 60 * 1000 - 1;

  return start.getTime() <= targetEnd && end.getTime() >= targetStart.getTime();
}

/**
 * Convert a CalendarEvent to a TimelineItem for a specific date.
 */
export function eventToTimelineItem(
  event: CalendarEventInput,
  dateKey: string,
): TimelineItem | null {
  const start = parseEventDate(event.date);
  if (!start || !eventTouchesDate(event, dateKey)) return null;

  const end = event.endDate ? parseEventDate(event.endDate) : null;
  const effectiveEnd = end && end.getTime() >= start.getTime() ? end : start;

  const startMinute = start.getHours() * 60 + start.getMinutes();
  const endMinute =
    effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes() ||
    (startMinute === 12 * 60 ? startMinute : startMinute + 60);

  // All-day events are when the time is exactly noon (our sentinel value)
  const isAllDay = start.getHours() === 12 && start.getMinutes() === 0 && !event.endDate;

  return {
    id: event.id || `event-${event.title || 'event'}-${start.toISOString()}`,
    type: 'event',
    label: event.title || 'Scheduled event',
    startMinute: isAllDay ? 0 : startMinute,
    endMinute: isAllDay ? 24 * 60 : Math.max(endMinute, startMinute + 30),
    durationMinutes: isAllDay ? 24 * 60 : Math.max(endMinute - startMinute, 30),
    isAllDay,
    eventType: event.type as CalendarEventType | undefined,
    eventDescription: event.description,
  };
}

/**
 * Convert an array of CalendarEvents to TimelineItems for a specific date.
 */
export function eventsToTimelineItems(
  events: CalendarEventInput[],
  dateKey: string,
): TimelineItem[] {
  return events
    .map((event) => eventToTimelineItem(event, dateKey))
    .filter((item): item is TimelineItem => item !== null);
}

/**
 * Separate all-day events from timed events.
 */
export function separateAllDayEvents(items: TimelineItem[]): {
  allDay: TimelineItem[];
  timed: TimelineItem[];
} {
  return {
    allDay: items.filter((item) => item.isAllDay),
    timed: items.filter((item) => !item.isAllDay),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Time Block Converters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a TimeBlockEntry to a TimelineItem.
 */
export function timeBlockToTimelineItem(
  block: TimeBlockEntry,
  blockNote?: string,
): TimelineItem {
  return {
    id: `block-${block.id}`,
    type: 'time-block',
    label: block.label,
    startMinute: block.startMinuteOfDay,
    endMinute: block.endMinuteOfDay,
    durationMinutes: block.durationMinutes,
    blockKind: block.kind,
    blockNote,
    isTrimmed: block.isTrimmed,
  };
}

/**
 * Convert an array of TimeBlockEntry to TimelineItems.
 */
export function timeBlocksToTimelineItems(
  blocks: TimeBlockEntry[],
  blockNotes?: Record<string, string>,
): TimelineItem[] {
  return blocks.map((block) =>
    timeBlockToTimelineItem(block, blockNotes?.[block.id]),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined Conversion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Combine all items and sort by start time.
 * Anchors come first at the same time, then events, then blocks.
 */
export function combineAndSortItems(
  anchors: TimelineItem[],
  events: TimelineItem[],
  blocks: TimelineItem[],
): TimelineItem[] {
  const all = [...anchors, ...events, ...blocks];

  return all.sort((a, b) => {
    // Sort by start time
    if (a.startMinute !== b.startMinute) {
      return a.startMinute - b.startMinute;
    }

    // At same time: anchors first, then events, then blocks
    const typeOrder = { anchor: 0, event: 1, 'time-block': 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
}

/**
 * Filter items to only those within a time window.
 */
export function filterItemsInWindow(
  items: TimelineItem[],
  startMinute: number,
  endMinute: number,
): TimelineItem[] {
  return items.filter((item) => {
    const itemEnd = item.endMinute ?? item.startMinute;
    return item.startMinute < endMinute && itemEnd > startMinute;
  });
}
