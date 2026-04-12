'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CleaningTaskCard } from './CleaningTaskCard';
import {
  getAvailableCleaningZones,
  getCleaningTaskStatus,
  getScheduledCleaningTaskDate,
  getStatusColors,
  type CleaningPlannerStore,
  type CleaningTask,
} from '@/lib/cleaning-planner';

type CleaningMonthViewProps = {
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

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDayTasks(tasks: CleaningTask[], day: Date, now: Date): CleaningTask[] {
  return tasks.filter((task) => isSameDay(getScheduledCleaningTaskDate(task, now), day));
}

export function CleaningMonthView({
  store,
  tasks,
  viewDate,
  now,
  onViewDateChange,
  onTaskComplete,
  onTaskEdit,
}: CleaningMonthViewProps) {
  const [selectedDay, setSelectedDay] = useState<Date>(viewDate);
  const zones = useMemo(() => getAvailableCleaningZones(store), [store]);
  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const monthDays = useMemo(() => {
    const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const gridStart = startOfWeek(monthStart);
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [viewDate]);

  const selectedDayTasks = useMemo(() => getDayTasks(tasks, selectedDay, now), [tasks, selectedDay, now]);

  const moveMonth = (direction: -1 | 1) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1);
    onViewDateChange(newDate);
    setSelectedDay(newDate);
  };

  const goToToday = () => {
    const today = startOfDay(new Date());
    onViewDateChange(today);
    setSelectedDay(today);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between rounded-[1.75rem] border border-border-subtle/60 bg-bg-surface/85 px-4 py-4 shadow-sm">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Month view</div>
          <h2 className="text-lg font-semibold text-text-primary">
            {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="rounded-full border border-border-subtle bg-bg-surface p-2 text-text-primary transition hover:border-primary/30 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="rounded-full border border-border-subtle bg-bg-surface px-3 py-2 text-sm font-medium text-text-primary transition hover:border-primary/30"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="rounded-full border border-border-subtle bg-bg-surface p-2 text-text-primary transition hover:border-primary/30 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-[1.75rem] border border-border-subtle/60 bg-bg-surface/85 p-4 shadow-sm">
        {/* Day of week headers */}
        <div className="mb-2 grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
            <div key={label} className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted py-2">
              {label}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day) => {
            const dayTasks = getDayTasks(tasks, day, now);
            const isCurrentMonth = day.getMonth() === viewDate.getMonth();
            const isSelected = isSameDay(day, selectedDay);
            const isToday = isSameDay(day, now);

            return (
              <button
                key={toDateKey(day)}
                type="button"
                onClick={() => handleDayClick(day)}
                className={`min-h-[100px] rounded-[1.25rem] border p-2 text-left transition ${
                  isSelected
                    ? 'border-primary/50 bg-primary/10 shadow-md ring-1 ring-primary/30'
                    : isToday
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border-subtle/60 bg-bg-elevated/35 hover:border-primary/25 hover:bg-bg-elevated/60'
                } ${!isCurrentMonth ? 'opacity-40' : ''}`}
              >
                {/* Day number and task count */}
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isToday || isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {day.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task preview */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task) => {
                    const status = getCleaningTaskStatus(task, now);
                    const statusColors = getStatusColors(status);
                    return (
                      <div
                        key={task.id}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-medium truncate ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 2 && (
                    <div className="text-[11px] font-medium text-text-muted">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      <section className="space-y-3 rounded-[1.75rem] border border-border-subtle/60 bg-bg-surface/85 px-4 py-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <p className="text-sm text-text-muted">
            {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'task' : 'tasks'} due
          </p>
        </div>

        <div className="space-y-3">
          {selectedDayTasks.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-border-subtle/60 bg-bg-elevated/30 px-4 py-6 text-center">
              <span className="text-2xl opacity-50">✨</span>
              <p className="text-sm text-text-muted mt-2">Nothing due on this day</p>
            </div>
          ) : (
            selectedDayTasks.map((task) => (
              <CleaningTaskCard
                key={task.id}
                task={task}
                zone={zoneMap.get(task.zoneId)}
                now={now}
                compact={false}
                onComplete={onTaskComplete}
                onEdit={onTaskEdit}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
