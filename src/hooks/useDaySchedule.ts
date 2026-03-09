'use client';

import { useMemo } from 'react';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { useTimeBlockPlanner } from '@/components/dashboard/useTimeBlockPlanner';
import {
  anchorsToTimelineItems,
  combineAndSortItems,
  eventsToTimelineItems,
  timeBlocksToTimelineItems,
  isToday,
  type CalendarEventInput,
  type DayPlan,
  type DayScheduleData,
  type TimelineItem,
} from '@/lib/unified-scheduler';

/**
 * Unified hook for day schedule data.
 *
 * Composes existing hooks (anchors, calendar planner, time block planner)
 * and provides a unified interface for accessing all day-related data.
 *
 * @param dateKey - The date key in YYYY-MM-DD format
 * @param events - Calendar events from server (assignments, holidays, etc.)
 * @param storageScope - Storage scope for client-side persistence (usually userId)
 */
export function useDaySchedule(
  dateKey: string,
  events: CalendarEventInput[],
  storageScope: string,
) {
  // Compose existing hooks
  const anchorsHook = useDailyAnchorsForToday(storageScope);
  const calendarHook = useCalendarPlanner(storageScope);
  const timeBlockHook = useTimeBlockPlanner();

  // Convert anchors to timeline items
  const anchorItems = useMemo((): TimelineItem[] => {
    if (!anchorsHook.anchors || anchorsHook.anchors.length === 0) return [];
    return anchorsToTimelineItems(anchorsHook.anchors);
  }, [anchorsHook.anchors]);

  // Convert events to timeline items for the selected date
  const eventItems = useMemo((): TimelineItem[] => {
    return eventsToTimelineItems(events, dateKey);
  }, [events, dateKey]);

  // Get time blocks for the selected date
  const dayPlan = timeBlockHook.plannerStore[dateKey];
  const blockItems = useMemo((): TimelineItem[] => {
    if (!dayPlan?.blocks || dayPlan.blocks.length === 0) return [];
    return timeBlocksToTimelineItems(dayPlan.blocks, dayPlan.blockNotes);
  }, [dayPlan?.blocks, dayPlan?.blockNotes]);

  // Combine all items sorted by start time
  const allItems = useMemo((): TimelineItem[] => {
    return combineAndSortItems(anchorItems, eventItems, blockItems);
  }, [anchorItems, eventItems, blockItems]);

  // Get calendar planner data (notes/tasks) for the date
  const plan = calendarHook.getPlan(dateKey);

  // Build the unified schedule data
  const dayData: DayScheduleData = useMemo(
    () => ({
      dateKey,
      isToday: isToday(dateKey),
      anchors: anchorItems,
      events: eventItems,
      timeBlocks: blockItems,
      plan,
      allItems,
    }),
    [dateKey, anchorItems, eventItems, blockItems, plan, allItems],
  );

  // Loading state
  const isLoaded =
    anchorsHook.isLoaded && calendarHook.isLoaded && timeBlockHook.isLoaded;

  // Mutation helpers
  const toggleAnchor = anchorsHook.toggleAnchor;

  const updatePlan = (updates: Partial<DayPlan>) => {
    calendarHook.updatePlan(dateKey, { ...plan, ...updates });
  };

  const setTimeBlocks = timeBlockHook.setPlan;

  return {
    // Data
    dayData,

    // Individual item arrays (for convenience)
    anchors: anchorItems,
    events: eventItems,
    timeBlocks: blockItems,
    allItems,
    plan,

    // Mutations
    toggleAnchor,
    updatePlan,
    setTimeBlocks,

    // Loading state
    isLoaded,
    isSaving: calendarHook.isSaving || timeBlockHook.isSaving,
    saveError: calendarHook.saveError || timeBlockHook.saveError,
  };
}

export type UseDayScheduleReturn = ReturnType<typeof useDaySchedule>;
