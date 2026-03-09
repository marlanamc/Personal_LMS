import type { Prisma } from "@prisma/client";

export const TIME_BLOCK_PLANNER_SUBJECT_KEY = "time-block-planner";

export type TimeBlockKind = "want" | "should";

export type ActivitySlot = {
  id: string;
  kind: TimeBlockKind;
  label: string;
  minutes: number;
};

export type TimeBlockFormState = {
  date: string;
  startTime: string;
  endTime: string;
  /** @deprecated Use activities array instead */
  wantLabel?: string;
  /** @deprecated Use activities array instead */
  wantMinutes?: number;
  /** @deprecated Use activities array instead */
  shouldLabel?: string;
  /** @deprecated Use activities array instead */
  shouldMinutes?: number;
  /** Up to 5 activity slots that cycle through the day */
  activities: ActivitySlot[];
};

export type TimeBlockEntry = {
  id: string;
  kind: TimeBlockKind;
  label: string;
  startTime: string;
  endTime: string;
  startMinuteOfDay: number;
  endMinuteOfDay: number;
  durationMinutes: number;
  isTrimmed: boolean;
};

export type TimeBlockDayPlan = {
  form: TimeBlockFormState;
  blocks: TimeBlockEntry[];
  generatedAt: string | null;
  /** Notes per block id, e.g. "what to work on" for coding blocks */
  blockNotes?: Record<string, string>;
};

export type TimeBlockPlannerStore = Record<string, TimeBlockDayPlan>;

const TIME_KEY_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function clampDuration(minutes: number): number {
  if (!Number.isFinite(minutes)) return 5;
  return Math.max(5, Math.min(240, Math.round(minutes)));
}

export function roundToNextTimeIncrement(date: Date, incrementMinutes = 15): string {
  const next = new Date(date);
  next.setSeconds(0, 0);
  const remainder = next.getMinutes() % incrementMinutes;
  if (remainder !== 0) {
    next.setMinutes(next.getMinutes() + (incrementMinutes - remainder));
  }
  if (next.getDate() !== date.getDate()) {
    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    next.setHours(23, 45, 0, 0);
  }
  return toTimeInputValue(next);
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toTimeInputValue(date: Date): string {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function parseTimeInput(value: string): number | null {
  const match = value.match(TIME_KEY_PATTERN);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function formatMinuteOfDay(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.min(24 * 60, Math.round(totalMinutes)));
  const hour24 = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  if (minutes === 0) return `${hour12} ${period}`;
  return `${hour12}:${`${minutes}`.padStart(2, "0")} ${period}`;
}

export function generateActivityId(): string {
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createDefaultTimeBlockForm(dateKey: string, now = new Date()): TimeBlockFormState {
  const todayKey = toDateKey(now);
  const startDate = dateKey === todayKey ? now : new Date(`${dateKey}T09:00:00`);
  const startTime = dateKey === todayKey ? roundToNextTimeIncrement(startDate) : "09:00";
  const endTime = "23:59";

  return {
    date: dateKey,
    startTime,
    endTime,
    activities: [
      { id: generateActivityId(), kind: "want", label: "Coding", minutes: 60 },
      { id: generateActivityId(), kind: "should", label: "Cleaning", minutes: 30 },
    ],
  };
}

export function createEmptyTimeBlockDayPlan(dateKey: string, now = new Date()): TimeBlockDayPlan {
  return {
    form: createDefaultTimeBlockForm(dateKey, now),
    blocks: [],
    generatedAt: null,
    blockNotes: {},
  };
}

export function buildTimeBlockPlan(form: TimeBlockFormState): TimeBlockEntry[] {
  const startMinutes = parseTimeInput(form.startTime);
  const endMinutes = parseTimeInput(form.endTime);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return [];
  }

  // Build phases from activities array, filtering out empty/invalid ones
  const phases: Array<{ kind: TimeBlockKind; label: string; durationMinutes: number }> =
    form.activities
      .filter(a => a.label.trim() && a.minutes > 0)
      .map(a => ({
        kind: a.kind,
        label: normalizeText(a.label, a.kind === "want" ? "Want to do" : "Should do"),
        durationMinutes: clampDuration(a.minutes),
      }));

  if (phases.length === 0) {
    return [];
  }

  const blocks: TimeBlockEntry[] = [];
  let cursor = startMinutes;
  let phaseIndex = 0;

  while (cursor < endMinutes) {
    const phase = phases[phaseIndex % phases.length];
    const nextEnd = Math.min(cursor + phase.durationMinutes, endMinutes);
    const actualDuration = nextEnd - cursor;

    if (actualDuration <= 0) break;

    blocks.push({
      id: `${phase.kind}-${cursor}-${nextEnd}`,
      kind: phase.kind,
      label: phase.label,
      startTime: formatTimeFromMinutes(cursor),
      endTime: formatTimeFromMinutes(nextEnd),
      startMinuteOfDay: cursor,
      endMinuteOfDay: nextEnd,
      durationMinutes: actualDuration,
      isTrimmed: actualDuration !== phase.durationMinutes,
    });

    cursor = nextEnd;
    phaseIndex += 1;
  }

  return blocks;
}

function normalizeActivitySlot(raw: unknown): ActivitySlot | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<ActivitySlot>;
  const kind = candidate.kind === "want" || candidate.kind === "should" ? candidate.kind : null;
  const label = typeof candidate.label === "string" ? candidate.label.trim() : "";
  const minutes = Number(candidate.minutes);

  if (!kind || !Number.isFinite(minutes)) return null;

  return {
    id: typeof candidate.id === "string" && candidate.id ? candidate.id : generateActivityId(),
    kind,
    label,
    minutes: clampDuration(minutes),
  };
}

export function normalizeTimeBlockForm(raw: unknown, dateKey: string): TimeBlockFormState {
  const fallback = createDefaultTimeBlockForm(dateKey);
  if (!raw || typeof raw !== "object") return fallback;

  const candidate = raw as Partial<TimeBlockFormState> & {
    wantLabel?: string;
    wantMinutes?: number;
    shouldLabel?: string;
    shouldMinutes?: number;
  };
  const startTime =
    typeof candidate.startTime === "string" && TIME_KEY_PATTERN.test(candidate.startTime)
      ? candidate.startTime
      : fallback.startTime;
  const endTime =
    typeof candidate.endTime === "string" && TIME_KEY_PATTERN.test(candidate.endTime)
      ? candidate.endTime
      : fallback.endTime;

  // Migrate from old format if activities array doesn't exist
  let activities: ActivitySlot[];
  if (Array.isArray(candidate.activities) && candidate.activities.length > 0) {
    activities = candidate.activities
      .map(normalizeActivitySlot)
      .filter((a): a is ActivitySlot => a !== null)
      .slice(0, 5); // Max 5 activities
    if (activities.length === 0) {
      activities = fallback.activities;
    }
  } else if (candidate.wantLabel !== undefined || candidate.shouldLabel !== undefined) {
    // Migrate from old want/should format
    activities = [
      {
        id: generateActivityId(),
        kind: "want" as const,
        label: normalizeText(candidate.wantLabel, "Coding"),
        minutes: clampDuration(Number(candidate.wantMinutes ?? 60)),
      },
      {
        id: generateActivityId(),
        kind: "should" as const,
        label: normalizeText(candidate.shouldLabel, "Cleaning"),
        minutes: clampDuration(Number(candidate.shouldMinutes ?? 30)),
      },
    ];
  } else {
    activities = fallback.activities;
  }

  return {
    date: DATE_KEY_PATTERN.test(String(candidate.date ?? "")) ? String(candidate.date) : dateKey,
    startTime,
    endTime,
    activities,
  };
}

function normalizeTimeBlockEntry(raw: unknown): TimeBlockEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<TimeBlockEntry>;
  const kind = candidate.kind === "want" || candidate.kind === "should" ? candidate.kind : null;
  const label = typeof candidate.label === "string" ? candidate.label.trim() : "";
  const startMinuteOfDay = Number(candidate.startMinuteOfDay);
  const endMinuteOfDay = Number(candidate.endMinuteOfDay);

  if (!kind || !label || !Number.isFinite(startMinuteOfDay) || !Number.isFinite(endMinuteOfDay)) {
    return null;
  }

  if (endMinuteOfDay <= startMinuteOfDay) return null;

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id
        : `${kind}-${startMinuteOfDay}-${endMinuteOfDay}`,
    kind,
    label,
    startTime:
      typeof candidate.startTime === "string" && TIME_KEY_PATTERN.test(candidate.startTime)
        ? candidate.startTime
        : formatTimeFromMinutes(startMinuteOfDay),
    endTime:
      typeof candidate.endTime === "string" && TIME_KEY_PATTERN.test(candidate.endTime)
        ? candidate.endTime
        : formatTimeFromMinutes(endMinuteOfDay),
    startMinuteOfDay,
    endMinuteOfDay,
    durationMinutes: Math.max(1, Math.round(endMinuteOfDay - startMinuteOfDay)),
    isTrimmed: candidate.isTrimmed === true,
  };
}

export function normalizeTimeBlockDayPlan(raw: unknown, dateKey: string): TimeBlockDayPlan {
  const fallback = createEmptyTimeBlockDayPlan(dateKey);
  if (!raw || typeof raw !== "object") return fallback;

  const candidate = raw as Partial<TimeBlockDayPlan>;
  const form = normalizeTimeBlockForm(candidate.form, dateKey);
  const blocks = Array.isArray(candidate.blocks)
    ? candidate.blocks
        .map(normalizeTimeBlockEntry)
        .filter((block): block is TimeBlockEntry => block !== null)
    : [];
  const generatedAt =
    typeof candidate.generatedAt === "string" && candidate.generatedAt.trim() ? candidate.generatedAt : null;

  const blockNotes: Record<string, string> = {};
  const rawNotes = (candidate as { blockNotes?: unknown }).blockNotes;
  if (rawNotes && typeof rawNotes === "object" && !Array.isArray(rawNotes)) {
    const blockIds = new Set(blocks.map((b) => b.id));
    for (const [id, value] of Object.entries(rawNotes)) {
      if (blockIds.has(id) && typeof value === "string") {
        blockNotes[id] = value;
      }
    }
  }

  return {
    form,
    blocks,
    generatedAt,
    blockNotes,
  };
}

export function normalizeTimeBlockPlannerStore(raw: unknown): TimeBlockPlannerStore {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const store: TimeBlockPlannerStore = {};
  for (const [dateKey, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!DATE_KEY_PATTERN.test(dateKey)) continue;
    store[dateKey] = normalizeTimeBlockDayPlan(value, dateKey);
  }

  return store;
}

export function plannerStoreToJson(store: TimeBlockPlannerStore): Prisma.InputJsonValue {
  return store as unknown as Prisma.InputJsonValue;
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function formatTimeFromMinutes(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMinutes)));
  const hours = `${Math.floor(safeMinutes / 60)}`.padStart(2, "0");
  const minutes = `${safeMinutes % 60}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}
