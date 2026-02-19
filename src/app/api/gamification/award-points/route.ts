import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { awardPoints, updateStreak, calculateQuizPoints, getActivityPoints, checkAndAwardAchievements } from '@/lib/gamification';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/gamification/award-points
 * Award points when a student completes an activity/quiz
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { submissionId, activityType, score } = await req.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
    }

    // Check if points already awarded for this submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        activity: {
          select: {
            id: true,
            type: true,
            content: true,
            ui: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.pointsAwarded > 0) {
      return NextResponse.json({
        message: 'Points already awarded for this submission',
        pointsAwarded: submission.pointsAwarded,
      });
    }

    // Calculate points based on activity type and score
    // For quizzes, use score-based calculation; for other activities, use type-based
    const activityTypeFromDb = submission.activity?.type ?? activityType ?? 'activity';
    const isQuiz = activityTypeFromDb?.toLowerCase() === 'quiz';
    const points = isQuiz
      ? calculateQuizPoints(score)
      : getActivityPoints(activityTypeFromDb, submission.activity ?? undefined);

    // Award points
    await awardPoints(userId, points, `Completed activity ${submission.activityId}`);

    // Update submission with points awarded
    await prisma.submission.update({
      where: { id: submissionId },
      data: { pointsAwarded: points },
    });

    // Update streak
    const streakResult = await updateStreak(userId, points);

    // Check for new achievements
    const newAchievements = await checkAndAwardAchievements(userId);

    // Get updated user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
        weeklyPoints: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    return NextResponse.json({
      success: true,
      pointsAwarded: points,
      streak: {
        updated: streakResult.streakUpdated,
        current: streakResult.newStreak,
        pointsFromStreak: streakResult.pointsAwarded,
      },
      newAchievements: newAchievements.length,
      user,
    });
  } catch (error) {
    console.error('[Award Points] Error:', error);
    return NextResponse.json({ error: 'Failed to award points' }, { status: 500 });
  }
}
