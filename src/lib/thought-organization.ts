import { nanoid } from 'nanoid';

// Types
export type Priority = 'high' | 'medium' | 'low';
export type ThoughtLane = 'now' | 'next' | 'later' | 'done';

export type ProjectColor = 'peach' | 'sky' | 'mint' | 'periwinkle' | 'lavender' | 'rose' | 'coral' | 'sage' | 'blush' | 'slate';

export type ProjectMeta = {
  id: string;
  label: string;
  color: ProjectColor;
};

/** Bento grid card width; persisted with thought organizer store */
export type BentoProjectSize = 'small' | 'medium' | 'large' | 'xlarge';

export type BentoLayout = {
  projectOrder?: string[];
  projectSizes?: Record<string, BentoProjectSize>;
};

export type FlowLayout = {
  globalOrder?: string[];
  projectOrder?: string[];
  taskOrderByProject?: Record<string, string[]>;
};

export type TriggerType = 'task' | 'time' | 'rest';

export type ThoughtBullet = {
  id: string;
  text: string;
  lineNumber: number;
  priority?: Priority;
  lane?: ThoughtLane;
  project?: string; // project ID
  projectMeta?: ProjectMeta; // Cached metadata
  displayOrder: number;
  source?: {
    dateKey: string; // e.g., "2026-03-28"
    importedAt: string; // ISO timestamp
  };
  triggerType?: TriggerType; // Type of trigger
  triggerTime?: string; // "HH:mm" format for time triggers (e.g., "16:00")
  restDuration?: number; // Duration in minutes for rest triggers
};

export type ThoughtOrganization = {
  bullets: ThoughtBullet[];
  projects: ProjectMeta[]; // Changed from string[] to ProjectMeta[]
  bento?: BentoLayout;
  flow?: FlowLayout;
};

export type ThoughtOrganizerStore = {
  bullets: ThoughtBullet[];
  projects: ProjectMeta[];
  bento?: BentoLayout;
  flow?: FlowLayout;
};

export interface ParsedBullet {
  text: string;
  lineNumber: number;
  indentLevel: number;
  markerType: 'unordered' | 'ordered';
}

export interface FlowSection {
  key: string;
  isInbox: boolean;
  projectId?: string;
  projectMeta?: ProjectMeta;
  bullets: ThoughtBullet[];
  pendingBullets: ThoughtBullet[];
  doneBullets: ThoughtBullet[];
  activeBullet?: ThoughtBullet;
  queuedBullets: ThoughtBullet[];
}

export interface FlowBoard {
  orderedBullets: ThoughtBullet[];
  activeBullet?: ThoughtBullet;
  queuedBullets: ThoughtBullet[];
  doneBullets: ThoughtBullet[];
  poolBullets: ThoughtBullet[];
}

export const THOUGHT_LANES: ThoughtLane[] = ['now', 'next', 'later', 'done'];
export const FLOW_INBOX_ID = 'inbox';

export function priorityToLane(priority?: Priority): ThoughtLane | undefined {
  if (priority === 'high') return 'now';
  if (priority === 'medium') return 'next';
  if (priority === 'low') return 'later';
  return undefined;
}

export function laneToPriority(lane?: ThoughtLane): Priority | undefined {
  if (lane === 'now') return 'high';
  if (lane === 'next') return 'medium';
  if (lane === 'later') return 'low';
  return undefined;
}

function normalizeBulletMetadata(bullet: ThoughtBullet): ThoughtBullet {
  const lane = bullet.lane ?? priorityToLane(bullet.priority) ?? (bullet.project ? 'next' : undefined);
  const priority = laneToPriority(lane) ?? bullet.priority;

  return {
    ...bullet,
    lane,
    priority,
  };
}

// Regex pattern to match markdown list items
// Matches: -, *, +, or 1., 2., etc. at start of line (after optional whitespace)
const BULLET_PATTERN = /^(\s*)([*\-+]|\d+\.)\s+(.+)$/;

/**
 * Extract top-level bullets from markdown text
 * Only extracts bullets with zero indentation (top-level)
 */
export function extractBullets(markdown: string): ParsedBullet[] {
  if (!markdown || markdown.trim().length === 0) {
    return [];
  }

  const lines = markdown.split('\n');
  const bullets: ParsedBullet[] = [];

  lines.forEach((line, idx) => {
    const match = BULLET_PATTERN.exec(line);
    if (!match) return;

    const [, indent, marker, text] = match;

    // Only extract top-level bullets (no indentation)
    if (indent.length === 0) {
      // Clean the text: trim and remove HTML entities and extra whitespace
      const cleanText = text
        .trim()
        .replace(/&[#\w]+;/g, '') // Remove HTML entities like &#x20;
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim();

      if (cleanText) {
        bullets.push({
          text: cleanText,
          lineNumber: idx + 1,
          indentLevel: 0,
          markerType: /^\d+\./.test(marker) ? 'ordered' : 'unordered',
        });
      }
    }
  });

  return bullets;
}

/**
 * Reconcile parsed bullets with existing organization metadata
 * Matches bullets by text content and preserves metadata where possible
 */
export function reconcileBullets(
  markdown: string,
  existingOrganization: ThoughtOrganization | undefined
): ThoughtOrganization {
  const parsedBullets = extractBullets(markdown);

  // If no existing organization, create new IDs for all bullets
  if (!existingOrganization) {
    return {
      bullets: parsedBullets.map((parsed, idx) => ({
        id: nanoid(),
        text: parsed.text,
        lineNumber: parsed.lineNumber,
        priority: undefined,
        lane: undefined,
        project: undefined,
        projectMeta: undefined,
        displayOrder: idx,
      })),
      projects: [],
    };
  }

  // Create a map of existing bullets by text content
  const existingMap = new Map<string, ThoughtBullet>(
    existingOrganization.bullets.map(b => [b.text, b])
  );

  // Match parsed bullets to existing ones
  const reconciledBullets: ThoughtBullet[] = parsedBullets.map((parsed, idx) => {
    const existing = existingMap.get(parsed.text);

    if (existing) {
      // Preserve existing metadata, update line number
      return normalizeBulletMetadata({
        ...existing,
        lineNumber: parsed.lineNumber,
      });
    } else {
      // New bullet - create with no metadata
      return {
        id: nanoid(),
        text: parsed.text,
        lineNumber: parsed.lineNumber,
        priority: undefined,
        lane: undefined,
        project: undefined,
        projectMeta: undefined,
        displayOrder: idx,
      };
    }
  });

  // Deduplicate projects from reconciled bullets
  const projects = mergeProjects(
    deduplicateProjects(reconciledBullets),
    existingOrganization.projects
  );

    return {
      bullets: reconciledBullets,
      projects,
      ...(existingOrganization.bento ? { bento: existingOrganization.bento } : {}),
      ...(existingOrganization.flow ? { flow: existingOrganization.flow } : {}),
    };
}

/**
 * Extract unique projects from bullets in order of first appearance
 * Uses projectMeta when available, falls back to creating new ProjectMeta
 */
export function deduplicateProjects(bullets: ThoughtBullet[]): ProjectMeta[] {
  const seen = new Map<string, ProjectMeta>();

  bullets.forEach(bullet => {
    if (bullet.project && !seen.has(bullet.project)) {
      const projectMeta = bullet.projectMeta || {
        id: bullet.project,
        label: bullet.project,
        color: 'slate' as ProjectColor, // Default color
      };
      seen.set(bullet.project, projectMeta);
    }
  });

  return Array.from(seen.values());
}

export function mergeProjects(
  bulletProjects: ProjectMeta[],
  existingProjects: ProjectMeta[] = []
): ProjectMeta[] {
  // Preserve the order from existingProjects (user's custom order)
  // Only add bullet-derived projects that aren't already in existingProjects
  const existingIds = new Set(existingProjects.map(p => p.id));
  const merged: ProjectMeta[] = [...existingProjects];

  bulletProjects.forEach((project) => {
    if (!existingIds.has(project.id)) {
      merged.push(project);
    }
  });

  return merged;
}

/**
 * Update project list when a bullet's project changes
 */
export function updateProjectList(
  organization: ThoughtOrganization,
  newProjectMeta: ProjectMeta | undefined
): ProjectMeta[] {
  // Rebuild project list from all bullets
  const allProjects = deduplicateProjects(organization.bullets);

  // Add new project if not already in list
  if (newProjectMeta && !allProjects.some(p => p.id === newProjectMeta.id)) {
    allProjects.push(newProjectMeta);
  }

  return allProjects;
}

const BENTO_SIZE_VALUES: BentoProjectSize[] = ['small', 'medium', 'large', 'xlarge'];

function flowContainerKey(projectId?: string | null): string {
  return projectId ? projectId : FLOW_INBOX_ID;
}

function normalizeBentoLayout(
  bento: unknown,
  mergedProjects: ProjectMeta[]
): BentoLayout | undefined {
  if (!bento || typeof bento !== 'object' || Array.isArray(bento)) return undefined;

  const projectIds = new Set(mergedProjects.map((p) => p.id));
  const mergedOrder = mergedProjects.map((p) => p.id);
  const o = bento as Record<string, unknown>;
  const layout: BentoLayout = {};

  if (Array.isArray(o.projectOrder)) {
    const valid: string[] = [];
    const seen = new Set<string>();
    for (const id of o.projectOrder) {
      if (typeof id !== 'string') continue;
      const tid = id.trim();
      if (!tid || tid.length > 64 || !projectIds.has(tid) || seen.has(tid)) continue;
      valid.push(tid);
      seen.add(tid);
    }
    for (const tid of mergedOrder) {
      if (!seen.has(tid)) {
        valid.push(tid);
        seen.add(tid);
      }
    }
    if (valid.length) layout.projectOrder = valid.slice(0, 100);
  }

  if (o.projectSizes && typeof o.projectSizes === 'object' && !Array.isArray(o.projectSizes)) {
    const sizes: Record<string, BentoProjectSize> = {};
    for (const [k, v] of Object.entries(o.projectSizes)) {
      const tid = typeof k === 'string' ? k.trim() : '';
      if (!tid || tid.length > 64 || !projectIds.has(tid)) continue;
      if (BENTO_SIZE_VALUES.includes(v as BentoProjectSize)) {
        sizes[tid] = v as BentoProjectSize;
      }
    }
    if (Object.keys(sizes).length) layout.projectSizes = sizes;
  }

  return Object.keys(layout).length ? layout : undefined;
}

function normalizeFlowLayout(
  flow: unknown,
  mergedProjects: ProjectMeta[],
  bullets: ThoughtBullet[]
): FlowLayout | undefined {
  if (!flow || typeof flow !== 'object' || Array.isArray(flow)) return undefined;

  const o = flow as Record<string, unknown>;
  const projectIds = new Set(mergedProjects.map((project) => project.id));
  const bulletIdsByContainer = new Map<string, string[]>();

  const appendBullet = (key: string, id: string) => {
    const existing = bulletIdsByContainer.get(key) ?? [];
    existing.push(id);
    bulletIdsByContainer.set(key, existing);
  };

  bullets
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .forEach((bullet) => {
      appendBullet(flowContainerKey(bullet.project), bullet.id);
    });

  const layout: FlowLayout = {};
  const allBulletIds = bullets
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((bullet) => bullet.id);

  if (Array.isArray(o.globalOrder)) {
    const valid: string[] = [];
    const seen = new Set<string>();
    const allowed = new Set(allBulletIds);
    for (const id of o.globalOrder) {
      if (typeof id !== 'string') continue;
      const tid = id.trim();
      if (!tid || !allowed.has(tid) || seen.has(tid)) continue;
      valid.push(tid);
      seen.add(tid);
    }
    // Don't auto-add bullets to the chain - only keep explicitly ordered ones
    if (valid.length) layout.globalOrder = valid.slice(0, 500);
  }

  if (Array.isArray(o.projectOrder)) {
    const valid: string[] = [];
    const seen = new Set<string>();
    for (const id of o.projectOrder) {
      if (typeof id !== 'string') continue;
      const tid = id.trim();
      if (!tid || tid.length > 64 || !projectIds.has(tid) || seen.has(tid)) continue;
      valid.push(tid);
      seen.add(tid);
    }
    for (const project of mergedProjects) {
      if (!seen.has(project.id)) {
        valid.push(project.id);
        seen.add(project.id);
      }
    }
    if (valid.length) layout.projectOrder = valid.slice(0, 100);
  }

  if (o.taskOrderByProject && typeof o.taskOrderByProject === 'object' && !Array.isArray(o.taskOrderByProject)) {
    const nextTaskOrderByProject: Record<string, string[]> = {};

    for (const [rawKey, rawValue] of Object.entries(o.taskOrderByProject)) {
      const key = typeof rawKey === 'string' ? rawKey.trim() : '';
      if (!key) continue;
      if (key !== FLOW_INBOX_ID && !projectIds.has(key)) continue;
      if (!Array.isArray(rawValue)) continue;

      const allowedIds = new Set(bulletIdsByContainer.get(key) ?? []);
      const validIds: string[] = [];
      const seen = new Set<string>();

      for (const id of rawValue) {
        if (typeof id !== 'string') continue;
        const tid = id.trim();
        if (!tid || !allowedIds.has(tid) || seen.has(tid)) continue;
        validIds.push(tid);
        seen.add(tid);
      }

      for (const id of bulletIdsByContainer.get(key) ?? []) {
        if (!seen.has(id)) {
          validIds.push(id);
          seen.add(id);
        }
      }

      if (validIds.length) {
        nextTaskOrderByProject[key] = validIds.slice(0, 500);
      }
    }

    for (const [key, ids] of bulletIdsByContainer.entries()) {
      if (ids.length && !nextTaskOrderByProject[key]) {
        nextTaskOrderByProject[key] = [...ids];
      }
    }

    if (Object.keys(nextTaskOrderByProject).length) {
      layout.taskOrderByProject = nextTaskOrderByProject;
    }
  }

  return Object.keys(layout).length ? layout : undefined;
}

/**
 * Normalize organization data (validate and clean)
 * Used for server-side validation
 */
export function normalizeOrganization(
  org: ThoughtOrganization | undefined
): ThoughtOrganization | undefined {
  if (!org) return undefined;

  const validColors: ProjectColor[] = ['peach', 'sky', 'mint', 'periwinkle', 'lavender', 'rose', 'coral', 'sage', 'blush', 'slate'];

  // Validate bullets
  const bullets = org.bullets
    .filter(b => b.id && b.text && typeof b.displayOrder === 'number')
    .map((b) => normalizeBulletMetadata({
      ...b,
      priority: ['high', 'medium', 'low'].includes(b.priority || '')
        ? (b.priority as Priority)
        : undefined,
      lane: ['now', 'next', 'later', 'done'].includes((b.lane || ''))
        ? (b.lane as ThoughtLane)
        : undefined,
      project: b.project && b.project.length <= 50 ? b.project.trim() : undefined,
      projectMeta: b.projectMeta && b.project && validColors.includes(b.projectMeta.color)
        ? {
            id: b.projectMeta.id,
            label: b.projectMeta.label.slice(0, 50),
            color: b.projectMeta.color,
          }
        : undefined,
    }));

  const projects = Array.isArray(org.projects)
    ? org.projects
        .filter((project): project is ProjectMeta => Boolean(
          project &&
          typeof project.id === 'string' &&
          typeof project.label === 'string' &&
          project.id.trim() &&
          project.label.trim() &&
          validColors.includes(project.color)
        ))
        .map((project) => ({
          id: project.id.trim(),
          label: project.label.trim().slice(0, 50),
          color: project.color,
        }))
    : [];

  // Limit to 500 bullets max
  const limitedBullets = bullets.slice(0, 500);

  const mergedProjects = mergeProjects(deduplicateProjects(limitedBullets), projects);
  const bento = normalizeBentoLayout(org.bento, mergedProjects);
  const flow = normalizeFlowLayout(org.flow, mergedProjects, limitedBullets);

  return {
    bullets: limitedBullets,
    projects: mergedProjects,
    ...(bento ? { bento } : {}),
    ...(flow ? { flow } : {}),
  };
}

/**
 * Group bullets by priority level
 */
export function groupByPriority(bullets: ThoughtBullet[]): {
  high: ThoughtBullet[];
  medium: ThoughtBullet[];
  low: ThoughtBullet[];
  unorganized: ThoughtBullet[];
} {
  const groups = {
    high: [] as ThoughtBullet[],
    medium: [] as ThoughtBullet[],
    low: [] as ThoughtBullet[],
    unorganized: [] as ThoughtBullet[],
  };

  bullets.forEach(bullet => {
    if (bullet.priority === 'high') {
      groups.high.push(bullet);
    } else if (bullet.priority === 'medium') {
      groups.medium.push(bullet);
    } else if (bullet.priority === 'low') {
      groups.low.push(bullet);
    } else {
      groups.unorganized.push(bullet);
    }
  });

  // Sort each group by displayOrder
  Object.values(groups).forEach(group => {
    group.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return groups;
}

/**
 * Group bullets within a priority by project
 */
export function groupByProject(bullets: ThoughtBullet[]): Map<string, ThoughtBullet[]> {
  const groups = new Map<string, ThoughtBullet[]>();

  bullets.forEach(bullet => {
    const projectKey = bullet.project || 'General';
    const existing = groups.get(projectKey) || [];
    existing.push(bullet);
    groups.set(projectKey, existing);
  });

  // Sort bullets within each project by displayOrder
  groups.forEach(projectBullets => {
    projectBullets.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return groups;
}

export interface ProjectLaneGroup {
  projectId: string;
  projectMeta?: ProjectMeta;
  isInbox: boolean;
  bullets: ThoughtBullet[];
  lanes: Record<ThoughtLane, ThoughtBullet[]>;
}

export function groupByProjectLane(
  bullets: ThoughtBullet[],
  projects: ProjectMeta[] = []
): ProjectLaneGroup[] {
  const normalizedBullets = bullets.map(normalizeBulletMetadata);
  const projectMap = new Map<string, ProjectLaneGroup>();
  const projectOrder = new Map(projects.map((project, index) => [project.id, index]));

  projectMap.set('inbox', {
    projectId: 'inbox',
    projectMeta: undefined,
    isInbox: true,
    bullets: [],
    lanes: {
      now: [],
      next: [],
      later: [],
      done: [],
    },
  });

  projects.forEach((project) => {
    projectMap.set(project.id, {
      projectId: project.id,
      projectMeta: project,
      isInbox: false,
      bullets: [],
      lanes: {
        now: [],
        next: [],
        later: [],
        done: [],
      },
    });
  });

  normalizedBullets.forEach((bullet) => {
    if (!bullet.project || !bullet.projectMeta) {
      projectMap.get('inbox')?.bullets.push(bullet);
      return;
    }

    const existing = projectMap.get(bullet.project) ?? {
      projectId: bullet.project,
      projectMeta: bullet.projectMeta,
      isInbox: false,
      bullets: [],
      lanes: {
        now: [],
        next: [],
        later: [],
        done: [],
      },
    };

    existing.projectMeta = existing.projectMeta ?? bullet.projectMeta;
    existing.lanes[bullet.lane ?? 'next'].push(bullet);
    projectMap.set(bullet.project, existing);
  });

  const sortBullets = (items: ThoughtBullet[]) =>
    items.sort((a, b) => a.displayOrder - b.displayOrder);

  const inbox = projectMap.get('inbox');
  if (inbox) {
    sortBullets(inbox.bullets);
  }

  const columns = Array.from(projectMap.values())
    .map((group) => ({
      ...group,
      bullets: sortBullets([...group.bullets]),
      lanes: {
        now: sortBullets([...group.lanes.now]),
        next: sortBullets([...group.lanes.next]),
        later: sortBullets([...group.lanes.later]),
        done: sortBullets([...group.lanes.done]),
      },
    }));

  return columns.sort((a, b) => {
    if (a.isInbox) return -1;
    if (b.isInbox) return 1;

    const aOrder = a.projectId ? projectOrder.get(a.projectId) : undefined;
    const bOrder = b.projectId ? projectOrder.get(b.projectId) : undefined;

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }

    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;

    return (a.projectMeta?.label || '').localeCompare(b.projectMeta?.label || '');
  });
}

/**
 * Check if a bullet already exists in the list (by text content)
 * Used to prevent duplicate imports
 */
export function isDuplicateBullet(
  newBullet: ThoughtBullet,
  existingBullets: ThoughtBullet[]
): boolean {
  const normalizedNewText = newBullet.text.toLowerCase().trim();
  return existingBullets.some(
    (b) => b.text.toLowerCase().trim() === normalizedNewText
  );
}

/**
 * Add import metadata to a bullet
 * Tracks where and when the bullet was imported from
 */
export function addImportMetadata(
  bullet: ThoughtBullet,
  sourceDateKey: string
): ThoughtBullet {
  return {
    ...bullet,
    source: {
      dateKey: sourceDateKey,
      importedAt: new Date().toISOString(),
    },
  };
}

/** Project bullets in NOW, globally sorted by displayOrder. */
export function globalNowBulletsSorted(bullets: ThoughtBullet[]): ThoughtBullet[] {
  return bullets
    .filter((b) => b.project && b.lane === 'now')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function setGlobalNowOrderFromIds(bullets: ThoughtBullet[], orderedNowIds: string[]): ThoughtBullet[] {
  const map = new Map(orderedNowIds.map((id, i) => [id, i]));
  return bullets.map((b) => {
    if (b.project && b.lane === 'now' && map.has(b.id)) {
      return {
        ...b,
        displayOrder: map.get(b.id)!,
        priority: laneToPriority('now'),
      };
    }
    return b;
  });
}

/**
 * Move a bullet into NOW and insert it at `insertIndex` in the global NOW queue (0 = front).
 */
export function insertIntoGlobalNowQueueAt(
  prev: ThoughtBullet[],
  activeId: string,
  insertIndex: number,
  projects: ProjectMeta[]
): ThoughtBullet[] | null {
  const activeBullet = prev.find((b) => b.id === activeId);
  if (!activeBullet || !activeBullet.project) return null;

  const movedBullet = {
    ...activeBullet,
    projectMeta: projects.find((p) => p.id === activeBullet.project) ?? activeBullet.projectMeta,
    lane: 'now' as ThoughtLane,
    priority: laneToPriority('now'),
  };

  const nowQueue = prev
    .filter((b) => b.id !== activeId && b.project && b.lane === 'now')
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const safeIdx = Math.max(0, Math.min(insertIndex, nowQueue.length));
  nowQueue.splice(safeIdx, 0, movedBullet);

  const nowOrder = new Map<string, number>();
  nowQueue.forEach((b, i) => {
    nowOrder.set(b.id, i);
  });

  return prev.map((b) => {
    if (b.id === activeId) {
      return {
        ...movedBullet,
        displayOrder: nowOrder.get(activeId) ?? 0,
      };
    }
    if (nowOrder.has(b.id)) {
      return {
        ...b,
        displayOrder: nowOrder.get(b.id)!,
      };
    }
    return b;
  });
}

export function moveGlobalNowBulletByDelta(
  prev: ThoughtBullet[],
  bulletId: string,
  delta: -1 | 1
): ThoughtBullet[] | null {
  const nowQueue = globalNowBulletsSorted(prev).map((b) => b.id);
  const idx = nowQueue.indexOf(bulletId);
  if (idx === -1) return null;
  const j = idx + delta;
  if (j < 0 || j >= nowQueue.length) return null;
  const next = [...nowQueue];
  [next[idx], next[j]] = [next[j], next[idx]];
  return setGlobalNowOrderFromIds(prev, next);
}

export function getFlowProjectOrder(org: ThoughtOrganization): string[] {
  const mergedOrder = org.projects.map((project) => project.id);
  const saved = org.flow?.projectOrder;
  if (!saved?.length) return mergedOrder;

  const valid: string[] = [];
  const seen = new Set<string>();

  for (const id of saved) {
    if (mergedOrder.includes(id) && !seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }

  for (const id of mergedOrder) {
    if (!seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }

  return valid;
}

export function getFlowGlobalOrder(org: ThoughtOrganization): string[] {
  const defaultOrder = org.bullets
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((bullet) => bullet.id);
  const saved = org.flow?.globalOrder;
  if (!saved?.length) return [];

  const allowed = new Set(defaultOrder);
  const valid: string[] = [];
  const seen = new Set<string>();

  for (const id of saved) {
    if (allowed.has(id) && !seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }

  return valid;
}

export function getFlowTaskOrder(
  org: ThoughtOrganization,
  projectId?: string | null
): string[] {
  const key = flowContainerKey(projectId);
  const defaultOrder = org.bullets
    .filter((bullet) => (projectId ? bullet.project === projectId : !bullet.project))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((bullet) => bullet.id);

  const saved = org.flow?.taskOrderByProject?.[key];
  if (!saved?.length) return defaultOrder;

  const allowed = new Set(defaultOrder);
  const valid: string[] = [];
  const seen = new Set<string>();

  for (const id of saved) {
    if (allowed.has(id) && !seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }

  for (const id of defaultOrder) {
    if (!seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }

  return valid;
}

export function getFlowOrderedBullets(
  org: ThoughtOrganization,
  projectId?: string | null
): ThoughtBullet[] {
  const bulletMap = new Map(org.bullets.map((bullet) => [bullet.id, bullet]));
  return getFlowTaskOrder(org, projectId)
    .map((id) => bulletMap.get(id))
    .filter((bullet): bullet is ThoughtBullet => Boolean(bullet));
}

export function getFlowSections(org: ThoughtOrganization): FlowSection[] {
  const sections: FlowSection[] = getFlowProjectOrder(org).map((projectId) => {
    const projectMeta = org.projects.find((project) => project.id === projectId);
    const bullets = getFlowOrderedBullets(org, projectId);
    const pendingBullets = bullets.filter((bullet) => bullet.lane !== 'done');
    const doneBullets = bullets.filter((bullet) => bullet.lane === 'done');

    return {
      key: projectId,
      isInbox: false,
      projectId,
      projectMeta,
      bullets,
      pendingBullets,
      doneBullets,
      activeBullet: pendingBullets[0],
      queuedBullets: pendingBullets.slice(1),
    };
  });

  const inboxBullets = getFlowOrderedBullets(org, null);
  if (inboxBullets.length > 0) {
    const pendingBullets = inboxBullets.filter((bullet) => bullet.lane !== 'done');
    const doneBullets = inboxBullets.filter((bullet) => bullet.lane === 'done');
    sections.push({
      key: FLOW_INBOX_ID,
      isInbox: true,
      bullets: inboxBullets,
      pendingBullets,
      doneBullets,
      activeBullet: pendingBullets[0],
      queuedBullets: pendingBullets.slice(1),
    });
  }

  return sections;
}

export function getFlowBoard(org: ThoughtOrganization): FlowBoard {
  const bulletMap = new Map(org.bullets.map((bullet) => [bullet.id, bullet]));
  const orderedBullets = getFlowGlobalOrder(org)
    .map((id) => bulletMap.get(id))
    .filter((bullet): bullet is ThoughtBullet => Boolean(bullet));
  const chainIds = new Set(orderedBullets.map((bullet) => bullet.id));
  const pendingOrdered = orderedBullets.filter((bullet) => bullet.lane !== 'done');
  const doneBullets = orderedBullets.filter((bullet) => bullet.lane === 'done');
  const poolBullets = org.bullets
    .filter((bullet) => !chainIds.has(bullet.id))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return {
    orderedBullets,
    activeBullet: pendingOrdered[0],
    queuedBullets: pendingOrdered.slice(1),
    doneBullets,
    poolBullets,
  };
}

function withFlowTaskOrder(
  org: ThoughtOrganization,
  key: string,
  orderedIds: string[]
): ThoughtOrganization {
  const nextFlow: FlowLayout = {
    ...(org.flow?.projectOrder ? { projectOrder: [...org.flow.projectOrder] } : {}),
    taskOrderByProject: {
      ...(org.flow?.taskOrderByProject ?? {}),
      [key]: orderedIds,
    },
  };

  return {
    ...org,
    flow: nextFlow,
  };
}

function withFlowGlobalOrder(
  org: ThoughtOrganization,
  orderedIds: string[]
): ThoughtOrganization {
  return {
    ...org,
    flow: {
      ...(org.flow?.projectOrder ? { projectOrder: [...org.flow.projectOrder] } : {}),
      ...(org.flow?.taskOrderByProject
        ? {
            taskOrderByProject: Object.fromEntries(
              Object.entries(org.flow.taskOrderByProject).map(([key, ids]) => [key, [...ids]])
            ),
          }
        : {}),
      globalOrder: orderedIds,
    },
  };
}

export function moveFlowBullet(
  org: ThoughtOrganization,
  bulletId: string,
  targetProjectId: string | null,
  targetIndex: number
): ThoughtOrganization {
  const bullet = org.bullets.find((item) => item.id === bulletId);
  if (!bullet) return org;

  const sourceProjectId = bullet.project ?? null;
  const sourceKey = flowContainerKey(sourceProjectId);
  const targetKey = flowContainerKey(targetProjectId);

  const sourceIds = getFlowTaskOrder(org, sourceProjectId).filter((id) => id !== bulletId);
  const existingTargetIds =
    sourceKey === targetKey
      ? sourceIds
      : getFlowTaskOrder(org, targetProjectId).filter((id) => id !== bulletId);

  const insertAt = Math.max(0, Math.min(targetIndex, existingTargetIds.length));
  const nextTargetIds = [...existingTargetIds];
  nextTargetIds.splice(insertAt, 0, bulletId);

  const targetProjectMeta =
    targetProjectId === null
      ? undefined
      : org.projects.find((project) => project.id === targetProjectId) ?? bullet.projectMeta;

  let nextOrg: ThoughtOrganization = {
    ...org,
    bullets: org.bullets.map((item) =>
      item.id === bulletId
        ? {
            ...item,
            project: targetProjectId ?? undefined,
            projectMeta: targetProjectMeta,
          }
        : item
    ),
  };

  nextOrg = withFlowTaskOrder(nextOrg, targetKey, nextTargetIds);

  if (sourceKey !== targetKey) {
    nextOrg = withFlowTaskOrder(nextOrg, sourceKey, sourceIds);
  }

  return nextOrg;
}

export function moveFlowBulletByDelta(
  org: ThoughtOrganization,
  bulletId: string,
  delta: -1 | 1
): ThoughtOrganization {
  const bullet = org.bullets.find((item) => item.id === bulletId);
  if (!bullet) return org;

  const projectId = bullet.project ?? null;
  const order = getFlowTaskOrder(org, projectId);
  const index = order.indexOf(bulletId);
  if (index === -1) return org;

  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= order.length) return org;

  const nextOrder = [...order];
  [nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]];
  return withFlowTaskOrder(org, flowContainerKey(projectId), nextOrder);
}

export function moveFlowBulletToEnd(
  org: ThoughtOrganization,
  bulletId: string
): ThoughtOrganization {
  const bullet = org.bullets.find((item) => item.id === bulletId);
  if (!bullet) return org;
  return moveFlowBullet(org, bulletId, bullet.project ?? null, getFlowTaskOrder(org, bullet.project ?? null).length);
}

export function insertFlowBulletIntoGlobalOrder(
  org: ThoughtOrganization,
  bulletId: string,
  insertIndex: number
): ThoughtOrganization {
  const allIds = new Set(org.bullets.map((bullet) => bullet.id));
  if (!allIds.has(bulletId)) return org;

  const current = getFlowGlobalOrder(org).filter((id) => id !== bulletId);
  const safeIndex = Math.max(0, Math.min(insertIndex, current.length));
  const next = [...current];
  next.splice(safeIndex, 0, bulletId);
  return withFlowGlobalOrder(org, next);
}

export function removeFlowBulletFromGlobalOrder(
  org: ThoughtOrganization,
  bulletId: string
): ThoughtOrganization {
  return withFlowGlobalOrder(
    org,
    getFlowGlobalOrder(org).filter((id) => id !== bulletId)
  );
}

export function moveFlowGlobalBulletByDelta(
  org: ThoughtOrganization,
  bulletId: string,
  delta: -1 | 1
): ThoughtOrganization {
  const order = getFlowGlobalOrder(org);
  const index = order.indexOf(bulletId);
  if (index === -1) return org;
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= order.length) return org;
  const next = [...order];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return withFlowGlobalOrder(org, next);
}
