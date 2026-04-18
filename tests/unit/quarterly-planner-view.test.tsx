import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import QuarterlyPlannerView from '@/components/planning/QuarterlyPlannerView';
import { createQuarterlyPlan } from '@/lib/quarterly-planner';

const hookMock = vi.hoisted(() => ({
  useQuarterlyPlanner: vi.fn(),
}));

vi.mock('@/components/dashboard/useQuarterlyPlanner', () => hookMock);

describe('QuarterlyPlannerView', () => {
  it('renders the first-time planner workbook sections', () => {
    hookMock.useQuarterlyPlanner.mockReturnValue({
      activeQuarter: createQuarterlyPlan('2026-04-13'),
      archivedQuarters: [],
      updateActiveQuarterField: vi.fn(),
      updateGoal: vi.fn(),
      updateWeeklyCheckIn: vi.fn(),
      beginNewQuarter: vi.fn(),
      archiveCurrentQuarter: vi.fn(),
      reopenQuarter: vi.fn(),
      isLoaded: true,
      isSaving: false,
      saveError: null,
      lastSyncedAt: null,
    });

    const html = renderToStaticMarkup(<QuarterlyPlannerView storageScope="user-1" />);

    expect(html).toContain('Quarterly Planner');
    expect(html).toContain('Quarter Setup');
    expect(html).toContain('Why this matters');
    expect(html).toContain('Goal 1');
    expect(html).toContain('Weekly Check-Ins');
    expect(html).toContain('Archive');
  });
});
