import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_ANNOUNCEMENT_LENGTH = 1000;

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user?.role !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const rawAnnouncement = body?.announcement;

        if (rawAnnouncement !== null && rawAnnouncement !== undefined && typeof rawAnnouncement !== "string") {
            return NextResponse.json({ error: "Announcement must be a string or null" }, { status: 400 });
        }

        const cleanedAnnouncement =
            typeof rawAnnouncement === "string" ? rawAnnouncement.trim() : null;

        if (cleanedAnnouncement && cleanedAnnouncement.length > MAX_ANNOUNCEMENT_LENGTH) {
            return NextResponse.json(
                { error: `Announcement is too long (max ${MAX_ANNOUNCEMENT_LENGTH} characters)` },
                { status: 400 }
            );
        }

        const existingClass = await prisma.class.findFirst({
            where: {
                id,
                teacherId: session.user.id,
            },
            select: { id: true },
        });

        if (!existingClass) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        const updatedClass = await prisma.class.update({
            where: { id },
            data: {
                announcement: cleanedAnnouncement || null,
            },
            select: {
                id: true,
                announcement: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updatedClass);
    } catch (error: unknown) {
        console.error("Error updating class announcement:", error);
        return NextResponse.json(
            { error: "Failed to update class announcement" },
            { status: 500 }
        );
    }
}
