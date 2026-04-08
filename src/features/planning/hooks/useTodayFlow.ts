'use client';

import { useMemo } from 'react';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import {
  isAnchorScheduledForDate,
  parseHHMMToMinutes,
  type DailyAnchor,
} from '@/lib/anchors';
import { getTodayKey } from '@/lib/unified-scheduler';
import { computeDailyOverviewProgress } from '@/lib/daily-overview-progress';
import {
  getConstraintDisplayDayPlan,
  getActiveConstraintsForDay,
} from '@/lib/time-block-planner';
import {
  type CalendarPlannerApi,
  type InterstitialJournalEntry,
  type PlannerTask,
} from '@/features/planning/hooks/useCalendarPlanner';
import type { CalendarEvent } from '@/features/planning/types';
import { useTimeBlockPlanner } from '@/features/planning/hooks/useTimeBlockPlanner';

// Extended PlannerTask with optional anchor pinning
export interface PinnedPlannerTask extends PlannerTask {
  anchorId?: string;
}

export interface TimeWindow {
  anchor: DailyAnchor;
  startMinute: number;
  endMinute: number;
  events: CalendarEvent[];
  tasks: PinnedPlannerTask[];
  momentEntries: InterstitialJournalEntry[];
  isActive: boolean;
  isUpNext: boolean;
  isDone: boolean;
}

export interface TodayFlowState {
  timeWindows: TimeWindow[];
  unpinnedTasks: PinnedPlannerTask[];
  thoughtDownload: string;
  momentEntries: InterstitialJournalEntry[];
  isLoaded: boolean;
  isSaving: boolean;
  saveError: string | null;
  lastSyncedAt: Date | null;
  todayKey: string;
  todaySummary: {
    completedAnchors: number;
    totalAnchors: number;
    /** Anchors + calendar + boundaries (optional sessions), same formula as Daily Overview. */
    completionPercent: number;
    completedOverviewItems: number;
    totalOverviewItems: number;
    activeAnchor: DailyAnchor | null;
    upNextAnchor: DailyAnchor | null;
    minutesUntilNext: number | null;
  };
  // Actions
  updateThoughtDownload: (value: string) => void;
  addTask: (text: string, anchorId?: string) => void;
  toggleTask: (taskId: string) => void;
  addMomentEntry: (text: string, anchorId?: string) => void;
  updateTasks: (tasks: PinnedPlannerTask[]) => void;
}

function getEventMinutes(event: CalendarEvent): number {
  const date = new Date(event.date);
  return date.getHours() * 60 + date.getMinutes();
}

function isEventAllDay(event: CalendarEvent): boolean {
  const date = new Date(event.date);
  return date.getHours() === 12 && date.getMinutes() === 0;
}

function isEventToday(event: CalendarEvent, todayKey: string): boolean {
  const date = new Date(event.date);
  const eventKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return eventKey === todayKey;
}

function getEntryMinutes(entry: InterstitialJournalEntry): number {
  const date = new Date(entry.createdAt);
  return date.getHours() * 60 + date.getMinutes();
}

function buildTimeWindows(
  anchors: DailyAnchor[],
  events: CalendarEvent[],
  tasks: PinnedPlannerTask[],
  momentEntries: InterstitialJournalEntry[],
  nowMinutes: number,
  todayKey: string
): { timeWindows: TimeWindow[]; unpinnedTasks: PinnedPlannerTask[] } {
  if (anchors.length === 0) {
    return {
      timeWindows: [],
      unpinnedTasks: tasks,
    };
  }

  // Sort anchors by scheduled time
  const sortedAnchors = [...anchors].sort(
    (a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime)
  );

  // Find active and up-next anchors
  let activeAnchorIdx = -1;
  let upNextAnchorIdx = -1;

  for (let i = 0; i < sortedAnchors.length; i++) {
    const anchor = sortedAnchors[i];
    const startMin = parseHHMMToMinutes(anchor.scheduledTime);
    const endMin = anchor.endTime
      ? parseHHMMToMinutes(anchor.endTime)
      : i < sortedAnchors.length - 1
        ? parseHHMMToMinutes(sortedAnchors[i + 1].scheduledTime)
        : 24 * 60;

    // Active: current time is within this anchor's window and not done/skipped
    if (
      nowMinutes >= startMin &&
      nowMinutes < endMin &&
      anchor.status !== 'done' &&
      anchor.status !== 'skipped'
    ) {
      activeAnchorIdx = i;
    }
  }

  // Up next: first waiting anchor after now
  for (let i = 0; i < sortedAnchors.length; i++) {
    const anchor = sortedAnchors[i];
    const startMin = parseHHMMToMinutes(anchor.scheduledTime);
    if (startMin > nowMinutes && anchor.status === 'waiting') {
      upNextAnchorIdx = i;
      break;
    }
  }

  // Filter to today's timed events only (exclude all-day and other days)
  const timedEvents = events.filter(
    (e) => isEventToday(e, todayKey) && !isEventAllDay(e)
  );

  // Build time windows
  const timeWindows: TimeWindow[] = sortedAnchors.map((anchor, idx) => {
    const startMinute = parseHHMMToMinutes(anchor.scheduledTime);
    const endMinute = anchor.endTime
      ? parseHHMMToMinutes(anchor.endTime)
      : idx < sortedAnchors.length - 1
        ? parseHHMMToMinutes(sortedAnchors[idx + 1].scheduledTime)
        : 24 * 60;

    // Events in this window
    const windowEvents = timedEvents.filter((event) => {
      const eventMin = getEventMinutes(event);
      return eventMin >= startMinute && eventMin < endMinute;
    });

    // Tasks pinned to this anchor
    const windowTasks = tasks.filter((task) => task.anchorId === anchor.id);

    // Moment entries in this window
    const windowMoments = momentEntries.filter((entry) => {
      const entryMin = getEntryMinutes(entry);
      return entryMin >= startMinute && entryMin < endMinute;
    });

    const isDone = anchor.status === 'done' || anchor.status === 'skipped';
    const isActive = idx === activeAnchorIdx;
    const isUpNext = idx === upNextAnchorIdx;

    return {
      anchor,
      startMinute,
      endMinute,
      events: windowEvents,
      tasks: windowTasks,
      momentEntries: windowMoments,
      isActive,
      isUpNext,
      isDone,
    };
  });

  // Unpinned tasks (no anchorId)
  const unpinnedTasks = tasks.filter((task) => !task.anchorId);

  return { timeWindows, unpinnedTasks };
}

export function useTodayFlow(
  storageScope: string,
  calendarEvents: CalendarEvent[],
  /** Must be the same instance passed to {@link DailyOverviewList} so acknowledgements update the progress bar. */
  calendarPlanner: CalendarPlannerApi
): TodayFlowState {
  const { anchors } = useDailyAnchorsForToday(storageScope);
  const {
    getPlan,
    updatePlanField,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
  } = calendarPlanner;

  const { plannerStore, plannerDefaults, isLoaded: isPlannerLoaded } = useTimeBlockPlanner();

  const today = useMemo(() => new Date(), []);
  const todayKey = getTodayKey();
  const todayPlan = getPlan(todayKey);

  const currentPlan = plannerStore[todayKey];
  const activeConstraints = useMemo(() => {
    if (!isPlannerLoaded) return [];
    const constraintPlan = getConstraintDisplayDayPlan(todayKey, currentPlan);
    return getActiveConstraintsForDay(constraintPlan, plannerDefaults);
  }, [currentPlan, plannerDefaults, isPlannerLoaded, todayKey]);

  // Current time in minutes
  const nowMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  // Filter anchors for today
  const todayAnchors = useMemo(
    () =>
      anchors
        .filter((anchor) => isAnchorScheduledForDate(anchor, today))
        .sort(
          (a, b) =>
            parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime)
        ),
    [anchors, today]
  );

  // Build time windows with events and tasks
  const { timeWindows, unpinnedTasks } = useMemo(() => {
    // Cast tasks to PinnedPlannerTask (they may not have anchorId yet)
    const tasks = (todayPlan.tasks || []) as PinnedPlannerTask[];
    const moments = todayPlan.interstitialJournalEntries || [];

    return buildTimeWindows(
      todayAnchors,
      calendarEvents,
      tasks,
      moments,
      nowMinutes,
      todayKey
    );
  }, [todayAnchors, calendarEvents, todayPlan.tasks, todayPlan.interstitialJournalEntries, nowMinutes, todayKey]);

  // Summary stats
  const todaySummary = useMemo(() => {
    const completedAnchors = todayAnchors.filter(
      (a) => a.status === 'done'
    ).length;
    const totalAnchors = todayAnchors.length;

    const ack = todayPlan.acknowledgements || {
      boundaries: [] as string[],
      events: [] as string[],
      sessions: [] as string[],
      plans: [] as string[],
    };
    const { percent: completionPercent, completed: completedOverviewItems, total: totalOverviewItems } =
      computeDailyOverviewProgress({
        todayAnchors,
        calendarEvents,
        todayKey,
        activeConstraints,
        acknowledgements: ack,
      });

    // Find active and up-next anchors
    let activeAnchor: DailyAnchor | null = null;
    let upNextAnchor: DailyAnchor | null = null;

    for (const tw of timeWindows) {
      if (tw.isActive) activeAnchor = tw.anchor;
      if (tw.isUpNext) upNextAnchor = tw.anchor;
    }

    // Calculate minutes until next
    let minutesUntilNext: number | null = null;
    if (upNextAnchor) {
      minutesUntilNext = parseHHMMToMinutes(upNextAnchor.scheduledTime) - nowMinutes;
    }

    return {
      completedAnchors,
      totalAnchors,
      completionPercent,
      completedOverviewItems,
      totalOverviewItems,
      activeAnchor,
      upNextAnchor,
      minutesUntilNext,
    };
  }, [
    todayAnchors,
    timeWindows,
    nowMinutes,
    calendarEvents,
    todayKey,
    activeConstraints,
    todayPlan.acknowledgements,
  ]);

  // Actions
  const updateThoughtDownload = (value: string) => {
    updatePlanField(todayKey, 'thoughtDownload', value);
  };

  const updateTasks = (tasks: PinnedPlannerTask[]) => {
    updatePlanField(todayKey, 'tasks', tasks);
  };

  const addTask = (text: string, anchorId?: string) => {
    const newTask: PinnedPlannerTask = {
      id: crypto.randomUUID(),
      text,
      done: false,
      anchorId,
    };
    updateTasks([...((todayPlan.tasks || []) as PinnedPlannerTask[]), newTask]);
  };

  const toggleTask = (taskId: string) => {
    const tasks = (todayPlan.tasks || []) as PinnedPlannerTask[];
    updateTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const addMomentEntry = (text: string, _anchorId?: string) => {
    const now = new Date();
    const [year, month, day] = todayKey.split('-').map(Number);
    const timestamp = new Date(
      year,
      (month ?? 1) - 1,
      day ?? 1,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    ).toISOString();

    const newEntry: InterstitialJournalEntry = {
      id: crypto.randomUUID(),
      text,
      createdAt: timestamp,
    };

    updatePlanField(todayKey, 'interstitialJournalEntries', [
      newEntry,
      ...(todayPlan.interstitialJournalEntries || []),
    ]);
  };

  return {
    timeWindows,
    unpinnedTasks,
    thoughtDownload: todayPlan.thoughtDownload || '',
    momentEntries: todayPlan.interstitialJournalEntries || [],
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
    todayKey,
    todaySummary,
    updateThoughtDownload,
    addTask,
    toggleTask,
    addMomentEntry,
    updateTasks,
  };
}
