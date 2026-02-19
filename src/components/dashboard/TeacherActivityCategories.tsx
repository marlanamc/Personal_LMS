'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { VOCAB_WEEKLY_UNITS } from "@/data/weekly-vocab-units";
import { stripVocabTypeSuffix, getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
    content?: string;
    isReleased?: boolean;
}

interface SubSubCategory {
    name: string;
    activities: Activity[];
}

interface SubCategory {
    name: string;
    activities: Activity[];
    subCategories?: SubSubCategory[];
}

interface Category {
    name: string;
    color: string;
    subCategories?: SubCategory[];
    activities: Activity[];
}

interface TeacherActivityCategoriesProps {
    activities: Activity[];
    featuredActivityIds?: Set<string>;
    defaultClassId: string | null;
    activityAssignmentMap?: Record<string, string>;
}

interface ActivityCardProps {
    activity: Activity;
    isFeatured: boolean;
    isReleased: boolean;
    isQuiz: boolean;
    isSpeaking: boolean;
    isGrammarGuide: boolean;
    onRelease: (id: string, isReleased: boolean, isSpeaking: boolean, isGrammarGuide: boolean) => Promise<void>;
    onAssign: (activity: Activity) => Promise<void>;
    onUnassign: (id: string) => Promise<void>;
    assigningId: string | null;
    assignError: string | null;
    defaultClassId: string | null;
}

const vocabCycle1 = [
    { id: 'september', label: 'Unit 1: September: Getting to Know You' },
    { id: 'october', label: 'Unit 2: October: Daily Life in the Community' },
    { id: 'november', label: 'Unit 3: November: Community Participation' },
    { id: 'december', label: 'Unit 4: December: Consumer Smarts' },
    { id: 'january', label: 'Unit 5: January: Housing' },
];

// Group Cycle 2 (Units 6-10) by unit number
const vocabUnits = [
    { unitNum: 6, label: 'Unit 6: February - Workforce Preparation', weeks: VOCAB_WEEKLY_UNITS.filter(u => u.id.startsWith('feb-')) },
    { unitNum: 7, label: 'Unit 7: March - Career Awareness', weeks: VOCAB_WEEKLY_UNITS.filter(u => u.id.startsWith('mar-')) },
    { unitNum: 8, label: 'Unit 8: April - Health', weeks: VOCAB_WEEKLY_UNITS.filter(u => u.id.startsWith('apr-')) },
    { unitNum: 9, label: 'Unit 9: May - Holistic Wellness', weeks: VOCAB_WEEKLY_UNITS.filter(u => u.id.startsWith('may-')) },
    { unitNum: 10, label: 'Unit 10: June - Future Academic Goals', weeks: VOCAB_WEEKLY_UNITS.filter(u => u.id.startsWith('jun-')) },
];

const parseTitleDateMs = (title?: string | null) => {
    if (!title) return null;
    const match = title.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})\s*:/);
    if (!match) return null;
    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = 2000 + Number(match[3]);
    const dt = new Date(year, month - 1, day);
    if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return null;
    return dt.getTime();
};

const compareByTitleDateAsc = (a: Activity, b: Activity) => {
    const aDate = parseTitleDateMs(a.title);
    const bDate = parseTitleDateMs(b.title);
    if (aDate !== null && bDate !== null) return aDate - bDate;
    if (aDate !== null) return -1;
    if (bDate !== null) return 1;
    return (a.title || '').localeCompare(b.title || '');
};

const parseVerbQuizNum = (activity: Activity): number | null => {
    const title = activity.title || '';
    const match = title.match(/verb\s*quiz\s*(\d+)/i);
    if (match) return Number(match[1]);

    try {
        const content = JSON.parse(activity.content || '{}');
        if (content?.type === 'verb-quiz' && typeof content?.week === 'string') {
            const weekMatch = content.week.match(/week\s*(\d+)/i);
            if (weekMatch) return Number(weekMatch[1]);
        }
    } catch { }

    return null;
};

const parseWeekNumFromTitle = (title?: string | null): number | null => {
    if (!title) return null;
    const match = title.match(/Week\s*(\d+)/i);
    return match ? Number(match[1]) : null;
};

const displayTitle = (title: string) =>
    stripVocabTypeSuffix(
        title
            .replace(/\s*-\s*Complete Step-by-Step Guide\s*$/i, ' Guide')
            .replace(/\s*-\s*Complete Guide\s*$/i, ' Guide')
            .trim()
    );

const ActivityCard = React.memo(function ActivityCard({
    activity,
    isFeatured,
    isReleased,
    isQuiz,
    isSpeaking,
    isGrammarGuide,
    onRelease,
    onAssign,
    onUnassign,
    assigningId,
    assignError,
    defaultClassId,
}: ActivityCardProps) {
    const [isReleasing, setIsReleasing] = React.useState(false);
    const vocabType = getVocabActivityType(activity.id);

    const handleRelease = async () => {
        setIsReleasing(true);
        try {
            await onRelease(activity.id, isReleased, isSpeaking, isGrammarGuide);
        } finally {
            setIsReleasing(false);
        }
    };

    return (
        <div
            className={`block bg-white rounded-lg p-4 hover:shadow-md transition-[box-shadow] duration-200 border group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isFeatured ? 'border-accent/60 bg-accent/5' : 'border-border/40'
                }`}
        >
            {isFeatured && (
                <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 rounded-full bg-accent text-text text-xs font-bold flex items-center gap-1">
                        <span>⭐</span>
                        <span>Featured</span>
                    </div>
                </div>
            )}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold group-hover:text-primary transition-colors truncate ${isFeatured ? 'text-accent' : 'text-text'
                        }`}>
                        {displayTitle(activity.title)}
                    </h4>
                    <p className="text-sm text-text-muted line-clamp-2 mt-1 mb-3">
                        {activity.description}
                    </p>
                    {vocabType ? (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            <Link
                                href={`/activity/${activity.id}`}
                                className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-colors ${VOCAB_CHIP_CONFIG[vocabType].className}`}
                            >
                                {VOCAB_CHIP_CONFIG[vocabType].icon} {VOCAB_CHIP_CONFIG[vocabType].label}
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase">
                                {activity.type}
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Link
                            href={`/activity/${activity.id}`}
                            className="px-4 py-2 text-sm font-semibold transition-[transform,box-shadow] rounded-full border border-border/50 text-text bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            Open
                        </Link>
                        {isFeatured ? (
                            <button
                                type="button"
                                onClick={() => onUnassign(activity.id)}
                                disabled={!defaultClassId || assigningId === activity.id}
                                className={`px-4 py-2 text-white text-sm font-semibold transition-[filter,transform,box-shadow] rounded-full shadow-sm inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!defaultClassId
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-secondary hover:brightness-110 hover:shadow-md hover:-translate-y-0.5'
                                    } ${assigningId === activity.id ? 'opacity-70' : ''}`}
                            >
                                {assigningId === activity.id ? 'Unassigning...' : 'Unassign'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onAssign(activity)}
                                disabled={!defaultClassId || assigningId === activity.id}
                                className={`px-4 py-2 text-white text-sm font-semibold transition-[filter,transform,box-shadow] rounded-full shadow-sm inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!defaultClassId
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-primary hover:brightness-110 hover:shadow-md hover:-translate-y-0.5'
                                    } ${assigningId === activity.id ? 'opacity-70' : ''}`}
                            >
                                {assigningId === activity.id ? 'Assigning...' : 'Assign'}
                            </button>
                        )}
                        {(isQuiz || isSpeaking || isGrammarGuide) && (
                            <button
                                type="button"
                                onClick={handleRelease}
                                disabled={isReleasing}
                                className={`px-4 py-2 text-white text-sm font-semibold transition-[filter,transform,box-shadow] rounded-full shadow-sm inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isReleased
                                        ? 'bg-gray-500 hover:bg-gray-600'
                                        : 'bg-terracotta hover:brightness-110'
                                    } hover:shadow-md hover:-translate-y-0.5 ${isReleasing ? 'opacity-70' : ''}`}
                                style={{
                                    backgroundColor: isReleased
                                        ? undefined
                                        : (isSpeaking ? '#e09f3e' : isGrammarGuide ? '#7ba884' : '#c86b51')
                                }}
                            >
                                {isReleasing
                                    ? 'Updating…'
                                    : isReleased
                                        ? (isSpeaking ? 'Hide' : isGrammarGuide ? 'Hide Guide' : 'Hide Quiz')
                                        : (isSpeaking ? 'Release' : isGrammarGuide ? 'Release Guide' : 'Release Quiz')
                                }
                            </button>
                        )}
                    </div>
                    {assignError && (
                        <p className="text-[11px] text-red-600 mt-2">{assignError}</p>
                    )}
                </div>
            </div>
        </div>
    );
});

export const TeacherActivityCategories = React.memo(function TeacherActivityCategories({
    activities,
    featuredActivityIds = new Set(),
    defaultClassId,
    activityAssignmentMap = {}
}: TeacherActivityCategoriesProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
    const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set(featuredActivityIds));
    const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>(activityAssignmentMap);
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [assignError, setAssignError] = useState<string | null>(null);
    const [grammarReleases, setGrammarReleases] = useState<Record<string, boolean>>({});

    // Stabilize handlers with useCallback
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

    const getSubCategoryCount = useCallback((subCategory: SubCategory) => {
        const directCount = subCategory.activities?.length || 0;
        const nestedCount = subCategory.subCategories
            ? subCategory.subCategories.reduce((sum, sub) => sum + (sub.activities?.length || 0), 0)
            : 0;
        return directCount + nestedCount;
    }, []);

    const getCategoryCount = useCallback((category: Category) => {
        const directCount = category.activities?.length || 0;
        const nestedCount = category.subCategories
            ? category.subCategories.reduce((sum, sub) => sum + getSubCategoryCount(sub), 0)
            : 0;
        return directCount + nestedCount;
    }, [getSubCategoryCount]);

    const handleReleaseLocal = useCallback(async (activityId: string, isCurrentlyReleased: boolean, isSpeaking: boolean, isGrammarGuide: boolean) => {
        try {
            let apiEndpoint = '/api/quiz/release';
            if (isSpeaking) apiEndpoint = '/api/speaking/release';
            if (isGrammarGuide) apiEndpoint = '/api/grammar/release';

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activityId,
                    released: !isCurrentlyReleased
                })
            });

            if (!res.ok) {
                throw new Error('Failed to update release status');
            }

            // Update local state for grammar guides
            if (isGrammarGuide) {
                setGrammarReleases(prev => ({
                    ...prev,
                    [activityId]: !isCurrentlyReleased
                }));
            } else {
                // Refresh the page for quiz/speaking
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            const activityType = isSpeaking ? 'speaking activity' : isGrammarGuide ? 'grammar guide' : 'quiz';
            alert(`Failed to update ${activityType} release status`);
        }
    }, []);

    const handleAssignLocal = useCallback(async (activity: Activity) => {
        if (!defaultClassId || assigningId) return;
        setAssignError(null);
        setAssigningId(activity.id);
        try {
            const res = await fetch('/api/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classId: defaultClassId,
                    activityId: activity.id,
                    title: activity.title
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to assign activity');
            }

            const created = await res.json();

            // Mark as featured locally so the badge updates without a full refresh
            setFeaturedIds(prev => {
                const next = new Set(prev);
                next.add(activity.id);
                return next;
            });
            setAssignmentMap(prev => ({ ...prev, [activity.id]: created.id }));
        } catch (error: unknown) {
            setAssignError(error instanceof Error ? error.message : 'Failed to assign activity');
        } finally {
            setAssigningId(null);
        }
    }, [defaultClassId, assigningId]);

    const handleUnassignLocal = useCallback(async (activityId: string) => {
        const assignmentId = assignmentMap[activityId];
        if (!defaultClassId || !assignmentId || assigningId) return;
        setAssignError(null);
        setAssigningId(activityId);
        try {
            const res = await fetch('/api/assignments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId,
                    isFeatured: false
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to unassign activity');
            }

            setFeaturedIds(prev => {
                const next = new Set(prev);
                next.delete(activityId);
                return next;
            });
        } catch (error: unknown) {
            setAssignError(error instanceof Error ? error.message : 'Failed to unassign activity');
        } finally {
            setAssigningId(null);
        }
    }, [defaultClassId, assignmentMap, assigningId]);


    const buildGrammarSubCategories = useCallback((): SubCategory[] => {
        const grammarActivities = activities.filter((a: Activity) => a.category === 'grammar');

        const normalizeTitle = (title?: string | null) => displayTitle(title || '').toLowerCase();

        const sortAlpha = (list: Activity[]) =>
            list.sort((a, b) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')));

        const sortByTenseOrder = (list: Activity[]) => {
            const order = ['present', 'past', 'future', 'review'];
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
                return displayTitle(a.title || '').localeCompare(displayTitle(b.title || ''));
            });
        };

        const sortByKeywordOrder = (list: Activity[], keywordsInOrder: string[]) => {
            const getKeywordIndex = (t: string) => {
                for (let i = 0; i < keywordsInOrder.length; i++) {
                    if (t.includes(keywordsInOrder[i])) return i;
                }
                return keywordsInOrder.length;
            };

            return list.sort((a, b) => {
                const aNorm = normalizeTitle(a.title);
                const bNorm = normalizeTitle(b.title);
                const aIdx = getKeywordIndex(aNorm);
                const bIdx = getKeywordIndex(bNorm);
                if (aIdx !== bIdx) return aIdx - bIdx;
                return displayTitle(a.title || '').localeCompare(displayTitle(b.title || ''));
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
                return t.includes('simple') && !t.includes('vs');
            })
        );

        const perfectContinuous = sortByTenseOrder(take((a: Activity) => normalizeTitle(a.title).includes('perfect continuous')));

        const continuous = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('continuous') && !t.includes('perfect continuous') && !t.includes('vs');
            })
        );

        const perfect = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('perfect') && !t.includes('continuous') && !t.includes('vs');
            })
        );

        const mixedAllTenses = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('tenses') || t.includes('review') || t.includes(' vs ');
            })
        );

        const tenseSubCategories: SubSubCategory[] = [
            { name: 'Simple', activities: simple },
            { name: 'Continuous', activities: continuous },
            { name: 'Perfect', activities: perfect },
            { name: 'Perfect Continuous', activities: perfectContinuous },
            { name: 'Reviews & Mixed', activities: mixedAllTenses },
        ];

        const questionsAndCommands = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('question') || t.includes('imperative') || t.includes('declarative');
            }),
            ['information questions', 'imperatives', 'declaratives']
        );

        const conditionals = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes('conditional')));
        const modals = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes('modal')));
        const habitsAndPreferences = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('used to') || t.includes('would rather');
            })
        );

        const voiceAndReporting = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('passive') || t.includes('reported');
            }),
            ['passive', 'reported']
        );

        const gerundsAndInfinitives = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('gerund') || t.includes('infinitive');
            }),
            ['infinitives vs gerunds', 'verbs + gerunds', 'gerunds after prepositions']
        );

        const phrasalVerbs = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes('phrasal')));

        const wordsAndQuantity = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('parts of speech') || t.includes('superlative') || t.includes('quantifier');
            }),
            ['parts of speech', 'superlatives', 'quantifiers']
        );

        const writingMechanics = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('punctuation') || t.includes('capitalization') || t.includes('paragraph');
            }),
            ['punctuation', 'capitalization', 'paragraph']
        );

        const otherGrammar = sortAlpha(remaining);

        return [
            {
                name: 'Tenses',
                activities: [],
                subCategories: tenseSubCategories
            },
            {
                name: 'Questions, Modals & Communication',
                activities: [
                    ...questionsAndCommands,
                    ...modals,
                    ...voiceAndReporting
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
            {
                name: 'Gerunds & Infinitives',
                activities: gerundsAndInfinitives
            },
            {
                name: 'Verbs & Patterns',
                activities: [
                    ...phrasalVerbs,
                    ...habitsAndPreferences
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
            {
                name: 'Conditionals',
                activities: sortByKeywordOrder(conditionals, ['zero', 'first', 'second', 'third'])
            },
            {
                name: 'Describing & Comparing',
                activities: wordsAndQuantity.sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
            {
                name: 'Writing Basics',
                activities: [
                    ...writingMechanics,
                    ...otherGrammar
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
        ];
    }, [activities]);

    // Organize activities by top-level categories with subcategories
    const categories = useMemo((): Category[] => {
        return [
            {
                name: 'Vocabulary',
                color: '#f4a261', // warm orange
                subCategories: [
                    {
                        name: 'Cycle 1',
                        activities: vocabCycle1.flatMap(month =>
                            activities.filter((a: Activity) => a.id === `vocab-${month.id}`)
                        )
                    },
                    ...vocabUnits.map(unit => {
                        // Create a sub-category for each unit (6-10) with its weeks as nested sub-categories
                        return {
                            name: unit.label,
                            activities: [],
                            subCategories: unit.weeks.map(week => {
                                const weekActivities = activities.filter((a: Activity) => a.id === `vocab-${week.id}`);
                                return {
                                    name: week.label,
                                    activities: weekActivities
                                };
                            })
                        };
                    })
                ],
                activities: []
            },
            {
                name: 'Grammar',
                color: '#e76f51', // coral/terracotta
                subCategories: buildGrammarSubCategories(),
                activities: []
            },
            {
                name: 'Games',
                color: '#f97316', // orange
                activities: activities.filter((a: Activity) => {
                    // Filter for all game activities
                    if (a.type !== 'game') return false;
                    
                    // Show if in games category, or has verb-forms UI
                    return a.category === 'games' || 
                           a.ui === 'verb-forms' || 
                           a.ui === 'verbforms';
                })
            },
            {
                name: 'Reading',
                color: '#2a9d8f', // teal
                activities: activities.filter((a: Activity) => a.category === 'reading' || a.category === 'writing-reading')
            },
            {
                name: 'Writing',
                color: '#7ba884', // sage green
                activities: activities.filter((a: Activity) => a.category === 'writing' || a.category === 'writing-reading')
            },
            {
                name: 'Pronunciation',
                color: '#6a4c93', // purple
                activities: activities.filter((a: Activity) =>
                    a.category === 'pronunciation' ||
                    a.ui === 'ed-pronunciation' ||
                    a.ui === 'minimal-pairs'
                )
            },
            {
                name: 'Speaking',
                color: '#e09f3e', // gold/amber
                activities: activities
                    .filter((a: Activity) => a.category === 'speaking')
                    .sort(compareByTitleDateAsc)
            },
            {
                name: 'Quizzes',
                color: '#c86b51', // terracotta
                activities: activities.filter((a: Activity) => a.category === 'quizzes')
                    .sort((a: Activity, b: Activity) => {
                        // Verb quizzes first, in ascending order (Verb Quiz 1..20)
                        const aVerb = parseVerbQuizNum(a);
                        const bVerb = parseVerbQuizNum(b);
                        if (aVerb !== null && bVerb !== null) return aVerb - bVerb;
                        if (aVerb !== null) return -1;
                        if (bVerb !== null) return 1;

                        // Otherwise, sort by week number if present, else fallback to title
                        const aWeek = parseWeekNumFromTitle(a.title) ?? 999;
                        const bWeek = parseWeekNumFromTitle(b.title) ?? 999;
                        if (aWeek !== bWeek) return aWeek - bWeek;
                        return (a.title || '').localeCompare(b.title || '');
                    })
            }
        ];
    }, [activities, buildGrammarSubCategories]);

    const renderActivityCard = useCallback((activity: Activity) => {
        let isQuiz = false;
        let isSpeaking = false;
        let isGrammarGuide = false;
        let isReleased = false;

        if (activity.type === 'guide' && activity.category === 'grammar') {
            isGrammarGuide = true;
            isReleased = grammarReleases[activity.id] ?? activity.isReleased ?? false;
        } else {
            try {
                const content = JSON.parse(activity.content || '{}');
                isQuiz = content.type === 'verb-quiz';
                isSpeaking = content.type === 'speaking';
                isReleased = content.released === true;
            } catch {}
        }

        return (
            <ActivityCard
                key={activity.id}
                activity={activity}
                isFeatured={featuredIds.has(activity.id)}
                isReleased={isReleased}
                isQuiz={isQuiz}
                isSpeaking={isSpeaking}
                isGrammarGuide={isGrammarGuide}
                onRelease={handleReleaseLocal}
                onAssign={handleAssignLocal}
                onUnassign={handleUnassignLocal}
                assigningId={assigningId}
                assignError={assignError}
                defaultClassId={defaultClassId}
            />
        );
    }, [grammarReleases, featuredIds, handleReleaseLocal, handleAssignLocal, handleUnassignLocal, assigningId, assignError, defaultClassId]);

    return (
        <div className="space-y-4">
            {categories.map((category, idx) => {
                const isExpanded = expandedCategories.has(category.name);
                const totalActivities = getCategoryCount(category);

                return (
                    <div
                        key={category.name}
                        className="bg-white rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-[box-shadow] duration-300"
                        style={{
                            borderColor: `${category.color}40`,
                            animationDelay: `${idx * 50}ms`
                        }}
                    >
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
                                    {totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}
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

                        {isExpanded && (
                            <div className="border-t border-border/30 bg-bg-light/20">
                                {category.subCategories ? (
                                    <div className="divide-y divide-border/20">
                                        {category.subCategories.map((subCategory) => {
                                            const subKey = `${category.name}-${subCategory.name}`;
                                            const isSubExpanded = expandedSubCategories.has(subKey);

                                            return (
                                                <div key={subKey}>
                                                    <button
                                                        onClick={() => toggleSubCategory(subKey)}
                                                        className="w-full flex items-center justify-between p-4 pl-8 hover:bg-white/50 transition-colors group cursor-pointer touch-manipulation"
                                                        style={{
                                                            touchAction: 'manipulation'
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-base font-semibold text-text group-hover:text-primary transition-colors pointer-events-none">
                                                                {subCategory.name}
                                                            </span>
                                                            <span className="text-xs text-text-muted font-medium bg-white px-2 py-1 rounded-full pointer-events-none">
                                                                {getSubCategoryCount(subCategory)}
                                                            </span>
                                                        </div>
                                                        <svg
                                                            className={`w-5 h-5 text-text-muted transition-transform duration-300 pointer-events-none ${isSubExpanded ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>

                                                    {isSubExpanded && (
                                                        subCategory.subCategories ? (
                                                            // Has sub-subcategories
                                                            <div className="divide-y divide-border/10">
                                                                {subCategory.subCategories.map((subSubCategory) => {
                                                                    const subSubKey = `${subKey}-${subSubCategory.name}`;
                                                                    const isSubSubExpanded = expandedSubCategories.has(subSubKey);

                                                                    return (
                                                                        <div key={subSubKey}>
                                                                            <button
                                                                                onClick={() => toggleSubCategory(subSubKey)}
                                                                                className="w-full flex items-center justify-between p-3 pl-16 hover:bg-white/30 transition-colors group cursor-pointer touch-manipulation"
                                                                                style={{
                                                                                    touchAction: 'manipulation'
                                                                                }}
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-sm font-medium text-text group-hover:text-primary transition-colors pointer-events-none">
                                                                                        {subSubCategory.name}
                                                                                    </span>
                                                                                    <span className="text-xs text-text-muted font-medium bg-white px-2 py-0.5 rounded-full pointer-events-none">
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
                                                                                    {subSubCategory.activities.map(renderActivityCard)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : subCategory.activities.length > 0 && (
                                                            // No sub-subcategories - show activities directly
                                                            <div className="pl-12 pr-4 pb-4 space-y-2">
                                                                {subCategory.activities.map(renderActivityCard)}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-2">
                                        {category.activities.length > 0 ? (
                                            category.activities.map(renderActivityCard)
                                        ) : (
                                            <p className="text-text-muted text-center py-4 text-sm">No activities yet</p>
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
