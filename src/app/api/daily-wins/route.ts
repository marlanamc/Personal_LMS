import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';
import { z } from 'zod';

const MAX_TEXT_LEN = 500;

const dailyWinSchema = z.object({
  text: z.string().trim().min(1, 'Text is required').max(MAX_TEXT_LEN, `Text must be at most ${MAX_TEXT_LEN} characters`),
});

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

    const { text } = dailyWinSchema.parse(await req.json());

    const win = await prisma.dailyWin.create({
      data: {
        userId: session.user.id,
        text,
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
