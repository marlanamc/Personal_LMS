import { NextRequest, NextResponse } from "next/server";
import { resetWeeklyPoints } from "@/lib/gamification";

/**
 * Cron job to reset weekly leaderboard points
 * Runs every Tuesday at midnight UTC
 * Week runs: Tuesday - Monday
 *
 * This endpoint is secured by Vercel Cron's authorization header
 */
export async function GET(request: NextRequest) {
    // SECURITY: Validate CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET;

    // Fail closed - deny if secret not configured
    if (!cronSecret) {
        console.error('[Cron] CRITICAL: CRON_SECRET not configured in environment variables');
        return NextResponse.json(
            { error: 'Service unavailable' },
            { status: 503 }
        );
    }

    // Verify this request is from Vercel Cron
    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${cronSecret}`) {
        console.warn('[Cron] Unauthorized cron attempt - invalid authorization header');
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        await resetWeeklyPoints();

        console.log('[Cron] Weekly points reset completed successfully');

        return NextResponse.json({
            success: true,
            message: "Weekly points reset successfully. New week started!",
            resetDate: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Cron] Error resetting weekly points:', error);
        return NextResponse.json(
            { error: "Failed to reset weekly points" },
            { status: 500 }
        );
    }
}
