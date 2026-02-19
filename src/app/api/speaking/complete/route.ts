import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { awardPoints, updateStreak, checkAndAwardAchievements } from '@/lib/gamification';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { username: session.user.username || '' },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { activityId, assignmentId } = body;

        // Validate required fields
        if (!activityId) {
            return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
        }

        // Get activity content to check if it's a warmup (optional validation)
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { content: true },
        });

        // Check if this is a warmup activity (parse content to verify)
        let isWarmup = false;
        let participationPoints = 3; // Default

        if (activity?.content) {
            try {
                const content = JSON.parse(activity.content);
                if (content.type === 'speaking' && content.warmupMode) {
                    isWarmup = true;
                    participationPoints = content.participationPoints || 3;
                }
            } catch (e) {
                // Content parsing failed, assume not warmup
            }
        }

        if (!isWarmup) {
            return NextResponse.json({ error: 'Activity is not a warmup activity' }, { status: 400 });
        }

        const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;

        // Check if already completed to prevent duplicate awards
        const existingProgress = await prisma.activityProgress.findFirst({
            where: {
                userId: user.id,
                activityId,
                assignmentId: assignmentKey,
            },
        });

        if (existingProgress?.status === 'completed') {
            return NextResponse.json({
                success: true,
                alreadyCompleted: true,
                message: 'Activity already completed'
            });
        }

        // Update ActivityProgress to completed
        const progressData = {
            userId: user.id,
            activityId,
            assignmentId: assignmentKey,
            progress: 100,
            status: 'completed' as const,
            updatedAt: new Date(),
        };

        if (existingProgress) {
            await prisma.activityProgress.update({
                where: { id: existingProgress.id },
                data: progressData,
            });
        } else {
            await prisma.activityProgress.create({
                data: progressData,
            });
        }

        // Award participation points - get activity title for better display
        const activityWithTitle = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { title: true },
        });
        const activityTitle = activityWithTitle?.title || activityId;
        const updatedUser = await awardPoints(
            user.id,
            participationPoints,
            `${activityTitle}|Warmup`
        );

        // Update streak (awards streak bonuses automatically)
        const streakResult = await updateStreak(user.id, participationPoints);

        // Check for new achievements
        const newAchievements = await checkAndAwardAchievements(user.id);

        return NextResponse.json({
            success: true,
            pointsAwarded: participationPoints,
            streakUpdated: streakResult.streakUpdated,
            streakBonus: streakResult.pointsAwarded,
            newAchievements: newAchievements.length,
            totalPoints: updatedUser.points,
            currentStreak: updatedUser.currentStreak,
        });
    } catch (error) {
        console.error('Error completing warmup activity:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
