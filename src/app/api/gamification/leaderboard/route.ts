import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTimeframedLeaderboard, LeaderboardRange } from '@/lib/gamification';

/**
 * GET /api/gamification/leaderboard
 * Get the leaderboard for a timeframe (day, week, month)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const timeframeParam = (searchParams.get('timeframe') || 'week').toLowerCase() as LeaderboardRange;
    const timeframe: LeaderboardRange = ['day', 'week', 'month'].includes(timeframeParam) ? timeframeParam : 'week';

    const leaderboard = await getTimeframedLeaderboard(timeframe, limit, classId || undefined);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('[Leaderboard] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
