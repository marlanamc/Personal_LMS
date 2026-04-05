'use client';

import Link from 'next/link';
import {
  AlarmClock,
  Ban,
  CalendarDays,
  Check,
  Flag,
  Heart,
  Play,
  Target,
} from 'lucide-react';
import { getAnchorColorPalette } from '@/lib/anchors';
import {
  formatMinuteOfDay,
  formatDuration,
  getItemStatus,
  type SectionColumnData,
  type TimelineItem,
} from '@/lib/unified-scheduler';

interface DaySectionsBoardProps {
  dateKey: string;
  sections: SectionColumnData[];
  nowMinute?: number | null;
  buildStartTimerHref?: (item: TimelineItem) => string | undefined;
  onItemClick?: (item: TimelineItem) => void;
}

// Section columns: visible regions (border + tint + shadow) so modes read clearly at a glance
const SECTION_COLOR_MAP = {
  dawn: {
    shell: 'bg-gradient-to-b from-accent-sakura/24 via-accent-sakura/10 to-accent-sakura/[0.055]',
    accent: 'bg-accent-sakura',
    accentSoft: 'shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent-sakura)_36%,transparent)]',
    chip: 'bg-accent-sakura/18 text-accent-sakura border border-accent-sakura/26',
    label: 'text-accent-sakura/90',
    headingBar: 'bg-accent-sakura/16 border-b border-accent-sakura/26',
  },
  mint: {
    shell: 'bg-gradient-to-b from-accent-mint/24 via-accent-mint/11 to-accent-mint/[0.055]',
    accent: 'bg-accent-mint',
    accentSoft: 'shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent-mint)_38%,transparent)]',
    chip: 'bg-accent-mint/18 text-accent-mint border border-accent-mint/28',
    label: 'text-accent-mint/90',
    headingBar: 'bg-accent-mint/16 border-b border-accent-mint/28',
  },
  sky: {
    shell: 'bg-gradient-to-b from-accent-teal/22 via-accent-teal/10 to-accent-teal/[0.05]',
    accent: 'bg-accent-teal',
    accentSoft: 'shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent-teal)_34%,transparent)]',
    chip: 'bg-accent-teal/17 text-accent-teal border border-accent-teal/24',
    label: 'text-accent-teal/90',
    headingBar: 'bg-accent-teal/15 border-b border-accent-teal/24',
  },
  sand: {
    shell:
      'bg-gradient-to-b from-[rgba(217,171,102,0.26)] via-[rgba(217,171,102,0.1)] to-[rgba(217,171,102,0.045)]',
    accent: 'bg-[rgba(196,145,70,0.95)]',
    accentSoft: 'shadow-[inset_0_0_0_1px_rgba(196,145,70,0.38)]',
    chip: 'bg-[rgba(217,171,102,0.22)] text-[rgba(95,62,22,0.95)] border border-[rgba(196,145,70,0.4)]',
    label: 'text-[rgba(95,62,22,0.9)]',
    headingBar: 'bg-[rgba(217,171,102,0.18)] border-b border-[rgba(196,145,70,0.34)]',
  },
  rose: {
    shell:
      'bg-gradient-to-b from-[rgba(195,116,140,0.24)] via-[rgba(195,116,140,0.09)] to-[rgba(195,116,140,0.045)]',
    accent: 'bg-[rgba(175,90,118,0.95)]',
    accentSoft: 'shadow-[inset_0_0_0_1px_rgba(175,90,118,0.38)]',
    chip: 'bg-[rgba(195,116,140,0.2)] text-[rgba(105,48,68,0.95)] border border-[rgba(175,90,118,0.4)]',
    label: 'text-[rgba(105,48,68,0.9)]',
    headingBar: 'bg-[rgba(195,116,140,0.16)] border-b border-[rgba(175,90,118,0.32)]',
  },
} as const;

function getSectionColors(colorToken?: SectionColumnData['colorToken']) {
  return SECTION_COLOR_MAP[colorToken ?? 'sky'];
}

function ItemTimerButton({ item, buildStartTimerHref }: { item: TimelineItem; buildStartTimerHref?: (item: TimelineItem) => string | undefined }) {
  const href = buildStartTimerHref?.(item);
  if (!href) return null;

  return (
    <Link
      href={href}
      onClick={(event) => event.stopPropagation()}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted/50 transition-colors hover:bg-bg-elevated/60 hover:text-accent-teal"
      aria-label={`Start timer for ${item.label}`}
      title="Start focus timer"
    >
      <Play size={12} />
    </Link>
  );
}

function getConstraintPalette(kind?: TimelineItem['constraintKind']) {
  if (kind === 'until') {
    return {
      Icon: Flag,
      dotClass: 'bg-accent-mint/75',
      textClass: 'text-accent-mint',
      borderClass: 'border-accent-mint/30',
      bgClass: 'bg-accent-mint/10',
    };
  }

  if (kind === 'deadline') {
    return {
      Icon: AlarmClock,
      dotClass: 'bg-accent-amethyst/80',
      textClass: 'text-accent-amethyst',
      borderClass: 'border-accent-amethyst/30',
      bgClass: 'bg-accent-amethyst/10',
    };
  }

  return {
    Icon: Ban,
    dotClass: 'bg-accent-sakura/75',
    textClass: 'text-accent-sakura',
    borderClass: 'border-accent-sakura/30',
    bgClass: 'bg-accent-sakura/10',
  };
}

function ConstraintNotice({ item }: { item: TimelineItem }) {
  const effectiveMinute = item.constraintKind === 'until'
    ? (item.endMinute ?? item.startMinute)
    : item.startMinute;
  const palette = getConstraintPalette(item.constraintKind);
  const Icon = palette.Icon;

  return (
    <div className={`flex items-center gap-2 rounded-lg border ${palette.borderClass} ${palette.bgClass} px-2.5 py-1.5`}>
      <span className={`inline-flex h-1.5 w-1.5 shrink-0 rounded-full ${palette.dotClass}`} />
      <span className={`inline-flex shrink-0 ${palette.textClass}`}>
        <Icon size={11} />
      </span>
      <p className="text-[11px] font-medium text-text-muted">
        <span className={palette.textClass}>{item.label}</span>
        <span className="text-text-muted"> · {item.constraintKind === 'until' ? 'until ' : ''}{formatMinuteOfDay(effectiveMinute)}</span>
      </p>
    </div>
  );
}

function TimeRange({ item }: { item: TimelineItem }) {
  const endMinute =
    item.endMinute ?? (
      item.type === 'anchor'
        ? item.startMinute
        : item.type === 'time-block'
          ? item.startMinute + 30
          : item.startMinute + 60
    );

  return (
    <p className="text-xs font-semibold tabular-nums text-text-muted/80">
      {item.type === 'anchor' && item.endMinute == null
        ? formatMinuteOfDay(item.startMinute)
        : `${formatMinuteOfDay(item.startMinute)} - ${formatMinuteOfDay(endMinute)}`}
    </p>
  );
}

function BlockCard({
  dateKey,
  item,
  nowMinute,
  onItemClick,
  buildStartTimerHref,
}: {
  dateKey: string;
  item: TimelineItem;
  nowMinute?: number | null;
  onItemClick?: (item: TimelineItem) => void;
  buildStartTimerHref?: (item: TimelineItem) => string | undefined;
}) {
  const isWant = item.blockKind === 'want';
  const status = getItemStatus(item, nowMinute ?? null, dateKey);
  const accentClass = isWant ? 'text-accent-teal/70' : 'text-accent-sakura/70';
  const statusIcon =
    status === 'completed'
      ? <Check size={11} className="text-accent-mint" />
      : status === 'current'
        ? <Play size={11} className="fill-current text-accent-teal" />
        : null;

  return (
    <button
      type="button"
      onClick={() => onItemClick?.(item)}
      className="w-full rounded-lg bg-bg-elevated/50 px-3 py-2.5 text-left transition-colors hover:bg-bg-elevated/70"
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 inline-flex shrink-0 ${accentClass}`}>
          {isWant ? <Heart size={13} className="fill-current" /> : <Target size={13} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-text/90">{item.label}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <TimeRange item={item} />
                <span className="text-[10px] font-medium text-text-muted/60">
                  {formatDuration(item.durationMinutes ?? 0)}
                </span>
                {statusIcon}
              </div>
            </div>
            <ItemTimerButton item={item} buildStartTimerHref={buildStartTimerHref} />
          </div>
          {item.blockNote && (
            <p className="mt-1.5 text-[11px] font-medium text-text-muted/70 truncate">
              {item.blockNote}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function EventCard({
  item,
  buildStartTimerHref,
}: {
  item: TimelineItem;
  buildStartTimerHref?: (item: TimelineItem) => string | undefined;
}) {
  return (
    <div className="rounded-lg bg-bg-elevated/50 px-3 py-2.5">
      <div className="flex items-start gap-2.5">
        <CalendarDays size={13} className="mt-0.5 shrink-0 text-accent-terracotta/70" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-text/90">{item.label}</p>
              <TimeRange item={item} />
            </div>
            <ItemTimerButton item={item} buildStartTimerHref={buildStartTimerHref} />
          </div>
          {item.eventDescription && (
            <p className="mt-1 text-[11px] leading-relaxed text-text-muted/70 line-clamp-2">
              {item.eventDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AnchorCard({ item }: { item: TimelineItem }) {
  const palette = getAnchorColorPalette(item.anchorColor, item.anchorIcon ?? 'calendar');

  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ backgroundColor: `color-mix(in srgb, ${palette.solid} 8%, transparent)` }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: `color-mix(in srgb, ${palette.solid} 60%, transparent)` }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold" style={{ color: palette.deep }}>
            {item.label}
          </p>
          <TimeRange item={item} />
        </div>
      </div>
    </div>
  );
}

function EmptySectionState() {
  return (
    <div className="py-6 text-center">
      <p className="text-xs font-medium text-text-muted/50">Nothing scheduled</p>
    </div>
  );
}

function SectionItemCard(props: {
  dateKey: string;
  item: TimelineItem;
  nowMinute?: number | null;
  onItemClick?: (item: TimelineItem) => void;
  buildStartTimerHref?: (item: TimelineItem) => string | undefined;
}) {
  const { item } = props;

  if (item.type === 'time-block') {
    return <BlockCard {...props} />;
  }

  if (item.type === 'event') {
    return <EventCard item={item} buildStartTimerHref={props.buildStartTimerHref} />;
  }

  return <AnchorCard item={item} />;
}

export function DaySectionsBoard({
  dateKey,
  sections,
  nowMinute = null,
  buildStartTimerHref,
  onItemClick,
}: DaySectionsBoardProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div
        className="grid min-w-max gap-3 sm:gap-4"
        style={{ gridTemplateColumns: `repeat(${sections.length}, minmax(16rem, 1fr))` }}
      >
        {sections.map((section) => {
          const colors = getSectionColors(section.colorToken);

          return (
            <section
              key={section.id}
              className={`relative flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-border-subtle/55 shadow-md shadow-black/[0.06] ${colors.shell} ${colors.accentSoft}`}
            >
              {/* Strong left rail */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${colors.accent} opacity-90`}
                aria-hidden
              />

              {/* Section header — banded so each column reads as its own “zone” */}
              <div className={`relative mb-3 -mx-px -mt-px rounded-t-[0.95rem] px-3 py-2.5 pl-4 ${colors.headingBar}`}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className={`font-display text-base font-bold tracking-tight ${colors.label}`}>
                    {section.label}
                  </h3>
                  <span className="text-[11px] font-semibold tabular-nums text-text-muted/75">
                    {formatMinuteOfDay(section.startMinute)} – {formatMinuteOfDay(section.endMinute)}
                  </span>
                </div>

                {section.focusItems.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {section.focusItems.map((focus) => (
                      <span
                        key={focus}
                        className={`inline-flex max-w-full truncate rounded-lg px-2 py-0.5 text-[10px] font-semibold ${colors.chip}`}
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                )}

                {section.constraints.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {section.constraints.map((constraint) => (
                      <ConstraintNotice key={constraint.id} item={constraint} />
                    ))}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pl-4">
                {section.items.length === 0 ? (
                  <EmptySectionState />
                ) : (
                  section.items.map((item) => (
                    <SectionItemCard
                      key={item.id}
                      dateKey={dateKey}
                      item={item}
                      nowMinute={nowMinute}
                      onItemClick={onItemClick}
                      buildStartTimerHref={buildStartTimerHref}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
