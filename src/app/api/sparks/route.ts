import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const SUBJECT_KEY = 'sparks';

type SavedSpark = {
  id: string;
  text: string;
  emoji?: string;
  color: 'sakura' | 'teal' | 'mint' | 'amethyst';
  createdAt: string;
  sourcePromptId?: string;
};

type MuseumItem = {
  id: string;
  title: string;
  note?: string;
  createdAt: string;
};

type SparksStore = {
  savedSparks: SavedSpark[];
  museumItems: MuseumItem[];
};

function normalizeSavedSpark(raw: unknown): SavedSpark | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as {
    id?: unknown;
    text?: unknown;
    emoji?: unknown;
    color?: unknown;
    createdAt?: unknown;
    sourcePromptId?: unknown;
  };

  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const text = typeof candidate.text === 'string' ? candidate.text.trim() : '';
  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';

  if (!id || !text || !createdAt) return null;

  const validColors = ['sakura', 'teal', 'mint', 'amethyst'];
  const color =
    typeof candidate.color === 'string' && validColors.includes(candidate.color)
      ? (candidate.color as SavedSpark['color'])
      : 'sakura';

  const emoji = typeof candidate.emoji === 'string' ? candidate.emoji : undefined;
  const sourcePromptId =
    typeof candidate.sourcePromptId === 'string' ? candidate.sourcePromptId : undefined;

  return { id, text, emoji, color, createdAt, sourcePromptId };
}

function normalizeMuseumItem(raw: unknown): MuseumItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as {
    id?: unknown;
    title?: unknown;
    note?: unknown;
    createdAt?: unknown;
  };

  const id = typeof candidate.id === 'string' ? candidate.id : '';
  const title = typeof candidate.title === 'string' ? candidate.title.trim() : '';
  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';

  if (!id || !title || !createdAt) return null;

  const note = typeof candidate.note === 'string' && candidate.note.trim() ? candidate.note.trim() : undefined;

  return { id, title, note, createdAt };
}

function normalizeSparksStore(raw: unknown): SparksStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { savedSparks: [], museumItems: [] };
  }
  const source = raw as { savedSparks?: unknown; museumItems?: unknown };

  const savedSparks = Array.isArray(source.savedSparks)
    ? source.savedSparks.map(normalizeSavedSpark).filter((s): s is SavedSpark => s !== null)
    : [];

  const museumItems = Array.isArray(source.museumItems)
    ? source.museumItems.map(normalizeMuseumItem).filter((m): m is MuseumItem => m !== null)
    : [];

  return { savedSparks, museumItems };
}

// GET /api/sparks - Load sparks store
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    const store = row?.checklist ? normalizeSparksStore(row.checklist) : { savedSparks: [], museumItems: [] };

    return NextResponse.json({ store, updatedAt: row?.updatedAt ?? null });
  } catch (error) {
    console.error('[API/sparks] Error loading sparks:', error);
    return NextResponse.json({ error: 'Failed to load sparks' }, { status: 500 });
  }
}

// POST /api/sparks - Save sparks store
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { store } = body as { store: unknown };

    const normalizedStore = normalizeSparksStore(store);

    await prisma.utilitySubjectState.upsert({
      where: {
        userId_subjectKey: {
          userId: session.user.id,
          subjectKey: SUBJECT_KEY,
        },
      },
      create: {
        userId: session.user.id,
        subjectKey: SUBJECT_KEY,
        checklist: normalizedStore as unknown as Prisma.InputJsonValue,
        links: [] as Prisma.InputJsonValue,
      },
      update: {
        checklist: normalizedStore as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API/sparks] Error saving sparks:', error);
    return NextResponse.json({ error: 'Failed to save sparks' }, { status: 500 });
  }
}
