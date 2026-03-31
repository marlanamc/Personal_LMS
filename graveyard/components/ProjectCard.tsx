'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import {
  formatDateRange,
  formatDuration,
  getDaysRemaining,
  getNextTask,
  getProjectProgress,
  getTodayTasks,
  type Project,
} from '@/lib/project-planner';
import { toDateKey } from '@/lib/unified-scheduler';
import { ProjectProgressRing } from './ProjectProgressRing';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const todayKey = toDateKey(new Date());
  const progress = getProjectProgress(project);
  const daysLeft = getDaysRemaining(project, todayKey);
  const todayTasks = getTodayTasks(project, todayKey);
  const nextTask = getNextTask(project, todayKey);

  const isComplete = progress >= 100;
  const isPastDue = daysLeft === 0 && !isComplete;

  return (
    <motion.button
      onClick={onSelect}
      className="w-full text-left group"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl p-4
          bg-[var(--color-bg-surface)]
          border border-[var(--color-border-subtle)]
          transition-all duration-300
          ${isComplete ? 'border-[var(--secondary)]/30' : ''}
          ${isPastDue ? 'border-amber-500/30' : ''}
          group-hover:border-[var(--color-border-subtle)]
          group-hover:shadow-lg
        `}
        style={{
          boxShadow: isComplete
            ? '0 0 20px rgba(120, 191, 165, 0.15)'
            : undefined,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Emoji */}
            <span className="text-2xl flex-shrink-0">{project.emoji || '📋'}</span>

            {/* Name & Date Range */}
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] truncate">
                {project.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDateRange(project.startDate, project.endDate)}
              </p>
            </div>
          </div>

          {/* Progress Ring */}
          <ProjectProgressRing
            progress={progress}
            size={52}
            strokeWidth={5}
            showLabel
          />
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 rounded-full bg-[var(--color-progress-track)] mb-3 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: isComplete
                ? 'var(--secondary)'
                : 'linear-gradient(90deg, var(--primary), var(--accent))',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-3">
          <span
            className={`
              ${isPastDue ? 'text-amber-400' : ''}
              ${isComplete ? 'text-[var(--secondary)]' : ''}
            `}
          >
            {isComplete
              ? 'Completed!'
              : daysLeft === 1
                ? '1 day left'
                : daysLeft === 0
                  ? 'Due today'
                  : `${daysLeft} days left`}
          </span>

          {todayTasks.length > 0 && !isComplete && (
            <span className="text-[var(--primary)]">
              {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''} today
            </span>
          )}
        </div>

        {/* Next Task Preview */}
        {nextTask && !isComplete && (
          <div
            className={`
              flex items-center gap-2 p-2.5 rounded-xl
              bg-[var(--color-bg-elevated)]/50 border border-[var(--color-border-subtle)]/50
              text-sm text-[var(--text-primary)]
            `}
          >
            <div className="flex-1 min-w-0">
              <p className="truncate">{nextTask.text}</p>
              {nextTask.estimatedMinutes && (
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {formatDuration(nextTask.estimatedMinutes)}
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
          </div>
        )}

        {/* Completion celebration */}
        {isComplete && (
          <div className="text-center py-2">
            <span className="text-[var(--secondary)] text-sm font-medium">
              All tasks complete
            </span>
          </div>
        )}

        {/* Subtle gradient overlay on hover */}
        <div
          className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-br from-[var(--primary)]/5 to-transparent
            pointer-events-none transition-opacity duration-300
          "
        />
      </div>
    </motion.button>
  );
}

// Empty state card for when there are no projects
export function EmptyProjectCard({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.button
      onClick={onCreate}
      className="w-full"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl p-6
          border-2 border-dashed border-[var(--color-border-subtle)]
          hover:border-[var(--primary)]/50
          transition-all duration-300
          flex flex-col items-center justify-center
          min-h-[140px]
        `}
      >
        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-3">
          <span className="text-2xl">+</span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm font-medium">
          Create your first project
        </p>
        <p className="text-[var(--text-muted)] text-xs mt-1">
          Break down big goals into daily tasks
        </p>
      </div>
    </motion.button>
  );
}
