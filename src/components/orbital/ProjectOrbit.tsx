'use client';

import { memo, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ProjectOrbitData } from './hooks/useOrbitalLayout';
import type { ThoughtBullet } from '@/lib/thought-organization';
import { OrbitRing } from './OrbitRing';
import { ProjectCenter } from './ProjectCenter';
import { OrbitalTaskNode } from './OrbitalTaskNode';
import { createDropZoneId } from './hooks/useOrbitalDrag';

type ProjectOrbitProps = {
  data: ProjectOrbitData;
  selectedBulletId?: string | null;
  onSelectBullet?: (bullet: ThoughtBullet) => void;
};

export const ProjectOrbit = memo(function ProjectOrbit({
  data,
  selectedBulletId,
  onSelectBullet,
}: ProjectOrbitProps) {
  const { projectMeta, nodes, totalCount, nowCount, planetSize, moonOrbitRadii } = data;

  // Drop zones for each moon orbit ring
  const nowDropZone = useDroppable({
    id: createDropZoneId('orbit', projectMeta.id, 'now'),
    data: { type: 'orbit', projectId: projectMeta.id, lane: 'now' },
  });

  const nextDropZone = useDroppable({
    id: createDropZoneId('orbit', projectMeta.id, 'next'),
    data: { type: 'orbit', projectId: projectMeta.id, lane: 'next' },
  });

  const laterDropZone = useDroppable({
    id: createDropZoneId('orbit', projectMeta.id, 'later'),
    data: { type: 'orbit', projectId: projectMeta.id, lane: 'later' },
  });

  const planetDropZone = useDroppable({
    id: createDropZoneId('center', projectMeta.id),
    data: { type: 'project-center', projectId: projectMeta.id, lane: 'now' },
  });

  const handleNodeClick = useCallback(
    (bullet: ThoughtBullet) => {
      onSelectBullet?.(bullet);
    },
    [onSelectBullet]
  );

  // SVG Size - planet + moon system
  const maxMoonOrbit = moonOrbitRadii.later;
  const size = (planetSize + maxMoonOrbit + 100) * 2;
  const viewBox = `-${size / 2} -${size / 2} ${size} ${size}`;

  return (
    <g className="project-planet-system">
      {/* Planet gravitational field glow */}
      <defs>
        <radialGradient id={`planet-field-${projectMeta.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`var(--project-${projectMeta.color})`} stopOpacity="0.12" />
          <stop offset="60%" stopColor={`var(--project-${projectMeta.color})`} stopOpacity="0.04" />
          <stop offset="100%" stopColor={`var(--project-${projectMeta.color})`} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        r={maxMoonOrbit + 60}
        fill={`url(#planet-field-${projectMeta.id})`}
        className="planet-field"
      />

      {/* Moon orbit rings with drop zone refs */}
      <g ref={laterDropZone.setNodeRef as any}>
        <OrbitRing lane="later" isDropTarget={laterDropZone.isOver} radius={moonOrbitRadii.later} />
      </g>
      <g ref={nextDropZone.setNodeRef as any}>
        <OrbitRing lane="next" isDropTarget={nextDropZone.isOver} radius={moonOrbitRadii.next} />
      </g>
      <g ref={nowDropZone.setNodeRef as any}>
        <OrbitRing lane="now" isDropTarget={nowDropZone.isOver} radius={moonOrbitRadii.now} />
      </g>

      {/* Planet body with drop zone */}
      <g ref={planetDropZone.setNodeRef as any}>
        <ProjectCenter
          project={projectMeta}
          totalCount={totalCount}
          nowCount={nowCount}
          isDropTarget={planetDropZone.isOver}
          planetSize={planetSize}
        />
      </g>

      {/* Gravitational lines from planet to moons */}
      {nodes.map((node) => {
        const isNow = node.orbit === 'now';
        const isNext = node.orbit === 'next';

        return (
          <line
            key={`spoke-${node.bullet.id}`}
            x1={0}
            y1={0}
            x2={node.x}
            y2={node.y}
            stroke={`var(--project-${projectMeta.color})`}
            strokeWidth={isNow ? 1.5 : isNext ? 1.2 : 1}
            strokeOpacity={isNow ? 0.3 : isNext ? 0.2 : 0.12}
            className="transition-all duration-300 pointer-events-none"
            strokeDasharray={isNow ? '4 2' : isNext ? '3 4' : '2 6'}
            strokeLinecap="round"
          />
        );
      })}

      {/* Moon task nodes */}
      {nodes.map((node, index) => (
        <OrbitalTaskNode
          key={node.bullet.id}
          node={node}
          projectColor={projectMeta.color}
          projectId={projectMeta.id}
          isSelected={selectedBulletId === node.bullet.id}
          onClick={() => handleNodeClick(node.bullet)}
          animationDelay={index * 0.04}
          isMoon={true}
        />
      ))}
    </g>
  );
});
