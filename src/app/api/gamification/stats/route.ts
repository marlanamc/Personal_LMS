import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserGamificationStats } from '@/lib/gamification';
import { handleApiError } from '@/lib/api-error';

/**
 * GET /api/gamification/stats
 * Get user's gamification stats
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const stats = await getUserGamificationStats(userId);

    if (!stats) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ stats });
  } catch (error) {
    return handleApiError(error, 'api/gamification/stats:GET');
  }
}
