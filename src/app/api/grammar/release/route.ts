import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'teacher') {
        return NextResponse.json(
            { error: "Only teachers can release grammar guides" },
            { status: 403 }
        );
    }

    try {
        const { activityId, released } = await request.json();

        if (!activityId || typeof activityId !== "string") {
            return NextResponse.json(
                { error: "activityId is required" },
                { status: 400 }
            );
        }

        if (typeof released !== "boolean") {
            return NextResponse.json(
                { error: "released must be a boolean" },
                { status: 400 }
            );
        }

        // Verify it's a grammar guide
        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId,
                deletedAt: null,
            },
            select: { type: true, category: true, title: true }
        });

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        if (activity.type !== 'guide' || activity.category !== 'grammar') {
            return NextResponse.json(
                { error: "Only grammar guides can be released/hidden" },
                { status: 400 }
            );
        }

        // Update release status
        await prisma.activity.update({
            where: { id: activityId },
            data: { isReleased: released }
        });

        return NextResponse.json({
            ok: true,
            released,
            message: released
                ? `"${activity.title}" is now visible to students`
                : `"${activity.title}" is now hidden from students`
        });
    } catch (error: unknown) {
        console.error("Error updating grammar guide release status:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to update release status" },
            { status: 500 }
        );
    }
}
