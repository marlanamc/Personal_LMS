import { dateKeyToDate, toDateKey, type DateKey } from '@/lib/unified-scheduler';

// Re-export DateKey for convenience
export type { DateKey } from '@/lib/unified-scheduler';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectId = string;
export type ProjectTaskId = string;

export type ProjectStatus = 'active' | 'completed' | 'paused' | 'archived';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface ProjectTask {
  id: ProjectTaskId;
  text: string;
  notes?: string;
  scheduledDate?: DateKey; // YYYY-MM-DD
  estimatedMinutes?: number; // 15, 30, 45, 60, 90, 120
  status: TaskStatus;
  completedAt?: string; // ISO timestamp
  order: number;
  category?: string; // e.g., "Kitchen", "Bathroom"
}

export interface Project {
  id: ProjectId;
  name: string;
  description?: string;
  emoji?: string; // e.g., "🏠", "📚"
  startDate: DateKey;
  endDate: DateKey;
  status: ProjectStatus;
  tasks: ProjectTask[];
  categories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPlannerStore {
  projects: Project[];
  recentEmojis: string[];
  version: 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const EMPTY_PROJECT_PLANNER_STORE: ProjectPlannerStore = {
  projects: [],
  recentEmojis: [],
  version: 1,
};

export const TASK_DURATION_OPTIONS = [
  { value: 15, label: '15m' },
  { value: 30, label: '30m' },
  { value: 45, label: '45m' },
  { value: 60, label: '1h' },
  { value: 90, label: '1.5h' },
  { value: 120, label: '2h' },
] as const;

export const PROJECT_DURATION_PRESETS = [
  { days: 7, label: '1 week' },
  { days: 14, label: '2 weeks' },
  { days: 21, label: '3 weeks' },
  { days: 30, label: '1 month' },
] as const;

export const DEFAULT_EMOJIS = [
  '🏠', '📚', '💻', '🎨', '🏃', '🍳', '🧹', '📝',
  '🎯', '💪', '🌱', '✨', '🔧', '📦', '🎸', '🧘',
];

const PROJECT_STATUSES = new Set<ProjectStatus>(['active', 'completed', 'paused', 'archived']);
const TASK_STATUSES = new Set<TaskStatus>(['pending', 'in_progress', 'completed', 'skipped']);

// ─────────────────────────────────────────────────────────────────────────────
// Normalization
// ─────────────────────────────────────────────────────────────────────────────

function isValidDateKey(s: unknown): s is DateKey {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function normalizeProjectStatus(raw: unknown): ProjectStatus {
  if (typeof raw === 'string' && PROJECT_STATUSES.has(raw as ProjectStatus)) {
    return raw as ProjectStatus;
  }
  return 'active';
}

function normalizeTaskStatus(raw: unknown): TaskStatus {
  if (typeof raw === 'string' && TASK_STATUSES.has(raw as TaskStatus)) {
    return raw as TaskStatus;
  }
  return 'pending';
}

function normalizeTask(raw: unknown): ProjectTask | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;

  const id = typeof o.id === 'string' ? o.id : '';
  const text = typeof o.text === 'string' ? o.text.trim() : '';
  if (!id || !text) return null;

  return {
    id,
    text,
    notes: typeof o.notes === 'string' && o.notes.trim() ? o.notes.trim() : undefined,
    scheduledDate: isValidDateKey(o.scheduledDate) ? o.scheduledDate : undefined,
    estimatedMinutes: typeof o.estimatedMinutes === 'number' && o.estimatedMinutes > 0
      ? o.estimatedMinutes
      : undefined,
    status: normalizeTaskStatus(o.status),
    completedAt: typeof o.completedAt === 'string' ? o.completedAt : undefined,
    order: typeof o.order === 'number' ? o.order : 0,
    category: typeof o.category === 'string' && o.category.trim() ? o.category.trim() : undefined,
  };
}

function normalizeProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;

  const id = typeof o.id === 'string' ? o.id : '';
  const name = typeof o.name === 'string' ? o.name.trim() : '';
  if (!id || !name) return null;

  const startDate = isValidDateKey(o.startDate) ? o.startDate : toDateKey(new Date());
  const endDate = isValidDateKey(o.endDate) ? o.endDate : addDaysToDateKey(startDate, 14);

  const tasks = Array.isArray(o.tasks)
    ? o.tasks.map(normalizeTask).filter((t): t is ProjectTask => t !== null)
    : [];

  const categories = Array.isArray(o.categories)
    ? o.categories.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    : undefined;

  return {
    id,
    name,
    description: typeof o.description === 'string' && o.description.trim()
      ? o.description.trim()
      : undefined,
    emoji: typeof o.emoji === 'string' ? o.emoji : undefined,
    startDate,
    endDate,
    status: normalizeProjectStatus(o.status),
    tasks,
    categories: categories && categories.length > 0 ? categories : undefined,
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : new Date().toISOString(),
  };
}

export function normalizeProjectPlannerStore(raw: unknown): ProjectPlannerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...EMPTY_PROJECT_PLANNER_STORE };
  }
  const o = raw as Record<string, unknown>;

  const projects = Array.isArray(o.projects)
    ? o.projects.map(normalizeProject).filter((p): p is Project => p !== null)
    : [];

  const recentEmojis = Array.isArray(o.recentEmojis)
    ? o.recentEmojis.filter((e): e is string => typeof e === 'string').slice(0, 20)
    : [];

  return {
    projects,
    recentEmojis,
    version: 1,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────────────────

export function addDaysToDateKey(dateKey: DateKey, days: number): DateKey {
  const d = dateKeyToDate(dateKey);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function getDaysBetween(startKey: DateKey, endKey: DateKey): number {
  const start = dateKeyToDate(startKey);
  const end = dateKeyToDate(endKey);
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
}

export function getDateKeysBetween(startKey: DateKey, endKey: DateKey): DateKey[] {
  const days = getDaysBetween(startKey, endKey);
  return Array.from({ length: days }, (_, i) => addDaysToDateKey(startKey, i));
}

export function isDateKeyInRange(dateKey: DateKey, startKey: DateKey, endKey: DateKey): boolean {
  return dateKey >= startKey && dateKey <= endKey;
}

export function formatDateRange(startKey: DateKey, endKey: DateKey): string {
  const start = dateKeyToDate(startKey);
  const end = dateKeyToDate(endKey);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yOpts: Intl.DateTimeFormatOptions = { ...opts, year: 'numeric' };
  const sameYear = start.getFullYear() === end.getFullYear();
  const a = start.toLocaleDateString(undefined, sameYear ? opts : yOpts);
  const b = end.toLocaleDateString(undefined, yOpts);
  return `${a} – ${b}`;
}

export function formatShortDate(dateKey: DateKey): string {
  const d = dateKeyToDate(dateKey);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────
// Project helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getProjectProgress(project: Project): number {
  if (project.tasks.length === 0) return 0;
  const completed = project.tasks.filter(t => t.status === 'completed' || t.status === 'skipped').length;
  return Math.round((completed / project.tasks.length) * 100);
}

export function getDaysRemaining(project: Project, todayKey: DateKey): number {
  if (todayKey > project.endDate) return 0;
  return getDaysBetween(todayKey, project.endDate);
}

export function getTasksForDate(project: Project, dateKey: DateKey): ProjectTask[] {
  return project.tasks
    .filter(t => t.scheduledDate === dateKey)
    .sort((a, b) => {
      // Completed last, then by order
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return a.order - b.order;
    });
}

/**
 * Calendar display: tasks scheduled on this day, plus a preview spread of tasks that
 * still have no `scheduledDate` (same even distribution as template creation) so the
 * month grid reflects workload before dates are assigned.
 */
export function getTasksForCalendarDate(project: Project, dateKey: DateKey): ProjectTask[] {
  const scheduledThisDay = getTasksForDate(project, dateKey);

  const unscheduled = getUnscheduledTasks(project);
  if (unscheduled.length === 0) {
    return scheduledThisDay;
  }

  const days = getDateKeysBetween(project.startDate, project.endDate);
  if (days.length === 0) {
    return scheduledThisDay;
  }

  const tasksPerDay = Math.ceil(unscheduled.length / days.length);
  const spreadOnThisDay: ProjectTask[] = [];
  let dayIndex = 0;
  let assignedToday = 0;

  for (const task of unscheduled) {
    if (days[dayIndex] === dateKey) {
      spreadOnThisDay.push(task);
    }
    assignedToday++;
    if (assignedToday >= tasksPerDay && dayIndex < days.length - 1) {
      dayIndex++;
      assignedToday = 0;
    }
  }

  if (spreadOnThisDay.length === 0) {
    return scheduledThisDay;
  }

  const seen = new Set(scheduledThisDay.map(t => t.id));
  const merged = [...scheduledThisDay];
  for (const t of spreadOnThisDay) {
    if (!seen.has(t.id)) {
      merged.push(t);
      seen.add(t.id);
    }
  }

  merged.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return a.order - b.order;
  });
  return merged;
}

export function getUnscheduledTasks(project: Project): ProjectTask[] {
  return project.tasks
    .filter(t => !t.scheduledDate && t.status !== 'completed' && t.status !== 'skipped')
    .sort((a, b) => a.order - b.order);
}

export function getTodayTasks(project: Project, todayKey: DateKey): ProjectTask[] {
  return getTasksForDate(project, todayKey).filter(t => t.status !== 'completed' && t.status !== 'skipped');
}

export function getNextTask(project: Project, todayKey: DateKey): ProjectTask | undefined {
  // First check today's tasks
  const todayTasks = getTodayTasks(project, todayKey);
  if (todayTasks.length > 0) return todayTasks[0];

  // Then check unscheduled
  const unscheduled = getUnscheduledTasks(project);
  if (unscheduled.length > 0) return unscheduled[0];

  // Then check future scheduled tasks
  const futureTasks = project.tasks
    .filter(t => t.scheduledDate && t.scheduledDate > todayKey && t.status === 'pending')
    .sort((a, b) => {
      if (a.scheduledDate! !== b.scheduledDate!) {
        return a.scheduledDate! < b.scheduledDate! ? -1 : 1;
      }
      return a.order - b.order;
    });
  return futureTasks[0];
}

export function formatDuration(minutes: number | undefined): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  if (minutes % 60 === 0) return `${minutes / 60}h`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-distribute tasks
// ─────────────────────────────────────────────────────────────────────────────

export function autoDistributeTasks(
  project: Project,
  todayKey: DateKey
): ProjectTask[] {
  const unscheduled = getUnscheduledTasks(project);
  if (unscheduled.length === 0) return project.tasks;

  // Get remaining days from today (or project start if in future)
  const effectiveStart = todayKey > project.startDate ? todayKey : project.startDate;
  if (effectiveStart > project.endDate) return project.tasks; // Project is past

  const remainingDays = getDateKeysBetween(effectiveStart, project.endDate);
  if (remainingDays.length === 0) return project.tasks;

  // Calculate tasks per day (distribute as evenly as possible)
  const tasksPerDay = Math.ceil(unscheduled.length / remainingDays.length);

  // Create updated tasks
  const updatedTasks = [...project.tasks];
  let dayIndex = 0;
  let assignedToday = 0;

  for (const task of unscheduled) {
    const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
    if (taskIndex === -1) continue;

    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      scheduledDate: remainingDays[dayIndex],
    };

    assignedToday++;
    if (assignedToday >= tasksPerDay && dayIndex < remainingDays.length - 1) {
      dayIndex++;
      assignedToday = 0;
    }
  }

  return updatedTasks;
}

// ─────────────────────────────────────────────────────────────────────────────
// ID generation
// ─────────────────────────────────────────────────────────────────────────────

export function newProjectId(): ProjectId {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function newTaskId(): ProjectTaskId {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Emoji helpers
// ─────────────────────────────────────────────────────────────────────────────

export function pushRecentEmoji(recent: string[], emoji: string): string[] {
  const e = emoji.trim();
  if (!e) return recent;
  const next = recent.filter(x => x !== e);
  return [e, ...next].slice(0, 20);
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Templates
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateTask {
  text: string;
  estimatedMinutes: number;
  category?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  suggestedDays: number;
  categories?: string[];
  tasks: TemplateTask[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'apartment-deep-clean',
    name: 'Apartment Reset',
    emoji: '🧹',
    description: 'A room-by-room reset with smaller, clearer tasks that feel doable',
    suggestedDays: 14,
    categories: ['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'General'],
    tasks: [
      // Kitchen (6 tasks)
      { text: 'Throw away expired fridge items', estimatedMinutes: 15, category: 'Kitchen' },
      { text: 'Wipe fridge shelves and drawers', estimatedMinutes: 20, category: 'Kitchen' },
      { text: 'Clear and wipe kitchen counters', estimatedMinutes: 15, category: 'Kitchen' },
      { text: 'Clean stovetop and burner area', estimatedMinutes: 20, category: 'Kitchen' },
      { text: 'Clean microwave inside and out', estimatedMinutes: 15, category: 'Kitchen' },
      { text: 'Sweep and mop kitchen floor', estimatedMinutes: 20, category: 'Kitchen' },
      // Bathroom (5 tasks)
      { text: 'Scrub toilet', estimatedMinutes: 15, category: 'Bathroom' },
      { text: 'Clean sink and mirror', estimatedMinutes: 15, category: 'Bathroom' },
      { text: 'Spray and scrub shower or tub', estimatedMinutes: 20, category: 'Bathroom' },
      { text: 'Toss empty or old products', estimatedMinutes: 15, category: 'Bathroom' },
      { text: 'Sweep and mop bathroom floor', estimatedMinutes: 15, category: 'Bathroom' },
      // Bedroom (5 tasks)
      { text: 'Wash sheets and pillowcases', estimatedMinutes: 15, category: 'Bedroom' },
      { text: 'Make bed and reset nightstands', estimatedMinutes: 15, category: 'Bedroom' },
      { text: 'Put away clean clothes', estimatedMinutes: 20, category: 'Bedroom' },
      { text: 'Dust bedroom surfaces', estimatedMinutes: 15, category: 'Bedroom' },
      { text: 'Vacuum bedroom floor', estimatedMinutes: 20, category: 'Bedroom' },
      // Living Room (4 tasks)
      { text: 'Clear clutter from main surfaces', estimatedMinutes: 15, category: 'Living Room' },
      { text: 'Dust shelves and tables', estimatedMinutes: 15, category: 'Living Room' },
      { text: 'Reset couch and blankets', estimatedMinutes: 10, category: 'Living Room' },
      { text: 'Vacuum or mop living room floor', estimatedMinutes: 20, category: 'Living Room' },
      // General (4 tasks)
      { text: 'Empty all trash and recycling', estimatedMinutes: 10, category: 'General' },
      { text: 'Wipe light switches and door handles', estimatedMinutes: 10, category: 'General' },
      { text: 'Dust vents or fans', estimatedMinutes: 15, category: 'General' },
      { text: 'Do a 10-minute whole-home tidy', estimatedMinutes: 10, category: 'General' },
    ],
  },
  {
    id: 'declutter-home',
    name: 'Declutter & Organize',
    emoji: '📦',
    description: 'A low-pressure pass through the main clutter zones in your home',
    suggestedDays: 14,
    categories: ['Closet', 'Kitchen', 'Bathroom', 'Papers', 'Digital', 'Misc'],
    tasks: [
      { text: 'Pull out clothes you never wear', estimatedMinutes: 20, category: 'Closet' },
      { text: 'Make a donate bag for closet items', estimatedMinutes: 15, category: 'Closet' },
      { text: 'Clear one junk drawer', estimatedMinutes: 15, category: 'Kitchen' },
      { text: 'Check pantry and toss expired food', estimatedMinutes: 15, category: 'Kitchen' },
      { text: 'Throw away old makeup or toiletries', estimatedMinutes: 15, category: 'Bathroom' },
      { text: 'Sort the medicine cabinet', estimatedMinutes: 15, category: 'Bathroom' },
      { text: 'Open one pile of papers and sort it', estimatedMinutes: 20, category: 'Papers' },
      { text: 'Set aside important documents', estimatedMinutes: 15, category: 'Papers' },
      { text: 'Delete blurry or duplicate phone photos', estimatedMinutes: 20, category: 'Digital' },
      { text: 'Unsubscribe from 5 email lists', estimatedMinutes: 15, category: 'Digital' },
      { text: 'Clean up your downloads folder', estimatedMinutes: 15, category: 'Digital' },
      { text: 'Choose books or items to donate', estimatedMinutes: 20, category: 'Misc' },
      { text: 'Sort one storage bin or box', estimatedMinutes: 20, category: 'Misc' },
      { text: 'Drop off or schedule donation pickup', estimatedMinutes: 20, category: 'Misc' },
    ],
  },
  {
    id: 'move-to-new-place',
    name: 'Moving Checklist',
    emoji: '🏠',
    description: 'A practical moving plan with clearer steps and less mental juggling',
    suggestedDays: 30,
    categories: ['Before Move', 'Packing', 'Moving Day', 'After Move', 'Admin'],
    tasks: [
      // Before Move
      { text: 'Make a simple moving to-do list', estimatedMinutes: 20, category: 'Before Move' },
      { text: 'Get quotes from movers or truck rentals', estimatedMinutes: 30, category: 'Before Move' },
      { text: 'Book movers, truck, or helpers', estimatedMinutes: 20, category: 'Before Move' },
      { text: 'Gather boxes, tape, and packing supplies', estimatedMinutes: 20, category: 'Before Move' },
      // Packing
      { text: 'Pack books and decor', estimatedMinutes: 30, category: 'Packing' },
      { text: 'Pack out-of-season clothes', estimatedMinutes: 30, category: 'Packing' },
      { text: 'Pack kitchen items you do not need daily', estimatedMinutes: 45, category: 'Packing' },
      { text: 'Pack bathroom extras and backups', estimatedMinutes: 20, category: 'Packing' },
      { text: 'Pack electronics and chargers', estimatedMinutes: 25, category: 'Packing' },
      { text: 'Label boxes by room', estimatedMinutes: 20, category: 'Packing' },
      // Moving Day
      { text: 'Keep essentials bag easy to reach', estimatedMinutes: 15, category: 'Moving Day' },
      { text: 'Do final walkthrough of old place', estimatedMinutes: 20, category: 'Moving Day' },
      // After Move
      { text: 'Unpack bed and sleep setup first', estimatedMinutes: 30, category: 'After Move' },
      { text: 'Unpack bathroom basics', estimatedMinutes: 20, category: 'After Move' },
      { text: 'Unpack kitchen basics', estimatedMinutes: 30, category: 'After Move' },
      { text: 'Break down or stack empty boxes', estimatedMinutes: 20, category: 'After Move' },
      // Admin
      { text: 'Update address with USPS', estimatedMinutes: 15, category: 'Admin' },
      { text: 'Update bank and credit card address', estimatedMinutes: 15, category: 'Admin' },
      { text: 'Transfer or start utilities', estimatedMinutes: 20, category: 'Admin' },
      { text: 'Update license, insurance, or key accounts', estimatedMinutes: 20, category: 'Admin' },
      { text: 'Update subscriptions and deliveries', estimatedMinutes: 15, category: 'Admin' },
    ],
  },
  {
    id: 'fitness-kickstart',
    name: '2-Week Movement Reset',
    emoji: '💪',
    description: 'Short movement sessions that build momentum without frying you',
    suggestedDays: 14,
    categories: ['Walk', 'Strength', 'Mobility', 'Recovery'],
    tasks: [
      { text: '10-minute walk', estimatedMinutes: 10, category: 'Walk' },
      { text: '10-minute bodyweight strength', estimatedMinutes: 10, category: 'Strength' },
      { text: '10-minute stretch or mobility flow', estimatedMinutes: 10, category: 'Mobility' },
      { text: '15-minute walk', estimatedMinutes: 15, category: 'Walk' },
      { text: '15-minute strength session', estimatedMinutes: 15, category: 'Strength' },
      { text: 'Recovery day: easy walk or stretching', estimatedMinutes: 10, category: 'Recovery' },
      { text: '10-minute dance, bike, or fun cardio', estimatedMinutes: 10, category: 'Walk' },
      { text: '10-minute core session', estimatedMinutes: 10, category: 'Strength' },
      { text: '15-minute full-body stretch', estimatedMinutes: 15, category: 'Mobility' },
      { text: '20-minute walk', estimatedMinutes: 20, category: 'Walk' },
      { text: '15-minute upper-body strength', estimatedMinutes: 15, category: 'Strength' },
      { text: '15-minute lower-body strength', estimatedMinutes: 15, category: 'Strength' },
      { text: 'Recovery day: mobility or foam rolling', estimatedMinutes: 15, category: 'Recovery' },
      { text: '20-minute movement of your choice', estimatedMinutes: 20, category: 'Walk' },
    ],
  },
  {
    id: 'learn-skill-30-days',
    name: '30-Day Skill Builder',
    emoji: '📚',
    description: 'A simple learn, practice, review rhythm for any skill you want to build',
    suggestedDays: 30,
    categories: ['Setup', 'Learn', 'Practice', 'Review', 'Project'],
    tasks: [
      { text: 'Choose one skill and define your goal', estimatedMinutes: 20, category: 'Setup' },
      { text: 'Gather materials, links, or tools', estimatedMinutes: 20, category: 'Setup' },
      { text: 'Learn the basic concepts', estimatedMinutes: 30, category: 'Learn' },
      { text: 'Do your first short practice session', estimatedMinutes: 15, category: 'Practice' },
      { text: 'Repeat the basics', estimatedMinutes: 15, category: 'Practice' },
      { text: 'Review what is clicking and what is not', estimatedMinutes: 15, category: 'Review' },
      { text: 'Try one tiny project or exercise', estimatedMinutes: 25, category: 'Project' },
      { text: 'Rest or do a light review', estimatedMinutes: 10, category: 'Review' },
      { text: 'Learn the next concept', estimatedMinutes: 25, category: 'Learn' },
      { text: 'Practice that concept', estimatedMinutes: 20, category: 'Practice' },
      { text: 'Practice again with less help', estimatedMinutes: 20, category: 'Practice' },
      { text: 'Make or complete something small', estimatedMinutes: 30, category: 'Project' },
      { text: 'Review progress and adjust your plan', estimatedMinutes: 15, category: 'Review' },
      { text: 'Pick your next mini-focus', estimatedMinutes: 15, category: 'Setup' },
      { text: 'Finish with a confidence-building practice session', estimatedMinutes: 20, category: 'Practice' },
    ],
  },
  {
    id: 'empty-template',
    name: 'Blank Project',
    emoji: '📋',
    description: 'Start from scratch and build your own plan',
    suggestedDays: 14,
    tasks: [],
  },
];

/**
 * Create tasks from a template, distributing them across the project duration
 */
export function createTasksFromTemplate(
  template: ProjectTemplate,
  startDate: DateKey,
  endDate: DateKey,
): ProjectTask[] {
  if (template.tasks.length === 0) return [];

  const days = getDateKeysBetween(startDate, endDate);
  const tasksPerDay = Math.ceil(template.tasks.length / days.length);

  let dayIndex = 0;
  let assignedToday = 0;

  return template.tasks.map((t, index) => {
    const scheduledDate = days[dayIndex];

    assignedToday++;
    if (assignedToday >= tasksPerDay && dayIndex < days.length - 1) {
      dayIndex++;
      assignedToday = 0;
    }

    return {
      id: newTaskId(),
      text: t.text,
      estimatedMinutes: t.estimatedMinutes,
      category: t.category,
      status: 'pending' as TaskStatus,
      order: index,
      scheduledDate,
    };
  });
}
