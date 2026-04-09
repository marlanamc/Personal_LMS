import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import {
  normalizePushPreferences,
  savePushNotificationPreferences,
} from "@/lib/push-notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { preferences?: unknown };
    const preferences = normalizePushPreferences(body.preferences);
    await savePushNotificationPreferences(session.user.id, preferences);
    return NextResponse.json({ ok: true, preferences });
  } catch (error) {
    return handleApiError(error, "api/push/preferences:POST");
  }
}

