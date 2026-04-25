'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { nanoid } from 'nanoid';
import type { ThoughtOrganization, ThoughtBullet, ProjectMeta } from '@/lib/thought-organization';
import { laneToPriority, priorityToLane } from '@/lib/thought-organization';
import { parseDropZoneId, orbitalCollisionDetection, type DragData } from './hooks/useOrbitalDrag';
import { OrbitalInbox } from './OrbitalInbox';
import { OrbitalDetailPanel } from './OrbitalDetailPanel';
import { BentoFilterBar, type BentoLaneFilter } from './BentoFilterBar';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { ProjectSummaryCard } from './ProjectSummaryCard';

function resolveBulletLane(b: ThoughtBullet): 'now' | 'next' | 'later' {
  const l = b.lane ?? priorityToLane(b.priority);
  if (l === 'now' || l === 'next' || l === 'later') return l;
  return 'next';
}

function getBentoProjectOrder(org: ThoughtOrganization): string[] {
  const mergedOrder = org.projects.map((p) => p.id);
  const saved = org.bento?.projectOrder;
  if (!saved?.length) return mergedOrder;
  const valid: string[] = [];
  const seen = new Set<string>();
  for (const id of saved) {
    if (mergedOrder.includes(id) && !seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }
  for (const id of mergedOrder) {
    if (!seen.has(id)) {
      valid.push(id);
      seen.add(id);
    }
  }
  return valid;
}

type BentoProjectStats = {
  project: ProjectMeta;
  visibleBullets: ThoughtBullet[];
  nowCount: number;
  nextCount: number;
  laterCount: number;
  doneCount: number;
  activeCount: number;
  totalCount: number; // active + done
  nextUp?: string;
  progressPercent: number | null;
};

type BentoOrganizeViewProps = {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
};

export function BentoOrganizeView({
  organization,
  onUpdateOrganization,
}: BentoOrganizeViewProps) {
  const [selectedBulletId, setSelectedBulletId] = useState<string | null>(null);
  const [laneFilter, setLaneFilter] = useState<BentoLaneFilter>('all');
  const [featuredProjectId, setFeaturedProjectId] = useState<string | null | undefined>(undefined);
  const [featuredExpanded, setFeaturedExpanded] = useState(true);

  const projectOrder = getBentoProjectOrder(organization);

  const selectedBullet = selectedBulletId
    ? organization.bullets.find((b) => b.id === selectedBulletId) || null
    : null;

  const bentoProjectsMap = new Map<string, BentoProjectStats>();
  organization.projects.forEach((project) => {
    const activeBullets = organization.bullets.filter(
      (b) => b.project === project.id && b.lane !== 'done'
    );
    const doneCount = organization.bullets.filter(
      (b) => b.project === project.id && b.lane === 'done'
    ).length;
    const nowCount = activeBullets.filter((b) => resolveBulletLane(b) === 'now').length;
    const nextCount = activeBullets.filter((b) => resolveBulletLane(b) === 'next').length;
    const laterCount = activeBullets.filter((b) => resolveBulletLane(b) === 'later').length;

    const visibleBullets =
      laneFilter === 'all'
        ? activeBullets
        : activeBullets.filter((b) => resolveBulletLane(b) === laneFilter);
    const nextUp = activeBullets.find((b) => resolveBulletLane(b) === 'now')
      ?? activeBullets.find((b) => resolveBulletLane(b) === 'next')
      ?? activeBullets.find((b) => resolveBulletLane(b) === 'later');
    const activeCount = activeBullets.length;
    const totalCount = doneCount + activeCount;
    const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : null;

    bentoProjectsMap.set(project.id, {
      project,
      visibleBullets,
      nowCount,
      nextCount,
      laterCount,
      doneCount,
      activeCount,
      totalCount,
      nextUp: nextUp?.text,
      progressPercent,
    });
  });

  const bentoProjects: BentoProjectStats[] = projectOrder
    .map((id) => bentoProjectsMap.get(id))
    .filter((p): p is BentoProjectStats => p !== undefined);

  const defaultHeroProjectId = bentoProjects.length > 0
    ? bentoProjects.reduce((best, p) => {
      if (p.nowCount !== best.nowCount) return p.nowCount > best.nowCount ? p : best;
      return p.activeCount > best.activeCount ? p : best;
    }, bentoProjects[0]).project.id
    : null;

  useEffect(() => {
    if (bentoProjects.length === 0) {
      setFeaturedProjectId(null);
      return;
    }
    if (
      featuredProjectId === undefined ||
      (featuredProjectId !== null && !bentoProjects.some((item) => item.project.id === featuredProjectId))
    ) {
      setFeaturedProjectId(defaultHeroProjectId);
    }
  }, [bentoProjects, featuredProjectId, defaultHeroProjectId]);

  const featuredProject =
    bentoProjects.find((item) => item.project.id === featuredProjectId)
    ?? bentoProjects[0]
    ?? null;
  const summaryProjects = featuredProject
    ? bentoProjects.filter((item) => item.project.id !== featuredProject.project.id)
    : bentoProjects;

  const inboxBullets = organization.bullets.filter((b) => {
    if (b.project || b.lane === 'done') return false;
    if (laneFilter === 'all') return true;
    return resolveBulletLane(b) === laneFilter;
  });

  // ── DnD ──
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const collisionDetection = useCallback((args: Parameters<typeof orbitalCollisionDetection>[0]) =>
    orbitalCollisionDetection({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (container) => !(typeof container.id === 'string' && container.id.startsWith('project:'))
      ),
    }), []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const dragData = active.data.current as DragData;

      const dropZone = parseDropZoneId(String(over.id));
      if (!dragData || dragData.type !== 'task' || !dropZone) return;

      const bulletId = dragData.bulletId;
      const bullet = organization.bullets.find((b) => b.id === bulletId);
      if (!bullet) return;

      let updates: Partial<ThoughtBullet> = {};

      if (dropZone.type === 'inbox') {
        updates = { project: undefined, projectMeta: undefined };
      } else if (dropZone.type === 'orbit' || dropZone.type === 'project-center') {
        const targetProject = organization.projects.find((p) => p.id === dropZone.projectId);
        if (targetProject) {
          updates = { project: targetProject.id, projectMeta: targetProject };
        }
        if (dropZone.lane) {
          updates.lane = dropZone.lane;
          updates.priority = laneToPriority(dropZone.lane);
        }
      }

      if (Object.keys(updates).length > 0) {
        onUpdateOrganization({
          ...organization,
          bullets: organization.bullets.map((b) =>
            b.id === bulletId ? { ...b, ...updates } : b
          ),
        });
      }
    },
    [organization, onUpdateOrganization]
  );

  const handleSelectBullet = useCallback((bullet: ThoughtBullet) => {
    setSelectedBulletId(bullet.id);
  }, []);

  const handleCloseDetail = useCallback(() => setSelectedBulletId(null), []);

  const handleUpdateBullet = useCallback(
    (bulletId: string, updates: Partial<ThoughtBullet>) => {
      onUpdateOrganization({
        ...organization,
        bullets: organization.bullets.map((b) => (b.id === bulletId ? { ...b, ...updates } : b)),
      });
    },
    [organization, onUpdateOrganization]
  );

  const handleDeleteBullet = useCallback(
    (bulletId: string) => {
      onUpdateOrganization({
        ...organization,
        bullets: organization.bullets.filter((b) => b.id !== bulletId),
      });
    },
    [organization, onUpdateOrganization]
  );

  const handleAddInboxBullet = useCallback(
    (text: string) => {
      const newBullet: ThoughtBullet = {
        id: nanoid(),
        text,
        lineNumber: 0,
        displayOrder: organization.bullets.length,
      };
      onUpdateOrganization({
        ...organization,
        bullets: [...organization.bullets, newBullet],
      });
    },
    [organization, onUpdateOrganization]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragEnd={handleDragEnd}
    >
      <div className="bento-organize-view w-full h-full flex flex-col overflow-hidden">
        <div className="bento-dashboard-scroll">
          <BentoFilterBar laneFilter={laneFilter} onChange={setLaneFilter} />

          <div className="bento-dashboard-layout">
            {featuredProject ? (
              <FeaturedProjectCard
                title={featuredProject.project.label}
                taskCount={featuredProject.activeCount}
                nowCount={featuredProject.nowCount}
                nextCount={featuredProject.nextCount}
                laterCount={featuredProject.laterCount}
                visibleBullets={featuredProject.visibleBullets}
                progressDoneCount={featuredProject.doneCount}
                progressTotalCount={featuredProject.totalCount}
                progressPercent={featuredProject.progressPercent}
                expanded={featuredExpanded}
                onToggleExpanded={() => setFeaturedExpanded((current) => !current)}
                onSelectBullet={handleSelectBullet}
              />
            ) : null}

            <div className="bento-summary-grid">
              {summaryProjects.map((projectStats) => (
                <ProjectSummaryCard
                  key={projectStats.project.id}
                  title={projectStats.project.label}
                  nowCount={projectStats.nowCount}
                  nextCount={projectStats.nextCount}
                  laterCount={projectStats.laterCount}
                  totalCount={projectStats.activeCount}
                  nextUp={projectStats.nextUp}
                  progressPercent={projectStats.progressPercent}
                  accentClass={`bento-summary-card--${projectStats.project.color}`}
                  onClick={() => {
                    setFeaturedProjectId(projectStats.project.id);
                    setFeaturedExpanded(true);
                  }}
                />
              ))}

              <ProjectSummaryCard
                title="Inbox"
                nowCount={0}
                nextCount={0}
                laterCount={0}
                totalCount={inboxBullets.length}
                nextUp={inboxBullets[0]?.text}
                progressPercent={null}
                subtitle={`${inboxBullets.length} unsorted`}
                accentClass="bento-summary-card--inbox"
              />
            </div>
          </div>
        </div>

        <div className="bento-inbox hidden lg:block fixed bottom-6 right-6 z-30">
          <OrbitalInbox
            bullets={inboxBullets}
            selectedBulletId={selectedBulletId}
            onSelectBullet={handleSelectBullet}
            onAddBullet={handleAddInboxBullet}
            defaultExpanded={false}
          />
        </div>

        <OrbitalDetailPanel
          bullet={selectedBullet}
          projects={organization.projects}
          onUpdate={handleUpdateBullet}
          onDelete={handleDeleteBullet}
          onClose={handleCloseDetail}
        />
      </div>
    </DndContext>
  );
}
