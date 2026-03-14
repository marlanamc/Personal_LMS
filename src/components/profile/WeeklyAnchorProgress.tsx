'use client';

import React, { useMemo } from 'react';
import type { AnchorStatesMap } from './PlanningStats';
import { usePlanningWeek } from '@/context/PlanningWeekContext';

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface WeeklyAnchorProgressProps {
  anchorStates: AnchorStatesMap;
}

export function WeeklyAnchorProgress({ anchorStates }: WeeklyAnchorProgressProps) {
  const { weekOffset } = usePlanningWeek();

  const { days, weeklyAverage } = useMemo(() => {
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const days: Array<{ dateKey: string; label: string; completed: number; total: number; percent: number }> = [];
    let weeklyTotalCompleted = 0;
    let weeklyTotalAnchors = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateKey = toDateKey(d);
      const state = anchorStates[dateKey];
      const anchors = state?.anchors || [];
      const completed = anchors.filter((a) => a.status === 'done').length;
      const total = anchors.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      const month = d.getMonth() + 1;
      const dayNum = d.getDate();
      const shortDate = `${month}/${dayNum}`;

      days.push({
        dateKey,
        label: `${dayLabels[d.getDay()]} ${shortDate}`,
        completed,
        total,
        percent,
      });

      weeklyTotalCompleted += completed;
      weeklyTotalAnchors += total;
    }

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const weekLabel =
      weekOffset === 0
        ? 'This week'
        : weekOffset === -1
          ? 'Last week'
          : weekOffset === 1
            ? 'Next week'
            : `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()} – ${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;

    const weeklyAverage = weeklyTotalAnchors > 0 ? Math.round((weeklyTotalCompleted / weeklyTotalAnchors) * 100) : 0;

    return { days, weeklyAverage };
  }, [anchorStates, weekOffset]);

  return (
    <div className="rounded-3xl p-6 bg-bg-secondary border border-border/40 shadow-sm h-full flex flex-col min-h-0">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center shrink-0">
          <span className="text-lg" aria-hidden>📋</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Weekly Anchor Progress</h3>
          <p className="text-sm text-text-muted">Completion rate</p>
        </div>
        <div className="text-right ml-auto">
          <div className="text-3xl font-black text-primary">{weeklyAverage}%</div>
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Weekly avg</div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 sm:gap-4 h-80 sm:h-96 min-h-[20rem] flex-1 pt-4">
        {days.map((day) => (
          <div key={day.dateKey} className="flex-1 flex flex-col items-center gap-4 h-full group">
            <div className="relative flex-1 w-full flex items-end justify-center">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-text text-white text-xs px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {day.completed}/{day.total} done
              </div>
              <div className="absolute inset-0 w-3 md:w-4 mx-auto bg-bg-elevated rounded-full" />
              <div
                className="relative w-3 md:w-4 bg-gradient-to-t from-primary to-primary-light rounded-full transition-all duration-700 ease-out"
                style={{ height: `${Math.max(day.percent, 8)}%` }}
              >
                {day.percent >= 90 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-mint rounded-full border-2 border-white" />
                )}
              </div>
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-text-muted uppercase text-center leading-tight truncate max-w-full">
              {day.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
