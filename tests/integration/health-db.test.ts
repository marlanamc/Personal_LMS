import { describe, expect, it } from "vitest";

const hasDb = Boolean(
  process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.STORAGE_POSTGRES_URL
);

describe("integration: health endpoint with real DB", () => {
  it.skipIf(!hasDb)(
    "GET /api/health returns ok when DB is reachable",
    async () => {
      const { GET } = await import("@/app/api/health/route");
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.db).toBe("ok");
    }
  );
});
