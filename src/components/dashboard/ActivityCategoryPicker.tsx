'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Code } from 'lucide-react';
import { UtilitySubjectPanel } from './UtilitySubjectPanel';
import { GUIDE_HUBS, type GuideHub } from '@/content/guide-hubs';
import { getNotebooksForSubject, getAllNotebookActivityIds, type TopicNotebook } from '@/content/topic-notebooks';
import { NotebookCard } from './NotebookCard';
import { NotebookDetailView } from './NotebookDetailView';

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

interface CategoryCardDef {
    key: string;
    kind: 'academic' | 'utility';
    name: string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;       // top section background
    iconColor: string;     // icon stroke color
}

// Section definitions for quick-jump nav
const ACADEMIC_SECTIONS: Record<string, { label: string; emoji: string }[]> = {
    spanish: [
        { label: 'Grammar', emoji: '📖' },
        { label: 'Vocabulary', emoji: '🔤' },
        { label: 'Verbs', emoji: '🔄' },
        { label: 'Numbers', emoji: '🔢' },
    ],
    coding: [
        { label: 'Foundations', emoji: '🧱' },
        { label: 'Functions & Control Flow', emoji: '⚙️' },
        { label: 'Intermediate', emoji: '📐' },
        { label: 'Advanced', emoji: '🚀' },
        { label: 'Practice', emoji: '🎮' },
    ],
};

const normalizeSectionKey = (value: string): string =>
    value
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const resolveSectionLabelForSubject = (
    subjectKey: string | null,
    rawSection: string | null | undefined
): string | null => {
    if (!subjectKey || !rawSection) return null;
    const sections = ACADEMIC_SECTIONS[subjectKey] ?? [];
    const normalizedRawSection = normalizeSectionKey(rawSection);
    const matchedSection = sections.find(
        (section) => normalizeSectionKey(section.label) === normalizedRawSection
    );
    return matchedSection?.label ?? null;
};

const notebookMatchesSection = (
    notebook: TopicNotebook,
    subjectKey: string | null,
    sectionLabel: string
): boolean => {
    const normalizedSection = normalizeSectionKey(sectionLabel);
    const notebookText = [
        notebook.id,
        notebook.name,
        notebook.tagline,
        ...notebook.content.guides,
        ...notebook.content.games,
        ...notebook.content.vocabulary,
    ]
        .join(' ')
        .toLowerCase();

    if (subjectKey === 'spanish') {
        switch (normalizedSection) {
            case 'grammar':
                return notebook.content.guides.length > 0;
            case 'vocabulary':
                return notebook.content.vocabulary.length > 0;
            case 'verbs':
                return /(verb|conjug|ser-estar|tense|preterite|present)/.test(notebookText);
            case 'numbers':
                return /(number|count)/.test(notebookText);
            default:
                return true;
        }
    }

    if (subjectKey === 'coding') {
        switch (normalizedSection) {
            case 'foundations':
                return notebook.id.includes('foundations');
            case 'functions-and-control-flow':
            case 'functions-control-flow':
                return notebook.id.includes('functions') || notebookText.includes('control flow');
            case 'intermediate':
                return notebook.id.includes('intermediate');
            case 'advanced':
                return notebook.id.includes('advanced');
            case 'practice':
                return notebook.content.games.length > 0;
            default:
                return true;
        }
    }

    return true;
};

const CATEGORY_CARDS: CategoryCardDef[] = [
    {
        key: 'spanish',
        kind: 'academic',
        name: 'Spanish',
        subtitle: 'Grammar · Vocabulary · Verbs',
        icon: <span className="text-3xl sm:text-4xl">🇪🇸</span>,
        bgColor: 'rgba(253, 242, 248, 0.9)',
        iconColor: '#9d174d',
    },
    {
        key: 'coding',
        kind: 'academic',
        name: 'Coding',
        subtitle: 'Basics · Functions · Practice',
        icon: <Code className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: 'rgba(224, 242, 254, 0.9)',
        iconColor: '#0369a1',
    },
    {
        key: 'health',
        kind: 'utility',
        name: 'Health',
        subtitle: 'Appointments · Notes · Links',
        icon: <span className="text-3xl sm:text-4xl">🩺</span>,
        bgColor: 'rgba(236, 254, 255, 0.9)',
        iconColor: '#0e7490',
    },
    {
        key: 'job-search',
        kind: 'utility',
        name: 'Job Search',
        subtitle: 'Tasks · Resume · Links',
        icon: <span className="text-3xl sm:text-4xl">💼</span>,
        bgColor: 'rgba(245, 243, 255, 0.9)',
        iconColor: '#5b21b6',
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
    const validInitialSection = resolveSectionLabelForSubject(validInitialSubject, initialType);

    const [selectedSubject, setSelectedSubject] = useState<string | null>(() => validInitialSubject);
    const [selectedHub, setSelectedHub] = useState<GuideHub | null>(null);
    const [selectedNotebook, setSelectedNotebook] = useState<TopicNotebook | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(() => validInitialSection);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        if (!selectedSubject) {
            setSelectedSection(null);
            return;
        }

        const sectionLabels = new Set((ACADEMIC_SECTIONS[selectedSubject] ?? []).map((section) => section.label));
        const querySection = resolveSectionLabelForSubject(selectedSubject, initialType);

        setSelectedSection((current) => {
            if (current && sectionLabels.has(current)) return current;
            return querySection;
        });
    }, [initialType, selectedSubject]);

    const scrollToSection = useCallback((sectionLabel: string) => {
        const el = sectionRefs.current[sectionLabel];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);
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
            return (
                <button
                    key={card.key}
                    onClick={() => {
                        setSelectedSubject(card.key);
                        setSelectedHub(null);
                        setSelectedNotebook(null);
                    }}
                    className="category-card group flex flex-col rounded-2xl overflow-hidden bg-bg-secondary/90 border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer"
                    style={{ animationDelay: `${idx * 80}ms` }}
                >
                    <div
                        className="flex items-center justify-center py-7 sm:py-9 transition-transform duration-300 relative"
                        style={{ backgroundColor: card.bgColor }}
                    >
                        <div className="absolute inset-0 shadow-[inset_0_-8px_12px_-8px_rgba(0,0,0,0.08)]" />
                        <span
                            className="select-none group-hover:scale-110 transition-transform duration-300 relative z-10"
                            style={{ color: card.iconColor }}
                        >
                            {card.icon}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 py-3 sm:py-4 px-3 bg-bg-secondary/90">
                        <span className="text-base sm:text-lg font-bold font-display text-text">
                            {card.name}
                        </span>
                        <span className="text-[11px] sm:text-xs text-text-muted font-medium tracking-wide">
                            {card.subtitle}
                        </span>
                        {prog && prog.total > 0 && (
                            <div className="w-full mt-2 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-text-muted font-medium">{prog.completed}/{prog.total} done</span>
                                    <span className="text-[10px] font-bold" style={{ color: card.iconColor }}>{pct}%</span>
                                </div>
                                <div className="h-1 bg-border/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%`, backgroundColor: card.iconColor }}
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
                onClick={() => {
                    setSelectedSubject(card.key);
                    setSelectedHub(null);
                    setSelectedNotebook(null);
                }}
                className="category-card group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer"
                style={{
                    animationDelay: `${idx * 80}ms`,
                    background: `linear-gradient(135deg, ${card.bgColor} 0%, var(--bg-secondary) 100%)`,
                    border: `1.5px solid ${card.iconColor}30`,
                }}
            >
                <div
                    className="flex items-center justify-center py-7 sm:py-9 relative"
                    style={{ backgroundColor: `${card.iconColor}10` }}
                >
                    <div className="absolute inset-0 shadow-[inset_0_-6px_10px_-6px_rgba(0,0,0,0.06)]" />
                    <span className="select-none group-hover:scale-110 transition-transform duration-300 relative z-10 text-3xl sm:text-4xl">
                        {card.icon}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1 py-3 sm:py-4 px-3">
                    <span className="text-base sm:text-lg font-bold font-display text-text">
                        {card.name}
                    </span>
                    <span className="text-[11px] sm:text-xs font-medium tracking-wide" style={{ color: card.iconColor }}>
                        {card.subtitle}
                    </span>
                    <span
                        className="mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${card.iconColor}15`, color: card.iconColor }}
                    >
                        Personal
                    </span>
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
                            backgroundColor: selectedCardDef2 ? `${selectedCardDef2.iconColor}15` : 'var(--bg-light)',
                            border: `1.5px solid ${selectedCardDef2?.iconColor ?? 'var(--border)'}30`,
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
        const accentColor = selectedCardDef3?.iconColor ?? '#9d174d';
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
                />
            </div>
        );
    }

    // ── Activity list view for selected category ─────────────────
    const selectedCardDef = CATEGORY_CARDS.find((c) => c.key === selectedSubject);
    const isUtilitySubject = selectedCardDef?.kind === 'utility';
    const sections = selectedSubject ? ACADEMIC_SECTIONS[selectedSubject] : null;

    // Get notebooks for academic subjects
    const subjectNotebooks = (selectedSubject === 'spanish' || selectedSubject === 'coding')
        ? getNotebooksForSubject(selectedSubject as 'spanish' | 'coding')
        : [];
    const hasNotebookView = !isUtilitySubject && subjectNotebooks.length > 0;
    const filteredSubjectNotebooks =
        hasNotebookView && selectedSection
            ? subjectNotebooks.filter((notebook) =>
                notebookMatchesSection(notebook, selectedSubject, selectedSection)
            )
            : subjectNotebooks;

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
            <div className="flex items-center justify-center gap-3 mb-4 text-center">
                {selectedCardDef && (
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: selectedCardDef.bgColor, color: selectedCardDef.iconColor }}
                    >
                        {selectedCardDef.icon}
                    </div>
                )}
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
                    {selectedCardDef?.name}
                </h2>
            </div>

            {/* Quick-Jump Section Nav — Academic subjects only */}
            {!isUtilitySubject && sections && sections.length > 0 && (
                <div className="mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
                        {sections.map((section) => (
                            <button
                                key={section.label}
                                onClick={() => {
                                    if (hasNotebookView) {
                                        setSelectedSection((current) => (current === section.label ? null : section.label));
                                        return;
                                    }
                                    setSelectedSection(section.label);
                                    scrollToSection(section.label);
                                }}
                                className={`flex-shrink-0 snap-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                                    selectedSection === section.label
                                        ? 'text-white border-transparent shadow-sm'
                                        : 'border border-border/60 bg-bg-secondary/80 text-text hover:text-primary hover:border-primary/40 hover:bg-primary/5'
                                }`}
                                style={
                                    selectedSection === section.label
                                        ? { backgroundColor: selectedCardDef?.iconColor ?? 'var(--color-primary)' }
                                        : undefined
                                }
                            >
                                <span>{section.emoji}</span>
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!isUtilitySubject && subjectContext && (
                <section className="mb-6 rounded-2xl border border-border/50 bg-bg-secondary/90 p-4 sm:p-5 shadow-sm">
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
                                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:brightness-110 transition-[filter] flex items-center gap-1.5"
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
                    {filteredSubjectNotebooks.map((notebook) => (
                        <NotebookCard
                            key={notebook.id}
                            notebook={notebook}
                            accentColor={selectedCardDef?.iconColor ?? '#9d174d'}
                            completedIds={completedIdSet}
                            progressMap={progressMap ?? {}}
                            onClick={() => setSelectedNotebook(notebook)}
                        />
                    ))}
                    {selectedSection && filteredSubjectNotebooks.length === 0 && (
                        <div className="rounded-xl border border-border/60 bg-bg-secondary/80 p-4 text-sm text-text-muted">
                            No notebooks matched <span className="font-semibold text-text">{selectedSection}</span>.
                            <button
                                type="button"
                                onClick={() => setSelectedSection(null)}
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
