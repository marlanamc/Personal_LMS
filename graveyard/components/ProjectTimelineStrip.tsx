'use client';

import { useMemo } from 'react';
import {
  getDateKeysBetween,
  getTasksForDate,
  type Project,
} from '@/lib/project-planner';
import { toDateKey } from '@/lib/unified-scheduler';

// Compact progress summary for the project
interface ProjectTimelineSummaryProps {
  project: Project;
}

export function ProjectTimelineSummary({ project }: ProjectTimelineSummaryProps) {
  const todayKey = toDateKey(new Date());

  const { completedDays, totalDays, streak } = useMemo(() => {
    const allDays = getDateKeysBetween(project.startDate, project.endDate);
    let completed = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    for (const date of allDays) {
      if (date > todayKey) break;

      const tasks = getTasksForDate(project, date);
      if (tasks.length === 0) continue;

      const allDone = tasks.every(
        (t) => t.status === 'completed' || t.status === 'skipped',
      );

      if (allDone) {
        completed++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      completedDays: completed,
      totalDays: allDays.filter((d) => d <= todayKey && getTasksForDate(project, d).length > 0)
        .length,
      streak: currentStreak,
    };
  }, [project, todayKey]);

  if (totalDays === 0) return null;

  return (
    <div className="flex items-center gap-4 text-xs">
      <span className="text-[var(--text-secondary)]">
        <span className="text-[var(--secondary)] font-semibold">{completedDays}</span>
        <span className="text-[var(--text-muted)]">/{totalDays} days complete</span>
      </span>
      {streak > 1 && (
        <span className="text-[var(--accent)]">
          {streak} day streak
        </span>
      )}
    </div>
  );
}
