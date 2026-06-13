import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError, handleApiError } from "@/lib/api-error";
import type { ActivityProgressStatus } from "@/lib/activityProgress";
import { resolveActivityGameUi } from "@/lib/activity-ui";
import { calculateNumbersGameCompletionPercentage, isNumbersGameCategoryName } from "@/data/numbersGameCategories";

const VOCAB_TYPES = ['word-list', 'flashcards', 'matching', 'fill-blank'] as const;

type ProgressRecord = {
    progress: number;
    status: string;
    categoryData: string | null;
    updatedAt: Date;
};

function parseCategoryData(value: string | null): Record<string, unknown> | null {
    if (!value) return null;
    try {
        const parsed = JSON.parse(value) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return parsed as Record<string, unknown>;
        }
        return null;
    } catch {
        return null;
    }
}

// Accepts already-parsed objects or JSON strings and never throws — legacy
// rows may hold malformed categoryData, and a parse failure must not roll back
// the surrounding progress transaction.
function toCategoryRecord(value: unknown): Record<string, { completed?: boolean }> {
    if (!value) return {};
    if (typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, { completed?: boolean }>;
    }
    if (typeof value === "string") {
        const parsed = parseCategoryData(value);
        return (parsed as Record<string, { completed?: boolean }>) ?? {};
    }
    return {};
}

function asObject(value: unknown): Record<string, unknown> | null {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return null;
}

function asBoolean(value: unknown): boolean {
    return value === true;
}

function asNumber(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sanitizeGuideCompletedSectionIds(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;

    const cleaned = value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .slice(0, 200);

    if (cleaned.length === 0) return undefined;
    return Array.from(new Set(cleaned));
}

function sanitizeGuideStringList(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;
    const cleaned = value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .slice(0, 200);

    if (cleaned.length === 0) return undefined;
    return Array.from(new Set(cleaned));
}

function isVocabCategoryData(data: Record<string, unknown> | null): boolean {
    if (!data) return false;
    return VOCAB_TYPES.some((type) => Object.prototype.hasOwnProperty.call(data, type));
}

function mergeVocabProgressRecords(assignmentRecord: ProgressRecord, globalRecord: ProgressRecord): ProgressRecord | null {
    const assignmentData = parseCategoryData(assignmentRecord.categoryData);
    const globalData = parseCategoryData(globalRecord.categoryData);

    if (!isVocabCategoryData(assignmentData) && !isVocabCategoryData(globalData)) {
        return null;
    }

    const mergedData: Record<string, unknown> = {
        ...(globalData ?? {}),
        ...(assignmentData ?? {}),
    };

    let completedCount = 0;

    for (const vocabType of VOCAB_TYPES) {
        const assignmentTypeData = asObject(assignmentData?.[vocabType]);
        const globalTypeData = asObject(globalData?.[vocabType]);

        if (!assignmentTypeData && !globalTypeData) {
            continue;
        }

        const assignmentCompleted = asBoolean(assignmentTypeData?.completed);
        const globalCompleted = asBoolean(globalTypeData?.completed);
        const assignmentProgress = asNumber(assignmentTypeData?.progress) ?? (assignmentCompleted ? 100 : 0);
        const globalProgress = asNumber(globalTypeData?.progress) ?? (globalCompleted ? 100 : 0);
        const mergedProgress = Math.max(assignmentProgress, globalProgress);
        const mergedCompleted = assignmentCompleted || globalCompleted || mergedProgress >= 100;

        if (mergedCompleted) {
            completedCount += 1;
        }

        const assignmentCompletedAt = typeof assignmentTypeData?.completedAt === "string" ? assignmentTypeData.completedAt : undefined;
        const globalCompletedAt = typeof globalTypeData?.completedAt === "string" ? globalTypeData.completedAt : undefined;

        mergedData[vocabType] = {
            ...(globalTypeData ?? {}),
            ...(assignmentTypeData ?? {}),
            completed: mergedCompleted,
            progress: mergedProgress,
            ...(assignmentCompletedAt || globalCompletedAt
                ? { completedAt: assignmentCompletedAt ?? globalCompletedAt }
                : {}),
        };
    }

    const progress = Math.round((completedCount / VOCAB_TYPES.length) * 100);
    const status = progress >= 100 ? "completed" : "in_progress";

    return {
        progress,
        status,
        categoryData: JSON.stringify(mergedData),
        updatedAt:
            assignmentRecord.updatedAt.getTime() >= globalRecord.updatedAt.getTime()
                ? assignmentRecord.updatedAt
                : globalRecord.updatedAt,
    };
}

function chooseBestProgressRecord(records: ProgressRecord[]): ProgressRecord | null {
    if (records.length === 0) return null;

    let best = records[0]!;
    for (let index = 1; index < records.length; index += 1) {
        const current = records[index]!;
        if (current.progress > best.progress) {
            best = current;
            continue;
        }

        if (current.progress === best.progress && current.updatedAt.getTime() > best.updatedAt.getTime()) {
            best = current;
        }
    }

    return best;
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const activityId = url.searchParams.get("activityId");
    const assignmentId = url.searchParams.get("assignmentId");

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;
    const activityMeta = await prisma.activity.findUnique({
        where: { id: activityId },
        select: { type: true },
    });
    const isGameActivity = activityMeta?.type === "game";

    const select = {
        progress: true,
        status: true,
        categoryData: true,
        updatedAt: true,
    } as const;

    let record: {
        progress: number;
        status: string;
        categoryData: string | null;
        updatedAt: Date;
    } | null = null;

    if (assignmentKey) {
        const [assignmentRecord, globalRecord] = await Promise.all([
            prisma.activityProgress.findFirst({
                where: {
                    userId,
                    activityId,
                    assignmentId: assignmentKey,
                },
                select,
                orderBy: {
                    updatedAt: "desc",
                },
            }),
            prisma.activityProgress.findFirst({
                where: {
                    userId,
                    activityId,
                    assignmentId: null,
                },
                select,
                orderBy: {
                    updatedAt: "desc",
                },
            }),
        ]);

        if (assignmentRecord && globalRecord) {
            const mergedVocabRecord = mergeVocabProgressRecords(assignmentRecord, globalRecord);
            record = mergedVocabRecord ?? assignmentRecord;
        } else {
            record = assignmentRecord ?? globalRecord;
        }
    } else {
        const records = await prisma.activityProgress.findMany({
            where: {
                userId,
                activityId,
            },
            select,
            orderBy: {
                updatedAt: "desc",
            },
        });

        if (records.length > 0) {
            const vocabRecords = records.filter((entry) => isVocabCategoryData(parseCategoryData(entry.categoryData)));

            if (vocabRecords.length > 0) {
                let mergedRecord = vocabRecords[0]!;

                for (let index = 1; index < vocabRecords.length; index += 1) {
                    const candidate = vocabRecords[index]!;
                    const merged = mergeVocabProgressRecords(mergedRecord, candidate);
                    if (merged) {
                        mergedRecord = merged;
                        continue;
                    }

                    const best = chooseBestProgressRecord([mergedRecord, candidate]);
                    if (best) {
                        mergedRecord = best;
                    }
                }

                const bestOverall = chooseBestProgressRecord(records);
                if (bestOverall && bestOverall.progress > mergedRecord.progress) {
                    record = {
                        ...mergedRecord,
                        progress: bestOverall.progress,
                        status: bestOverall.progress >= 100 ? "completed" : "in_progress",
                        updatedAt: bestOverall.updatedAt,
                    };
                } else {
                    record = mergedRecord;
                }
            } else {
                record = chooseBestProgressRecord(records);
            }
        }
    }

    return NextResponse.json({
        progress: record?.progress ?? 0,
        status: isGameActivity ? "in_progress" : (record?.status ?? "in_progress"),
        categoryData: record?.categoryData ?? null,
        updatedAt: record?.updatedAt ?? null,
    }, {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Guard the parse so a malformed body returns a clean 400 instead of an
    // unhandled 500 (mirrors api/activity/submit).
    let body;
    try {
        body = await request.json();
    } catch {
        throw new ApiError(400, "invalid_json", "Invalid JSON in request body");
    }
    const { activityId, progress = 100, status: statusInput, accuracy, category, assignmentId, guideState, vocabType } = body;

    // SECURITY: Input validation
    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    // Validate and sanitize progress (0-100)
    const rawProgress = typeof progress === "number" ? Math.max(0, Math.min(100, Math.round(progress))) : 0;

    // Validate and sanitize accuracy (0-100) if provided
    const sanitizedAccuracy = accuracy !== undefined && accuracy !== null
        ? Math.max(0, Math.min(100, Math.round(Number(accuracy))))
        : undefined;

    // Validate category if provided
    if (category !== undefined && typeof category !== 'string') {
        return NextResponse.json({ error: "Invalid category format" }, { status: 400 });
    }

    let progressValue = rawProgress;
    let statusValue: ActivityProgressStatus | undefined;
    if (typeof statusInput === "string") {
        statusValue = statusInput as ActivityProgressStatus;
    }

    const userId = session.user.id;

    const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;
    const progressWhere = {
        userId,
        activityId,
        assignmentId: assignmentKey,
    };

    const existing = await prisma.activityProgress.findFirst({
        where: progressWhere,
    });

    const activity = await prisma.activity.findUnique({
        where: { id: activityId },
        select: { type: true, title: true, content: true, ui: true, category: true }
    });
    const activityGameUi = activity ? resolveActivityGameUi(activity) : "unknown";
    const isGameActivity = activity?.type === "game";
    const isPronunciationPracticeActivity =
        activity?.type === "game" &&
        (activity.category === "pronunciation" || activityGameUi === "ed-pronunciation" || activityGameUi === "minimal-pairs");

    // Handle category data updates (Numbers Game uses accuracy; Matching Game uses category-only rounds)
    // and guide resume state (grammar guides: last section index)
    let updatedCategoryData: string | undefined;
    let aggregatedNumbersProgress: number | undefined;
    const currentData: Record<string, unknown> = existing?.categoryData
        ? (() => {
            try {
                return JSON.parse(existing.categoryData) as Record<string, unknown>;
            } catch {
                return {};
            }
        })()
        : {};

    if (category) {
        // Update or add this category's progress
        currentData[category] = {
            completed: rawProgress >= 100,
            ...(sanitizedAccuracy !== undefined ? { accuracy: sanitizedAccuracy } : {}),
            completedAt: rawProgress >= 100 ? new Date().toISOString() : (currentData[category] as { completedAt?: string })?.completedAt,
            attempts: ((currentData[category] as { attempts?: number })?.attempts || 0) + 1
        };

        if (isNumbersGameCategoryName(category)) {
            aggregatedNumbersProgress = calculateNumbersGameCompletionPercentage(currentData as Record<string, { completed?: boolean; accuracy?: number }>);
        }
    }

    // Handle vocabulary type updates (word-list, flashcards, matching, fill-blank)
    if (vocabType) {
        const validVocabTypes = ['word-list', 'flashcards', 'matching', 'fill-blank'];
        if (validVocabTypes.includes(vocabType)) {
            currentData[vocabType] = {
                completed: rawProgress >= 100,
                progress: rawProgress,
                completedAt: rawProgress >= 100 ? new Date().toISOString() : (currentData[vocabType] as { completedAt?: string })?.completedAt,
            };

            // Calculate overall progress across all 4 vocab types
            let completedCount = 0;
            const completedTypes: string[] = [];
            for (const vType of validVocabTypes) {
                const typeData = currentData[vType] as { completed?: boolean } | undefined;
                if (typeData?.completed) {
                    completedCount++;
                    completedTypes.push(vType);
                }
            }
            aggregatedNumbersProgress = (completedCount / validVocabTypes.length) * 100;
        }
    }

    // Grammar guides: store resume state so the guide can restore section and completion state.
    if (guideState != null && typeof guideState === "object" && typeof (guideState as { lastSectionIndex?: number }).lastSectionIndex === "number") {
        const parsedGuideState = guideState as {
            lastSectionIndex: number;
            completedSectionIds?: unknown;
            startedStageIds?: unknown;
            attemptedStageIds?: unknown;
            supportViewedStageIds?: unknown;
            revisedStageIds?: unknown;
            completedStageIds?: unknown;
        };
        const lastSectionIndex = Math.max(0, Math.round(parsedGuideState.lastSectionIndex));
        const completedSectionIds = sanitizeGuideCompletedSectionIds(parsedGuideState.completedSectionIds);
        const startedStageIds = sanitizeGuideStringList(parsedGuideState.startedStageIds);
        const attemptedStageIds = sanitizeGuideStringList(parsedGuideState.attemptedStageIds);
        const supportViewedStageIds = sanitizeGuideStringList(parsedGuideState.supportViewedStageIds);
        const revisedStageIds = sanitizeGuideStringList(parsedGuideState.revisedStageIds);
        const completedStageIds = sanitizeGuideStringList(parsedGuideState.completedStageIds);
        const existingGuide = asObject(currentData._guide) ?? {};

        currentData._guide = {
            ...existingGuide,
            lastSectionIndex,
            ...(completedSectionIds ? { completedSectionIds } : {}),
            ...(startedStageIds ? { startedStageIds } : {}),
            ...(attemptedStageIds ? { attemptedStageIds } : {}),
            ...(supportViewedStageIds ? { supportViewedStageIds } : {}),
            ...(revisedStageIds ? { revisedStageIds } : {}),
            ...(completedStageIds ? { completedStageIds } : {}),
        };
    }

    if (category || "_guide" in currentData || vocabType) {
        updatedCategoryData = JSON.stringify(currentData);
    }

    if (aggregatedNumbersProgress !== undefined) {
        progressValue = aggregatedNumbersProgress;
        statusValue = aggregatedNumbersProgress >= 100 ? "completed" : "in_progress";
    }

    // Games are always replayable and should not become "completed" activities.
    if (isGameActivity) {
        statusValue = "in_progress";
    }

    // Pronunciation games are intentionally open-ended practice and should never show as completed.
    if (isPronunciationPracticeActivity) {
        progressValue = 0;
        statusValue = "in_progress";
    }

    const finalStatus: ActivityProgressStatus = statusValue ?? (progressValue >= 100 ? "completed" : "in_progress");

    const progressData = {
        progress: progressValue,
        status: finalStatus,
    };
    if (updatedCategoryData) {
        Object.assign(progressData, { categoryData: updatedCategoryData });
    }

    // The per-assignment progress write and the global vocabulary sync run in a
    // single transaction so the two records can never silently diverge: either
    // both commit or neither does. (Previously the sync was best-effort in a
    // try/catch that swallowed errors, leaving the records out of sync on
    // failure.) JSON parsing below is defensive so legacy/malformed data can't
    // throw and roll back the primary write.
    const record = await prisma.$transaction(async (tx) => {
        const primary = existing
            ? await tx.activityProgress.update({
                where: { id: existing.id },
                data: progressData,
            })
            : await tx.activityProgress.create({
                data: {
                    userId,
                    activityId,
                    assignmentId: assignmentKey,
                    ...progressData,
                },
            });

        // For vocabulary activities with assignmentId, also sync to a global
        // progress record (the one without an assignmentId).
        if (vocabType && assignmentKey && updatedCategoryData) {
            const globalRecord = await tx.activityProgress.findFirst({
                where: { userId, activityId, assignmentId: null },
            });

            if (globalRecord) {
                // Merge categoryData: take the new data for this vocabType,
                // keep existing entries for the others.
                const existingGlobalData = toCategoryRecord(globalRecord.categoryData);
                const newData = toCategoryRecord(updatedCategoryData);
                const mergedData = { ...existingGlobalData, ...newData };

                const completedCount = VOCAB_TYPES.filter((vType) => mergedData[vType]?.completed).length;
                const globalProgress = (completedCount / VOCAB_TYPES.length) * 100;
                const globalStatus = globalProgress >= 100 ? 'completed' : 'in_progress';

                await tx.activityProgress.update({
                    where: { id: globalRecord.id },
                    data: {
                        categoryData: JSON.stringify(mergedData),
                        progress: globalProgress,
                        status: globalStatus,
                    },
                });
            } else {
                await tx.activityProgress.create({
                    data: {
                        userId,
                        activityId,
                        assignmentId: null,
                        ...progressData,
                    },
                });
            }
        }

        return primary;
    });

    // Points system removed - gamification disabled

    return NextResponse.json({ ok: true, progress: record.progress, status: record.status });
  } catch (error) {
    return handleApiError(error, "api/activity/progress");
  }
}
