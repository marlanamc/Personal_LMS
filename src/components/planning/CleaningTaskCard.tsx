'use client';

import { CheckCircle2, Pencil, MoreHorizontal, Check } from 'lucide-react';
import {
  CLEANING_TASK_TYPE_LABELS,
  formatCleaningCadence,
  getCleaningTaskStatus,
  getNextDueDate,
  getStatusColors,
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

function formatRelativeDate(date: Date | null, now: Date): string {
  if (!date) return 'First pass needed';
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)}d ago`;
  if (diffDays <= 7) return `In ${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  // Compact card for week view - optimized for mobile
  if (compact) {
    return (
      <div
        className={`
          group relative rounded-xl border bg-bg-surface/80 backdrop-blur-sm
          transition-all duration-150 active:scale-[0.98]
          ${status === 'overdue' ? 'border-rose-400/40 bg-rose-50/30 dark:bg-rose-950/20' : zoneColors.border}
        `}
      >
        <div className="flex items-center gap-2 p-2.5">
          {/* Complete button - always visible on mobile */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task);
            }}
            className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              status === 'overdue'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25'
                : 'bg-accent-mint/20 text-accent-mint hover:bg-accent-mint/30'
            }`}
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </button>

          {/* Task info */}
          <button
            type="button"
            onClick={() => onEdit(task.id)}
            className="flex-1 min-w-0 text-left"
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${zoneColors.dot}`} />
              <span className="text-sm font-medium text-text-primary truncate">{task.title}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs ${status === 'overdue' ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-text-muted'}`}>
                {formatRelativeDate(nextDueDate, now)}
              </span>
              <span className="text-xs text-text-muted/60">·</span>
              <span className="text-xs text-text-muted/80">{formatCompactCadence(task.cadence)}</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Full card for list view
  return (
    <div
      className={`
        rounded-2xl border bg-bg-surface/60 backdrop-blur-sm
        transition-all duration-200 hover:shadow-md
        ${status === 'overdue' ? 'border-rose-400/40 bg-rose-50/20 dark:bg-rose-950/15' : zoneColors.border}
      `}
    >
      <div className="p-3 sm:p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            {/* Zone + status badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${zoneColors.text}`}>
                <span className={`w-2 h-2 rounded-full ${zoneColors.dot}`} />
                {zone?.label ?? 'Unknown'}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors.bg} ${statusColors.text}`}>
                {status === 'due' ? 'Due today' : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-text-primary leading-tight">{task.title}</h3>
          </div>

          {/* Actions - compact on mobile */}
          <div className="flex items-center gap-1.5 shrink-0">
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
          <span className={status === 'overdue' ? 'text-rose-600 dark:text-rose-400 font-medium' : ''}>
            Due {formatRelativeDate(nextDueDate, now)}
          </span>
          {task.lastCompletedAt && (
            <>
              <span className="opacity-40 hidden sm:inline">·</span>
              <span className="hidden sm:inline">
                Last: {new Date(task.lastCompletedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </>
          )}
        </div>

        {/* Notes - if present */}
        {task.notes && (
          <p className="mt-2 text-sm text-text-muted/80 leading-relaxed line-clamp-2">{task.notes}</p>
        )}
      </div>
    </div>
  );
}
