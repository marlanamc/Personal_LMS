import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { trackLogin } from "@/lib/gamification";
import { normalizeGuideTitle } from "@/lib/grammar-activity-resolution";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import { getVocabTypeFromTitle, parseVocabTypeLabel, stripVocabTypeSuffix, VOCAB_CHIP_CONFIG } from "@/lib/vocab-display";
import { completionKeyFromActivityTitle } from "@/utils/completionKey";
import Link from "next/link";
import { BottomNav } from "@/components/ui";
import { StatCard } from "@/components/ui/StatCard";
import { StreakCalendar } from "@/components/ui/StreakCalendar";
import { ActivityTimeline } from "@/components/ui/ActivityTimeline";
import ClickableAvatarDisplay from "@/components/ui/ClickableAvatarDisplay";
import { MiniCertificateCard, EmptyCertificateCard, NeedsImprovementCard } from "@/components/ui/MiniCertificateCard";
import { qualifiesForMedal } from "@/lib/medal-utils";
import { Trophy, Flame, BookOpen, Target, Calendar, Award, ChevronRight } from "lucide-react";
import { HomeIcon, BookOpenIcon as BookIcon, TrophyIcon, UsersIcon, UserIcon } from "@/components/icons/Icons";

// Force dynamic rendering to show real-time activity data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ParsedActivityContent {
    released?: boolean;
    miniQuiz?: unknown;
}

interface QuizGradeRow {
    id: string;
    title: string;
    score: number | null;
    submittedAt: Date | null;
}

interface MiniQuizCertificateBanner {
    activityId: string;
    slug: string;
    title: string;
    score: number;
    issuedAt: Date | null;
}

const parseActivityContent = (content: string): ParsedActivityContent | null => {
    try {
        const parsed: unknown = JSON.parse(content);
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as ParsedActivityContent;
    } catch {
        return null;
    }
};

const hasMiniQuiz = (content: string): boolean => {
    const parsed = parseActivityContent(content);
    return Boolean(parsed?.miniQuiz);
};

const cleanGuideTitle = (title: string): string => {
    return title
        .replace(/\s*-\s*Complete Guide$/i, "")
        .replace(/\s+Guide$/i, "")
        .replace(/\s+/g, " ")
        .trim();
};

const getOrderedGrammarGuidesForActivities = <T extends { title: string }>(guides: T[]): T[] => {
    const normalizeTitle = (title?: string | null) => cleanGuideTitle(title || "").toLowerCase();
    const sortAlpha = (list: T[]) =>
        list.sort((a, b) => cleanGuideTitle(a.title || "").localeCompare(cleanGuideTitle(b.title || "")));

    const sortByTenseOrder = (list: T[]) => {
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
            return cleanGuideTitle(a.title || "").localeCompare(cleanGuideTitle(b.title || ""));
        });
    };

    const sortByKeywordOrder = (list: T[], keywordsInOrder: string[]) => {
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
            return cleanGuideTitle(a.title || "").localeCompare(cleanGuideTitle(b.title || ""));
        });
    };

    const remaining = [...guides];
    const take = (predicate: (guide: T) => boolean) => {
        const matched: T[] = [];
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
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("simple") && !t.includes("vs");
        })
    );
    const perfectContinuous = sortByTenseOrder(take((guide) => normalizeTitle(guide.title).includes("perfect continuous")));
    const continuous = sortByTenseOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("continuous") && !t.includes("perfect continuous") && !t.includes("vs");
        })
    );
    const perfect = sortByTenseOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("perfect") && !t.includes("continuous") && !t.includes("vs");
        })
    );

    const mixedAllTenses = sortAlpha(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            if (t.includes("gerund") || t.includes("infinitive")) return false;
            return t.includes("tenses") || t.includes("review") || t.includes(" vs ");
        })
    );
    const questionsAndCommands = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("question") || t.includes("imperative") || t.includes("declarative");
        }),
        ["information questions", "imperatives", "declaratives"]
    );
    const conditionals = sortByKeywordOrder(
        take((guide) => normalizeTitle(guide.title).includes("conditional")),
        ["zero", "first", "second", "third"]
    );
    const modals = sortAlpha(take((guide) => normalizeTitle(guide.title).includes("modal")));
    const habitsAndPreferences = sortAlpha(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("used to") || t.includes("would rather");
        })
    );
    const voiceAndReporting = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("passive") || t.includes("reported");
        }),
        ["passive", "reported"]
    );
    const gerundsAndInfinitives = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("gerund") || t.includes("infinitive");
        }),
        ["infinitives vs gerunds", "verbs + gerunds", "gerunds after prepositions"]
    );
    const phrasalVerbs = sortAlpha(take((guide) => normalizeTitle(guide.title).includes("phrasal")));
    const wordsAndQuantity = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("parts of speech") || t.includes("superlative") || t.includes("quantifier");
        }),
        ["parts of speech", "superlatives", "quantifiers"]
    );
    const writingMechanics = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("punctuation") || t.includes("capitalization") || t.includes("paragraph");
        }),
        ["punctuation", "capitalization", "paragraph"]
    );

    const otherGrammar = sortAlpha(remaining);
    return [
        ...simple,
        ...continuous,
        ...perfect,
        ...perfectContinuous,
        ...mixedAllTenses,
        ...sortAlpha([...questionsAndCommands, ...modals, ...voiceAndReporting]),
        ...gerundsAndInfinitives,
        ...sortAlpha([...phrasalVerbs, ...habitsAndPreferences]),
        ...conditionals,
        ...sortAlpha(wordsAndQuantity),
        ...sortAlpha([...writingMechanics, ...otherGrammar]),
    ];
};

const getVerbQuizOrder = (title: string): number => {
    const weekMatch = title.match(/(\d+)/);
    return weekMatch ? Number(weekMatch[1]) : Number.MAX_SAFE_INTEGER;
};

const getScoreBadgeClasses = (score: number): string => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 60) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
};

const toReadableLabel = (value: string): string => {
    return value
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const parseGrammarExerciseReason = (
    reason: string
): { activityName: string; activityType: string } | null => {
    if (!reason.startsWith("grammar-exercise:")) return null;

    const parts = reason.split(":");
    const slug = parts[1] || "";
    const sectionId = parts[2] || "";
    const exerciseId = parts.slice(3).join(":") || sectionId;

    const guideTitle = toReadableLabel(slug);
    const exerciseTitle = toReadableLabel(exerciseId);

    if (!guideTitle && !exerciseTitle) return null;

    return {
        activityName: guideTitle && exerciseTitle
            ? `${guideTitle}: ${exerciseTitle}`
            : guideTitle || exerciseTitle,
        activityType: "Grammar Exercise",
    };
};

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    if (!userId) {
        redirect("/login");
    }

    // Count daily app opens toward streak even when session is still active.
    await trackLogin(userId);

    // Get user data with stats
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            achievements: {
                include: {
                    achievement: true,
                },
                orderBy: {
                    earnedAt: 'desc',
                },
            },
            classes: {
                include: {
                    class: true,
                },
            },
            _count: {
                select: {
                    submissions: true,
                    classes: true,
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    // Run all independent database queries in parallel to eliminate async waterfall
    const [
        activityProgress,
        recentPointsLedger,
        pointsLedgerDates,
        activityProgressDates,
        releasedVerbQuizActivitiesRaw,
        releasedGrammarGuideActivities,
        verbQuizSubmissions,
        grammarQuizSubmissions,
    ] = await Promise.all([
        // Get activity progress for category stats
        prisma.activityProgress.findMany({
            where: { userId },
            include: {
                activity: true,
            },
        }),
        // Get points ledger for activity timeline
        prisma.pointsLedger.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 15,
        }),
        // Get activity dates for streak calendar - PointsLedger (for completed activities)
        prisma.pointsLedger.findMany({
            where: { userId },
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 365,
        }),
        // Get activity dates for streak calendar - ActivityProgress updates (for any activity)
        prisma.activityProgress.findMany({
            where: { userId },
            select: { updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 365,
        }),
        prisma.activity.findMany({
            where: {
                type: "quiz",
                category: "quizzes",
                content: {
                    contains: "\"type\":\"verb-quiz\"",
                },
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
            orderBy: { createdAt: "asc" },
        }),
        prisma.activity.findMany({
            where: {
                type: "guide",
                category: "grammar",
                isReleased: true,
            },
            select: {
                id: true,
                title: true,
                content: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.submission.findMany({
            where: {
                userId,
                score: { not: null },
                activity: {
                    type: "quiz",
                    category: "quizzes",
                    content: {
                        contains: "\"type\":\"verb-quiz\"",
                    },
                },
            },
            select: {
                activityId: true,
                score: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
        }),
        prisma.submission.findMany({
            where: {
                userId,
                score: { not: null },
                activity: {
                    type: "guide",
                    category: "grammar",
                },
            },
            select: {
                activityId: true,
                score: true,
                updatedAt: true,
                activity: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        }),
    ]);

    // Combine both date sources
    const activityDates = [
        ...pointsLedgerDates.map(p => p.createdAt),
        ...activityProgressDates.map(p => p.updatedAt),
    ];

    // Calculate category progress

    const vocabActivities = activityProgress.filter(ap => {
        const category = ap.activity.category?.toLowerCase() || '';
        return category.includes('vocab') ||
               category.includes('vocabulary') ||
               category.includes('unit') || // "Unit 1: Flash Cards" etc.
               category.includes('flash cards');
    });

    const grammarActivities = activityProgress.filter(ap =>
        ap.activity.category?.toLowerCase().includes('grammar')
    );

    const numbersActivities = activityProgress.filter(ap =>
        ap.activity.category?.toLowerCase().includes('numbers')
    );

    const otherActivities = activityProgress.filter(ap => {
        const category = ap.activity.category?.toLowerCase() || '';
        return !category.includes('vocab') &&
               !category.includes('vocabulary') &&
               !category.includes('unit') &&
               !category.includes('flash cards') &&
               !category.includes('grammar') &&
               !category.includes('numbers');
    });

    const calcCategoryProgress = (activities: typeof activityProgress) => {
        if (activities.length === 0) return { completed: 0, total: 0, percentage: 0 };
        const completed = activities.filter(a => a.status === 'completed').length;
        return {
            completed,
            total: activities.length,
            percentage: Math.round((completed / activities.length) * 100),
        };
    };

    const vocabProgress = calcCategoryProgress(vocabActivities);
    const grammarProgress = calcCategoryProgress(grammarActivities);
    const numbersProgress = calcCategoryProgress(numbersActivities);
    const otherProgress = calcCategoryProgress(otherActivities);

    // Format timeline activities (exclude login entries with 0 points)
    // Parse the new reason format: "Activity Title|Activity Type" or legacy "Completed: Title"
    const timelineActivities = recentPointsLedger
        .filter(entry => entry.points > 0)
        .map(entry => {
            const reason = entry.reason || 'Activity completed';
            let activityName = reason;
            let activityType: string | undefined;
            const grammarExercise = parseGrammarExerciseReason(reason);

            // Check for new format with pipe separator: "Title|Type"
            if (reason.includes('|')) {
                const [title, type] = reason.split('|');
                activityName = title.trim();
                activityType = type?.trim();
            } else if (grammarExercise) {
                activityName = grammarExercise.activityName;
                activityType = grammarExercise.activityType;
            } else if (reason.startsWith('Completed: ')) {
                // Legacy format: strip "Completed: " prefix
                activityName = reason.replace('Completed: ', '');
            } else if (reason.startsWith('grammar:')) {
                // Legacy grammar format: format the slug
                activityName = reason.replace('grammar:', '').replace(/-/g, ' ')
                    .split(' ')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ');
                activityType = 'Grammar Guide';
            } else if (reason === 'Streak bonus' || reason === 'Streak + weekly bonus') {
                activityType = 'Streak Bonus';
            } else if (reason.startsWith('Achievement:')) {
                activityType = 'Achievement';
                activityName = reason.replace('Achievement: ', '');
            }

            let vocabType = parseVocabTypeLabel(activityType);
            if (!vocabType) {
                const inferredFromTitle = getVocabTypeFromTitle(activityName);
                if (inferredFromTitle) {
                    vocabType = inferredFromTitle;
                    activityName = stripVocabTypeSuffix(activityName);
                }
            }
            if (vocabType && !activityType) {
                activityType = VOCAB_CHIP_CONFIG[vocabType].label;
            }

            return {
                id: entry.id,
                activityName,
                points: entry.points,
                completedAt: entry.createdAt,
                activityType,
                vocabType,
                reason: entry.source !== 'award' && entry.source && !activityType ? entry.source : undefined,
            };
        });

    const releasedVerbQuizActivities = releasedVerbQuizActivitiesRaw
        .filter((activity) => parseActivityContent(activity.content)?.released === true)
        .sort((a, b) => getVerbQuizOrder(a.title) - getVerbQuizOrder(b.title));

    const latestVerbSubmissionByActivityId = new Map<string, { score: number; submittedAt: Date }>();
    for (const submission of verbQuizSubmissions) {
        if (submission.score === null) continue;
        const existing = latestVerbSubmissionByActivityId.get(submission.activityId);
        if (!existing || submission.updatedAt > existing.submittedAt) {
            latestVerbSubmissionByActivityId.set(submission.activityId, {
                score: submission.score,
                submittedAt: submission.updatedAt,
            });
        }
    }

    const verbQuizGrades: QuizGradeRow[] = releasedVerbQuizActivities.map((activity) => {
        const submission = latestVerbSubmissionByActivityId.get(activity.id);
        return {
            id: activity.id,
            title: activity.title,
            score: submission?.score ?? null,
            submittedAt: submission?.submittedAt ?? null,
        };
    });

    const orderedReleasedGrammarGuideActivities = getOrderedGrammarGuidesForActivities(releasedGrammarGuideActivities);
    const releasedMiniQuizActivities = orderedReleasedGrammarGuideActivities.filter((activity) =>
        hasMiniQuiz(activity.content)
    );

    const releasedMiniQuizActivityIds = new Set(releasedMiniQuizActivities.map((activity) => activity.id));
    const releasedMiniQuizIdByTitle = new Map(
        releasedMiniQuizActivities.map((activity) => [normalizeGuideTitle(activity.title), activity.id] as const)
    );

    const latestMiniQuizSubmissionByActivityId = new Map<string, { score: number; submittedAt: Date }>();
    for (const submission of grammarQuizSubmissions) {
        if (submission.score === null) continue;

        const canonicalActivityId = releasedMiniQuizActivityIds.has(submission.activityId)
            ? submission.activityId
            : releasedMiniQuizIdByTitle.get(normalizeGuideTitle(submission.activity.title));

        if (!canonicalActivityId) continue;

        const existing = latestMiniQuizSubmissionByActivityId.get(canonicalActivityId);
        if (!existing || submission.updatedAt > existing.submittedAt) {
            latestMiniQuizSubmissionByActivityId.set(canonicalActivityId, {
                score: submission.score,
                submittedAt: submission.updatedAt,
            });
        }
    }

    const miniQuizGrades: QuizGradeRow[] = releasedMiniQuizActivities.map((activity) => {
        const submission = latestMiniQuizSubmissionByActivityId.get(activity.id);
        return {
            id: activity.id,
            title: cleanGuideTitle(activity.title),
            score: submission?.score ?? null,
            submittedAt: submission?.submittedAt ?? null,
        };
    });

    const gradedVerbQuizCount = verbQuizGrades.filter((quiz) => quiz.score !== null).length;
    const gradedMiniQuizCount = miniQuizGrades.filter((quiz) => quiz.score !== null).length;

    // Split mini quiz results into medals (70%+) and needs improvement (<70%)
    const allMiniQuizResults: MiniQuizCertificateBanner[] = miniQuizGrades
        .filter((quiz): quiz is QuizGradeRow & { score: number } => quiz.score !== null)
        .sort((a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0))
        .map((quiz) => ({
            activityId: quiz.id,
            slug: completionKeyFromActivityTitle(quiz.title),
            title: quiz.title,
            score: quiz.score,
            issuedAt: quiz.submittedAt,
        }));

    // Certificates for medals (70% or higher)
    const miniQuizCertificates = allMiniQuizResults.filter(cert => qualifiesForMedal(cert.score));

    // Quizzes that need improvement (under 70%)
    const needsImprovementQuizzes = allMiniQuizResults.filter(cert => !qualifiesForMedal(cert.score));

    const effectiveCurrentStreak = getEffectiveStreak(user.currentStreak, user.lastActivityDate);

    // Student view
    if (userRole === 'student') {
        const totalCompleted = vocabProgress.completed + grammarProgress.completed + numbersProgress.completed + otherProgress.completed;
        
        // Encouraging message based on activity
        let welcomeMessage = "Let's learn something new today!";
        if (effectiveCurrentStreak > 3) welcomeMessage = "You're on fire! Keep it up! 🔥";
        else if (totalCompleted > 0) welcomeMessage = "Great progress so far!";
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24">
                {/* Decorative background elements */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-50" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    {/* Header */}
                    <div className="mb-10 animate-fade-in">
                        <div className="flex flex-col glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
                            {/* Accent decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

                            {/* Top section: Avatar + Name + Stats */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                <div className="flex-shrink-0 relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-br from-primary via-accent to-secondary rounded-full opacity-70 blur group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative bg-white p-1 rounded-full">
                                        <ClickableAvatarDisplay size="lg" />
                                    </div>
                                </div>

                                <div className="text-center sm:text-left flex-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text mb-1 tracking-tight">
                                        Hi, {user.name?.split(' ')[0] || 'Student'}! 👋
                                    </h1>
                                    <p className="text-base sm:text-lg text-text-muted font-medium">
                                        {welcomeMessage}
                                    </p>
                                </div>

                                {/* Inline stats - visible on larger screens */}
                                <div className="hidden lg:flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Trophy className="w-5 h-5" />
                                        <div className="text-right">
                                            <p className="text-xl font-bold leading-tight">{user.points.toLocaleString()}</p>
                                            <p className="text-xs text-text-muted">Points</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-border/60" />
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <Flame className="w-5 h-5" />
                                        <div className="text-right">
                                            <p className="text-xl font-bold leading-tight">{effectiveCurrentStreak}</p>
                                            <p className="text-xs text-text-muted">Day Streak</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-border/60" />
                                    <div className="flex items-center gap-2 text-success">
                                        <BookOpen className="w-5 h-5" />
                                        <div className="text-right">
                                            <p className="text-xl font-bold leading-tight">{totalCompleted}</p>
                                            <p className="text-xs text-text-muted">Explored</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats row for mobile/tablet - shown below greeting */}
                            <div className="lg:hidden grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border/40">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center gap-1.5 text-primary mb-1">
                                        <Trophy className="w-4 h-4" />
                                        <span className="text-lg sm:text-xl font-bold">{user.points.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-text-muted">Points</p>
                                </div>
                                <div className="flex flex-col items-center text-center border-x border-border/40">
                                    <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                                        <Flame className="w-4 h-4" />
                                        <span className="text-lg sm:text-xl font-bold">{effectiveCurrentStreak}</span>
                                    </div>
                                    <p className="text-xs text-text-muted">Day Streak</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center gap-1.5 text-success mb-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="text-lg sm:text-xl font-bold">{totalCompleted}</span>
                                    </div>
                                    <p className="text-xs text-text-muted">Explored</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini Quiz Certificates - Medal Collection */}
                    <div id="mini-quiz-certificates" className="mb-10 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-6 shadow-sm animate-fade-in-up delay-300">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 shadow-inner">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text">Achievement Medals</h2>
                                <p className="text-sm text-text-muted">
                                    {miniQuizCertificates.length > 0
                                        ? `${miniQuizCertificates.length} medal${miniQuizCertificates.length === 1 ? "" : "s"} earned (70%+ to earn a medal)`
                                        : "Score 70% or higher to earn medals"}
                                </p>
                            </div>
                        </div>

                        {miniQuizCertificates.length === 0 && needsImprovementQuizzes.length === 0 ? (
                            <div className="flex justify-center">
                                <EmptyCertificateCard />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Earned Medals */}
                                {miniQuizCertificates.length > 0 && (
                                    <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-2 px-2">
                                        {miniQuizCertificates.map((certificate) => (
                                            <MiniCertificateCard
                                                key={certificate.activityId}
                                                certificate={certificate}
                                                className="snap-start"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Needs Improvement Section */}
                                {needsImprovementQuizzes.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-text-muted mb-3">
                                            Keep practicing - you can do it!
                                        </p>
                                        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-2 px-2">
                                            {needsImprovementQuizzes.map((quiz) => (
                                                <NeedsImprovementCard
                                                    key={quiz.activityId}
                                                    certificate={quiz}
                                                    className="snap-start"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mb-10 space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Calendar */}
                            <div className="bg-white/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-sm animate-fade-in-up delay-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-success" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text">Consistency</h2>
                                        <p className="text-sm text-text-muted">Each dot is a day you learned!</p>
                                    </div>
                                </div>
                                <StreakCalendar
                                    activityDates={activityDates}
                                    className="w-full"
                                />
                            </div>

                            {/* Released Quiz Grades */}
                            <div className="bg-white/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-sm animate-fade-in-up delay-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text">Quiz Grades</h2>
                                        <p className="text-sm text-text-muted">
                                            Released quizzes: {gradedVerbQuizCount}/{verbQuizGrades.length} Verb · {gradedMiniQuizCount}/{miniQuizGrades.length} Mini
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 max-h-[520px] overflow-y-auto pr-1">
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">Verb Quizzes</h3>
                                        {verbQuizGrades.length === 0 ? (
                                            <div className="rounded-lg border border-dashed border-border/60 bg-bg/60 p-3">
                                                <p className="text-sm text-text-muted">No released verb quizzes yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {verbQuizGrades.map((quiz) => (
                                                    <Link
                                                        key={quiz.id}
                                                        href={`/activity/${quiz.id}`}
                                                        className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-bg/60 p-3 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">{quiz.title}</p>
                                                            <p className="text-xs text-text-muted">
                                                                {quiz.submittedAt
                                                                    ? `Last attempt ${quiz.submittedAt.toLocaleDateString()}`
                                                                    : "Released - not submitted yet"}
                                                            </p>
                                                        </div>
                                                        {quiz.score !== null ? (
                                                            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getScoreBadgeClasses(quiz.score)}`}>
                                                                {quiz.score}%
                                                            </span>
                                                        ) : (
                                                            <span className="shrink-0 rounded-full border border-border/60 bg-white px-2.5 py-1 text-xs font-medium text-text-muted">
                                                                Not submitted
                                                            </span>
                                                        )}
                                                        <ChevronRight className="w-4 h-4 text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">Mini Quizzes</h3>
                                        {miniQuizGrades.length === 0 ? (
                                            <div className="rounded-lg border border-dashed border-border/60 bg-bg/60 p-3">
                                                <p className="text-sm text-text-muted">No released mini quizzes yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {miniQuizGrades.map((quiz) => (
                                                    <Link
                                                        key={quiz.id}
                                                        href={`/activity/${quiz.id}`}
                                                        className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-bg/60 p-3 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">{quiz.title}</p>
                                                            <p className="text-xs text-text-muted">
                                                                {quiz.submittedAt
                                                                    ? `Last attempt ${quiz.submittedAt.toLocaleDateString()}`
                                                                    : "Released - not submitted yet"}
                                                            </p>
                                                        </div>
                                                        {quiz.score !== null ? (
                                                            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getScoreBadgeClasses(quiz.score)}`}>
                                                                {quiz.score}%
                                                            </span>
                                                        ) : (
                                                            <span className="shrink-0 rounded-full border border-border/60 bg-white px-2.5 py-1 text-xs font-medium text-text-muted">
                                                                Not submitted
                                                            </span>
                                                        )}
                                                        <ChevronRight className="w-4 h-4 text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-sm animate-fade-in-up delay-400">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-text">Recent Wins</h2>
                                        <p className="text-sm text-text-muted">Latest activities</p>
                                    </div>
                                </div>
                            </div>
                            <ActivityTimeline activities={timelineActivities} limit={8} />
                            {timelineActivities.length === 0 && (
                                <div className="text-center py-6">
                                    <p className="text-text-muted text-sm italic">No recent activity. Do a lesson to see it here!</p>
                                </div>
                            )}
                        </div>

                        {/* Achievements - Show only if exists */}
                        {user.achievements.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-md border border-border/60 rounded-2xl p-8 shadow-sm animate-fade-in-up delay-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20 text-white">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold font-display text-text">Trophy Case</h2>
                                        <p className="text-text-muted">Badges you've earned</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {user.achievements.map((userAchievement) => (
                                        <div
                                            key={userAchievement.id}
                                            className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-100/50 rounded-xl hover:shadow-md transition-shadow"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                                                {userAchievement.achievement.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-text-dark">{userAchievement.achievement.name}</p>
                                                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{userAchievement.achievement.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <BottomNav
                    items={[
                        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                        { href: "/dashboard/activities", label: "Activities", icon: <BookIcon /> },
                        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
                        { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                    ]}
                />
            </div>
        );
    }

    // Teacher view - simplified profile
    const teacherClasses = user.classes.length;
    const teacherStats = await prisma.activity.count({
        where: { createdBy: userId },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
                {/* Header */}
                <div className="mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-text mb-2">
                            {user.name || 'Teacher Profile'}
                        </h1>
                        <p className="text-text-muted">Your teaching overview</p>
                    </div>
                </div>

                {/* Teacher Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        label="Your Classes"
                        value={teacherClasses}
                        icon={<BookOpen />}
                        color="primary"
                    />
                    <StatCard
                        label="Activities Created"
                        value={teacherStats}
                        icon={<Trophy />}
                        color="success"
                    />
                    <StatCard
                        label="Total Students"
                        value={user._count.classes}
                        icon={<Target />}
                        color="accent"
                    />
                </div>

                {/* Quick Links */}
                <div className="bg-white/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-text mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/classes"
                            className="flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">View All Classes</span>
                            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/stats"
                            className="flex items-center justify-between p-4 bg-success/5 hover:bg-success/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">View Analytics</span>
                            <ChevronRight className="w-5 h-5 text-success group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/activities/new"
                            className="flex items-center justify-between p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">Create Activity</span>
                            <ChevronRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/passwords"
                            className="flex items-center justify-between p-4 bg-warning/5 hover:bg-warning/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">Reset Passwords</span>
                            <ChevronRight className="w-5 h-5 text-warning group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookIcon /> },
                    { href: "/dashboard/classes", label: "Classes", icon: <UsersIcon /> },
                    { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                ]}
            />
        </div>
    );
}
