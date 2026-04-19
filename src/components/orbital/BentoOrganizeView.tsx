'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import type { ThoughtOrganization, ThoughtBullet, ProjectMeta } from '@/lib/thought-organization';
import { laneToPriority, priorityToLane } from '@/lib/thought-organization';
import { parseDropZoneId, orbitalCollisionDetection, type DragData } from './hooks/useOrbitalDrag';
import { OrbitalInbox } from './OrbitalInbox';
import { OrbitalDetailPanel } from './OrbitalDetailPanel';
import { BentoProjectCard } from './BentoProjectCard';

type ProjectSize = 'small' | 'medium' | 'large' | 'xlarge';

type BentoLaneFilter = 'all' | 'now' | 'next' | 'later';

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

type BentoProject = {
  project: ProjectMeta;
  bullets: ThoughtBullet[];
  nowCount: number;
  nextCount: number;
  laterCount: number;
  totalCount: number;
  size: ProjectSize;
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

  const projectOrder = getBentoProjectOrder(organization);
  const projectSizesMap = useMemo(
    () =>
      new Map(
        Object.entries(organization.bento?.projectSizes ?? {}) as [string, ProjectSize][]
      ),
    [organization.bento?.projectSizes]
  );

  const selectedBullet = selectedBulletId
    ? organization.bullets.find((b) => b.id === selectedBulletId) || null
    : null;

  // Group bullets by project and sort by custom order
  const bentoProjectsMap = new Map<string, BentoProject>();
  organization.projects.forEach((project) => {
    const projectBullets = organization.bullets.filter(
      (b) => b.project === project.id && b.lane !== 'done'
    );
    const nowCount = projectBullets.filter((b) => resolveBulletLane(b) === 'now').length;
    const nextCount = projectBullets.filter((b) => resolveBulletLane(b) === 'next').length;
    const laterCount = projectBullets.filter((b) => resolveBulletLane(b) === 'later').length;

    const displayBullets =
      laneFilter === 'all'
        ? projectBullets
        : projectBullets.filter((b) => resolveBulletLane(b) === laneFilter);

    // Default size based on task count
    const defaultSize = getDefaultSize(nowCount, nextCount, laterCount);
    const size = projectSizesMap.get(project.id) || defaultSize;

    bentoProjectsMap.set(project.id, {
      project,
      bullets: displayBullets,
      nowCount,
      nextCount,
      laterCount,
      totalCount: projectBullets.length,
      size,
    });
  });

  // Sort projects by custom order
  const bentoProjects: BentoProject[] = projectOrder
    .map((id) => bentoProjectsMap.get(id))
    .filter((p): p is BentoProject => p !== undefined);

  // Inbox bullets (no project), same lane filter as grid
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

  const collisionDetection = useCallback<CollisionDetection>((args) => {
    const activeType = args.active.data.current?.type;

    if (activeType === 'project') {
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (container) => typeof container.id === 'string' && container.id.startsWith('project:')
        ),
      });
    }

    return orbitalCollisionDetection({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (container) => !(typeof container.id === 'string' && container.id.startsWith('project:'))
      ),
    });
  }, []);

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    /* reserved for drag overlay / analytics */
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const dragData = active.data.current as DragData | { type: 'project'; projectId: string };

      // Handle project reordering
      if (dragData?.type === 'project') {
        const activeId = dragData.projectId;
        const rawOverId = String(over.id);
        const overId = rawOverId.startsWith('project:')
          ? rawOverId.replace('project:', '')
          : rawOverId.startsWith('center:')
            ? rawOverId.replace('center:', '')
            : rawOverId;

        if (activeId !== overId) {
          const order = getBentoProjectOrder(organization);
          const oldIndex = order.indexOf(activeId);
          const newIndex = order.indexOf(overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = [...order];
            newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, activeId);
            onUpdateOrganization({
              ...organization,
              bento: {
                ...organization.bento,
                projectOrder: newOrder,
                projectSizes: { ...organization.bento?.projectSizes },
              },
            });
          }
        }
        return;
      }

      // Handle task dragging
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

  const handleResizeProject = useCallback(
    (projectId: string, newSize: ProjectSize) => {
      onUpdateOrganization({
        ...organization,
        bento: {
          ...organization.bento,
          projectOrder: getBentoProjectOrder(organization),
          projectSizes: {
            ...organization.bento?.projectSizes,
            [projectId]: newSize,
          },
        },
      });
    },
    [organization, onUpdateOrganization]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bento-organize-view w-full h-full flex flex-col overflow-hidden">
        {/* Atmospheric Background */}
        <div className="bento-atmosphere" />

        {/* Header */}
        <div className="bento-header px-8 py-8 border-b border-border/30 relative z-10">
          <div className="bento-header-glow" />
          <div className="bento-header-top">
            <h1 className="bento-header-title">Project Universe</h1>
            <div className="bento-lane-filter-bar" role="tablist" aria-label="Filter tasks by lane">
              {(['all', 'now', 'next', 'later'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={laneFilter === key}
                  className={`bento-lane-filter-btn ${laneFilter === key ? 'bento-lane-filter-btn--active' : ''} bento-lane-filter-btn--${key}`}
                  onClick={() => setLaneFilter(key)}
                >
                  {key === 'all' ? 'All' : key === 'now' ? 'Now' : key === 'next' ? 'Next' : 'Later'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid-container flex-1 overflow-y-auto p-8 relative z-10">
          <SortableContext
            items={bentoProjects.map((bentoProject) => `project:${bentoProject.project.id}`)}
            strategy={rectSortingStrategy}
          >
            <div className="bento-grid">
              {bentoProjects.map((bentoProject, index) => (
                <BentoProjectCard
                  key={bentoProject.project.id}
                  bentoProject={bentoProject}
                  laneFilter={laneFilter}
                  selectedBulletId={selectedBulletId}
                  onSelectBullet={handleSelectBullet}
                  onResize={handleResizeProject}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Floating inbox */}
        <div className="bento-inbox fixed bottom-6 left-6 z-30">
          <OrbitalInbox
            bullets={inboxBullets}
            selectedBulletId={selectedBulletId}
            onSelectBullet={handleSelectBullet}
            onAddBullet={handleAddInboxBullet}
            defaultExpanded={false}
          />
        </div>

        {/* Detail panel */}
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

function getDefaultSize(nowCount: number, nextCount: number, laterCount: number): ProjectSize {
  const total = nowCount + nextCount + laterCount;
  const urgency = nowCount * 3 + nextCount * 1;

  if (urgency >= 6 || total >= 12) return 'xlarge';
  if (urgency >= 3 || total >= 6) return 'large';
  if (total >= 3) return 'medium';
  return 'small';
}
