import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import {
  getPushNotificationPreferences,
  getStoredPushSubscriptions,
  getWebPushPublicKey,
  hasWebPushConfig,
} from "@/lib/push-notifications";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [preferences, subscriptions] = await Promise.all([
      getPushNotificationPreferences(session.user.id),
      getStoredPushSubscriptions(session.user.id),
    ]);

    return NextResponse.json({
      preferences,
      subscriptionCount: subscriptions.length,
      isConfigured: hasWebPushConfig(),
      publicKey: getWebPushPublicKey(),
    });
  } catch (error) {
    return handleApiError(error, "api/push/settings:GET");
  }
}

