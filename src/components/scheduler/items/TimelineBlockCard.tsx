'use client';

import type { CSSProperties } from 'react';
import { ArrowRight, Check, Circle, FileText, Heart, Target } from 'lucide-react';
import type { TimelineItem, TimelineItemStatus } from '@/lib/unified-scheduler';
import { formatMinuteOfDay } from '@/lib/unified-scheduler';

function getBlockStyle(kind?: 'want' | 'should') {
  if (kind === 'want') {
    return {
      background: 'var(--color-bg-elevated)',
      borderColor: 'color-mix(in srgb, var(--color-accent-teal) 30%, var(--color-border-subtle))',
      accentColor: 'var(--color-accent-teal)',
      accentClass: 'text-accent-teal',
    };
  }

  return {
    background: 'var(--color-bg-elevated)',
    borderColor: 'color-mix(in srgb, var(--color-accent-sakura) 30%, var(--color-border-subtle))',
    accentColor: 'var(--color-accent-sakura)',
    accentClass: 'text-accent-sakura',
  };
}

interface TimelineBlockCardProps {
  item: TimelineItem;
  style?: CSSProperties;
  status: TimelineItemStatus;
  hasOverlap?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
}

export function TimelineBlockCard({
  item,
  style,
  status,
  hasOverlap = false,
  onClick,
  isMobile = false,
}: TimelineBlockCardProps) {
  const blockStyle = getBlockStyle(item.blockKind);
  const isWant = item.blockKind === 'want';
  const durationMinutes = item.durationMinutes ?? (item.endMinute ?? item.startMinute) - item.startMinute;

  return (
    <article
      aria-label={`${item.label}, ${isWant ? 'Want to do' : 'Should do'}, ${durationMinutes} minutes`}
      onClick={onClick}
      className={`rounded-lg sm:rounded-lg border shadow-sm flex flex-col justify-center px-1.5 py-1.5 sm:px-3 sm:py-1.5 transition-all duration-200 hover:shadow-md hover:z-10 overflow-hidden group cursor-pointer min-h-[48px] sm:min-h-0 ${
        hasOverlap ? 'ring-1 ring-amber-400/60' : ''
      } ${
        status === 'current'
          ? 'ring-2 ring-offset-1 ring-offset-bg-surface shadow-lg'
          : ''
      } ${status === 'completed' ? 'opacity-60' : ''}`}
      title={isMobile ? 'Tap to view details' : 'Double-click to add a note'}
      style={{
        background: blockStyle.background,
        borderColor: hasOverlap ? 'rgba(251,191,36,0.5)' : blockStyle.borderColor,
        ...(status === 'current'
          ? {
              ringColor: blockStyle.accentColor,
              boxShadow: `0 0 20px ${isWant ? 'rgba(79, 140, 158, 0.3)' : 'rgba(212, 138, 166, 0.3)'}`,
            }
          : {}),
        ...style,
        minHeight: Math.max(Number(style?.height) || 32, isMobile ? 48 : 32),
      }}
    >
      {/* Accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1 rounded-l-lg ${
          isWant ? 'bg-accent-teal/60' : 'bg-accent-sakura/60'
        }`}
      />

      <div className="pl-1 sm:pl-2.5 flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 overflow-hidden">
        {/* Top row: status icon, kind icon, title, note badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Status indicator */}
            <span
              className={`inline-flex shrink-0 ${
                status === 'completed'
                  ? 'text-secondary'
                  : status === 'current'
                    ? blockStyle.accentClass
                    : 'text-text-muted/70'
              }`}
            >
              {status === 'completed' && <Check size={11} />}
              {status === 'current' && <ArrowRight size={11} />}
              {status === 'upcoming' && <Circle size={10} className="fill-none" strokeWidth={2.5} />}
            </span>

            {/* Kind icon */}
            <span className={`inline-flex shrink-0 ${blockStyle.accentClass}`}>
              {isWant ? (
                <Heart size={11} className="fill-current sm:w-[10px] sm:h-[10px]" />
              ) : (
                <Target size={11} className="sm:w-[10px] sm:h-[10px]" />
              )}
            </span>

            {/* Label */}
            <span className="text-[13px] sm:text-[15px] font-body font-bold text-text min-w-0 leading-tight truncate sm:leading-snug sm:break-words sm:line-clamp-2">
              {item.label}
            </span>

            {/* Note badge */}
            {item.blockNote && (
              <span
                className={`inline-flex items-center gap-1 min-w-0 shrink sm:shrink-0 max-w-[35%] sm:max-w-[45%] rounded-full border px-1.5 py-0.5 text-[9px] sm:text-[11px] font-semibold shadow-sm ${
                  isWant
                    ? 'border-accent-teal/30 bg-accent-teal/10 text-accent-teal'
                    : 'border-accent-sakura/30 bg-accent-sakura/10 text-accent-sakura'
                }`}
                title={item.blockNote}
              >
                <FileText size={10} className="hidden sm:block shrink-0 opacity-80" />
                <span className="truncate">{item.blockNote}</span>
              </span>
            )}
          </div>
        </div>

        {/* Time and duration */}
        <div className="flex items-center gap-2 min-w-0 sm:flex-col sm:items-end sm:gap-0.5 shrink-0">
          <span className="text-[11px] sm:text-[15px] font-body font-medium text-text-muted/80 tabular-nums whitespace-nowrap shrink-0">
            {formatMinuteOfDay(item.startMinute)} – {formatMinuteOfDay(item.endMinute ?? item.startMinute + 30)}
            <span className="sm:hidden">{` · ${durationMinutes}m`}</span>
          </span>
          <span className="hidden sm:inline text-[11px] font-semibold text-text-muted/70 tabular-nums">
            {durationMinutes}m
          </span>
          {hasOverlap && (
            <span
              className="hidden sm:inline text-[10px] text-amber-600 dark:text-amber-400 font-medium"
              title="Overlaps with a scheduled event"
            >
              (overlaps)
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
