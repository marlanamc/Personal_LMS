import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getClassAccess(userId: string, classId: string): Promise<{ exists: boolean; hasAccess: boolean }> {
    const classItem = await prisma.class.findUnique({
        where: { id: classId },
        select: { teacherId: true },
    });

    if (!classItem) {
        return { exists: false, hasAccess: false };
    }

    if (classItem.teacherId === userId) {
        return { exists: true, hasAccess: true };
    }

    const enrollment = await prisma.classEnrollment.findUnique({
        where: {
            classId_studentId: {
                classId,
                studentId: userId,
            },
        },
        select: { classId: true },
    });

    return { exists: true, hasAccess: Boolean(enrollment) };
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { classId, activityId, title, instructions, dueDate } = body;

        if (!classId || !activityId) {
            return NextResponse.json(
                { error: "Class ID and Activity ID are required" },
                { status: 400 }
            );
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const classAccess = await getClassAccess(userId, classId);
        if (!classAccess.exists) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        if (!classAccess.hasAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Verify activity exists
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                deletedAt: null,
            },
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        const assignment = await prisma.assignment.create({
            data: {
                classId,
                activityId,
                title: title || null,
                instructions: instructions || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                isFeatured: true, // Auto-feature new assignments
            },
        });

        return NextResponse.json(assignment);
    } catch (error: unknown) {
        console.error("Error creating assignment:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to create assignment" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { assignmentId, isFeatured } = body;

        if (!assignmentId || typeof isFeatured !== 'boolean') {
            return NextResponse.json(
                { error: "Assignment ID and isFeatured boolean are required" },
                { status: 400 }
            );
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: { id: true, classId: true, class: { select: { teacherId: true } } }
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const hasClassAccess = assignment.class.teacherId === userId || Boolean(
            await prisma.classEnrollment.findUnique({
                where: {
                    classId_studentId: {
                        classId: assignment.classId,
                        studentId: userId,
                    },
                },
                select: { classId: true },
            })
        );

        if (!hasClassAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedAssignment = await prisma.assignment.update({
            where: { id: assignmentId },
            data: { isFeatured },
        });

        return NextResponse.json(updatedAssignment);
    } catch (error: unknown) {
        console.error("Error updating assignment:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to update assignment" },
            { status: 500 }
        );
    }
}


