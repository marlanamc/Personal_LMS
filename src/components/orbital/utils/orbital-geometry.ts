import type { ThoughtBullet, ThoughtLane } from '@/lib/thought-organization';

// ─── Solar System Model - Dynamic orbit sizing ───────────────────────────────────
// Center = Active focus (the sun)
// Inner orbit = Now/Today (Mercury)
// Middle orbit = Next/This week (Venus/Earth)
// Outer orbit = Later/Backlog (Mars/Jupiter)

const BASE_RADII = {
  active: 0,      // Center point (the sun)
  now: 120,       // Inner planets
  next: 240,      // Middle planets
  later: 380      // Outer planets
} as const;

const GROWTH_PER_TASK = 2.5;
const MAX_GROWTH = 40;

export function dynamicOrbitRadii(taskCount: number) {
  const growth = Math.min(taskCount * GROWTH_PER_TASK, MAX_GROWTH);
  return {
    active: 0,
    now: BASE_RADII.now + growth * 0.3,
    next: BASE_RADII.next + growth * 0.5,
    later: BASE_RADII.later + growth,
  };
}

/** Outer radius of the entire solar system */
export function projectFieldRadius(taskCount: number): number {
  return dynamicOrbitRadii(taskCount).later + 60;
}

// Node sizes per lane (radius of planet/circle)
export const NODE_SIZES = {
  active: 60,     // The sun (large, bright)
  now: 50,        // Inner planets (large)
  next: 40,       // Middle planets (medium)
  later: 32,      // Outer planets (smaller, more distant)
} as const;

// Legacy — kept for drag detection
export const ORBIT_RADII = { now: 65, next: 150, later: 235 } as const;
export const CANVAS_SIZE = 360;
export const CANVAS_CENTER = CANVAS_SIZE / 2;

// ─── Constellation canvas ───────────────────────────────────

// ─── Constellation canvas logic ───────────────────────────────────
// Removed: Legacy Constellation force-directed algorithms.
// The new Grid layout relies on independent CSS-managed SVG bounds.

// ─── Task positioning on orbits ────────────────────────────

export type PositionedNode = {
  bullet: ThoughtBullet;
  x: number;
  y: number;
  angle: number;
  orbit: ThoughtLane;
  size: number;
  opacity: number;
};

export function calculateNodePosition(
  index: number,
  total: number,
  radius: number,
  offsetAngle: number = -Math.PI / 2
): { x: number; y: number; angle: number } {
  if (total === 0) return { x: 0, y: 0, angle: 0 };
  const angle = offsetAngle + (2 * Math.PI * index) / total;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    angle,
  };
}

export function distributeOnOrbit(
  tasks: ThoughtBullet[],
  lane: ThoughtLane,
  radiiOverride?: { active: number; now: number; next: number; later: number }
): PositionedNode[] {
  const radii = radiiOverride || BASE_RADII;
  const radius = radii[lane as keyof typeof radii] || radii.next;
  const size = NODE_SIZES[lane as keyof typeof NODE_SIZES] || NODE_SIZES.next;
  const opacity = lane === 'now' ? 1 : lane === 'next' ? 0.85 : 0.7;

  return tasks.map((bullet, index) => {
    const { x, y, angle } = calculateNodePosition(index, tasks.length, radius);
    return { bullet, x, y, angle, orbit: lane, size, opacity };
  });
}

// ─── Drag helpers ──────────────────────────────────────────

export function getOrbitFromDistance(distance: number): ThoughtLane {
  const nowThreshold = (ORBIT_RADII.now + ORBIT_RADII.next) / 2;
  const nextThreshold = (ORBIT_RADII.next + ORBIT_RADII.later) / 2;
  if (distance < nowThreshold) return 'now';
  if (distance < nextThreshold) return 'next';
  return 'later';
}

export function distanceFromCenter(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

export function angleFromCenter(x: number, y: number): number {
  return Math.atan2(y, x);
}

export function findInsertionIndex(
  angle: number,
  existingNodes: PositionedNode[]
): number {
  if (existingNodes.length === 0) return 0;
  const sortedByAngle = [...existingNodes].sort((a, b) => a.angle - b.angle);
  for (let i = 0; i < sortedByAngle.length; i++) {
    if (angle < sortedByAngle[i].angle) return i;
  }
  return sortedByAngle.length;
}

// ─── Display helpers ───────────────────────────────────────

export function getLaneDisplayProps(lane: ThoughtLane): {
  color: string;
  label: string;
  strokeDash: string;
} {
  switch (lane) {
    case 'now':
      return { color: 'var(--primary)', label: 'Now', strokeDash: 'none' };
    case 'next':
      return { color: 'var(--accent-teal)', label: 'Next', strokeDash: '8 4' };
    case 'later':
      return { color: 'var(--accent-mint)', label: 'Later', strokeDash: '4 4' };
    default:
      return { color: 'var(--text-muted)', label: '', strokeDash: '3 3' };
  }
}

export function truncateLabel(text: string, maxLength: number = 40): string {
  if (text.length <= maxLength) return text;
  // Smarter truncation: keep whole words when possible
  const words = text.split(' ');
  let result = '';
  for (const word of words) {
    if ((result + ' ' + word).trim().length > maxLength - 1) break;
    result = (result + ' ' + word).trim();
  }
  if (result.length === 0) {
    return text.slice(0, maxLength - 1) + '…';
  }
  return result + '…';
}

export function getProjectInitials(label: string): string {
  const words = label.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}


