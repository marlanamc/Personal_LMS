'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { CleaningTaskCard } from './CleaningTaskCard';
import {
  getAvailableCleaningZones,
  getCleaningTaskStatus,
  getScheduledCleaningTaskDatesInRange,
  type CleaningPlannerStore,
  type CleaningTask,
} from '@/lib/cleaning-planner';

type CleaningWeekViewProps = {
  store: CleaningPlannerStore;
  tasks: CleaningTask[];
  viewDate: Date;
  now: Date;
  onViewDateChange: (date: Date) => void;
  onTaskComplete: (task: CleaningTask) => void;
  onTaskEdit: (taskId: string) => void;
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDayTasks(tasks: CleaningTask[], day: Date, now: Date): CleaningTask[] {
  return tasks.filter((task) => getScheduledCleaningTaskDatesInRange(task, day, day, now).length > 0);
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDayNumber(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CleaningWeekView({
  store,
  tasks,
  viewDate,
  now,
  onViewDateChange,
  onTaskComplete,
  onTaskEdit,
}: CleaningWeekViewProps) {
  const zones = useMemo(() => getAvailableCleaningZones(store), [store]);
  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(() => {
    // Auto-expand today
    return new Set([toDateKey(now)]);
  });

  const weekDays = useMemo(() => {
    const start = startOfWeek(viewDate);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [viewDate]);

  const moveWeek = (direction: -1 | 1) => {
    onViewDateChange(addDays(viewDate, direction * 7));
  };

  const goToToday = () => {
    onViewDateChange(startOfDay(new Date()));
    setExpandedDays(new Set([toDateKey(new Date())]));
  };

  const toggleDay = (dateKey: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
      } else {
        next.add(dateKey);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Compact week navigation */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle/50 bg-bg-surface/70 px-3 py-2">
        <button
          type="button"
          onClick={() => moveWeek(-1)}
          className="rounded-lg p-1.5 text-text-muted transition hover:bg-bg-elevated hover:text-text-primary active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">
            {formatDayNumber(weekDays[0])} – {formatDayNumber(weekDays[6])}
          </span>
          <button
            type="button"
            onClick={goToToday}
            className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition hover:bg-primary/20"
          >
            Today
          </button>
        </div>
        <button
          type="button"
          onClick={() => moveWeek(1)}
          className="rounded-lg p-1.5 text-text-muted transition hover:bg-bg-elevated hover:text-text-primary active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop: 7-column grid */}
      <div className="hidden md:grid md:grid-cols-7 gap-1.5">
        {weekDays.map((day) => {
          const dayTasks = getDayTasks(tasks, day, now);
          const isToday = isSameDay(day, now);
          const hasOverdue = dayTasks.some((t) => getCleaningTaskStatus(t, now) === 'overdue');

          return (
            <div
              key={toDateKey(day)}
              className={`rounded-xl border p-1.5 min-h-[140px] transition ${
                isToday
                  ? 'border-primary/40 bg-primary/5 shadow-sm'
                  : hasOverdue
                    ? 'border-rose-300/40 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-border-subtle/50 bg-bg-surface/60 hover:border-primary/20'
              }`}
            >
              {/* Compact day header */}
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <div className="flex items-baseline gap-1">
                  <span className={`text-[10px] font-medium uppercase tracking-wide ${isToday ? 'text-primary' : 'text-text-muted'}`}>
                    {formatDayLabel(day)}
                  </span>
                  <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-text-primary'}`}>
                    {day.getDate()}
                  </span>
                </div>
                {dayTasks.length > 0 && (
                  <span className={`text-[9px] font-semibold w-4 h-4 flex items-center justify-center rounded-full ${
                    hasOverdue
                      ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300'
                      : 'bg-bg-elevated text-text-muted'
                  }`}>
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Task list */}
              <div className="space-y-1">
                {dayTasks.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border-subtle/40 bg-bg-elevated/10 py-2 text-center">
                    <span className="text-[10px] text-text-muted/50">—</span>
                  </div>
                ) : (
                  dayTasks.map((task) => (
                    <CleaningTaskCard
                      key={task.id}
                      task={task}
                      zone={zoneMap.get(task.zoneId)}
                      now={now}
                      compact
                      onComplete={onTaskComplete}
                      onEdit={onTaskEdit}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Collapsible day accordion - much more compact */}
      <div className="block md:hidden space-y-1.5">
        {weekDays.map((day) => {
          const dayTasks = getDayTasks(tasks, day, now);
          const isToday = isSameDay(day, now);
          const dateKey = toDateKey(day);
          const isExpanded = expandedDays.has(dateKey);
          const hasOverdue = dayTasks.some((t) => getCleaningTaskStatus(t, now) === 'overdue');
          const isPast = day < now && !isToday;

          // Skip past days with no tasks to save space
          if (isPast && dayTasks.length === 0) {
            return null;
          }

          return (
            <div
              key={dateKey}
              className={`rounded-xl border overflow-hidden transition ${
                isToday
                  ? 'border-primary/40 bg-primary/5'
                  : hasOverdue
                    ? 'border-rose-300/40 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-border-subtle/40 bg-bg-surface/50'
              }`}
            >
              {/* Collapsible header */}
              <button
                type="button"
                onClick={() => toggleDay(dateKey)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                    isToday
                      ? 'bg-primary text-white'
                      : hasOverdue
                        ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300'
                        : 'bg-bg-elevated text-text-primary'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-text-primary'}`}>
                      {formatDayLabel(day)}
                      {isToday && <span className="ml-1.5 text-xs font-normal text-primary/80">Today</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {dayTasks.length > 0 ? (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      hasOverdue
                        ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  ) : (
                    <span className="text-xs text-text-muted/60">Clear</span>
                  )}
                  {dayTasks.length > 0 && (
                    isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    )
                  )}
                </div>
              </button>

              {/* Expandable task list */}
              {isExpanded && dayTasks.length > 0 && (
                <div className="px-3 pb-3 space-y-2">
                  {dayTasks.map((task) => (
                    <CleaningTaskCard
                      key={task.id}
                      task={task}
                      zone={zoneMap.get(task.zoneId)}
                      now={now}
                      compact
                      onComplete={onTaskComplete}
                      onEdit={onTaskEdit}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
