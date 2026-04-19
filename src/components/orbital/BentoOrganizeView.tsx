'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { nanoid } from 'nanoid';
import type { ThoughtOrganization, ThoughtBullet, ProjectMeta } from '@/lib/thought-organization';
import { laneToPriority } from '@/lib/thought-organization';
import { parseDropZoneId, orbitalCollisionDetection, type DragData } from './hooks/useOrbitalDrag';
import { OrbitalInbox } from './OrbitalInbox';
import { OrbitalDetailPanel } from './OrbitalDetailPanel';
import { BentoProjectCard } from './BentoProjectCard';

type ProjectSize = 'small' | 'medium' | 'large' | 'xlarge';

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
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [projectSizes, setProjectSizes] = useState<Map<string, ProjectSize>>(new Map());

  const selectedBullet = selectedBulletId
    ? organization.bullets.find((b) => b.id === selectedBulletId) || null
    : null;

  // Group bullets by project
  const bentoProjects: BentoProject[] = organization.projects.map((project) => {
    const projectBullets = organization.bullets.filter(
      (b) => b.project === project.id && b.lane !== 'done'
    );
    const nowCount = projectBullets.filter((b) => b.lane === 'now').length;
    const nextCount = projectBullets.filter((b) => b.lane === 'next').length;
    const laterCount = projectBullets.filter((b) => b.lane === 'later').length;

    // Default size based on task count
    const defaultSize = getDefaultSize(nowCount, nextCount, laterCount);
    const size = projectSizes.get(project.id) || defaultSize;

    return {
      project,
      bullets: projectBullets,
      nowCount,
      nextCount,
      laterCount,
      totalCount: projectBullets.length,
      size,
    };
  });

  // Inbox bullets (no project)
  const inboxBullets = organization.bullets.filter((b) => !b.project && b.lane !== 'done');

  // ── DnD ──
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active, over } = event;
      if (!over) return;

      const dragData = active.data.current as DragData;
      const dropZone = parseDropZoneId(String(over.id));
      if (!dragData || !dropZone || dragData.type !== 'task') return;

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

  const handleResizeProject = useCallback((projectId: string, newSize: ProjectSize) => {
    setProjectSizes((prev) => {
      const next = new Map(prev);
      next.set(projectId, newSize);
      return next;
    });
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={orbitalCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bento-organize-view w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bento-header px-8 py-6 border-b border-border/30">
          <h1 className="text-2xl font-display font-bold text-text">
            Project Universe
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Adjust tile sizes to reflect project importance
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid-container flex-1 overflow-y-auto p-8">
          <div className="bento-grid">
            {bentoProjects.map((bentoProject) => (
              <BentoProjectCard
                key={bentoProject.project.id}
                bentoProject={bentoProject}
                selectedBulletId={selectedBulletId}
                onSelectBullet={handleSelectBullet}
                onResize={handleResizeProject}
              />
            ))}
          </div>
        </div>

        {/* Floating inbox */}
        <div className="bento-inbox fixed bottom-6 left-6 z-30">
          <OrbitalInbox
            bullets={inboxBullets}
            selectedBulletId={selectedBulletId}
            onSelectBullet={handleSelectBullet}
            onAddBullet={handleAddInboxBullet}
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
