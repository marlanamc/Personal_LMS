import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, updateStreak, checkAndAwardAchievements, calculateQuizPoints, getActivityPoints } from "@/lib/gamification";
import { updateChallengeProgress } from "@/lib/daily-challenge";
import { enforceRateLimit } from "@/lib/rate-limit";
import { ApiError, handleApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

type SubmissionRecord = {
    id: string;
    score: number | null;
};

type SubmissionDelegate = {
    upsert(args: {
        where: {
            userId_activityId_assignmentId: {
                userId: string;
                activityId: string;
                assignmentId: string;
            };
        };
        create: {
            userId: string;
            activityId: string;
            assignmentId: string;
            content: string;
            score: number | null;
            pointsAwarded: number;
            status: "submitted";
            completedAt: Date;
        };
        update: {
            content: string;
            score: number | null;
            pointsAwarded: number;
            status: "submitted";
            completedAt: Date;
        };
    }): Promise<SubmissionRecord>;
    findFirst(args: {
        where: { userId: string; activityId: string; assignmentId: null };
        orderBy: { updatedAt: "desc" };
    }): Promise<{ id: string } | null>;
    update(args: {
        where: { id: string };
        data: {
            content: string;
            score: number | null;
            pointsAwarded: number;
            status: "submitted";
            completedAt: Date;
        };
    }): Promise<SubmissionRecord>;
    create(args: {
        data: {
            userId: string;
            activityId: string;
            assignmentId: null;
            content: string;
            score: number | null;
            pointsAwarded: number;
            status: "submitted";
            completedAt: Date;
        };
    }): Promise<SubmissionRecord>;
};

export async function saveActivitySubmission(params: {
    submission: SubmissionDelegate;
    userId: string;
    activityId: string;
    assignmentId: string | null;
    content: unknown;
    score: number | null;
    pointsAwarded: number;
}): Promise<SubmissionRecord> {
    const { submission, userId, activityId, assignmentId, content, score, pointsAwarded } = params;
    const submissionPayload = {
        content: JSON.stringify(content ?? null),
        score: typeof score === "number" ? score : null,
        pointsAwarded,
        status: "submitted" as const,
        completedAt: new Date(),
    };

    // Prisma can't upsert with nullable fields in composite unique where input.
    // For non-assignment practice submissions, fall back to find/update-or-create.
    if (assignmentId) {
        return submission.upsert({
            where: {
                userId_activityId_assignmentId: {
                    userId,
                    activityId,
                    assignmentId,
                },
            },
            create: {
                userId,
                activityId,
                assignmentId,
                ...submissionPayload,
            },
            update: submissionPayload,
        });
    }

    const existingSubmission = await submission.findFirst({
        where: { userId, activityId, assignmentId: null },
        orderBy: { updatedAt: "desc" },
    });

    if (existingSubmission) {
        return submission.update({
            where: { id: existingSubmission.id },
            data: submissionPayload,
        });
    }

    return submission.create({
        data: {
            userId,
            activityId,
            assignmentId: null,
            ...submissionPayload,
        },
    });
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rateLimitResponse = await enforceRateLimit({
            request,
            limiterName: "activity-submit",
            userId: session.user.id,
        });
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        // SECURITY: Never trust points from client - calculate server-side only
        let body: { activityId?: string; content?: unknown; score?: number; assignmentId?: string | null };
        try {
            body = await request.json();
        } catch {
            throw new ApiError(400, "invalid_json", "Invalid JSON in request body");
        }
        const { activityId, content, score, assignmentId } = body;

        if (!activityId || typeof activityId !== "string") {
            throw new ApiError(400, "missing_activity_id", "activityId is required");
        }

        const userId = session.user.id;

        // Fetch activity to calculate points server-side
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                deletedAt: null,
            },
            select: { title: true, type: true, id: true, content: true, ui: true }
        });

        if (!activity) {
            throw new ApiError(404, "activity_not_found", "Activity not found");
        }

        // Calculate points SERVER-SIDE based on activity type and score
        // NEVER trust points from client request
        const calculatedPoints = activity.type.toLowerCase() === 'quiz'
            ? calculateQuizPoints(score ?? null)
            : getActivityPoints(activity.type, activity);

        const assignmentKey =
            typeof assignmentId === "string" && assignmentId.trim() !== "" && assignmentId !== "null"
                ? assignmentId
                : null;
        const submission = await saveActivitySubmission({
            submission: prisma.submission,
            userId,
            activityId,
            assignmentId: assignmentKey,
            content,
            score: typeof score === "number" ? score : null,
            pointsAwarded: calculatedPoints,
        });

        // Update activity progress to completed
        const progressWhere = {
            userId,
            activityId,
            assignmentId: assignmentKey,
        };
        const existingProgress = await prisma.activityProgress.findFirst({
            where: progressWhere,
        });

        if (existingProgress) {
            await prisma.activityProgress.update({
                where: { id: existingProgress.id },
                data: {
                    progress: 100,
                    status: 'completed',
                },
            });
        } else {
            await prisma.activityProgress.create({
                data: {
                    userId,
                    activityId,
                    assignmentId: assignmentKey,
                    progress: 100,
                    status: 'completed',
                },
            });
        }

        // Award points (calculated server-side)
        if (calculatedPoints > 0) {
            // Include activity type in the reason for better display
            const activityTypeLabel = activity.type.toLowerCase() === 'quiz' ? 'Quiz' : '';
            const reason = activityTypeLabel
                ? `${activity.title || activityId}|${activityTypeLabel}`
                : `Completed: ${activity.title || activityId}`;
            await awardPoints(
                userId,
                calculatedPoints,
                reason
            );

            // Update streak and check for achievements
            await updateStreak(userId, calculatedPoints);
            await checkAndAwardAchievements(userId);
        }

        // Update daily challenge progress
        let challengeCompleted = false;
        let challengeBonusPoints = 0;
        try {
            const challengeResult = await updateChallengeProgress(
                userId,
                activity.type,
                typeof score === "number" ? score : undefined
            );
            challengeCompleted = challengeResult.justCompleted;
            challengeBonusPoints = challengeResult.bonusPoints;
        } catch (error) {
            // Daily challenge table might not exist yet (before migration)
            logger.warn("api/activity/submit: daily challenge update failed", {
                error,
                userId,
                activityId,
            });
        }

        // Detect milestones
        const milestones: string[] = [];

        // Perfect quiz milestone
        if (activity.type.toLowerCase() === "quiz" && score === 100) {
            milestones.push("perfect_quiz");
        }

        // Daily challenge milestone
        if (challengeCompleted) {
            milestones.push("daily_challenge");
        }

        return NextResponse.json({
            ok: true,
            submissionId: submission.id,
            score: submission.score,
            points: calculatedPoints,
            challengeCompleted,
            challengeBonusPoints,
            milestones,
        });
    } catch (error) {
        return handleApiError(error, "api/activity/submit");
    }
}
