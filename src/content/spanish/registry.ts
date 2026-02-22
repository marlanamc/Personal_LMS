/**
 * Single source of truth for Spanish track activity IDs and dashboard ordering.
 *
 * Keep this file updated whenever you add, remove, or rename Spanish activities.
 * Other files (dashboard grouping + seed scripts) import these constants.
 */

export const SPANISH_GUIDE_IDS = [
  "spanish-present-tense-guide",
  "spanish-ser-vs-estar-guide",
  "spanish-adjective-agreement-guide",
  "spanish-preterite-tense-guide",
  "spanish-restaurant-conversations-guide",
] as const;

export const SPANISH_VOCAB_ACTIVITY_IDS = [
  "spanish-vocab-greetings",
  "spanish-vocab-numbers",
  "spanish-vocab-colors",
  "spanish-vocab-family",
  "spanish-vocab-verbs",
  "spanish-vocab-everyday",
  "spanish-common-verbs-flashcards",
  "spanish-numbers-flashcards",
  "spanish-adjectives-flashcards",
] as const;

export const SPANISH_VERB_ACTIVITY_IDS = [
  "spanish-verb-game-present-ar",
  "spanish-verb-game-present-er-ir",
  "spanish-verb-game-present-irregular",
  "spanish-verb-game-preterite",
  "spanish-verb-game-mixed",
  "spanish-verb-race",
  "spanish-verb-conjugation-matching",
  "spanish-ser-estar-fill-blank",
] as const;

export const SPANISH_NUMBERS_ACTIVITY_IDS = [
  "spanish-numbers-game-easy",
  "spanish-numbers-game-medium",
  "spanish-numbers-game-timed",
] as const;

export const SPANISH_LEGACY_GAME_IDS = [
  "spanish-common-verbs-flashcards",
  "spanish-numbers-flashcards",
  "spanish-verb-conjugation-matching",
  "spanish-adjectives-flashcards",
  "spanish-ser-estar-fill-blank",
] as const;

export const SPANISH_CORE_GAME_IDS = [
  "spanish-vocab-greetings",
  "spanish-vocab-numbers",
  "spanish-vocab-colors",
  "spanish-vocab-family",
  "spanish-vocab-verbs",
  "spanish-vocab-everyday",
  "spanish-numbers-game-easy",
  "spanish-numbers-game-medium",
  "spanish-numbers-game-timed",
  "spanish-verb-game-present-ar",
  "spanish-verb-game-present-er-ir",
  "spanish-verb-game-present-irregular",
  "spanish-verb-game-preterite",
  "spanish-verb-game-mixed",
  "spanish-verb-race",
] as const;

export const SPANISH_ALL_ACTIVITY_IDS = [
  ...SPANISH_GUIDE_IDS,
  ...SPANISH_CORE_GAME_IDS,
  ...SPANISH_LEGACY_GAME_IDS,
] as const;

export type SpanishActivityId = (typeof SPANISH_ALL_ACTIVITY_IDS)[number];

