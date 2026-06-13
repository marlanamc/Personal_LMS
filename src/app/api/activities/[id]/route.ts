import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { activityInputSchema } from "@/lib/validation/activity";

interface Props {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        // Validate shape, size, and that `content` is parseable JSON before any
        // DB write. handleApiError turns a ZodError into a 400 with details.
        const { title, description, type, category, level, content } =
            activityInputSchema.parse(await request.json());

        // Verify activity exists
        const existingActivity = await prisma.activity.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!existingActivity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        // Update activity
        const activity = await prisma.activity.update({
            where: { id },
            data: {
                title,
                description: description || null,
                type,
                category: category || null,
                level: level || null,
                content,
            },
        });

        return NextResponse.json(activity);
    } catch (error: unknown) {
        return handleApiError(error, "api/activities/[id]:PUT");
    }
}

export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Verify activity exists
        const activity = await prisma.activity.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        // Soft-delete activity to preserve historical submissions and recoverability.
        await prisma.activity.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isReleased: false,
            },
        });

        return NextResponse.json({ message: "Activity archived successfully" });
    } catch (error: unknown) {
        return handleApiError(error, "api/activities/[id]:DELETE");
    }
}






