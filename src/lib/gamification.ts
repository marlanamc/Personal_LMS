import { prisma } from './prisma';
import type { Prisma } from "@prisma/client";
import { POINTS } from "./gamification/constants";
import { shouldAwardStreak, getEffectiveStreak, getNextStreakState } from "./gamification/streak-utils";
export { POINTS } from "./gamification/constants";
export { getActivityPoints, resolveActivityGameUi } from "./gamification/activity-points";

/**
 * Award points to a user and update their total
 */
async function logPointsLedger(userId: string, points: number, reason: string, source: string = 'system') {
  try {
    await prisma.pointsLedger.create({
      data: {
        userId,
        points,
        reason,
        source,
      },
    });
  } catch (err) {
    console.error('[Gamification] Failed to log points ledger entry', err);
  }
}

/**
 * Track user login activity (for activity calendar)
 * Creates a PointsLedger entry with 0 points to track login dates
 */
export async function trackLogin(userId: string) {
  try {
    // Check if we already have a login entry for today (UTC-aligned with streak math)
    const now = new Date();
    const todayUtcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const tomorrowUtcStart = new Date(todayUtcStart);
    tomorrowUtcStart.setUTCDate(tomorrowUtcStart.getUTCDate() + 1);

    const existingLogin = await prisma.pointsLedger.findFirst({
      where: {
        userId,
        source: 'login',
        createdAt: {
          gte: todayUtcStart,
          lt: tomorrowUtcStart,
        },
      },
    });

    // Only process the first login marker of the UTC day
    if (!existingLogin) {
      await logPointsLedger(userId, 0, 'Daily login', 'login');

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { currentStreak: true, longestStreak: true, lastActivityDate: true },
      });
      if (!user) return;

      const { streakUpdated, newStreak } = getNextStreakState(
        user.currentStreak,
        user.lastActivityDate,
        now
      );

      if (streakUpdated) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, user.longestStreak),
            lastActivityDate: now,
          },
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { lastActivityDate: now },
        });
      }
    }
  } catch (err) {
    console.error('[Gamification] Failed to track login', err);
  }
}

export async function awardPoints(userId: string, points: number, reason: string = '') {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      points: { increment: points },
      weeklyPoints: { increment: points },
    },
  });

  await logPointsLedger(userId, points, reason || 'Points awarded', 'award');

  console.log(`[Gamification] Awarded ${points} points to user ${userId} for: ${reason}`);

  return user;
}

/**
 * Check and update user's streak based on activity completion
 */
export async function updateStreak(userId: string, activityPoints: number): Promise<{ streakUpdated: boolean; newStreak: number; pointsAwarded: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  if (!shouldAwardStreak(activityPoints)) {
    return { streakUpdated: false, newStreak: user.currentStreak, pointsAwarded: 0 };
  }

  const now = new Date();
  
  const { streakUpdated, newStreak } = getNextStreakState(
    user.currentStreak,
    user.lastActivityDate,
    now
  );
  let pointsAwarded = 0;
  if (streakUpdated) {
    pointsAwarded = POINTS.DAILY_STREAK;
    if (newStreak % 7 === 0) {
      pointsAwarded += POINTS.WEEKLY_STREAK;
    }
  }

  if (streakUpdated) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        lastActivityDate: now,
        points: { increment: pointsAwarded },
        weeklyPoints: { increment: pointsAwarded },
      },
    });
    if (pointsAwarded > 0) {
      await logPointsLedger(
        userId,
        pointsAwarded,
        newStreak % 7 === 0 && pointsAwarded > POINTS.DAILY_STREAK
          ? 'Streak + weekly bonus'
          : 'Streak bonus',
        'streak'
      );
    }
  } else {
    // Update last activity date even if streak wasn't updated
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastActivityDate: now,
      },
    });
  }

  return { streakUpdated, newStreak, pointsAwarded };
}

/**
 * Calculate points for a quiz based on score
 * Points are ONLY awarded based on accuracy - no participation points
 */
export function calculateQuizPoints(score: number | null): number {
  if (score === null) return 0;

  // Score-based points only - must earn through accuracy
  if (score === 100) {
    return POINTS.QUIZ_PERFECT_SCORE; // 15 points
  } else if (score >= 90) {
    return POINTS.QUIZ_HIGH_SCORE; // 10 points
  } else if (score >= 80) {
    return POINTS.QUIZ_GOOD_SCORE; // 5 points
  } else if (score >= 70) {
    return POINTS.QUIZ_PASSING_SCORE; // 2 points
  }
  
  // Below 70% = 0 points - need to study more!
  return 0;
}

export type LeaderboardRange = 'day' | 'week' | 'month';

function getRangeStart(range: LeaderboardRange) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'day':
      return startOfToday;
    case 'week': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 6); // last 7 days including today
      return start;
    }
    case 'month':
    default: {
      return new Date(now.getFullYear(), now.getMonth(), 1); // beginning of current month
    }
  }
}

/**
 * Get leaderboard for a given timeframe using the points ledger.
 * Shows all students, merging ledger data with students who have no points yet.
 */
export async function getTimeframedLeaderboard(
  range: LeaderboardRange = 'week',
  limit: number = 10,
  classId?: string
) {
  // SECURITY: Input validation
  if (classId !== undefined && typeof classId !== 'string') {
    throw new Error('Invalid classId: must be a string');
  }

  // Sanitize limit to prevent excessive queries (1-100)
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100);

  const since = getRangeStart(range);

  // First, get all students (excluding test accounts and admin accounts)
  const studentWhere: Prisma.UserWhereInput = {
    role: "student",
    username: { notIn: ["marlie", "leah"] }, // Exclude test and admin accounts from leaderboard
    ...(classId ? { classes: { some: { classId } } } : {}),
  };

  const allStudents = await prisma.user.findMany({
    where: studentWhere,
    select: {
      id: true,
      name: true,
      currentStreak: true,
      lastActivityDate: true,
      lastWeekRank: true,
      avatar: true,
      avatarColor: true,
    },
  });

  // Then get points from ledger for this timeframe (excluding test accounts and admin accounts)
  const whereLedger: Prisma.PointsLedgerWhereInput = {
    createdAt: { gte: since },
    user: {
      role: "student",
      username: { notIn: ["marlie", "leah"] }, // Exclude test and admin accounts from leaderboard
      ...(classId ? { classes: { some: { classId } } } : {}),
    },
  };

  const grouped = await prisma.pointsLedger.groupBy({
    by: ['userId'],
    where: whereLedger,
    _sum: { points: true },
  });

  // Create a map of userId -> points from ledger
  const pointsMap = new Map(grouped.map((entry) => [entry.userId, entry._sum.points || 0]));

  // Combine all students with their points (0 if not in ledger)
  const rankings = allStudents.map((student) => ({
    userId: student.id,
    points: pointsMap.get(student.id) || 0,
    name: student.name || 'Student',
    currentStreak: getEffectiveStreak(student.currentStreak, student.lastActivityDate),
    lastWeekRank: student.lastWeekRank,
    avatar: student.avatar,
    avatarColor: student.avatarColor,
  }));

  // Filter out students with 0 points - only rank students who have earned points
  const studentsWithPoints = rankings.filter((r) => r.points > 0);

  // Sort by points descending, then by name alphabetically for display order
  studentsWithPoints.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.name.localeCompare(b.name);
  });

  // Apply limit and add rank (same rank for ties)
  const limitedRankings = studentsWithPoints.slice(0, safeLimit);

  return limitedRankings.map((r, idx) => {
    // Find the rank: same as first student with same points, otherwise idx + 1
    let rank = idx + 1;
    if (idx > 0) {
      // Check if any previous student has the same points
      const firstWithSamePoints = limitedRankings.findIndex(lr => lr.points === r.points);
      if (firstWithSamePoints < idx) {
        // Use the rank of the first student with these points
        rank = firstWithSamePoints + 1;
      }
    }

    return {
      id: r.userId,
      name: r.name,
      weeklyPoints: r.points,
      currentStreak: r.currentStreak || 0,
      rank: rank,
      rankChange: range === 'week' ? (r.lastWeekRank ? r.lastWeekRank - rank : null) : null,
      avatar: r.avatar,
      avatarColor: r.avatarColor,
    };
  });
}

/**
 * Check if user unlocked any achievements and award them
 */
export async function checkAndAwardAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: {
        include: {
          achievement: true,
        },
      },
      submissions: {
        where: { 
          status: { in: ['submitted', 'graded'] } // Count both submitted and graded
        },
      },
    },
  });

  if (!user) return [];

  const allAchievements = await prisma.achievement.findMany();
  const earnedAchievementIds = new Set(
    user.achievements.map((ua: { achievementId: string }) => ua.achievementId)
  );
  const newlyEarned: string[] = [];

  for (const achievement of allAchievements) {
    // Skip if already earned
    if (earnedAchievementIds.has(achievement.id)) continue;

    let shouldAward = false;

    switch (achievement.type) {
      case 'streak':
        shouldAward = user.currentStreak >= achievement.requirement;
        break;
      case 'points':
        shouldAward = user.points >= achievement.requirement;
        break;
      case 'quiz':
        const perfectQuizzes = user.submissions.filter((s: { score: number | null }) => s.score === 100).length;
        shouldAward = perfectQuizzes >= achievement.requirement;
        break;
      case 'activity':
        shouldAward = user.submissions.length >= achievement.requirement;
        break;
    }

    if (shouldAward) {
      // Award the achievement
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
        },
      });

      // Award bonus points
      if (achievement.points > 0) {
        await awardPoints(userId, achievement.points, `Achievement: ${achievement.name}`);
      }

      newlyEarned.push(achievement.id);
    }
  }

  return newlyEarned;
}

/**
 * Get weekly leaderboard (top students by weekly points)
 */
export async function getWeeklyLeaderboard(limit: number = 10, classId?: string) {
  // SECURITY: Input validation
  if (classId !== undefined && typeof classId !== 'string') {
    throw new Error('Invalid classId: must be a string');
  }

  // Sanitize limit to prevent excessive queries (1-100)
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100);

  const whereClause: Prisma.UserWhereInput = {
    role: 'student',
    username: { notIn: ['marlie', 'leah'] }, // Exclude test and admin accounts from leaderboard
  };

  // If classId provided, filter by students in that class
  if (classId) {
    whereClause.classes = {
      some: {
        classId: classId,
      },
    };
  }

  const students = await prisma.user.findMany({
    where: {
      ...whereClause,
      weeklyPoints: { gt: 0 }, // Only include students with points > 0
    },
    orderBy: {
      weeklyPoints: 'desc',
    },
    take: safeLimit,
    select: {
      id: true,
      name: true,
      weeklyPoints: true,
      currentStreak: true,
      lastActivityDate: true,
      lastWeekRank: true,
    },
  });

  // Add rank and rank change (same rank for ties)
  return students.map((student, index: number) => {
      // Find the rank: same as first student with same points, otherwise index + 1
      let rank = index + 1;
      if (index > 0) {
        // Check if any previous student has the same points
        const firstWithSamePoints = students.findIndex(s => s.weeklyPoints === student.weeklyPoints);
        if (firstWithSamePoints < index) {
          // Use the rank of the first student with these points
          rank = firstWithSamePoints + 1;
        }
      }

      return {
        id: student.id,
        name: student.name,
        weeklyPoints: student.weeklyPoints,
        currentStreak: getEffectiveStreak(student.currentStreak, student.lastActivityDate),
        lastWeekRank: student.lastWeekRank,
        rank: rank,
        rankChange: student.lastWeekRank ? student.lastWeekRank - rank : null,
      };
    });
}

/**
 * Reset weekly points for all users (to be run weekly via cron)
 * PERFORMANCE: Uses transaction with batch updates instead of N+1 queries
 */
export async function resetWeeklyPoints() {
  // Get current rankings before reset
  const currentRankings = await getWeeklyLeaderboard(100);

  // PERFORMANCE: Use transaction to batch all updates together
  await prisma.$transaction([
    // Update each user's lastWeekRank in a batch transaction
    ...currentRankings.map(ranking =>
      prisma.user.update({
        where: { id: ranking.id },
        data: { lastWeekRank: ranking.rank },
      })
    ),
    // Reset weekly points for all students
    prisma.user.updateMany({
      where: { role: 'student' },
      data: { weeklyPoints: 0 },
    }),
  ]);

  console.log(`[Gamification] Weekly points reset complete (${currentRankings.length} rankings saved)`);
}

/**
 * Get user's gamification stats
 */
export async function getUserGamificationStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: {
        include: {
          achievement: true,
        },
        orderBy: {
          earnedAt: 'desc',
        },
      },
    },
  });

  if (!user) return null;

  // Get user's rank in weekly leaderboard (excluding test accounts and admin accounts)
  const allStudents = await prisma.user.findMany({
    where: { 
      role: 'student',
      username: { notIn: ['marlie', 'leah'] }, // Exclude test and admin accounts from leaderboard
    },
    orderBy: { weeklyPoints: 'desc' },
    select: { id: true },
  });

  const rank = allStudents.findIndex((s: { id: string }) => s.id === userId) + 1;

  return {
    points: user.points,
    weeklyPoints: user.weeklyPoints,
    currentStreak: getEffectiveStreak(user.currentStreak, user.lastActivityDate),
    longestStreak: user.longestStreak,
    rank: rank > 0 ? rank : null,
    lastWeekRank: user.lastWeekRank,
    rankChange: user.lastWeekRank && rank > 0 ? user.lastWeekRank - rank : null,
    achievements: user.achievements.map((ua: { achievement: { id: string; name: string; description: string; icon: string }; earnedAt: Date }) => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      earnedAt: ua.earnedAt,
    })),
  };
}
