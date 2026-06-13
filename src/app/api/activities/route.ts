import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import { handleApiError } from "@/lib/api-error";
import { activityInputSchema } from "@/lib/validation/activity";

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

        // Validate shape, size, and that `content` is parseable JSON before any
        // DB write. handleApiError turns a ZodError into a 400 with details.
        const { title, description, type, category, level, content } =
            activityInputSchema.parse(await request.json());

        const activity = await prisma.activity.create({
            data: {
                title,
                description: description || null,
                type,
                category: category || null,
                level: level || null,
                content,
                createdBy: userId,
            },
        });

        return NextResponse.json(activity);
    } catch (error: unknown) {
        return handleApiError(error, "api/activities:POST");
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // List view only needs card fields — never the heavy `content` blob
        // (fetched on demand by GET /api/activities/[id]). Omitting it keeps
        // this response small as the activity count grows.
        const activities = await prisma.activity.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                category: true,
                level: true,
                ui: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(collapseEdPronunciationActivities(activities));
    } catch (error: unknown) {
        return handleApiError(error, "api/activities:GET");
    }
}


