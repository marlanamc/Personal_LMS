import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user?.role;
    if (userRole !== 'teacher') {
        return NextResponse.json({ error: "Only teachers can release quizzes" }, { status: 403 });
    }

    const { activityId, released } = await request.json();
    const userId = session.user.id;

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    // Update the activity's content to include released status
    const activity = await prisma.activity.findFirst({
        where: {
            id: activityId,
            deletedAt: null,
        },
        select: { content: true, title: true }
    });

    if (!activity) {
        return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const content = JSON.parse(activity.content);
    content.released = released;

    await prisma.activity.update({
        where: { id: activityId },
        data: {
            content: JSON.stringify(content)
        }
    });

    // If this is a verb quiz being released, create calendar events for all classes
    if (released && content.type === 'verb-quiz' && content.due_date) {
        try {
            // Get all classes for this teacher
            const classes = await prisma.class.findMany({
                where: { teacherId: userId },
                select: { id: true }
            });

            // Parse the due date (format: YYYY-MM-DD)
            const parseDateOnly = (dateStr: string) => {
                const [y, m, d] = dateStr.split("-").map(Number);
                return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0); // noon local to avoid DST edge
            };

            const dueDate = parseDateOnly(content.due_date);

            // Create calendar events for each class
            for (const classItem of classes) {
                // Check if calendar event already exists for this quiz and class
                const existingEvent = await prisma.calendarEvent.findFirst({
                    where: {
                        classId: classItem.id,
                        title: activity.title,
                        type: 'quiz',
                        date: dueDate
                    }
                });

                // Only create if it doesn't already exist
                if (!existingEvent) {
                    await prisma.calendarEvent.create({
                        data: {
                            classId: classItem.id,
                            title: activity.title,
                            description: `Verb quiz due date`,
                            date: dueDate,
                            type: 'quiz',
                            createdById: userId
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error creating calendar events for verb quiz:', error);
            // Don't fail the request if calendar event creation fails
        }
    }

    return NextResponse.json({
        ok: true,
        released,
        message: released ? "Quiz released to students" : "Quiz hidden from students"
    });
}
