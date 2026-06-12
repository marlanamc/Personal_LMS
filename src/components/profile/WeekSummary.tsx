'use client';

import React, { useMemo } from 'react';
import { Calendar, FileText, Trophy } from 'lucide-react';
import { usePlanningWeek } from '@/context/PlanningWeekContext';

export interface WeekEvent {
  id: string;
  dateKey: string;
  title: string;
  type: 'event' | 'assignment' | 'quiz' | 'holiday';
  date: Date;
}

export interface WeekActivity {
  id: string;
  dateKey: string;
  title: string;
  points: number;
  completedAt: Date;
}

export interface WeekSummaryData {
  events: WeekEvent[];
  activities: WeekActivity[];
  dayLabels: string[];
}

interface WeekSummaryProps {
  data: WeekSummaryData;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  event: <Calendar className="w-3.5 h-3.5" />,
  assignment: <FileText className="w-3.5 h-3.5" />,
  quiz: <FileText className="w-3.5 h-3.5" />,
  holiday: <Calendar className="w-3.5 h-3.5" />,
};

export function WeekSummary({ data }: WeekSummaryProps) {
  const { events, activities, dayLabels } = data;
  const { weekOffset } = usePlanningWeek();

  const { days } = useMemo(() => {
    const byDayMap = new Map<string, { events: WeekEvent[]; activities: WeekActivity[] }>();

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      byDayMap.set(key, { events: [], activities: [] });
    }

    events.forEach((e) => {
      const entry = byDayMap.get(e.dateKey);
      if (entry) entry.events.push(e);
    });
    activities.forEach((a) => {
      const entry = byDayMap.get(a.dateKey);
      if (entry) entry.activities.push(a);
    });

    const defaultDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labels = dayLabels.length >= 7 ? dayLabels : defaultDayLabels;

    const daysArray = Array.from(byDayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, items]) => {
        const d = new Date(dateKey + 'T12:00:00');
        const label = labels[d.getDay()] ?? defaultDayLabels[d.getDay()];
        const dayNum = d.getDate();
        const today = new Date();
        const isToday =
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate();

        return { dateKey, label, dayNum, isToday, ...items };
      });

    return { byDay: byDayMap, days: daysArray };
  }, [events, activities, dayLabels, weekOffset]);

  const totalEvents = days.reduce((sum, d) => sum + d.events.length, 0);
  const totalActivities = days.reduce((sum, d) => sum + d.activities.length, 0);
  const isEmpty = totalEvents === 0 && totalActivities === 0;

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-bg-secondary border border-border/40 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-bold text-text">This Week</h3>
          <p className="text-[11px] text-text-muted">Events, assignments & activity</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="py-6 text-center space-y-1">
          <Calendar className="w-8 h-8 text-text-muted/50 mx-auto" />
          <p className="text-xs text-text-muted">Nothing this week yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {days.map(({ dateKey, label, dayNum, isToday, events: dayEvents, activities: dayActivities }) => {
            const hasContent = dayEvents.length > 0 || dayActivities.length > 0;
            return (
              <div
                key={dateKey}
                className={`rounded-xl p-2.5 sm:p-3 border transition-colors min-w-0 ${
                  isToday
                    ? 'bg-primary/5 border-primary/30'
                    : hasContent
                      ? 'bg-bg-elevated/50 border-border/30'
                      : 'bg-bg/30 border-border/20'
                }`}
              >
                <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                  <span className="text-[11px] sm:text-xs font-semibold text-text">{label} {dayNum}</span>
                  {isToday && (
                    <span className="text-[9px] font-bold uppercase tracking-wide text-primary">Today</span>
                  )}
                </div>

                {hasContent ? (
                  <div className="space-y-1 text-[11px] sm:text-xs">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div key={e.id} className="flex items-start gap-1 text-text">
                        <span className="text-primary shrink-0 mt-0.5">{TYPE_ICONS[e.type] ?? <Calendar className="w-3 h-3" />}</span>
                        <span className="min-w-0 break-words">{e.title}</span>
                      </div>
                    ))}
                    {dayActivities.slice(0, 2).map((a) => (
                      <div key={a.id} className="flex items-start gap-1 text-text">
                        <Trophy className="w-3 h-3 text-success shrink-0 mt-0.5" />
                        <span className="min-w-0 break-words">{a.title}</span>
                        <span className="text-[10px] text-success font-medium shrink-0">+{a.points}</span>
                      </div>
                    ))}
                    {(dayEvents.length + dayActivities.length) > 4 && (
                      <p className="text-[10px] text-text-muted">+{dayEvents.length + dayActivities.length - 4} more</p>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-text-muted italic">—</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
