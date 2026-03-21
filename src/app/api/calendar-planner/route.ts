import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';

const SUBJECT_KEY = 'calendar-planner';

type PlannerTask = {
  id: string;
  text: string;
  done: boolean;
};

type InterstitialJournalEntry = {
  id: string;
  text: string;
  createdAt: string;
  tag?: string;
};

type DayPlan = {
  notes: string;
  tasks: PlannerTask[];
  thoughtDownload?: string;
  interstitialJournalEntries?: InterstitialJournalEntry[];
};

type PlannerStore = Record<string, DayPlan>;

function normalizePlannerTask(raw: unknown): PlannerTask | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as { id?: unknown; text?: unknown; done?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text : '';
  if (!id || !text) return null;
  return { id, text, done: candidate.done === true };
}

function normalizeInterstitialJournalEntry(raw: unknown): InterstitialJournalEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as { id?: unknown; text?: unknown; createdAt?: unknown; tag?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';
  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';
  if (!id || !text || !createdAt) return null;
  const tag = typeof candidate.tag === 'string' && candidate.tag.trim() ? candidate.tag.trim() : undefined;
  return { id, text, createdAt, tag };
}

function normalizeDayPlan(raw: unknown): DayPlan {
  if (!raw || typeof raw !== 'object') return { notes: '', tasks: [], thoughtDownload: '', interstitialJournalEntries: [] };
  const candidate = raw as {
    notes?: unknown;
    tasks?: unknown;
    thoughtDownload?: unknown;
    interstitialJournalEntries?: unknown;
  };
  const notes = typeof candidate.notes === 'string' ? candidate.notes : '';
  const tasks = Array.isArray(candidate.tasks)
    ? candidate.tasks.map(normalizePlannerTask).filter((t): t is PlannerTask => t !== null)
    : [];
  const thoughtDownload = typeof candidate.thoughtDownload === 'string' ? candidate.thoughtDownload : '';
  const interstitialJournalEntries = Array.isArray(candidate.interstitialJournalEntries)
    ? candidate.interstitialJournalEntries
        .map(normalizeInterstitialJournalEntry)
        .filter((entry): entry is InterstitialJournalEntry => entry !== null)
    : [];
  return { notes, tasks, thoughtDownload, interstitialJournalEntries };
}

function normalizePlannerStore(raw: unknown): PlannerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const source = raw as Record<string, unknown>;
  const store: PlannerStore = {};
  for (const [key, value] of Object.entries(source)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    const plan = normalizeDayPlan(value);
    const hasThoughtDownload = typeof plan.thoughtDownload === 'string' && plan.thoughtDownload.trim() !== '';
    const hasInterstitialJournalEntries = (plan.interstitialJournalEntries?.length ?? 0) > 0;
    if (plan.notes || plan.tasks.length > 0 || hasThoughtDownload || hasInterstitialJournalEntries) {
      store[key] = plan;
    }
  }
  return store;
}

function isPlanEmpty(plan: DayPlan): boolean {
  const hasThoughtDownload =
    typeof plan.thoughtDownload === 'string' && plan.thoughtDownload.trim() !== '';
  const hasInterstitialJournalEntries = (plan.interstitialJournalEntries?.length ?? 0) > 0;
  return !plan.notes && plan.tasks.length === 0 && !hasThoughtDownload && !hasInterstitialJournalEntries;
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

    const store = row?.checklist ? normalizePlannerStore(row.checklist) : null;

    return NextResponse.json({
      store,
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    return handleApiError(error, 'api/calendar-planner:GET');
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { store?: unknown };
    const incomingStore =
      body?.store && typeof body.store === 'object' && !Array.isArray(body.store)
        ? (body.store as Record<string, unknown>)
        : {};

    const existingState = await prisma.utilitySubjectState.findUnique({
      where: {
        userId_subjectKey: {
          userId: session.user.id,
          subjectKey: SUBJECT_KEY,
        },
      },
      select: {
        checklist: true,
      },
    });

    const mergedStore = existingState?.checklist
      ? normalizePlannerStore(existingState.checklist)
      : {};

    for (const [key, value] of Object.entries(incomingStore)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
      
      const existingPlan = mergedStore[key] || { notes: '', tasks: [], thoughtDownload: '', interstitialJournalEntries: [] };
      const rawIncoming = value as Record<string, unknown>;
      
      // Merge only if the field is present in the incoming data
      const newPlan: DayPlan = {
        notes: typeof rawIncoming.notes === 'string' ? rawIncoming.notes : existingPlan.notes,
        tasks: Array.isArray(rawIncoming.tasks) 
          ? rawIncoming.tasks.map(normalizePlannerTask).filter((t): t is PlannerTask => t !== null) 
          : existingPlan.tasks,
        thoughtDownload: typeof rawIncoming.thoughtDownload === 'string' 
          ? rawIncoming.thoughtDownload 
          : existingPlan.thoughtDownload,
        interstitialJournalEntries: Array.isArray(rawIncoming.interstitialJournalEntries)
          ? rawIncoming.interstitialJournalEntries
              .map(normalizeInterstitialJournalEntry)
              .filter((entry): entry is InterstitialJournalEntry => entry !== null)
          : existingPlan.interstitialJournalEntries,
      };

      if (isPlanEmpty(newPlan)) {
        delete mergedStore[key];
      } else {
        mergedStore[key] = newPlan;
      }
    }

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
        checklist: mergedStore as unknown as Prisma.InputJsonValue,
        links: [] as Prisma.InputJsonValue,
      },
      update: {
        checklist: mergedStore as unknown as Prisma.InputJsonValue,
      },
      select: {
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
  } catch (error) {
    return handleApiError(error, 'api/calendar-planner:POST');
  }
}
