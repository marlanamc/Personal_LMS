'use client';

import { memo } from 'react';
import type { ThoughtLane } from '@/lib/thought-organization';
import { getLaneDisplayProps } from './utils/orbital-geometry';

type OrbitRingProps = {
  lane: ThoughtLane;
  isDropTarget?: boolean;
  radius?: number;
};

export const OrbitRing = memo(function OrbitRing({
  lane,
  isDropTarget = false,
  radius: radiusProp,
}: OrbitRingProps) {
  const radius = radiusProp ?? (lane === 'now' ? 120 : lane === 'next' ? 240 : 380);
  if (!radius) return null;

  const { color, label, strokeDash } = getLaneDisplayProps(lane);

  // Solar system orbital rings - more visible and clear
  const baseWidth = lane === 'now' ? 3 : lane === 'next' ? 2.5 : 2;
  const baseOpacity = lane === 'now' ? 0.5 : lane === 'next' ? 0.35 : 0.25;

  return (
    <g className="orbit-ring-group">
      {/* Soft glow behind the ring for depth */}
      <circle
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={12}
        opacity={lane === 'now' ? 0.08 : 0.04}
        style={{ filter: 'blur(8px)' }}
      />

      {/* Main ring */}
      <circle
        r={radius}
        fill="none"
        stroke={isDropTarget ? 'var(--color-primary)' : color}
        strokeWidth={isDropTarget ? 4 : baseWidth}
        strokeDasharray={isDropTarget ? '8 4' : strokeDash}
        opacity={isDropTarget ? 0.95 : baseOpacity}
        className={`orbit-ring orbit-ring--${lane} ${isDropTarget ? 'orbit-ring--drop-target' : ''}`}
        style={{
          transition: 'stroke-width 0.2s, opacity 0.2s',
        }}
      />

      {/* Orbit label */}
      {label && (
        <text
          x={0}
          y={-radius - 12}
          textAnchor="middle"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            fill: color,
            opacity: 0.6,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
});
