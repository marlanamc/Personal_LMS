'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { CalendarDays, LayoutGrid, List, Plus, AlertCircle, Clock, Calendar, Target } from 'lucide-react';
import SaveStatus from '@/components/ui/SaveStatus';
import { useCleaningPlanner } from '@/components/dashboard/useCleaningPlanner';
import { CleaningWeekView } from './CleaningWeekView';
import { CleaningMonthView } from './CleaningMonthView';
import { CleaningListView } from './CleaningListView';
import { CleaningFocusMode } from './CleaningFocusMode';
import { CleaningTaskEditSheet } from './CleaningTaskEditSheet';
import { CleaningCelebration } from './CleaningCelebration';
import {
  completeCleaningTask,
  getCleaningTaskStatus,
  sortCleaningTasks,
  sortTasksForFocus,
  upsertCleaningTask,
  deleteCleaningTask,
  type CleaningPlannerStore,
  type CleaningTask,
} from '@/lib/cleaning-planner';
import { triggerHaptic } from '@/lib/haptic';

export interface CleaningPlannerViewProps {
  storageScope: string;
}

type PlannerTab = 'focus' | 'week' | 'month' | 'list';
type FilterKey = 'all' | 'due' | 'overdue' | 'upcoming';

const TAB_OPTIONS: Array<{ key: PlannerTab; label: string; shortLabel: string; icon: typeof LayoutGrid }> = [
  { key: 'focus', label: 'Focus', shortLabel: 'Focus', icon: Target },
  { key: 'week', label: 'This Week', shortLabel: 'Week', icon: LayoutGrid },
  { key: 'month', label: 'Calendar', shortLabel: 'Month', icon: CalendarDays },
  { key: 'list', label: 'All Tasks', shortLabel: 'List', icon: List },
];

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function matchesFilter(task: CleaningTask, filter: FilterKey, now: Date): boolean {
  if (filter === 'all') return true;
  const status = getCleaningTaskStatus(task, now);
  if (filter === 'due') return status === 'due' || status === 'overdue';
  return status === filter;
}

export function CleaningPlannerView({ storageScope }: CleaningPlannerViewProps) {
  const { plannerStore, setPlannerStore, isLoaded, isSaving, saveError, lastSyncedAt } = useCleaningPlanner(storageScope);

  const [tab, setTab] = useState<PlannerTab>('focus');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewDate, setViewDate] = useState(() => startOfDay(new Date()));
  const [editingTask, setEditingTask] = useState<CleaningTask | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [skippedFocusTaskIds, setSkippedFocusTaskIds] = useState<string[]>([]);

  const now = useMemo(() => new Date(), [plannerStore.tasks, filter]);
  const tasks = useMemo(() => sortCleaningTasks(plannerStore.tasks, now), [plannerStore.tasks, now]);

  // Calculate summary stats
  const summary = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        const status = getCleaningTaskStatus(task, now);
        if (status === 'due') acc.due += 1;
        if (status === 'overdue') acc.overdue += 1;
        if (status === 'upcoming') acc.upcoming += 1;
        return acc;
      },
      { due: 0, overdue: 0, upcoming: 0 },
    );
  }, [now, tasks]);

  // Filter tasks
  const filteredTasks = useMemo(
    () => tasks.filter((task) => matchesFilter(task, filter, now)),
    [filter, now, tasks],
  );

  const availableFocusTasks = useMemo(
    () => sortTasksForFocus(tasks, now),
    [tasks, now],
  );

  const focusTasks = useMemo(
    () => availableFocusTasks.filter((task) => !skippedFocusTaskIds.includes(task.id)),
    [availableFocusTasks, skippedFocusTaskIds],
  );

  useEffect(() => {
    setSkippedFocusTaskIds((prev) => prev.filter((taskId) => availableFocusTasks.some((task) => task.id === taskId)));
  }, [availableFocusTasks]);

  const handleComplete = useCallback((task: CleaningTask) => {
    triggerHaptic('medium');
    setSkippedFocusTaskIds((prev) => prev.filter((taskId) => taskId !== task.id));
    setPlannerStore((prev) => upsertCleaningTask(prev, completeCleaningTask(task)));
    setShowCelebration(true);
  }, [setPlannerStore]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const handleFocusSkip = useCallback((task: CleaningTask) => {
    const remainingTasks = availableFocusTasks.filter(
      (candidate) => candidate.id !== task.id && !skippedFocusTaskIds.includes(candidate.id),
    );

    if (remainingTasks.length > 0) {
      setSkippedFocusTaskIds((prev) => [...prev, task.id]);
      return;
    }

    setSkippedFocusTaskIds([]);
    setTab('week');
  }, [availableFocusTasks, skippedFocusTaskIds]);

  const handleUpdateTask = useCallback((task: CleaningTask) => {
    setPlannerStore((prev) => upsertCleaningTask(prev, task));
  }, [setPlannerStore]);

  const handleEdit = (taskId: string) => {
    const task = plannerStore.tasks.find((t) => t.id === taskId);
    if (task) setEditingTask(task);
  };

  const handleSave = (task: CleaningTask, nextStore: CleaningPlannerStore) => {
    setPlannerStore(upsertCleaningTask(nextStore, task));
  };

  const handleDelete = (taskId: string) => {
    setPlannerStore((prev) => deleteCleaningTask(prev, taskId));
    setEditingTask(null);
  };

  const handleCloseSheet = () => {
    setEditingTask(null);
    setIsCreating(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-text-muted">Loading your cleaning schedule...</p>
        </div>
      </div>
    );
  }

  const hasTasks = plannerStore.tasks.length > 0;

  return (
    <div className="space-y-2 md:space-y-3">
      {/* Condensed header: title, stats, zone filter, add button - all in one row on desktop */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {/* Title + save status */}
        <div className="flex items-center gap-2 mr-auto">
          <h1 className="text-lg font-bold text-text-primary md:text-xl">Cleaning</h1>
          <SaveStatus isSaving={isSaving} error={saveError} lastSaved={lastSyncedAt} />
        </div>

        {/* Compact stats pills - inline */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter(filter === 'due' ? 'all' : 'due')}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition ${
              filter === 'due'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30'
                : 'bg-bg-elevated/60 text-text-muted hover:bg-bg-elevated'
            }`}
          >
            <Clock className="h-3 w-3" />
            <span className="font-semibold">{summary.due}</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter(filter === 'overdue' ? 'all' : 'overdue')}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition ${
              filter === 'overdue'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30'
                : summary.overdue > 0
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-bg-elevated/60 text-text-muted hover:bg-bg-elevated'
            }`}
          >
            <AlertCircle className="h-3 w-3" />
            <span className="font-semibold">{summary.overdue}</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter(filter === 'upcoming' ? 'all' : 'upcoming')}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition ${
              filter === 'upcoming'
                ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/30'
                : 'bg-bg-elevated/60 text-text-muted hover:bg-bg-elevated'
            }`}
          >
            <Calendar className="h-3 w-3" />
            <span className="font-semibold">{summary.upcoming}</span>
          </button>
          {filter !== 'all' && (
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="text-xs text-primary hover:text-primary/80 font-medium px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98] shadow-sm shadow-primary/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Tab bar - compact */}
      <div className="flex rounded-lg border border-border-subtle/40 bg-bg-elevated/30 p-0.5">
        {TAB_OPTIONS.map(({ key, label, shortLabel, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium transition ${
              tab === key
                ? 'bg-bg-surface text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {!hasTasks ? (
        <div className="bg-gradient-to-br from-[color-mix(in_srgb,var(--color-accent-teal)_8%,var(--color-bg-surface))] to-[color-mix(in_srgb,var(--color-accent-amethyst)_6%,var(--color-bg-surface))] rounded-[2rem] p-8 text-center border border-border-subtle/40">
          <div className="w-20 h-20 mx-auto mb-5 bg-bg-elevated/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/10 backdrop-blur-sm">
            <span className="text-4xl">🧹</span>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No cleaning tasks yet</h3>
          <p className="text-text-muted mb-5 max-w-md mx-auto leading-relaxed">
            Add your first cleaning task to start tracking when things need attention.
            The planner will remind you what is due, what is slipping, and what is coming up.
          </p>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            <Plus className="h-4 w-4" />
            Add your first task
          </button>
        </div>
      ) : (
        <>
          {/* Focus view - single task at a time */}
          {tab === 'focus' && (
            <CleaningFocusMode
              store={plannerStore}
              tasks={focusTasks}
              now={now}
              onComplete={handleComplete}
              onSkip={handleFocusSkip}
              onEdit={handleEdit}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {/* Week view */}
          {tab === 'week' && (
            <CleaningWeekView
              store={plannerStore}
              tasks={filteredTasks}
              viewDate={viewDate}
              now={now}
              onViewDateChange={setViewDate}
              onTaskComplete={handleComplete}
              onTaskEdit={handleEdit}
            />
          )}

          {/* Month view */}
          {tab === 'month' && (
            <CleaningMonthView
              store={plannerStore}
              tasks={filteredTasks}
              viewDate={viewDate}
              now={now}
              onViewDateChange={setViewDate}
              onTaskComplete={handleComplete}
              onTaskEdit={handleEdit}
            />
          )}

          {/* List view */}
          {tab === 'list' && (
            <CleaningListView
              store={plannerStore}
              tasks={filteredTasks}
              now={now}
              onTaskComplete={handleComplete}
              onTaskEdit={handleEdit}
            />
          )}
        </>
      )}

      {/* Edit/Create sheet */}
      <CleaningTaskEditSheet
        isOpen={isCreating || editingTask !== null}
        task={editingTask}
        store={plannerStore}
        onSave={handleSave}
        onDelete={editingTask ? handleDelete : undefined}
        onClose={handleCloseSheet}
      />

      {/* Celebration overlay */}
      <CleaningCelebration
        isVisible={showCelebration}
        onComplete={handleCelebrationComplete}
      />
    </div>
  );
}
