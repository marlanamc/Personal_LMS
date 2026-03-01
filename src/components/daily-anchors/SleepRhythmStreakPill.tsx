'use client';

import Link from 'next/link';
import { Moon } from 'lucide-react';
import { useDailyAnchors } from './useDailyAnchors';

interface SleepRhythmStreakPillProps {
  storageScope: string;
}

export function SleepRhythmStreakPill({ storageScope }: SleepRhythmStreakPillProps) {
  const { sleepRhythmStreakDays } = useDailyAnchors(storageScope);

  return (
    <Link
      href="/dashboard/profile"
      className="flex items-center gap-2.5 bg-bg-surface border border-border-subtle rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-8 h-8 bg-accent/15 rounded-full flex items-center justify-center">
        <Moon className="text-accent" size={16} />
      </div>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted leading-none">Sleep Rhythm</div>
        <div className="text-lg font-bold text-text leading-tight">
          {sleepRhythmStreakDays}{' '}
          <span className="text-xs font-semibold text-text-muted">days</span>
        </div>
      </div>
    </Link>
  );
}
