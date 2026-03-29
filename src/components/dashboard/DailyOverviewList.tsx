'use client';

import { useMemo, useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import {
  Anchor as AnchorTypeIcon,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarDays,
  Clock,
  Code2,
  Coffee,
  Dumbbell,
  Flower2,
  Heart,
  Layers,
  Moon,
  Music,
  PenTool,
  Sunrise,
  Target,
  Users,
  Utensils,
  Zap,
  Ban,
  Flag,
  AlarmClock,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import type { CalendarPlannerApi } from '@/components/dashboard/useCalendarPlanner';
import { getTodayKey } from '@/lib/unified-scheduler';
import {
  getAnchorColorPalette,
  isAnchorScheduledForDate,
  parseHHMMToMinutes,
  formatTimeLabel,
  formatTimeRange,
  type AnchorId,
  type DailyAnchor,
  type SkipReason,
} from '@/lib/anchors';
import { getAnchorMobileChipLabels } from '@/lib/anchors-mobile-ui';
import { getActiveConstraintsForDay, getConstraintDisplayDayPlan } from '@/lib/time-block-planner';
import { getCalendarMarkerColor, type CalendarEvent } from './MiniCalendar';
import type { DailyOverviewItem } from '@/types/daily-overview';
import {
  boundaryKindRailClass,
  getAnchorOrbStyles,
  getAnchorRowChromeStyles,
  overviewOrbDepthClass,
  overviewOrbDepthDashedClass,
} from './daily-overview-styles';
import { useTheme } from '@/context/ThemeContext';
import { AnchorSkipReasonDialog } from './AnchorSkipReasonDialog';
import { MobileAnchorEditPanel } from './MobileAnchorEditPanel';
import { cn } from '@/lib/utils';

// Icon component mapping
const iconByName: Record<string, LucideIcon> = {
  moon: Moon,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  sunrise: Sunrise,
  'flower-2': Flower2,
  'book-open': BookOpen,
  code: Code2,
  heart: Heart,
  coffee: Coffee,
  target: Target,
  calendar: Calendar,
  utensils: Utensils,
  music: Music,
  users: Users,
  'pen-tool': PenTool,
  zap: Zap,
  ban: Ban,
  flag: Flag,
  'alarm-clock': AlarmClock,
  timer: Timer,
};

/** Shared micro-label chip (sentence case); icon + label, sits below title. */
const overviewTypeChipClass =
  'inline-flex w-fit items-center gap-1 rounded-full border border-border-subtle/60 bg-bg-elevated/70 px-2 py-0.5 text-[10px] font-medium text-text-muted/90';

function OverviewTypeChip({ label, icon: Icon, muted }: { label: string; icon: LucideIcon; muted?: boolean }) {
  return (
    <span
      className={cn(
        overviewTypeChipClass,
        muted && 'border-border-subtle/45 bg-bg-elevated/45 text-[9px] text-text-muted/75',
      )}
    >
      <Icon className={cn('h-3 w-3 shrink-0', muted ? 'opacity-75' : 'opacity-90')} strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}

interface DailyOverviewListProps {
  storageScope: string;
  calendarEvents: CalendarEvent[];
  calendarPlanner: CalendarPlannerApi;
}

function AnchorOverviewRow({
  item,
  anchorData,
  openEditorAnchorId,
  setOpenEditorAnchorId,
  todayAnchors,
  wakeAnchorForToday,
  nowMinutes,
  isLoaded,
  toggleAnchor,
  handleTimeChange,
  handleEndTimeChange,
  handleToggleSkip,
}: {
  item: DailyOverviewItem;
  anchorData: DailyAnchor;
  openEditorAnchorId: AnchorId | null;
  setOpenEditorAnchorId: Dispatch<SetStateAction<AnchorId | null>>;
  todayAnchors: DailyAnchor[];
  wakeAnchorForToday: DailyAnchor | undefined;
  nowMinutes: number | null;
  isLoaded: boolean;
  toggleAnchor: (id: AnchorId) => void;
  handleTimeChange: (id: AnchorId, t: string) => void;
  handleEndTimeChange: (id: AnchorId, t: string) => void;
  handleToggleSkip: (id: AnchorId) => void;
}) {
  const isEditorOpen = openEditorAnchorId === item.id;
  const { timeUntilLabel, nextEventLabel } = getAnchorMobileChipLabels(
    anchorData,
    todayAnchors,
    wakeAnchorForToday,
    nowMinutes
  );
  const isSkipped = anchorData.status === 'skipped';
  const id = item.id as AnchorId;
  const palette = getAnchorColorPalette(anchorData.color, anchorData.icon);
  const { resolvedTheme } = useTheme();

  const done = item.isDone && !isSkipped;

  return (
    <div role="group" aria-label={`Anchor: ${item.label}, ${item.time}${done ? ', completed' : ''}`}>
      <div
        className={cn(
          'group flex w-full items-center border-l-[3px] px-5 pl-4 transition-colors',
          done ? 'gap-3 py-2.5 hover:bg-bg-elevated/28' : 'gap-4 py-4 hover:bg-bg-elevated/40',
        )}
        style={getAnchorRowChromeStyles(palette, resolvedTheme, done)}
      >
        <button
          type="button"
          disabled={!isLoaded}
          onClick={() => {
            if (isEditorOpen) return;
            toggleAnchor(id);
          }}
          className={cn('flex min-w-0 flex-1 items-center text-left', done ? 'gap-3' : 'gap-4')}
        >
          <div
            className={cn(
              'flex shrink-0 items-center justify-center',
              done ? 'h-11 w-11 rounded-2xl' : 'h-14 w-14 rounded-3xl',
              item.isDone
                ? 'bg-secondary/20 text-secondary'
                : isSkipped
                  ? 'bg-bg-surface/50 text-text-muted/50'
                  : '',
              (item.isDone || isSkipped) && overviewOrbDepthClass,
              !item.isDone && !isSkipped &&
                'transition-transform duration-200 will-change-transform group-hover:-translate-y-px active:translate-y-0',
            )}
            style={getAnchorOrbStyles(palette, resolvedTheme, item.isDone, isSkipped)}
          >
            {item.isDone ? (
              <svg
                className={done ? 'h-5 w-5' : 'h-6 w-6'}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (() => {
              const IconComponent = iconByName[item.icon];
              return IconComponent ? <IconComponent className="w-6 h-6" strokeWidth={1.5} /> : <span>{item.icon}</span>;
            })()}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p
              className={cn(
                'leading-snug',
                isSkipped && 'text-text-muted/65 line-through decoration-text-muted/40',
                !isSkipped && done && 'text-base font-medium text-text/88',
                !isSkipped && !done && 'text-lg font-semibold text-text',
              )}
            >
              {item.label}
            </p>
            <OverviewTypeChip label="Anchor" icon={AnchorTypeIcon} muted={done} />
          </div>
        </button>
        <button
          type="button"
          disabled={!isLoaded}
          onClick={(e) => {
            e.stopPropagation();
            setOpenEditorAnchorId((prev) => (prev === item.id ? null : id));
          }}
          className={cn(
            'flex shrink-0 self-center text-right tabular-nums transition-colors touch-manipulation',
            isSkipped && 'text-text-muted/50 line-through decoration-text-muted/40',
            !isSkipped && done && 'text-sm font-medium text-text-muted/72',
            !isSkipped && !done && 'text-base font-medium text-text-secondary hover:text-text',
          )}
          aria-label={`Adjust ${item.label} time`}
        >
          {item.time}
        </button>
      </div>
      {isEditorOpen && (
        <div className="px-5 pb-4">
          <MobileAnchorEditPanel
            anchor={anchorData}
            nowMinutes={nowMinutes}
            timeUntilLabel={timeUntilLabel}
            nextEventLabel={nextEventLabel}
            onTimeChange={(t) => handleTimeChange(id, t)}
            onEndTimeChange={(t) => handleEndTimeChange(id, t)}
            onToggleSkip={() => handleToggleSkip(id)}
            onClose={() => setOpenEditorAnchorId(null)}
          />
        </div>
      )}
    </div>
  );
}

function EventOverviewRow({
  item,
  onAcknowledge,
}: {
  item: DailyOverviewItem;
  onAcknowledge: () => void;
}) {
  const marker = getCalendarMarkerColor(item.eventType);
  const win = item.isAcknowledged;

  return (
    <button
      type="button"
      onClick={onAcknowledge}
      className={cn(
        'group flex w-full items-center border-l-[3px] px-5 pl-4 text-left transition-colors',
        win ? 'gap-3 py-2.5 hover:bg-bg-elevated/35' : 'gap-4 py-4 hover:bg-bg-elevated/50',
      )}
      style={{
        borderLeftColor: marker,
        backgroundColor: win
          ? `color-mix(in srgb, ${marker} 6%, var(--color-bg-surface))`
          : `color-mix(in srgb, ${marker} 11%, transparent)`,
      }}
      aria-label={`Calendar: ${item.label}, ${item.time}${win ? ', seen' : ''}`}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-2xl bg-bg-elevated/90',
          win ? 'h-11 w-11' : 'h-14 w-14',
          overviewOrbDepthClass,
        )}
      >
        {item.isAcknowledged ? (
          <svg
            className={cn('text-secondary', win ? 'h-5 w-5' : 'h-6 w-6')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <CalendarDays className="h-7 w-7 shrink-0" strokeWidth={1.5} style={{ color: marker }} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={cn(
            'leading-snug',
            win ? 'text-base font-medium text-text/88' : 'text-lg font-semibold text-text',
          )}
        >
          {item.label}
        </p>
        <OverviewTypeChip label="Calendar" icon={Calendar} muted={win} />
        {item.description ? (
          <p className={cn('mt-0.5 text-text-muted', win ? 'text-xs opacity-90' : 'text-sm')}>{item.description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 self-center text-right">
        <p
          className={cn(
            'tabular-nums',
            win ? 'text-sm font-medium text-text-muted/72' : 'text-base font-medium text-text-secondary',
          )}
        >
          {item.time}
        </p>
      </div>
    </button>
  );
}

function BoundaryOverviewRow({
  item,
  onAcknowledge,
}: {
  item: DailyOverviewItem;
  onAcknowledge: () => void;
}) {
  const rail = boundaryKindRailClass(item.boundaryKind ?? 'cutoff');
  const win = item.isAcknowledged;

  return (
    <button
      type="button"
      onClick={onAcknowledge}
      className={cn(
        'group flex w-full items-start px-5 pl-4 text-left transition-colors',
        win ? 'gap-2.5 bg-bg-surface/40 py-2.5 hover:bg-bg-elevated/30' : 'gap-3 bg-bg-base/25 py-4 hover:bg-bg-elevated/40',
        rail,
      )}
      aria-label={`Time boundary: ${item.label}, ${item.time}${win ? ', acknowledged' : ''}`}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle/90 bg-bg-surface/40',
          win ? 'h-11 w-11' : 'h-14 w-14',
          item.isAcknowledged ? 'border-secondary/40 bg-secondary/10' : 'text-text-muted',
          overviewOrbDepthDashedClass,
        )}
      >
        {item.isAcknowledged ? (
          <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          (() => {
            const IconComponent = iconByName[item.icon];
            return IconComponent ? <IconComponent className="h-5 w-5" strokeWidth={1.5} /> : <span>{item.icon}</span>;
          })()
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={cn(
            'leading-snug',
            win ? 'text-[0.9375rem] font-medium text-text/88' : 'text-base font-medium text-text',
          )}
        >
          {item.label}
        </p>
        <OverviewTypeChip label="Time boundary" icon={Clock} muted={win} />
      </div>

      <div className="flex shrink-0 self-start text-right">
        <p
          className={cn(
            'tabular-nums',
            win ? 'text-sm font-medium text-text-muted/72' : 'text-base font-medium text-text-secondary',
          )}
        >
          {item.time}
        </p>
      </div>
    </button>
  );
}

function SessionPlaceholderRow({
  item,
  onAcknowledge,
}: {
  item: DailyOverviewItem;
  onAcknowledge: () => void;
}) {
  const win = item.isAcknowledged;

  return (
    <button
      type="button"
      onClick={onAcknowledge}
      className={cn(
        'group flex w-full items-center border-l-[3px] border-border-subtle px-5 pl-4 text-left transition-colors',
        win ? 'gap-3 bg-bg-surface/45 py-2.5 hover:bg-bg-elevated/35' : 'gap-4 bg-bg-surface/30 py-4 hover:bg-bg-elevated/50',
      )}
      aria-label={`Time block: ${item.label}, ${item.time}${win ? ', acknowledged' : ''}`}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-accent/10 text-text-muted',
          win ? 'h-11 w-11 rounded-2xl' : 'h-14 w-14',
          overviewOrbDepthClass,
        )}
      >
        {item.isAcknowledged ? (
          <svg className={cn('text-secondary', win ? 'h-5 w-5' : 'h-6 w-6')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <Calendar className="h-6 w-6" strokeWidth={1.5} />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={cn(
            'leading-snug',
            win ? 'text-base font-medium text-text/88' : 'text-lg font-semibold text-text',
          )}
        >
          {item.label}
        </p>
        <OverviewTypeChip label="Time block" icon={Layers} muted={win} />
        {item.description ? (
          <p className={cn('mt-0.5 text-text-muted', win ? 'text-xs opacity-90' : 'text-sm')}>{item.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 self-center text-right">
        <p
          className={cn(
            'tabular-nums',
            win ? 'text-sm font-medium text-text-muted/72' : 'text-base font-medium text-text-secondary',
          )}
        >
          {item.time}
        </p>
      </div>
    </button>
  );
}

export function DailyOverviewList({
  storageScope,
  calendarEvents,
  calendarPlanner,
}: DailyOverviewListProps) {
  const todayKey = getTodayKey();
  const today = useMemo(() => new Date(), []);

  const {
    anchors,
    toggleAnchor,
    setTodayAnchors,
    setTodayAnchorStatus,
    isLoaded,
  } = useDailyAnchorsForToday(storageScope);
  const { plannerStore, plannerDefaults, isLoaded: isPlannerLoaded } = useTimeBlockPlanner();
  const { getPlan, updatePlanField } = calendarPlanner;
  const todayPlan = getPlan(todayKey);

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

  const wakeAnchorForToday = useMemo(
    () => todayAnchors.find((a) => a.id === 'wake') || todayAnchors.find((a) => a.icon === 'sunrise'),
    [todayAnchors]
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
    const acknowledgements = todayPlan.acknowledgements || { boundaries: [], events: [], sessions: [] };

    for (const anchor of todayAnchors) {
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
        sourceData: anchor,
      });
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
        sourceData: event,
      });
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
        sourceData: constraint,
      });
    }

    return items.sort((a, b) => a.scheduledMinutes - b.scheduledMinutes);
  }, [todayAnchors, calendarEvents, activeConstraints, todayKey, todayPlan.acknowledgements]);

  const handleAcknowledge = (itemId: string, itemType: DailyOverviewItem['type']) => {
    const current = todayPlan.acknowledgements || { boundaries: [], events: [], sessions: [] };

    if (itemType === 'boundary') {
      const isAcknowledged = current.boundaries.includes(itemId);
      updatePlanField(todayKey, 'acknowledgements', {
        ...current,
        boundaries: isAcknowledged
          ? current.boundaries.filter((id) => id !== itemId)
          : [...current.boundaries, itemId],
      });
    } else if (itemType === 'event') {
      const isAcknowledged = current.events.includes(itemId);
      updatePlanField(todayKey, 'acknowledgements', {
        ...current,
        events: isAcknowledged
          ? current.events.filter((id) => id !== itemId)
          : [...current.events, itemId],
      });
    } else if (itemType === 'session') {
      const isAcknowledged = current.sessions.includes(itemId);
      updatePlanField(todayKey, 'acknowledgements', {
        ...current,
        sessions: isAcknowledged
          ? current.sessions.filter((id) => id !== itemId)
          : [...current.sessions, itemId],
      });
    }
  };

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
                  todayAnchors={todayAnchors}
                  wakeAnchorForToday={wakeAnchorForToday}
                  nowMinutes={nowMinutes}
                  isLoaded={isLoaded}
                  toggleAnchor={toggleAnchor}
                  handleTimeChange={handleTimeChange}
                  handleEndTimeChange={handleEndTimeChange}
                  handleToggleSkip={handleToggleSkip}
                />
              ) : item.type === 'event' ? (
                <EventOverviewRow
                  item={item}
                  onAcknowledge={() => handleAcknowledge(item.id, item.type)}
                />
              ) : item.type === 'boundary' ? (
                <BoundaryOverviewRow
                  item={item}
                  onAcknowledge={() => handleAcknowledge(item.id, item.type)}
                />
              ) : (
                <SessionPlaceholderRow
                  item={item}
                  onAcknowledge={() => handleAcknowledge(item.id, item.type)}
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
