import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

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
        const { activityId, assignmentId, selectedPromptIds, solo, speaking } = body;

        // Validate required fields
        if (!activityId || !selectedPromptIds || !solo || !speaking) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create submission record
        const assignmentKey = typeof assignmentId === "string" ? assignmentId : null;
        const submissionWhere = {
            userId: user.id,
            activityId,
            assignmentId: assignmentKey,
        };
        const existingSubmission = await prisma.speakingSubmission.findFirst({
            where: submissionWhere,
        });

        const submissionPayload = {
            ...submissionWhere,
            selectedPromptIds,
            soloSentences: solo.sentences,
            soloFollowUpQuestions: solo.followUpQuestions,
            soloCompletedStepIds: solo.completedStepIds,
            speakingBestSentence: speaking.bestSentence,
            speakingCompletedStepIds: speaking.completedStepIds,
            submittedAt: new Date(),
            status: 'submitted',
        };

        const submission = existingSubmission
            ? await prisma.speakingSubmission.update({
                  where: { id: existingSubmission.id },
                  data: submissionPayload,
              })
            : await prisma.speakingSubmission.create({
                  data: submissionPayload,
              });

        // Update activity progress
        const progressWhere = {
            userId: user.id,
            activityId,
            assignmentId: assignmentKey,
        };
        const existingProgress = await prisma.activityProgress.findFirst({
            where: progressWhere,
        });

        if (existingProgress) {
            await prisma.activityProgress.update({
                where: { id: existingProgress.id },
                data: {
                    progress: 100,
                    status: 'submitted',
                    updatedAt: new Date(),
                },
            });
        } else {
            await prisma.activityProgress.create({
                data: {
                    ...progressWhere,
                    progress: 100,
                    status: 'submitted',
                },
            });
        }

        return NextResponse.json({ success: true, submission });
    } catch (error) {
        console.error('Error submitting speaking warm-up:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get('activityId');
        const assignmentId = searchParams.get('assignmentId');

        if (!activityId) {
            return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
        }

        const submission = await prisma.speakingSubmission.findFirst({
            where: {
                userId: user.id,
                activityId,
                assignmentId: assignmentId ?? null,
            },
        });

        if (!submission) {
            return NextResponse.json({ submission: null });
        }

        // Transform to match frontend interface
        const transformedSubmission = {
            activityId: submission.activityId,
            assignmentId: submission.assignmentId,
            userId: submission.userId,
            selectedPromptIds: submission.selectedPromptIds,
            solo: {
                sentences: submission.soloSentences as [string, string, string],
                followUpQuestions: submission.soloFollowUpQuestions as [string, string],
                completedStepIds: submission.soloCompletedStepIds,
            },
            speaking: {
                bestSentence: submission.speakingBestSentence,
                completedStepIds: submission.speakingCompletedStepIds,
            },
            submittedAt: submission.submittedAt.toISOString(),
            status: submission.status as 'submitted',
        };

        return NextResponse.json({ submission: transformedSubmission });
    } catch (error) {
        console.error('Error fetching speaking submission:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
