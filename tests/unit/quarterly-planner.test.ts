import { describe, expect, it } from 'vitest';
import {
  EMPTY_QUARTERLY_PLANNER_STORE,
  createQuarterlyPlan,
  getQuarterEndDate,
  normalizeQuarterlyPlannerStore,
  reopenArchivedQuarter,
  startNewQuarter,
  updateQuarterGoal,
} from '@/lib/quarterly-planner';

describe('quarterly planner', () => {
  it('normalizes empty and invalid payloads safely', () => {
    const normalizedNull = normalizeQuarterlyPlannerStore(null);
    const normalizedInvalid = normalizeQuarterlyPlannerStore({ activeQuarter: { goals: 'bad-data' } });

    expect(normalizedNull.version).toBe(1);
    expect(normalizedNull.activeQuarter.goals).toHaveLength(3);
    expect(normalizedNull.activeQuarter.weeklyCheckIns).toHaveLength(12);

    expect(normalizedInvalid.activeQuarter.goals).toHaveLength(3);
    expect(normalizedInvalid.activeQuarter.weeklyCheckIns).toHaveLength(12);
  });

  it('derives the quarter end date from the custom start date', () => {
    expect(getQuarterEndDate('2026-04-13')).toBe('2026-07-05');
    expect(createQuarterlyPlan('2026-04-13').endDate).toBe('2026-07-05');
  });

  it('sanitizes malformed nested data without crashing', () => {
    const normalized = normalizeQuarterlyPlannerStore({
      activeQuarter: {
        title: 'Q2 Build',
        startDate: '2026-04-13',
        goals: [
          {
            title: 'Ship quarterly planner',
            milestones: ['View', '', 'API', 4],
            habits: 'not-an-array',
          },
        ],
        weeklyCheckIns: [{ focus: 'Week 1' }, 'bad-entry'],
      },
    });

    expect(normalized.activeQuarter.title).toBe('Q2 Build');
    expect(normalized.activeQuarter.goals[0].milestones).toEqual(['View', 'API']);
    expect(normalized.activeQuarter.goals[0].habits).toEqual([]);
    expect(normalized.activeQuarter.weeklyCheckIns[0].focus).toBe('Week 1');
    expect(normalized.activeQuarter.weeklyCheckIns[1].focus).toBe('');
  });

  it('preserves archived quarters and can reopen one into the active slot', () => {
    const storeWithGoal = {
      ...EMPTY_QUARTERLY_PLANNER_STORE,
      activeQuarter: updateQuarterGoal(createQuarterlyPlan('2026-04-13'), 0, { title: 'Launch new season' }),
    };

    const archived = startNewQuarter(storeWithGoal, '2026-07-06');
    expect(archived.archivedQuarters).toHaveLength(1);
    expect(archived.archivedQuarters[0].title).toBe('');
    expect(archived.archivedQuarters[0].goals[0].title).toBe('Launch new season');

    const reopened = reopenArchivedQuarter(archived, archived.archivedQuarters[0].id);
    expect(reopened.activeQuarter.goals[0].title).toBe('Launch new season');
    expect(reopened.archivedQuarters).toHaveLength(0);
  });
});
