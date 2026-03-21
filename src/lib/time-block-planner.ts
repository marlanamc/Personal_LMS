import type { Prisma } from "@prisma/client";

export const TIME_BLOCK_PLANNER_SUBJECT_KEY = "time-block-planner";

export type TimeBlockKind = "want" | "should";
export type PlannerConstraintRuleKind = "cutoff" | "until";
export type PlannerQuadrantColorToken = "dawn" | "mint" | "sky" | "sand" | "rose";

export type PlannerConstraintTarget = {
  kind: TimeBlockKind;
  label?: string;
};

export type PlannerConstraintRule = {
  id: string;
  kind: PlannerConstraintRuleKind;
  target: PlannerConstraintTarget;
  time: string;
  enabled: boolean;
  displayText: string;
};

export type TimeBlockPlannerDefaults = {
  constraints: PlannerConstraintRule[];
};

export type PlannerQuadrant = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  focusItems: string[];
  colorToken: PlannerQuadrantColorToken;
  enabled: boolean;
};

export type ActivitySlot = {
  id: string;
  kind: TimeBlockKind | null;
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
  constraints: PlannerConstraintRule[];
  disabledDefaultConstraintIds: string[];
  sectionStartTime: string | null;
  sectionEndTime: string | null;
  quadrants: PlannerQuadrant[];
};

export type TimeBlockPlannerStore = {
  days: Record<string, TimeBlockDayPlan>;
  defaults: TimeBlockPlannerDefaults;
};

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

export function generateConstraintId(): string {
  return `constraint-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateQuadrantId(): string {
  return `quadrant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
      { id: generateActivityId(), kind: null, label: "", minutes: 30 },
      { id: generateActivityId(), kind: null, label: "", minutes: 30 },
    ],
  };
}

export function createEmptyTimeBlockDayPlan(dateKey: string, now = new Date()): TimeBlockDayPlan {
  return {
    form: createDefaultTimeBlockForm(dateKey, now),
    blocks: [],
    generatedAt: null,
    blockNotes: {},
    constraints: [],
    disabledDefaultConstraintIds: [],
    sectionStartTime: null,
    sectionEndTime: null,
    quadrants: [],
  };
}

export function createEmptyTimeBlockPlannerStore(): TimeBlockPlannerStore {
  return {
    days: {},
    defaults: { constraints: [] },
  };
}

export function describeConstraintRule(rule: PlannerConstraintRule): string {
  const targetLabel = rule.target.label?.trim();
  const activityName = targetLabel || (rule.target.kind === "want" ? "Energy" : "Focus");
  const timeLabel = formatTimeLabel(rule.time);

  if (rule.kind === "until") {
    return `Only schedule ${activityName} until ${timeLabel}`;
  }

  return `Stop scheduling ${activityName} after ${timeLabel}`;
}

export function getActiveConstraintsForDay(
  dayPlan: TimeBlockDayPlan | undefined,
  defaults: TimeBlockPlannerDefaults | undefined,
): PlannerConstraintRule[] {
  const disabledIds = new Set(dayPlan?.disabledDefaultConstraintIds ?? []);
  const inherited = (defaults?.constraints ?? []).filter((rule) => !disabledIds.has(rule.id));
  return [...inherited, ...(dayPlan?.constraints ?? [])].filter((rule) => rule.enabled);
}

export function getActiveQuadrantsForDay(dayPlan: TimeBlockDayPlan | undefined): PlannerQuadrant[] {
  return (dayPlan?.quadrants ?? []).filter((quadrant) => quadrant.enabled);
}

export function getSectionRangeForDay(dayPlan: Pick<TimeBlockDayPlan, "form" | "sectionStartTime" | "sectionEndTime">): {
  startTime: string;
  endTime: string;
} {
  const formStart = parseTimeInput(dayPlan.form.startTime);
  const formEnd = parseTimeInput(dayPlan.form.endTime);
  const sectionStart = dayPlan.sectionStartTime ? parseTimeInput(dayPlan.sectionStartTime) : null;
  const sectionEnd = dayPlan.sectionEndTime ? parseTimeInput(dayPlan.sectionEndTime) : null;

  if (formStart === null || formEnd === null || formEnd <= formStart) {
    return { startTime: dayPlan.form.startTime, endTime: dayPlan.form.endTime };
  }

  const looksLikeInheritedFullDayRange =
    dayPlan.form.endTime === "23:59" &&
    (
      (sectionStart === null && sectionEnd === null) ||
      (sectionStart === formStart && sectionEnd === formEnd)
    );

  const looksLikeLegacyWorkdayRange =
    dayPlan.form.endTime === "23:59" &&
    sectionStart === formStart &&
    sectionEnd === 17 * 60;

  if (looksLikeInheritedFullDayRange || looksLikeLegacyWorkdayRange) {
    return {
      startTime: "09:00",
      endTime: "17:00",
    };
  }

  const safeStart = sectionStart !== null ? Math.max(formStart, Math.min(formEnd - 15, sectionStart)) : formStart;
  const safeEnd = sectionEnd !== null ? Math.max(safeStart + 15, Math.min(formEnd, sectionEnd)) : formEnd;

  return {
    startTime: formatTimeFromMinutes(safeStart),
    endTime: formatTimeFromMinutes(safeEnd),
  };
}

export function buildTimeBlockPlan(
  form: TimeBlockFormState,
  constraints: PlannerConstraintRule[] = [],
  quadrants: PlannerQuadrant[] = [],
): TimeBlockEntry[] {
  const startMinutes = parseTimeInput(form.startTime);
  const endMinutes = parseTimeInput(form.endTime);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return [];
  }

  const phases: Array<{ kind: TimeBlockKind; label: string; durationMinutes: number }> =
    form.activities
      .filter(
        (a): a is ActivitySlot & { kind: TimeBlockKind } =>
          a.kind !== null && a.label.trim().length > 0 && a.minutes > 0,
      )
      .map((a) => ({
        kind: a.kind,
        label: normalizeText(a.label, a.kind === "want" ? "Want to do" : "Should do"),
        durationMinutes: clampDuration(a.minutes),
      }));

  if (phases.length === 0) {
    return [];
  }

  const activeConstraints = constraints.filter((rule) => rule.enabled);
  const activeQuadrants = quadrants.filter((quadrant) => quadrant.enabled);
  const blocks: TimeBlockEntry[] = [];
  let cursor = startMinutes;
  let phaseIndex = 0;
  let skippedInRow = 0;

  while (cursor < endMinutes) {
    const activeQuadrant = findQuadrantForMinute(activeQuadrants, cursor);
    if (activeQuadrants.length > 0 && !activeQuadrant) {
      const nextQuadrant = activeQuadrants
        .map((quadrant) => ({ quadrant, startMinute: parseTimeInput(quadrant.startTime) }))
        .filter((entry): entry is { quadrant: PlannerQuadrant; startMinute: number } => entry.startMinute !== null)
        .find((entry) => entry.startMinute > cursor);
      if (!nextQuadrant) break;
      cursor = nextQuadrant.startMinute;
      skippedInRow = 0;
      continue;
    }

    const phase = phases[phaseIndex % phases.length];
    const cutoff = getConstraintCutoffForPhase(phase, activeConstraints);
    const quadrantEnd = activeQuadrant ? parseTimeInput(activeQuadrant.endTime) : null;
    const effectiveEnd = [endMinutes, cutoff, quadrantEnd]
      .filter((value): value is number => value !== null)
      .reduce((min, value) => Math.min(min, value), endMinutes);

    if (effectiveEnd <= cursor) {
      phaseIndex += 1;
      skippedInRow += 1;
      if (skippedInRow >= phases.length) break;
      continue;
    }

    const nextEnd = Math.min(cursor + phase.durationMinutes, effectiveEnd);
    const actualDuration = nextEnd - cursor;

    if (actualDuration <= 0) {
      phaseIndex += 1;
      skippedInRow += 1;
      if (skippedInRow >= phases.length) break;
      continue;
    }

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
    skippedInRow = 0;
  }

  return blocks;
}

export function createEqualQuadrants(
  form: TimeBlockFormState,
  count: number,
  existingQuadrants: PlannerQuadrant[] = [],
  sectionRange?: { startTime: string; endTime: string },
): PlannerQuadrant[] {
  const safeCount = Math.max(2, Math.min(5, Math.round(count)));
  const startMinutes = parseTimeInput(sectionRange?.startTime ?? form.startTime) ?? 9 * 60;
  const endMinutes = parseTimeInput(sectionRange?.endTime ?? form.endTime) ?? Math.max(startMinutes + 60, 17 * 60);
  const total = Math.max(safeCount, endMinutes - startMinutes);
  const colors: PlannerQuadrantColorToken[] = ["dawn", "mint", "sky", "sand", "rose"];

  return Array.from({ length: safeCount }, (_, index) => {
    const sectionStart = startMinutes + Math.floor((total * index) / safeCount);
    const sectionEnd =
      index === safeCount - 1
        ? endMinutes
        : startMinutes + Math.floor((total * (index + 1)) / safeCount);
    const previous = existingQuadrants[index];
    return {
      id: previous?.id ?? generateQuadrantId(),
      label: previous?.label?.trim() || `Section ${index + 1}`,
      startTime: formatTimeFromMinutes(sectionStart),
      endTime: formatTimeFromMinutes(Math.max(sectionStart + 1, sectionEnd)),
      focusItems: previous?.focusItems?.slice(0, 5) ?? [],
      colorToken: previous?.colorToken ?? colors[index % colors.length],
      enabled: previous?.enabled ?? true,
    };
  });
}

function normalizeActivitySlot(raw: unknown): ActivitySlot | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<ActivitySlot>;
  const kind = candidate.kind === "want" || candidate.kind === "should" ? candidate.kind : null;
  const label = typeof candidate.label === "string" ? candidate.label.trim() : "";
  const minutes = Number(candidate.minutes);

  if (!Number.isFinite(minutes)) return null;

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

  let activities: ActivitySlot[];
  if (Array.isArray(candidate.activities) && candidate.activities.length > 0) {
    activities = candidate.activities
      .map(normalizeActivitySlot)
      .filter((a): a is ActivitySlot => a !== null)
      .slice(0, 5);
    if (activities.length === 0) {
      activities = fallback.activities;
    }
  } else if (candidate.wantLabel !== undefined || candidate.shouldLabel !== undefined) {
    activities = [
      {
        id: generateActivityId(),
        kind: "want" as const,
        label: normalizeText(candidate.wantLabel, ""),
        minutes: clampDuration(Number(candidate.wantMinutes ?? 60)),
      },
      {
        id: generateActivityId(),
        kind: "should" as const,
        label: normalizeText(candidate.shouldLabel, ""),
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

function normalizeConstraintTarget(raw: unknown): PlannerConstraintTarget | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<PlannerConstraintTarget>;
  const kind = candidate.kind === "want" || candidate.kind === "should" ? candidate.kind : null;
  if (!kind) return null;

  const label = normalizeOptionalLabel(candidate.label);
  return label ? { kind, label } : { kind };
}

function normalizeConstraintRule(raw: unknown): PlannerConstraintRule | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<PlannerConstraintRule>;
  const kind = candidate.kind === "cutoff" || candidate.kind === "until" ? candidate.kind : null;
  const target = normalizeConstraintTarget(candidate.target);
  const time = typeof candidate.time === "string" && TIME_KEY_PATTERN.test(candidate.time) ? candidate.time : null;

  if (!kind || !target || !time) return null;

  const normalized: PlannerConstraintRule = {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id
        : generateConstraintId(),
    kind,
    target,
    time,
    enabled: candidate.enabled !== false,
    displayText:
      typeof candidate.displayText === "string" && candidate.displayText.trim()
        ? candidate.displayText.trim()
        : "",
  };

  return {
    ...normalized,
    displayText: normalized.displayText || describeConstraintRule(normalized),
  };
}

function normalizeConstraintRules(raw: unknown): PlannerConstraintRule[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeConstraintRule)
    .filter((rule): rule is PlannerConstraintRule => rule !== null);
}

function normalizeQuadrantColorToken(value: unknown, fallback: PlannerQuadrantColorToken): PlannerQuadrantColorToken {
  return value === "dawn" || value === "mint" || value === "sky" || value === "sand" || value === "rose"
    ? value
    : fallback;
}

function normalizeQuadrant(raw: unknown, index: number): PlannerQuadrant | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<PlannerQuadrant>;
  const startTime =
    typeof candidate.startTime === "string" && TIME_KEY_PATTERN.test(candidate.startTime)
      ? candidate.startTime
      : null;
  const endTime =
    typeof candidate.endTime === "string" && TIME_KEY_PATTERN.test(candidate.endTime)
      ? candidate.endTime
      : null;
  const startMinute = startTime ? parseTimeInput(startTime) : null;
  const endMinute = endTime ? parseTimeInput(endTime) : null;
  const label = normalizeText(candidate.label, "");
  const colors: PlannerQuadrantColorToken[] = ["dawn", "mint", "sky", "sand", "rose"];

  if (!startTime || !endTime || startMinute === null || endMinute === null || endMinute <= startMinute || !label) {
    return null;
  }

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim()
        ? candidate.id
        : generateQuadrantId(),
    label,
    startTime,
    endTime,
    focusItems: Array.isArray(candidate.focusItems)
      ? candidate.focusItems
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 5)
      : [],
    colorToken: normalizeQuadrantColorToken(candidate.colorToken, colors[index % colors.length]),
    enabled: candidate.enabled !== false,
  };
}

function normalizeQuadrants(raw: unknown, form: TimeBlockFormState): PlannerQuadrant[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length > 0 && (raw.length < 2 || raw.length > 5)) return [];
  const quadrants = raw
    .map((quadrant, index) => normalizeQuadrant(quadrant, index))
    .filter((quadrant): quadrant is PlannerQuadrant => quadrant !== null)
    .sort((a, b) => {
      const aStart = parseTimeInput(a.startTime) ?? 0;
      const bStart = parseTimeInput(b.startTime) ?? 0;
      return aStart - bStart;
    });

  if (quadrants.length > 0 && (quadrants.length < 2 || quadrants.length > 5)) return [];
  if (quadrants.length === 0) return [];

  const formStart = parseTimeInput(form.startTime);
  const formEnd = parseTimeInput(form.endTime);
  if (formStart === null || formEnd === null || formEnd <= formStart) return [];

  for (let index = 0; index < quadrants.length; index += 1) {
    const quadrant = quadrants[index];
    const start = parseTimeInput(quadrant.startTime);
    const end = parseTimeInput(quadrant.endTime);
    if (start === null || end === null || end <= start) return [];
    if (index === 0 && start !== formStart) return [];
    if (index === quadrants.length - 1 && end !== formEnd) return [];
    if (index > 0) {
      const previousEnd = parseTimeInput(quadrants[index - 1].endTime);
      if (previousEnd === null || previousEnd !== start) return [];
    }
  }

  return quadrants;
}

function normalizeTimeBlockPlannerDefaults(raw: unknown): TimeBlockPlannerDefaults {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { constraints: [] };
  }

  const candidate = raw as Partial<TimeBlockPlannerDefaults>;
  return {
    constraints: normalizeConstraintRules(candidate.constraints),
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

  const disabledDefaultConstraintIds = Array.isArray(candidate.disabledDefaultConstraintIds)
    ? candidate.disabledDefaultConstraintIds.filter(
        (value): value is string => typeof value === "string" && value.trim().length > 0,
      )
    : [];
  const sectionStartTime =
    typeof candidate.sectionStartTime === "string" && TIME_KEY_PATTERN.test(candidate.sectionStartTime)
      ? candidate.sectionStartTime
      : null;
  const sectionEndTime =
    typeof candidate.sectionEndTime === "string" && TIME_KEY_PATTERN.test(candidate.sectionEndTime)
      ? candidate.sectionEndTime
      : null;
  const normalizedSectionRange = getSectionRangeForDay({
    form,
    sectionStartTime,
    sectionEndTime,
  });

  return {
    form,
    blocks,
    generatedAt,
    blockNotes,
    constraints: normalizeConstraintRules(candidate.constraints),
    disabledDefaultConstraintIds,
    sectionStartTime: normalizedSectionRange.startTime,
    sectionEndTime: normalizedSectionRange.endTime,
    quadrants: normalizeQuadrants(candidate.quadrants, {
      ...form,
      startTime: normalizedSectionRange.startTime,
      endTime: normalizedSectionRange.endTime,
    }),
  };
}

export function normalizeTimeBlockPlannerStore(raw: unknown): TimeBlockPlannerStore {
  const fallback = createEmptyTimeBlockPlannerStore();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;

  const candidate = raw as Record<string, unknown> & {
    days?: unknown;
    defaults?: unknown;
  };

  const rawDays =
    candidate.days && typeof candidate.days === "object" && !Array.isArray(candidate.days)
      ? (candidate.days as Record<string, unknown>)
      : candidate;

  const days: Record<string, TimeBlockDayPlan> = {};
  for (const [dateKey, value] of Object.entries(rawDays)) {
    if (!DATE_KEY_PATTERN.test(dateKey)) continue;
    days[dateKey] = normalizeTimeBlockDayPlan(value, dateKey);
  }

  return {
    days,
    defaults: normalizeTimeBlockPlannerDefaults(candidate.defaults),
  };
}

export function plannerStoreToJson(store: TimeBlockPlannerStore): Prisma.InputJsonValue {
  return {
    days: store.days,
    defaults: store.defaults,
  } as unknown as Prisma.InputJsonValue;
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeOptionalLabel(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function formatTimeFromMinutes(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMinutes)));
  const hours = `${Math.floor(safeMinutes / 60)}`.padStart(2, "0");
  const minutes = `${safeMinutes % 60}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatTimeLabel(time: string): string {
  const minutes = parseTimeInput(time);
  return minutes === null ? time : formatMinuteOfDay(minutes);
}

function getConstraintCutoffForPhase(
  phase: { kind: TimeBlockKind; label: string },
  constraints: PlannerConstraintRule[],
): number | null {
  const matchingCutoffs = constraints
    .filter((rule) => constraintMatchesPhase(rule, phase))
    .map((rule) => parseTimeInput(rule.time))
    .filter((value): value is number => value !== null);

  if (matchingCutoffs.length === 0) return null;
  return Math.min(...matchingCutoffs);
}

function constraintMatchesPhase(
  rule: PlannerConstraintRule,
  phase: { kind: TimeBlockKind; label: string },
): boolean {
  if (rule.target.kind !== phase.kind) return false;
  if (!rule.target.label) return true;
  return rule.target.label.trim().toLowerCase() === phase.label.trim().toLowerCase();
}

function findQuadrantForMinute(quadrants: PlannerQuadrant[], minute: number): PlannerQuadrant | null {
  for (const quadrant of quadrants) {
    const start = parseTimeInput(quadrant.startTime);
    const end = parseTimeInput(quadrant.endTime);
    if (start === null || end === null) continue;
    if (minute >= start && minute < end) return quadrant;
  }
  return null;
}
