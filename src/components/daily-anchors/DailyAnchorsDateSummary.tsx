'use client';

import { BookOpen, BriefcaseBusiness, Calendar, Code2, Coffee, Dumbbell, Flower2, Heart, Moon, Sunrise, Target } from 'lucide-react';
import { useMemo } from 'react';
import { formatTimeLabel, isAnchorScheduledForDate, parseHHMMToMinutes, type AnchorIcon, type DailyAnchor } from '@/lib/anchors';
import { useDailyAnchors } from './useDailyAnchors';

interface DailyAnchorsDateSummaryProps {
  storageScope: string;
  date: Date;
}

function iconForAnchor(icon: AnchorIcon) {
  if (icon === 'dumbbell') return Dumbbell;
  if (icon === 'briefcase') return BriefcaseBusiness;
  if (icon === 'sunrise') return Sunrise;
  if (icon === 'flower-2') return Flower2;
  if (icon === 'book-open') return BookOpen;
  if (icon === 'code') return Code2;
  if (icon === 'heart') return Heart;
  if (icon === 'coffee') return Coffee;
  if (icon === 'target') return Target;
  if (icon === 'calendar') return Calendar;
  return Moon;
}

function anchorColor(icon: AnchorIcon): string {
  if (icon === 'sunrise' || icon === 'coffee') return '#e8a87c';
  if (icon === 'dumbbell') return '#78bfa5';
  if (icon === 'briefcase' || icon === 'code') return '#7baed4';
  if (icon === 'flower-2') return '#6bc4c4';
  if (icon === 'heart') return '#d48aa6';
  if (icon === 'target') return '#a089c7';
  if (icon === 'book-open' || icon === 'calendar') return '#8a8fd8';
  return '#9b8ec2';
}

const RING_RADIUS = 38;
const RING_STROKE = 7;
const RING_SIZE = (RING_RADIUS + RING_STROKE) * 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SEGMENT_GAP = 5;

function AnchorProgressRing({ anchors }: { anchors: DailyAnchor[] }) {
  const count = anchors.length;
  const completed = anchors.filter((a) => a.status === 'done').length;

  if (count === 0) return null;

  const totalGap = count * SEGMENT_GAP;
  const usable = RING_CIRCUMFERENCE - totalGap;
  const segLen = usable / count;

  let offset = -RING_CIRCUMFERENCE * 0.25;

  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
        {anchors.map((anchor, i) => {
          const color = anchorColor(anchor.icon);
          const isDone = anchor.status === 'done';
          const dashArray = `${segLen} ${RING_CIRCUMFERENCE - segLen}`;
          const dashOffset = -offset;
          offset += segLen + SEGMENT_GAP;

          return (
            <circle
              key={anchor.id || i}
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke={isDone ? color : 'var(--color-progress-track)'}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke 400ms ease, stroke-dasharray 400ms ease' }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-text leading-none">{completed}/{count}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted mt-0.5">Done</span>
      </div>
    </div>
  );
}

export function DailyAnchorsDateSummary({ storageScope, date }: DailyAnchorsDateSummaryProps) {
  const { getStateForDate } = useDailyAnchors(storageScope);

  const stateForDate = useMemo(() => getStateForDate(date), [date, getStateForDate]);
  
  const filteredAndSortedAnchors = useMemo(() => {
    return stateForDate.anchors
      .filter((anchor) => isAnchorScheduledForDate(anchor, date))
      .sort((a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime));
  }, [stateForDate.anchors, date]);

  const completedCount = filteredAndSortedAnchors.filter((anchor) => anchor.status === 'done').length;
  const completionPercent = filteredAndSortedAnchors.length > 0
    ? Math.round((completedCount / filteredAndSortedAnchors.length) * 100)
    : 0;

  return (
    <div className="rounded-3xl border px-6 py-4 elevation-2 bg-[#EDE3D7] border-[#D9C8B5] dark:bg-bg-elevated dark:border-border-subtle/50">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.18em]">Daily Anchors</h4>
        <span className="text-xs text-text-muted">
          {completedCount} of {filteredAndSortedAnchors.length} done • {completionPercent}%
        </span>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex-1 space-y-2 min-w-0">
          {filteredAndSortedAnchors.map((anchor: DailyAnchor) => {
            const Icon = iconForAnchor(anchor.icon);
            const dotColor = anchorColor(anchor.icon);
            return (
              <div key={anchor.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-bg-surface px-3 py-2 hover:border-[#8A5A44]/25 dark:hover:border-accent-sakura/35 transition-colors">
                <div className="flex items-center gap-2">
                  <Icon size={14} style={{ color: dotColor }} />
                  <span className="text-sm text-text font-medium">
                    {formatTimeLabel(anchor.scheduledTime)} {anchor.label}
                  </span>
                </div>
                <span className={`text-xs font-medium ${anchor.status === 'done' ? 'text-accent-mint' : anchor.status === 'missed' ? 'text-warning' : 'text-text-muted'}`}>
                  {anchor.status === 'done' ? 'DONE' : anchor.status === 'missed' ? 'MISSED' : 'PENDING'}
                </span>
              </div>
            );
          })}
          {filteredAndSortedAnchors.length === 0 && (
            <p className="text-sm text-text-muted italic py-2">No anchors scheduled for this day.</p>
          )}
        </div>

        {filteredAndSortedAnchors.length > 0 && (
          <AnchorProgressRing anchors={filteredAndSortedAnchors} />
        )}
      </div>
    </div>
  );
}
