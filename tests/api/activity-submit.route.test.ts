import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  activity: {
    findFirst: vi.fn(),
  },
  submission: {
    upsert: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  activityProgress: {
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}));

const gamificationMock = vi.hoisted(() => ({
  awardPoints: vi.fn(),
  updateStreak: vi.fn(),
  checkAndAwardAchievements: vi.fn(),
  calculateQuizPoints: vi.fn(),
  getActivityPoints: vi.fn(),
}));

const challengeMock = vi.hoisted(() => ({
  updateChallengeProgress: vi.fn(),
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
vi.mock("@/lib/daily-challenge", () => challengeMock);
vi.mock("@/lib/rate-limit", () => rateLimitMock);

import { POST } from "@/app/api/activity/submit/route";

describe("POST /api/activity/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    authMock.getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    rateLimitMock.enforceRateLimit.mockResolvedValue(null);

    prismaMock.submission.upsert.mockResolvedValue({ id: "sub-upsert", score: 92 });
    prismaMock.submission.findFirst.mockResolvedValue(null);
    prismaMock.submission.update.mockResolvedValue({ id: "sub-update", score: 80 });
    prismaMock.submission.create.mockResolvedValue({ id: "sub-create", score: 80 });

    prismaMock.activityProgress.findFirst.mockResolvedValue(null);
    prismaMock.activityProgress.create.mockResolvedValue({ id: "progress-new" });
    prismaMock.activityProgress.update.mockResolvedValue({ id: "progress-existing" });

    gamificationMock.awardPoints.mockResolvedValue({});
    gamificationMock.updateStreak.mockResolvedValue({});
    gamificationMock.checkAndAwardAchievements.mockResolvedValue([]);
    challengeMock.updateChallengeProgress.mockResolvedValue({ justCompleted: false, bonusPoints: 0 });
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.getServerSession.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/activity/submit", {
        method: "POST",
        body: JSON.stringify({ activityId: "a1" }),
      })
    );

    expect(response.status).toBe(401);
  });

  it("returns 429 when rate limit is exceeded", async () => {
    rateLimitMock.enforceRateLimit.mockResolvedValue(
      Response.json({ error: "Too many requests" }, { status: 429 })
    );

    const response = await POST(
      new Request("http://localhost/api/activity/submit", {
        method: "POST",
        body: JSON.stringify({ activityId: "a1" }),
      })
    );

    expect(response.status).toBe(429);
    expect(prismaMock.activity.findFirst).not.toHaveBeenCalled();
  });

  it("awards server-calculated quiz points and returns success", async () => {
    prismaMock.activity.findFirst.mockResolvedValue({
      id: "activity-1",
      title: "Unit Quiz",
      type: "quiz",
      content: null,
      ui: null,
    });
    gamificationMock.calculateQuizPoints.mockReturnValue(10);
    challengeMock.updateChallengeProgress.mockResolvedValue({ justCompleted: true, bonusPoints: 3 });

    const response = await POST(
      new Request("http://localhost/api/activity/submit", {
        method: "POST",
        body: JSON.stringify({
          activityId: "activity-1",
          content: { answers: ["A"] },
          score: 92,
          assignmentId: "assign-1",
          pointsAwarded: 999,
        }),
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.points).toBe(10);
    expect(payload.challengeCompleted).toBe(true);
    expect(payload.challengeBonusPoints).toBe(3);

    expect(gamificationMock.calculateQuizPoints).toHaveBeenCalledWith(92);
    expect(rateLimitMock.enforceRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        limiterName: "activity-submit",
        userId: "user-1",
      })
    );
    expect(gamificationMock.awardPoints).toHaveBeenCalledWith(
      "user-1",
      10,
      expect.stringContaining("|Quiz")
    );
    expect(prismaMock.submission.upsert).toHaveBeenCalledTimes(1);
    expect(prismaMock.submission.findFirst).not.toHaveBeenCalled();
  });

  it("treats assignmentId='null' as non-assignment submission path", async () => {
    prismaMock.activity.findFirst.mockResolvedValue({
      id: "activity-2",
      title: "Game Activity",
      type: "game",
      content: null,
      ui: "matching",
    });
    gamificationMock.getActivityPoints.mockReturnValue(7);
    prismaMock.submission.findFirst.mockResolvedValue({ id: "existing-null-assignment" });

    const response = await POST(
      new Request("http://localhost/api/activity/submit", {
        method: "POST",
        body: JSON.stringify({
          activityId: "activity-2",
          content: { answers: ["B"] },
          assignmentId: "null",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(prismaMock.submission.upsert).not.toHaveBeenCalled();
    expect(prismaMock.submission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          assignmentId: null,
        }),
      })
    );
    expect(prismaMock.submission.update).toHaveBeenCalledTimes(1);
  });
});
