import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { nonEmptyString } from "@/lib/validation/common";

const grammarCompleteSchema = z.object({
  activityId: nonEmptyString,
  score: z.number().finite(),
  total: z.number().finite().positive(),
  responses: z.unknown().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activityId, score, total, responses } = grammarCompleteSchema.parse(await request.json());
    const scoreRaw = Math.round(score);
    const totalRaw = Math.round(total);

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
      responses: responses ?? null,
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
    return handleApiError(error, "api/grammar/complete:POST");
  }
}
