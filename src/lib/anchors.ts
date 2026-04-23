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
  | 'calendar'
  | 'utensils'
  | 'music'
  | 'users'
  | 'pen-tool'
  | 'zap'
  | 'brush'
  | 'shirt'
  | 'washing-machine';

export type AnchorColor = 'peach' | 'sky' | 'mint' | 'periwinkle' | 'lavender' | 'rose';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type AnchorStatus = 'waiting' | 'done' | 'missed' | 'skipped';
export type SkipReason = 'tired' | 'schedule_changed' | 'planned_break' | 'not_realistic' | 'low_energy' | 'sick' | 'other';

export interface DailyAnchorScheduleSlot {
  scheduledTime: string;
  endTime?: string;
}

export type WeeklyAnchorSchedule = Partial<Record<DayOfWeek, DailyAnchorScheduleSlot>>;

export interface DailyAnchor {
  id: AnchorId;
  label: string;
  icon: AnchorIcon;
  color?: AnchorColor;
  importanceNote?: string;
  scheduledTime: string;
  endTime?: string;
  weeklySchedule?: WeeklyAnchorSchedule;
  status: AnchorStatus;
  actualTime?: string;
  skipReason?: SkipReason;
  isTimeOverridden?: boolean;
  /** Copied from template - start of active range */
  activeFrom?: string;
  /** Copied from template - end of active range */
  activeUntil?: string;
  /** Copied from template - start of a temporary pause window */
  pausedFrom?: string;
  /** Copied from template - end of a temporary pause window */
  pausedUntil?: string;
  /** Copied from template - linked project ID */
  linkedProjectId?: string;
}

export interface DailyAnchorTemplate {
  id: AnchorId;
  label: string;
  icon: AnchorIcon;
  color?: AnchorColor;
  importanceNote?: string;
  weeklySchedule: WeeklyAnchorSchedule;
  /** Optional start date (YYYY-MM-DD) - anchor only active from this date */
  activeFrom?: string;
  /** Optional end date (YYYY-MM-DD) - anchor only active until this date */
  activeUntil?: string;
  /** Optional start date (YYYY-MM-DD) - anchor is temporarily paused from this date */
  pausedFrom?: string;
  /** Optional end date (YYYY-MM-DD) - anchor resumes after this date */
  pausedUntil?: string;
  /** Optional link to a project ID if created from project planner */
  linkedProjectId?: string;
}

export interface DailyAnchorState {
  date: string;
  anchors: DailyAnchor[];
  sleepRhythmDayComplete: boolean;
}

export interface DailyAnchorsStore {
  version: 2;
  templates: DailyAnchorTemplate[];
  states: Record<string, DailyAnchorState>;
}

const DEFAULT_WEEKLY_SCHEDULE: WeeklyAnchorSchedule = {
  0: { scheduledTime: '08:00' },
  1: { scheduledTime: '08:00' },
  2: { scheduledTime: '08:00' },
  3: { scheduledTime: '08:00' },
  4: { scheduledTime: '08:00' },
  5: { scheduledTime: '08:00' },
  6: { scheduledTime: '08:00' },
};

export const DEFAULT_DAILY_ANCHOR_TEMPLATES: DailyAnchorTemplate[] = [
  { id: 'wake', label: 'Wake', icon: 'sunrise', weeklySchedule: buildUniformWeeklySchedule('08:00') },
  { id: 'gym', label: 'Gym', icon: 'dumbbell', weeklySchedule: buildUniformWeeklySchedule('09:00') },
  { id: 'job', label: 'Job Block', icon: 'briefcase', weeklySchedule: buildUniformWeeklySchedule('11:00') },
  { id: 'lightsOut', label: 'Bedtime', icon: 'moon', weeklySchedule: buildUniformWeeklySchedule('23:00') },
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
  'utensils',
  'music',
  'users',
  'pen-tool',
  'zap',
  'brush',
  'shirt',
  'washing-machine',
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

const HHMM_REGEX = /^\d{2}:\d{2}$/;

export function buildUniformWeeklySchedule(scheduledTime: string, endTime?: string): WeeklyAnchorSchedule {
  return {
    0: { scheduledTime, ...(endTime ? { endTime } : {}) },
    1: { scheduledTime, ...(endTime ? { endTime } : {}) },
    2: { scheduledTime, ...(endTime ? { endTime } : {}) },
    3: { scheduledTime, ...(endTime ? { endTime } : {}) },
    4: { scheduledTime, ...(endTime ? { endTime } : {}) },
    5: { scheduledTime, ...(endTime ? { endTime } : {}) },
    6: { scheduledTime, ...(endTime ? { endTime } : {}) },
  };
}

export function getDefaultAnchorColor(icon: AnchorIcon): AnchorColor {
  if (icon === 'sunrise' || icon === 'coffee' || icon === 'utensils' || icon === 'zap') return 'peach';
  if (icon === 'briefcase' || icon === 'code' || icon === 'pen-tool') return 'sky';
  if (icon === 'dumbbell' || icon === 'flower-2' || icon === 'users') return 'mint';
  if (icon === 'book-open' || icon === 'calendar' || icon === 'music') return 'periwinkle';
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

export function getAnchorColorPalette(color: AnchorColor | undefined, icon: AnchorIcon): AnchorColorPalette {
  return ANCHOR_COLOR_PALETTES[resolveAnchorColor(color, icon)];
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

function normalizeImportanceNote(raw: unknown, fallback?: string): string | undefined {
  if (typeof raw === 'string') {
    const note = raw.trim();
    return note ? note.slice(0, 240) : undefined;
  }
  return fallback;
}

export function parseHHMMToMinutes(input: string): number {
  const [rawH = '0', rawM = '0'] = input.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

function normalizeEndTime(raw: unknown, scheduledTime: string, fallback?: string): string | undefined {
  if (raw === undefined || raw === null || raw === '') return fallback;
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!HHMM_REGEX.test(value)) return fallback;
  if (parseHHMMToMinutes(value) <= parseHHMMToMinutes(scheduledTime)) return fallback;
  return value;
}

function normalizeScheduleSlot(raw: unknown, fallback?: DailyAnchorScheduleSlot): DailyAnchorScheduleSlot | undefined {
  if (!raw || typeof raw !== 'object') return fallback;
  const candidate = raw as { scheduledTime?: unknown; endTime?: unknown };
  const scheduledTime =
    typeof candidate.scheduledTime === 'string' && HHMM_REGEX.test(candidate.scheduledTime)
      ? candidate.scheduledTime
      : fallback?.scheduledTime;

  if (!scheduledTime) return fallback;

  const endTime = normalizeEndTime(candidate.endTime, scheduledTime, fallback?.endTime);
  return {
    scheduledTime,
    ...(endTime ? { endTime } : {}),
  };
}

function normalizeDaysOfWeek(raw: unknown): DayOfWeek[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const values = raw
    .map((day) => Number(day))
    .filter((day): day is DayOfWeek => Number.isInteger(day) && day >= 0 && day <= 6);

  if (values.length === 0) return undefined;
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

export function normalizeWeeklySchedule(
  raw: unknown,
  fallback?: WeeklyAnchorSchedule,
  legacy?: { scheduledTime?: unknown; endTime?: unknown; daysOfWeek?: unknown },
): WeeklyAnchorSchedule {
  const result: WeeklyAnchorSchedule = {};
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null;

  if (source) {
    // Only include days explicitly present on `source`. Missing keys mean "off" for that weekday.
    // Previously we passed `undefined` into normalizeScheduleSlot, which returned `fallbackSlot` and
    // re-added days from default templates after save (e.g. user clears Tuesday, it came back).
    for (const day of [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]) {
      const key = String(day);
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      const rawDay = source[key];
      if (rawDay === null || rawDay === undefined) continue;

      const fallbackSlot = fallback?.[day];
      const normalized = normalizeScheduleSlot(rawDay, fallbackSlot);
      if (normalized) {
        result[day] = normalized;
      }
    }
    if (Object.keys(result).length > 0) {
      return result;
    }
  }

  const legacyTime =
    typeof legacy?.scheduledTime === 'string' && HHMM_REGEX.test(legacy.scheduledTime)
      ? legacy.scheduledTime
      : undefined;
  const fallbackTime = getFirstScheduledSlot(fallback)?.scheduledTime;
  const scheduledTime = legacyTime ?? fallbackTime ?? '08:00';
  const endTime = normalizeEndTime(legacy?.endTime, scheduledTime, getFirstScheduledSlot(fallback)?.endTime);
  const activeDays = normalizeDaysOfWeek(legacy?.daysOfWeek) ?? ([0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]);

  for (const day of activeDays) {
    result[day] = { scheduledTime, ...(endTime ? { endTime } : {}) };
  }

  if (Object.keys(result).length > 0) {
    return result;
  }

  if (fallback && Object.keys(fallback).length > 0) {
    return cloneWeeklyScheduleInternal(fallback);
  }

  return { ...DEFAULT_WEEKLY_SCHEDULE };
}

function cloneWeeklyScheduleInternal(schedule: WeeklyAnchorSchedule): WeeklyAnchorSchedule {
  const next: WeeklyAnchorSchedule = {};
  for (const day of [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]) {
    if (schedule[day]) {
      next[day] = { ...schedule[day]! };
    }
  }
  return next;
}

function getFirstScheduledSlot(schedule?: WeeklyAnchorSchedule): DailyAnchorScheduleSlot | undefined {
  if (!schedule) return undefined;
  for (const day of [0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]) {
    if (schedule[day]) return schedule[day];
  }
  return undefined;
}

function resolveTemplateDefaultTime(template: DailyAnchorTemplate): DailyAnchorScheduleSlot {
  return getFirstScheduledSlot(template.weeklySchedule) ?? { scheduledTime: '08:00' };
}

export function resolveAnchorTemplateForDate(
  template: Pick<DailyAnchorTemplate, 'weeklySchedule'>,
  date: Date,
): DailyAnchorScheduleSlot | null {
  return template.weeklySchedule[date.getDay() as DayOfWeek] ?? null;
}

const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function normalizeAnchorTemplate(raw: unknown, fallback?: DailyAnchorTemplate): DailyAnchorTemplate {
  const candidate = (raw && typeof raw === 'object' ? raw : {}) as {
    id?: unknown;
    label?: unknown;
    icon?: unknown;
    color?: unknown;
    importanceNote?: unknown;
    weeklySchedule?: unknown;
    scheduledTime?: unknown;
    endTime?: unknown;
    daysOfWeek?: unknown;
    durationMinutes?: unknown;
    activeFrom?: unknown;
    activeUntil?: unknown;
    pausedFrom?: unknown;
    pausedUntil?: unknown;
    linkedProjectId?: unknown;
  };

  const fallbackId = fallback?.id ?? `anchor-${Date.now()}`;
  const id = sanitizeAnchorId(typeof candidate.id === 'string' ? candidate.id : fallbackId);
  const icon = VALID_ICONS.has(candidate.icon as AnchorIcon)
    ? (candidate.icon as AnchorIcon)
    : fallback?.icon ?? 'moon';
  const color = normalizeAnchorColor(candidate.color, fallback?.color);
  const label = (typeof candidate.label === 'string' ? candidate.label.trim() : '') || fallback?.label || 'Anchor';
  const importanceNote = normalizeImportanceNote(candidate.importanceNote, fallback?.importanceNote);
  const weeklySchedule = normalizeWeeklySchedule(candidate.weeklySchedule, fallback?.weeklySchedule, {
    scheduledTime: candidate.scheduledTime,
    endTime: candidate.endTime,
    daysOfWeek: candidate.daysOfWeek,
  });

  // Handle date range fields
  const activeFrom =
    typeof candidate.activeFrom === 'string' && DATE_KEY_REGEX.test(candidate.activeFrom)
      ? candidate.activeFrom
      : fallback?.activeFrom;
  const activeUntil =
    typeof candidate.activeUntil === 'string' && DATE_KEY_REGEX.test(candidate.activeUntil)
      ? candidate.activeUntil
      : fallback?.activeUntil;
  const pausedFrom =
    typeof candidate.pausedFrom === 'string' && DATE_KEY_REGEX.test(candidate.pausedFrom)
      ? candidate.pausedFrom
      : fallback?.pausedFrom;
  const pausedUntil =
    typeof candidate.pausedUntil === 'string' && DATE_KEY_REGEX.test(candidate.pausedUntil)
      ? candidate.pausedUntil
      : fallback?.pausedUntil;
  const linkedProjectId =
    typeof candidate.linkedProjectId === 'string' && candidate.linkedProjectId.trim()
      ? candidate.linkedProjectId.trim()
      : fallback?.linkedProjectId;

  return {
    id,
    label,
    icon,
    ...(color ? { color } : {}),
    ...(importanceNote ? { importanceNote } : {}),
    weeklySchedule,
    ...(activeFrom ? { activeFrom } : {}),
    ...(activeUntil ? { activeUntil } : {}),
    ...(pausedFrom ? { pausedFrom } : {}),
    ...(pausedUntil ? { pausedUntil } : {}),
    ...(linkedProjectId ? { linkedProjectId } : {}),
  };
}

export function getDefaultAnchorTemplates(): DailyAnchorTemplate[] {
  return DEFAULT_DAILY_ANCHOR_TEMPLATES.map((template) => ({
    ...template,
    weeklySchedule: { ...template.weeklySchedule },
  }));
}

function didLegacyStateOverrideTime(
  existing: { scheduledTime?: string; endTime?: string; isTimeOverridden?: boolean; weeklySchedule?: WeeklyAnchorSchedule },
  template: DailyAnchorTemplate,
  date: Date,
): boolean {
  if (existing.isTimeOverridden) return true;
  const previousWeeklySchedule = existing.weeklySchedule ?? template.weeklySchedule;
  const slot =
    resolveAnchorTemplateForDate({ weeklySchedule: previousWeeklySchedule }, date) ??
    getFirstScheduledSlot(previousWeeklySchedule);
  if (!slot) return false;
  return existing.scheduledTime !== slot.scheduledTime || (existing.endTime ?? undefined) !== (slot.endTime ?? undefined);
}

function toStateAnchor(template: DailyAnchorTemplate, date: Date, existing?: DailyAnchor): DailyAnchor {
  const resolvedSlot = resolveAnchorTemplateForDate(template, date);
  const fallbackSlot = resolveTemplateDefaultTime(template);
  const templateSlot = resolvedSlot ?? fallbackSlot;
  const shouldPreserveOverride = existing ? didLegacyStateOverrideTime(existing, template, date) : false;
  const scheduledTime = shouldPreserveOverride ? existing!.scheduledTime : templateSlot.scheduledTime;
  const endTime = shouldPreserveOverride ? existing!.endTime : templateSlot.endTime;

  return {
    id: template.id,
    label: template.label,
    icon: template.icon,
    ...(template.color ? { color: template.color } : {}),
    ...(template.importanceNote ? { importanceNote: template.importanceNote } : {}),
    weeklySchedule: template.weeklySchedule,
    scheduledTime: scheduledTime ?? templateSlot.scheduledTime,
    ...(endTime ? { endTime } : {}),
    status: existing?.status ?? 'waiting',
    actualTime: existing?.actualTime,
    skipReason: existing?.skipReason,
    ...(shouldPreserveOverride ? { isTimeOverridden: true } : existing?.isTimeOverridden ? { isTimeOverridden: true } : {}),
    ...(template.activeFrom ? { activeFrom: template.activeFrom } : {}),
    ...(template.activeUntil ? { activeUntil: template.activeUntil } : {}),
    ...(template.pausedFrom ? { pausedFrom: template.pausedFrom } : {}),
    ...(template.pausedUntil ? { pausedUntil: template.pausedUntil } : {}),
    ...(template.linkedProjectId ? { linkedProjectId: template.linkedProjectId } : {}),
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

export function formatTimeLabel(time: string): string {
  const [rawH = '0', rawM = '00'] = time.split(':');
  const h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatTimeRange(startTime: string, endTime: string, short = false): string {
  const start = formatTimeLabel(startTime);
  const end = formatTimeLabel(endTime);
  if (short) {
    const [rawH1, rawM1] = startTime.split(':').map(Number);
    const [rawH2, rawM2] = endTime.split(':').map(Number);
    const p1 = rawH1 >= 12 ? 'PM' : 'AM';
    const p2 = rawH2 >= 12 ? 'PM' : 'AM';
    const h1 = rawH1 % 12 || 12;
    const h2 = rawH2 % 12 || 12;
    if (p1 === p2 && rawM1 === 0 && rawM2 === 0) return `${h1}–${h2} ${p1}`;
    if (p1 === p2) return `${h1}:${String(rawM1).padStart(2, '0')}–${h2}:${String(rawM2).padStart(2, '0')} ${p1}`;
    return `${h1}:${String(rawM1).padStart(2, '0')} ${p1} – ${h2}:${String(rawM2).padStart(2, '0')} ${p2}`;
  }
  return `${start} – ${end}`;
}

export function formatIsoTimeLabel(isoTime?: string): string | null {
  if (!isoTime) return null;
  const parsed = new Date(isoTime);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function isAnchorScheduledForDate(
  anchor: Pick<DailyAnchor, 'weeklySchedule'> | Pick<DailyAnchorTemplate, 'weeklySchedule'>,
  date: Date,
): boolean {
  return Boolean(anchor.weeklySchedule?.[date.getDay() as DayOfWeek]);
}

/**
 * Check if a template is within its active date range (if any)
 */
export function isTemplateActiveForDate(
  template: Pick<DailyAnchorTemplate, 'activeFrom' | 'activeUntil' | 'pausedFrom' | 'pausedUntil'>,
  dateKey: string,
): boolean {
  if (template.activeFrom && dateKey < template.activeFrom) return false;
  if (template.activeUntil && dateKey > template.activeUntil) return false;
  if (template.pausedFrom && template.pausedUntil && dateKey >= template.pausedFrom && dateKey <= template.pausedUntil) return false;
  return true;
}

export function getRecentSkippedAnchorStreak(
  anchors: Pick<DailyAnchor, 'status' | 'scheduledTime'>[],
  nowMinutes?: number | null,
): number {
  const processedAnchors = anchors.filter(
    (anchor) =>
      anchor.status !== 'waiting' ||
      nowMinutes === null ||
      nowMinutes === undefined ||
      parseHHMMToMinutes(anchor.scheduledTime) <= nowMinutes,
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
  if (reason === 'planned_break') return 'you were on a break';
  if (reason === 'not_realistic') return 'the plan felt unrealistic';
  if (reason === 'low_energy') return 'your energy was low';
  if (reason === 'sick') return 'you were sick';
  return 'something else got in the way';
}

export function getSkipReasonSuggestion(reason: SkipReason): string {
  if (reason === 'tired' || reason === 'low_energy') return 'Work on sleep or move that anchor later.';
  if (reason === 'schedule_changed') return 'The timing may need a new default.';
  if (reason === 'planned_break') return 'If this was temporary, no retime is needed. Just pick back up next week.';
  if (reason === 'not_realistic') return 'Shrink the anchor or make the block easier to start.';
  if (reason === 'sick') return 'Keep a lighter fallback version for low-capacity days.';
  return 'Review whether that anchor still fits the week you actually have.';
}

export function getTopWeeklySkipReasonInsight(weekStates: DailyAnchorState[]): WeeklySkipReasonInsight | null {
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
    .map((item, idx) => {
      const candidate = (item && typeof item === 'object' ? item : {}) as { id?: unknown };
      const candidateId = typeof candidate.id === 'string' ? sanitizeAnchorId(candidate.id) : undefined;
      const fallback = candidateId ? defaults.find((template) => template.id === candidateId) : defaults[idx];
      return normalizeAnchorTemplate(item, fallback);
    })
    .filter((template, idx, arr) => arr.findIndex((entry) => entry.id === template.id) === idx);

  return normalized.length > 0 ? normalized : defaults;
}

export function createDefaultDailyAnchorState(
  dateKey: string,
  templates: DailyAnchorTemplate[] = getDefaultAnchorTemplates(),
): DailyAnchorState {
  const date = dateKeyToDate(dateKey);
  return {
    date: dateKey,
    anchors: templates.map((template) => ({ ...toStateAnchor(template, date), status: 'waiting', actualTime: undefined })),
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

function normalizeAnchor(
  dateKey: string,
  raw: unknown,
  fallbackTemplate?: DailyAnchorTemplate,
): DailyAnchor {
  const candidate = (raw && typeof raw === 'object' ? raw : {}) as {
    id?: unknown;
    label?: unknown;
    icon?: unknown;
    color?: unknown;
    importanceNote?: unknown;
    scheduledTime?: unknown;
    endTime?: unknown;
    weeklySchedule?: unknown;
    daysOfWeek?: unknown;
    status?: unknown;
    actualTime?: unknown;
    skipReason?: unknown;
    isComplete?: unknown;
    actualStartTime?: unknown;
    isTimeOverridden?: unknown;
  };

  const template = normalizeAnchorTemplate(candidate, fallbackTemplate);
  const date = dateKeyToDate(dateKey);
  const resolvedSlot = resolveAnchorTemplateForDate(template, date) ?? resolveTemplateDefaultTime(template);

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
    skipReasonCandidate === 'planned_break' ||
    skipReasonCandidate === 'not_realistic' ||
    skipReasonCandidate === 'low_energy' ||
    skipReasonCandidate === 'sick' ||
    skipReasonCandidate === 'other'
      ? skipReasonCandidate
      : undefined;

  const scheduledTime =
    typeof candidate.scheduledTime === 'string' && HHMM_REGEX.test(candidate.scheduledTime)
      ? candidate.scheduledTime
      : resolvedSlot.scheduledTime;
  const endTime = normalizeEndTime(candidate.endTime, scheduledTime, resolvedSlot.endTime);

  return {
    id: template.id,
    label: template.label,
    icon: template.icon,
    ...(template.color ? { color: template.color } : {}),
    ...(template.importanceNote ? { importanceNote: template.importanceNote } : {}),
    weeklySchedule: template.weeklySchedule,
    scheduledTime,
    ...(endTime ? { endTime } : {}),
    status,
    actualTime,
    skipReason,
    ...(candidate.isTimeOverridden === true || didLegacyStateOverrideTime({ scheduledTime, endTime }, template, date)
      ? { isTimeOverridden: true }
      : {}),
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
  // Filter templates to only those active for this date
  const activeTemplates = templates.filter((t) => isTemplateActiveForDate(t, dateKey));

  const fallback = createDefaultDailyAnchorState(dateKey, activeTemplates);
  if (!raw || typeof raw !== 'object') return fallback;

  const candidate = raw as { date?: unknown; anchors?: unknown[]; sleepRhythmDayComplete?: unknown };
  const sourceAnchors = Array.isArray(candidate.anchors) ? candidate.anchors : [];
  const templatesById = new Map(activeTemplates.map((template) => [template.id, template]));
  const date = dateKeyToDate(dateKey);

  const anchors =
    sourceAnchors.length > 0
      ? sourceAnchors
          .map((rawAnchor) => {
            const anchorObj = (rawAnchor && typeof rawAnchor === 'object' ? rawAnchor : {}) as { id?: unknown };
            const id = typeof anchorObj.id === 'string' ? sanitizeAnchorId(anchorObj.id) : undefined;
            return normalizeAnchor(dateKey, rawAnchor, id ? templatesById.get(id) : undefined);
          })
          .filter((anchor, idx, arr) => arr.findIndex((entry) => entry.id === anchor.id) === idx)
      : activeTemplates.map((template) => toStateAnchor(template, date));

  const existingById = new Map(anchors.map((anchor) => [anchor.id, anchor]));
  const mergedAnchors = activeTemplates.map((template) => toStateAnchor(template, date, existingById.get(template.id)));

  const tentativeState: DailyAnchorState = {
    date: typeof candidate.date === 'string' ? candidate.date : dateKey,
    anchors: mergedAnchors,
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
  const date = dateKeyToDate(state.date);

  // Filter templates to only those active for this date
  const activeTemplates = templates.filter((t) => isTemplateActiveForDate(t, state.date));
  const anchors = activeTemplates.map((template) => toStateAnchor(template, date, existingById.get(template.id)));

  const nextStateBase: DailyAnchorState = {
    ...state,
    anchors,
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
    const slot = resolveAnchorTemplateForDate(fallback, now) ?? resolveTemplateDefaultTime(fallback);
    return {
      ...fallback,
      scheduledTime: slot.scheduledTime,
      ...(slot.endTime ? { endTime: slot.endTime } : {}),
      status: 'waiting',
    };
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...anchors].sort((a, b) => parseHHMMToMinutes(a.scheduledTime) - parseHHMMToMinutes(b.scheduledTime));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (nowMinutes < parseHHMMToMinutes(first.scheduledTime)) return first;

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const current = sorted[i];
    const next = sorted[i + 1];
    if (nowMinutes >= parseHHMMToMinutes(current.scheduledTime) && nowMinutes < parseHHMMToMinutes(next.scheduledTime)) {
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
    if (!isAnchorScheduledForDate(anchor, stateDate)) {
      return { ...anchor, status: 'waiting', actualTime: undefined, skipReason: undefined };
    }
    if (anchor.status === 'done' || anchor.status === 'skipped') return anchor;

    const scheduledMinutes = parseHHMMToMinutes(anchor.scheduledTime);
    if (isPastDay) return { ...anchor, status: 'missed' };
    if (state.date === todayKey && nowMinutes > scheduledMinutes + 15) {
      return { ...anchor, status: 'missed' };
    }
    return { ...anchor, status: 'waiting' };
  });
}

export function normalizeDailyAnchorsStore(raw: unknown): DailyAnchorsStore {
  if (!raw || typeof raw !== 'object') {
    return { version: 2, templates: getDefaultAnchorTemplates(), states: {} };
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
    version: 2,
    templates,
    states,
  };
}

const CHECKLIST_ANCHOR_TAGS_BY_ASSIGNMENT_ID: Record<string, AnchorId> = {};
const CHECKLIST_ANCHOR_TAGS_BY_ACTIVITY_ID: Record<string, AnchorId> = {};

export function getChecklistAnchorId(assignmentId: string, activityId: string): AnchorId | undefined {
  return CHECKLIST_ANCHOR_TAGS_BY_ASSIGNMENT_ID[assignmentId] || CHECKLIST_ANCHOR_TAGS_BY_ACTIVITY_ID[activityId];
}
