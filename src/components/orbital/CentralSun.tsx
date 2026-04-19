'use client';

import { memo } from 'react';

type CentralSunProps = {
  totalProjects: number;
  totalActiveTasks: number;
};

export const CentralSun = memo(function CentralSun({
  totalProjects,
  totalActiveTasks,
}: CentralSunProps) {
  const sunRadius = 80;

  return (
    <g className="central-sun">
      <defs>
        {/* Radial gradient for sun core */}
        <radialGradient id="sun-core" cx="40%" cy="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="20%" stopColor="rgba(255,240,200,1)" />
          <stop offset="50%" stopColor="var(--color-accent-sakura)" />
          <stop offset="80%" stopColor="color-mix(in srgb, var(--color-accent-sakura) 60%, #000)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--color-accent-sakura) 30%, #000)" />
        </radialGradient>

        {/* Animated corona gradient */}
        <radialGradient id="sun-corona">
          <stop offset="0%" stopColor="var(--color-accent-sakura)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-accent-sakura)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-accent-sakura)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Massive breathing corona (furthest layer) */}
      <circle
        r={sunRadius * 3}
        fill="url(#sun-corona)"
        className="central-sun__mega-corona"
        style={{
          filter: 'blur(24px)',
          animation: 'pulse 6s ease-in-out infinite',
        }}
      />

      {/* Large corona glow */}
      <circle
        r={sunRadius * 2}
        fill="url(#sun-corona)"
        className="central-sun__corona"
        style={{
          filter: 'blur(16px)',
          animation: 'pulse 4s ease-in-out infinite 0.5s',
        }}
      />

      {/* Mid-range glow */}
      <circle
        r={sunRadius * 1.4}
        fill="var(--color-accent-sakura)"
        opacity={0.3}
        className="central-sun__mid-glow"
        style={{ filter: 'blur(12px)' }}
      />

      {/* Main sun body */}
      <circle
        r={sunRadius}
        fill="url(#sun-core)"
        className="central-sun__body"
        style={{
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
        }}
      />

      {/* Bright rim */}
      <circle
        r={sunRadius}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={3}
        opacity={0.8}
      />

      {/* Sun rays (8 rays) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const innerRadius = sunRadius + 8;
        const outerRadius = sunRadius + 28;
        return (
          <line
            key={`ray-${i}`}
            x1={Math.cos(angle) * innerRadius}
            y1={Math.sin(angle) * innerRadius}
            x2={Math.cos(angle) * outerRadius}
            y2={Math.sin(angle) * outerRadius}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.6}
            className="central-sun__ray"
            style={{
              animation: `ray-pulse 3s ease-in-out infinite ${i * 0.125}s`,
            }}
          />
        );
      })}

      {/* Center text - user focus */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={-8}
        style={{
          fontSize: '20px',
          fontWeight: 900,
          fill: '#ffffff',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.03em',
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}
      >
        YOU
      </text>

      {/* Active count badge */}
      {totalActiveTasks > 0 && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          y={14}
          style={{
            fontSize: '12px',
            fontWeight: 700,
            fill: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-body)',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          {totalActiveTasks} active
        </text>
      )}
    </g>
  );
});
