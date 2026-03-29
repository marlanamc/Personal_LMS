'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  deduplicateProjects,
  groupByProjectLane,
  laneToPriority,
  reconcileBullets,
  THOUGHT_LANES,
  type ProjectColor,
  type ProjectMeta,
  type ThoughtBullet,
  type ThoughtLane,
  type ThoughtOrganization,
} from '@/lib/thought-organization';
import { OrganizableBullet } from './OrganizableBullet';

interface ThoughtOrganizeModeProps {
  dateKey?: string;
  markdown?: string;
  organization: ThoughtOrganization | undefined;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  onClose?: () => void;
  isInline?: boolean;
  standalone?: boolean;
}

const LANE_CONFIG: Record<ThoughtLane, {
  label: string;
  hint: string;
  dotClass: string;
  borderClass: string;
  surfaceClass: string;
}> = {
  now: {
    label: 'Now',
    hint: 'Needs your attention first',
    dotClass: 'bg-primary',
    borderClass: 'border-primary/25',
    surfaceClass: 'bg-primary/[0.06]',
  },
  next: {
    label: 'Next',
    hint: 'Important, but not first',
    dotClass: 'bg-accent-teal',
    borderClass: 'border-accent-teal/25',
    surfaceClass: 'bg-accent-teal/[0.06]',
  },
  later: {
    label: 'Later',
    hint: 'Keep it visible without pressure',
    dotClass: 'bg-accent-mint',
    borderClass: 'border-accent-mint/25',
    surfaceClass: 'bg-accent-mint/[0.06]',
  },
};

const PROJECT_COLORS: ProjectColor[] = ['lavender', 'mint', 'sky', 'peach', 'rose', 'sage', 'periwinkle', 'coral', 'blush', 'slate'];

function laneDropId(projectId: string, lane: ThoughtLane) {
  return `lane:${projectId}:${lane}`;
}

function inboxDropId() {
  return 'lane:inbox';
}

function parseDropId(id: string): { isInbox: boolean; projectId?: string; lane?: ThoughtLane } | null {
  if (id === 'lane:inbox') {
    return { isInbox: true };
  }

  const match = /^lane:(.+):(now|next|later)$/.exec(id);
  if (!match) return null;

  return {
    isInbox: false,
    projectId: match[1],
    lane: match[2] as ThoughtLane,
  };
}

function getBulletContainerId(bullet: ThoughtBullet) {
  if (!bullet.project) return inboxDropId();
  return laneDropId(bullet.project, bullet.lane ?? 'next');
}

function normalizeBulletUpdate(bullet: ThoughtBullet, updates: Partial<ThoughtBullet>, projects: ProjectMeta[]): ThoughtBullet {
  const hasProject = Object.prototype.hasOwnProperty.call(updates, 'project');
  const hasProjectMeta = Object.prototype.hasOwnProperty.call(updates, 'projectMeta');
  const hasLane = Object.prototype.hasOwnProperty.call(updates, 'lane');

  const nextProject = hasProject ? updates.project : bullet.project;
  const nextProjectMeta = hasProjectMeta ? updates.projectMeta : bullet.projectMeta;
  const nextLane = hasLane ? updates.lane : bullet.lane;

  if (!nextProject) {
    return {
      ...bullet,
      ...updates,
      project: undefined,
      projectMeta: undefined,
      lane: undefined,
      priority: undefined,
    };
  }

  const resolvedProjectMeta =
    nextProjectMeta ??
    projects.find((project) => project.id === nextProject) ??
    bullet.projectMeta;

  const resolvedLane = nextLane ?? 'next';

  return {
    ...bullet,
    ...updates,
    project: nextProject,
    projectMeta: resolvedProjectMeta,
    lane: resolvedLane,
    priority: laneToPriority(resolvedLane),
  };
}

function laneColumnIds(organization: ThoughtOrganization) {
  return groupByProjectLane(organization.bullets, organization.projects)
    .filter((group) => !group.isInbox)
    .map((group) => group.projectId);
}

function DroppableLane({
  id,
  lane,
  bullets,
  existingProjects,
  onUpdateBullet,
}: {
  id: string;
  lane: ThoughtLane;
  bullets: ThoughtBullet[];
  existingProjects: ProjectMeta[];
  onUpdateBullet: (bulletId: string, updates: Partial<ThoughtBullet>) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = LANE_CONFIG[lane];
  const bulletIds = bullets.map((bullet) => bullet.id);

  return (
    <div className="min-h-[13rem]">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 sm:h-2.5 sm:w-2.5 rounded-full ${config.dotClass}`} />
          <span className="text-sm sm:text-xs font-bold sm:font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-text">{config.label}</span>
        </div>
        <span className="text-xs sm:text-[10px] font-medium text-text-muted">{bullets.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[11rem] rounded-[1.1rem] border p-3 sm:p-2.5 transition-all duration-200 ${config.borderClass} ${config.surfaceClass} ${
          isOver ? 'ring-2 ring-primary/40 border-primary/40 bg-primary/8 shadow-[0_0_20px_rgba(212,138,166,0.2)] scale-[1.01]' : ''
        }`}
      >
        <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {bullets.length === 0 ? (
              <div className="flex min-h-[9rem] items-center justify-center rounded-[1rem] border border-dashed border-white/20 px-4 py-6 text-center">
                <div>
                  <p className="text-sm sm:text-xs font-semibold sm:font-medium text-text-muted">{config.hint}</p>
                  <p className="mt-1.5 text-xs sm:text-[11px] text-text-muted/70">
                    <span className="lg:hidden">Drag bullets here</span>
                    <span className="hidden lg:inline">Drop a thought here</span>
                  </p>
                </div>
              </div>
            ) : (
              bullets.map((bullet) => (
                <OrganizableBullet
                  key={bullet.id}
                  bullet={bullet}
                  existingProjects={existingProjects}
                  onUpdate={(updates) => onUpdateBullet(bullet.id, updates)}
                  interactionMode="drag-only"
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

function DroppableInbox({
  bullets,
  existingProjects,
  onUpdateBullet,
  collapsed,
  onToggle,
}: {
  bullets: ThoughtBullet[];
  existingProjects: ProjectMeta[];
  onUpdateBullet: (bulletId: string, updates: Partial<ThoughtBullet>) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const id = inboxDropId();
  const { setNodeRef, isOver } = useDroppable({ id });
  const bulletIds = bullets.map((bullet) => bullet.id);

  if (collapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full lg:w-[5.5rem] shrink-0 rounded-[1.35rem] border border-border-subtle/60 bg-bg-surface/40 p-2.5"
        style={{ boxShadow: 'var(--shadow-organize-card)' }}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full flex-row lg:flex-col items-center justify-between lg:justify-center gap-3 lg:gap-3 rounded-[1rem] border border-dashed border-border-subtle/70 bg-bg-base/20 px-4 lg:px-2 py-3 lg:py-4 text-center transition-all hover:bg-bg-surface/40 hover:border-primary/30 touch-manipulation min-h-[44px] lg:min-h-0"
          aria-label="Show inbox"
        >
          <div className="flex items-center gap-2 lg:flex-col lg:gap-3">
            <span className="rounded-full bg-bg-elevated/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-text">
              {bullets.length}
            </span>
            <span className="text-sm lg:text-xs font-semibold uppercase tracking-[0.22em] text-text">Inbox</span>
          </div>
          <ChevronRight className="h-5 w-5 lg:h-4 lg:w-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full lg:w-[15rem] shrink-0 rounded-[1.35rem] border border-border-subtle/60 bg-bg-surface/40 p-3"
      style={{ boxShadow: 'var(--shadow-organize-card)' }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-base sm:text-sm font-bold sm:font-semibold text-text">Inbox</p>
          <span className="rounded-full bg-bg-elevated/90 px-2.5 py-1 text-xs sm:text-[10px] font-bold sm:font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-text-muted">
            {bullets.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-border-subtle/70 p-2 sm:p-1.5 text-text-muted transition-all hover:bg-bg-surface hover:text-text hover:scale-110 touch-manipulation"
          aria-label="Hide inbox"
        >
          <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[32rem] rounded-[1rem] border border-dashed border-border-subtle/70 bg-bg-base/20 p-2 transition-all ${
          isOver ? 'ring-2 ring-primary/30 bg-bg-elevated/60' : ''
        }`}
      >
        <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {bullets.length === 0 ? (
              <div className="flex min-h-[28rem] items-center justify-center px-4 text-center">
                <div>
                  <p className="text-sm font-medium text-text-muted">Inbox is clear</p>
                  <p className="mt-1 text-xs text-text-muted/70">New capture bullets will land here first</p>
                </div>
              </div>
            ) : (
              bullets.map((bullet) => (
                <OrganizableBullet
                  key={bullet.id}
                  bullet={bullet}
                  existingProjects={existingProjects}
                  onUpdate={(updates) => onUpdateBullet(bullet.id, updates)}
                  interactionMode="drag-only"
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </motion.div>
  );
}

export function ThoughtOrganizeMode({
  dateKey,
  markdown,
  organization,
  onUpdateOrganization,
  onClose,
  isInline = false,
  standalone = false,
}: ThoughtOrganizeModeProps) {
  const [mounted, setMounted] = useState(false);
  const [activeBullet, setActiveBullet] = useState<ThoughtBullet | null>(null);
  const [localOrg, setLocalOrg] = useState<ThoughtOrganization>(() =>
    standalone && organization
      ? organization
      : reconcileBullets(markdown ?? '', organization)
  );
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState<ProjectColor>('lavender');
  const [inboxCollapsed, setInboxCollapsed] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (standalone) {
      // In standalone mode, use organization directly without reconciliation
      if (organization) {
        setLocalOrg(organization);
      }
    } else {
      // In per-day mode, reconcile bullets from markdown
      setLocalOrg(reconcileBullets(markdown ?? '', organization));
    }
  }, [markdown, organization, dateKey, standalone]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdateOrganization(localOrg);
    }, 300);

    return () => clearTimeout(timer);
  }, [localOrg, onUpdateOrganization]);

  const grouped = useMemo(() => groupByProjectLane(localOrg.bullets, localOrg.projects), [localOrg]);
  const inbox = grouped.find((group) => group.isInbox);
  const projectColumns = grouped.filter((group) => !group.isInbox);

  useEffect(() => {
    if (projectColumns.length === 0) {
      setInboxCollapsed(false);
    }
  }, [projectColumns.length]);

  const updateProjectsFromBullets = (bullets: ThoughtBullet[], existingProjects: ProjectMeta[]) => {
    const deduped = deduplicateProjects(bullets);
    const preservedEmptyProjects = existingProjects.filter(
      (project) => !deduped.some((item) => item.id === project.id)
    );

    return [...deduped, ...preservedEmptyProjects];
  };

  const handleCreateProject = (label: string, color: ProjectColor) => {
    setLocalOrg((prev) => {
      const projectMeta: ProjectMeta = {
        id: crypto.randomUUID(),
        label: label.trim().slice(0, 50),
        color,
      };

      return {
        ...prev,
        projects: [...prev.projects, projectMeta],
      };
    });
  };

  const handleSubmitProject = () => {
    const label = newProjectName.trim();
    if (!label) return;
    handleCreateProject(label, newProjectColor);
    setNewProjectName('');
    setNewProjectColor('lavender');
    setShowProjectModal(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const bullet = localOrg.bullets.find((item) => item.id === event.active.id);
    setActiveBullet(bullet || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveBullet(null);

    const { active, over } = event;
    if (!over) return;

    setLocalOrg((prev) => {
      const activeId = String(active.id);
      const overId = String(over.id);
      const activeBullet = prev.bullets.find((bullet) => bullet.id === activeId);
      if (!activeBullet) return prev;

      const overBullet = prev.bullets.find((bullet) => bullet.id === overId);
      const sourceContainerId = getBulletContainerId(activeBullet);
      const targetInfo = overBullet ? parseDropId(getBulletContainerId(overBullet)) : parseDropId(overId);

      if (!targetInfo) return prev;

      const containers = new Map<string, ThoughtBullet[]>();
      containers.set(inboxDropId(), prev.bullets.filter((bullet) => !bullet.project).sort((a, b) => a.displayOrder - b.displayOrder));

      laneColumnIds(prev).forEach((projectId) => {
        THOUGHT_LANES.forEach((lane) => {
          containers.set(
            laneDropId(projectId, lane),
            prev.bullets
              .filter((bullet) => bullet.project === projectId && (bullet.lane ?? 'next') === lane)
              .sort((a, b) => a.displayOrder - b.displayOrder)
          );
        });
      });

      if (activeBullet.project && !containers.has(sourceContainerId)) {
        containers.set(sourceContainerId, []);
      }

      const sourceItems = [...(containers.get(sourceContainerId) || [])];
      const activeIndex = sourceItems.findIndex((bullet) => bullet.id === activeId);
      if (activeIndex === -1) return prev;

      const [removed] = sourceItems.splice(activeIndex, 1);
      containers.set(sourceContainerId, sourceItems);

      const targetContainerId = targetInfo.isInbox ? inboxDropId() : laneDropId(targetInfo.projectId!, targetInfo.lane!);
      const targetItems = [...(containers.get(targetContainerId) || [])];
      const insertionIndex = overBullet
        ? targetItems.findIndex((bullet) => bullet.id === overBullet.id)
        : targetItems.length;

      const movedBullet = targetInfo.isInbox
        ? {
            ...removed,
            project: undefined,
            projectMeta: undefined,
            lane: undefined,
            priority: undefined,
          }
        : {
            ...removed,
            project: targetInfo.projectId,
            projectMeta: prev.projects.find((project) => project.id === targetInfo.projectId) ?? removed.projectMeta,
            lane: targetInfo.lane,
            priority: laneToPriority(targetInfo.lane),
          };

      const safeInsertionIndex = insertionIndex < 0 ? targetItems.length : insertionIndex;
      targetItems.splice(safeInsertionIndex, 0, movedBullet);

      const nextContainers = new Map(containers);
      nextContainers.set(targetContainerId, targetItems);

      const orderLookup = new Map<string, number>();
      nextContainers.forEach((items) => {
        items.forEach((bullet, index) => {
          orderLookup.set(bullet.id, index);
        });
      });

      const bullets = prev.bullets.map((bullet) => {
        if (bullet.id === movedBullet.id) {
          return {
            ...movedBullet,
            displayOrder: orderLookup.get(bullet.id) ?? bullet.displayOrder,
          };
        }

        if (orderLookup.has(bullet.id)) {
          return {
            ...bullet,
            displayOrder: orderLookup.get(bullet.id) ?? bullet.displayOrder,
          };
        }

        return bullet;
      });

      return {
        bullets,
        projects: updateProjectsFromBullets(bullets, prev.projects),
      };
    });
  };

  const handleUpdateBullet = (bulletId: string, updates: Partial<ThoughtBullet>) => {
    setLocalOrg((prev) => {
      const bullets = prev.bullets.map((bullet) =>
        bullet.id === bulletId ? normalizeBulletUpdate(bullet, updates, prev.projects) : bullet
      );

      return {
        bullets,
        projects: updateProjectsFromBullets(bullets, prev.projects),
      };
    });
  };

  const contentBody = (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle/60 bg-bg-surface/55 px-4 py-3 sm:py-4 backdrop-blur-xl sm:px-6">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">Organize</p>
          <h2 className="mt-1 text-sm sm:text-base font-semibold text-text">
            <span className="lg:hidden">Tap bullets to edit • Drag to organize</span>
            <span className="hidden lg:inline">Drag thoughts from Inbox into a project</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowProjectModal(true)}
          className="inline-flex items-center gap-2 rounded-full border border-border-subtle/80 bg-bg-elevated/70 px-4 py-2.5 sm:px-3 sm:py-2 text-sm sm:text-xs font-semibold text-text transition-colors hover:bg-bg-elevated touch-manipulation min-h-[44px] sm:min-h-0"
        >
          <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          <span className="hidden sm:inline">New project</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      <AnimatePresence>
        {showProjectModal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]"
            onClick={() => setShowProjectModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md rounded-[1.75rem] border border-border-subtle/70 bg-bg-elevated/95 p-5 shadow-2xl backdrop-blur-xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="thought-project-modal-title"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">New Project</p>
                  <h3 id="thought-project-modal-title" className="mt-1 text-lg font-semibold text-text">Add a project column</h3>
                  <p className="mt-1 text-sm text-text-muted">Give it a name and color so it reads quickly while you drag.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="rounded-full border border-border-subtle/70 p-2 text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
                  aria-label="Close add project popup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="thought-project-name" className="mb-2 block text-xs font-medium text-text-muted">
                    Project name
                  </label>
                  <input
                    id="thought-project-name"
                    type="text"
                    value={newProjectName}
                    onChange={(event) => setNewProjectName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSubmitProject();
                      }
                    }}
                    placeholder="Apartment reset"
                    className="w-full rounded-2xl border border-border-subtle bg-bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {PROJECT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProjectColor(color)}
                        className={`h-10 rounded-2xl border transition-all ${
                          newProjectColor === color
                            ? 'border-white ring-2 ring-primary/40 ring-offset-2 ring-offset-bg-elevated scale-[1.03]'
                            : 'border-white/15 hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor:
                            color === 'peach' ? '#e0b89a' :
                            color === 'coral' ? '#e8b4a8' :
                            color === 'sky' ? '#9dc5e8' :
                            color === 'mint' ? '#7dbba3' :
                            color === 'sage' ? '#8bc4b8' :
                            color === 'periwinkle' ? '#9ba3d4' :
                            color === 'lavender' ? '#b8a5c8' :
                            color === 'blush' ? '#d4b8c4' :
                            color === 'rose' ? '#c9a0ab' :
                            '#a4b0c4',
                        }}
                        aria-label={`Choose ${color} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <span className={`moment-tag-pill moment-tag-pill-selected-${newProjectColor}`}>
                  {newProjectName.trim() || 'Preview'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="rounded-full border border-border-subtle/70 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitProject}
                    disabled={!newProjectName.trim()}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add project
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex-1 overflow-auto px-4 py-4 sm:px-6 sm:py-5">
        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {localOrg.bullets.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-[1.75rem] border border-dashed border-border-subtle bg-bg-surface/40">
              <div className="text-center">
                <p className="text-sm font-medium text-text-muted">No bullets found</p>
                <p className="mt-1 text-xs text-text-muted/70">Add some list items in capture mode to organize them</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row min-h-full gap-3 pb-2">
              <DroppableInbox
                bullets={inbox?.bullets || []}
                existingProjects={localOrg.projects}
                onUpdateBullet={handleUpdateBullet}
                collapsed={inboxCollapsed}
                onToggle={() => setInboxCollapsed((value) => !value)}
              />

              {projectColumns.map((column, index) => (
                <motion.div
                  key={column.projectId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: 'easeOut' }}
                  className="w-full lg:w-[19.5rem] shrink-0 rounded-[1.35rem] border border-border-subtle/60 bg-bg-surface/40 p-3 transition-all duration-200 hover:bg-bg-surface/50"
                  style={{ boxShadow: 'var(--shadow-organize-card)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-organize-card-hover)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-organize-card)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3 border-b border-border-subtle/30 pb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`moment-tag-pill moment-tag-pill-selected-${column.projectMeta?.color ?? 'lavender'} transition-transform hover:scale-105`}>
                          {column.projectMeta?.label || 'Project'}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-bg-elevated/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted/80 transition-all hover:bg-bg-elevated hover:text-text-muted">
                      {THOUGHT_LANES.reduce((sum, lane) => sum + column.lanes[lane].length, 0)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {THOUGHT_LANES.map((lane) => (
                      <DroppableLane
                        key={lane}
                        id={laneDropId(column.projectId, lane)}
                        lane={lane}
                        bullets={column.lanes[lane]}
                        existingProjects={localOrg.projects}
                        onUpdateBullet={handleUpdateBullet}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}

              {projectColumns.length === 0 && localOrg.projects.length === 0 ? (
                <div className="flex w-[19.5rem] shrink-0 items-center justify-center rounded-[1.35rem] border border-dashed border-border-subtle/80 bg-bg-surface/25 p-6 text-center">
                  <div>
                    <p className="text-sm font-medium text-text">No projects yet</p>
                    <p className="mt-1 text-xs text-text-muted">Create a project, then drag thoughts out of Inbox.</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <DragOverlay>
            {activeBullet ? (
              <div
                className="max-w-[22rem] rounded-xl border border-primary/40 bg-bg-elevated/95 px-4 py-3 backdrop-blur-lg ring-2 ring-primary/20 cursor-grabbing"
                style={{
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), var(--glow-primary)',
                }}
              >
                <div className="text-sm font-medium text-text">{activeBullet.text}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );

  if (!mounted && !isInline) return null;

  if (isInline) {
    return contentBody;
  }

  const content = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative mx-2 mt-4 h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border-subtle/60 bg-bg-surface/85 shadow-2xl backdrop-blur-xl sm:mx-4 sm:mt-12 sm:h-[calc(100vh-6rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={onClose}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-4 text-sm font-medium text-text-muted transition-colors hover:bg-bg-hover hover:text-text"
              >
                <X className="h-4 w-4" />
                Done
              </button>
            </div>
          )}
          {contentBody}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
