'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { UtilitySubjectPanel } from './UtilitySubjectPanel';
import { GUIDE_HUBS, type GuideHub } from '@/content/guide-hubs';
import { getNotebooksForSubject, getAllNotebookActivityIds, type TopicNotebook } from '@/content/topic-notebooks';
import { NotebookCard } from './NotebookCard';
import { NotebookDetailView } from './NotebookDetailView';

// Custom SVG Icons for each subject
const SpanishIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <ellipse cx="22" cy="24" rx="6" ry="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 24h28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 17h24M10 31h24" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M34 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6c-1.1 0-2.1-.3-3-.8l-3 2.8v-4.5c0-.5 0-1 0-1.5 0-1.1.4-2 1-2"
              fill="currentColor" opacity="0.2" />
        <circle cx="40" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
);

const CodingIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M14 14L6 24l8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M34 14l8 10-8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M24 16v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="18" cy="24" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="30" cy="24" r="2" fill="currentColor" opacity="0.5" />
    </svg>
);

const HealthIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M24 42s-16-10.5-16-21c0-6.1 4.9-11 11-11 3.7 0 5 1.9 5 1.9s1.3-1.9 5-1.9c6.1 0 11 4.9 11 11 0 10.5-16 21-16 21z"
              stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M8 24h8l2-6 4 12 4-12 2 6h12"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
    </svg>
);

const JobSearchIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="16" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M14 16v-4a4 4 0 014-4h4a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M6 24h28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M38 32V12m0 0l-5 5m5-5l5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="42" cy="8" r="2" fill="currentColor" opacity="0.6" />
    </svg>
);

// Re-use the Activity type shape from ActivityCategories
interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
    content?: string;
}

interface FeatureAssignmentState {
    assignmentId: string;
    isFeatured: boolean;
}

const isSpanishActivity = (activity: Activity): boolean => {
    if (!activity.id || !activity.title) return false;
    const title = activity.title.toLowerCase();
    return activity.id.startsWith('spanish-') || title.includes('spanish');
};

const isCodingActivity = (activity: Activity): boolean => {
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

const isInSelectedSubject = (activity: Activity, subject: string): boolean => {
    const category = (activity.category || '').toLowerCase();

    if (subject === 'spanish') {
        return (category === 'personal' || category === 'spanish') && isSpanishActivity(activity);
    }

    if (subject === 'coding') {
        return (category === 'personal' || category === 'coding') && isCodingActivity(activity);
    }

    return false;
};

const formatTypeLabel = (type: string): string => {
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

interface TopicCue {
    label: string;
    color: string;
}

const TOPIC_CUES: Array<{ label: string; color: string; matches: RegExp[] }> = [
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

const resolveTopicCue = (activity: Activity, fallbackColor: string): TopicCue => {
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

const ActivityTypeGlyph = ({ type, ui, color }: { type: string; ui: string | null; color: string }) => {
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

interface CategoryCardDef {
    key: string;
    kind: 'academic' | 'utility';
    name: string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;       // top section background
    iconColor: string;     // icon stroke color
}

interface NotebookFilterDef {
    key: string;
    label: string;
    icon: React.ReactNode;
}

const NotebookFilterIcon = ({ kind }: { kind: 'all' | 'guides' | 'matching' | 'flashcards' | 'fill-blank' | 'games' | 'vocabulary' }) => {
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

const NOTEBOOK_FILTERS: NotebookFilterDef[] = [
    { key: 'all', label: 'All', icon: <NotebookFilterIcon kind="all" /> },
    { key: 'guides', label: 'Guides', icon: <NotebookFilterIcon kind="guides" /> },
    { key: 'matching', label: 'Matching', icon: <NotebookFilterIcon kind="matching" /> },
    { key: 'flashcards', label: 'Flash Cards', icon: <NotebookFilterIcon kind="flashcards" /> },
    { key: 'fill-blank', label: 'Fill in Blank', icon: <NotebookFilterIcon kind="fill-blank" /> },
    { key: 'games', label: 'Games', icon: <NotebookFilterIcon kind="games" /> },
    { key: 'vocabulary', label: 'Vocabulary', icon: <NotebookFilterIcon kind="vocabulary" /> },
];

const normalizeFilterKey = (value: string): string =>
    value
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const resolveNotebookFilter = (rawFilter: string | null | undefined): string | null => {
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

const activityMatchesNotebookFilter = (activity: Activity, filterKey: string): boolean => {
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

const notebookIdMatchesFilterFallback = (activityId: string, filterKey: string): boolean => {
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

const notebookMatchesFilter = (
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

const CATEGORY_CARDS: CategoryCardDef[] = [
    {
        key: 'spanish',
        kind: 'academic',
        name: 'Spanish',
        subtitle: 'Grammar · Vocabulary · Verbs',
        icon: <SpanishIcon className="w-full h-full" />,
        bgColor: 'var(--color-accent-sakura-soft)',
        iconColor: 'var(--color-accent-sakura)',
    },
    {
        key: 'coding',
        kind: 'academic',
        name: 'Coding',
        subtitle: 'Basics · Functions · Practice',
        icon: <CodingIcon className="w-full h-full" />,
        bgColor: 'color-mix(in srgb, var(--color-accent-teal) 16%, transparent)',
        iconColor: 'var(--color-accent-teal)',
    },
    {
        key: 'health',
        kind: 'utility',
        name: 'Health & Fitness',
        subtitle: 'Appointments · Notes · Links',
        icon: <HealthIcon className="w-full h-full" />,
        bgColor: 'color-mix(in srgb, var(--color-accent-mint) 16%, transparent)',
        iconColor: 'var(--color-accent-mint)',
    },
    {
        key: 'job-search',
        kind: 'utility',
        name: 'Job Search',
        subtitle: 'Tasks · Resume · Links',
        icon: <JobSearchIcon className="w-full h-full" />,
        bgColor: 'color-mix(in srgb, var(--color-accent-amethyst) 16%, transparent)',
        iconColor: 'var(--color-accent-amethyst)',
    },
];

interface ActivityCategoryPickerProps {
    activities: Activity[];
    completedActivityIds?: string[] | Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    canFeatureActivities?: boolean;
    defaultClassId?: string | null;
    initialFeatureAssignments?: Record<string, FeatureAssignmentState>;
    /** Initial subject to open (e.g. from ?subject=spanish). Must match a CATEGORY_CARDS key. */
    initialSubject?: string | null;
    /** Backward-compatible alias for legacy ?category params. */
    initialCategory?: string | null;
    /** Optional initial section/type (e.g. ?type=vocabulary). */
    initialType?: string | null;
}

// Lazy-import ActivityCategories to avoid circular deps
const ActivityCategories = React.lazy(() =>
    import('./ActivityCategories').then(mod => ({ default: mod.ActivityCategories }))
);

export function ActivityCategoryPicker({
    activities,
    completedActivityIds,
    progressMap,
    canFeatureActivities = false,
    defaultClassId = null,
    initialFeatureAssignments = {},
    initialSubject = null,
    initialCategory = null,
    initialType = null,
}: ActivityCategoryPickerProps) {
    const completedIdSet = useMemo(
        () => completedActivityIds instanceof Set ? completedActivityIds : new Set(completedActivityIds ?? []),
        [completedActivityIds]
    );
    const activityMap = useMemo(() => new Map(activities.map((activity) => [activity.id, activity])), [activities]);
    // Determine which categories actually have activities so we can hide empty ones
    const categoryHasActivities = useMemo(() => {
        const map: Record<string, boolean> = {};

        // Spanish: activities with spanish- prefix or Spanish in title
        map['spanish'] = activities.some((a) =>
            (a.category === 'personal' || a.category?.toLowerCase() === 'spanish') && isSpanishActivity(a)
        );

        // Coding: activities with coding- prefix or coding-related titles
        map['coding'] = activities.some((a) =>
            (a.category === 'personal' || a.category?.toLowerCase() === 'coding') && isCodingActivity(a)
        );
        map['health'] = true;
        map['job-search'] = true;

        return map;
    }, [activities]);

    // Per-card progress for academic subjects
    const academicProgress = useMemo(() => {
        const getProgress = (activityId: string) => progressMap?.[activityId]?.progress ?? 0;
        const isTrackable = (a: Activity) => a.type !== 'game';
        const isCompleted = (a: Activity) => isTrackable(a) && (completedIdSet.has(a.id) || getProgress(a.id) >= 100);

        const spanishItems = activities.filter(a => isInSelectedSubject(a, 'spanish')).filter(isTrackable);
        const codingItems = activities.filter(a => isInSelectedSubject(a, 'coding')).filter(isTrackable);

        return {
            spanish: {
                completed: spanishItems.filter(isCompleted).length,
                total: spanishItems.length,
            },
            coding: {
                completed: codingItems.filter(isCompleted).length,
                total: codingItems.length,
            },
        };
    }, [activities, completedIdSet, progressMap]);

    const visibleCards = CATEGORY_CARDS.filter((c) => categoryHasActivities[c.key]);
    const requestedSubject = initialSubject ?? initialCategory;
    const validInitialSubject =
        requestedSubject && CATEGORY_CARDS.some((c) => c.key === requestedSubject) && categoryHasActivities[requestedSubject]
            ? requestedSubject
            : null;
    const validInitialFilter = resolveNotebookFilter(initialType) ?? 'all';

    const [selectedSubject, setSelectedSubject] = useState<string | null>(() => validInitialSubject);
    const [selectedHub, setSelectedHub] = useState<GuideHub | null>(null);
    const [selectedNotebook, setSelectedNotebook] = useState<TopicNotebook | null>(null);
    const [selectedNotebookFilter, setSelectedNotebookFilter] = useState<string>(validInitialFilter);
    const [showNotebookFilters, setShowNotebookFilters] = useState<boolean>(validInitialFilter !== 'all');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        if (!requestedSubject) return;
        setSelectedSubject(validInitialSubject);
        setSelectedHub(null);
        setSelectedNotebook(null);
    }, [requestedSubject, validInitialSubject]);

    useEffect(() => {
        if (!selectedSubject) {
            setSelectedNotebookFilter('all');
            setShowNotebookFilters(false);
            return;
        }
        const queryFilter = resolveNotebookFilter(initialType);
        setSelectedNotebookFilter((current) => {
            if (NOTEBOOK_FILTERS.some((filter) => filter.key === current)) return current;
            return queryFilter ?? 'all';
        });
        setShowNotebookFilters((queryFilter ?? 'all') !== 'all');
    }, [initialType, selectedSubject]);

    const subjectContext = useMemo(() => {
        if (!selectedSubject) return null;

        const subjectItems = activities.filter((activity) => isInSelectedSubject(activity, selectedSubject));
        if (subjectItems.length === 0) return null;

        const getProgress = (activityId: string) => progressMap?.[activityId]?.progress ?? 0;
        const isStarted = (activity: Activity) => completedIdSet.has(activity.id) || getProgress(activity.id) > 0;
        const isTrackable = (activity: Activity) => activity.type !== 'game';
        const isCompleted = (activity: Activity) =>
            isTrackable(activity) && (completedIdSet.has(activity.id) || getProgress(activity.id) >= 100);

        const startedItems = subjectItems.filter(isStarted);
        const trackableItems = subjectItems.filter(isTrackable);
        const completedItems = trackableItems.filter(isCompleted);
        const activeItems = trackableItems.filter((activity) => {
            const progress = getProgress(activity.id);
            return progress > 0 && progress < 100 && !completedIdSet.has(activity.id);
        });
        const practiceItems = subjectItems.filter((activity) => activity.type === 'game');
        const startedPracticeItems = practiceItems.filter(isStarted);

        const startedByType = startedItems.reduce<Record<string, number>>((acc, activity) => {
            const key = activity.type || 'other';
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        }, {});
        const preferredType = Object.entries(startedByType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

        const completionRate = trackableItems.length === 0
            ? 0
            : Math.round((completedItems.length / trackableItems.length) * 100);
        const averageProgress = startedItems.length === 0
            ? 0
            : Math.round(
                startedItems.reduce((sum, activity) => sum + getProgress(activity.id), 0) / startedItems.length
            );

        const guidesStarted = startedItems.filter((activity) => activity.type === 'guide').length;
        const gamesStarted = startedItems.filter((activity) => activity.type === 'game').length;
        const habitSummary = guidesStarted >= gamesStarted + 2
            ? 'You usually study explanation first, then move to practice.'
            : gamesStarted > guidesStarted
                ? 'You tend to jump into practice quickly, then review concepts.'
                : 'You have a balanced study rhythm between concept and practice.';

        const focusItem = trackableItems
            .filter((activity) => !isCompleted(activity))
            .sort((a, b) => {
                const aProgress = getProgress(a.id);
                const bProgress = getProgress(b.id);
                const aStarted = aProgress > 0 ? 0 : 1;
                const bStarted = bProgress > 0 ? 0 : 1;
                if (aStarted !== bStarted) return aStarted - bStarted;
                return bProgress - aProgress;
            })[0];

        const focusLabel = focusItem
            ? getProgress(focusItem.id) > 0
                ? 'Continue'
                : 'Start'
            : 'Explore';

        return {
            totalItems: subjectItems.length,
            startedItems: startedItems.length,
            completedItems: completedItems.length,
            activeItems: activeItems.length,
            practiceItems: practiceItems.length,
            startedPracticeItems: startedPracticeItems.length,
            completionRate,
            averageProgress,
            preferredTypeLabel: preferredType ? formatTypeLabel(preferredType) : 'Not enough data yet',
            habitSummary,
            focusItem,
            focusLabel,
        };
    }, [activities, completedIdSet, progressMap, selectedSubject]);

    // Category picker view
    if (!selectedSubject) {
        const learningCards = visibleCards.filter((card) => card.kind === 'academic');
        const utilityCards = visibleCards.filter((card) => card.kind === 'utility');

        const renderAcademicCard = (card: CategoryCardDef, idx: number) => {
            const prog = academicProgress[card.key as keyof typeof academicProgress];
            const pct = prog && prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
            const isHighProgress = pct >= 75;

            return (
                <button
                    key={card.key}
                    data-subject={card.key}
                    onClick={() => {
                        setSelectedSubject(card.key);
                        setSelectedHub(null);
                        setSelectedNotebook(null);
                    }}
                    className="subject-card subject-card-animate group"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    {/* Portal icon area */}
                    <div className="subject-card-portal">
                        <div className="subject-card-icon">
                            {card.icon}
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="subject-card-content">
                        <h3 className="subject-card-title">{card.name}</h3>
                        <p className="subject-card-subtitle">{card.subtitle}</p>

                        {prog && prog.total > 0 && (
                            <div className="subject-card-progress">
                                <div className="subject-card-progress-header">
                                    <span className="subject-card-progress-label">
                                        {prog.completed}/{prog.total} done
                                    </span>
                                    <span className="subject-card-progress-value">{pct}%</span>
                                </div>
                                <div className="subject-card-progress-track">
                                    <div
                                        className="subject-card-progress-fill"
                                        data-high-progress={isHighProgress}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </button>
            );
        };

        const renderUtilityCard = (card: CategoryCardDef, idx: number) => (
            <button
                key={card.key}
                data-subject={card.key}
                onClick={() => {
                    setSelectedSubject(card.key);
                    setSelectedHub(null);
                    setSelectedNotebook(null);
                }}
                className="subject-card subject-card-utility subject-card-animate group"
                style={{ animationDelay: `${idx * 100}ms` }}
            >
                {/* Portal icon area */}
                <div className="subject-card-portal">
                    <div className="subject-card-icon">
                        {card.icon}
                    </div>
                </div>

                {/* Content area */}
                <div className="subject-card-content">
                    <h3 className="subject-card-title">{card.name}</h3>
                    <p className="subject-card-subtitle">{card.subtitle}</p>
                    <span className="subject-card-badge mt-1">Personal</span>
                </div>
            </button>
        );

        return (
            <div className="animate-fade-in">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-4">
                    Subjects
                </p>

                <div className="space-y-6 max-w-2xl mx-auto">
                    {learningCards.length > 0 && (
                        <section>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted mb-2 px-1">
                                Learning
                            </p>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {learningCards.map((card, idx) => renderAcademicCard(card, idx))}
                            </div>
                        </section>
                    )}

                    {utilityCards.length > 0 && (
                        <section>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted mb-2 px-1">
                                Life
                            </p>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {utilityCards.map((card, idx) => renderUtilityCard(card, idx + learningCards.length))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        );
    }

    // ── Hub detail view ─────────────────────────────────────────
    if (selectedSubject && selectedHub) {
        const { current: refsMap } = sectionRefs;
        void refsMap; // used by ActivityCategories via ref prop
        const selectedCardDef2 = CATEGORY_CARDS.find((c) => c.key === selectedSubject);
        // Resolve guide activities for this hub
        const hubActivities = activities.filter((a) => selectedHub.guideIds.includes(a.id));

        return (
            <div className="animate-fade-in">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-5">
                    <ol className="flex items-center gap-2 text-sm font-medium text-text-muted flex-wrap">
                        <li>
                            <button
                                onClick={() => { setSelectedSubject(null); setSelectedHub(null); }}
                                className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Subjects
                            </button>
                        </li>
                        <li aria-hidden="true" className="text-border">/</li>
                        <li>
                            <button
                                onClick={() => setSelectedHub(null)}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                {selectedCardDef2?.name}
                            </button>
                        </li>
                        <li aria-hidden="true" className="text-border">/</li>
                        <li className="text-text font-semibold">{selectedHub.name}</li>
                    </ol>
                </nav>

                {/* Hub header */}
                <div className="mb-5 flex items-center gap-3">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                            backgroundColor: selectedCardDef2 ? `${selectedCardDef2.iconColor}15` : 'var(--color-bg-light)',
                            border: selectedCardDef2
                                ? `1.5px solid ${selectedCardDef2.iconColor}30`
                                : '1.5px solid var(--color-border)',
                        }}
                    >
                        {selectedHub.emoji}
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-text leading-tight">
                            {selectedHub.name}
                        </h2>
                        <p className="text-sm text-text-muted mt-0.5">{selectedHub.tagline}</p>
                    </div>
                </div>

                {/* Guide activities — notebook card rendering */}
                <React.Suspense
                    fallback={
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                    }
                >
                    <ActivityCategories
                        activities={hubActivities}
                        completedActivityIds={completedIdSet}
                        progressMap={progressMap}
                        canFeatureActivities={canFeatureActivities}
                        defaultClassId={defaultClassId}
                        initialFeatureAssignments={initialFeatureAssignments}
                        filterCategory={selectedSubject}
                        sectionRefs={sectionRefs}
                    />
                </React.Suspense>
            </div>
        );
    }

    // ── Notebook detail view (for Spanish and Coding) ─────────────────────────
    if ((selectedSubject === 'spanish' || selectedSubject === 'coding') && selectedNotebook) {
        const selectedCardDef3 = CATEGORY_CARDS.find((c) => c.key === selectedSubject);
        const accentColor = selectedCardDef3?.iconColor ?? 'var(--color-accent-sakura)';
        // Resolve all activities for this notebook
        const notebookActivityIds = getAllNotebookActivityIds(selectedNotebook);
        const notebookActivities = activities.filter((a) => notebookActivityIds.includes(a.id));

        return (
            <div className="animate-fade-in">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-5">
                    <ol className="flex items-center gap-2 text-sm font-medium text-text-muted flex-wrap">
                        <li>
                            <button
                                onClick={() => { setSelectedSubject(null); setSelectedNotebook(null); }}
                                className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Subjects
                            </button>
                        </li>
                        <li aria-hidden="true" className="text-border">/</li>
                        <li>
                            <button
                                onClick={() => setSelectedNotebook(null)}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                {selectedCardDef3?.name}
                            </button>
                        </li>
                        <li aria-hidden="true" className="text-border">/</li>
                        <li className="text-text font-semibold">{selectedNotebook.name}</li>
                    </ol>
                </nav>

                {/* Notebook header */}
                <div className="mb-6 flex items-center gap-3">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                            backgroundColor: `${accentColor}15`,
                            border: `1.5px solid ${accentColor}30`,
                        }}
                    >
                        {selectedNotebook.emoji}
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-text leading-tight">
                            {selectedNotebook.name}
                        </h2>
                        <p className="text-sm text-text-muted mt-0.5">{selectedNotebook.tagline}</p>
                    </div>
                </div>

                {/* Notebook content grouped by type */}
                <NotebookDetailView
                    notebook={selectedNotebook}
                    activities={notebookActivities}
                    completedIds={completedIdSet}
                    progressMap={progressMap ?? {}}
                    accentColor={accentColor}
                    canFeatureActivities={canFeatureActivities}
                    defaultClassId={defaultClassId}
                    initialFeatureAssignments={initialFeatureAssignments}
                />
            </div>
        );
    }

    // ── Activity list view for selected category ─────────────────
    const selectedCardDef = CATEGORY_CARDS.find((c) => c.key === selectedSubject);
    const isUtilitySubject = selectedCardDef?.kind === 'utility';

    // Get notebooks for academic subjects
    const subjectNotebooks = (selectedSubject === 'spanish' || selectedSubject === 'coding')
        ? getNotebooksForSubject(selectedSubject as 'spanish' | 'coding')
        : [];
    const hasNotebookView = !isUtilitySubject && subjectNotebooks.length > 0;
    const activeNotebookFilter = NOTEBOOK_FILTERS.some((filter) => filter.key === selectedNotebookFilter)
        ? selectedNotebookFilter
        : 'all';
    const activeNotebookFilterDef = NOTEBOOK_FILTERS.find((filter) => filter.key === activeNotebookFilter);
    const filteredSubjectNotebooks =
        hasNotebookView && activeNotebookFilter !== 'all'
            ? subjectNotebooks.filter((notebook) =>
                notebookMatchesFilter(notebook, activeNotebookFilter, activityMap)
            )
            : subjectNotebooks;
    const filteredActivityRows = (() => {
        if (!hasNotebookView || activeNotebookFilter === 'all') return [];

        const seen = new Set<string>();
        const rows: Array<{
            activity: Activity;
            notebook: TopicNotebook;
            progress: number;
            isCompleted: boolean;
        }> = [];

        for (const notebook of subjectNotebooks) {
            const notebookIds = getAllNotebookActivityIds(notebook);
            for (const id of notebookIds) {
                if (seen.has(id)) continue;
                const activity = activityMap.get(id);
                if (!activity) continue;
                if (!activityMatchesNotebookFilter(activity, activeNotebookFilter)) continue;

                seen.add(id);
                const progress = progressMap?.[id]?.progress ?? 0;
                const isCompleted = completedIdSet.has(id) || progress >= 100;
                rows.push({ activity, notebook, progress, isCompleted });
            }
        }

        return rows;
    })();

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <li>
                        <button
                            onClick={() => { setSelectedSubject(null); setSelectedHub(null); setSelectedNotebook(null); }}
                            className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer active:scale-95"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            <span>Subjects</span>
                        </button>
                    </li>
                    <li aria-hidden="true" className="text-border">/</li>
                    <li className="text-text font-semibold">{selectedCardDef?.name}</li>
                </ol>
            </nav>

            {/* Category header */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 text-center">
                <div className="flex items-center gap-3">
                    {selectedCardDef && (
                        <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: selectedCardDef.bgColor, color: selectedCardDef.iconColor }}
                        >
                            {selectedCardDef.icon}
                        </div>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
                        {selectedCardDef?.name}
                    </h2>
                </div>
                {selectedSubject === 'spanish' && (
                    <Link
                        href="/dashboard/spanish-course-map"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        View Course Map
                    </Link>
                )}
                {selectedSubject === 'coding' && (
                    <Link
                        href="/dashboard/coding-course-map"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        View Course Map
                    </Link>
                )}
            </div>

            {/* Content-type filters for academic notebooks */}
            {!isUtilitySubject && hasNotebookView && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setShowNotebookFilters((current) => !current)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-bg-surface text-text text-xs font-semibold hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 active:scale-95 cursor-pointer"
                            aria-expanded={showNotebookFilters}
                        >
                            <span>Filters</span>
                            {activeNotebookFilter !== 'all' && (
                                <span
                                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${selectedCardDef?.iconColor ?? 'var(--color-primary)'} 14%, transparent)`,
                                        color: selectedCardDef?.iconColor ?? 'var(--color-primary)',
                                    }}
                                >
                                    {activeNotebookFilterDef?.label ?? 'Active'}
                                </span>
                            )}
                            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showNotebookFilters ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" aria-hidden>
                                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {activeNotebookFilter !== 'all' && (
                            <button
                                type="button"
                                onClick={() => setSelectedNotebookFilter('all')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-border/60 bg-bg-surface text-text-muted hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {showNotebookFilters && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
                            {NOTEBOOK_FILTERS.map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => setSelectedNotebookFilter(filter.key)}
                                    className={`flex-shrink-0 snap-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                                        activeNotebookFilter === filter.key
                                            ? 'text-bg-base border-transparent shadow-sm'
                                            : 'border border-border/60 bg-bg-surface text-text hover:text-primary hover:border-primary/40 hover:bg-primary/5'
                                    }`}
                                    style={
                                        activeNotebookFilter === filter.key
                                            ? { backgroundColor: selectedCardDef?.iconColor ?? 'var(--color-primary)' }
                                            : undefined
                                    }
                                    aria-pressed={activeNotebookFilter === filter.key}
                                >
                                    <span>{filter.icon}</span>
                                    <span>{filter.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!isUtilitySubject && subjectContext && (
                <section className="mb-6 rounded-2xl border border-border-subtle bg-bg-surface p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Compact stats row */}
                        <div className="flex items-center gap-2 flex-wrap flex-1">
                            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                {subjectContext.completionRate}% complete
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-bg-light/70 border border-border/40 text-text-muted text-xs font-medium">
                                {subjectContext.startedItems} started
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-bg-light/70 border border-border/40 text-text-muted text-xs font-medium">
                                {subjectContext.activeItems} in progress
                            </span>
                            {subjectContext.practiceItems > 0 && (
                                <span className="px-2.5 py-1 rounded-full bg-bg-light/70 border border-border/40 text-text-muted text-xs font-medium">
                                    🎮 {subjectContext.startedPracticeItems}/{subjectContext.practiceItems} practice
                                </span>
                            )}
                        </div>
                        {subjectContext.focusItem && (
                            <Link
                                href={`/activity/${subjectContext.focusItem.id}`}
                                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-bg-base text-xs font-semibold hover:brightness-105 transition-[filter] flex items-center gap-1.5"
                            >
                                <span>{subjectContext.focusLabel}</span>
                                <span className="opacity-80">→</span>
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {isUtilitySubject && (selectedSubject === 'health' || selectedSubject === 'job-search') ? (
                <UtilitySubjectPanel
                    subjectKey={selectedSubject}
                    subjectName={selectedCardDef?.name || 'Subject'}
                />
            ) : subjectNotebooks.length > 0 ? (
                /* Academic subjects use Topic Notebooks */
                <div className="space-y-3">
                    {activeNotebookFilter === 'all' && filteredSubjectNotebooks.map((notebook) => (
                        <NotebookCard
                            key={notebook.id}
                            notebook={notebook}
                            accentColor={selectedCardDef?.iconColor ?? 'var(--color-accent-sakura)'}
                            completedIds={completedIdSet}
                            progressMap={progressMap ?? {}}
                            onClick={() => setSelectedNotebook(notebook)}
                        />
                    ))}
                    {activeNotebookFilter !== 'all' && filteredActivityRows.map(({ activity, notebook, progress, isCompleted }) => {
                        const baseAccent = selectedCardDef?.iconColor ?? 'var(--color-accent-sakura)';
                        const topicCue = resolveTopicCue(activity, baseAccent);
                        const visualAccent = isCompleted ? 'var(--color-accent-mint)' : topicCue.color;
                        const isGuide = activity.type === 'guide';

                        return (
                            <Link
                                key={activity.id}
                                href={`/activity/${activity.id}`}
                                className="activity-item group block relative rounded-xl overflow-hidden border border-border-subtle bg-bg-surface shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                                    style={{ backgroundColor: visualAccent }}
                                />
                                <div className="relative flex items-center gap-3 p-4 pl-5">
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${visualAccent} 14%, transparent)`,
                                            border: `1px solid color-mix(in srgb, ${visualAccent} 26%, transparent)`,
                                        }}
                                    >
                                        <ActivityTypeGlyph type={activity.type} ui={activity.ui} color={visualAccent} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm leading-snug tracking-tight transition-colors duration-300 ${isCompleted ? 'text-text-muted' : 'text-text'}`}>
                                            {activity.title}
                                        </p>
                                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1 opacity-80">
                                            {activity.description || notebook.name}
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-progress-track)' }}>
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${Math.min(progress, 100)}%`,
                                                        backgroundColor: visualAccent,
                                                        opacity: 0.9,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold" style={{ color: visualAccent }}>
                                                {isCompleted ? 'Done' : `${Math.round(progress)}%`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 flex items-center gap-2">
                                        {isGuide && (
                                            <span
                                                className="hidden sm:inline-flex text-[10px] font-bold px-2 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: `color-mix(in srgb, ${visualAccent} 12%, transparent)`,
                                                    color: visualAccent,
                                                    border: `1px solid color-mix(in srgb, ${visualAccent} 24%, transparent)`,
                                                }}
                                            >
                                                Guide
                                            </span>
                                        )}
                                        <span
                                            className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-1 rounded-full border"
                                            style={{
                                                backgroundColor: `color-mix(in srgb, ${topicCue.color} 14%, transparent)`,
                                                borderColor: `color-mix(in srgb, ${topicCue.color} 28%, transparent)`,
                                                color: topicCue.color,
                                            }}
                                        >
                                            {topicCue.label}
                                        </span>
                                        <span className="text-[10px] font-semibold px-2 py-1 rounded-full border border-border-subtle bg-bg-elevated text-text-muted whitespace-nowrap">
                                            {formatTypeLabel(activity.type)}
                                        </span>
                                        <svg
                                            className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                    {activeNotebookFilter !== 'all' && filteredActivityRows.length === 0 && (
                        <div className="rounded-xl border border-border/60 bg-bg-secondary/80 p-4 text-sm text-text-muted">
                            No activities matched <span className="font-semibold text-text">{NOTEBOOK_FILTERS.find((filter) => filter.key === activeNotebookFilter)?.label ?? activeNotebookFilter}</span>.
                            <button
                                type="button"
                                onClick={() => setSelectedNotebookFilter('all')}
                                className="ml-2 font-semibold text-primary hover:underline"
                            >
                                Show all
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <React.Suspense
                    fallback={
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                    }
                >
                    <ActivityCategories
                        activities={activities}
                        completedActivityIds={completedIdSet}
                        progressMap={progressMap}
                        canFeatureActivities={canFeatureActivities}
                        defaultClassId={defaultClassId}
                        initialFeatureAssignments={initialFeatureAssignments}
                        filterCategory={selectedSubject}
                        sectionRefs={sectionRefs}
                        guideHubs={GUIDE_HUBS.filter(h => h.subjectKey === selectedSubject)}
                        onHubSelect={setSelectedHub}
                    />
                </React.Suspense>
            )}
        </div>
    );
}
