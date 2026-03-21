/**
 * Unified Scheduler Converters
 *
 * Functions to convert between existing data types (anchors, events, time blocks)
 * and the unified TimelineItem format.
 */

import type { DailyAnchor } from '@/lib/anchors';
import type {
  PlannerConstraintRule,
  PlannerQuadrant,
  TimeBlockEntry,
  TimeBlockDayPlan,
  TimeBlockFormState,
  TimeBlockPlannerDefaults,
} from '@/lib/time-block-planner';
import type { CalendarEventType, SectionColumnData, TimelineItem } from './types';
import { parseHHMMToMinutes } from './time-utils';
import { getActiveConstraintsForDay, getActiveQuadrantsForDay } from '@/lib/time-block-planner';

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Event Types (imported from MiniCalendar to avoid circular deps)
// ─────────────────────────────────────────────────────────────────────────────

export interface CalendarEventInput {
  id?: string;
  date: Date | string;
  endDate?: Date | string | null;
  type?: 'due' | 'holiday' | 'event' | 'reminder' | 'quiz' | 'appointment' | 'workout';
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
 * Only treat as date-only when string is exactly YYYY-MM-DD so same-day time ranges are preserved.
 */
function parseEventDate(input: Date | string): Date | null {
  if (typeof input === 'string' && input.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0, 0);
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
  const effectiveEndMinutes = effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes();
  const endMinute =
    effectiveEnd.getTime() > start.getTime()
      ? effectiveEndMinutes
      : startMinute === 12 * 60
        ? startMinute
        : startMinute + 60;

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

export function constraintToTimelineItem(
  constraint: PlannerConstraintRule,
  form: TimeBlockFormState,
): TimelineItem | null {
  const stopMinute = parseHHMMToMinutes(constraint.time);
  const startMinute =
    constraint.kind === 'until'
      ? parseHHMMToMinutes(form.startTime)
      : stopMinute;

  if (constraint.kind === 'until' && stopMinute <= startMinute) {
    return null;
  }

  return {
    id: `constraint-${constraint.id}`,
    type: 'constraint',
    label: constraint.displayText,
    startMinute,
    endMinute: constraint.kind === 'until' ? stopMinute : undefined,
    durationMinutes: constraint.kind === 'until' ? stopMinute - startMinute : undefined,
    constraintKind: constraint.kind,
    blockKind: constraint.target.kind,
    constraintTargetLabel: constraint.target.label,
  };
}

export function constraintsToTimelineItems(
  dayPlan: TimeBlockDayPlan,
  defaults?: TimeBlockPlannerDefaults,
): TimelineItem[] {
  const activeConstraints = getActiveConstraintsForDay(dayPlan, defaults);
  return activeConstraints
    .map((constraint) => constraintToTimelineItem(constraint, dayPlan.form))
    .filter((item): item is TimelineItem => item !== null);
}

export function quadrantToTimelineItem(quadrant: PlannerQuadrant): TimelineItem | null {
  const startMinute = parseHHMMToMinutes(quadrant.startTime);
  const endMinute = parseHHMMToMinutes(quadrant.endTime);
  if (endMinute <= startMinute) return null;

  return {
    id: `quadrant-${quadrant.id}`,
    type: 'quadrant',
    label: quadrant.label,
    startMinute,
    endMinute,
    durationMinutes: endMinute - startMinute,
    quadrantFocusItems: quadrant.focusItems,
    quadrantColorToken: quadrant.colorToken,
  };
}

export function quadrantsToTimelineItems(dayPlan: TimeBlockDayPlan): TimelineItem[] {
  return getActiveQuadrantsForDay(dayPlan)
    .map((quadrant) => quadrantToTimelineItem(quadrant))
    .filter((item): item is TimelineItem => item !== null);
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined Conversion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Combine all items and sort by start time.
 * Anchors come first at the same time, then events, then blocks.
 */
export function combineAndSortItems(
  quadrants: TimelineItem[],
  anchors: TimelineItem[],
  events: TimelineItem[],
  blocks: TimelineItem[],
  constraints: TimelineItem[] = [],
): TimelineItem[] {
  const all = [...quadrants, ...anchors, ...events, ...constraints, ...blocks];

  return all.sort((a, b) => {
    // Sort by start time
    if (a.startMinute !== b.startMinute) {
      return a.startMinute - b.startMinute;
    }

    // At same time: anchors first, then events, then blocks
    const typeOrder = { quadrant: 0, anchor: 1, event: 2, constraint: 3, 'time-block': 4 };
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

function findSectionIndexByMinute(sections: TimelineItem[], minute: number): number {
  return sections.findIndex((section) => minute >= section.startMinute && minute < (section.endMinute ?? section.startMinute));
}

export function groupItemsIntoSections(
  sections: TimelineItem[],
  items: TimelineItem[],
  constraints: TimelineItem[] = [],
): SectionColumnData[] {
  const activeSections = sections
    .filter((section) => section.type === 'quadrant' && (section.endMinute ?? section.startMinute) > section.startMinute)
    .sort((a, b) => a.startMinute - b.startMinute);

  return activeSections.map((section) => {
    const sectionItems = items
      .filter((item) => {
        if (item.isAllDay || item.type === 'quadrant' || item.type === 'constraint') return false;
        return item.startMinute >= section.startMinute && item.startMinute < (section.endMinute ?? section.startMinute);
      })
      .sort((a, b) => {
        if (a.startMinute !== b.startMinute) return a.startMinute - b.startMinute;
        const typeOrder = { anchor: 0, event: 1, 'time-block': 2, constraint: 3, quadrant: 4 };
        return typeOrder[a.type] - typeOrder[b.type];
      });

    const sectionConstraints = constraints
      .filter((constraint) => {
        const effectiveMinute = constraint.constraintKind === 'until'
          ? (constraint.endMinute ?? constraint.startMinute)
          : constraint.startMinute;
        return findSectionIndexByMinute(activeSections, effectiveMinute) === activeSections.indexOf(section);
      })
      .sort((a, b) => {
        const aMinute = a.constraintKind === 'until' ? (a.endMinute ?? a.startMinute) : a.startMinute;
        const bMinute = b.constraintKind === 'until' ? (b.endMinute ?? b.startMinute) : b.startMinute;
        return aMinute - bMinute;
      });

    return {
      id: section.id,
      label: section.label,
      startMinute: section.startMinute,
      endMinute: section.endMinute ?? section.startMinute,
      focusItems: section.quadrantFocusItems ?? [],
      colorToken: section.quadrantColorToken,
      items: sectionItems,
      constraints: sectionConstraints,
    };
  });
}
