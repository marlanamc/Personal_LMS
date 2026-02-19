'use client';

import React, { useState, useMemo } from 'react';
import { PenLine, Gamepad2, BookOpen, ClipboardList, Mic, PenTool, Volume2 } from 'lucide-react';

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
        key: 'grammar',
        name: 'Grammar',
        subtitle: 'Sentences · Rules',
        icon: <PenLine className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#c8e6c9',  // green (swapped with vocab)
        iconColor: '#2e7d32',
    },
    {
        key: 'games',
        name: 'Games',
        subtitle: 'Practice + fun',
        icon: <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#d1c4e9',
        iconColor: '#4527a0',
    },
    {
        key: 'vocabulary',
        name: 'Vocabulary',
        subtitle: 'Words · Meaning · Use',
        icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#bbdefb',  // blue (swapped with grammar)
        iconColor: '#1565c0',
    },
    {
        key: 'quizzes',
        name: 'Quizzes',
        subtitle: 'Points · Grades',
        icon: <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#ffcdd2',
        iconColor: '#c62828',
    },
    {
        key: 'speaking',
        name: 'Speaking',
        subtitle: 'Say it out loud',
        icon: <Mic className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#ffe0b2',
        iconColor: '#e65100',
    },
    {
        key: 'pronunciation',
        name: 'Pronunciation',
        subtitle: 'Sounds · minimal pairs',
        icon: <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#fbcfe8',
        iconColor: '#be185d',
    },
    {
        key: 'writing',
        name: 'Writing',
        subtitle: 'Short answers',
        icon: <PenTool className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
        bgColor: '#d7ccc8',
        iconColor: '#5d4037',
    },
];

interface ActivityCategoryPickerProps {
    activities: Activity[];
    completedActivityIds?: Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
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
    initialCategory = null,
}: ActivityCategoryPickerProps) {
    // Determine which categories actually have activities so we can hide empty ones
    const categoryHasActivities = useMemo(() => {
        const map: Record<string, boolean> = {};

        // Vocabulary: has vocab- prefixed activities
        map['vocabulary'] = activities.some((a) => a.id?.startsWith('vocab-'));

        // Grammar
        map['grammar'] = activities.some((a) => a.category === 'grammar');

        // Games
        map['games'] = activities.some((a) => {
            if (a.type !== 'game') return false;
            if (a.id?.startsWith('vocab-')) return false;
            return (
                a.id === 'numbers-game' ||
                a.id === 'countable-uncountable-nouns' ||
                a.ui === 'verb-forms' ||
                a.ui === 'verbforms' ||
                a.category === 'games'
            );
        });

        // Quizzes
        map['quizzes'] = activities.some((a) => {
            if (a.category !== 'quizzes') return false;
            try {
                const content = JSON.parse(a.content || '{}');
                return content.released === true;
            } catch {
                return false;
            }
        });

        // Speaking
        map['speaking'] = activities.some((a) => {
            if (a.category !== 'speaking') return false;
            try {
                const content = JSON.parse(a.content || '{}');
                return content.released === true;
            } catch {
                return false;
            }
        });

        // Writing
        map['writing'] = activities.some(
            (a) => a.category === 'writing' || a.category === 'writing-reading'
        );

        // Pronunciation
        map['pronunciation'] = activities.some(
            (a) => a.category === 'pronunciation' || a.ui === 'ed-pronunciation' || a.ui === 'minimal-pairs'
        );

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
                            className="category-card group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer"
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
                            <div className="flex flex-col items-center gap-1 py-3 sm:py-4 px-2 bg-white">
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
                    completedActivityIds={completedActivityIds}
                    progressMap={progressMap}
                    filterCategory={selectedCategory}
                />
            </React.Suspense>
        </div>
    );
}
