'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, useSpring, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Columns2,
  FileText,
  Sparkles,
  SunMedium,
  StretchHorizontal,
  Wand2,
} from 'lucide-react';
import { type CalendarEvent } from '@/components/planning/MiniCalendar';
import { DayTimeline } from '@/components/scheduler';
import { DaySectionsBoard } from '@/components/dashboard/DaySectionsBoard';
import { DayPlannerSidebarWorkspace } from '@/components/dashboard/DayPlannerSidebarWorkspace';
import { useDailyAnchors } from '@/components/daily-anchors/useDailyAnchors';
import { useTimeBlockPlanner } from '@/components/dashboard/useTimeBlockPlanner';
import {
  anchorsToTimelineItems,
  combineAndSortItems,
  constraintsToTimelineItems,
  eventsToTimelineItems,
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
import { getCalendarMarkerColor } from '@/components/planning/MiniCalendar';
import { PlanningHelpDrawer } from '@/components/dashboard/PlanningHelpDrawer';
import { getConstraintDisplayDayPlan } from '@/lib/time-block-planner';
import {
  useDashboardHeaderCenterSetter,
  useDashboardHeaderEndAccessorySetter,
} from '@/components/dashboard/DashboardHeaderCenterContext';
import { DayPlannerHeaderDateNav } from '@/components/dashboard/DayPlannerHeaderDateNav';

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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setHeaderCenter = useDashboardHeaderCenterSetter();
  const setHeaderEndAccessory = useDashboardHeaderEndAccessorySetter();
  const syncHeaderDateNav = pathname === '/dashboard/day-planner';

  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [isDrawerOpen, setIsDrawerOpen] = useState(initialOpenTool === 'on-again-off-again');
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches,
  );
  const [plannerViewMode, setPlannerViewMode] = useState<'timeline' | 'sections'>('timeline');
  const [showAllDayEvents, setShowAllDayEvents] = useState(false);
  const [showEarlierHours, setShowEarlierHours] = useState(false);
  const planningHelpTriggerRef = useRef<HTMLElement | null>(null);
  const nowIndicatorRef = useRef<HTMLDivElement | null>(null);

  // Pull-to-reveal earlier hours (mobile)
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullStartY = useRef<number | null>(null);
  const pullLock = useRef<'none' | 'pull' | 'scroll'>('none');
  const hapticTriggered = useRef(false);
  const timelineSectionRef = useRef<HTMLElement>(null);
  const [hasUsedPullGesture, setHasUsedPullGesture] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('hasUsedTimelinePull') === 'true';
  });

  // Spring animation for pull distance
  const springPull = useSpring(0, { stiffness: 300, damping: 25 });
  const pullIndicatorY = useTransform(springPull, [0, 80], [0, 24]);
  const pullIndicatorOpacity = useTransform(springPull, [0, 40, 80], [hasUsedPullGesture ? 0.3 : 0.6, 0.8, 1]);

  // Data hooks
  const { getStateForDate } = useDailyAnchors(storageScope);
  const { plannerStore, plannerDefaults, setPlan, isLoaded: isPlannerLoaded } = useTimeBlockPlanner();

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

  const applyDateKey = useCallback(
    (key: string) => {
      setSelectedDateKey(key);
      if (syncHeaderDateNav) {
        const next = new URLSearchParams(searchParams.toString());
        next.set('date', key);
        router.replace(`/dashboard/day-planner?${next.toString()}`, { scroll: false });
      }
    },
    [syncHeaderDateNav, router, searchParams],
  );

  const urlDate = searchParams.get('date');
  useEffect(() => {
    if (pathname !== '/dashboard/day-planner') return;
    if (!urlDate || !/^\d{4}-\d{2}-\d{2}$/.test(urlDate)) return;
    setSelectedDateKey((current) => (urlDate !== current ? urlDate : current));
  }, [pathname, urlDate]);

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
    // Only get constraints after planner data is loaded
    if (!isPlannerLoaded) return [];
    const dayPlan = getConstraintDisplayDayPlan(selectedDateKey, plannerStore[selectedDateKey]);
    return constraintsToTimelineItems(dayPlan, plannerDefaults);
  }, [isPlannerLoaded, plannerDefaults, plannerStore, selectedDateKey]);
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

  useEffect(() => {
    if (!canUseSectionsView && plannerViewMode === 'sections') {
      setPlannerViewMode('timeline');
    }
  }, [canUseSectionsView, plannerViewMode]);

  // Navigation with haptic feedback
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
  }, []);

  const goToPreviousDay = useCallback(() => {
    triggerHaptic();
    applyDateKey(getPreviousDateKey(selectedDateKey));
  }, [triggerHaptic, applyDateKey, selectedDateKey]);

  const goToNextDay = useCallback(() => {
    triggerHaptic();
    applyDateKey(getNextDateKey(selectedDateKey));
  }, [triggerHaptic, applyDateKey, selectedDateKey]);


  // Format date for display
  const isSelectedToday = isToday(selectedDateKey);
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

  useLayoutEffect(() => {
    if (!syncHeaderDateNav || !setHeaderCenter || !setHeaderEndAccessory) return;

    // Mobile: keep the shell to one row — date nav lives in-page (see below).
    if (isMobile) {
      setHeaderCenter(null);
      setHeaderEndAccessory(null);
      return () => {
        setHeaderCenter(null);
        setHeaderEndAccessory(null);
      };
    }

    setHeaderCenter(
      <div className="flex items-center justify-center -my-2 transform scale-[0.80] sm:scale-100">
        <DayPlannerHeaderDateNav
          selectedDateKey={selectedDateKey}
          isSelectedToday={isSelectedToday}
          dateLabel={fullDateLabel}
          variant="desktopRail"
          onPrev={goToPreviousDay}
          onNext={goToNextDay}
          onPickDate={applyDateKey}
        />
      </div>
    );
    setHeaderEndAccessory(null);

    return () => {
      setHeaderCenter(null);
      setHeaderEndAccessory(null);
    };
  }, [
    syncHeaderDateNav,
    setHeaderCenter,
    setHeaderEndAccessory,
    isMobile,
    selectedDateKey,
    isSelectedToday,
    fullDateLabel,
    goToPreviousDay,
    goToNextDay,
    applyDateKey,
  ]);

  // Pull-to-reveal gesture handlers (mobile only)
  const canPullToReveal = isMobile && isSelectedToday && condensedStartHour > 6 && !showEarlierHours;

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!canPullToReveal || e.touches.length !== 1) return;

      // Check if we're at scroll top (allow small threshold for bounce)
      const scrollContainer = document.scrollingElement || document.documentElement;
      if (scrollContainer.scrollTop > 8) return;

      pullStartY.current = e.touches[0].clientY;
      pullLock.current = 'none';
      hapticTriggered.current = false;
    },
    [canPullToReveal],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canPullToReveal || pullStartY.current === null) return;

      const currentY = e.touches[0].clientY;
      const dy = currentY - pullStartY.current;

      // Lock to scroll if pulling up or already locked to scroll
      if (pullLock.current === 'scroll') return;
      if (dy < -5 && pullLock.current === 'none') {
        pullLock.current = 'scroll';
        return;
      }

      // Lock to pull if pulling down
      if (dy > 10 && pullLock.current === 'none') {
        pullLock.current = 'pull';
      }

      if (pullLock.current === 'pull') {
        e.preventDefault();
        setIsPulling(true);

        // Rubber-band easing: pull distance diminishes as you pull further
        const maxPull = 120;
        const rawPull = Math.min(Math.max(dy, 0), maxPull);
        const easedPull = rawPull * (1 - rawPull / (maxPull * 2));

        setPullDistance(easedPull);
        springPull.set(easedPull);

        // Haptic feedback at threshold
        if (easedPull >= 80 && !hapticTriggered.current) {
          hapticTriggered.current = true;
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(12);
          }
        }
      }
    },
    [canPullToReveal, springPull],
  );

  const handleTouchEnd = useCallback(() => {
    if (!canPullToReveal || pullStartY.current === null) return;

    const wasAtThreshold = pullDistance >= 80;

    if (wasAtThreshold && pullLock.current === 'pull') {
      // Reveal earlier hours
      setShowEarlierHours(true);
      setHasUsedPullGesture(true);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('hasUsedTimelinePull', 'true');
      }
    }

    // Reset pull state
    setPullDistance(0);
    setIsPulling(false);
    springPull.set(0);
    pullStartY.current = null;
    pullLock.current = 'none';
    hapticTriggered.current = false;
  }, [canPullToReveal, pullDistance, springPull]);

  // Calculate pull progress (0-1) for passing to DayTimeline
  const pullProgress = Math.min(pullDistance / 80, 1);

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

  const isSectionsMode = plannerViewMode === 'sections' && canUseSectionsView;

  return (
    <div className="space-y-2 sm:space-y-0">
      {/* Mobile: date lives in page content so the dashboard header stays a single row */}
      {syncHeaderDateNav && isMobile && (
        <div className="sm:hidden -mx-1 border-b border-border-subtle/30 pb-2.5 pt-0.5">
          <div className="mx-auto flex w-full max-w-[22rem] items-center justify-center">
            <DayPlannerHeaderDateNav
              selectedDateKey={selectedDateKey}
              isSelectedToday={isSelectedToday}
              dateLabel={fullDateLabel}
              variant="compact"
              embedded
              onPrev={goToPreviousDay}
              onNext={goToNextDay}
              onPickDate={applyDateKey}
            />
          </div>
        </div>
      )}

      {/* Mobile: view mode toggle */}
      {canUseSectionsView && (
      <header className="sm:hidden">
          <div className="flex items-center justify-center gap-3 py-1.5">
            <div className="inline-flex items-center gap-0.5 rounded-lg bg-bg-elevated/30 p-0.5">
              <button
                type="button"
                onClick={() => setPlannerViewMode('timeline')}
                className={`inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  plannerViewMode === 'timeline'
                    ? 'bg-bg-surface/80 text-text'
                    : 'text-text-muted hover:text-text'
                }`}
                aria-pressed={plannerViewMode === 'timeline'}
                aria-label="Timeline view"
              >
                <StretchHorizontal size={13} className="mr-1" />
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setPlannerViewMode('sections')}
                className={`inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  plannerViewMode === 'sections'
                    ? 'bg-bg-surface/80 text-text'
                    : 'text-text-muted hover:text-text'
                }`}
                aria-pressed={plannerViewMode === 'sections'}
                aria-label="Sections view"
              >
                <Columns2 size={13} className="mr-1" />
                Sections
              </button>
            </div>
          </div>
      </header>
      )}

      {/* Desktop: full date row only when not using dashboard header center */}
      <header className="hidden sm:block">
        {syncHeaderDateNav ? (
          canUseSectionsView ? (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="inline-flex items-center gap-0.5 rounded-lg bg-bg-elevated/30 p-0.5">
                <button
                  type="button"
                  onClick={() => setPlannerViewMode('timeline')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    plannerViewMode === 'timeline'
                      ? 'bg-bg-surface/80 text-text shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  aria-pressed={plannerViewMode === 'timeline'}
                >
                  <StretchHorizontal size={14} />
                  Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setPlannerViewMode('sections')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    plannerViewMode === 'sections'
                      ? 'bg-bg-surface/80 text-text shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  aria-pressed={plannerViewMode === 'sections'}
                  title="View sections side by side"
                >
                  <Columns2 size={14} />
                  Sections
                </button>
              </div>
            </div>
          ) : null
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousDay}
                className="rounded-full p-2 transition-colors hover:bg-bg-elevated/50"
                aria-label="Previous day"
              >
                <ArrowLeft size={18} className="text-text-muted" />
              </button>
              <label className="min-w-0 cursor-pointer">
                <span className="sr-only">Choose date</span>
                <span className="pointer-events-none inline-flex items-center gap-2">
                  <span className="font-display text-lg font-semibold leading-snug text-text sm:text-xl">
                    {fullDateLabel}
                  </span>
                  {isSelectedToday && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-sakura">
                      <SunMedium size={12} />
                      Today
                    </span>
                  )}
                </span>
                <input
                  type="date"
                  value={selectedDateKey}
                  onChange={(event) => applyDateKey(event.target.value || getTodayKey())}
                  className="sr-only"
                  aria-label="Choose date"
                />
              </label>
              <button
                type="button"
                onClick={goToNextDay}
                className="rounded-full p-2 transition-colors hover:bg-bg-elevated/50"
                aria-label="Next day"
              >
                <ArrowRight size={18} className="text-text-muted" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {canUseSectionsView && (
                <div className="inline-flex items-center gap-0.5 rounded-lg bg-bg-elevated/30 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPlannerViewMode('timeline')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      plannerViewMode === 'timeline'
                        ? 'bg-bg-surface/80 text-text shadow-sm'
                        : 'text-text-muted hover:text-text'
                    }`}
                    aria-pressed={plannerViewMode === 'timeline'}
                  >
                    <StretchHorizontal size={14} />
                    Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlannerViewMode('sections')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      plannerViewMode === 'sections'
                        ? 'bg-bg-surface/80 text-text shadow-sm'
                        : 'text-text-muted hover:text-text'
                    }`}
                    aria-pressed={plannerViewMode === 'sections'}
                    title="View sections side by side"
                  >
                    <Columns2 size={14} />
                    Sections
                  </button>
                </div>
              )}
              <Link
                href={`/dashboard/calendar?date=${selectedDateKey}`}
                className="rounded-full p-2 text-text-muted transition-all hover:bg-bg-elevated/50 hover:text-text"
                aria-label="Calendar"
                title="Calendar"
              >
                <CalendarDays size={18} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* All-day events - subtle inline (mobile only, desktop shows inside card) */}
      {allDayEvents.length > 0 && (
        <div className="px-1 sm:hidden">
          <button
            type="button"
            onClick={() => setShowAllDayEvents(!showAllDayEvents)}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-muted/70 hover:text-text-muted transition-colors"
          >
            <span>All-day</span>
            <span className="text-text-muted/50">({allDayEvents.length})</span>
            {showAllDayEvents ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showAllDayEvents && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {allDayEvents.map((event) => (
                <span
                  key={event.id}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-text/80"
                  style={{
                    background: `color-mix(in srgb, ${getCalendarMarkerColor(event.eventType)} 10%, transparent)`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: getCalendarMarkerColor(event.eventType) }}
                  />
                  {event.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Desktop: timeline card */}
      <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="rounded-3xl border border-border-subtle/40 bg-bg-surface/60 overflow-hidden shadow-sm">
          {/* Desktop timeline content */}
          <div className="relative px-6 py-6">
            {isSelectedToday && condensedStartHour > 6 && (
              <div className="absolute right-6 top-4 z-10">
                <button
                  type="button"
                  onClick={() => setShowEarlierHours((current) => !current)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-text-muted/70 hover:text-text-muted transition-colors"
                  aria-label={shouldCondenseTimeline ? 'Show earlier hours' : 'Hide passed time'}
                  title={shouldCondenseTimeline ? 'Show earlier hours' : 'Hide passed time'}
                >
                  <ChevronUp size={12} className={shouldCondenseTimeline ? '' : 'rotate-180'} />
                  {shouldCondenseTimeline ? 'Earlier hours' : 'Hide passed'}
                </button>
              </div>
            )}

            <div className="mt-10">
              {timelineItems.length === 0 && anchorItems.length === 0 ? (
                <div className="relative py-12 text-center">
                  <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-accent-teal/8 blur-3xl" />
                  </div>
                  <div className="relative mx-auto w-12 h-12 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-text-muted/40" />
                  </div>
                  <p className="relative text-sm text-text-muted/70 mb-5">
                    Nothing planned yet
                  </p>
                  <button
                    type="button"
                    onClick={(event) => openPlanningHelp(event.currentTarget)}
                    className="relative inline-flex items-center gap-1.5 text-sm font-medium text-accent-teal hover:text-accent-teal/80 transition-colors"
                  >
                    <Wand2 size={14} />
                    Start planning
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
                  isMobile={false}
                  config={timelineConfig}
                  nowIndicatorRef={nowIndicatorRef}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar: Monthly Calendar & Upcoming */}
        <DayPlannerSidebarWorkspace
          calendarEvents={events}
          storageScope={storageScope}
          dateKey={selectedDateKey}
          selectedDate={selectedDate}
          onDateSelect={(date: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            applyDateKey(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`);
          }}
        />
      </div>


      {/* Mobile: timeline card */}
      <div className="sm:hidden -mx-4 border-y border-border-subtle/40 bg-bg-surface/60 overflow-hidden pb-4">
        {/* Mobile timeline content */}
        <div className="relative">
          {/* See earlier button */}
          {isSelectedToday && condensedStartHour > 6 && (
            <div className="flex justify-center py-2">
              <button
                type="button"
                onClick={() => setShowEarlierHours((current) => !current)}
                className="inline-flex items-center gap-1 text-xs font-medium text-text-muted/60 hover:text-text-muted transition-colors"
              >
                <ChevronUp size={12} className={shouldCondenseTimeline ? '' : 'rotate-180'} />
                {shouldCondenseTimeline ? 'See earlier' : 'Hide earlier'}
              </button>
            </div>
          )}

          <div className="relative px-3 pb-4">
          {timelineItems.length === 0 && anchorItems.length === 0 ? (
            <div className="relative py-12 text-center">
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-accent-teal/8 blur-3xl" />
              </div>
              <div className="relative mx-auto w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-text-muted/40" />
              </div>
              <p className="relative text-sm text-text-muted/70 mb-5">
                Nothing planned yet
              </p>
              <button
                type="button"
                onClick={(event) => openPlanningHelp(event.currentTarget)}
                className="relative inline-flex items-center gap-1.5 text-sm font-medium text-accent-teal hover:text-accent-teal/80 transition-colors"
              >
                <Wand2 size={14} />
                Start planning
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
              isMobile={true}
              config={timelineConfig}
              nowIndicatorRef={nowIndicatorRef}
            />
          )}
          </div>
        </div>
      </div>

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

      {/* Floating Planning Help button (both mobile and desktop) */}
      <button
        type="button"
        ref={(node) => {
          if (node && !planningHelpTriggerRef.current) {
            planningHelpTriggerRef.current = node;
          }
        }}
        onClick={(event) => openPlanningHelp(event.currentTarget)}
        className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 lg:right-10 z-[110] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-teal to-accent-mint text-bg-base shadow-lg shadow-accent-teal/25 transition-all hover:scale-105 active:scale-95 touch-manipulation pointer-events-auto"
        aria-label="Planning Help"
      >
        <Wand2 size={22} className="animate-wand-wobble" />
        {/* First-time hint pulse ring */}
        {!hasUsedPullGesture && timelineItems.length === 0 && (
          <span className="absolute inset-0 rounded-full border-2 border-accent-teal fab-pulse-ring pointer-events-none" />
        )}
      </button>

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
