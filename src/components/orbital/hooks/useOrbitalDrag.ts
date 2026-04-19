import { useMemo } from 'react';
import type { DragEndEvent, CollisionDetection } from '@dnd-kit/core';
import type { ThoughtLane } from '@/lib/thought-organization';
import { distanceFromCenter, getOrbitFromDistance, CANVAS_CENTER } from '../utils/orbital-geometry';

export type DragData = {
  type: 'task';
  bulletId: string;
  currentProjectId?: string;
  currentLane?: ThoughtLane;
};

export type DropData = {
  type: 'orbit' | 'project-center' | 'inbox';
  projectId?: string;
  lane?: ThoughtLane;
};

/**
 * Parse drop zone IDs
 * Format: "orbit:{projectId}:{lane}" or "center:{projectId}" or "inbox"
 */
export function parseDropZoneId(id: string): DropData | null {
  if (id === 'inbox') {
    return { type: 'inbox' };
  }

  if (id.startsWith('orbit:')) {
    const [, projectId, lane] = id.split(':');
    return {
      type: 'orbit',
      projectId,
      lane: lane as ThoughtLane,
    };
  }

  if (id.startsWith('center:')) {
    const projectId = id.replace('center:', '');
    return {
      type: 'project-center',
      projectId,
      lane: 'now', // Dropping on center = assign to NOW
    };
  }

  return null;
}

/**
 * Create drop zone ID
 */
export function createDropZoneId(type: 'orbit' | 'center' | 'inbox', projectId?: string, lane?: ThoughtLane): string {
  if (type === 'inbox') return 'inbox';
  if (type === 'center') return `center:${projectId}`;
  return `orbit:${projectId}:${lane}`;
}

/**
 * Custom collision detection for orbital drag
 * Prioritizes the orbit/center the pointer is over
 */
export const orbitalCollisionDetection: CollisionDetection = (args) => {
  const { pointerCoordinates, droppableContainers } = args;

  if (!pointerCoordinates) {
    // Fallback to default collision detection
    return [];
  }

  const collisions: Array<{ id: string; distance: number }> = [];

  droppableContainers.forEach((container) => {
    const { id, rect } = container;
    if (!rect.current) return;

    const { left, top, width, height } = rect.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate if pointer is within this droppable
    const inBounds =
      pointerCoordinates.x >= left &&
      pointerCoordinates.x <= left + width &&
      pointerCoordinates.y >= top &&
      pointerCoordinates.y <= top + height;

    if (inBounds) {
      const distance = Math.sqrt(
        Math.pow(pointerCoordinates.x - centerX, 2) +
        Math.pow(pointerCoordinates.y - centerY, 2)
      );
      collisions.push({ id: String(id), distance });
    }
  });

  // Sort by distance (closest first)
  return collisions.sort((a, b) => a.distance - b.distance).map((c) => ({ id: c.id }));
};

/**
 * Calculate which orbit a drag position is in (relative to SVG center)
 */
export function calculateTargetOrbit(x: number, y: number): ThoughtLane {
  const distance = distanceFromCenter(x - CANVAS_CENTER, y - CANVAS_CENTER);
  return getOrbitFromDistance(distance);
}

/**
 * Hook for drag-related calculations
 */
export function useOrbitalDrag() {
  return useMemo(
    () => ({
      parseDropZoneId,
      createDropZoneId,
      calculateTargetOrbit,
      orbitalCollisionDetection,
    }),
    []
  );
}
