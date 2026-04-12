export type CleaningTaskType = 'clean' | 'reset' | 'replace';

export type CleaningCadencePreset =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'yearly';

export type CleaningCadence =
  | { kind: CleaningCadencePreset }
  | { kind: 'custom'; everyNDays: number };

export type CleaningZone = {
  id: string;
  label: string;
};

export type CleaningSubtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type CleaningTask = {
  id: string;
  title: string;
  zoneId: string;
  taskType: CleaningTaskType;
  cadence: CleaningCadence;
  notes?: string;
  lastCompletedAt?: string;
  startDate?: string;        // ISO date - task not due until this date
  estimatedMinutes?: number; // 5, 10, 15, 30, 60, etc.
  subtasks?: CleaningSubtask[]; // Break down big tasks into steps
  createdAt: string;
  updatedAt: string;
};

export type CleaningPlannerStore = {
  version: 1;
  tasks: CleaningTask[];
  zones: CleaningZone[];
};

export type CleaningTaskStatus = 'not-started' | 'due' | 'overdue' | 'upcoming' | 'future';

export const DEFAULT_CLEANING_ZONES: readonly CleaningZone[] = [
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'entry', label: 'Entry' },
  { id: 'whole-home', label: 'Whole Home' },
] as const;

export const CLEANING_TASK_TYPE_LABELS: Record<CleaningTaskType, string> = {
  clean: 'Clean',
  reset: 'Reset',
  replace: 'Replace',
};

export const CLEANING_CADENCE_LABELS: Record<CleaningCadencePreset, string> = {
  weekly: 'Every week',
  biweekly: 'Every 2 weeks',
  monthly: 'Every month',
  quarterly: 'Every 3 months',
  semiannual: 'Every 6 months',
  yearly: 'Every year',
};

export const EMPTY_CLEANING_PLANNER_STORE: CleaningPlannerStore = {
  version: 1,
  tasks: [],
  zones: [],
};

const TASK_TYPE_SET = new Set<CleaningTaskType>(['clean', 'reset', 'replace']);
const ZONE_ID_PATTERN = /^[a-z0-9-]+$/;

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function slugifyLabel(value: string): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeDateOnlyString(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const trimmed = value.trim();
  const datePartMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (datePartMatch) return datePartMatch[1];
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return undefined;
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function normalizeDateString(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function parseCleaningStartDate(value: string | undefined): Date | null {
  const datePart = normalizeDateOnlyString(value);
  if (!datePart) return null;
  const date = new Date(`${datePart}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonthsClamped(date: Date, months: number): Date {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  const endOfTargetMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, endOfTargetMonth));
  return next;
}

function cadenceToDays(cadence: CleaningCadence): number | null {
  switch (cadence.kind) {
    case 'weekly':
      return 7;
    case 'biweekly':
      return 14;
    case 'custom':
      return cadence.everyNDays;
    default:
      return null;
  }
}

function normalizeCadence(raw: unknown): CleaningCadence {
  if (!isPlainObject(raw)) return { kind: 'weekly' };
  const kind = raw.kind;
  if (kind === 'weekly' || kind === 'biweekly' || kind === 'monthly' || kind === 'quarterly' || kind === 'semiannual' || kind === 'yearly') {
    return { kind };
  }
  if (kind === 'custom') {
    const everyNDays =
      typeof raw.everyNDays === 'number' && Number.isFinite(raw.everyNDays)
        ? Math.max(1, Math.floor(raw.everyNDays))
        : 30;
    return { kind: 'custom', everyNDays };
  }
  return { kind: 'weekly' };
}

function normalizeZone(raw: unknown): CleaningZone | null {
  if (!isPlainObject(raw)) return null;
  const id = typeof raw.id === 'string' ? raw.id.trim() : '';
  const label = typeof raw.label === 'string' ? normalizeText(raw.label) : '';
  if (!id || !label || !ZONE_ID_PATTERN.test(id)) return null;
  return { id, label };
}

function normalizeSubtask(raw: unknown): CleaningSubtask | null {
  if (!isPlainObject(raw)) return null;
  const id = typeof raw.id === 'string' ? raw.id.trim() : '';
  const title = typeof raw.title === 'string' ? normalizeText(raw.title) : '';
  if (!id || !title) return null;
  return {
    id,
    title,
    completed: raw.completed === true,
  };
}

function normalizeTask(raw: unknown): CleaningTask | null {
  if (!isPlainObject(raw)) return null;
  const id = typeof raw.id === 'string' ? raw.id.trim() : '';
  const title = typeof raw.title === 'string' ? normalizeText(raw.title) : '';
  const zoneId = typeof raw.zoneId === 'string' ? raw.zoneId.trim() : '';
  const taskType = typeof raw.taskType === 'string' && TASK_TYPE_SET.has(raw.taskType as CleaningTaskType)
    ? (raw.taskType as CleaningTaskType)
    : 'clean';
  if (!id || !title || !zoneId) return null;
  const createdAt = normalizeDateString(raw.createdAt) ?? new Date().toISOString();
  const updatedAt = normalizeDateString(raw.updatedAt) ?? createdAt;
  const estimatedMinutes = typeof raw.estimatedMinutes === 'number' && Number.isFinite(raw.estimatedMinutes) && raw.estimatedMinutes > 0
    ? Math.floor(raw.estimatedMinutes)
    : undefined;
  const subtasks = Array.isArray(raw.subtasks)
    ? raw.subtasks.map(normalizeSubtask).filter((s): s is CleaningSubtask => s !== null)
    : undefined;
  return {
    id,
    title,
    zoneId,
    taskType,
    cadence: normalizeCadence(raw.cadence),
    notes: typeof raw.notes === 'string' && normalizeText(raw.notes) ? normalizeText(raw.notes) : undefined,
    lastCompletedAt: normalizeDateString(raw.lastCompletedAt),
    startDate: normalizeDateOnlyString(raw.startDate),
    estimatedMinutes,
    subtasks: subtasks && subtasks.length > 0 ? subtasks : undefined,
    createdAt,
    updatedAt,
  };
}

export function normalizeCleaningPlannerStore(raw: unknown): CleaningPlannerStore {
  if (!isPlainObject(raw)) return EMPTY_CLEANING_PLANNER_STORE;

  const zoneMap = new Map<string, CleaningZone>();
  for (const zone of DEFAULT_CLEANING_ZONES) {
    zoneMap.set(zone.id, zone);
  }

  const customZones = Array.isArray(raw.zones) ? raw.zones.map(normalizeZone).filter((zone): zone is CleaningZone => zone !== null) : [];
  for (const zone of customZones) {
    if (!zoneMap.has(zone.id)) zoneMap.set(zone.id, zone);
  }

  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks
        .map(normalizeTask)
        .filter((task): task is CleaningTask => task !== null)
        .filter((task) => zoneMap.has(task.zoneId))
        .sort((a, b) => {
          const zoneRank = getZoneRank(a.zoneId) - getZoneRank(b.zoneId);
          if (zoneRank !== 0) return zoneRank;
          return a.title.localeCompare(b.title);
        })
    : [];

  const usedCustomZoneIds = new Set(tasks.map((task) => task.zoneId).filter((zoneId) => !DEFAULT_CLEANING_ZONES.some((zone) => zone.id === zoneId)));
  const zones = customZones
    .filter((zone) => usedCustomZoneIds.has(zone.id))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    version: 1,
    tasks,
    zones,
  };
}

export function getZoneRank(zoneId: string): number {
  const defaultIndex = DEFAULT_CLEANING_ZONES.findIndex((zone) => zone.id === zoneId);
  return defaultIndex === -1 ? DEFAULT_CLEANING_ZONES.length + 100 : defaultIndex;
}

export function getAvailableCleaningZones(store: CleaningPlannerStore): CleaningZone[] {
  const seen = new Set<string>();
  const zones: CleaningZone[] = [];
  for (const zone of DEFAULT_CLEANING_ZONES) {
    if (seen.has(zone.id)) continue;
    seen.add(zone.id);
    zones.push(zone);
  }
  for (const zone of store.zones) {
    if (seen.has(zone.id)) continue;
    seen.add(zone.id);
    zones.push(zone);
  }
  return zones;
}

export function getCleaningZoneLabel(store: CleaningPlannerStore, zoneId: string): string {
  return getAvailableCleaningZones(store).find((zone) => zone.id === zoneId)?.label ?? 'Custom Zone';
}

export function formatCleaningCadence(cadence: CleaningCadence): string {
  return cadence.kind === 'custom' ? `Every ${cadence.everyNDays} days` : CLEANING_CADENCE_LABELS[cadence.kind];
}

export function formatEstimatedTime(minutes: number | undefined): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return hours === 1 ? '1 hour' : `${hours} hours`;
  return `${hours}h ${remainingMins}m`;
}

/** Human-friendly status labels (softer language for ADHD) */
export function getStatusLabel(status: CleaningTaskStatus): string {
  switch (status) {
    case 'not-started': return 'Starts later';
    case 'overdue': return 'Ready'; // Softer than "Overdue"
    case 'due': return 'Today';
    case 'upcoming': return 'Coming up';
    case 'future': return 'Scheduled';
  }
}

export function getNextDueDate(task: CleaningTask): Date | null {
  if (!task.lastCompletedAt) return null;
  const completedAt = new Date(task.lastCompletedAt);
  if (Number.isNaN(completedAt.getTime())) return null;
  const completedDay = startOfDay(completedAt);
  const cadenceDays = cadenceToDays(task.cadence);
  if (cadenceDays !== null) {
    return addDays(completedDay, cadenceDays);
  }
  switch (task.cadence.kind) {
    case 'monthly':
      return addMonthsClamped(completedDay, 1);
    case 'quarterly':
      return addMonthsClamped(completedDay, 3);
    case 'semiannual':
      return addMonthsClamped(completedDay, 6);
    case 'yearly':
      return addMonthsClamped(completedDay, 12);
    default:
      return null;
  }
}

export function getScheduledCleaningTaskDate(task: CleaningTask, now = new Date()): Date {
  const fallbackDate = startOfDay(now);
  const nextDueDate = getNextDueDate(task);
  const dueDate = nextDueDate ? startOfDay(nextDueDate) : null;
  const parsedStartDate = parseCleaningStartDate(task.startDate);
  const startDate = parsedStartDate ? startOfDay(parsedStartDate) : null;

  if (startDate && dueDate) {
    return startDate.getTime() > dueDate.getTime() ? startDate : dueDate;
  }

  return startDate ?? dueDate ?? fallbackDate;
}

export function getCleaningTaskStatus(task: CleaningTask, now = new Date(), upcomingWindowDays = 7): CleaningTaskStatus {
  const today = startOfDay(now);

  // Check if task hasn't started yet (startDate is in the future)
  if (task.startDate) {
    const parsedStartDate = parseCleaningStartDate(task.startDate);
    const start = parsedStartDate ? startOfDay(parsedStartDate) : null;
    if (start && start.getTime() > today.getTime()) {
      return 'not-started';
    }
  }

  const nextDueDate = getNextDueDate(task);
  if (!nextDueDate) return 'due'; // Never completed = due now (if past start date)

  const due = startOfDay(nextDueDate);
  if (due.getTime() < today.getTime()) return 'overdue';
  if (due.getTime() === today.getTime()) return 'due';

  const upcomingLimit = addDays(today, upcomingWindowDays);
  if (due.getTime() <= upcomingLimit.getTime()) return 'upcoming';
  return 'future';
}

export function isTaskDue(task: CleaningTask, now = new Date()): boolean {
  const status = getCleaningTaskStatus(task, now);
  return status === 'due' || status === 'overdue';
}

export function isTaskOverdue(task: CleaningTask, now = new Date()): boolean {
  return getCleaningTaskStatus(task, now) === 'overdue';
}

export function completeCleaningTask(task: CleaningTask, completedAt = new Date()): CleaningTask {
  const stamp = completedAt.toISOString();
  return {
    ...task,
    lastCompletedAt: stamp,
    updatedAt: stamp,
  };
}

export function sortCleaningTasks(tasks: CleaningTask[], now = new Date()): CleaningTask[] {
  const statusRank: Record<CleaningTaskStatus, number> = {
    overdue: 0,
    due: 1,
    upcoming: 2,
    future: 3,
    'not-started': 4,
  };
  return [...tasks].sort((a, b) => {
    const zoneRank = getZoneRank(a.zoneId) - getZoneRank(b.zoneId);
    if (zoneRank !== 0) return zoneRank;
    const taskStatusRank = statusRank[getCleaningTaskStatus(a, now)] - statusRank[getCleaningTaskStatus(b, now)];
    if (taskStatusRank !== 0) return taskStatusRank;
    const aDue = getNextDueDate(a)?.getTime() ?? Number.NEGATIVE_INFINITY;
    const bDue = getNextDueDate(b)?.getTime() ?? Number.NEGATIVE_INFINITY;
    if (aDue !== bDue) return aDue - bDue;
    return a.title.localeCompare(b.title);
  });
}

/** Sort tasks for focus mode: overdue first, then due, prioritize shorter time estimates */
export function sortTasksForFocus(tasks: CleaningTask[], now = new Date()): CleaningTask[] {
  return [...tasks]
    .filter((task) => {
      const status = getCleaningTaskStatus(task, now);
      return status === 'overdue' || status === 'due';
    })
    .sort((a, b) => {
      const statusA = getCleaningTaskStatus(a, now);
      const statusB = getCleaningTaskStatus(b, now);
      // Overdue before due
      if (statusA === 'overdue' && statusB !== 'overdue') return -1;
      if (statusB === 'overdue' && statusA !== 'overdue') return 1;
      // Shorter time estimates first (no estimate = treat as medium ~20 min)
      const timeA = a.estimatedMinutes ?? 20;
      const timeB = b.estimatedMinutes ?? 20;
      if (timeA !== timeB) return timeA - timeB;
      // Then by due date
      const aDue = getNextDueDate(a)?.getTime() ?? Number.NEGATIVE_INFINITY;
      const bDue = getNextDueDate(b)?.getTime() ?? Number.NEGATIVE_INFINITY;
      return aDue - bDue;
    });
}

export function createCleaningTask(input: {
  title: string;
  zoneId: string;
  taskType: CleaningTaskType;
  cadence: CleaningCadence;
  notes?: string;
  lastCompletedAt?: string;
  startDate?: string;
  estimatedMinutes?: number;
  subtasks?: string[]; // Just titles, we'll generate IDs
}): CleaningTask {
  const now = new Date().toISOString();
  const title = normalizeText(input.title);
  const subtasks = input.subtasks
    ?.map((s) => normalizeText(s))
    .filter((s) => s.length > 0)
    .map((s, i) => ({
      id: `step-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      title: s,
      completed: false,
    }));
  return {
    id: `clean-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    zoneId: input.zoneId,
    taskType: input.taskType,
    cadence: input.cadence.kind === 'custom'
      ? { kind: 'custom', everyNDays: Math.max(1, Math.floor(input.cadence.everyNDays)) }
      : { kind: input.cadence.kind },
    notes: input.notes && normalizeText(input.notes) ? normalizeText(input.notes) : undefined,
    lastCompletedAt: normalizeDateString(input.lastCompletedAt),
    startDate: normalizeDateOnlyString(input.startDate),
    estimatedMinutes: input.estimatedMinutes && input.estimatedMinutes > 0 ? Math.floor(input.estimatedMinutes) : undefined,
    subtasks: subtasks && subtasks.length > 0 ? subtasks : undefined,
    createdAt: now,
    updatedAt: now,
  };
}

/** Create a new subtask */
export function createSubtask(title: string): CleaningSubtask {
  return {
    id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: normalizeText(title),
    completed: false,
  };
}

/** Toggle a subtask's completion status */
export function toggleSubtask(task: CleaningTask, subtaskId: string): CleaningTask {
  if (!task.subtasks) return task;
  return {
    ...task,
    subtasks: task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    ),
    updatedAt: new Date().toISOString(),
  };
}

/** Add a subtask to a task */
export function addSubtask(task: CleaningTask, title: string): CleaningTask {
  const subtask = createSubtask(title);
  return {
    ...task,
    subtasks: [...(task.subtasks ?? []), subtask],
    updatedAt: new Date().toISOString(),
  };
}

/** Remove a subtask from a task */
export function removeSubtask(task: CleaningTask, subtaskId: string): CleaningTask {
  if (!task.subtasks) return task;
  const remaining = task.subtasks.filter((s) => s.id !== subtaskId);
  return {
    ...task,
    subtasks: remaining.length > 0 ? remaining : undefined,
    updatedAt: new Date().toISOString(),
  };
}

/** Get subtask completion progress */
export function getSubtaskProgress(task: CleaningTask): { completed: number; total: number; percent: number } | null {
  if (!task.subtasks || task.subtasks.length === 0) return null;
  const completed = task.subtasks.filter((s) => s.completed).length;
  const total = task.subtasks.length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function createCleaningZone(label: string): CleaningZone {
  const normalizedLabel = normalizeText(label);
  const slug = slugifyLabel(normalizedLabel) || 'custom-zone';
  return {
    id: `zone-${slug}`,
    label: normalizedLabel,
  };
}

export function ensureCleaningZone(store: CleaningPlannerStore, label: string): { store: CleaningPlannerStore; zone: CleaningZone } {
  const normalizedLabel = normalizeText(label);
  const existing = getAvailableCleaningZones(store).find((zone) => zone.label.toLowerCase() === normalizedLabel.toLowerCase());
  if (existing) {
    return { store, zone: existing };
  }
  const zone = createCleaningZone(normalizedLabel);
  return {
    store: {
      ...store,
      zones: [...store.zones, zone].sort((a, b) => a.label.localeCompare(b.label)),
    },
    zone,
  };
}

export function upsertCleaningTask(store: CleaningPlannerStore, task: CleaningTask): CleaningPlannerStore {
  const nextTasks = [...store.tasks];
  const index = nextTasks.findIndex((entry) => entry.id === task.id);
  if (index === -1) {
    nextTasks.push(task);
  } else {
    nextTasks[index] = task;
  }
  return {
    ...store,
    tasks: sortCleaningTasks(nextTasks),
  };
}

export function deleteCleaningTask(store: CleaningPlannerStore, taskId: string): CleaningPlannerStore {
  const remainingTasks = store.tasks.filter((task) => task.id !== taskId);
  const remainingZoneIds = new Set(remainingTasks.map((task) => task.zoneId));
  return {
    ...store,
    tasks: remainingTasks,
    zones: store.zones.filter((zone) => remainingZoneIds.has(zone.id)),
  };
}

// ============================================
// Zone & Status Color System (color-mix based)
// ============================================

export type ZoneColorScheme = {
  bg: string;
  text: string;
  border: string;
  dot: string;
};

export type StatusColorScheme = {
  bg: string;
  text: string;
  border: string;
};

/**
 * Sophisticated zone colors using CSS color-mix() for soft, readable tones.
 * Each zone has a distinct color identity while maintaining cohesion.
 */
export const CLEANING_ZONE_COLORS: Record<string, ZoneColorScheme> = {
  // Kitchen: Warm amber/golden tones
  kitchen: {
    bg: 'bg-[color-mix(in_srgb,var(--color-warning)_12%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-warning)_50%,var(--color-text-primary)_50%)]',
    border: 'border-[color-mix(in_srgb,var(--color-warning)_22%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-warning)_55%,var(--color-text-muted)_45%)]',
  },
  // Bathroom: Fresh teal/cyan tones
  bathroom: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-teal)_10%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-teal)_45%,var(--color-text-primary)_55%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-teal)_20%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-teal)_52%,var(--color-text-muted)_48%)]',
  },
  // Bedroom: Soft lavender/amethyst tones
  bedroom: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-amethyst)_10%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-amethyst)_42%,var(--color-text-primary)_58%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-amethyst)_18%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-amethyst)_50%,var(--color-text-muted)_50%)]',
  },
  // Laundry: Soft sakura/pink tones
  laundry: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-sakura)_10%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-sakura)_40%,var(--color-text-primary)_60%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-sakura)_18%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-sakura)_48%,var(--color-text-muted)_52%)]',
  },
  // Entry: Fresh mint/green tones
  entry: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-mint)_10%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-mint)_45%,var(--color-text-primary)_55%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-mint)_20%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-mint)_52%,var(--color-text-muted)_48%)]',
  },
  // Whole Home: Cool teal (lighter mix)
  'whole-home': {
    bg: 'bg-[color-mix(in_srgb,var(--color-info)_8%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-info)_38%,var(--color-text-primary)_62%)]',
    border: 'border-[color-mix(in_srgb,var(--color-info)_16%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-info)_45%,var(--color-text-muted)_55%)]',
  },
  // Default/Custom zones: Neutral warm tones
  default: {
    bg: 'bg-bg-elevated/60',
    text: 'text-text-secondary',
    border: 'border-border-subtle/60',
    dot: 'bg-text-muted/60',
  },
};

/**
 * Status colors for task urgency badges using color-mix() for softer appearance.
 */
export const CLEANING_STATUS_COLORS: Record<CleaningTaskStatus, StatusColorScheme> = {
  'not-started': {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-amethyst)_10%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-amethyst)_40%,var(--color-text-muted)_60%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-amethyst)_15%,var(--color-border-subtle))]',
  },
  overdue: {
    bg: 'bg-[color-mix(in_srgb,var(--color-error)_14%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-error)_55%,var(--color-text-primary)_45%)]',
    border: 'border-[color-mix(in_srgb,var(--color-error)_24%,var(--color-border-subtle))]',
  },
  due: {
    bg: 'bg-[color-mix(in_srgb,var(--color-warning)_16%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-warning)_58%,var(--color-text-primary)_42%)]',
    border: 'border-[color-mix(in_srgb,var(--color-warning)_26%,var(--color-border-subtle))]',
  },
  upcoming: {
    bg: 'bg-[color-mix(in_srgb,var(--color-info)_12%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-info)_45%,var(--color-text-primary)_55%)]',
    border: 'border-[color-mix(in_srgb,var(--color-info)_20%,var(--color-border-subtle))]',
  },
  future: {
    bg: 'bg-bg-elevated/50',
    text: 'text-text-muted',
    border: 'border-border-subtle/50',
  },
};

/**
 * Get zone color scheme by zone ID. Falls back to default for custom/unknown zones.
 */
export function getZoneColors(zoneId: string): ZoneColorScheme {
  return CLEANING_ZONE_COLORS[zoneId] ?? CLEANING_ZONE_COLORS['default'];
}

/**
 * Get status color scheme by task status.
 */
export function getStatusColors(status: CleaningTaskStatus): StatusColorScheme {
  return CLEANING_STATUS_COLORS[status];
}
