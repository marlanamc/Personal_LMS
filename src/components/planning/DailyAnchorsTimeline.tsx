'use client';

import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlarmClock,
  BookOpen,
  Briefcase,
  Brush,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Coffee,
  Dumbbell,
  Flag,
  Flower2,
  GripVertical,
  Heart,
  Moon,
  Music,
  PenTool,
  PhoneOff,
  Shirt,
  Sunrise,
  Target,
  Users,
  Utensils,
  WashingMachine,
  Zap,
} from 'lucide-react';
import { EditAnchorsSheet } from '@/components/dashboard/EditAnchorsSheet';
import { AnchorSkipReasonDialog } from '@/features/planning/components/AnchorSkipReasonDialog';
import { DailyOverviewList } from '@/features/planning/components/DailyOverviewList';
import type { CalendarPlannerApi } from '@/features/planning/hooks/useCalendarPlanner';
import { useDailyAnchors } from '@/components/daily-anchors/useDailyAnchors';
import {
  formatTimeLabel,
  formatTimeRange,
  getActiveAnchor,
  getRecentSkippedAnchorStreak,
  getSkipReasonLabel,
  getSkipReasonSuggestion,
  isAnchorScheduledForDate,
  parseHHMMToMinutes,
  toDateKey,
  type AnchorIcon,
  type AnchorId,
  type AnchorStatus,
  type DailyAnchor,
  type DailyAnchorTemplate,
  type SkipReason,
} from '@/lib/anchors';
import {
  formatDuration,
  formatShortTime,
  getMinutesBetweenEvents,
  getOvernightMinutesUntil,
  getTimeUntil,
} from '@/lib/anchors-mobile-ui';
import {
  describeConstraintRule,
  getActiveConstraintsForDay,
  getActiveTimeBlockStatus,
  getConstraintDisplayDayPlan,
  type PlannerConstraintRule,
  type PlannerConstraintRuleKind,
  type TimeBlockKind,
} from '@/lib/time-block-planner';
import { useTimeBlockPlanner } from '@/features/planning/hooks/useTimeBlockPlanner';
import type { CalendarEvent } from '@/features/planning/types';
import { getCalendarMarkerColor } from '@/components/planning/MiniCalendar';
import { getBoundaryKindAccent } from '@/features/planning/components/daily-overview-styles';

interface DailyAnchorsTimelineProps {
  storageScope: string;
  calendarEvents: CalendarEvent[];
  calendarPlanner: CalendarPlannerApi;
}


const iconByName: Record<AnchorIcon, typeof Sunrise> = {
  sunrise: Sunrise,
  'flower-2': Flower2,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  moon: Moon,
  'book-open': BookOpen,
  code: Code2,
  target: Target,
  coffee: Coffee,
  heart: Heart,
  calendar: Calendar,
  utensils: Utensils,
  music: Music,
  users: Users,
  'pen-tool': PenTool,
  zap: Zap,
  brush: Brush,
  shirt: Shirt,
  'washing-machine': WashingMachine,
};

function gradientByIcon(icon: AnchorIcon): string {
  if (icon === 'dumbbell' || icon === 'users') return 'from-emerald-400/20 to-teal-300/10';
  if (icon === 'briefcase' || icon === 'code' || icon === 'pen-tool') return 'from-sky-400/20 to-blue-300/10';
  if (icon === 'sunrise' || icon === 'coffee' || icon === 'utensils' || icon === 'zap') return 'from-amber-400/20 to-orange-300/10';
  if (icon === 'flower-2') return 'from-cyan-400/20 to-teal-300/10';
  if (icon === 'heart') return 'from-rose-400/20 to-pink-300/10';
  if (icon === 'target') return 'from-purple-400/20 to-fuchsia-300/10';
  if (icon === 'book-open' || icon === 'calendar' || icon === 'music') return 'from-indigo-400/20 to-violet-300/10';
  return 'from-violet-400/20 to-purple-300/10';
}

// Timeline visual bounds
const TIMELINE_START_HOUR = 6;
const TIMELINE_END_HOUR = 24;
const TIMELINE_TOTAL_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;

function getTimePosition(timeStr: string): number {
  const minutes = parseHHMMToMinutes(timeStr);
  const startMinutes = TIMELINE_START_HOUR * 60;
  const position = ((minutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
  return Math.max(2, Math.min(98, position));
}

function minutesToHHMM(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(totalMinutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Filled “chips” distinct from the track gradient: solid-tinted body + rim + depth. */
function oaoaRhythmSegmentStyle(kind: TimeBlockKind, isActive: boolean): CSSProperties {
  const accent = kind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)';
  return {
    background: `linear-gradient(180deg,
      color-mix(in srgb, ${accent} 68%, var(--color-bg-elevated)) 0%,
      color-mix(in srgb, ${accent} 42%, var(--color-bg-elevated)) 100%)`,
    borderColor: `color-mix(in srgb, ${accent} 82%, var(--color-border-subtle))`,
    boxShadow: isActive
      ? `0 0 0 2px color-mix(in srgb, ${accent} 50%, transparent),
         0 4px 18px color-mix(in srgb, ${accent} 42%, transparent),
         inset 0 1px 0 rgba(255, 255, 255, 0.55)`
      : `0 2px 8px rgba(15, 23, 42, 0.16),
         inset 0 1px 0 rgba(255, 255, 255, 0.45)`,
  };
}

/** 0–100: elapsed share of the visible day window (6:00–24:00); aligns track fill with the “now” line. */
function getDayProgressPercentFromMinutes(nowMinutes: number): number {
  const startMinutes = TIMELINE_START_HOUR * 60;
  const endMinutes = TIMELINE_END_HOUR * 60;
  if (nowMinutes < startMinutes) return 0;
  if (nowMinutes >= endMinutes) return 100;
  return ((nowMinutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
}

function constraintKindIcon(kind: PlannerConstraintRuleKind) {
  switch (kind) {
    case 'cutoff':
      return PhoneOff;
    case 'until':
      return Flag;
    case 'deadline':
      return AlarmClock;
    default:
      return PhoneOff;
  }
}

/** Relative time for overlay tooltips (matches list “in …” semantics without the leading “in ”). */
function formatRiverInLabel(timeStr: string, nowMinutes: number | null): string {
  if (nowMinutes === null) return '—';
  const raw = getTimeUntil(timeStr, nowMinutes);
  if (raw === 'Soon') return '—';
  if (raw.startsWith('in ')) return raw.slice(3).trim();
  return raw;
}

/** Matches desktop anchor hover bubble (range + point): tight padding, elevated glass, bottom caret. */
function RiverOverlayHoverCard({
  title,
  timeLabel,
  inLabel,
  children,
}: {
  title: string;
  timeLabel: string;
  inLabel: string;
  children: ReactNode;
}) {
  const fullLabel = `${title}. ${timeLabel}. In: ${inLabel}`;
  return (
    <div
      className="group relative flex flex-col items-center justify-center rounded-sm outline-none pointer-events-auto focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      tabIndex={0}
      aria-label={fullLabel}
    >
      {children}
      <div
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-max max-w-[min(220px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border-subtle bg-bg-elevated/95 px-3 py-2 text-left shadow-xl backdrop-blur-sm transition-all duration-200 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        role="tooltip"
      >
        <div className="text-xs font-bold text-text whitespace-nowrap">{timeLabel}</div>
        <div className="mt-0.5 max-w-[200px] text-[10px] leading-snug text-text-muted line-clamp-2">{title}</div>
        <div className="mt-0.5 text-[10px] whitespace-nowrap text-text-muted">{`In: ${inLabel}`}</div>
        <div
          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border-subtle bg-bg-elevated"
          aria-hidden
        />
      </div>
    </div>
  );
}

/** Shared NOW stack: glow + bright core; line stays vertically centered on the track, label sits above so it doesn’t collide with anchor titles. */
/** z-[14]: below anchor orbs/labels (z-20) and range segments (z-[15]), above river overlays (z-[12]) + track. */
function TimelineNowMarker({
  leftPercent,
  show,
  compact,
}: {
  leftPercent: number;
  show: boolean;
  compact?: boolean;
}) {
  if (!show) return null;
  /** Taller line reads over anchor orbs; mobile strip stays a bit shorter to reduce clipping. */
  const lineH = compact ? 'h-14' : 'h-24';
  const labelClass = compact ? 'text-[7px] mb-1' : 'text-[8px] mb-1.5';
  return (
    <div
      className="absolute top-1/2 z-[14] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${leftPercent}%` }}
      role="img"
      aria-label="Current time"
    >
      <div className={`relative flex w-5 shrink-0 items-center justify-center ${lineH}`}>
        <span
          className={`daily-anchors-now-label absolute bottom-full left-1/2 -translate-x-1/2 font-extrabold uppercase tracking-wider whitespace-nowrap ${labelClass}`}
        >
          now
        </span>
        <div
          className="absolute inset-y-0 -inset-x-1 rounded-full bg-primary/50 blur-md opacity-90"
          aria-hidden
        />
        <div className={`daily-anchors-now-line relative z-[1] w-[2px] shrink-0 rounded-full ${lineH}`} />
      </div>
    </div>
  );
}

/** Desktop-only: dashed constraint lines + light calendar ticks (below anchor orbs, z-[12]). */
function DesktopPlannerRiverOverlays({
  constraints,
  todayCalendarEvents,
  nowMinutes,
}: {
  constraints: PlannerConstraintRule[];
  todayCalendarEvents: CalendarEvent[];
  nowMinutes: number | null;
}) {
  return (
    <>
      {constraints.map((c) => {
        const Icon = constraintKindIcon(c.kind);
        const accent = getBoundaryKindAccent(c.kind);
        const titleText = c.displayText?.trim() || describeConstraintRule(c);
        const timeLine = formatTimeLabel(c.time);
        const inLine = formatRiverInLabel(c.time, nowMinutes);
        const left = getTimePosition(c.time);
        return (
          <div
            key={`river-constraint-${c.id}`}
            className="absolute top-1/2 z-[12] flex min-h-[4.5rem] w-7 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center"
            style={{ left: `${left}%` }}
          >
            <RiverOverlayHoverCard title={titleText} timeLabel={timeLine} inLabel={inLine}>
              <div className="flex flex-col items-center">
                <div
                  className="h-16 w-0 shrink-0 rounded-full border-l-2 border-dashed"
                  style={{ borderColor: `color-mix(in srgb, ${accent} 62%, transparent)` }}
                  aria-hidden
                />
                <Icon
                  className="relative -top-1.5 h-3 w-3 shrink-0 opacity-90"
                  style={{ color: accent }}
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
            </RiverOverlayHoverCard>
          </div>
        );
      })}
      {todayCalendarEvents.map((ev) => {
        const eventDate = new Date(ev.date);
        const t = `${String(eventDate.getHours()).padStart(2, '0')}:${String(eventDate.getMinutes()).padStart(2, '0')}`;
        const left = getTimePosition(t);
        const marker = getCalendarMarkerColor(ev.type);
        const titleText = ev.title?.trim() || 'Calendar';
        const subtitle = ev.type ? `${titleText} · ${ev.type}` : titleText;
        const timeLine = formatTimeLabel(t);
        const inLine = formatRiverInLabel(t, nowMinutes);
        const key = ev.id ?? `cal-${ev.date}`;
        return (
          <div
            key={`river-cal-${key}`}
            className="absolute top-1/2 z-[12] flex min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center"
            style={{ left: `${left}%` }}
          >
            <RiverOverlayHoverCard title={subtitle} timeLabel={timeLine} inLabel={inLine}>
              <Calendar className="h-5 w-5 opacity-90" strokeWidth={2.15} style={{ color: marker }} aria-hidden />
            </RiverOverlayHoverCard>
          </div>
        );
      })}
    </>
  );
}

function positionToTime(positionPercent: number): string {
  const startMinutes = TIMELINE_START_HOUR * 60;
  const minutes = startMinutes + (positionPercent / 100) * TIMELINE_TOTAL_MINUTES;
  const clampedMinutes = Math.max(startMinutes, Math.min(TIMELINE_END_HOUR * 60 - 1, minutes));
  const roundedMinutes = Math.round(clampedMinutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const mins = roundedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// River Flow color schemes for different icon types
function getRiverFlowGradient(icon: AnchorIcon): { from: string; to: string; glow: string } {
  const gradients: Record<string, { from: string; to: string; glow: string }> = {
    sunrise: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    coffee: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    utensils: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    zap: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    dumbbell: { from: 'from-emerald-400/20', to: 'to-teal-300/10', glow: 'rgba(52, 211, 153, 0.3)' },
    users: { from: 'from-emerald-400/20', to: 'to-teal-300/10', glow: 'rgba(52, 211, 153, 0.3)' },
    'flower-2': { from: 'from-cyan-400/20', to: 'to-teal-300/10', glow: 'rgba(34, 211, 238, 0.3)' },
    briefcase: { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    code: { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    'pen-tool': { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    'book-open': { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
    calendar: { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
    music: { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
    target: { from: 'from-purple-400/20', to: 'to-fuchsia-300/10', glow: 'rgba(192, 132, 252, 0.3)' },
    heart: { from: 'from-rose-400/20', to: 'to-pink-300/10', glow: 'rgba(251, 113, 133, 0.3)' },
    moon: { from: 'from-violet-400/20', to: 'to-purple-300/10', glow: 'rgba(167, 139, 250, 0.3)' },
  };
  return gradients[icon] || { from: 'from-primary/20', to: 'to-accent/10', glow: 'rgba(212, 138, 166, 0.3)' };
}

interface MobileAnchorsTimelineStripProps {
  hourMarkers: { hour: number; label: string }[];
  sortedAnchors: DailyAnchor[];
  /** Elapsed time through the day window (matches “now” marker). */
  timeFillPercent: number;
  showNowMarker: boolean;
  isLoaded: boolean;
  activeAnchor: DailyAnchor;
  toggleAnchor: (id: AnchorId) => void;
  onToggleSkip: (id: AnchorId, isSkipped: boolean) => void;
  isPlannerLoaded: boolean;
  onAgainRhythm: {
    segments: Array<{
      id: string;
      kind: TimeBlockKind;
      label: string;
      left: number;
      width: number;
      isActive: boolean;
    }>;
    gapMarkers: Array<{ id: string; left: number; prevKind: TimeBlockKind }>;
  };
}

/** Compact timeline for viewports below lg: hour axis + track + anchor markers above the daily list. */
function MobileAnchorsTimelineStrip({
  hourMarkers,
  sortedAnchors,
  timeFillPercent,
  showNowMarker,
  isLoaded,
  activeAnchor,
  toggleAnchor,
  onToggleSkip,
  isPlannerLoaded,
  onAgainRhythm,
}: MobileAnchorsTimelineStripProps) {
  if (sortedAnchors.length === 0 && onAgainRhythm.segments.length === 0) {
    return null;
  }

  return (
    <div
      className="mb-3 rounded-2xl border border-border-subtle/60 bg-bg-surface/45 px-3 pt-2.5 pb-3"
      aria-label="Daily anchors timeline"
    >
      <div className="flex justify-between gap-1 mb-1.5 px-0.5">
        {hourMarkers.map(({ hour, label }) => (
          <span key={hour} className="daily-anchors-hour-tick text-[9px] text-text-muted/45 font-medium tabular-nums">
            {label}
          </span>
        ))}
      </div>

      <div className="relative h-11 py-1">
        <div className="daily-anchors-track-base absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-bg-surface/40 via-bg-surface/60 to-bg-surface/40 overflow-hidden" />

        <motion.div
          className="daily-anchors-track-progress absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-secondary via-primary to-accent-teal"
          initial={{ width: 0 }}
          animate={{ width: `${timeFillPercent}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {isPlannerLoaded && onAgainRhythm.segments.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-[10] overflow-visible" aria-hidden>
            {onAgainRhythm.segments.map((seg) => (
              <div
                key={`oaoa-seg-mobile-${seg.id}`}
                title={seg.label}
                className={`absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full border-2 ${
                  seg.isActive ? 'z-[1] scale-[1.03]' : 'z-0'
                }`}
                style={{
                  ...oaoaRhythmSegmentStyle(seg.kind, seg.isActive),
                  left: `${seg.left}%`,
                  width: `${Math.max(seg.width, 0.35)}%`,
                  minWidth: seg.isActive ? 10 : 7,
                }}
              />
            ))}
            {onAgainRhythm.gapMarkers.map((gap) => {
              const c = gap.prevKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)';
              return (
                <div
                  key={`${gap.id}-mobile`}
                  className="absolute top-1/2 z-[2] flex h-10 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  style={{ left: `${gap.left}%` }}
                >
                  <div
                    className="h-full w-[4px] rounded-full border-2 border-bg-elevated/90"
                    style={{
                      background: `linear-gradient(180deg, transparent 0%, ${c} 22%, ${c} 78%, transparent 100%)`,
                      boxShadow: `0 0 12px color-mix(in srgb, ${c} 55%, transparent), inset 0 0 0 1px color-mix(in srgb, ${c} 40%, transparent)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {sortedAnchors.map((anchor) => {
          const Icon = iconByName[anchor.icon] || Moon;
          const isActive = anchor.id === activeAnchor.id;
          const isDone = anchor.status === 'done';
          const isMissed = anchor.status === 'missed';
          const isSkipped = anchor.status === 'skipped';
          const isRange = Boolean(
            anchor.endTime && parseHHMMToMinutes(anchor.endTime) > parseHHMMToMinutes(anchor.scheduledTime),
          );

          const displayTime = anchor.scheduledTime;
          const position = getTimePosition(displayTime);
          const endPosition = isRange && anchor.endTime ? getTimePosition(anchor.endTime) : null;

          const stateClass = isDone
            ? 'is-done'
            : isMissed
              ? 'is-missed'
              : isSkipped
                ? 'is-skipped'
                : isActive
                  ? 'is-active'
                  : 'is-future';

          if (isRange && endPosition != null && endPosition > position) {
            const segmentLeft = getTimePosition(displayTime);
            const segmentRight = anchor.endTime ? getTimePosition(anchor.endTime) : endPosition;
            const segmentWidth = segmentRight - segmentLeft;
            const w = Math.max(segmentWidth, 2);
            return (
              <button
                key={anchor.id}
                type="button"
                disabled={!isLoaded}
                title={anchor.endTime ? formatTimeRange(displayTime, anchor.endTime, true) : anchor.label}
                aria-label={`${anchor.label}, ${anchor.endTime ? formatTimeRange(displayTime, anchor.endTime, true) : displayTime}`}
                className={`
                  absolute top-1/2 -translate-y-1/2 z-[15] h-2 min-h-[6px] rounded-full border shadow-sm transition-transform
                  active:scale-[0.98]
                  ${isDone
                    ? 'border-secondary/45 bg-secondary/75'
                    : isMissed
                      ? 'border-border-subtle/50 bg-bg-surface/50'
                      : isSkipped
                        ? 'border-border-subtle/45 bg-bg-surface/40 grayscale'
                        : `border-primary/25 bg-gradient-to-r ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} opacity-90`
                  }
                  ${!isLoaded ? 'opacity-50' : ''}
                `}
                style={{
                  left: `${segmentLeft}%`,
                  width: `${w}%`,
                  minWidth: '8px',
                }}
                onClick={() => toggleAnchor(anchor.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSkip(anchor.id, isSkipped);
                }}
              />
            );
          }

          return (
            <div
              key={anchor.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
              style={{ left: `${position}%` }}
            >
              <button
                type="button"
                disabled={!isLoaded}
                title={anchor.label}
                aria-label={`${anchor.label}, ${formatShortTime(displayTime)}`}
                onClick={() => toggleAnchor(anchor.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSkip(anchor.id, isSkipped);
                }}
                className={`
                  daily-anchors-dot relative flex h-9 w-9 items-center justify-center rounded-xl border-2 shadow-md
                  transition-all duration-300 overflow-hidden
                  ${
                    isDone
                      ? 'bg-gradient-to-br from-secondary to-secondary/80 text-white border-secondary/50'
                      : isMissed
                        ? 'bg-bg-surface/50 text-text-muted/40 border-border-subtle/50'
                        : isSkipped
                          ? 'bg-bg-surface/40 text-text-muted/45 border-border-subtle/45 grayscale'
                          : isActive
                            ? `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-2 border-primary/30 text-text`
                            : `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-2 border-border-subtle text-text-muted`
                  }
                  ${stateClass}
                  ${isActive && !isDone && !isMissed && !isSkipped ? 'ring-2 ring-accent-teal/25 animate-pulse-subtle' : ''}
                  active:scale-95
                  ${!isLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {!isDone && !isMissed && !isSkipped && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientByIcon(anchor.icon)} opacity-35`}
                    aria-hidden
                  />
                )}
                <span className="relative z-10">
                  {isDone ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <Icon size={16} strokeWidth={1.7} className={isActive ? 'text-text' : ''} />
                  )}
                </span>
              </button>
            </div>
          );
        })}

        <TimelineNowMarker leftPercent={timeFillPercent} show={showNowMarker} compact />
      </div>
    </div>
  );
}

export function DailyAnchorsTimeline({
  storageScope,
  calendarEvents,
  calendarPlanner,
}: DailyAnchorsTimelineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getPlan } = calendarPlanner;
  const { getStateForDate, toggleAnchorForDate, setAnchorStatusForDate, setAnchorsForDate, anchorTemplates, setAnchorTemplates, isLoaded, weeklySkipReasonInsight } =
    useDailyAnchors(storageScope);

  // Date navigation: default to today, allow browsing up to 7 days back
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const isToday = useMemo(() => {
    const today = new Date();
    return toDateKey(viewDate) === toDateKey(today);
  }, [viewDate]);

  const viewDateState = getStateForDate(viewDate);
  const anchors = viewDateState.anchors;
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

  /** Matches DailyOverviewList: anchors (done) + events/boundaries (acknowledged). */
  const overviewProgress = useMemo(() => {
    const ack = todayPlan?.acknowledgements ?? {
      boundaries: [] as string[],
      events: [] as string[],
      sessions: [] as string[],
      plans: [] as string[],
    };
    let completed = 0;
    let total = 0;
    for (const a of todaysAnchors) {
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
  }, [todaysAnchors, todayCalendarEventsForRiver, activeConstraintsForRiver, todayPlan?.acknowledgements]);

  const overviewCompletedCount = overviewProgress.completed;
  const overviewTotalCount = overviewProgress.total;
  const isOverviewAllComplete = overviewTotalCount > 0 && overviewCompletedCount === overviewTotalCount;

  const isAllComplete = isOverviewAllComplete;
  const wakeAnchorForToday = useMemo(
    () => todaysAnchors.find((anchor) => anchor.id === 'wake') || todaysAnchors.find((anchor) => anchor.icon === 'sunrise'),
    [todaysAnchors],
  );

  const sortedAnchors = useMemo(() => {
    return [...todaysAnchors].sort((a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime));
  }, [todaysAnchors]);

  const skippedTodayCount = useMemo(
    () => sortedAnchors.filter((anchor) => anchor.status === 'skipped').length,
    [sortedAnchors],
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

  return (
    <>
      <div className={`daily-anchors-card mobile-anchors-plain relative rounded-none lg:rounded-2xl ${isEditingAnchors ? 'overflow-visible z-40' : 'overflow-hidden'}`}>
        <div aria-hidden className="absolute inset-0 daily-anchors-nebula pointer-events-none" />

        <div className="relative p-0 lg:p-5 z-10">
          {/* Desktop header - side by side (mobile/tablet use card list) */}
          <div className="hidden lg:flex items-center justify-between gap-3 mb-6">
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
          </div>

          {recentSkippedStreak >= 3 && (
            <div className="mb-4 rounded-2xl border border-warning/35 bg-warning/10 px-4 py-3 text-sm text-text">
              <p className="font-semibold">
                That&apos;s {recentSkippedStreak} skips in a row. What&apos;s going on?
              </p>
              <p className="mt-1 text-text-muted">
                {skippedTodayCount} skipped today. If the plan is off, adjust the anchor times instead of burning the whole block.
              </p>
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

          {weeklySkipReasonInsight && weeklySkipReasonInsight.count >= 2 && (
            <div className="mb-4 rounded-2xl border border-border-subtle bg-bg-elevated/75 px-4 py-3 text-sm text-text">
              <p className="font-semibold">
                This week: {weeklySkipReasonInsight.anchorLabel} skipped {weeklySkipReasonInsight.count} times because {getSkipReasonLabel(weeklySkipReasonInsight.reason)}.
              </p>
              <p className="mt-1 text-text-muted">
                {getSkipReasonSuggestion(weeklySkipReasonInsight.reason)}
              </p>
            </div>
          )}

          <div className="hidden lg:block">
            <div className="relative" ref={timelineRef}>
              <div className="flex justify-between mb-2 px-1">
                {hourMarkers.map(({ hour, label }) => (
                  <span key={hour} className="daily-anchors-hour-tick text-[9px] text-text-muted/40 font-medium tabular-nums">
                    {label}
                  </span>
                ))}
              </div>

              <div className="relative h-20 py-2">
              <div className="daily-anchors-track-base absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-bg-surface/40 via-bg-surface/60 to-bg-surface/40 overflow-hidden">
                {/* Subtle shimmer on track */}
                <div className="desktop-track-shimmer absolute inset-0 pointer-events-none" aria-hidden />
              </div>

              <motion.div
                className="daily-anchors-track-progress absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-secondary via-primary to-accent-teal"
                initial={{ width: 0 }}
                animate={{ width: `${dayProgressPercent}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />

              {isPlannerLoaded && onAgainRhythm.segments.length > 0 && (
                <div
                  className="pointer-events-none absolute inset-0 z-[10] overflow-visible"
                  aria-hidden
                >
                  {onAgainRhythm.segments.map((seg) => (
                    <div
                      key={`oaoa-seg-${seg.id}`}
                      title={seg.label}
                      className={`absolute top-1/2 h-3 -translate-y-1/2 rounded-full border-2 ${
                        seg.isActive ? 'z-[1] scale-[1.03]' : 'z-0'
                      }`}
                      style={{
                        ...oaoaRhythmSegmentStyle(seg.kind, seg.isActive),
                        left: `${seg.left}%`,
                        width: `${Math.max(seg.width, 0.35)}%`,
                        minWidth: seg.isActive ? 12 : 8,
                      }}
                    />
                  ))}
                  {onAgainRhythm.gapMarkers.map((gap) => {
                    const c = gap.prevKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)';
                    return (
                      <div
                        key={gap.id}
                        className="absolute top-1/2 z-[2] flex h-11 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                        style={{ left: `${gap.left}%` }}
                      >
                        <div
                          className="h-full w-[5px] rounded-full border-2 border-bg-elevated/90"
                          style={{
                            background: `linear-gradient(180deg, transparent 0%, ${c} 22%, ${c} 78%, transparent 100%)`,
                            boxShadow: `0 0 14px color-mix(in srgb, ${c} 55%, transparent), inset 0 0 0 1px color-mix(in srgb, ${c} 40%, transparent)`,
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

              {sortedAnchors.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-text-muted">No anchors scheduled for today</span>
                </div>
              )}

              {sortedAnchors.map((anchor, index) => {
                const Icon = iconByName[anchor.icon] || Moon;
                const isActive = anchor.id === activeAnchor.id;
                const isDragging = anchor.id === draggingAnchor;
                const isHovered = anchor.id === hoveredAnchor;
                const isDone = anchor.status === 'done';
                const isMissed = anchor.status === 'missed';
                const isSkipped = anchor.status === 'skipped';
                const isRange = Boolean(anchor.endTime && parseHHMMToMinutes(anchor.endTime) > parseHHMMToMinutes(anchor.scheduledTime));

                const displayTime = isDragging && dragPreviewTime ? dragPreviewTime : anchor.scheduledTime;
                const position = getTimePosition(displayTime);
                const endPosition = isRange && anchor.endTime ? getTimePosition(anchor.endTime) : null;
                const timeUntil = getTimeUntil(anchor.scheduledTime, nowMinutes);
                const inLabel = timeUntil.startsWith('in ') ? timeUntil.slice(3) : timeUntil;
                const isLightsOutAnchor = anchor.id === 'lightsOut' || anchor.icon === 'moon';
                const nextScheduledAnchor = sortedAnchors[index + 1];
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
                  : isMissed
                    ? 'is-missed'
                    : isSkipped
                      ? 'is-skipped'
                    : isActive
                      ? 'is-active'
                      : 'is-future';

                if (isRange && endPosition != null && endPosition > position) {
                  // Use preview times during drag for range anchors
                  const displayEndTime = isDragging && dragPreviewEndTime ? dragPreviewEndTime : anchor.endTime;
                  const segmentLeft = getTimePosition(displayTime);
                  const segmentRight = displayEndTime ? getTimePosition(displayEndTime) : endPosition;
                  const segmentWidth = segmentRight - segmentLeft;
                  const orbBaseClass = `
                    daily-anchors-dot w-12 h-12 rounded-2xl flex items-center justify-center
                    border-2 shadow-md overflow-hidden transition-all duration-300
                    backdrop-blur-sm
                    ${isDone
                      ? 'bg-secondary/90 text-white border-secondary/50'
                      : isMissed
                        ? 'bg-bg-surface/45 text-text-muted/40 border-border-subtle/50'
                        : isSkipped
                          ? 'bg-bg-surface/35 text-text-muted/45 border-border-subtle/45 grayscale'
                          : `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-border-subtle/80 text-text-muted`
                    }
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
                          <div className={`text-[10px] whitespace-nowrap ${isDone ? 'text-secondary' : isMissed ? 'text-error/70' : isSkipped ? 'text-text-muted/70' : 'text-text-muted'}`}>
                            {isDone ? 'Completed' : isMissed ? 'Missed' : isSkipped ? 'Skipped' : `In: ${inLabel}`}
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
                          absolute inset-0 rounded-full border-2
                          ${isDragging ? 'ring-2 ring-accent-teal/35 shadow-lg' : ''}
                          ${isDone
                            ? 'bg-secondary/20 border-secondary/40'
                            : isMissed
                              ? 'bg-bg-surface/30 border-border-subtle/40'
                              : isSkipped
                                ? 'bg-bg-surface/25 border-border-subtle/40'
                                : `bg-gradient-to-r ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} border-primary/25 opacity-60`
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
                          opacity-85 hover:opacity-100
                          hover:scale-105 active:scale-95
                          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                          ${!isDone && !isMissed && !isSkipped ? 'border-primary/30 text-text backdrop-blur-sm' : ''}
                          ${isDragging ? 'scale-110 shadow-xl ring-2 ring-accent-teal/35' : ''}
                        `}
                        style={
                          !isDone && !isMissed && !isSkipped
                            ? { ['--node-glow' as string]: getRiverFlowGradient(anchor.icon).glow }
                            : undefined
                        }
                      >
                        {!isDone && !isMissed && !isSkipped && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} opacity-30`} aria-hidden />
                        )}
                        <span className="relative z-10">
                          {isDone ? <Check size={20} strokeWidth={2.5} /> : <Icon size={20} strokeWidth={1.7} />}
                        </span>
                      </button>
                      <div
                        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 ${orbBaseClass} pointer-events-none opacity-90`}
                        aria-hidden
                      >
                        {!isDone && !isMissed && !isSkipped && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} opacity-30`} aria-hidden />
                        )}
                        <span className="relative z-10">
                          <Icon size={20} strokeWidth={1.7} />
                        </span>
                      </div>
                      <span className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 text-[10px] font-semibold whitespace-nowrap ${isActive ? 'text-text' : 'text-text-muted/70'}`}>
                        {anchor.label}
                      </span>
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
                          daily-anchors-dot desktop-anchor-node group/node relative w-12 h-12 rounded-2xl flex items-center justify-center
                          transition-all duration-300 shadow-md overflow-hidden
                          ${
                            isDone
                              ? 'bg-gradient-to-br from-secondary to-secondary/80 text-white border-2 border-secondary/50'
                              : isMissed
                                ? 'bg-bg-surface/50 text-text-muted/40 border-2 border-border-subtle/50'
                                : isSkipped
                                  ? 'bg-bg-surface/40 text-text-muted/45 border-2 border-border-subtle/45 grayscale'
                                : isActive
                                  ? `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-2 border-primary/30 text-text`
                                  : `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-2 border-border-subtle text-text-muted`
                          }
                          ${stateClass}
                          ${isActive && !isDone && !isMissed && !isSkipped ? 'ring-2 ring-accent-teal/25 animate-pulse-subtle' : ''}
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
                        {!isDone && !isMissed && !isSkipped && (
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
                              <Check size={20} strokeWidth={2.5} />
                            </motion.div>
                          ) : (
                            <Icon size={20} strokeWidth={1.7} className={isActive ? 'text-text' : ''} />
                          )}
                        </span>
                      </button>
                      <span className={`absolute -bottom-5 text-[10px] font-semibold whitespace-nowrap ${isActive ? 'text-text' : 'text-text-muted/70'}`}>
                        {anchor.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              <TimelineNowMarker leftPercent={dayProgressPercent} show={showNowMarker} />
              </div>
            </div>
          </div>

          {/* Mobile/tablet layout - compact timeline + unified daily overview */}
          <div className="lg:hidden mt-0">
            <MobileAnchorsTimelineStrip
              hourMarkers={hourMarkers}
              sortedAnchors={sortedAnchors}
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
              storageScope={storageScope}
              calendarEvents={calendarEvents}
              calendarPlanner={calendarPlanner}
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
