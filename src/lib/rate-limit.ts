import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimiterName = "activity-submit" | "award-points" | "password-reset";

type LimiterDefinition = {
  name: LimiterName;
  limit: number;
  window: `${number} s` | `${number} m` | `${number} h`;
};

const LIMITER_DEFINITIONS: Record<LimiterName, LimiterDefinition> = {
  "activity-submit": { name: "activity-submit", limit: 10, window: "1 m" },
  "award-points": { name: "award-points", limit: 5, window: "1 m" },
  // Password changes are rare; keep the window tight to bound abuse.
  "password-reset": { name: "password-reset", limit: 5, window: "10 m" },
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasUpstashConfig = Boolean(redisUrl && redisToken);

const redis = hasUpstashConfig
  ? new Redis({
      url: redisUrl!,
      token: redisToken!,
    })
  : null;

const limiters: Partial<Record<LimiterName, Ratelimit>> = {};

function getLimiter(name: LimiterName): Ratelimit | null {
  if (!redis) return null;
  if (!limiters[name]) {
    const def = LIMITER_DEFINITIONS[name];
    limiters[name] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(def.limit, def.window),
      prefix: `rl:${def.name}`,
      analytics: true,
    });
  }
  return limiters[name] ?? null;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

function getIdentifier(request: Request, userId?: string): string {
  if (userId && userId.trim() !== "") return `user:${userId}`;
  return `ip:${getClientIp(request)}`;
}

type EnforceRateLimitParams = {
  request: Request;
  limiterName: LimiterName;
  userId?: string;
};

export async function enforceRateLimit({
  request,
  limiterName,
  userId,
}: EnforceRateLimitParams): Promise<NextResponse | null> {
  const limiter = getLimiter(limiterName);
  if (!limiter) return null;

  const identifier = `${limiterName}:${getIdentifier(request, userId)}`;
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (success) return null;

  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}
