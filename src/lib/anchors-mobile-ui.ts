import { formatTimeLabel, parseHHMMToMinutes } from '@/lib/anchors';

export function getTimeUntil(timeStr: string, nowMinutes: number | null): string {
  if (nowMinutes === null) return 'Soon';
  const targetMinutes = parseHHMMToMinutes(timeStr);
  const diffMinutes = targetMinutes - nowMinutes;

  if (diffMinutes < -60) {
    const hours = Math.abs(Math.floor(diffMinutes / 60));
    return `${hours}h ago`;
  }
  if (diffMinutes < 0) return `${Math.abs(diffMinutes)}m ago`;
  if (diffMinutes === 0) return 'Now';
  if (diffMinutes < 60) return `in ${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return mins === 0 ? `in ${hours}h` : `in ${hours}h ${mins}m`;
}

export function formatShortTime(timeStr: string): string {
  return formatTimeLabel(timeStr).replace(':00 ', '').replace(' AM', 'a').replace(' PM', 'p');
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, minutes);
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getOvernightMinutesUntil(startTime: string, nextDayTime: string): number {
  const startMinutes = parseHHMMToMinutes(startTime);
  const endMinutes = parseHHMMToMinutes(nextDayTime);
  return 24 * 60 - startMinutes + endMinutes;
}

export function getMinutesBetweenEvents(currentTime: string, nextTime: string): number {
  const currentMinutes = parseHHMMToMinutes(currentTime);
  const nextMinutes = parseHHMMToMinutes(nextTime);
  const diff = nextMinutes - currentMinutes;
  return diff >= 0 ? diff : 24 * 60 + diff;
}

export function getAnchorMobileChipLabels(
  anchor: { id: string; scheduledTime: string },
  sortedAnchors: Array<{ id: string; scheduledTime: string }>,
  wakeAnchorForToday: { scheduledTime: string } | undefined,
  nowMinutes: number | null
): { timeUntilLabel: string; nextEventLabel: string | null } {
  const timeUntil = getTimeUntil(anchor.scheduledTime, nowMinutes);
  const timeUntilLabel = timeUntil.startsWith('in ') ? timeUntil.slice(3) : timeUntil;
  const idx = sortedAnchors.findIndex((a) => a.id === anchor.id);
  const nextScheduledAnchor = idx >= 0 ? sortedAnchors[idx + 1] : undefined;
  const nextEventLabel = nextScheduledAnchor
    ? formatDuration(getMinutesBetweenEvents(anchor.scheduledTime, nextScheduledAnchor.scheduledTime))
    : wakeAnchorForToday
      ? formatDuration(getOvernightMinutesUntil(anchor.scheduledTime, wakeAnchorForToday.scheduledTime))
      : null;
  return { timeUntilLabel, nextEventLabel };
}
