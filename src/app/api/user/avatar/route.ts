import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';
import {
  isValidAvatarId,
  isValidColorId,
  DEFAULT_AVATAR,
  DEFAULT_COLOR,
} from '@/lib/avatar-constants';
import { z } from 'zod';

const avatarUpdateSchema = z.object({
  avatar: z.string().refine(isValidAvatarId, 'Invalid avatar id').optional(),
  avatarColor: z.string().refine(isValidColorId, 'Invalid avatarColor id').optional(),
});

/**
 * GET /api/user/avatar
 * Get the current user's avatar settings
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatar: true,
        avatarColor: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      avatar: user.avatar || DEFAULT_AVATAR,
      avatarColor: user.avatarColor || DEFAULT_COLOR,
    });
  } catch (error) {
    return handleApiError(error, 'api/user/avatar:GET');
  }
}

/**
 * POST /api/user/avatar
 * Update the current user's avatar settings
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { avatar, avatarColor } = avatarUpdateSchema.parse(await req.json());

    const updateData: { avatar?: string; avatarColor?: string } = {};
    if (avatar !== undefined) updateData.avatar = avatar;
    if (avatarColor !== undefined) updateData.avatarColor = avatarColor;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        avatar: true,
        avatarColor: true,
      },
    });

    return NextResponse.json({
      avatar: user.avatar || DEFAULT_AVATAR,
      avatarColor: user.avatarColor || DEFAULT_COLOR,
    });
  } catch (error) {
    return handleApiError(error, 'api/user/avatar:POST');
  }
}
