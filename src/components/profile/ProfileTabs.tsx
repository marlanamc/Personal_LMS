'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { PlanningWeekProvider, usePlanningWeek } from '@/context/PlanningWeekContext';

interface ProfileTabsProps {
  learningContent: React.ReactNode;
  planningContent: React.ReactNode;
}

type TabId = 'learning' | 'planning';

function WeekToggle() {
  const { setWeekOffset, weekLabel } = usePlanningWeek();
  return (
    <div className="flex items-center gap-1 bg-bg-secondary/50 backdrop-blur-md border border-border/40 rounded-xl px-2 py-1.5 shadow-inner">
      <button
        type="button"
        onClick={() => setWeekOffset((o) => o - 1)}
        className="p-1.5 rounded-lg hover:bg-bg-elevated/80 text-text-muted hover:text-text transition-colors"
        aria-label="Previous week"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium text-text min-w-[88px] text-center">{weekLabel}</span>
      <button
        type="button"
        onClick={() => setWeekOffset((o) => o + 1)}
        className="p-1.5 rounded-lg hover:bg-bg-elevated/80 text-text-muted hover:text-text transition-colors"
        aria-label="Next week"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ProfileTabs({ learningContent, planningContent }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('planning');

  const tabs = [
    { id: 'planning', label: 'Planning', icon: Target },
    { id: 'learning', label: 'Learning', icon: BookOpen },
  ] as const;

  const tabButtons = (
    <div className="inline-flex p-1 bg-bg-secondary/50 backdrop-blur-md border border-border/40 rounded-2xl shadow-inner">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${isActive
                ? 'bg-white text-primary shadow-lg scale-[1.02]'
                : 'text-text-muted hover:text-text hover:bg-white/30'
              }
            `}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      {activeTab === 'planning' ? (
        <PlanningWeekProvider>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-center sm:justify-start">{tabButtons}</div>
            <WeekToggle />
          </div>
          <div className="animate-fade-in">{planningContent}</div>
        </PlanningWeekProvider>
      ) : (
        <>
          <div className="flex items-center justify-center sm:justify-start">{tabButtons}</div>
          <div className="animate-fade-in">{learningContent}</div>
        </>
      )}
    </div>
  );
}
