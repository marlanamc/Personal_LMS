import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  achievement: {
    findMany: vi.fn(),
  },
  userAchievement: {
    create: vi.fn(),
  },
  pointsLedger: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { checkAndAwardAchievements } from "@/lib/gamification";

describe("checkAndAwardAchievements", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    prismaMock.pointsLedger.create.mockResolvedValue({});
    prismaMock.userAchievement.create.mockResolvedValue({});
    prismaMock.user.update.mockResolvedValue({});
  });

  it("awards only newly-earned achievements and bonus points", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      currentStreak: 3,
      points: 120,
      submissions: [{ score: 100 }],
      achievements: [{ achievementId: "already-earned" }],
    });

    prismaMock.achievement.findMany.mockResolvedValue([
      { id: "already-earned", type: "streak", requirement: 2, points: 0, name: "Existing" },
      { id: "streak-3", type: "streak", requirement: 3, points: 0, name: "3 Day Streak" },
      { id: "points-100", type: "points", requirement: 100, points: 20, name: "100 Points" },
      { id: "perfect-1", type: "quiz", requirement: 1, points: 0, name: "Perfect Quiz" },
      { id: "activity-2", type: "activity", requirement: 2, points: 0, name: "2 Activities" },
    ]);

    const awarded = await checkAndAwardAchievements("user-1");

    expect(awarded).toEqual(["streak-3", "points-100", "perfect-1"]);
    expect(prismaMock.userAchievement.create).toHaveBeenCalledTimes(3);

    // Bonus points are granted through awardPoints() internals.
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.pointsLedger.create).toHaveBeenCalledTimes(1);
  });

  it("returns empty when user is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const awarded = await checkAndAwardAchievements("missing-user");

    expect(awarded).toEqual([]);
    expect(prismaMock.achievement.findMany).not.toHaveBeenCalled();
    expect(prismaMock.userAchievement.create).not.toHaveBeenCalled();
  });
});
