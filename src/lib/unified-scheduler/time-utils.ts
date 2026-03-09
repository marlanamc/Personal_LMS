/**
 * Unified Scheduler Time Utilities
 *
 * Shared time calculation and formatting functions for the Day Planner.
 * These are extracted from anchors.ts and time-block-planner.ts to provide
 * a single source of truth for time-related operations.
 */

import type { DateKey, TimeOfDay, TimelineConfig, TimelineItem, TimelineItemStatus } from './types';
import { DEFAULT_TIMELINE_CONFIG } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Date Key Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a Date to a YYYY-MM-DD date key string.
 */
export function toDateKey(date: Date): DateKey {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert a date key string to a Date object (at noon to avoid timezone issues).
 */
export function dateKeyToDate(dateKey: DateKey): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

/**
 * Get today's date key.
 */
export function getTodayKey(): DateKey {
  return toDateKey(new Date());
}

/**
 * Check if a date key represents today.
 */
export function isToday(dateKey: DateKey): boolean {
  return dateKey === getTodayKey();
}

/**
 * Get the previous day's date key.
 */
export function getPreviousDateKey(dateKey: DateKey): DateKey {
  const date = dateKeyToDate(dateKey);
  date.setDate(date.getDate() - 1);
  return toDateKey(date);
}

/**
 * Get the next day's date key.
 */
export function getNextDateKey(dateKey: DateKey): DateKey {
  const date = dateKeyToDate(dateKey);
  date.setDate(date.getDate() + 1);
  return toDateKey(date);
}

// ─────────────────────────────────────────────────────────────────────────────
// Time Parsing
// ─────────────────────────────────────────────────────────────────────────────

const TIME_KEY_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Parse a HH:MM string to total minutes from midnight.
 */
export function parseHHMMToMinutes(input: string): number {
  const [rawH = '0', rawM = '0'] = input.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

/**
 * Parse a HH:MM time input string, returning null if invalid.
 */
export function parseTimeInput(value: string): number | null {
  const match = value.match(TIME_KEY_PATTERN);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/**
 * Create a TimeOfDay object from minutes since midnight.
 */
export function minutesToTimeOfDay(totalMinutes: number): TimeOfDay {
  const safeMinutes = Math.max(0, Math.min(24 * 60 - 1, Math.round(totalMinutes)));
  return {
    hour: Math.floor(safeMinutes / 60),
    minute: safeMinutes % 60,
    totalMinutes: safeMinutes,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Time Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format total minutes as a 12-hour time string (e.g., "9 AM", "2:30 PM").
 */
export function formatMinuteOfDay(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.min(24 * 60, Math.round(totalMinutes)));
  const hour24 = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  if (minutes === 0) return `${hour12} ${period}`;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Format a HH:MM string as a 12-hour time label.
 */
export function formatTimeLabel(time: string): string {
  const [rawH = '0', rawM = '00'] = time.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Format a short time label (e.g., "9a", "2:30p").
 */
export function formatShortTime(time: string): string {
  return formatTimeLabel(time).replace(':00 ', '').replace(' AM', 'a').replace(' PM', 'p');
}

/**
 * Format minutes from midnight as HH:MM (24-hour format).
 */
export function formatTimeFromMinutes(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMinutes)));
  const hours = String(Math.floor(safeMinutes / 60)).padStart(2, '0');
  const minutes = String(safeMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format a duration in minutes as a human-readable string.
 */
export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  if (hours > 0 && mins === 30) return `${hours}.5 hours`;
  if (hours > 0 && mins > 0) return `${hours} hr ${mins} min`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${mins} min`;
}

/**
 * Get a human-readable "time until" string (e.g., "in 30m", "2h ago").
 */
export function getTimeUntil(targetMinutes: number, nowMinutes: number | null): string {
  if (nowMinutes === null) return 'Soon';
  const diffMinutes = targetMinutes - nowMinutes;

  if (diffMinutes < -60) {
    const hours = Math.abs(Math.floor(diffMinutes / 60));
    return `${hours}h ago`;
  }
  if (diffMinutes < 0) return `${Math.abs(diffMinutes)}m ago`;
  if (diffMinutes === 0) return 'Now';
  if (diffMinutes < 60) return `in ${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins === 0 ? `in ${hours}h` : `in ${hours}h ${mins}m`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Current Time
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current time as minutes from midnight.
 */
export function getCurrentMinuteOfDay(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Get current minute of day, or null if the given date key is not today.
 */
export function getNowMinuteForDate(dateKey: DateKey): number | null {
  if (!isToday(dateKey)) return null;
  return getCurrentMinuteOfDay();
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline Positioning
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the total height of the timeline in pixels.
 */
export function getTimelineHeight(config: TimelineConfig = DEFAULT_TIMELINE_CONFIG): number {
  const totalMinutes = (config.endHour - config.startHour) * 60;
  return Math.round(totalMinutes * config.pxPerMinute);
}

/**
 * Calculate the top position (in pixels) for a given minute.
 */
export function getPositionForMinute(
  minute: number,
  config: TimelineConfig = DEFAULT_TIMELINE_CONFIG,
  padding = 20,
): number {
  const startMinutes = config.startHour * 60;
  return (minute - startMinutes) * config.pxPerMinute + padding;
}

/**
 * Calculate the height in pixels for a duration.
 */
export function getHeightForDuration(
  durationMinutes: number,
  config: TimelineConfig = DEFAULT_TIMELINE_CONFIG,
  minHeight = 28,
): number {
  return Math.max(minHeight, durationMinutes * config.pxPerMinute - 2);
}

/**
 * Calculate the percentage position for a given minute (0-100).
 */
export function getPercentagePosition(
  minute: number,
  config: TimelineConfig = DEFAULT_TIMELINE_CONFIG,
): number {
  const startMinutes = config.startHour * 60;
  const endMinutes = config.endHour * 60;
  const totalMinutes = endMinutes - startMinutes;
  const position = ((minute - startMinutes) / totalMinutes) * 100;
  return Math.max(0, Math.min(100, position));
}

/**
 * Generate hour labels for the timeline.
 */
export function generateTimeLabels(
  config: TimelineConfig = DEFAULT_TIMELINE_CONFIG,
  stepMinutes = 60,
): Array<{ minute: number; label: string }> {
  const labels: Array<{ minute: number; label: string }> = [];
  const startMinutes = config.startHour * 60;
  const endMinutes = config.endHour * 60;

  labels.push({ minute: startMinutes, label: formatMinuteOfDay(startMinutes) });

  let m = Math.ceil((startMinutes + 1) / stepMinutes) * stepMinutes;
  while (m <= endMinutes) {
    labels.push({ minute: m, label: formatMinuteOfDay(m) });
    m += stepMinutes;
  }

  return labels;
}

// ─────────────────────────────────────────────────────────────────────────────
// Item Status
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine the status of a timeline item relative to the current time.
 */
export function getItemStatus(
  item: TimelineItem,
  nowMinute: number | null,
  dateKey: DateKey,
): TimelineItemStatus {
  const todayKey = getTodayKey();

  // Past days: all items are completed
  if (dateKey < todayKey) return 'completed';

  // Future days: all items are upcoming
  if (dateKey > todayKey) return 'upcoming';

  // Today: calculate based on time
  const nowMin = nowMinute ?? getCurrentMinuteOfDay();
  const endMinute = item.endMinute ?? item.startMinute;

  if (endMinute <= nowMin) return 'completed';
  if (item.startMinute <= nowMin) return 'current';
  return 'upcoming';
}

/**
 * Check if a time is within the "now window" (within 30 minutes after scheduled).
 */
export function isWithinNowWindow(scheduledMinute: number, nowMinute: number | null): boolean {
  if (nowMinute === null) return false;
  const diff = nowMinute - scheduledMinute;
  return diff >= 0 && diff <= 30;
}

// ─────────────────────────────────────────────────────────────────────────────
// Item Overlap Detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if two timeline items overlap.
 */
export function itemsOverlap(a: TimelineItem, b: TimelineItem): boolean {
  const aEnd = a.endMinute ?? a.startMinute;
  const bEnd = b.endMinute ?? b.startMinute;
  return a.startMinute < bEnd && aEnd > b.startMinute;
}

/**
 * Find items that overlap with a given item.
 */
export function findOverlappingItems(item: TimelineItem, items: TimelineItem[]): TimelineItem[] {
  return items.filter((other) => other.id !== item.id && itemsOverlap(item, other));
}
