export function shouldAwardStreak(points: number): boolean {
  return points > 0;
}

function getUTCDayStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function getDaysSinceActivity(lastActivityDate: Date | string | null, now: Date = new Date()): number | null {
  if (!lastActivityDate) return null;
  const last = new Date(lastActivityDate);
  if (Number.isNaN(last.getTime())) return null;
  const diffMs = getUTCDayStart(now).getTime() - getUTCDayStart(last).getTime();
  return Math.floor(diffMs / 86400000);
}

export function getEffectiveStreak(
  currentStreak: number | null | undefined,
  lastActivityDate: Date | string | null,
  now: Date = new Date()
): number {
  const baseStreak = currentStreak ?? 0;
  if (baseStreak <= 0) return 0;
  const daysSince = getDaysSinceActivity(lastActivityDate, now);
  if (daysSince === null) return 0;
  return daysSince <= 1 ? baseStreak : 0;
}

export function getNextStreakState(
  currentStreak: number | null | undefined,
  lastActivityDate: Date | string | null,
  now: Date = new Date()
): { streakUpdated: boolean; newStreak: number } {
  const baseStreak = currentStreak ?? 0;
  const daysSince = getDaysSinceActivity(lastActivityDate, now);

  if (daysSince === null) {
    return { streakUpdated: true, newStreak: 1 };
  }

  if (daysSince === 0) {
    return { streakUpdated: false, newStreak: baseStreak };
  }

  if (daysSince === 1) {
    return { streakUpdated: true, newStreak: baseStreak + 1 };
  }

  return { streakUpdated: true, newStreak: 1 };
}
