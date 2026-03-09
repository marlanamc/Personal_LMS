'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Heart,
  Sparkles,
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
  formatMinuteOfDay,
  getNextDateKey,
  getNowMinuteForDate,
  getPreviousDateKey,
  getTodayKey,
  isToday,
  separateAllDayEvents,
  timeBlocksToTimelineItems,
  toDateKey,
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

  // Data hooks
  const { anchors } = useDailyAnchorsForToday(storageScope);
  const { plannerStore, isLoaded: timeBlocksLoaded } = useTimeBlockPlanner();

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

  const handleItemClick = (item: TimelineItem) => {
    // For now, just log. Could open details modal in the future.
    console.log('Item clicked:', item);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">
            Day Planner
          </p>
          <h1 className="mt-1 text-2xl sm:text-[1.875rem] leading-tight font-display font-bold text-text tracking-tight">
            {selectedDate.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h1>
          {isSelectedToday && (
            <p className="mt-1 text-sm text-accent-teal font-medium ml-1">Today</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Date navigation */}
          <div className="flex items-center gap-1 rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md p-1">
            <button
              type="button"
              onClick={goToPreviousDay}
              className="p-2 rounded-full hover:bg-bg-elevated transition-colors"
              aria-label="Previous day"
            >
              <ArrowLeft size={16} />
            </button>
            <input
              type="date"
              value={selectedDateKey}
              onChange={(e) => setSelectedDateKey(e.target.value || getTodayKey())}
              className="bg-transparent border-0 text-sm font-medium text-text focus:outline-none cursor-pointer"
              style={{ width: '130px' }}
            />
            <button
              type="button"
              onClick={goToNextDay}
              className="p-2 rounded-full hover:bg-bg-elevated transition-colors"
              aria-label="Next day"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          {!isSelectedToday && (
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-2 text-sm font-semibold text-accent-teal hover:bg-accent-teal/10 rounded-full transition-colors"
            >
              Today
            </button>
          )}

          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md px-4 py-2 text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated"
          >
            <CalendarDays size={15} />
            <span className="hidden sm:inline">Calendar</span>
          </Link>
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

      {/* Planning Help button */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md px-5 py-3 text-sm font-bold text-text shadow-sm transition-all hover:bg-bg-elevated hover:scale-[1.02] active:scale-[0.98]"
        >
          <Wand2 size={16} className="text-accent-teal" />
          Planning Help
        </button>

        {/* Block summary stats */}
        {blockSummary && (
          <div className="flex items-center gap-2 text-sm">
            {blockSummary.items.slice(0, 3).map((item) => (
              <span
                key={item.label}
                className={`inline-flex items-center gap-1 ${
                  item.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura'
                }`}
              >
                {item.kind === 'want' ? <Heart size={12} className="fill-current" /> : <Target size={12} />}
                <span className="font-medium">{item.label}:</span>
                <span className="font-semibold">{formatDuration(item.totalMinutes)}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main timeline */}
      <section className="relative rounded-[2rem] border border-border-subtle/30 p-4 sm:p-6 shadow-sm overflow-hidden bg-bg-surface/60 backdrop-blur-xl">
        {/* Ambient background */}
        <div className="absolute top-0 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-accent-sakura/8 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-accent-teal/8 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
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
                onClick={() => setIsDrawerOpen(true)}
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
            />
          )}
        </div>
      </section>

      {/* Planning Help drawer */}
      <PlanningHelpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dateKey={selectedDateKey}
        events={events}
        storageScope={storageScope}
      />
    </div>
  );
}
