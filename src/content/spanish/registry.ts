/**
 * Single source of truth for Spanish track activity IDs and dashboard ordering.
 *
 * Keep this file updated whenever you add, remove, or rename Spanish activities.
 * Order = learning path: Basics (1–14), Intermediate (1–8), Advanced (1–6), then Spanish for ESOL Teachers.
 */

export const SPANISH_GUIDE_IDS = [
  // Basics (Lessons 1–14)
  "spanish-alphabet-pronunciation-guide",
  "spanish-noun-gender-articles-guide",
  "spanish-question-words-sentences-guide",
  "spanish-present-tense-guide",
  "spanish-ser-vs-estar-guide",
  "spanish-adjective-agreement-guide",
  "spanish-present-progressive-guide",
  "spanish-immediate-future-guide",
  "spanish-comparatives-superlatives-guide",
  "spanish-commands-polite-requests-guide",
  "spanish-obligation-necessity-guide",
  "spanish-object-pronouns-basics-guide",
  "spanish-reflexive-verbs-routines-guide",
  "spanish-preterite-tense-guide",
  "spanish-imperfect-tense-guide",
  "spanish-restaurant-conversations-guide",
  "spanish-travel-conversations-guide",
  // Intermediate (Lessons 1–8)
  "spanish-present-perfect-b1-guide",
  "spanish-conectores-argumentacion-b1-guide",
  "spanish-subjuntivo-intro-b1-guide",
  "spanish-b1-integrated-assessment-guide",
  "spanish-subjuntivo-clausulas-b2-guide",
  "spanish-contraste-tiempos-b2-guide",
  "spanish-pasiva-impersonales-b2-guide",
  "spanish-b2-integrated-assessment-guide",
  // Advanced (Lessons 1–6)
  "spanish-register-control-c1-guide",
  "spanish-conectores-persuasion-c1-guide",
  "spanish-c1-production-lab-guide",
  "spanish-matices-pragmaticos-c2-guide",
  "spanish-precision-lab-c2-guide",
  "spanish-c2-capstone-guide",
  // Other (displayed last)
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

/** Tier for Spanish guides: basics | intermediate | advanced */
export type SpanishTier = "basics" | "intermediate" | "advanced";

/** Display title format: "{Tier}: Lesson {N} – {Topic}". Lesson numbers reset per tier. */
export const SPANISH_GUIDE_META: Record<
  (typeof SPANISH_GUIDE_IDS)[number],
  { tier: SpanishTier; lessonNumber: number; topic: string; description: string }
> = {
  "spanish-alphabet-pronunciation-guide": {
    tier: "basics",
    lessonNumber: 1,
    topic: "Alphabet & Pronunciation",
    description: "Core sounds, stress, and accent mark basics.",
  },
  "spanish-noun-gender-articles-guide": {
    tier: "basics",
    lessonNumber: 2,
    topic: "Noun Gender & Articles",
    description: "El/la/los/las, un/una, and agreement.",
  },
  "spanish-question-words-sentences-guide": {
    tier: "basics",
    lessonNumber: 3,
    topic: "Question Words & Basic Sentences",
    description: "Asking questions and building simple conversational patterns.",
  },
  "spanish-present-tense-guide": {
    tier: "basics",
    lessonNumber: 4,
    topic: "The Present Tense",
    description: "Present tense conjugation and common irregulars.",
  },
  "spanish-ser-vs-estar-guide": {
    tier: "basics",
    lessonNumber: 5,
    topic: "Ser vs Estar",
    description: "Choosing between ser and estar correctly.",
  },
  "spanish-adjective-agreement-guide": {
    tier: "basics",
    lessonNumber: 6,
    topic: "Adjective Agreement",
    description: "Gender and number agreement in adjectives.",
  },
  "spanish-present-progressive-guide": {
    tier: "basics",
    lessonNumber: 7,
    topic: "Present Progressive",
    description: "estar + gerund for actions right now.",
  },
  "spanish-immediate-future-guide": {
    tier: "basics",
    lessonNumber: 8,
    topic: "Immediate Future",
    description: "Ir + a + infinitive and planning language.",
  },
  "spanish-comparatives-superlatives-guide": {
    tier: "basics",
    lessonNumber: 9,
    topic: "Comparatives & Superlatives",
    description: "Más/menos/tan and superlatives in context.",
  },
  "spanish-commands-polite-requests-guide": {
    tier: "basics",
    lessonNumber: 10,
    topic: "Commands & Polite Requests",
    description: "Tú/usted commands and polite instruction language.",
  },
  "spanish-obligation-necessity-guide": {
    tier: "basics",
    lessonNumber: 11,
    topic: "Obligation & Necessity",
    description: "tener que, deber, necesitar + infinitive.",
  },
  "spanish-object-pronouns-basics-guide": {
    tier: "basics",
    lessonNumber: 12,
    topic: "Object Pronouns",
    description: "Direct and indirect object pronouns in communication.",
  },
  "spanish-reflexive-verbs-routines-guide": {
    tier: "basics",
    lessonNumber: 13,
    topic: "Reflexive Verbs & Routines",
    description: "Daily routine verbs and reflexive pronouns.",
  },
  "spanish-preterite-tense-guide": {
    tier: "basics",
    lessonNumber: 14,
    topic: "The Preterite Tense",
    description: "Completed past actions in the preterite.",
  },
  "spanish-imperfect-tense-guide": {
    tier: "basics",
    lessonNumber: 15,
    topic: "The Imperfect Tense",
    description: "Past habits, background, and imperfect vs preterite.",
  },
  "spanish-restaurant-conversations-guide": {
    tier: "basics",
    lessonNumber: 16,
    topic: "Restaurant Conversations",
    description: "Ordering food and handling restaurant interactions.",
  },
  "spanish-travel-conversations-guide": {
    tier: "basics",
    lessonNumber: 17,
    topic: "Travel Conversations",
    description: "Airport, hotel, directions, and basic emergency phrases.",
  },
  "spanish-present-perfect-b1-guide": {
    tier: "intermediate",
    lessonNumber: 1,
    topic: "Present Perfect",
    description: "Form, usage, and contrast with preterite.",
  },
  "spanish-conectores-argumentacion-b1-guide": {
    tier: "intermediate",
    lessonNumber: 2,
    topic: "Connectors & Argumentation",
    description: "Discourse connectors and short-form argument organization.",
  },
  "spanish-subjuntivo-intro-b1-guide": {
    tier: "intermediate",
    lessonNumber: 3,
    topic: "Subjunctive Introduction",
    description: "Present subjunctive triggers, form, and controlled production.",
  },
  "spanish-b1-integrated-assessment-guide": {
    tier: "intermediate",
    lessonNumber: 4,
    topic: "Integrated Assessment (Part 1)",
    description: "Reading, writing, and mini-project assessment.",
  },
  "spanish-subjuntivo-clausulas-b2-guide": {
    tier: "intermediate",
    lessonNumber: 5,
    topic: "Subjunctive in Clauses",
    description: "Subjunctive in noun and adjective clauses.",
  },
  "spanish-contraste-tiempos-b2-guide": {
    tier: "intermediate",
    lessonNumber: 6,
    topic: "Tense & Mood Contrast",
    description: "Fine-grained tense and mood contrast in context.",
  },
  "spanish-pasiva-impersonales-b2-guide": {
    tier: "intermediate",
    lessonNumber: 7,
    topic: "Passive & Impersonal Se",
    description: "Passive voice and impersonal se in formal registers.",
  },
  "spanish-b2-integrated-assessment-guide": {
    tier: "intermediate",
    lessonNumber: 8,
    topic: "Integrated Assessment (Part 2)",
    description: "Reading, audio synthesis, and argument response.",
  },
  "spanish-register-control-c1-guide": {
    tier: "advanced",
    lessonNumber: 1,
    topic: "Register Control & Rewriting",
    description: "Formal, semiformal, and close-register control.",
  },
  "spanish-conectores-persuasion-c1-guide": {
    tier: "advanced",
    lessonNumber: 2,
    topic: "Advanced Connectors & Persuasion",
    description: "Advanced connectors and persuasive discourse.",
  },
  "spanish-c1-production-lab-guide": {
    tier: "advanced",
    lessonNumber: 3,
    topic: "Production Lab",
    description: "Essay drafting and rubric-based revision.",
  },
  "spanish-matices-pragmaticos-c2-guide": {
    tier: "advanced",
    lessonNumber: 4,
    topic: "Pragmatic Nuance & Intention",
    description: "Pragmatic nuance, tone control, and implicature.",
  },
  "spanish-precision-lab-c2-guide": {
    tier: "advanced",
    lessonNumber: 5,
    topic: "Precision Lab",
    description: "Subtle error correction and high-precision reformulation.",
  },
  "spanish-c2-capstone-guide": {
    tier: "advanced",
    lessonNumber: 6,
    topic: "Capstone",
    description: "Integrated professional/academic simulation tasks.",
  },
  "spanish-for-esol-teachers-guide": {
    tier: "intermediate",
    lessonNumber: 0, // no lesson number in title
    topic: "Spanish for ESOL Teachers",
    description:
      "Contrastive guide for ESOL teachers learning Spanish—uses your teaching lens to avoid interference.",
  },
};
