'use client';

import { useMemo } from 'react';
import type { DailyAnchor } from '@/lib/anchors';

interface MobileCommandHeaderProps {
  completedAnchors: number;
  totalAnchors: number;
  completionPercent: number;
  completedOverviewItems: number;
  totalOverviewItems: number;
  activeAnchor: DailyAnchor | null;
  upNextAnchor: DailyAnchor | null;
  minutesUntilNext: number | null;
}

function formatMinutesUntil(minutes: number | null): string {
  if (minutes === null) return '';
  if (minutes <= 0) return 'now';
  if (minutes < 60) return `in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `in ${hours}h ${mins}m` : `in ${hours}h`;
}

export function MobileCommandHeader({
  completedAnchors: _completedAnchors,
  totalAnchors: _totalAnchors,
  activeAnchor: _activeAnchor,
  completionPercent,
  completedOverviewItems,
  totalOverviewItems,
  upNextAnchor,
  minutesUntilNext,
}: MobileCommandHeaderProps) {
  const today = useMemo(() => new Date(), []);

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(today);

  return (
    <section className="md:hidden relative z-[1] pt-1 pb-1 px-1.5">
      <h1 className="text-[2.15rem] leading-none font-display font-bold text-text">{dateLabel}</h1>
      {upNextAnchor ? (
        <p className="mt-2 text-sm text-text-muted">
          Next:{' '}
          <span className="text-accent-mint font-medium">{upNextAnchor.label}</span>{' '}
          {formatMinutesUntil(minutesUntilNext)}
        </p>
      ) : null}
      <div className="mt-2.5">
        <div
          className="h-1 rounded-full bg-bg-surface/70 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionPercent}
          aria-valuetext={
            totalOverviewItems > 0
              ? `${completedOverviewItems} of ${totalOverviewItems} items done (${completionPercent}%)`
              : 'Nothing scheduled today'
          }
          aria-label="Today’s schedule progress"
        >
          <div
            className="h-full rounded-full shadow-[0_0_10px_rgba(214,148,172,0.36)] transition-[width] duration-500 ease-out"
            style={{
              width: `${completionPercent}%`,
              background:
                'linear-gradient(90deg, var(--color-accent-mint) 0%, var(--color-accent-sakura) 52%, var(--color-accent-teal) 100%)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
