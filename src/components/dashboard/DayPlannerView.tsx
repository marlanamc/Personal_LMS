'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Columns2,
  FileText,
  Heart,
  Play,
  Sparkles,
  SunMedium,
  StretchHorizontal,
  Target,
  Wand2,
} from 'lucide-react';
import { type CalendarEvent } from './MiniCalendar';
import { DayTimeline } from '@/components/scheduler';
import { DaySectionsBoard } from './DaySectionsBoard';
import { useDailyAnchors } from '@/components/daily-anchors/useDailyAnchors';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import {
  anchorsToTimelineItems,
  combineAndSortItems,
  constraintsToTimelineItems,
  eventsToTimelineItems,
  formatDuration,
  getNextDateKey,
  getNowMinuteForDate,
  getPreviousDateKey,
  groupItemsIntoSections,
  getTodayKey,
  isToday,
  quadrantsToTimelineItems,
  separateAllDayEvents,
  timeBlocksToTimelineItems,
  type TimelineItem,
} from '@/lib/unified-scheduler';
import { isAnchorScheduledForDate } from '@/lib/anchors';
import { getCalendarMarkerColor } from './MiniCalendar';
import { PlanningHelpDrawer } from './PlanningHelpDrawer';
import { MomentLogPanel } from './MomentLogPanel';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DayPlannerViewProps {
  events: CalendarEvent[];
  initialDateKey: string;
  initialOpenTool?: string | null;
  storageScope: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function DayPlannerView({
  events,
  initialDateKey,
  initialOpenTool,
  storageScope,
}: DayPlannerViewProps) {
  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [isDrawerOpen, setIsDrawerOpen] = useState(initialOpenTool === 'on-again-off-again');
  const [isMobile, setIsMobile] = useState(false);
  const [plannerViewMode, setPlannerViewMode] = useState<'timeline' | 'sections'>('timeline');
  const [showAllDayEvents, setShowAllDayEvents] = useState(false);
  const [showEarlierHours, setShowEarlierHours] = useState(false);
  const [momentLogCollapsed, setMomentLogCollapsed] = useState(true);
  const planningHelpTriggerRef = useRef<HTMLElement | null>(null);
  const nowIndicatorRef = useRef<HTMLDivElement | null>(null);

  // Data hooks
  const { getStateForDate } = useDailyAnchors(storageScope);
  const { plannerStore, plannerDefaults, setPlan } = useTimeBlockPlanner();

  // Block note editing (tap/double-click a block to add or edit notes)
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Current time tracking
  const [nowMinute, setNowMinute] = useState<number | null>(() => getNowMinuteForDate(selectedDateKey));

  // Mobile detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 639px)');
    const handleChange = () => setIsMobile(mql.matches);
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Update current time every minute
  useEffect(() => {
    if (!isToday(selectedDateKey)) {
      setNowMinute(null);
      return;
    }
    const update = () => setNowMinute(getNowMinuteForDate(selectedDateKey));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [selectedDateKey]);

  useEffect(() => {
    setShowEarlierHours(false);
  }, [selectedDateKey]);

  // Convert data to timeline items
  const eventItems = useMemo(() => {
    return eventsToTimelineItems(events, selectedDateKey);
  }, [events, selectedDateKey]);

  const { allDay: allDayEvents, timed: timedEvents } = useMemo(() => {
    return separateAllDayEvents(eventItems);
  }, [eventItems]);

  const blockItems = useMemo(() => {
    const dayPlan = plannerStore[selectedDateKey];
    if (!dayPlan?.blocks || dayPlan.blocks.length === 0) return [];
    return timeBlocksToTimelineItems(dayPlan.blocks, dayPlan.blockNotes);
  }, [plannerStore, selectedDateKey]);

  const constraintItems = useMemo(() => {
    const dayPlan = plannerStore[selectedDateKey];
    if (!dayPlan) return [];
    return constraintsToTimelineItems(dayPlan, plannerDefaults);
  }, [plannerDefaults, plannerStore, selectedDateKey]);
  const quadrantItems = useMemo(() => {
    const dayPlan = plannerStore[selectedDateKey];
    if (!dayPlan) return [];
    return quadrantsToTimelineItems(dayPlan);
  }, [plannerStore, selectedDateKey]);

  const selectedDate = useMemo(() => new Date(`${selectedDateKey}T12:00:00`), [selectedDateKey]);
  const selectedAnchorState = useMemo(() => getStateForDate(selectedDate), [getStateForDate, selectedDate]);
  const anchorItems = useMemo(() => {
    if (!selectedAnchorState.anchors || selectedAnchorState.anchors.length === 0) return [];
    const scheduledForDate = selectedAnchorState.anchors.filter((anchor) =>
      isAnchorScheduledForDate(anchor, selectedDate),
    );
    return anchorsToTimelineItems(scheduledForDate);
  }, [selectedAnchorState.anchors, selectedDate]);

  // Combine all items for the timeline
  const timelineItems = useMemo(() => {
    return combineAndSortItems(quadrantItems, anchorItems, timedEvents, blockItems, constraintItems);
  }, [quadrantItems, anchorItems, timedEvents, blockItems, constraintItems]);
  const canUseSectionsView = quadrantItems.length >= 2 && quadrantItems.length <= 5;
  const sectionColumns = useMemo(() => {
    if (!canUseSectionsView) return [];
    return groupItemsIntoSections(quadrantItems, timelineItems, constraintItems);
  }, [canUseSectionsView, constraintItems, quadrantItems, timelineItems]);

  // Calculate summary stats for blocks
  const blockSummary = useMemo(() => {
    if (blockItems.length === 0) return null;

    const byLabel = new Map<string, { kind: 'want' | 'should'; totalMinutes: number }>();
    for (const block of blockItems) {
      const existing = byLabel.get(block.label);
      const duration = block.durationMinutes ?? 30;
      if (existing) {
        existing.totalMinutes += duration;
      } else {
        byLabel.set(block.label, { kind: block.blockKind ?? 'want', totalMinutes: duration });
      }
    }

    const items = Array.from(byLabel.entries()).map(([label, data]) => ({
      label,
      kind: data.kind,
      totalMinutes: data.totalMinutes,
    }));

    const totalMinutes = items.reduce((sum, item) => sum + item.totalMinutes, 0);

    return { items, totalMinutes, blockCount: blockItems.length };
  }, [blockItems]);

  const quadrantSummary = useMemo(() => {
    return quadrantItems.map((quadrant) => ({
      id: quadrant.id,
      label: quadrant.label,
      focusItems: quadrant.quadrantFocusItems ?? [],
    }));
  }, [quadrantItems]);

  useEffect(() => {
    if (!canUseSectionsView && plannerViewMode === 'sections') {
      setPlannerViewMode('timeline');
    }
  }, [canUseSectionsView, plannerViewMode]);

  // Navigation
  const goToPreviousDay = () => setSelectedDateKey(getPreviousDateKey(selectedDateKey));
  const goToNextDay = () => setSelectedDateKey(getNextDateKey(selectedDateKey));
  const goToToday = () => setSelectedDateKey(getTodayKey());

  // Format date for display
  const isSelectedToday = isToday(selectedDateKey);
  const mobileDateLabel = selectedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const fullDateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const currentHour = nowMinute !== null ? Math.floor(nowMinute / 60) : null;
  const condensedStartHour =
    currentHour !== null
      ? Math.max(6, Math.min(22, currentHour - 1))
      : 6;
  const shouldCondenseTimeline =
    isSelectedToday && nowMinute !== null && condensedStartHour > 6 && !showEarlierHours;
  const timelineConfig = shouldCondenseTimeline
    ? { startHour: condensedStartHour }
    : undefined;

  const openPlanningHelp = (trigger: HTMLElement | null) => {
    planningHelpTriggerRef.current = trigger;
    setIsDrawerOpen(true);
  };

  const currentPlan = plannerStore[selectedDateKey];
  const patchBlockNote = useCallback(
    (blockId: string, value: string) => {
      if (!currentPlan) return;
      const blockNotes = currentPlan.blockNotes ?? {};
      setPlan(selectedDateKey, {
        ...currentPlan,
        blockNotes: { ...blockNotes, [blockId]: value },
      });
    },
    [currentPlan, selectedDateKey, setPlan],
  );

  const openBlockNote = useCallback(
    (item: TimelineItem) => {
      if (item.type !== 'time-block') return;
      const blockId = item.id.startsWith('block-') ? item.id.slice(6) : item.id;
      setEditingBlockId(blockId);
      setEditingNoteText((currentPlan?.blockNotes ?? {})[blockId] ?? '');
    },
    [currentPlan?.blockNotes],
  );

  const closeBlockNote = useCallback(() => {
    if (editingBlockId) {
      patchBlockNote(editingBlockId, editingNoteText);
      setEditingBlockId(null);
      setEditingNoteText('');
    }
  }, [editingBlockId, editingNoteText, patchBlockNote]);

  const handleItemClick = (item: TimelineItem) => {
    if (item.type === 'time-block') {
      openBlockNote(item);
    }
  };

  const buildStartTimerHref = useCallback((item: TimelineItem) => {
    if (item.type === 'time-block') {
      const duration = item.durationMinutes ?? (item.endMinute ?? item.startMinute + 30) - item.startMinute;
      return `/dashboard/timer?timeBlockLabel=${encodeURIComponent(item.label)}&timeBlockMinutes=${duration}`;
    }
    if (item.type === 'event') {
      const duration = (item.endMinute ?? item.startMinute + 60) - item.startMinute;
      return `/dashboard/timer?timeBlockLabel=${encodeURIComponent(item.label)}&timeBlockMinutes=${duration}`;
    }
    return undefined;
  }, []);

  const startSequenceHref = blockSummary
    ? `/dashboard/timer?sequenceDateKey=${encodeURIComponent(selectedDateKey)}`
    : null;
  const isSectionsMode = plannerViewMode === 'sections' && canUseSectionsView;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Mobile top area */}
      <section className="space-y-3 sm:hidden">
        <div>
          <p className="ml-1 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80">
            Day Planner
          </p>
          <div className="mt-2 flex items-center gap-2">
            <h1 className="text-[2rem] leading-[0.98] font-display font-bold tracking-tight text-text">
              {fullDateLabel}
            </h1>
            {isSelectedToday && (
              <span className="inline-flex items-center rounded-full bg-accent-teal/10 px-2.5 py-1 text-[11px] font-semibold text-accent-teal">
                Today
              </span>
            )}
          </div>
        </div>

        {canUseSectionsView && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-border-subtle/55 bg-bg-surface/85 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setPlannerViewMode('timeline')}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  plannerViewMode === 'timeline'
                    ? 'bg-bg-elevated text-text shadow-sm'
                    : 'text-text-muted hover:bg-bg-elevated/70 hover:text-text'
                }`}
                aria-pressed={plannerViewMode === 'timeline'}
              >
                <StretchHorizontal size={15} />
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setPlannerViewMode('sections')}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  plannerViewMode === 'sections'
                    ? 'bg-bg-elevated text-text shadow-sm'
                    : 'text-text-muted hover:bg-bg-elevated/70 hover:text-text'
                }`}
                aria-pressed={plannerViewMode === 'sections'}
                title="View sections side by side"
              >
                <Columns2 size={15} />
                Sections
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex min-w-0 items-center gap-1 rounded-[1.75rem] border border-border-subtle/60 bg-bg-surface/80 p-1 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={goToPreviousDay}
              className="rounded-full p-2.5 transition-colors hover:bg-bg-elevated"
              aria-label="Previous day"
            >
              <ArrowLeft size={18} />
            </button>
            <label className="min-w-0 flex-1 cursor-pointer rounded-full px-3 py-2 text-center hover:bg-bg-elevated/60">
              <span className="sr-only">Choose date</span>
              <span className="pointer-events-none inline-flex items-center gap-1.5 text-base font-semibold text-text">
                {mobileDateLabel}
                {isSelectedToday && <Sparkles size={14} className="text-accent-teal" />}
              </span>
              <input
                type="date"
                value={selectedDateKey}
                onChange={(event) => setSelectedDateKey(event.target.value || getTodayKey())}
                className="sr-only"
                aria-label="Choose date"
              />
            </label>
            <button
              type="button"
              onClick={goToNextDay}
              className="rounded-full p-2.5 transition-colors hover:bg-bg-elevated"
              aria-label="Next day"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            {!isSelectedToday && (
              <button
                type="button"
                onClick={goToToday}
                className="inline-flex items-center justify-center rounded-full border border-accent-teal/20 bg-accent-teal/8 px-4 py-[9px] text-sm font-semibold text-accent-teal transition-colors hover:bg-accent-teal/12 h-[42px]"
              >
                Today
              </button>
            )}
            {startSequenceHref ? (
              <Link
                href={startSequenceHref}
                className="inline-flex items-center justify-center gap-2 rounded-[1.75rem] border border-accent-teal/40 bg-accent-teal/10 px-4 py-[9px] text-sm font-semibold text-accent-teal transition-colors hover:bg-accent-teal/20 backdrop-blur-md h-[42px]"
                title="Start full sequence in Focus Timer"
              >
                <Play size={15} />
                Start Sequence
              </Link>
            ) : null}
            <button
              type="button"
              ref={(node) => {
                if (node && !planningHelpTriggerRef.current) {
                  planningHelpTriggerRef.current = node;
                }
              }}
              onClick={(event) => openPlanningHelp(event.currentTarget)}
              className={`inline-flex items-center justify-center gap-2 rounded-[1.75rem] border border-border-subtle/60 bg-bg-surface/80 px-4 py-[9px] text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated backdrop-blur-md h-[42px] ${isSelectedToday && !startSequenceHref ? 'col-span-1' : ''}`}
            >
              <Wand2 size={15} className="text-accent-teal" />
              Planning Help
            </button>
            {isSelectedToday && condensedStartHour > 6 ? (
              <button
                type="button"
                onClick={() => setShowEarlierHours((current) => !current)}
                className="w-[42px] h-[42px] inline-flex items-center justify-center rounded-full border border-border-subtle/60 bg-bg-surface text-text-secondary shadow-sm transition-colors hover:bg-bg-elevated hover:text-text backdrop-blur-md shrink-0"
                aria-label={shouldCondenseTimeline ? 'Show earlier hours' : 'Hide passed time'}
                title={shouldCondenseTimeline ? 'Show earlier hours' : 'Hide passed time'}
              >
                <SunMedium size={18} className="text-accent-teal" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Desktop header */}
      <header className="hidden sm:flex items-end justify-between gap-6">
        <div className="max-w-[40rem]">
          <p className="ml-1 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80">
            Day Planner
          </p>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-[2.35rem] leading-none font-display font-bold tracking-tight text-text">
              {fullDateLabel}
            </h1>
            {isSelectedToday && (
              <span className="inline-flex items-center rounded-full bg-accent-teal/10 px-2.5 py-1 text-xs font-semibold text-accent-teal">
                Today
              </span>
            )}
          </div>

          {canUseSectionsView && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full border border-border-subtle/55 bg-bg-surface/85 p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setPlannerViewMode('timeline')}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    plannerViewMode === 'timeline'
                      ? 'bg-bg-elevated text-text shadow-sm'
                      : 'text-text-muted hover:bg-bg-elevated/70 hover:text-text'
                  }`}
                  aria-pressed={plannerViewMode === 'timeline'}
                >
                  <StretchHorizontal size={15} />
                  Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setPlannerViewMode('sections')}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    plannerViewMode === 'sections'
                      ? 'bg-bg-elevated text-text shadow-sm'
                      : 'text-text-muted hover:bg-bg-elevated/70 hover:text-text'
                  }`}
                  aria-pressed={plannerViewMode === 'sections'}
                  title="View sections side by side"
                >
                  <Columns2 size={15} />
                  Sections
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex min-w-0 items-center gap-1 rounded-full border border-border-subtle/60 bg-bg-surface/80 p-1 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={goToPreviousDay}
              className="rounded-full p-2.5 transition-colors hover:bg-bg-elevated"
              aria-label="Previous day"
            >
              <ArrowLeft size={18} />
            </button>
            <label className="min-w-0 cursor-pointer rounded-full px-4 py-1.5 text-center hover:bg-bg-elevated/60">
              <span className="sr-only">Choose date</span>
              <span className="pointer-events-none inline-flex items-center gap-1.5 text-sm font-semibold text-text">
                {selectedDate.toLocaleDateString(undefined)}
                {isSelectedToday && <Sparkles size={14} className="text-accent-teal" />}
              </span>
              <input
                type="date"
                value={selectedDateKey}
                onChange={(event) => setSelectedDateKey(event.target.value || getTodayKey())}
                className="sr-only"
                aria-label="Choose date"
              />
            </label>
            <button
              type="button"
              onClick={goToNextDay}
              className="rounded-full p-2.5 transition-colors hover:bg-bg-elevated"
              aria-label="Next day"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isSelectedToday && (
              <button
                type="button"
                onClick={goToToday}
                className="inline-flex items-center justify-center rounded-full border border-accent-teal/20 bg-accent-teal/8 px-4 py-2.5 text-sm font-semibold text-accent-teal transition-colors hover:bg-accent-teal/12"
              >
                Today
              </button>
            )}
            <Link
              href={`/dashboard/calendar?date=${selectedDateKey}`}
              className="inline-flex items-center justify-center rounded-full border border-border-subtle/60 bg-bg-surface/80 p-2.5 text-text-secondary shadow-sm transition-all hover:bg-bg-elevated hover:text-text backdrop-blur-md"
              aria-label="Calendar"
              title="Calendar"
            >
              <CalendarDays size={18} />
            </Link>
            {startSequenceHref ? (
              <Link
                href={startSequenceHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-teal/40 bg-accent-teal/10 px-4 py-2.5 text-sm font-semibold text-accent-teal transition-all hover:bg-accent-teal/20 backdrop-blur-md"
                title="Start full sequence in Focus Timer"
              >
                <Play size={15} />
                Start Sequence
              </Link>
            ) : null}
            <button
              type="button"
              ref={(node) => {
                if (node && !planningHelpTriggerRef.current) {
                  planningHelpTriggerRef.current = node;
                }
              }}
              onClick={(event) => openPlanningHelp(event.currentTarget)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle/60 bg-bg-surface/80 px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated backdrop-blur-md"
            >
              <Wand2 size={15} className="text-accent-teal" />
              Planning Help
            </button>
          </div>
        </div>
      </header>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="rounded-2xl border border-border-subtle/40 bg-bg-elevated/40 p-4">
          <button
            type="button"
            onClick={() => setShowAllDayEvents(!showAllDayEvents)}
            className="flex items-center justify-between w-full text-left"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              All-Day ({allDayEvents.length})
            </p>
            {showAllDayEvents ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showAllDayEvents && (
            <div className="mt-3 flex flex-wrap gap-2">
              {allDayEvents.map((event) => (
                <span
                  key={event.id}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium text-text"
                  style={{
                    borderColor: `color-mix(in srgb, ${getCalendarMarkerColor(event.eventType)} 35%, var(--color-border-subtle))`,
                    background: `color-mix(in srgb, ${getCalendarMarkerColor(event.eventType)} 14%, var(--color-bg-surface))`,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: getCalendarMarkerColor(event.eventType) }}
                  />
                  {event.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Moment Log Panel */}
      <MomentLogPanel
        dateKey={selectedDateKey}
        storageScope={storageScope}
        collapsed={momentLogCollapsed}
        onToggleCollapse={() => setMomentLogCollapsed(!momentLogCollapsed)}
      />

      {/* Main timeline */}
      <section className="relative overflow-hidden sm:rounded-[2rem] border-transparent sm:border sm:border-border-subtle/30 sm:bg-bg-surface/60 p-0 py-2 sm:p-6 sm:shadow-sm sm:backdrop-blur-xl -mx-4 sm:mx-0">
        {/* Ambient background (desktop only) */}
        <div className="hidden sm:block absolute top-0 right-0 w-[400px] h-[400px] bg-accent-sakura/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-teal/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-0">
          {isSelectedToday && condensedStartHour > 6 && !isMobile && (
            <div className="mb-3 flex justify-end sm:mb-4">
              <button
                type="button"
                onClick={() => setShowEarlierHours((current) => !current)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle/60 bg-bg-surface text-text-secondary shadow-sm transition-colors hover:bg-bg-elevated hover:text-text backdrop-blur-md"
                aria-label={shouldCondenseTimeline ? 'Show earlier hours' : 'Hide passed time'}
                title={shouldCondenseTimeline ? 'Show earlier hours' : 'Hide passed time'}
              >
                <SunMedium size={18} className="text-accent-teal" />
              </button>
            </div>
          )}

          {timelineItems.length === 0 && anchorItems.length === 0 ? (
            <div className="rounded-xl sm:rounded-[2rem] border border-dashed border-border-subtle/40 bg-bg-elevated/30 backdrop-blur-sm p-6 sm:p-10 text-center">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-teal/20 to-accent-sakura/20 border border-border-subtle/50 mb-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-accent-teal" />
              </div>
              <p className="text-base sm:text-lg font-display font-bold text-text/90">
                No plans yet for this day
              </p>
              <p className="mt-2 text-sm text-text-secondary/80">
                Use <span className="font-semibold text-accent-teal">Planning Help</span> to generate time blocks.
              </p>
              <button
                type="button"
                onClick={(event) => openPlanningHelp(event.currentTarget)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-teal to-accent-mint px-5 py-2.5 text-sm font-bold text-bg-base transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent-teal/20"
              >
                <Wand2 size={14} />
                Get Started
              </button>
            </div>
          ) : isSectionsMode ? (
            <DaySectionsBoard
              dateKey={selectedDateKey}
              sections={sectionColumns}
              nowMinute={nowMinute}
              onItemClick={handleItemClick}
              buildStartTimerHref={buildStartTimerHref}
            />
          ) : (
            <DayTimeline
              dateKey={selectedDateKey}
              items={timelineItems}
              nowMinute={nowMinute}
              onItemClick={handleItemClick}
              buildStartTimerHref={buildStartTimerHref}
              isMobile={isMobile}
              config={timelineConfig}
              nowIndicatorRef={nowIndicatorRef}
            />
          )}
        </div>
      </section>

      {/* Block note modal (tap/click a time block to add notes) */}
      {editingBlockId ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeBlockNote}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeBlockNote();
          }}
          role="presentation"
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border-subtle/40 bg-bg-surface shadow-2xl p-5 sm:p-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Block note"
            aria-modal="true"
          >
            <div className="sm:hidden flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-border-subtle/60" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-teal/15">
                <FileText size={14} className="text-accent-teal" />
              </div>
              <div>
                <p className="text-sm font-bold text-text">Block Note</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">What to work on</p>
              </div>
            </div>
            <textarea
              value={editingNoteText}
              onChange={(e) => setEditingNoteText(e.target.value)}
              placeholder="e.g. Fix login bug, refactor utils, review PR..."
              rows={4}
              className="w-full rounded-xl border border-border-subtle/40 bg-bg-elevated/80 px-4 py-3 font-medium text-text placeholder:text-text-muted/50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50 resize-none"
              style={{ fontSize: '15px' }}
              autoFocus
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-text-muted">Tap outside or press Escape to save</p>
              <button
                type="button"
                onClick={closeBlockNote}
                className="px-4 py-2 rounded-xl bg-accent-teal text-bg-base text-sm font-bold hover:brightness-110 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Planning Help drawer */}
      <PlanningHelpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dateKey={selectedDateKey}
        triggerRef={planningHelpTriggerRef}
      />
    </div>
  );
}
