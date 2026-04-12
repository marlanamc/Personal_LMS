'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronRight, Sparkles, Zap, Target, ListChecks } from 'lucide-react';
import {
  formatEstimatedTime,
  getCleaningZoneLabel,
  getStatusLabel,
  getCleaningTaskStatus,
  getSubtaskProgress,
  getZoneColors,
  sortTasksForFocus,
  toggleSubtask,
  type CleaningPlannerStore,
  type CleaningTask,
} from '@/lib/cleaning-planner';

type CleaningFocusModeProps = {
  store: CleaningPlannerStore;
  tasks: CleaningTask[];
  now: Date;
  onComplete: (task: CleaningTask) => void;
  onSkip: (task: CleaningTask) => void;
  onEdit: (taskId: string) => void;
  onUpdateTask?: (task: CleaningTask) => void; // For updating subtasks
};

export function CleaningFocusMode({
  store,
  tasks,
  now,
  onComplete,
  onSkip,
  onEdit,
  onUpdateTask,
}: CleaningFocusModeProps) {
  // Get tasks sorted for focus mode (due/overdue, quick tasks first)
  const focusTasks = useMemo(() => sortTasksForFocus(tasks, now), [tasks, now]);
  const currentTask = focusTasks[0] ?? null;
  const remainingCount = Math.max(0, focusTasks.length - 1);
  const [showSubtasks, setShowSubtasks] = useState(true);

  // All caught up state
  if (!currentTask) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="w-24 h-24 mb-6 bg-gradient-to-br from-accent-mint/20 to-accent-teal/20 rounded-full flex items-center justify-center shadow-lg shadow-accent-mint/10">
          <Sparkles className="w-10 h-10 text-accent-mint" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">All caught up!</h2>
        <p className="text-text-muted max-w-sm leading-relaxed">
          No tasks need your attention right now. Enjoy your clean space!
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
          Check back later for upcoming tasks
        </div>
      </div>
    );
  }

  const status = getCleaningTaskStatus(currentTask, now);
  const zoneColors = getZoneColors(currentTask.zoneId);
  const zoneLabel = getCleaningZoneLabel(store, currentTask.zoneId);
  const timeEstimate = formatEstimatedTime(currentTask.estimatedMinutes);
  const isQuickTask = currentTask.estimatedMinutes && currentTask.estimatedMinutes <= 15;
  const isOverdue = status === 'overdue';
  const subtaskProgress = getSubtaskProgress(currentTask);
  const hasSubtasks = currentTask.subtasks && currentTask.subtasks.length > 0;

  const handleToggleSubtask = (subtaskId: string) => {
    if (!onUpdateTask) return;
    const updatedTask = toggleSubtask(currentTask, subtaskId);
    onUpdateTask(updatedTask);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] px-4 py-6">
      {/* Focus indicator */}
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">Focus Mode</span>
        {remainingCount > 0 && (
          <span className="text-sm text-text-muted">
            · {remainingCount} more after this
          </span>
        )}
      </div>

      {/* Main task card */}
      <div
        className={`
          w-full max-w-md rounded-3xl border-2 bg-bg-surface/80 backdrop-blur-sm
          shadow-xl transition-all duration-300
          ${isOverdue ? 'border-rose-400/50 shadow-rose-500/10' : 'border-primary/30 shadow-primary/10'}
        `}
      >
        <div className="p-6 sm:p-8">
          {/* Zone + status badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${zoneColors.bg} ${zoneColors.text}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${zoneColors.dot}`} />
              {zoneLabel}
            </span>
            {timeEstimate && (
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                isQuickTask
                  ? 'bg-primary/15 text-primary'
                  : 'bg-bg-elevated text-text-secondary'
              }`}>
                {isQuickTask && <Zap className="w-3.5 h-3.5" />}
                {timeEstimate}
              </span>
            )}
          </div>

          {/* Task title - large and centered */}
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center leading-tight mb-3">
            {currentTask.title}
          </h2>

          {/* Status message */}
          <p className={`text-center text-sm font-medium mb-6 ${
            isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-text-muted'
          }`}>
            {isOverdue ? 'This one needs attention' : getStatusLabel(status)}
          </p>

          {/* Subtasks / Steps - interactive checklist */}
          {hasSubtasks && showSubtasks && (
            <div className="mb-6 w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <ListChecks className="w-4 h-4" />
                  <span>Steps</span>
                </div>
                {subtaskProgress && (
                  <span className="text-xs text-text-muted">
                    {subtaskProgress.completed}/{subtaskProgress.total} done
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {currentTask.subtasks?.map((subtask) => (
                  <button
                    key={subtask.id}
                    type="button"
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition active:scale-[0.98] ${
                      subtask.completed
                        ? 'bg-accent-mint/10 border-accent-mint/30'
                        : 'bg-bg-elevated/50 border-border-subtle/60 hover:border-primary/30'
                    }`}
                  >
                    <div
                      className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                        subtask.completed
                          ? 'bg-accent-mint border-accent-mint text-white'
                          : 'border-border-subtle'
                      }`}
                    >
                      {subtask.completed && <Check className="w-4 h-4" strokeWidth={3} />}
                    </div>
                    <span
                      className={`flex-1 text-sm ${
                        subtask.completed
                          ? 'text-text-muted line-through'
                          : 'text-text-primary font-medium'
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </button>
                ))}
              </div>
              {subtaskProgress && subtaskProgress.percent === 100 && (
                <p className="mt-3 text-center text-sm text-accent-mint font-medium animate-pulse">
                  All steps done! Ready to mark complete.
                </p>
              )}
            </div>
          )}

          {/* Notes if present (only show if no subtasks) */}
          {currentTask.notes && !hasSubtasks && (
            <p className="text-sm text-text-muted text-center mb-6 leading-relaxed bg-bg-elevated/50 rounded-xl p-3">
              {currentTask.notes}
            </p>
          )}

          {/* Big Done button */}
          <button
            type="button"
            onClick={() => onComplete(currentTask)}
            className={`
              w-full py-4 rounded-2xl text-lg font-bold text-white
              transition-all duration-200 active:scale-[0.98]
              shadow-lg
              ${isOverdue
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-500/25'
                : 'bg-gradient-to-r from-accent-mint to-accent-teal hover:opacity-90 shadow-accent-mint/25'
              }
            `}
          >
            <span className="inline-flex items-center gap-2">
              <Check className="w-6 h-6" strokeWidth={3} />
              Done!
            </span>
          </button>
        </div>

        {/* Footer actions */}
        <div className="border-t border-border-subtle/40 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSkip(currentTask)}
            className="text-sm text-text-muted hover:text-text-secondary transition"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={() => onEdit(currentTask.id)}
            className="text-sm text-primary hover:text-primary/80 transition inline-flex items-center gap-1"
          >
            Edit task
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      {focusTasks.length > 1 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            {focusTasks.filter(t => getCleaningTaskStatus(t, now) === 'overdue').length > 0 && (
              <span className="text-rose-600 dark:text-rose-400 font-medium">
                {focusTasks.filter(t => getCleaningTaskStatus(t, now) === 'overdue').length} need attention
              </span>
            )}
            {focusTasks.filter(t => getCleaningTaskStatus(t, now) === 'overdue').length > 0 &&
              focusTasks.filter(t => getCleaningTaskStatus(t, now) === 'due').length > 0 && ' · '}
            {focusTasks.filter(t => getCleaningTaskStatus(t, now) === 'due').length > 0 && (
              <span>
                {focusTasks.filter(t => getCleaningTaskStatus(t, now) === 'due').length} due today
              </span>
            )}
          </p>
        </div>
      )}

      {/* Encouragement */}
      {isQuickTask && (
        <p className="mt-4 text-sm text-primary/80 font-medium animate-pulse">
          Quick win! Just {timeEstimate}.
        </p>
      )}
    </div>
  );
}
