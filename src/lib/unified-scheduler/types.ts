/**
 * Unified Scheduler Types
 *
 * Shared type definitions for the Day Planner and Calendar features.
 * These types provide a common interface for representing timeline items
 * regardless of their source (anchors, events, or time blocks).
 */

import type { AnchorColor, AnchorIcon, AnchorStatus, SkipReason } from '@/lib/anchors';

// ─────────────────────────────────────────────────────────────────────────────
// Core Time Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a time of day as hours and minutes.
 * totalMinutes is the canonical form for calculations.
 */
export type TimeOfDay = {
  hour: number; // 0-23
  minute: number; // 0-59
  totalMinutes: number; // hour * 60 + minute
};

/**
 * Date string in YYYY-MM-DD format, used as keys for day-based storage.
 */
export type DateKey = string;

// ─────────────────────────────────────────────────────────────────────────────
// Timeline Item Types
// ─────────────────────────────────────────────────────────────────────────────

export type TimelineItemType = 'anchor' | 'event' | 'time-block';

/**
 * Event type from calendar events (assignments, holidays, etc.)
 */
export type CalendarEventType = 'due' | 'holiday' | 'event' | 'reminder' | 'quiz';

/**
 * Time block kind for On Again/Off Again planner
 */
export type TimeBlockKind = 'want' | 'should';

/**
 * Unified timeline item that can represent any schedulable thing.
 * This is the common interface used by the DayTimeline component.
 */
export interface TimelineItem {
  /** Unique identifier for this item */
  id: string;

  /** The type of item (determines rendering and behavior) */
  type: TimelineItemType;

  /** Display label */
  label: string;

  /** Start time in minutes from midnight (0-1439) */
  startMinute: number;

  /** End time in minutes from midnight. If undefined, item is a point-in-time marker. */
  endMinute?: number;

  /** Duration in minutes (computed from start/end or explicit) */
  durationMinutes?: number;

  /** Whether this item spans the entire day (e.g., holidays) */
  isAllDay?: boolean;

  // ─── Anchor-specific fields ───
  anchorIcon?: AnchorIcon;
  anchorColor?: AnchorColor;
  anchorStatus?: AnchorStatus;
  skipReason?: SkipReason;

  // ─── Event-specific fields ───
  eventType?: CalendarEventType;
  eventDescription?: string | null;

  // ─── Time Block-specific fields ───
  blockKind?: TimeBlockKind;
  blockNote?: string;
  isTrimmed?: boolean;
}

/**
 * Status of a timeline item relative to the current time.
 */
export type TimelineItemStatus = 'completed' | 'current' | 'upcoming';

// ─────────────────────────────────────────────────────────────────────────────
// Day Schedule Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple task for the day (used in notes/tasks section).
 */
export interface DayTask {
  id: string;
  text: string;
  done: boolean;
}

/**
 * Notes and tasks for a specific day.
 */
export interface DayPlan {
  notes: string;
  tasks: DayTask[];
}

/**
 * Complete schedule data for a single day.
 * This is the unified data structure returned by useDaySchedule hook.
 */
export interface DayScheduleData {
  /** Date key in YYYY-MM-DD format */
  dateKey: DateKey;

  /** Whether this is today */
  isToday: boolean;

  /** Daily anchor items for this date */
  anchors: TimelineItem[];

  /** Calendar events (assignments, holidays, appointments) */
  events: TimelineItem[];

  /** Generated time blocks from On Again/Off Again planner */
  timeBlocks: TimelineItem[];

  /** Notes and tasks for this day */
  plan: DayPlan;

  /** All items combined and sorted by start time */
  allItems: TimelineItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuration for the DayTimeline component.
 */
export interface TimelineConfig {
  /** Start hour of the timeline (default: 6) */
  startHour: number;

  /** End hour of the timeline (default: 24) */
  endHour: number;

  /** Pixels per minute for vertical positioning */
  pxPerMinute: number;

  /** Whether to show the current time indicator */
  showNowIndicator: boolean;

  /** Whether to show hour grid lines */
  showGridLines: boolean;
}

export const DEFAULT_TIMELINE_CONFIG: TimelineConfig = {
  startHour: 6,
  endHour: 24,
  /** Scale so 15-min blocks get ~33px, keeping short tasks legible */
  pxPerMinute: 2.2,
  showNowIndicator: true,
  showGridLines: true,
};
