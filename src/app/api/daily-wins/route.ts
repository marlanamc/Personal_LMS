import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { addDays, startOfWeek } from 'date-fns';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiError } from '@/lib/api-error';

const MAX_TEXT_LEN = 500;

function getCurrentWeekRangeUtc(): { gte: Date; lt: Date } {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEndExclusive = addDays(weekStart, 7);
  return { gte: weekStart, lt: weekEndExclusive };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { gte, lt } = getCurrentWeekRangeUtc();

    const wins = await prisma.dailyWin.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte,
          lt,
        },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ wins, weekStart: gte.toISOString(), weekEndExclusive: lt.toISOString() });
  } catch (error) {
    return handleApiError(error, 'api/daily-wins:GET');
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { text?: unknown };
    const textRaw = typeof body.text === 'string' ? body.text.trim() : '';
    if (!textRaw) {
      throw new ApiError(400, 'validation_error', 'Text is required');
    }
    if (textRaw.length > MAX_TEXT_LEN) {
      throw new ApiError(400, 'validation_error', `Text must be at most ${MAX_TEXT_LEN} characters`);
    }

    const win = await prisma.dailyWin.create({
      data: {
        userId: session.user.id,
        text: textRaw,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ win }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'api/daily-wins:POST');
  }
}
