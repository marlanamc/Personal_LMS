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

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AnchorStatus = 'waiting' | 'done' | 'missed' | 'skipped';

export interface DailyAnchor {
  id: AnchorId;
  label: string;
  icon: AnchorIcon;
  scheduledTime: string;
  daysOfWeek?: DayOfWeek[];
  status: AnchorStatus;
  actualTime?: string;
}

export interface DailyAnchorTemplate {
  id: AnchorId;
  label: string;
  icon: AnchorIcon;
  scheduledTime: string;
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
  { id: 'lightsOut', label: 'Lights Out', icon: 'moon', scheduledTime: '23:00' },
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

function normalizeAnchorTemplate(raw: unknown, fallback?: DailyAnchorTemplate): DailyAnchorTemplate {
  const candidate = (raw && typeof raw === 'object' ? raw : {}) as {
    id?: unknown;
    label?: unknown;
    icon?: unknown;
    scheduledTime?: unknown;
    daysOfWeek?: unknown;
  };

  const fallbackId = fallback?.id ?? `anchor-${Date.now()}`;
  const id = sanitizeAnchorId(typeof candidate.id === 'string' ? candidate.id : fallbackId);

  const icon = VALID_ICONS.has(candidate.icon as AnchorIcon)
    ? (candidate.icon as AnchorIcon)
    : fallback?.icon || 'moon';

  const scheduledTime =
    typeof candidate.scheduledTime === 'string' && /^\d{2}:\d{2}$/.test(candidate.scheduledTime)
      ? candidate.scheduledTime
      : fallback?.scheduledTime || '08:00';

  const labelFromCandidate = typeof candidate.label === 'string' ? candidate.label.trim() : '';
  const label = labelFromCandidate || fallback?.label || 'Anchor';

  const daysOfWeek = normalizeDaysOfWeek(candidate.daysOfWeek) ?? fallback?.daysOfWeek;

  return {
    id,
    label,
    icon,
    scheduledTime,
    ...(daysOfWeek ? { daysOfWeek } : {}),
  };
}

function toStateAnchor(template: DailyAnchorTemplate, existing?: DailyAnchor): DailyAnchor {
  return {
    id: template.id,
    label: template.label,
    icon: template.icon,
    // Preserve per-day time overrides when a state anchor already exists.
    scheduledTime: existing?.scheduledTime ?? template.scheduledTime,
    ...(template.daysOfWeek ? { daysOfWeek: template.daysOfWeek } : {}),
    status: existing?.status ?? 'waiting',
    actualTime: existing?.actualTime,
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
    daysOfWeek?: unknown;
    status?: unknown;
    actualTime?: unknown;
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

  return {
    ...template,
    status,
    actualTime,
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
      return { ...anchor, status: 'waiting', actualTime: undefined };
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
