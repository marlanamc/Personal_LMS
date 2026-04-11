'use client';

import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptic';
import {
  CLEANING_CADENCE_LABELS,
  CLEANING_TASK_TYPE_LABELS,
  createCleaningTask,
  ensureCleaningZone,
  getAvailableCleaningZones,
  getZoneColors,
  type CleaningCadence,
  type CleaningCadencePreset,
  type CleaningPlannerStore,
  type CleaningTask,
  type CleaningTaskType,
} from '@/lib/cleaning-planner';

type TaskDraft = {
  title: string;
  zoneMode: string;
  customZoneLabel: string;
  taskType: CleaningTaskType;
  cadenceKind: CleaningCadencePreset | 'custom';
  customEveryNDays: number;
  notes: string;
};

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
  return {
    title: task?.title ?? '',
    zoneMode: task ? (zoneExists ? task.zoneId : 'custom') : zoneOptions[0]?.id ?? 'kitchen',
    customZoneLabel: task && !zoneExists ? task.zoneId : '',
    taskType: task?.taskType ?? 'clean',
    cadenceKind: task?.cadence.kind ?? 'weekly',
    customEveryNDays: task?.cadence.kind === 'custom' ? task.cadence.everyNDays : 30,
    notes: task?.notes ?? '',
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

    const savedTask = task
      ? {
          ...task,
          title: title.replace(/\s+/g, ' '),
          zoneId,
          taskType: draft.taskType,
          cadence,
          notes: draft.notes.trim() ? draft.notes.trim() : undefined,
          updatedAt: new Date().toISOString(),
        }
      : createCleaningTask({
          title,
          zoneId,
          taskType: draft.taskType,
          cadence,
          notes: draft.notes.trim() ? draft.notes.trim() : undefined,
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

          {/* Notes */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Notes</span>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Use the stainless spray after wiping."
              rows={4}
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
