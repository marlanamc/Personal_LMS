import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, updateStreak, checkAndAwardAchievements, POINTS } from "@/lib/gamification";

interface GrammarExerciseCategoryData {
    exercises: Record<string, {
        completed: boolean;
        completedAt: string;
        pointsAwarded: number;
    }>;
    totalExercisePoints: number;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, activityId, exerciseId, sectionId } = body as {
        slug: string;
        activityId?: string;
        exerciseId: string;
        sectionId: string;
    };

    if (!slug || typeof slug !== "string") {
        return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!exerciseId || typeof exerciseId !== "string") {
        return NextResponse.json({ error: "exerciseId is required" }, { status: 400 });
    }
    if (!sectionId || typeof sectionId !== "string") {
        return NextResponse.json({ error: "sectionId is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const progressActivityId = activityId || `grammar:${slug}`;

    // Get or create ActivityProgress record
    const existing = await prisma.activityProgress.findFirst({
        where: {
            userId,
            activityId: progressActivityId,
            assignmentId: null,
        },
    });

    // Parse existing category data or initialize
    let categoryData: GrammarExerciseCategoryData = {
        exercises: {},
        totalExercisePoints: 0,
    };

    if (existing?.categoryData) {
        try {
            categoryData = JSON.parse(existing.categoryData);
            if (!categoryData.exercises) {
                categoryData.exercises = {};
            }
            if (typeof categoryData.totalExercisePoints !== 'number') {
                categoryData.totalExercisePoints = 0;
            }
        } catch {
            // Reset if parsing fails
            categoryData = { exercises: {}, totalExercisePoints: 0 };
        }
    }

    // Create a unique key for this exercise
    const exerciseKey = `${sectionId}:${exerciseId}`;

    // Check if already completed (idempotency)
    if (categoryData.exercises[exerciseKey]?.completed) {
        return NextResponse.json({
            ok: true,
            pointsAwarded: 0,
            alreadyCompleted: true,
            totalExercisePoints: categoryData.totalExercisePoints,
        });
    }

    // Award points for this exercise
    const points = POINTS.GRAMMAR_EXERCISE;
    const reason = `grammar-exercise:${slug}:${exerciseKey}`;

    await awardPoints(userId, points, reason);

    // Update category data
    categoryData.exercises[exerciseKey] = {
        completed: true,
        completedAt: new Date().toISOString(),
        pointsAwarded: points,
    };
    categoryData.totalExercisePoints += points;

    // Update or create the ActivityProgress record
    const updatedCategoryDataStr = JSON.stringify(categoryData);

    if (existing) {
        await prisma.activityProgress.update({
            where: { id: existing.id },
            data: {
                categoryData: updatedCategoryDataStr,
                status: "in_progress",
            },
        });
    } else {
        await prisma.activityProgress.create({
            data: {
                userId,
                activityId: progressActivityId,
                assignmentId: null,
                progress: 0,
                status: "in_progress",
                categoryData: updatedCategoryDataStr,
            },
        });
    }

    // Update streak and check achievements
    await updateStreak(userId, points);
    await checkAndAwardAchievements(userId);

    return NextResponse.json({
        ok: true,
        pointsAwarded: points,
        alreadyCompleted: false,
        totalExercisePoints: categoryData.totalExercisePoints,
    });
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const activityId = url.searchParams.get("activityId");

    if (!slug) {
        return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const progressActivityId = activityId || `grammar:${slug}`;

    const existing = await prisma.activityProgress.findFirst({
        where: {
            userId,
            activityId: progressActivityId,
            assignmentId: null,
        },
        select: {
            categoryData: true,
        },
    });

    if (!existing?.categoryData) {
        return NextResponse.json({
            exercises: {},
            totalExercisePoints: 0,
        });
    }

    try {
        const categoryData = JSON.parse(existing.categoryData) as GrammarExerciseCategoryData;
        return NextResponse.json({
            exercises: categoryData.exercises || {},
            totalExercisePoints: categoryData.totalExercisePoints || 0,
        });
    } catch {
        return NextResponse.json({
            exercises: {},
            totalExercisePoints: 0,
        });
    }
}
