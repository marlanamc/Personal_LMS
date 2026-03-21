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

const SECTION_COLOR_MAP = {
  dawn: {
    shell: 'border-accent-sakura/25 bg-[color-mix(in_srgb,var(--color-accent-sakura)_7%,var(--color-bg-surface))]',
    chip: 'bg-accent-sakura/10 text-accent-sakura',
    line: 'bg-accent-sakura/35',
  },
  mint: {
    shell: 'border-accent-mint/25 bg-[color-mix(in_srgb,var(--color-accent-mint)_7%,var(--color-bg-surface))]',
    chip: 'bg-accent-mint/12 text-accent-mint',
    line: 'bg-accent-mint/40',
  },
  sky: {
    shell: 'border-accent-teal/25 bg-[color-mix(in_srgb,var(--color-accent-teal)_6%,var(--color-bg-surface))]',
    chip: 'bg-accent-teal/10 text-accent-teal',
    line: 'bg-accent-teal/40',
  },
  sand: {
    shell: 'border-[rgba(217,171,102,0.24)] bg-[rgba(217,171,102,0.07)]',
    chip: 'bg-[rgba(217,171,102,0.14)] text-[rgb(176,128,56)]',
    line: 'bg-[rgba(217,171,102,0.45)]',
  },
  rose: {
    shell: 'border-[rgba(195,116,140,0.24)] bg-[rgba(195,116,140,0.07)]',
    chip: 'bg-[rgba(195,116,140,0.14)] text-[rgb(182,99,125)]',
    line: 'bg-[rgba(195,116,140,0.42)]',
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
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-subtle/45 bg-bg-surface/85 text-text-muted transition-colors hover:bg-bg-elevated hover:text-accent-teal"
      aria-label={`Start timer for ${item.label}`}
      title="Start focus timer"
    >
      <Play size={13} />
    </Link>
  );
}

function ConstraintNotice({ item }: { item: TimelineItem }) {
  const effectiveMinute = item.constraintKind === 'until'
    ? (item.endMinute ?? item.startMinute)
    : item.startMinute;

  return (
    <div className="rounded-2xl border border-border-subtle/45 bg-bg-surface/88 px-3 py-2 shadow-sm">
      <div className="flex items-start gap-2">
        <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-accent-sakura/70" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/80">
            Constraint
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-text">
            {item.label}
          </p>
          <p className="mt-1 text-xs font-medium text-text-muted">
            {item.constraintKind === 'until' ? 'Hard stop at ' : 'Starts at '}
            {formatMinuteOfDay(effectiveMinute)}
          </p>
        </div>
      </div>
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
  const accentClass = isWant ? 'text-accent-teal' : 'text-accent-sakura';
  const badgeClass = isWant ? 'bg-accent-teal/10 text-accent-teal' : 'bg-accent-sakura/10 text-accent-sakura';
  const statusIcon =
    status === 'completed'
      ? <Check size={13} />
      : status === 'current'
        ? <Play size={13} className="fill-current" />
        : <Circle size={12} />;

  return (
    <button
      type="button"
      onClick={() => onItemClick?.(item)}
      className="w-full rounded-[1.3rem] border border-border-subtle/45 bg-bg-elevated/85 px-3.5 py-3 text-left shadow-sm transition-colors hover:bg-bg-elevated"
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 inline-flex shrink-0 ${accentClass}`}>
          {isWant ? <Heart size={15} className="fill-current" /> : <Target size={15} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">{item.label}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <TimeRange item={item} />
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${badgeClass}`}>
                  {statusIcon}
                  {item.blockKind === 'want' ? 'Want' : 'Focus'}
                </span>
                <span className="text-[11px] font-semibold text-text-muted/75">
                  {formatDuration(item.durationMinutes ?? 0)}
                </span>
              </div>
            </div>
            <ItemTimerButton item={item} buildStartTimerHref={buildStartTimerHref} />
          </div>
          {item.blockNote ? (
            <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-border-subtle/45 bg-bg-surface/70 px-2.5 py-1 text-[11px] font-medium text-text-muted">
              <FileText size={11} />
              <span className="truncate">{item.blockNote}</span>
            </div>
          ) : null}
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
    <div className="rounded-[1.3rem] border border-border-subtle/45 bg-bg-elevated/85 px-3.5 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <CalendarDays size={15} className="mt-0.5 shrink-0 text-accent-terracotta" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">{item.label}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <TimeRange item={item} />
                <span className="inline-flex rounded-full bg-accent-terracotta/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-terracotta">
                  Event
                </span>
              </div>
            </div>
            <ItemTimerButton item={item} buildStartTimerHref={buildStartTimerHref} />
          </div>
          {item.eventDescription ? (
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {item.eventDescription}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AnchorCard({ item }: { item: TimelineItem }) {
  const palette = getAnchorColorPalette(item.anchorColor, item.anchorIcon ?? 'calendar');
  const isRange = item.endMinute != null && item.endMinute > item.startMinute;
  const statusLabel =
    item.anchorStatus === 'done'
      ? 'Done'
      : item.anchorStatus === 'skipped'
        ? 'Skipped'
        : 'Anchor';

  return (
    <div
      className="rounded-[1.3rem] border px-3.5 py-3 shadow-sm"
      style={{ borderColor: palette.border, backgroundColor: palette.soft }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: palette.solid }} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold" style={{ color: palette.deep }}>
            {item.label}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <TimeRange item={item} />
            <span
              className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ backgroundColor: 'rgba(255,255,255,0.45)', color: palette.deep }}
            >
              {isRange ? 'Anchor block' : statusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySectionState() {
  return (
    <div className="rounded-[1.3rem] border border-dashed border-border-subtle/40 bg-bg-surface/50 px-3.5 py-5 text-center">
      <p className="text-sm font-semibold text-text-muted">Nothing scheduled in this section yet.</p>
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
        style={{ gridTemplateColumns: `repeat(${sections.length}, minmax(17rem, 1fr))` }}
      >
        {sections.map((section) => {
          const colors = getSectionColors(section.colorToken);

          return (
            <section
              key={section.id}
              className={`flex min-h-[24rem] flex-col rounded-[1.8rem] border p-4 shadow-sm backdrop-blur-sm ${colors.shell}`}
            >
              <div className="sticky top-0 z-10 -mx-1 rounded-[1.3rem] bg-bg-surface/88 px-3 py-3 backdrop-blur-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/80">
                      Day Section
                    </p>
                    <h3 className="mt-1 text-lg font-display font-bold text-text">
                      {section.label}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-text-muted/85">
                      {formatMinuteOfDay(section.startMinute)} - {formatMinuteOfDay(section.endMinute)}
                    </p>
                  </div>
                  <span className={`mt-1 inline-flex h-2.5 w-10 rounded-full ${colors.line}`} />
                </div>

                {section.focusItems.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {section.focusItems.map((focus) => (
                      <span
                        key={focus}
                        className={`inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors.chip}`}
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                ) : null}

                {section.constraints.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {section.constraints.map((constraint) => (
                      <ConstraintNotice key={constraint.id} item={constraint} />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-1 flex-col gap-3">
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
