/**
 * Single source of truth for Coding track activity IDs and dashboard ordering.
 *
 * Keep this file updated whenever you add, remove, or rename Coding activities.
 * Other files (dashboard grouping + seed scripts) import these constants.
 */

export const CODING_FOUNDATIONS_GUIDE_IDS = [
  "coding-variables-types",
  "coding-operators-expressions",
  "coding-strings-methods",
  "coding-error-handling",
] as const;

export const CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS = [
  "coding-functions-parameters",
  "coding-loops-control-flow",
  "coding-arrays-objects",
] as const;

export const CODING_INTERMEDIATE_GUIDE_IDS = [
  "coding-dom-manipulation",
  "coding-classes-oop",
  "coding-modules-imports",
  "coding-working-with-apis",
  "coding-async-promises",
] as const;

export const CODING_ADVANCED_GUIDE_IDS = [
  "coding-typescript-deep-dive",
  "coding-array-method-mastery",
  "coding-debugging-devtools",
  "coding-js-ts-interview-prep",
] as const;

export const CODING_GAME_IDS = [
  "coding-concepts-flashcards",
  "coding-operators-flashcards",
  "coding-keywords-matching",
  "coding-array-methods-matching",
  "coding-syntax-fill-blank",
] as const;

export const CODING_GUIDE_IDS = [
  ...CODING_FOUNDATIONS_GUIDE_IDS,
  ...CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS,
  ...CODING_INTERMEDIATE_GUIDE_IDS,
  ...CODING_ADVANCED_GUIDE_IDS,
] as const;

export const CODING_ALL_ACTIVITY_IDS = [
  ...CODING_GUIDE_IDS,
  ...CODING_GAME_IDS,
] as const;

export type CodingActivityId = (typeof CODING_ALL_ACTIVITY_IDS)[number];
