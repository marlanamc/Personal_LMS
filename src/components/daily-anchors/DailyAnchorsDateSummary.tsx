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

  const segments = useMemo(() => {
    if (count === 0) return [];

    const totalGap = count * SEGMENT_GAP;
    const usable = RING_CIRCUMFERENCE - totalGap;
    const segLen = usable / count;

    let offset = -RING_CIRCUMFERENCE * 0.25;

    return anchors.map((anchor, i) => {
      const color = anchorColor(anchor.icon);
      const isDone = anchor.status === 'done';
      const dashArray = `${segLen} ${RING_CIRCUMFERENCE - segLen}`;
      const dashOffset = -offset;
      offset += segLen + SEGMENT_GAP;

      return {
        key: anchor.id || i,
        color,
        isDone,
        dashArray,
        dashOffset,
      };
    });
  }, [anchors, count]);

  if (count === 0) return null;

  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
        {segments.map((seg) => (
          <circle
            key={seg.key}
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke={seg.isDone ? seg.color : 'var(--color-progress-track)'}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
            style={{ transition: 'stroke 400ms ease, stroke-dasharray 400ms ease' }}
          />
        ))}
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
    <div className="rounded-3xl border px-4 sm:px-6 py-4 elevation-2 bg-[#EDE3D7] border-[#D9C8B5] dark:bg-bg-elevated dark:border-border-subtle/50">
      {/* Header with progress bar on mobile */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.18em]">Daily Anchors</h4>
        <span className="text-xs text-text-muted tabular-nums">
          {completedCount} of {filteredAndSortedAnchors.length} done
        </span>
      </div>

      {/* Mobile progress bar */}
      {filteredAndSortedAnchors.length > 0 && (
        <div className="sm:hidden mb-3 h-1.5 rounded-full bg-bg-surface/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-mint transition-all duration-500 ease-out"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      )}

      <div className="flex gap-3 items-start">
        <div className="flex-1 space-y-2 min-w-0">
          {filteredAndSortedAnchors.map((anchor: DailyAnchor) => {
            const Icon = iconForAnchor(anchor.icon);
            const dotColor = anchorColor(anchor.icon);
            return (
              <div key={anchor.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-bg-surface px-3 py-2.5 hover:border-[#8A5A44]/25 dark:hover:border-accent-sakura/35 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${dotColor}20` }}>
                    <Icon size={16} style={{ color: dotColor }} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm text-text font-medium block truncate">
                      {anchor.label}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatTimeLabel(anchor.scheduledTime)}
                    </span>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-semibold uppercase ${anchor.status === 'done' ? 'text-accent-mint' : anchor.status === 'missed' ? 'text-warning' : anchor.status === 'skipped' ? 'text-accent-teal' : 'text-text-muted'}`}>
                  {anchor.status === 'done' ? 'Done' : anchor.status === 'missed' ? 'Missed' : anchor.status === 'skipped' ? 'Skipped' : 'Pending'}
                </span>
              </div>
            );
          })}
          {filteredAndSortedAnchors.length === 0 && (
            <p className="text-sm text-text-muted italic py-2">No anchors scheduled for this day.</p>
          )}
        </div>

        {/* Desktop only: circular progress ring */}
        {filteredAndSortedAnchors.length > 0 && (
          <div className="hidden sm:block">
            <AnchorProgressRing anchors={filteredAndSortedAnchors} />
          </div>
        )}
      </div>
    </div>
  );
}
