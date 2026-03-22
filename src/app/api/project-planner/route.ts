import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';
import { normalizeProjectPlannerStore } from '@/lib/project-planner';

const SUBJECT_KEY = 'project-planner';

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
          subjectKey: SUBJECT_KEY,
        },
      },
      select: {
        checklist: true,
        updatedAt: true,
      },
    });

    const store = normalizeProjectPlannerStore(row?.checklist ?? null);

    return NextResponse.json({
      store,
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    return handleApiError(error, 'api/project-planner:GET');
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { store?: unknown };
    const store = normalizeProjectPlannerStore(body?.store);

    const payload = store as unknown as Prisma.InputJsonValue;

    const state = await prisma.utilitySubjectState.upsert({
      where: {
        userId_subjectKey: {
          userId: session.user.id,
          subjectKey: SUBJECT_KEY,
        },
      },
      create: {
        userId: session.user.id,
        subjectKey: SUBJECT_KEY,
        checklist: payload,
        links: [] as Prisma.InputJsonValue,
      },
      update: {
        checklist: payload,
      },
      select: {
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
  } catch (error) {
    return handleApiError(error, 'api/project-planner:POST');
  }
}
