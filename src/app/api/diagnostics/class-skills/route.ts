import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role: string };
    if (user.role !== "teacher") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const activityId = searchParams.get("activityId");
    const difficulty = searchParams.get("difficulty");

    if (!classId || !activityId) {
        return NextResponse.json(
            { error: "Missing classId or activityId" },
            { status: 400 }
        );
    }

    // Verify the teacher owns this class
    const classData = await prisma.class.findFirst({
        where: {
            id: classId,
            teacherId: user.id,
        },
    });

    if (!classData) {
        return NextResponse.json(
            { error: "Class not found or access denied" },
            { status: 404 }
        );
    }

    // Get student IDs in class
    const enrollments = await prisma.classEnrollment.findMany({
        where: { classId },
        select: { studentId: true },
    });
    const studentIds = enrollments.map((e) => e.studentId);

    if (studentIds.length === 0) {
        return NextResponse.json({
            classId,
            activityId,
            totalStudents: 0,
            skills: [],
        });
    }

    // Build where clause for difficulty filter
    const whereClause: {
        userId: { in: string[] };
        activityId: string;
        skillTag: { not: null };
        difficulty?: string;
    } = {
        userId: { in: studentIds },
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

    // Get individual responses to calculate correct counts and struggling students
    const allResponses = await prisma.quizResponse.findMany({
        where: whereClause,
        select: {
            userId: true,
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
            studentScores: Map<string, { correct: number; total: number }>;
        }
    >();

    // Initialize from grouped data
    responses.forEach((r) => {
        if (r.skillTag) {
            skillMap.set(r.skillTag, {
                totalAttempts: r._count.id,
                correctAttempts: 0,
                studentScores: new Map(),
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

        // Track per-student performance
        const studentScore = skill.studentScores.get(r.userId) || {
            correct: 0,
            total: 0,
        };
        studentScore.total++;
        if (r.isCorrect) {
            studentScore.correct++;
        }
        skill.studentScores.set(r.userId, studentScore);
    });

    // Format results
    const skills = Array.from(skillMap.entries()).map(([skillTag, data]) => {
        const percentCorrect =
            data.totalAttempts > 0
                ? Math.round((data.correctAttempts / data.totalAttempts) * 100)
                : 0;

        // Count students with <60% on this skill
        let studentsStruggling = 0;
        data.studentScores.forEach((studentScore) => {
            const studentPercent =
                studentScore.total > 0
                    ? (studentScore.correct / studentScore.total) * 100
                    : 0;
            if (studentPercent < 60) {
                studentsStruggling++;
            }
        });

        return {
            skillTag,
            totalAttempts: data.totalAttempts,
            correctAttempts: data.correctAttempts,
            percentCorrect,
            studentsStruggling,
        };
    });

    // Sort by percentCorrect ascending (worst performing skills first)
    skills.sort((a, b) => a.percentCorrect - b.percentCorrect);

    return NextResponse.json({
        classId,
        activityId,
        totalStudents: studentIds.length,
        skills,
    });
}
