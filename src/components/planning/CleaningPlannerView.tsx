'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, LayoutGrid, List, Plus, Filter, ChevronDown, AlertCircle, Clock, Calendar } from 'lucide-react';
import SaveStatus from '@/components/ui/SaveStatus';
import { useCleaningPlanner } from '@/components/dashboard/useCleaningPlanner';
import { CleaningWeekView } from './CleaningWeekView';
import { CleaningMonthView } from './CleaningMonthView';
import { CleaningListView } from './CleaningListView';
import { CleaningTaskEditSheet } from './CleaningTaskEditSheet';
import {
  completeCleaningTask,
  getAvailableCleaningZones,
  getCleaningTaskStatus,
  sortCleaningTasks,
  upsertCleaningTask,
  deleteCleaningTask,
  type CleaningPlannerStore,
  type CleaningTask,
} from '@/lib/cleaning-planner';
import { triggerHaptic } from '@/lib/haptic';

export interface CleaningPlannerViewProps {
  storageScope: string;
}

type PlannerTab = 'week' | 'month' | 'list';
type FilterKey = 'all' | 'due' | 'overdue' | 'upcoming';

const FILTER_OPTIONS: Array<{ value: FilterKey; label: string; shortLabel: string }> = [
  { value: 'all', label: 'All tasks', shortLabel: 'All' },
  { value: 'due', label: 'Due today', shortLabel: 'Due' },
  { value: 'overdue', label: 'Overdue', shortLabel: 'Late' },
  { value: 'upcoming', label: 'Upcoming', shortLabel: 'Soon' },
];

const TAB_OPTIONS: Array<{ key: PlannerTab; label: string; shortLabel: string; icon: typeof LayoutGrid }> = [
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

  const [tab, setTab] = useState<PlannerTab>('week');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('all');
  const [viewDate, setViewDate] = useState(() => startOfDay(new Date()));
  const [editingTask, setEditingTask] = useState<CleaningTask | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const now = useMemo(() => new Date(), [plannerStore.tasks, filter, selectedZoneId]);
  const zones = useMemo(() => getAvailableCleaningZones(plannerStore), [plannerStore]);
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
    () =>
      tasks.filter((task) => {
        if (!matchesFilter(task, filter, now)) return false;
        if (selectedZoneId !== 'all' && task.zoneId !== selectedZoneId) return false;
        return true;
      }),
    [filter, now, selectedZoneId, tasks],
  );

  const handleComplete = (task: CleaningTask) => {
    triggerHaptic('medium');
    setPlannerStore((prev) => upsertCleaningTask(prev, completeCleaningTask(task)));
  };

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
    <div className="space-y-3 md:space-y-5">
      {/* Compact header with title + add button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-text-primary md:text-2xl">Cleaning</h1>
          <SaveStatus isSaving={isSaving} error={saveError} lastSaved={lastSyncedAt} />
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98] shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Compact summary row - horizontal on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          type="button"
          onClick={() => setFilter(filter === 'due' ? 'all' : 'due')}
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'due'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30'
              : 'bg-bg-elevated/60 text-text-muted hover:bg-bg-elevated'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="font-semibold">{summary.due}</span>
          <span className="text-xs opacity-80">due</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter(filter === 'overdue' ? 'all' : 'overdue')}
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'overdue'
              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30'
              : summary.overdue > 0
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                : 'bg-bg-elevated/60 text-text-muted hover:bg-bg-elevated'
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span className="font-semibold">{summary.overdue}</span>
          <span className="text-xs opacity-80">late</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter(filter === 'upcoming' ? 'all' : 'upcoming')}
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'upcoming'
              ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/30'
              : 'bg-bg-elevated/60 text-text-muted hover:bg-bg-elevated'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span className="font-semibold">{summary.upcoming}</span>
          <span className="text-xs opacity-80">soon</span>
        </button>
        {filter !== 'all' && (
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-primary bg-primary/10 whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>

      {/* Zone filter - compact dropdown */}
      {zones.length > 1 && (
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-text-muted" />
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="rounded-lg border border-border-subtle/60 bg-bg-surface/80 px-2.5 py-1.5 text-sm text-text-primary outline-none transition focus:border-primary/50 appearance-none pr-7 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.25rem_center] bg-no-repeat"
          >
            <option value="all">All zones</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tab bar - more compact */}
      <div className="flex rounded-xl border border-border-subtle/40 bg-bg-elevated/30 p-0.5">
        {TAB_OPTIONS.map(({ key, label, shortLabel, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
              tab === key
                ? 'bg-bg-surface text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="h-4 w-4" />
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
    </div>
  );
}
