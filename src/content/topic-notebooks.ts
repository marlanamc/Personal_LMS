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
    tagline: 'Present, future plans, preterite, imperfect, and present perfect',
    emoji: '⏱️',
    content: {
      guides: [
        'spanish-present-tense-guide',
        'spanish-immediate-future-guide',
        'spanish-preterite-tense-guide',
        'spanish-imperfect-tense-guide',
        'spanish-present-perfect-b1-guide',
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
    tagline: 'Gender, articles, adjectives, comparatives, colors, and family',
    emoji: '🎨',
    content: {
      guides: [
        'spanish-noun-gender-articles-guide',
        'spanish-adjective-agreement-guide',
        'spanish-comparatives-superlatives-guide',
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
    tagline: 'Pronunciation, questions, commands, pronouns, restaurants, and everyday phrases',
    emoji: '🗣️',
    content: {
      guides: [
        'spanish-alphabet-pronunciation-guide',
        'spanish-question-words-sentences-guide',
        'spanish-commands-polite-requests-guide',
        'spanish-object-pronouns-basics-guide',
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
    id: 'notebook-spanish-b1',
    subjectKey: 'spanish',
    name: 'B1 Bridge',
    tagline: 'Connectors, subjunctive intro, and integrated assessment',
    emoji: '🧭',
    content: {
      guides: [
        'spanish-conectores-argumentacion-b1-guide',
        'spanish-subjuntivo-intro-b1-guide',
        'spanish-b1-integrated-assessment-guide',
      ],
      games: [],
      vocabulary: [],
    },
    order: 6,
  },
  {
    id: 'notebook-spanish-b2',
    subjectKey: 'spanish',
    name: 'B2 Precision',
    tagline: 'Subjunctive clauses, tense contrast, passive structures, and assessment',
    emoji: '🧩',
    content: {
      guides: [
        'spanish-subjuntivo-clausulas-b2-guide',
        'spanish-contraste-tiempos-b2-guide',
        'spanish-pasiva-impersonales-b2-guide',
        'spanish-b2-integrated-assessment-guide',
      ],
      games: [],
      vocabulary: [],
    },
    order: 7,
  },
  {
    id: 'notebook-spanish-c1',
    subjectKey: 'spanish',
    name: 'C1 Expression',
    tagline: 'Register control, persuasive connectors, and production lab',
    emoji: '🎯',
    content: {
      guides: [
        'spanish-register-control-c1-guide',
        'spanish-conectores-persuasion-c1-guide',
        'spanish-c1-production-lab-guide',
      ],
      games: [],
      vocabulary: [],
    },
    order: 8,
  },
  {
    id: 'notebook-spanish-c2',
    subjectKey: 'spanish',
    name: 'C2 Mastery',
    tagline: 'Pragmatic nuance, precision lab, and capstone',
    emoji: '🏔️',
    content: {
      guides: [
        'spanish-matices-pragmaticos-c2-guide',
        'spanish-precision-lab-c2-guide',
        'spanish-c2-capstone-guide',
      ],
      games: [],
      vocabulary: [],
    },
    order: 9,
  },
  {
    id: 'notebook-spanish-teaching',
    subjectKey: 'spanish',
    name: 'Teaching Spanish',
    tagline: 'Applied Spanish for ESOL teachers',
    emoji: '🧑‍🏫',
    content: {
      guides: [
        'spanish-for-esol-teachers-guide',
      ],
      games: [],
      vocabulary: [],
    },
    order: 10,
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
    order: 11,
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
    name: 'Logic & Data Flow',
    tagline: 'Functions, loops, arrays, and objects in real problem-solving',
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
    id: 'notebook-coding-frontend',
    subjectKey: 'coding',
    name: 'Frontend Systems',
    tagline: 'React, Next.js architecture, DOM, classes, and modules',
    emoji: '🚀',
    content: {
      guides: [
        'coding-react-fundamentals',
        'coding-nextjs-architecture-decision-tree',
        'coding-dom-manipulation',
        'coding-classes-oop',
        'coding-modules-imports',
      ],
      games: [],
      vocabulary: [],
    },
    order: 3,
  },
  {
    id: 'notebook-coding-apis-async',
    subjectKey: 'coding',
    name: 'APIs & Async',
    tagline: 'API contracts at the client layer, async flow, and resilient error handling',
    emoji: '🌐',
    content: {
      guides: [
        'coding-working-with-apis',
        'coding-async-promises',
      ],
      games: [],
      vocabulary: [],
    },
    order: 4,
  },
  {
    id: 'notebook-coding-typescript-debug',
    subjectKey: 'coding',
    name: 'TypeScript & Debugging',
    tagline: 'Type safety, array method depth, and practical debugging',
    emoji: '🧠',
    content: {
      guides: [
        'coding-typescript-deep-dive',
        'coding-array-method-mastery',
        'coding-debugging-devtools',
      ],
      games: [
        'coding-array-methods-matching',
      ],
      vocabulary: [],
    },
    order: 5,
  },
  {
    id: 'notebook-coding-delivery-engineering',
    subjectKey: 'coding',
    name: 'Delivery Engineering',
    tagline: 'PR quality, testing strategy, API/Prisma workflows, and production triage',
    emoji: '🛠️',
    content: {
      guides: [
        'coding-git-pr-communication',
        'coding-testing-fundamentals-confidence',
        'coding-api-contract-prisma-workflow',
        'coding-debugging-production-issues',
      ],
      games: [],
      vocabulary: [],
    },
    order: 6,
  },
  {
    id: 'notebook-coding-implementation-foundations',
    subjectKey: 'coding',
    name: 'Implementation Foundations',
    tagline: 'Discovery, stakeholder systems, and planning mechanics',
    emoji: '📋',
    content: {
      guides: [
        'coding-implementation-discovery-scoping',
        'coding-implementation-stakeholder-communication-system',
        'coding-implementation-planning-mechanics',
      ],
      games: [],
      vocabulary: [],
    },
    order: 7,
  },
  {
    id: 'notebook-coding-implementation-delivery',
    subjectKey: 'coding',
    name: 'Implementation Delivery',
    tagline: 'Change adoption, UAT triage, and go-live/hypercare operations',
    emoji: '🚦',
    content: {
      guides: [
        'coding-implementation-change-management-adoption',
        'coding-implementation-uat-defect-triage',
        'coding-implementation-go-live-hypercare',
      ],
      games: [],
      vocabulary: [],
    },
    order: 8,
  },
  {
    id: 'notebook-coding-implementation-leadership',
    subjectKey: 'coding',
    name: 'Implementation Leadership',
    tagline: 'KPI-driven outcome tracking and cross-functional decision leadership',
    emoji: '🎯',
    content: {
      guides: [
        'coding-implementation-kpi-outcome-tracking',
        'coding-implementation-cross-functional-decision-leadership',
      ],
      games: [],
      vocabulary: [],
    },
    order: 9,
  },
  {
    id: 'notebook-coding-interview',
    subjectKey: 'coding',
    name: 'Interview Sprint',
    tagline: 'Consolidate JS/TS communication and problem-solving for interviews',
    emoji: '💎',
    content: {
      guides: [
        'coding-js-ts-interview-prep',
      ],
      games: [],
      vocabulary: [],
    },
    order: 10,
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
