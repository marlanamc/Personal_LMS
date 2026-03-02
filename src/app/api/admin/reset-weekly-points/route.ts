import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resetWeeklyPoints } from "@/lib/gamification";
import { handleApiError } from "@/lib/api-error";

/**
 * Reset weekly points for all learners.
 * This should be called every Tuesday to start a new week.
 *
 * Week runs: Tuesday - Monday.
 */
export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await resetWeeklyPoints();

        return NextResponse.json({
            success: true,
            message: "Weekly points reset successfully. New week started!",
            resetDate: new Date().toISOString()
        });
    } catch (error) {
        return handleApiError(error, "api/admin/reset-weekly-points:POST");
    }
}
