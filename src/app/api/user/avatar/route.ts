import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  isValidAvatarId,
  isValidColorId,
  DEFAULT_AVATAR,
  DEFAULT_COLOR,
} from '@/lib/avatar-constants';

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
    console.error('[Avatar] Error fetching avatar:', error);
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 });
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
    const body = await req.json();
    const { avatar, avatarColor } = body;

    // Validate avatar
    if (avatar !== undefined) {
      if (typeof avatar !== 'string') {
        return NextResponse.json({ error: 'Invalid avatar type' }, { status: 400 });
      }
      if (!isValidAvatarId(avatar)) {
        return NextResponse.json({ error: 'Invalid avatar id' }, { status: 400 });
      }
    }

    // Validate color
    if (avatarColor !== undefined) {
      if (typeof avatarColor !== 'string') {
        return NextResponse.json({ error: 'Invalid avatarColor type' }, { status: 400 });
      }
      if (!isValidColorId(avatarColor)) {
        return NextResponse.json({ error: 'Invalid avatarColor id' }, { status: 400 });
      }
    }

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
    console.error('[Avatar] Error updating avatar:', error);
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
  }
}
