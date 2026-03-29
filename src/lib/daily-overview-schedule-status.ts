import type { DailyOverviewItem } from '@/types/daily-overview';
import type { DailyAnchor } from '@/lib/anchors';
import { parseHHMMToMinutes } from '@/lib/anchors';
import type { TimeBlockEntry } from '@/lib/time-block-planner';

export type OverviewScheduleStatus = 'current' | 'up-next';

const UP_NEXT_WINDOW_MINUTES = 30;

function isComplete(item: DailyOverviewItem): boolean {
  if (item.type === 'anchor') {
    const a = item.sourceData as DailyAnchor;
    return item.isDone || a.status === 'skipped' || a.status === 'done';
  }
  return item.isAcknowledged;
}

/** Non-empty window [start, end) in minutes, when the item occupies a span of time. */
function getRangeWindow(item: DailyOverviewItem): { start: number; end: number } | null {
  if (item.type === 'anchor') {
    const a = item.sourceData as DailyAnchor;
    const s = parseHHMMToMinutes(a.scheduledTime);
    const e = a.endTime ? parseHHMMToMinutes(a.endTime) : null;
    if (e != null && e > s) return { start: s, end: e };
    return null;
  }
  if (item.type === 'session') {
    const b = item.sourceData as TimeBlockEntry;
    if (b.endMinuteOfDay > b.startMinuteOfDay) {
      return { start: b.startMinuteOfDay, end: b.endMinuteOfDay };
    }
    return null;
  }
  return null;
}

function nowInsideActiveRange(now: number, item: DailyOverviewItem): boolean {
  if (isComplete(item)) return false;
  const w = getRangeWindow(item);
  if (!w) return false;
  return now >= w.start && now < w.end;
}

/**
 * "Current" for items whose time window contains `now` (anchors / sessions with an end after start).
 * "Up next" for the earliest upcoming incomplete item starting within 30 minutes, only when
 * `now` is not inside any other item's active range.
 */
export function computeOverviewScheduleStatus(
  nowMinutes: number,
  items: DailyOverviewItem[],
): Map<string, OverviewScheduleStatus> {
  const out = new Map<string, OverviewScheduleStatus>();

  const currentItems = items.filter((i) => nowInsideActiveRange(nowMinutes, i));
  for (const i of currentItems) {
    out.set(i.id, 'current');
  }

  if (currentItems.length > 0) {
    return out;
  }

  const upcoming = items
    .filter((i) => !isComplete(i))
    .map((i) => {
      const start = i.scheduledMinutes;
      return { item: i, start, delta: start - nowMinutes };
    })
    .filter((x) => x.delta > 0 && x.delta <= UP_NEXT_WINDOW_MINUTES);

  if (upcoming.length === 0) return out;

  upcoming.sort((a, b) => a.start - b.start);
  out.set(upcoming[0].item.id, 'up-next');

  return out;
}
