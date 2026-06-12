'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Clock3, Lightbulb, Plus, SlidersHorizontal, Sparkles, Tag, Trash2, X } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { useCalendarPlanner, type CustomTag } from '@/features/planning/hooks/useCalendarPlanner';
import { getNextDateKey, getPreviousDateKey, getTodayKey, isToday } from '@/lib/unified-scheduler';
import { TagFilterMode, createTimestampForDate, formatEntryTime, DEFAULT_TAGS, COLOR_MAP, INSPIRATION_CATEGORIES, COLOR_OPTIONS, COLOR_HEX, getTagColor, getTagLabel, getEntryTagMeta } from './interstitial-journal/helpers';

interface InterstitialJournalViewProps {
  storageScope: string;
  initialDateKey?: string;
}


export function InterstitialJournalView({ storageScope, initialDateKey }: InterstitialJournalViewProps) {
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey ?? todayKey);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [entryDraft, setEntryDraft] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [inspirationTab, setInspirationTab] = useState(INSPIRATION_CATEGORIES[0].id);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showCustomTagForm, setShowCustomTagForm] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState<CustomTag['color']>('lavender');
  const [customTags, setLocalCustomTags] = useState<CustomTag[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [tagFilterMode, setTagFilterMode] = useState<TagFilterMode>('all');
  const [activeFilterTags, setActiveFilterTags] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const promptsRef = useRef<HTMLDivElement>(null);
  const mobilePromptsRef = useRef<HTMLDivElement>(null);
  const tagSelectorRef = useRef<HTMLDivElement>(null);
  const mobileTagSelectorRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const { getPlan, updatePlanField, plannerStore, isSaving, saveError, setCustomTags } = useCalendarPlanner(storageScope);

  // Load custom tags from store
  useEffect(() => {
    const storedTags = (plannerStore as { _customTags?: CustomTag[] })._customTags;
    if (storedTags && Array.isArray(storedTags)) {
      setLocalCustomTags(storedTags);
    }
  }, [plannerStore]);

  const plan = getPlan(selectedDateKey);
  const entries = plan.interstitialJournalEntries ?? [];
  const selectedDate = useMemo(() => new Date(`${selectedDateKey}T12:00:00`), [selectedDateKey]);
  const isSelectedToday = isToday(selectedDateKey);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsidePrompts = promptsRef.current?.contains(target) || mobilePromptsRef.current?.contains(target);
      const isInsideTags = tagSelectorRef.current?.contains(target) || mobileTagSelectorRef.current?.contains(target);
      const isInsideFilters = filtersRef.current?.contains(target);

      if (!isInsidePrompts) {
        setShowPrompts(false);
      }
      if (!isInsideTags) {
        setShowTagSelector(false);
        setShowCustomTagForm(false);
      }
      if (!isInsideFilters) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveCustomTags = useCallback((tags: CustomTag[]) => {
    setCustomTags(tags);
  }, [setCustomTags]);

  const addCustomTag = () => {
    const label = newTagLabel.trim();
    if (!label) return;

    const newTag: CustomTag = {
      id: crypto.randomUUID(),
      label,
      color: newTagColor,
    };

    saveCustomTags([...customTags, newTag]);
    setSelectedTag(newTag.id);
    setNewTagLabel('');
    setNewTagColor('lavender');
    setShowCustomTagForm(false);
    setShowTagSelector(false);
  };

  const addEntry = () => {
    const text = entryDraft.trim();
    if (!text) return;
    const selectedTagDetails = selectedTag
      ? allTags.find((tag) => tag.id === selectedTag)
      : null;

    const nextEntry = {
      id: crypto.randomUUID(),
      text,
      createdAt: createTimestampForDate(selectedDateKey),
      tag: selectedTag ?? undefined,
      tagMeta: selectedTagDetails
        ? {
            id: selectedTagDetails.id,
            label: selectedTagDetails.label,
            color: selectedTagDetails.color,
          }
        : undefined,
    };

    updatePlanField(selectedDateKey, 'interstitialJournalEntries', [nextEntry, ...entries]);
    setEntryDraft('');
    setSelectedTag(null);
    setShowPrompts(false);
    setShowTagSelector(false);
    setShowCustomTagForm(false);
    setIsComposerOpen(false);
  };

  const removeEntry = (entryId: string) => {
    updatePlanField(
      selectedDateKey,
      'interstitialJournalEntries',
      entries.filter((entry) => entry.id !== entryId),
    );
  };

  const selectPrompt = (prompt: string) => {
    setEntryDraft(prompt);
    setShowPrompts(false);
    inputRef.current?.focus();
  };

  const toggleTag = (tagValue: string) => {
    setSelectedTag((prev) => (prev === tagValue ? null : tagValue));
    setShowTagSelector(false);
  };

  const removeCustomTag = useCallback((tagId: string) => {
    setCustomTags(customTags.filter((tag) => tag.id !== tagId));
    if (selectedTag === tagId) {
      setSelectedTag(null);
    }
  }, [customTags, selectedTag, setCustomTags]);

  const goToPreviousDay = () => setSelectedDateKey(getPreviousDateKey(selectedDateKey));
  const goToNextDay = () => setSelectedDateKey(getNextDateKey(selectedDateKey));

  const allTags = useMemo(() => {
    return [
      ...DEFAULT_TAGS.map((t) => ({ id: t.value, label: t.label, color: t.color })),
      ...customTags,
    ];
  }, [customTags]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesTagged = tagFilterMode === 'all' ? true : Boolean(entry.tag);
      const matchesTags =
        activeFilterTags.length === 0
          ? true
          : Boolean(entry.tag && activeFilterTags.includes(entry.tag));

      return matchesTagged && matchesTags;
    });
  }, [entries, tagFilterMode, activeFilterTags]);

  const selectedTagColor = selectedTag ? getTagColor(selectedTag, customTags) : null;
  const hasActiveFilters = tagFilterMode !== 'all' || activeFilterTags.length > 0;
  const activeFilterCount = activeFilterTags.length + (tagFilterMode === 'tagged' ? 1 : 0);

  const toggleFilterTag = (tagId: string) => {
    setActiveFilterTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  const openComposer = useCallback(() => {
    setIsComposerOpen(true);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      mobileInputRef.current?.focus();
    });
  }, []);

  const closeComposer = useCallback(() => {
    setIsComposerOpen(false);
    setShowPrompts(false);
    setShowTagSelector(false);
    setShowCustomTagForm(false);
  }, []);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <header className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-teal/25 bg-accent-teal/10 shadow-[0_4px_12px_rgba(94,196,191,0.12)]">
            <Clock3 className="h-5 w-5 text-accent-teal" aria-hidden />
          </div>
          <div className="flex min-w-0 items-center">
            <h1 className="font-display text-xl font-bold tracking-tight text-text">Moment Log</h1>
            <InfoTooltip content="Capture moments between tasks. Note what you finished and what you are starting next." />
          </div>
        </header>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="relative" ref={filtersRef}>
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium shadow-sm backdrop-blur-md transition-colors ${
                hasActiveFilters
                  ? 'border-accent-teal/35 bg-accent-teal/12 text-accent-teal'
                  : 'border-border-subtle/60 bg-bg-surface/80 text-text-muted hover:bg-bg-elevated hover:text-text'
              }`}
              aria-label="Open tag filters"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={15} />
              {hasActiveFilters ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent-teal/90 px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full z-[110] mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border-subtle/70 bg-bg-elevated/95 p-3 shadow-xl backdrop-blur-md">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">Filters</p>
                  </div>
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={() => {
                        setTagFilterMode('all');
                        setActiveFilterTags([]);
                      }}
                      className="rounded-full px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTagFilterMode('all')}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      tagFilterMode === 'all'
                        ? 'bg-accent-teal/15 text-accent-teal'
                        : 'bg-bg-surface text-text-muted hover:text-text'
                    }`}
                  >
                    All moments
                  </button>
                  <button
                    type="button"
                    onClick={() => setTagFilterMode('tagged')}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      tagFilterMode === 'tagged'
                        ? 'bg-accent-teal/15 text-accent-teal'
                        : 'bg-bg-surface text-text-muted hover:text-text'
                    }`}
                  >
                    Only tagged
                  </button>
                </div>

                <div className="border-t border-border-subtle/60 pt-3">
                  <p className="mb-2 text-[11px] font-medium text-text-muted">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag) => {
                      const isActive = activeFilterTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleFilterTag(tag.id)}
                          className={`moment-tag-pill ${COLOR_MAP[tag.color].pill} ${isActive ? '' : 'opacity-70'}`}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

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
              <span className="pointer-events-none inline-flex items-center gap-1 text-[13px] font-medium text-text sm:text-sm">
                {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
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

      {/* Main Content Area */}
      <section className="flex-1">
        {/* Desktop Input (inline) */}
        <div className="relative z-20 mb-6 hidden sm:block">
          {isComposerOpen ? (
          <div className="relative flex items-center gap-2 rounded-xl border border-border-subtle/50 bg-bg-surface/60 p-2 backdrop-blur-sm">
            <input
              ref={inputRef}
              type="text"
              value={entryDraft}
              onChange={(event) => setEntryDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addEntry();
                }
              }}
              className="h-10 flex-1 rounded-lg bg-transparent px-3 text-sm text-text transition-all placeholder:text-text-muted/40 focus:outline-none"
              aria-label="New moment entry"
            />

            {/* Prompt Inspiration Button */}
            <div className="relative" ref={promptsRef}>
              <button
                type="button"
                onClick={() => setShowPrompts(!showPrompts)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                aria-label="Show prompt inspirations"
              >
                <Lightbulb size={18} />
              </button>

              {showPrompts && (
                <div className="moment-prompts-popover">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Inspiration
                  </div>
                  <label htmlFor="inspiration-category-desktop" className="mb-1.5 block text-[11px] font-medium text-text-muted">
                    Category
                  </label>
                  <select
                    id="inspiration-category-desktop"
                    value={inspirationTab}
                    onChange={(e) => setInspirationTab(e.target.value)}
                    className="moment-inspiration-select mb-3 w-full"
                    aria-label="Choose inspiration category"
                  >
                    {INSPIRATION_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <div className="border-t border-border-subtle/60 pt-3">
                    <p className="mb-1.5 text-[11px] font-medium text-text-muted">Pick a starter</p>
                    <div className="space-y-0.5">
                      {INSPIRATION_CATEGORIES.find((c) => c.id === inspirationTab)?.prompts.map((prompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectPrompt(prompt)}
                          className="moment-prompt-item"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tag Selector */}
            <div className="relative" ref={tagSelectorRef}>
              <button
                type="button"
                onClick={() => {
                  setShowTagSelector(!showTagSelector);
                  setShowCustomTagForm(false);
                }}
                className={`flex h-9 items-center gap-1.5 rounded-lg px-2.5 transition-colors ${
                  selectedTag
                    ? `${COLOR_MAP[selectedTagColor || 'lavender'].pill}`
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text'
                }`}
                aria-label="Select tag"
              >
                <Tag size={14} />
                <span className="text-xs font-medium">
                  {selectedTag ? getTagLabel(selectedTag, customTags) : 'Tag'}
                </span>
              </button>

              {showTagSelector && (
                <div className="absolute right-0 top-full z-[100] mt-2 w-64 rounded-xl border border-border-subtle bg-bg-elevated p-2 shadow-xl">
                  {!showCustomTagForm ? (
                    <>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {allTags.map((tag) => {
                          const isCustomTag = !DEFAULT_TAGS.some((defaultTag) => defaultTag.value === tag.id);
                          return (
                            <div key={tag.id} className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => toggleTag(tag.id)}
                                className={`moment-tag-pill ${
                                  selectedTag === tag.id
                                    ? COLOR_MAP[tag.color].pill
                                    : `${COLOR_MAP[tag.color].pill} opacity-70`
                                }`}
                              >
                                {tag.label}
                              </button>
                              {isCustomTag && (
                                <button
                                  type="button"
                                  onClick={() => removeCustomTag(tag.id)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-surface hover:text-error"
                                  aria-label={`Delete ${tag.label} tag`}
                                  title={`Delete ${tag.label} tag`}
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCustomTagForm(true)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-subtle py-1.5 text-xs text-text-muted transition-colors hover:border-text-muted hover:text-text"
                      >
                        <Plus size={12} />
                        New tag
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text">New Tag</span>
                        <button
                          type="button"
                          onClick={() => setShowCustomTagForm(false)}
                          className="rounded p-0.5 text-text-muted hover:text-text"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newTagLabel}
                        onChange={(e) => setNewTagLabel(e.target.value)}
                        placeholder="Tag name"
                        className="w-full rounded-lg border border-border-subtle bg-bg-surface px-2.5 py-1.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-teal/30"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomTag();
                          }
                        }}
                        autoFocus
                      />
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {COLOR_OPTIONS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewTagColor(color)}
                            className={`h-5 w-5 shrink-0 rounded-full transition-transform sm:h-6 sm:w-6 ${
                              newTagColor === color ? 'scale-110 ring-2 ring-white/50' : ''
                            }`}
                            style={{ backgroundColor: COLOR_HEX[color] }}
                            aria-label={`Select ${color} color`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addCustomTag}
                        disabled={!newTagLabel.trim()}
                        className="w-full rounded-lg bg-accent-teal/20 py-1.5 text-xs font-medium text-accent-teal transition-colors hover:bg-accent-teal/30 disabled:opacity-40 disabled:hover:bg-accent-teal/20"
                      >
                        Create Tag
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={addEntry}
              disabled={!entryDraft.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-teal/15 text-accent-teal transition-all hover:bg-accent-teal/25 disabled:opacity-30 disabled:hover:bg-accent-teal/15"
              aria-label="Add moment entry"
            >
              <Plus size={18} />
            </button>

            <button
              type="button"
              onClick={closeComposer}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
              aria-label="Close composer"
            >
              <X size={16} />
            </button>
          </div>
          ) : null}

          {/* Save status */}
          <div className="mt-2 h-4 text-[11px] font-medium text-text-muted">
            {saveError ? saveError : isSaving ? 'Saving...' : ''}
          </div>
        </div>

        {/* Timeline + Entries */}
        <div className="moment-log-container relative pb-32 sm:pb-4">
          {/* Timeline Track */}
          {filteredEntries.length > 0 && <div className="moment-track" aria-hidden="true" />}

          {/* Entries List */}
          {filteredEntries.length === 0 ? (
            <div className="moment-empty">
              <div className="moment-empty-visual">
                <div className="moment-empty-track" />
                <div className="moment-empty-node" />
                <div className="moment-empty-node" />
                <div className="moment-empty-node" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-text">Capture your first moment</h3>
              <p className="mb-4 text-sm text-text-muted">
                {hasActiveFilters
                  ? 'No moments match these filters yet.'
                  : 'Note what you finished or what you are about to start.'}
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setTagFilterMode('all');
                    setActiveFilterTags([]);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    openComposer();
                    setShowPrompts(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                >
                  <Lightbulb size={14} />
                  Need inspiration?
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1.5" role="feed" aria-label="Moment entries">
              {filteredEntries.map((entry, index) => {
                const entryTagMeta = getEntryTagMeta(entry.tag, entry.tagMeta, customTags);
                const colorClasses = entryTagMeta ? COLOR_MAP[entryTagMeta.color] : null;
                const isRecent = index === 0;

                return (
                  <article
                    key={entry.id}
                    className={`moment-entry group ${colorClasses?.entry || ''}`}
                    style={{ '--moment-node-color': entryTagMeta ? `var(--color-${entryTagMeta.color === 'mint' || entryTagMeta.color === 'sage' ? 'secondary' : entryTagMeta.color === 'sky' || entryTagMeta.color === 'slate' ? 'info' : entryTagMeta.color === 'peach' || entryTagMeta.color === 'coral' ? 'warning' : entryTagMeta.color === 'periwinkle' ? 'accent' : entryTagMeta.color === 'rose' || entryTagMeta.color === 'blush' ? 'primary' : 'text-muted'})` : 'var(--color-accent-teal)' } as CSSProperties}
                  >
                    {/* Timeline Node */}
                    <div
                      className={`moment-node ${colorClasses?.node || ''} ${isRecent ? 'moment-node-recent' : ''}`}
                      aria-hidden="true"
                    />

                    {/* Content - compact inline layout */}
                    <div className="flex items-center gap-2 ml-3">
                      <time
                        dateTime={entry.createdAt}
                        className={`moment-timestamp shrink-0 ${colorClasses?.timestamp || ''}`}
                      >
                        {formatEntryTime(entry.createdAt)}
                      </time>
                      <p className="moment-text min-w-0 flex-1">{entry.text}</p>
                      {entryTagMeta && (
                        <span className={`moment-tag shrink-0 ${colorClasses?.tag || ''}`}>
                          {entryTagMeta.label}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        className="moment-delete shrink-0"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Sticky Input */}
      {(isComposerOpen || saveError || isSaving) && (
        <div className="moment-input-sticky sm:hidden">
        {isComposerOpen ? (
        <div className="flex items-center gap-2">
          <input
            ref={mobileInputRef}
            type="text"
            value={entryDraft}
            onChange={(event) => setEntryDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addEntry();
              }
            }}
            className="h-10 flex-1 rounded-lg border border-border-subtle/50 bg-bg-surface/80 px-3 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-1 focus:ring-accent-teal/30"
            aria-label="New moment entry"
          />

          {/* Mobile Prompt Button */}
          <div className="relative" ref={mobilePromptsRef}>
            <button
              type="button"
              onClick={() => setShowPrompts(!showPrompts)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle/50 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
              aria-label="Show prompt inspirations"
            >
              <Lightbulb size={18} />
            </button>

            {showPrompts && (
              <div className="moment-prompts-popover">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Inspiration
                </div>
                <label htmlFor="inspiration-category-mobile" className="mb-1.5 block text-[11px] font-medium text-text-muted">
                  Category
                </label>
                <select
                  id="inspiration-category-mobile"
                  value={inspirationTab}
                  onChange={(e) => setInspirationTab(e.target.value)}
                  className="moment-inspiration-select mb-3 w-full"
                  aria-label="Choose inspiration category"
                >
                  {INSPIRATION_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="border-t border-border-subtle/60 pt-3">
                  <p className="mb-1.5 text-[11px] font-medium text-text-muted">Pick a starter</p>
                  <div className="space-y-0.5">
                    {INSPIRATION_CATEGORIES.find((c) => c.id === inspirationTab)?.prompts.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectPrompt(prompt)}
                        className="moment-prompt-item"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Tag Button */}
          <div className="relative" ref={mobileTagSelectorRef}>
            <button
              type="button"
              onClick={() => {
                setShowTagSelector(!showTagSelector);
                setShowCustomTagForm(false);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                selectedTag
                  ? `${COLOR_MAP[selectedTagColor || 'lavender'].pill} border-transparent`
                  : 'border-border-subtle/50 text-text-muted hover:bg-bg-elevated hover:text-text'
              }`}
              aria-label="Select tag"
            >
              <Tag size={18} />
            </button>

            {showTagSelector && (
              <div className="fixed bottom-[calc(var(--bottom-nav-height,52px)+env(safe-area-inset-bottom,0px)+60px)] left-4 right-4 z-[100] max-w-xs rounded-xl border border-border-subtle bg-bg-elevated p-3 shadow-xl sm:absolute sm:bottom-full sm:left-auto sm:right-0 sm:mb-2 sm:w-64">
                {!showCustomTagForm ? (
                  <>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {allTags.map((tag) => {
                        const isCustomTag = !DEFAULT_TAGS.some((defaultTag) => defaultTag.value === tag.id);
                        return (
                          <div key={tag.id} className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className={`moment-tag-pill ${
                                selectedTag === tag.id
                                  ? COLOR_MAP[tag.color].pill
                                  : `${COLOR_MAP[tag.color].pill} opacity-70`
                              }`}
                            >
                              {tag.label}
                            </button>
                            {isCustomTag && (
                              <button
                                type="button"
                                onClick={() => removeCustomTag(tag.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-surface hover:text-error"
                                aria-label={`Delete ${tag.label} tag`}
                                title={`Delete ${tag.label} tag`}
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCustomTagForm(true)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-subtle py-2 text-xs text-text-muted transition-colors hover:border-text-muted hover:text-text"
                    >
                      <Plus size={12} />
                      New tag
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text">New Tag</span>
                      <button
                        type="button"
                        onClick={() => setShowCustomTagForm(false)}
                        className="rounded p-0.5 text-text-muted hover:text-text"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newTagLabel}
                      onChange={(e) => setNewTagLabel(e.target.value)}
                      placeholder="Tag name"
                      className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-teal/30"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomTag();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex flex-wrap justify-center gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTagColor(color)}
                          className={`h-5 w-5 shrink-0 rounded-full transition-transform sm:h-6 sm:w-6 ${
                            newTagColor === color ? 'scale-110 ring-2 ring-white/50' : ''
                          }`}
                          style={{ backgroundColor: COLOR_HEX[color] }}
                          aria-label={`Select ${color} color`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addCustomTag}
                      disabled={!newTagLabel.trim()}
                      className="w-full rounded-lg bg-accent-teal/20 py-2 text-sm font-medium text-accent-teal transition-colors hover:bg-accent-teal/30 disabled:opacity-40 disabled:hover:bg-accent-teal/20"
                    >
                      Create Tag
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Add Button */}
          <button
            type="button"
            onClick={addEntry}
            disabled={!entryDraft.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-teal text-white transition-all hover:bg-accent-teal/90 disabled:opacity-30 disabled:hover:bg-accent-teal"
            aria-label="Add moment entry"
          >
            <Plus size={20} />
          </button>

          <button
            type="button"
            onClick={closeComposer}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle/50 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
            aria-label="Close composer"
          >
            <X size={18} />
          </button>
        </div>
        ) : null}

        {/* Mobile save status */}
        {(saveError || isSaving) && (
          <div className="mt-1.5 text-center text-[10px] font-medium text-text-muted">
            {saveError ? saveError : 'Saving...'}
          </div>
        )}
      </div>
      )}

      {!isComposerOpen && (
        <button
          type="button"
          onClick={openComposer}
          className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-accent-teal/20 bg-accent-teal text-white shadow-[0_14px_35px_rgba(94,196,191,0.28)] transition-all hover:scale-[1.03] hover:bg-accent-teal/90 active:scale-[0.98] sm:bottom-8 sm:right-[max(2rem,calc(50vw-28rem))]"
          aria-label="Open moment composer"
        >
          <Plus size={22} />
        </button>
      )}
    </div>
  );
}
