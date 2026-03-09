'use client';

import { useMemo } from 'react';
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
import { TimelineEventCard } from './items/TimelineEventCard';
import { TimelineBlockCard } from './items/TimelineBlockCard';
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

  /** Additional CSS classes */
  className?: string;

  /** Whether this is on mobile (affects interaction hints) */
  isMobile?: boolean;
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
  className,
  isMobile = false,
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

  // Separate items by type for layered rendering
  const { anchors, events, blocks } = useMemo(() => {
    return {
      anchors: items.filter((item) => item.type === 'anchor'),
      events: items.filter((item) => item.type === 'event' && !item.isAllDay),
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
          'shrink-0 relative border-r border-border-subtle/40 sm:bg-bg-surface/50',
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

        {/* Events layer (behind blocks) */}
        {events.map((item) => {
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
            />
          );
        })}

        {/* Time blocks layer */}
        {blocks.map((item) => {
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
                height: Math.max(getHeight(duration) - 2, isMobile ? 48 : 32),
              }}
              status={status}
              hasOverlap={hasEventOverlap}
              onClick={() => onItemClick?.(item)}
              isMobile={isMobile}
            />
          );
        })}

        {/* Anchor markers layer (on top) */}
        {anchors.map((item) => {
          const anchorMinute = item.startMinute;
          // Only show if within timeline bounds
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
