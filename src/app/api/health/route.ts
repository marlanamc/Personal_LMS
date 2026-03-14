import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health
 * Health check for deployment and load balancers.
 * Verifies DB connectivity; reports Redis config status.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    return NextResponse.json(
      { ok: false, db: "error", error: String(error) },
      { status: 503 }
    );
  }

  const redisConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );

  return NextResponse.json({
    ok: true,
    db: "ok",
    redis: redisConfigured ? "configured" : "not_configured",
  });
}
