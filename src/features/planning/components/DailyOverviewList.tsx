'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTimeBlockPlanner } from '@/features/planning/hooks/useTimeBlockPlanner';
import { getTodayKey } from '@/lib/unified-scheduler';
import { isAnchorScheduledForDate, parseHHMMToMinutes, formatTimeLabel, formatTimeRange, type AnchorId, type DailyAnchor, type SkipReason } from '@/lib/anchors';
import { getActiveConstraintsForDay, getConstraintDisplayDayPlan } from '@/lib/time-block-planner';
import type { DailyOverviewItem } from '@/types/daily-overview';
import { computeOverviewScheduleStatus, type OverviewScheduleStatus } from '@/lib/daily-overview-schedule-status';
import { AnchorSkipReasonDialog } from './AnchorSkipReasonDialog';
import { DailyOverviewListProps, AnchorOverviewRow, EventOverviewRow, BoundaryOverviewRow, SessionPlaceholderRow, minutesFromMidnightToHHMM, OnAgainPlanOverviewRow } from './daily-overview/rows';

export function DailyOverviewList({
  calendarEvents,
  calendarPlanner,
  dailyAnchors }: DailyOverviewListProps) {
  const todayKey = getTodayKey();
  const today = useMemo(() => new Date(), []);

  const {
    isLoaded,
    getStateForDate,
    toggleAnchorForDate,
    setAnchorsForDate,
    setAnchorStatusForDate } = dailyAnchors;
  const { plannerStore, plannerDefaults, isLoaded: isPlannerLoaded } = useTimeBlockPlanner();
  const { getPlan, updatePlanField } = calendarPlanner;
  const todayPlan = getPlan(todayKey);
  const todayAnchorState = getStateForDate(today);
  const anchors = useMemo(
    () => (isLoaded ? todayAnchorState.anchors : []),
    [isLoaded, todayAnchorState.anchors],
  );
  const toggleAnchor = useCallback(
    (anchorId: AnchorId) => toggleAnchorForDate(today, anchorId),
    [toggleAnchorForDate, today],
  );
  const setTodayAnchors = useCallback(
    (nextAnchors: DailyAnchor[]) => setAnchorsForDate(today, nextAnchors),
    [setAnchorsForDate, today],
  );
  const setTodayAnchorStatus = useCallback(
    (anchorId: AnchorId, status: DailyAnchor['status'], skipReason?: SkipReason) =>
      setAnchorStatusForDate(today, anchorId, status, skipReason),
    [setAnchorStatusForDate, today],
  );

  const [openEditorAnchorId, setOpenEditorAnchorId] = useState<AnchorId | null>(null);
  const [skipReasonAnchor, setSkipReasonAnchor] = useState<{ id: AnchorId; label: string } | null>(null);
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const currentPlan = plannerStore[todayKey];
  const activeConstraints = useMemo(
    () => {
      if (!isPlannerLoaded) return [];
      const constraintPlan = getConstraintDisplayDayPlan(todayKey, currentPlan);
      return getActiveConstraintsForDay(constraintPlan, plannerDefaults);
    },
    [currentPlan, plannerDefaults, isPlannerLoaded, todayKey]
  );

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

  const visibleTodayAnchors = useMemo(
    () => todayAnchors.filter((anchor) => anchor.status !== 'skipped'),
    [todayAnchors],
  );

  const wakeAnchorForToday = useMemo(
    () => visibleTodayAnchors.find((a) => a.id === 'wake') || visibleTodayAnchors.find((a) => a.icon === 'sunrise'),
    [visibleTodayAnchors]
  );

  const handleTimeChange = useCallback(
    (anchorId: AnchorId, newTime: string) => {
      setTodayAnchors(
        anchors.map((a) =>
          a.id === anchorId ? { ...a, scheduledTime: newTime, isTimeOverridden: true } : a
        )
      );
    },
    [anchors, setTodayAnchors]
  );

  const handleEndTimeChange = useCallback(
    (anchorId: AnchorId, newTime: string) => {
      setTodayAnchors(
        anchors.map((a) =>
          a.id === anchorId ? { ...a, endTime: newTime, isTimeOverridden: true } : a
        )
      );
    },
    [anchors, setTodayAnchors]
  );

  const handleToggleSkip = useCallback(
    (anchorId: AnchorId) => {
      const a = anchors.find((x) => x.id === anchorId);
      if (!a) return;
      if (a.status === 'skipped') {
        setTodayAnchorStatus(anchorId, 'waiting');
        return;
      }
      setSkipReasonAnchor({ id: anchorId, label: a.label });
    },
    [anchors, setTodayAnchorStatus]
  );

  const handleConfirmSkipReason = useCallback(
    (reason?: SkipReason) => {
      if (!skipReasonAnchor) return;
      setTodayAnchorStatus(skipReasonAnchor.id, 'skipped', reason);
      setSkipReasonAnchor(null);
    },
    [skipReasonAnchor, setTodayAnchorStatus]
  );

  const overviewItems = useMemo(() => {
    const items: DailyOverviewItem[] = [];
    const acknowledgements = todayPlan.acknowledgements || { boundaries: [], events: [], sessions: [], plans: [], notices: [] };

    for (const anchor of visibleTodayAnchors) {
      items.push({
        id: anchor.id,
        type: 'anchor',
        label: anchor.label,
        time: anchor.endTime
          ? formatTimeRange(anchor.scheduledTime, anchor.endTime, true)
          : formatTimeLabel(anchor.scheduledTime),
        scheduledMinutes: parseHHMMToMinutes(anchor.scheduledTime),
        isDone: anchor.status === 'done',
        isAcknowledged: anchor.status === 'done',
        icon: anchor.icon,
        color: anchor.color,
        sourceData: anchor });
    }

    const todayEvents = calendarEvents.filter((event) => {
      const eventDate = new Date(event.date);
      const eventKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
      return eventKey === todayKey;
    });

    for (const event of todayEvents) {
      const eventDate = new Date(event.date);
      const eventMinutes = eventDate.getHours() * 60 + eventDate.getMinutes();
      const eventId = event.id ?? `event-${event.date}`;

      items.push({
        id: eventId,
        type: 'event',
        label: event.title ?? 'Calendar Event',
        time: formatTimeLabel(`${String(eventDate.getHours()).padStart(2, '0')}:${String(eventDate.getMinutes()).padStart(2, '0')}`),
        scheduledMinutes: eventMinutes,
        isDone: false,
        isAcknowledged: acknowledgements.events.includes(eventId),
        icon: 'calendar',
        description: event.type,
        eventType: event.type,
        sourceData: event });
    }

    for (const constraint of activeConstraints) {
      const constraintMinutes = parseHHMMToMinutes(constraint.time);
      const targetLabel = constraint.target.label?.trim();
      const activityName = targetLabel || (constraint.target.kind === 'want' ? 'Energy' : 'Focus');

      let shortLabel = '';
      if (constraint.kind === 'until') {
        shortLabel = `Only schedule ${activityName}`;
      } else if (constraint.kind === 'deadline') {
        shortLabel = `Must be ${activityName}`;
      } else {
        shortLabel = `No more ${activityName}`;
      }

      items.push({
        id: constraint.id,
        type: 'boundary',
        label: shortLabel,
        time: formatTimeLabel(constraint.time),
        scheduledMinutes: constraintMinutes,
        isDone: false,
        isAcknowledged: acknowledgements.boundaries.includes(constraint.id),
        icon: constraint.kind === 'cutoff' ? 'ban' : constraint.kind === 'until' ? 'flag' : 'alarm-clock',
        boundaryKind: constraint.kind,
        sourceData: constraint });
    }

    if (isPlannerLoaded && currentPlan?.blocks?.length) {
      const blocks = currentPlan.blocks;
      const first = blocks[0];
      const last = blocks[blocks.length - 1];
      const time = formatTimeRange(
        minutesFromMidnightToHHMM(first.startMinuteOfDay),
        minutesFromMidnightToHHMM(last.endMinuteOfDay),
        true,
      );
      items.push({
        id: 'overview-oaoa-plan',
        type: 'oaoa-plan',
        label: 'On Again / Off Again',
        time,
        scheduledMinutes: first.startMinuteOfDay,
        isDone: false,
        isAcknowledged: acknowledgements.plans.includes('overview-oaoa-plan'),
        icon: 'layers',
        activeMinuteRanges: blocks.map((b) => ({ start: b.startMinuteOfDay, end: b.endMinuteOfDay })),
        oaoaBlockCount: blocks.length,
        sourceData: first });
    }

    return items.sort((a, b) => a.scheduledMinutes - b.scheduledMinutes);
  }, [visibleTodayAnchors, calendarEvents, activeConstraints, todayKey, todayPlan.acknowledgements, currentPlan, isPlannerLoaded]);

  const scheduleStatusById = useMemo(
    () =>
      nowMinutes === null
        ? new Map<string, OverviewScheduleStatus>()
        : computeOverviewScheduleStatus(nowMinutes, overviewItems),
    [nowMinutes, overviewItems],
  );

  const handleAcknowledge = (itemId: string, itemType: DailyOverviewItem['type']) => {
    const current = todayPlan.acknowledgements || { boundaries: [], events: [], sessions: [], plans: [], notices: [] };

    if (itemType === 'boundary') {
      const isAcknowledged = current.boundaries.includes(itemId);
      updatePlanField(todayKey, 'acknowledgements', {
        ...current,
        boundaries: isAcknowledged
          ? current.boundaries.filter((id) => id !== itemId)
          : [...current.boundaries, itemId] });
    } else if (itemType === 'event') {
      const isAcknowledged = current.events.includes(itemId);
      updatePlanField(todayKey, 'acknowledgements', {
        ...current,
        events: isAcknowledged
          ? current.events.filter((id) => id !== itemId)
          : [...current.events, itemId] });
    } else if (itemType === 'session') {
      const isAcknowledged = current.sessions.includes(itemId);
      updatePlanField(todayKey, 'acknowledgements', {
        ...current,
        sessions: isAcknowledged
          ? current.sessions.filter((id) => id !== itemId)
          : [...current.sessions, itemId] });
    } else if (itemType === 'oaoa-plan') {
      const isAcknowledged = current.plans.includes(itemId);
      updatePlanField(todayKey, 'acknowledgements', {
        ...current,
        plans: isAcknowledged
          ? current.plans.filter((id) => id !== itemId)
          : [...current.plans, itemId] });
    }
  };

  if (!isLoaded) {
    return (
      <div className="mobile-anchor-stack relative overflow-hidden rounded-[2.2rem] border border-border-subtle/70 bg-bg-surface/75 p-3">
        <div className="space-y-2">
          <div className="h-14 rounded-2xl bg-bg-elevated/70 animate-pulse" />
          <div className="h-14 rounded-2xl bg-bg-elevated/55 animate-pulse" />
          <div className="h-14 rounded-2xl bg-bg-elevated/45 animate-pulse" />
        </div>
      </div>
    );
  }

  if (overviewItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-[2.2rem] border border-border-subtle/70 bg-bg-surface/75">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4">
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-sm font-semibold text-text">Nothing scheduled for today</p>
        <p className="text-xs text-text-muted mt-1">Enjoy your free time!</p>
      </div>
    );
  }

  return (
    <>
      <div className="mobile-anchor-stack relative overflow-visible rounded-[2.2rem]">
        <div
          className="rounded-[2.2rem] border border-border-subtle/70 bg-bg-surface/75 overflow-hidden"
          role="list"
          aria-label="Today’s schedule"
        >
          {overviewItems.map((item) => (
            <div key={item.id} className="border-b border-border-subtle/30 last:border-b-0" role="listitem">
              {item.type === 'anchor' ? (
                <AnchorOverviewRow
                  item={item}
                  anchorData={item.sourceData as DailyAnchor}
                  openEditorAnchorId={openEditorAnchorId}
                  setOpenEditorAnchorId={setOpenEditorAnchorId}
                  todayAnchors={visibleTodayAnchors}
                  wakeAnchorForToday={wakeAnchorForToday}
                  nowMinutes={nowMinutes}
                  isLoaded={isLoaded}
                  toggleAnchor={toggleAnchor}
                  handleTimeChange={handleTimeChange}
                  handleEndTimeChange={handleEndTimeChange}
                  handleToggleSkip={handleToggleSkip}
                  scheduleStatus={scheduleStatusById.get(item.id)}
                />
              ) : item.type === 'event' ? (
                <EventOverviewRow
                  item={item}
                  onAcknowledge={() => handleAcknowledge(item.id, item.type)}
                  scheduleStatus={scheduleStatusById.get(item.id)}
                />
              ) : item.type === 'oaoa-plan' ? (
                <OnAgainPlanOverviewRow
                  item={item}
                  onAcknowledge={() => handleAcknowledge(item.id, item.type)}
                  scheduleStatus={scheduleStatusById.get(item.id)}
                />
              ) : item.type === 'boundary' ? (
                <BoundaryOverviewRow
                  item={item}
                  onAcknowledge={() => handleAcknowledge(item.id, item.type)}
                  scheduleStatus={scheduleStatusById.get(item.id)}
                />
              ) : (
                <SessionPlaceholderRow
                  item={item}
                  onAcknowledge={() => handleAcknowledge(item.id, item.type)}
                  scheduleStatus={scheduleStatusById.get(item.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnchorSkipReasonDialog
        open={!!skipReasonAnchor}
        anchorLabel={skipReasonAnchor?.label ?? ''}
        onCancel={() => setSkipReasonAnchor(null)}
        onConfirm={(reason) => handleConfirmSkipReason(reason)}
      />
    </>
  );
}
