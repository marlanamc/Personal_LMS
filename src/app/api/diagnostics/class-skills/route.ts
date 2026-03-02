import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Build where clause for difficulty filter
    const whereClause: {
        userId: string;
        activityId: string;
        skillTag: { not: null };
        difficulty?: string;
    } = {
        userId,
        activityId,
        skillTag: { not: null },
    };

    if (difficulty && difficulty !== "all") {
        whereClause.difficulty = difficulty;
    }

    // Aggregate responses by skillTag
    const responses = await prisma.quizResponse.groupBy({
        by: ["skillTag"],
        where: whereClause,
        _count: { id: true },
    });

    // Get individual responses to calculate correct counts
    const allResponses = await prisma.quizResponse.findMany({
        where: whereClause,
        select: {
            skillTag: true,
            isCorrect: true,
        },
    });

    // Process skill data
    const skillMap = new Map<
        string,
        {
            totalAttempts: number;
            correctAttempts: number;
        }
    >();

    // Initialize from grouped data
    responses.forEach((r) => {
        if (r.skillTag) {
            skillMap.set(r.skillTag, {
                totalAttempts: r._count.id,
                correctAttempts: 0,
            });
        }
    });

    // Populate with actual data
    allResponses.forEach((r) => {
        if (!r.skillTag) return;

        const skill = skillMap.get(r.skillTag);
        if (!skill) return;

        if (r.isCorrect) {
            skill.correctAttempts++;
        }
    });

    // Format results
    const skills = Array.from(skillMap.entries()).map(([skillTag, data]) => {
        const percentCorrect =
            data.totalAttempts > 0
                ? Math.round((data.correctAttempts / data.totalAttempts) * 100)
                : 0;

        return {
            skillTag,
            totalAttempts: data.totalAttempts,
            correctAttempts: data.correctAttempts,
            percentCorrect,
        };
    });

    // Sort by percentCorrect ascending (worst performing skills first)
    skills.sort((a, b) => a.percentCorrect - b.percentCorrect);

    return NextResponse.json({
        activityId,
        skills,
    });
}
