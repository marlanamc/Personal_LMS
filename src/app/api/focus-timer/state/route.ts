import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import type { TimeBlockEntry } from "@/lib/time-block-planner";

const SUBJECT_KEY = "focus-timer-state";

type SequenceTransitionState = "idle" | "transitioning" | "paused";

export type PersistedFocusTimerState = {
  selectedMinutes?: number;
  timeLeft?: number;
  isActive?: boolean;
  endTimeMs?: number | null;
  selectedTrackId?: string;
  activeSessionLabel?: string | null;
  activeSequence?: TimeBlockEntry[] | null;
  activeSequenceIndex?: number | null;
  sequenceTransitionState?: SequenceTransitionState;
};

const VALID_TRACK_IDS = new Set([
  "deep-focus",
  "shared-focus-playlist",
  "lofi-beats",
  "brain-food",
  "intense-studying",
  "peaceful-piano",
  "focus-piano",
  "electronic-focus",
  "electronic-rising",
  "edm-mint",
  "none",
]);

function isValidTrackId(id: string): boolean {
  return typeof id === "string" && VALID_TRACK_IDS.has(id);
}

function normalizeTimeBlockEntry(raw: unknown): TimeBlockEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const kind = o.kind === "want" || o.kind === "should" ? o.kind : null;
  if (!kind) return null;
  const label = typeof o.label === "string" ? o.label : "";
  const startTime = typeof o.startTime === "string" ? o.startTime : "";
  const endTime = typeof o.endTime === "string" ? o.endTime : "";
  const startMinuteOfDay = Number(o.startMinuteOfDay);
  const endMinuteOfDay = Number(o.endMinuteOfDay);
  const durationMinutes = Number(o.durationMinutes);
  const id = typeof o.id === "string" ? o.id : "";
  if (!id || !Number.isFinite(startMinuteOfDay) || !Number.isFinite(endMinuteOfDay) || !Number.isFinite(durationMinutes)) {
    return null;
  }
  return {
    id,
    kind,
    label,
    startTime,
    endTime,
    startMinuteOfDay,
    endMinuteOfDay,
    durationMinutes,
    isTrimmed: o.isTrimmed === true,
  };
}

function normalizeState(raw: unknown): PersistedFocusTimerState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const selectedMinutes = Number(o.selectedMinutes);
  const timeLeft = Number(o.timeLeft);
  const endTimeMs = o.endTimeMs == null ? null : Number(o.endTimeMs);
  const selectedTrackId =
    typeof o.selectedTrackId === "string" && isValidTrackId(o.selectedTrackId) ? o.selectedTrackId : undefined;
  const activeSessionLabel =
    typeof o.activeSessionLabel === "string" ? o.activeSessionLabel : o.activeSessionLabel === null ? null : undefined;
  const sequenceTransitionState =
    o.sequenceTransitionState === "idle" || o.sequenceTransitionState === "transitioning" || o.sequenceTransitionState === "paused"
      ? o.sequenceTransitionState
      : undefined;
  const activeSequence = Array.isArray(o.activeSequence)
    ? o.activeSequence.map(normalizeTimeBlockEntry).filter((e): e is TimeBlockEntry => e !== null)
    : undefined;
  const activeSequenceIndex =
    typeof o.activeSequenceIndex === "number" && Number.isFinite(o.activeSequenceIndex) ? o.activeSequenceIndex : undefined;

  return {
    ...(Number.isFinite(selectedMinutes) && selectedMinutes >= 5 && selectedMinutes <= 120 ? { selectedMinutes } : {}),
    ...(Number.isFinite(timeLeft) && timeLeft >= 0 ? { timeLeft } : {}),
    ...(typeof o.isActive === "boolean" ? { isActive: o.isActive } : {}),
    ...(endTimeMs !== undefined ? { endTimeMs } : {}),
    ...(selectedTrackId !== undefined ? { selectedTrackId } : {}),
    ...(activeSessionLabel !== undefined ? { activeSessionLabel } : {}),
    ...(activeSequence !== undefined ? { activeSequence: activeSequence.length ? activeSequence : null } : {}),
    ...(activeSequenceIndex !== undefined ? { activeSequenceIndex } : {}),
    ...(sequenceTransitionState !== undefined ? { sequenceTransitionState } : {}),
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

    const state = row?.checklist ? normalizeState(row.checklist) : null;

    return NextResponse.json({
      state,
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    return handleApiError(error, "api/focus-timer/state:GET");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { state?: unknown };
    const normalized = normalizeState(body.state) ?? {};

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
    return handleApiError(error, "api/focus-timer/state:POST");
  }
}
