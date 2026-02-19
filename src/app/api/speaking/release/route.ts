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
        return NextResponse.json({ error: "Only teachers can release speaking activities" }, { status: 403 });
    }

    const { activityId, released } = await request.json();

    if (!activityId || typeof activityId !== "string") {
        return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    // Update the activity's content to include released status
    const activity = await prisma.activity.findFirst({
        where: {
            id: activityId,
            deletedAt: null,
        },
        select: { content: true }
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

    return NextResponse.json({
        ok: true,
        released,
        message: released ? "Speaking activity released to students" : "Speaking activity hidden from students"
    });
}
