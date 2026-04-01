'use client';

import { useMemo } from 'react';
import { Check, ClipboardList } from 'lucide-react';
import { AnchorTimeWindowCard } from './AnchorTimeWindowCard';
import type { CalendarEvent } from '@/components/planning/MiniCalendar';
import type { TimeWindow, PinnedPlannerTask } from './useTodayFlow';

interface TodayFlowTimelineProps {
  timeWindows: TimeWindow[];
  unpinnedTasks: PinnedPlannerTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (text: string, anchorId?: string) => void;
  onAddMoment: (text: string) => void;
}

function UnpinnedTasksCard({
  tasks,
  onToggleTask,
}: {
  tasks: PinnedPlannerTask[];
  onToggleTask: (taskId: string) => void;
}) {
  const openTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  if (tasks.length === 0) return null;

  return (
    <div className="rounded-[1.5rem] border border-border-subtle/45 bg-bg-surface/55 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-border-subtle/30">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bg-elevated/60 text-text-muted">
          <ClipboardList className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-text">
            Unpinned Tasks
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            {openTasks.length} open, {doneTasks.length} done
          </p>
        </div>
      </div>

      {/* Tasks */}
      <div className="px-4 py-3 space-y-1.5">
        {openTasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onToggleTask(task.id)}
            className="flex w-full items-center gap-3 rounded-xl border border-border-subtle/35 bg-bg-elevated/40 px-3 py-2.5 text-left transition-colors hover:bg-bg-elevated/60"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border-subtle/60 text-transparent hover:border-accent-mint/40 transition-colors" />
            <span className="flex-1 text-sm text-text">{task.text}</span>
          </button>
        ))}
        {doneTasks.length > 0 && openTasks.length > 0 && (
          <div className="h-px bg-border-subtle/30 my-2" />
        )}
        {doneTasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onToggleTask(task.id)}
            className="flex w-full items-center gap-3 rounded-xl border border-border-subtle/25 bg-bg-surface/30 px-3 py-2.5 text-left opacity-60 transition-colors hover:opacity-80"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-accent-mint bg-accent-mint/20 text-accent-mint">
              <Check className="h-3 w-3" />
            </span>
            <span className="flex-1 text-sm text-text-muted line-through">
              {task.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TimeGap({ minutes }: { minutes: number }) {
  if (minutes <= 0) return null;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const label =
    hours > 0
      ? mins > 0
        ? `${hours}h ${mins}m`
        : `${hours}h`
      : `${mins}m`;

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-2">
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-border-subtle/50 to-transparent" />
        <span className="text-[11px] text-text-muted/60 font-medium">{label}</span>
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-border-subtle/50 to-transparent" />
      </div>
    </div>
  );
}

export function TodayFlowTimeline({
  timeWindows,
  unpinnedTasks,
  onToggleTask,
  onAddTask,
  onAddMoment,
}: TodayFlowTimelineProps) {
  // Calculate gaps between windows
  const windowsWithGaps = useMemo(() => {
    return timeWindows.map((window, idx) => {
      const prevWindow = idx > 0 ? timeWindows[idx - 1] : null;
      const gapMinutes = prevWindow
        ? window.startMinute - prevWindow.endMinute
        : 0;
      return { window, gapMinutes };
    });
  }, [timeWindows]);

  if (timeWindows.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border-subtle/50 bg-bg-surface/30 backdrop-blur-sm p-8 text-center">
        <p className="text-text-muted">
          No anchors scheduled for today. Set up your daily anchors to see your
          time flow here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {windowsWithGaps.map(({ window, gapMinutes }, idx) => (
        <div key={window.anchor.id}>
          {/* Gap indicator (skip first) */}
          {idx > 0 && gapMinutes > 15 && <TimeGap minutes={gapMinutes} />}

          {/* Anchor card */}
          <AnchorTimeWindowCard
            anchor={window.anchor}
            events={window.events}
            tasks={window.tasks}
            momentEntries={window.momentEntries}
            isActive={window.isActive}
            isUpNext={window.isUpNext}
            isDone={window.isDone}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onAddMoment={onAddMoment}
          />
        </div>
      ))}

      {/* Unpinned tasks section */}
      {unpinnedTasks.length > 0 && (
        <div className="pt-4">
          <UnpinnedTasksCard tasks={unpinnedTasks} onToggleTask={onToggleTask} />
        </div>
      )}
    </div>
  );
}
