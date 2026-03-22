'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Archive,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from 'lucide-react';
import {
  formatDateRange,
  formatShortDate,
  getDateKeysBetween,
  getDaysRemaining,
  getProjectProgress,
  getTasksForDate,
  getUnscheduledTasks,
  TASK_DURATION_OPTIONS,
  type DateKey,
  type Project,
  type ProjectTask,
} from '@/lib/project-planner';
import { toDateKey, isToday } from '@/lib/unified-scheduler';
import { ProjectProgressRing } from './ProjectProgressRing';
import { ProjectTaskRow, TaskQuickAdd } from './ProjectTaskRow';

interface ProjectDetailSheetProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (projectId: string, text: string, options?: { estimatedMinutes?: number }) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
  onDeleteTask: (projectId: string, taskId: string) => void;
  onUpdateTask: (projectId: string, taskId: string, updates: { text?: string; estimatedMinutes?: number; category?: string }) => void;
  onMoveTask: (projectId: string, taskId: string, newDate: DateKey | undefined) => void;
  onAutoDistribute: (projectId: string) => void;
  onArchive: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectDetailSheet({
  project,
  isOpen,
  onClose,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onMoveTask: _onMoveTask,
  onAutoDistribute,
  onArchive,
  onDelete,
}: ProjectDetailSheetProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    unscheduled: true,
  });
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const todayKey = toDateKey(new Date());

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddTask = useCallback(
    (text: string) => {
      if (!project) return;
      onAddTask(project.id, text, { estimatedMinutes: selectedDuration });
    },
    [project, onAddTask, selectedDuration],
  );

  // Group tasks by date
  const { scheduledDays, unscheduledTasks, overdueTasks } = useMemo(() => {
    if (!project) {
      return { scheduledDays: [], unscheduledTasks: [], overdueTasks: [] };
    }

    const allDates = getDateKeysBetween(project.startDate, project.endDate);
    const unscheduled = getUnscheduledTasks(project);

    // Find overdue tasks (scheduled before today, not completed)
    const overdue = project.tasks.filter(
      (t) =>
        t.scheduledDate &&
        t.scheduledDate < todayKey &&
        t.status !== 'completed' &&
        t.status !== 'skipped',
    );

    // Days with tasks (from today onwards)
    const days = allDates
      .filter((date) => date >= todayKey)
      .map((date) => ({
        date,
        tasks: getTasksForDate(project, date),
        isToday: isToday(date),
      }))
      .filter((day) => day.tasks.length > 0 || day.isToday);

    return {
      scheduledDays: days,
      unscheduledTasks: unscheduled,
      overdueTasks: overdue,
    };
  }, [project, todayKey]);

  const progress = project ? getProjectProgress(project) : 0;
  const daysLeft = project ? getDaysRemaining(project, todayKey) : 0;

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div
              className="
                bg-[var(--color-bg-elevated)]
                border-t border-[var(--color-border-subtle)]
                rounded-t-3xl
                flex flex-col
                overflow-hidden
                max-w-2xl mx-auto w-full
                shadow-xl
              "
            >
              {/* Handle bar */}
              <div className="w-10 h-1 rounded-full bg-[var(--color-border-subtle)] mx-auto mt-3 mb-2 flex-shrink-0" />

              {/* Header */}
              <div className="px-5 pb-4 flex-shrink-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{project.emoji || '📋'}</span>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        {project.name}
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateRange(project.startDate, project.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProjectProgressRing progress={progress} size={48} strokeWidth={4} />
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-[var(--color-bg-surface)] transition-colors"
                    >
                      <X className="w-5 h-5 text-[var(--text-muted)]" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                  <span>
                    {project.tasks.filter((t) => t.status === 'completed').length}/
                    {project.tasks.length} tasks
                  </span>
                  <span>{daysLeft} days left</span>
                </div>
              </div>

              {/* Task Input */}
              <div className="px-5 pb-4 flex-shrink-0">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <TaskQuickAdd
                      onAdd={handleAddTask}
                      placeholder="Add a task..."
                    />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDurationPicker(!showDurationPicker)}
                      className={`
                        h-full px-3 rounded-xl
                        bg-[var(--color-bg-surface)]
                        border-2 border-[color-mix(in_srgb,var(--color-text-muted)_35%,transparent)]
                        text-sm text-[var(--text-secondary)]
                        hover:border-[color-mix(in_srgb,var(--color-primary)_45%,transparent)]
                        flex items-center gap-1
                      `}
                    >
                      {selectedDuration}m
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <AnimatePresence>
                      {showDurationPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`
                            absolute right-0 bottom-full mb-2
                            bg-[var(--color-bg-elevated)]
                            border border-[var(--color-border-subtle)] rounded-xl
                            p-2 shadow-xl z-10
                            flex flex-col gap-1
                          `}
                        >
                          {TASK_DURATION_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setSelectedDuration(opt.value);
                                setShowDurationPicker(false);
                              }}
                              className={`
                                px-3 py-1.5 rounded-lg text-sm text-left
                                ${
                                  selectedDuration === opt.value
                                    ? 'bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-[var(--color-primary)] ring-2 ring-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] ring-inset font-semibold'
                                    : 'hover:bg-[var(--color-bg-surface)] text-[var(--text-secondary)] border border-transparent'
                                }
                              `}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                  <TaskSection
                    title="Overdue"
                    tasks={overdueTasks}
                    isExpanded={expandedSections['overdue'] !== false}
                    onToggle={() => toggleSection('overdue')}
                    onToggleTask={(taskId) => onToggleTask(project.id, taskId)}
                    onDeleteTask={(taskId) => onDeleteTask(project.id, taskId)}
                    onUpdateTask={(taskId, updates) => onUpdateTask(project.id, taskId, updates)}
                    variant="warning"
                  />
                )}

                {/* Scheduled Days */}
                {scheduledDays.map((day) => (
                  <TaskSection
                    key={day.date}
                    title={day.isToday ? 'Today' : formatShortDate(day.date)}
                    tasks={day.tasks}
                    isExpanded={expandedSections[day.date] !== false}
                    onToggle={() => toggleSection(day.date)}
                    onToggleTask={(taskId) => onToggleTask(project.id, taskId)}
                    onDeleteTask={(taskId) => onDeleteTask(project.id, taskId)}
                    onUpdateTask={(taskId, updates) => onUpdateTask(project.id, taskId, updates)}
                    variant={day.isToday ? 'highlight' : 'default'}
                  />
                ))}

                {/* Unscheduled Tasks */}
                {unscheduledTasks.length > 0 && (
                  <TaskSection
                    title={`Unscheduled (${unscheduledTasks.length})`}
                    tasks={unscheduledTasks}
                    isExpanded={expandedSections['unscheduled'] !== false}
                    onToggle={() => toggleSection('unscheduled')}
                    onToggleTask={(taskId) => onToggleTask(project.id, taskId)}
                    onDeleteTask={(taskId) => onDeleteTask(project.id, taskId)}
                    onUpdateTask={(taskId, updates) => onUpdateTask(project.id, taskId, updates)}
                    variant="muted"
                  />
                )}

                {/* Auto-distribute button */}
                {unscheduledTasks.length > 0 && (
                  <button
                    onClick={() => onAutoDistribute(project.id)}
                    className={`
                      w-full py-3 rounded-xl
                      bg-[var(--accent)]/20 text-[var(--accent)]
                      font-medium text-sm
                      flex items-center justify-center gap-2
                      hover:bg-[var(--accent)]/30
                      transition-colors
                    `}
                  >
                    <Sparkles className="w-4 h-4" />
                    Auto-distribute tasks
                  </button>
                )}

                {/* Empty state */}
                {project.tasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)]">No tasks yet</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Add tasks above to get started
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-[var(--color-border-subtle)] space-y-2">
                  <button
                    onClick={() => onArchive(project.id)}
                    className={`
                      w-full py-3 rounded-xl
                      bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]
                      text-[var(--text-secondary)]
                      font-medium text-sm
                      flex items-center justify-center gap-2
                      hover:border-[var(--text-muted)]
                      transition-colors
                    `}
                  >
                    <Archive className="w-4 h-4" />
                    Archive project
                  </button>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className={`
                        w-full py-3 rounded-xl
                        text-red-400/70 text-sm
                        hover:text-red-400 hover:bg-red-500/10
                        transition-colors
                      `}
                    >
                      Delete project
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-3 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] text-[var(--text-secondary)] text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onDelete(project.id);
                          onClose();
                        }}
                        className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Task section component
interface TaskSectionProps {
  title: string;
  tasks: ProjectTask[];
  isExpanded: boolean;
  onToggle: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: { text?: string; estimatedMinutes?: number; category?: string }) => void;
  variant?: 'default' | 'highlight' | 'warning' | 'muted';
}

function TaskSection({
  title,
  tasks,
  isExpanded,
  onToggle,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  variant = 'default',
}: TaskSectionProps) {
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const allComplete = completedCount === tasks.length && tasks.length > 0;

  return (
    <div>
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between py-2
          text-sm font-medium
          ${variant === 'highlight' ? 'text-[var(--primary)]' : ''}
          ${variant === 'warning' ? 'text-amber-400' : ''}
          ${variant === 'muted' ? 'text-[var(--text-muted)]' : ''}
          ${variant === 'default' ? 'text-[var(--text-secondary)]' : ''}
        `}
      >
        <span className="flex items-center gap-2">
          {title}
          {allComplete && <span className="text-[var(--secondary)]">✓</span>}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">
            {completedCount}/{tasks.length}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pb-2">
              {tasks.map((task) => (
                <ProjectTaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={() => onToggleTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                  onUpdate={(updates) => onUpdateTask(task.id, updates)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
