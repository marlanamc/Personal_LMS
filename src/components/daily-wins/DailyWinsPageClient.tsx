'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Trash2, Trophy, Sparkles } from 'lucide-react';
import { DailyWinsPhraseCloud } from '@/components/daily-wins/DailyWinsPhraseCloud';
import { aggregateDailyWinPhrases, getRollingSevenDayWins } from '@/lib/daily-wins';

export type DailyWinRow = {
  id: string;
  text: string;
  createdAt: string;
};

function dayHeading(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMM d');
}

function parseLocalNoon(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T12:00:00`);
}

export function DailyWinsPageClient() {
  const [wins, setWins] = useState<DailyWinRow[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadWins = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/daily-wins', { method: 'GET' });
      if (!res.ok) {
        return;
      }
      const data = (await res.json()) as { wins: DailyWinRow[] };
      setWins(data.wins ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWins();
  }, [loadWins]);

  const groups = useMemo(() => {
    const byDay = new Map<string, DailyWinRow[]>();
    for (const w of wins) {
      const d = new Date(w.createdAt);
      const key = format(d, 'yyyy-MM-dd');
      if (!byDay.has(key)) {
        byDay.set(key, []);
      }
      byDay.get(key)!.push(w);
    }
    return Array.from(byDay.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([dateKey, items]) => ({
        dateKey,
        label: dayHeading(parseLocalNoon(dateKey)),
        items: items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      }));
  }, [wins]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || isSaving) return;

      setIsSaving(true);
      setStatusMessage('');
      try {
        const res = await fetch('/api/daily-wins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: string };
          setStatusMessage(err.error ?? 'Could not save. Try again.');
          return;
        }
        setText('');
        await loadWins();
        setStatusMessage('Win added.');
      } finally {
        setIsSaving(false);
      }
    },
    [text, isSaving, loadWins],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      setStatusMessage('');
      try {
        const res = await fetch(`/api/daily-wins/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          setStatusMessage('Could not remove that item.');
          return;
        }
        setWins((prev) => prev.filter((w) => w.id !== id));
        setStatusMessage('Removed.');
      } finally {
        setDeletingId(null);
      }
    },
    [],
  );

  const recentWins = useMemo(() => getRollingSevenDayWins(wins), [wins]);
  const phraseItems = useMemo(() => aggregateDailyWinPhrases(recentWins), [recentWins]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <header className="mb-12 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center justify-center rounded-full bg-primary/10 p-4 ring-1 ring-primary/20 shadow-[0_0_30px_rgba(var(--color-primary),0.3)]">
          <Trophy className="h-10 w-10 text-primary drop-shadow-[0_0_10px_currentColor]" aria-hidden />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary sm:text-5xl drop-shadow-sm pb-1">
          Daily Wins
        </h1>
        <p className="mt-4 max-w-xl text-lg text-text-secondary">
          What went well today? Every small victory counts.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-10 relative max-w-2xl mx-auto">
        <div className="relative group flex items-center">
          <input
            id="daily-win-text"
            name="text"
            maxLength={500}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Made the bed, sent that email, someone thanked me…"
            className="w-full rounded-full border border-border-subtle/50 bg-bg-surface/50 px-6 py-4 pr-16 text-lg text-text placeholder:text-text-muted/60 backdrop-blur-md transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 group-hover:bg-bg-surface/80 group-hover:shadow-[0_0_20px_rgba(var(--color-primary),0.1)]"
            disabled={isSaving}
            autoComplete="off"
          />
          <button
            type="submit" 
            disabled={isSaving || !text.trim()} 
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            aria-label="Add win"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        </div>
        {statusMessage ? (
          <p className="absolute -bottom-7 left-0 right-0 text-center text-sm font-medium text-secondary animate-in fade-in slide-in-from-top-1" role="status" aria-live="polite">
            {statusMessage}
          </p>
        ) : null}
      </form>

      <section aria-labelledby="wins-cloud-heading" className="mb-16">
        <h2 id="wins-cloud-heading" className="sr-only">
          Past 7 days at a glance
        </h2>
        {isLoading ? (
          <div className="rounded-3xl bg-bg-surface/20 py-16 text-center text-text-muted backdrop-blur-sm">
            Loading your wins…
          </div>
        ) : (
          <DailyWinsPhraseCloud
            items={phraseItems}
            emptyMessage="Your wins will appear here like magic."
          />
        )}
      </section>

      <section aria-labelledby="wins-list-heading" className="max-w-2xl mx-auto pb-20">
        <h2 id="wins-list-heading" className="sr-only">
          By day
        </h2>
        {isLoading ? null : wins.length === 0 ? null : (
          <ol className="space-y-8">
            {groups.map((group) => (
              <li key={group.dateKey} className="relative">
                <div className="sticky top-4 z-10 -ml-4 mb-3 inline-block rounded-full bg-bg-surface/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-text-secondary backdrop-blur-md border border-border-subtle/30 shadow-sm">
                  {group.label}
                </div>
                <ul className="space-y-3">
                  {group.items.map((w) => (
                    <li
                      key={w.id}
                      className="group flex items-start justify-between gap-4 rounded-2xl border border-transparent bg-gradient-to-r from-bg-surface/40 to-bg-surface/10 px-5 py-4 transition-all hover:border-border-subtle/30 hover:bg-bg-surface/60 hover:shadow-sm"
                    >
                      <span className="min-w-0 flex-1 text-lg text-text leading-relaxed">{w.text}</span>
                      <button
                        type="button"
                        onClick={() => void handleDelete(w.id)}
                        disabled={deletingId === w.id}
                        className="shrink-0 rounded-full p-2 text-text-muted/50 opacity-0 transition-all group-hover:opacity-100 hover:bg-error/10 hover:text-error focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40 disabled:opacity-0"
                        aria-label={`Delete win: ${w.text}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
