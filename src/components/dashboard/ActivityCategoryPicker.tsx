'use client';

import React, { useState, useMemo } from 'react';
import { Gamepad2, Code } from 'lucide-react';

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

interface CategoryCardDef {
    key: string;
    name: string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;       // top section background
    iconColor: string;     // icon stroke color
}

const CATEGORY_CARDS: CategoryCardDef[] = [
    {
        key: 'spanish',
        name: 'Spanish',
        subtitle: 'Grammar · Vocabulary · Verbs',
        icon: <span className="text-3xl sm:text-4xl">🇪🇸</span>,
        bgColor: '#fdf2f8',
        iconColor: '#9d174d',
    },
    {
        key: 'coding',
        name: 'Coding',
        subtitle: 'Basics · Functions · Practice',
        icon: <Code className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#e0f2fe',
        iconColor: '#0369a1',
    },
    {
        key: 'games',
        name: 'Games',
        subtitle: 'Quick Practice',
        icon: <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#d1c4e9',
        iconColor: '#4527a0',
    },
];

interface ActivityCategoryPickerProps {
    activities: Activity[];
    completedActivityIds?: string[] | Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    canFeatureActivities?: boolean;
    defaultClassId?: string | null;
    initialFeatureAssignments?: Record<string, FeatureAssignmentState>;
    /** Initial category to open (e.g. from ?category=grammar). Must match a CATEGORY_CARDS key. */
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

        // Games: all game-type activities from Spanish and Coding
        map['games'] = activities.some((a) => {
            if (a.type !== 'game') return false;
            if (a.id?.startsWith('vocab-')) return false;
            return isSpanishActivity(a) || isCodingActivity(a);
        });

        return map;
    }, [activities]);

    const visibleCards = CATEGORY_CARDS.filter((c) => categoryHasActivities[c.key]);
    const validInitialCategory =
        initialCategory && CATEGORY_CARDS.some((c) => c.key === initialCategory) && categoryHasActivities[initialCategory]
            ? initialCategory
            : null;

    const [selectedCategory, setSelectedCategory] = useState<string | null>(() => validInitialCategory);

    // Category picker view
    if (!selectedCategory) {
        return (
            <div className="animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
                    {visibleCards.map((card, idx) => (
                        <button
                            key={card.key}
                            onClick={() => setSelectedCategory(card.key)}
                            className="category-card group flex flex-col rounded-2xl overflow-hidden bg-bg-secondary/90 border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer"
                            style={{
                                animationDelay: `${idx * 80}ms`,
                            }}
                        >
                            {/* Colored icon area */}
                            <div
                                className="flex items-center justify-center py-6 sm:py-8 transition-transform duration-300 relative"
                                style={{ backgroundColor: card.bgColor }}
                            >
                                {/* Subtle inner shadow for depth */}
                                <div className="absolute inset-0 shadow-[inset_0_-8px_12px_-8px_rgba(0,0,0,0.08)]" />
                                <span
                                    className="select-none group-hover:scale-110 transition-transform duration-300 relative z-10"
                                    style={{ color: card.iconColor }}
                                >
                                    {card.icon}
                                </span>
                            </div>

                            {/* Label area - white background */}
                            <div className="flex flex-col items-center gap-1 py-3 sm:py-4 px-2 bg-bg-secondary/90">
                                <span className="text-base sm:text-lg font-bold font-display text-text">
                                    {card.name}
                                </span>
                                <span className="text-[11px] sm:text-xs text-text-muted font-medium tracking-wide">
                                    {card.subtitle}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Activity list view for selected category
    const selectedCardDef = CATEGORY_CARDS.find((c) => c.key === selectedCategory);

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <li>
                        <button
                            onClick={() => setSelectedCategory(null)}
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
                            <span>Activities</span>
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

            {/* Filtered activity list */}
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
                    filterCategory={selectedCategory}
                />
            </React.Suspense>
        </div>
    );
}
