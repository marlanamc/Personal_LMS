'use client';

import { forwardRef, Fragment, useCallback, useEffect, useImperativeHandle, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsBelowLg } from '@/hooks/useIsBelowLg';
import {
  ORGANIZE_DEFAULT_MOBILE_TAB,
  readOrganizePrefs,
  writeOrganizePrefs,
  type OrganizeMobileSurfaceTab,
} from '@/lib/organize-prefs';
import { parseSpotlightNowInsertIndex, spotlightNowInsertId } from '@/lib/organize-spotlight';
import { ChevronDown, ChevronLeft, Eye, EyeOff, GripVertical, MoreHorizontal, Plus, Trash2, Undo2, X } from 'lucide-react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  type Modifier,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, arrayMove, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import {
  deduplicateProjects,
  groupByProjectLane,
  insertIntoGlobalNowQueueAt,
  laneToPriority,
  moveGlobalNowBulletByDelta,
  reconcileBullets,
  THOUGHT_LANES,
  type ProjectColor,
  type ProjectMeta,
  type ThoughtBullet,
  type ThoughtLane,
  type ThoughtOrganization,
} from '@/lib/thought-organization';
import { OrganizableBullet } from './OrganizableBullet';

const ACTIVE_LANES: ThoughtLane[] = ['now', 'next', 'later'];
const QUEUED_LANES: ThoughtLane[] = ['next', 'later'];
const NOW_SOFT_LIMIT = 5;
const SPOTLIGHT_COMPACT_CAP_MOBILE = 4;
const SPOTLIGHT_COMPACT_CAP_DESKTOP = 5;

interface ThoughtOrganizeModeProps {
  dateKey?: string;
  markdown?: string;
  organization: ThoughtOrganization | undefined;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  onClose?: () => void;
  isInline?: boolean;
  standalone?: boolean;
  hideHeader?: boolean;
  showDone?: boolean;
  onAddProject?: () => void;
}

const LANE_CONFIG: Record<ThoughtLane, {
  label: string;
  dotClass: string;
}> = {
  now: {
    label: 'Now',
    dotClass: 'bg-primary',
  },
  next: {
    label: 'Next',
    dotClass: 'bg-accent-teal',
  },
  later: {
    label: 'Later',
    dotClass: 'bg-accent-mint',
  },
  done: {
    label: 'Done',
    dotClass: 'bg-emerald-600',
  },
};

const PROJECT_COLORS: ProjectColor[] = ['lavender', 'mint', 'sky', 'peach', 'rose', 'sage', 'periwinkle', 'coral', 'blush', 'slate'];

function SpotlightInsertStrip({
  insertIndex,
  label,
  hint,
  dragType,
  size = 'compact',
  variant = 'full',
}: {
  insertIndex: number;
  label: string;
  hint: string;
  dragType?: 'project' | 'bullet' | null;
  size?: 'compact' | 'hero';
  /** Minimal hit target when not dragging; expands visually while dragging bullets */
  variant?: 'full' | 'quiet';
}) {
  const id = spotlightNowInsertId(insertIndex);
  const { setNodeRef, isOver } = useDroppable({ id });
  const showDropHighlight = isOver && dragType === 'bullet';
  const aria =
    variant === 'quiet'
      ? insertIndex === 0
        ? 'Drop zone: move to top of active list'
        : 'Drop zone: insert in active list'
      : `${label}. ${hint}`;

  if (variant === 'quiet') {
    return (
      <div
        ref={setNodeRef}
        className={`now-spotlight-insert now-spotlight-insert-quiet ${showDropHighlight ? 'now-spotlight-insert-active' : ''}`}
        data-drop-slot={id}
        aria-label={aria}
        role="presentation"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`now-spotlight-insert ${showDropHighlight ? 'now-spotlight-insert-active' : ''}`}
      data-drop-slot={id}
    >
      {label ? <div className="now-spotlight-insert-label">{label}</div> : null}
      <div className={size === 'hero' ? 'now-spotlight-drop-placeholder' : 'now-spotlight-insert-hint'}>
        <span>{hint}</span>
      </div>
    </div>
  );
}

function NowSpotlight({
  bullets,
  projects,
  onUpdateBullet,
  onDeleteBullet,
  showExpanded,
  onToggleExpanded,
  focusedProjectId,
  dragType,
  compactCap,
  showLaneActions,
  onReorderGlobalNow,
  onGoToProjectsTab,
}: {
  bullets: ThoughtBullet[];
  projects: ProjectMeta[];
  onUpdateBullet: (bulletId: string, updates: Partial<ThoughtBullet>) => void;
  onDeleteBullet: (bulletId: string) => void;
  showExpanded: boolean;
  onToggleExpanded: () => void;
  focusedProjectId?: string | null;
  dragType?: 'project' | 'bullet' | null;
  compactCap: number;
  showLaneActions: boolean;
  onReorderGlobalNow: (bulletId: string, delta: -1 | 1) => void;
  /** When set (e.g. mobile), empty spotlight can jump to the Projects tab */
  onGoToProjectsTab?: () => void;
}) {
  const nowBullets = [...bullets]
    .filter((b) => b.lane === 'now' && b.project && (!focusedProjectId || b.project === focusedProjectId))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const focusedProject = focusedProjectId
    ? projects.find((project) => project.id === focusedProjectId) ?? null
    : null;

  const hasOverflow = nowBullets.length > compactCap;
  const overSoftLimit = nowBullets.length > NOW_SOFT_LIMIT;
  const listScrollClass =
    hasOverflow && !showExpanded ? 'now-spotlight-active-list-collapsed' : '';
  const verboseDropZones = dragType === 'bullet';

  const renderBullet = (bullet: ThoughtBullet, index: number) => {
    const priority = index === 0 ? 'primary' : 'secondary';
    const queue = nowBullets.map((b) => b.id);
    const pos = queue.indexOf(bullet.id);
    return (
      <OrganizableBullet
        key={bullet.id}
        bullet={bullet}
        existingProjects={projects}
        onUpdate={(updates) => onUpdateBullet(bullet.id, updates)}
        onDelete={() => onDeleteBullet(bullet.id)}
        interactionMode="drag-only"
        showProjectPill
        inSpotlight
        spotlightPriority={priority}
        disableSortable={false}
        showLaneActions={showLaneActions}
        activeSetReorder={{
          onMoveUp: () => onReorderGlobalNow(bullet.id, -1),
          onMoveDown: () => onReorderGlobalNow(bullet.id, 1),
          canMoveUp: pos > 0,
          canMoveDown: pos >= 0 && pos < queue.length - 1,
        }}
      />
    );
  };

  const listInner = (
    <div className={`now-spotlight-active-list ${listScrollClass}`.trim()}>
      {nowBullets.length === 0 ? (
        <>
          <SpotlightInsertStrip
            insertIndex={0}
            label="Active tasks"
            hint={
              projects.length > 0
                ? 'Drag from Projects or capture in Inbox.'
                : 'Add a project, then pull tasks into this list.'
            }
            dragType={dragType}
            size="hero"
          />
          {onGoToProjectsTab && projects.length > 0 ? (
            <div className="mt-4 flex flex-col items-center px-2 text-center">
              <button
                type="button"
                onClick={onGoToProjectsTab}
                className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95 touch-manipulation"
              >
                Go to Projects
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <SpotlightInsertStrip
            insertIndex={0}
            label="Drop at front"
            hint="Release to make this the first active task"
            dragType={dragType}
            variant={verboseDropZones ? 'full' : 'quiet'}
          />
          {nowBullets.map((bullet, i) => (
            <Fragment key={bullet.id}>
              <div className="now-spotlight-active-item">{renderBullet(bullet, i)}</div>
              <SpotlightInsertStrip
                insertIndex={i + 1}
                label=""
                hint="Drop to insert here"
                dragType={dragType}
                variant={verboseDropZones ? 'full' : 'quiet'}
              />
            </Fragment>
          ))}
        </>
      )}
    </div>
  );

  return (
    <div className="now-spotlight now-spotlight--calm mb-5">
      <div className="now-spotlight-header">
        <div className="now-spotlight-heading">
          <span className="now-spotlight-dot" />
          <div className="now-spotlight-title-wrap">
            <span className="now-spotlight-label">Now</span>
            <p className="now-spotlight-subtitle now-spotlight-subtitle-primary">
              {focusedProject
                ? `${focusedProject.label}`
                : nowBullets.length > 0
                  ? 'Active set'
                  : 'Nothing in motion yet'}
            </p>
            <p className="now-spotlight-subline">
              {focusedProject
                ? `${nowBullets.length} active task${nowBullets.length === 1 ? '' : 's'}`
                : nowBullets.length > 0
                  ? `${nowBullets.length} active task${nowBullets.length === 1 ? '' : 's'}`
                  : 'Add tasks from Projects to get started'}
            </p>
            {overSoftLimit ? (
              <p className="now-spotlight-soft-limit mt-1.5 text-[11px] font-medium leading-snug text-text-muted">
                List is full. Consider moving some to <span className="text-text-secondary">Next</span>.
              </p>
            ) : null}
          </div>
        </div>
        <span className="now-spotlight-count" aria-hidden>
          {nowBullets.length}
        </span>
      </div>

      <div className="now-spotlight-flow now-spotlight-flow-single">
        {nowBullets.length > 0 ? (
          <SortableContext items={nowBullets.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {listInner}
          </SortableContext>
        ) : (
          listInner
        )}
      </div>

      {nowBullets.length > 0 && hasOverflow ? (
        <div className="now-spotlight-overflow">
          <span className="now-spotlight-overflow-text">Long active list</span>
          <button type="button" onClick={onToggleExpanded} className="now-spotlight-overflow-button">
            {showExpanded ? 'Collapse scroll' : 'Expand scroll'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ProjectNowSummary({
  bullets,
}: {
  bullets: ThoughtBullet[];
}) {
  if (bullets.length === 0) return null;

  return (
    <div className="organize-project-focus-summary">
      <div className="organize-project-focus-summary-header">
        <div className="organize-project-focus-summary-label-wrap">
          <span className="organize-project-focus-summary-dot" />
          <span className="organize-project-focus-summary-label">In Focus</span>
        </div>
        <span className="organize-project-focus-summary-count">{bullets.length}</span>
      </div>
      <div className="organize-project-focus-summary-list">
        {bullets.map((bullet) => (
          <div key={bullet.id} className="organize-project-focus-summary-item">
            <span className="organize-project-focus-summary-text">{bullet.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function laneDropId(projectId: string, lane: ThoughtLane) {
  return `lane:${projectId}:${lane}`;
}

function projectColumnId(projectId: string) {
  return `project:${projectId}`;
}

function parseProjectColumnId(id: string): string | null {
  const match = /^project:(.+)$/.exec(id);
  return match ? match[1] : null;
}

function inboxDropId() {
  return 'lane:inbox';
}

function parseDropId(id: string): { isInbox: boolean; projectId?: string; lane?: ThoughtLane } | null {
  if (id === 'lane:inbox') {
    return { isInbox: true };
  }

  const match = /^lane:(.+):(now|next|later|done)$/.exec(id);
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
  onDeleteBullet,
  collapsed = false,
  onToggleCollapsed,
  dragType,
  suppressLaneContent = false,
  showLaneActions = false,
  laterShowHideControl = false,
}: {
  id: string;
  lane: ThoughtLane;
  bullets: ThoughtBullet[];
  existingProjects: ProjectMeta[];
  onUpdateBullet: (bulletId: string, updates: Partial<ThoughtBullet>) => void;
  onDeleteBullet: (bulletId: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  dragType?: 'project' | 'bullet' | null;
  suppressLaneContent?: boolean;
  showLaneActions?: boolean;
  /** When Later is expanded on mobile, show a compact Hide control in the lane header */
  laterShowHideControl?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = LANE_CONFIG[lane];
  const bulletIds = bullets.map((bullet) => bullet.id);
  // Only show drop highlight for bullet drags, not project drags
  const showDropHighlight = isOver && dragType === 'bullet';

  if (suppressLaneContent) {
    return (
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
          <div className="organize-lane-heading flex items-center gap-2" data-lane={lane}>
            <span className="organize-lane-heading-mark" />
            <span className="organize-lane-heading-label text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
              {config.label}
            </span>
          </div>
          <span className="organize-lane-heading-count text-[10px] font-medium text-text-muted/50 tabular-nums">{bullets.length}</span>
        </div>
        <div
          ref={setNodeRef}
          className={`organize-lane-dropzone organize-lane-dropzone-suppressed py-1.5 min-h-[3rem] transition-colors duration-150 ${
            showDropHighlight ? 'organize-lane-dropzone-active rounded-xl bg-bg-surface/50 ring-2 ring-primary/20' : ''
          }`}
          data-lane={lane}
          aria-hidden
        />
      </div>
    );
  }

  if (lane === 'done' && collapsed) {
    return (
      <div className="rounded-[1rem] border border-emerald-500/20 bg-emerald-500/[0.05] px-3 py-2">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="text-sm font-semibold text-text">Done</p>
            <p className="text-xs text-text-muted">{bullets.length} completed</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-bg-surface/80 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
            Show
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    );
  }

  if (lane === 'later' && collapsed && onToggleCollapsed) {
    return (
      <div className="organize-lane-later-collapsed rounded-[1rem] border border-accent-mint/25 bg-accent-mint/[0.06] px-3 py-2">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded="false"
          className="flex w-full items-center justify-between gap-3 text-left touch-manipulation"
        >
          <div>
            <p className="text-sm font-semibold text-text">Later</p>
            <p className="text-xs text-text-muted">
              {bullets.length} {bullets.length === 1 ? 'task' : 'tasks'} out of the way
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-accent-mint/30 bg-bg-surface/80 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
            Show
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
        <div className="organize-lane-heading flex min-w-0 items-center gap-2" data-lane={lane}>
          <span className="organize-lane-heading-mark" />
          <span className="organize-lane-heading-label text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">{config.label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {lane === 'later' && laterShowHideControl && onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="rounded-full border border-border-subtle/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted transition-colors hover:bg-bg-elevated hover:text-text touch-manipulation"
              aria-expanded="true"
            >
              Hide
            </button>
          ) : null}
          <span className="organize-lane-heading-count text-[10px] font-medium text-text-muted/50 tabular-nums">{bullets.length}</span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`organize-lane-dropzone py-1.5 transition-colors duration-150 ${bullets.length === 0 ? 'min-h-[5.5rem]' : ''} ${
          showDropHighlight ? 'organize-lane-dropzone-active rounded-xl bg-bg-surface/50 ring-2 ring-primary/20' : ''
        }`}
        data-lane={lane}
      >
        <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
          <div className="organize-cards-stack">
            {bullets.length === 0 ? (
              <div className="min-h-[4rem]" />
            ) : (
                bullets.map((bullet) => (
                <OrganizableBullet
                  key={bullet.id}
                  bullet={bullet}
                  existingProjects={existingProjects}
                  onUpdate={(updates) => onUpdateBullet(bullet.id, updates)}
                  onDelete={() => onDeleteBullet(bullet.id)}
                  interactionMode="drag-only"
                  showLaneActions={showLaneActions}
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
  onDeleteBullet,
  selectedIds,
  onToggleSelected,
  onClearSelection,
  onBatchUpdate,
  onBatchDelete,
  collapsed,
  onToggle,
  quickAddText,
  onQuickAddChange,
  onQuickAdd,
  prefersReducedMotion,
  dragType,
  mobileExpandedInline = false,
  showLaneActions = false,
}: {
  bullets: ThoughtBullet[];
  existingProjects: ProjectMeta[];
  onUpdateBullet: (bulletId: string, updates: Partial<ThoughtBullet>) => void;
  onDeleteBullet: (bulletId: string) => void;
  selectedIds: string[];
  onToggleSelected: (bulletId: string) => void;
  onClearSelection: () => void;
  onBatchUpdate: (updates: Partial<ThoughtBullet>) => void;
  onBatchDelete: () => void;
  collapsed: boolean;
  onToggle: () => void;
  quickAddText?: string;
  onQuickAddChange?: (text: string) => void;
  onQuickAdd?: (text: string) => void;
  prefersReducedMotion: boolean;
  dragType?: 'project' | 'bullet' | null;
  mobileExpandedInline?: boolean;
  showLaneActions?: boolean;
}) {
  const id = inboxDropId();
  const { setNodeRef, isOver } = useDroppable({ id });
  const bulletIds = bullets.map((bullet) => bullet.id);
  const [targetProjectId, setTargetProjectId] = useState('');
  // Only show drop highlight for bullet drags, not project drags
  const showDropHighlight = isOver && dragType === 'bullet';

  // On mobile, show bottom sheet trigger; on desktop, show collapsed sidebar
  if (collapsed) {
    return (
      <>
        {/* Desktop collapsed sidebar */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2, ease: 'easeOut' }}
          className="organize-inbox-rail hidden lg:block w-[4rem] shrink-0 p-2 rounded-[1.3rem] bg-bg-surface/30 border border-border-subtle/30"
        >
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full flex-col items-center justify-center gap-3 px-2 py-4 text-center transition-opacity hover:opacity-70"
            aria-label="Show inbox"
          >
            <span className="text-xs font-semibold text-text-muted">{bullets.length}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Inbox</span>
          </button>
        </motion.div>

        {/* Mobile bottom sheet trigger */}
        {!mobileExpandedInline ? (
          <button
            type="button"
            onClick={onToggle}
            className="organize-inbox-sheet-trigger lg:hidden"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">Inbox</span>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                {bullets.length}
              </span>
            </div>
            <ChevronDown className="h-5 w-5 text-text-muted rotate-180" />
          </button>
        ) : null}
      </>
    );
  }

  const shellClassName = mobileExpandedInline
    ? 'organize-inbox-shell block w-full lg:block lg:w-[14.5rem] lg:shrink-0 p-3 rounded-[1.3rem] bg-bg-surface/30 border border-border-subtle/30'
    : 'organize-inbox-shell hidden lg:block w-[14.5rem] shrink-0 p-3 rounded-[1.3rem] bg-bg-surface/30 border border-border-subtle/30';

  return (
    <>
      {/* Desktop sidebar view (also full-width mobile inbox tab) */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
        transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2, ease: 'easeOut' }}
        className={shellClassName}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text">Inbox</p>
            <span className="rounded-full bg-bg-elevated/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              {bullets.length}
            </span>
          </div>
          {!mobileExpandedInline ? (
            <button
              type="button"
              onClick={onToggle}
              className="rounded-full border border-border-subtle/70 p-1.5 text-text-muted transition-colors hover:bg-bg-surface hover:text-text touch-manipulation"
              aria-label="Hide inbox"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Quick-add input - always visible for instant capture */}
        {onQuickAdd && onQuickAddChange && (
          <div className="organize-quick-add mb-3">
            <input
              type="text"
              value={quickAddText ?? ''}
              onChange={(e) => onQuickAddChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && quickAddText?.trim()) {
                  onQuickAdd(quickAddText);
                }
              }}
              placeholder="What's on your mind?"
              className="organize-quick-add-input w-full"
            />
          </div>
        )}

        {selectedIds.length > 0 ? (
          <div className="mb-3 rounded-[1rem] border border-primary/20 bg-primary/[0.06] p-3">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                {selectedIds.length} selected
              </p>
              <button
                type="button"
                onClick={onClearSelection}
                className="text-[10px] font-semibold text-text-muted hover:text-text"
              >
                Clear
              </button>
            </div>
            {existingProjects.length > 0 ? (
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={targetProjectId}
                  onChange={(event) => setTargetProjectId(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-border-subtle/70 bg-bg-surface/85 px-3 py-2 text-xs text-text"
                >
                  <option value="">Send to project…</option>
                  {existingProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!targetProjectId}
                  onClick={() => {
                    const targetProject = existingProjects.find((project) => project.id === targetProjectId);
                    if (!targetProject) return;
                    onBatchUpdate({ project: targetProject.id, projectMeta: targetProject, lane: 'next' });
                    setTargetProjectId('');
                  }}
                  className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send to Next
                </button>
              </div>
            ) : null}
            {targetProjectId ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {([...ACTIVE_LANES, 'done'] as ThoughtLane[]).map((lane) => (
                  <button
                    key={lane}
                    type="button"
                    onClick={() => {
                      const targetProject = existingProjects.find((project) => project.id === targetProjectId);
                      if (!targetProject) return;
                      onBatchUpdate({ project: targetProject.id, projectMeta: targetProject, lane });
                      setTargetProjectId('');
                    }}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      lane === 'done'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'border border-border-subtle/70 bg-bg-surface/85 text-text hover:bg-bg-elevated'
                    }`}
                  >
                    Send to {LANE_CONFIG[lane].label}
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={onBatchDelete}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-error/20 bg-error/6 px-3 py-1.5 text-[11px] font-semibold text-error/85 hover:bg-error/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete selected
            </button>
          </div>
        ) : null}

        <div
          ref={setNodeRef}
          className={`organize-inbox-dropzone min-h-[22rem] p-1 transition-colors duration-150 ${showDropHighlight ? 'ring-2 ring-primary/30 rounded-xl bg-bg-elevated/60' : ''}`}
        >
          <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
            <div className="organize-cards-stack">
              {bullets.length === 0 ? (
                <div className="organize-empty-state flex min-h-[12rem] flex-col items-center justify-center rounded-xl px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-text">Inbox is clear</p>
                  <p className="mt-1 max-w-[16rem] text-xs leading-relaxed text-text-muted">
                    Type a thought in the field above — you can send it to a project whenever you like.
                  </p>
                </div>
              ) : (
                bullets.map((bullet) => (
                  <OrganizableBullet
                    key={bullet.id}
                    bullet={bullet}
                    existingProjects={existingProjects}
                    onUpdate={(updates) => onUpdateBullet(bullet.id, updates)}
                    onDelete={() => onDeleteBullet(bullet.id)}
                    interactionMode="drag-only"
                    selectable={true}
                    selected={selectedIds.includes(bullet.id)}
                    onToggleSelect={() => onToggleSelected(bullet.id)}
                    showLaneActions={showLaneActions}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </div>
      </motion.div>

      {/* Mobile bottom sheet */}
      {!mobileExpandedInline ? (
      <AnimatePresence>
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
          animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
          transition={prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', damping: 25, stiffness: 300 }}
          className="organize-inbox-sheet lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-hidden rounded-t-[1.5rem] border-t border-border-subtle bg-bg-surface shadow-xl"
        >
          {/* Handle bar */}
          <div className="flex justify-center py-2">
            <div className="h-1 w-10 rounded-full bg-border-subtle" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 pb-3">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-text">Inbox</p>
              <span className="rounded-full bg-bg-elevated px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-text-muted">
                {bullets.length}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-full border border-border-subtle/70 p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
              aria-label="Close inbox"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick-add on mobile */}
          {onQuickAdd && onQuickAddChange && (
            <div className="px-4 pb-3">
              <input
                type="text"
                value={quickAddText ?? ''}
                onChange={(e) => onQuickAddChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && quickAddText?.trim()) {
                    onQuickAdd(quickAddText);
                  }
                }}
                placeholder="What's on your mind?"
                className="organize-quick-add-input w-full"
              />
            </div>
          )}

          {/* Scrollable content */}
          <div className="overflow-auto px-4 pb-8" style={{ maxHeight: 'calc(75vh - 120px)' }}>
            <div className="organize-cards-stack">
              {bullets.length === 0 ? (
                <div className="organize-empty-state mx-1 flex flex-col items-center justify-center rounded-xl px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-text">Nothing in Inbox</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">Capture above, then open Projects to place it on the board.</p>
                </div>
              ) : (
                bullets.map((bullet) => (
                  <OrganizableBullet
                    key={bullet.id}
                    bullet={bullet}
                    existingProjects={existingProjects}
                    onUpdate={(updates) => onUpdateBullet(bullet.id, updates)}
                    onDelete={() => onDeleteBullet(bullet.id)}
                    interactionMode="drag-only"
                    selectable={true}
                    selected={selectedIds.includes(bullet.id)}
                    onToggleSelect={() => onToggleSelected(bullet.id)}
                    showLaneActions={showLaneActions}
                  />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      ) : null}
    </>
  );
}

export interface ThoughtOrganizeModeActions {
  openCreateProject: () => void;
}

function SortableProjectColumn({
  projectId,
  color,
  totalCount,
  label,
  isMenuOpen,
  onToggleMenu,
  menu,
  children,
}: {
  projectId: string;
  color: ProjectColor;
  totalCount: number;
  label: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  menu: ReactNode;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: projectColumnId(projectId),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    // Only apply dnd-kit transition when NOT dragging to avoid conflicts
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`organize-project-column w-full min-w-0 px-3 pt-1 pb-4 lg:border-r lg:border-border-subtle/20 ${
        !isDragging ? 'animate-fade-in' : ''
      }`}
      data-project-color={color}
      data-project-dragging={isDragging ? 'true' : 'false'}
    >
      <div className="organize-project-column-header relative mb-2.5 flex items-center justify-between gap-3 border-b border-border-subtle/25 pb-2.5">
        <div className="min-w-0 flex-1">
          <span className={`moment-tag-pill moment-tag-pill-selected-${color}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-medium text-text-muted/60 tabular-nums">
            {totalCount}
          </span>
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted/55 transition-colors hover:bg-bg-elevated hover:text-text cursor-grab active:cursor-grabbing touch-none"
            aria-label={`Drag to reorder ${label}`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggleMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted/50 transition-colors hover:bg-bg-elevated hover:text-text"
            aria-label={`Project actions for ${label}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {isMenuOpen ? menu : null}
      </div>

      <div className="organize-project-column-body space-y-2.5">
        {children}
      </div>
    </div>
  );
}

export const ThoughtOrganizeMode = forwardRef<ThoughtOrganizeModeActions, ThoughtOrganizeModeProps>(({
  dateKey,
  markdown,
  organization,
  onUpdateOrganization,
  onClose,
  isInline = false,
  standalone = false,
  hideHeader = false,
  showDone: showDoneProp,
  onAddProject,
}, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeBullet, setActiveBullet] = useState<ThoughtBullet | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'project' | 'bullet' | null>(null);
  const [dragOverlayWidth, setDragOverlayWidth] = useState<number | null>(null);
  const [dragPointerOffset, setDragPointerOffset] = useState<{ x: number; y: number } | null>(null);
  const [isKeyboardDragging, setIsKeyboardDragging] = useState(false);

  // Configure drag sensors with activation constraints to prevent accidental drags
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Require 8px movement before drag starts
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 10,
    },
  });
  const sensors = useSensors(pointerSensor, touchSensor);
  const [showDoneInternal, setShowDoneInternal] = useState(false);
  const showDoneLanes = showDoneProp !== undefined ? showDoneProp : showDoneInternal;
  const setShowDoneLanes = (val: boolean | ((p: boolean) => boolean)) => {
    if (typeof val === 'function') {
      setShowDoneInternal((p) => val(p));
    } else {
      setShowDoneInternal(val);
    }
  };

  const [localOrg, setLocalOrg] = useState<ThoughtOrganization>(() =>
    standalone && organization
      ? organization
      : reconcileBullets(markdown ?? '', organization)
  );
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [mergeProjectId, setMergeProjectId] = useState<string | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState<ProjectColor>('lavender');
  const [inboxCollapsed, setInboxCollapsed] = useState(true);
  const isBelowLg = useIsBelowLg();
  const [mobileSurfaceTab, setMobileSurfaceTab] = useState<OrganizeMobileSurfaceTab>(ORGANIZE_DEFAULT_MOBILE_TAB);
  const [prefsHydrated, setPrefsHydrated] = useState(false);

  const [collapsedDoneProjects, setCollapsedDoneProjects] = useState<Record<string, boolean>>({});
  /** On narrow viewports, Later starts collapsed until the user opens it per project */
  const [laterLaneExpanded, setLaterLaneExpanded] = useState<Record<string, boolean>>({});
  const [bottomWorkspaceCollapsed, setBottomWorkspaceCollapsed] = useState(true);
  const [selectedInboxIds, setSelectedInboxIds] = useState<string[]>([]);
  const [projectMenuId, setProjectMenuId] = useState<string | null>(null);
  const [undoState, setUndoState] = useState<{ organization: ThoughtOrganization; message: string } | null>(null);
  const [undoCountdown, setUndoCountdown] = useState<number>(0);
  const [nowSpotlightExpanded, setNowSpotlightExpanded] = useState(false);
  const [quickAddText, setQuickAddText] = useState('');
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const narrow = typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;
    const prefs = readOrganizePrefs();
    if (prefs.lowerWorkspaceOpen !== undefined) {
      setBottomWorkspaceCollapsed(!prefs.lowerWorkspaceOpen);
    } else if (narrow) {
      setBottomWorkspaceCollapsed(false);
    }
    if (prefs.inboxOpen !== undefined) {
      setInboxCollapsed(!prefs.inboxOpen);
    }
    if (prefs.mobileSurfaceTab) {
      setMobileSurfaceTab(prefs.mobileSurfaceTab);
    }
    setPrefsHydrated(true);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !prefsHydrated) return;
    writeOrganizePrefs({ lowerWorkspaceOpen: !bottomWorkspaceCollapsed });
  }, [bottomWorkspaceCollapsed, mounted, prefsHydrated]);

  useEffect(() => {
    if (!mounted || !prefsHydrated) return;
    writeOrganizePrefs({ inboxOpen: !inboxCollapsed });
  }, [inboxCollapsed, mounted, prefsHydrated]);

  useEffect(() => {
    if (!mounted || !prefsHydrated || !isBelowLg) return;
    writeOrganizePrefs({ mobileSurfaceTab: mobileSurfaceTab });
  }, [mobileSurfaceTab, isBelowLg, mounted, prefsHydrated]);

  const collisionDetection = (args: Parameters<typeof closestCenter>[0]) => {
    if (activeProjectId) {
      // When dragging a project, only allow dropping on other project columns
      const projectContainers = args.droppableContainers.filter(
        (container) => typeof container.id === 'string' && container.id.startsWith('project:')
      );
      return closestCenter({
        ...args,
        droppableContainers: projectContainers,
      });
    }

    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      const spotlightCollisions = pointerCollisions.filter(
        ({ id }) => typeof id === 'string' && id.startsWith('spotlight:now:at:')
      );
      if (spotlightCollisions.length > 0) {
        return spotlightCollisions;
      }
      return pointerCollisions;
    }

    const intersecting = rectIntersection(args);
    if (intersecting.length > 0) {
      return intersecting;
    }

    return closestCenter(args);
  };

  useEffect(() => {
    if (standalone) {
      if (organization) {
        setLocalOrg(organization);
      }
    } else {
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

  const hasLowerWorkspace = (inbox?.bullets.length ?? 0) > 0 || projectColumns.length > 0;

  useEffect(() => {
    const inboxIds = new Set((inbox?.bullets ?? []).map((bullet) => bullet.id));
    setSelectedInboxIds((current) => current.filter((id) => inboxIds.has(id)));
  }, [inbox]);

  useEffect(() => {
    if (focusedProjectId && !localOrg.projects.some((project) => project.id === focusedProjectId)) {
      setFocusedProjectId(null);
    }
  }, [focusedProjectId, localOrg.projects]);

  const updateProjectsFromBullets = (bullets: ThoughtBullet[], existingProjects: ProjectMeta[]) => {
    const deduped = deduplicateProjects(bullets);
    const preservedEmptyProjects = existingProjects.filter(
      (project) => !deduped.some((item) => item.id === project.id)
    );

    return [...deduped, ...preservedEmptyProjects];
  };

  const dragOverlayModifiers = useMemo<Modifier[]>(() => {
    if (!dragPointerOffset || isKeyboardDragging || activeProjectId) {
      return [];
    }

    return [
      ({ transform }) => ({
        ...transform,
        x: transform.x - dragPointerOffset.x,
        y: transform.y - dragPointerOffset.y,
      }),
    ];
  }, [activeProjectId, dragPointerOffset, isKeyboardDragging]);

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

  const openCreateProject = () => {
    setEditingProjectId(null);
    setNewProjectName('');
    setNewProjectColor('lavender');
    setShowProjectModal(true);
    setProjectMenuId(null);
  };

  useImperativeHandle(ref, () => ({
    openCreateProject,
  }));

  const openEditProject = (project: ProjectMeta) => {
    setEditingProjectId(project.id);
    setNewProjectName(project.label);
    setNewProjectColor(project.color);
    setShowProjectModal(true);
    setProjectMenuId(null);
  };

  const handleSubmitProject = () => {
    const label = newProjectName.trim();
    if (!label) return;
    if (!editingProjectId) {
      handleCreateProject(label, newProjectColor);
    } else {
      setLocalOrg((prev) => {
        const projects = prev.projects.map((project) =>
          project.id === editingProjectId ? { ...project, label: label.slice(0, 50), color: newProjectColor } : project
        );
        const updatedMeta = projects.find((project) => project.id === editingProjectId);
        const bullets = prev.bullets.map((bullet) =>
          bullet.project === editingProjectId && updatedMeta
            ? { ...bullet, projectMeta: updatedMeta }
            : bullet
        );

        return { ...prev, bullets, projects };
      });
    }
    setNewProjectName('');
    setNewProjectColor('lavender');
    setEditingProjectId(null);
    setShowProjectModal(false);
  };

  const pushUndoState = (organization: ThoughtOrganization, message: string) => {
    const bento = organization.bento;
    setUndoState({
      organization: {
        bullets: organization.bullets.map((bullet) => ({ ...bullet })),
        projects: organization.projects.map((project) => ({ ...project })),
        ...(bento
          ? {
              bento: {
                ...(bento.projectOrder && { projectOrder: [...bento.projectOrder] }),
                ...(bento.projectSizes && { projectSizes: { ...bento.projectSizes } }),
              },
            }
          : {}),
      },
      message,
    });
    setUndoCountdown(10);
  };

  // Undo countdown timer (10 seconds)
  useEffect(() => {
    if (!undoState || undoCountdown <= 0) return;

    const timer = setInterval(() => {
      setUndoCountdown((prev) => {
        if (prev <= 1) {
          setUndoState(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [undoState, undoCountdown]);

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const projectId = parseProjectColumnId(activeId);
    const initialRect = event.active.rect.current.initial;
    const activatorEvent = event.activatorEvent;
    const touchEvent =
      activatorEvent && 'touches' in activatorEvent
        ? (activatorEvent as TouchEvent)
        : null;
    const pointerX =
      activatorEvent && 'clientX' in activatorEvent
        ? activatorEvent.clientX
        : touchEvent
          ? touchEvent.touches[0]?.clientX
          : undefined;
    const pointerY =
      activatorEvent && 'clientY' in activatorEvent
        ? activatorEvent.clientY
        : touchEvent
          ? touchEvent.touches[0]?.clientY
          : undefined;

    if (projectId) {
      setActiveProjectId(projectId);
      setActiveBullet(null);
      setDragType('project');
      setDragOverlayWidth(initialRect?.width ?? null);
      setDragPointerOffset(null);
      setIsKeyboardDragging(pointerX === undefined || pointerY === undefined);
      return;
    }

    const bullet = localOrg.bullets.find((item) => item.id === activeId);

    setDragType('bullet');
    setDragOverlayWidth(initialRect?.width ?? null);
    setDragPointerOffset(
      initialRect && typeof pointerX === 'number' && typeof pointerY === 'number'
        ? {
            x: pointerX - initialRect.left,
            y: pointerY - initialRect.top,
          }
        : null
    );
    setIsKeyboardDragging(pointerX === undefined || pointerY === undefined);
    setActiveBullet(bullet || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveBullet(null);
    setActiveProjectId(null);
    setDragType(null);
    setDragOverlayWidth(null);
    setDragPointerOffset(null);
    setIsKeyboardDragging(false);

    const { active, over } = event;
    if (!over) return;

    const activeProject = parseProjectColumnId(String(active.id));
    const overProject = parseProjectColumnId(String(over.id));

    if (activeProject && overProject && activeProject !== overProject) {
      setLocalOrg((prev) => {
        const activeIndex = prev.projects.findIndex((project) => project.id === activeProject);
        const overIndex = prev.projects.findIndex((project) => project.id === overProject);

        if (activeIndex === -1 || overIndex === -1) {
          return prev;
        }

        return {
          ...prev,
          projects: arrayMove(prev.projects, activeIndex, overIndex),
        };
      });
      return;
    }

    if (activeProject) {
      return;
    }

    setLocalOrg((prev) => {
      const activeId = String(active.id);
      const overId = String(over.id);
      const activeBullet = prev.bullets.find((bullet) => bullet.id === activeId);
      if (!activeBullet) return prev;
      const spotlightInsertIndex = parseSpotlightNowInsertIndex(overId);

      if (spotlightInsertIndex !== null) {
        const nextBullets = insertIntoGlobalNowQueueAt(prev.bullets, activeId, spotlightInsertIndex, prev.projects);
        if (!nextBullets) return prev;
        return {
          ...prev,
          bullets: nextBullets,
          projects: updateProjectsFromBullets(nextBullets, prev.projects),
        };
      }

      const overBullet = prev.bullets.find((bullet) => bullet.id === overId);
      const sourceContainerId = getBulletContainerId(activeBullet);
      const derivedTargetInfo = overBullet ? parseDropId(getBulletContainerId(overBullet)) : parseDropId(overId);
      const targetInfo =
        overBullet &&
        overBullet.lane === 'now' &&
        activeBullet.project &&
        activeBullet.project !== overBullet.project
          ? {
              isInbox: false,
              projectId: activeBullet.project,
              lane: 'now' as ThoughtLane,
            }
          : derivedTargetInfo;

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
        ...prev,
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
        ...prev,
        bullets,
        projects: updateProjectsFromBullets(bullets, prev.projects),
      };
    });
  };

  const handleDeleteBullet = (bulletId: string) => {
    setLocalOrg((prev) => {
      pushUndoState(prev, 'Bullet deleted');
      const bullets = prev.bullets.filter((bullet) => bullet.id !== bulletId);

      return {
        ...prev,
        bullets,
        projects: updateProjectsFromBullets(bullets, prev.projects),
      };
    });
  };

  const handleBatchUpdateInbox = (updates: Partial<ThoughtBullet>) => {
    if (selectedInboxIds.length === 0) return;

    setLocalOrg((prev) => {
      const bullets = prev.bullets.map((bullet) =>
        selectedInboxIds.includes(bullet.id) ? normalizeBulletUpdate(bullet, updates, prev.projects) : bullet
      );

      return {
        ...prev,
        bullets,
        projects: updateProjectsFromBullets(bullets, prev.projects),
      };
    });

    setSelectedInboxIds([]);
  };

  const handleBatchDeleteInbox = () => {
    if (selectedInboxIds.length === 0) return;

    setLocalOrg((prev) => {
      pushUndoState(prev, `${selectedInboxIds.length} bullets deleted`);
      const bullets = prev.bullets.filter((bullet) => !selectedInboxIds.includes(bullet.id));

      return {
        ...prev,
        bullets,
        projects: updateProjectsFromBullets(bullets, prev.projects),
      };
    });

    setSelectedInboxIds([]);
  };

  const handleDeleteProject = (projectId: string) => {
    setLocalOrg((prev) => {
      pushUndoState(prev, 'Project removed and bullets returned to Inbox');

      const bullets = prev.bullets.map((bullet) =>
        bullet.project === projectId
          ? {
              ...bullet,
              project: undefined,
              projectMeta: undefined,
              lane: undefined,
              priority: undefined,
            }
          : bullet
      );

      return {
        ...prev,
        bullets,
        projects: prev.projects.filter((project) => project.id !== projectId),
      };
    });

    setProjectMenuId(null);
  };

  const handleStartMergeProject = (projectId: string) => {
    const fallbackTarget = localOrg.projects.find((project) => project.id !== projectId)?.id ?? '';
    setMergeProjectId(projectId);
    setMergeTargetId(fallbackTarget);
    setProjectMenuId(null);
  };

  const handleConfirmMergeProject = () => {
    if (!mergeProjectId || !mergeTargetId || mergeProjectId === mergeTargetId) return;

    setLocalOrg((prev) => {
      const targetProject = prev.projects.find((project) => project.id === mergeTargetId);
      if (!targetProject) return prev;

      pushUndoState(prev, 'Projects merged');

      const bullets = prev.bullets.map((bullet) =>
        bullet.project === mergeProjectId
          ? {
              ...bullet,
              project: targetProject.id,
              projectMeta: targetProject,
              lane: bullet.lane ?? 'next',
              priority: laneToPriority(bullet.lane ?? 'next'),
            }
          : bullet
      );

      return {
        ...prev,
        bullets,
        projects: prev.projects.filter((project) => project.id !== mergeProjectId),
      };
    });

    setMergeProjectId(null);
    setMergeTargetId('');
  };

  const handleUndoDelete = () => {
    if (!undoState) return;
    setLocalOrg(undoState.organization);
    setUndoState(null);
    setUndoCountdown(0);
  };

  // Quick-add to inbox
  const handleQuickAdd = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newBullet: ThoughtBullet = {
      id: nanoid(),
      text: trimmed,
      lineNumber: 0,
      displayOrder: (inbox?.bullets.length ?? 0),
    };

    setLocalOrg((prev) => ({
      ...prev,
      bullets: [...prev.bullets, newBullet],
    }));

    setQuickAddText('');
  };

  const visibleProjectColumns = focusedProjectId
    ? projectColumns.filter((column) => column.projectId === focusedProjectId)
    : projectColumns;
  const hiddenProjectCount = projectColumns.length - visibleProjectColumns.length;

  const handleReorderGlobalNow = useCallback((bulletId: string, delta: -1 | 1) => {
    setLocalOrg((prev) => {
      const next = moveGlobalNowBulletByDelta(prev.bullets, bulletId, delta);
      if (!next) return prev;
      return {
        ...prev,
        bullets: next,
        projects: updateProjectsFromBullets(next, prev.projects),
      };
    });
  }, []);

  const toggleLaterLane = useCallback((projectId: string) => {
    setLaterLaneExpanded((current) => ({
      ...current,
      [projectId]: !current[projectId],
    }));
  }, []);

  const suppressProjectNowLane = isBelowLg && mobileSurfaceTab === 'now';
  const showLaneQuickActionsProjects = isBelowLg && mobileSurfaceTab === 'projects';

  const contentBody = (
    <div className="flex h-full flex-col overflow-hidden">
      {!hideHeader && (
        <div className="flex flex-wrap items-center justify-end gap-3 px-4 py-3 sm:py-4 sm:px-6">
  
          <button
            type="button"
            onClick={onAddProject || openCreateProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text touch-manipulation"
          >
            <Plus className="h-4 w-4" />
            <span>New project</span>
          </button>
  
          <button
            type="button"
            onClick={() => setShowDoneLanes((value) => !value)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text"
          >
            {showDoneLanes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showDoneLanes ? 'Hide done' : 'Show done'}
          </button>
        </div>
      )}

      {undoState ? (
        <div className="border-b border-border-subtle/50 bg-bg-elevated/45 px-4 py-2.5 sm:px-6">
          <div className="organize-undo-bar">
            <div className="organize-undo-bar-inner flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="organize-undo-countdown shrink-0">
                  <svg className="organize-undo-countdown-ring" viewBox="0 0 24 24">
                    <circle className="organize-undo-countdown-bg" cx="12" cy="12" r="10" />
                    <circle
                      className="organize-undo-countdown-progress"
                      cx="12"
                      cy="12"
                      r="10"
                      strokeDasharray={62.83}
                      strokeDashoffset={62.83 * (1 - undoCountdown / 10)}
                    />
                  </svg>
                  <span>{undoCountdown}s</span>
                </div>
                <p className="organize-undo-message min-w-0 text-sm font-medium leading-snug text-text-secondary">
                  {undoState.message}
                </p>
              </div>
              <button
                type="button"
                onClick={handleUndoDelete}
                className="organize-undo-action inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-subtle/70 bg-bg-elevated px-4 py-2 text-xs font-semibold text-text transition-colors hover:bg-bg-surface"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Undo
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.18 }}
              className="w-full max-w-md rounded-[1.75rem] border border-border-subtle/70 bg-bg-elevated/95 p-5 shadow-2xl backdrop-blur-xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="thought-project-modal-title"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 id="thought-project-modal-title" className="text-lg font-semibold text-text">
                    {editingProjectId ? 'Update project' : 'Add a project column'}
                  </h3>
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
                    {editingProjectId ? 'Save changes' : 'Add project'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mergeProjectId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 p-4 backdrop-blur-[1px]"
            onClick={() => setMergeProjectId(null)}
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.15 }}
              className="w-full max-w-md rounded-2xl border border-border-subtle/70 bg-bg-surface/95 p-5 shadow-2xl backdrop-blur-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-text">Merge Project</h3>
              <p className="mt-1 text-xs text-text-muted">Move all bullets into another project.</p>

              <select
                value={mergeTargetId}
                onChange={(event) => setMergeTargetId(event.target.value)}
                className="mt-4 w-full rounded-xl border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
              >
                <option value="">Choose target project</option>
                {localOrg.projects
                  .filter((project) => project.id !== mergeProjectId)
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.label}
                    </option>
                  ))}
              </select>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMergeProjectId(null)}
                  className="rounded-full border border-border-subtle/70 px-4 py-2 text-sm font-medium text-text-muted hover:bg-bg-surface hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!mergeTargetId}
                  onClick={handleConfirmMergeProject}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Merge project
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className="organize-board flex-1 overflow-auto px-0 sm:px-4 py-2 sm:py-4 md:px-6 md:py-5"
        data-dragging={(activeBullet || activeProjectId) ? 'true' : 'false'}
        data-dnd-dragging={(activeBullet || activeProjectId) ? 'true' : 'false'}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="organize-workspace">
            {localOrg.bullets.length === 0 && localOrg.projects.length === 0 ? (
              <div className="organize-empty-state flex min-h-64 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-border-subtle px-6 py-10 text-center">
                <p className="text-base font-semibold text-text">Nothing here yet</p>
                <p className="mt-1 max-w-sm text-sm text-text-muted">Add a project column, then drop tasks from Inbox onto the board.</p>
                <button
                  type="button"
                  onClick={onAddProject || openCreateProject}
                  className="mt-5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95 touch-manipulation"
                >
                  New project
                </button>
              </div>
            ) : (
              <>
                {/* NOW Spotlight */}
                {localOrg.projects.length > 0 && (
                  <div
                    className={
                      hasLowerWorkspace && isBelowLg && mobileSurfaceTab !== 'now'
                        ? 'hidden lg:block'
                        : ''
                    }
                  >
                    <NowSpotlight
                      bullets={localOrg.bullets}
                      projects={localOrg.projects}
                      onUpdateBullet={handleUpdateBullet}
                      onDeleteBullet={handleDeleteBullet}
                      showExpanded={nowSpotlightExpanded}
                      onToggleExpanded={() => setNowSpotlightExpanded((v) => !v)}
                      focusedProjectId={focusedProjectId}
                      dragType={dragType}
                      compactCap={isBelowLg ? SPOTLIGHT_COMPACT_CAP_MOBILE : SPOTLIGHT_COMPACT_CAP_DESKTOP}
                      showLaneActions={isBelowLg}
                      onReorderGlobalNow={handleReorderGlobalNow}
                      onGoToProjectsTab={isBelowLg ? () => setMobileSurfaceTab('projects') : undefined}
                    />
                  </div>
                )}

                {hasLowerWorkspace && isBelowLg ? (
                  <div className="organize-mobile-surface lg:hidden">
                    <div className="organize-mobile-tabs" role="tablist" aria-label="Organize sections">
                      {(['now', 'projects', 'inbox'] as OrganizeMobileSurfaceTab[]).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          role="tab"
                          aria-selected={mobileSurfaceTab === tab}
                          onClick={() => setMobileSurfaceTab(tab)}
                          className={`organize-mobile-tab touch-manipulation ${
                            mobileSurfaceTab === tab ? 'organize-mobile-tab-active' : ''
                          }`}
                        >
                          {tab === 'now' ? 'Now' : tab === 'projects' ? 'Projects' : 'Inbox'}
                        </button>
                      ))}
                    </div>
                    <p className="organize-mobile-tab-legend mt-2 px-1 text-center text-[11px] leading-snug text-text-muted">
                      Now = your active set · Projects = board · Inbox = quick capture
                    </p>
                    {mobileSurfaceTab === 'projects' ? (
                      <div className="mt-3 space-y-3">
                        {projectColumns.length > 0 ? (
                          <div className="organize-project-focus-bar">
                            <button
                              type="button"
                              onClick={() => setFocusedProjectId(null)}
                              className={`organize-project-focus-chip ${focusedProjectId === null ? 'organize-project-focus-chip-active' : ''}`}
                            >
                              All projects
                            </button>
                            {localOrg.projects.map((project) => (
                              <button
                                key={project.id}
                                type="button"
                                onClick={() => setFocusedProjectId(project.id)}
                                className={`organize-project-focus-chip organize-project-focus-chip-${project.color} ${
                                  focusedProjectId === project.id ? 'organize-project-focus-chip-active' : ''
                                }`}
                              >
                                {project.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                        {focusedProjectId && hiddenProjectCount > 0 ? (
                          <div className="organize-project-focus-note">
                            Showing 1 project. {hiddenProjectCount} other {hiddenProjectCount === 1 ? 'project is' : 'projects are'} hidden until you switch back to All projects.
                          </div>
                        ) : null}
                        <SortableContext
                          items={visibleProjectColumns.map((column) => projectColumnId(column.projectId))}
                          strategy={rectSortingStrategy}
                        >
                          <div className="organize-columns min-h-full gap-4 pb-2">
                            {visibleProjectColumns.map((column) => (
                              <SortableProjectColumn
                                key={column.projectId}
                                projectId={column.projectId}
                                color={column.projectMeta?.color ?? 'lavender'}
                                totalCount={QUEUED_LANES.reduce((sum, lane) => sum + column.lanes[lane].length, 0) + column.lanes.done.length}
                                label={column.projectMeta?.label || 'Project'}
                                isMenuOpen={projectMenuId === column.projectId}
                                onToggleMenu={() => setProjectMenuId((current) => (current === column.projectId ? null : column.projectId))}
                                menu={
                                  <div className="absolute right-0 top-11 z-20 w-52 rounded-[1rem] border border-border-subtle/70 bg-bg-elevated/95 p-2 shadow-2xl backdrop-blur-xl">
                                    <button
                                      type="button"
                                      onClick={() => column.projectMeta && openEditProject(column.projectMeta)}
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface"
                                    >
                                      Rename or recolor
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStartMergeProject(column.projectId)}
                                      disabled={localOrg.projects.length < 2}
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      Merge into…
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCollapsedDoneProjects((current) => ({
                                          ...current,
                                          [column.projectId]: !(current[column.projectId] ?? true),
                                        }))
                                      }
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface"
                                    >
                                      {(collapsedDoneProjects[column.projectId] ?? true) ? 'Expand done lane' : 'Collapse done lane'}
                                    </button>
                                    {isBelowLg ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          toggleLaterLane(column.projectId);
                                          setProjectMenuId(null);
                                        }}
                                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface"
                                      >
                                        {laterLaneExpanded[column.projectId] ? 'Collapse Later lane' : 'Expand Later lane'}
                                      </button>
                                    ) : null}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProject(column.projectId)}
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-error/8"
                                    >
                                      Remove project
                                    </button>
                                  </div>
                                }
                              >
                                {!suppressProjectNowLane ? <ProjectNowSummary bullets={column.lanes.now} /> : null}
                                {QUEUED_LANES.map((lane) => (
                                  <DroppableLane
                                    key={lane}
                                    id={laneDropId(column.projectId, lane)}
                                    lane={lane}
                                    bullets={column.lanes[lane]}
                                    existingProjects={localOrg.projects}
                                    onUpdateBullet={handleUpdateBullet}
                                    onDeleteBullet={handleDeleteBullet}
                                    dragType={dragType}
                                    showLaneActions={showLaneQuickActionsProjects}
                                    {...(lane === 'later'
                                      ? {
                                          collapsed: isBelowLg && !laterLaneExpanded[column.projectId],
                                          onToggleCollapsed: () => toggleLaterLane(column.projectId),
                                          laterShowHideControl:
                                            isBelowLg && Boolean(laterLaneExpanded[column.projectId]),
                                        }
                                      : {})}
                                  />
                                ))}
                                {showDoneLanes ? (
                                  <DroppableLane
                                    id={laneDropId(column.projectId, 'done')}
                                    lane="done"
                                    bullets={column.lanes.done}
                                    existingProjects={localOrg.projects}
                                    onUpdateBullet={handleUpdateBullet}
                                    onDeleteBullet={handleDeleteBullet}
                                    collapsed={collapsedDoneProjects[column.projectId] ?? true}
                                    onToggleCollapsed={() =>
                                      setCollapsedDoneProjects((current) => ({
                                        ...current,
                                        [column.projectId]: !(current[column.projectId] ?? true),
                                      }))
                                    }
                                    dragType={dragType}
                                    showLaneActions={showLaneQuickActionsProjects}
                                  />
                                ) : null}
                              </SortableProjectColumn>
                            ))}
                          </div>
                        </SortableContext>
                      </div>
                    ) : null}
                    {mobileSurfaceTab === 'inbox' ? (
                      <div className="mt-3">
                        <DroppableInbox
                          bullets={inbox?.bullets || []}
                          existingProjects={localOrg.projects}
                          onUpdateBullet={handleUpdateBullet}
                          onDeleteBullet={handleDeleteBullet}
                          selectedIds={selectedInboxIds}
                          onToggleSelected={(bulletId) =>
                            setSelectedInboxIds((current) =>
                              current.includes(bulletId) ? current.filter((id) => id !== bulletId) : [...current, bulletId]
                            )
                          }
                          onClearSelection={() => setSelectedInboxIds([])}
                          onBatchUpdate={handleBatchUpdateInbox}
                          onBatchDelete={handleBatchDeleteInbox}
                          collapsed={false}
                          onToggle={() => setInboxCollapsed((value) => !value)}
                          quickAddText={quickAddText}
                          onQuickAddChange={setQuickAddText}
                          onQuickAdd={handleQuickAdd}
                          prefersReducedMotion={prefersReducedMotion}
                          dragType={dragType}
                          mobileExpandedInline
                          showLaneActions={isBelowLg}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {hasLowerWorkspace && !isBelowLg ? (
                  <div className="organize-lower-workspace-shell hidden lg:block">
                    <button
                      type="button"
                      onClick={() => setBottomWorkspaceCollapsed((value) => !value)}
                      className="organize-lower-workspace-toggle"
                      aria-expanded={!bottomWorkspaceCollapsed}
                    >
                      <span className="organize-lower-workspace-toggle-copy">
                        <span className="organize-lower-workspace-toggle-label">
                          {bottomWorkspaceCollapsed ? 'Open inbox and projects' : 'Hide inbox and projects'}
                        </span>
                        <span className="organize-lower-workspace-toggle-meta">
                          {focusedProjectId
                            ? `${visibleProjectColumns[0]?.projectMeta?.label ?? '1 project'} in focus, ${(inbox?.bullets.length ?? 0)} inbox`
                            : `${projectColumns.length} projects, ${(inbox?.bullets.length ?? 0)} inbox`}
                        </span>
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${bottomWorkspaceCollapsed ? '' : 'rotate-180'}`} />
                    </button>

                    {!bottomWorkspaceCollapsed ? (
                      <div className="space-y-3">
                        {projectColumns.length > 0 ? (
                          <div className="organize-project-focus-bar">
                            <button
                              type="button"
                              onClick={() => setFocusedProjectId(null)}
                              className={`organize-project-focus-chip ${focusedProjectId === null ? 'organize-project-focus-chip-active' : ''}`}
                            >
                              All projects
                            </button>
                            {localOrg.projects.map((project) => (
                              <button
                                key={project.id}
                                type="button"
                                onClick={() => setFocusedProjectId(project.id)}
                                className={`organize-project-focus-chip organize-project-focus-chip-${project.color} ${
                                  focusedProjectId === project.id ? 'organize-project-focus-chip-active' : ''
                                }`}
                              >
                                {project.label}
                              </button>
                            ))}
                          </div>
                        ) : null}

                        {focusedProjectId && hiddenProjectCount > 0 ? (
                          <div className="organize-project-focus-note">
                            Showing 1 project. {hiddenProjectCount} other {hiddenProjectCount === 1 ? 'project is' : 'projects are'} hidden until you switch back to All projects.
                          </div>
                        ) : null}

                        <SortableContext
                          items={visibleProjectColumns.map((column) => projectColumnId(column.projectId))}
                          strategy={rectSortingStrategy}
                        >
                          <div className="organize-columns min-h-full gap-4 pb-2">
                            <DroppableInbox
                              bullets={inbox?.bullets || []}
                              existingProjects={localOrg.projects}
                              onUpdateBullet={handleUpdateBullet}
                              onDeleteBullet={handleDeleteBullet}
                              selectedIds={selectedInboxIds}
                              onToggleSelected={(bulletId) =>
                                setSelectedInboxIds((current) =>
                                  current.includes(bulletId) ? current.filter((id) => id !== bulletId) : [...current, bulletId]
                                )
                              }
                              onClearSelection={() => setSelectedInboxIds([])}
                              onBatchUpdate={handleBatchUpdateInbox}
                              onBatchDelete={handleBatchDeleteInbox}
                              collapsed={inboxCollapsed}
                              onToggle={() => setInboxCollapsed((value) => !value)}
                              quickAddText={quickAddText}
                              onQuickAddChange={setQuickAddText}
                              onQuickAdd={handleQuickAdd}
                              prefersReducedMotion={prefersReducedMotion}
                              dragType={dragType}
                            />

                            {visibleProjectColumns.map((column) => (
                              <SortableProjectColumn
                                key={column.projectId}
                                projectId={column.projectId}
                                color={column.projectMeta?.color ?? 'lavender'}
                                totalCount={QUEUED_LANES.reduce((sum, lane) => sum + column.lanes[lane].length, 0) + column.lanes.done.length}
                                label={column.projectMeta?.label || 'Project'}
                                isMenuOpen={projectMenuId === column.projectId}
                                onToggleMenu={() => setProjectMenuId((current) => (current === column.projectId ? null : column.projectId))}
                                menu={
                                  <div className="absolute right-0 top-11 z-20 w-52 rounded-[1rem] border border-border-subtle/70 bg-bg-elevated/95 p-2 shadow-2xl backdrop-blur-xl">
                                    <button
                                      type="button"
                                      onClick={() => column.projectMeta && openEditProject(column.projectMeta)}
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface"
                                    >
                                      Rename or recolor
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStartMergeProject(column.projectId)}
                                      disabled={localOrg.projects.length < 2}
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      Merge into…
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCollapsedDoneProjects((current) => ({
                                          ...current,
                                          [column.projectId]: !(current[column.projectId] ?? true),
                                        }))
                                      }
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface"
                                    >
                                      {(collapsedDoneProjects[column.projectId] ?? true) ? 'Expand done lane' : 'Collapse done lane'}
                                    </button>
                                    {isBelowLg ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          toggleLaterLane(column.projectId);
                                          setProjectMenuId(null);
                                        }}
                                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-bg-surface"
                                      >
                                        {laterLaneExpanded[column.projectId] ? 'Collapse Later lane' : 'Expand Later lane'}
                                      </button>
                                    ) : null}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProject(column.projectId)}
                                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-error/8"
                                    >
                                      Remove project
                                    </button>
                                  </div>
                                }
                              >
                                <ProjectNowSummary bullets={column.lanes.now} />

                                {QUEUED_LANES.map((lane) => (
                                  <DroppableLane
                                    key={lane}
                                    id={laneDropId(column.projectId, lane)}
                                    lane={lane}
                                    bullets={column.lanes[lane]}
                                    existingProjects={localOrg.projects}
                                    onUpdateBullet={handleUpdateBullet}
                                    onDeleteBullet={handleDeleteBullet}
                                    dragType={dragType}
                                    {...(lane === 'later'
                                      ? {
                                          collapsed: isBelowLg && !laterLaneExpanded[column.projectId],
                                          onToggleCollapsed: () => toggleLaterLane(column.projectId),
                                          laterShowHideControl:
                                            isBelowLg && Boolean(laterLaneExpanded[column.projectId]),
                                        }
                                      : {})}
                                  />
                                ))}

                                {showDoneLanes ? (
                                  <DroppableLane
                                    id={laneDropId(column.projectId, 'done')}
                                    lane="done"
                                    bullets={column.lanes.done}
                                    existingProjects={localOrg.projects}
                                    onUpdateBullet={handleUpdateBullet}
                                    onDeleteBullet={handleDeleteBullet}
                                    collapsed={collapsedDoneProjects[column.projectId] ?? true}
                                    onToggleCollapsed={() =>
                                      setCollapsedDoneProjects((current) => ({
                                        ...current,
                                        [column.projectId]: !(current[column.projectId] ?? true),
                                      }))
                                    }
                                    dragType={dragType}
                                  />
                                ) : null}
                              </SortableProjectColumn>
                            ))}
                          </div>
                        </SortableContext>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {mounted
            ? createPortal(
                <DragOverlay
                  adjustScale={false}
                  modifiers={dragOverlayModifiers}
                  dropAnimation={{
                    duration: 180,
                    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth ease-out, no overshoot
                  }}
                >
                  {activeProjectId ? (
                    <div
                      className="organize-project-overlay"
                      style={dragOverlayWidth ? { width: `${dragOverlayWidth}px`, maxWidth: `${dragOverlayWidth}px` } : undefined}
                    >
                      <div className="organize-project-overlay-pill">
                        {localOrg.projects.find((project) => project.id === activeProjectId)?.label ?? 'Project'}
                      </div>
                    </div>
                  ) : null}
                  {activeBullet ? (
                    <div
                      className="organize-drag-overlay cursor-grabbing"
                      style={dragOverlayWidth ? { width: `${dragOverlayWidth}px`, maxWidth: `${dragOverlayWidth}px` } : undefined}
                    >
                      <OrganizableBullet
                        bullet={activeBullet}
                        existingProjects={localOrg.projects}
                        onUpdate={() => undefined}
                        interactionMode="drag-only"
                        showProjectPill
                        dragOverlay
                      />
                    </div>
                  ) : null}
                </DragOverlay>,
                document.body
              )
            : null}
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
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
          transition={prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', damping: 25, stiffness: 300 }}
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
});

ThoughtOrganizeMode.displayName = 'ThoughtOrganizeMode';
