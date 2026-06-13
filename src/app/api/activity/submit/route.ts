import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { ApiError, handleApiError } from "@/lib/api-error";

// Use Prisma's generated delegate type so schema drift is caught at compile time.
type SubmissionDelegate = typeof prisma.submission;

export async function saveActivitySubmission(params: {
    submission: SubmissionDelegate;
    userId: string;
    activityId: string;
    assignmentId: string | null;
    content: unknown;
    score: number | null;
}) {
    const { submission, userId, activityId, assignmentId, content, score } = params;
    const submissionPayload = {
        content: JSON.stringify(content ?? null),
        score: typeof score === "number" ? score : null,
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

        const assignmentKey =
            typeof assignmentId === "string" && assignmentId.trim() !== "" && assignmentId !== "null"
                ? assignmentId
                : null;
        // Persist the submission and mark progress complete atomically, so a
        // failure mid-way can't leave a saved submission with no matching
        // completed-progress record (or vice versa).
        const submission = await prisma.$transaction(async (tx) => {
            const saved = await saveActivitySubmission({
                submission: tx.submission,
                userId,
                activityId,
                assignmentId: assignmentKey,
                content,
                score: typeof score === "number" ? score : null,
            });

            const existingProgress = await tx.activityProgress.findFirst({
                where: { userId, activityId, assignmentId: assignmentKey },
            });

            if (existingProgress) {
                await tx.activityProgress.update({
                    where: { id: existingProgress.id },
                    data: { progress: 100, status: "completed" },
                });
            } else {
                await tx.activityProgress.create({
                    data: {
                        userId,
                        activityId,
                        assignmentId: assignmentKey,
                        progress: 100,
                        status: "completed",
                    },
                });
            }

            return saved;
        });


        return NextResponse.json({
            ok: true,
            submissionId: submission.id,
            score: submission.score,
        });
    } catch (error) {
        return handleApiError(error, "api/activity/submit");
    }
}
