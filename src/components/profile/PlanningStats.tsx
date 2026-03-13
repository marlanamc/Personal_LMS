'use client';

import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export interface WeeklyPlanningData {
  days: {
    dateKey: string;
    label: string;
    completed: number;
    total: number;
    percent: number;
  }[];
  weeklyAverage: number;
  topSkipReasons: {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Progress Overview */}
        <div className="md:col-span-2 rounded-3xl p-6 bg-bg-secondary border border-border/40 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text">Weekly Anchor Progress</h3>
              <p className="text-sm text-text-muted">Completion rate over the last 7 days</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-primary">{data.weeklyAverage}%</div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Weekly avg</div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2 h-48 pt-4">
            {data.days.map((day) => (
              <div key={day.dateKey} className="flex-1 flex flex-col items-center gap-3 h-full group">
                <div className="relative flex-1 w-full flex items-end justify-center">
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {day.completed}/{day.total} done
                  </div>
                  
                  {/* Bar Background */}
                  <div className="absolute inset-0 w-2 md:w-3 mx-auto bg-bg-elevated rounded-full" />
                  
                  {/* Bar Fill */}
                  <div 
                    className={`relative w-2 md:w-3 bg-gradient-to-t from-primary to-primary-light rounded-full transition-all duration-700 ease-out`}
                    style={{ height: `${Math.max(day.percent, 8)}%` }} // Min height for visibility
                  >
                    {day.percent >= 90 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-mint rounded-full border-2 border-white" />
                    )}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase">{day.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insight Card */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
          <TrendingUp className="absolute -top-4 -right-4 w-32 h-32 text-white/10 -rotate-12" />
          
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold mb-2">Keep it up!</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Your planning streak is building. Consistency with anchors is the secret to sustainable learning.
            </p>
          </div>

          <div className="relative pt-6">
            <button className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors w-full justify-center">
              View Calendar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Skip Reasons & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="text-sm font-bold text-text capitalize">
                      {insight.label}
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

        {/* Suggestion / Tip Card */}
        <div className="rounded-3xl p-6 bg-bg-tertiary border border-border/40 shadow-sm space-y-4 flex flex-col justify-center">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-teal/10 text-accent-teal rounded-full text-[10px] font-black uppercase tracking-wider">
                Planning Tip
              </div>
              <h4 className="text-lg font-bold text-text">Focus on "Blocks"</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                If you find yourself skipping a specific anchor often, try shrinking it to a 5-minute version. The hardest part is often just starting.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
