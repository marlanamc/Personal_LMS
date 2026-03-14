import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";

const hasDb = Boolean(
  process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.STORAGE_POSTGRES_URL
);

const authMock = vi.hoisted(() => ({ getServerSession: vi.fn() }));
const rateLimitMock = vi.hoisted(() => ({ enforceRateLimit: vi.fn() }));

vi.mock("next-auth", () => ({ getServerSession: authMock.getServerSession }));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: rateLimitMock.enforceRateLimit,
}));

import { POST } from "@/app/api/activity/submit/route";

describe("integration: activity submit with real DB", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.getServerSession.mockResolvedValue(null);
    rateLimitMock.enforceRateLimit.mockResolvedValue(null);
  });

  it.skipIf(!hasDb)(
    "POST /api/activity/submit creates submission and awards points",
    async () => {
      const user = await prisma.user.findFirst({
        where: { username: "marlie" },
        select: { id: true },
      });
      const activity = await prisma.activity.findFirst({
        where: { id: "spanish-vocab-greetings", deletedAt: null },
        select: { id: true },
      });

      if (!user || !activity) {
        console.warn(
          "Skipping: marlie user or spanish-vocab-greetings activity not found. Run db:seed."
        );
        return;
      }

      const beforePoints = await prisma.pointsLedger.aggregate({
        where: { userId: user.id },
        _count: true,
      });

      authMock.getServerSession.mockResolvedValue({ user: { id: user.id } });

      const response = await POST(
        new Request("http://localhost/api/activity/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityId: "spanish-vocab-greetings",
            content: {},
          }),
        })
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(typeof data.points).toBe("number");

      const afterPoints = await prisma.pointsLedger.aggregate({
        where: { userId: user.id },
        _count: true,
      });
      expect(afterPoints._count).toBeGreaterThan(beforePoints._count);
    }
  );
});
