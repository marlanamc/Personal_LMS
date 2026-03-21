'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpenText, ChevronDown, Clock3, PlusCircle, Sparkles, Tag, Trash2 } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { getNextDateKey, getPreviousDateKey, getTodayKey, isToday } from '@/lib/unified-scheduler';

interface InterstitialJournalViewProps {
  storageScope: string;
}

function createTimestampForDate(dateKey: string) {
  const now = new Date();
  const [year, month, day] = dateKey.split('-').map(Number);
  const localDate = new Date(
    year,
    (month ?? 1) - 1,
    day ?? 1,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
  return localDate.toISOString();
}

function formatEntryTime(createdAt: string) {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const TAG_OPTIONS = [
  { value: 'health', label: 'Health' },
  { value: 'work', label: 'Work' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'admin', label: 'Admin' },
  { value: 'home', label: 'Home' },
] as const;

const TAG_STYLES: Record<string, { pill: string; tag: string; glow: string }> = {
  health: {
    pill: 'border-emerald-300/45 bg-emerald-100/80 text-emerald-700',
    tag: 'border-emerald-300/45 bg-emerald-50/90 text-emerald-700',
    glow: 'rgba(52, 211, 153, 0.18)',
  },
  work: {
    pill: 'border-sky-300/45 bg-sky-100/85 text-sky-700',
    tag: 'border-sky-300/45 bg-sky-50/90 text-sky-700',
    glow: 'rgba(56, 189, 248, 0.18)',
  },
  cleaning: {
    pill: 'border-amber-300/45 bg-amber-100/85 text-amber-700',
    tag: 'border-amber-300/45 bg-amber-50/90 text-amber-700',
    glow: 'rgba(251, 191, 36, 0.18)',
  },
  admin: {
    pill: 'border-violet-300/45 bg-violet-100/85 text-violet-700',
    tag: 'border-violet-300/45 bg-violet-50/90 text-violet-700',
    glow: 'rgba(167, 139, 250, 0.18)',
  },
  home: {
    pill: 'border-rose-300/45 bg-rose-100/85 text-rose-700',
    tag: 'border-rose-300/45 bg-rose-50/90 text-rose-700',
    glow: 'rgba(251, 113, 133, 0.18)',
  },
  default: {
    pill: 'border-accent-teal/20 bg-accent-teal/10 text-accent-teal',
    tag: 'border-border-subtle/70 bg-bg-surface/80 text-text-secondary',
    glow: 'rgba(94, 196, 191, 0.14)',
  },
};

export function InterstitialJournalView({ storageScope }: InterstitialJournalViewProps) {
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [entryDraft, setEntryDraft] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { getPlan, updatePlanField, isSaving, saveError } = useCalendarPlanner(storageScope);

  const plan = getPlan(selectedDateKey);
  const entries = plan.interstitialJournalEntries ?? [];
  const selectedDate = useMemo(() => new Date(`${selectedDateKey}T12:00:00`), [selectedDateKey]);
  const isSelectedToday = isToday(selectedDateKey);

  const addEntry = () => {
    const text = entryDraft.trim();
    if (!text) return;

    const nextEntry = {
      id: crypto.randomUUID(),
      text,
      createdAt: createTimestampForDate(selectedDateKey),
      tag: selectedTag ?? undefined,
    };

    updatePlanField(selectedDateKey, 'interstitialJournalEntries', [nextEntry, ...entries]);
    setEntryDraft('');
    setSelectedTag(null);
  };

  const removeEntry = (entryId: string) => {
    updatePlanField(
      selectedDateKey,
      'interstitialJournalEntries',
      entries.filter((entry) => entry.id !== entryId),
    );
  };

  const goToPreviousDay = () => setSelectedDateKey(getPreviousDateKey(selectedDateKey));
  const goToNextDay = () => setSelectedDateKey(getNextDateKey(selectedDateKey));

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <header className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-teal/25 bg-accent-teal/10 shadow-[0_4px_12px_rgba(94,196,191,0.12)]">
            <BookOpenText className="h-5 w-5 text-accent-teal" aria-hidden />
          </div>
          <div className="min-w-0 flex items-center">
            <h1 className="font-display text-xl font-bold tracking-tight text-text">Interstitial journalling</h1>
            <InfoTooltip content="Quick log entries for the in-between moments, each marked with the time." />
          </div>
        </header>

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
            <span className="pointer-events-none inline-flex items-center gap-1 text-xs font-medium text-text">
              {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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

      <section
        className="overflow-hidden rounded-[2rem] border border-border-subtle/50 shadow-[0_22px_60px_rgba(145,104,72,0.12)]"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 97%, white 3%) 0%, color-mix(in srgb, var(--color-bg-surface) 90%, var(--color-accent-sakura) 10%) 55%, color-mix(in srgb, var(--color-bg-surface) 88%, var(--color-accent-teal) 12%) 100%)',
        }}
      >
        <div className="border-b border-border-subtle/35 px-6 py-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            <BookOpenText size={13} />
            Interstitial Log
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col">
            <div className="relative flex items-center">
              <input
                type="text"
                value={entryDraft}
                onChange={(event) => setEntryDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addEntry();
                  }
                }}
                placeholder="What just shifted? Press enter to save..."
                className="h-11 flex-1 rounded-xl bg-bg-surface/40 px-4 pr-[110px] sm:pr-[120px] text-sm text-text transition-all placeholder:text-text-muted/50 focus:bg-bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent-teal/20"
              />

              <div className="absolute right-11 flex items-center pr-1">
                <div className={`relative flex items-center h-7 rounded-lg transition-all ${
                  selectedTag
                    ? `${TAG_STYLES[selectedTag].tag} border border-border-subtle/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]`
                    : 'text-text-muted/60 hover:bg-bg-elevated hover:text-text'
                }`}>
                  {!selectedTag && (
                    <Tag size={13} className="absolute left-2.5 pointer-events-none" />
                  )}
                  <select
                    className={`peer appearance-none bg-transparent h-full w-full ${!selectedTag ? 'pl-7 pr-6' : 'pl-2.5 pr-6'} text-[11px] font-semibold tracking-wide outline-none cursor-pointer`}
                    value={selectedTag || ''}
                    onChange={(e) => setSelectedTag(e.target.value || null)}
                    aria-label="Select tag"
                  >
                    <option value="">Tag…</option>
                    {TAG_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-1.5 pointer-events-none opacity-50 peer-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <button
                type="button"
                onClick={addEntry}
                disabled={!entryDraft.trim()}
                className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
                aria-label="Add journal entry"
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>

          <div className="mt-5 min-h-[1.25rem] text-[11px] font-medium text-text-muted">
            {saveError ? saveError : isSaving ? 'Saving entries…' : ''}
          </div>

          <div className="mt-4 space-y-3">
            {entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-subtle/40 bg-white/20 px-5 py-8 text-center ring-1 ring-white/50">
                <p className="text-sm italic text-text-muted/70">No timestamped entries yet.</p>
              </div>
            ) : (
              entries.map((entry) => {
                const style = entry.tag ? TAG_STYLES[entry.tag] ?? TAG_STYLES.default : TAG_STYLES.default;

                return (
                  <article
                    key={entry.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border border-white/60 bg-bg-surface/30 px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm backdrop-blur-md transition-all hover:bg-bg-surface/50"
                  >
                    <div className="flex items-center">
                      <div className={`shrink-0 inline-flex items-center gap-1.5 rounded-[0.65rem] px-2.5 py-1 text-[11px] font-semibold ${style.pill} border-none shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] ring-1 ring-black/5`}>
                        <Clock3 size={11} className="opacity-70" />
                        {formatEntryTime(entry.createdAt)}
                      </div>
                    </div>
                    
                    <p className="min-w-0 flex-1 text-[15px] leading-relaxed text-text">
                      {entry.text}
                    </p>

                    <div className="flex shrink-0 items-center justify-between sm:justify-end gap-3 mt-1 sm:mt-0">
                      {entry.tag && (
                        <div className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${style.tag} border-none shadow-sm ring-1 ring-black/5`}>
                          {entry.tag}
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        className="rounded-lg p-1.5 text-text-muted/50 transition-all hover:bg-bg-elevated hover:text-text-muted sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                        aria-label="Delete journal entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
