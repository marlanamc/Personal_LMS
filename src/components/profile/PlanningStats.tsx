'use client';

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { SleepRhythmChart } from './SleepRhythmChart';
import { WeeklyAnchorProgress } from './WeeklyAnchorProgress';
import { WeekSummary, type WeekSummaryData } from './WeekSummary';

export type AnchorStatesMap = Record<string, {
  date: string;
  anchors: Array<{ id: string; label?: string; icon?: string; status: string; scheduledTime?: string }>;
  sleepRhythmDayComplete: boolean;
}>;

export interface WeeklyPlanningData {
  anchorStates: AnchorStatesMap;
  days: {
    dateKey: string;
    label: string;
    completed: number;
    total: number;
    percent: number;
    wakeTime?: string;
    bedTime?: string;
    wakeMinutes?: number;
    bedMinutes?: number;
  }[];
  weeklyAverage: number;
  topSkipReasons: {
    anchorId: string;
    anchorLabel: string;
    reason: string;
    count: number;
    label: string;
    suggestion: string;
  }[];
}

interface PlanningStatsProps {
  data: WeeklyPlanningData;
  weekSummary?: WeekSummaryData | null;
}

export function PlanningStats({ data, weekSummary }: PlanningStatsProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: This Week - full width */}
      {weekSummary && (
        <WeekSummary data={weekSummary} />
      )}

      {/* Row 2: Wake & Bed Times + Weekly Anchor Progress side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SleepRhythmChart anchorStates={data.anchorStates} />
        <WeeklyAnchorProgress anchorStates={data.anchorStates} />
      </div>

      {/* Row 3: Skip Insights - full width */}
      <div className="rounded-2xl p-4 sm:p-5 bg-bg-secondary border border-border/40 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-warning shrink-0" />
            <h3 className="text-base font-bold text-text">Skip Insights</h3>
          </div>
          {data.topSkipReasons.length > 0 ? (
            <div className="space-y-3">
              {data.topSkipReasons.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-bg-elevated/50 border border-border/20">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text">
                      <span className="text-primary">{insight.anchorLabel}</span>
                      <span className="text-text-muted font-medium"> · {insight.label}</span>
                    </span>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-bg-secondary text-[10px] font-black text-primary border border-border/20">
                      {insight.count}×
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed italic mt-1.5 pl-0">
                    {insight.suggestion}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-accent-mint mx-auto" />
              <p className="text-sm font-medium text-text">No skips recently!</p>
              <p className="text-xs text-text-muted">You're crushing your daily anchors.</p>
            </div>
          )}
      </div>

      {/* Row 4: Placeholder row for future content */}
      <div className="min-h-[80px]" aria-hidden />
    </div>
  );
}
