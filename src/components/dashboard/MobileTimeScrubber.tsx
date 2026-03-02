'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseHHMMToMinutes, formatTimeLabel } from '@/lib/anchors';

interface MobileTimeScrubberProps {
  isOpen: boolean;
  currentTime: string;
  onTimeChange: (time: string) => void;
  onClose: () => void;
}

const TIMELINE_START_HOUR = 6;
const TIMELINE_END_HOUR = 24;
const TIMELINE_TOTAL_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;

function getTimePosition(timeStr: string): number {
  const minutes = parseHHMMToMinutes(timeStr);
  const startMinutes = TIMELINE_START_HOUR * 60;
  const position = ((minutes - startMinutes) / TIMELINE_TOTAL_MINUTES) * 100;
  return Math.max(2, Math.min(98, position));
}

function positionToTime(positionPercent: number): string {
  const startMinutes = TIMELINE_START_HOUR * 60;
  const minutes = startMinutes + (positionPercent / 100) * TIMELINE_TOTAL_MINUTES;
  const clampedMinutes = Math.max(startMinutes, Math.min(TIMELINE_END_HOUR * 60 - 1, minutes));
  const roundedMinutes = Math.round(clampedMinutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const mins = roundedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function MobileTimeScrubber({
  isOpen,
  currentTime,
  onTimeChange,
}: MobileTimeScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(currentTime);
  const lastSnappedTimeRef = useRef(currentTime);

  useEffect(() => {
    if (isOpen) {
      setDragTime(currentTime);
      lastSnappedTimeRef.current = currentTime;
    }
  }, [isOpen, currentTime]);

  const getPositionFromTouch = useCallback((clientX: number) => {
    if (!trackRef.current) return null;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    return Math.max(0, Math.min(100, percent));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const touch = e.touches[0];
    if (touch) {
      const pos = getPositionFromTouch(touch.clientX);
      if (pos !== null) {
        const newTime = positionToTime(pos);
        setDragTime(newTime);
        lastSnappedTimeRef.current = newTime;
      }
    }
  }, [getPositionFromTouch]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        const pos = getPositionFromTouch(touch.clientX);
        if (pos !== null) {
          const newTime = positionToTime(pos);
          setDragTime(newTime);
          if (newTime !== lastSnappedTimeRef.current) {
            lastSnappedTimeRef.current = newTime;
            if (navigator.vibrate) navigator.vibrate(10);
          }
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      onTimeChange(dragTime);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, dragTime, onTimeChange, getPositionFromTouch]);

  const displayTime = isDragging ? dragTime : currentTime;
  const knobPosition = getTimePosition(displayTime);

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
            <div className="mb-2 px-1 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted/70">Drag To Set Time</span>
            </div>

            <div
              ref={trackRef}
              className="relative h-11 touch-none"
              onTouchStart={handleTouchStart}
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

            <div className="flex justify-center mt-1">
              <span
                className={`
                  text-sm font-semibold tabular-nums px-3 py-1 rounded-full border
                  ${isDragging
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-bg-surface/80 border-border-subtle text-text-muted'
                  }
                `}
              >
                {formatTimeLabel(displayTime)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
