import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/gamification";

// Challenge types that rotate daily
export const CHALLENGE_TYPES = {
  COMPLETE_ANY: "complete_any",
  COMPLETE_GRAMMAR: "complete_grammar",
  PERFECT_QUIZ: "perfect_quiz",
  PLAY_GAMES: "play_games",
} as const;

export type ChallengeType = (typeof CHALLENGE_TYPES)[keyof typeof CHALLENGE_TYPES];

interface ChallengeTemplate {
  type: ChallengeType;
  requirement: number;
  bonusPoints: number;
  description: string;
}

// Challenge pool - rotate through these
const CHALLENGE_POOL: ChallengeTemplate[] = [
  {
    type: CHALLENGE_TYPES.COMPLETE_ANY,
    requirement: 1,
    bonusPoints: 15,
    description: "Complete any activity",
  },
  {
    type: CHALLENGE_TYPES.COMPLETE_ANY,
    requirement: 2,
    bonusPoints: 20,
    description: "Complete 2 activities",
  },
  {
    type: CHALLENGE_TYPES.COMPLETE_GRAMMAR,
    requirement: 1,
    bonusPoints: 20,
    description: "Complete a grammar guide",
  },
  {
    type: CHALLENGE_TYPES.PERFECT_QUIZ,
    requirement: 1,
    bonusPoints: 25,
    description: "Get a perfect quiz score",
  },
  {
    type: CHALLENGE_TYPES.PLAY_GAMES,
    requirement: 2,
    bonusPoints: 15,
    description: "Play 2 learning games",
  },
  {
    type: CHALLENGE_TYPES.PLAY_GAMES,
    requirement: 3,
    bonusPoints: 20,
    description: "Play 3 learning games",
  },
];

// Game activity types
const GAME_TYPES = [
  "flashcard",
  "matching",
  "fill-in-blank",
  "numbers-game",
  "word-scramble",
];

function getTodayDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getTimeUntilMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tomorrow.getTime() - now.getTime();
}

/**
 * Get or create today's challenge
 */
export async function getTodayChallenge() {
  const today = getTodayDate();

  // Try to find existing challenge for today
  let challenge = await prisma.dailyChallenge.findUnique({
    where: { date: today },
  });

  // If no challenge exists, create one
  if (!challenge) {
    // Use day of year to pick a deterministic challenge
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const template = CHALLENGE_POOL[dayOfYear % CHALLENGE_POOL.length];

    challenge = await prisma.dailyChallenge.create({
      data: {
        date: today,
        type: template.type,
        requirement: template.requirement,
        bonusPoints: template.bonusPoints,
        description: template.description,
      },
    });
  }

  return challenge;
}

/**
 * Get today's challenge with user progress
 */
export async function getTodayChallengeWithProgress(userId: string) {
  const challenge = await getTodayChallenge();

  // Get or create user's progress for this challenge
  let userChallenge = await prisma.userDailyChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
  });

  if (!userChallenge) {
    userChallenge = await prisma.userDailyChallenge.create({
      data: {
        userId,
        challengeId: challenge.id,
        progress: 0,
        completed: false,
      },
    });
  }

  return {
    ...challenge,
    progress: userChallenge.progress,
    completed: userChallenge.completed,
    completedAt: userChallenge.completedAt,
    timeUntilReset: getTimeUntilMidnight(),
  };
}

/**
 * Update challenge progress after activity completion
 * Returns true if the challenge was just completed
 */
export async function updateChallengeProgress(
  userId: string,
  activityType: string,
  quizScore?: number
): Promise<{ justCompleted: boolean; bonusPoints: number }> {
  const challenge = await getTodayChallenge();

  // Get current progress
  let userChallenge = await prisma.userDailyChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
  });

  // Create if doesn't exist
  if (!userChallenge) {
    userChallenge = await prisma.userDailyChallenge.create({
      data: {
        userId,
        challengeId: challenge.id,
        progress: 0,
        completed: false,
      },
    });
  }

  // Already completed, no update needed
  if (userChallenge.completed) {
    return { justCompleted: false, bonusPoints: 0 };
  }

  // Check if this activity counts toward the challenge
  let shouldIncrement = false;

  switch (challenge.type) {
    case CHALLENGE_TYPES.COMPLETE_ANY:
      // Any activity counts
      shouldIncrement = true;
      break;

    case CHALLENGE_TYPES.COMPLETE_GRAMMAR:
      // Only grammar guides count
      shouldIncrement = activityType === "interactive-guide" || activityType === "guide";
      break;

    case CHALLENGE_TYPES.PERFECT_QUIZ:
      // Only perfect quiz scores count
      shouldIncrement = activityType === "quiz" && quizScore === 100;
      break;

    case CHALLENGE_TYPES.PLAY_GAMES:
      // Only game activities count
      shouldIncrement = GAME_TYPES.includes(activityType);
      break;
  }

  if (!shouldIncrement) {
    return { justCompleted: false, bonusPoints: 0 };
  }

  // Increment progress
  const newProgress = userChallenge.progress + 1;
  const justCompleted = newProgress >= challenge.requirement;

  await prisma.userDailyChallenge.update({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
    data: {
      progress: newProgress,
      completed: justCompleted,
      completedAt: justCompleted ? new Date() : null,
    },
  });

  // Award bonus points if just completed
  if (justCompleted) {
    await awardPoints(userId, challenge.bonusPoints, "Daily challenge bonus");
  }

  return {
    justCompleted,
    bonusPoints: justCompleted ? challenge.bonusPoints : 0,
  };
}

/**
 * Check if user has completed today's challenge
 */
export async function hasCompletedTodayChallenge(userId: string): Promise<boolean> {
  const challenge = await getTodayChallenge();

  const userChallenge = await prisma.userDailyChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId: challenge.id,
      },
    },
    select: { completed: true },
  });

  return userChallenge?.completed ?? false;
}

/**
 * Get challenge stats for a user
 */
export async function getChallengeStats(userId: string) {
  const completedCount = await prisma.userDailyChallenge.count({
    where: {
      userId,
      completed: true,
    },
  });

  // Get current streak of consecutive daily challenges
  const recentChallenges = await prisma.userDailyChallenge.findMany({
    where: {
      userId,
      completed: true,
    },
    include: {
      challenge: {
        select: { date: true },
      },
    },
    orderBy: {
      challenge: { date: "desc" },
    },
    take: 30,
  });

  let challengeStreak = 0;
  const today = getTodayDate();

  for (let i = 0; i < recentChallenges.length; i++) {
    const challengeDate = new Date(recentChallenges[i].challenge.date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    // Compare dates (ignoring time)
    if (
      challengeDate.getFullYear() === expectedDate.getFullYear() &&
      challengeDate.getMonth() === expectedDate.getMonth() &&
      challengeDate.getDate() === expectedDate.getDate()
    ) {
      challengeStreak++;
    } else {
      break;
    }
  }

  return {
    totalCompleted: completedCount,
    currentStreak: challengeStreak,
  };
}
