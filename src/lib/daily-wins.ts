export type DailyWinWithCreatedAt = {
  createdAt: string | Date;
};

const ROLLING_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getRollingSevenDayWins<T extends DailyWinWithCreatedAt>(
  wins: T[],
  now: Date = new Date(),
): T[] {
  const cutoff = new Date(now.getTime() - ROLLING_WEEK_MS);

  return wins.filter((win) => {
    const createdAt = win.createdAt instanceof Date ? win.createdAt : new Date(win.createdAt);

    return !Number.isNaN(createdAt.getTime()) && createdAt >= cutoff;
  });
}
