import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
  utilitySubjectState: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
}));

const authMock = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

vi.mock('next-auth', () => authMock);
vi.mock('@/lib/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET, POST } from '@/app/api/quarterly-planner/route';

describe('quarterly planner route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    authMock.getServerSession.mockResolvedValue(null);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized');
  });

  it('normalizes malformed saved payloads on read', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.utilitySubjectState.findUnique.mockResolvedValue({
      checklist: {
        activeQuarter: {
          startDate: '2026-04-13',
          goals: [{ title: 'Ship it', milestones: ['alpha', '', 7] }],
          weeklyCheckIns: ['bad-entry'],
        },
        archivedQuarters: [{ startDate: '2026-01-01', goals: [] }],
      },
      updatedAt: new Date('2026-04-13T14:00:00.000Z'),
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.store.activeQuarter.endDate).toBe('2026-07-05');
    expect(payload.store.activeQuarter.goals[0].milestones).toEqual(['alpha']);
    expect(payload.store.activeQuarter.weeklyCheckIns[0].focus).toBe('');
    expect(payload.store.archivedQuarters).toHaveLength(1);
  });

  it('round-trips a valid quarterly planner payload through POST', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.utilitySubjectState.upsert.mockResolvedValue({
      updatedAt: new Date('2026-04-13T14:05:00.000Z'),
    });

    const response = await POST(
      new Request('http://localhost/api/quarterly-planner', {
        method: 'POST',
        body: JSON.stringify({
          store: {
            activeQuarter: {
              id: 'quarter-1',
              title: 'Summer Build',
              startDate: '2026-04-13',
              vision: 'Finish the foundation',
              whyItMatters: 'This sets up the rest of the year.',
              goals: [
                {
                  id: 'g-1',
                  title: 'Launch planner',
                  successMetric: 'Live in production',
                  milestones: ['API', 'UI'],
                  habits: ['Review weekly'],
                  obstacles: ['Scope creep'],
                  firstSteps: ['Design store'],
                },
                { id: 'g-2', title: '', successMetric: '', milestones: [], habits: [], obstacles: [], firstSteps: [] },
                { id: 'g-3', title: '', successMetric: '', milestones: [], habits: [], obstacles: [], firstSteps: [] },
              ],
              weeklyCheckIns: Array.from({ length: 12 }, (_, index) => ({
                weekNumber: index + 1,
                focus: '',
                wins: '',
                blockers: '',
                adjustment: '',
              })),
              closingReflection: '',
              celebrationNote: '',
              carryForward: '',
            },
            archivedQuarters: [],
          },
        }),
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(prismaMock.utilitySubjectState.upsert).toHaveBeenCalledWith({
      where: {
        userId_subjectKey: {
          userId: 'user-1',
          subjectKey: 'quarterly-planner',
        },
      },
      create: expect.objectContaining({
        userId: 'user-1',
        subjectKey: 'quarterly-planner',
        links: [],
      }),
      update: {
        checklist: expect.objectContaining({
          version: 1,
          activeQuarter: expect.objectContaining({
            title: 'Summer Build',
            startDate: '2026-04-13',
            endDate: '2026-07-05',
          }),
        }),
      },
      select: {
        updatedAt: true,
      },
    });
  });
});
