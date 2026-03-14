export type AnchorId = string;

export type AnchorIcon =
  | 'moon'
  | 'dumbbell'
  | 'briefcase'
  | 'sunrise'
  | 'flower-2'
  | 'book-open'
  | 'code'
  | 'heart'
  | 'coffee'
  | 'target'
  | 'calendar';

export type AnchorColor = 'peach' | 'sky' | 'mint' | 'periwinkle' | 'lavender' | 'rose';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AnchorStatus = 'waiting' | 'done' | 'missed' | 'skipped';
export type SkipReason = 'tired' | 'schedule_changed' | 'not_realistic' | 'low_energy' | 'sick' | 'other';

export interface DailyAnchor {
  id: AnchorId;
  label: string;
  icon: AnchorIcon;
  color?: AnchorColor;
  scheduledTime: string;
  /** Optional end time (HH:MM). When set, anchor is a block from scheduledTime to endTime. */
  endTime?: string;
  daysOfWeek?: DayOfWeek[];
  status: AnchorStatus;
  actualTime?: string;
  skipReason?: SkipReason;
}

export interface DailyAnchorTemplate {
  id: AnchorId;
  label: string;
  icon: AnchorIcon;
  color?: AnchorColor;
  scheduledTime: string;
  /** Optional end time (HH:MM). */
  endTime?: string;
  daysOfWeek?: DayOfWeek[];
}

export interface DailyAnchorState {
  date: string;
  anchors: DailyAnchor[];
  sleepRhythmDayComplete: boolean;
}

export interface DailyAnchorsStore {
  version: 1;
  templates: DailyAnchorTemplate[];
  states: Record<string, DailyAnchorState>;
}

export const DEFAULT_DAILY_ANCHOR_TEMPLATES: DailyAnchorTemplate[] = [
  { id: 'wake', label: 'Wake', icon: 'sunrise', scheduledTime: '08:00' },
  { id: 'gym', label: 'Gym', icon: 'dumbbell', scheduledTime: '09:00' },
  { id: 'job', label: 'Job Block', icon: 'briefcase', scheduledTime: '11:00' },
  { id: 'lightsOut', label: 'Bedtime', icon: 'moon', scheduledTime: '23:00' },
];

const VALID_ICONS = new Set<AnchorIcon>([
  'moon',
  'dumbbell',
  'briefcase',
  'sunrise',
  'flower-2',
  'book-open',
  'code',
  'heart',
  'coffee',
  'target',
  'calendar',
]);

const VALID_COLORS = new Set<AnchorColor>(['peach', 'sky', 'mint', 'periwinkle', 'lavender', 'rose']);

export const ANCHOR_COLOR_OPTIONS: Array<{ value: AnchorColor; label: string }> = [
  { value: 'peach', label: 'Peach' },
  { value: 'sky', label: 'Sky' },
  { value: 'mint', label: 'Mint' },
  { value: 'periwinkle', label: 'Periwinkle' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'rose', label: 'Rose' },
];

export interface AnchorColorPalette {
  key: AnchorColor;
  label: string;
  solid: string;
  soft: string;
  border: string;
  deep: string;
  gradientStart: string;
  gradientEnd: string;
}

const ANCHOR_COLOR_PALETTES: Record<AnchorColor, AnchorColorPalette> = {
  peach: {
    key: 'peach',
    label: 'Peach',
    solid: '#E8A87C',
    soft: '#F2E4D7',
    border: '#DFC6B1',
    deep: '#C98257',
    gradientStart: '#F2C39D',
    gradientEnd: '#E8A87C',
  },
  sky: {
    key: 'sky',
    label: 'Sky',
    solid: '#6FA8DC',
    soft: '#E1EAF3',
    border: '#C3D4E3',
    deep: '#4F86BA',
    gradientStart: '#94C1E8',
    gradientEnd: '#6FA8DC',
  },
  mint: {
    key: 'mint',
    label: 'Mint',
    solid: '#78BFA5',
    soft: '#E1EBE4',
    border: '#C6D9CE',
    deep: '#4F9A7F',
    gradientStart: '#97D0BB',
    gradientEnd: '#78BFA5',
  },
  periwinkle: {
    key: 'periwinkle',
    label: 'Periwinkle',
    solid: '#8A8FD8',
    soft: '#E4E0EE',
    border: '#CDC6DE',
    deep: '#686FC1',
    gradientStart: '#A5A9E7',
    gradientEnd: '#8A8FD8',
  },
  lavender: {
    key: 'lavender',
    label: 'Lavender',
    solid: '#9B8EC2',
    soft: '#E5DEE9',
    border: '#D4CADB',
    deep: '#7664A7',
    gradientStart: '#B0A2D4',
    gradientEnd: '#9B8EC2',
  },
  rose: {
    key: 'rose',
    label: 'Rose',
    solid: '#D48AA6',
    soft: '#F0DEE6',
    border: '#E0C0CE',
    deep: '#B96687',
    gradientStart: '#E2A4BC',
    gradientEnd: '#D48AA6',
  },
};

export function getDefaultAnchorColor(icon: AnchorIcon): AnchorColor {
  if (icon === 'sunrise' || icon === 'coffee') return 'peach';
  if (icon === 'briefcase' || icon === 'code') return 'sky';
  if (icon === 'dumbbell' || icon === 'flower-2') return 'mint';
  if (icon === 'book-open' || icon === 'calendar') return 'periwinkle';
  if (icon === 'heart') return 'rose';
  return 'lavender';
}

function normalizeAnchorColor(raw: unknown, fallback?: AnchorColor): AnchorColor | undefined {
  if (typeof raw === 'string' && VALID_COLORS.has(raw as AnchorColor)) {
    return raw as AnchorColor;
  }
  return fallback;
}

export function resolveAnchorColor(color: AnchorColor | undefined, icon: AnchorIcon): AnchorColor {
  return color ?? getDefaultAnchorColor(icon);
}

export function getAnchorColorPalette(
  color: AnchorColor | undefined,
  icon: AnchorIcon,
): AnchorColorPalette {
  return ANCHOR_COLOR_PALETTES[resolveAnchorColor(color, icon)];
}

function normalizeDaysOfWeek(raw: unknown): DayOfWeek[] | undefined {
  if (!Array.isArray(raw)) return undefined;

  const values = raw
    .map((day) => Number(day))
    .filter((day): day is DayOfWeek => Number.isInteger(day) && day >= 0 && day <= 6);

  if (values.length === 0) return undefined;

  const unique = Array.from(new Set(values)).sort((a, b) => a - b);
  return unique;
}

export function sanitizeAnchorId(raw: string): AnchorId {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || `anchor-${Date.now()}`;
}

export function getDefaultAnchorTemplates(): DailyAnchorTemplate[] {
  return DEFAULT_DAILY_ANCHOR_TEMPLATES.map((template) => ({ ...template }));
}

const HHMM_REGEX = /^\d{2}:\d{2}$/;

function normalizeEndTime(
  raw: unknown,
  scheduledTime: string,
  fallback?: string,
): string | undefined {
  if (raw === undefined || raw === null) return fallback;
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!HHMM_REGEX.test(s)) return fallback;
  const startMin = parseHHMMToMinutes(scheduledTime);
  const endMin = parseHHMMToMinutes(s);
  if (endMin <= startMin) return fallback;
  return s;
}

function normalizeAnchorTemplate(raw: unknown, fallback?: DailyAnchorTemplate): DailyAnchorTemplate {
  const candidate = (raw && typeof raw === 'object' ? raw : {}) as {
    id?: unknown;
    label?: unknown;
    icon?: unknown;
    color?: unknown;
    scheduledTime?: unknown;
    endTime?: unknown;
    durationMinutes?: unknown;
    daysOfWeek?: unknown;
  };

  const fallbackId = fallback?.id ?? `anchor-${Date.now()}`;
  const id = sanitizeAnchorId(typeof candidate.id === 'string' ? candidate.id : fallbackId);

  const icon = VALID_ICONS.has(candidate.icon as AnchorIcon)
    ? (candidate.icon as AnchorIcon)
    : fallback?.icon || 'moon';
  const color = normalizeAnchorColor(candidate.color, fallback?.color);

  const scheduledTime =
    typeof candidate.scheduledTime === 'string' && HHMM_REGEX.test(candidate.scheduledTime)
      ? candidate.scheduledTime
      : fallback?.scheduledTime || '08:00';

  const labelFromCandidate = typeof candidate.label === 'string' ? candidate.label.trim() : '';
  const label = labelFromCandidate || fallback?.label || 'Anchor';

  let endTime = normalizeEndTime(candidate.endTime, scheduledTime, fallback?.endTime);
  if (endTime === undefined && typeof candidate.durationMinutes === 'number' && candidate.durationMinutes > 0) {
    const startMin = parseHHMMToMinutes(scheduledTime);
    const endMin = startMin + Math.min(600, Math.round(candidate.durationMinutes));
    const h = Math.floor(endMin / 60) % 24;
    const m = endMin % 60;
    endTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    if (parseHHMMToMinutes(endTime) > startMin) {
      // keep migrated endTime
    } else {
      endTime = undefined;
    }
  }
  const daysOfWeek = normalizeDaysOfWeek(candidate.daysOfWeek) ?? fallback?.daysOfWeek;

  return {
    id,
    label,
    icon,
    ...(color !== undefined ? { color } : {}),
    scheduledTime,
    ...(endTime !== undefined ? { endTime } : {}),
    ...(daysOfWeek ? { daysOfWeek } : {}),
  };
}

function toStateAnchor(template: DailyAnchorTemplate, existing?: DailyAnchor): DailyAnchor {
  const scheduledTime = existing?.scheduledTime ?? template.scheduledTime;
  const endTime = existing?.endTime ?? template.endTime;
  const color = existing?.color ?? template.color;
  const validEndTime = endTime !== undefined ? normalizeEndTime(endTime, scheduledTime, undefined) : undefined;
  return {
    id: template.id,
    label: template.label,
    icon: template.icon,
    ...(color !== undefined ? { color } : {}),
    scheduledTime,
    ...(validEndTime !== undefined ? { endTime: validEndTime } : {}),
    ...(template.daysOfWeek ? { daysOfWeek: template.daysOfWeek } : {}),
    status: existing?.status ?? 'waiting',
    actualTime: existing?.actualTime,
    skipReason: existing?.skipReason,
  };
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dateKeyToDate(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

export function parseHHMMToMinutes(input: string): number {
  const [rawH = '0', rawM = '0'] = input.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

export function formatTimeLabel(time: string): string {
  const [rawH = '0', rawM = '00'] = time.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/** Format a time range e.g. "5:00 PM – 9:00 PM" or short "5–9pm" when same period. */
export function formatTimeRange(startTime: string, endTime: string, short = false): string {
  const start = formatTimeLabel(startTime);
  const end = formatTimeLabel(endTime);
  if (short) {
    const [rawH1, rawM1] = startTime.split(':').map(Number);
    const [rawH2, rawM2] = endTime.split(':').map(Number);
    const p1 = rawH1 >= 12 ? 'pm' : 'am';
    const p2 = rawH2 >= 12 ? 'pm' : 'am';
    const h1 = rawH1 % 12 || 12;
    const h2 = rawH2 % 12 || 12;
    const m1 = rawM1;
    const m2 = rawM2;
    if (p1 === p2 && m1 === 0 && m2 === 0) return `${h1}–${h2}${p1}`;
    if (p1 === p2) return `${h1}:${String(m1).padStart(2, '0')}–${h2}:${String(m2).padStart(2, '0')} ${p1}`;
    return `${h1}:${String(m1).padStart(2, '0')}${p1} – ${h2}:${String(m2).padStart(2, '0')}${p2}`;
  }
  return `${start} – ${end}`;
}

export function formatIsoTimeLabel(isoTime?: string): string | null {
  if (!isoTime) return null;
  const parsed = new Date(isoTime);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function isAnchorScheduledForDate(anchor: Pick<DailyAnchor, 'daysOfWeek'>, date: Date): boolean {
  if (!anchor.daysOfWeek || anchor.daysOfWeek.length === 0) return true;
  return anchor.daysOfWeek.includes(date.getDay() as DayOfWeek);
}

export function getRecentSkippedAnchorStreak(
  anchors: Pick<DailyAnchor, 'status' | 'scheduledTime'>[],
  nowMinutes?: number | null,
): number {
  const processedAnchors = anchors.filter(
    (anchor) => anchor.status !== 'waiting' || nowMinutes === null || nowMinutes === undefined || parseHHMMToMinutes(anchor.scheduledTime) <= nowMinutes,
  );

  let streak = 0;
  for (let index = processedAnchors.length - 1; index >= 0; index -= 1) {
    if (processedAnchors[index]?.status !== 'skipped') break;
    streak += 1;
  }

  return streak;
}

export interface WeeklySkipReasonInsight {
  anchorId: AnchorId;
  anchorLabel: string;
  count: number;
  reason: SkipReason;
}

export function getSkipReasonLabel(reason: SkipReason): string {
  if (reason === 'tired') return 'you were tired';
  if (reason === 'schedule_changed') return 'your schedule changed';
  if (reason === 'not_realistic') return 'the plan felt unrealistic';
  if (reason === 'low_energy') return 'your energy was low';
  if (reason === 'sick') return 'you were sick';
  return 'something else got in the way';
}

export function getSkipReasonSuggestion(reason: SkipReason): string {
  if (reason === 'tired' || reason === 'low_energy') return 'Work on sleep or move that anchor later.';
  if (reason === 'schedule_changed') return 'The timing may need a new default.';
  if (reason === 'not_realistic') return 'Shrink the anchor or make the block easier to start.';
  if (reason === 'sick') return 'Keep a lighter fallback version for low-capacity days.';
  return 'Review whether that anchor still fits the week you actually have.';
}

export function getTopWeeklySkipReasonInsight(
  weekStates: DailyAnchorState[],
): WeeklySkipReasonInsight | null {
  const counts = new Map<string, WeeklySkipReasonInsight>();

  weekStates.forEach((state) => {
    state.anchors.forEach((anchor) => {
      if (anchor.status !== 'skipped' || !anchor.skipReason) return;
      const key = `${anchor.id}::${anchor.skipReason}`;
      const existing = counts.get(key);
      if (existing) {
        existing.count += 1;
        return;
      }

      counts.set(key, {
        anchorId: anchor.id,
        anchorLabel: anchor.label,
        count: 1,
        reason: anchor.skipReason,
      });
    });
  });

  let topInsight: WeeklySkipReasonInsight | null = null;
  counts.forEach((insight) => {
    if (!topInsight || insight.count > topInsight.count) {
      topInsight = insight;
    }
  });

  return topInsight;
}

export function normalizeAnchorTemplates(raw: unknown): DailyAnchorTemplate[] {
  const source = Array.isArray(raw) ? raw : [];
  const defaults = getDefaultAnchorTemplates();

  const normalized = source
    .map((item, idx) => normalizeAnchorTemplate(item, defaults[idx]))
    .filter((template, idx, arr) => arr.findIndex((entry) => entry.id === template.id) === idx);

  if (normalized.length === 0) {
    return defaults;
  }

  return normalized;
}

export function createDefaultDailyAnchorState(
  dateKey: string,
  templates: DailyAnchorTemplate[] = getDefaultAnchorTemplates(),
): DailyAnchorState {
  return {
    date: dateKey,
    anchors: templates.map((template) => ({ ...toStateAnchor(template), status: 'waiting', actualTime: undefined })),
    sleepRhythmDayComplete: false,
  };
}

function createIsoFromDateAndHHMM(dateKey: string, hhmm: string): string | undefined {
  const [y, m, d] = dateKey.split('-').map(Number);
  const [h, min] = hhmm.split(':').map(Number);
  if ([y, m, d, h, min].some((part) => Number.isNaN(part))) return undefined;
  const date = new Date(y, m - 1, d, h, min, 0, 0);
  return date.toISOString();
}

function normalizeAnchor(dateKey: string, raw: unknown, fallbackTemplate?: DailyAnchorTemplate): DailyAnchor {
  const candidate = (raw && typeof raw === 'object' ? raw : {}) as {
    id?: unknown;
    label?: unknown;
    icon?: unknown;
    scheduledTime?: unknown;
    endTime?: unknown;
    durationMinutes?: unknown;
    daysOfWeek?: unknown;
    status?: unknown;
    actualTime?: unknown;
    skipReason?: unknown;
    isComplete?: unknown;
    actualStartTime?: unknown;
  };

  const template = normalizeAnchorTemplate(candidate, fallbackTemplate);

  const statusFromLegacy =
    candidate.isComplete === true ? 'done' : candidate.isComplete === false ? 'waiting' : undefined;
  const statusCandidate = typeof candidate.status === 'string' ? candidate.status : undefined;
  const status =
    statusCandidate === 'done' ||
    statusCandidate === 'missed' ||
    statusCandidate === 'waiting' ||
    statusCandidate === 'skipped'
    ? statusCandidate
    : statusFromLegacy || 'waiting';

  const actualTimeCandidate = typeof candidate.actualTime === 'string' ? candidate.actualTime : undefined;
  const actualStartTime = typeof candidate.actualStartTime === 'string' ? candidate.actualStartTime : undefined;
  const actualTime = actualTimeCandidate || (actualStartTime ? createIsoFromDateAndHHMM(dateKey, actualStartTime) : undefined);
  const skipReasonCandidate = typeof candidate.skipReason === 'string' ? candidate.skipReason : undefined;
  const skipReason =
    skipReasonCandidate === 'tired' ||
    skipReasonCandidate === 'schedule_changed' ||
    skipReasonCandidate === 'not_realistic' ||
    skipReasonCandidate === 'low_energy' ||
    skipReasonCandidate === 'sick' ||
    skipReasonCandidate === 'other'
      ? skipReasonCandidate
      : undefined;

  return {
    ...template,
    status,
    actualTime,
    skipReason,
  };
}

export function getSleepRhythmDayComplete(state: DailyAnchorState): boolean {
  const wake = state.anchors.find((anchor) => anchor.id === 'wake');
  const lightsOut = state.anchors.find((anchor) => anchor.id === 'lightsOut');
  if (!wake || !lightsOut) return false;

  const stateDate = dateKeyToDate(state.date);
  if (!isAnchorScheduledForDate(wake, stateDate) || !isAnchorScheduledForDate(lightsOut, stateDate)) {
    return false;
  }

  const wakeOnTime = wake.status === 'done' && isIsoWithinToleranceMinutes(wake.actualTime, wake.scheduledTime, 15);
  const lightsOutOnTime =
    lightsOut.status === 'done' && isIsoWithinToleranceMinutes(lightsOut.actualTime, lightsOut.scheduledTime, 15);

  return wakeOnTime && lightsOutOnTime;
}

export function normalizeDailyAnchorState(
  dateKey: string,
  raw: unknown,
  templates: DailyAnchorTemplate[] = getDefaultAnchorTemplates(),
): DailyAnchorState {
  const fallback = createDefaultDailyAnchorState(dateKey, templates);
  if (!raw || typeof raw !== 'object') return fallback;

  const candidate = raw as { date?: unknown; anchors?: unknown[]; sleepRhythmDayComplete?: unknown };
  const sourceAnchors = Array.isArray(candidate.anchors) ? candidate.anchors : [];
  const templatesById = new Map(templates.map((template) => [template.id, template]));

  let anchors: DailyAnchor[];
  if (sourceAnchors.length > 0) {
    anchors = sourceAnchors
      .map((rawAnchor) => {
        const anchorObj = (rawAnchor && typeof rawAnchor === 'object' ? rawAnchor : {}) as { id?: unknown };
        const id = typeof anchorObj.id === 'string' ? sanitizeAnchorId(anchorObj.id) : undefined;
        return normalizeAnchor(dateKey, rawAnchor, id ? templatesById.get(id) : undefined);
      })
      .filter((anchor, idx, arr) => arr.findIndex((entry) => entry.id === anchor.id) === idx);
  } else {
    anchors = templates.map((template) => toStateAnchor(template));
  }

  const mergedById = new Map(anchors.map((anchor) => [anchor.id, anchor]));
  const mergedAnchors = templates.map((template) => toStateAnchor(template, mergedById.get(template.id)));

  const extraAnchors = anchors
    .filter((anchor) => !templatesById.has(anchor.id))
    .map((anchor) => ({ ...anchor }));

  const tentativeState: DailyAnchorState = {
    date: typeof candidate.date === 'string' ? candidate.date : dateKey,
    anchors: [...mergedAnchors, ...extraAnchors],
    sleepRhythmDayComplete: candidate.sleepRhythmDayComplete === true,
  };

  return {
    ...tentativeState,
    sleepRhythmDayComplete: getSleepRhythmDayComplete(tentativeState),
  };
}

export function mergeDailyAnchorStateWithTemplates(
  state: DailyAnchorState,
  templates: DailyAnchorTemplate[],
): DailyAnchorState {
  const existingById = new Map(state.anchors.map((anchor) => [anchor.id, anchor]));
  const templatesById = new Map(templates.map((template) => [template.id, template]));

  const anchors = templates.map((template) => toStateAnchor(template, existingById.get(template.id)));
  const extraAnchors = state.anchors
    .filter((anchor) => !templatesById.has(anchor.id))
    .map((anchor) => ({ ...anchor }));

  const nextStateBase: DailyAnchorState = {
    ...state,
    anchors: [...anchors, ...extraAnchors],
    sleepRhythmDayComplete: false,
  };

  return {
    ...nextStateBase,
    sleepRhythmDayComplete: getSleepRhythmDayComplete(nextStateBase),
  };
}

function isIsoWithinToleranceMinutes(actualIso: string | undefined, scheduledHHMM: string, toleranceMinutes: number): boolean {
  if (!actualIso) return false;
  const parsed = new Date(actualIso);
  if (Number.isNaN(parsed.getTime())) return false;

  const actualMinutes = parsed.getHours() * 60 + parsed.getMinutes();
  const scheduledMinutes = parseHHMMToMinutes(scheduledHHMM);
  return Math.abs(actualMinutes - scheduledMinutes) <= toleranceMinutes;
}

export function getActiveAnchor(anchors: DailyAnchor[], now: Date): DailyAnchor {
  if (anchors.length === 0) {
    const fallback = getDefaultAnchorTemplates()[0];
    return {
      ...fallback,
      status: 'waiting',
    };
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...anchors].sort((a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const firstMinutes = parseHHMMToMinutes(first.scheduledTime);

  if (nowMinutes < firstMinutes) return first;

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const currentMinutes = parseHHMMToMinutes(current.scheduledTime);
    const nextMinutes = parseHHMMToMinutes(next.scheduledTime);
    if (nowMinutes >= currentMinutes && nowMinutes < nextMinutes) {
      return current;
    }
  }

  return last;
}

export function resolveAnchorStatuses(state: DailyAnchorState, now: Date): DailyAnchor[] {
  const todayKey = toDateKey(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isPastDay = state.date < todayKey;
  const stateDate = dateKeyToDate(state.date);

  return state.anchors.map((anchor) => {
    const scheduledForDate = isAnchorScheduledForDate(anchor, stateDate);
    if (!scheduledForDate) {
      return { ...anchor, status: 'waiting', actualTime: undefined, skipReason: undefined };
    }

    if (anchor.status === 'done' || anchor.status === 'skipped') return anchor;
    const scheduledMinutes = parseHHMMToMinutes(anchor.scheduledTime);

    if (isPastDay) {
      return { ...anchor, status: 'missed' };
    }

    if (state.date === todayKey && nowMinutes > scheduledMinutes + 15) {
      return { ...anchor, status: 'missed' };
    }

    return { ...anchor, status: 'waiting' };
  });
}

export function normalizeDailyAnchorsStore(raw: unknown): DailyAnchorsStore {
  if (!raw || typeof raw !== 'object') {
    return { version: 1, templates: getDefaultAnchorTemplates(), states: {} };
  }

  const candidate = raw as { templates?: unknown; states?: unknown };
  const templates = normalizeAnchorTemplates(candidate.templates);
  const statesRecord =
    candidate.states && typeof candidate.states === 'object'
      ? (candidate.states as Record<string, unknown>)
      : {};

  const states: Record<string, DailyAnchorState> = {};
  for (const [dateKey, state] of Object.entries(statesRecord)) {
    states[dateKey] = normalizeDailyAnchorState(dateKey, state, templates);
  }

  return {
    version: 1,
    templates,
    states,
  };
}

const CHECKLIST_ANCHOR_TAGS_BY_ASSIGNMENT_ID: Record<string, AnchorId> = {};
const CHECKLIST_ANCHOR_TAGS_BY_ACTIVITY_ID: Record<string, AnchorId> = {};

export function getChecklistAnchorId(assignmentId: string, activityId: string): AnchorId | undefined {
  return CHECKLIST_ANCHOR_TAGS_BY_ASSIGNMENT_ID[assignmentId] || CHECKLIST_ANCHOR_TAGS_BY_ACTIVITY_ID[activityId];
}
