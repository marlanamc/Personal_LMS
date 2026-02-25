/**
 * Guide Topic Hubs
 *
 * Each hub groups one or more related guide activities into a named topic.
 * Hubs are displayed as notebook-cover cards within subject sections,
 * replacing individual flat guide listings.
 *
 * sectionLabel must match the subCategory name in ActivityCategories.tsx.
 */

export interface GuideHub {
    id: string;
    subjectKey: 'spanish' | 'coding';
    /** Which section this hub appears in (must match subCategory.name) */
    sectionLabel: string;
    name: string;
    tagline: string;
    emoji: string;
    /** Ordered list of activity IDs included in this hub */
    guideIds: string[];
}

export const GUIDE_HUBS: GuideHub[] = [
    // ──────────────────────────────────────────
    // SPANISH
    // ──────────────────────────────────────────
    {
        id: 'hub-spanish-present-tense',
        subjectKey: 'spanish',
        sectionLabel: 'Grammar',
        name: 'The Present Tense',
        tagline: "How to talk about what's happening now",
        emoji: '⏱️',
        guideIds: ['spanish-present-tense-guide'],
    },
    {
        id: 'hub-spanish-ser-estar',
        subjectKey: 'spanish',
        sectionLabel: 'Grammar',
        name: 'Ser vs. Estar',
        tagline: 'The trickiest verb pair in Spanish',
        emoji: '⚖️',
        guideIds: ['spanish-ser-vs-estar-guide'],
    },
    {
        id: 'hub-spanish-adjectives',
        subjectKey: 'spanish',
        sectionLabel: 'Grammar',
        name: 'Describing Things',
        tagline: 'Adjectives that agree with nouns',
        emoji: '🎨',
        guideIds: ['spanish-adjective-agreement-guide'],
    },
    {
        id: 'hub-spanish-preterite',
        subjectKey: 'spanish',
        sectionLabel: 'Grammar',
        name: 'The Preterite Tense',
        tagline: 'How to talk about completed past events',
        emoji: '📅',
        guideIds: ['spanish-preterite-tense-guide'],
    },
    {
        id: 'hub-spanish-conversations',
        subjectKey: 'spanish',
        sectionLabel: 'Grammar',
        name: 'Real Conversations',
        tagline: 'Order food, ask questions, talk to people',
        emoji: '🗣️',
        guideIds: ['spanish-restaurant-conversations-guide'],
    },

    // ──────────────────────────────────────────
    // CODING — Foundations
    // ──────────────────────────────────────────
    {
        id: 'hub-coding-variables',
        subjectKey: 'coding',
        sectionLabel: 'Foundations',
        name: 'Variables & Data',
        tagline: 'Store and name information in your code',
        emoji: '📦',
        guideIds: ['coding-variables-types'],
    },
    {
        id: 'hub-coding-operators',
        subjectKey: 'coding',
        sectionLabel: 'Foundations',
        name: 'Math & Logic',
        tagline: 'Operators, expressions, and comparisons',
        emoji: '🔢',
        guideIds: ['coding-operators-expressions'],
    },
    {
        id: 'hub-coding-strings',
        subjectKey: 'coding',
        sectionLabel: 'Foundations',
        name: 'Working with Text',
        tagline: 'Strings, templates, and string methods',
        emoji: '✍️',
        guideIds: ['coding-strings-methods'],
    },
    {
        id: 'hub-coding-errors',
        subjectKey: 'coding',
        sectionLabel: 'Foundations',
        name: 'Error Handling',
        tagline: 'Catch mistakes before they crash your app',
        emoji: '🛡️',
        guideIds: ['coding-error-handling'],
    },

    // ──────────────────────────────────────────
    // CODING — Functions & Control Flow
    // ──────────────────────────────────────────
    {
        id: 'hub-coding-functions',
        subjectKey: 'coding',
        sectionLabel: 'Functions & Control Flow',
        name: 'Functions',
        tagline: 'Write reusable, organized blocks of code',
        emoji: '⚙️',
        guideIds: ['coding-functions-parameters'],
    },
    {
        id: 'hub-coding-loops',
        subjectKey: 'coding',
        sectionLabel: 'Functions & Control Flow',
        name: 'Loops & Control Flow',
        tagline: 'Repeat actions and make decisions',
        emoji: '🔁',
        guideIds: ['coding-loops-control-flow'],
    },
    {
        id: 'hub-coding-arrays',
        subjectKey: 'coding',
        sectionLabel: 'Functions & Control Flow',
        name: 'Arrays & Objects',
        tagline: 'Work with collections and structured data',
        emoji: '📋',
        guideIds: ['coding-arrays-objects'],
    },

    // ──────────────────────────────────────────
    // CODING — Intermediate
    // ──────────────────────────────────────────
    {
        id: 'hub-coding-dom',
        subjectKey: 'coding',
        sectionLabel: 'Intermediate',
        name: 'The DOM',
        tagline: 'Connect JavaScript to web pages',
        emoji: '🌐',
        guideIds: ['coding-dom-manipulation'],
    },
    {
        id: 'hub-coding-oop',
        subjectKey: 'coding',
        sectionLabel: 'Intermediate',
        name: 'Classes & OOP',
        tagline: 'Organize complex code with objects',
        emoji: '🏗️',
        guideIds: ['coding-classes-oop'],
    },
    {
        id: 'hub-coding-modules',
        subjectKey: 'coding',
        sectionLabel: 'Intermediate',
        name: 'Modules & Imports',
        tagline: 'Split your code across files cleanly',
        emoji: '📁',
        guideIds: ['coding-modules-imports'],
    },
    {
        id: 'hub-coding-apis',
        subjectKey: 'coding',
        sectionLabel: 'Intermediate',
        name: 'Working with APIs',
        tagline: 'Fetch and use data from the internet',
        emoji: '🔌',
        guideIds: ['coding-working-with-apis'],
    },
    {
        id: 'hub-coding-async',
        subjectKey: 'coding',
        sectionLabel: 'Intermediate',
        name: 'Async & Promises',
        tagline: 'Handle timing and asynchronous code',
        emoji: '⏳',
        guideIds: ['coding-async-promises'],
    },

    // ──────────────────────────────────────────
    // CODING — Advanced
    // ──────────────────────────────────────────
    {
        id: 'hub-coding-typescript',
        subjectKey: 'coding',
        sectionLabel: 'Advanced',
        name: 'TypeScript',
        tagline: 'Add types and safety to your JavaScript',
        emoji: '🔷',
        guideIds: ['coding-typescript-deep-dive'],
    },
    {
        id: 'hub-coding-array-methods',
        subjectKey: 'coding',
        sectionLabel: 'Advanced',
        name: 'Array Method Mastery',
        tagline: 'Master map, filter, reduce and more',
        emoji: '⚡',
        guideIds: ['coding-array-method-mastery'],
    },
    {
        id: 'hub-coding-debugging',
        subjectKey: 'coding',
        sectionLabel: 'Advanced',
        name: 'Debugging & DevTools',
        tagline: 'Find and fix bugs like a pro',
        emoji: '🔍',
        guideIds: ['coding-debugging-devtools'],
    },
];

/** Returns hubs for a given subject + section */
export function getHubsForSection(subjectKey: 'spanish' | 'coding', sectionLabel: string): GuideHub[] {
    return GUIDE_HUBS.filter(
        (h) => h.subjectKey === subjectKey && h.sectionLabel === sectionLabel
    );
}

/** Returns all guide IDs that are contained in any hub for a subject */
export function getHubbedGuideIds(subjectKey: 'spanish' | 'coding'): Set<string> {
    const ids = new Set<string>();
    for (const hub of GUIDE_HUBS) {
        if (hub.subjectKey === subjectKey) {
            for (const id of hub.guideIds) ids.add(id);
        }
    }
    return ids;
}
