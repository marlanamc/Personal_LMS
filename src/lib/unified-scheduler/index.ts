/**
 * Unified Scheduler
 *
 * Shared infrastructure for the Day Planner and Calendar features.
 * Provides common types, time utilities, and converters for working with
 * daily anchors, calendar events, and time blocks.
 */

// Types
export type {
  CalendarEventType,
  DateKey,
  DayPlan,
  DayScheduleData,
  SectionColumnData,
  DayTask,
  TimelineConfig,
  TimelineItem,
  TimelineItemStatus,
  TimelineItemType,
  TimeOfDay,
} from './types';
export type { TimeBlockKind } from '@/lib/time-block-planner';

export { DEFAULT_TIMELINE_CONFIG } from './types';

// Time Utilities
export {
  // Date key functions
  toDateKey,
  dateKeyToDate,
  getTodayKey,
  isToday,
  getPreviousDateKey,
  getNextDateKey,
  // Time parsing
  parseHHMMToMinutes,
  parseTimeInput,
  minutesToTimeOfDay,
  // Time formatting
  formatMinuteOfDay,
  formatTimeLabel,
  formatShortTime,
  formatTimeFromMinutes,
  formatDuration,
  getTimeUntil,
  // Current time
  getCurrentMinuteOfDay,
  getNowMinuteForDate,
  // Timeline positioning
  getTimelineHeight,
  getPositionForMinute,
  getHeightForDuration,
  getPercentagePosition,
  generateTimeLabels,
  // Item status
  getItemStatus,
  isWithinNowWindow,
  // Overlap detection
  itemsOverlap,
  findOverlappingItems,
} from './time-utils';

// Converters
export type { CalendarEventInput } from './converters';

export {
  // Anchor converters
  anchorToTimelineItem,
  anchorsToTimelineItems,
  // Event converters
  eventTouchesDate,
  eventToTimelineItem,
  eventsToTimelineItems,
  separateAllDayEvents,
  constraintToTimelineItem,
  constraintsToTimelineItems,
  quadrantToTimelineItem,
  quadrantsToTimelineItems,
  groupItemsIntoSections,
  // Time block converters
  timeBlockToTimelineItem,
  timeBlocksToTimelineItems,
  // Combined
  combineAndSortItems,
  filterItemsInWindow,
} from './converters';
