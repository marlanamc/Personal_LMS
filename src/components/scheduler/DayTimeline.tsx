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
        'flex overflow-hidden',
        className,
      )}
      style={{ minHeight: timelineHeight + timelinePadding * 2 }}
    >
      {/* Time labels column */}
      <div
        className={cn(
          'shrink-0 relative timeline-gutter',
          gutterWidthClass,
        )}
        style={{ height: timelineHeight + timelinePadding * 2 }}
      >
        {/* Soft divider line */}
        <div className="absolute right-0 top-4 bottom-4 z-[1] timeline-gutter-divider" />

        {timeLabels.map(({ minute, label }) => (
          <div
            key={minute}
            className={cn(
              'absolute left-0 right-0 z-[1] pr-2.5 text-right tabular-nums',
              minute % 60 === 0
                ? 'text-[11px] font-semibold text-text-muted/85 sm:text-[10px]'
                : 'text-[10px] font-medium text-text-muted/50 sm:text-[9px]'
            )}
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
        className="timeline-track-surface flex-1 relative min-w-0"
        style={{ height: timelineHeight + timelinePadding * 2 }}
      >
        {/* Hour grid lines */}
        {config.showGridLines &&
          timeLabels.map(({ minute }) => (
            <div
              key={`line-${minute}`}
              className="absolute left-0 right-0 timeline-grid-line"
              style={{ top: getTop(minute) }}
            />
          ))}

        {/* Rhythm pattern indicator - vertical bar on right showing alternating pattern */}
        {blocks.length >= 2 && (() => {
          // Check if we have any alternating blocks
          const hasAlternatingPattern = blocks.some((block, idx) => {
            const nextBlock = blocks[idx + 1];
            return nextBlock && block.blockKind !== nextBlock.blockKind;
          });

          if (!hasAlternatingPattern) return null;

          return (
            <div
              className="absolute top-0 right-0 w-2 pointer-events-none z-[2]"
              style={{
                height: timelineHeight + timelinePadding * 2,
              }}
            >
              {/* Show a segment for each block in alternating colors */}
              {blocks.map((block, idx) => {
                const isAlternating =
                  (idx > 0 && blocks[idx - 1].blockKind !== block.blockKind) ||
                  (idx < blocks.length - 1 && blocks[idx + 1].blockKind !== block.blockKind);

                if (!isAlternating) return null;

                const startMin = Math.max(block.startMinute, config.startHour * 60);
                const endMin = Math.min(block.endMinute ?? block.startMinute + 30, config.endHour * 60);
                const duration = endMin - startMin;

                return (
                  <div
                    key={`rhythm-bar-${block.id}`}
                    className="absolute right-0 w-full rounded-l-sm"
                    style={{
                      top: getTop(startMin) + 2,
                      height: Math.max(getHeight(duration) - 4, 24),
                      background:
                        block.blockKind === 'want'
                          ? 'var(--color-accent-teal)'
                          : 'var(--color-accent-sakura)',
                      opacity: 0.65,
                    }}
                  />
                );
              })}
            </div>
          );
        })()}

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

        {/* Rhythm indicators - show alternating pattern between time blocks */}
        {blocks.length > 1 && blocks.map((block, idx) => {
          if (idx === blocks.length - 1) return null; // Skip last block
          const nextBlock = blocks[idx + 1];

          // Only show rhythm indicator when blocks alternate between want/should
          const isAlternating = block.blockKind !== nextBlock.blockKind;
          if (!isAlternating) return null;

          const gapStart = block.endMinute ?? block.startMinute + 30;
          const gapEnd = nextBlock.startMinute;
          const gapMinutes = gapEnd - gapStart;

          // Show rhythm indicator even for small gaps
          const rhythmTop = getTop(gapStart);
          const rhythmHeight = Math.max(8, getHeight(gapMinutes));

          return (
            <div
              key={`rhythm-${block.id}-${nextBlock.id}`}
              className="absolute left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
              style={{
                top: rhythmTop - 4,
                height: rhythmHeight + 8,
                width: '20px',
              }}
            >
              {/* Visible connector showing transition */}
              <div className="w-full h-full relative flex items-center justify-center">
                {/* Vertical dashed line */}
                <div
                  className="w-[3px] h-full rounded-full"
                  style={{
                    background: `repeating-linear-gradient(
                      to bottom,
                      ${block.blockKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)'} 0px,
                      ${block.blockKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)'} 4px,
                      transparent 4px,
                      transparent 8px,
                      ${nextBlock.blockKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)'} 8px,
                      ${nextBlock.blockKind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)'} 12px,
                      transparent 12px,
                      transparent 16px
                    )`,
                    opacity: 0.6,
                  }}
                />
                {/* Center dot */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    background: 'var(--color-text-muted)',
                    borderColor: 'var(--color-bg-elevated)',
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </div>
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
              isMobile={isMobile}
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
            className="absolute right-0 z-30 flex items-center pointer-events-none"
            style={{ 
              top: getTop(nowMinute!),
              left: '-12px',
            }}
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
