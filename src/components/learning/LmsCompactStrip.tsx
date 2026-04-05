'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  LayoutList,
  Sparkles,
  Target,
} from 'lucide-react';
import type { ChecklistItem } from '@/types/checklist-item';

interface LmsCompactStripProps {
  assignments: ChecklistItem[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const LMS_LINKS = [
  {
    href: '/dashboard/subjects',
    title: 'Subjects',
    icon: LayoutList,
  },
  {
    href: '/dashboard/classes',
    title: 'Classes',
    icon: CalendarDays,
  },
  {
    href: '/dashboard/calendar',
    title: 'Calendar',
    icon: Target,
  },
] as const;

function formatClock(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getAssignmentHref(item: ChecklistItem): string {
  return `/activity/${item.activityId}?assignment=${item.id}`;
}

export function LmsCompactStrip({
  assignments,
  isExpanded,
  onToggleExpanded,
}: LmsCompactStripProps) {
  const featuredCount = assignments.length;

  // Sort by due date
  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => {
      const aDue = a.dueDate
        ? new Date(a.dueDate).getTime()
        : Number.POSITIVE_INFINITY;
      const bDue = b.dueDate
        ? new Date(b.dueDate).getTime()
        : Number.POSITIVE_INFINITY;
      return aDue - bDue;
    });
  }, [assignments]);

  // Top subjects
  const topSubjects = useMemo(() => {
    const counts = new Map<string, number>();
    for (const assignment of assignments) {
      const key = assignment.activity.category?.trim() || 'General';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [assignments]);

  if (featuredCount === 0) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-border-subtle/45 bg-bg-surface/50 backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Collapsed header */}
      <button
        type="button"
        onClick={onToggleExpanded}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-text">
              {featuredCount} study item{featuredCount !== 1 ? 's' : ''} available
            </p>
            {topSubjects.length > 0 && (
              <p className="text-xs text-text-muted mt-0.5">
                {topSubjects.map(([label]) => label).join(', ')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border-subtle/30">
          {/* Featured assignments */}
          <div className="pt-3 space-y-2">
            {sortedAssignments.slice(0, 4).map((assignment) => (
              <Link
                key={assignment.id}
                href={getAssignmentHref(assignment)}
                className="flex items-center gap-3 rounded-xl border border-border-subtle/35 bg-bg-elevated/40 px-3 py-2.5 transition-colors hover:bg-bg-elevated/60"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent-sakura/12 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">
                    {assignment.title || assignment.activity.title || 'Assignment'}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {assignment.activity.category || 'General'}
                    {assignment.dueDate && (
                      <> • Due {formatClock(new Date(assignment.dueDate))}</>
                    )}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted flex-shrink-0" />
              </Link>
            ))}
          </div>

          {/* Quick nav links */}
          <div className="flex gap-2">
            {LMS_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border-subtle/35 bg-bg-elevated/30 px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-bg-elevated/50 hover:text-text"
                >
                  <Icon className="h-4 w-4" />
                  {link.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
