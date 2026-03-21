'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Plus, Sparkles, Tag, Trash2, X } from 'lucide-react';
import { useCalendarPlanner, type CustomTag, type JournalTagMeta } from './useCalendarPlanner';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface MomentLogPanelProps {
  dateKey: string;
  storageScope: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Tags
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TAGS: Array<{ value: string; label: string; color: CustomTag['color'] }> = [
  { value: 'health', label: 'Health', color: 'mint' },
  { value: 'work', label: 'Work', color: 'sky' },
  { value: 'cleaning', label: 'Cleaning', color: 'peach' },
  { value: 'admin', label: 'Admin', color: 'periwinkle' },
  { value: 'home', label: 'Home', color: 'rose' },
];

const COLOR_CLASSES: Record<CustomTag['color'], { bg: string; text: string; border: string }> = {
  peach: { bg: 'bg-[#e0b89a]/15', text: 'text-[#c49878]', border: 'border-[#e0b89a]/30' },
  sky: { bg: 'bg-[#9dc5e8]/15', text: 'text-[#6fa8d6]', border: 'border-[#9dc5e8]/30' },
  mint: { bg: 'bg-[#7dbba3]/15', text: 'text-[#5a9c84]', border: 'border-[#7dbba3]/30' },
  periwinkle: { bg: 'bg-[#9ba3d4]/15', text: 'text-[#7a84c4]', border: 'border-[#9ba3d4]/30' },
  lavender: { bg: 'bg-[#b8a5c8]/15', text: 'text-[#9988aa]', border: 'border-[#b8a5c8]/30' },
  rose: { bg: 'bg-[#c9a0ab]/15', text: 'text-[#b08590]', border: 'border-[#c9a0ab]/30' },
  coral: { bg: 'bg-[#e8b4a8]/15', text: 'text-[#c9958a]', border: 'border-[#e8b4a8]/30' },
  sage: { bg: 'bg-[#8bc4b8]/15', text: 'text-[#6aa599]', border: 'border-[#8bc4b8]/30' },
  blush: { bg: 'bg-[#d4b8c4]/15', text: 'text-[#b59aa8]', border: 'border-[#d4b8c4]/30' },
  slate: { bg: 'bg-[#a4b0c4]/15', text: 'text-[#8595ac]', border: 'border-[#a4b0c4]/30' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createTimestampForDate(dateKey: string) {
  const now = new Date();
  const [year, month, day] = dateKey.split('-').map(Number);
  const localDate = new Date(year, (month ?? 1) - 1, day ?? 1, now.getHours(), now.getMinutes(), now.getSeconds());
  return localDate.toISOString();
}

function formatEntryTime(createdAt: string) {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getTagColor(tagValue: string, customTags: CustomTag[]): CustomTag['color'] | null {
  const defaultTag = DEFAULT_TAGS.find((t) => t.value === tagValue);
  if (defaultTag) return defaultTag.color;
  const customTag = customTags.find((t) => t.id === tagValue || t.label.toLowerCase() === tagValue.toLowerCase());
  if (customTag) return customTag.color;
  return null;
}

function getTagLabel(tagValue: string, customTags: CustomTag[]): string {
  const defaultTag = DEFAULT_TAGS.find((t) => t.value === tagValue);
  if (defaultTag) return defaultTag.label;
  const customTag = customTags.find((t) => t.id === tagValue);
  if (customTag) return customTag.label;
  return tagValue;
}

function getEntryTagMeta(tagValue: string | undefined, tagMeta: JournalTagMeta | undefined, customTags: CustomTag[]) {
  if (!tagValue) return null;
  const liveColor = getTagColor(tagValue, customTags);
  if (liveColor) {
    return {
      color: liveColor,
      label: getTagLabel(tagValue, customTags),
    };
  }
  if (tagMeta) {
    return {
      color: tagMeta.color,
      label: tagMeta.label,
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function MomentLogPanel({
  dateKey,
  storageScope,
  collapsed = false,
  onToggleCollapse,
}: MomentLogPanelProps) {
  const [entryDraft, setEntryDraft] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tagSelectorRef = useRef<HTMLDivElement>(null);

  const { getPlan, updatePlanField, plannerStore } = useCalendarPlanner(storageScope);

  // Load custom tags from store
  const customTags = useMemo(() => {
    const storedTags = (plannerStore as { _customTags?: CustomTag[] })._customTags;
    return storedTags && Array.isArray(storedTags) ? storedTags : [];
  }, [plannerStore]);

  const plan = getPlan(dateKey);
  const entries = plan.interstitialJournalEntries ?? [];
  const allTags = useMemo(() => {
    return [...DEFAULT_TAGS, ...customTags.map((t) => ({ value: t.id, label: t.label, color: t.color }))];
  }, [customTags]);

  const addEntry = useCallback(() => {
    const text = entryDraft.trim();
    if (!text) return;
    const selectedTagDetails = selectedTag
      ? allTags.find((tag) => tag.value === selectedTag)
      : null;

    const newEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text,
      createdAt: createTimestampForDate(dateKey),
      tag: selectedTag || undefined,
      tagMeta: selectedTagDetails
        ? {
            id: selectedTagDetails.value,
            label: selectedTagDetails.label,
            color: selectedTagDetails.color,
          }
        : undefined,
    };

    updatePlanField(dateKey, 'interstitialJournalEntries', [...entries, newEntry]);
    setEntryDraft('');
    setSelectedTag(null);
    setShowTagSelector(false);
    setIsComposerOpen(false);
  }, [allTags, dateKey, entries, entryDraft, selectedTag, updatePlanField]);

  const deleteEntry = useCallback(
    (entryId: string) => {
      const updated = entries.filter((e) => e.id !== entryId);
      updatePlanField(dateKey, 'interstitialJournalEntries', updated);
    },
    [dateKey, entries, updatePlanField]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addEntry();
    }
  };

  const openComposer = useCallback(() => {
    setIsComposerOpen(true);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const closeComposer = useCallback(() => {
    setIsComposerOpen(false);
    setShowTagSelector(false);
  }, []);

  return (
    <div className="rounded-2xl border border-border-subtle/50 bg-bg-surface/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-amethyst/15">
            <MessageSquare size={14} className="text-accent-amethyst" />
          </div>
          <span className="text-sm font-semibold text-text">Moment Log</span>
          {entries.length > 0 && (
            <span className="rounded-full bg-accent-amethyst/15 px-2 py-0.5 text-xs font-medium text-accent-amethyst">
              {entries.length}
            </span>
          )}
        </div>
        {collapsed ? (
          <ChevronDown size={16} className="text-text-muted" />
        ) : (
          <ChevronUp size={16} className="text-text-muted" />
        )}
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="border-t border-border-subtle/40 px-4 py-3 space-y-3">
          {!isComposerOpen ? (
            <button
              type="button"
              onClick={openComposer}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle/60 bg-bg-elevated/40 text-accent-amethyst shadow-sm transition-colors hover:border-accent-amethyst/35 hover:bg-accent-amethyst/8 hover:text-accent-amethyst"
              aria-label="Open moment composer"
            >
              <Plus size={20} />
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={entryDraft}
                    onChange={(e) => setEntryDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Quick moment note..."
                    className="w-full rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-amethyst/30 focus:border-accent-amethyst/50 transition-all"
                  />
                </div>

                <div className="relative" ref={tagSelectorRef}>
                  <button
                    type="button"
                    onClick={() => setShowTagSelector(!showTagSelector)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                      selectedTag
                        ? `${COLOR_CLASSES[getTagColor(selectedTag, customTags) || 'lavender'].bg} ${COLOR_CLASSES[getTagColor(selectedTag, customTags) || 'lavender'].border}`
                        : 'border-border-subtle/50 bg-bg-elevated/60 hover:bg-bg-elevated'
                    }`}
                    title="Add tag"
                  >
                    <Tag size={14} className={selectedTag ? COLOR_CLASSES[getTagColor(selectedTag, customTags) || 'lavender'].text : 'text-text-muted'} />
                  </button>

                  {showTagSelector && (
                    <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-border-subtle/50 bg-bg-surface shadow-lg py-1">
                      {selectedTag && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTag(null);
                            setShowTagSelector(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-text-muted hover:bg-bg-elevated transition-colors"
                        >
                          Clear tag
                        </button>
                      )}
                      {allTags.map((tag) => {
                        const colors = COLOR_CLASSES[tag.color];
                        const isSelected = selectedTag === tag.value;
                        return (
                          <button
                            key={tag.value}
                            type="button"
                            onClick={() => {
                              setSelectedTag(tag.value);
                              setShowTagSelector(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                              isSelected ? `${colors.bg}` : 'hover:bg-bg-elevated'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${colors.bg} ${colors.border} border`} />
                            <span className={isSelected ? colors.text : 'text-text'}>{tag.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addEntry}
                  disabled={!entryDraft.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-amethyst/15 text-accent-amethyst transition-colors hover:bg-accent-amethyst/25 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Add entry"
                >
                  <Plus size={16} />
                </button>

                <button
                  type="button"
                  onClick={closeComposer}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle/50 bg-bg-elevated/40 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                  title="Close composer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Entries list */}
          {entries.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {entries
                .slice()
                .reverse()
                .map((entry) => {
                  const tagMeta = getEntryTagMeta(entry.tag, entry.tagMeta, customTags);
                  const colors = tagMeta ? COLOR_CLASSES[tagMeta.color] : null;

                  return (
                    <div
                      key={entry.id}
                      className="group flex items-start gap-2 rounded-lg bg-bg-elevated/40 px-3 py-2"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                          colors ? `${colors.bg} ${colors.border} border` : 'bg-text-muted/30'
                        }`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text leading-relaxed">{entry.text}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                          <span>{formatEntryTime(entry.createdAt)}</span>
                          {tagMeta && colors && (
                            <span className={`rounded-full px-1.5 py-0.5 ${colors.bg} ${colors.text}`}>
                              {tagMeta.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all"
                        title="Delete entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 text-center">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Sparkles size={14} className="text-accent-amethyst/60" />
                <span>Capture moments between tasks</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
