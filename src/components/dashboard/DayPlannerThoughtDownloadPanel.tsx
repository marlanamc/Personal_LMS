'use client';

import Link from 'next/link';
import { Moon } from 'lucide-react';

interface DayPlannerThoughtDownloadPanelProps {
  dateKey: string;
  value: string;
  isLoaded: boolean;
  saveError: string | null;
  onChange: (value: string) => void;
}

export function DayPlannerThoughtDownloadPanel({
  dateKey,
  value,
  isLoaded,
  saveError,
  onChange,
}: DayPlannerThoughtDownloadPanelProps) {
  return (
    <section
      className="flex min-h-[36rem] flex-col rounded-2xl border border-border-subtle/50 bg-bg-elevated/80 p-4 shadow-sm backdrop-blur-sm lg:min-h-[38rem]"
      aria-label="Thought Download panel"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-sakura/20 bg-accent-sakura/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          <Moon className="h-3.5 w-3.5" />
          Thought Download
        </div>
        <Link
          href={`/dashboard/thought-download?date=${encodeURIComponent(dateKey)}`}
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-accent-sakura/10"
        >
          Full view
        </Link>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[24rem] flex-1 w-full rounded-2xl border border-border-subtle/50 bg-bg-surface/80 px-4 py-3 text-sm leading-6 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 lg:min-h-[28rem]"
        disabled={!isLoaded}
      />

      {saveError ? (
        <p className="mt-3 text-[11px] font-medium text-error">{saveError}</p>
      ) : null}
    </section>
  );
}
