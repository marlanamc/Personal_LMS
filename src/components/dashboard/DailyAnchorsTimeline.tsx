'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  Pencil,
  Plus,
  Save,
  Sunrise,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { MobileTimeScrubber } from './MobileTimeScrubber';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import {
  formatTimeLabel,
  isAnchorScheduledForDate,
  parseHHMMToMinutes,
  sanitizeAnchorId,
  type AnchorIcon,
  type AnchorId,
  type DailyAnchorTemplate,
  type DayOfWeek,
} from '@/lib/anchors';

interface DailyAnchorsTimelineProps {
  storageScope: string;
}

const WEEKDAY_OPTIONS: Array<{ value: DayOfWeek; short: string; label: string }> = [
  { value: 0, short: 'S', label: 'Sunday' },
  { value: 1, short: 'M', label: 'Monday' },
  { value: 2, short: 'T', label: 'Tuesday' },
  { value: 3, short: 'W', label: 'Wednesday' },
  { value: 4, short: 'T', label: 'Thursday' },
  { value: 5, short: 'F', label: 'Friday' },
  { value: 6, short: 'S', label: 'Saturday' },
];

const ICON_OPTIONS: Array<{ value: AnchorIcon; label: string }> = [
  { value: 'sunrise', label: 'Sunrise' },
  { value: 'flower-2', label: 'Meditation' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'moon', label: 'Moon' },
  { value: 'book-open', label: 'Book' },
  { value: 'code', label: 'Code' },
  { value: 'target', label: 'Target' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'heart', label: 'Heart' },
  { value: 'calendar', label: 'Calendar' },
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
};

function gradientByIcon(icon: AnchorIcon): string {
  if (icon === 'dumbbell') return 'from-emerald-400/20 to-teal-300/10';
  if (icon === 'briefcase' || icon === 'code') return 'from-sky-400/20 to-blue-300/10';
  if (icon === 'sunrise' || icon === 'coffee') return 'from-amber-400/20 to-orange-300/10';
  if (icon === 'flower-2') return 'from-cyan-400/20 to-teal-300/10';
  if (icon === 'heart') return 'from-rose-400/20 to-pink-300/10';
  if (icon === 'target') return 'from-purple-400/20 to-fuchsia-300/10';
  if (icon === 'book-open' || icon === 'calendar') return 'from-indigo-400/20 to-violet-300/10';
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

function isWithinNowWindow(timeStr: string, nowMinutes: number | null): boolean {
  if (nowMinutes === null) return false;
  const scheduledMinutes = parseHHMMToMinutes(timeStr);
  const diff = nowMinutes - scheduledMinutes;
  return diff >= 0 && diff <= 30;
}

function arraysEqualByValue(a?: DayOfWeek[], b?: DayOfWeek[]): boolean {
  const left = a ? [...a].sort((x, y) => x - y) : [];
  const right = b ? [...b].sort((x, y) => x - y) : [];
  if (left.length !== right.length) return false;
  return left.every((value, idx) => value === right[idx]);
}

// River Flow color schemes for different icon types
function getRiverFlowGradient(icon: AnchorIcon): { from: string; to: string; glow: string } {
  const gradients: Record<string, { from: string; to: string; glow: string }> = {
    sunrise: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    coffee: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    dumbbell: { from: 'from-emerald-400/20', to: 'to-teal-300/10', glow: 'rgba(52, 211, 153, 0.3)' },
    'flower-2': { from: 'from-cyan-400/20', to: 'to-teal-300/10', glow: 'rgba(34, 211, 238, 0.3)' },
    briefcase: { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    code: { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    'book-open': { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
    calendar: { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
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
    status: 'waiting' | 'done' | 'missed' | 'skipped';
  };
  isActive: boolean;
  isLast: boolean;
  isFirst: boolean;
  isLoaded: boolean;
  onToggle: () => void;
  onToggleSkip: () => void;
  onTimeChange: (anchorId: AnchorId, newTime: string) => void;
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
  onToggle,
  onToggleSkip,
  onTimeChange,
  iconByName,
  index,
  nowMinutes,
  timeUntilLabel,
  nextEventLabel,
}: MobileAnchorItemProps) {
  const [isTimeScrubberOpen, setIsTimeScrubberOpen] = useState(false);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Icon = iconByName[anchor.icon] || Moon;
  const isDone = anchor.status === 'done';
  const isMissed = anchor.status === 'missed';
  const isSkipped = anchor.status === 'skipped';

  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  return (
    <div className="relative" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="relative">
        {/* Main Card - Horizontal layout with more breathing room */}
        <div
          role="button"
          tabIndex={isLoaded ? 0 : -1}
          aria-disabled={!isLoaded}
          onClick={() => {
            if (!isLoaded) return;
            onToggle();
          }}
          onKeyDown={(e) => {
            if (!isLoaded) return;
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
                  {!isSkipped && isWithinNowWindow(anchor.scheduledTime, nowMinutes) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] bg-primary/15 text-primary">
                      Now
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
                  {formatTimeLabel(anchor.scheduledTime)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isTimeScrubberOpen && (
          <div className="mt-2 rounded-2xl border border-border-subtle bg-bg-elevated/90 px-4 py-3 text-center shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">
              Anchor Time
            </p>
            <p className="mt-1 text-2xl font-semibold leading-tight text-text tabular-nums">
              {formatShortTime(anchor.scheduledTime)}
            </p>
            <div className="mt-2 flex flex-col items-center gap-1 text-sm">
              {isSkipped ? (
                <p className="text-text-muted">Skipped for today</p>
              ) : (
                <>
                  <p className="text-text-muted">In: <span className="font-medium text-text">{timeUntilLabel}</span></p>
                  {nextEventLabel && <p className="text-text-muted">Next event: <span className="font-medium text-text">{nextEventLabel}</span></p>}
                </>
              )}
              {nowMinutes === null && <p className="text-[11px] text-text-muted/70">Live time unavailable</p>}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSkip();
              }}
              className="mt-3 text-xs font-semibold tracking-[0.02em] text-text-secondary/80 underline underline-offset-2 hover:text-text transition-colors"
            >
              {isSkipped ? 'Undo skip' : 'Skip today'}
            </button>
          </div>
        )}

        <MobileTimeScrubber
          isOpen={isTimeScrubberOpen}
          currentTime={anchor.scheduledTime}
          onTimeChange={(newTime) => {
            onTimeChange(anchor.id, newTime);
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = setTimeout(() => {
              setIsTimeScrubberOpen(false);
            }, 1500);
          }}
          onClose={() => setIsTimeScrubberOpen(false)}
        />
      </div>
    </div>
  );
}

export function DailyAnchorsTimeline({ storageScope }: DailyAnchorsTimelineProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { anchors, activeAnchor, toggleAnchor, anchorTemplates, setTodayAnchors, setTodayAnchorStatus, setAnchorTemplates, isLoaded } =
    useDailyAnchorsForToday(storageScope);

  const [hoveredAnchor, setHoveredAnchor] = useState<AnchorId | null>(null);
  const [draggingAnchor, setDraggingAnchor] = useState<AnchorId | null>(null);
  const [dragPreviewTime, setDragPreviewTime] = useState<string | null>(null);
  const [isEditingAnchors, setIsEditingAnchors] = useState(false);
  const [isPortalReady, setIsPortalReady] = useState(false);
  const [draftTemplates, setDraftTemplates] = useState<DailyAnchorTemplate[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const todaysAnchors = useMemo(() => {
    const today = new Date();
    return anchors.filter((anchor) => isAnchorScheduledForDate(anchor, today));
  }, [anchors]);

  const completedCount = todaysAnchors.filter((anchor) => anchor.status === 'done').length;
  const totalCount = todaysAnchors.length;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;
  const wakeTemplate = useMemo(
    () => anchorTemplates.find((template) => template.id === 'wake') || anchorTemplates.find((template) => template.icon === 'sunrise'),
    [anchorTemplates],
  );

  const sortedAnchors = useMemo(() => {
    return [...todaysAnchors].sort((a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime));
  }, [todaysAnchors]);

  const progressPercent = useMemo(() => {
    if (completedCount === 0) return 0;
    const completedAnchors = sortedAnchors.filter((anchor) => anchor.status === 'done');
    if (completedAnchors.length === 0) return 0;
    return Math.max(...completedAnchors.map((anchor) => getTimePosition(anchor.scheduledTime)));
  }, [sortedAnchors, completedCount]);

  const [currentTimePosition, setCurrentTimePosition] = useState<number | null>(null);
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  useEffect(() => {
    setIsPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isPortalReady) return;
    const originalOverflow = document.body.style.overflow;
    if (isEditingAnchors) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isEditingAnchors, isPortalReady]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const nowStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      setNowMinutes(hours * 60 + minutes);
      setCurrentTimePosition(getTimePosition(nowStr));
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
      anchor.id === draggingAnchor ? { ...anchor, scheduledTime: dragPreviewTime } : anchor,
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
    setDraftTemplates(anchorTemplates.map((template) => ({ ...template })));
    setIsEditingAnchors(true);
  }, [anchorTemplates]);

  const closeAnchorEditor = useCallback(() => {
    setIsEditingAnchors(false);
  }, []);

  const handleMobileTimeChange = useCallback((anchorId: AnchorId, newTime: string) => {
    const updatedAnchors = anchors.map((anchor) =>
      anchor.id === anchorId ? { ...anchor, scheduledTime: newTime } : anchor
    );
    setTodayAnchors(updatedAnchors);
  }, [anchors, setTodayAnchors]);

  const handleToggleSkipToday = useCallback((anchorId: AnchorId, isSkipped: boolean) => {
    setTodayAnchorStatus(anchorId, isSkipped ? 'waiting' : 'skipped');
  }, [setTodayAnchorStatus]);

  useEffect(() => {
    if (searchParams.get('anchors') !== 'edit' || isEditingAnchors) return;
    openAnchorEditor();

    const next = new URLSearchParams(searchParams.toString());
    next.delete('anchors');
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, isEditingAnchors, openAnchorEditor, router, pathname]);

  const updateDraftTemplate = useCallback(
    (anchorId: AnchorId, patch: Partial<Pick<DailyAnchorTemplate, 'label' | 'scheduledTime' | 'icon' | 'daysOfWeek'>>) => {
      setDraftTemplates((current) =>
        current.map((template) => (template.id === anchorId ? { ...template, ...patch } : template)),
      );
    },
    [],
  );

  const toggleTemplateDay = useCallback((anchorId: AnchorId, day: DayOfWeek) => {
    setDraftTemplates((current) =>
      current.map((template) => {
        if (template.id !== anchorId) return template;

        const currentDays = template.daysOfWeek ? [...template.daysOfWeek] : [];
        const hasDay = currentDays.includes(day);
        const nextDays = hasDay ? currentDays.filter((entry) => entry !== day) : [...currentDays, day].sort((a, b) => a - b);

        return {
          ...template,
          ...(nextDays.length > 0 ? { daysOfWeek: nextDays } : {}),
          ...(nextDays.length === 0 ? { daysOfWeek: undefined } : {}),
        };
      }),
    );
  }, []);

  const addAnchor = useCallback(() => {
    setDraftTemplates((current) => {
      const base = sanitizeAnchorId(`anchor-${current.length + 1}`);
      let unique = base;
      let suffix = 2;
      while (current.some((template) => template.id === unique)) {
        unique = `${base}-${suffix}`;
        suffix += 1;
      }

      return [
        ...current,
        {
          id: unique,
          label: 'New Anchor',
          icon: 'calendar',
          scheduledTime: '12:00',
        },
      ];
    });
  }, []);

  const removeAnchor = useCallback((anchorId: AnchorId) => {
    setDraftTemplates((current) => current.filter((template) => template.id !== anchorId));
  }, []);

  const saveAnchorEdits = useCallback(() => {
    const normalized = draftTemplates
      .map((template, idx) => {
        const normalizedId = sanitizeAnchorId(template.id || `anchor-${idx + 1}`);
        const normalizedTime = /^\d{2}:\d{2}$/.test(template.scheduledTime) ? template.scheduledTime : '08:00';
        const normalizedLabel = template.label.trim() || 'Anchor';
        const normalizedDays = template.daysOfWeek?.length ? Array.from(new Set(template.daysOfWeek)).sort((a, b) => a - b) : undefined;

        return {
          id: normalizedId,
          label: normalizedLabel,
          icon: template.icon,
          scheduledTime: normalizedTime,
          ...(normalizedDays ? { daysOfWeek: normalizedDays } : {}),
        } satisfies DailyAnchorTemplate;
      })
      .filter((template, idx, arr) => arr.findIndex((entry) => entry.id === template.id) === idx);

    const changed =
      normalized.length !== anchorTemplates.length ||
      normalized.some((nextTemplate, idx) => {
        const current = anchorTemplates[idx];
        if (!current) return true;
        return (
          nextTemplate.id !== current.id ||
          nextTemplate.label !== current.label ||
          nextTemplate.icon !== current.icon ||
          nextTemplate.scheduledTime !== current.scheduledTime ||
          !arraysEqualByValue(nextTemplate.daysOfWeek, current.daysOfWeek)
        );
      });

    if (changed) {
      setAnchorTemplates(normalized);
    }

    closeAnchorEditor();
  }, [draftTemplates, anchorTemplates, setAnchorTemplates, closeAnchorEditor]);

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
      <div className={`daily-anchors-card mobile-anchors-plain relative rounded-none sm:rounded-2xl ${isEditingAnchors ? 'overflow-visible z-40' : 'overflow-hidden'}`}>
        <div aria-hidden className="absolute inset-0 daily-anchors-nebula pointer-events-none" />

        <div className="relative p-0 sm:p-5 z-10">
          {/* Desktop header - side by side */}
          <div className="hidden sm:flex items-center justify-between gap-3 mb-6">
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

          <div className="hidden sm:block">
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

                const displayTime = isDragging && dragPreviewTime ? dragPreviewTime : anchor.scheduledTime;
                const position = getTimePosition(displayTime);
                const timeUntil = getTimeUntil(anchor.scheduledTime, nowMinutes);
                const inLabel = timeUntil.startsWith('in ') ? timeUntil.slice(3) : timeUntil;
                const isLightsOutAnchor = anchor.id === 'lightsOut' || anchor.icon === 'moon';
                const nextScheduledAnchor = sortedAnchors[index + 1];
                const timeToNextEventLabel = nextScheduledAnchor
                  ? formatDuration(getMinutesBetweenEvents(anchor.scheduledTime, nextScheduledAnchor.scheduledTime))
                  : wakeTemplate
                    ? formatDuration(getOvernightMinutesUntil(anchor.scheduledTime, wakeTemplate.scheduledTime))
                    : null;
                const sleepWindowLabel =
                  isLightsOutAnchor && wakeTemplate
                    ? formatDuration(getOvernightMinutesUntil(displayTime, wakeTemplate.scheduledTime))
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
                        transition-all duration-200 whitespace-nowrap
                        ${isHovered || isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
                      `}
                    >
                      <div className="text-xs font-bold text-text">{formatShortTime(displayTime)}</div>
                      {!isDragging && (
                        <div className={`text-[10px] ${isDone ? 'text-secondary' : isMissed ? 'text-error/70' : isSkipped ? 'text-text-muted/70' : 'text-text-muted'}`}>
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
                        <div className="text-[10px] text-text-muted">
                          Next Event: {timeToNextEventLabel}
                        </div>
                      )}
                      {!isDragging && !isSkipped && sleepWindowLabel && (
                        <div className="text-[10px] text-text-muted">
                          Sleep window: {sleepWindowLabel}
                        </div>
                      )}
                      {isDragging && <div className="text-[10px] text-primary">Release to set</div>}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-elevated border-r border-b border-border-subtle rotate-45" />
                    </div>

                    <div className="relative flex flex-col items-center">
                      <div
                        className={`
                          absolute -top-6 p-1 rounded cursor-grab active:cursor-grabbing
                          text-text-muted/30 hover:text-text-muted/60 transition-all
                          ${isHovered ? 'opacity-100' : 'opacity-0'}
                        `}
                        onMouseDown={(e) => handleDragStart(anchor.id, e)}
                        onTouchStart={(e) => handleDragStart(anchor.id, e)}
                      >
                        <GripVertical size={12} />
                      </div>

                      <button
                        type="button"
                        onClick={() => !isDragging && toggleAnchor(anchor.id)}
                        disabled={!isLoaded || isDragging}
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

          {/* Mobile Layout - Clean card list */}
          <div className="sm:hidden mt-0">
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
                      onToggle={() => toggleAnchor(anchor.id)}
                      onToggleSkip={() => handleToggleSkipToday(anchor.id, anchor.status === 'skipped')}
                      onTimeChange={handleMobileTimeChange}
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
                        if (wakeTemplate) {
                          return formatDuration(getOvernightMinutesUntil(anchor.scheduledTime, wakeTemplate.scheduledTime));
                        }
                        return null;
                      })()}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => (isEditingAnchors ? closeAnchorEditor() : openAnchorEditor())}
            className="hidden sm:inline-flex absolute right-4 bottom-4 z-50 items-center justify-center w-8 h-8 rounded-full border border-border-subtle bg-bg-surface/95 text-text-muted hover:text-text hover:border-accent-teal/50 transition-colors shadow-sm"
            aria-label={isEditingAnchors ? 'Close anchor editor' : 'Edit anchors'}
            title={isEditingAnchors ? 'Close anchor editor' : 'Edit anchors'}
          >
            {isEditingAnchors ? <X size={16} className="sm:w-[14px] sm:h-[14px]" /> : <Pencil size={16} className="sm:w-[14px] sm:h-[14px]" />}
          </button>
        </div>
      </div>

      {isPortalReady &&
        isEditingAnchors &&
        createPortal(
          <div className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 bg-bg-base/78 backdrop-blur-md" onClick={closeAnchorEditor} aria-hidden />
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain">
              <div
                className="mx-auto h-full w-full max-w-6xl"
                style={{
                  paddingTop: 'max(0rem, env(safe-area-inset-top))',
                  paddingBottom: 'max(0rem, env(safe-area-inset-bottom))',
                }}
              >
                <div className="min-h-full bg-bg-base/98 sm:my-4 sm:rounded-3xl sm:border sm:border-border-subtle sm:bg-bg-base/95 sm:backdrop-blur-sm sm:shadow-xl">
                  <div
                    className="sticky top-0 z-20 px-4 sm:px-6 py-3 bg-bg-base/92 backdrop-blur-md border-b border-border-subtle/70"
                    style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm sm:text-xs font-semibold uppercase tracking-[0.14em] text-text-muted/85">Edit Anchors</p>
                      <div className="hidden sm:flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={closeAnchorEditor}
                          className="inline-flex items-center justify-center h-10 px-3.5 rounded-xl border border-border-subtle/80 text-sm font-semibold text-text-muted hover:text-text hover:border-accent-teal/45 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveAnchorEdits}
                          className="inline-flex items-center gap-1.5 h-10 px-4.5 rounded-xl text-sm font-semibold sakura-action"
                        >
                          <Save size={14} />
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={addAnchor}
                        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold border border-border-subtle/80 bg-bg-surface/35 text-text-muted hover:text-text hover:border-accent-teal/45 transition-colors"
                      >
                        <Plus size={14} />
                        Add Anchor
                      </button>
                    </div>
                  </div>

                  <div
                    className="space-y-4 px-4 sm:px-6 py-4 sm:py-5"
                    style={{ paddingBottom: 'max(7rem, env(safe-area-inset-bottom))' }}
                  >
                    {draftTemplates.map((anchor) => (
                      <div key={`edit-${anchor.id}`} className="rounded-3xl border border-border-subtle/75 bg-bg-surface/55 p-4.5 sm:p-5 space-y-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
                        <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-2.5">
                          <input
                            type="text"
                            value={anchor.label}
                            onChange={(e) => updateDraftTemplate(anchor.id, { label: e.target.value })}
                            className="h-11 min-w-0 rounded-2xl border border-border-subtle/80 bg-bg-surface/50 px-3.5 text-base text-text placeholder:text-text-muted/55"
                            aria-label={`Edit ${anchor.id} label`}
                            name={`anchor-label-${anchor.id}`}
                            autoComplete="off"
                          />
                          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2.5 sm:contents">
                            <input
                              type="time"
                              value={anchor.scheduledTime}
                              onChange={(e) => updateDraftTemplate(anchor.id, { scheduledTime: e.target.value })}
                              className="h-11 w-full sm:w-auto rounded-2xl border border-border-subtle/80 bg-bg-surface/50 px-3.5 text-base text-text"
                              aria-label={`Edit ${anchor.id} time`}
                              name={`anchor-time-${anchor.id}`}
                            />
                            <select
                              value={anchor.icon}
                              onChange={(e) => updateDraftTemplate(anchor.id, { icon: e.target.value as AnchorIcon })}
                              className="h-11 w-full sm:w-auto rounded-2xl border border-border-subtle/80 bg-bg-surface/50 px-3.5 text-base text-text min-w-0"
                              aria-label={`Edit ${anchor.id} icon`}
                              name={`anchor-icon-${anchor.id}`}
                            >
                              {ICON_OPTIONS.map((option) => (
                                <option key={`${anchor.id}-${option.value}`} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeAnchor(anchor.id)}
                              className="h-11 w-11 inline-flex items-center justify-center rounded-2xl border border-border-subtle/80 text-text-muted hover:text-error hover:border-error/45 hover:bg-error/5 transition-colors shrink-0"
                              aria-label={`Remove ${anchor.label || 'anchor'}`}
                              title="Remove anchor"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-7 gap-2">
                          {WEEKDAY_OPTIONS.map((day) => {
                            const enabled = anchor.daysOfWeek?.includes(day.value) ?? false;
                            return (
                              <button
                                key={`${anchor.id}-${day.value}`}
                                type="button"
                                onClick={() => toggleTemplateDay(anchor.id, day.value)}
                                aria-pressed={enabled}
                                className={`
                                  h-9 min-w-0 px-0 rounded-xl text-sm font-semibold border transition-colors
                                  ${
                                    enabled
                                      ? 'bg-accent-teal/18 text-accent-teal border-accent-teal/70 ring-1 ring-accent-teal/55'
                                      : 'bg-bg-elevated/65 text-text-muted border-border-subtle/80 hover:text-text'
                                  }
                                `}
                                title={day.label}
                              >
                                {day.short}
                              </button>
                            );
                          })}
                          </div>
                          <span className="block text-xs text-text-muted/85">
                            {anchor.daysOfWeek && anchor.daysOfWeek.length > 0 ? 'Runs on selected days' : 'Runs every day'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle/75 bg-bg-base/93 backdrop-blur-md px-4 py-3 sm:hidden"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={closeAnchorEditor}
                        className="inline-flex items-center justify-center h-11 flex-1 rounded-xl border border-border-subtle/80 text-sm font-semibold text-text-muted hover:text-text hover:border-accent-teal/45 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveAnchorEdits}
                        className="inline-flex items-center justify-center gap-1.5 h-11 flex-1 rounded-xl text-sm font-semibold sakura-action"
                      >
                        <Save size={14} />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
