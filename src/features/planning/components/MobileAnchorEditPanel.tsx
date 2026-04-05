'use client';

import { MobileTimeScrubber } from './MobileTimeScrubber';
import { formatTimeRange, parseHHMMToMinutes } from '@/lib/anchors';
import type { AnchorId } from '@/lib/anchors';
import { formatShortTime } from '@/lib/anchors-mobile-ui';

interface MobileAnchorEditPanelProps {
  anchor: {
    id: AnchorId;
    label: string;
    scheduledTime: string;
    endTime?: string;
    status: 'waiting' | 'done' | 'missed' | 'skipped';
  };
  nowMinutes: number | null;
  timeUntilLabel: string;
  nextEventLabel: string | null;
  onTimeChange: (newTime: string) => void;
  onEndTimeChange: (newTime: string) => void;
  onToggleSkip: () => void;
  onClose: () => void;
}

export function MobileAnchorEditPanel({
  anchor,
  nowMinutes,
  timeUntilLabel,
  nextEventLabel,
  onTimeChange,
  onEndTimeChange,
  onToggleSkip,
  onClose,
}: MobileAnchorEditPanelProps) {
  const isSkipped = anchor.status === 'skipped';
  const hasRange = Boolean(
    anchor.endTime && parseHHMMToMinutes(anchor.endTime) > parseHHMMToMinutes(anchor.scheduledTime)
  );

  return (
    <div
      className="mt-2 rounded-xl border-2 border-primary/25 bg-bg-elevated shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-3 py-2.5 ring-2 ring-primary/10"
      role="dialog"
      aria-label={`Adjust ${anchor.label} time`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/65">Anchor Time</p>
          <p className="mt-0.5 text-lg font-semibold leading-tight text-text tabular-nums">
            {hasRange && anchor.endTime
              ? formatTimeRange(anchor.scheduledTime, anchor.endTime, true)
              : formatShortTime(anchor.scheduledTime)}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSkip();
          }}
          className="shrink-0 rounded-full border border-border-subtle/80 bg-bg-surface/80 px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] text-text-secondary/80 transition-colors hover:border-accent-teal/40 hover:bg-bg-surface hover:text-text"
        >
          {isSkipped ? 'Undo skip' : 'Skip today'}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {isSkipped ? (
          <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] font-medium text-text-muted">
            Skipped for today
          </span>
        ) : (
          <>
            <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] text-text-muted">
              In: <span className="ml-1 font-semibold text-text">{timeUntilLabel}</span>
            </span>
            {nextEventLabel ? (
              <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] text-text-muted">
                Next: <span className="ml-1 font-semibold text-text">{nextEventLabel}</span>
              </span>
            ) : null}
          </>
        )}
        {nowMinutes === null ? (
          <span className="inline-flex items-center rounded-full bg-bg-surface/85 px-2.5 py-1 text-[11px] text-text-muted/80">
            Live time unavailable
          </span>
        ) : null}
      </div>

      <MobileTimeScrubber
        isOpen
        currentTime={anchor.scheduledTime}
        currentEndTime={hasRange ? anchor.endTime : undefined}
        onTimeChange={onTimeChange}
        onEndTimeChange={onEndTimeChange}
        onClose={onClose}
      />
      <div className="mt-3 pt-2 border-t border-border-subtle/60">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold touch-manipulation active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
