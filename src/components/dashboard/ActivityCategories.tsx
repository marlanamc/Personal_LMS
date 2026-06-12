'use client';

import React, { useState, useCallback, useMemo } from "react";
import { resolveActivityGameUi } from "@/lib/activity-ui";
import { SPANISH_GUIDE_IDS, SPANISH_VOCAB_ACTIVITY_IDS, SPANISH_VERB_ACTIVITY_IDS, SPANISH_NUMBERS_ACTIVITY_IDS } from "@/content/spanish/registry";
import { CODING_FOUNDATIONS_GUIDE_IDS, CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS, CODING_INTERMEDIATE_GUIDE_IDS, CODING_ADVANCED_GUIDE_IDS, CODING_GAME_IDS } from "@/content/coding/registry";
import { type Activity, type SubCategory, type Category, type ActivityCategoriesProps } from "./activity-categories/types";
import { isSpanishActivity, isCodingActivity, isInPersonalTrackCategory, isTrackGameActivity, isLearnerFacingSpanishGame, sortBySuggestedOrder, displayTitle, getSubCategoryCount, getCategoryCount, isPronunciationPracticeActivity, getDisplayProgress, isActivityCompleted, SPANISH_LEGACY_GAME_ID_SET } from "./activity-categories/helpers";
import { getActivityTexture, getSectionTexture } from "./activity-categories/textures";
import { ActivityCard } from "./activity-categories/ActivityCard";

export const ActivityCategories = React.memo(function ActivityCategories({
    activities,
    completedActivityIds = [],
    progressMap,
    showEmpty = false,
    filterCategory,
    canFeatureActivities = false,
    defaultClassId = null,
    initialFeatureAssignments = {},
    sectionRefs,
    guideHubs,
    onHubSelect,
}: ActivityCategoriesProps) {
    const completedIdSet = useMemo(
        () => completedActivityIds instanceof Set ? completedActivityIds : new Set(completedActivityIds),
        [completedActivityIds]
    );
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
    const [featureAssignments, setFeatureAssignments] = useState<Record<string, { assignmentId: string; isFeatured: boolean }>>(
        initialFeatureAssignments
    );
    const [featurePendingId, setFeaturePendingId] = useState<string | null>(null);

    const toggleCategory = useCallback((categoryName: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryName)) next.delete(categoryName);
            else next.add(categoryName);
            return next;
        });
    }, []);

    const toggleSubCategory = useCallback((subCategoryKey: string) => {
        setExpandedSubCategories(prev => {
            const next = new Set(prev);
            if (next.has(subCategoryKey)) next.delete(subCategoryKey);
            else next.add(subCategoryKey);
            return next;
        });
    }, []);

    const toggleFeatured = useCallback(async (activity: Activity) => {
        if (!canFeatureActivities) return;
        const existing = featureAssignments[activity.id];

        if (!existing && !defaultClassId) {
            return;
        }

        setFeaturePendingId(activity.id);
        try {
            if (existing) {
                const response = await fetch('/api/assignments', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        assignmentId: existing.assignmentId,
                        isFeatured: !existing.isFeatured,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update featured state');
                }

                const updated = await response.json() as { id: string; isFeatured: boolean };
                setFeatureAssignments(prev => ({
                    ...prev,
                    [activity.id]: {
                        assignmentId: updated.id,
                        isFeatured: updated.isFeatured,
                    },
                }));
                return;
            }

            const response = await fetch('/api/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classId: defaultClassId,
                    activityId: activity.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create featured assignment');
            }

            const created = await response.json() as { id: string; isFeatured: boolean };
            setFeatureAssignments(prev => ({
                ...prev,
                [activity.id]: {
                    assignmentId: created.id,
                    isFeatured: created.isFeatured ?? true,
                },
            }));
        } catch (error) {
            console.error('Failed to toggle featured activity', error);
        } finally {
            setFeaturePendingId(null);
        }
    }, [canFeatureActivities, defaultClassId, featureAssignments]);

    const _buildGrammarSubCategories = useCallback((): SubCategory[] => {
        const grammarActivities = activities.filter((a: Activity) => a.category === "grammar");

        const normalizeTitle = (title?: string | null) => displayTitle(title || "").toLowerCase();

        const sortAlpha = (list: Activity[]) =>
            list.sort((a, b) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")));

        const sortByTenseOrder = (list: Activity[]) => {
            const order = ["present", "past", "future", "review"];
            const getOrder = (t: string) => {
                for (let i = 0; i < order.length; i++) {
                    if (t.includes(order[i])) return i;
                }
                return order.length;
            };

            return list.sort((a, b) => {
                const aNorm = normalizeTitle(a.title);
                const bNorm = normalizeTitle(b.title);
                const aIdx = getOrder(aNorm);
                const bIdx = getOrder(bNorm);
                if (aIdx !== bIdx) return aIdx - bIdx;
                return displayTitle(a.title || "").localeCompare(displayTitle(b.title || ""));
            });
        };

        const sortByKeywordOrder = (list: Activity[], keywordsInOrder: string[]) => {
            const getKeywordIndex = (t: string) => {
                for (let i = 0; i < keywordsInOrder.length; i++) {
                    if (t.includes(keywordsInOrder[i])) return i;
                }
                return keywordsInOrder.length;
            };

            return list.sort((a: Activity, b: Activity) => {
                const aNorm = normalizeTitle(a.title);
                const bNorm = normalizeTitle(b.title);
                const aIdx = getKeywordIndex(aNorm);
                const bIdx = getKeywordIndex(bNorm);
                if (aIdx !== bIdx) return aIdx - bIdx;
                return displayTitle(a.title || "").localeCompare(displayTitle(b.title || ""));
            });
        };

        const remaining = [...grammarActivities];
        const take = (predicate: (a: Activity) => boolean) => {
            const matched: Activity[] = [];
            for (let i = remaining.length - 1; i >= 0; i--) {
                const item = remaining[i];
                if (predicate(item)) {
                    matched.push(item);
                    remaining.splice(i, 1);
                }
            }
            return matched.reverse();
        };

        const simple = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("simple") && !t.includes("vs");
            })
        );

        const perfectContinuous = sortByTenseOrder(take((a: Activity) => normalizeTitle(a.title).includes("perfect continuous")));

        const continuous = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("continuous") && !t.includes("perfect continuous") && !t.includes("vs");
            })
        );

        const perfect = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("perfect") && !t.includes("continuous") && !t.includes("vs");
            })
        );

        const mixedAllTenses = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                // Exclude gerund/infinitive activities from tenses
                if (t.includes("gerund") || t.includes("infinitive")) return false;
                return t.includes("tenses") || t.includes("review") || t.includes(" vs ");
            })
        );

        const questionsAndCommands = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("question") || t.includes("imperative") || t.includes("declarative");
            }),
            ["information questions", "imperatives", "declaratives"]
        );

        const conditionals = sortByKeywordOrder(
            take((a: Activity) => normalizeTitle(a.title).includes("conditional")),
            ["zero", "first", "second", "third"]
        );
        const modals = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes("modal")));
        const habitsAndPreferences = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("used to") || t.includes("would rather");
            })
        );

        const voiceAndReporting = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("passive") || t.includes("reported");
            }),
            ["passive", "reported"]
        );

        const gerundsAndInfinitives = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("gerund") || t.includes("infinitive");
            }),
            ["infinitives vs gerunds", "verbs + gerunds", "gerunds after prepositions"]
        );

        const phrasalVerbs = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes("phrasal")));

        const wordsAndQuantity = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("parts of speech") || t.includes("superlative") || t.includes("quantifier");
            }),
            ["parts of speech", "superlatives", "quantifiers"]
        );

        const writingMechanics = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("punctuation") || t.includes("capitalization") || t.includes("paragraph");
            }),
            ["punctuation", "capitalization", "paragraph"]
        );

        const otherGrammar = sortAlpha(remaining);

        return [
            {
                name: "Tenses",
                activities: [],
                subCategories: [
                    { name: "Simple", activities: simple },
                    { name: "Continuous", activities: continuous },
                    { name: "Perfect", activities: perfect },
                    { name: "Perfect Continuous", activities: perfectContinuous },
                    { name: "Reviews & Mixed", activities: mixedAllTenses },
                ]
            },
            {
                name: "Questions, Modals & Communication",
                activities: [
                    ...questionsAndCommands,
                    ...modals,
                    ...voiceAndReporting
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Gerunds & Infinitives",
                activities: gerundsAndInfinitives
            },
            {
                name: "Verbs & Patterns",
                activities: [
                    ...phrasalVerbs,
                    ...habitsAndPreferences
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Conditionals",
                activities: conditionals
            },
            {
                name: "Describing & Comparing",
                activities: wordsAndQuantity.sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Writing Basics",
                activities: [
                    ...writingMechanics,
                    ...otherGrammar
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
        ];
    }, [activities]);

    const categories = useMemo<Category[]>(() => [
            {
                name: 'Spanish',
                color: '#ec4899', // pink
                subCategories: [
                    {
                        name: 'Grammar',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isInPersonalTrackCategory(a, 'spanish') &&
                                    isSpanishActivity(a) &&
                                    a.type === 'guide'
                            ),
                            [...SPANISH_GUIDE_IDS]
                        )
                    },
                    {
                        name: 'Vocabulary',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isLearnerFacingSpanishGame(a) &&
                                    isSpanishActivity(a) &&
                                    (a.id?.includes('vocab') || a.id?.includes('flashcard'))
                            ),
                            SPANISH_VOCAB_ACTIVITY_IDS.filter((id) => !SPANISH_LEGACY_GAME_ID_SET.has(id))
                        )
                    },
                    {
                        name: 'Verbs',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isLearnerFacingSpanishGame(a) &&
                                    isSpanishActivity(a) &&
                                    (a.id?.includes('verb-game') || a.id?.includes('verb-race') || a.id?.includes('verb-conjugation') || a.id?.includes('ser-estar'))
                            ),
                            SPANISH_VERB_ACTIVITY_IDS.filter((id) => !SPANISH_LEGACY_GAME_ID_SET.has(id))
                        )
                    },
                    {
                        name: 'Numbers',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isLearnerFacingSpanishGame(a) &&
                                    isSpanishActivity(a) &&
                                    a.id?.includes('numbers-game')
                            ),
                            [...SPANISH_NUMBERS_ACTIVITY_IDS]
                        )
                    }
                ],
                activities: []
            },
            {
                name: 'Coding',
                color: '#0ea5e9', // sky blue
                subCategories: [
                    {
                        name: 'Foundations',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isInPersonalTrackCategory(a, 'coding') &&
                                    isCodingActivity(a) &&
                                    [...CODING_FOUNDATIONS_GUIDE_IDS].includes(a.id as typeof CODING_FOUNDATIONS_GUIDE_IDS[number])
                            ),
                            [...CODING_FOUNDATIONS_GUIDE_IDS]
                        )
                    },
                    {
                        name: 'Functions & Control Flow',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isInPersonalTrackCategory(a, 'coding') &&
                                    isCodingActivity(a) &&
                                    [...CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS].includes(a.id as typeof CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS[number])
                            ),
                            [...CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS]
                        )
                    },
                    {
                        name: 'Intermediate',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isInPersonalTrackCategory(a, 'coding') &&
                                    isCodingActivity(a) &&
                                    [...CODING_INTERMEDIATE_GUIDE_IDS].includes(a.id as typeof CODING_INTERMEDIATE_GUIDE_IDS[number])
                            ),
                            [...CODING_INTERMEDIATE_GUIDE_IDS]
                        )
                    },
                    {
                        name: 'Advanced',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) =>
                                    isInPersonalTrackCategory(a, 'coding') &&
                                    isCodingActivity(a) &&
                                    [...CODING_ADVANCED_GUIDE_IDS].includes(a.id as typeof CODING_ADVANCED_GUIDE_IDS[number])
                            ),
                            [...CODING_ADVANCED_GUIDE_IDS]
                        )
                    },
                    {
                        name: 'Practice',
                        activities: sortBySuggestedOrder(
                            activities.filter(
                                (a: Activity) => isTrackGameActivity(a) && isCodingActivity(a)
                            ),
                            [...CODING_GAME_IDS]
                        )
                    }
                ],
                activities: []
            }
        ], [activities]);

    const filteredCategories = useMemo(() => {
        let result = categories;

        // When filtering to a single category, find it by name (case-insensitive)
        if (filterCategory) {
            result = result.filter(cat => cat.name.toLowerCase() === filterCategory.toLowerCase());
        }

        if (!showEmpty) {
            result = result
                .map(category => {
                    const filteredSubCategories = category.subCategories
                        ? category.subCategories
                            .map(sub => ({
                                ...sub,
                                subCategories: sub.subCategories
                                    ? sub.subCategories.filter(subSub => (subSub.activities?.length || 0) > 0)
                                    : undefined
                            }))
                            .filter(sub => getSubCategoryCount(sub) > 0)
                        : undefined;

                    return {
                        ...category,
                        subCategories: filteredSubCategories
                    };
                })
                .filter(cat => getCategoryCount(cat) > 0);
        }

        return result;
    }, [categories, showEmpty, filterCategory]);

    const renderActivityCard = useCallback((activity: Activity, accentColor?: string, hideTypeChip?: boolean, sectionLabel?: string) => {
        const progressValue = getDisplayProgress(activity, progressMap);
        const isCompleted = isActivityCompleted(activity, completedIdSet, progressMap);
        const featureState = featureAssignments[activity.id];

        // Get texture for any activity type using the universal texture system
        const texture = getActivityTexture(activity, sectionLabel);
        const gameUi = activity.type === 'game' ? resolveActivityGameUi(activity) : undefined;

        return (
            <ActivityCard
                key={activity.id}
                activity={activity}
                isCompleted={isCompleted}
                progressValue={progressValue}
                progressMap={progressMap}
                accentColor={accentColor}
                hideTypeChip={hideTypeChip}
                gameUi={gameUi}
                points={undefined}
                tenseTexture={texture}
                isFeatured={featureState?.isFeatured ?? false}
                canFeature={canFeatureActivities}
                featureDisabled={featurePendingId === activity.id || (!featureState && !defaultClassId)}
                onToggleFeature={toggleFeatured}
            />
        );
    }, [completedIdSet, progressMap, featureAssignments, canFeatureActivities, featurePendingId, defaultClassId, toggleFeatured]);

    // Soft palette for section accents
    const SECTION_COLORS = ['#A3D9A5', '#A5C9E1', '#C5B3E6', '#F4B0B7', '#89CFF0', '#F0E68C'];

    // When filtering to a single category, render ALL activities in a flat list (no accordions)
    if (filterCategory && filteredCategories.length > 0) {
        const category = filteredCategories[0];

        // Collect all activities from every level into a flat list with optional group labels
        const sections: { label?: string; rawLabel?: string; activities: Activity[] }[] = [];

        if (category.subCategories) {
            for (const sub of category.subCategories) {
                if (sub.subCategories) {
                    // E.g. Grammar → Tenses → Simple/Continuous/Perfect
                    for (const subSub of sub.subCategories) {
                        if (subSub.activities.length > 0) {
                            sections.push({
                                label: subSub.name,
                                rawLabel: `${sub.name} — ${subSub.name}`,
                                activities: subSub.activities,
                            });
                        }
                    }
                }
                if (sub.activities.length > 0) {
                    sections.push({
                        label: sub.name,
                        activities: sub.activities,
                    });
                }
            }
        }

        if (category.activities.length > 0) {
            sections.push({ activities: category.activities });
        }

        if (sections.length === 0) {
            return (
                <p className="text-text-muted text-center py-8 text-sm">No activities yet</p>
            );
        }

        // Calculate total stats
        const allActivities = sections.flatMap(s => s.activities);
        const totalCount = allActivities.length;
        const completedCount = allActivities.filter(a =>
            isActivityCompleted(a, completedIdSet, progressMap)
        ).length;
        const hasTrackableItems = allActivities.some(
            (activity) => activity.type !== "game" && !isPronunciationPracticeActivity(activity)
        );

        return (
            <div className="animate-fade-in">
                {/* Visual grouping header summary - hidden for play-only groups. */}
                {hasTrackableItems && (
                    <div className="mb-6 pb-2 border-b border-border/20 flex items-center justify-between">
                        <p className="text-xs font-bold text-text-muted/80 uppercase tracking-widest">
                            {totalCount} items
                        </p>
                        <div className="flex items-center gap-3">
                            <p className="text-xs font-bold text-secondary">
                                {completedCount} / {totalCount} done
                            </p>
                            <div className="w-24 h-1.5 bg-border/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-secondary transition-all duration-500"
                                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {sections.map((section, sIdx) => {
                        // Get section texture for any category type
                        const sectionTexture = section.label
                            ? getSectionTexture(section.label, filterCategory)
                            : null;
                        const accentColor = sectionTexture?.color || SECTION_COLORS[sIdx % SECTION_COLORS.length];

                        // Sort: Incomplete first, then completed at the bottom
                        const sortedActivities = [...section.activities].sort((a, b) => {
                            const aDone = isActivityCompleted(a, completedIdSet, progressMap);
                            const bDone = isActivityCompleted(b, completedIdSet, progressMap);
                            if (aDone && !bDone) return 1;
                            if (!aDone && bDone) return -1;
                            return 0;
                        });

                        // Count completed in this section
                        const sectionCompleted = sortedActivities.filter(a =>
                            isActivityCompleted(a, completedIdSet, progressMap)
                        ).length;
                        const sectionTotal = sortedActivities.length;
                        const sectionHasTrackableItems = sortedActivities.some(
                            (activity) => activity.type !== "game" && !isPronunciationPracticeActivity(activity)
                        );
                        const shouldUseGameGrid = sortedActivities.every((activity) => activity.type === "game");

                        return (
                            <div key={section.rawLabel || section.label || sIdx} className="space-y-3">
                                {section.label && (
                                    <div
                                        ref={(el) => {
                                            if (sectionRefs?.current && section.label) {
                                                sectionRefs.current[section.label] = el;
                                            }
                                        }}
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl"
                                        style={{
                                            backgroundColor: sectionTexture
                                                ? `color-mix(in srgb, ${sectionTexture.color} 10%, transparent)`
                                                : 'transparent',
                                            borderLeft: `3px solid ${accentColor}`,
                                        }}
                                    >
                                        {/* Category icon indicator */}
                                        {sectionTexture ? (
                                            <span
                                                className="text-base font-medium select-none"
                                                style={{ color: sectionTexture.color }}
                                                title={sectionTexture.id}
                                            >
                                                {sectionTexture.icon}
                                            </span>
                                        ) : null}
                                        <p
                                            className="text-sm font-extrabold uppercase tracking-[0.16em]"
                                            style={{ color: sectionTexture ? sectionTexture.color : 'var(--color-text)' }}
                                        >
                                            {section.label}
                                        </p>
                                        {sectionHasTrackableItems && (
                                            <span
                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                                                style={{
                                                    backgroundColor: sectionTexture ? `${sectionTexture.color}08` : 'transparent',
                                                    borderColor: sectionTexture ? `${sectionTexture.color}25` : 'rgba(200, 200, 200, 0.4)',
                                                    color: sectionTexture ? sectionTexture.color : 'var(--color-text-muted)'
                                                }}
                                            >
                                                {sectionCompleted}/{sectionTotal}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {(() => {
                                    // Determine which guide activities are covered by a hub in this section
                                    const sectionHubs = guideHubs && section.label
                                        ? guideHubs.filter(h => h.sectionLabel === section.label)
                                        : [];
                                    const hubbedIds = new Set(sectionHubs.flatMap(h => h.guideIds));

                                    // Activities NOT covered by a hub (or when no hubs provided)
                                    const nonHubActivities = sectionHubs.length > 0
                                        ? sortedActivities.filter(a => a.type !== 'guide' || !hubbedIds.has(a.id))
                                        : sortedActivities;

                                    return (
                                        <div className={`space-y-2.5 ${shouldUseGameGrid ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 space-y-0' : ''}`}>
                                            {/* Render hub cards for guide activities */}
                                            {sectionHubs.map((hub) => {
                                                // Check if any of this hub's guides are completed / in progress
                                                const hubGuideActivities = sortedActivities.filter(a => hub.guideIds.includes(a.id));
                                                const hubCompleted = hubGuideActivities.filter(a =>
                                                    isActivityCompleted(a, completedIdSet, progressMap)
                                                ).length;
                                                const hubTotal = hubGuideActivities.length;
                                                const firstGuide = hubGuideActivities[0];
                                                const firstProgress = firstGuide ? (progressMap?.[firstGuide.id]?.progress ?? 0) : 0;
                                                const isHubDone = hubTotal > 0 && hubCompleted === hubTotal;

                                                return (
                                                    <button
                                                        key={hub.id}
                                                        type="button"
                                                        onClick={() => onHubSelect?.(hub)}
                                                        className="group w-full text-left relative rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50"
                                                        style={{
                                                            borderColor: isHubDone ? 'var(--color-border)' : `${accentColor}45`,
                                                            backgroundColor: isHubDone
                                                                ? 'var(--color-bg-secondary)'
                                                                : `color-mix(in srgb, ${accentColor} 8%, var(--color-bg-secondary))`,
                                                        }}
                                                    >
                                                        {/* Notebook binding strip */}
                                                        <div
                                                            className="absolute left-0 top-0 bottom-0 w-7 flex flex-col items-center justify-around py-2 pointer-events-none"
                                                            style={{
                                                                backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
                                                                borderRight: `1.5px solid ${accentColor}30`,
                                                            }}
                                                        >
                                                            {[0, 1, 2, 3].map(i => (
                                                                <div
                                                                    key={i}
                                                                    className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                                                                    style={{ borderColor: `${accentColor}50`, backgroundColor: 'var(--color-bg-secondary)' }}
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Main card content */}
                                                        <div className="flex items-center pl-10 pr-4 py-4 gap-4">
                                                            {/* Emoji */}
                                                            <span className="text-2xl flex-shrink-0 select-none">{hub.emoji}</span>

                                                            {/* Text */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-text text-sm sm:text-base leading-snug">
                                                                    {hub.name}
                                                                </p>
                                                                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                                                                    {hub.tagline}
                                                                </p>
                                                                {/* Progress bar */}
                                                                {!isHubDone && firstProgress > 0 && (
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        <div className="flex-1 h-1 bg-border/30 rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full rounded-full transition-all duration-500"
                                                                                style={{ width: `${Math.min(firstProgress, 100)}%`, backgroundColor: accentColor }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-[10px] text-text-muted font-medium flex-shrink-0">{Math.round(firstProgress)}%</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Badge & arrow */}
                                                            <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                                                                {isHubDone ? (
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                        ✓ Done
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                                        style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
                                                                    >
                                                                        📖 Guide
                                                                    </span>
                                                                )}
                                                                <svg className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}

                                            {/* Render non-guide activities normally */}
                                            {nonHubActivities.map(activity => renderActivityCard(activity, accentColor, false, section.label))}
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredCategories.map((category, idx) => {
                const isExpanded = expandedCategories.has(category.name);
                const totalActivities = getCategoryCount(category);

                return (
                    <div
                        key={category.name}
                        className="bg-bg-secondary/90 rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-[box-shadow] duration-300"
                        style={{
                            borderColor: `${category.color}40`,
                            animationDelay: `${idx * 50}ms`
                        }}
                    >
                        {/* Main Category Header */}
                        <button
                            onClick={() => toggleCategory(category.name)}
                            className="w-full flex items-center justify-between p-5 hover:bg-bg-light/30 transition-colors group cursor-pointer touch-manipulation"
                            style={{
                                borderLeft: `4px solid ${category.color}`,
                                touchAction: 'manipulation'
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold font-display text-text group-hover:text-primary transition-colors pointer-events-none">
                                    {category.name}
                                </h3>
                                <span className="text-sm text-text-muted font-medium bg-bg-light px-3 py-1 rounded-full pointer-events-none">
                                    {totalActivities} {totalActivities === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                            <svg
                                className={`w-6 h-6 text-text-muted transition-transform duration-300 pointer-events-none ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Category Content */}
                        {isExpanded && (
                            <div className="border-t border-border/30 bg-bg-light/20">
                                {category.subCategories ? (
                                    // Has subcategories (like Verb Tenses)
                                    <div className="divide-y divide-border/20">
                                        {category.subCategories?.map((subCategory) => {
                                            const subKey = `${category.name}-${subCategory.name}`;
                                            const isSubExpanded = expandedSubCategories.has(subKey);

                                            return (
                                                <div key={subKey}>
                                                    <button
                                                        onClick={() => toggleSubCategory(subKey)}
                                                        className="w-full flex items-center justify-between p-4 pl-6 hover:bg-bg-secondary/50 transition-colors group cursor-pointer touch-manipulation"
                                                        style={{
                                                            touchAction: 'manipulation'
                                                        }}
                                                    >
                                                        <span className="flex-1 min-w-0 text-left text-base font-semibold text-text group-hover:text-primary transition-colors pointer-events-none">
                                                            {subCategory.name}
                                                        </span>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-xs text-text-muted font-medium bg-bg-secondary/90 px-2 py-1 rounded-full pointer-events-none">
                                                                {getSubCategoryCount(subCategory)}
                                                            </span>
                                                            <svg
                                                                className={`w-5 h-5 text-text-muted transition-transform duration-300 pointer-events-none ${isSubExpanded ? 'rotate-90' : ''}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </button>

                                                    {isSubExpanded && (
                                                        subCategory.subCategories ? (
                                                            // Has sub-subcategories (like Verb Tenses -> Simple, Continuous, etc.)
                                                            subCategory.name === 'Tenses' ? (
                                                                <div className="divide-y divide-border/10">
                                                                    {subCategory.subCategories
                                                                        ?.filter((subSubCategory) => subSubCategory.activities.length > 0)
                                                                        .map((subSubCategory) => {
                                                                            const subSubKey = `${subKey}-${subSubCategory.name}`;
                                                                            const isSubSubExpanded = expandedSubCategories.has(subSubKey);

                                                                            return (
                                                                                <div key={subSubKey}>
                                                                                    <button
                                                                                        onClick={() => toggleSubCategory(subSubKey)}
                                                                                        className="w-full flex items-center justify-between p-3 pl-16 hover:bg-bg-secondary/30 transition-colors group cursor-pointer touch-manipulation"
                                                                                        style={{
                                                                                            touchAction: 'manipulation'
                                                                                        }}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-sm font-bold text-text group-hover:text-primary transition-colors pointer-events-none">
                                                                                                {subSubCategory.name}
                                                                                            </span>
                                                                                            <span className="text-xs text-text-muted font-medium bg-bg-secondary/90 px-2 py-0.5 rounded-full pointer-events-none">
                                                                                                {subSubCategory.activities.length}
                                                                                            </span>
                                                                                        </div>
                                                                                        <svg
                                                                                            className={`w-4 h-4 text-text-muted transition-transform duration-300 pointer-events-none ${isSubSubExpanded ? 'rotate-180' : ''}`}
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            viewBox="0 0 24 24"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                        </svg>
                                                                                    </button>

                                                                                    {isSubSubExpanded && subSubCategory.activities.length > 0 && (
                                                                                        <div className="pl-20 pr-4 pb-3 space-y-2">
                                                                                            {subSubCategory.activities.map((a) => renderActivityCard(a))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            ) : (
                                                                <div className="divide-y divide-border/10">
                                                                    {subCategory.subCategories
                                                                        ?.filter((subSubCategory) => subSubCategory.activities.length > 0)
                                                                        .map((subSubCategory) => {
                                                                        const subSubKey = `${subKey}-${subSubCategory.name}`;
                                                                        const isSubSubExpanded = expandedSubCategories.has(subSubKey);

                                                                        return (
                                                                            <div key={subSubKey}>
                                                                                <button
                                                                                    onClick={() => toggleSubCategory(subSubKey)}
                                                                                    className="w-full flex items-center justify-between p-3 pl-10 hover:bg-bg-secondary/30 transition-colors group cursor-pointer touch-manipulation"
                                                                                    style={{
                                                                                        touchAction: 'manipulation'
                                                                                    }}
                                                                                >
                                                                                    <span className="flex-1 min-w-0 text-left text-sm font-medium text-text group-hover:text-primary transition-colors pointer-events-none">
                                                                                        {subSubCategory.name}
                                                                                    </span>
                                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                                        <span className="text-xs text-text-muted font-medium bg-bg-secondary/90 px-2 py-0.5 rounded-full pointer-events-none">
                                                                                            {subSubCategory.activities.length}
                                                                                        </span>
                                                                                        <svg
                                                                                            className={`w-4 h-4 text-text-muted transition-transform duration-300 pointer-events-none ${isSubSubExpanded ? 'rotate-90' : ''}`}
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            viewBox="0 0 24 24"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                        </svg>
                                                                                    </div>
                                                                                </button>

                                                                                {isSubSubExpanded && subSubCategory.activities.length > 0 && (
                                                                                    <div className="pl-20 pr-4 pb-3 space-y-2">
                                                                                        {subSubCategory.activities.map((a) => renderActivityCard(a))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )
                                                        ) : subCategory.activities.length > 0 && (
                                                            // No sub-subcategories - show activities directly
                                                            <div className="pl-12 pr-4 pb-4 space-y-2">
                                                                {subCategory.activities.map(a => renderActivityCard(a))}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // No subcategories - show activities directly
                                    <div className="p-4 space-y-2">
                                        {category.activities.length > 0 ? (
                                            category.activities.map(a => renderActivityCard(a))
                                        ) : (
                                            <p className="text-text-muted text-center py-4 text-sm">No items yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

