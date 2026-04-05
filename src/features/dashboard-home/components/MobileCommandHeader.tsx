'use client';

import { useMemo } from 'react';
import type { DailyAnchor } from '@/lib/anchors';

interface MobileCommandHeaderProps {
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

export function MobileCommandHeader({ upNextAnchor, minutesUntilNext }: MobileCommandHeaderProps) {
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
    </section>
  );
}
