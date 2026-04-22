import { describe, expect, it } from 'vitest';
import type { DailyAnchor } from '@/lib/anchors';
import { computeDailyOverviewProgress } from '@/lib/daily-overview-progress';

function anchor(id: string, status: DailyAnchor['status']): DailyAnchor {
  return {
    id,
    label: id,
    icon: 'coffee',
    scheduledTime: '09:00',
    status,
  };
}

describe('computeDailyOverviewProgress', () => {
  it('does not count skipped anchors in daily overview totals', () => {
    const progress = computeDailyOverviewProgress({
      todayAnchors: [anchor('done', 'done'), anchor('skipped', 'skipped'), anchor('waiting', 'waiting')],
      calendarEvents: [],
      todayKey: '2026-04-21',
      activeConstraints: [],
      acknowledgements: { boundaries: [], events: [], sessions: [], plans: [] },
    });

    expect(progress).toEqual({ completed: 1, total: 2, percent: 50 });
  });
});
