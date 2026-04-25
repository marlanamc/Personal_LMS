'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
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
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ThoughtOrganization, ThoughtBullet, ProjectMeta } from '@/lib/thought-organization';
import { laneToPriority, priorityToLane } from '@/lib/thought-organization';
import { parseDropZoneId, orbitalCollisionDetection, type DragData } from './hooks/useOrbitalDrag';
import { OrbitalInbox } from './OrbitalInbox';
import { OrbitalDetailPanel } from './OrbitalDetailPanel';
import { BentoProjectCard } from './BentoProjectCard';
import { useCompletionPulse } from '@/components/organize/useCompletionPulse';

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
  const [expandedProjectId, setExpandedProjectId] = useState<string | null | undefined>(undefined);
  const justCompletedIds = useCompletionPulse(organization.bullets);

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

  // Focus-hero: project with most now-lane bullets becomes the hero card
  const heroProjectId = bentoProjects.length > 0
    ? bentoProjects.reduce((best, p) => p.nowCount > best.nowCount ? p : best, bentoProjects[0]).project.id
    : null;

  // Render hero first, then others
  const sortedBentoProjects = heroProjectId
    ? [
        ...bentoProjects.filter(p => p.project.id === heroProjectId),
        ...bentoProjects.filter(p => p.project.id !== heroProjectId),
      ]
    : bentoProjects;

  useEffect(() => {
    if (bentoProjects.length === 0) {
      setExpandedProjectId(null);
      return;
    }

    if (
      expandedProjectId === undefined ||
      (expandedProjectId !== null && !bentoProjects.some((item) => item.project.id === expandedProjectId))
    ) {
      setExpandedProjectId(bentoProjects[0].project.id);
    }
  }, [bentoProjects, expandedProjectId]);

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

        {/* Lane filter — shared across mobile + desktop */}
        <div className="bento-clean-filter-row">
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

        {/* ── MOBILE: accordion project cards ── */}
        <BentoMobileView
          sortedBentoProjects={sortedBentoProjects}
          inboxBullets={inboxBullets}
          laneFilter={laneFilter}
          organization={organization}
          onUpdateOrganization={onUpdateOrganization}
        />

        {/* ── DESKTOP: bento grid ── */}
        <div className="hidden lg:block bento-grid-container flex-1 overflow-y-auto p-8 relative z-10">
          <SortableContext
            items={sortedBentoProjects.map((bentoProject) => `project:${bentoProject.project.id}`)}
            strategy={rectSortingStrategy}
          >
            <div className="bento-grid">
              {sortedBentoProjects.map((bentoProject) => (
                <BentoProjectCard
                  key={bentoProject.project.id}
                  bentoProject={bentoProject}
                  laneFilter={laneFilter}
                  selectedBulletId={selectedBulletId}
                  justCompletedIds={justCompletedIds}
                  onSelectBullet={handleSelectBullet}
                  isHero={bentoProject.project.id === heroProjectId}
                  isExpanded={expandedProjectId === bentoProject.project.id}
                  onToggleExpanded={() =>
                    setExpandedProjectId((current) =>
                      current === bentoProject.project.id ? null : bentoProject.project.id
                    )
                  }
                />
              ))}
              <section className="bento-inbox-summary-card" aria-label="Inbox summary">
                <div className="bento-inbox-summary-rail" />
                <div>
                  <h3 className="bento-inbox-summary-title">Inbox</h3>
                  <p className="bento-inbox-summary-count">{inboxBullets.length} unsorted</p>
                </div>
              </section>
            </div>
          </SortableContext>
        </div>

        {/* Floating inbox — desktop only; mobile uses inline inbox card */}
        <div className="bento-inbox hidden lg:block fixed bottom-6 right-6 z-30">
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

// ── Mobile bento: full-width accordion cards ─────────────────────────────────
const MOBILE_PROJECT_PALETTE: Record<string, { dot: string; bg: string; border: string; text: string; nowText: string; nextText: string; laterText: string }> = {
  peach:      { dot: 'hsl(24,45%,73%)',   bg: 'hsla(24,45%,73%,0.08)',  border: 'hsla(24,45%,73%,0.22)',  text: 'hsl(24,40%,55%)',  nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  sky:        { dot: 'hsl(205,60%,75%)',  bg: 'hsla(205,60%,75%,0.08)', border: 'hsla(205,60%,75%,0.22)', text: 'hsl(205,55%,52%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  mint:       { dot: 'hsl(162,38%,58%)',  bg: 'hsla(162,38%,58%,0.08)', border: 'hsla(162,38%,58%,0.22)', text: 'hsl(162,38%,42%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  periwinkle: { dot: 'hsl(235,38%,72%)',  bg: 'hsla(235,38%,72%,0.08)', border: 'hsla(235,38%,72%,0.22)', text: 'hsl(235,35%,55%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  lavender:   { dot: 'hsl(270,25%,68%)',  bg: 'hsla(270,25%,68%,0.08)', border: 'hsla(270,25%,68%,0.22)', text: 'hsl(270,25%,52%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  rose:       { dot: 'hsl(343,32%,67%)',  bg: 'hsla(343,32%,67%,0.08)', border: 'hsla(343,32%,67%,0.22)', text: 'hsl(343,30%,50%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  coral:      { dot: 'hsl(12,48%,74%)',   bg: 'hsla(12,48%,74%,0.08)',  border: 'hsla(12,48%,74%,0.22)',  text: 'hsl(12,44%,52%)',  nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  sage:       { dot: 'hsl(167,35%,66%)',  bg: 'hsla(167,35%,66%,0.08)', border: 'hsla(167,35%,66%,0.22)', text: 'hsl(167,32%,46%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  blush:      { dot: 'hsl(330,28%,74%)',  bg: 'hsla(330,28%,74%,0.08)', border: 'hsla(330,28%,74%,0.22)', text: 'hsl(330,26%,52%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
  slate:      { dot: 'hsl(220,18%,70%)',  bg: 'hsla(220,18%,70%,0.08)', border: 'hsla(220,18%,70%,0.22)', text: 'hsl(220,16%,48%)', nowText: 'hsl(343,30%,55%)', nextText: 'hsl(205,55%,52%)', laterText: 'hsl(162,38%,42%)' },
};

function BentoMobileView({
  sortedBentoProjects,
  inboxBullets,
  laneFilter,
  organization,
  onUpdateOrganization,
}: {
  sortedBentoProjects: BentoProject[];
  inboxBullets: ThoughtBullet[];
  laneFilter: BentoLaneFilter;
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(sortedBentoProjects[0] ? [sortedBentoProjects[0].project.id] : [])
  );

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleDone = (bullet: ThoughtBullet) => {
    const newLane = bullet.lane === 'done' ? ('next' as const) : ('done' as const);
    onUpdateOrganization({
      ...organization,
      bullets: organization.bullets.map(b =>
        b.id === bullet.id ? { ...b, lane: newLane } : b
      ),
    });
  };

  const laneDot = (lane: string) => {
    if (lane === 'now') return 'var(--color-lane-now)';
    if (lane === 'next') return 'var(--color-lane-next)';
    if (lane === 'later') return 'var(--color-lane-later)';
    return 'var(--color-lane-done)';
  };

  return (
    <div className="lg:hidden flex-1 overflow-y-auto px-3.5 py-2 pb-24 flex flex-col gap-2">
      {sortedBentoProjects.map(({ project, bullets, nowCount, nextCount, laterCount }) => {
        const pal = MOBILE_PROJECT_PALETTE[project.color] ?? MOBILE_PROJECT_PALETTE.slate;
        const isExpanded = expandedIds.has(project.id);
        const visibleBullets = laneFilter === 'all' ? bullets : bullets.filter(b => b.lane === laneFilter);

        return (
          <div
            key={project.id}
            className="overflow-hidden rounded-[18px] transition-colors"
            style={{
              background: isExpanded ? pal.bg : 'var(--color-bg-surface)',
              border: `1px solid ${isExpanded ? pal.border : 'var(--color-border-subtle)'}`,
            }}
          >
            <button
              type="button"
              onClick={() => toggleExpanded(project.id)}
              className="flex w-full items-center gap-3 px-4 py-3.5"
            >
              {/* Left color bar */}
              <div className="h-9 w-[3px] shrink-0 rounded-full" style={{ background: pal.dot }} aria-hidden />

              <div className="flex-1 min-w-0 text-left">
                <p className="font-display text-[17px] font-bold text-[var(--color-text-primary)] mb-1">{project.label}</p>
                <div className="flex items-center gap-2">
                  {nowCount > 0 && <span className="font-display text-[11px] font-bold" style={{ color: 'var(--color-lane-now)' }}>{nowCount} now</span>}
                  {nextCount > 0 && <span className="font-display text-[11px] font-bold" style={{ color: 'var(--color-lane-next)' }}>{nextCount} next</span>}
                  {laterCount > 0 && <span className="font-display text-[11px] font-bold" style={{ color: 'var(--color-lane-later)' }}>{laterCount} later</span>}
                  {nowCount + nextCount + laterCount === 0 && <span className="font-body text-[11px] text-[var(--color-text-muted)]">Empty</span>}
                </div>
              </div>

              {isExpanded
                ? <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform" aria-hidden />
                : <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform" aria-hidden />
              }
            </button>

            {isExpanded && (
              <div className="px-4 pb-3">
                {visibleBullets.length === 0 ? (
                  <p className="pb-2 font-body text-[13px] text-[var(--color-text-muted)]">
                    {laneFilter !== 'all' ? `No ${laneFilter} tasks` : 'No tasks yet'}
                  </p>
                ) : visibleBullets.map(b => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 py-3 border-t border-[var(--color-border-subtle)]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleDone(b)}
                      className="h-7 w-7 shrink-0 rounded-full border border-[var(--color-border-subtle)] transition-all flex items-center justify-center bg-transparent"
                      aria-label="Mark complete"
                    />
                    <span className="flex-1 font-body text-[15px] leading-snug text-[var(--color-text-primary)]">{b.text}</span>
                    {b.lane && (
                      <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: laneDot(b.lane) }} aria-hidden />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Inbox summary card */}
      <div
        className="flex items-center gap-3 rounded-[18px] px-4 py-3.5"
        style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}
      >
        <div className="h-9 w-[3px] shrink-0 rounded-full" style={{ background: 'var(--color-accent-amethyst)', opacity: 0.7 }} aria-hidden />
        <div>
          <p className="font-display text-[17px] font-bold text-[var(--color-text-primary)]">Inbox</p>
          <p className="font-body text-[11px] text-[var(--color-text-muted)] mt-0.5">{inboxBullets.length} unsorted</p>
        </div>
      </div>
    </div>
  );
}
