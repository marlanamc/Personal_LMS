'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  Code2,
  Coffee,
  Dumbbell,
  Flower2,
  GripVertical,
  Heart,
  Moon,
  Music,
  PenTool,
  Sunrise,
  Target,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import { EditAnchorsSheet } from './EditAnchorsSheet';
import { MobileTimeScrubber } from './MobileTimeScrubber';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import {
  formatTimeLabel,
  formatTimeRange,
  getRecentSkippedAnchorStreak,
  getSkipReasonLabel,
  getSkipReasonSuggestion,
  isAnchorScheduledForDate,
  parseHHMMToMinutes,
  type AnchorIcon,
  type AnchorId,
  type DailyAnchorTemplate,
  type SkipReason,
} from '@/lib/anchors';

interface DailyAnchorsTimelineProps {
  storageScope: string;
}

const SKIP_REASON_OPTIONS: Array<{ value: SkipReason; label: string }> = [
  { value: 'tired', label: 'Too tired' },
  { value: 'low_energy', label: 'Low energy' },
  { value: 'schedule_changed', label: 'Schedule changed' },
  { value: 'not_realistic', label: 'Not realistic today' },
  { value: 'sick', label: 'Sick' },
  { value: 'other', label: 'Other' },
];


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

function getTimelineNowPosition(timeStr: string): number | null {
  const minutes = parseHHMMToMinutes(timeStr);
  const startMinutes = TIMELINE_START_HOUR * 60;
  const endMinutes = TIMELINE_END_HOUR * 60;

  if (minutes < startMinutes || minutes >= endMinutes) {
    return null;
  }

  const position = ((minutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
  if (position < 3 || position > 97) {
    return null;
  }

  return Math.max(0, Math.min(100, position));
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

function getTimeUntil(timeStr: string, nowMinutes: number | null): string {
  if (nowMinutes === null) return 'Soon';
  const targetMinutes = parseHHMMToMinutes(timeStr);
  const diffMinutes = targetMinutes - nowMinutes;

  if (diffMinutes < -60) {
    const hours = Math.abs(Math.floor(diffMinutes / 60));
    return `${hours}h ago`;
  }
  if (diffMinutes < 0) return `${Math.abs(diffMinutes)}m ago`;
  if (diffMinutes === 0) return 'Now';
  if (diffMinutes < 60) return `in ${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins === 0 ? `in ${hours}h` : `in ${hours}h ${mins}m`;
}

function formatShortTime(timeStr: string): string {
  return formatTimeLabel(timeStr).replace(':00 ', '').replace(' AM', 'a').replace(' PM', 'p');
}

function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, minutes);
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function getOvernightMinutesUntil(startTime: string, nextDayTime: string): number {
  const startMinutes = parseHHMMToMinutes(startTime);
  const endMinutes = parseHHMMToMinutes(nextDayTime);
  return (24 * 60 - startMinutes) + endMinutes;
}

function getMinutesBetweenEvents(currentTime: string, nextTime: string): number {
  const currentMinutes = parseHHMMToMinutes(currentTime);
  const nextMinutes = parseHHMMToMinutes(nextTime);
  const diff = nextMinutes - currentMinutes;
  return diff >= 0 ? diff : (24 * 60) + diff;
}

function getContextualLabel(
  timeStr: string,
  nowMinutes: number | null,
  isUpNext: boolean,
  status: 'waiting' | 'done' | 'missed' | 'skipped'
): { label: string; variant: 'now' | 'upnext' | 'soon' | null } {
  if (status === 'done' || status === 'skipped') return { label: '', variant: null };
  if (nowMinutes === null) return { label: '', variant: null };

  const scheduledMinutes = parseHHMMToMinutes(timeStr);
  const diff = scheduledMinutes - nowMinutes;

  // "Now" - currently active (within 30 min window after scheduled time)
  if (diff <= 0 && diff >= -30) {
    return { label: 'Now', variant: 'now' };
  }

  // "Up Next" - the immediate next anchor (regardless of time)
  if (isUpNext && diff > 0) {
    return { label: 'Up Next', variant: 'upnext' };
  }

  // "Soon" - within 30 minutes from now
  if (diff > 0 && diff <= 30) {
    return { label: 'Soon', variant: 'soon' };
  }

  return { label: '', variant: null };
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

interface MobileAnchorItemProps {
  anchor: {
    id: AnchorId;
    label: string;
    icon: AnchorIcon;
    scheduledTime: string;
    endTime?: string;
    status: 'waiting' | 'done' | 'missed' | 'skipped';
  };
  isActive: boolean;
  isLast: boolean;
  isFirst: boolean;
  isLoaded: boolean;
  isUpNext: boolean;
  onToggle: () => void;
  onToggleSkip: () => void;
  onTimeChange: (anchorId: AnchorId, newTime: string) => void;
  onEndTimeChange: (anchorId: AnchorId, newTime: string) => void;
  iconByName: Record<AnchorIcon, typeof Sunrise>;
  index: number;
  nowMinutes: number | null;
  timeUntilLabel: string;
  nextEventLabel: string | null;
}

function MobileAnchorItem({
  anchor,
  isActive,
  isLast: _isLast,
  isFirst: _isFirst,
  isLoaded,
  isUpNext,
  onToggle,
  onToggleSkip,
  onTimeChange,
  onEndTimeChange,
  iconByName,
  index,
  nowMinutes,
  timeUntilLabel,
  nextEventLabel,
}: MobileAnchorItemProps) {
  const [isTimeScrubberOpen, setIsTimeScrubberOpen] = useState(false);
  const Icon = iconByName[anchor.icon] || Moon;
  const isDone = anchor.status === 'done';
  const isMissed = anchor.status === 'missed';
  const isSkipped = anchor.status === 'skipped';
  const hasRange = Boolean(anchor.endTime && parseHHMMToMinutes(anchor.endTime) > parseHHMMToMinutes(anchor.scheduledTime));
  const contextLabel = getContextualLabel(anchor.scheduledTime, nowMinutes, isUpNext, anchor.status);

  return (
    <div className="relative" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="relative">
        {/* Main Card - Horizontal layout with more breathing room. When time scrubber is open, don't toggle (edit mode). */}
        <div
          role="button"
          tabIndex={isLoaded ? 0 : -1}
          aria-disabled={!isLoaded}
          aria-expanded={isTimeScrubberOpen}
          onClick={() => {
            if (!isLoaded || isTimeScrubberOpen) return;
            onToggle();
          }}
          onKeyDown={(e) => {
            if (!isLoaded || isTimeScrubberOpen) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          }}
          className={`
            river-flow-card mobile-anchor-row group relative w-full rounded-none px-4 py-3.5 text-left
            transition-colors duration-200 ease-out overflow-visible
            border-0
            ${isDone ? 'mobile-anchor-row-done' : ''}
            ${isActive && !isDone ? 'mobile-anchor-row-active' : ''}
            ${isMissed ? 'mobile-anchor-row-missed' : ''}
            ${isSkipped ? 'mobile-anchor-row-skipped mobile-anchor-row-muted' : ''}
            ${!isDone && !isActive && !isMissed && !isSkipped ? 'mobile-anchor-row-future' : ''}
            ${!isLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="relative flex items-center gap-4">
            {/* Icon Orb - slightly larger for better touch */}
            <div
              className={`
                river-flow-orb mobile-anchor-orb relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                transition-colors duration-200
                ${isDone
                  ? 'mobile-anchor-orb-done'
                  : isMissed
                    ? 'mobile-anchor-orb-missed'
                    : isSkipped
                      ? 'mobile-anchor-orb-skipped mobile-anchor-orb-muted'
                    : isActive
                      ? 'mobile-anchor-orb-active'
                      : 'mobile-anchor-orb-future'
                }
              `}
            >
              {isDone ? (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check size={22} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <Icon
                  size={21}
                  strokeWidth={1.8}
                  className="transition-transform duration-200"
                />
              )}
            </div>

            {/* Content - single row layout */}
            <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
              {/* Label and time */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`
                      text-base font-semibold leading-snug
                      ${isDone ? 'text-text' : ''}
                      ${isActive && !isDone ? 'text-text' : ''}
                      ${isMissed ? 'text-text-muted/60' : ''}
                      ${isSkipped ? 'text-text-muted/65 line-through decoration-text-muted/40' : ''}
                      ${!isDone && !isActive && !isMissed && !isSkipped ? 'text-text' : ''}
                    `}
                  >
                    {anchor.label}
                  </p>
                  {contextLabel.variant && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] ${
                        contextLabel.variant === 'now'
                          ? 'bg-primary/15 text-primary'
                          : contextLabel.variant === 'upnext'
                            ? 'bg-accent-teal/15 text-accent-teal'
                            : 'bg-accent-amethyst/15 text-accent-amethyst'
                      }`}
                    >
                      {contextLabel.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative shrink-0 text-right flex flex-col items-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsTimeScrubberOpen((open) => !open);
                  }}
                  className={`
                    text-xl font-medium tabular-nums transition-colors
                    ${isSkipped ? 'text-text-muted/50 line-through decoration-text-muted/40' : 'text-text-secondary/70 hover:text-text-secondary'}
                  `}
                  aria-label={`Adjust ${anchor.label} time`}
                >
                  {anchor.endTime
                    ? formatTimeRange(anchor.scheduledTime, anchor.endTime, true)
                    : formatTimeLabel(anchor.scheduledTime)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isTimeScrubberOpen && (
          <div
            className="mt-2 rounded-xl border-2 border-primary/25 bg-bg-elevated shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-3 py-2.5 ring-2 ring-primary/10"
            role="dialog"
            aria-label={`Adjust ${anchor.label} time`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/65">
                  Anchor Time
                </p>
                <p className="mt-0.5 text-lg font-semibold leading-tight text-text tabular-nums">
                  {hasRange && anchor.endTime
                    ? formatTimeRange(anchor.scheduledTime, anchor.endTime, true)
                    : formatShortTime(anchor.scheduledTime)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSkip();
                }}
                className="shrink-0 rounded-full border border-border-subtle/80 bg-bg-surface/80 px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] text-text-secondary/80 transition-colors hover:border-accent-teal/40 hover:bg-bg-surface hover:text-text"
              >
                {isSkipped ? 'Undo skip' : 'Skip today'}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {isSkipped ? (
                <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] font-medium text-text-muted">
                  Skipped for today
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] text-text-muted">
                    In: <span className="ml-1 font-semibold text-text">{timeUntilLabel}</span>
                  </span>
                  {nextEventLabel ? (
                    <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] text-text-muted">
                      Next: <span className="ml-1 font-semibold text-text">{nextEventLabel}</span>
                    </span>
                  ) : null}
                </>
              )}
              {nowMinutes === null ? (
                <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] text-text-muted/80">
                  Live time unavailable
                </span>
              ) : null}
            </div>

            <MobileTimeScrubber
              isOpen={isTimeScrubberOpen}
              currentTime={anchor.scheduledTime}
              currentEndTime={hasRange ? anchor.endTime : undefined}
              onTimeChange={(newTime) => onTimeChange(anchor.id, newTime)}
              onEndTimeChange={(newTime) => onEndTimeChange(anchor.id, newTime)}
              onClose={() => setIsTimeScrubberOpen(false)}
            />
            <div className="mt-3 pt-2 border-t border-border-subtle/60">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsTimeScrubberOpen(false);
                }}
                className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold touch-manipulation active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DailyAnchorsTimeline({ storageScope }: DailyAnchorsTimelineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { anchors, activeAnchor, toggleAnchor, anchorTemplates, setTodayAnchors, setTodayAnchorStatus, setAnchorTemplates, isLoaded, weeklySkipReasonInsight } =
    useDailyAnchorsForToday(storageScope);

  const [hoveredAnchor, setHoveredAnchor] = useState<AnchorId | null>(null);
  const [draggingAnchor, setDraggingAnchor] = useState<AnchorId | null>(null);
  const [dragPreviewTime, setDragPreviewTime] = useState<string | null>(null);
  const [isEditingAnchors, setIsEditingAnchors] = useState(false);
  const [skipReasonAnchor, setSkipReasonAnchor] = useState<{ id: AnchorId; label: string } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const todaysAnchors = useMemo(() => {
    const today = new Date();
    return anchors.filter((anchor) => isAnchorScheduledForDate(anchor, today));
  }, [anchors]);

  const completedCount = todaysAnchors.filter((anchor) => anchor.status === 'done').length;
  const totalCount = todaysAnchors.length;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;
  const wakeAnchorForToday = useMemo(
    () => todaysAnchors.find((anchor) => anchor.id === 'wake') || todaysAnchors.find((anchor) => anchor.icon === 'sunrise'),
    [todaysAnchors],
  );

  const sortedAnchors = useMemo(() => {
    return [...todaysAnchors].sort((a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime));
  }, [todaysAnchors]);

  const anchorContextNote = useMemo(() => {
    const contextAnchorId = hoveredAnchor ?? activeAnchor.id;
    return sortedAnchors.find((anchor) => anchor.id === contextAnchorId) ?? activeAnchor;
  }, [activeAnchor, hoveredAnchor, sortedAnchors]);

  const hasAnyImportanceNote = useMemo(
    () => sortedAnchors.some((anchor) => Boolean(anchor.importanceNote?.trim())),
    [sortedAnchors],
  );

  const skippedTodayCount = useMemo(
    () => sortedAnchors.filter((anchor) => anchor.status === 'skipped').length,
    [sortedAnchors],
  );

  const progressPercent = useMemo(() => {
    if (completedCount === 0) return 0;
    const completedAnchors = sortedAnchors.filter((anchor) => anchor.status === 'done');
    if (completedAnchors.length === 0) return 0;
    return Math.max(...completedAnchors.map((anchor) => getTimePosition(anchor.scheduledTime)));
  }, [sortedAnchors, completedCount]);

  const [currentTimePosition, setCurrentTimePosition] = useState<number | null>(null);
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  const recentSkippedStreak = useMemo(
    () => getRecentSkippedAnchorStreak(sortedAnchors, nowMinutes),
    [sortedAnchors, nowMinutes],
  );

  // Find the "up next" anchor - the first future anchor that isn't done/skipped
  const upNextAnchorId = useMemo(() => {
    if (nowMinutes === null) return null;
    for (const anchor of sortedAnchors) {
      if (anchor.status === 'done' || anchor.status === 'skipped') continue;
      const scheduledMinutes = parseHHMMToMinutes(anchor.scheduledTime);
      // Skip anchors that are currently "now" (within 30 min window)
      if (scheduledMinutes <= nowMinutes && nowMinutes - scheduledMinutes <= 30) continue;
      // This is the next upcoming anchor
      if (scheduledMinutes > nowMinutes) {
        return anchor.id;
      }
    }
    return null;
  }, [sortedAnchors, nowMinutes]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const nowStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      setNowMinutes(hours * 60 + minutes);
      setCurrentTimePosition(getTimelineNowPosition(nowStr));
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = useCallback((anchorId: AnchorId, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDraggingAnchor(anchorId);
  }, []);

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggingAnchor || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const positionPercent = ((clientX - rect.left) / rect.width) * 100;
      setDragPreviewTime(positionToTime(positionPercent));
    },
    [draggingAnchor],
  );

  const handleDragEnd = useCallback(() => {
    if (!draggingAnchor || !dragPreviewTime) {
      setDraggingAnchor(null);
      setDragPreviewTime(null);
      return;
    }

    const updatedTodayAnchors = anchors.map((anchor) =>
      anchor.id === draggingAnchor ? { ...anchor, scheduledTime: dragPreviewTime, isTimeOverridden: true } : anchor,
    );
    setTodayAnchors(updatedTodayAnchors);
    setDraggingAnchor(null);
    setDragPreviewTime(null);
  }, [draggingAnchor, dragPreviewTime, anchors, setTodayAnchors]);

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

  const handleMobileTimeChange = useCallback((anchorId: AnchorId, newTime: string) => {
    const updatedAnchors = anchors.map((anchor) =>
      anchor.id === anchorId ? { ...anchor, scheduledTime: newTime, isTimeOverridden: true } : anchor
    );
    setTodayAnchors(updatedAnchors);
  }, [anchors, setTodayAnchors]);

  const handleMobileEndTimeChange = useCallback((anchorId: AnchorId, newTime: string) => {
    const updatedAnchors = anchors.map((anchor) =>
      anchor.id === anchorId ? { ...anchor, endTime: newTime, isTimeOverridden: true } : anchor
    );
    setTodayAnchors(updatedAnchors);
  }, [anchors, setTodayAnchors]);

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
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="text-card font-display text-text tracking-wide truncate">Daily Anchors</h2>
              <span
                className={`
                  text-meta font-semibold px-2 py-1 rounded-full shrink-0
                  ${isAllComplete ? 'bg-secondary/15 text-secondary' : 'bg-bg-surface/80 text-text-muted'}
                `}
              >
                {completedCount}/{totalCount}
              </span>
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
                  strokeDasharray={`${totalCount > 0 ? (completedCount / totalCount) * 88 : 0} 100`}
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

          {hasAnyImportanceNote ? (
            <div className="mb-4 lg:min-h-[5.75rem]">
              {anchorContextNote.importanceNote ? (
                <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-text">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{anchorContextNote.label}</p>
                    <Link href="/dashboard/anchors" className="text-xs font-semibold text-primary hover:underline">
                      Edit why
                    </Link>
                  </div>
                  <p className="mt-1 text-text-muted">{anchorContextNote.importanceNote}</p>
                </div>
              ) : (
                <div className="hidden lg:block h-[5.75rem]" aria-hidden />
              )}
            </div>
          ) : null}

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
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {currentTimePosition !== null && currentTimePosition >= 0 && currentTimePosition <= 100 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none"
                  style={{ left: `${currentTimePosition}%` }}
                >
                  <div className="daily-anchors-now-line w-0.5 h-12 bg-gradient-to-b from-primary/80 via-primary/60 to-transparent rounded-full" />
                  <div className="daily-anchors-now-label absolute top-full mt-1 text-[8px] font-bold text-primary/80 uppercase tracking-wider">now</div>
                </div>
              )}

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
                  const segmentLeft = position;
                  const segmentWidth = endPosition - position;
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
                      className="absolute top-1/2 -translate-y-1/2 z-20 h-8"
                      style={{
                        left: `${segmentLeft}%`,
                        width: `${segmentWidth}%`,
                        minWidth: 0,
                      }}
                      onMouseEnter={() => setHoveredAnchor(anchor.id)}
                      onMouseLeave={() => setHoveredAnchor(null)}
                    >
                      <div
                        className={`
                          absolute inset-0 rounded-full border-2
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
                      <button
                        type="button"
                        onClick={() => toggleAnchor(anchor.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleSkipToday(anchor.id, isSkipped);
                        }}
                        disabled={!isLoaded}
                        title={anchor.endTime ? `${formatTimeRange(anchor.scheduledTime, anchor.endTime, true)} · ${anchor.label}` : anchor.label}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 ${orbBaseClass}
                          opacity-85 hover:opacity-100
                          hover:scale-105 active:scale-95
                          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                          ${!isDone && !isMissed && !isSkipped ? 'border-primary/30 text-text backdrop-blur-sm' : ''}
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
                        bg-bg-elevated/95 backdrop-blur-sm border border-border-subtle shadow-xl
                        transition-all duration-200 z-50
                        ${isHovered || isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
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
              </div>
            </div>
          </div>

          {/* Mobile/tablet layout - clean card list */}
          <div className="lg:hidden mt-0">
            {sortedAnchors.length === 0 ? (
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated/50 px-4 py-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                  <Sunrise size={24} className="text-primary/60" />
                </div>
                <p className="text-sm text-text-muted">No anchors scheduled for today</p>
                <p className="text-xs text-text-muted/60 mt-1">Tap the pencil to add your daily anchors</p>
              </div>
            ) : (
              <div className="mobile-anchor-stack relative overflow-visible rounded-[2.2rem]">
                <div className="rounded-[2.2rem] border border-border-subtle/70 bg-bg-surface/75 overflow-hidden">
                  {sortedAnchors.map((anchor, idx) => (
                    <MobileAnchorItem
                      key={anchor.id}
                      anchor={anchor}
                      isActive={anchor.id === activeAnchor.id}
                      isFirst={idx === 0}
                      isLast={idx === sortedAnchors.length - 1}
                      isLoaded={isLoaded}
                      isUpNext={anchor.id === upNextAnchorId}
                      onToggle={() => toggleAnchor(anchor.id)}
                      onToggleSkip={() => handleToggleSkipToday(anchor.id, anchor.status === 'skipped')}
                      onTimeChange={handleMobileTimeChange}
                      onEndTimeChange={handleMobileEndTimeChange}
                      iconByName={iconByName}
                      index={idx}
                      nowMinutes={nowMinutes}
                      timeUntilLabel={(() => {
                        const raw = getTimeUntil(anchor.scheduledTime, nowMinutes);
                        return raw.startsWith('in ') ? raw.slice(3) : raw;
                      })()}
                      nextEventLabel={(() => {
                        const nextScheduledAnchor = sortedAnchors[idx + 1];
                        if (nextScheduledAnchor) {
                          return formatDuration(getMinutesBetweenEvents(anchor.scheduledTime, nextScheduledAnchor.scheduledTime));
                        }
                        if (wakeAnchorForToday) {
                          return formatDuration(getOvernightMinutesUntil(anchor.scheduledTime, wakeAnchorForToday.scheduledTime));
                        }
                        return null;
                      })()}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <EditAnchorsSheet
        isOpen={isEditingAnchors}
        onClose={closeAnchorEditor}
        anchorTemplates={anchorTemplates}
        onSave={handleSaveAnchors}
      />

      {skipReasonAnchor && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 p-4 lg:items-center">
          <div className="w-full max-w-sm rounded-3xl border border-border-subtle bg-bg-surface p-4 shadow-2xl">
            <h3 className="text-base font-semibold text-text">Why skip {skipReasonAnchor.label}?</h3>
            <p className="mt-1 text-sm text-text-muted">
              Pick a reason so the weekly summary can spot patterns.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {SKIP_REASON_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleConfirmSkipReason(option.value)}
                  className="rounded-2xl border border-border-subtle bg-bg-elevated px-3 py-2 text-sm font-medium text-text transition-colors hover:border-accent-teal/50 hover:bg-bg-surface"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-between gap-2">
              <button
                type="button"
                onClick={() => setSkipReasonAnchor(null)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmSkipReason()}
                className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:bg-bg-surface"
              >
                Skip without reason
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
