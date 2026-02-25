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
    id: 'notebook-spanish-tenses',
    subjectKey: 'spanish',
    name: 'Verb Tenses',
    tagline: 'Present, future plans, preterite, and imperfect',
    emoji: '⏱️',
    content: {
      guides: [
        'spanish-present-tense-guide',
        'spanish-immediate-future-guide',
        'spanish-preterite-tense-guide',
        'spanish-imperfect-tense-guide',
      ],
      games: [
        'spanish-verb-game-present-ar',
        'spanish-verb-game-present-er-ir',
        'spanish-verb-game-present-irregular',
        'spanish-verb-game-preterite',
        'spanish-verb-game-mixed',
        'spanish-verb-race',
        'spanish-verb-conjugation-matching',
      ],
      vocabulary: [
        'spanish-vocab-verbs',
        'spanish-common-verbs-flashcards',
      ],
    },
    order: 1,
  },
  {
    id: 'notebook-spanish-ser-estar',
    subjectKey: 'spanish',
    name: 'Ser vs. Estar',
    tagline: 'Master the trickiest verb pair',
    emoji: '⚖️',
    content: {
      guides: ['spanish-ser-vs-estar-guide'],
      games: ['spanish-ser-estar-fill-blank'],
      vocabulary: [],
    },
    order: 2,
  },
  {
    id: 'notebook-spanish-routines',
    subjectKey: 'spanish',
    name: 'Daily Routines',
    tagline: 'Reflexive verbs and everyday action patterns',
    emoji: '🌅',
    content: {
      guides: ['spanish-reflexive-verbs-routines-guide'],
      games: [],
      vocabulary: [],
    },
    order: 3,
  },
  {
    id: 'notebook-spanish-describing',
    subjectKey: 'spanish',
    name: 'Describing Things',
    tagline: 'Gender, articles, adjectives, colors, and family',
    emoji: '🎨',
    content: {
      guides: [
        'spanish-noun-gender-articles-guide',
        'spanish-adjective-agreement-guide',
      ],
      games: ['spanish-adjectives-flashcards'],
      vocabulary: [
        'spanish-vocab-colors',
        'spanish-vocab-family',
      ],
    },
    order: 4,
  },
  {
    id: 'notebook-spanish-conversations',
    subjectKey: 'spanish',
    name: 'Real Conversations',
    tagline: 'Pronunciation, questions, restaurants, and everyday phrases',
    emoji: '🗣️',
    content: {
      guides: [
        'spanish-alphabet-pronunciation-guide',
        'spanish-question-words-sentences-guide',
        'spanish-restaurant-conversations-guide',
      ],
      games: [],
      vocabulary: [
        'spanish-vocab-greetings',
        'spanish-vocab-everyday',
      ],
    },
    order: 5,
  },
  {
    id: 'notebook-spanish-numbers',
    subjectKey: 'spanish',
    name: 'Numbers & Counting',
    tagline: 'From zero to infinity (well, 100)',
    emoji: '🔢',
    content: {
      guides: [],
      games: [
        'spanish-numbers-game-easy',
        'spanish-numbers-game-medium',
        'spanish-numbers-game-timed',
      ],
      vocabulary: [
        'spanish-vocab-numbers',
        'spanish-numbers-flashcards',
      ],
    },
    order: 6,
  },

  // ──────────────────────────────────────────
  // CODING
  // ──────────────────────────────────────────
  {
    id: 'notebook-coding-foundations',
    subjectKey: 'coding',
    name: 'Foundations',
    tagline: 'Variables, operators, strings, and error handling',
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
    id: 'notebook-coding-functions',
    subjectKey: 'coding',
    name: 'Functions & Control Flow',
    tagline: 'Functions, loops, arrays, and objects',
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
    tagline: 'React, Next.js architecture, DOM, OOP, modules, APIs, and async',
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
    id: 'notebook-coding-advanced',
    subjectKey: 'coding',
    name: 'Advanced',
    tagline: 'Implementation strategy, Git/PR, testing, API/Prisma, production debugging, and TypeScript',
    emoji: '💎',
    content: {
      guides: [
        'coding-implementation-discovery-scoping',
        'coding-implementation-stakeholder-communication-system',
        'coding-implementation-planning-mechanics',
        'coding-implementation-change-management-adoption',
        'coding-implementation-uat-defect-triage',
        'coding-implementation-go-live-hypercare',
        'coding-implementation-kpi-outcome-tracking',
        'coding-implementation-cross-functional-decision-leadership',
        'coding-git-pr-communication',
        'coding-testing-fundamentals-confidence',
        'coding-api-contract-prisma-workflow',
        'coding-debugging-production-issues',
        'coding-typescript-deep-dive',
        'coding-array-method-mastery',
        'coding-debugging-devtools',
        'coding-js-ts-interview-prep',
      ],
      games: [
        'coding-array-methods-matching',
      ],
      vocabulary: [],
    },
    order: 4,
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
