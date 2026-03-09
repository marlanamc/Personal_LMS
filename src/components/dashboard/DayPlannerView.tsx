'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Heart,
  Sparkles,
  SunMedium,
  Target,
  Wand2,
} from 'lucide-react';
import { type CalendarEvent } from './MiniCalendar';
import { DayTimeline } from '@/components/scheduler';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import {
  anchorsToTimelineItems,
  combineAndSortItems,
  eventsToTimelineItems,
  formatDuration,
  getNextDateKey,
  getNowMinuteForDate,
  getPreviousDateKey,
  getTodayKey,
  isToday,
  separateAllDayEvents,
  timeBlocksToTimelineItems,
  type TimelineItem,
} from '@/lib/unified-scheduler';
import { getCalendarMarkerColor } from './MiniCalendar';
import { PlanningHelpDrawer } from './PlanningHelpDrawer';

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
  const [showAllDayEvents, setShowAllDayEvents] = useState(false);
  const [showEarlierHours, setShowEarlierHours] = useState(false);
  const planningHelpTriggerRef = useRef<HTMLElement | null>(null);

  // Data hooks
  const { anchors } = useDailyAnchorsForToday(storageScope);
  const { plannerStore } = useTimeBlockPlanner();

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
  const anchorItems = useMemo(() => {
    if (!anchors || anchors.length === 0) return [];
    return anchorsToTimelineItems(anchors);
  }, [anchors]);

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

  // Combine all items for the timeline
  const timelineItems = useMemo(() => {
    return combineAndSortItems(anchorItems, timedEvents, blockItems);
  }, [anchorItems, timedEvents, blockItems]);

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

  // Navigation
  const goToPreviousDay = () => setSelectedDateKey(getPreviousDateKey(selectedDateKey));
  const goToNextDay = () => setSelectedDateKey(getNextDateKey(selectedDateKey));
  const goToToday = () => setSelectedDateKey(getTodayKey());

  // Format date for display
  const selectedDate = new Date(`${selectedDateKey}T12:00:00`);
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

  const handleItemClick = (item: TimelineItem) => {
    // For now, just log. Could open details modal in the future.
    console.log('Item clicked:', item);
  };

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

        {blockSummary && (
          <div className="flex flex-wrap items-center gap-2 rounded-[1.4rem] border border-border-subtle/40 bg-bg-elevated/35 px-3.5 py-2.5 text-sm">
            {blockSummary.items.slice(0, 2).map((item) => (
              <span
                key={item.label}
                className={`inline-flex min-w-0 items-center gap-1 rounded-full px-2 py-1 ${
                  item.kind === 'want'
                    ? 'bg-accent-teal/10 text-accent-teal'
                    : 'bg-accent-sakura/10 text-accent-sakura'
                }`}
              >
                {item.kind === 'want' ? <Heart size={12} className="fill-current" /> : <Target size={12} />}
                <span className="truncate text-xs font-semibold">{item.label}</span>
                <span className="text-xs font-bold">{formatDuration(item.totalMinutes)}</span>
              </span>
            ))}
            <span className="text-xs font-medium text-text-muted">
              {blockSummary.blockCount} blocks
            </span>
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
            <button
              type="button"
              ref={(node) => {
                if (node && !planningHelpTriggerRef.current) {
                  planningHelpTriggerRef.current = node;
                }
              }}
              onClick={(event) => openPlanningHelp(event.currentTarget)}
              className={`inline-flex items-center justify-center gap-2 rounded-[1.75rem] border border-border-subtle/60 bg-bg-surface/80 px-4 py-[9px] text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated backdrop-blur-md h-[42px] ${isSelectedToday ? 'col-span-1' : ''}`}
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
        <div className="max-w-[36rem]">
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

          {blockSummary && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              {blockSummary.items.slice(0, 3).map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${
                    item.kind === 'want'
                      ? 'border-accent-teal/20 bg-accent-teal/8 text-accent-teal'
                      : 'border-accent-sakura/20 bg-accent-sakura/8 text-accent-sakura'
                  }`}
                >
                  {item.kind === 'want' ? <Heart size={12} className="fill-current" /> : <Target size={12} />}
                  <span className="font-medium">{item.label}</span>
                  <span className="font-semibold">{formatDuration(item.totalMinutes)}</span>
                </span>
              ))}
              <span className="ml-1 text-xs font-medium uppercase tracking-[0.16em] text-text-muted/75">
                {blockSummary.blockCount} blocks
              </span>
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
              href="/dashboard/calendar"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated backdrop-blur-md"
            >
              <CalendarDays size={15} />
              Calendar
            </Link>
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
                className="inline-flex shrink-0 items-center rounded-full border border-border-subtle/40 bg-bg-surface/65 px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm transition-colors hover:bg-bg-elevated hover:text-text"
              >
                {shouldCondenseTimeline ? 'Show earlier' : 'Hide passed time'}
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
          ) : (
            <DayTimeline
              dateKey={selectedDateKey}
              items={timelineItems}
              nowMinute={nowMinute}
              onItemClick={handleItemClick}
              isMobile={isMobile}
              config={timelineConfig}
            />
          )}
        </div>
      </section>

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
