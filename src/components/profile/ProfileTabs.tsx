'use client';

import React, { useState } from 'react';
import { BookOpen, Target } from 'lucide-react';

interface ProfileTabsProps {
  learningContent: React.ReactNode;
  planningContent: React.ReactNode;
}

type TabId = 'learning' | 'planning';

export function ProfileTabs({ learningContent, planningContent }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('learning');

  const tabs = [
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'planning', label: 'Planning', icon: Target },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center sm:justify-start">
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
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'learning' ? learningContent : planningContent}
      </div>
    </div>
  );
}
