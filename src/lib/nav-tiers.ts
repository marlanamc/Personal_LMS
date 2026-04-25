export type NavTier = 'A' | 'B' | 'C';

// Tier A: hub pages — full nav (header, bottom tabs, desktop rail)
const TIER_A_ROUTES = new Set([
  '/dashboard',
  '/dashboard/day-planner',
  '/dashboard/organize',
  '/dashboard/workspace',
  '/dashboard/timer',
]);

// Tier C: immersive pages — no nav at all
const TIER_C_PREFIXES = [
  '/activity/',
  '/dashboard/crisis',
];

export function getNavTier(pathname: string): NavTier {
  if (TIER_C_PREFIXES.some(prefix => pathname.startsWith(prefix))) return 'C';
  if (TIER_A_ROUTES.has(pathname)) return 'A';
  return 'B';
}

export function showsBackArrow(pathname: string): boolean {
  return getNavTier(pathname) === 'B';
}
