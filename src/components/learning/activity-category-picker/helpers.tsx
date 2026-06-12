'use client';

import React from 'react';
import { getAllNotebookActivityIds, type TopicNotebook } from '@/content/topic-notebooks';
import { SpanishSubjectIcon } from '@/components/icons/SpanishSubjectIcon';

export const CodingIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M14 14L6 24l8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M34 14l8 10-8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M24 16v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="18" cy="24" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="30" cy="24" r="2" fill="currentColor" opacity="0.5" />
    </svg>
);

// Re-use the Activity type shape from ActivityCategories
export interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
    content?: string;
}

export interface FeatureAssignmentState {
    assignmentId: string;
    isFeatured: boolean;
}

export const isSpanishActivity = (activity: Activity): boolean => {
    if (!activity.id || !activity.title) return false;
    const title = activity.title.toLowerCase();
    return activity.id.startsWith('spanish-') || title.includes('spanish');
};

export const isCodingActivity = (activity: Activity): boolean => {
    if (!activity.id || !activity.title) return false;
    const title = activity.title.toLowerCase();
    return (
        activity.id.startsWith('coding-') ||
        title.includes('coding') ||
        title.includes('javascript') ||
        title.includes('typescript') ||
        title.includes('js') ||
        title.includes('ts')
    );
};

export const isInSelectedSubject = (activity: Activity, subject: string): boolean => {
    const category = (activity.category || '').toLowerCase();

    if (subject === 'spanish') {
        return category === 'spanish' || isSpanishActivity(activity);
    }

    if (subject === 'coding') {
        return category === 'coding' || isCodingActivity(activity);
    }

    return false;
};

export const formatTypeLabel = (type: string): string => {
    switch (type) {
        case 'guide':
            return 'Guides';
        case 'game':
            return 'Practice Games';
        case 'quiz':
            return 'Quizzes';
        case 'vocabulary':
            return 'Vocabulary';
        default:
            return 'Mixed Items';
    }
};

export interface TopicCue {
    label: string;
    color: string;
}

export const TOPIC_CUES: Array<{ label: string; color: string; matches: RegExp[] }> = [
    { label: 'Present', color: 'var(--color-accent-mint)', matches: [/\bpresent\b/i, /\bpresente\b/i] },
    { label: 'Future', color: 'var(--color-accent-teal)', matches: [/\bfuture\b/i, /\bfuturo\b/i] },
    { label: 'Preterite', color: 'var(--color-accent-amethyst)', matches: [/\bpreterite\b/i, /\bpretérito\b/i] },
    { label: 'Imperfect', color: 'color-mix(in srgb, var(--color-accent-amethyst) 72%, var(--color-accent-sakura))', matches: [/\bimperfect\b/i, /\bimperfecto\b/i] },
    { label: 'Conditional', color: 'var(--color-accent-amethyst)', matches: [/\bconditional\b/i, /\bcondicional\b/i] },
    { label: 'Subjunctive', color: 'var(--color-accent-teal)', matches: [/\bsubjunctive\b/i, /\bsubjuntivo\b/i] },
    { label: 'Ser/Estar', color: 'var(--color-accent-mint)', matches: [/\bser\b/i, /\bestar\b/i] },
    { label: 'Vocabulary', color: 'var(--color-accent-teal)', matches: [/\bvocab/i, /\bword/i, /\bphrase/i] },
    { label: 'Numbers', color: 'var(--color-accent-teal)', matches: [/\bnumber/i, /\bcount/i] },
    { label: 'Practice', color: 'var(--color-accent-amethyst)', matches: [/\bpractice\b/i, /\bdrill\b/i, /\bgame\b/i] },
];

export const resolveTopicCue = (activity: Activity, fallbackColor: string): TopicCue => {
    const scan = `${activity.title} ${activity.description ?? ''} ${activity.category ?? ''} ${activity.ui ?? ''}`.toLowerCase();
    const matched = TOPIC_CUES.find((cue) => cue.matches.some((pattern) => pattern.test(scan)));
    if (matched) return { label: matched.label, color: matched.color };

    if (activity.ui === 'flashcard' || activity.ui === 'matching' || activity.type === 'vocabulary') {
        return { label: 'Vocabulary', color: 'var(--color-accent-teal)' };
    }
    if (activity.type === 'game') return { label: 'Practice', color: 'var(--color-accent-amethyst)' };
    if (activity.type === 'guide') return { label: 'Guide', color: 'var(--color-accent-mint)' };
    return { label: 'Activity', color: fallbackColor };
};

export const ActivityTypeGlyph = ({ type, ui, color }: { type: string; ui: string | null; color: string }) => {
    if (type === 'guide') {
        return (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color }}>
                <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14l-8-4-8 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 7h8M8 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
    }

    if (ui === 'flashcard') {
        return (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color }}>
                <rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="7" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
        );
    }

    if (ui === 'matching') {
        return (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color }}>
                <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 6h6M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color }}>
            <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M15 10v4M13 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export interface CategoryCardDef {
    key: string;
    name: string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;       // top section background
    iconColor: string;     // icon stroke color
}

export interface NotebookFilterDef {
    key: string;
    label: string;
    icon: React.ReactNode;
}

export const NotebookFilterIcon = ({ kind }: { kind: 'all' | 'guides' | 'matching' | 'flashcards' | 'fill-blank' | 'games' | 'vocabulary' }) => {
    if (kind === 'all') {
        return (
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
                <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
        );
    }
    if (kind === 'guides') {
        return (
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
                <path d="M4 4.5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 16 4.5v11A1.5 1.5 0 0 1 14.5 17h-9A1.5 1.5 0 0 1 4 15.5z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
    }
    if (kind === 'matching') {
        return (
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
                <circle cx="5" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="15" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="5" cy="15" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.4 5h5.2M7.4 15h5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
    }
    if (kind === 'flashcards') {
        return (
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
                <rect x="3" y="6" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="7" y="4" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        );
    }
    if (kind === 'fill-blank') {
        return (
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
                <path d="M3.5 5h13M3.5 10h5M11.5 10h5M3.5 15h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9 10h2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
        );
    }
    if (kind === 'games') {
        return (
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
                <rect x="2.5" y="5.5" width="15" height="9" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10H5m1-1v2M12.5 9.2v1.6M14 10h1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden>
            <path d="M4 4h8a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 8h4M8 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export const NOTEBOOK_FILTERS: NotebookFilterDef[] = [
    { key: 'all', label: 'All', icon: <NotebookFilterIcon kind="all" /> },
    { key: 'guides', label: 'Guides', icon: <NotebookFilterIcon kind="guides" /> },
    { key: 'matching', label: 'Matching', icon: <NotebookFilterIcon kind="matching" /> },
    { key: 'flashcards', label: 'Flash Cards', icon: <NotebookFilterIcon kind="flashcards" /> },
    { key: 'fill-blank', label: 'Fill in Blank', icon: <NotebookFilterIcon kind="fill-blank" /> },
    { key: 'games', label: 'Games', icon: <NotebookFilterIcon kind="games" /> },
    { key: 'vocabulary', label: 'Vocabulary', icon: <NotebookFilterIcon kind="vocabulary" /> },
];

export const normalizeFilterKey = (value: string): string =>
    value
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const resolveNotebookFilter = (rawFilter: string | null | undefined): string | null => {
    if (!rawFilter) return null;

    const aliases: Record<string, string> = {
        grammar: 'guides',
        verbs: 'guides',
        numbers: 'games',
        practice: 'games',
        vocab: 'vocabulary',
        vocabulary: 'vocabulary',
        flashcard: 'flashcards',
        flashcards: 'flashcards',
        matching: 'matching',
        'fill-in-the-blank': 'fill-blank',
        'fill-in-blank': 'fill-blank',
        'fill-blank': 'fill-blank',
        guides: 'guides',
        games: 'games',
        all: 'all',
    };

    const normalized = normalizeFilterKey(rawFilter);
    const mapped = aliases[normalized] ?? normalized;
    return NOTEBOOK_FILTERS.some((filter) => filter.key === mapped) ? mapped : null;
};

export const activityMatchesNotebookFilter = (activity: Activity, filterKey: string): boolean => {
    if (filterKey === 'all') return true;

    const ui = (activity.ui || '').toLowerCase();
    const title = `${activity.title} ${activity.description ?? ''}`.toLowerCase();
    const id = activity.id.toLowerCase();

    if (filterKey === 'guides') return activity.type === 'guide' || id.includes('guide');
    if (filterKey === 'matching') return ui === 'matching' || id.includes('matching') || title.includes('matching');
    if (filterKey === 'flashcards') {
        return ui === 'flashcard' || id.includes('flashcard') || title.includes('flashcard');
    }
    if (filterKey === 'fill-blank') {
        return ui.includes('fill') || id.includes('fill-blank') || title.includes('fill in the blank') || title.includes('fill in blank');
    }
    if (filterKey === 'games') return activity.type === 'game' || id.includes('game');
    if (filterKey === 'vocabulary') {
        return activity.type === 'vocabulary' || id.startsWith('vocab-') || id.includes('-vocab-') || title.includes('vocab');
    }
    return true;
};

export const notebookIdMatchesFilterFallback = (activityId: string, filterKey: string): boolean => {
    if (filterKey === 'all') return true;
    const id = activityId.toLowerCase();
    if (filterKey === 'guides') return id.includes('guide');
    if (filterKey === 'matching') return id.includes('matching');
    if (filterKey === 'flashcards') return id.includes('flashcard');
    if (filterKey === 'fill-blank') return id.includes('fill-blank') || id.includes('fill-in-blank');
    if (filterKey === 'games') return id.includes('game') || id.includes('matching') || id.includes('flashcard');
    if (filterKey === 'vocabulary') return id.startsWith('vocab-') || id.includes('-vocab-');
    return false;
};

export const notebookMatchesFilter = (
    notebook: TopicNotebook,
    filterKey: string,
    activityMap: Map<string, Activity>
): boolean => {
    if (filterKey === 'all') return true;
    const ids = getAllNotebookActivityIds(notebook);
    return ids.some((id) => {
        const activity = activityMap.get(id);
        if (activity) return activityMatchesNotebookFilter(activity, filterKey);
        return notebookIdMatchesFilterFallback(id, filterKey);
    });
};

export const CATEGORY_CARDS: CategoryCardDef[] = [
    {
        key: 'spanish',
        name: 'Spanish',
        subtitle: 'Grammar · Vocabulary · Verbs',
        icon: <SpanishSubjectIcon className="w-full h-full" />,
        bgColor: 'var(--color-accent-sakura-soft)',
        iconColor: 'var(--color-accent-sakura)',
    },
    {
        key: 'coding',
        name: 'Coding',
        subtitle: 'Basics · Functions · Practice',
        icon: <CodingIcon className="w-full h-full" />,
        bgColor: 'color-mix(in srgb, var(--color-accent-teal) 16%, transparent)',
        iconColor: 'var(--color-accent-teal)',
    },
];

