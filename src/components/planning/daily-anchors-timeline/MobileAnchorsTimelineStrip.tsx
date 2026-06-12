'use client';

import { motion } from 'framer-motion';
import { Calendar, Check, Moon } from 'lucide-react';
import { formatTimeLabel, formatTimeRange, parseHHMMToMinutes, type AnchorId, type DailyAnchor } from '@/lib/anchors';
import { formatShortTime } from '@/lib/anchors-mobile-ui';
import { type TimeBlockKind } from '@/lib/time-block-planner';
import type { CalendarEvent } from '@/features/planning/types';
import { getCalendarMarkerColor } from '@/components/planning/MiniCalendar';
import { iconByName, gradientByIcon, getTimePosition, oaoaRhythmSegmentStyle, getRiverFlowGradient } from './helpers';
import { TimelineNowMarker } from './overlays';

export interface MobileAnchorsTimelineStripProps {
  hourMarkers: { hour: number; label: string }[];
  sortedAnchors: DailyAnchor[];
  todayCalendarEvents: CalendarEvent[];
  /** Elapsed time through the day window (matches “now” marker). */
  timeFillPercent: number;
  showNowMarker: boolean;
  isLoaded: boolean;
  activeAnchor: DailyAnchor;
  toggleAnchor: (id: AnchorId) => void;
  onToggleSkip: (id: AnchorId, isSkipped: boolean) => void;
  isPlannerLoaded: boolean;
  onAgainRhythm: {
    segments: Array<{
      id: string;
      kind: TimeBlockKind;
      label: string;
      left: number;
      width: number;
      isActive: boolean;
    }>;
    gapMarkers: Array<{ id: string; left: number; prevKind: TimeBlockKind }>;
  };
}

/** Compact timeline for viewports below lg: hour axis + track + anchor markers above the daily list. */
export function MobileAnchorsTimelineStrip({
  hourMarkers,
  sortedAnchors,
  todayCalendarEvents,
  timeFillPercent,
  showNowMarker,
  isLoaded,
  activeAnchor,
  toggleAnchor,
  onToggleSkip,
  isPlannerLoaded,
  onAgainRhythm,
}: MobileAnchorsTimelineStripProps) {
  if (sortedAnchors.length === 0 && onAgainRhythm.segments.length === 0) {
    return null;
  }

  return (
    <div
      className="daily-overview-mobile-timeline-shell mb-3 rounded-2xl border border-border-subtle/60 px-3 pt-2.5 pb-3"
      aria-label="Daily anchors timeline"
    >
      <div className="flex justify-between gap-1 mb-1.5 px-0.5">
        {hourMarkers.map(({ hour, label }) => (
          <span key={hour} className="daily-anchors-hour-tick text-[9px] text-text-muted/45 font-medium tabular-nums">
            {label}
          </span>
        ))}
      </div>

      <div className="relative h-11 py-1">
        <div className="daily-anchors-track-base absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-bg-surface/40 via-bg-surface/60 to-bg-surface/40 overflow-hidden" />

        <motion.div
          className="daily-anchors-track-progress absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-secondary via-primary to-accent-teal"
          initial={{ width: 0 }}
          animate={{ width: `${timeFillPercent}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {isPlannerLoaded && onAgainRhythm.segments.length > 0 && (
          <div className="daily-overview-oaoa-rhythm pointer-events-none absolute inset-0 z-[10] overflow-visible opacity-80" aria-hidden>
            {onAgainRhythm.segments.map((seg) => (
              <div
                key={`oaoa-seg-mobile-${seg.id}`}
                title={seg.label}
                className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full border ${
                  seg.isActive ? 'z-[1] scale-[1.03]' : 'z-0'
                }`}
                style={{
                  ...oaoaRhythmSegmentStyle(seg.kind, seg.isActive),
                  left: `${seg.left}%`,
                  width: `${Math.max(seg.width, 0.35)}%`,
                  minWidth: seg.isActive ? 10 : 7,
                }}
              />
            ))}
            {onAgainRhythm.gapMarkers.map((gap) => {
              const c = gap.prevKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)';
              return (
                <div
                  key={`${gap.id}-mobile`}
                  className="absolute top-1/2 z-[2] flex h-10 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  style={{ left: `${gap.left}%` }}
                >
                  <div
                    className="h-full w-[4px] rounded-full border-2 border-bg-elevated/90"
                    style={{
                      background: `linear-gradient(180deg, transparent 0%, ${c} 22%, ${c} 78%, transparent 100%)`,
                      boxShadow: `0 0 12px color-mix(in srgb, ${c} 55%, transparent), inset 0 0 0 1px color-mix(in srgb, ${c} 40%, transparent)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {todayCalendarEvents.map((event) => {
          const eventDate = new Date(event.date);
          const displayTime = `${String(eventDate.getHours()).padStart(2, '0')}:${String(eventDate.getMinutes()).padStart(2, '0')}`;
          const position = getTimePosition(displayTime);
          const marker = getCalendarMarkerColor(event.type);
          const eventLabel = event.title?.trim() || 'Calendar';
          return (
            <div
              key={event.id ?? `mobile-cal-${event.date}`}
              className="pointer-events-none absolute top-1/2 z-[14] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${position}%` }}
              aria-hidden
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle/60 bg-bg-elevated/85 shadow-sm backdrop-blur-sm"
                title={`${eventLabel}, ${formatTimeLabel(displayTime)}`}
              >
                <Calendar className="h-3.5 w-3.5 opacity-90" strokeWidth={2} style={{ color: marker }} />
              </div>
            </div>
          );
        })}

        {sortedAnchors.map((anchor) => {
          const Icon = iconByName[anchor.icon] || Moon;
          const isActive = anchor.id === activeAnchor.id;
          const isDone = anchor.status === 'done';
          const isMissed = anchor.status === 'missed';
          const isSkipped = anchor.status === 'skipped';
          const isRange = Boolean(
            anchor.endTime && parseHHMMToMinutes(anchor.endTime) > parseHHMMToMinutes(anchor.scheduledTime),
          );

          const displayTime = anchor.scheduledTime;
          const position = getTimePosition(displayTime);
          const endPosition = isRange && anchor.endTime ? getTimePosition(anchor.endTime) : null;

          const stateClass = isDone
            ? 'is-done'
            : isMissed
              ? 'is-missed'
              : isSkipped
                ? 'is-skipped'
                : isActive
                  ? 'is-active'
                  : 'is-future';

          if (isRange && endPosition != null && endPosition > position) {
            const segmentLeft = getTimePosition(displayTime);
            const segmentRight = anchor.endTime ? getTimePosition(anchor.endTime) : endPosition;
            const segmentWidth = segmentRight - segmentLeft;
            const w = Math.max(segmentWidth, 2);
            return (
              <button
                key={anchor.id}
                type="button"
                disabled={!isLoaded}
                title={anchor.endTime ? formatTimeRange(displayTime, anchor.endTime, true) : anchor.label}
                aria-label={`${anchor.label}, ${anchor.endTime ? formatTimeRange(displayTime, anchor.endTime, true) : displayTime}`}
                className={`
                  absolute top-1/2 -translate-y-1/2 z-[15] h-2 min-h-[6px] rounded-full border shadow-sm transition-transform
                  active:scale-[0.98]
                  ${isDone
                    ? 'border-secondary/45 bg-secondary/75'
                    : isMissed
                      ? 'border-border-subtle/50 bg-bg-surface/50'
                      : isSkipped
                        ? 'border-border-subtle/45 bg-bg-surface/40 grayscale'
                        : `border-primary/25 bg-gradient-to-r ${getRiverFlowGradient(anchor.icon).from} ${getRiverFlowGradient(anchor.icon).to} opacity-90`
                  }
                  ${!isLoaded ? 'opacity-50' : ''}
                `}
                style={{
                  left: `${segmentLeft}%`,
                  width: `${w}%`,
                  minWidth: '8px',
                }}
                onClick={() => toggleAnchor(anchor.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSkip(anchor.id, isSkipped);
                }}
              />
            );
          }

          return (
            <div
              key={anchor.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
              style={{ left: `${position}%` }}
            >
              <button
                type="button"
                disabled={!isLoaded}
                title={anchor.label}
                aria-label={`${anchor.label}, ${formatShortTime(displayTime)}`}
                onClick={() => toggleAnchor(anchor.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSkip(anchor.id, isSkipped);
                }}
                className={`
                  daily-anchors-dot relative flex h-8 w-8 items-center justify-center rounded-[0.95rem] border-2 shadow-md
                  transition-all duration-300 overflow-hidden
                  ${
                    isDone
                      ? 'bg-gradient-to-br from-secondary to-secondary/80 text-white border-secondary/50'
                      : isMissed
                        ? 'bg-bg-surface/50 text-text-muted/40 border-border-subtle/50'
                        : isSkipped
                          ? 'bg-bg-surface/40 text-text-muted/45 border-border-subtle/45 grayscale'
                          : isActive
                            ? `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-2 border-primary/30 text-text`
                            : `bg-gradient-to-br ${gradientByIcon(anchor.icon)} border-2 border-border-subtle text-text-muted`
                  }
                  ${stateClass}
                  ${isActive && !isDone && !isMissed && !isSkipped ? 'ring-2 ring-accent-teal/25 animate-pulse-subtle' : ''}
                  active:scale-95
                  ${!isLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {!isDone && !isMissed && !isSkipped && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientByIcon(anchor.icon)} opacity-35`}
                    aria-hidden
                  />
                )}
                <span className="relative z-10">
                  {isDone ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <Icon size={16} strokeWidth={1.7} className={isActive ? 'text-text' : ''} />
                  )}
                </span>
              </button>
            </div>
          );
        })}

        <TimelineNowMarker leftPercent={timeFillPercent} show={showNowMarker} compact />
      </div>
    </div>
  );
}
