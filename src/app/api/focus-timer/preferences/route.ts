import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { preferencesEnvelopeSchema } from "@/lib/validation/common";

const SUBJECT_KEY = "focus-timer-preferences";

type FocusTaskItem = {
  id: string;
  text: string;
  done: boolean;
  source: "manual" | "assignment";
  sourceId?: string;
  href?: string;
  activityType?: string;
};

type WeekWindowMode = "calendar-week" | "last-7-days";

export type FocusTimerPreferencesPayload = {
  tasks?: FocusTaskItem[];
  sessionNotes?: string;
  weekWindowMode?: WeekWindowMode;
};

function normalizeTask(raw: unknown): FocusTaskItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : "";
  const text = typeof o.text === "string" ? o.text : "";
  const done = o.done === true;
  const source = o.source === "manual" || o.source === "assignment" ? o.source : "manual";
  if (!id || !text) return null;
  return {
    id,
    text,
    done,
    source,
    ...(typeof o.sourceId === "string" ? { sourceId: o.sourceId } : {}),
    ...(typeof o.href === "string" ? { href: o.href } : {}),
    ...(typeof o.activityType === "string" ? { activityType: o.activityType } : {}),
  };
}

function normalizePreferences(raw: unknown): FocusTimerPreferencesPayload {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const tasks = Array.isArray(o.tasks)
    ? o.tasks.map(normalizeTask).filter((t): t is FocusTaskItem => t !== null)
    : undefined;
  const sessionNotes = typeof o.sessionNotes === "string" ? o.sessionNotes : undefined;
  const weekWindowMode =
    o.weekWindowMode === "calendar-week" || o.weekWindowMode === "last-7-days" ? o.weekWindowMode : undefined;

  return {
    ...(tasks !== undefined ? { tasks } : {}),
    ...(sessionNotes !== undefined ? { sessionNotes } : {}),
    ...(weekWindowMode !== undefined ? { weekWindowMode } : {}),
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const preferences = row?.checklist ? normalizePreferences(row.checklist) : {};

    return NextResponse.json({
      preferences,
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    return handleApiError(error, "api/focus-timer/preferences:GET");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { preferences: rawPreferences } = preferencesEnvelopeSchema.parse(await req.json());
    const normalized = normalizePreferences(rawPreferences);

    const payload = normalized as unknown as Prisma.InputJsonValue;

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error, "api/focus-timer/preferences:POST");
  }
}
