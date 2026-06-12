'use client';

import { BookOpen, Briefcase, Brush, Calendar, Code2, Coffee, Dumbbell, Flower2, Heart, Moon, Music, PenTool, Shirt, Sunrise, Target, Users, Utensils, WashingMachine, Zap, Ban, Flag, AlarmClock, Timer, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const iconByName: Record<string, LucideIcon> = {
  moon: Moon,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  sunrise: Sunrise,
  'flower-2': Flower2,
  'book-open': BookOpen,
  code: Code2,
  heart: Heart,
  coffee: Coffee,
  target: Target,
  calendar: Calendar,
  utensils: Utensils,
  music: Music,
  users: Users,
  'pen-tool': PenTool,
  zap: Zap,
  brush: Brush,
  shirt: Shirt,
  'washing-machine': WashingMachine,
  ban: Ban,
  flag: Flag,
  'alarm-clock': AlarmClock,
  timer: Timer,
};

export function formatCompactAnchorChipTime(startTime: string, endTime?: string): string {
  const [rawH1 = '0', rawM1 = '00'] = startTime.split(':');
  const h1Num = Number(rawH1);
  const m1Num = Number(rawM1);
  if (Number.isNaN(h1Num) || Number.isNaN(m1Num)) return startTime;

  const p1 = h1Num >= 12 ? 'pm' : 'am';
  const h1 = h1Num % 12 || 12;
  const startLabel = `${h1}:${String(m1Num).padStart(2, '0')}`;

  if (!endTime) return `${startLabel}${p1}`;

  const [rawH2 = '0', rawM2 = '00'] = endTime.split(':');
  const h2Num = Number(rawH2);
  const m2Num = Number(rawM2);
  if (Number.isNaN(h2Num) || Number.isNaN(m2Num)) return `${startLabel}${p1}`;

  const p2 = h2Num >= 12 ? 'pm' : 'am';
  const h2 = h2Num % 12 || 12;
  const endLabel = `${h2}:${String(m2Num).padStart(2, '0')}`;

  return p1 === p2 ? `${startLabel}-${endLabel}${p1}` : `${startLabel}${p1}-${endLabel}${p2}`;
}

/**
 * Shared shell for all row time chips (anchor / boundary / …).
 * `whitespace-nowrap` keeps range times on one line so they match boundary chip height (wrapping was making anchors look huge).
 */
export const overviewTimeChipShellClass =
  'inline-flex max-w-full min-h-0 shrink-0 items-center justify-center rounded-full border px-1.5 py-px text-[10px] font-normal tabular-nums tracking-tight leading-none whitespace-nowrap';

/** Interactive time chip (anchor — opens time editor). */
export const overviewTimeChipButtonClass = cn(
  overviewTimeChipShellClass,
  'icon-button min-h-0 min-w-0 h-auto appearance-none transition-[filter,box-shadow] touch-manipulation',
);

/** Non-interactive time chip (event / boundary / session rows). */
export const overviewTimeChipStaticClass = overviewTimeChipShellClass;

export const SESSION_ROW_ACCENT = 'var(--color-primary)';

