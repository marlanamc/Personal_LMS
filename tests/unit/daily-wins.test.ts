import { describe, expect, it } from 'vitest';
import { aggregateDailyWinPhrases, getRollingSevenDayWins } from '@/lib/daily-wins';

describe('daily wins helpers', () => {
  it('keeps the full list available while filtering the cloud to the rolling past 7 days', () => {
    const now = new Date('2026-04-26T12:00:00.000Z');
    const wins = [
      { id: 'new', text: 'New win', createdAt: '2026-04-26T11:00:00.000Z' },
      { id: 'edge', text: 'Exactly seven days', createdAt: '2026-04-19T12:00:00.000Z' },
      { id: 'old', text: 'Older win', createdAt: '2026-04-18T12:00:00.000Z' },
    ];

    const recentWins = getRollingSevenDayWins(wins, now);

    expect(wins.map((win) => win.id)).toEqual(['new', 'edge', 'old']);
    expect(recentWins.map((win) => win.id)).toEqual(['new', 'edge']);
  });

  it('aggregates repeated phrase cloud items and keeps the newest display text', () => {
    const wins = [
      { id: 'new-folded', text: 'Folded laundry' },
      { id: 'other', text: 'Cooked dinner' },
      { id: 'old-folded', text: ' folded   laundry ' },
      { id: 'empty', text: '   ' },
    ];

    expect(aggregateDailyWinPhrases(wins)).toEqual([
      { id: 'new-folded', text: 'Folded laundry', count: 2 },
      { id: 'other', text: 'Cooked dinner', count: 1 },
    ]);
  });
});
