import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { preferencesEnvelopeSchema } from "@/lib/validation/common";
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

    const { preferences: rawPreferences } = preferencesEnvelopeSchema.parse(await req.json());
    const preferences = normalizePushPreferences(rawPreferences);
    await savePushNotificationPreferences(session.user.id, preferences);
    return NextResponse.json({ ok: true, preferences });
  } catch (error) {
    return handleApiError(error, "api/push/preferences:POST");
  }
}

