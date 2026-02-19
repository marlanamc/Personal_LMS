import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, updateStreak, checkAndAwardAchievements, calculateQuizPoints, getActivityPoints } from "@/lib/gamification";

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

        // SECURITY: Never trust points from client - calculate server-side only
        let body: { activityId?: string; content?: unknown; score?: number; assignmentId?: string | null };
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }
        const { activityId, content, score, assignmentId } = body;

        if (!activityId || typeof activityId !== "string") {
            return NextResponse.json({ error: "activityId is required" }, { status: 400 });
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
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
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

        return NextResponse.json({
            ok: true,
            submissionId: submission.id,
            score: submission.score,
            points: calculatedPoints
        });
    } catch (error) {
        console.error("[api/activity/submit] Error:", error);
        const message = error instanceof Error ? error.message : "Failed to submit activity";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
