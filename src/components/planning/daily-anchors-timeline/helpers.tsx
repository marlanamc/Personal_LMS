'use client';

import { type CSSProperties } from 'react';
import { AlarmClock, BookOpen, Briefcase, Brush, Calendar, Code2, Coffee, Dumbbell, Flag, Flower2, Heart, Moon, Music, PenTool, PhoneOff, Shirt, Sunrise, Target, Users, Utensils, WashingMachine, Zap } from 'lucide-react';
import { parseHHMMToMinutes, type AnchorIcon, type DailyAnchor } from '@/lib/anchors';
import { formatShortTime, getTimeUntil } from '@/lib/anchors-mobile-ui';
import { type PlannerConstraintRuleKind, type TimeBlockKind } from '@/lib/time-block-planner';
import { type SunLocation } from '@/lib/bostonDaylight';

export const iconByName: Record<AnchorIcon, typeof Sunrise> = {
  sunrise: Sunrise,
  'flower-2': Flower2,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  moon: Moon,
  'book-open': BookOpen,
  code: Code2,
  target: Target,
  coffee: Coffee,
  heart: Heart,
  calendar: Calendar,
  utensils: Utensils,
  music: Music,
  users: Users,
  'pen-tool': PenTool,
  zap: Zap,
  brush: Brush,
  shirt: Shirt,
  'washing-machine': WashingMachine,
};

export function gradientByIcon(icon: AnchorIcon): string {
  if (icon === 'dumbbell' || icon === 'users') return 'from-emerald-400/20 to-teal-300/10';
  if (icon === 'briefcase' || icon === 'code' || icon === 'pen-tool') return 'from-sky-400/20 to-blue-300/10';
  if (icon === 'sunrise' || icon === 'coffee' || icon === 'utensils' || icon === 'zap') return 'from-amber-400/20 to-orange-300/10';
  if (icon === 'flower-2') return 'from-cyan-400/20 to-teal-300/10';
  if (icon === 'heart') return 'from-rose-400/20 to-pink-300/10';
  if (icon === 'target') return 'from-purple-400/20 to-fuchsia-300/10';
  if (icon === 'book-open' || icon === 'calendar' || icon === 'music') return 'from-indigo-400/20 to-violet-300/10';
  return 'from-violet-400/20 to-purple-300/10';
}

// Timeline visual bounds
export const TIMELINE_START_HOUR = 6;
export const TIMELINE_END_HOUR = 24;
export const TIMELINE_TOTAL_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;
export const SUN_LOCATION_STORAGE_KEY = 'daily-overview-sun-location';
export const DEFAULT_SUN_LOCATION: SunLocation = {
  latitude: 42.3601,
  longitude: -71.0589,
  timeZone: 'America/New_York',
};
/** Light tinted bands — intentionally quiet so anchors + elapsed spine carry hierarchy */
export const TIMELINE_DAY_ZONES = [
  { key: 'morning', label: 'Morning', start: 6 * 60, end: 12 * 60, className: 'bg-[#f6d5bd]/10' },
  { key: 'midday', label: 'Midday', start: 12 * 60, end: 17 * 60, className: 'bg-[#b9e8e5]/08' },
  { key: 'evening', label: 'Evening', start: 17 * 60, end: 21 * 60, className: 'bg-[#d8cdf3]/10' },
  { key: 'night', label: 'Night', start: 21 * 60, end: 24 * 60, className: 'bg-[#c7d8f0]/09' },
];

export function getTimePosition(timeStr: string): number {
  const minutes = parseHHMMToMinutes(timeStr);
  const startMinutes = TIMELINE_START_HOUR * 60;
  const position = ((minutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
  return Math.max(2, Math.min(98, position));
}

export function minutesToHHMM(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(totalMinutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Filled “chips” distinct from the track gradient: solid-tinted body + rim + depth. */
export function oaoaRhythmSegmentStyle(kind: TimeBlockKind, isActive: boolean): CSSProperties {
  const accent = kind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)';
  return {
    background: `linear-gradient(180deg,
      color-mix(in srgb, ${accent} 68%, var(--color-bg-elevated)) 0%,
      color-mix(in srgb, ${accent} 42%, var(--color-bg-elevated)) 100%)`,
    borderColor: `color-mix(in srgb, ${accent} 82%, var(--color-border-subtle))`,
    boxShadow: isActive
      ? `0 0 0 2px color-mix(in srgb, ${accent} 50%, transparent),
         0 4px 18px color-mix(in srgb, ${accent} 42%, transparent),
         inset 0 1px 0 rgba(255, 255, 255, 0.55)`
      : `0 2px 8px rgba(15, 23, 42, 0.16),
         inset 0 1px 0 rgba(255, 255, 255, 0.45)`,
  };
}

/** 0–100: elapsed share of the visible day window (6:00–24:00); aligns track fill with the “now” line. */
export function getDayProgressPercentFromMinutes(nowMinutes: number): number {
  const startMinutes = TIMELINE_START_HOUR * 60;
  const endMinutes = TIMELINE_END_HOUR * 60;
  if (nowMinutes < startMinutes) return 0;
  if (nowMinutes >= endMinutes) return 100;
  return ((nowMinutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
}

export function getTimePositionFromMinutes(minutes: number): number {
  const startMinutes = TIMELINE_START_HOUR * 60;
  const position = ((minutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
  return Math.max(0, Math.min(100, position));
}

export function getTimelineSegmentBounds(startMinutes: number, endMinutes: number): { left: number; width: number } {
  const left = getTimePositionFromMinutes(startMinutes);
  const right = getTimePositionFromMinutes(endMinutes);
  return { left, width: Math.max(0, right - left) };
}

export function formatNowLabel(nowMinutes: number | null): string {
  return nowMinutes === null ? 'NOW' : `NOW · ${formatShortTime(minutesToHHMM(nowMinutes)).toLowerCase()}`;
}

export function normalizeSunLocation(raw: unknown): SunLocation | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as { latitude?: unknown; longitude?: unknown; timeZone?: unknown };
  if (typeof candidate.latitude !== 'number' || !Number.isFinite(candidate.latitude)) return null;
  if (typeof candidate.longitude !== 'number' || !Number.isFinite(candidate.longitude)) return null;
  if (candidate.latitude < -90 || candidate.latitude > 90) return null;
  if (candidate.longitude < -180 || candidate.longitude > 180) return null;
  const timeZone = typeof candidate.timeZone === 'string' && candidate.timeZone.trim()
    ? candidate.timeZone
    : Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_SUN_LOCATION.timeZone;
  return {
    latitude: candidate.latitude,
    longitude: candidate.longitude,
    timeZone,
  };
}

export function constraintKindIcon(kind: PlannerConstraintRuleKind) {
  switch (kind) {
    case 'cutoff':
      return PhoneOff;
    case 'until':
      return Flag;
    case 'deadline':
      return AlarmClock;
    default:
      return PhoneOff;
  }
}

/** Relative time for overlay tooltips (matches list “in …” semantics without the leading “in ”). */
export function formatRiverInLabel(timeStr: string, nowMinutes: number | null): string {
  if (nowMinutes === null) return '—';
  const raw = getTimeUntil(timeStr, nowMinutes);
  if (raw === 'Soon') return '—';
  if (raw.startsWith('in ')) return raw.slice(3).trim();
  return raw;
}

export function isRangeAnchorInProgress(anchor: DailyAnchor, nowMinutes: number | null, isToday: boolean): boolean {
  if (!isToday || nowMinutes === null || !anchor.endTime) return false;
  if (anchor.status === 'done' || anchor.status === 'skipped') return false;
  const startMinutes = parseHHMMToMinutes(anchor.scheduledTime);
  const endMinutes = parseHHMMToMinutes(anchor.endTime);
  return endMinutes > startMinutes && nowMinutes >= startMinutes && nowMinutes < endMinutes;
}


export function positionToTime(positionPercent: number): string {
  const startMinutes = TIMELINE_START_HOUR * 60;
  const minutes = startMinutes + (positionPercent / 100) * TIMELINE_TOTAL_MINUTES;
  const clampedMinutes = Math.max(startMinutes, Math.min(TIMELINE_END_HOUR * 60 - 1, minutes));
  const roundedMinutes = Math.round(clampedMinutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const mins = roundedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// River Flow color schemes for different icon types
export function getRiverFlowGradient(icon: AnchorIcon): { from: string; to: string; glow: string } {
  const gradients: Record<string, { from: string; to: string; glow: string }> = {
    sunrise: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    coffee: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    utensils: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    zap: { from: 'from-amber-400/20', to: 'to-orange-300/10', glow: 'rgba(251, 191, 36, 0.3)' },
    dumbbell: { from: 'from-emerald-400/20', to: 'to-teal-300/10', glow: 'rgba(52, 211, 153, 0.3)' },
    users: { from: 'from-emerald-400/20', to: 'to-teal-300/10', glow: 'rgba(52, 211, 153, 0.3)' },
    'flower-2': { from: 'from-cyan-400/20', to: 'to-teal-300/10', glow: 'rgba(34, 211, 238, 0.3)' },
    briefcase: { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    code: { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    'pen-tool': { from: 'from-sky-400/20', to: 'to-blue-300/10', glow: 'rgba(56, 189, 248, 0.3)' },
    'book-open': { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
    calendar: { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
    music: { from: 'from-indigo-400/20', to: 'to-violet-300/10', glow: 'rgba(129, 140, 248, 0.3)' },
    target: { from: 'from-purple-400/20', to: 'to-fuchsia-300/10', glow: 'rgba(192, 132, 252, 0.3)' },
    heart: { from: 'from-rose-400/20', to: 'to-pink-300/10', glow: 'rgba(251, 113, 133, 0.3)' },
    moon: { from: 'from-violet-400/20', to: 'to-purple-300/10', glow: 'rgba(167, 139, 250, 0.3)' },
  };
  return gradients[icon] || { from: 'from-primary/20', to: 'to-accent/10', glow: 'rgba(212, 138, 166, 0.3)' };
}

