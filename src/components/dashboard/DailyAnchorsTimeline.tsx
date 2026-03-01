'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

function getTimeUntil(timeStr: string): string {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
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

function arraysEqualByValue(a?: DayOfWeek[], b?: DayOfWeek[]): boolean {
  const left = a ? [...a].sort((x, y) => x - y) : [];
  const right = b ? [...b].sort((x, y) => x - y) : [];
  if (left.length !== right.length) return false;
  return left.every((value, idx) => value === right[idx]);
}

export function DailyAnchorsTimeline({ storageScope }: DailyAnchorsTimelineProps) {
  const { anchors, activeAnchor, toggleAnchor, anchorTemplates, setTodayAnchors, setAnchorTemplates, isLoaded } =
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
      const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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
      <div className={`daily-anchors-card relative rounded-2xl ${isEditingAnchors ? 'overflow-visible z-40' : 'overflow-hidden'}`}>
        <div aria-hidden className="absolute inset-0 daily-anchors-nebula pointer-events-none" />

        <div className="relative p-4 sm:p-5 z-10">
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
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

            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
              <svg className="w-8 h-8 sm:w-9 sm:h-9 -rotate-90" viewBox="0 0 36 36">
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
                  <Check size={11} className="text-secondary sm:w-3 sm:h-3" strokeWidth={3} />
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
              <div className="daily-anchors-track-base absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-bg-surface/40 via-bg-surface/60 to-bg-surface/40" />

              <div
                className="daily-anchors-track-progress absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full transition-[width] duration-500"
                style={{
                  width: `${progressPercent}%`,
                }}
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

              {sortedAnchors.map((anchor) => {
                const Icon = iconByName[anchor.icon] || Moon;
                const isActive = anchor.id === activeAnchor.id;
                const isDragging = anchor.id === draggingAnchor;
                const isHovered = anchor.id === hoveredAnchor;
                const isDone = anchor.status === 'done';
                const isMissed = anchor.status === 'missed';

                const displayTime = isDragging && dragPreviewTime ? dragPreviewTime : anchor.scheduledTime;
                const position = getTimePosition(displayTime);
                const timeUntil = getTimeUntil(anchor.scheduledTime);
                const isLightsOutAnchor = anchor.id === 'lightsOut' || anchor.icon === 'moon';
                const sleepWindowLabel =
                  isLightsOutAnchor && wakeTemplate
                    ? formatDuration(getOvernightMinutesUntil(displayTime, wakeTemplate.scheduledTime))
                    : null;
                const stateClass = isDone
                  ? 'is-done'
                  : isMissed
                    ? 'is-missed'
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
                        <div className={`text-[10px] ${isDone ? 'text-secondary' : isMissed ? 'text-error/70' : 'text-text-muted'}`}>
                          {isDone ? 'Completed' : isMissed ? 'Missed' : timeUntil}
                        </div>
                      )}
                      {!isDragging && sleepWindowLabel && (
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
                          daily-anchors-dot relative w-12 h-12 rounded-2xl flex items-center justify-center
                          transition-all duration-200 shadow-md
                          ${
                            isDone
                              ? 'bg-gradient-to-br from-secondary to-secondary/80 text-white border-2 border-secondary/50'
                              : isMissed
                                ? 'bg-bg-surface/50 text-text-muted/40 border-2 border-border-subtle/50'
                                : isActive
                                  ? `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-2 border-primary/30 text-text`
                                  : 'bg-bg-surface/80 border-2 border-border-subtle text-text-muted'
                          }
                          ${stateClass}
                          ${isActive && !isDone && !isMissed ? 'ring-2 ring-accent-teal/25 animate-pulse-subtle' : ''}
                          hover:scale-105 active:scale-95
                          ${!isLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${isDragging ? 'is-dragging scale-110 shadow-xl ring-2 ring-accent-teal/35' : ''}
                        `}
                      >
                        {isDone ? <Check size={20} strokeWidth={2.5} /> : <Icon size={20} strokeWidth={1.7} className={isActive ? 'text-text' : ''} />}
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

          <div className="sm:hidden mt-1.5">
            {sortedAnchors.length === 0 ? (
              <div className="rounded-xl border border-border-subtle bg-bg-elevated px-3 py-3">
                <span className="text-xs text-text-muted">No anchors scheduled for today</span>
              </div>
            ) : (
              <div className="relative">
                <div className="daily-anchors-mobile-track-line absolute left-[16px] top-3 bottom-3 w-[2px] rounded-full" />
                {sortedAnchors.map((anchor, idx) => {
                  const Icon = iconByName[anchor.icon] || Moon;
                  const isActive = anchor.id === activeAnchor.id;
                  const isDone = anchor.status === 'done';
                  const isMissed = anchor.status === 'missed';
                  const timeUntil = getTimeUntil(anchor.scheduledTime);
                  const isLast = idx === sortedAnchors.length - 1;
                  const stateClass = isDone
                    ? 'is-done'
                    : isMissed
                      ? 'is-missed'
                      : isActive
                        ? 'is-active'
                        : 'is-future';
                  const statusLabel = isDone ? 'Done' : isMissed ? 'Missed' : timeUntil;

                  return (
                    <div key={`mobile-timeline-${anchor.id}`} className={`${isLast ? '' : 'mb-2.5'} relative flex items-center gap-2`}>
                      <button
                        type="button"
                        onClick={() => toggleAnchor(anchor.id)}
                        disabled={!isLoaded}
                        className={`
                          flex-1 min-w-0 min-h-[52px] flex items-start gap-3 rounded-2xl px-2 py-2.5 text-left
                          transition-colors duration-200
                          ${
                            isActive
                              ? 'bg-primary/8'
                              : isDone
                                ? 'bg-secondary/6'
                                : 'bg-transparent'
                          }
                          ${!isLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <span className="relative mt-0.5 w-8 h-8 shrink-0 flex items-center justify-center">
                          <span
                            className={`
                              daily-anchors-mobile-orb relative w-8 h-8 rounded-full flex items-center justify-center
                              transition-all duration-200 ${stateClass}
                              ${!isDone && !isMissed && !isActive ? 'scale-[0.92] opacity-80' : ''}
                            `}
                          >
                            {isDone ? (
                              <Check size={15} strokeWidth={3} />
                            ) : (
                              <Icon
                                size={15}
                                strokeWidth={1.8}
                                className={isMissed ? 'opacity-55' : !isActive ? 'opacity-70' : 'opacity-90'}
                              />
                            )}
                          </span>
                        </span>

                        <span className="min-w-0 pt-0.5">
                          <span
                            className={`
                              block text-[0.95rem] max-[390px]:text-[0.9rem] font-semibold leading-tight truncate
                              ${isActive ? 'text-text' : 'text-text-muted/95'}
                            `}
                          >
                            {anchor.label}
                          </span>
                          {isActive && !isDone && !isMissed && (
                            <span className="daily-anchors-now-label block text-meta leading-tight uppercase tracking-[0.14em] text-primary/90 mt-0.5">
                              NOW
                            </span>
                          )}
                          <span
                            className={`
                              block text-[11px] max-[390px]:text-[10px] leading-snug mt-0.5
                              ${isDone ? 'text-secondary' : isMissed ? 'text-error/70' : 'text-text-muted'}
                            `}
                          >
                            {formatTimeLabel(anchor.scheduledTime)} · {statusLabel}
                          </span>
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => (isEditingAnchors ? closeAnchorEditor() : openAnchorEditor())}
            className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 z-50 inline-flex items-center justify-center w-8 h-8 rounded-full border border-border-subtle bg-bg-surface/90 text-text-muted hover:text-text hover:border-accent-teal/50 transition-colors"
            aria-label={isEditingAnchors ? 'Close anchor editor' : 'Edit anchors'}
            title={isEditingAnchors ? 'Close anchor editor' : 'Edit anchors'}
          >
            {isEditingAnchors ? <X size={14} /> : <Pencil size={14} />}
          </button>
        </div>
      </div>

      {isPortalReady &&
        isEditingAnchors &&
        createPortal(
          <div className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 bg-bg-base/70 backdrop-blur-sm" onClick={closeAnchorEditor} aria-hidden />
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain">
              <div
                className="max-w-6xl mx-auto px-3 sm:px-6 pb-4 sm:pb-6"
                style={{
                  paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
                  paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
                }}
              >
                <div className="sticky top-0 z-20 -mx-3 sm:-mx-6 px-3 sm:px-6 py-3 bg-bg-base/95 backdrop-blur-sm border-b border-border-subtle mb-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Edit Anchors</p>
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={addAnchor}
                        className="inline-flex items-center justify-center sm:justify-start gap-1.5 min-w-0 flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-border-subtle text-text-muted hover:text-text hover:border-accent-teal/50"
                      >
                        <Plus size={12} />
                        <span className="truncate">Add Anchor</span>
                      </button>
                      <button
                        type="button"
                        onClick={closeAnchorEditor}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border-subtle text-text-muted hover:text-text hover:border-accent-teal/50 transition-colors"
                        aria-label="Close anchor editor"
                      >
                        <X size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={saveAnchorEdits}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold sakura-action"
                      >
                        <Save size={12} />
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pb-8">
                  {draftTemplates.map((anchor) => (
                    <div key={`edit-${anchor.id}`} className="rounded-lg border border-border-subtle bg-bg-surface/60 p-2.5 space-y-2">
                      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-2">
                        <input
                          type="text"
                          value={anchor.label}
                          onChange={(e) => updateDraftTemplate(anchor.id, { label: e.target.value })}
                          className="h-9 min-w-0 rounded-lg border border-border-subtle bg-bg-surface px-2.5 text-sm text-text"
                          aria-label={`Edit ${anchor.id} label`}
                          name={`anchor-label-${anchor.id}`}
                          autoComplete="off"
                        />
                        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 sm:contents">
                          <input
                            type="time"
                            value={anchor.scheduledTime}
                            onChange={(e) => updateDraftTemplate(anchor.id, { scheduledTime: e.target.value })}
                            className="h-9 w-full sm:w-auto rounded-lg border border-border-subtle bg-bg-surface px-2 text-sm text-text"
                            aria-label={`Edit ${anchor.id} time`}
                            name={`anchor-time-${anchor.id}`}
                          />
                          <select
                            value={anchor.icon}
                            onChange={(e) => updateDraftTemplate(anchor.id, { icon: e.target.value as AnchorIcon })}
                            className="h-9 w-full sm:w-auto rounded-lg border border-border-subtle bg-bg-surface px-2 text-sm text-text min-w-0"
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
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:text-error hover:border-error/40 shrink-0"
                            aria-label={`Remove ${anchor.label || 'anchor'}`}
                            title="Remove anchor"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {WEEKDAY_OPTIONS.map((day) => {
                          const enabled = anchor.daysOfWeek?.includes(day.value) ?? false;
                          return (
                            <button
                              key={`${anchor.id}-${day.value}`}
                              type="button"
                              onClick={() => toggleTemplateDay(anchor.id, day.value)}
                              aria-pressed={enabled}
                              className={`
                                h-7 min-w-7 px-2 rounded-md text-[11px] font-semibold border transition-colors
                                ${
                                  enabled
                                    ? 'bg-accent-teal/15 text-accent-teal border-accent-teal/70 ring-1 ring-accent-teal/60'
                                    : 'bg-bg-elevated text-text-muted border-border-subtle hover:text-text'
                                }
                              `}
                              title={day.label}
                            >
                              {day.short}
                            </button>
                          );
                        })}
                        <span className="ml-1 text-[11px] text-text-muted">
                          {anchor.daysOfWeek && anchor.daysOfWeek.length > 0 ? 'Runs on selected days' : 'Runs every day'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
