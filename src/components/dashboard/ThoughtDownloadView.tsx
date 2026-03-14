'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowRight, Moon, Sparkles, Check, Cloud } from 'lucide-react';

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
  const { getPlan, updatePlanField, isLoaded, isSaving, saveError, lastSyncedAt } = useCalendarPlanner(storageScope);

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
          <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-sakura/10 border border-accent-sakura/20 flex items-center justify-center shadow-[0_4px_12px_rgba(212,138,166,0.1)] group-hover:shadow-[0_4px_20px_rgba(212,138,166,0.2)] transition-all duration-500">
            <Moon className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-display font-bold text-text tracking-tight">Thought download</h1>
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

      {/* Main content - Premium Seamless Container */}
      <div className="flex-1 flex flex-col min-h-0">
        <div 
          className="flex-1 rounded-[2rem] border border-border-subtle bg-bg-surface/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm overflow-hidden flex flex-col group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all duration-500 ease-out hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]"
          style={{
            background: "linear-gradient(165deg, color-mix(in srgb, var(--color-bg-surface) 40%, transparent) 0%, color-mix(in srgb, var(--color-bg-elevated) 20%, transparent) 100%)",
          }}
        >
          <div className="flex-1 flex flex-col">
            <ThoughtDownloadEditor
              markdown={draft}
              onChange={handleChange}
              disabled={!isLoaded}
            />
          </div>
        </div>
        <div id="thought-download-status" className="mt-2 min-h-[1.25rem] text-[10px] font-medium text-text-muted flex items-center gap-1.5 px-1">
          {saveError ? (
            <span className="text-error">{saveError}</span>
          ) : isSaving ? (
            <>
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span>Saving to cloud…</span>
            </>
          ) : isLoaded ? (
            <>
              <Check className="w-3 h-3 text-accent-teal" />
              <span>
                Synced to cloud
                {lastSyncedAt && ` • ${lastSyncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
              </span>
            </>
          ) : (
            <>
              <Cloud className="w-3 h-3 animate-pulse" />
              <span>Connecting…</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
