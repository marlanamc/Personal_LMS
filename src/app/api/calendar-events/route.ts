import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageClass } from "@/lib/class-access";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            classId,
            title,
            date,
            time,
            endDate,
            endTime,
            startDateTime,
            endDateTime,
            type = "holiday",
            description,
        } = body;

        if (!classId || !title || !date) {
            return NextResponse.json({ error: "classId, title, and date are required" }, { status: 400 });
        }

        const allowedTypes = ["holiday", "event", "due", "reminder", "quiz"];
        if (!allowedTypes.includes(type)) {
            return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
        }

        // Parse YYYY-MM-DD strings into local dates to avoid TZ shifting back a day.
        const parseTime = (value: string) => {
            const [rawHour = "0", rawMinute = "0"] = value.split(":");
            const hour = Number(rawHour);
            const minute = Number(rawMinute);
            if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
            return { hour, minute };
        };

        const parseDateOnly = (value: string) => {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0); // noon local to avoid DST edge
        };

        const parseDateWithOptionalTime = (dateValue: string, timeValue?: string) => {
            if (!timeValue) return parseDateOnly(dateValue);
            const parsedTime = parseTime(timeValue);
            if (!parsedTime) return null;
            const [y, m, d] = dateValue.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, parsedTime.hour, parsedTime.minute, 0, 0);
        };

        if (time && !/^\d{2}:\d{2}$/.test(time)) {
            return NextResponse.json({ error: "Invalid time format" }, { status: 400 });
        }
        if (endTime && !/^\d{2}:\d{2}$/.test(endTime)) {
            return NextResponse.json({ error: "Invalid time format" }, { status: 400 });
        }

        const parseIsoDateTime = (value?: string) => {
            if (!value || typeof value !== "string") return null;
            const parsed = new Date(value);
            if (Number.isNaN(parsed.getTime())) return null;
            return parsed;
        };

        const startFromClient = parseIsoDateTime(startDateTime);
        const endFromClient = parseIsoDateTime(endDateTime);

        const start = startFromClient || parseDateWithOptionalTime(date, time);
        const resolvedEndDate = endDate || date;
        const end = endFromClient || parseDateWithOptionalTime(resolvedEndDate, endTime);
        if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
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
        const canManage = await canManageClass(userId, classId);
        if (!canManage) {
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
        return handleApiError(error, "api/calendar-events:POST");
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            id,
            title,
            date,
            time,
            endDate,
            endTime,
            startDateTime,
            endDateTime,
            type = "holiday",
            description,
        } = body;

        if (!id || !title || !date) {
            return NextResponse.json({ error: "id, title, and date are required" }, { status: 400 });
        }

        const allowedTypes = ["holiday", "event", "due", "reminder", "quiz"];
        if (!allowedTypes.includes(type)) {
            return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
        }

        const parseTime = (value: string) => {
            const [rawHour = "0", rawMinute = "0"] = value.split(":");
            const hour = Number(rawHour);
            const minute = Number(rawMinute);
            if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
            return { hour, minute };
        };

        const parseDateOnly = (value: string) => {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
        };

        const parseDateWithOptionalTime = (dateValue: string, timeValue?: string) => {
            if (!timeValue) return parseDateOnly(dateValue);
            const parsedTime = parseTime(timeValue);
            if (!parsedTime) return null;
            const [y, m, d] = dateValue.split("-").map(Number);
            return new Date(y, (m || 1) - 1, d || 1, parsedTime.hour, parsedTime.minute, 0, 0);
        };

        const parseIsoDateTime = (value?: string) => {
            if (!value || typeof value !== "string") return null;
            const parsed = new Date(value);
            if (Number.isNaN(parsed.getTime())) return null;
            return parsed;
        };

        if (time && !/^\d{2}:\d{2}$/.test(time)) {
            return NextResponse.json({ error: "Invalid time format" }, { status: 400 });
        }
        if (endTime && !/^\d{2}:\d{2}$/.test(endTime)) {
            return NextResponse.json({ error: "Invalid time format" }, { status: 400 });
        }

        const startFromClient = parseIsoDateTime(startDateTime);
        const endFromClient = parseIsoDateTime(endDateTime);
        const start = startFromClient || parseDateWithOptionalTime(date, time);
        const resolvedEndDate = endDate || date;
        const end = endFromClient || parseDateWithOptionalTime(resolvedEndDate, endTime);

        if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return NextResponse.json({ error: "Invalid date values" }, { status: 400 });
        }
        if (end.getTime() < start.getTime()) {
            return NextResponse.json({ error: "End date cannot be before start date" }, { status: 400 });
        }

        const event = await prisma.calendarEvent.findUnique({
            where: { id },
            include: { class: true },
        });
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const canManage = await canManageClass(userId, event.classId);
        if (!canManage) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.calendarEvent.update({
            where: { id },
            data: {
                title,
                description: description || null,
                type,
                date: start,
                endDate: end,
            },
        });

        return NextResponse.json(updated);
    } catch (error: unknown) {
        return handleApiError(error, "api/calendar-events:PATCH");
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

        const canManage = await canManageClass(userId, event.classId);
        if (!canManage) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.calendarEvent.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return handleApiError(error, "api/calendar-events:DELETE");
    }
}
