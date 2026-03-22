import { describe, expect, it } from 'vitest';
import { buildUniformWeeklySchedule, normalizeWeeklySchedule } from '@/lib/anchors';

describe('normalizeWeeklySchedule', () => {
  it('does not re-add weekdays omitted from the saved object (no fallback fill for missing keys)', () => {
    const fallback = buildUniformWeeklySchedule('08:00');
    const partial = {
      0: { scheduledTime: '07:00' },
      1: { scheduledTime: '07:00' },
    } as Record<string, { scheduledTime: string }>;

    const out = normalizeWeeklySchedule(partial, fallback);

    expect(out[0]?.scheduledTime).toBe('07:00');
    expect(out[1]?.scheduledTime).toBe('07:00');
    expect(out[2]).toBeUndefined();
    expect(out[3]).toBeUndefined();
    expect(out[4]).toBeUndefined();
    expect(out[5]).toBeUndefined();
    expect(out[6]).toBeUndefined();
  });

  it('still applies per-slot fallback when a key is present but incomplete', () => {
    const fallback = buildUniformWeeklySchedule('09:00');
    const raw = { 3: {} } as Record<string, unknown>;

    const out = normalizeWeeklySchedule(raw, fallback);

    expect(out[3]?.scheduledTime).toBe('09:00');
    expect(out[0]).toBeUndefined();
  });
});
