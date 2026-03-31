'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getTasksForCalendarDate,
  isDateKeyInRange,
  type DateKey,
  type Project,
} from '@/lib/project-planner';
import { dateKeyToDate, isToday, toDateKey } from '@/lib/unified-scheduler';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function monthStartFromDateKey(dk: DateKey): Date {
  const d = dateKeyToDate(dk);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function initialVisibleMonth(project: Project): Date {
  const todayKey = toDateKey(new Date());
  if (todayKey < project.startDate) return monthStartFromDateKey(project.startDate);
  if (todayKey > project.endDate) return monthStartFromDateKey(project.endDate);
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export interface ProjectMonthCalendarProps {
  project: Project;
  onSelectDate?: (date: DateKey) => void;
  selectedDate?: DateKey;
}

export function ProjectMonthCalendar({
  project,
  onSelectDate,
  selectedDate,
}: ProjectMonthCalendarProps) {
  const [viewDate, setViewDate] = useState(() => initialVisibleMonth(project));

  // Only reset visible month when switching projects or editing the date range — not on every task edit.
  useEffect(
    () => {
      setViewDate(initialVisibleMonth(project));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- project.id + range are sufficient; full `project` would reset on every task edit
    [project.id, project.startDate, project.endDate],
  );

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const { minMonthMs, maxMonthMs, cells } = useMemo(() => {
    const start = dateKeyToDate(project.startDate);
    const end = dateKeyToDate(project.endDate);
    const minMonthMs = new Date(start.getFullYear(), start.getMonth(), 1).getTime();
    const maxMonthMs = new Date(end.getFullYear(), end.getMonth(), 1).getTime();

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const leadingEmpty = new Date(viewYear, viewMonth, 1).getDay();

    const list: ({ type: 'pad' } | { type: 'day'; dateKey: DateKey })[] = [];
    for (let i = 0; i < leadingEmpty; i++) list.push({ type: 'pad' });
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      list.push({ type: 'day', dateKey: toDateKey(d) });
    }
    return { minMonthMs, maxMonthMs, cells: list };
  }, [project.startDate, project.endDate, viewYear, viewMonth]);

  const thisMonthMs = new Date(viewYear, viewMonth, 1).getTime();
  const canGoPrev = thisMonthMs > minMonthMs;
  const canGoNext = thisMonthMs < maxMonthMs;

  const todayKey = toDateKey(new Date());

  const navBtn =
    'flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--text-muted)] transition-colors hover:bg-[var(--color-bg-surface)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-35';

  return (
    <div className="px-2 pb-3 pt-2">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {MONTH_NAMES[viewMonth]}{' '}
          <span className="font-medium text-[var(--text-muted)]">{viewYear}</span>
        </p>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Previous month"
            disabled={!canGoPrev}
            className={navBtn}
            onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            disabled={!canGoNext}
            className={navBtn}
            onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="py-1 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (cell.type === 'pad') {
            return <div key={`pad-${idx}`} className="min-h-[52px]" aria-hidden />;
          }
          return (
            <CalendarDayCell
              key={cell.dateKey}
              dateKey={cell.dateKey}
              project={project}
              todayKey={todayKey}
              isSelected={selectedDate === cell.dateKey}
              onClick={() => onSelectDate?.(cell.dateKey)}
            />
          );
        })}
      </div>

      <p className="mt-2 px-1 text-center text-[10px] text-[var(--text-muted)] leading-snug">
        Dots show tasks for that day. If nothing is dated yet, tasks are spread across the project as a
        preview. Green when every task that day is done.
      </p>
    </div>
  );
}

function CalendarDayCell({
  dateKey,
  project,
  todayKey,
  isSelected,
  onClick,
}: {
  dateKey: DateKey;
  project: Project;
  todayKey: DateKey;
  isSelected: boolean;
  onClick: () => void;
}) {
  const inProject = isDateKeyInRange(dateKey, project.startDate, project.endDate);
  const tasks = getTasksForCalendarDate(project, dateKey);
  const completedCount = tasks.filter(
    (t) => t.status === 'completed' || t.status === 'skipped',
  ).length;
  const totalCount = tasks.length;
  const isComplete = totalCount > 0 && completedCount === totalCount;
  const isPast = dateKey < todayKey;
  const dayIsToday = isToday(dateKey);

  const dayNum = dateKeyToDate(dateKey).getDate();

  const getDotColor = () => {
    if (isComplete) return 'var(--color-secondary)';
    if (isPast && totalCount > 0) return 'var(--color-primary)';
    if (dayIsToday) return 'var(--color-accent)';
    if (totalCount > 0) return 'var(--color-text-muted)';
    return 'color-mix(in srgb, var(--color-text-muted) 45%, transparent)';
  };

  const showDots = inProject && totalCount > 0;

  const inner = (
    <>
      <span
        className={`
          text-xs font-semibold tabular-nums
          ${dayIsToday && inProject ? 'text-[var(--primary)]' : ''}
          ${inProject && isPast && !isComplete && totalCount > 0 ? 'text-[var(--text-muted)]' : ''}
          ${inProject && isComplete ? 'text-[var(--secondary)]' : ''}
          ${inProject && !dayIsToday && !isComplete && !isPast ? 'text-[var(--text-primary)]' : ''}
          ${inProject && totalCount === 0 && !dayIsToday ? 'text-[var(--text-secondary)]' : ''}
          ${!inProject ? 'text-[var(--text-muted)]' : ''}
        `}
      >
        {dayNum}
      </span>
      <div className="mt-auto flex min-h-[14px] items-center justify-center gap-0.5">
        {showDots ? (
          <>
            {Array.from({ length: Math.min(totalCount, 4) }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 shrink-0 rounded-full border border-[color-mix(in_srgb,var(--color-text-primary)_12%,transparent)]"
                style={{
                  backgroundColor: i < completedCount ? 'var(--color-secondary)' : getDotColor(),
                  opacity: i < completedCount ? 1 : 0.7,
                  boxShadow: '0 1px 2px color-mix(in srgb, var(--color-text-primary) 12%, transparent)',
                }}
              />
            ))}
            {totalCount > 4 && (
              <span className="ml-0.5 text-[8px] text-[var(--text-muted)]">+{totalCount - 4}</span>
            )}
          </>
        ) : inProject ? (
          <span className="block h-1.5 w-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-text-muted)_40%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--color-text-primary)_10%,transparent)]" />
        ) : null}
      </div>
    </>
  );

  const cellClass = `
    flex min-h-[52px] flex-col items-center justify-start rounded-xl px-0.5 pb-1 pt-1
    transition-colors
    ${isSelected && inProject ? 'bg-[var(--primary)]/15' : ''}
    ${dayIsToday && inProject ? 'ring-2 ring-[var(--primary)]/40' : ''}
  `;

  if (!inProject) {
    return (
      <div className={`${cellClass} opacity-45`} aria-label={`${dateKey}, outside project dates`}>
        {inner}
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      aria-label={dateKey}
      className={`${cellClass} hover:bg-[var(--color-bg-surface)]`}
    >
      {inner}
    </motion.button>
  );
}
