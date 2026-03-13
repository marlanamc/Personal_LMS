'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowRight, Moon, Sparkles } from 'lucide-react';

const ThoughtDownloadEditor = dynamic(
  () => import('./ThoughtDownloadEditor'),
  { ssr: false, loading: () => <div className="p-4 text-text-muted text-sm">Loading editor...</div> }
);
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { getNextDateKey, getPreviousDateKey, getTodayKey, isToday } from '@/lib/unified-scheduler';

interface ThoughtDownloadViewProps {
  storageScope: string;
}

export function ThoughtDownloadView({ storageScope }: ThoughtDownloadViewProps) {
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const { getPlan, updatePlanField, isLoaded, isSaving, saveError } = useCalendarPlanner(storageScope);

  const plan = getPlan(selectedDateKey);
  const thoughtDownload = plan.thoughtDownload ?? '';
  const [draft, setDraft] = useState(thoughtDownload);
  const selectedDate = useMemo(
    () => new Date(`${selectedDateKey}T12:00:00`),
    [selectedDateKey],
  );
  const isSelectedToday = isToday(selectedDateKey);

  // Sync draft from plan when date or loaded plan changes
  useEffect(() => {
    setDraft(thoughtDownload);
  }, [selectedDateKey, thoughtDownload]);

  const handleChange = (value: string) => {
    setDraft(value);
    updatePlanField(selectedDateKey, 'thoughtDownload', value);
  };


  const goToPreviousDay = () => setSelectedDateKey(getPreviousDateKey(selectedDateKey));
  const goToNextDay = () => setSelectedDateKey(getNextDateKey(selectedDateKey));

  return (
    <div className="mx-auto max-w-4xl flex flex-col min-h-[70vh]">
      {/* Compact header + controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <header className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-accent-sakura/10 border border-border-subtle flex items-center justify-center">
            <Moon className="w-4 h-4 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-display font-bold text-text">Thought download</h1>
          </div>
        </header>

        {/* Date + Formatting in one compact row */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 px-1 py-0.5 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={goToPreviousDay}
              className="rounded-full p-1.5 transition-colors hover:bg-bg-elevated"
              aria-label="Previous day"
            >
              <ArrowLeft size={14} />
            </button>
            <label className="cursor-pointer rounded-full px-2 py-0.5 text-center hover:bg-bg-elevated/60">
              <span className="sr-only">Choose date</span>
              <span
                id="thought-download-date"
                className="pointer-events-none inline-flex items-center gap-1 text-xs font-medium text-text"
              >
                {selectedDate.toLocaleDateString(undefined)}
                {isSelectedToday && <Sparkles size={10} className="text-accent-teal" />}
              </span>
              <input
                type="date"
                value={selectedDateKey}
                onChange={(event) => setSelectedDateKey(event.target.value || todayKey)}
                className="sr-only"
                aria-label="Choose date"
              />
            </label>
            <button
              type="button"
              onClick={goToNextDay}
              className="rounded-full p-1.5 transition-colors hover:bg-bg-elevated"
              aria-label="Next day"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content — textarea gets the focus */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col w-full relative h-full">
          <div className="flex-1 rounded-2xl border border-border-subtle bg-bg-surface/50 shadow-sm overflow-hidden flex flex-col group focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
            <ThoughtDownloadEditor
              markdown={draft}
              onChange={handleChange}
              disabled={!isLoaded}
            />
          </div>
        </div>
          <p id="thought-download-status" className="mt-2 min-h-[1.25rem] text-xs text-text-muted">
            {saveError && <span className="text-error">{saveError}</span>}
            {!saveError && isSaving && 'Saving…'}
            {!saveError && !isSaving && isLoaded && 'Saves automatically'}
            {!isLoaded && 'Loading…'}
          </p>
      </div>
    </div>
  );
}
