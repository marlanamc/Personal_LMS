'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, GripVertical, Trash2, X } from 'lucide-react';
import { formatDuration, TASK_DURATION_OPTIONS, type ProjectTask } from '@/lib/project-planner';

interface ProjectTaskRowProps {
  task: ProjectTask;
  onToggleComplete: () => void;
  onDelete: () => void;
  onUpdate?: (updates: { text?: string; estimatedMinutes?: number; category?: string }) => void;
  showDragHandle?: boolean;
  disabled?: boolean;
}

function triggerHaptic() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(12);
  }
}

export function ProjectTaskRow({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
  showDragHandle = false,
  disabled = false,
}: ProjectTaskRowProps) {
  const [offset, setOffset] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lockRef = useRef<'none' | 'h' | 'v'>('none');

  const isCompleted = task.status === 'completed';
  const isSkipped = task.status === 'skipped';
  const isDone = isCompleted || isSkipped;

  const reset = () => {
    setOffset(0);
    startRef.current = null;
    lockRef.current = 'none';
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    lockRef.current = 'none';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current || disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (lockRef.current === 'none') {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        lockRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
    }

    if (lockRef.current === 'h') {
      e.preventDefault();
      const clamped = Math.min(0, Math.max(-80, dx));
      setOffset(clamped);
    }
  };

  const onPointerUp = () => {
    if (offset < -50) {
      onDelete();
      triggerHaptic();
    }
    reset();
  };

  const onPointerCancel = () => reset();

  const handleToggle = () => {
    triggerHaptic();
    onToggleComplete();
  };

  const handleRowClick = () => {
    if (onUpdate && !disabled) {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (updates: { text?: string; estimatedMinutes?: number; category?: string }) => {
    if (onUpdate) {
      onUpdate(updates);
    }
    setIsEditing(false);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Delete backdrop */}
        <div
          className="absolute inset-0 bg-red-500/20 flex items-center justify-end pr-4"
          style={{ opacity: Math.min(1, Math.abs(offset) / 60) }}
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </div>

        {/* Main row */}
        <motion.div
          className={`
            relative flex items-center gap-3 p-3
            bg-[var(--color-bg-surface)]
            border border-[var(--color-border-subtle)] rounded-xl
            transition-colors duration-200
            ${isDone ? 'opacity-60' : ''}
            ${!disabled && onUpdate ? 'cursor-pointer' : ''}
          `}
          style={{ x: offset }}
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerCancel}
          onClick={handleRowClick}
        >
          {/* Drag handle */}
          {showDragHandle && (
            <div className="text-[var(--text-muted)] cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className={`
              flex-shrink-0 w-6 h-6 rounded-full
              border-2 transition-all duration-200
              flex items-center justify-center
              ${
                isDone
                  ? 'bg-[var(--color-secondary)] border-[var(--color-secondary)]'
                  : 'border-[color-mix(in_srgb,var(--color-text-muted)_45%,transparent)] hover:border-[color-mix(in_srgb,var(--color-primary)_55%,transparent)]'
              }
            `}
            disabled={disabled}
          >
            <AnimatePresence>
              {isDone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Task text */}
          <div className="flex-1 min-w-0">
            <p
              className={`
                text-sm leading-tight
                ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}
              `}
            >
              {task.text}
            </p>

            {/* Meta info */}
            {(task.estimatedMinutes || task.category) && (
              <div className="flex items-center gap-2 mt-1">
                {task.estimatedMinutes && (
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(task.estimatedMinutes)}
                  </span>
                )}
                {task.category && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--text-muted)]">
                    {task.category}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <TaskEditModal
        isOpen={isEditing}
        task={task}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
}

// Task Edit Modal
interface TaskEditModalProps {
  isOpen: boolean;
  task: ProjectTask;
  onClose: () => void;
  onSave: (updates: { text?: string; estimatedMinutes?: number; category?: string }) => void;
}

function TaskEditModal({ isOpen, task, onClose, onSave }: TaskEditModalProps) {
  const [text, setText] = useState(task.text);
  const [duration, setDuration] = useState(task.estimatedMinutes || 15);
  const [category, setCategory] = useState(task.category || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset form when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setText(task.text);
      setDuration(task.estimatedMinutes || 15);
      setCategory(task.category || '');
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const updates: { text?: string; estimatedMinutes?: number; category?: string } = {};

    if (trimmed !== task.text) {
      updates.text = trimmed;
    }
    if (duration !== task.estimatedMinutes) {
      updates.estimatedMinutes = duration;
    }
    if (category !== (task.category || '')) {
      updates.category = category || undefined;
    }

    if (Object.keys(updates).length > 0) {
      onSave(updates);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 z-[70] max-w-md mx-auto"
            initial={{ opacity: 0, y: '-40%', scale: 0.95 }}
            animate={{ opacity: 1, y: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: '-40%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="
                bg-[var(--color-bg-elevated)]
                border border-[var(--color-border-subtle)]
                rounded-2xl
                p-5
                shadow-2xl
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  Edit Task
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-[var(--color-bg-surface)] transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Task Text */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                    Task
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`
                      w-full px-3 py-2.5
                      bg-[var(--color-bg-surface)]
                      border border-[var(--color-border-subtle)] rounded-xl
                      text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                      focus:outline-none focus:border-[var(--primary)]/50
                      focus:ring-2 focus:ring-[var(--primary)]/20
                      text-sm
                    `}
                    placeholder="Task name"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                    Duration
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TASK_DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDuration(opt.value)}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium
                          transition-all duration-200
                          ${
                            duration === opt.value
                              ? 'bg-[var(--primary)] text-white'
                              : 'bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category (optional) */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`
                      w-full px-3 py-2.5
                      bg-[var(--color-bg-surface)]
                      border border-[var(--color-border-subtle)] rounded-xl
                      text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                      focus:outline-none focus:border-[var(--primary)]/50
                      focus:ring-2 focus:ring-[var(--primary)]/20
                      text-sm
                    `}
                    placeholder="e.g., Kitchen, Bathroom"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`
                      flex-1 py-2.5 rounded-xl
                      bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]
                      text-[var(--text-secondary)]
                      font-medium text-sm
                      hover:border-[var(--text-muted)]
                      transition-colors
                    `}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className={`
                      flex-1 py-2.5 rounded-xl
                      font-medium text-sm
                      transition-all duration-200
                      ${
                        text.trim()
                          ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90'
                          : 'bg-[var(--color-bg-surface)] text-[var(--text-muted)] cursor-not-allowed'
                      }
                    `}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Quick add task input
interface TaskQuickAddProps {
  onAdd: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TaskQuickAdd({ onAdd, placeholder = 'Add a task...', disabled = false }: TaskQuickAddProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(trimmed);
      setText('');
      inputRef.current?.focus();
      triggerHaptic();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 pr-12
          bg-[var(--color-bg-surface)]
          border border-[var(--color-border-subtle)] rounded-xl
          text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
          focus:outline-none focus:border-[var(--primary)]/50
          focus:ring-2 focus:ring-[var(--primary)]/20
          transition-all duration-200
          text-sm
        `}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2
          w-8 h-8 rounded-lg
          flex items-center justify-center
          transition-all duration-200
          ${
            text.trim()
              ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80'
              : 'bg-[var(--color-bg-surface)] text-[var(--text-muted)]'
          }
        `}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </form>
  );
}
