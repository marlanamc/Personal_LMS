import { describe, expect, it } from 'vitest';
import {
  EMPTY_CLEANING_PLANNER_STORE,
  completeCleaningTask,
  createCleaningTask,
  formatCleaningCadence,
  getCleaningTaskStatus,
  getNextDueDate,
  normalizeCleaningPlannerStore,
  upsertCleaningTask,
  type CleaningPlannerStore,
} from '@/lib/cleaning-planner';

describe('cleaning planner', () => {
  const toDateKey = (value: Date | null | undefined) => value?.toISOString().slice(0, 10);

  it('normalizes empty and invalid payloads safely', () => {
    expect(normalizeCleaningPlannerStore(null)).toEqual(EMPTY_CLEANING_PLANNER_STORE);
    expect(normalizeCleaningPlannerStore(undefined)).toEqual(EMPTY_CLEANING_PLANNER_STORE);
    expect(normalizeCleaningPlannerStore([])).toEqual(EMPTY_CLEANING_PLANNER_STORE);
    expect(normalizeCleaningPlannerStore({})).toEqual(EMPTY_CLEANING_PLANNER_STORE);
  });

  it('calculates preset cadence due dates', () => {
    const base = '2026-01-31T15:00:00.000Z';

    expect(
      getNextDueDate(
        createCleaningTask({
          title: 'Weekly wipe',
          zoneId: 'kitchen',
          taskType: 'clean',
          cadence: { kind: 'weekly' },
          lastCompletedAt: base,
        }),
      ),
    ).toSatisfy((value: Date | null | undefined) => toDateKey(value) === '2026-02-07');

    expect(
      getNextDueDate(
        createCleaningTask({
          title: 'Monthly task',
          zoneId: 'kitchen',
          taskType: 'clean',
          cadence: { kind: 'monthly' },
          lastCompletedAt: base,
        }),
      ),
    ).toSatisfy((value: Date | null | undefined) => toDateKey(value) === '2026-02-28');

    expect(
      getNextDueDate(
        createCleaningTask({
          title: 'Six month task',
          zoneId: 'kitchen',
          taskType: 'replace',
          cadence: { kind: 'semiannual' },
          lastCompletedAt: '2026-01-15T10:00:00.000Z',
        }),
      ),
    ).toSatisfy((value: Date | null | undefined) => toDateKey(value) === '2026-07-15');
  });

  it('calculates custom every-n-days cadence', () => {
    const task = createCleaningTask({
      title: 'Water filters',
      zoneId: 'kitchen',
      taskType: 'replace',
      cadence: { kind: 'custom', everyNDays: 17 },
      lastCompletedAt: '2026-04-01T12:00:00.000Z',
    });

    expect(getNextDueDate(task)).toSatisfy((value: Date | null | undefined) => toDateKey(value) === '2026-04-18');
  });

  it('formats preset cadence labels as full phrases', () => {
    expect(formatCleaningCadence({ kind: 'monthly' })).toBe('Every month');
    expect(formatCleaningCadence({ kind: 'custom', everyNDays: 17 })).toBe('Every 17 days');
  });

  it('completing a task updates lastCompletedAt and advances the next due date', () => {
    const original = createCleaningTask({
      title: 'Sheets',
      zoneId: 'bedroom',
      taskType: 'replace',
      cadence: { kind: 'weekly' },
      lastCompletedAt: '2026-04-01T12:00:00.000Z',
    });

    const completed = completeCleaningTask(original, new Date('2026-04-10T09:30:00.000Z'));

    expect(completed.lastCompletedAt).toBe('2026-04-10T09:30:00.000Z');
    expect(getNextDueDate(completed)).toSatisfy((value: Date | null | undefined) => toDateKey(value) === '2026-04-17');
  });

  it('classifies overdue, due, upcoming, and missing completion states', () => {
    const now = new Date('2026-04-10T13:00:00.000Z');

    const overdue = createCleaningTask({
      title: 'Fridge purge',
      zoneId: 'kitchen',
      taskType: 'clean',
      cadence: { kind: 'monthly' },
      lastCompletedAt: '2026-03-01T09:00:00.000Z',
    });
    const due = createCleaningTask({
      title: 'Counters',
      zoneId: 'kitchen',
      taskType: 'clean',
      cadence: { kind: 'weekly' },
      lastCompletedAt: '2026-04-03T09:00:00.000Z',
    });
    const upcoming = createCleaningTask({
      title: 'Bath mats',
      zoneId: 'bathroom',
      taskType: 'replace',
      cadence: { kind: 'weekly' },
      lastCompletedAt: '2026-04-05T09:00:00.000Z',
    });
    const missingCompletion = createCleaningTask({
      title: 'Dust lamps',
      zoneId: 'whole-home',
      taskType: 'clean',
      cadence: { kind: 'quarterly' },
    });

    expect(getCleaningTaskStatus(overdue, now)).toBe('overdue');
    expect(getCleaningTaskStatus(due, now)).toBe('due');
    expect(getCleaningTaskStatus(upcoming, now)).toBe('upcoming');
    expect(getCleaningTaskStatus(missingCompletion, now)).toBe('due');
  });

  it('round-trips saved data through normalization', () => {
    const store: CleaningPlannerStore = upsertCleaningTask(
      EMPTY_CLEANING_PLANNER_STORE,
      createCleaningTask({
        title: 'Replace AC filter',
        zoneId: 'whole-home',
        taskType: 'replace',
        cadence: { kind: 'semiannual' },
        notes: 'Use the 20x20 filter',
        lastCompletedAt: '2026-04-01T12:00:00.000Z',
      }),
    );

    const normalized = normalizeCleaningPlannerStore(store);
    expect(normalized.version).toBe(1);
    expect(normalized.tasks).toHaveLength(1);
    expect(normalized.tasks[0].taskType).toBe('replace');
    expect(normalized.tasks[0].notes).toBe('Use the 20x20 filter');
  });
});
