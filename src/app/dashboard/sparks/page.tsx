import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SparksPageClient } from '@/components/sparks/SparksPageClient';
import type { GamificationStats } from '@/components/sparks/CelebrationCorner';

export const metadata = {
  title: 'Sparks | Personal LMS',
  description: 'A safe space for interest-based nervous systems. Find your spark when you feel stuck.',
};

async function getGamificationStats(userId: string): Promise<GamificationStats | null> {
  try {
    const [user, recentAchievements] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          points: true,
          currentStreak: true,
          longestStreak: true,
        },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        orderBy: { earnedAt: 'desc' },
        take: 5,
        include: {
          achievement: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    if (!user) return null;

    return {
      totalPoints: user.points,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      recentAchievements: recentAchievements.map((ua) => ({
        id: ua.id,
        name: ua.achievement.name,
        earnedAt: ua.earnedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('[Sparks] Failed to load gamification stats:', error);
    return null;
  }
}

export default async function SparksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as { id: string }).id;
  const stats = await getGamificationStats(userId);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
      <SparksPageClient storageScope={userId} initialStats={stats} />
    </main>
  );
}
