import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resetWeeklyPoints } from "@/lib/gamification";

/**
 * Reset weekly points for all students
 * This should be called every Tuesday to start a new week
 *
 * Week runs: Tuesday - Monday
 */
export async function POST() {
    const session = await getServerSession(authOptions);

    // Only teachers can reset weekly points
    if (!session?.user || session.user.role !== "teacher") {
        return NextResponse.json({ error: "Unauthorized - Teachers only" }, { status: 401 });
    }

    try {
        await resetWeeklyPoints();

        return NextResponse.json({
            success: true,
            message: "Weekly points reset successfully. New week started!",
            resetDate: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Reset Weekly Points] Error:', error);
        return NextResponse.json(
            { error: "Failed to reset weekly points" },
            { status: 500 }
        );
    }
}
