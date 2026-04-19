'use client';

import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { PositionedNode } from './utils/orbital-geometry';
import type { ProjectColor } from '@/lib/thought-organization';
import type { DragData } from './hooks/useOrbitalDrag';

const PROJECT_COLORS: Record<ProjectColor, string> = {
  peach: 'var(--project-peach)',
  sky: 'var(--project-sky)',
  mint: 'var(--project-mint)',
  periwinkle: 'var(--project-periwinkle)',
  lavender: 'var(--project-lavender)',
  rose: 'var(--project-rose)',
  coral: 'var(--project-coral)',
  sage: 'var(--project-sage)',
  blush: 'var(--project-blush)',
  slate: 'var(--project-slate)',
};

type OrbitalTaskNodeProps = {
  node: PositionedNode;
  projectColor?: ProjectColor;
  projectId?: string;
  isSelected?: boolean;
  onClick?: () => void;
  animationDelay?: number;
  isMoon?: boolean; // If true, render as a moon (smaller, different style)
};

export const OrbitalTaskNode = memo(function OrbitalTaskNode({
  node,
  projectColor = 'slate',
  projectId,
  isSelected = false,
  onClick,
  animationDelay = 0,
  isMoon = false,
}: OrbitalTaskNodeProps) {
  const { bullet, x, y, size, orbit } = node;
  const colorVar = PROJECT_COLORS[projectColor] || PROJECT_COLORS.slate;

  // Moons are smaller than planets
  const actualRadius = isMoon ? size * 0.6 : size;

  const dragData: DragData = {
    type: 'task',
    bulletId: bullet.id,
    currentProjectId: projectId,
    currentLane: bullet.lane,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task:${bullet.id}`,
    data: dragData,
  });

  const isNow = orbit === 'now';
  const isNext = orbit === 'next';
  const isLater = orbit === 'later';

  // size is now the radius of the planet/moon
  const radius = actualRadius;
  const labelMaxWidth = isMoon ? 120 : 160; // Smaller labels for moons

  return (
    <g
      ref={setNodeRef as any}
      {...attributes}
      {...listeners}
      transform={`translate(${x}, ${y})`}
      className={`orbital-node orbital-node--${orbit} ${isSelected ? 'orbital-node--selected' : ''} ${isDragging ? 'orbital-node--dragging' : ''}`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        animationDelay: `${animationDelay}s`,
      }}
      onClick={(e) => {
        if (!isDragging) onClick?.();
      }}
      role="button"
      tabIndex={0}
    >
      <defs>
        <radialGradient id={`planet-${bullet.id}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="50%" stopColor={colorVar} />
          <stop offset="100%" stopColor={`color-mix(in srgb, ${colorVar} 60%, #000)`} />
        </radialGradient>
      </defs>

      {/* Glow effect for now items */}
      {isNow && (
        <circle
          r={radius * 1.6}
          fill={colorVar}
          opacity={0.15}
          style={{ filter: 'blur(12px)' }}
          className="orbital-node__glow"
        />
      )}

      {/* Planet circle */}
      <circle
        r={radius}
        fill={`url(#planet-${bullet.id})`}
        stroke={colorVar}
        strokeWidth={isNow ? 3 : isNext ? 2 : 1.5}
        strokeOpacity={isNow ? 0.9 : isNext ? 0.6 : 0.4}
        opacity={isDragging ? 0.4 : 1}
        className="orbital-node__planet"
        style={{
          filter: isNow
            ? `drop-shadow(0 4px 12px ${colorVar}40)`
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
        }}
      />

      {/* Selected indicator ring */}
      {isSelected && (
        <circle
          r={radius + 6}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={3}
          strokeDasharray="6 4"
          opacity={0.8}
          className="orbital-node__selection"
        />
      )}

      {/* Label below planet */}
      <foreignObject
        x={-labelMaxWidth / 2}
        y={radius + 12}
        width={labelMaxWidth}
        height={60}
        style={{ pointerEvents: 'none', overflow: 'visible' }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontSize: isNow ? '14px' : isNext ? '12px' : '11px',
              fontWeight: isNow ? 700 : isNext ? 600 : 500,
              color: 'var(--color-text)',
              textAlign: 'center',
              lineHeight: '1.3',
              textShadow: '0 0 8px var(--color-bg-base), 0 0 12px var(--color-bg-base), 0 1px 3px rgba(0,0,0,0.8)',
              maxWidth: '100%',
              wordWrap: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {bullet.text}
          </span>
        </div>
      </foreignObject>

      <title>{bullet.text}</title>
    </g>
  );
});
