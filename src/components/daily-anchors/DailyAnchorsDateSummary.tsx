'use client';

import { BriefcaseBusiness, Dumbbell, Moon } from 'lucide-react';
import { useMemo } from 'react';
import { formatTimeLabel, type AnchorIcon, type DailyAnchor } from '@/lib/anchors';
import { useDailyAnchors } from './useDailyAnchors';

interface DailyAnchorsDateSummaryProps {
  storageScope: string;
  date: Date;
}

function iconForAnchor(icon: AnchorIcon) {
  if (icon === 'dumbbell') return Dumbbell;
  if (icon === 'briefcase') return BriefcaseBusiness;
  return Moon;
}

export function DailyAnchorsDateSummary({ storageScope, date }: DailyAnchorsDateSummaryProps) {
  const { getStateForDate } = useDailyAnchors(storageScope);

  const stateForDate = useMemo(() => getStateForDate(date), [date, getStateForDate]);
  const completedCount = stateForDate.anchors.filter((anchor) => anchor.status === 'done').length;

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-elevated p-3.5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="text-sm font-semibold text-text">Daily Anchors</h4>
        <span className="text-xs text-text-muted">{completedCount}/{stateForDate.anchors.length}</span>
      </div>

      <div className="space-y-2">
        {stateForDate.anchors.map((anchor: DailyAnchor) => {
          const Icon = iconForAnchor(anchor.icon);
          return (
            <div key={anchor.id} className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-surface px-2.5 py-2">
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-text-muted" />
                <span className="text-xs text-text">
                  {formatTimeLabel(anchor.scheduledTime)} {anchor.label}
                </span>
              </div>
              <span className={`text-[11px] font-semibold ${anchor.status === 'done' ? 'text-secondary' : anchor.status === 'missed' ? 'text-warning' : 'text-text-muted'}`}>
                {anchor.status === 'done' ? 'Done' : anchor.status === 'missed' ? 'Missed' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
