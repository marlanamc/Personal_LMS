import { describe, expect, it } from 'vitest';
import type { DailyOverviewItem } from '@/types/daily-overview';
import { computeOverviewScheduleStatus } from '@/lib/daily-overview-schedule-status';
import type { DailyAnchor } from '@/lib/anchors';
import { parseHHMMToMinutes } from '@/lib/anchors';

function anchorItem(
  id: string,
  scheduledTime: string,
  endTime: string | undefined,
  status: DailyAnchor['status'] = 'waiting',
): DailyOverviewItem {
  const a: DailyAnchor = {
    id,
    label: id,
    icon: 'coffee',
    scheduledTime,
    endTime,
    status,
  };
  return {
    id,
    type: 'anchor',
    label: id,
    time: scheduledTime,
    scheduledMinutes: parseHHMMToMinutes(scheduledTime),
    isDone: status === 'done',
    isAcknowledged: status === 'done',
    icon: 'coffee',
    sourceData: a,
  };
}

describe('computeOverviewScheduleStatus', () => {
  it('marks Current when now is inside an anchor range', () => {
    const items = [
      anchorItem('a', '17:00', '18:30'),
      anchorItem('b', '19:00', '20:30'),
    ];

    const map = computeOverviewScheduleStatus(parseHHMMToMinutes('17:45'), items);
    expect(map.get('a')).toBe('current');
    expect(map.get('b')).toBeUndefined();
  });

  it('Up Next on earliest item starting within 30m when not in any range', () => {
    const items = [
      anchorItem('a', '17:00', '18:30'),
      anchorItem('b', '19:00', '20:30'),
    ];

    const map = computeOverviewScheduleStatus(parseHHMMToMinutes('18:30'), items);
    expect(map.get('a')).toBeUndefined();
    expect(map.get('b')).toBe('up-next');
  });

  it('no Up Next when no current range but next start is over 30m away', () => {
    const items = [anchorItem('a', '19:00', '20:30')];

    const map = computeOverviewScheduleStatus(parseHHMMToMinutes('18:00'), items);
    expect(map.size).toBe(0);
  });
});
