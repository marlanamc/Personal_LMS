// ============================================
// Thread Gamification - XP, Streaks, and Progression
// ============================================

import { prisma } from './prisma';

/**
 * Award XP to a thread
 * XP formula: activityPoints * 2
 */
export async function awardThreadXP(
  threadId: string,
  xp: number,
  _source: string
): Promise<{ newXP: number; leveledUp: boolean; newLevel: number }> {
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: { xp: true },
  });

  if (!thread) {
    throw new Error('Thread not found');
  }

  const previousLevel = Math.floor(thread.xp / 100);
  const newXP = thread.xp + xp;
  const newLevel = Math.floor(newXP / 100);
  const leveledUp = newLevel > previousLevel;

  await prisma.thread.update({
    where: { id: threadId },
    data: { xp: newXP },
  });

  return { newXP, leveledUp, newLevel };
}

/**
 * Update thread focus streak after activity completion
 * Increments streak if activity completed on a different day than lastActivityDate
 * Resets streak to 1 if no previous activity
 */
export async function updateThreadStreak(
  threadId: string
): Promise<{ focusStreak: number; streakIncremented: boolean }> {
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: {
      focusStreak: true,
      lastActivityDate: true,
    },
  });

  if (!thread) {
    throw new Error('Thread not found');
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let newStreak = thread.focusStreak;
  let streakIncremented = false;

  if (!thread.lastActivityDate) {
    // First activity on this thread
    newStreak = 1;
    streakIncremented = true;
  } else {
    const lastActivityDay = new Date(
      thread.lastActivityDate.getFullYear(),
      thread.lastActivityDate.getMonth(),
      thread.lastActivityDate.getDate()
    );

    // Check if activity was on a different day
    if (today.getTime() !== lastActivityDay.getTime()) {
      newStreak = thread.focusStreak + 1;
      streakIncremented = true;
    }
    // If same day, keep streak as is
  }

  await prisma.thread.update({
    where: { id: threadId },
    data: {
      focusStreak: newStreak,
      lastActivityDate: now,
    },
  });

  return { focusStreak: newStreak, streakIncremented };
}

/**
 * Reset thread streak to 0 (called when thread is rested)
 */
export async function resetThreadStreak(threadId: string): Promise<void> {
  await prisma.thread.update({
    where: { id: threadId },
    data: { focusStreak: 0 },
  });
}

/**
 * Get streak badge info based on streak count
 */
export function getStreakBadgeInfo(streak: number): {
  emoji: string;
  label: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
} | null {
  if (streak >= 30) {
    return { emoji: '🏆', label: '30-day streak', tier: 'platinum' };
  } else if (streak >= 14) {
    return { emoji: '⭐', label: '14-day streak', tier: 'gold' };
  } else if (streak >= 7) {
    return { emoji: '🔥', label: '7-day streak', tier: 'silver' };
  } else if (streak >= 3) {
    return { emoji: '✨', label: '3-day streak', tier: 'bronze' };
  }
  return null;
}

/**
 * Calculate activity points based on activity type (from existing gamification system)
 * This mirrors the logic from the main gamification system
 */
export function calculateActivityPoints(activityType: string, score?: number): number {
  const basePoints: Record<string, number> = {
    quiz: 10,
    'numbers-game': 10,
    worksheet: 5,
    'verb-quiz': 8,
    'interactive-guide': 5,
    flashcards: 3,
    matching: 4,
    'fill-in-blank': 4,
    'word-scramble': 3,
  };

  let points = basePoints[activityType] || 5; // Default 5 points

  // Perfect score bonus for quizzes
  if (activityType === 'quiz' && score === 100) {
    points += 20;
  }

  return points;
}
