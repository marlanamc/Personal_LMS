import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
  dailyWin: {
    findMany: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

const authMock = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

vi.mock('next-auth', () => authMock);
vi.mock('@/lib/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET, POST } from '@/app/api/daily-wins/route';
import { DELETE } from '@/app/api/daily-wins/[id]/route';

describe('daily-wins route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when unauthenticated for GET, POST, DELETE', async () => {
    authMock.getServerSession.mockResolvedValue(null);

    const getRes = await GET();
    expect(getRes.status).toBe(401);

    const postRes = await POST(
      new Request('http://localhost/api/daily-wins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '  hello  ' }),
      }) as never,
    );
    expect(postRes.status).toBe(401);

    const delRes = await DELETE(
      new Request('http://localhost/api/daily-wins/x', { method: 'DELETE' }) as never,
      { params: Promise.resolve({ id: 'win-1' }) },
    );
    expect(delRes.status).toBe(401);
  });

  it('GET loads wins for the current week for the authenticated user', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    const created = new Date('2026-04-22T10:00:00.000Z');
    prismaMock.dailyWin.findMany.mockResolvedValue([
      { id: 'a', text: 'Did a thing', createdAt: created },
    ]);

    const res = await GET();
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(prismaMock.dailyWin.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        createdAt: {
          gte: expect.any(Date),
          lt: expect.any(Date),
        },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true, text: true, createdAt: true },
    });
    expect(payload.wins).toHaveLength(1);
    expect(payload.wins[0]).toEqual({
      id: 'a',
      text: 'Did a thing',
      createdAt: created.toISOString(),
    });
    expect(typeof payload.weekStart).toBe('string');
  });

  it('POST creates a win with trimmed text', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    const created = new Date('2026-04-22T12:00:00.000Z');
    prismaMock.dailyWin.create.mockResolvedValue({
      id: 'new-id',
      text: 'Washed hair',
      createdAt: created,
    });

    const res = await POST(
      new Request('http://localhost/api/daily-wins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '  Washed hair  ' }),
      }) as never,
    );
    const payload = await res.json();

    expect(res.status).toBe(201);
    expect(prismaMock.dailyWin.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', text: 'Washed hair' },
      select: { id: true, text: true, createdAt: true },
    });
    expect(payload.win.id).toBe('new-id');
  });

  it('POST returns 400 for empty text', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });

    const res = await POST(
      new Request('http://localhost/api/daily-wins', {
        method: 'POST',
        body: JSON.stringify({ text: '   ' }),
      }) as never,
    );
    expect(res.status).toBe(400);
  });

  it('DELETE removes a win for the current user', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.dailyWin.deleteMany.mockResolvedValue({ count: 1 });

    const res = await DELETE(
      new Request('http://localhost/api/daily-wins/win-1', { method: 'DELETE' }) as never,
      { params: Promise.resolve({ id: 'win-1' }) },
    );
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(prismaMock.dailyWin.deleteMany).toHaveBeenCalledWith({
      where: { id: 'win-1', userId: 'user-1' },
    });
  });

  it('DELETE returns 404 when no row was deleted', async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.dailyWin.deleteMany.mockResolvedValue({ count: 0 });

    const res = await DELETE(
      new Request('http://localhost/api/daily-wins/missing', { method: 'DELETE' }) as never,
      { params: Promise.resolve({ id: 'missing' }) },
    );
    expect(res.status).toBe(404);
  });
});
