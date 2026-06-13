import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { nonEmptyString } from "@/lib/validation/common";

const focusSessionSchema = z.object({
  sessionId: nonEmptyString,
  title: nonEmptyString.max(80),
  durationMinutes: z.coerce.number().min(5).max(120),
  completedAt: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Focus session history storage was removed with gamification system
    // Sessions are no longer persisted - this returns empty
    return NextResponse.json({
      sessions: [],
      totals: { totalSessions: 0, totalFocusMinutes: 0, totalFocusPoints: 0 }
    });
  } catch (error) {
    return handleApiError(error, "api/focus-timer/sessions:GET");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, title, durationMinutes, completedAt: completedAtInput } =
      focusSessionSchema.parse(await request.json());
    const completedAt = completedAtInput ?? new Date().toISOString();

    const normalizedMinutes = Math.round(durationMinutes / 5) * 5;

    // Focus timer sessions are no longer logged with points - just return success
    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        title,
        durationMinutes: normalizedMinutes,
        completedAt,
      },
    });
  } catch (error) {
    return handleApiError(error, "api/focus-timer/sessions:POST");
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Focus session history storage was removed - nothing to delete
    return NextResponse.json({
      success: true,
      deletedCount: 0,
    });
  } catch (error) {
    return handleApiError(error, "api/focus-timer/sessions:DELETE");
  }
}
