'use client';

import { type ProjectColor, type ProjectMeta, type ThoughtBullet, type ThoughtLane } from '@/lib/thought-organization';

// ── Project colors (match globals.css --project-* for sidebar dots + card rails)
export const PROJECT_PALETTE: Record<ProjectColor, { dot: string; bg: string; border: string; text: string }> = {
  peach:      { dot: 'var(--project-peach)',      bg: 'var(--project-peach-wash)',      border: 'var(--project-peach-border)',      text: 'var(--project-peach)' },
  sky:        { dot: 'var(--project-sky)',       bg: 'var(--project-sky-wash)',       border: 'var(--project-sky-border)',       text: 'var(--project-sky)' },
  mint:       { dot: 'var(--project-mint)',      bg: 'var(--project-mint-wash)',      border: 'var(--project-mint-border)',      text: 'var(--project-mint)' },
  periwinkle: { dot: 'var(--project-periwinkle)', bg: 'var(--project-periwinkle-wash)', border: 'var(--project-periwinkle-border)', text: 'var(--project-periwinkle)' },
  lavender:   { dot: 'var(--project-lavender)',   bg: 'var(--project-lavender-wash)',   border: 'var(--project-lavender-border)',   text: 'var(--project-lavender)' },
  rose:       { dot: 'var(--project-rose)',      bg: 'var(--project-rose-wash)',      border: 'var(--project-rose-border)',      text: 'var(--project-rose)' },
  coral:      { dot: 'var(--project-coral)',      bg: 'var(--project-coral-wash)',      border: 'var(--project-coral-border)',      text: 'var(--project-coral)' },
  sage:       { dot: 'var(--project-sage)',       bg: 'var(--project-sage-wash)',       border: 'var(--project-sage-border)',       text: 'var(--project-sage)' },
  blush:      { dot: 'var(--project-blush)',     bg: 'var(--project-blush-wash)',     border: 'var(--project-blush-border)',     text: 'var(--project-blush)' },
  slate:      { dot: 'var(--project-slate)',      bg: 'var(--project-slate-wash)',      border: 'var(--project-slate-border)',      text: 'var(--project-slate)' },
};

export const PROJECT_COLOR_KEYS = Object.keys(PROJECT_PALETTE) as ProjectColor[];

export const LANE_META: Record<ThoughtLane, { label: string; colorVar: string; bgVar: string; borderVar: string }> = {
  now:   { label: "Today's Journey", colorVar: '--color-lane-now',   bgVar: '--color-lane-now-bg',   borderVar: '--color-lane-now-border' },
  next:  { label: 'If the Wind Is Good', colorVar: '--color-lane-next',  bgVar: '--color-lane-next-bg',  borderVar: '--color-lane-next-border' },
  later: { label: 'Safe Harbor', colorVar: '--color-lane-later', bgVar: '--color-lane-later-bg', borderVar: '--color-lane-later-border' },
  done:  { label: 'Done',  colorVar: '--color-lane-done',  bgVar: '--color-lane-done-bg',  borderVar: '--color-lane-done-border' },
};

export type ActiveLane = Exclude<ThoughtLane, 'done'>;

export const ACTIVE_LANES: ActiveLane[] = ['now', 'next', 'later'];

export const LANE_EMPTY_COPY: Record<ActiveLane, string> = {
  now: "Steer bullets here for today's journey.",
  next: 'Set bullets here for when the wind is good.',
  later: 'Anchor bullets here until you are ready.',
};

export const LANE_HELPER_COPY: Record<ActiveLane, string> = {
  now: 'Primary route',
  next: 'Momentum lane',
  later: 'Anchored',
};

export const LANE_SHORT_LABEL: Record<ActiveLane, string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
};

export const LANE_MOVE_COPY: Record<ActiveLane, string> = {
  now: "Move to Today's Journey",
  next: 'Move Forward',
  later: 'Move to Harbor',
};

export function isDoneToday(bullet: ThoughtBullet): boolean {
  if (!bullet.completedAt) return false;
  const completed = new Date(bullet.completedAt);
  if (Number.isNaN(completed.getTime())) return false;
  const today = new Date();
  return (
    completed.getFullYear() === today.getFullYear() &&
    completed.getMonth() === today.getMonth() &&
    completed.getDate() === today.getDate()
  );
}

export function completionAwareUpdate(
  current: ThoughtBullet,
  updates: Partial<ThoughtBullet>
): Partial<ThoughtBullet> {
  if (!Object.prototype.hasOwnProperty.call(updates, 'lane')) {
    return updates;
  }

  if (updates.lane === 'done' && current.lane !== 'done') {
    return {
      ...updates,
      completedAt: new Date().toISOString(),
    };
  }

  if (updates.lane !== 'done' && current.lane === 'done') {
    return {
      ...updates,
      completedAt: undefined,
    };
  }

  return updates;
}

export function sortDoneNewestFirst(items: ThoughtBullet[]): ThoughtBullet[] {
  return [...items].sort((a, b) => {
    const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    return bTime - aTime || b.displayOrder - a.displayOrder;
  });
}

export function isActiveLane(value: string): value is ActiveLane {
  return value === 'now' || value === 'next' || value === 'later';
}

export function mobileLaneDropId(lane: ActiveLane) {
  return `mobile-lane:${lane}`;
}

export function mobileBulletDragId(bulletId: string) {
  return `mobile-bullet:${bulletId}`;
}

export function parseMobileLaneDropId(id: string): ActiveLane | null {
  const lane = id.replace('mobile-lane:', '');
  return isActiveLane(lane) ? lane : null;
}

export function parseMobileBulletDragId(id: string) {
  return id.startsWith('mobile-bullet:') ? id.replace('mobile-bullet:', '') : null;
}

export function getProjectPalette(project?: ProjectMeta | null) {
  return project ? (PROJECT_PALETTE[project.color] ?? PROJECT_PALETTE.slate) : PROJECT_PALETTE.slate;
}

export function formatSourceDate(bullet: ThoughtBullet) {
  if (!bullet.source?.dateKey) return null;
  return new Date(`${bullet.source.dateKey}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getActiveBullets(bullets: ThoughtBullet[]) {
  return bullets.filter(b => b.project && b.lane !== 'done');
}
