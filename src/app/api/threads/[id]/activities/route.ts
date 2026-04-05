import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiError } from '@/lib/api-error';

// POST - Link an activity to a thread
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: threadId } = await params;
    const body = await req.json();
    const { activityId } = body;

    if (!activityId || typeof activityId !== 'string') {
      throw new ApiError(400, 'missing_activity_id', 'activityId is required');
    }

    // Verify thread belongs to user
    const thread = await prisma.thread.findFirst({
      where: { id: threadId, userId: session.user.id },
    });

    if (!thread) {
      throw new ApiError(404, 'thread_not_found', 'Thread not found');
    }

    // Verify activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new ApiError(404, 'activity_not_found', 'Activity not found');
    }

    // Create link (or ignore if already exists due to unique constraint)
    const threadActivity = await prisma.threadActivity.upsert({
      where: {
        threadId_activityId: {
          threadId,
          activityId,
        },
      },
      create: {
        threadId,
        activityId,
      },
      update: {},
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            type: true,
            category: true,
          },
        },
      },
    });

    console.log(`[threads:activities:POST] Linked activity ${activityId} to thread ${threadId}`);

    return NextResponse.json({ threadActivity }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'api/threads/[id]/activities:POST');
  }
}

// DELETE - Unlink an activity from a thread
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');
    const activityId = searchParams.get('activityId');

    if (!threadId || !activityId) {
      throw new ApiError(400, 'missing_ids', 'threadId and activityId are required');
    }

    // Verify thread belongs to user
    const thread = await prisma.thread.findFirst({
      where: { id: threadId, userId: session.user.id },
    });

    if (!thread) {
      throw new ApiError(404, 'thread_not_found', 'Thread not found');
    }

    // Delete the link
    await prisma.threadActivity.delete({
      where: {
        threadId_activityId: {
          threadId,
          activityId,
        },
      },
    });

    console.log(`[threads:activities:DELETE] Unlinked activity ${activityId} from thread ${threadId}`);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return handleApiError(error, 'api/threads/[id]/activities:DELETE');
  }
}
