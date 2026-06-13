import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { boundedJsonValue } from "@/lib/validation/common";
import type { RecentCapture, WorkspaceToolType } from "@/types/workspace";

const workspaceContextSchema = z.object({
  lastTool: z.string().nullish(),
  lastDateKey: z.string().nullish(),
  lastProjectId: z.string().nullish(),
  newCapture: boundedJsonValue.optional(),
});

// GET: Fetch user's workspace context
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const context = await prisma.workspaceContext.findUnique({
      where: { userId: session.user.id },
    });

    if (!context) {
      return NextResponse.json(
        {
          hasContext: false,
          context: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        hasContext: true,
        context: {
          id: context.id,
          userId: context.userId,
          lastTool: context.lastTool,
          lastEditedAt: context.lastEditedAt,
          lastDateKey: context.lastDateKey,
          lastProjectId: context.lastProjectId,
          recentCaptures: (context.recentCaptures as unknown) as RecentCapture[],
          createdAt: context.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "api/workspace/context");
  }
}

// POST: Update workspace context
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = workspaceContextSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        },
        { status: 400 }
      );
    }
    const lastTool = (parsed.data.lastTool ?? null) as WorkspaceToolType | null;
    const { lastDateKey, lastProjectId, newCapture } = parsed.data;

    // Build the data object
    const updateData: {
      lastTool: WorkspaceToolType | null;
      lastDateKey: string | null;
      lastProjectId: string | null;
      recentCaptures?: Prisma.InputJsonValue;
    } = {
      lastTool,
      lastDateKey: lastDateKey || null,
      lastProjectId: lastProjectId || null,
    };

    // Handle recentCaptures array
    if (newCapture) {
      // Fetch existing context to get current recentCaptures
      const existing = await prisma.workspaceContext.findUnique({
        where: { userId: session.user.id },
      });

      const existingCaptures = ((existing?.recentCaptures as unknown) as RecentCapture[]) || [];

      // Add new capture to the beginning, limit to 20 most recent
      const updatedCaptures = [newCapture, ...existingCaptures].slice(0, 20);
      updateData.recentCaptures = updatedCaptures as unknown as Prisma.InputJsonValue;
    }

    const context = await prisma.workspaceContext.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        lastTool,
        lastDateKey: lastDateKey || null,
        lastProjectId: lastProjectId || null,
        recentCaptures: (newCapture ? [newCapture] : []) as unknown as Prisma.InputJsonValue,
      },
      update: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        context: {
          id: context.id,
          userId: context.userId,
          lastTool: context.lastTool,
          lastEditedAt: context.lastEditedAt,
          lastDateKey: context.lastDateKey,
          lastProjectId: context.lastProjectId,
          recentCaptures: (context.recentCaptures as unknown) as RecentCapture[],
          createdAt: context.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "api/workspace/context");
  }
}
