import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { activityId, activityTitle, difficulty, type, message } = body;

        // Validate required fields
        if (!type || !message?.trim()) {
            return NextResponse.json(
                { error: "Feedback type and message are required" },
                { status: 400 }
            );
        }

        // Store feedback in database (you could create a Feedback model)
        // For now, let's log it and you can implement storage later
        console.log("Feedback received:", {
            userId: session.user.id,
            activityId,
            activityTitle,
            difficulty,
            type,
            message: message.trim(),
            timestamp: new Date().toISOString(),
        });

        // TODO: Create Feedback model and store in database
        // const feedback = await prisma.feedback.create({
        //     data: {
        //         userId: session.user.id,
        //         activityId,
        //         activityTitle,
        //         difficulty,
        //         type,
        //         message: message.trim(),
        //     },
        // });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving feedback:", error);
        return NextResponse.json(
            { error: "Failed to save feedback" },
            { status: 500 }
        );
    }
}
