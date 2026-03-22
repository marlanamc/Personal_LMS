'use client';

import { useMemo, type RefObject } from 'react';
import type { TimelineConfig, TimelineItem } from '@/lib/unified-scheduler';
import {
  DEFAULT_TIMELINE_CONFIG,
  generateTimeLabels,
  getHeightForDuration,
  getItemStatus,
  getPositionForMinute,
  getTimelineHeight,
} from '@/lib/unified-scheduler';
import { TimelineAnchorMarker } from './items/TimelineAnchorMarker';
import { TimelineAnchorRangeMarker } from './items/TimelineAnchorRangeMarker';
import { TimelineEventCard } from './items/TimelineEventCard';
import { TimelineBlockCard } from './items/TimelineBlockCard';
import { TimelineConstraintMarker } from './items/TimelineConstraintMarker';
import { TimelineQuadrantBand } from './items/TimelineQuadrantBand';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DayTimelineProps {
  /** Date key for this timeline (YYYY-MM-DD) */
  dateKey: string;

  /** Items to display on the timeline */
  items: TimelineItem[];

  /** Current time in minutes from midnight, or null if not today */
  nowMinute?: number | null;

  /** Custom timeline configuration */
  config?: Partial<TimelineConfig>;

  /** Callback when an item is clicked */
  onItemClick?: (item: TimelineItem) => void;

  /** Build href for Focus Timer for time-block items; when provided, block cards show a Play button */
  buildStartTimerHref?: (item: TimelineItem) => string | undefined;

  /** Additional CSS classes */
  className?: string;

  /** Whether this is on mobile (affects interaction hints) */
  isMobile?: boolean;

  /** Optional ref for the current-time indicator so parents can scroll to it */
  nowIndicatorRef?: RefObject<HTMLDivElement | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function DayTimeline({
  dateKey,
  items,
  nowMinute = null,
  config: configOverrides,
  onItemClick,
  buildStartTimerHref,
  className,
  isMobile = false,
  nowIndicatorRef,
}: DayTimelineProps) {
  const config: TimelineConfig = useMemo(
    () => ({ ...DEFAULT_TIMELINE_CONFIG, ...configOverrides }),
    [configOverrides],
  );
  const timelineHeight = getTimelineHeight(config);
  const timelinePadding = isMobile ? 16 : 20;
  const gutterWidthClass = isMobile ? 'w-[3.4rem]' : 'w-[3.75rem]';

  // Generate time labels for the gutter
  const timeLabels = useMemo(() => generateTimeLabels(config), [config]);

  // Separate items by type for layered rendering; split anchors into point vs range
  const { pointAnchors, rangeAnchors, events, blocks, constraints, quadrants } = useMemo(() => {
    const anchors = items.filter((item) => item.type === 'anchor');
    const pointAnchors = anchors.filter((a) => a.endMinute == null || a.endMinute <= a.startMinute);
    const rangeAnchors = anchors.filter((a) => a.endMinute != null && a.endMinute > a.startMinute);
    return {
      quadrants: items.filter((item) => item.type === 'quadrant'),
      pointAnchors,
      rangeAnchors,
      events: items.filter((item) => item.type === 'event' && !item.isAllDay),
      constraints: items.filter((item) => item.type === 'constraint'),
      blocks: items.filter((item) => item.type === 'time-block'),
    };
  }, [items]);

  // Calculate position helpers
  const getTop = (minute: number) => getPositionForMinute(minute, config, timelinePadding);
  const getHeight = (duration: number) => getHeightForDuration(duration, config);

  // Check if now indicator should be shown
  const showNowIndicator =
    config.showNowIndicator &&
    nowMinute !== null &&
    nowMinute >= config.startHour * 60 &&
    nowMinute <= config.endHour * 60;

  return (
    <div
      className={cn(
        'flex rounded-none sm:rounded-2xl border-transparent sm:border sm:border-border-subtle/40 sm:bg-bg-elevated/30 overflow-hidden',
        className,
      )}
      style={{ minHeight: timelineHeight + timelinePadding * 2 }}
    >
      {/* Time labels column */}
      <div
        className={cn(
          'shrink-0 relative border-r border-border-subtle/40 bg-[#f5ebe0]/50 dark:bg-bg-base/60',
          gutterWidthClass,
        )}
        style={{ height: timelineHeight + timelinePadding * 2 }}
      >
        {timeLabels.map(({ minute, label }) => (
          <div
            key={minute}
            className="absolute left-0 right-0 pl-2 pr-1 text-[11px] font-semibold text-text-muted/80 tabular-nums sm:pl-2.5 sm:text-[10px]"
            style={{
              top: getTop(minute),
              transform: 'translateY(-50%)',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Timeline track */}
      <div
        className="flex-1 relative min-w-0"
        style={{ height: timelineHeight + timelinePadding * 2 }}
      >
        {/* Hour grid lines */}
        {config.showGridLines &&
          timeLabels.map(({ minute }) => (
            <div
              key={`line-${minute}`}
              className="absolute left-0 right-0 border-t border-border-subtle/30"
              style={{ top: getTop(minute) }}
            />
          ))}

        {/* Quadrant bands */}
        {quadrants
          .filter((item) => {
            const itemEnd = item.endMinute ?? item.startMinute;
            return itemEnd > config.startHour * 60 && item.startMinute < config.endHour * 60;
          })
          .map((item) => {
            const startMin = Math.max(item.startMinute, config.startHour * 60);
            const endMin = Math.min(item.endMinute ?? item.startMinute, config.endHour * 60);
            const duration = endMin - startMin;
            return (
              <TimelineQuadrantBand
                key={item.id}
                item={item}
                style={{
                  position: 'absolute',
                  left: isMobile ? '0.25rem' : '0.375rem',
                  right: isMobile ? '0.25rem' : '0.375rem',
                  top: getTop(startMin) + 2,
                  height: Math.max(getHeight(duration) - 4, 54),
                }}
              />
            );
          })}

        {/* Events layer (behind blocks) */}
        {events
          .filter((item) => {
            const itemEnd = item.endMinute ?? item.startMinute + 60;
            return itemEnd > config.startHour * 60 && item.startMinute < config.endHour * 60;
          })
          .map((item) => {
          const startMin = Math.max(item.startMinute, config.startHour * 60);
          const endMin = Math.min(item.endMinute ?? item.startMinute + 60, config.endHour * 60);
          const duration = endMin - startMin;
          const status = getItemStatus(item, nowMinute, dateKey);

          return (
            <TimelineEventCard
              key={item.id}
              item={item}
              style={{
                position: 'absolute',
                left: isMobile ? '0.25rem' : '0.375rem',
                right: isMobile ? '0.25rem' : '0.375rem',
                top: getTop(startMin) + 2,
                height: Math.max(getHeight(duration) - 2, 36),
              }}
              status={status}
              onClick={() => onItemClick?.(item)}
              startTimerHref={buildStartTimerHref?.(item)}
            />
          );
        })}

        {/* Constraints layer */}
        {constraints
          .filter((item) => {
            const itemEnd = item.endMinute ?? item.startMinute;
            return itemEnd > config.startHour * 60 && item.startMinute < config.endHour * 60;
          })
          .map((item) => {
            const startMin = Math.max(item.startMinute, config.startHour * 60);
            const rawEnd = item.endMinute ?? item.startMinute;
            const endMin = Math.min(rawEnd, config.endHour * 60);
            const duration = Math.max(endMin - startMin, 0);

            return (
              <TimelineConstraintMarker
                key={item.id}
                item={item}
                style={{
                  position: 'absolute',
                  left: isMobile ? '0.375rem' : '0.5rem',
                  right: isMobile ? '0.375rem' : '0.5rem',
                  top: getTop(startMin) + (item.constraintKind === 'until' ? 4 : 0),
                  height: item.constraintKind === 'until' ? Math.max(getHeight(duration) - 6, 40) : undefined,
                  transform: item.constraintKind === 'until' ? undefined : 'translateY(-50%)',
                }}
              />
            );
          })}

        {/* Time blocks layer */}
        {blocks
          .filter((item) => {
            const itemEnd = item.endMinute ?? item.startMinute + 30;
            return itemEnd > config.startHour * 60 && item.startMinute < config.endHour * 60;
          })
          .map((item) => {
          const startMin = Math.max(item.startMinute, config.startHour * 60);
          const endMin = Math.min(item.endMinute ?? item.startMinute + 30, config.endHour * 60);
          const duration = endMin - startMin;
          const status = getItemStatus(item, nowMinute, dateKey);

          // Check for overlaps with events
          const hasEventOverlap = events.some(
            (event) =>
              item.startMinute < (event.endMinute ?? event.startMinute + 60) &&
              (item.endMinute ?? item.startMinute + 30) > event.startMinute,
          );

          return (
            <TimelineBlockCard
              key={item.id}
              item={item}
              style={{
                position: 'absolute',
                left: isMobile ? '0.25rem' : '0.125rem',
                right: isMobile ? '0.25rem' : '0.125rem',
                top: getTop(startMin) + 2,
                height: Math.max(getHeight(duration) - 2, isMobile ? 52 : 44),
              }}
              status={status}
              hasOverlap={hasEventOverlap}
              onClick={() => onItemClick?.(item)}
              isMobile={isMobile}
              startTimerHref={buildStartTimerHref?.(item)}
            />
          );
        })}

        {/* Range anchors (block with start/end orbs) */}
        {rangeAnchors
          .filter((item) => {
            const endMin = item.endMinute ?? item.startMinute + 60;
            return endMin > config.startHour * 60 && item.startMinute < config.endHour * 60;
          })
          .map((item) => {
            const startMin = Math.max(item.startMinute, config.startHour * 60);
            const endMin = Math.min(item.endMinute ?? item.startMinute + 60, config.endHour * 60);
            const duration = endMin - startMin;
            return (
              <TimelineAnchorRangeMarker
                key={item.id}
                item={item}
                style={{
                  position: 'absolute',
                  left: isMobile ? '0.25rem' : '0.375rem',
                  right: isMobile ? '0.25rem' : '0.375rem',
                  top: getTop(startMin) + 2,
                  height: Math.max(getHeight(duration) - 2, 28),
                }}
              />
            );
          })}

        {/* Point anchor markers (on top) */}
        {pointAnchors.map((item) => {
          const anchorMinute = item.startMinute;
          if (anchorMinute < config.startHour * 60 || anchorMinute > config.endHour * 60) {
            return null;
          }
          return (
            <TimelineAnchorMarker
              key={item.id}
              item={item}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: getTop(anchorMinute),
                transform: 'translateY(-50%)',
              }}
            />
          );
        })}

        {/* Current time indicator */}
        {showNowIndicator && (
          <div
            ref={nowIndicatorRef}
            className="absolute left-0 right-0 z-30 flex items-center pointer-events-none"
            style={{ top: getTop(nowMinute!) }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-accent-sakura shadow-lg shadow-accent-sakura/40 ring-2 ring-bg-surface animate-pulse" />
            <div className="flex-1 h-[2px] bg-gradient-to-r from-accent-sakura via-accent-sakura/60 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DayTimeline;
