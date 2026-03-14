'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { SleepRhythmChart } from './SleepRhythmChart';
import { WeeklyAnchorProgress } from './WeeklyAnchorProgress';

export type AnchorStatesMap = Record<string, {
  date: string;
  anchors: Array<{ id: string; label?: string; status: string; scheduledTime?: string }>;
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
}

export function PlanningStats({ data }: PlanningStatsProps) {
  return (
    <div className="space-y-6">
      <SleepRhythmChart anchorStates={data.anchorStates} />
      <div className="grid grid-cols-1 gap-6">
        <WeeklyAnchorProgress anchorStates={data.anchorStates} />

      </div>

      {/* Skip Reasons & Insights */}
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-3xl p-6 bg-bg-secondary border border-border/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-bold text-text">Skip Insights</h3>
          </div>
          
          {data.topSkipReasons.length > 0 ? (
            <div className="space-y-4">
              {data.topSkipReasons.map((insight, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-bg-elevated/50 border border-border/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-text">
                      <span className="text-primary">{insight.anchorLabel}</span>
                      <span className="text-text-muted font-medium"> · {insight.label}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-bg-secondary text-[10px] font-black text-primary border border-border/20 shadow-sm">
                      {insight.count} {insight.count === 1 ? 'TIME' : 'TIMES'}
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Info className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed italic">
                      " {insight.suggestion} "
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-accent-mint mx-auto mb-2" />
              <p className="text-sm font-medium text-text">No skips recently!</p>
              <p className="text-xs text-text-muted">You're crushing your daily anchors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
