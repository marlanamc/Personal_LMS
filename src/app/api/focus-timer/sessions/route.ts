import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

const SOURCE = "focus_timer";
const SESSION_REASON_VERSION = 1;

type FocusSessionPayload = {
  v: number;
  sessionId: string;
  title: string;
  durationMinutes: number;
  completedAt: string;
};

function parseSessionPayload(reason: string | null): FocusSessionPayload | null {
  if (!reason) return null;

  try {
    const parsed = JSON.parse(reason) as Partial<FocusSessionPayload>;
    if (
      parsed.v !== SESSION_REASON_VERSION ||
      typeof parsed.sessionId !== "string" ||
      typeof parsed.title !== "string" ||
      typeof parsed.durationMinutes !== "number" ||
      typeof parsed.completedAt !== "string"
    ) {
      return null;
    }

    return {
      v: SESSION_REASON_VERSION,
      sessionId: parsed.sessionId,
      title: parsed.title,
      durationMinutes: parsed.durationMinutes,
      completedAt: parsed.completedAt,
    };
  } catch {
    return null;
  }
}

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

    const body = await request.json();
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const durationMinutes = Number(body.durationMinutes);
    const completedAt = typeof body.completedAt === "string" ? body.completedAt : new Date().toISOString();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    if (!title || title.length > 80) {
      return NextResponse.json({ error: "title is required and must be <= 80 chars" }, { status: 400 });
    }

    if (!Number.isFinite(durationMinutes) || durationMinutes < 5 || durationMinutes > 120) {
      return NextResponse.json({ error: "durationMinutes must be between 5 and 120" }, { status: 400 });
    }

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
