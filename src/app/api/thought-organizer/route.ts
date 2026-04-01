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

    // Track workspace context
    try {
      // Find the most recently edited project (if any)
      const projects = incomingStore.projects || [];
      const bullets = incomingStore.bullets || [];

      if (projects.length > 0 || bullets.length > 0) {
        // Find a project with bullets or use the first project
        const activeProject = projects.find(p => bullets.some(b => b.project === p.id)) || projects[0];
        const projectBullets = bullets.filter(b => b.project === activeProject?.id);

        const preview = projectBullets.length > 0
          ? projectBullets[0].text.slice(0, 100)
          : 'Organizing thoughts...';

        // Get existing context to preserve recentCaptures
        const existingContext = await prisma.workspaceContext.findUnique({
          where: { userId: session.user.id },
        });

        const existingCaptures = (existingContext?.recentCaptures as any[]) || [];

        // Add new capture to the beginning, limit to 20 most recent
        const newCapture = {
          type: 'organize',
          projectId: activeProject?.id,
          preview,
          timestamp: new Date().toISOString(),
        };

        const updatedCaptures = [newCapture, ...existingCaptures].slice(0, 20);

        await prisma.workspaceContext.upsert({
          where: { userId: session.user.id },
          create: {
            userId: session.user.id,
            lastTool: 'organize',
            lastDateKey: null,
            lastProjectId: activeProject?.id || null,
            recentCaptures: updatedCaptures as unknown as Prisma.InputJsonValue,
          },
          update: {
            lastTool: 'organize',
            lastProjectId: activeProject?.id || null,
            recentCaptures: updatedCaptures as unknown as Prisma.InputJsonValue,
          },
        });
      }
    } catch (contextError) {
      // Don't fail the whole request if context tracking fails
      console.error('[thought-organizer] Failed to update workspace context:', contextError);
    }

    return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
  } catch (error) {
    return handleApiError(error, 'api/thought-organizer:POST');
  }
}
