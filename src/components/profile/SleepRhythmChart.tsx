'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AnchorStatesMap } from './PlanningStats';

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse HH:MM scheduled time to display string (e.g. "8:00 AM") */
function parseScheduledTimeToDisplay(scheduledTime: string | undefined): string | undefined {
  if (!scheduledTime) return undefined;
  const match = scheduledTime.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return undefined;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return undefined;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

/** Parse HH:MM to minutes from midnight */
function parseScheduledTimeToMinutes(scheduledTime: string | undefined): number | undefined {
  if (!scheduledTime) return undefined;
  const match = scheduledTime.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return undefined;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return undefined;
  return h * 60 + m;
}

function minutesTo12Hour(min: number): string {
  if (min >= 24 * 60) return '12 AM';
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  if (m === 0) return `${hour12} ${period}`;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

interface SleepRhythmChartProps {
  anchorStates: AnchorStatesMap;
}

export function SleepRhythmChart({ anchorStates }: SleepRhythmChartProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const { chartData, weekLabel, hasAnyData } = useMemo(() => {
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const days: Array<{
      dateKey: string;
      label: string;
      wakeTime?: string;
      bedTime?: string;
      wakeMinutes: number | null;
      bedMinutes: number | null;
    }> = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateKey = toDateKey(d);
      const state = anchorStates[dateKey];
      const anchors = state?.anchors || [];

      const wake = anchors.find((a) => a.id === 'wake');
      const lightsOut = anchors.find((a) => a.id === 'lightsOut');
      const wakeTime = wake?.status === 'done' ? parseScheduledTimeToDisplay(wake.scheduledTime) : undefined;
      const bedTime = lightsOut?.status === 'done' ? parseScheduledTimeToDisplay(lightsOut.scheduledTime) : undefined;
      const wakeMinutes = wake?.status === 'done' ? parseScheduledTimeToMinutes(wake.scheduledTime) ?? null : null;
      const bedMinutes = lightsOut?.status === 'done' ? parseScheduledTimeToMinutes(lightsOut.scheduledTime) ?? null : null;

      const month = d.getMonth() + 1;
      const dayNum = d.getDate();
      const shortDate = `${month}/${dayNum}`;

      days.push({
        dateKey,
        label: `${dayLabels[d.getDay()]} ${shortDate}`,
        wakeTime,
        bedTime,
        wakeMinutes,
        bedMinutes,
      });
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

    const hasData = days.some((d) => d.wakeMinutes != null || d.bedMinutes != null);

    return { chartData: days, weekLabel, hasAnyData: hasData };
  }, [anchorStates, weekOffset]);

  if (!hasAnyData) {
    return (
      <div className="rounded-3xl p-6 bg-bg-secondary border border-border/40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center">
              <span className="text-lg" aria-hidden>🌙</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">Wake & Bed Times</h3>
              <p className="text-sm text-text-muted">Log wake and bedtime in daily anchors to see your rhythm</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o - 1)}
              className="p-2 rounded-lg hover:bg-bg-elevated/80 text-text-muted hover:text-text transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-text-muted min-w-[80px] text-center">{weekLabel}</span>
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o + 1)}
              className="p-2 rounded-lg hover:bg-bg-elevated/80 text-text-muted hover:text-text transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center rounded-xl bg-bg-elevated/50 border border-dashed border-border/40">
          <p className="text-sm text-text-muted">No sleep data for this week</p>
        </div>
      </div>
    );
  }

  const yMin = 0;
  const yMax = 24 * 60;
  const yTicks = [0, 6 * 60, 12 * 60, 18 * 60, 24 * 60];

  return (
    <div className="rounded-3xl p-6 bg-bg-secondary border border-border/40 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center">
            <span className="text-lg" aria-hidden>🌙</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">Wake & Bed Times</h3>
            <p className="text-sm text-text-muted">From daily anchors</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-2 rounded-lg hover:bg-bg-elevated/80 text-text-muted hover:text-text transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-text-muted min-w-[90px] text-center">{weekLabel}</span>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-2 rounded-lg hover:bg-bg-elevated/80 text-text-muted hover:text-text transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              interval={0}
            />
            <YAxis
              domain={[yMin, yMax]}
              ticks={yTicks}
              tickFormatter={(v) => minutesTo12Hour(v)}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length || !label) return null;
                const d = payload[0]?.payload as (typeof chartData)[0];
                return (
                  <div className="bg-bg-elevated border border-border/60 rounded-lg px-3 py-2 shadow-lg text-sm">
                    <p className="font-semibold text-text mb-1">{label}</p>
                    {d.wakeTime && (
                      <p className="text-accent-teal">Wake: {d.wakeTime}</p>
                    )}
                    {d.bedTime && (
                      <p className="text-primary">Bed: {d.bedTime}</p>
                    )}
                    {!d.wakeTime && !d.bedTime && (
                      <p className="text-text-muted">No data</p>
                    )}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => (value === 'wake' ? 'Wake' : 'Bed')}
            />
            <Line
              type="monotone"
              dataKey="wakeMinutes"
              name="wake"
              stroke="var(--color-accent-teal)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-accent-teal)', strokeWidth: 0, r: 4 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="bedMinutes"
              name="bed"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 0, r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
