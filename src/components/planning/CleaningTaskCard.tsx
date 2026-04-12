'use client';

import { CheckCircle2, Pencil, MoreHorizontal, Check, Zap, Calendar } from 'lucide-react';
import {
  CLEANING_TASK_TYPE_LABELS,
  formatCleaningCadence,
  formatEstimatedTime,
  getCleaningTaskStatus,
  getNextDueDate,
  parseCleaningStartDate,
  getStatusColors,
  getStatusLabel,
  getSubtaskProgress,
  getZoneColors,
  type CleaningTask,
  type CleaningZone,
} from '@/lib/cleaning-planner';

type CleaningTaskCardProps = {
  task: CleaningTask;
  zone: CleaningZone | undefined;
  now: Date;
  compact?: boolean;
  onComplete: (task: CleaningTask) => void;
  onEdit: (taskId: string) => void;
};

function formatRelativeDate(date: Date | null, now: Date, isStartDate = false): string {
  if (!date) return isStartDate ? '' : 'Ready now';
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return isStartDate ? 'Starts today' : 'Today';
  if (diffDays === 1) return isStartDate ? 'Starts tomorrow' : 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)}d ago`;
  if (diffDays <= 7) return isStartDate ? `Starts in ${diffDays}d` : `In ${diffDays}d`;
  return isStartDate
    ? `Starts ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCompactCadence(cadence: CleaningTask['cadence']): string {
  if (cadence.kind === 'custom') return `${cadence.everyNDays}d`;
  switch (cadence.kind) {
    case 'weekly': return 'Weekly';
    case 'biweekly': return '2 weeks';
    case 'monthly': return 'Monthly';
    case 'quarterly': return '3 months';
    case 'semiannual': return '6 months';
    case 'yearly': return 'Yearly';
    default: return formatCleaningCadence(cadence);
  }
}

export function CleaningTaskCard({ task, zone, now, compact = false, onComplete, onEdit }: CleaningTaskCardProps) {
  const status = getCleaningTaskStatus(task, now);
  const nextDueDate = getNextDueDate(task);
  const zoneColors = getZoneColors(task.zoneId);
  const statusColors = getStatusColors(status);
  const timeEstimate = formatEstimatedTime(task.estimatedMinutes);
  const isQuickTask = task.estimatedMinutes && task.estimatedMinutes <= 15;
  const isNotStarted = status === 'not-started';
  const startDate = parseCleaningStartDate(task.startDate);
  const subtaskProgress = getSubtaskProgress(task);

  // Compact card for week view - optimized for mobile with better space usage
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onEdit(task.id)}
        className={`
          group relative w-full rounded-lg border bg-bg-surface/90 backdrop-blur-sm
          transition-all duration-150 active:scale-[0.98] text-left
          ${isNotStarted ? 'border-border-subtle/30 bg-bg-elevated/20 opacity-50' : ''}
          ${status === 'overdue' ? 'border-rose-300/50 bg-rose-50/40 dark:bg-rose-950/30' : zoneColors.border}
        `}
      >
        <div className="flex items-center gap-1.5 p-2">
          {/* Complete button - compact circle */}
          {!isNotStarted ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task);
              }}
              className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                status === 'overdue'
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/30'
                  : 'bg-accent-mint/25 text-accent-mint hover:bg-accent-mint/35'
              }`}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </button>
          ) : (
            <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-accent-amethyst/10 text-accent-amethyst/40">
              <Calendar className="h-3 w-3" />
            </div>
          )}

          {/* Task info - vertical stack for better title visibility */}
          <div className="flex-1 min-w-0">
            {/* Title row with zone dot */}
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${zoneColors.dot}`} />
              <span className={`text-xs font-medium leading-tight ${isNotStarted ? 'text-text-muted' : 'text-text-primary'}`}>
                {task.title}
              </span>
            </div>
            {/* Meta row - just cadence, very compact */}
            <div className="flex items-center gap-1 mt-0.5">
              {isQuickTask && !isNotStarted && (
                <span className="inline-flex items-center text-[9px] font-medium text-primary">
                  <Zap className="h-2 w-2 mr-0.5" />
                  {task.estimatedMinutes}m
                </span>
              )}
              {isQuickTask && !isNotStarted && <span className="text-text-muted/40 text-[9px]">·</span>}
              <span className="text-[10px] text-text-muted/70">{formatCompactCadence(task.cadence)}</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  // Full card for list view
  return (
    <div
      className={`
        rounded-2xl border bg-bg-surface/60 backdrop-blur-sm
        transition-all duration-200 hover:shadow-md
        ${isNotStarted ? 'border-border-subtle/40 bg-bg-elevated/30 opacity-70' : ''}
        ${status === 'overdue' ? 'border-rose-400/40 bg-rose-50/20 dark:bg-rose-950/15' : zoneColors.border}
      `}
    >
      <div className="p-3 sm:p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            {/* Zone + status + time badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${zoneColors.text}`}>
                <span className={`w-2 h-2 rounded-full ${zoneColors.dot}`} />
                {zone?.label ?? 'Unknown'}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors.bg} ${statusColors.text}`}>
                {getStatusLabel(status)}
              </span>
              {timeEstimate && !isNotStarted && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  isQuickTask
                    ? 'bg-primary/10 text-primary'
                    : 'bg-bg-elevated text-text-muted'
                }`}>
                  {isQuickTask && <Zap className="h-2.5 w-2.5" />}
                  {timeEstimate}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className={`text-base font-semibold leading-tight ${isNotStarted ? 'text-text-muted' : 'text-text-primary'}`}>{task.title}</h3>
          </div>

          {/* Actions - compact on mobile, hidden for not-started */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isNotStarted && (
              <button
                type="button"
                onClick={() => onComplete(task)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition active:scale-[0.97] ${
                  status === 'overdue'
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-accent-mint text-bg-base hover:opacity-90'
                }`}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="hidden sm:inline">Done</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onEdit(task.id)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border-subtle/60 bg-bg-elevated/50 text-text-muted transition hover:text-text-primary hover:border-primary/30"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Meta row - compact */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="opacity-60">Every</span>
            <span className="font-medium text-text-secondary">{formatCompactCadence(task.cadence)}</span>
          </span>
          <span className="opacity-40">·</span>
          {isNotStarted ? (
            <span className="text-accent-amethyst/70">
              {formatRelativeDate(startDate, now, true)}
            </span>
          ) : (
            <span className={status === 'overdue' ? 'text-rose-600 dark:text-rose-400 font-medium' : ''}>
              {status === 'overdue' ? 'Needs attention' : `Due ${formatRelativeDate(nextDueDate, now)}`}
            </span>
          )}
          {task.lastCompletedAt && !isNotStarted && (
            <>
              <span className="opacity-40 hidden sm:inline">·</span>
              <span className="hidden sm:inline">
                Last: {new Date(task.lastCompletedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </>
          )}
        </div>

        {/* Subtask progress - if present */}
        {subtaskProgress && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-muted">
                {subtaskProgress.completed}/{subtaskProgress.total} steps
              </span>
              <span className="text-xs font-medium text-text-secondary">
                {subtaskProgress.percent}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-mint transition-all duration-300"
                style={{ width: `${subtaskProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Notes - if present */}
        {task.notes && !subtaskProgress && (
          <p className="mt-2 text-sm text-text-muted/80 leading-relaxed line-clamp-2">{task.notes}</p>
        )}
      </div>
    </div>
  );
}
