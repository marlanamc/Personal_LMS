'use client';

import { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { getTodayKey } from '@/lib/unified-scheduler';

interface ThoughtDownloadViewProps {
  storageScope: string;
}

export function ThoughtDownloadView({ storageScope }: ThoughtDownloadViewProps) {
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const { getPlan, updatePlan, isLoaded, isSaving, saveError } = useCalendarPlanner(storageScope);

  const plan = getPlan(selectedDateKey);
  const thoughtDownload = plan.thoughtDownload ?? '';
  const [draft, setDraft] = useState(thoughtDownload);

  // Sync draft from plan when date or loaded plan changes
  useEffect(() => {
    setDraft(thoughtDownload);
  }, [selectedDateKey, thoughtDownload]);

  const handleChange = (value: string) => {
    setDraft(value);
    updatePlan(selectedDateKey, { ...plan, thoughtDownload: value });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-sakura/10 border border-border-subtle flex items-center justify-center">
            <Moon className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <h1 className="text-2xl font-display font-bold text-text">Thought download</h1>
        </div>
        <p className="text-text-muted text-sm leading-relaxed">
          Offload what&apos;s on your mind — not for scheduling tomorrow, just to clear your head.
        </p>
      </header>

      <div className="space-y-4">
        <div>
          <label htmlFor="thought-download-date" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Date
          </label>
          <input
            id="thought-download-date"
            type="date"
            value={selectedDateKey}
            onChange={(e) => setSelectedDateKey(e.target.value || todayKey)}
            className="w-full max-w-[12rem] rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="thought-download-textarea" className="sr-only">
            Thoughts
          </label>
          <textarea
            id="thought-download-textarea"
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Whatever’s on your mind…"
            rows={12}
            disabled={!isLoaded}
            className="w-full rounded-2xl border border-border-subtle bg-bg-surface px-4 py-4 text-sm text-text placeholder:text-text-muted/70 resize-y min-h-[240px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            aria-describedby="thought-download-status"
          />
          <p id="thought-download-status" className="mt-2 min-h-[1.25rem] text-xs text-text-muted">
            {saveError && <span className="text-error">{saveError}</span>}
            {!saveError && isSaving && 'Saving…'}
            {!saveError && !isSaving && isLoaded && 'Saves automatically'}
            {!isLoaded && 'Loading…'}
          </p>
        </div>
      </div>
    </div>
  );
}
