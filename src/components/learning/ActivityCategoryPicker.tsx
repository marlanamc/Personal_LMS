'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { GUIDE_HUBS, type GuideHub } from '@/content/guide-hubs';
import { getNotebooksForSubject, getAllNotebookActivityIds, type TopicNotebook } from '@/content/topic-notebooks';
import { NotebookCard } from '@/components/dashboard/NotebookCard';
import { NotebookDetailView } from '@/components/dashboard/NotebookDetailView';
import { Activity, FeatureAssignmentState, isSpanishActivity, isCodingActivity, isInSelectedSubject, formatTypeLabel, resolveTopicCue, ActivityTypeGlyph, CategoryCardDef, NOTEBOOK_FILTERS, resolveNotebookFilter, activityMatchesNotebookFilter, notebookMatchesFilter, CATEGORY_CARDS } from './activity-category-picker/helpers';

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
    import('@/components/dashboard/ActivityCategories').then(mod => ({ default: mod.ActivityCategories }))
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

        return (
            <div className="animate-fade-in">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-4">
                    Subjects
                </p>

                <div className="space-y-6 max-w-2xl mx-auto">
                    {visibleCards.length > 0 && (
                        <section>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted mb-2 px-1">
                                Learning
                            </p>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {visibleCards.map((card, idx) => renderAcademicCard(card, idx))}
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
    // Get notebooks for academic subjects
    const subjectNotebooks = (selectedSubject === 'spanish' || selectedSubject === 'coding')
        ? getNotebooksForSubject(selectedSubject as 'spanish' | 'coding')
        : [];
    const hasNotebookView = subjectNotebooks.length > 0;
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
            {hasNotebookView && (
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

            {subjectContext && (
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

            {subjectNotebooks.length > 0 ? (
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
