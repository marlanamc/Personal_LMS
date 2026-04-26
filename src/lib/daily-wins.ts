export type DailyWinWithCreatedAt = {
  createdAt: string | Date;
};

export type DailyWinPhraseSource = {
  id: string;
  text: string;
};

export type DailyWinPhraseCloudItem = DailyWinPhraseSource & {
  count: number;
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

function normalizeWinText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function aggregateDailyWinPhrases<T extends DailyWinPhraseSource>(
  wins: T[],
): DailyWinPhraseCloudItem[] {
  const byText = new Map<string, DailyWinPhraseCloudItem>();

  for (const win of wins) {
    const key = normalizeWinText(win.text);
    if (!key) continue;

    const existing = byText.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }

    byText.set(key, {
      id: win.id,
      text: win.text.trim(),
      count: 1,
    });
  }

  return Array.from(byText.values());
}
