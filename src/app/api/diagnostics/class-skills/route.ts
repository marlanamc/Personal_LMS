import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aggregateResponsesBySkill, parseResponsesFromSubmissionContent } from "@/lib/grammar-response-analytics";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");
    const difficulty = searchParams.get("difficulty");

    if (!activityId) {
        return NextResponse.json(
            { error: "Missing activityId" },
            { status: 400 }
        );
    }

    const whereClause: {
        userId: string;
        activityId: string;
    } = {
        userId,
        activityId,
    };
    const submissions = await prisma.submission.findMany({
        where: whereClause,
        select: {
            content: true,
            completedAt: true,
        },
    });
    const flattened = submissions.flatMap((submission) =>
        parseResponsesFromSubmissionContent(submission.content).map((response) => ({
            response,
            completedAt: submission.completedAt,
        }))
    );
    const skills = aggregateResponsesBySkill(
        flattened,
        difficulty && difficulty !== "all" ? difficulty : null
    ).map((stat) => ({
        skillTag: stat.skillTag,
        totalAttempts: stat.attempts,
        correctAttempts: stat.correct,
        percentCorrect: stat.percentCorrect,
        communicativeGoalTag: stat.communicativeGoalTag,
        failureReasonTag: stat.failureReasonTag,
        improvedAfterSupportCount: stat.improvedAfterSupportCount ?? 0,
    }));

    return NextResponse.json({
        activityId,
        skills,
    });
}
