import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";

async function userOwnsClass(userId: string, classId: string): Promise<boolean> {
    const classItem = await prisma.class.findUnique({
        where: { id: classId },
        select: { ownerId: true },
    });

    return classItem?.ownerId === userId;
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

        const ownsClass = await userOwnsClass(userId, classId);
        if (!ownsClass) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
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
        return handleApiError(error, "api/assignments:POST");
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
            select: { id: true, classId: true, class: { select: { ownerId: true } } }
        });

        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        if (assignment.class.ownerId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedAssignment = await prisma.assignment.update({
            where: { id: assignmentId },
            data: { isFeatured },
        });

        return NextResponse.json(updatedAssignment);
    } catch (error: unknown) {
        return handleApiError(error, "api/assignments:PATCH");
    }
}
