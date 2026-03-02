import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { awardPoints, updateStreak, calculateQuizPoints, getActivityPoints, checkAndAwardAchievements } from '@/lib/gamification';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rate-limit';
import { ApiError, handleApiError } from '@/lib/api-error';

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
    const rateLimitResponse = await enforceRateLimit({
      request: req,
      limiterName: 'award-points',
      userId,
    });
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { submissionId, activityType, score } = await req.json();

    if (!submissionId) {
      throw new ApiError(400, 'missing_submission_id', 'Missing submissionId');
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
      throw new ApiError(404, 'submission_not_found', 'Submission not found');
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

    // Use transaction to prevent race conditions (double-awarding points)
    // The WHERE clause ensures we only update if points haven't been awarded yet
    const updatedSubmission = await prisma.submission.updateMany({
      where: {
        id: submissionId,
        pointsAwarded: 0  // Only update if no points awarded yet (atomic check)
      },
      data: { pointsAwarded: points },
    });

    // If no rows updated, points were already awarded by a concurrent request
    if (updatedSubmission.count === 0) {
      return NextResponse.json({
        message: 'Points already awarded for this submission',
        pointsAwarded: submission.pointsAwarded,
      });
    }

    // Award points to user (only happens if submission update succeeded)
    await awardPoints(userId, points, `Completed activity ${submission.activityId}`);

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
    return handleApiError(error, 'api/gamification/award-points');
  }
}
