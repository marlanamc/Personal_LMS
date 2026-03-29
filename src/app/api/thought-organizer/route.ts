import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';
import { normalizeOrganization, type ThoughtOrganizerStore } from '@/lib/thought-organization';

const SUBJECT_KEY = 'thought-organizer';

function normalizeOrganizerStore(raw: unknown): ThoughtOrganizerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { bullets: [], projects: [] };
  }

  const candidate = raw as { bullets?: unknown; projects?: unknown };
  const normalized = normalizeOrganization({
    bullets: Array.isArray(candidate.bullets) ? candidate.bullets : [],
    projects: Array.isArray(candidate.projects) ? candidate.projects : [],
  } as any);

  return {
    bullets: normalized?.bullets || [],
    projects: normalized?.projects || [],
  };
}

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

    const store = row?.checklist ? normalizeOrganizerStore(row.checklist) : { bullets: [], projects: [] };

    return NextResponse.json({
      store,
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    return handleApiError(error, 'api/thought-organizer:GET');
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { store?: unknown };
    const incomingStore = normalizeOrganizerStore(body.store);

    // Full replacement strategy (simpler than calendar-planner merge)
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
        checklist: incomingStore as unknown as Prisma.InputJsonValue,
        links: [] as Prisma.InputJsonValue,
      },
      update: {
        checklist: incomingStore as unknown as Prisma.InputJsonValue,
      },
      select: {
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
  } catch (error) {
    return handleApiError(error, 'api/thought-organizer:POST');
  }
}
