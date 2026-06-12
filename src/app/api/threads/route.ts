import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiError } from '@/lib/api-error';

export type ThreadColor = 'sakura' | 'mint' | 'amethyst' | 'teal' | 'rose' | 'slate';
export type ThreadStatus = 'active' | 'resting' | 'archived';

const VALID_COLORS: ThreadColor[] = ['sakura', 'mint', 'amethyst', 'teal', 'rose', 'slate'];
const VALID_STATUSES: ThreadStatus[] = ['active', 'resting', 'archived'];

interface ThreadInput {
  title?: string;
  description?: string | null;
  emoji?: string | null;
  color?: ThreadColor;
  status?: ThreadStatus;
  order?: number;
  anchorX?: number;
  isCore?: boolean;
}

function validateThreadInput(input: ThreadInput): ThreadInput {
  const validated: ThreadInput = {};

  if (input.title !== undefined) {
    if (typeof input.title !== 'string' || input.title.trim().length === 0) {
      throw new ApiError(400, 'invalid_title', 'Title is required and must be a non-empty string');
    }
    validated.title = input.title.trim().slice(0, 100);
  }

  if (input.description !== undefined) {
    validated.description = input.description ? String(input.description).slice(0, 280) : null;
  }

  if (input.emoji !== undefined) {
    validated.emoji = input.emoji ? String(input.emoji).slice(0, 10) : null;
  }

  if (input.color !== undefined) {
    if (!VALID_COLORS.includes(input.color)) {
      throw new ApiError(400, 'invalid_color', `Color must be one of: ${VALID_COLORS.join(', ')}`);
    }
    validated.color = input.color;
  }

  if (input.status !== undefined) {
    if (!VALID_STATUSES.includes(input.status)) {
      throw new ApiError(400, 'invalid_status', `Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    validated.status = input.status;
  }

  if (input.order !== undefined) {
    validated.order = Math.max(0, Math.floor(Number(input.order) || 0));
  }

  if (input.anchorX !== undefined) {
    validated.anchorX = Math.max(0, Math.min(1, Number(input.anchorX) || 0.5));
  }

  if (input.isCore !== undefined) {
    validated.isCore = Boolean(input.isCore);
  }

  return validated;
}

// GET - Fetch all threads for user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const threads = await prisma.thread.findMany({
      where: { userId: session.user.id },
      include: {
        activities: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // active first, then resting, then archived
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error('[threads:GET] Error:', error);
    return handleApiError(error, 'api/threads:GET');
  }
}

// POST - Create a new thread
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = validateThreadInput(body);

    if (!validated.title) {
      throw new ApiError(400, 'missing_title', 'Title is required');
    }

    // Get current max order for active threads to place new thread at end
    const maxOrderThread = await prisma.thread.findFirst({
      where: { userId: session.user.id, status: 'active' },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const thread = await prisma.thread.create({
      data: {
        userId: session.user.id,
        title: validated.title,
        description: validated.description ?? null,
        emoji: validated.emoji ?? null,
        color: validated.color ?? 'sakura',
        status: 'active',
        order: (maxOrderThread?.order ?? -1) + 1,
        anchorX: validated.anchorX ?? 0.5,
        lastFocused: new Date(),
      },
    });

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'api/threads:POST');
  }
}

// PATCH - Update one or more threads
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Support bulk updates: { threads: [{ id, ...updates }] }
    // Or single update: { id, ...updates }
    const updates = body.threads ? body.threads : [body];

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new ApiError(400, 'invalid_body', 'Request body must include threads array or a single update with id');
    }

    const results = await Promise.all(
      updates.map(async (update: { id?: string } & ThreadInput) => {
        if (!update.id || typeof update.id !== 'string') {
          throw new ApiError(400, 'missing_id', 'Each update must include an id');
        }

        // Verify thread belongs to user
        const existing = await prisma.thread.findFirst({
          where: { id: update.id, userId: session.user.id },
        });

        if (!existing) {
          throw new ApiError(404, 'not_found', `Thread not found: ${update.id}`);
        }

        const validated = validateThreadInput(update);

        // Track status transitions for lastFocused/lastRested
        const statusUpdates: { lastFocused?: Date; lastRested?: Date } = {};
        if (validated.status && validated.status !== existing.status) {
          if (validated.status === 'active') {
            statusUpdates.lastFocused = new Date();
          } else if (validated.status === 'resting') {
            statusUpdates.lastRested = new Date();
          }
        }

        return prisma.thread.update({
          where: { id: update.id },
          data: {
            ...validated,
            ...statusUpdates,
          },
        });
      })
    );

    return NextResponse.json({ threads: results });
  } catch (error) {
    return handleApiError(error, 'api/threads:PATCH');
  }
}

// DELETE - Delete or archive a thread
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const archive = searchParams.get('archive') === 'true';

    if (!id) {
      throw new ApiError(400, 'missing_id', 'Thread id is required');
    }

    // Verify thread belongs to user
    const existing = await prisma.thread.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      throw new ApiError(404, 'not_found', 'Thread not found');
    }

    if (archive) {
      // Soft archive - just change status
      const thread = await prisma.thread.update({
        where: { id },
        data: { status: 'archived' },
      });
      return NextResponse.json({ thread, archived: true });
    } else {
      // Hard delete
      await prisma.thread.delete({ where: { id } });
      return NextResponse.json({ deleted: true, id });
    }
  } catch (error) {
    return handleApiError(error, 'api/threads:DELETE');
  }
}
