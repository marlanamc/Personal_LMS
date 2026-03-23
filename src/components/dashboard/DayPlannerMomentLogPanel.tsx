'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpenText, Plus, Trash2, X } from 'lucide-react';
import type { CustomTag, InterstitialJournalEntry, JournalTagMeta } from './useCalendarPlanner';

interface DayPlannerMomentLogPanelProps {
  dateKey: string;
  entries: InterstitialJournalEntry[];
  customTags: CustomTag[];
  isLoaded: boolean;
  saveError: string | null;
  onAddEntry: (entry: { text: string; tag?: string; tagMeta?: JournalTagMeta }) => void;
  onRemoveEntry: (entryId: string) => void;
}

const DEFAULT_TAGS: Array<{ id: string; label: string; color: CustomTag['color'] }> = [
  { id: 'health', label: 'Health', color: 'mint' },
  { id: 'work', label: 'Work', color: 'sky' },
  { id: 'cleaning', label: 'Cleaning', color: 'peach' },
  { id: 'admin', label: 'Admin', color: 'periwinkle' },
  { id: 'home', label: 'Home', color: 'rose' },
];

const COLOR_PILL_CLASS: Record<CustomTag['color'], string> = {
  peach: 'moment-tag-pill-selected-peach',
  sky: 'moment-tag-pill-selected-sky',
  mint: 'moment-tag-pill-selected-mint',
  periwinkle: 'moment-tag-pill-selected-periwinkle',
  lavender: 'moment-tag-pill-selected-lavender',
  rose: 'moment-tag-pill-selected-rose',
  coral: 'moment-tag-pill-selected-coral',
  sage: 'moment-tag-pill-selected-sage',
  blush: 'moment-tag-pill-selected-blush',
  slate: 'moment-tag-pill-selected-slate',
};

function formatEntryTime(createdAt: string) {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function DayPlannerMomentLogPanel({
  dateKey,
  entries,
  customTags,
  isLoaded,
  saveError,
  onAddEntry,
  onRemoveEntry,
}: DayPlannerMomentLogPanelProps) {
  const [entryDraft, setEntryDraft] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleEntries = useMemo(() => entries.slice(0, 8), [entries]);
  const allTags = useMemo(
    () => [
      ...DEFAULT_TAGS,
      ...customTags,
    ],
    [customTags],
  );

  useEffect(() => {
    if (!isComposerOpen) return;
    inputRef.current?.focus();
  }, [isComposerOpen]);

  const resolveTagMeta = useCallback(
    (tag?: string, fallback?: JournalTagMeta) => {
      if (tag) {
        const liveTag = allTags.find((item) => item.id === tag);
        if (liveTag) {
          return {
            id: liveTag.id,
            label: liveTag.label,
            color: liveTag.color,
          };
        }
      }
      if (fallback) return fallback;
      if (!tag) return null;
      return {
        id: tag,
        label: tag,
        color: 'slate',
      } satisfies JournalTagMeta;
    },
    [allTags],
  );

  const addEntry = useCallback(() => {
    const text = entryDraft.trim();
    if (!text) return;
    const selectedTag = selectedTagId
      ? allTags.find((item) => item.id === selectedTagId)
      : null;

    onAddEntry({
      text,
      tag: selectedTag?.id,
      tagMeta: selectedTag
        ? {
            id: selectedTag.id,
            label: selectedTag.label,
            color: selectedTag.color,
          }
        : undefined,
    });
    setEntryDraft('');
    setSelectedTagId(null);
    setIsComposerOpen(false);
  }, [allTags, entryDraft, onAddEntry, selectedTagId]);

  const closeComposer = useCallback(() => {
    setEntryDraft('');
    setSelectedTagId(null);
    setIsComposerOpen(false);
  }, []);

  return (
    <section
      className="flex min-h-[36rem] flex-col rounded-2xl border border-border-subtle/50 bg-bg-elevated/80 p-4 shadow-sm backdrop-blur-sm lg:min-h-[38rem]"
      aria-label="Moment Log panel"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-teal/20 bg-accent-teal/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-teal">
          <BookOpenText className="h-3.5 w-3.5" />
          Moment Log
        </div>
        <Link
          href={`/dashboard/interstitial-journalling?date=${encodeURIComponent(dateKey)}`}
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-accent-teal transition-colors hover:bg-accent-teal/10"
        >
          Full view
        </Link>
      </div>

      {isComposerOpen ? (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            addEntry();
          }}
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={entryDraft}
              onChange={(event) => setEntryDraft(event.target.value)}
              className="h-11 flex-1 rounded-xl border border-border-subtle/50 bg-bg-surface/80 px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent-teal/20"
              aria-label="New moment log entry"
            />
            <button
              type="submit"
              disabled={!entryDraft.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-teal/15 text-accent-teal transition-all hover:bg-accent-teal/25 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Save moment log entry"
            >
              <Plus size={18} />
            </button>
            <button
              type="button"
              onClick={closeComposer}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle/50 bg-bg-surface/70 text-text-muted transition-colors hover:text-text"
              aria-label="Close moment log composer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => {
              const isSelected = selectedTagId === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTagId((current) => (current === tag.id ? null : tag.id))}
                  className={`moment-tag-pill ${
                    isSelected ? COLOR_PILL_CLASS[tag.color] : 'moment-tag-pill-unselected'
                  }`}
                  aria-pressed={isSelected}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-teal/15 text-accent-teal transition-all hover:bg-accent-teal/25"
          aria-label="Open moment log composer"
        >
          <Plus size={18} />
        </button>
      )}

      {!isLoaded ? (
        <div className="mt-3 flex-1 rounded-xl border border-border-subtle/40 bg-bg-surface/40" aria-hidden />
      ) : visibleEntries.length === 0 ? (
        <div className="mt-3 flex-1 rounded-xl border border-dashed border-border-subtle/50 bg-bg-surface/30" aria-hidden />
      ) : (
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
          {visibleEntries.map((entry) => {
            const tagMeta = resolveTagMeta(entry.tag, entry.tagMeta);
            return (
              <article
                key={entry.id}
                className="rounded-xl border border-border-subtle/40 bg-bg-surface/70 px-3 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <time className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-teal">
                        {formatEntryTime(entry.createdAt)}
                      </time>
                      {tagMeta ? (
                        <span className={`moment-tag-pill ${COLOR_PILL_CLASS[tagMeta.color]}`}>
                          {tagMeta.label}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-5 text-text">{entry.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveEntry(entry.id)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-base hover:text-error"
                    aria-label="Delete moment log entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {saveError ? (
        <p className="mt-3 text-[11px] font-medium text-error">{saveError}</p>
      ) : null}
    </section>
  );
}
