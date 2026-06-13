import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error';
import { storeEnvelopeSchema } from '@/lib/validation/common';
import { normalizeOrganization, type ThoughtOrganization } from '@/lib/thought-organization';
import type { RecentCapture } from '@/types/workspace';

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
  tagMeta?: JournalTagMeta;
};

type CustomTag = {
  id: string;
  label: string;
  color: 'peach' | 'sky' | 'mint' | 'periwinkle' | 'lavender' | 'rose' | 'coral' | 'sage' | 'blush' | 'slate';
};

type JournalTagMeta = {
  id: string;
  label: string;
  color: CustomTag['color'];
};

type DayPlan = {
  notes: string;
  tasks: PlannerTask[];
  thoughtDownload?: string;
  thoughtOrganization?: ThoughtOrganization;
  interstitialJournalEntries?: InterstitialJournalEntry[];
  acknowledgements?: {
    boundaries: string[];
    events: string[];
    sessions: string[];
    plans: string[];
    notices: string[];
  };
};

type PlannerStore = Record<string, DayPlan> & {
  _customTags?: CustomTag[];
};

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
  const candidate = raw as { id?: unknown; text?: unknown; createdAt?: unknown; tag?: unknown; tagMeta?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';
  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';
  if (!id || !text || !createdAt) return null;
  const tag = typeof candidate.tag === 'string' && candidate.tag.trim() ? candidate.tag.trim() : undefined;
  const rawTagMeta =
    candidate.tagMeta && typeof candidate.tagMeta === 'object' && !Array.isArray(candidate.tagMeta)
      ? (candidate.tagMeta as { id?: unknown; label?: unknown; color?: unknown })
      : null;
  const tagMeta =
    rawTagMeta &&
    typeof rawTagMeta.id === 'string' &&
    typeof rawTagMeta.label === 'string' &&
    typeof rawTagMeta.color === 'string' &&
    ['peach', 'sky', 'mint', 'periwinkle', 'lavender', 'rose', 'coral', 'sage', 'blush', 'slate'].includes(rawTagMeta.color)
      ? {
          id: rawTagMeta.id,
          label: rawTagMeta.label,
          color: rawTagMeta.color as JournalTagMeta['color'],
        }
      : undefined;
  return { id, text, createdAt, tag, tagMeta };
}

function normalizeCustomTag(raw: unknown): CustomTag | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const candidate = raw as { id?: unknown; label?: unknown; color?: unknown };
  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const label = typeof candidate.label === 'string' ? candidate.label.trim() : '';
  const color = typeof candidate.color === 'string' ? candidate.color : '';
  if (!id || !label) return null;
  if (!['peach', 'sky', 'mint', 'periwinkle', 'lavender', 'rose', 'coral', 'sage', 'blush', 'slate'].includes(color)) {
    return null;
  }
  return { id, label, color: color as CustomTag['color'] };
}

function normalizeDayPlan(raw: unknown): DayPlan {
  if (!raw || typeof raw !== 'object') {
    return {
      notes: '',
      tasks: [],
      thoughtDownload: '',
      thoughtOrganization: undefined,
      interstitialJournalEntries: [],
      acknowledgements: { boundaries: [], events: [], sessions: [], plans: [], notices: [] },
    };
  }
  const candidate = raw as {
    notes?: unknown;
    tasks?: unknown;
    thoughtDownload?: unknown;
    thoughtOrganization?: unknown;
    interstitialJournalEntries?: unknown;
    acknowledgements?: unknown;
  };
  const notes = typeof candidate.notes === 'string' ? candidate.notes : '';
  const tasks = Array.isArray(candidate.tasks)
    ? candidate.tasks.map(normalizePlannerTask).filter((t): t is PlannerTask => t !== null)
    : [];
  const thoughtDownload = typeof candidate.thoughtDownload === 'string' ? candidate.thoughtDownload : '';
  const thoughtOrganization = normalizeOrganization(candidate.thoughtOrganization as ThoughtOrganization | undefined);
  const interstitialJournalEntries = Array.isArray(candidate.interstitialJournalEntries)
    ? candidate.interstitialJournalEntries
        .map(normalizeInterstitialJournalEntry)
        .filter((entry): entry is InterstitialJournalEntry => entry !== null)
    : [];
  const rawAck =
    candidate.acknowledgements &&
    typeof candidate.acknowledgements === 'object' &&
    !Array.isArray(candidate.acknowledgements)
      ? (candidate.acknowledgements as { boundaries?: unknown; events?: unknown; sessions?: unknown; plans?: unknown; notices?: unknown })
      : null;
  const acknowledgements = {
    boundaries: Array.isArray(rawAck?.boundaries) ? rawAck.boundaries.filter((id): id is string => typeof id === 'string') : [],
    events: Array.isArray(rawAck?.events) ? rawAck.events.filter((id): id is string => typeof id === 'string') : [],
    sessions: Array.isArray(rawAck?.sessions) ? rawAck.sessions.filter((id): id is string => typeof id === 'string') : [],
    plans: Array.isArray(rawAck?.plans) ? rawAck.plans.filter((id): id is string => typeof id === 'string') : [],
    notices: Array.isArray(rawAck?.notices) ? rawAck.notices.filter((id): id is string => typeof id === 'string') : [],
  };
  return { notes, tasks, thoughtDownload, thoughtOrganization, interstitialJournalEntries, acknowledgements };
}

function normalizePlannerStore(raw: unknown): PlannerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const source = raw as Record<string, unknown>;
  const store: PlannerStore = {};
  const customTags = Array.isArray(source._customTags)
    ? source._customTags.map(normalizeCustomTag).filter((tag): tag is CustomTag => tag !== null)
    : [];
  if (customTags.length > 0) {
    store._customTags = customTags;
  }
  for (const [key, value] of Object.entries(source)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    const plan = normalizeDayPlan(value);
    const hasThoughtDownload = typeof plan.thoughtDownload === 'string' && plan.thoughtDownload.trim() !== '';
    const hasThoughtOrganization = plan.thoughtOrganization && plan.thoughtOrganization.bullets.length > 0;
    const hasInterstitialJournalEntries = (plan.interstitialJournalEntries?.length ?? 0) > 0;
    const hasAcknowledgements =
      (plan.acknowledgements?.boundaries.length ?? 0) > 0 ||
      (plan.acknowledgements?.events.length ?? 0) > 0 ||
      (plan.acknowledgements?.sessions.length ?? 0) > 0 ||
      (plan.acknowledgements?.plans.length ?? 0) > 0 ||
      (plan.acknowledgements?.notices.length ?? 0) > 0;
    if (plan.notes || plan.tasks.length > 0 || hasThoughtDownload || hasThoughtOrganization || hasInterstitialJournalEntries || hasAcknowledgements) {
      store[key] = plan;
    }
  }
  return store;
}

function isPlanEmpty(plan: DayPlan): boolean {
  const hasThoughtDownload =
    typeof plan.thoughtDownload === 'string' && plan.thoughtDownload.trim() !== '';
  const hasThoughtOrganization = plan.thoughtOrganization && plan.thoughtOrganization.bullets.length > 0;
  const hasInterstitialJournalEntries = (plan.interstitialJournalEntries?.length ?? 0) > 0;
  const hasAcknowledgements =
    (plan.acknowledgements?.boundaries.length ?? 0) > 0 ||
    (plan.acknowledgements?.events.length ?? 0) > 0 ||
    (plan.acknowledgements?.sessions.length ?? 0) > 0 ||
    (plan.acknowledgements?.plans.length ?? 0) > 0 ||
    (plan.acknowledgements?.notices.length ?? 0) > 0;
  return !plan.notes && plan.tasks.length === 0 && !hasThoughtDownload && !hasThoughtOrganization && !hasInterstitialJournalEntries && !hasAcknowledgements;
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

    const { store: rawStore } = storeEnvelopeSchema.parse(await req.json());
    const incomingStore =
      rawStore && typeof rawStore === 'object' && !Array.isArray(rawStore)
        ? (rawStore as Record<string, unknown>)
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
      if (key === '_customTags') {
        const normalizedCustomTags = Array.isArray(value)
          ? value.map(normalizeCustomTag).filter((tag): tag is CustomTag => tag !== null)
          : [];
        if (normalizedCustomTags.length > 0) {
          mergedStore._customTags = normalizedCustomTags;
        } else {
          delete mergedStore._customTags;
        }
        continue;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
      
      const existingPlan = mergedStore[key] || {
        notes: '',
        tasks: [],
        thoughtDownload: '',
        thoughtOrganization: undefined,
        interstitialJournalEntries: [],
        acknowledgements: { boundaries: [], events: [], sessions: [], plans: [], notices: [] },
      };
      const rawIncoming = value as Record<string, unknown>;
      const rawAck =
        rawIncoming.acknowledgements &&
        typeof rawIncoming.acknowledgements === 'object' &&
        !Array.isArray(rawIncoming.acknowledgements)
          ? (rawIncoming.acknowledgements as { boundaries?: unknown; events?: unknown; sessions?: unknown; plans?: unknown; notices?: unknown })
          : null;

      // Merge only if the field is present in the incoming data
      const newPlan: DayPlan = {
        notes: typeof rawIncoming.notes === 'string' ? rawIncoming.notes : existingPlan.notes,
        tasks: Array.isArray(rawIncoming.tasks)
          ? rawIncoming.tasks.map(normalizePlannerTask).filter((t): t is PlannerTask => t !== null)
          : existingPlan.tasks,
        thoughtDownload: typeof rawIncoming.thoughtDownload === 'string'
          ? rawIncoming.thoughtDownload
          : existingPlan.thoughtDownload,
        thoughtOrganization: rawIncoming.thoughtOrganization !== undefined
          ? normalizeOrganization(rawIncoming.thoughtOrganization as ThoughtOrganization | undefined)
          : existingPlan.thoughtOrganization,
        interstitialJournalEntries: Array.isArray(rawIncoming.interstitialJournalEntries)
          ? rawIncoming.interstitialJournalEntries
              .map(normalizeInterstitialJournalEntry)
              .filter((entry): entry is InterstitialJournalEntry => entry !== null)
          : existingPlan.interstitialJournalEntries,
        acknowledgements: rawIncoming.acknowledgements !== undefined
          ? {
              boundaries: Array.isArray(rawAck?.boundaries)
                ? rawAck.boundaries.filter((id): id is string => typeof id === 'string')
                : [],
              events: Array.isArray(rawAck?.events)
                ? rawAck.events.filter((id): id is string => typeof id === 'string')
                : [],
              sessions: Array.isArray(rawAck?.sessions)
                ? rawAck.sessions.filter((id): id is string => typeof id === 'string')
                : [],
              plans: Array.isArray(rawAck?.plans)
                ? rawAck.plans.filter((id): id is string => typeof id === 'string')
                : [],
              notices: Array.isArray(rawAck?.notices)
                ? rawAck.notices.filter((id): id is string => typeof id === 'string')
                : [],
            }
          : existingPlan.acknowledgements,
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

    // Track workspace context for recent changes
    try {
      // Find the most recently updated date key
      const dateKeys = Object.keys(incomingStore).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
      if (dateKeys.length > 0) {
        const mostRecentDateKey = dateKeys[0]; // Usually only one date is updated at a time
        const dayPlan = mergedStore[mostRecentDateKey];

        if (dayPlan) {
          // Determine which tool was used based on what was updated
          let lastTool: 'thought-download' | 'moment-log' | null = null;
          let preview = '';

          if (typeof dayPlan.thoughtDownload === 'string' && dayPlan.thoughtDownload.trim()) {
            lastTool = 'thought-download';
            preview = dayPlan.thoughtDownload.slice(0, 100);
          } else if (dayPlan.interstitialJournalEntries && dayPlan.interstitialJournalEntries.length > 0) {
            lastTool = 'moment-log';
            const lastEntry = dayPlan.interstitialJournalEntries[dayPlan.interstitialJournalEntries.length - 1];
            preview = lastEntry.text.slice(0, 100);
          }

          if (lastTool) {
            // Get existing context to preserve recentCaptures
            const existingContext = await prisma.workspaceContext.findUnique({
              where: { userId: session.user.id },
            });

            const existingCaptures = (existingContext?.recentCaptures as RecentCapture[] | null) || [];

            // Add new capture to the beginning, limit to 20 most recent
            const newCapture = {
              type: lastTool,
              dateKey: mostRecentDateKey,
              preview,
              timestamp: new Date().toISOString(),
            };

            const updatedCaptures = [newCapture, ...existingCaptures].slice(0, 20);

            await prisma.workspaceContext.upsert({
              where: { userId: session.user.id },
              create: {
                userId: session.user.id,
                lastTool,
                lastDateKey: mostRecentDateKey,
                lastProjectId: null,
                recentCaptures: updatedCaptures as unknown as Prisma.InputJsonValue,
              },
              update: {
                lastTool,
                lastDateKey: mostRecentDateKey,
                recentCaptures: updatedCaptures as unknown as Prisma.InputJsonValue,
              },
            });
          }
        }
      }
    } catch (contextError) {
      // Don't fail the whole request if context tracking fails
      console.error('[calendar-planner] Failed to update workspace context:', contextError);
    }

    return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
  } catch (error) {
    return handleApiError(error, 'api/calendar-planner:POST');
  }
}
