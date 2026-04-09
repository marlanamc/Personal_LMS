import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import {
  getStoredPushSubscriptions,
  hasWebPushConfig,
  removeStoredPushSubscription,
  sendPushNotification,
} from "@/lib/push-notifications";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasWebPushConfig()) {
      return NextResponse.json({ error: "Web Push is not configured on the server yet." }, { status: 503 });
    }

    const subscriptions = await getStoredPushSubscriptions(session.user.id);
    if (subscriptions.length === 0) {
      return NextResponse.json({ error: "No subscribed devices found." }, { status: 400 });
    }

    let sent = 0;
    let removed = 0;

    for (const subscription of subscriptions) {
      try {
        await sendPushNotification(subscription, {
          title: "Personal LMS notifications are on",
          body: "Test push delivered successfully. Anchor and calendar reminders can use this channel.",
          url: "/dashboard/notifications",
          tag: "push-test",
          icon: "/icon-192-v2.png",
          badge: "/icon-192-v2.png",
        });
        sent += 1;
      } catch (error) {
        const statusCode = typeof error === "object" && error && "statusCode" in error
          ? Number((error as { statusCode?: unknown }).statusCode)
          : null;
        if (statusCode === 404 || statusCode === 410) {
          await removeStoredPushSubscription(session.user.id, subscription.endpoint);
          removed += 1;
        } else {
          throw error;
        }
      }
    }

    return NextResponse.json({ ok: true, sent, removed });
  } catch (error) {
    return handleApiError(error, "api/push/test:POST");
  }
}
