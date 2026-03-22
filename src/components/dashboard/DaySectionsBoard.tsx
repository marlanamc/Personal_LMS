'use client';

import Link from 'next/link';
import {
  CalendarDays,
  Check,
  Circle,
  FileText,
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

// Soft, embedded surface styling - sections feel like regions, not cards
const SECTION_COLOR_MAP = {
  dawn: {
    shell: 'bg-gradient-to-b from-accent-sakura/[0.04] to-transparent',
    accent: 'bg-accent-sakura/40',
    chip: 'bg-accent-sakura/8 text-accent-sakura/80',
    label: 'text-accent-sakura/60',
  },
  mint: {
    shell: 'bg-gradient-to-b from-accent-mint/[0.05] to-transparent',
    accent: 'bg-accent-mint/45',
    chip: 'bg-accent-mint/10 text-accent-mint/80',
    label: 'text-accent-mint/60',
  },
  sky: {
    shell: 'bg-gradient-to-b from-accent-teal/[0.04] to-transparent',
    accent: 'bg-accent-teal/40',
    chip: 'bg-accent-teal/8 text-accent-teal/80',
    label: 'text-accent-teal/60',
  },
  sand: {
    shell: 'bg-gradient-to-b from-[rgba(217,171,102,0.04)] to-transparent',
    accent: 'bg-[rgba(217,171,102,0.4)]',
    chip: 'bg-[rgba(217,171,102,0.1)] text-[rgba(176,128,56,0.8)]',
    label: 'text-[rgba(176,128,56,0.6)]',
  },
  rose: {
    shell: 'bg-gradient-to-b from-[rgba(195,116,140,0.04)] to-transparent',
    accent: 'bg-[rgba(195,116,140,0.4)]',
    chip: 'bg-[rgba(195,116,140,0.1)] text-[rgba(182,99,125,0.8)]',
    label: 'text-[rgba(182,99,125,0.6)]',
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

function ConstraintNotice({ item }: { item: TimelineItem }) {
  const effectiveMinute = item.constraintKind === 'until'
    ? (item.endMinute ?? item.startMinute)
    : item.startMinute;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-accent-sakura/5 px-2.5 py-1.5">
      <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent-sakura/60" />
      <p className="text-[11px] font-medium text-text-muted">
        {item.label} · {item.constraintKind === 'until' ? 'until ' : ''}
        {formatMinuteOfDay(effectiveMinute)}
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
        className="grid min-w-max gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${sections.length}, minmax(16rem, 1fr))` }}
      >
        {sections.map((section) => {
          const colors = getSectionColors(section.colorToken);

          return (
            <section
              key={section.id}
              className={`relative flex min-h-[22rem] flex-col rounded-xl px-3 py-3 ${colors.shell}`}
            >
              {/* Subtle left accent edge */}
              <div className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full ${colors.accent}`} />

              {/* Section header - minimal, inline */}
              <div className="mb-3 pl-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-text/90">
                    {section.label}
                  </h3>
                  <span className="text-[10px] font-medium text-text-muted/50 tabular-nums">
                    {formatMinuteOfDay(section.startMinute)} - {formatMinuteOfDay(section.endMinute)}
                  </span>
                </div>

                {section.focusItems.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {section.focusItems.map((focus) => (
                      <span
                        key={focus}
                        className={`inline-flex max-w-full truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium ${colors.chip}`}
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

              {/* Items - with subtle spacing */}
              <div className="flex flex-1 flex-col gap-2 pl-2">
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
