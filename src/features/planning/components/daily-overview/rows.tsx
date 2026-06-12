'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { Anchor as AnchorTypeIcon, Calendar, CalendarDays, Clock, Layers, Timer, type LucideIcon } from 'lucide-react';
import type { CalendarPlannerApi } from '@/features/planning/hooks/useCalendarPlanner';
import { getAnchorColorPalette, type AnchorId, type DailyAnchor } from '@/lib/anchors';
import { getAnchorMobileChipLabels } from '@/lib/anchors-mobile-ui';
import { getCalendarMarkerColor } from '@/components/planning/MiniCalendar';
import type { CalendarEvent } from '@/features/planning/types';
import type { DailyOverviewItem } from '@/types/daily-overview';
import { type OverviewScheduleStatus } from '@/lib/daily-overview-schedule-status';
import { boundaryKindRailClass, getAnchorOverviewTimeChipStyles, getAnchorOrbStyles, getAnchorRowChromeStyles, getBoundaryKindAccent, getBoundaryOverviewTimeChipStyles, getCalendarMarkerTimeChipStyles, getOverviewCurrentRowHighlightStyle, getOverviewCurrentStatusBadgeStyle, getSessionOverviewTimeChipStyles, overviewOrbDepthClass, overviewOrbDepthDashedClass } from '../daily-overview-styles';
import { useTheme } from '@/context/ThemeContext';
import { MobileAnchorEditPanel } from '../MobileAnchorEditPanel';
import { cn } from '@/lib/utils';
import type { DailyAnchorsApi } from '@/components/daily-anchors/useDailyAnchors';
import { iconByName, formatCompactAnchorChipTime, overviewTimeChipButtonClass, overviewTimeChipStaticClass, SESSION_ROW_ACCENT } from './helpers';

export function OverviewKindMeta({
  label,
  icon: Icon,
  muted,
  title: titleAttr,
}: {
  label: string;
  icon: LucideIcon;
  muted?: boolean;
  /** Optional longer description for tooltips / accessibility */
  title?: string;
}) {
  return (
    <span
      title={titleAttr}
      className={cn(
        'inline-flex items-center gap-0.5 text-[10px] font-medium text-text-muted/75',
        muted && 'opacity-70',
      )}
    >
      <Icon className={cn('h-2.5 w-2.5 shrink-0', muted ? 'opacity-75' : 'opacity-90')} strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}

export function OverviewMetaSeparator() {
  return (
    <span className="shrink-0 select-none text-[10px] text-text-muted/35" aria-hidden>
      ·
    </span>
  );
}

export function OverviewRowStatusBadge({
  status,
  currentAccent,
}: {
  status: OverviewScheduleStatus | null | undefined;
  /** When `current`, matches row anchor / marker (hex or `var(--…)`) */
  currentAccent?: string;
}) {
  if (!status) return null;
  const label = status === 'current' ? 'Current' : 'Up Next';
  if (status === 'up-next') {
    return (
      <span
        className="shrink-0 rounded-full border border-primary/40 bg-primary/12 px-2 py-0.5 text-[10px] font-semibold leading-tight tracking-wide text-primary"
        aria-label={label}
      >
        {label}
      </span>
    );
  }
  return (
    <span
      style={currentAccent ? getOverviewCurrentStatusBadgeStyle(currentAccent) : undefined}
      className={cn(
        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-tight tracking-wide',
        !currentAccent && 'border border-primary/35 bg-primary/10 text-primary',
      )}
      aria-label={label}
    >
      {label}
    </span>
  );
}

export interface DailyOverviewListProps {
  calendarEvents: CalendarEvent[];
  calendarPlanner: CalendarPlannerApi;
  dailyAnchors: DailyAnchorsApi;
}

export function AnchorOverviewRow({
  item,
  anchorData,
  openEditorAnchorId,
  setOpenEditorAnchorId,
  todayAnchors,
  wakeAnchorForToday,
  nowMinutes,
  isLoaded,
  toggleAnchor,
  handleTimeChange,
  handleEndTimeChange,
  handleToggleSkip,
  scheduleStatus,
}: {
  item: DailyOverviewItem;
  anchorData: DailyAnchor;
  openEditorAnchorId: AnchorId | null;
  setOpenEditorAnchorId: Dispatch<SetStateAction<AnchorId | null>>;
  todayAnchors: DailyAnchor[];
  wakeAnchorForToday: DailyAnchor | undefined;
  nowMinutes: number | null;
  isLoaded: boolean;
  toggleAnchor: (id: AnchorId) => void;
  handleTimeChange: (id: AnchorId, t: string) => void;
  handleEndTimeChange: (id: AnchorId, t: string) => void;
  handleToggleSkip: (id: AnchorId) => void;
  scheduleStatus: OverviewScheduleStatus | null | undefined;
}) {
  const isEditorOpen = openEditorAnchorId === item.id;
  const { timeUntilLabel, nextEventLabel } = getAnchorMobileChipLabels(
    anchorData,
    todayAnchors,
    wakeAnchorForToday,
    nowMinutes
  );
  const isSkipped = anchorData.status === 'skipped';
  const id = item.id as AnchorId;
  const palette = getAnchorColorPalette(anchorData.color, anchorData.icon);
  const { resolvedTheme } = useTheme();
  const anchorTimeChipLabel = formatCompactAnchorChipTime(anchorData.scheduledTime, anchorData.endTime);

  const done = item.isDone && !isSkipped;

  return (
    <div role="group" aria-label={`Anchor: ${item.label}, ${item.time}${done ? ', completed' : ''}`}>
      <div
        className={cn(
          'group flex w-full items-start border-l-[3px] px-5 pl-4 transition-colors',
          done ? 'gap-2.5 py-2 max-lg:py-2 lg:py-2.5 hover:bg-bg-elevated/28' : 'gap-2.5 py-3 max-lg:py-3 lg:gap-3 lg:py-4 hover:bg-bg-elevated/40',
        )}
        style={{
          ...getAnchorRowChromeStyles(palette, resolvedTheme, done),
          ...(scheduleStatus === 'current' && !done ? getOverviewCurrentRowHighlightStyle(palette.solid) : {}),
        }}
      >
        <button
          type="button"
          disabled={!isLoaded}
          onClick={() => toggleAnchor(id)}
          className={cn(
            'flex shrink-0 items-center justify-center',
            done
              ? 'h-10 w-10 rounded-2xl lg:h-11 lg:w-11'
              : 'h-12 w-12 rounded-2xl lg:h-14 lg:w-14',
            item.isDone
              ? 'bg-secondary/20 text-secondary'
              : isSkipped
                ? 'bg-bg-surface/50 text-text-muted/50'
                : '',
            (item.isDone || isSkipped) && overviewOrbDepthClass,
            !item.isDone &&
              !isSkipped &&
              'transition-transform duration-200 will-change-transform group-hover:-translate-y-px active:translate-y-0',
          )}
          style={getAnchorOrbStyles(palette, resolvedTheme, item.isDone, isSkipped)}
          aria-label={`Toggle ${item.label}`}
        >
          {item.isDone ? (
            <svg
              className={done ? 'h-4 w-4 lg:h-5 lg:w-5' : 'h-5 w-5 lg:h-6 lg:w-6'}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (() => {
            const IconComponent = iconByName[item.icon];
            return IconComponent ? (
              <IconComponent className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.5} />
            ) : (
              <span>{item.icon}</span>
            );
          })()}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <button
              type="button"
              disabled={!isLoaded}
              onClick={() => setOpenEditorAnchorId((prev) => (prev === item.id ? null : id))}
              className={cn(
                'min-w-0 flex-1 text-left',
                isSkipped && 'text-text-muted/65 line-through decoration-text-muted/40',
                !isSkipped && done && 'text-[0.9375rem] font-medium text-text/88',
                !isSkipped && !done && 'text-base font-medium text-text',
              )}
              aria-expanded={isEditorOpen}
              aria-controls={isEditorOpen ? `anchor-edit-${item.id}` : undefined}
            >
              <p className="leading-snug">{item.label}</p>
            </button>
            <OverviewRowStatusBadge
              status={scheduleStatus}
              currentAccent={scheduleStatus === 'current' ? palette.solid : undefined}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <button
              type="button"
              disabled={!isLoaded}
              onClick={(e) => {
                e.stopPropagation();
                setOpenEditorAnchorId((prev) => (prev === item.id ? null : id));
              }}
              style={getAnchorOverviewTimeChipStyles(palette, {
                muted: done || isSkipped,
                skipped: isSkipped,
              })}
              className={cn(
                overviewTimeChipButtonClass,
                !isSkipped && !done && 'hover:brightness-[1.05] active:brightness-[0.98]',
                isSkipped && 'line-through decoration-text-muted/40',
              )}
              aria-label={`Adjust ${item.label} time`}
            >
              {anchorTimeChipLabel}
            </button>
            <OverviewMetaSeparator />
            <OverviewKindMeta label="Anchor" icon={AnchorTypeIcon} muted={done} />
          </div>
        </div>
      </div>
      {isEditorOpen && (
        <div id={`anchor-edit-${item.id}`} className="px-5 pb-4">
          <MobileAnchorEditPanel
            anchor={anchorData}
            nowMinutes={nowMinutes}
            timeUntilLabel={timeUntilLabel}
            nextEventLabel={nextEventLabel}
            onTimeChange={(t) => handleTimeChange(id, t)}
            onEndTimeChange={(t) => handleEndTimeChange(id, t)}
            onToggleSkip={() => handleToggleSkip(id)}
            onClose={() => setOpenEditorAnchorId(null)}
          />
        </div>
      )}
    </div>
  );
}

export function EventOverviewRow({
  item,
  onAcknowledge,
  scheduleStatus,
}: {
  item: DailyOverviewItem;
  onAcknowledge: () => void;
  scheduleStatus: OverviewScheduleStatus | null | undefined;
}) {
  const marker = getCalendarMarkerColor(item.eventType);
  const win = item.isAcknowledged;
  const detailText = item.description?.trim();
  const showDetail = !!detailText && detailText.toLowerCase() !== 'event';

  return (
    <button
      type="button"
      onClick={onAcknowledge}
      className={cn(
        'group flex w-full items-start border-l-[3px] px-5 pl-4 text-left transition-colors',
        win ? 'gap-2.5 py-2 max-lg:py-2 lg:py-2.5 hover:bg-bg-elevated/35' : 'gap-2.5 py-3 max-lg:py-3 lg:gap-3 lg:py-4 hover:bg-bg-elevated/50',
      )}
      style={{
        borderLeftColor: marker,
        backgroundColor: win
          ? `color-mix(in srgb, ${marker} 6%, var(--color-bg-surface))`
          : `color-mix(in srgb, ${marker} 11%, transparent)`,
        ...(scheduleStatus === 'current' && !win ? getOverviewCurrentRowHighlightStyle(marker) : {}),
      }}
      aria-label={`Calendar: ${item.label}, ${item.time}${win ? ', seen' : ''}`}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-2xl bg-bg-elevated/90',
          win ? 'h-10 w-10 lg:h-11 lg:w-11' : 'h-12 w-12 lg:h-14 lg:w-14',
          overviewOrbDepthClass,
        )}
      >
        {item.isAcknowledged ? (
          <svg
            className={cn('text-secondary', win ? 'h-4 w-4 lg:h-5 lg:w-5' : 'h-5 w-5 lg:h-6 lg:w-6')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <CalendarDays className="h-6 w-6 shrink-0 lg:h-7 lg:w-7" strokeWidth={1.5} style={{ color: marker }} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p
            className={cn(
              'min-w-0 flex-1 leading-snug',
              win ? 'text-base font-medium text-text/88' : 'text-lg font-semibold text-text',
            )}
          >
            {item.label}
          </p>
          <OverviewRowStatusBadge
            status={scheduleStatus}
            currentAccent={scheduleStatus === 'current' ? marker : undefined}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            style={getCalendarMarkerTimeChipStyles(marker, win)}
            className={overviewTimeChipStaticClass}
          >
            {item.time}
          </span>
          <OverviewMetaSeparator />
          <OverviewKindMeta label="Calendar" icon={Calendar} muted={win} />
        </div>
        {showDetail ? (
          <p className={cn('mt-0.5 text-text-muted', win ? 'text-xs opacity-90' : 'text-sm')}>{detailText}</p>
        ) : null}
      </div>
    </button>
  );
}

export function BoundaryOverviewRow({
  item,
  onAcknowledge,
  scheduleStatus,
}: {
  item: DailyOverviewItem;
  onAcknowledge: () => void;
  scheduleStatus: OverviewScheduleStatus | null | undefined;
}) {
  const rail = boundaryKindRailClass(item.boundaryKind ?? 'cutoff');
  const win = item.isAcknowledged;
  const boundaryAccent = getBoundaryKindAccent(item.boundaryKind ?? 'cutoff');

  return (
    <button
      type="button"
      onClick={onAcknowledge}
      className={cn(
        'group flex w-full items-start px-5 pl-4 text-left transition-colors',
        win
          ? 'gap-2 bg-bg-surface/40 py-2 max-lg:py-1.5 lg:py-2 hover:bg-bg-elevated/30'
          : 'gap-2 bg-bg-base/25 py-2.5 max-lg:py-2 lg:gap-2.5 lg:py-3 hover:bg-bg-elevated/40',
        rail,
      )}
      style={scheduleStatus === 'current' && !win ? getOverviewCurrentRowHighlightStyle(boundaryAccent) : undefined}
      aria-label={`Time boundary: ${item.label}, ${item.time}${win ? ', acknowledged' : ''}`}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle/90 bg-bg-surface/40',
          win ? 'h-9 w-9 lg:h-10 lg:w-10' : 'h-10 w-10 lg:h-12 lg:w-12',
          item.isAcknowledged ? 'border-secondary/40 bg-secondary/10' : 'text-text-muted',
          overviewOrbDepthDashedClass,
        )}
      >
        {item.isAcknowledged ? (
          <svg className="h-4 w-4 text-secondary lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          (() => {
            const IconComponent = iconByName[item.icon];
            return IconComponent ? (
              <IconComponent className="h-4 w-4 lg:h-[18px] lg:w-[18px]" strokeWidth={1.5} />
            ) : (
              <span>{item.icon}</span>
            );
          })()
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p
            className={cn(
              'min-w-0 flex-1 leading-snug',
              win ? 'text-[0.9375rem] font-medium text-text/88' : 'text-[0.9375rem] font-medium text-text',
            )}
          >
            {item.label}
          </p>
          <OverviewRowStatusBadge
            status={scheduleStatus}
            currentAccent={scheduleStatus === 'current' ? boundaryAccent : undefined}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            style={getBoundaryOverviewTimeChipStyles(item.boundaryKind ?? 'cutoff', win)}
            className={overviewTimeChipStaticClass}
          >
            {item.time}
          </span>
          <OverviewMetaSeparator />
          <OverviewKindMeta
            label="Boundary"
            title="Time boundary — limit on your schedule"
            icon={Clock}
            muted={win}
          />
        </div>
      </div>
    </button>
  );
}

export function SessionPlaceholderRow({
  item,
  onAcknowledge,
  scheduleStatus,
}: {
  item: DailyOverviewItem;
  onAcknowledge: () => void;
  scheduleStatus: OverviewScheduleStatus | null | undefined;
}) {
  const win = item.isAcknowledged;

  return (
    <button
      type="button"
      onClick={onAcknowledge}
      className={cn(
        'group flex w-full items-start border-l-[3px] border-border-subtle px-5 pl-4 text-left transition-colors',
        win ? 'gap-2.5 py-2 max-lg:py-2 lg:py-2.5 hover:bg-bg-elevated/35' : 'gap-2.5 py-3 max-lg:py-3 lg:gap-3 lg:py-4 hover:bg-bg-elevated/50',
      )}
      style={scheduleStatus === 'current' && !win ? getOverviewCurrentRowHighlightStyle(SESSION_ROW_ACCENT) : undefined}
      aria-label={`Time block: ${item.label}, ${item.time}${win ? ', acknowledged' : ''}`}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-accent/10 text-text-muted',
          win ? 'h-10 w-10 rounded-2xl lg:h-11 lg:w-11' : 'h-12 w-12 lg:h-14 lg:w-14',
          overviewOrbDepthClass,
        )}
      >
        {item.isAcknowledged ? (
          <svg
            className={cn('text-secondary', win ? 'h-4 w-4 lg:h-5 lg:w-5' : 'h-5 w-5 lg:h-6 lg:w-6')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <Calendar className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.5} />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p
            className={cn(
              'min-w-0 flex-1 leading-snug',
              win ? 'text-base font-medium text-text/88' : 'text-lg font-semibold text-text',
            )}
          >
            {item.label}
          </p>
          <OverviewRowStatusBadge
            status={scheduleStatus}
            currentAccent={scheduleStatus === 'current' ? SESSION_ROW_ACCENT : undefined}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span style={getSessionOverviewTimeChipStyles(win)} className={overviewTimeChipStaticClass}>
            {item.time}
          </span>
          <OverviewMetaSeparator />
          <OverviewKindMeta label="Time block" icon={Layers} muted={win} />
        </div>
        {item.description ? (
          <p className={cn('mt-0.5 text-text-muted', win ? 'text-xs opacity-90' : 'text-sm')}>{item.description}</p>
        ) : null}
      </div>
    </button>
  );
}

export function minutesFromMidnightToHHMM(m: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(m)));
  const h = Math.floor(clamped / 60);
  const min = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

export function OnAgainPlanOverviewRow({
  item,
  onAcknowledge,
  scheduleStatus,
}: {
  item: DailyOverviewItem;
  onAcknowledge: () => void;
  scheduleStatus: OverviewScheduleStatus | null | undefined;
}) {
  const boundaryAccent = getBoundaryKindAccent('cutoff');
  const win = item.isAcknowledged;

  return (
    <button
      type="button"
      onClick={onAcknowledge}
      className={cn(
        'group flex w-full items-start px-5 pl-4 text-left transition-colors',
        win
          ? 'gap-2 bg-bg-surface/40 py-2 max-lg:py-1.5 lg:py-2 hover:bg-bg-elevated/30'
          : 'gap-2 bg-bg-base/25 py-2.5 max-lg:py-2 lg:gap-2.5 lg:py-3 hover:bg-bg-elevated/40',
        boundaryKindRailClass('cutoff'),
      )}
      style={
        scheduleStatus === 'current' && !win
          ? getOverviewCurrentRowHighlightStyle(boundaryAccent)
          : undefined
      }
      aria-label={`${item.label}, ${item.time}${win ? ', acknowledged' : ''}`}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle/90 bg-bg-surface/40 text-text-muted',
          win ? 'h-9 w-9 lg:h-10 lg:w-10' : 'h-10 w-10 lg:h-12 lg:w-12',
          item.isAcknowledged ? 'border-secondary/40 bg-secondary/10' : 'text-text-muted',
          overviewOrbDepthDashedClass,
        )}
      >
        {item.isAcknowledged ? (
          <svg className="h-4 w-4 text-secondary lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <Timer className="h-4 w-4 lg:h-[18px] lg:w-[18px]" strokeWidth={1.5} aria-hidden />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p
            className={cn(
              'min-w-0 flex-1 leading-snug',
              win ? 'text-[0.9375rem] font-medium text-text/88' : 'text-[0.9375rem] font-medium text-text',
            )}
          >
            {item.label}
          </p>
          <OverviewRowStatusBadge
            status={scheduleStatus}
            currentAccent={scheduleStatus === 'current' ? boundaryAccent : undefined}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            style={getBoundaryOverviewTimeChipStyles('cutoff', win)}
            className={overviewTimeChipStaticClass}
          >
            {item.time}
          </span>
          <OverviewMetaSeparator />
          <OverviewKindMeta
            label="Plan"
            icon={Clock}
            title="On Again / Off Again — open day planner to edit"
          />
          {item.oaoaBlockCount != null && item.oaoaBlockCount > 0 ? (
            <>
              <OverviewMetaSeparator />
              <span className="rounded-full border border-border-subtle/55 bg-bg-elevated/70 px-2 py-px text-[9px] font-semibold uppercase tracking-[0.08em] text-text-muted tabular-nums">
                {item.oaoaBlockCount} {item.oaoaBlockCount === 1 ? 'block' : 'blocks'}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </button>
  );
}

