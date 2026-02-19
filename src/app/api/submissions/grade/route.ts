import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Only teachers can grade submissions" }, { status: 403 });
        }

        const body = await request.json();
        const { submissionId, score, feedback } = body;

        if (!submissionId) {
            return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
        }

        const userId = session.user?.id;

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

        // Verify teacher owns the class
        if (submission.assignment?.class.teacherId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Validate score if provided
        if (score !== null && (score < 0 || score > 100)) {
            return NextResponse.json({ error: "Score must be between 0 and 100" }, { status: 400 });
        }

        // Update submission
        const updated = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                score: score !== null ? score : null,
                feedback: feedback || null,
                status: "graded",
            },
        });

        return NextResponse.json(updated);
    } catch (error: unknown) {
        console.error("Error grading submission:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to grade submission" },
            { status: 500 }
        );
    }
}









