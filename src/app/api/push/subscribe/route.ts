import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import {
  normalizePushPreferences,
  removeStoredPushSubscription,
  savePushNotificationPreferences,
  StoredPushSubscription,
  upsertStoredPushSubscription,
} from "@/lib/push-notifications";

function normalizeSubscriptionInput(raw: unknown, userAgent: string | null): StoredPushSubscription | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const candidate = raw as Record<string, unknown>;
  const keys = candidate.keys && typeof candidate.keys === "object" && !Array.isArray(candidate.keys)
    ? candidate.keys as Record<string, unknown>
    : null;
  const endpoint = typeof candidate.endpoint === "string" ? candidate.endpoint.trim() : "";
  const p256dh = typeof keys?.p256dh === "string" ? keys.p256dh.trim() : "";
  const auth = typeof keys?.auth === "string" ? keys.auth.trim() : "";
  if (!endpoint || !p256dh || !auth) return null;
  const nowIso = new Date().toISOString();
  return {
    endpoint,
    expirationTime: typeof candidate.expirationTime === "number" ? candidate.expirationTime : null,
    keys: { p256dh, auth },
    userAgent,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { subscription?: unknown; preferences?: unknown };
    const subscription = normalizeSubscriptionInput(body.subscription, req.headers.get("user-agent"));
    if (!subscription) {
      return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
    }

    const nextSubscriptions = await upsertStoredPushSubscription(session.user.id, subscription);

    if (body.preferences !== undefined) {
      const preferences = normalizePushPreferences(body.preferences);
      await savePushNotificationPreferences(session.user.id, {
        ...preferences,
        enabled: true,
      });
    }

    return NextResponse.json({ ok: true, subscriptionCount: nextSubscriptions.length });
  } catch (error) {
    return handleApiError(error, "api/push/subscribe:POST");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { endpoint?: unknown };
    const endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const nextSubscriptions = await removeStoredPushSubscription(session.user.id, endpoint);
    return NextResponse.json({ ok: true, subscriptionCount: nextSubscriptions.length });
  } catch (error) {
    return handleApiError(error, "api/push/subscribe:DELETE");
  }
}

