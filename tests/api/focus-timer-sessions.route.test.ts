import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  pointsLedger: {
    deleteMany: vi.fn(),
  },
}));

const authMock = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

vi.mock("next-auth", () => authMock);
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { DELETE } from "@/app/api/focus-timer/sessions/route";

describe("DELETE /api/focus-timer/sessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.getServerSession.mockResolvedValue(null);

    const response = await DELETE();
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({ error: "Unauthorized" });
    expect(prismaMock.pointsLedger.deleteMany).not.toHaveBeenCalled();
  });

  it("deletes focus timer sessions for the authenticated user", async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.pointsLedger.deleteMany.mockResolvedValue({ count: 4 });

    const response = await DELETE();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(prismaMock.pointsLedger.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        source: "focus_timer",
      },
    });
    expect(payload).toEqual({
      success: true,
      deletedCount: 4,
    });
  });
});
