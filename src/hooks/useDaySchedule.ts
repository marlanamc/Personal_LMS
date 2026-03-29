'use client';

import { useMemo } from 'react';
import { useDailyAnchors } from '@/components/daily-anchors/useDailyAnchors';
import { isAnchorScheduledForDate } from '@/lib/anchors';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { useTimeBlockPlanner } from '@/components/dashboard/useTimeBlockPlanner';
import { getConstraintDisplayDayPlan } from '@/lib/time-block-planner';
import {
  anchorsToTimelineItems,
  combineAndSortItems,
  constraintsToTimelineItems,
  eventsToTimelineItems,
  quadrantsToTimelineItems,
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
  const anchorsHook = useDailyAnchors(storageScope);
  const calendarHook = useCalendarPlanner(storageScope);
  const timeBlockHook = useTimeBlockPlanner();
  const selectedDate = useMemo(() => new Date(`${dateKey}T12:00:00`), [dateKey]);
  const anchorState = useMemo(() => anchorsHook.getStateForDate(selectedDate), [anchorsHook, selectedDate]);

  // Convert anchors to timeline items (only anchors scheduled for this date)
  const anchorItems = useMemo((): TimelineItem[] => {
    if (!anchorState.anchors || anchorState.anchors.length === 0) return [];
    const scheduledForDate = anchorState.anchors.filter((anchor) =>
      isAnchorScheduledForDate(anchor, selectedDate),
    );
    return anchorsToTimelineItems(scheduledForDate);
  }, [anchorState.anchors, selectedDate]);

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
  const quadrantItems = useMemo((): TimelineItem[] => {
    if (!dayPlan) return [];
    return quadrantsToTimelineItems(dayPlan);
  }, [dayPlan]);
  const constraintItems = useMemo((): TimelineItem[] => {
    const constraintPlan = getConstraintDisplayDayPlan(dateKey, dayPlan);
    return constraintsToTimelineItems(constraintPlan, timeBlockHook.plannerDefaults);
  }, [dateKey, dayPlan, timeBlockHook.plannerDefaults]);

  // Combine all items sorted by start time
  const allItems = useMemo((): TimelineItem[] => {
    return combineAndSortItems(quadrantItems, anchorItems, eventItems, blockItems, constraintItems);
  }, [quadrantItems, anchorItems, eventItems, blockItems, constraintItems]);

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
      quadrants: quadrantItems,
      plan,
      allItems,
    }),
    [dateKey, anchorItems, eventItems, blockItems, quadrantItems, plan, allItems],
  );

  // Loading state
  const isLoaded =
    anchorsHook.isLoaded && calendarHook.isLoaded && timeBlockHook.isLoaded;

  // Mutation helpers
  const toggleAnchor = (anchorId: string) => {
    anchorsHook.toggleAnchorForDate(selectedDate, anchorId);
  };

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
