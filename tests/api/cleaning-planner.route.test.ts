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

import { GET, POST } from '@/app/api/cleaning-planner/route';

describe('cleaning planner route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    authMock.getServerSession.mockResolvedValue(null);

    const getResponse = await GET();
    expect(getResponse.status).toBe(401);

    const postResponse = await POST(
      new Request('http://localhost/api/cleaning-planner', {
        method: 'POST',
        body: JSON.stringify({ store: {} }),
      }) as never,
    );
    expect(postResponse.status).toBe(401);
  });

  it('loads the normalized store for the authenticated user', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.utilitySubjectState.findUnique.mockResolvedValue({
      checklist: {
        version: 1,
        tasks: [
          {
            id: 'task-1',
            title: ' Wipe counters ',
            zoneId: 'kitchen',
            taskType: 'clean',
            cadence: { kind: 'weekly' },
            lastCompletedAt: '2026-04-03T09:00:00.000Z',
            createdAt: '2026-04-01T09:00:00.000Z',
            updatedAt: '2026-04-03T09:00:00.000Z',
          },
        ],
        zones: [],
      },
      updatedAt: new Date('2026-04-03T09:00:00.000Z'),
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(prismaMock.utilitySubjectState.findUnique).toHaveBeenCalledWith({
      where: {
        userId_subjectKey: {
          userId: 'user-1',
          subjectKey: 'cleaning-planner',
        },
      },
      select: {
        checklist: true,
        updatedAt: true,
      },
    });
    expect(payload.store.tasks[0]).toMatchObject({
      id: 'task-1',
      title: 'Wipe counters',
      zoneId: 'kitchen',
      taskType: 'clean',
    });
  });

  it('normalizes and saves the posted store', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.utilitySubjectState.upsert.mockResolvedValue({
      updatedAt: new Date('2026-04-10T11:00:00.000Z'),
    });

    const response = await POST(
      new Request('http://localhost/api/cleaning-planner', {
        method: 'POST',
        body: JSON.stringify({
          store: {
            version: 999,
            tasks: [
              {
                id: 'task-1',
                title: ' Replace Brita filter ',
                zoneId: 'kitchen',
                taskType: 'replace',
                cadence: { kind: 'custom', everyNDays: 45.8 },
                notes: ' Fridge pitcher ',
                createdAt: '2026-04-01T09:00:00.000Z',
                updatedAt: '2026-04-01T09:00:00.000Z',
              },
              { bad: 'row' },
            ],
            zones: [{ id: 'office', label: ' Office ' }],
          },
        }),
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(prismaMock.utilitySubjectState.upsert).toHaveBeenCalledWith({
      where: {
        userId_subjectKey: {
          userId: 'user-1',
          subjectKey: 'cleaning-planner',
        },
      },
      create: {
        userId: 'user-1',
        subjectKey: 'cleaning-planner',
        checklist: {
          version: 1,
          tasks: [
            {
              id: 'task-1',
              title: 'Replace Brita filter',
              zoneId: 'kitchen',
              taskType: 'replace',
              cadence: { kind: 'custom', everyNDays: 45 },
              notes: 'Fridge pitcher',
              lastCompletedAt: undefined,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
            },
          ],
          zones: [],
        },
        links: [],
      },
      update: {
        checklist: {
          version: 1,
          tasks: [
            {
              id: 'task-1',
              title: 'Replace Brita filter',
              zoneId: 'kitchen',
              taskType: 'replace',
              cadence: { kind: 'custom', everyNDays: 45 },
              notes: 'Fridge pitcher',
              lastCompletedAt: undefined,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
            },
          ],
          zones: [],
        },
      },
      select: {
        updatedAt: true,
      },
    });
  });
});

