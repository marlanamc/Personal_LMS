'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CleaningTaskCard } from './CleaningTaskCard';
import {
  getAvailableCleaningZones,
  getCleaningTaskStatus,
  getZoneColors,
  type CleaningPlannerStore,
  type CleaningTask,
} from '@/lib/cleaning-planner';

type CleaningListViewProps = {
  store: CleaningPlannerStore;
  tasks: CleaningTask[];
  now: Date;
  onTaskComplete: (task: CleaningTask) => void;
  onTaskEdit: (taskId: string) => void;
};

export function CleaningListView({
  store,
  tasks,
  now,
  onTaskComplete,
  onTaskEdit,
}: CleaningListViewProps) {
  const zones = useMemo(() => getAvailableCleaningZones(store), [store]);
  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const [collapsedZones, setCollapsedZones] = useState<Set<string>>(new Set());

  // Group tasks by zone
  const groupedTasks = useMemo(() => {
    const map = new Map<string, CleaningTask[]>();
    for (const task of tasks) {
      const current = map.get(task.zoneId) ?? [];
      current.push(task);
      map.set(task.zoneId, current);
    }
    return zones
      .map((zone) => ({
        zone,
        tasks: map.get(zone.id) ?? [],
      }))
      .filter((entry) => entry.tasks.length > 0);
  }, [tasks, zones]);

  const toggleZone = (zoneId: string) => {
    setCollapsedZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) {
        next.delete(zoneId);
      } else {
        next.add(zoneId);
      }
      return next;
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle/50 bg-bg-surface/60 px-4 py-6 text-center">
        <span className="text-xl opacity-50">✨</span>
        <p className="text-sm text-text-muted mt-1.5">No tasks match the current filter</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groupedTasks.map(({ zone, tasks: zoneTasks }) => {
        const zoneColors = getZoneColors(zone.id);
        const isCollapsed = collapsedZones.has(zone.id);
        const overdueCount = zoneTasks.filter((t) => getCleaningTaskStatus(t, now) === 'overdue').length;

        return (
          <section
            key={zone.id}
            className="rounded-xl border border-border-subtle/50 bg-bg-surface/60 overflow-hidden"
          >
            {/* Zone header - collapsible on mobile */}
            <button
              type="button"
              onClick={() => toggleZone(zone.id)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-bg-elevated/30 transition md:cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${zoneColors.dot}`} />
                <span className={`text-sm font-semibold ${zoneColors.text}`}>{zone.label}</span>
                <span className="text-xs text-text-muted">
                  {zoneTasks.length} {zoneTasks.length === 1 ? 'task' : 'tasks'}
                </span>
                {overdueCount > 0 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300">
                    {overdueCount} late
                  </span>
                )}
              </div>
              <span className="md:hidden">
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-text-muted" />
                )}
              </span>
            </button>

            {/* Tasks - collapsible on mobile, always visible on desktop */}
            <div className={`px-3 pb-3 space-y-2 ${isCollapsed ? 'hidden md:block' : ''}`}>
              {zoneTasks.map((task) => (
                <CleaningTaskCard
                  key={task.id}
                  task={task}
                  zone={zone}
                  now={now}
                  compact={false}
                  onComplete={onTaskComplete}
                  onEdit={onTaskEdit}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
