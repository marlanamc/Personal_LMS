/**
 * Strips vocab activity type suffixes from titles for cleaner display.
 * e.g. "Unit 6: February 3–5 Jobs — Flash Cards" → "Unit 6: February 3–5 Jobs"
 */
export function stripVocabTypeSuffix(title: string): string {
  return title
    .replace(/\s*[—–-]\s*Word\s*List\s*$/i, '')
    .replace(/\s*[—–-]\s*Flash\s*Cards?\s*(?:GAME)?\s*$/i, '')
    .replace(/\s*[—–-]\s*Matching\s*$/i, '')
    .replace(/\s*[—–-]\s*Fill-?in-?(?:the-?)?Blank\s*$/i, '')
    .trim();
}

const VOCAB_TYPES = ['packet', 'flashcards', 'matching', 'fillblank'] as const;
export type VocabActivityType = (typeof VOCAB_TYPES)[number];

/**
 * Parse a vocab type from a short label/value (e.g. "Word List", "fill-blank").
 */
export function parseVocabTypeLabel(value: string | null | undefined): VocabActivityType | null {
  if (!value) return null;

  const normalized = value.toLowerCase().trim();

  if (
    normalized === 'packet' ||
    normalized === 'word list' ||
    normalized === 'word-list' ||
    normalized === 'wordlist'
  ) {
    return 'packet';
  }
  if (
    normalized === 'flashcards' ||
    normalized === 'flash cards' ||
    normalized === 'flash-cards' ||
    normalized === 'flashcard'
  ) {
    return 'flashcards';
  }
  if (normalized === 'matching') {
    return 'matching';
  }
  if (
    normalized === 'fill in the blank' ||
    normalized === 'fill-in-the-blank' ||
    normalized === 'fill in blank' ||
    normalized === 'fill-blank' ||
    normalized === 'fillblank'
  ) {
    return 'fillblank';
  }

  return null;
}

/**
 * Parse vocab type from common title suffixes.
 * e.g. "Unit 6 — Flash Cards" -> "flashcards"
 */
export function getVocabTypeFromTitle(title: string | null | undefined): VocabActivityType | null {
  if (!title) return null;

  if (/\s*[—–-]\s*Word\s*List\s*$/i.test(title)) return 'packet';
  if (/\s*[—–-]\s*Flash\s*Cards?\s*(?:GAME)?\s*$/i.test(title)) return 'flashcards';
  if (/\s*[—–-]\s*Matching\s*$/i.test(title)) return 'matching';
  if (/\s*[—–-]\s*Fill-?in-?(?:the-?)?Blank\s*$/i.test(title)) return 'fillblank';

  return null;
}

/**
 * Returns the vocab activity type from the activity ID.
 * e.g. vocab-feb-3-5-flashcards → 'flashcards'
 */
export function getVocabActivityType(activityId: string): VocabActivityType | null {
  if (!activityId.startsWith('vocab-')) return null;
  const type = activityId.split('-').pop();
  if (!type || !VOCAB_TYPES.includes(type as VocabActivityType)) return null;
  return type as VocabActivityType;
}

/**
 * Returns sibling vocab activity IDs for the same unit.
 * e.g. vocab-feb-3-5-flashcards → { packet, flashcards, matching, fillblank }
 */
export function getVocabSiblingIds(activityId: string): Record<VocabActivityType, string> | null {
  if (!activityId.startsWith('vocab-')) return null;
  const parts = activityId.split('-');
  if (parts.length < 3) return null;
  const type = parts.pop();
  if (!type || !VOCAB_TYPES.includes(type as (typeof VOCAB_TYPES)[number])) return null;
  const baseId = parts.join('-');
  return {
    packet: `${baseId}-packet`,
    flashcards: `${baseId}-flashcards`,
    matching: `${baseId}-matching`,
    fillblank: `${baseId}-fillblank`,
  };
}

/** Chip config for each vocab activity type (label, icon, Tailwind classes) */
export const VOCAB_CHIP_CONFIG: Record<VocabActivityType, { label: string; icon: string; className: string }> = {
  packet: {
    label: 'Word List',
    icon: '📄',
    className: 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200',
  },
  flashcards: {
    label: 'Flash Cards',
    icon: '🎴',
    className: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
  },
  matching: {
    label: 'Matching',
    icon: '🧩',
    className: 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-200',
  },
  fillblank: {
    label: 'Fill in the Blank',
    icon: '✍️',
    className: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
  },
};
