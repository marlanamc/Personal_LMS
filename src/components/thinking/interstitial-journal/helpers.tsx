'use client';

import { type CustomTag, type JournalTagMeta } from '@/features/planning/hooks/useCalendarPlanner';

export type TagFilterMode = 'all' | 'tagged';

export function createTimestampForDate(dateKey: string) {
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

export function formatEntryTime(createdAt: string) {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Default tags
export const DEFAULT_TAGS: Array<{ value: string; label: string; color: CustomTag['color'] }> = [
  { value: 'health', label: 'Health', color: 'mint' },
  { value: 'work', label: 'Work', color: 'sky' },
  { value: 'cleaning', label: 'Cleaning', color: 'peach' },
  { value: 'admin', label: 'Admin', color: 'periwinkle' },
  { value: 'home', label: 'Home', color: 'rose' },
];

// Color mappings for styling - softer palette matching site theme
export const COLOR_MAP: Record<CustomTag['color'], { node: string; entry: string; timestamp: string; tag: string; pill: string }> = {
  peach: {
    node: 'moment-node-peach',
    entry: 'moment-entry-peach',
    timestamp: 'moment-timestamp-peach',
    tag: 'moment-tag-peach',
    pill: 'moment-tag-pill-selected-peach',
  },
  sky: {
    node: 'moment-node-sky',
    entry: 'moment-entry-sky',
    timestamp: 'moment-timestamp-sky',
    tag: 'moment-tag-sky',
    pill: 'moment-tag-pill-selected-sky',
  },
  mint: {
    node: 'moment-node-mint',
    entry: 'moment-entry-mint',
    timestamp: 'moment-timestamp-mint',
    tag: 'moment-tag-mint',
    pill: 'moment-tag-pill-selected-mint',
  },
  periwinkle: {
    node: 'moment-node-periwinkle',
    entry: 'moment-entry-periwinkle',
    timestamp: 'moment-timestamp-periwinkle',
    tag: 'moment-tag-periwinkle',
    pill: 'moment-tag-pill-selected-periwinkle',
  },
  lavender: {
    node: 'moment-node-lavender',
    entry: 'moment-entry-lavender',
    timestamp: 'moment-timestamp-lavender',
    tag: 'moment-tag-lavender',
    pill: 'moment-tag-pill-selected-lavender',
  },
  rose: {
    node: 'moment-node-rose',
    entry: 'moment-entry-rose',
    timestamp: 'moment-timestamp-rose',
    tag: 'moment-tag-rose',
    pill: 'moment-tag-pill-selected-rose',
  },
  coral: {
    node: 'moment-node-coral',
    entry: 'moment-entry-coral',
    timestamp: 'moment-timestamp-coral',
    tag: 'moment-tag-coral',
    pill: 'moment-tag-pill-selected-coral',
  },
  sage: {
    node: 'moment-node-sage',
    entry: 'moment-entry-sage',
    timestamp: 'moment-timestamp-sage',
    tag: 'moment-tag-sage',
    pill: 'moment-tag-pill-selected-sage',
  },
  blush: {
    node: 'moment-node-blush',
    entry: 'moment-entry-blush',
    timestamp: 'moment-timestamp-blush',
    tag: 'moment-tag-blush',
    pill: 'moment-tag-pill-selected-blush',
  },
  slate: {
    node: 'moment-node-slate',
    entry: 'moment-entry-slate',
    timestamp: 'moment-timestamp-slate',
    tag: 'moment-tag-slate',
    pill: 'moment-tag-pill-selected-slate',
  },
};

// Inspiration categories and prompts
export const INSPIRATION_CATEGORIES: Array<{ id: string; label: string; prompts: string[] }> = [
  {
    id: 'transition',
    label: 'Transition / reset',
    prompts: [
      "I'm done with ___, I'm moving into ___ now.",
      'Okay, closing out ___, shifting into ___.',
      "That part's done. Next up: ___.",
    ],
  },
  {
    id: 'emotional',
    label: 'Emotional awareness → choice',
    prompts: [
      "Right now I feel ___, so I'm choosing to ___.",
      "I'm noticing ___, and I'm going to ___.",
      'Feeling ___, but I can still ___.',
    ],
  },
  {
    id: 'starting',
    label: 'Starting the next task',
    prompts: [
      'First tiny step: ___.',
      "I'm just going to start with ___.",
      'Let me do ___ and see what happens.',
    ],
  },
  {
    id: 'grounding',
    label: 'Grounding',
    prompts: [
      'Just be here for a second.',
      "I'm here. That's enough for now.",
      'Pause. Where am I actually right now?',
    ],
  },
  {
    id: 'awareness',
    label: 'Awareness / reflection',
    prompts: [
      'What just changed?',
      'Something just shifted… what was it?',
      'Wait, what actually happened there?',
    ],
  },
  {
    id: 'noticing',
    label: 'Noticing',
    prompts: [
      "I'm noticing ___.",
      "Huh. That's interesting: ___.",
      "Oh… I didn't realize ___.",
    ],
  },
];

// Color picker options for custom tags
export const COLOR_OPTIONS: CustomTag['color'][] = ['peach', 'coral', 'sky', 'mint', 'sage', 'periwinkle', 'lavender', 'blush', 'rose', 'slate'];

export const COLOR_HEX: Record<CustomTag['color'], string> = {
  peach: '#e0b89a',
  sky: '#9dc5e8',
  mint: '#7dbba3',
  periwinkle: '#9ba3d4',
  lavender: '#b8a5c8',
  rose: '#c9a0ab',
  coral: '#e8b4a8',
  sage: '#8bc4b8',
  blush: '#d4b8c4',
  slate: '#a4b0c4',
};

export function getTagColor(tagValue: string, customTags: CustomTag[]): CustomTag['color'] | null {
  const defaultTag = DEFAULT_TAGS.find((t) => t.value === tagValue);
  if (defaultTag) return defaultTag.color;
  const customTag = customTags.find((t) => t.id === tagValue || t.label.toLowerCase() === tagValue.toLowerCase());
  if (customTag) return customTag.color;
  return null;
}

export function getTagLabel(tagValue: string, customTags: CustomTag[]): string {
  const defaultTag = DEFAULT_TAGS.find((t) => t.value === tagValue);
  if (defaultTag) return defaultTag.label;
  const customTag = customTags.find((t) => t.id === tagValue);
  if (customTag) return customTag.label;
  return tagValue;
}

export function getEntryTagMeta(tagValue: string | undefined, tagMeta: JournalTagMeta | undefined, customTags: CustomTag[]) {
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
