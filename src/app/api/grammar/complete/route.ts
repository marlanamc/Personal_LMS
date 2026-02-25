import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CompletePayload = {
  activityId?: string;
  score?: number;
  total?: number;
  responses?: unknown;
};

const toIntOrNull = (value: unknown): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value);
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CompletePayload;
    const activityId = typeof body.activityId === "string" ? body.activityId.trim() : "";
    const scoreRaw = toIntOrNull(body.score);
    const totalRaw = toIntOrNull(body.total);

    if (!activityId) {
      return NextResponse.json({ error: "activityId is required" }, { status: 400 });
    }

    if (scoreRaw === null || totalRaw === null || totalRaw <= 0) {
      return NextResponse.json({ error: "score and total are required" }, { status: 400 });
    }

    const percentScore = Math.max(0, Math.min(100, Math.round((scoreRaw / totalRaw) * 100)));
    const now = new Date();

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        userId,
        activityId,
        assignmentId: null,
      },
      select: { id: true },
    });

    const content = JSON.stringify({
      type: "mini_quiz",
      score: scoreRaw,
      total: totalRaw,
      percent: percentScore,
      responses: body.responses ?? null,
      submittedAt: now.toISOString(),
    });

    if (existingSubmission) {
      await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          content,
          score: percentScore,
          status: "graded",
          completedAt: now,
        },
      });
    } else {
      await prisma.submission.create({
        data: {
          userId,
          activityId,
          assignmentId: null,
          content,
          score: percentScore,
          status: "graded",
          completedAt: now,
        },
      });
    }

    return NextResponse.json({
      success: true,
      activityId,
      score: percentScore,
    });
  } catch (error) {
    console.error("Failed to save mini quiz completion", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

