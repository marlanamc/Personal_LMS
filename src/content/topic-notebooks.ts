/**
 * Topic Notebooks
 *
 * Each notebook groups related learning content together - guides, games, and vocabulary.
 * This replaces the section-based layout (Grammar, Vocabulary, Verbs, Numbers) with
 * topic-based organization where all related content appears together.
 */

export interface TopicNotebook {
  id: string;
  subjectKey: 'spanish' | 'coding';
  name: string;
  tagline: string;
  emoji: string;
  /** All activity IDs in this notebook, grouped by type */
  content: {
    guides: string[];
    games: string[];
    vocabulary: string[];
  };
  /** Display order within subject */
  order: number;
}

export const TOPIC_NOTEBOOKS: TopicNotebook[] = [
  // ──────────────────────────────────────────
  // SPANISH
  // ──────────────────────────────────────────
  {
    id: 'notebook-spanish-basics',
    subjectKey: 'spanish',
    name: 'Basics',
    tagline: 'A1–A2 foundations in clear lesson order',
    emoji: '🌱',
    content: {
      guides: [
        'spanish-alphabet-pronunciation-guide',
        'spanish-noun-gender-articles-guide',
        'spanish-question-words-sentences-guide',
        'spanish-present-tense-guide',
        'spanish-ser-vs-estar-guide',
        'spanish-adjective-agreement-guide',
        'spanish-present-progressive-guide',
        'spanish-immediate-future-guide',
        'spanish-comparatives-superlatives-guide',
        'spanish-commands-polite-requests-guide',
        'spanish-obligation-necessity-guide',
        'spanish-object-pronouns-basics-guide',
        'spanish-reflexive-verbs-routines-guide',
        'spanish-preterite-tense-guide',
        'spanish-imperfect-tense-guide',
        'spanish-restaurant-conversations-guide',
        'spanish-travel-conversations-guide',
      ],
      games: [
        'spanish-ser-estar-fill-blank',
        'spanish-verb-game-present-ar',
        'spanish-verb-game-present-er-ir',
        'spanish-verb-game-present-irregular',
        'spanish-verb-game-preterite',
        'spanish-numbers-game-easy',
        'spanish-numbers-game-medium',
        'spanish-numbers-game-timed',
      ],
      vocabulary: [
        'spanish-vocab-greetings',
        'spanish-vocab-numbers',
        'spanish-vocab-colors',
        'spanish-vocab-family',
        'spanish-vocab-verbs',
        'spanish-vocab-everyday',
      ],
    },
    order: 1,
  },
  {
    id: 'notebook-spanish-intermediate',
    subjectKey: 'spanish',
    name: 'Intermediate',
    tagline: 'B1–B2 structure, contrast, and integrated assessments',
    emoji: '🧭',
    content: {
      guides: [
        'spanish-present-perfect-b1-guide',
        'spanish-conectores-argumentacion-b1-guide',
        'spanish-subjuntivo-intro-b1-guide',
        'spanish-b1-integrated-assessment-guide',
        'spanish-subjuntivo-clausulas-b2-guide',
        'spanish-contraste-tiempos-b2-guide',
        'spanish-pasiva-impersonales-b2-guide',
        'spanish-b2-integrated-assessment-guide',
      ],
      games: [
        'spanish-verb-game-mixed',
        'spanish-verb-race',
        'spanish-verb-conjugation-matching',
      ],
      vocabulary: [
        'spanish-common-verbs-flashcards',
        'spanish-numbers-flashcards',
      ],
    },
    order: 2,
  },
  {
    id: 'notebook-spanish-advanced',
    subjectKey: 'spanish',
    name: 'Advanced',
    tagline: 'C1–C2 nuance, precision, capstone, and ESOL-teacher bridge',
    emoji: '🏔️',
    content: {
      guides: [
        'spanish-register-control-c1-guide',
        'spanish-conectores-persuasion-c1-guide',
        'spanish-c1-production-lab-guide',
        'spanish-matices-pragmaticos-c2-guide',
        'spanish-precision-lab-c2-guide',
        'spanish-c2-capstone-guide',
        'spanish-for-esol-teachers-guide',
      ],
      games: [],
      vocabulary: ['spanish-adjectives-flashcards'],
    },
    order: 3,
  },

  // ──────────────────────────────────────────
  // CODING
  // ──────────────────────────────────────────
  {
    id: 'notebook-coding-foundations',
    subjectKey: 'coding',
    name: 'Foundations',
    tagline: 'Core JavaScript building blocks in map order',
    emoji: '🧱',
    content: {
      guides: [
        'coding-variables-types',
        'coding-operators-expressions',
        'coding-strings-methods',
        'coding-error-handling',
      ],
      games: [
        'coding-concepts-flashcards',
        'coding-operators-flashcards',
        'coding-keywords-matching',
      ],
      vocabulary: [],
    },
    order: 1,
  },
  {
    id: 'notebook-coding-functions-control-flow',
    subjectKey: 'coding',
    name: 'Functions & Control Flow',
    tagline: 'Logic, iteration, and data transformations',
    emoji: '⚙️',
    content: {
      guides: [
        'coding-functions-parameters',
        'coding-loops-control-flow',
        'coding-arrays-objects',
      ],
      games: [
        'coding-syntax-fill-blank',
      ],
      vocabulary: [],
    },
    order: 2,
  },
  {
    id: 'notebook-coding-intermediate',
    subjectKey: 'coding',
    name: 'Intermediate',
    tagline: 'React, architecture, DOM, modules, and async workflows',
    emoji: '🚀',
    content: {
      guides: [
        'coding-react-fundamentals',
        'coding-nextjs-architecture-decision-tree',
        'coding-dom-manipulation',
        'coding-classes-oop',
        'coding-modules-imports',
        'coding-working-with-apis',
        'coding-async-promises',
      ],
      games: [],
      vocabulary: [],
    },
    order: 3,
  },
  {
    id: 'notebook-coding-advanced-engineering',
    subjectKey: 'coding',
    name: 'Advanced: Engineering',
    tagline: 'Production engineering, TS depth, and debugging systems',
    emoji: '🛠️',
    content: {
      guides: [
        'coding-git-pr-communication',
        'coding-testing-fundamentals-confidence',
        'coding-api-contract-prisma-workflow',
        'coding-debugging-production-issues',
        'coding-typescript-deep-dive',
        'coding-array-method-mastery',
        'coding-debugging-devtools',
      ],
      games: [
        'coding-array-methods-matching',
      ],
      vocabulary: [],
    },
    order: 4,
  },
  {
    id: 'notebook-coding-advanced-implementation',
    subjectKey: 'coding',
    name: 'Advanced: Implementation',
    tagline: 'Delivery mechanics from discovery through go-live',
    emoji: '🚦',
    content: {
      guides: [
        'coding-implementation-discovery-scoping',
        'coding-implementation-stakeholder-communication-system',
        'coding-implementation-planning-mechanics',
        'coding-implementation-change-management-adoption',
        'coding-implementation-uat-defect-triage',
        'coding-implementation-go-live-hypercare',
      ],
      games: [],
      vocabulary: [],
    },
    order: 5,
  },
  {
    id: 'notebook-coding-advanced-leadership',
    subjectKey: 'coding',
    name: 'Advanced: Leadership',
    tagline: 'Outcome leadership, decision quality, and interview synthesis',
    emoji: '🎯',
    content: {
      guides: [
        'coding-implementation-kpi-outcome-tracking',
        'coding-implementation-cross-functional-decision-leadership',
        'coding-js-ts-interview-prep',
      ],
      games: [],
      vocabulary: [],
    },
    order: 6,
  },
];

/** Returns notebooks for a given subject */
export function getNotebooksForSubject(subjectKey: 'spanish' | 'coding'): TopicNotebook[] {
  return TOPIC_NOTEBOOKS
    .filter((n) => n.subjectKey === subjectKey)
    .sort((a, b) => a.order - b.order);
}

/** Returns all activity IDs contained in a notebook */
export function getAllNotebookActivityIds(notebook: TopicNotebook): string[] {
  return [
    ...notebook.content.guides,
    ...notebook.content.games,
    ...notebook.content.vocabulary,
  ];
}

/** Returns total count of items in a notebook */
export function getNotebookItemCount(notebook: TopicNotebook): number {
  return (
    notebook.content.guides.length +
    notebook.content.games.length +
    notebook.content.vocabulary.length
  );
}

/** Returns all activity IDs that are contained in any notebook for a subject */
export function getNotebookedActivityIds(subjectKey: 'spanish' | 'coding'): Set<string> {
  const ids = new Set<string>();
  for (const notebook of TOPIC_NOTEBOOKS) {
    if (notebook.subjectKey === subjectKey) {
      for (const id of getAllNotebookActivityIds(notebook)) {
        ids.add(id);
      }
    }
  }
  return ids;
}
