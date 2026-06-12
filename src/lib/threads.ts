// ============================================
// Threads - Types, Validation, and Path Generation
// ============================================

export type ThreadColor = 'sakura' | 'mint' | 'amethyst' | 'teal' | 'rose' | 'slate';
export type ThreadStatus = 'active' | 'resting' | 'archived';

export interface Thread {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  emoji: string | null;
  color: ThreadColor;
  status: ThreadStatus;
  order: number;
  anchorX: number; // 0-1 position on loom bar (deprecated - kept for backward compatibility)
  isCore: boolean; // core threads are foundational, others weave around them
  createdAt: string;
  updatedAt: string;
  lastFocused: string | null;
  lastRested: string | null;

  // NEW: Gamification fields
  focusStreak: number; // Days of consecutive activity
  lastActivityDate: string | null; // Last date an activity was completed
  xp: number; // Thread experience points

  // NEW: Populated by API (optional)
  activities?: ThreadActivityWithDetails[];
}

export interface ThreadInput {
  title: string;
  description?: string | null;
  emoji?: string | null;
  color?: ThreadColor;
}

export interface ThreadActivityWithDetails {
  id: string;
  threadId: string;
  activityId: string;
  createdAt: string;
  activity: {
    id: string;
    title: string;
    type: string;
    category: string | null;
  };
}

// ============================================
// Color mapping to CSS variables
// ============================================

export const THREAD_COLORS: Record<
  ThreadColor,
  { stroke: string; glow: string; label: string; hex: string }
> = {
  sakura: {
    stroke: 'var(--color-primary)',
    glow: 'var(--glow-primary)',
    label: 'Sakura Pink',
    hex: '#d97757', // Light mode terracotta/sakura
  },
  mint: {
    stroke: 'var(--color-accent-mint)',
    glow: 'var(--glow-mint)',
    label: 'Mint Green',
    hex: '#78bfa5', // Light mode mint
  },
  amethyst: {
    stroke: 'var(--color-accent)',
    glow: 'var(--glow-accent)',
    label: 'Amethyst',
    hex: '#a089c7', // Light mode amethyst
  },
  teal: {
    stroke: 'var(--color-accent-teal)',
    glow: 'var(--glow-teal)',
    label: 'Teal',
    hex: '#4f8c9e', // Light mode teal
  },
  rose: {
    stroke: '#c9a0ab',
    glow: '0 0 12px rgba(201, 160, 171, 0.4)',
    label: 'Rose',
    hex: '#c9a0ab',
  },
  slate: {
    stroke: '#6e7e91',
    glow: '0 0 12px rgba(110, 126, 145, 0.3)',
    label: 'Slate',
    hex: '#6e7e91',
  },
};

// ============================================
// SVG Path Generation for Threads
// ============================================

export interface ThreadPathConfig {
  anchorX: number; // 0-1 normalized position
  containerWidth: number;
  length: number; // thread length in pixels
  swayOffset?: number; // -1 to 1 for breathing animation
  tension?: number; // 0-1 for drag tension (0 = relaxed drape, 1 = taut)
}

/**
 * Generates a natural-looking SVG path for a hanging thread.
 * Uses a cubic bezier curve to simulate catenary (natural drape).
 */
export function generateThreadPath({
  anchorX,
  containerWidth,
  length,
  swayOffset = 0,
  tension = 0,
}: ThreadPathConfig): string {
  const startX = anchorX * containerWidth;
  const endY = length;

  // Control points for catenary curve (natural drape)
  // The drape amount decreases as tension increases (pulled taut when dragging)
  const maxDrape = 35 * (1 - tension);
  const drape = maxDrape + swayOffset * 15;

  // Control point Y positions (shape the curve)
  const cp1Y = endY * 0.25;
  const cp2Y = endY * 0.65;

  // When under tension, the thread straightens
  const controlOffsetX = drape * (1 - tension * 0.8);

  return `M ${startX} 0
          C ${startX + controlOffsetX} ${cp1Y},
            ${startX + controlOffsetX * 0.6} ${cp2Y},
            ${startX} ${endY}`;
}

/**
 * Splits a thread path into segments at crossing points for weave rendering.
 * Returns an array of path segments with their over/under status.
 */
export interface PathSegment {
  path: string;
  isUnder: boolean; // true if this segment goes under another thread
  crossingY: number; // Y position of the crossing
}

export function splitThreadPathAtCrossings(
  pathConfig: ThreadPathConfig,
  crossings: ThreadCrossing[],
  threadId: string
): PathSegment[] {
  if (crossings.length === 0) {
    // No crossings - return single segment
    return [
      {
        path: generateThreadPath(pathConfig),
        isUnder: false,
        crossingY: 0,
      },
    ];
  }

  // Sort crossings by Y position
  const sortedCrossings = [...crossings].sort((a, b) => a.y - b.y);

  const segments: PathSegment[] = [];
  const { anchorX, containerWidth, length, swayOffset = 0, tension = 0 } = pathConfig;
  const startX = anchorX * containerWidth;
  const maxDrape = 35 * (1 - tension);
  const drape = maxDrape + swayOffset * 15;
  const controlOffsetX = drape * (1 - tension * 0.8);

  let currentY = 0;

  sortedCrossings.forEach((crossing) => {
    const { y: crossingY } = crossing;
    const isUnder = crossing.threadAId === threadId ? !crossing.aOverB : crossing.aOverB;

    // Calculate the segment from currentY to crossingY
    const segmentLength = crossingY - currentY;
    const cp1Y = currentY + segmentLength * 0.35;
    const cp2Y = currentY + segmentLength * 0.75;

    const segmentPath = `M ${startX} ${currentY}
      C ${startX + controlOffsetX} ${cp1Y},
        ${startX + controlOffsetX * 0.6} ${cp2Y},
        ${startX} ${crossingY}`;

    segments.push({
      path: segmentPath,
      isUnder,
      crossingY: currentY,
    });

    currentY = crossingY;
  });

  // Add final segment from last crossing to end
  const finalLength = length - currentY;
  const cp1Y = currentY + finalLength * 0.35;
  const cp2Y = currentY + finalLength * 0.75;

  const finalPath = `M ${startX} ${currentY}
    C ${startX + controlOffsetX} ${cp1Y},
      ${startX + controlOffsetX * 0.6} ${cp2Y},
      ${startX} ${length}`;

  segments.push({
    path: finalPath,
    isUnder: false,
    crossingY: currentY,
  });

  return segments;
}

/**
 * Generates a coiled/spiral path for resting threads.
 * Creates a gentle spiral effect to show the thread is "put aside".
 */
export function generateCoiledPath(centerX: number, centerY: number, radius: number): string {
  const turns = 2.5;
  const points: string[] = [];

  for (let i = 0; i <= turns * 360; i += 15) {
    const angle = (i * Math.PI) / 180;
    const currentRadius = radius * (1 - i / (turns * 360)) * 0.8 + radius * 0.2;
    const x = centerX + Math.cos(angle) * currentRadius;
    const y = centerY + Math.sin(angle) * currentRadius * 0.4; // Flatten vertically
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points.join(' ');
}

// ============================================
// Breathing Animation Helpers
// ============================================

/**
 * Returns spring config for Framer Motion based on animation type.
 */
export function getThreadSpringConfig(type: 'breathing' | 'drag' | 'release') {
  switch (type) {
    case 'breathing':
      return {
        type: 'spring' as const,
        stiffness: 20,
        damping: 15,
        mass: 1,
      };
    case 'drag':
      return {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      };
    case 'release':
      return {
        type: 'spring' as const,
        stiffness: 150,
        damping: 20,
        mass: 1,
      };
  }
}

/**
 * Gets a unique breathing duration for each thread (4-6 seconds).
 * Uses thread id to ensure consistent but varied rhythms.
 */
export function getBreathingDuration(threadId: string): number {
  // Simple hash of id to get consistent "random" value
  let hash = 0;
  for (let i = 0; i < threadId.length; i++) {
    hash = (hash << 5) - hash + threadId.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash % 1000) / 1000;
  return 4 + normalized * 2; // 4-6 seconds
}

// ============================================
// Tangled State Detection
// ============================================

export const OVERWHELM_THRESHOLD = 5;

export function isTangledState(activeCount: number): boolean {
  return activeCount > OVERWHELM_THRESHOLD;
}

/**
 * Calculates compressed anchor positions when tangled.
 * Threads cluster toward center when overwhelmed.
 */
export function getCompressedAnchors(
  threads: Thread[],
  containerWidth: number,
  isTangled: boolean
): Map<string, number> {
  const anchors = new Map<string, number>();
  const activeThreads = threads.filter((t) => t.status === 'active');
  const count = activeThreads.length;

  if (count === 0) return anchors;

  // Calculate spacing
  const padding = 0.1; // 10% padding on each side
  const usableWidth = 1 - padding * 2;

  // When tangled, compress toward center
  const compressionFactor = isTangled ? 0.6 : 1;
  const compressedWidth = usableWidth * compressionFactor;
  const offset = (1 - compressedWidth) / 2;

  activeThreads.forEach((thread, index) => {
    const normalizedX =
      count === 1 ? 0.5 : offset + (index / (count - 1)) * compressedWidth;
    anchors.set(thread.id, normalizedX * containerWidth);
  });

  return anchors;
}

// ============================================
// Weave Pattern Calculation
// ============================================

export interface ThreadCrossing {
  threadAId: string;
  threadBId: string;
  x: number; // X coordinate where threads cross
  y: number; // Y coordinate where threads cross
  aOverB: boolean; // true if thread A goes over thread B
}

/**
 * Calculates crossing points between threads for weave pattern.
 * Core threads are always on top (over regular threads).
 * Regular threads alternate over/under each other based on their order.
 */
export function calculateWeaveCrossings(
  threads: Thread[],
  anchors: Map<string, number>,
  threadLength: number
): ThreadCrossing[] {
  const crossings: ThreadCrossing[] = [];
  const activeThreads = threads.filter((t) => t.status === 'active').sort((a, b) => a.order - b.order);

  // Compare each pair of threads
  for (let i = 0; i < activeThreads.length; i++) {
    for (let j = i + 1; j < activeThreads.length; j++) {
      const threadA = activeThreads[i];
      const threadB = activeThreads[j];

      const anchorAX = anchors.get(threadA.id);
      const anchorBX = anchors.get(threadB.id);

      if (anchorAX === undefined || anchorBX === undefined) continue;

      // If anchors are far apart, threads don't cross
      const distance = Math.abs(anchorAX - anchorBX);
      if (distance < 20) continue; // Only calculate crossings if threads are close enough

      // Crossing point is roughly halfway down and between the two anchors
      const crossX = (anchorAX + anchorBX) / 2;
      const crossY = threadLength * 0.4; // Crossing happens 40% down the thread

      // Determine which thread goes over
      let aOverB: boolean;
      if (threadA.isCore && !threadB.isCore) {
        // Core threads always over regular threads
        aOverB = true;
      } else if (!threadA.isCore && threadB.isCore) {
        // Regular threads always under core threads
        aOverB = false;
      } else {
        // Among threads of same type, alternate based on order
        aOverB = i % 2 === 0;
      }

      crossings.push({
        threadAId: threadA.id,
        threadBId: threadB.id,
        x: crossX,
        y: crossY,
        aOverB,
      });
    }
  }

  return crossings;
}

// ============================================
// Utility Functions
// ============================================

export function sortThreads(threads: Thread[]): {
  active: Thread[];
  resting: Thread[];
  archived: Thread[];
} {
  const active = threads
    .filter((t) => t.status === 'active')
    .sort((a, b) => a.order - b.order);
  const resting = threads
    .filter((t) => t.status === 'resting')
    .sort((a, b) => a.order - b.order);
  const archived = threads
    .filter((t) => t.status === 'archived')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return { active, resting, archived };
}

export function reorderThreads(
  threads: Thread[],
  draggedId: string,
  targetIndex: number,
  newStatus?: ThreadStatus
): Thread[] {
  const dragged = threads.find((t) => t.id === draggedId);
  if (!dragged) return threads;

  const targetStatus = newStatus ?? dragged.status;
  const otherThreads = threads.filter((t) => t.id !== draggedId);

  // Get threads in target status
  const targetStatusThreads = otherThreads
    .filter((t) => t.status === targetStatus)
    .sort((a, b) => a.order - b.order);

  // Insert at target index
  const safeIndex = Math.max(0, Math.min(targetIndex, targetStatusThreads.length));
  targetStatusThreads.splice(safeIndex, 0, {
    ...dragged,
    status: targetStatus,
    order: safeIndex,
  });

  // Reindex orders
  const reindexed = targetStatusThreads.map((t, i) => ({ ...t, order: i }));

  // Combine with threads in other statuses
  const result = [
    ...reindexed,
    ...otherThreads.filter((t) => t.status !== targetStatus),
  ];

  return result;
}

// ============================================
// Thread Gamification Utilities
// ============================================

/**
 * Calculate thread level based on XP.
 * Every 100 XP = 1 level
 */
export function getThreadLevel(xp: number): number {
  return Math.floor(xp / 100);
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(xp: number): number {
  const currentLevel = getThreadLevel(xp);
  return (currentLevel + 1) * 100;
}

/**
 * Get XP progress within current level (0-100)
 */
export function getXPProgressPercent(xp: number): number {
  const currentLevel = getThreadLevel(xp);
  const xpInCurrentLevel = xp - currentLevel * 100;
  return xpInCurrentLevel;
}
