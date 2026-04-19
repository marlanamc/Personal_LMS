'use client';

import { memo } from 'react';
import type { ProjectMeta, ProjectColor } from '@/lib/thought-organization';
import { getProjectInitials } from './utils/orbital-geometry';

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

type ProjectCenterProps = {
  project: ProjectMeta;
  totalCount: number;
  nowCount: number;
  isDropTarget?: boolean;
  planetSize?: number;
};

export const ProjectCenter = memo(function ProjectCenter({
  project,
  totalCount,
  nowCount,
  isDropTarget = false,
  planetSize,
}: ProjectCenterProps) {
  const colorVar = PROJECT_COLORS[project.color] || PROJECT_COLORS.slate;
  const initials = getProjectInitials(project.label);

  const coreRadius = planetSize || 50; // Planet size (smaller than sun)

  return (
    <g className={`project-center ${isDropTarget ? 'project-center--drop-target' : ''}`}>
      <defs>
        <radialGradient id={`cg-${project.id}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="30%" stopColor={colorVar} />
          <stop offset="70%" stopColor={`color-mix(in srgb, ${colorVar} 70%, #000)`}/>
          <stop offset="100%" stopColor={`color-mix(in srgb, ${colorVar} 40%, #000)`}/>
        </radialGradient>

        {/* Animated corona effect */}
        <radialGradient id={`corona-${project.id}`}>
          <stop offset="0%" stopColor={colorVar} stopOpacity="0" />
          <stop offset="70%" stopColor={colorVar} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colorVar} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Large breathing corona glow */}
      <circle
        r={coreRadius * 2.2}
        fill={`url(#corona-${project.id})`}
        className="project-center__corona"
        style={{
          filter: 'blur(16px)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Mid-range glow */}
      <circle
        r={coreRadius * 1.5}
        fill={colorVar}
        opacity={0.25}
        className="project-center__mid-glow"
        style={{ filter: 'blur(12px)' }}
      />

      {/* Solid sun circle with rays */}
      <circle
        r={coreRadius}
        fill={`url(#cg-${project.id})`}
        className="project-center__circle"
        style={{
          filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.4))',
        }}
      />

      {/* Subtle stroke for definition */}
      <circle
        r={coreRadius}
        fill="none"
        stroke={colorVar}
        strokeWidth={2}
        opacity={0.5}
      />

      {/* Initials — white, ultra clean */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="project-center__initials"
        style={{
          fontSize: '24px',
          fontWeight: 800,
          fill: '#ffffff',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.05em',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        {initials}
      </text>

      {/* Now count badge */}
      {nowCount > 0 && (
        <g transform={`translate(${coreRadius * 0.75}, ${-coreRadius * 0.75})`}>
          <circle
            r={14}
            fill="var(--color-primary)"
            stroke="var(--color-bg-base)"
            strokeWidth={3}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: '13px',
              fontWeight: 800,
              fill: 'white',
              fontFamily: 'var(--font-display)',
            }}
          >
            {nowCount > 9 ? '9+' : nowCount}
          </text>
        </g>
      )}

      {/* Clear Label with Solid Text Shadow for contrast against rings */}
      <text
        y={coreRadius + 28}
        textAnchor="middle"
        dominantBaseline="hanging"
        className="project-center__label"
        style={{
          fontSize: '16px',
          fontWeight: 700,
          fill: 'var(--color-text)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.02em',
          textShadow: '0 0 6px var(--color-bg-base), 0 0 12px var(--color-bg-base), 0 0 16px var(--color-bg-base)',
        }}
      >
        {project.label}
      </text>

      {/* Task Count Subtitle */}
      {totalCount > 0 && (
        <text
          y={coreRadius + 48}
          textAnchor="middle"
          dominantBaseline="hanging"
          style={{
            fontSize: '12px',
            fontWeight: 500,
            fill: 'var(--color-text-muted)',
            letterSpacing: '0.03em',
            textShadow: '0 0 6px var(--color-bg-base), 0 0 10px var(--color-bg-base)',
          }}
        >
          {totalCount} task{totalCount !== 1 ? 's' : ''}
        </text>
      )}
    </g>
  );
});
