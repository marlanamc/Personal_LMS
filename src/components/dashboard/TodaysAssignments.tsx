'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { stripVocabTypeSuffix, getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { parseCategoryData } from '@/lib/categoryData';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
import { PenLine, Gamepad2, BookOpen, ClipboardList, Sparkles } from 'lucide-react';

interface VocabCategoryData {
    'word-list'?: { completed: boolean; progress: number; completedAt?: string };
    'flashcards'?: { completed: boolean; progress: number; completedAt?: string };
    'matching'?: { completed: boolean; progress: number; completedAt?: string };
    'fill-blank'?: { completed: boolean; progress: number; completedAt?: string };
}

interface FeaturedAssignment {
    id: string;
    title?: string | null;
    activityId: string;
    dueDate?: string | Date | null;
    featuredAt?: string | Date | null;
    updatedAt?: string | Date | null;
    createdAt?: string | Date | null;
    isNewRelease?: boolean;
    progress?: number;
    progressStatus?: string;
    categoryData?: VocabCategoryData | string | null;
    activity: {
        title: string;
        description: string | null;
        category?: string | null;
    };
    submissions: Array<{
        id: string;
        status: string;
        completedAt: string | Date | null;
        score: number | null;
    }>;
}

interface Props {
    initialAssignments?: FeaturedAssignment[];
    title?: string;
    ctaLabel?: string;
    variant?: 'cards' | 'checklist';
    actions?: React.ReactNode;
}

export const TodaysAssignments: React.FC<Props> = ({
    initialAssignments,
    title,
    ctaLabel = "Start Activity",
    variant = 'cards',
    actions,
}) => {
    const featuredNewBadgeClassName = "inline-flex items-center gap-1 rounded-full border border-amber-300 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 text-amber-950 shadow-[0_2px_8px_rgba(245,158,11,0.25)]";
    const [assignments, setAssignments] = useState<FeaturedAssignment[]>(initialAssignments || []);
    const [loading, setLoading] = useState(true);


    const resolvedTitle = (() => {
        // If title is omitted, provide a sensible default by variant
        if (title === undefined) {
            return variant === "checklist" ? "Weekly Checklist" : "This Week's Activities";
        }
        // If title is explicitly set to empty/whitespace, treat as "hide title"
        if (title.trim() === "") return null;
        return title;
    })();

    useEffect(() => {
        // If we already have data from the server, skip the client fetch.
        if (initialAssignments && initialAssignments.length >= 0) {
            setLoading(false);
            return;
        }
        fetchFeaturedAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFeaturedAssignments = async () => {
        try {
            const response = await fetch('/api/assignments/featured');
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            }
        } catch (error) {
            console.error('Error fetching featured assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-8">
                <div className="bg-white rounded-2xl border border-border/40 shadow-lg overflow-hidden">
                    {/* Skeleton header */}
                    <div className="p-4 border-b border-border/30 bg-gradient-to-br from-white via-white to-bg-light/30">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl skeleton"></div>
                                <div className="h-6 w-32 skeleton rounded-lg"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-20 skeleton rounded-full"></div>
                                <div className="h-8 w-14 skeleton rounded-full"></div>
                            </div>
                        </div>
                        <div className="mt-4 h-2.5 skeleton rounded-full"></div>
                    </div>

                    {/* Skeleton rows */}
                    <div className="divide-y divide-border/20">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderLeft: '6px solid #e2ddd5' }}>
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-[22px] h-[22px] skeleton rounded-md mt-0.5"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-5 w-16 skeleton rounded-md"></div>
                                        </div>
                                        <div className="h-5 w-48 sm:w-64 skeleton rounded-lg"></div>
                                    </div>
                                </div>
                                <div className="h-10 w-24 skeleton rounded-xl sm:shrink-0"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="mb-8">
                <div className="bg-white rounded-2xl border border-border/40 shadow-lg overflow-hidden">
                    {/* Header matching the normal checklist */}
                    <div className="px-4 py-3 border-b border-border/10 bg-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                            📋
                        </div>
                        {resolvedTitle && (
                            <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">
                                {resolvedTitle}
                            </h2>
                        )}
                    </div>

                    {/* Empty state content */}
                    <div className="p-8 text-center relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-4 left-8 w-16 h-16 bg-accent/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-4 right-8 w-20 h-20 bg-secondary/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <p className="text-lg font-display font-bold text-text mb-1">All caught up!</p>
                            <p className="text-sm text-text-muted max-w-xs mx-auto">
                                No assignments this week. Explore activities below to keep building your skills.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formatDueDate = (dueDate?: string | Date | null) => {
        if (!dueDate) return null;
        const d = dueDate instanceof Date ? dueDate : new Date(dueDate);
        if (Number.isNaN(d.getTime())) return null;
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const isNewlyFeatured = (assignment: FeaturedAssignment): boolean => {
        return assignment.isNewRelease === true;
    };

    const getVocabProgress = (assignment: FeaturedAssignment) => {
        if (!assignment.activityId.startsWith('vocab-') || !assignment.categoryData) {
            return null;
        }

        const parsedCategoryData = parseCategoryData<VocabCategoryData>(assignment.categoryData);
        if (!parsedCategoryData) {
            return null;
        }

        const types: Array<keyof VocabCategoryData> = ['word-list', 'flashcards', 'matching', 'fill-blank'];
        const completed = types.filter(type => parsedCategoryData[type]?.completed).length;
        const total = types.length;

        return { completed, total, types, categoryData: parsedCategoryData };
    };

    const getCategoryStyle = (category?: string | null) => {
        const categoryKey = (category || '').toLowerCase();
        const categoryStyles: Record<string, { label: string; bg: string; text: string; accent: string }> = {
            vocab: { label: 'VOCAB', bg: '#e3f2fd', text: '#1565c0', accent: '#90caf9' },
            vocabulary: { label: 'VOCAB', bg: '#e3f2fd', text: '#1565c0', accent: '#90caf9' },
            grammar: { label: 'GRAMMAR', bg: '#e8f5e9', text: '#2e7d32', accent: '#a5d6a7' },
            numbers: { label: 'NUMBERS', bg: '#e3f2fd', text: '#1e5aa8', accent: '#4a90e2' },
            number: { label: 'NUMBERS', bg: '#e3f2fd', text: '#1e5aa8', accent: '#4a90e2' },
            reading: { label: 'READING', bg: '#e8f6f3', text: '#217f72', accent: '#2a9d8f' },
            writing: { label: 'WRITING', bg: '#eef6ee', text: '#4f7b55', accent: '#7ba884' },
            pronunciation: { label: 'PRONUNCIATION', bg: '#f1e9f7', text: '#5b3c86', accent: '#6a4c93' },
            speaking: { label: 'SPEAKING', bg: '#fff3e6', text: '#c4681a', accent: '#f5a524' },
            listening: { label: 'LISTENING', bg: '#e8f7f6', text: '#1b7d73', accent: '#2a9d8f' },
            quizzes: { label: 'QUIZ', bg: '#ffebee', text: '#c62828', accent: '#ef9a9a' },
            default: { label: 'ACTIVITY', bg: '#ede7f6', text: '#4527a0', accent: '#b39ddb' },
        };
        return categoryStyles[categoryKey] || categoryStyles.default;
    };

    const isGameCategory = (category?: string | null): boolean => {
        const key = (category || '').toLowerCase();
        return !['quiz', 'quizzes', 'grammar', 'vocab', 'vocabulary'].includes(key);
    };

    const withHexAlpha = (hex: string, alphaHex: string): string => {
        return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alphaHex}` : hex;
    };

    if (variant === 'checklist') {
        const rows = assignments.map((assignment, index) => {
            const submission = assignment.submissions[0];
            const progressValue = typeof assignment.progress === 'number' ? assignment.progress : 0;
            const isNew = isNewlyFeatured(assignment);
            const isGameRow = isGameCategory(assignment.activity.category);

            // For vocabulary activities, check if all 4 sub-activities are complete
            const vocabProgress = getVocabProgress(assignment);
            const isVocabComplete = vocabProgress ? vocabProgress.completed === vocabProgress.total : false;

            const isCompleted = isGameRow
                ? false
                : vocabProgress
                ? isVocabComplete
                : (progressValue >= 100 ||
                   assignment.progressStatus === 'completed' ||
                   !!submission?.completedAt);

            const rawTitle = assignment.title || assignment.activity.title;
            const displayTitle = stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide'));
            const categoryStyle = getCategoryStyle(assignment.activity.category);
            const dueLabel = formatDueDate(assignment.dueDate);

            return { assignment, submission, isCompleted, isNew, isGameRow, displayTitle, categoryStyle, dueLabel, progressValue, index };
        });

        const getCategoryPriority = (category?: string | null): number => {
            const key = (category || '').toLowerCase();
            if (key === 'quiz' || key === 'quizzes') return 0;
            if (key === 'grammar') return 2;
            if (key === 'vocab' || key === 'vocabulary') return 3;
            return 1; // Activity (default) and everything else
        };

        const sortedRows = [...rows].sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }

            if (!a.isCompleted) {
                const aPriority = getCategoryPriority(a.assignment.activity.category);
                const bPriority = getCategoryPriority(b.assignment.activity.category);
                if (aPriority !== bPriority) return aPriority - bPriority;

                const getDateFromTitle = (title: string) => {
                    const match = title.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
                    if (!match) return null;
                    const [, month, day, year] = match;
                    const parsed = new Date(Number(`20${year}`), Number(month) - 1, Number(day));
                    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
                };

                const aTitle = a.assignment.title || a.assignment.activity.title || "";
                const bTitle = b.assignment.title || b.assignment.activity.title || "";
                const aDueFallback = getDateFromTitle(aTitle);
                const bDueFallback = getDateFromTitle(bTitle);
                const aDue = a.assignment.dueDate ? new Date(a.assignment.dueDate).getTime() : (aDueFallback ?? Number.POSITIVE_INFINITY);
                const bDue = b.assignment.dueDate ? new Date(b.assignment.dueDate).getTime() : (bDueFallback ?? Number.POSITIVE_INFINITY);
                if (!Number.isNaN(aDue) && !Number.isNaN(bDue) && aDue !== bDue) {
                    return aDue - bDue;
                }
            }

            return a.index - b.index;
        });

        const checklistRows = rows.filter((r) => !r.isGameRow);
        const completedCount = checklistRows.filter((r) => r.isCompleted).length;
        const percent = checklistRows.length ? Math.round((completedCount / checklistRows.length) * 100) : 0;
        const isFullyComplete = percent === 100;

        // Group sorted rows by category - using Lucide icons instead of emojis
        const CHECKLIST_GROUPS: Array<{
            key: string;
            label: string;
            icon: React.ReactNode;
            match: (c: string) => boolean;
        }> = [
            { key: 'grammar', label: 'Grammar', icon: <PenLine className="w-5 h-5" />, match: (c: string) => c === 'grammar' },
            { key: 'activity', label: 'Games', icon: <Gamepad2 className="w-5 h-5" />, match: (c: string) => !['quiz','quizzes','grammar','vocab','vocabulary'].includes(c) },
            { key: 'vocabulary', label: 'Vocabulary', icon: <BookOpen className="w-5 h-5" />, match: (c: string) => c === 'vocab' || c === 'vocabulary' },
            { key: 'quizzes', label: 'Quizzes', icon: <ClipboardList className="w-5 h-5" />, match: (c: string) => c === 'quiz' || c === 'quizzes' },
        ];

        const groups = CHECKLIST_GROUPS.map(group => {
            const items = sortedRows.filter(r => group.match((r.assignment.activity.category || '').toLowerCase()));
            const doneInGroup = items.filter(r => r.isCompleted).length;
            const isGameGroup = group.key === 'activity';
            return { ...group, items, doneInGroup, allDone: !isGameGroup && items.length > 0 && doneInGroup === items.length, isGameGroup };
        }).filter(g => g.items.length > 0);



        const renderChecklistRow = (
            { assignment, isCompleted, isNew, displayTitle, dueLabel, progressValue }: typeof sortedRows[0],
            isGameGroup = false,
            categoryStyle: { text: string; accent: string }
        ) => (
            <div key={assignment.id} className="relative group/row pl-3 pr-2 py-3 sm:px-4 flex items-center gap-3 transition-all duration-200 hover:bg-white/60 border-b border-border/10 last:border-0">

                {/* Checkbox (or Game Icon placeholder) */}
                <div className="shrink-0 pt-0.5 self-start sm:self-center">
                    {isGameGroup ? (
                        <div className="w-5 h-5 flex items-center justify-center text-[18px] leading-none">
                            {getGameEmojiForActivity({ activityId: assignment.activityId, title: assignment.title || assignment.activity.title })}
                        </div>
                    ) : (
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isCompleted
                                ? 'bg-secondary/10 border-secondary/20 text-secondary'
                                : 'bg-white border-border/40 text-transparent'
                        }`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 mb-0.5">
                        {/* Mobile-only badges row */}
                        {(() => {
                            const vocabType = getVocabActivityType(assignment.activityId);
                            if (vocabType) {
                                const chip = VOCAB_CHIP_CONFIG[vocabType];
                                return (
                                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${chip.className.replace('text-[10px]', '')} opacity-90`}>
                                        {chip.label}
                                    </span>
                                );
                            }
                            return null;
                        })()}

                        {isNew && (
                            <span className={`${featuredNewBadgeClassName} px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide`}>
                                <Sparkles className="h-2.5 w-2.5 text-amber-600 animate-pulse" aria-hidden />
                                New!
                                <Sparkles className="h-2.5 w-2.5 text-yellow-500 animate-pulse [animation-delay:180ms]" aria-hidden />
                            </span>
                        )}

                        {/* Only show due date if overdue */}
                        {!isGameGroup && dueLabel && !isCompleted && new Date(assignment.dueDate as string) < new Date() && (
                            <span className="text-[10px] font-semibold text-red-500">
                                {dueLabel}
                            </span>
                        )}
                    </div>

                    <div className={`text-sm sm:text-base font-bold font-display leading-tight break-words pr-1 transition-colors ${isCompleted ? 'text-text/35 line-through decoration-text/15 decoration-1' : 'text-text'}`}>
                        {displayTitle}
                    </div>

                    {/* Progress: Vocab 4-dots chip OR Generic Bar */}
                    {(() => {
                        if (isGameGroup) return null;

                        const vocabProgress = getVocabProgress(assignment);
                        // Show 4-dots chip if it's a vocab assignment and not fully complete
                        if (vocabProgress && vocabProgress.completed < vocabProgress.total) {
                            return (
                                <div className="flex items-center gap-2 mt-1.5">
                                     <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                                        <span className="tracking-tight">{vocabProgress.completed} / {vocabProgress.total}</span>
                                        <div className="flex items-center gap-1">
                                            {vocabProgress.types.map(type => {
                                                const isComplete = vocabProgress.categoryData[type]?.completed;
                                                return <div key={type} className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-amber-600' : 'bg-amber-200'}`} />;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Generic Progress Bar (if started but not done) - bar only, no percentage text
                        if (!isCompleted && progressValue > 0) {
                            return (
                                <div className="mt-1.5">
                                    <div className="h-1 w-24 max-w-full bg-border/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400/80 rounded-full transition-all" style={{ width: `${progressValue}%` }} />
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>

                {/* Action Button - Category-colored outline style */}
                <div className="shrink-0 self-center pl-1">
                    <Link
                        href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                        style={isCompleted ? {} : {
                            color: categoryStyle.text,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: `${categoryStyle.accent}80`,
                        }}
                        onMouseEnter={(e) => {
                            if (!isCompleted) {
                                e.currentTarget.style.borderColor = categoryStyle.accent;
                                e.currentTarget.style.backgroundColor = `${categoryStyle.accent}15`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCompleted) {
                                e.currentTarget.style.borderColor = `${categoryStyle.accent}80`;
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                        aria-label={`${isGameGroup ? 'Play' : isCompleted ? 'Review' : 'Start'} ${displayTitle}`}
                    >
                        <span className={isCompleted && !isGameGroup ? 'text-text-muted/60' : ''}>
                            {isGameGroup ? 'Play' : isCompleted ? 'Review' : 'Start'}
                        </span>
                    </Link>
                </div>
            </div>
        );

        return (
            <div className="mb-8">
                {/* Unified checklist container - header + category groups connected */}
                <div className={`card-elevated rounded-2xl overflow-hidden ${isFullyComplete ? 'celebrate-complete ring-2 ring-accent/50' : ''}`}>
                    {/* Progress header */}
                    <div className="px-4 py-3 border-b border-border/20">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                                    {isFullyComplete ? '🎉' : '📋'}
                                </div>
                                {resolvedTitle && <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">{resolvedTitle}</h2>}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-text/70">
                                {actions && <div className="mr-2">{actions}</div>}
                                <span className="hidden sm:inline-block px-2 py-1 rounded-md bg-bg-light border border-border/50">{completedCount}/{checklistRows.length} done</span>
                                <span className={`px-2 py-1 rounded-md border ${isFullyComplete ? 'bg-accent/10 border-accent/30 text-amber-700' : 'bg-bg-light border-border/50'}`}>{percent}%</span>
                            </div>
                        </div>
                        <div className="w-full bg-bg-light rounded-full h-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${isFullyComplete ? 'bg-accent' : 'bg-primary'}`} style={{ width: `${percent}%` }} />
                        </div>
                    </div>

                    {/* Category sections inside the same container */}
                    <div className="p-3 sm:p-4 bg-bg-light/30">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {groups.map((group, groupIdx) => {
                                const groupStyle = getCategoryStyle(group.key);
                                const bannerStart = withHexAlpha(groupStyle.accent, '2B');
                                const bannerEnd = withHexAlpha(groupStyle.accent, '14');
                                return (
                                    <div
                                        key={group.key}
                                        className="checklist-group bg-white rounded-xl border border-border/30 overflow-hidden shadow-sm"
                                        style={{ animationDelay: `${groupIdx * 100}ms` }}
                                    >
                                        <div
                                            className="w-full px-3 py-2.5 border-b border-border/15 flex items-center justify-between"
                                            style={{
                                                borderLeft: `4px solid ${groupStyle.accent}`,
                                                background: `linear-gradient(90deg, ${bannerStart} 0%, ${bannerEnd} 68%, #ffffff 100%)`,
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span style={{ color: groupStyle.text }}>{group.icon}</span>
                                                <Link
                                                    href={`/dashboard/activities?category=${group.key === 'activity' ? 'games' : group.key}`}
                                                    className="font-display font-bold text-base sm:text-lg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 rounded"
                                                    style={{ color: groupStyle.text }}
                                                >
                                                    {group.label}
                                                </Link>
                                                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-white/70 border border-white/80" style={{ color: groupStyle.text }}>
                                                    {group.isGameGroup ? `${group.items.length}` : `${group.doneInGroup}/${group.items.length}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-border/10">
                                            {group.items.map((row) => renderChecklistRow(row, group.isGameGroup, groupStyle))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text mb-4 flex items-center gap-3 leading-tight">
                <span className="w-1 h-6 rounded-full bg-primary"></span>
                {title}
            </h2>
            <div className="bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-yellow-50/20 rounded-2xl p-5 border border-orange-100/50 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {assignments.map((assignment, index) => {
                    const submission = assignment.submissions[0];
                    const isCompleted = submission?.completedAt;
                    const isNew = isNewlyFeatured(assignment);
                    const categoryStyle = getCategoryStyle(assignment.activity.category);
                    const rawTitle = assignment.title || assignment.activity.title;
                    const displayTitle = stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide'));

                    return (
                        <div
                            key={assignment.id}
                            className="relative bg-white rounded-xl border border-border/20 hover:border-border/40 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-200 overflow-hidden group"
                            style={{
                                animationDelay: `${index * 80}ms`
                            }}
                        >
                            {/* Accent bar */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1 transition-[width] duration-200 group-hover:w-1.5"
                                style={{ backgroundColor: categoryStyle.accent }}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 pl-5">
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        {/* Category badge */}
                                        <span
                                            className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                                            style={{
                                                backgroundColor: categoryStyle.bg,
                                                color: categoryStyle.text
                                            }}
                                        >
                                            {categoryStyle.label}
                                        </span>

                                        {isNew && (
                                            <span className={`${featuredNewBadgeClassName} px-2 py-0.5 text-[10px] font-black uppercase tracking-wide`}>
                                                <Sparkles className="h-2.5 w-2.5 text-amber-600 animate-pulse" aria-hidden />
                                                New!
                                                <Sparkles className="h-2.5 w-2.5 text-yellow-500 animate-pulse [animation-delay:180ms]" aria-hidden />
                                            </span>
                                        )}

                                        {/* Vocab type chip - next to category, before % done */}
                                        {(() => {
                                            const vocabType = getVocabActivityType(assignment.activityId);
                                            if (!vocabType) return null;
                                            const chip = VOCAB_CHIP_CONFIG[vocabType];
                                            const qs = assignment.id ? `?assignment=${assignment.id}` : '';
                                            return (
                                                <Link
                                                    href={`/activity/${assignment.activityId}${qs}`}
                                                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-colors z-20 ${chip.className}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {chip.icon} {chip.label}
                                                </Link>
                                            );
                                        })()}

                                        {/* % done chip */}
                                        {assignment.progress != null && assignment.progress > 0 && !isCompleted && (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {Math.round(assignment.progress)}% done
                                            </span>
                                        )}

                                        {/* Completion badge */}
                                        {isCompleted && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] font-bold uppercase tracking-wide">
                                                <span className="text-xs">✓</span>
                                                Done
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base sm:text-lg font-bold text-text group-hover:text-primary transition-colors font-display leading-snug">
                                        {displayTitle}
                                    </h3>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold transition-[box-shadow,transform,filter] hover:shadow-md active:scale-95 rounded-lg bg-primary text-white hover:brightness-110 whitespace-nowrap sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                >
                                    {isCompleted ? 'Review' : ctaLabel}
                                </Link>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
};
