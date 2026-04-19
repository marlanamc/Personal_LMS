import { useMemo } from 'react';
import type { ThoughtOrganization, ThoughtBullet, ThoughtLane, ProjectMeta } from '@/lib/thought-organization';
import {
  distributeOnOrbit,
  dynamicOrbitRadii,
  projectFieldRadius,
  type PositionedNode,
} from '../utils/orbital-geometry';

export type ProjectOrbitData = {
  projectId: string;
  projectMeta: ProjectMeta;
  nodes: PositionedNode[]; // Task moons orbiting this project planet
  lanes: {
    now: PositionedNode[];
    next: PositionedNode[];
    later: PositionedNode[];
  };
  totalCount: number;
  nowCount: number;
  // Planet position in solar system
  x: number;
  y: number;
  angle: number;
  orbitRadius: number; // Distance from sun
  planetSize: number;
  moonOrbitRadii: { now: number; next: number; later: number };
};

export type OrbitalLayoutData = {
  projects: ProjectOrbitData[];
  inbox: ThoughtBullet[];
  totalNowCount: number;
  solarSystemRadius: number; // Outer boundary of the system
};

/**
 * Solar System Layout:
 * - Single sun at center (user's active focus)
 * - Projects orbit as planets at different distances (based on priority/activity)
 * - Tasks orbit as moons around their project planets
 */
export function useOrbitalLayout(organization: ThoughtOrganization): OrbitalLayoutData {
  return useMemo(() => {
    const { bullets, projects } = organization;

    const inbox: ThoughtBullet[] = [];
    const byProject = new Map<string, ThoughtBullet[]>();

    for (const project of projects) {
      byProject.set(project.id, []);
    }

    const sortedBullets = [...bullets].sort((a, b) => a.displayOrder - b.displayOrder);

    for (const bullet of sortedBullets) {
      if (bullet.lane === 'done') continue;

      if (!bullet.project) {
        inbox.push(bullet);
      } else {
        const existing = byProject.get(bullet.project) || [];
        existing.push(bullet);
        byProject.set(bullet.project, existing);
      }
    }

    // Calculate project priorities (higher = more urgent/active)
    const projectPriorities = new Map<string, number>();
    for (const project of projects) {
      const projectBullets = byProject.get(project.id) || [];
      const nowCount = projectBullets.filter((b) => b.lane === 'now').length;
      const nextCount = projectBullets.filter((b) => b.lane === 'next').length;
      // More active projects = higher priority = closer to sun
      const priority = nowCount * 3 + nextCount * 1;
      projectPriorities.set(project.id, priority);
    }

    // Sort projects by priority (most active first = closest to sun)
    const sortedProjects = [...projects].sort((a, b) => {
      const priorityA = projectPriorities.get(a.id) || 0;
      const priorityB = projectPriorities.get(b.id) || 0;
      return priorityB - priorityA;
    });

    // Planet orbital radii (distance from sun)
    const PLANET_ORBITS = [280, 420, 560, 700, 840, 980, 1120, 1260, 1400, 1540];

    const projectOrbits: ProjectOrbitData[] = [];
    let totalNowCount = 0;
    let maxRadius = 0;

    sortedProjects.forEach((project, index) => {
      const projectBullets = byProject.get(project.id) || [];

      const byLane: Record<ThoughtLane, ThoughtBullet[]> = {
        now: [],
        next: [],
        later: [],
        done: [],
      };

      for (const bullet of projectBullets) {
        const lane = bullet.lane || 'next';
        byLane[lane].push(bullet);
      }

      // Moon orbit radii (tasks orbiting the planet)
      const moonRadii = {
        active: 0,
        now: 60,
        next: 100,
        later: 140,
      };

      const nowNodes = distributeOnOrbit(byLane.now, 'now', moonRadii);
      const nextNodes = distributeOnOrbit(byLane.next, 'next', moonRadii);
      const laterNodes = distributeOnOrbit(byLane.later, 'later', moonRadii);

      const nowCount = byLane.now.length;
      totalNowCount += nowCount;

      // Position planet in solar system
      const orbitRadius = PLANET_ORBITS[Math.min(index, PLANET_ORBITS.length - 1)];
      const angle = (2 * Math.PI * index) / projects.length - Math.PI / 2;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;

      // Planet size based on task count
      const planetSize = Math.min(40 + projectBullets.length * 2, 70);

      maxRadius = Math.max(maxRadius, orbitRadius + moonRadii.later + 80);

      projectOrbits.push({
        projectId: project.id,
        projectMeta: project,
        nodes: [...nowNodes, ...nextNodes, ...laterNodes],
        lanes: { now: nowNodes, next: nextNodes, later: laterNodes },
        totalCount: projectBullets.length,
        nowCount,
        x,
        y,
        angle,
        orbitRadius,
        planetSize,
        moonOrbitRadii: moonRadii,
      });
    });

    return {
      projects: projectOrbits,
      inbox,
      totalNowCount,
      solarSystemRadius: maxRadius,
    };
  }, [organization]);
}
