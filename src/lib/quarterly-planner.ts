import { dateKeyToDate, toDateKey, type DateKey } from '@/lib/unified-scheduler';

export const QUARTERLY_GOAL_COUNT = 3;
export const QUARTERLY_WEEK_COUNT = 12;
export const QUARTERLY_PLANNER_VERSION = 1;

export type QuarterlyGoal = {
  id: string;
  title: string;
  successMetric: string;
  milestones: string[];
  habits: string[];
  obstacles: string[];
  firstSteps: string[];
};

export type QuarterlyCheckIn = {
  weekNumber: number;
  focus: string;
  wins: string;
  blockers: string;
  adjustment: string;
};

export type QuarterlyPlan = {
  id: string;
  title: string;
  startDate: DateKey;
  endDate: DateKey;
  vision: string;
  whyItMatters: string;
  goals: QuarterlyGoal[];
  weeklyCheckIns: QuarterlyCheckIn[];
  closingReflection: string;
  celebrationNote: string;
  carryForward: string;
  archivedAt?: string;
};

export type QuarterlyPlannerStore = {
  version: number;
  activeQuarter: QuarterlyPlan;
  archivedQuarters: QuarterlyPlan[];
};

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function isDateKey(value: unknown): value is DateKey {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeTextList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    const text = normalizeText(entry);
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out.slice(0, 8);
}

export function addDaysToDateKey(dateKey: DateKey, days: number): DateKey {
  const date = dateKeyToDate(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function getQuarterEndDate(startDate: DateKey): DateKey {
  return addDaysToDateKey(startDate, QUARTERLY_WEEK_COUNT * 7 - 1);
}

export function createEmptyQuarterlyGoal(index: number): QuarterlyGoal {
  return {
    id: createId(`quarter-goal-${index + 1}`),
    title: '',
    successMetric: '',
    milestones: [],
    habits: [],
    obstacles: [],
    firstSteps: [],
  };
}

export function createEmptyQuarterlyCheckIn(weekNumber: number): QuarterlyCheckIn {
  return {
    weekNumber,
    focus: '',
    wins: '',
    blockers: '',
    adjustment: '',
  };
}

export function createQuarterlyPlan(startDate: DateKey = toDateKey(new Date())): QuarterlyPlan {
  return {
    id: createId('quarter'),
    title: '',
    startDate,
    endDate: getQuarterEndDate(startDate),
    vision: '',
    whyItMatters: '',
    goals: Array.from({ length: QUARTERLY_GOAL_COUNT }, (_, index) => createEmptyQuarterlyGoal(index)),
    weeklyCheckIns: Array.from({ length: QUARTERLY_WEEK_COUNT }, (_, index) => createEmptyQuarterlyCheckIn(index + 1)),
    closingReflection: '',
    celebrationNote: '',
    carryForward: '',
  };
}

export const EMPTY_QUARTERLY_PLANNER_STORE: QuarterlyPlannerStore = {
  version: QUARTERLY_PLANNER_VERSION,
  activeQuarter: createQuarterlyPlan(),
  archivedQuarters: [],
};

function normalizeQuarterlyGoal(value: unknown, index: number): QuarterlyGoal {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return createEmptyQuarterlyGoal(index);
  }

  const raw = value as Record<string, unknown>;
  return {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id : createId(`quarter-goal-${index + 1}`),
    title: normalizeText(raw.title),
    successMetric: normalizeText(raw.successMetric),
    milestones: normalizeTextList(raw.milestones),
    habits: normalizeTextList(raw.habits),
    obstacles: normalizeTextList(raw.obstacles),
    firstSteps: normalizeTextList(raw.firstSteps),
  };
}

function normalizeQuarterlyCheckIn(value: unknown, weekNumber: number): QuarterlyCheckIn {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return createEmptyQuarterlyCheckIn(weekNumber);
  }

  const raw = value as Record<string, unknown>;
  return {
    weekNumber,
    focus: normalizeText(raw.focus),
    wins: normalizeText(raw.wins),
    blockers: normalizeText(raw.blockers),
    adjustment: normalizeText(raw.adjustment),
  };
}

function normalizeQuarterlyPlan(value: unknown): QuarterlyPlan {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return createQuarterlyPlan();
  }

  const raw = value as Record<string, unknown>;
  const startDate = isDateKey(raw.startDate) ? raw.startDate : toDateKey(new Date());

  const goalsSource = Array.isArray(raw.goals) ? raw.goals : [];
  const weeklySource = Array.isArray(raw.weeklyCheckIns) ? raw.weeklyCheckIns : [];

  return {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id : createId('quarter'),
    title: normalizeText(raw.title),
    startDate,
    endDate: getQuarterEndDate(startDate),
    vision: normalizeText(raw.vision),
    whyItMatters: normalizeText(raw.whyItMatters),
    goals: Array.from({ length: QUARTERLY_GOAL_COUNT }, (_, index) => normalizeQuarterlyGoal(goalsSource[index], index)),
    weeklyCheckIns: Array.from({ length: QUARTERLY_WEEK_COUNT }, (_, index) =>
      normalizeQuarterlyCheckIn(weeklySource[index], index + 1),
    ),
    closingReflection: normalizeText(raw.closingReflection),
    celebrationNote: normalizeText(raw.celebrationNote),
    carryForward: normalizeText(raw.carryForward),
    archivedAt: typeof raw.archivedAt === 'string' && raw.archivedAt.trim() ? raw.archivedAt : undefined,
  };
}

export function normalizeQuarterlyPlannerStore(value: unknown): QuarterlyPlannerStore {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {
      ...EMPTY_QUARTERLY_PLANNER_STORE,
      activeQuarter: createQuarterlyPlan(EMPTY_QUARTERLY_PLANNER_STORE.activeQuarter.startDate),
      archivedQuarters: [],
    };
  }

  const raw = value as Record<string, unknown>;
  const archivedSource = Array.isArray(raw.archivedQuarters) ? raw.archivedQuarters : [];

  return {
    version: QUARTERLY_PLANNER_VERSION,
    activeQuarter: normalizeQuarterlyPlan(raw.activeQuarter),
    archivedQuarters: archivedSource
      .map(normalizeQuarterlyPlan)
      .map((quarter, index) => ({
        ...quarter,
        archivedAt: quarter.archivedAt ?? new Date(Date.now() - index).toISOString(),
      }))
      .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? '')),
  };
}

function quarterHasMeaningfulContent(quarter: QuarterlyPlan): boolean {
  if (quarter.title || quarter.vision || quarter.whyItMatters || quarter.closingReflection || quarter.celebrationNote || quarter.carryForward) {
    return true;
  }

  if (quarter.goals.some((goal) =>
    goal.title ||
    goal.successMetric ||
    goal.milestones.length > 0 ||
    goal.habits.length > 0 ||
    goal.obstacles.length > 0 ||
    goal.firstSteps.length > 0,
  )) {
    return true;
  }

  return quarter.weeklyCheckIns.some((entry) => entry.focus || entry.wins || entry.blockers || entry.adjustment);
}

export function updateQuarterField<K extends keyof QuarterlyPlan>(
  quarter: QuarterlyPlan,
  field: K,
  value: QuarterlyPlan[K],
): QuarterlyPlan {
  if (field === 'startDate') {
    const startDate = value as DateKey;
    return {
      ...quarter,
      startDate,
      endDate: getQuarterEndDate(startDate),
    };
  }

  return {
    ...quarter,
    [field]: value,
  };
}

export function updateQuarterGoal(
  quarter: QuarterlyPlan,
  goalIndex: number,
  updates: Partial<QuarterlyGoal>,
): QuarterlyPlan {
  return {
    ...quarter,
    goals: quarter.goals.map((goal, index) => (index === goalIndex ? { ...goal, ...updates } : goal)),
  };
}

export function updateQuarterCheckIn(
  quarter: QuarterlyPlan,
  weekNumber: number,
  updates: Partial<QuarterlyCheckIn>,
): QuarterlyPlan {
  return {
    ...quarter,
    weeklyCheckIns: quarter.weeklyCheckIns.map((entry) =>
      entry.weekNumber === weekNumber ? { ...entry, ...updates, weekNumber } : entry,
    ),
  };
}

export function startNewQuarter(store: QuarterlyPlannerStore, startDate: DateKey = toDateKey(new Date())): QuarterlyPlannerStore {
  const archivedQuarters = quarterHasMeaningfulContent(store.activeQuarter)
    ? [{ ...store.activeQuarter, archivedAt: new Date().toISOString() }, ...store.archivedQuarters]
    : store.archivedQuarters;

  return {
    ...store,
    activeQuarter: createQuarterlyPlan(startDate),
    archivedQuarters,
  };
}

export function archiveActiveQuarter(store: QuarterlyPlannerStore): QuarterlyPlannerStore {
  return {
    ...store,
    activeQuarter: createQuarterlyPlan(),
    archivedQuarters: [{ ...store.activeQuarter, archivedAt: new Date().toISOString() }, ...store.archivedQuarters],
  };
}

export function reopenArchivedQuarter(store: QuarterlyPlannerStore, quarterId: string): QuarterlyPlannerStore {
  const archivedQuarter = store.archivedQuarters.find((quarter) => quarter.id === quarterId);
  if (!archivedQuarter) return store;

  const nextArchived = store.archivedQuarters.filter((quarter) => quarter.id !== quarterId);
  const archivedCurrent = quarterHasMeaningfulContent(store.activeQuarter)
    ? [{ ...store.activeQuarter, archivedAt: new Date().toISOString() }, ...nextArchived]
    : nextArchived;

  return {
    ...store,
    activeQuarter: {
      ...archivedQuarter,
      archivedAt: undefined,
      endDate: getQuarterEndDate(archivedQuarter.startDate),
    },
    archivedQuarters: archivedCurrent,
  };
}
