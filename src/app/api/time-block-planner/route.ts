import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';
import {
  TIME_BLOCK_PLANNER_SUBJECT_KEY,
  normalizeTimeBlockPlannerStore,
  plannerStoreToJson,
} from '@/lib/time-block-planner';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const row = await prisma.utilitySubjectState.findUnique({
      where: {
        userId_subjectKey: {
          userId: session.user.id,
          subjectKey: TIME_BLOCK_PLANNER_SUBJECT_KEY,
        },
      },
      select: {
        checklist: true,
        updatedAt: true,
      },
    });

    const store = row?.checklist ? normalizeTimeBlockPlannerStore(row.checklist) : null;

    return NextResponse.json({
      store,
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    return handleApiError(error, 'api/time-block-planner:GET');
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { store?: unknown };
    const normalizedStore = normalizeTimeBlockPlannerStore(body?.store);

    const state = await prisma.utilitySubjectState.upsert({
      where: {
        userId_subjectKey: {
          userId: session.user.id,
          subjectKey: TIME_BLOCK_PLANNER_SUBJECT_KEY,
        },
      },
      create: {
        userId: session.user.id,
        subjectKey: TIME_BLOCK_PLANNER_SUBJECT_KEY,
        checklist: plannerStoreToJson(normalizedStore),
        links: [],
      },
      update: {
        checklist: plannerStoreToJson(normalizedStore),
      },
      select: {
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
  } catch (error) {
    return handleApiError(error, 'api/time-block-planner:POST');
  }
}
