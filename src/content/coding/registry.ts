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
  "coding-react-fundamentals",
  "coding-nextjs-architecture-decision-tree",
  "coding-dom-manipulation",
  "coding-classes-oop",
  "coding-modules-imports",
  "coding-working-with-apis",
  "coding-async-promises",
] as const;

export const CODING_CODE_READING_AND_REVIEW_IDS = [
  "coding-code-reading-non-authors",
  "coding-code-review-both-sides",
  "coding-testing-fundamentals-confidence",
] as const;

export const CODING_ARCHITECTURE_AND_PATTERNS_IDS = [
  "coding-state-management-patterns",
  "coding-api-contract-prisma-workflow",
  "coding-dependency-management-decisions",
  "coding-typescript-deep-dive",
] as const;

export const CODING_TECHNICAL_DEBUGGING_IDS = [
  "coding-array-method-mastery",
  "coding-debugging-devtools",
  "coding-debugging-production-issues",
  "coding-git-pr-communication",
] as const;

export const CODING_COMMUNICATION_AND_DELIVERY_IDS = [
  "coding-estimation-scoping-communication",
  "coding-live-incident-communication",
  "coding-implementation-discovery-scoping",
  "coding-implementation-stakeholder-communication-system",
  "coding-implementation-planning-mechanics",
  "coding-implementation-change-management-adoption",
  "coding-implementation-uat-defect-triage",
  "coding-implementation-go-live-hypercare",
] as const;

export const CODING_GROWTH_AND_LEADERSHIP_IDS = [
  "coding-personal-learning-metrics",
  "coding-external-projects-skill-transfer",
  "coding-implementation-kpi-outcome-tracking",
  "coding-implementation-cross-functional-decision-leadership",
] as const;

export const CODING_INTERVIEW_PREP_IDS = [
  "coding-js-ts-interview-prep",
] as const;

export const CODING_ADVANCED_GUIDE_IDS = [
  ...CODING_CODE_READING_AND_REVIEW_IDS,
  ...CODING_ARCHITECTURE_AND_PATTERNS_IDS,
  ...CODING_TECHNICAL_DEBUGGING_IDS,
  ...CODING_COMMUNICATION_AND_DELIVERY_IDS,
  ...CODING_GROWTH_AND_LEADERSHIP_IDS,
  ...CODING_INTERVIEW_PREP_IDS,
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
