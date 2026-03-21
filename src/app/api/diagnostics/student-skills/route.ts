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

    if (!activityId) {
        return NextResponse.json(
            { error: "Missing activityId" },
            { status: 400 }
        );
    }

    const submissions = await prisma.submission.findMany({
        where: {
            userId,
            activityId,
        },
        select: {
            content: true,
            completedAt: true,
        },
        orderBy: {
            completedAt: "desc",
        },
    });

    const flattened = submissions.flatMap((submission) =>
        parseResponsesFromSubmissionContent(submission.content).map((response) => ({
            response,
            completedAt: submission.completedAt,
        }))
    );
    const skills = aggregateResponsesBySkill(flattened);

    return NextResponse.json({
        activityId,
        skills,
    });
}
