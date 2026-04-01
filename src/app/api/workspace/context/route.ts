import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { WorkspaceContext, RecentCapture } from "@/types/workspace";

// GET: Fetch user's workspace context
export async function GET(request: NextRequest) {
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
    console.error("[workspace/context] Error fetching context:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace context" },
      { status: 500 }
    );
  }
}

// POST: Update workspace context
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lastTool, lastDateKey, lastProjectId, newCapture } = body;

    // Build the data object
    const updateData: any = {
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
      updateData.recentCaptures = updatedCaptures;
    }

    const context = await prisma.workspaceContext.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        lastTool,
        lastDateKey: lastDateKey || null,
        lastProjectId: lastProjectId || null,
        recentCaptures: newCapture ? [newCapture] : [],
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
    console.error("[workspace/context] Error updating context:", error);
    return NextResponse.json(
      { error: "Failed to update workspace context" },
      { status: 500 }
    );
  }
}
