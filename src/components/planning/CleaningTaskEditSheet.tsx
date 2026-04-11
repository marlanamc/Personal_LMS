'use client';

import { useEffect, useState } from 'react';
import { Trash2, X, Clock, Calendar, Zap, Plus, GripVertical, Check } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptic';
import {
  CLEANING_CADENCE_LABELS,
  CLEANING_TASK_TYPE_LABELS,
  createCleaningTask,
  createSubtask,
  ensureCleaningZone,
  getAvailableCleaningZones,
  getZoneColors,
  type CleaningCadence,
  type CleaningCadencePreset,
  type CleaningPlannerStore,
  type CleaningSubtask,
  type CleaningTask,
  type CleaningTaskType,
} from '@/lib/cleaning-planner';

type LastCompletedOption = 'never' | 'today' | 'yesterday' | 'custom';
type StartDateOption = 'now' | 'custom';

type SubtaskDraft = {
  id: string;
  title: string;
  completed: boolean;
};

type TaskDraft = {
  title: string;
  zoneMode: string;
  customZoneLabel: string;
  taskType: CleaningTaskType;
  cadenceKind: CleaningCadencePreset | 'custom';
  customEveryNDays: number;
  notes: string;
  // New ADHD-friendly fields
  lastCompletedOption: LastCompletedOption;
  lastCompletedDate: string; // ISO date string for custom
  startDateOption: StartDateOption;
  startDate: string; // ISO date string for custom
  estimatedMinutes: number | null;
  subtasks: SubtaskDraft[];
  newSubtaskTitle: string;
};

const TIME_ESTIMATE_OPTIONS = [
  { value: 5, label: '5 min', icon: true },
  { value: 15, label: '15 min', icon: true },
  { value: 30, label: '30 min', icon: false },
  { value: 60, label: '1 hour', icon: false },
] as const;

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDateFromOption(option: LastCompletedOption, customDate: string): string | undefined {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  switch (option) {
    case 'never':
      return undefined;
    case 'today':
      return today.toISOString();
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString();
    case 'custom':
      return customDate ? new Date(customDate).toISOString() : undefined;
  }
}

type CleaningTaskEditSheetProps = {
  isOpen: boolean;
  task: CleaningTask | null; // null for create, task for edit
  store: CleaningPlannerStore;
  onSave: (task: CleaningTask, nextStore: CleaningPlannerStore) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
};

const CADENCE_OPTIONS: Array<{ value: CleaningCadencePreset | 'custom'; label: string }> = [
  { value: 'weekly', label: 'Every week' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Every month' },
  { value: 'quarterly', label: 'Every 3 months' },
  { value: 'semiannual', label: 'Every 6 months' },
  { value: 'yearly', label: 'Every year' },
  { value: 'custom', label: 'Custom days' },
];

function createDraft(task: CleaningTask | null, store: CleaningPlannerStore): TaskDraft {
  const zoneOptions = getAvailableCleaningZones(store);
  const zoneExists = task ? zoneOptions.some((zone) => zone.id === task.zoneId) : false;
  const today = formatDateForInput(new Date());

  // Determine lastCompletedOption from existing task
  let lastCompletedOption: LastCompletedOption = 'never';
  let lastCompletedDate = today;
  if (task?.lastCompletedAt) {
    const completedDate = new Date(task.lastCompletedAt);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    if (completedDate.toDateString() === todayDate.toDateString()) {
      lastCompletedOption = 'today';
    } else if (completedDate.toDateString() === yesterdayDate.toDateString()) {
      lastCompletedOption = 'yesterday';
    } else {
      lastCompletedOption = 'custom';
      lastCompletedDate = formatDateForInput(completedDate);
    }
  }

  // Determine startDateOption from existing task
  let startDateOption: StartDateOption = 'now';
  let startDate = today;
  if (task?.startDate) {
    const start = new Date(task.startDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (start.getTime() > todayDate.getTime()) {
      startDateOption = 'custom';
      startDate = formatDateForInput(start);
    }
  }

  return {
    title: task?.title ?? '',
    zoneMode: task ? (zoneExists ? task.zoneId : 'custom') : zoneOptions[0]?.id ?? 'kitchen',
    customZoneLabel: task && !zoneExists ? task.zoneId : '',
    taskType: task?.taskType ?? 'clean',
    cadenceKind: task?.cadence.kind ?? 'weekly',
    customEveryNDays: task?.cadence.kind === 'custom' ? task.cadence.everyNDays : 30,
    notes: task?.notes ?? '',
    lastCompletedOption,
    lastCompletedDate,
    startDateOption,
    startDate,
    estimatedMinutes: task?.estimatedMinutes ?? null,
    subtasks: task?.subtasks?.map((s) => ({ ...s })) ?? [],
    newSubtaskTitle: '',
  };
}

function getCadenceFromDraft(draft: TaskDraft): CleaningCadence {
  if (draft.cadenceKind === 'custom') {
    return { kind: 'custom', everyNDays: Math.max(1, Math.floor(draft.customEveryNDays || 1)) };
  }
  return { kind: draft.cadenceKind };
}

export function CleaningTaskEditSheet({ isOpen, task, store, onSave, onDelete, onClose }: CleaningTaskEditSheetProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => createDraft(task, store));
  const isEditing = Boolean(task);
  const zones = getAvailableCleaningZones(store);

  // Reset draft when sheet opens or task changes
  useEffect(() => {
    if (isOpen) {
      setDraft(createDraft(task, store));
    }
  }, [isOpen, task, store]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, draft]);

  const handleSave = () => {
    const title = draft.title.trim();
    if (!title) return;

    triggerHaptic('medium');

    let nextStore = store;
    let zoneId = draft.zoneMode;

    if (draft.zoneMode === 'custom') {
      const customZoneLabel = draft.customZoneLabel.trim();
      if (!customZoneLabel) return;
      const zoneResult = ensureCleaningZone(store, customZoneLabel);
      nextStore = zoneResult.store;
      zoneId = zoneResult.zone.id;
    }

    const cadence = getCadenceFromDraft(draft);
    const lastCompletedAt = getDateFromOption(draft.lastCompletedOption, draft.lastCompletedDate);
    const startDate = draft.startDateOption === 'custom' && draft.startDate
      ? new Date(draft.startDate).toISOString()
      : undefined;

    // Filter out empty subtasks and map to proper format
    const subtasks = draft.subtasks
      .filter((s) => s.title.trim().length > 0)
      .map((s) => ({ id: s.id, title: s.title.trim(), completed: s.completed }));

    const savedTask = task
      ? {
          ...task,
          title: title.replace(/\s+/g, ' '),
          zoneId,
          taskType: draft.taskType,
          cadence,
          notes: draft.notes.trim() ? draft.notes.trim() : undefined,
          lastCompletedAt: lastCompletedAt ?? task.lastCompletedAt,
          startDate,
          estimatedMinutes: draft.estimatedMinutes ?? undefined,
          subtasks: subtasks.length > 0 ? subtasks : undefined,
          updatedAt: new Date().toISOString(),
        }
      : createCleaningTask({
          title,
          zoneId,
          taskType: draft.taskType,
          cadence,
          notes: draft.notes.trim() ? draft.notes.trim() : undefined,
          lastCompletedAt,
          startDate,
          estimatedMinutes: draft.estimatedMinutes ?? undefined,
          subtasks: subtasks.map((s) => s.title),
        });

    onSave(savedTask, nextStore);
    onClose();
  };

  const handleDelete = () => {
    if (!task || !onDelete) return;
    triggerHaptic('heavy');
    onDelete(task.id);
    onClose();
  };

  if (!isOpen) return null;

  const selectedZoneColors = draft.zoneMode !== 'custom' ? getZoneColors(draft.zoneMode) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet - slides from right */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-bg-surface shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {isEditing ? 'Edit cleaning task' : 'Add cleaning task'}
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Set the zone, recurrence, and task type to track what is due next.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Task name */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Task name</span>
            <input
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Wipe kitchen counters"
              className="w-full rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </label>

          {/* Zone selector with color preview */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Zone</span>
            <div className="relative">
              {selectedZoneColors && (
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${selectedZoneColors.dot}`} />
              )}
              <select
                value={draft.zoneMode}
                onChange={(e) => setDraft((prev) => ({ ...prev, zoneMode: e.target.value }))}
                className={`w-full rounded-2xl border border-border-subtle bg-bg-elevated py-3 text-sm text-text-primary outline-none transition focus:border-primary/50 ${selectedZoneColors ? 'pl-10 pr-4' : 'px-4'}`}
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.label}
                  </option>
                ))}
                <option value="custom">Add custom zone...</option>
              </select>
            </div>
          </label>

          {/* Custom zone input */}
          {draft.zoneMode === 'custom' && (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-primary">Custom zone name</span>
              <input
                value={draft.customZoneLabel}
                onChange={(e) => setDraft((prev) => ({ ...prev, customZoneLabel: e.target.value }))}
                placeholder="Office"
                className="w-full rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/50"
              />
            </label>
          )}

          {/* Task type */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Task type</span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(CLEANING_TASK_TYPE_LABELS) as [CleaningTaskType, string][]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, taskType: value }))}
                  className={`rounded-xl border py-3 text-sm font-medium transition ${
                    draft.taskType === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border-subtle bg-bg-elevated text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </label>

          {/* Cadence */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Repeat cadence</span>
            <select
              value={draft.cadenceKind}
              onChange={(e) => setDraft((prev) => ({ ...prev, cadenceKind: e.target.value as CleaningCadencePreset | 'custom' }))}
              className="w-full rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/50"
            >
              {CADENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {/* Custom days input */}
          {draft.cadenceKind === 'custom' && (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-primary">Every N days</span>
              <input
                type="number"
                min={1}
                step={1}
                value={draft.customEveryNDays}
                onChange={(e) => setDraft((prev) => ({ ...prev, customEveryNDays: Number(e.target.value) || 1 }))}
                className="w-full rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/50"
              />
            </label>
          )}

          {/* Time estimate - ADHD friendly */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-medium text-text-primary">How long does this take?</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TIME_ESTIMATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDraft((prev) => ({
                    ...prev,
                    estimatedMinutes: prev.estimatedMinutes === option.value ? null : option.value
                  }))}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                    draft.estimatedMinutes === option.value
                      ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                      : 'bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {option.icon && <Zap className="h-3.5 w-3.5" />}
                  {option.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, estimatedMinutes: null }))}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  draft.estimatedMinutes === null
                    ? 'bg-bg-elevated/80 text-text-secondary ring-1 ring-border-subtle'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Skip
              </button>
            </div>
            <p className="text-xs text-text-muted">Quick tasks show up first in Focus Mode</p>
          </div>

          {/* When did you last do this? - for new tasks or editing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-medium text-text-primary">When did you last do this?</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['never', 'today', 'yesterday', 'custom'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, lastCompletedOption: option }))}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    draft.lastCompletedOption === option
                      ? 'bg-accent-mint/15 text-accent-mint ring-1 ring-accent-mint/30'
                      : 'bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {option === 'never' && 'Never done'}
                  {option === 'today' && 'Today'}
                  {option === 'yesterday' && 'Yesterday'}
                  {option === 'custom' && 'Pick date'}
                </button>
              ))}
            </div>
            {draft.lastCompletedOption === 'custom' && (
              <input
                type="date"
                value={draft.lastCompletedDate}
                max={formatDateForInput(new Date())}
                onChange={(e) => setDraft((prev) => ({ ...prev, lastCompletedDate: e.target.value }))}
                className="w-full rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/50"
              />
            )}
            <p className="text-xs text-text-muted">
              {draft.lastCompletedOption === 'never'
                ? "Task will be due immediately (or when it starts)"
                : "Next due date calculated from this"}
            </p>
          </div>

          {/* Start date - for deferring tasks */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-medium text-text-primary">When should this start?</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, startDateOption: 'now' }))}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  draft.startDateOption === 'now'
                    ? 'bg-accent-mint/15 text-accent-mint ring-1 ring-accent-mint/30'
                    : 'bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-secondary'
                }`}
              >
                Start now
              </button>
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, startDateOption: 'custom' }))}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  draft.startDateOption === 'custom'
                    ? 'bg-accent-amethyst/15 text-accent-amethyst ring-1 ring-accent-amethyst/30'
                    : 'bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-secondary'
                }`}
              >
                Start later
              </button>
            </div>
            {draft.startDateOption === 'custom' && (
              <input
                type="date"
                value={draft.startDate}
                min={formatDateForInput(new Date())}
                onChange={(e) => setDraft((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/50"
              />
            )}
            <p className="text-xs text-text-muted">
              {draft.startDateOption === 'custom'
                ? "Task won't appear in due lists until this date"
                : "Task is active immediately"}
            </p>
          </div>

          {/* Subtasks / Steps - for breaking down deep cleans */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Break it down (optional)</span>
              {draft.subtasks.length > 0 && (
                <span className="text-xs text-text-muted">
                  {draft.subtasks.filter((s) => s.completed).length}/{draft.subtasks.length} done
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">
              Add steps to make big tasks feel manageable
            </p>

            {/* Existing subtasks */}
            {draft.subtasks.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {draft.subtasks.map((subtask, index) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 rounded-xl border border-border-subtle/60 bg-bg-elevated/50 px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          subtasks: prev.subtasks.map((s, i) =>
                            i === index ? { ...s, completed: !s.completed } : s
                          ),
                        }));
                      }}
                      className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                        subtask.completed
                          ? 'bg-accent-mint border-accent-mint text-white'
                          : 'border-border-subtle hover:border-primary/50'
                      }`}
                    >
                      {subtask.completed && <Check className="w-3 h-3" strokeWidth={3} />}
                    </button>
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => {
                        setDraft((prev) => ({
                          ...prev,
                          subtasks: prev.subtasks.map((s, i) =>
                            i === index ? { ...s, title: e.target.value } : s
                          ),
                        }));
                      }}
                      className={`flex-1 bg-transparent text-sm outline-none ${
                        subtask.completed ? 'text-text-muted line-through' : 'text-text-primary'
                      }`}
                      placeholder="Step description..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          subtasks: prev.subtasks.filter((_, i) => i !== index),
                        }));
                      }}
                      className="shrink-0 p-1 text-text-muted hover:text-error transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new subtask */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft.newSubtaskTitle}
                onChange={(e) => setDraft((prev) => ({ ...prev, newSubtaskTitle: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && draft.newSubtaskTitle.trim()) {
                    e.preventDefault();
                    const newSubtask = createSubtask(draft.newSubtaskTitle);
                    setDraft((prev) => ({
                      ...prev,
                      subtasks: [...prev.subtasks, newSubtask],
                      newSubtaskTitle: '',
                    }));
                  }
                }}
                placeholder="Add a step..."
                className="flex-1 rounded-xl border border-dashed border-border-subtle bg-bg-elevated/30 px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary/50"
              />
              <button
                type="button"
                onClick={() => {
                  if (draft.newSubtaskTitle.trim()) {
                    const newSubtask = createSubtask(draft.newSubtaskTitle);
                    setDraft((prev) => ({
                      ...prev,
                      subtasks: [...prev.subtasks, newSubtask],
                      newSubtaskTitle: '',
                    }));
                  }
                }}
                disabled={!draft.newSubtaskTitle.trim()}
                className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-primary/20"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Notes</span>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Use the stainless spray after wiping."
              rows={3}
              className="w-full rounded-2xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/50 resize-none"
            />
          </label>
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle/60 px-6 py-5 flex items-center justify-between bg-bg-elevated/50">
          <div className="flex items-center gap-4">
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-full border border-error/30 bg-error/10 px-4 py-2 text-sm font-medium text-error transition hover:bg-error/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
            <p className="text-sm text-text-muted hidden sm:block">
              <kbd className="px-2 py-1 bg-bg-surface border border-border-subtle rounded text-xs">Esc</kbd> to cancel{' '}
              <kbd className="px-2 py-1 bg-bg-surface border border-border-subtle rounded text-xs">⌘ Enter</kbd> to save
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border-subtle px-4 py-2 text-sm font-medium text-text-muted transition hover:text-text-primary hover:bg-bg-elevated"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
            >
              {isEditing ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
