import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  submission: {
    findUnique: vi.fn(),
    updateMany: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
}));

const gamificationMock = vi.hoisted(() => ({
  awardPoints: vi.fn(),
  updateStreak: vi.fn(),
  calculateQuizPoints: vi.fn(),
  getActivityPoints: vi.fn(),
  checkAndAwardAchievements: vi.fn(),
}));

const authMock = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

const rateLimitMock = vi.hoisted(() => ({
  enforceRateLimit: vi.fn(),
}));

vi.mock("next-auth", () => authMock);
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/gamification", () => gamificationMock);
vi.mock("@/lib/rate-limit", () => rateLimitMock);

import { POST } from "@/app/api/gamification/award-points/route";

describe("POST /api/gamification/award-points", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    authMock.getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    rateLimitMock.enforceRateLimit.mockResolvedValue(null);

    gamificationMock.awardPoints.mockResolvedValue({});
    gamificationMock.updateStreak.mockResolvedValue({
      streakUpdated: true,
      newStreak: 4,
      pointsAwarded: 2,
    });
    gamificationMock.checkAndAwardAchievements.mockResolvedValue(["ach-1"]);

    prismaMock.submission.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.user.findUnique.mockResolvedValue({
      points: 100,
      weeklyPoints: 40,
      currentStreak: 4,
      longestStreak: 9,
    });
  });

  it("returns 400 when submissionId is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/gamification/award-points", {
        method: "POST",
        body: JSON.stringify({}),
      }) as never
    );

    expect(response.status).toBe(400);
  });

  it("returns 429 when rate limit is exceeded", async () => {
    rateLimitMock.enforceRateLimit.mockResolvedValue(
      Response.json({ error: "Too many requests" }, { status: 429 })
    );

    const response = await POST(
      new Request("http://localhost/api/gamification/award-points", {
        method: "POST",
        body: JSON.stringify({ submissionId: "sub-1" }),
      }) as never
    );

    expect(response.status).toBe(429);
    expect(prismaMock.submission.findUnique).not.toHaveBeenCalled();
  });

  it("returns early when submission already has points", async () => {
    prismaMock.submission.findUnique.mockResolvedValue({
      id: "sub-1",
      activityId: "activity-1",
      pointsAwarded: 5,
      activity: { id: "activity-1", type: "quiz", content: null, ui: null },
    });

    const response = await POST(
      new Request("http://localhost/api/gamification/award-points", {
        method: "POST",
        body: JSON.stringify({ submissionId: "sub-1", score: 100 }),
      }) as never
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.pointsAwarded).toBe(5);
    expect(gamificationMock.awardPoints).not.toHaveBeenCalled();
    expect(prismaMock.submission.updateMany).not.toHaveBeenCalled();
  });

  it("awards quiz points, updates submission/streak, and returns user stats", async () => {
    prismaMock.submission.findUnique.mockResolvedValue({
      id: "sub-2",
      activityId: "activity-2",
      pointsAwarded: 0,
      activity: { id: "activity-2", type: "quiz", content: null, ui: null },
    });
    gamificationMock.calculateQuizPoints.mockReturnValue(15);

    const response = await POST(
      new Request("http://localhost/api/gamification/award-points", {
        method: "POST",
        body: JSON.stringify({ submissionId: "sub-2", score: 100 }),
      }) as never
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.pointsAwarded).toBe(15);
    expect(payload.newAchievements).toBe(1);
    expect(payload.streak.current).toBe(4);

    expect(gamificationMock.awardPoints).toHaveBeenCalledWith(
      "user-1",
      15,
      "Completed activity activity-2"
    );
    expect(rateLimitMock.enforceRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        limiterName: "award-points",
        userId: "user-1",
      })
    );
    expect(prismaMock.submission.updateMany).toHaveBeenCalledWith({
      where: {
        id: "sub-2",
        pointsAwarded: 0,
      },
      data: { pointsAwarded: 15 },
    });
  });
});
