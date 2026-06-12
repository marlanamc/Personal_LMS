'use client';

import { type ReactNode } from 'react';
import { Calendar } from 'lucide-react';
import { formatTimeLabel } from '@/lib/anchors';
import { describeConstraintRule, type PlannerConstraintRule } from '@/lib/time-block-planner';
import type { CalendarEvent } from '@/features/planning/types';
import { getCalendarMarkerColor } from '@/components/planning/MiniCalendar';
import { getBoundaryKindAccent } from '@/features/planning/components/daily-overview-styles';
import { getTimePosition, constraintKindIcon, formatRiverInLabel } from './helpers';

export function RiverOverlayHoverCard({
  title,
  timeLabel,
  inLabel,
  children,
}: {
  title: string;
  timeLabel: string;
  inLabel: string;
  children: ReactNode;
}) {
  const fullLabel = `${title}. ${timeLabel}. In: ${inLabel}`;
  return (
    <div
      className="river-overlay-marker group relative flex flex-col items-center justify-center rounded-sm outline-none pointer-events-auto focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      tabIndex={0}
      aria-label={fullLabel}
    >
      {children}
      <div
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-max max-w-[min(220px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border-subtle bg-bg-elevated/95 px-3 py-2 text-left shadow-xl backdrop-blur-sm transition-all duration-200 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        role="tooltip"
      >
        <div className="text-xs font-bold text-text whitespace-nowrap">{timeLabel}</div>
        <div className="mt-0.5 max-w-[200px] text-[10px] leading-snug text-text-muted line-clamp-2">{title}</div>
        <div className="mt-0.5 text-[10px] whitespace-nowrap text-text-muted">{`In: ${inLabel}`}</div>
        <div
          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border-subtle bg-bg-elevated"
          aria-hidden
        />
      </div>
    </div>
  );
}

/** Shared NOW stack: labeled vertical marker aligned to the center timeline. */
export function TimelineNowMarker({
  leftPercent,
  show,
  compact,
  label,
}: {
  leftPercent: number;
  show: boolean;
  compact?: boolean;
  label?: string;
}) {
  if (!show) return null;
  /** Spine-first layout: slim mobile strip vs readable desktop needle. */
  const lineH = compact ? 'h-14' : 'h-[6.125rem]';
  const labelClass = compact ? 'text-[7px] mb-1' : 'text-[10px] mb-1.5 tabular-nums tracking-[0.12em]';
  return (
    <div
      className="absolute top-1/2 z-[24] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${leftPercent}%` }}
      role="img"
      aria-label="Current time"
    >
      <div className={`relative flex w-[1.375rem] shrink-0 items-center justify-center ${lineH}`}>
        <span
          className={`daily-anchors-now-label absolute bottom-full left-1/2 -translate-x-1/2 rounded-full border px-2.5 py-1 font-extrabold uppercase whitespace-nowrap backdrop-blur-md ${labelClass} border-[color-mix(in_srgb,var(--color-border-subtle)_70%,transparent)] bg-bg-elevated/92 text-[color-mix(in_srgb,var(--color-primary-dark)_88%,black_12%)] shadow-sm dark:border-white/38 dark:bg-black/[0.52] dark:text-[color-mix(in_srgb,#fefbff_93%,var(--color-accent-sakura)_7%)] dark:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent-sakura)_42%,transparent)]`}
        >
          {label ?? 'NOW'}
        </span>
        <div className="absolute inset-y-5 -inset-x-px rounded-full bg-[color-mix(in_srgb,white_72%,transparent)] blur-lg opacity-[0.45]" aria-hidden />
        <div className={`daily-anchors-now-line relative z-[1] shrink-0 rounded-full ${lineH}`} />
        <div
          className="absolute left-1/2 top-1/2 z-[2] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[3px] border border-white/80 bg-[linear-gradient(135deg,white_88%,color-mix(in_srgb,var(--accent-primary)_70%,transparent))] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent-primary)_28%,transparent),0_0_22px_color-mix(in_srgb,var(--accent-primary)_72%,transparent)]"
          aria-hidden
        />
      </div>
    </div>
  );
}

/** Desktop-only: dashed constraint lines + light calendar ticks (below anchor orbs, z-[12]). */
export function DesktopPlannerRiverOverlays({
  constraints,
  todayCalendarEvents,
  nowMinutes,
}: {
  constraints: PlannerConstraintRule[];
  todayCalendarEvents: CalendarEvent[];
  nowMinutes: number | null;
}) {
  return (
    <>
      {constraints.map((c) => {
        const Icon = constraintKindIcon(c.kind);
        const accent = getBoundaryKindAccent(c.kind);
        const titleText = c.displayText?.trim() || describeConstraintRule(c);
        const timeLine = formatTimeLabel(c.time);
        const inLine = formatRiverInLabel(c.time, nowMinutes);
        const left = getTimePosition(c.time);
        return (
          <div
            key={`river-constraint-${c.id}`}
            className="absolute top-1/2 z-[12] flex min-h-[4.5rem] w-7 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center"
            style={{ left: `${left}%` }}
          >
            <RiverOverlayHoverCard title={titleText} timeLabel={timeLine} inLabel={inLine}>
              <div className="daily-overview-river-tick flex flex-col items-center">
                <div
                  className="h-14 w-0 shrink-0 rounded-full border-l border-dashed"
                  style={{ borderColor: `color-mix(in srgb, ${accent} 44%, transparent)` }}
                  aria-hidden
                />
                <Icon
                  className="relative -top-1.5 h-3 w-3 shrink-0 opacity-[0.72]"
                  style={{ color: accent }}
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
            </RiverOverlayHoverCard>
          </div>
        );
      })}
      {todayCalendarEvents.map((ev) => {
        const eventDate = new Date(ev.date);
        const t = `${String(eventDate.getHours()).padStart(2, '0')}:${String(eventDate.getMinutes()).padStart(2, '0')}`;
        const left = getTimePosition(t);
        const marker = getCalendarMarkerColor(ev.type);
        const titleText = ev.title?.trim() || 'Calendar';
        const subtitle = ev.type ? `${titleText} · ${ev.type}` : titleText;
        const timeLine = formatTimeLabel(t);
        const inLine = formatRiverInLabel(t, nowMinutes);
        const key = ev.id ?? `cal-${ev.date}`;
        return (
          <div
            key={`river-cal-${key}`}
            className="absolute top-1/2 z-[12] flex min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center"
            style={{ left: `${left}%` }}
          >
            <RiverOverlayHoverCard title={subtitle} timeLabel={timeLine} inLabel={inLine}>
              <Calendar className="h-5 w-5 opacity-[0.74]" strokeWidth={2} style={{ color: marker }} aria-hidden />
            </RiverOverlayHoverCard>
          </div>
        );
      })}
    </>
  );
}

