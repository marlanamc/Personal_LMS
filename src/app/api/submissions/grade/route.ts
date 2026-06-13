import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageClass } from "@/lib/class-access";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { idString, boundedText } from "@/lib/validation/common";

const gradeSchema = z.object({
    submissionId: idString,
    score: z.number().min(0).max(100).nullish(),
    feedback: boundedText(5000).nullish(),
});

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { submissionId, score, feedback } = gradeSchema.parse(await request.json());

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get submission with assignment and class
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                assignment: {
                    include: {
                        class: true,
                    },
                },
            },
        });

        if (!submission) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        const classId = submission.assignment?.classId;
        if (!classId) {
            return NextResponse.json({ error: "Submission is not linked to a class assignment" }, { status: 400 });
        }

        const canManage = await canManageClass(userId, classId);
        if (!canManage) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update submission (score range is validated by the schema)
        const updated = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                // Preserve prior behavior: explicit null clears the score; an
                // omitted score leaves the existing value unchanged.
                score: score === undefined ? undefined : score,
                feedback: feedback || null,
                status: "graded",
            },
        });

        return NextResponse.json(updated);
    } catch (error: unknown) {
        return handleApiError(error, "api/submissions/grade:POST");
    }
}







