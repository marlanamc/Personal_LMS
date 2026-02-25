/**
 * Single source of truth for Spanish track activity IDs and dashboard ordering.
 *
 * Keep this file updated whenever you add, remove, or rename Spanish activities.
 * Other files (dashboard grouping + seed scripts) import these constants.
 */

export const SPANISH_GUIDE_IDS = [
  "spanish-alphabet-pronunciation-guide",
  "spanish-noun-gender-articles-guide",
  "spanish-question-words-sentences-guide",
  "spanish-present-tense-guide",
  "spanish-ser-vs-estar-guide",
  "spanish-adjective-agreement-guide",
  "spanish-immediate-future-guide",
  "spanish-comparatives-superlatives-guide",
  "spanish-commands-polite-requests-guide",
  "spanish-object-pronouns-basics-guide",
  "spanish-reflexive-verbs-routines-guide",
  "spanish-preterite-tense-guide",
  "spanish-imperfect-tense-guide",
  "spanish-restaurant-conversations-guide",
  "spanish-present-perfect-b1-guide",
  "spanish-conectores-argumentacion-b1-guide",
  "spanish-subjuntivo-intro-b1-guide",
  "spanish-b1-integrated-assessment-guide",
  "spanish-subjuntivo-clausulas-b2-guide",
  "spanish-contraste-tiempos-b2-guide",
  "spanish-pasiva-impersonales-b2-guide",
  "spanish-b2-integrated-assessment-guide",
  "spanish-register-control-c1-guide",
  "spanish-conectores-persuasion-c1-guide",
  "spanish-c1-production-lab-guide",
  "spanish-matices-pragmaticos-c2-guide",
  "spanish-precision-lab-c2-guide",
  "spanish-c2-capstone-guide",
  "spanish-for-esol-teachers-guide",
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
