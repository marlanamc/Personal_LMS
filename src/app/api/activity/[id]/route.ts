import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const activity = await prisma.activity.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            type: true,
            category: true,
            level: true,
            ui: true,
        },
    });

    if (!activity) {
        return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json(activity);
}
