import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { POINTS } from "@/lib/gamification/constants";
import { checkAndAwardAchievements, updateStreak } from "@/lib/gamification";
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

    const entries = await prisma.pointsLedger.findMany({
      where: {
        userId: session.user.id,
        source: SOURCE,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        points: true,
        reason: true,
        createdAt: true,
      },
    });

    const sessions = entries
      .map((entry) => {
        const payload = parseSessionPayload(entry.reason);
        if (!payload) return null;
        return {
          id: payload.sessionId || entry.id,
          title: payload.title,
          durationMinutes: payload.durationMinutes,
          completedAt: payload.completedAt,
          pointsAwarded: entry.points,
        };
      })
      .filter((value): value is NonNullable<typeof value> => Boolean(value));

    const totals = sessions.reduce(
      (acc, current) => {
        acc.totalSessions += 1;
        acc.totalFocusMinutes += current.durationMinutes;
        acc.totalFocusPoints += current.pointsAwarded;
        return acc;
      },
      { totalSessions: 0, totalFocusMinutes: 0, totalFocusPoints: 0 }
    );

    return NextResponse.json({ sessions, totals });
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
    const focusBlocks = Math.floor(normalizedMinutes / 30);
    const pointsAwarded = focusBlocks * POINTS.FOCUS_TIMER_30_MIN;
    const reasonPayload: FocusSessionPayload = {
      v: SESSION_REASON_VERSION,
      sessionId,
      title,
      durationMinutes: normalizedMinutes,
      completedAt,
    };
    const reason = JSON.stringify(reasonPayload);

    const existing = await prisma.pointsLedger.findFirst({
      where: {
        userId: session.user.id,
        source: SOURCE,
        reason,
      },
      select: { id: true, points: true },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyLogged: true,
        pointsAwarded: existing.points,
        session: {
          id: sessionId,
          title,
          durationMinutes: normalizedMinutes,
          completedAt,
          pointsAwarded: existing.points,
        },
      });
    }

    if (pointsAwarded > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: {
            points: { increment: pointsAwarded },
            weeklyPoints: { increment: pointsAwarded },
          },
        }),
        prisma.pointsLedger.create({
          data: {
            userId: session.user.id,
            points: pointsAwarded,
            reason,
            source: SOURCE,
          },
        }),
      ]);
    } else {
      await prisma.pointsLedger.create({
        data: {
          userId: session.user.id,
          points: 0,
          reason,
          source: SOURCE,
        },
      });
    }

    const streakResult = pointsAwarded > 0
      ? await updateStreak(session.user.id, pointsAwarded)
      : { streakUpdated: false, newStreak: 0, pointsAwarded: 0 };

    const newAchievements = pointsAwarded > 0
      ? await checkAndAwardAchievements(session.user.id)
      : [];

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        points: true,
        weeklyPoints: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    return NextResponse.json({
      success: true,
      pointsAwarded,
      streak: {
        updated: streakResult.streakUpdated,
        current: streakResult.newStreak,
        pointsFromStreak: streakResult.pointsAwarded,
      },
      newAchievements: newAchievements.length,
      user,
      session: {
        id: sessionId,
        title,
        durationMinutes: normalizedMinutes,
        completedAt,
        pointsAwarded,
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

    const result = await prisma.pointsLedger.deleteMany({
      where: {
        userId: session.user.id,
        source: SOURCE,
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    return handleApiError(error, "api/focus-timer/sessions:DELETE");
  }
}
