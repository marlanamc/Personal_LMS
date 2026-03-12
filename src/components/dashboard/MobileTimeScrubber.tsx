'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseHHMMToMinutes, formatTimeLabel } from '@/lib/anchors';

interface MobileTimeScrubberProps {
  isOpen: boolean;
  currentTime: string;
  currentEndTime?: string;
  onTimeChange: (time: string) => void;
  onEndTimeChange?: (time: string) => void;
  onClose: () => void;
}

const TIMELINE_START_HOUR = 6;
const TIMELINE_END_HOUR = 24;
const TIMELINE_TOTAL_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;
const SNAP_INTERVAL_MINUTES = 15;
const MAX_SCRUBBER_MINUTES = (TIMELINE_END_HOUR * 60) - SNAP_INTERVAL_MINUTES;

type DragTarget = 'start' | 'end';

function getTimePosition(timeStr: string): number {
  const minutes = parseHHMMToMinutes(timeStr);
  const startMinutes = TIMELINE_START_HOUR * 60;
  const position = ((minutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
  return Math.max(2, Math.min(98, position));
}

function positionToTime(positionPercent: number): string {
  const startMinutes = TIMELINE_START_HOUR * 60;
  const minutes = startMinutes + (positionPercent / 100) * TIMELINE_TOTAL_MINUTES;
  const snappedMinutes = Math.round(minutes / SNAP_INTERVAL_MINUTES) * SNAP_INTERVAL_MINUTES;
  const roundedMinutes = Math.max(startMinutes, Math.min(MAX_SCRUBBER_MINUTES, snappedMinutes));
  const hours = Math.floor(roundedMinutes / 60);
  const mins = roundedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function clampRangeTime(
  time: string,
  boundaryTime: string,
  target: DragTarget,
): string {
  const minutes = parseHHMMToMinutes(time);
  const boundaryMinutes = parseHHMMToMinutes(boundaryTime);

  if (target === 'start') {
    return positionToTime(
      ((Math.min(minutes, boundaryMinutes - SNAP_INTERVAL_MINUTES) - (TIMELINE_START_HOUR * 60)) / TIMELINE_TOTAL_MINUTES) * 100,
    );
  }

  return positionToTime(
    ((Math.max(minutes, boundaryMinutes + SNAP_INTERVAL_MINUTES) - (TIMELINE_START_HOUR * 60)) / TIMELINE_TOTAL_MINUTES) * 100,
  );
}

interface ScrubberLaneProps {
  activeTarget: DragTarget | null;
  label: string;
  knobPosition: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  timeLabel: string;
  trackRef: React.RefObject<HTMLDivElement | null>;
}

function ScrubberLane({
  activeTarget,
  label,
  knobPosition,
  onMouseDown,
  onTouchStart,
  timeLabel,
  trackRef,
}: ScrubberLaneProps) {
  const isDragging = activeTarget !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted/65">
          {label}
        </span>
        <span
          className={`
            text-sm font-semibold tabular-nums px-3 py-1 rounded-full border
            ${isDragging
              ? 'bg-primary/15 border-primary/30 text-primary'
              : 'bg-bg-surface/80 border-border-subtle text-text-muted'
            }
          `}
        >
          {timeLabel}
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-11 touch-none select-none cursor-grab"
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
      >
        <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-bg-surface/60 via-bg-surface/80 to-bg-surface/60" />

        <div
          className="absolute top-1/2 left-0 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/30 via-accent/40 to-secondary/30"
          style={{ width: `${knobPosition}%` }}
        />

        <motion.div
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-9 h-9 rounded-full shadow-lg
            flex items-center justify-center
            ${isDragging
              ? 'bg-primary scale-110'
              : 'bg-bg-elevated border-2 border-primary/60'
            }
          `}
          style={{ left: `${knobPosition}%` }}
          animate={{ scale: isDragging ? 1.15 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className={`w-3 h-3 rounded-full ${isDragging ? 'bg-white' : 'bg-primary'}`} />
        </motion.div>
      </div>
    </div>
  );
}

export function MobileTimeScrubber({
  isOpen,
  currentTime,
  currentEndTime,
  onTimeChange,
  onEndTimeChange,
}: MobileTimeScrubberProps) {
  const startTrackRef = useRef<HTMLDivElement>(null);
  const endTrackRef = useRef<HTMLDivElement>(null);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const [dragStartTime, setDragStartTime] = useState(currentTime);
  const [dragEndTime, setDragEndTime] = useState(currentEndTime ?? currentTime);
  const lastSnappedTimesRef = useRef<{ start: string; end: string }>({
    start: currentTime,
    end: currentEndTime ?? currentTime,
  });
  const hasRange = Boolean(currentEndTime && parseHHMMToMinutes(currentEndTime) > parseHHMMToMinutes(currentTime));
  const isDragging = dragTarget !== null;

  useEffect(() => {
    if (isOpen) {
      setDragStartTime(currentTime);
      setDragEndTime(currentEndTime ?? currentTime);
      lastSnappedTimesRef.current = {
        start: currentTime,
        end: currentEndTime ?? currentTime,
      };
    }
  }, [isOpen, currentEndTime, currentTime]);

  useEffect(() => {
    if (!isDragging) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = 'grabbing';
    return () => {
      document.body.style.cursor = prev;
    };
  }, [isDragging]);

  const getPositionFromClientX = useCallback((clientX: number, track: HTMLDivElement | null) => {
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    return Math.max(0, Math.min(100, percent));
  }, []);

  const updateDragTime = useCallback((target: DragTarget, clientX: number) => {
    const track = target === 'start' ? startTrackRef.current : endTrackRef.current;
    const pos = getPositionFromClientX(clientX, track);
    if (pos === null) return;

    const nextTime = positionToTime(pos);
    if (target === 'start') {
      const clampedTime = hasRange ? clampRangeTime(nextTime, dragEndTime, 'start') : nextTime;
      setDragStartTime(clampedTime);
      if (clampedTime !== lastSnappedTimesRef.current.start) {
        lastSnappedTimesRef.current.start = clampedTime;
        if (navigator.vibrate) navigator.vibrate(10);
      }
      return;
    }

    const clampedTime = clampRangeTime(nextTime, dragStartTime, 'end');
    setDragEndTime(clampedTime);
    if (clampedTime !== lastSnappedTimesRef.current.end) {
      lastSnappedTimesRef.current.end = clampedTime;
      if (navigator.vibrate) navigator.vibrate(10);
    }
  }, [dragEndTime, dragStartTime, getPositionFromClientX, hasRange]);

  const beginDrag = useCallback((target: DragTarget, clientX: number) => {
    setDragTarget(target);
    updateDragTime(target, clientX);
  }, [updateDragTime]);

  const handleTouchStart = useCallback((target: DragTarget) => (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) beginDrag(target, touch.clientX);
  }, [beginDrag]);

  const handleMouseDown = useCallback((target: DragTarget) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    beginDrag(target, e.clientX);
  }, [beginDrag]);

  useEffect(() => {
    if (!dragTarget) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) updateDragTime(dragTarget, touch.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateDragTime(dragTarget, e.clientX);
    };

    const handlePointerEnd = () => {
      if (dragTarget === 'start') {
        onTimeChange(dragStartTime);
      } else if (hasRange && onEndTimeChange) {
        onEndTimeChange(dragEndTime);
      }
      setDragTarget(null);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handlePointerEnd);
    window.addEventListener('touchcancel', handlePointerEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handlePointerEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerEnd);
      window.removeEventListener('touchcancel', handlePointerEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerEnd);
    };
  }, [dragEndTime, dragStartTime, dragTarget, hasRange, onEndTimeChange, onTimeChange, updateDragTime]);

  const startKnobPosition = getTimePosition(dragStartTime);
  const endKnobPosition = getTimePosition(dragEndTime);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -4 }}
          animate={{ height: 'auto', opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="pt-2 pb-1 px-1">
            <div className="mb-1 px-1 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted/70">
                {hasRange ? 'Drag To Set Times' : 'Drag To Set Time'}
              </span>
            </div>

            <div className="space-y-3">
              <ScrubberLane
                activeTarget={dragTarget === 'start' ? dragTarget : null}
                label={hasRange ? 'Start' : 'Time'}
                knobPosition={startKnobPosition}
                onMouseDown={handleMouseDown('start')}
                onTouchStart={handleTouchStart('start')}
                timeLabel={formatTimeLabel(dragStartTime)}
                trackRef={startTrackRef}
              />

              {hasRange && onEndTimeChange ? (
                <ScrubberLane
                  activeTarget={dragTarget === 'end' ? dragTarget : null}
                  label="End"
                  knobPosition={endKnobPosition}
                  onMouseDown={handleMouseDown('end')}
                  onTouchStart={handleTouchStart('end')}
                  timeLabel={formatTimeLabel(dragEndTime)}
                  trackRef={endTrackRef}
                />
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
