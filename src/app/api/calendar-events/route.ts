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
        const userId = session.user?.id;

        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { classId, title, date, endDate, type = "holiday", description } = body;

        if (!classId || !title || !date) {
            return NextResponse.json({ error: "classId, title, and date are required" }, { status: 400 });
        }

        const allowedTypes = ["holiday", "event", "due", "reminder", "quiz"];
        if (!allowedTypes.includes(type)) {
            return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
        }

        // Parse YYYY-MM-DD strings into local dates to avoid TZ shifting back a day.
        const parseDateOnly = (value: string) => {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0); // noon local to avoid DST edge
        };

        const start = parseDateOnly(date);
        const end = endDate ? parseDateOnly(endDate) : start;
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return NextResponse.json({ error: "Invalid date values" }, { status: 400 });
        }
        if (end.getTime() < start.getTime()) {
            return NextResponse.json({ error: "End date cannot be before start date" }, { status: 400 });
        }

        // Verify ownership
        const classItem = await prisma.class.findUnique({ where: { id: classId } });
        if (!classItem) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }
        if (classItem.teacherId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const event = await prisma.calendarEvent.create({
            data: {
                classId,
                title,
                description: description || null,
                date: start,
                endDate: end,
                type,
                createdById: userId,
            },
        });

        return NextResponse.json(event);
    } catch (error: unknown) {
        console.error("Error creating calendar event:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to create calendar event" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user?.role;
        const userId = session.user?.id;

        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { id } = body || {};
        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const event = await prisma.calendarEvent.findUnique({
            where: { id },
            include: { class: true },
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (event.class.teacherId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.calendarEvent.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("Error deleting calendar event:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to delete calendar event" },
            { status: 500 }
        );
    }
}
