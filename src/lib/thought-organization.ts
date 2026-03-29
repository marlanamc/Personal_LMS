import { nanoid } from 'nanoid';

// Types
export type Priority = 'high' | 'medium' | 'low';
export type ThoughtLane = 'now' | 'next' | 'later';

export type ProjectColor = 'peach' | 'sky' | 'mint' | 'periwinkle' | 'lavender' | 'rose' | 'coral' | 'sage' | 'blush' | 'slate';

export type ProjectMeta = {
  id: string;
  label: string;
  color: ProjectColor;
};

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
};

export type ThoughtOrganization = {
  bullets: ThoughtBullet[];
  projects: ProjectMeta[]; // Changed from string[] to ProjectMeta[]
};

export type ThoughtOrganizerStore = {
  bullets: ThoughtBullet[];
  projects: ProjectMeta[];
};

export interface ParsedBullet {
  text: string;
  lineNumber: number;
  indentLevel: number;
  markerType: 'unordered' | 'ordered';
}

export const THOUGHT_LANES: ThoughtLane[] = ['now', 'next', 'later'];

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
  const merged = new Map<string, ProjectMeta>();

  bulletProjects.forEach((project) => {
    merged.set(project.id, project);
  });

  existingProjects.forEach((project) => {
    if (!merged.has(project.id)) {
      merged.set(project.id, project);
    }
  });

  return Array.from(merged.values());
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
      lane: ['now', 'next', 'later'].includes((b.lane || ''))
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

  return {
    bullets: limitedBullets,
    projects: mergeProjects(deduplicateProjects(limitedBullets), projects),
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

  projectMap.set('inbox', {
    projectId: 'inbox',
    projectMeta: undefined,
    isInbox: true,
    bullets: [],
    lanes: {
      now: [],
      next: [],
      later: [],
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
      },
    }));

  return columns.sort((a, b) => {
    if (a.isInbox) return -1;
    if (b.isInbox) return 1;
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
