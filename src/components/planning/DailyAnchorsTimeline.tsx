'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, GripVertical, LocateFixed, Moon } from 'lucide-react';
import { EditAnchorsSheet } from '@/components/dashboard/EditAnchorsSheet';
import { AnchorSkipReasonDialog } from '@/features/planning/components/AnchorSkipReasonDialog';
import { DailyOverviewList } from '@/features/planning/components/DailyOverviewList';
import type { DailyAnchorsApi } from '@/components/daily-anchors/useDailyAnchors';
import type { CalendarPlannerApi } from '@/features/planning/hooks/useCalendarPlanner';
import { formatTimeRange, getActiveAnchor, getRecentSkippedAnchorStreak, getSkipReasonLabel, getSkipReasonSuggestion, isAnchorScheduledForDate, parseHHMMToMinutes, toDateKey, type AnchorId, type AnchorStatus, type DailyAnchor, type DailyAnchorTemplate, type SkipReason } from '@/lib/anchors';
import { formatDuration, formatShortTime, getMinutesBetweenEvents, getOvernightMinutesUntil, getTimeUntil } from '@/lib/anchors-mobile-ui';
import { getActiveConstraintsForDay, getActiveTimeBlockStatus, getConstraintDisplayDayPlan, type TimeBlockKind } from '@/lib/time-block-planner';
import { useTimeBlockPlanner } from '@/features/planning/hooks/useTimeBlockPlanner';
import type { CalendarEvent } from '@/features/planning/types';
import { getSunTimelineTimes, type SunLocation } from '@/lib/bostonDaylight';
import { iconByName, TIMELINE_START_HOUR, TIMELINE_END_HOUR, SUN_LOCATION_STORAGE_KEY, DEFAULT_SUN_LOCATION, TIMELINE_DAY_ZONES, getTimePosition, minutesToHHMM, oaoaRhythmSegmentStyle, getDayProgressPercentFromMinutes, getTimePositionFromMinutes, getTimelineSegmentBounds, formatNowLabel, normalizeSunLocation, isRangeAnchorInProgress, positionToTime, getRiverFlowGradient } from './daily-anchors-timeline/helpers';
import { TimelineNowMarker, DesktopPlannerRiverOverlays } from './daily-anchors-timeline/overlays';
import { MobileAnchorsTimelineStrip } from './daily-anchors-timeline/MobileAnchorsTimelineStrip';

interface DailyAnchorsTimelineProps {
  calendarEvents: CalendarEvent[];
  calendarPlanner: CalendarPlannerApi;
  dailyAnchors: DailyAnchorsApi;
}


export function DailyAnchorsTimeline({
  calendarEvents,
  calendarPlanner,
  dailyAnchors,
}: DailyAnchorsTimelineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getPlan, updatePlanField } = calendarPlanner;
  const { getStateForDate, toggleAnchorForDate, setAnchorStatusForDate, setAnchorsForDate, anchorTemplates, setAnchorTemplates, isLoaded, weeklySkipReasonInsight } =
    dailyAnchors;

  // Date navigation: default to today, allow browsing up to 7 days back
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [sunLocation, setSunLocation] = useState<SunLocation>(DEFAULT_SUN_LOCATION);
  const [isUsingLocalSun, setIsUsingLocalSun] = useState(false);
  const [sunLocationStatus, setSunLocationStatus] = useState<string | null>(null);
  const isToday = useMemo(() => {
    const today = new Date();
    return toDateKey(viewDate) === toDateKey(today);
  }, [viewDate]);

  const viewDateState = getStateForDate(viewDate);
  const anchors = useMemo(
    () => (isLoaded ? viewDateState.anchors : []),
    [isLoaded, viewDateState.anchors],
  );
  const anchorsScheduledForView = useMemo(
    () => anchors.filter((anchor) => isAnchorScheduledForDate(anchor, viewDate)),
    [anchors, viewDate],
  );
  const activeAnchor = useMemo(
    () => getActiveAnchor(anchorsScheduledForView.length > 0 ? anchorsScheduledForView : anchors, viewDate),
    [anchorsScheduledForView, anchors, viewDate],
  );

  const toggleAnchor = useCallback(
    (anchorId: AnchorId) => toggleAnchorForDate(viewDate, anchorId),
    [toggleAnchorForDate, viewDate],
  );
  const setTodayAnchors = useCallback(
    (nextAnchors: DailyAnchor[]) => setAnchorsForDate(viewDate, nextAnchors),
    [setAnchorsForDate, viewDate],
  );
  const setTodayAnchorStatus = useCallback(
    (anchorId: AnchorId, status: AnchorStatus, skipReason?: SkipReason) =>
      setAnchorStatusForDate(viewDate, anchorId, status, skipReason),
    [setAnchorStatusForDate, viewDate],
  );

  const [hoveredAnchor, setHoveredAnchor] = useState<AnchorId | null>(null);
  const [draggingAnchor, setDraggingAnchor] = useState<AnchorId | null>(null);
  const [dragPreviewTime, setDragPreviewTime] = useState<string | null>(null);
  const [dragPreviewEndTime, setDragPreviewEndTime] = useState<string | null>(null);
  const draggedAnchorDurationRef = useRef<number | null>(null);
  const [isEditingAnchors, setIsEditingAnchors] = useState(false);
  const [skipReasonAnchor, setSkipReasonAnchor] = useState<{ id: AnchorId; label: string } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const todaysAnchors = anchorsScheduledForView;

  const viewDateKey = useMemo(() => toDateKey(viewDate), [viewDate]);
  const todayPlan = getPlan(viewDateKey);

  const { plannerStore, plannerDefaults, isLoaded: isPlannerLoaded } = useTimeBlockPlanner();
  const currentPlan = plannerStore[viewDateKey];
  const activeConstraintsForRiver = useMemo(() => {
    if (!isPlannerLoaded) return [];
    const constraintPlan = getConstraintDisplayDayPlan(viewDateKey, currentPlan);
    return getActiveConstraintsForDay(constraintPlan, plannerDefaults);
  }, [currentPlan, plannerDefaults, isPlannerLoaded, viewDateKey]);

  const todayCalendarEventsForRiver = useMemo(
    () =>
      calendarEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const eventKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
        return eventKey === viewDateKey;
      }),
    [calendarEvents, viewDateKey],
  );

  const sortedAnchors = useMemo(() => {
    return [...todaysAnchors].sort((a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime));
  }, [todaysAnchors]);

  const skippedTodayCount = useMemo(
    () => sortedAnchors.filter((anchor) => anchor.status === 'skipped').length,
    [sortedAnchors],
  );

  const visibleSortedAnchors = useMemo(
    () => sortedAnchors.filter((anchor) => anchor.status !== 'skipped'),
    [sortedAnchors],
  );

  /** Matches DailyOverviewList: anchors (done) + events/boundaries (acknowledged). */
  const overviewProgress = useMemo(() => {
    const ack = todayPlan?.acknowledgements ?? {
      boundaries: [] as string[],
      events: [] as string[],
      sessions: [] as string[],
      plans: [] as string[],
      notices: [] as string[],
    };
    let completed = 0;
    let total = 0;
    for (const a of visibleSortedAnchors) {
      total += 1;
      if (a.status === 'done') completed += 1;
    }
    for (const event of todayCalendarEventsForRiver) {
      total += 1;
      const eventId = event.id ?? `event-${event.date}`;
      if (ack.events.includes(eventId)) completed += 1;
    }
    for (const c of activeConstraintsForRiver) {
      total += 1;
      if (ack.boundaries.includes(c.id)) completed += 1;
    }
    return { completed, total };
  }, [visibleSortedAnchors, todayCalendarEventsForRiver, activeConstraintsForRiver, todayPlan?.acknowledgements]);

  const overviewCompletedCount = overviewProgress.completed;
  const overviewTotalCount = overviewProgress.total;
  const isOverviewAllComplete = overviewTotalCount > 0 && overviewCompletedCount === overviewTotalCount;

  const isAllComplete = isOverviewAllComplete;
  const wakeAnchorForToday = useMemo(
    () => todaysAnchors.find((anchor) => anchor.id === 'wake') || todaysAnchors.find((anchor) => anchor.icon === 'sunrise'),
    [todaysAnchors],
  );

  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  /** Track fill + “now” line: time elapsed in the 6:00–24:00 window (not anchor completion). */
  const dayProgressPercent = useMemo(() => {
    if (nowMinutes === null) return 0;
    return getDayProgressPercentFromMinutes(nowMinutes);
  }, [nowMinutes]);

  const showNowMarker = useMemo(() => {
    if (!isToday) return false;
    if (nowMinutes === null) return false;
    return nowMinutes >= TIMELINE_START_HOUR * 60 && nowMinutes < TIMELINE_END_HOUR * 60;
  }, [isToday, nowMinutes]);

  const recentSkippedStreak = useMemo(
    () => getRecentSkippedAnchorStreak(sortedAnchors, nowMinutes),
    [sortedAnchors, nowMinutes],
  );
  const noticeAcknowledgements = todayPlan?.acknowledgements?.notices ?? [];
  const isSkipStreakNoticeAcknowledged = noticeAcknowledgements.includes('daily-overview-skip-streak');
  const weeklySkipInsightNoticeId = weeklySkipReasonInsight
    ? `daily-overview-weekly-skip-reason:${weeklySkipReasonInsight.anchorId}:${weeklySkipReasonInsight.reason}`
    : null;
  const isWeeklySkipInsightAcknowledged = weeklySkipInsightNoticeId
    ? noticeAcknowledgements.includes(weeklySkipInsightNoticeId)
    : false;

  const acknowledgeOverviewNotice = useCallback((noticeId: string) => {
    const current = todayPlan?.acknowledgements ?? {
      boundaries: [] as string[],
      events: [] as string[],
      sessions: [] as string[],
      plans: [] as string[],
      notices: [] as string[],
    };
    if (current.notices.includes(noticeId)) return;
    updatePlanField(viewDateKey, 'acknowledgements', {
      ...current,
      notices: [...current.notices, noticeId],
    });
  }, [todayPlan?.acknowledgements, updatePlanField, viewDateKey]);

  /** On Again / Off Again: horizontal bands + alternating gap ticks (desktop + mobile river). */
  const onAgainRhythm = useMemo(() => {
    if (!isPlannerLoaded) {
      return {
        segments: [] as Array<{
          id: string;
          kind: TimeBlockKind;
          label: string;
          left: number;
          width: number;
          isActive: boolean;
        }>,
        gapMarkers: [] as Array<{ id: string; left: number; prevKind: TimeBlockKind }>,
      };
    }
    const blocks = currentPlan?.blocks ?? [];
    const active =
      isToday && nowMinutes !== null ? getActiveTimeBlockStatus(viewDateKey, blocks, nowMinutes) : null;

    const segments: Array<{
      id: string;
      kind: TimeBlockKind;
      label: string;
      left: number;
      width: number;
      isActive: boolean;
    }> = [];

    for (const block of blocks) {
      if (block.endMinuteOfDay <= block.startMinuteOfDay) continue;
      const left = getTimePosition(minutesToHHMM(block.startMinuteOfDay));
      const right = getTimePosition(minutesToHHMM(block.endMinuteOfDay));
      const width = Math.max(right - left, 0.2);
      if (width <= 0) continue;
      segments.push({
        id: block.id,
        kind: block.kind,
        label: block.label,
        left,
        width,
        isActive: active?.block.id === block.id,
      });
    }

    const gapMarkers: Array<{ id: string; left: number; prevKind: TimeBlockKind }> = [];
    for (let i = 0; i < blocks.length - 1; i += 1) {
      if (blocks[i].kind === blocks[i + 1].kind) continue;
      const gapStart = blocks[i].endMinuteOfDay;
      const gapEnd = blocks[i + 1].startMinuteOfDay;
      if (gapEnd <= gapStart) continue;
      const mid = (gapStart + gapEnd) / 2;
      gapMarkers.push({
        id: `oaoa-gap-${blocks[i].id}-${blocks[i + 1].id}`,
        left: getTimePosition(minutesToHHMM(mid)),
        prevKind: blocks[i].kind,
      });
    }

    return { segments, gapMarkers };
  }, [currentPlan, isPlannerLoaded, isToday, nowMinutes, viewDateKey]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SUN_LOCATION_STORAGE_KEY);
      if (!stored) return;
      const normalized = normalizeSunLocation(JSON.parse(stored));
      if (!normalized) return;
      setSunLocation(normalized);
      setIsUsingLocalSun(true);
    } catch {
      window.localStorage.removeItem(SUN_LOCATION_STORAGE_KEY);
    }
  }, []);

  const handleUseCurrentSunLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setSunLocationStatus('Location is not available in this browser.');
      return;
    }

    setSunLocationStatus('Requesting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation: SunLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_SUN_LOCATION.timeZone,
        };
        setSunLocation(nextLocation);
        setIsUsingLocalSun(true);
        setSunLocationStatus('Using your local sun times.');
        window.localStorage.setItem(SUN_LOCATION_STORAGE_KEY, JSON.stringify(nextLocation));
      },
      () => {
        setSunLocationStatus('Location permission was not granted.');
      },
      { enableHighAccuracy: false, maximumAge: 86_400_000, timeout: 10_000 },
    );
  }, []);

  const handleDragStart = useCallback((anchorId: AnchorId, e: React.MouseEvent | React.TouchEvent) => {
    if (!isToday) return; // no drag-retime on past days
    e.preventDefault();
    setHoveredAnchor(null);

    // Calculate duration for range anchors
    const anchor = anchors.find(a => a.id === anchorId);
    if (anchor?.endTime) {
      const startMinutes = parseHHMMToMinutes(anchor.scheduledTime);
      const endMinutes = parseHHMMToMinutes(anchor.endTime);
      draggedAnchorDurationRef.current = endMinutes - startMinutes;
    } else {
      draggedAnchorDurationRef.current = null;
    }

    setDraggingAnchor(anchorId);
  }, [anchors, isToday]);

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggingAnchor || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const positionPercent = ((clientX - rect.left) / rect.width) * 100;
      let newStartTime = positionToTime(positionPercent);

      // Calculate end time preview for range anchors
      if (draggedAnchorDurationRef.current !== null) {
        let newStartMinutes = parseHHMMToMinutes(newStartTime);
        let newEndMinutes = newStartMinutes + draggedAnchorDurationRef.current;

        // Clamp to timeline bounds - shift start if end would exceed
        const maxEndMinutes = TIMELINE_END_HOUR * 60;
        if (newEndMinutes > maxEndMinutes) {
          newStartMinutes = maxEndMinutes - draggedAnchorDurationRef.current;
          newEndMinutes = maxEndMinutes;
          const startHours = Math.floor(newStartMinutes / 60);
          const startMins = newStartMinutes % 60;
          newStartTime = `${String(startHours).padStart(2, '0')}:${String(startMins).padStart(2, '0')}`;
        }

        const endHours = Math.floor(newEndMinutes / 60);
        const endMins = newEndMinutes % 60;
        const newEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
        setDragPreviewEndTime(newEndTime);
      } else {
        setDragPreviewEndTime(null);
      }

      setDragPreviewTime(newStartTime);
    },
    [draggingAnchor],
  );

  const handleDragEnd = useCallback(() => {
    if (!draggingAnchor || !dragPreviewTime) {
      setDraggingAnchor(null);
      setDragPreviewTime(null);
      setDragPreviewEndTime(null);
      draggedAnchorDurationRef.current = null;
      return;
    }

    const updatedTodayAnchors = anchors.map((anchor) => {
      if (anchor.id !== draggingAnchor) return anchor;
      return {
        ...anchor,
        scheduledTime: dragPreviewTime,
        ...(dragPreviewEndTime ? { endTime: dragPreviewEndTime } : {}),
        isTimeOverridden: true,
      };
    });
    setTodayAnchors(updatedTodayAnchors);
    setDraggingAnchor(null);
    setDragPreviewTime(null);
    setDragPreviewEndTime(null);
    draggedAnchorDurationRef.current = null;
  }, [draggingAnchor, dragPreviewTime, dragPreviewEndTime, anchors, setTodayAnchors]);

  useEffect(() => {
    if (!draggingAnchor) return;

    const onMove = (e: MouseEvent | TouchEvent) => handleDragMove(e);
    const onEnd = () => handleDragEnd();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [draggingAnchor, handleDragMove, handleDragEnd]);

  const openAnchorEditor = useCallback(() => {
    setIsEditingAnchors(true);
  }, []);

  const closeAnchorEditor = useCallback(() => {
    setIsEditingAnchors(false);
  }, []);

  const handleToggleSkipToday = useCallback((anchorId: AnchorId, isSkipped: boolean) => {
    if (isSkipped) {
      setTodayAnchorStatus(anchorId, 'waiting');
      return;
    }
    const anchorLabel = anchors.find((anchor) => anchor.id === anchorId)?.label || 'this anchor';
    setSkipReasonAnchor({ id: anchorId, label: anchorLabel });
  }, [anchors, setTodayAnchorStatus]);

  const handleConfirmSkipReason = useCallback((skipReason?: SkipReason) => {
    if (!skipReasonAnchor) return;
    setTodayAnchorStatus(skipReasonAnchor.id, 'skipped', skipReason);
    setSkipReasonAnchor(null);
  }, [setTodayAnchorStatus, skipReasonAnchor]);

  useEffect(() => {
    if (searchParams.get('anchors') !== 'edit') return;
    router.replace('/dashboard/anchors', { scroll: false });
  }, [searchParams, router]);

  const handleSaveAnchors = useCallback((templates: DailyAnchorTemplate[]) => {
    setAnchorTemplates(templates);
  }, [setAnchorTemplates]);

  const hourMarkers = useMemo(() => {
    const markers = [];
    for (let hour = TIMELINE_START_HOUR; hour <= TIMELINE_END_HOUR; hour += 3) {
      const label = hour === 12 ? '12p' : hour === 24 || hour === 0 ? '12a' : hour > 12 ? `${hour - 12}p` : `${hour}a`;
      markers.push({ hour, label });
    }
    return markers;
  }, []);

  const sunTimeline = useMemo(() => getSunTimelineTimes(viewDate, sunLocation), [viewDate, sunLocation]);
  const sunrisePercent = getTimePositionFromMinutes(sunTimeline.sunriseMinutes);
  const sunsetPercent = getTimePositionFromMinutes(sunTimeline.sunsetMinutes);
  const sunArcStartX = Math.round(sunrisePercent * 10);
  const sunArcEndX = Math.round(sunsetPercent * 10);
  const sunArcMidX = Math.round((sunArcStartX + sunArcEndX) / 2);
  const sunArcPath = `M ${sunArcStartX} 128 C ${sunArcStartX + Math.max(60, (sunArcMidX - sunArcStartX) * 0.85)} 18, ${sunArcEndX - Math.max(60, (sunArcEndX - sunArcMidX) * 0.85)} 18, ${sunArcEndX} 128`;
  const sunTimesLabel = `${formatShortTime(minutesToHHMM(sunTimeline.sunriseMinutes)).toLowerCase()}-${formatShortTime(minutesToHHMM(sunTimeline.sunsetMinutes)).toLowerCase()}`;

  if (!isLoaded) {
    return (
      <div className="daily-anchors-card mobile-anchors-plain relative overflow-hidden rounded-none lg:rounded-2xl">
        <div aria-hidden className="absolute inset-0 daily-anchors-nebula pointer-events-none" />
        <div className="relative z-10 p-0 lg:p-5">
          <div className="hidden lg:flex items-center justify-between gap-3 mb-5">
            <div className="h-6 w-44 rounded-full bg-bg-surface/70 animate-pulse" />
            <div className="h-9 w-9 rounded-full bg-bg-surface/70 animate-pulse" />
          </div>
          <div className="rounded-2xl border border-border-subtle/60 bg-bg-surface/45 px-3 py-4 lg:px-5 lg:py-[1.65rem]">
            <div className="flex justify-between gap-2">
              {hourMarkers.map(({ hour }) => (
                <span key={hour} className="h-2 w-7 rounded-full bg-bg-elevated/70 animate-pulse" />
              ))}
            </div>
            <div className="mt-5 h-3 rounded-full bg-bg-elevated/75 animate-pulse" />
            <div className="mt-5 space-y-2 lg:hidden">
              <div className="h-12 rounded-2xl bg-bg-elevated/60 animate-pulse" />
              <div className="h-12 rounded-2xl bg-bg-elevated/50 animate-pulse" />
              <div className="h-12 rounded-2xl bg-bg-elevated/40 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`daily-anchors-card mobile-anchors-plain relative rounded-none lg:rounded-2xl ${isEditingAnchors ? 'overflow-visible z-40' : 'overflow-hidden'}`}>
        <div aria-hidden className="absolute inset-0 daily-anchors-nebula pointer-events-none" />

        <div className="relative p-0 lg:p-5 z-10">
          {/* Desktop header - side by side (mobile/tablet use card list) */}
          <div className="hidden lg:flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-card font-display text-text tracking-wide truncate">Daily Overview</h2>
              <span
                className={`
                  text-meta font-semibold px-2 py-1 rounded-full shrink-0
                  ${isAllComplete ? 'bg-secondary/15 text-secondary' : 'bg-bg-surface/80 text-text-muted'}
                `}
              >
                {overviewCompletedCount}/{overviewTotalCount}
              </span>
              {/* Date navigation */}
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => {
                    const prev = new Date(viewDate);
                    prev.setDate(prev.getDate() - 1);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    if (prev >= sevenDaysAgo) setViewDate(prev);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted/50 transition-colors hover:bg-bg-surface/80 hover:text-text-muted disabled:opacity-30"
                  aria-label="Previous day"
                  disabled={(() => {
                    const limit = new Date();
                    limit.setDate(limit.getDate() - 7);
                    const prev = new Date(viewDate);
                    prev.setDate(prev.getDate() - 1);
                    return prev < limit;
                  })()}
                >
                  <ChevronLeft size={14} />
                </button>
                {!isToday && (
                  <span className="px-1.5 text-[11px] font-medium text-text-muted/70 tabular-nums">
                    {viewDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (isToday) return;
                    const next = new Date(viewDate);
                    next.setDate(next.getDate() + 1);
                    setViewDate(next);
                  }}
                  disabled={isToday}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted/50 transition-colors hover:bg-bg-surface/80 hover:text-text-muted disabled:opacity-30 disabled:cursor-default"
                  aria-label="Next day"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="relative w-9 h-9 shrink-0">
              <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-bg-surface/60" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${overviewTotalCount > 0 ? (overviewCompletedCount / overviewTotalCount) * 88 : 0} 100`}
                  strokeLinecap="round"
                  className={isAllComplete ? 'text-secondary' : 'text-primary'}
                  style={{ transition: 'stroke-dasharray 500ms ease' }}
                />
              </svg>
              {isAllComplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check size={11} className="text-secondary" strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <div className="hidden xl:block min-w-0 text-right">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/55">
                  {isUsingLocalSun ? 'Local sun' : 'Boston sun'}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-text-muted/75 tabular-nums">
                  {sunTimesLabel}
                </div>
                {sunLocationStatus && (
                  <div className="mt-0.5 max-w-40 truncate text-[10px] text-text-muted/60">
                    {sunLocationStatus}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleUseCurrentSunLocation}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-subtle/60 bg-bg-surface/70 text-text-muted transition-colors hover:border-[color-mix(in_srgb,var(--accent-primary)_42%,transparent)] hover:bg-bg-elevated/85 hover:text-text"
                title="Use your current location for sunrise and sunset"
                aria-label="Use your current location for sunrise and sunset"
              >
                <LocateFixed size={15} strokeWidth={2} />
              </button>
            </div>
          </div>

          {recentSkippedStreak >= 3 && !isSkipStreakNoticeAcknowledged && (
            <div className="mb-4 rounded-2xl border border-warning/35 bg-warning/10 px-4 py-3 text-sm text-text">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">
                    That&apos;s {recentSkippedStreak} skips in a row. What&apos;s going on?
                  </p>
                  <p className="mt-1 text-text-muted">
                    {skippedTodayCount} skipped today. If the plan is off, adjust the anchor times instead of burning the whole block.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => acknowledgeOverviewNotice('daily-overview-skip-streak')}
                  className="shrink-0 rounded-full border border-warning/35 bg-bg-surface/80 px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-warning/60 hover:bg-bg-surface"
                >
                  Acknowledge
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openAnchorEditor}
                  className="inline-flex items-center justify-center rounded-full border border-warning/40 bg-bg-surface/85 px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-warning/60 hover:bg-bg-surface"
                >
                  Retime anchors
                </button>
              </div>
            </div>
          )}

          {weeklySkipReasonInsight && weeklySkipReasonInsight.count >= 2 && weeklySkipInsightNoticeId && !isWeeklySkipInsightAcknowledged && (
            <div className="mb-4 rounded-2xl border border-border-subtle bg-bg-elevated/75 px-4 py-3 text-sm text-text">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">
                    This week: {weeklySkipReasonInsight.anchorLabel} skipped {weeklySkipReasonInsight.count} times because {getSkipReasonLabel(weeklySkipReasonInsight.reason)}.
                  </p>
                  <p className="mt-1 text-text-muted">
                    {getSkipReasonSuggestion(weeklySkipReasonInsight.reason)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => acknowledgeOverviewNotice(weeklySkipInsightNoticeId)}
                  className="shrink-0 rounded-full border border-border-subtle bg-bg-surface/80 px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:bg-bg-surface"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          )}

          <div className="hidden lg:block">
            <div className="relative" ref={timelineRef}>
              <div className="daily-overview-hour-row flex justify-between mb-1.5 px-1">
                {hourMarkers.map(({ hour, label }) => (
                  <span key={hour} className="daily-anchors-hour-tick text-[9px] text-text-muted/32 font-medium tabular-nums tracking-tight">
                    {label}
                  </span>
                ))}
              </div>

              <div className="daily-overview-timeline-strip relative h-[8rem] overflow-visible rounded-xl border border-border-subtle/22 px-0 py-2">
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden>
                {TIMELINE_DAY_ZONES.map((zone) => {
                  const bounds = getTimelineSegmentBounds(zone.start, zone.end);
                  return (
                    <div
                      key={zone.key}
                      className={`daily-overview-zone absolute inset-y-0 ${zone.className}`}
                      style={{ left: `${bounds.left}%`, width: `${bounds.width}%` }}
                    />
                  );
                })}
                <div className="daily-overview-strip-sheen pointer-events-none absolute inset-0" aria-hidden />
              </div>

              <svg
                className="daily-overview-sun-arc-svg pointer-events-none absolute left-6 right-6 top-[0.625rem] h-11 w-[calc(100%-3rem)] opacity-[0.38]"
                viewBox="0 0 1000 160"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d={sunArcPath}
                  fill="none"
                  stroke="color-mix(in srgb, var(--accent-primary) 56%, #c98262 44%)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 18"
                />
              </svg>

              <div
                className="daily-overview-sun-footnote pointer-events-none absolute top-[4.125rem] z-[8] -translate-x-1/2 text-[9px] font-semibold uppercase tracking-[0.12em] text-text-muted/45 tabular-nums"
                style={{ left: `${sunrisePercent}%` }}
                aria-hidden
              >
                {formatShortTime(minutesToHHMM(sunTimeline.sunriseMinutes)).toLowerCase()}
              </div>
              <div
                className="daily-overview-sun-footnote pointer-events-none absolute top-[4.125rem] z-[8] -translate-x-1/2 text-[9px] font-semibold uppercase tracking-[0.12em] text-text-muted/45 tabular-nums"
                style={{ left: `${sunsetPercent}%` }}
                aria-hidden
              >
                {formatShortTime(minutesToHHMM(sunTimeline.sunsetMinutes)).toLowerCase()}
              </div>

              <div className="daily-anchors-track-base absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 overflow-hidden rounded-full" />

              <motion.div
                className="daily-anchors-track-progress absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${dayProgressPercent}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />

              {isPlannerLoaded && onAgainRhythm.segments.length > 0 && (
                <div className="daily-overview-oaoa-rhythm pointer-events-none absolute inset-0 z-[10] overflow-visible opacity-[0.74]" aria-hidden>
                  {onAgainRhythm.segments.map((seg) => (
                    <div
                      key={`oaoa-seg-${seg.id}`}
                      title={seg.label}
                      className={`absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full border ${
                        seg.isActive ? 'z-[1] scale-[1.02]' : 'z-0'
                      }`}
                      style={{
                        ...oaoaRhythmSegmentStyle(seg.kind, seg.isActive),
                        left: `${seg.left}%`,
                        width: `${Math.max(seg.width, 0.35)}%`,
                        minWidth: seg.isActive ? 8 : 5,
                      }}
                    />
                  ))}
                  {onAgainRhythm.gapMarkers.map((gap) => {
                    const c = gap.prevKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)';
                    return (
                      <div
                        key={gap.id}
                        className="absolute top-1/2 z-[2] flex h-8 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                        style={{ left: `${gap.left}%` }}
                      >
                        <div
                          className="h-full w-[2px] rounded-full bg-transparent"
                          style={{
                            background: `linear-gradient(180deg, transparent 0%, ${c} 20%, ${c} 80%, transparent 100%)`,
                            boxShadow: `0 0 10px color-mix(in srgb, ${c} 40%, transparent)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <DesktopPlannerRiverOverlays
                constraints={activeConstraintsForRiver}
                todayCalendarEvents={todayCalendarEventsForRiver}
                nowMinutes={nowMinutes}
              />

              {visibleSortedAnchors.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-text-muted">No anchors scheduled for today</span>
                </div>
              )}

              {visibleSortedAnchors.map((anchor, index) => {
                const Icon = iconByName[anchor.icon] || Moon;
                const isActive = anchor.id === activeAnchor.id;
                const isDragging = anchor.id === draggingAnchor;
                const isHovered = anchor.id === hoveredAnchor;
                const isDone = anchor.status === 'done';
                const isMissed = anchor.status === 'missed';
                const isSkipped = anchor.status === 'skipped';
                const isRange = Boolean(anchor.endTime && parseHHMMToMinutes(anchor.endTime) > parseHHMMToMinutes(anchor.scheduledTime));
                const isInProgress = isRangeAnchorInProgress(anchor, nowMinutes, isToday);
                const isVisuallyMissed = isMissed && !isInProgress;
                const isCurrentVisual = isActive || isInProgress;

                const displayTime = isDragging && dragPreviewTime ? dragPreviewTime : anchor.scheduledTime;
                const position = getTimePosition(displayTime);
                const endPosition = isRange && anchor.endTime ? getTimePosition(anchor.endTime) : null;
                const timeUntil = getTimeUntil(anchor.scheduledTime, nowMinutes);
                const inLabel = timeUntil.startsWith('in ') ? timeUntil.slice(3) : timeUntil;
                const isLightsOutAnchor = anchor.id === 'lightsOut' || anchor.icon === 'moon';
                const isTimeMoved = Boolean(anchor.isTimeOverridden);
                const nextScheduledAnchor = visibleSortedAnchors[index + 1];
                const timeToNextEventLabel = nextScheduledAnchor
                  ? formatDuration(getMinutesBetweenEvents(anchor.scheduledTime, nextScheduledAnchor.scheduledTime))
                  : wakeAnchorForToday
                    ? formatDuration(getOvernightMinutesUntil(anchor.scheduledTime, wakeAnchorForToday.scheduledTime))
                    : null;
                const sleepWindowLabel =
                  isLightsOutAnchor && wakeAnchorForToday
                    ? formatDuration(getOvernightMinutesUntil(displayTime, wakeAnchorForToday.scheduledTime))
                    : null;
                const stateClass = isDone
                  ? 'is-done'
                  : isVisuallyMissed
                    ? 'is-missed'
                    : isSkipped
                      ? 'is-skipped'
                    : isActive || isInProgress
                    ? 'is-active'
                      : 'is-future';

                if (isRange && endPosition != null && endPosition > position) {
                  // Use preview times during drag for range anchors
                  const displayEndTime = isDragging && dragPreviewEndTime ? dragPreviewEndTime : anchor.endTime;
                  const segmentLeft = getTimePosition(displayTime);
                  const segmentRight = displayEndTime ? getTimePosition(displayEndTime) : endPosition;
                  const segmentWidth = segmentRight - segmentLeft;
                  const orbBaseClass = `
                    editorial-anchor-node w-7 h-7 rounded-full flex items-center justify-center
                    border shadow-sm overflow-hidden transition-all duration-300
                    backdrop-blur-md
                    ${isDone
                      ? 'bg-secondary/85 text-white border-secondary/55'
                      : isVisuallyMissed
                        ? 'bg-bg-surface/45 text-text-muted/40 border-border-subtle/50'
                        : isSkipped
                          ? 'bg-bg-surface/35 text-text-muted/45 border-dashed border-border-subtle/55 grayscale'
                          : isLightsOutAnchor
                            ? 'bg-[#d8cdf3]/70 text-[#706193] border-[#b9aadf]/70'
                            : isCurrentVisual
                              ? 'bg-bg-elevated/85 text-[color-mix(in_srgb,var(--accent-primary)_82%,var(--color-text-primary)_18%)] border-[color-mix(in_srgb,var(--accent-primary)_72%,transparent)]'
                              : 'bg-bg-elevated/70 text-text-muted border-border-subtle/70'
                    }
                    ${isTimeMoved ? 'border-dashed' : ''}
                    ${stateClass}
                  `;
                  return (
                    <div
                      key={anchor.id}
                      className={`absolute top-1/2 -translate-y-1/2 h-8 ${isDragging ? 'z-30' : 'z-20'}`}
                      style={{
                        left: `${segmentLeft}%`,
                        width: `${segmentWidth}%`,
                        minWidth: 0,
                        transition: isDragging ? 'none' : 'left 300ms ease, width 300ms ease',
                      }}
                      onMouseEnter={() => setHoveredAnchor(anchor.id)}
                      onMouseLeave={() => setHoveredAnchor(null)}
                    >
                      {/* Hover tooltip for range anchor */}
                      <div
                        className={`
                          absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl
                          pointer-events-none bg-bg-elevated/95 backdrop-blur-sm border border-border-subtle shadow-xl
                          transition-all duration-200 z-50
                          ${isHovered || isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                        `}
                      >
                        <div className="text-xs font-bold text-text whitespace-nowrap">
                          {isDragging && dragPreviewTime && dragPreviewEndTime
                            ? formatTimeRange(dragPreviewTime, dragPreviewEndTime, true)
                            : formatTimeRange(displayTime, anchor.endTime!, true)}
                        </div>
                        {!isDragging && (
                          <div className={`text-[10px] whitespace-nowrap ${isDone ? 'text-secondary' : isVisuallyMissed ? 'text-error/70' : isSkipped ? 'text-text-muted/70' : 'text-text-muted'}`}>
                            {isDone ? 'Completed' : isInProgress ? 'In progress' : isVisuallyMissed ? 'Missed' : isSkipped ? 'Skipped' : `In: ${inLabel}`}
                          </div>
                        )}
                        {isDragging && <div className="text-[10px] text-primary whitespace-nowrap">Release to set</div>}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-elevated border-r border-b border-border-subtle rotate-45" />
                      </div>

                      {/* Drag grip for range anchors */}
                      <div
                        className={`
                          absolute left-1/2 -translate-x-1/2 -top-7 z-30 rounded-xl border border-border-subtle/50
                          bg-bg-elevated/90 px-1.5 py-1
                          cursor-grab active:cursor-grabbing backdrop-blur-sm
                          text-text-muted/55 shadow-sm transition-all
                          ${isHovered ? 'opacity-100 scale-100 -translate-y-0.5' : 'opacity-80 scale-100'}
                          hover:opacity-100 hover:text-text hover:border-accent-teal/40
                        `}
                        onMouseDown={(e) => handleDragStart(anchor.id, e)}
                        onTouchStart={(e) => handleDragStart(anchor.id, e)}
                        title={`Drag to retime ${anchor.label}`}
                        aria-label={`Drag to retime ${anchor.label}`}
                      >
                        <GripVertical size={13} />
                      </div>

                      {/* Bar background */}
                      <div
                        className={`
                          absolute inset-y-[13px] rounded-full border
                          ${isDragging ? 'ring-2 ring-accent-teal/35 shadow-lg' : ''}
                          ${isDone
                            ? 'bg-secondary/20 border-secondary/40'
                            : isVisuallyMissed
                              ? 'bg-bg-surface/30 border-border-subtle/40'
                            : isSkipped
                              ? 'bg-bg-surface/25 border-border-subtle/40'
                                : isCurrentVisual
                                  ? 'bg-[color-mix(in_srgb,var(--accent-primary)_16%,transparent)] border-[color-mix(in_srgb,var(--accent-primary)_34%,transparent)]'
                                  : 'bg-bg-elevated/30 border-border-subtle/40'
                          }
                        `}
                      />
                      {/* Start orb */}
                      <button
                        type="button"
                        onClick={() => !isDragging && toggleAnchor(anchor.id)}
                        onContextMenu={(e) => {
                          if (isDragging) return;
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleSkipToday(anchor.id, isSkipped);
                        }}
                        disabled={!isLoaded || isDragging}
                        title={isSkipped ? 'Right-click to undo skip' : 'Right-click to skip today'}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 ${orbBaseClass}
                          opacity-95 hover:opacity-100
                          hover:scale-105 active:scale-95
                          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                          ${!isDone && !isVisuallyMissed && !isSkipped ? 'backdrop-blur-sm' : ''}
                          ${isDragging ? 'scale-110 shadow-xl ring-2 ring-accent-teal/35' : ''}
                        `}
                        style={
                          !isDone && !isVisuallyMissed && !isSkipped
                            ? { ['--node-glow' as string]: getRiverFlowGradient(anchor.icon).glow }
                            : undefined
                        }
                      >
                        {!isDone && !isVisuallyMissed && !isSkipped && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} opacity-30`} aria-hidden />
                        )}
                        <span className="relative z-10">
                          {isDone ? <Check size={14} strokeWidth={2.6} /> : <Icon size={14} strokeWidth={1.8} />}
                        </span>
                      </button>
                      <div
                        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 ${orbBaseClass} pointer-events-none opacity-90`}
                        aria-hidden
                      >
                        {!isDone && !isVisuallyMissed && !isSkipped && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} opacity-30`} aria-hidden />
                        )}
                        <span className="relative z-10">
                          <Icon size={14} strokeWidth={1.8} />
                        </span>
                      </div>
                      <div className="absolute left-1/2 top-full mt-4 -translate-x-1/2 text-center">
                        <div className={`whitespace-nowrap text-[13px] font-semibold leading-tight ${isCurrentVisual ? 'text-text' : 'text-text/80'}`}>
                          {anchor.label}
                        </div>
                        <div className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-text-muted/65 tabular-nums">
                          {formatShortTime(displayTime).toLowerCase()}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={anchor.id}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                    style={{ left: `${position}%`, transition: isDragging ? 'none' : 'left 300ms ease' }}
                    onMouseEnter={() => setHoveredAnchor(anchor.id)}
                    onMouseLeave={() => setHoveredAnchor(null)}
                  >
                    <div
                      className={`
                        absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl
                        pointer-events-none bg-bg-elevated/95 backdrop-blur-sm border border-border-subtle shadow-xl
                        transition-all duration-200 z-50
                        ${isHovered || isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                      `}
                    >
                      <div className="text-xs font-bold text-text whitespace-nowrap">{formatShortTime(displayTime)}</div>
                      {!isDragging && (
                        <div className={`text-[10px] whitespace-nowrap ${isDone ? 'text-secondary' : isMissed ? 'text-error/70' : isSkipped ? 'text-text-muted/70' : 'text-text-muted'}`}>
                          {isDone
                            ? 'Completed'
                            : isMissed
                              ? 'Missed'
                              : isSkipped
                                ? 'Skipped'
                              : isLightsOutAnchor
                                ? timeUntil
                                : `In: ${inLabel}`}
                        </div>
                      )}
                      {!isDragging && !isDone && !isMissed && !isSkipped && !isLightsOutAnchor && timeToNextEventLabel && (
                        <div className="text-[10px] text-text-muted whitespace-nowrap">
                          Next Event: {timeToNextEventLabel}
                        </div>
                      )}
                      {!isDragging && !isSkipped && sleepWindowLabel && (
                        <div className="text-[10px] text-text-muted whitespace-nowrap">
                          Sleep window: {sleepWindowLabel}
                        </div>
                      )}
                      {!isDragging && anchor.importanceNote && (
                        <div className="mt-1 max-w-[180px] text-[10px] leading-snug text-text-muted/80 whitespace-normal">
                          {anchor.importanceNote}
                        </div>
                      )}
                      {isDragging && <div className="text-[10px] text-primary whitespace-nowrap">Release to set</div>}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-elevated border-r border-b border-border-subtle rotate-45" />
                    </div>

                    <div className="relative flex flex-col items-center">
                      <div
                        className={`
                          absolute -top-7 z-10 rounded-xl border border-border-subtle/50 bg-bg-elevated/90 px-1.5 py-1
                          cursor-grab active:cursor-grabbing backdrop-blur-sm
                          text-text-muted/55 shadow-sm transition-all
                          ${isHovered ? 'opacity-100 scale-100 -translate-y-0.5' : 'opacity-80 scale-100'}
                          hover:opacity-100 hover:text-text hover:border-accent-teal/40
                        `}
                        onMouseDown={(e) => handleDragStart(anchor.id, e)}
                        onTouchStart={(e) => handleDragStart(anchor.id, e)}
                        title={`Drag to retime ${anchor.label}`}
                        aria-label={`Drag to retime ${anchor.label}`}
                      >
                        <GripVertical size={13} />
                      </div>

                      <button
                        type="button"
                        onClick={() => !isDragging && toggleAnchor(anchor.id)}
                        onContextMenu={(e) => {
                          if (isDragging) return;
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleSkipToday(anchor.id, isSkipped);
                        }}
                        disabled={!isLoaded || isDragging}
                        title={isSkipped ? 'Right-click to undo skip' : 'Right-click to skip today'}
                        className={`
                          editorial-anchor-node group/node relative flex h-8 w-8 items-center justify-center
                          transition-all duration-300 overflow-hidden
                          ${
                            isDone
                              ? 'rounded-full border bg-secondary/85 text-white border-secondary/55 shadow-sm'
                              : isMissed
                                ? 'rounded-full border bg-bg-surface/50 text-text-muted/40 border-border-subtle/50'
                                : isSkipped
                                  ? 'rounded-full border border-dashed bg-bg-surface/40 text-text-muted/45 border-border-subtle/55 grayscale'
                                  : isLightsOutAnchor
                                    ? 'rounded-full border bg-[#d8cdf3]/70 text-[#706193] border-[#b9aadf]/70 shadow-sm'
                                    : isCurrentVisual
                                      ? 'rotate-45 rounded-[7px] border bg-bg-elevated/85 text-[color-mix(in_srgb,var(--accent-primary)_82%,var(--color-text-primary)_18%)] border-[color-mix(in_srgb,var(--accent-primary)_72%,transparent)] shadow-[0_0_0_5px_color-mix(in_srgb,var(--accent-primary)_10%,transparent)]'
                                      : 'rounded-full border bg-bg-elevated/70 text-text-muted border-border-subtle/70 shadow-sm'
                          }
                          ${isTimeMoved ? 'border-dashed' : ''}
                          ${stateClass}
                          ${isCurrentVisual && !isDone && !isMissed && !isSkipped ? 'ring-0' : ''}
                          hover:scale-105 active:scale-95
                          ${!isLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${isDragging ? 'is-dragging scale-110 shadow-xl ring-2 ring-accent-teal/35' : ''}
                        `}
                        style={
                          !isDone && !isMissed && !isSkipped && !isDragging
                            ? { ['--node-glow' as string]: getRiverFlowGradient(anchor.icon).glow }
                            : undefined
                        }
                      >
                        {/* Subtle gradient overlay */}
                        {!isDone && !isMissed && !isSkipped && !isCurrentVisual && (
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} opacity-40 transition-opacity duration-300 group-hover/node:opacity-70`}
                            aria-hidden
                          />
                        )}
                        {/* Hover glow effect */}
                        {!isDone && !isMissed && !isSkipped && (
                          <div
                            className="desktop-anchor-glow absolute inset-0 opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ boxShadow: `inset 0 0 12px var(--node-glow), 0 0 16px var(--node-glow)` }}
                            aria-hidden
                          />
                        )}
                        <span className="relative z-10">
                          {isDone ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                              <Check size={15} strokeWidth={2.6} />
                            </motion.div>
                          ) : (
                            <Icon
                              size={15}
                              strokeWidth={1.8}
                              className={`${isCurrentVisual ? '-rotate-45' : ''} ${isActive ? 'text-current' : ''}`}
                            />
                          )}
                        </span>
                      </button>
                      <div className="absolute top-full mt-5 text-center">
                        <div className={`whitespace-nowrap text-[13px] font-semibold leading-tight ${isCurrentVisual ? 'text-text' : 'text-text/80'}`}>
                          {anchor.label}
                        </div>
                        <div className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-text-muted/65 tabular-nums">
                          {formatShortTime(displayTime).toLowerCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <TimelineNowMarker leftPercent={dayProgressPercent} show={showNowMarker} label={formatNowLabel(nowMinutes)} />
              </div>
            </div>
          </div>

          {/* Mobile/tablet layout - compact timeline + unified daily overview */}
          <div className="lg:hidden mt-0">
            <MobileAnchorsTimelineStrip
              hourMarkers={hourMarkers}
              sortedAnchors={visibleSortedAnchors}
              todayCalendarEvents={todayCalendarEventsForRiver}
              timeFillPercent={dayProgressPercent}
              showNowMarker={showNowMarker}
              isLoaded={isLoaded}
              activeAnchor={activeAnchor}
              toggleAnchor={toggleAnchor}
              onToggleSkip={handleToggleSkipToday}
              isPlannerLoaded={isPlannerLoaded}
              onAgainRhythm={onAgainRhythm}
            />
            <DailyOverviewList
              calendarEvents={calendarEvents}
              calendarPlanner={calendarPlanner}
              dailyAnchors={dailyAnchors}
            />
          </div>

        </div>
      </div>

      <EditAnchorsSheet
        isOpen={isEditingAnchors}
        onClose={closeAnchorEditor}
        anchorTemplates={anchorTemplates}
        onSave={handleSaveAnchors}
      />

      <AnchorSkipReasonDialog
        open={!!skipReasonAnchor}
        anchorLabel={skipReasonAnchor?.label ?? ''}
        onCancel={() => setSkipReasonAnchor(null)}
        onConfirm={(reason) => handleConfirmSkipReason(reason)}
      />
    </>
  );
}
