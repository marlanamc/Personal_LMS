import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiError } from '@/lib/api-error';

const MAX_TEXT_LEN = 500;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const wins = await prisma.dailyWin.findMany({
      where: {
        userId: userId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ wins });
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
