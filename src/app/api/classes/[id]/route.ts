import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";

const MAX_ANNOUNCEMENT_LENGTH = 1000;

// Validate the type at the boundary; trim + length handling stays below so the
// length is measured against the trimmed value (matching prior behavior).
const classPatchSchema = z.object({
    announcement: z.string().nullish(),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { announcement: rawAnnouncement } = classPatchSchema.parse(await request.json());

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
                ownerId: session.user.id,
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
        return handleApiError(error, "api/classes/[id]:PATCH");
    }
}
