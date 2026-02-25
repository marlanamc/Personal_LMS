'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Code } from 'lucide-react';
import { UtilitySubjectPanel } from './UtilitySubjectPanel';

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

const CATEGORY_CARDS: CategoryCardDef[] = [
    {
        key: 'spanish',
        kind: 'academic',
        name: 'Spanish',
        subtitle: 'Grammar · Vocabulary · Verbs',
        icon: <span className="text-3xl sm:text-4xl">🇪🇸</span>,
        bgColor: '#fdf2f8',
        iconColor: '#9d174d',
    },
    {
        key: 'coding',
        kind: 'academic',
        name: 'Coding',
        subtitle: 'Basics · Functions · Practice',
        icon: <Code className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#e0f2fe',
        iconColor: '#0369a1',
    },
    {
        key: 'health',
        kind: 'utility',
        name: 'Health',
        subtitle: 'Reminders · Forms · Notes',
        icon: <span className="text-3xl sm:text-4xl">🩺</span>,
        bgColor: '#ecfeff',
        iconColor: '#0e7490',
    },
    {
        key: 'job-search',
        kind: 'utility',
        name: 'Job Search',
        subtitle: 'Tasks · Resume · Links',
        icon: <span className="text-3xl sm:text-4xl">💼</span>,
        bgColor: '#f5f3ff',
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

    const visibleCards = CATEGORY_CARDS.filter((c) => categoryHasActivities[c.key]);
    const requestedSubject = initialSubject ?? initialCategory;
    const validInitialSubject =
        requestedSubject && CATEGORY_CARDS.some((c) => c.key === requestedSubject) && categoryHasActivities[requestedSubject]
            ? requestedSubject
            : null;

    const [selectedSubject, setSelectedSubject] = useState<string | null>(() => validInitialSubject);
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

        const renderCard = (card: CategoryCardDef, idx: number) => (
            <button
                key={card.key}
                onClick={() => setSelectedSubject(card.key)}
                className="category-card group flex flex-col rounded-2xl overflow-hidden bg-bg-secondary/90 border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer"
                style={{
                    animationDelay: `${idx * 80}ms`,
                }}
            >
                <div
                    className="flex items-center justify-center py-6 sm:py-8 transition-transform duration-300 relative"
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

                <div className="flex flex-col items-center gap-1 py-3 sm:py-4 px-2 bg-bg-secondary/90">
                    <span className="text-base sm:text-lg font-bold font-display text-text">
                        {card.name}
                    </span>
                    <span className="text-[11px] sm:text-xs text-text-muted font-medium tracking-wide">
                        {card.subtitle}
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
                                {learningCards.map(renderCard)}
                            </div>
                        </section>
                    )}

                    {utilityCards.length > 0 && (
                        <section>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted mb-2 px-1">
                                Life
                            </p>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {utilityCards.map((card, idx) => renderCard(card, idx + learningCards.length))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        );
    }

    // Activity list view for selected category
    const selectedCardDef = CATEGORY_CARDS.find((c) => c.key === selectedSubject);
    const isUtilitySubject = selectedCardDef?.kind === 'utility';

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <li>
                        <button
                            onClick={() => setSelectedSubject(null)}
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
            <div className="flex items-center justify-center gap-3 mb-6 text-center">
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

            {!isUtilitySubject && subjectContext && (
                <section className="mb-6 rounded-2xl border border-border/50 bg-bg-secondary/90 p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.12em] text-text-muted">
                            Study Snapshot
                        </h3>
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {subjectContext.completionRate}% complete
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-text-muted font-semibold">Items</p>
                            <p className="text-lg font-bold text-text">{subjectContext.totalItems}</p>
                        </div>
                        <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-text-muted font-semibold">Started</p>
                            <p className="text-lg font-bold text-text">{subjectContext.startedItems}</p>
                        </div>
                        <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-text-muted font-semibold">In Progress</p>
                            <p className="text-lg font-bold text-text">{subjectContext.activeItems}</p>
                        </div>
                        <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-text-muted font-semibold">Practice</p>
                            <p className="text-lg font-bold text-text">
                                {subjectContext.startedPracticeItems}/{subjectContext.practiceItems}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                            <p className="text-xs font-semibold text-text mb-1">Study Habit</p>
                            <p className="text-sm text-text-muted mb-2">{subjectContext.habitSummary}</p>
                            <p className="text-xs text-text-muted">
                                Preferred format: <span className="font-semibold text-text">{subjectContext.preferredTypeLabel}</span>
                            </p>
                        </div>
                        <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                            <p className="text-xs font-semibold text-text mb-1">Next Focus</p>
                            {subjectContext.focusItem ? (
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm text-text-muted line-clamp-2">
                                        {subjectContext.focusItem.title}
                                    </p>
                                    <Link
                                        href={`/activity/${subjectContext.focusItem.id}`}
                                        className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:brightness-110 transition-[filter]"
                                    >
                                        {subjectContext.focusLabel}
                                    </Link>
                                </div>
                            ) : (
                                <p className="text-sm text-text-muted">
                                    You’ve completed all tracked lessons here. Pick a practice game to reinforce.
                                </p>
                            )}
                            {subjectContext.averageProgress > 0 && (
                                <p className="text-xs text-text-muted mt-2">
                                    Average progress across started items: <span className="font-semibold text-text">{subjectContext.averageProgress}%</span>
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {isUtilitySubject && (selectedSubject === 'health' || selectedSubject === 'job-search') ? (
                <UtilitySubjectPanel
                    subjectKey={selectedSubject}
                    subjectName={selectedCardDef?.name || 'Subject'}
                />
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
                    />
                </React.Suspense>
            )}
        </div>
    );
}
