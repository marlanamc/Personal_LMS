import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import { TeacherActivityCategories } from "@/components/dashboard";
import { ActivityCategoryPicker } from "@/components/dashboard/ActivityCategoryPicker";

type Props = { searchParams: Promise<{ category?: string }> };
const VOCAB_TYPES = ["word-list", "flashcards", "matching", "fill-blank"] as const;

type ProgressEntry = {
    activityId: string;
    progress: number;
    categoryData: string | null;
    updatedAt: Date;
};

function parseCategoryData(raw: string | null): Record<string, unknown> | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
        return parsed as Record<string, unknown>;
    } catch {
        return null;
    }
}

function asObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
}

function isVocabCategoryData(data: Record<string, unknown> | null): boolean {
    if (!data) return false;
    return VOCAB_TYPES.some((type) => Object.prototype.hasOwnProperty.call(data, type));
}

function getVocabProgressFromCategoryData(data: Record<string, unknown> | null): number {
    if (!data) return 0;

    const completedCount = VOCAB_TYPES.filter((type) => {
        const typeData = asObject(data[type]);
        if (!typeData) return false;
        const progress = typeof typeData.progress === "number" ? typeData.progress : 0;
        return typeData.completed === true || progress >= 100;
    }).length;

    return Math.round((completedCount / VOCAB_TYPES.length) * 100);
}

function mergeVocabCategoryData(
    existingData: Record<string, unknown> | null,
    incomingData: Record<string, unknown> | null
): Record<string, unknown> {
    const merged: Record<string, unknown> = {
        ...(existingData ?? {}),
        ...(incomingData ?? {}),
    };

    for (const vocabType of VOCAB_TYPES) {
        const existingTypeData = asObject(existingData?.[vocabType]);
        const incomingTypeData = asObject(incomingData?.[vocabType]);

        if (!existingTypeData && !incomingTypeData) {
            continue;
        }

        const existingCompleted = existingTypeData?.completed === true;
        const incomingCompleted = incomingTypeData?.completed === true;
        const existingProgress =
            typeof existingTypeData?.progress === "number"
                ? existingTypeData.progress
                : existingCompleted
                    ? 100
                    : 0;
        const incomingProgress =
            typeof incomingTypeData?.progress === "number"
                ? incomingTypeData.progress
                : incomingCompleted
                    ? 100
                    : 0;

        const completedAt =
            typeof incomingTypeData?.completedAt === "string"
                ? incomingTypeData.completedAt
                : typeof existingTypeData?.completedAt === "string"
                    ? existingTypeData.completedAt
                    : undefined;

        merged[vocabType] = {
            ...(existingTypeData ?? {}),
            ...(incomingTypeData ?? {}),
            completed: existingCompleted || incomingCompleted || Math.max(existingProgress, incomingProgress) >= 100,
            progress: Math.max(existingProgress, incomingProgress),
            ...(completedAt ? { completedAt } : {}),
        };
    }

    return merged;
}

function buildProgressMap(progressEntries: ProgressEntry[]): Record<string, { progress: number; categoryData?: string }> {
    type MergedProgressEntry = {
        progress: number;
        categoryData: Record<string, unknown> | null;
        isVocab: boolean;
        updatedAtMs: number;
    };

    const mergedByActivity = progressEntries.reduce<Record<string, MergedProgressEntry>>((acc, row) => {
        const parsedCategoryData = parseCategoryData(row.categoryData);
        const rowIsVocab = isVocabCategoryData(parsedCategoryData);
        const rowProgress = rowIsVocab
            ? Math.max(row.progress, getVocabProgressFromCategoryData(parsedCategoryData))
            : row.progress;
        const updatedAtMs = row.updatedAt.getTime();
        const existing = acc[row.activityId];

        if (!existing) {
            acc[row.activityId] = {
                progress: rowProgress,
                categoryData: parsedCategoryData,
                isVocab: rowIsVocab,
                updatedAtMs,
            };
            return acc;
        }

        if (existing.isVocab || rowIsVocab) {
            const mergedCategoryData = mergeVocabCategoryData(existing.categoryData, parsedCategoryData);
            const mergedProgress = Math.max(
                existing.progress,
                rowProgress,
                getVocabProgressFromCategoryData(mergedCategoryData)
            );

            acc[row.activityId] = {
                progress: mergedProgress,
                categoryData: mergedCategoryData,
                isVocab: true,
                updatedAtMs: Math.max(existing.updatedAtMs, updatedAtMs),
            };
            return acc;
        }

        const mergedCategoryData =
            existing.categoryData || parsedCategoryData
                ? {
                    ...(existing.categoryData ?? {}),
                    ...(parsedCategoryData ?? {}),
                }
                : null;
        const shouldUseRow = rowProgress > existing.progress || (rowProgress === existing.progress && updatedAtMs > existing.updatedAtMs);

        acc[row.activityId] = {
            progress: shouldUseRow ? rowProgress : existing.progress,
            categoryData: mergedCategoryData,
            isVocab: false,
            updatedAtMs: Math.max(existing.updatedAtMs, updatedAtMs),
        };

        return acc;
    }, {});

    return Object.fromEntries(
        Object.entries(mergedByActivity).map(([activityId, value]) => [
            activityId,
            {
                progress: value.progress,
                ...(value.categoryData ? { categoryData: JSON.stringify(value.categoryData) } : {}),
            },
        ])
    );
}

export default async function ActivitiesPage({ searchParams }: Props) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const userId = session.user?.id;
    const userRole = session.user?.role;

    // Filter activities by release status for students
    const activities = await prisma.activity.findMany({
        where: userRole === "student"
            ? {
                deletedAt: null,
                OR: [
                    // Released grammar guides only
                    { type: "guide", category: "grammar", isReleased: true },
                    // Non-grammar activities (speaking/quiz filtered client-side)
                    { NOT: { AND: [{ type: "guide" }, { category: "grammar" }] } }
                ]
            }
            : { deletedAt: null },
        orderBy: { createdAt: "desc" },
    });
    const visibleActivities = collapseEdPronunciationActivities(activities);

    if (userRole === "teacher") {
        // Teacher View - Get featured assignments and class info
        const classes = await prisma.class.findMany({
            where: { teacherId: userId },
            include: {
                assignments: {
                    include: {
                        activity: true,
                    },
                },
            },
        });

        const allAssignments = classes.flatMap((c) => c.assignments);
        const featuredAssignments = allAssignments.filter((a) => a.isFeatured);
        const featuredActivityIds = new Set(featuredAssignments.map((a) => a.activityId));
        const activityAssignmentMap: Record<string, string> = {};
        featuredAssignments.forEach((assignment) => {
            activityAssignmentMap[assignment.activityId] = assignment.id;
        });

        const defaultClassId = classes.length > 0 ? classes[0]!.id : null;

        return (
            <div className="min-h-screen bg-bg">
                <header className="sticky top-0 backdrop-blur-md border-b z-40 bg-white/90 border-white/60 shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                        <p className="text-xs font-semibold text-secondary tracking-widest uppercase">Browse</p>
                        <h1 className="text-3xl font-display font-bold text-text">All Activities</h1>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
                    <TeacherActivityCategories
                        activities={visibleActivities}
                        featuredActivityIds={featuredActivityIds}
                        defaultClassId={defaultClassId}
                        activityAssignmentMap={activityAssignmentMap}
                    />
                </main>
            </div>
        );
    }

    // Student View
    const progressEntries = await prisma.activityProgress.findMany({
        where: { userId },
        select: { activityId: true, progress: true, categoryData: true, updatedAt: true },
    });
    const progressMap = buildProgressMap(progressEntries as ProgressEntry[]);

    const completedActivities = await prisma.submission.findMany({
        where: {
            userId,
            status: { in: ["submitted", "graded"] },
            completedAt: { not: null }
        },
        select: { activityId: true }
    });
    const completedActivityIds = new Set<string>(completedActivities.map((s: { activityId: string }) => s.activityId));

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 backdrop-blur-md border-b z-40 bg-white/90 border-white/60 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-text text-center">
                        What do you want to{" "}
                        <span className="text-primary italic">practice</span> today?
                    </h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
                <ActivityCategoryPicker
                    activities={visibleActivities}
                    completedActivityIds={completedActivityIds}
                    progressMap={progressMap}
                    initialCategory={(await searchParams).category ?? null}
                />
            </main>
        </div>
    );
}
