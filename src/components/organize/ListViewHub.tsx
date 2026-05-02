'use client';

import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ArrowRight, Check, ChevronDown, ChevronRight, Download, Eye, EyeOff, GripVertical, MoreHorizontal, Plus, Trash2, X } from 'lucide-react';
import { ImportFromThoughtDownload } from './ImportFromThoughtDownload';
import { OrganizeHeaderPortal } from './OrganizeHeaderSlot';
import {
  addImportMetadata,
  laneToPriority,
  type ProjectColor,
  type ProjectMeta,
  type ThoughtBullet,
  type ThoughtLane,
  type ThoughtOrganization,
} from '@/lib/thought-organization';
import { nanoid } from 'nanoid';

// ── Project colors (match globals.css --project-* for sidebar dots + card rails)
const PROJECT_PALETTE: Record<ProjectColor, { dot: string; bg: string; border: string; text: string }> = {
  peach:      { dot: 'var(--project-peach)',      bg: 'var(--project-peach-wash)',      border: 'var(--project-peach-border)',      text: 'var(--project-peach)' },
  sky:        { dot: 'var(--project-sky)',       bg: 'var(--project-sky-wash)',       border: 'var(--project-sky-border)',       text: 'var(--project-sky)' },
  mint:       { dot: 'var(--project-mint)',      bg: 'var(--project-mint-wash)',      border: 'var(--project-mint-border)',      text: 'var(--project-mint)' },
  periwinkle: { dot: 'var(--project-periwinkle)', bg: 'var(--project-periwinkle-wash)', border: 'var(--project-periwinkle-border)', text: 'var(--project-periwinkle)' },
  lavender:   { dot: 'var(--project-lavender)',   bg: 'var(--project-lavender-wash)',   border: 'var(--project-lavender-border)',   text: 'var(--project-lavender)' },
  rose:       { dot: 'var(--project-rose)',      bg: 'var(--project-rose-wash)',      border: 'var(--project-rose-border)',      text: 'var(--project-rose)' },
  coral:      { dot: 'var(--project-coral)',      bg: 'var(--project-coral-wash)',      border: 'var(--project-coral-border)',      text: 'var(--project-coral)' },
  sage:       { dot: 'var(--project-sage)',       bg: 'var(--project-sage-wash)',       border: 'var(--project-sage-border)',       text: 'var(--project-sage)' },
  blush:      { dot: 'var(--project-blush)',     bg: 'var(--project-blush-wash)',     border: 'var(--project-blush-border)',     text: 'var(--project-blush)' },
  slate:      { dot: 'var(--project-slate)',      bg: 'var(--project-slate-wash)',      border: 'var(--project-slate-border)',      text: 'var(--project-slate)' },
};

const LANE_META: Record<ThoughtLane, { label: string; colorVar: string; bgVar: string; borderVar: string }> = {
  now:   { label: "Today's Journey", colorVar: '--color-lane-now',   bgVar: '--color-lane-now-bg',   borderVar: '--color-lane-now-border' },
  next:  { label: 'If the Wind Is Good', colorVar: '--color-lane-next',  bgVar: '--color-lane-next-bg',  borderVar: '--color-lane-next-border' },
  later: { label: 'Safe Harbor', colorVar: '--color-lane-later', bgVar: '--color-lane-later-bg', borderVar: '--color-lane-later-border' },
  done:  { label: 'Done',  colorVar: '--color-lane-done',  bgVar: '--color-lane-done-bg',  borderVar: '--color-lane-done-border' },
};

type ActiveLane = Exclude<ThoughtLane, 'done'>;

const ACTIVE_LANES: ActiveLane[] = ['now', 'next', 'later'];

const LANE_EMPTY_COPY: Record<ActiveLane, string> = {
  now: "Steer bullets here for today's journey.",
  next: 'Set bullets here for when the wind is good.',
  later: 'Anchor bullets here until you are ready.',
};

const LANE_HELPER_COPY: Record<ActiveLane, string> = {
  now: 'Primary route',
  next: 'Momentum lane',
  later: 'Anchored',
};

const LANE_SHORT_LABEL: Record<ActiveLane, string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
};

const LANE_MOVE_COPY: Record<ActiveLane, string> = {
  now: "Move to Today's Journey",
  next: 'Move Forward',
  later: 'Move to Harbor',
};

function isActiveLane(value: string): value is ActiveLane {
  return value === 'now' || value === 'next' || value === 'later';
}

function mobileLaneDropId(lane: ActiveLane) {
  return `mobile-lane:${lane}`;
}

function mobileBulletDragId(bulletId: string) {
  return `mobile-bullet:${bulletId}`;
}

function parseMobileLaneDropId(id: string): ActiveLane | null {
  const lane = id.replace('mobile-lane:', '');
  return isActiveLane(lane) ? lane : null;
}

function parseMobileBulletDragId(id: string) {
  return id.startsWith('mobile-bullet:') ? id.replace('mobile-bullet:', '') : null;
}

function MobileLaneDropzone({
  lane,
  children,
}: {
  lane: ActiveLane;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: mobileLaneDropId(lane) });

  return (
    <div
      ref={setNodeRef}
      className={[
        'organize-mobile-task-group pb-2.5',
        isOver ? 'organize-mobile-task-group-over' : '',
      ].join(' ')}
      data-lane={lane}
    >
      {children}
    </div>
  );
}

function MobileTaskRow({
  bullet,
  lane,
  project,
  isEditing,
  isMenuOpen,
  editText,
  onEditStart,
  onEditTextChange,
  onCommitEdit,
  onCancelEdit,
  onDone,
  onToggleMenu,
  onMoveToLane,
  onDelete,
}: {
  bullet: ThoughtBullet;
  lane: ActiveLane;
  project?: ProjectMeta | null;
  isEditing: boolean;
  isMenuOpen: boolean;
  editText: string;
  onEditStart: () => void;
  onEditTextChange: (value: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onDone: () => void;
  onToggleMenu: () => void;
  onMoveToLane: (lane: ActiveLane) => void;
  onDelete: () => void;
}) {
  const meta = LANE_META[lane];
  const palette = getProjectPalette(project);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: mobileBulletDragId(bullet.id),
    disabled: isEditing,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.58 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-row-surface organize-mobile-task-row mb-1.5 flex items-start gap-2.5 rounded-2xl px-3 py-2 last:mb-0"
      data-dragging={isDragging ? 'true' : 'false'}
    >
      <button
        type="button"
        onClick={onDone}
        className="organize-mobile-task-check"
        aria-label="Mark complete"
      />
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            value={editText}
            onChange={(event) => onEditTextChange(event.target.value)}
            onBlur={onCommitEdit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onCommitEdit();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                onCancelEdit();
              }
            }}
            onFocus={(event) => event.currentTarget.select()}
            placeholder="Add bullet"
            className="organize-mobile-task-input"
            autoFocus
          />
        ) : (
          <button type="button" onClick={onEditStart} className="block w-full min-w-0 text-left">
            <span className="block font-body text-[14px] font-semibold leading-[1.42] text-[var(--color-text-primary)] pt-px">
              {bullet.text || 'Add bullet'}
            </span>
          </button>
        )}
        {project ? (
          <span
            className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 font-display text-[10px] font-semibold leading-none"
            style={{ background: palette.bg, borderColor: palette.border, color: 'var(--app-text)' }}
          >
            {project.label}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        className="organize-mobile-task-drag"
        aria-label={`Drag ${bullet.text || 'bullet'}`}
        {...listeners}
        {...attributes}
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
      <button type="button" onClick={onToggleMenu} className="organize-mobile-task-menu" aria-label={`${meta.label} task actions`} aria-expanded={isMenuOpen}>
        <MoreHorizontal className="h-4 w-4" aria-hidden />
      </button>
      {isMenuOpen ? (
        <div className="organize-mobile-task-actions" role="menu">
          <button type="button" onClick={onEditStart} role="menuitem">Edit</button>
          {ACTIVE_LANES.filter(item => item !== lane).map(item => (
            <button key={item} type="button" onClick={() => onMoveToLane(item)} role="menuitem">
              {LANE_MOVE_COPY[item]}
            </button>
          ))}
          <button type="button" onClick={onDelete} role="menuitem" className="is-delete">Delete</button>
        </div>
      ) : null}
    </div>
  );
}

// ── Mobile list view ─────────────────────────────────────────────────────────
function ListViewMobile({
  organization,
  onUpdateOrganization,
  selectedProjectId,
  onSelectProject,
}: {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}) {
  const mobileSelectedProjectId = selectedProjectId;
  const [editingBulletId, setEditingBulletId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [mobileTaskMenuId, setMobileTaskMenuId] = useState<string | null>(null);
  const mobileSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 140, tolerance: 8 } })
  );
  // Tracks lanes the user has explicitly collapsed (always collapsed) or explicitly expanded (force-open even when empty)
  const [manuallyCollapsed, setManuallyCollapsed] = useState<Set<string>>(new Set(['next', 'later']));
  const [manuallyExpanded, setManuallyExpanded] = useState<Set<string>>(new Set());

  const isCollapsed = (lane: string, itemCount: number) => {
    if (manuallyExpanded.has(lane)) return false;
    if (manuallyCollapsed.has(lane)) return true;
    return itemCount === 0;
  };

  const toggleLane = (lane: string, itemCount: number) => {
    const currentlyCollapsed = isCollapsed(lane, itemCount);
    if (currentlyCollapsed) {
      // Expanding: remove from collapsed, add to expanded
      setManuallyCollapsed(prev => { const s = new Set(prev); s.delete(lane); return s; });
      setManuallyExpanded(prev => new Set(prev).add(lane));
    } else {
      // Collapsing: remove from expanded, add to collapsed
      setManuallyExpanded(prev => { const s = new Set(prev); s.delete(lane); return s; });
      setManuallyCollapsed(prev => new Set(prev).add(lane));
    }
  };

  const toggleDone = (bullet: ThoughtBullet) => {
    const newLane: ThoughtLane = bullet.lane === 'done' ? 'next' : 'done';
    onUpdateOrganization({
      ...organization,
      bullets: organization.bullets.map(b =>
        b.id === bullet.id ? { ...b, lane: newLane, priority: laneToPriority(newLane) } : b
      ),
    });
  };

  const projectBullets = useMemo(
    () => organization.bullets.filter(
      b => b.project && b.lane !== 'done' && (mobileSelectedProjectId === null || b.project === mobileSelectedProjectId)
    ),
    [organization.bullets, mobileSelectedProjectId]
  );

  const byLane = (lane: ThoughtLane) => projectBullets.filter(b => b.lane === lane);
  const selectedProject = organization.projects.find(p => p.id === mobileSelectedProjectId);
  const selectedPalette = selectedProject ? (PROJECT_PALETTE[selectedProject.color] ?? PROJECT_PALETTE.slate) : null;
  const allProjectBulletsCount = organization.bullets.filter(b => b.project && b.lane !== 'done').length;
  const countForProject = (projectId: string) =>
    organization.bullets.filter(b => b.project === projectId && b.lane !== 'done').length;

  const updateMobileBullet = (bulletId: string, updates: Partial<ThoughtBullet>) => {
    onUpdateOrganization({
      ...organization,
      bullets: organization.bullets.map(b => b.id === bulletId ? { ...b, ...updates } : b),
    });
  };

  const deleteMobileBullet = (bulletId: string) => {
    onUpdateOrganization({
      ...organization,
      bullets: organization.bullets.filter(b => b.id !== bulletId),
    });
  };

  const handleAddToLane = (lane: ThoughtLane) => {
    const projectForCreate = selectedProject ?? organization.projects[0] ?? null;
    if (!projectForCreate) return;
    const id = nanoid();
    const text = 'New bullet';
    onUpdateOrganization({
      ...organization,
      bullets: [
        {
          id,
          text,
          lineNumber: 0,
          displayOrder: projectBullets.length,
          lane,
          priority: laneToPriority(lane),
          project: projectForCreate.id,
          projectMeta: projectForCreate,
        },
        ...organization.bullets,
      ],
    });
    setEditingBulletId(id);
    setEditingText(text);
  };

  const startEditingBullet = (bullet: ThoughtBullet) => {
    setMobileTaskMenuId(null);
    setEditingBulletId(bullet.id);
    setEditingText(bullet.text);
  };

  const commitEditingBullet = () => {
    if (!editingBulletId) return;
    const trimmed = editingText.trim();

    if (!trimmed) {
      deleteMobileBullet(editingBulletId);
    } else {
      updateMobileBullet(editingBulletId, { text: trimmed });
    }

    setEditingBulletId(null);
    setEditingText('');
  };

  const cancelEditingBullet = () => {
    if (editingBulletId) {
      const bullet = organization.bullets.find(item => item.id === editingBulletId);
      if (bullet && !bullet.text.trim()) {
        deleteMobileBullet(editingBulletId);
      }
    }
    setEditingBulletId(null);
    setEditingText('');
  };

  const handleMobileDragEnd = (event: DragEndEvent) => {
    const bulletId = parseMobileBulletDragId(String(event.active.id));
    const targetLane = event.over?.id ? parseMobileLaneDropId(String(event.over.id)) : null;
    if (!bulletId || !targetLane) return;

    updateMobileBullet(bulletId, {
      lane: targetLane,
      priority: laneToPriority(targetLane),
    });
    setManuallyCollapsed(prev => {
      const next = new Set(prev);
      next.delete(targetLane);
      return next;
    });
  };

  const moveMobileBulletToLane = (bullet: ThoughtBullet, lane: ActiveLane) => {
    updateMobileBullet(bullet.id, {
      lane,
      priority: laneToPriority(lane),
    });
    setMobileTaskMenuId(null);
  };

  const deleteMobileTask = (bulletId: string) => {
    deleteMobileBullet(bulletId);
    setMobileTaskMenuId(null);
  };

  const renderEmptyAdd = (lane: ActiveLane) => (
    <div className="organize-mobile-empty-add">
      <button
        type="button"
        onClick={() => handleAddToLane(lane)}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Add bullet
      </button>
    </div>
  );

  return (
    <div className="lg:hidden flex flex-col h-full overflow-hidden">
      {/* Project chips (prototype: inactive = secondary text + hairline border) */}
      <div
        className="organize-mobile-project-strip shrink-0 flex gap-1.5 overflow-x-auto px-3.5 py-1.5 pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        <button
          type="button"
          onClick={() => onSelectProject(null)}
          className="organize-mobile-project-pill flex shrink-0 items-center gap-2 rounded-full py-2 pl-3 pr-3.5 font-display text-[13px] font-semibold transition-all"
          style={{
            border: `1.5px solid ${mobileSelectedProjectId === null ? 'color-mix(in srgb, var(--color-primary) 44%, var(--app-border))' : 'rgba(255,255,255,0.08)'}`,
            background: mobileSelectedProjectId === null ? 'color-mix(in srgb, var(--color-primary) 14%, transparent)' : 'transparent',
            color: 'var(--app-text)',
          }}
          data-active={mobileSelectedProjectId === null ? 'true' : 'false'}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden />
          <span>All</span>
          <span className="font-mono text-[11px] opacity-75">{allProjectBulletsCount}</span>
        </button>
        {organization.projects.map(p => {
          const pal = PROJECT_PALETTE[p.color] ?? PROJECT_PALETTE.slate;
          const active = p.id === mobileSelectedProjectId;
          const count = countForProject(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProject(p.id)}
              className="organize-mobile-project-pill flex shrink-0 items-center gap-2 rounded-full py-2 pl-3 pr-3.5 font-display text-[13px] font-semibold transition-all"
              style={{
                border: `1.5px solid ${active ? pal.border : 'rgba(255,255,255,0.08)'}`,
                background: active ? pal.bg : 'transparent',
                color: active ? pal.text : 'var(--color-text-secondary)',
              }}
              data-active={active ? 'true' : 'false'}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: pal.dot, opacity: active ? 1 : 0.65, boxShadow: active ? `0 0 10px ${pal.dot}` : undefined }} aria-hidden />
              <span>{p.label}</span>
              <span className="font-mono text-[11px] opacity-75">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Lane sections */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-24">
        {selectedProject && selectedPalette && (
          <div className="organize-mobile-selected-project flex items-center gap-1.5 py-1 mb-0.5" aria-label={`${selectedProject.label}, ${projectBullets.length} tasks`}>
            <div className="h-4 w-0.5 rounded-sm shrink-0" style={{ background: selectedPalette.dot }} aria-hidden />
            <span className="font-display text-xs font-semibold" style={{ color: selectedPalette.text }}>{selectedProject.label}</span>
            <span className="font-display text-[11px] text-[var(--color-text-muted)]">{projectBullets.length} tasks</span>
          </div>
        )}

        <DndContext sensors={mobileSensors} onDragEnd={handleMobileDragEnd}>
          {([
            { id: 'now' as const, items: byLane('now') },
            { id: 'next' as const, items: byLane('next') },
            { id: 'later' as const, items: byLane('later') },
          ]).map(({ id: lane, items }) => {
            const meta = LANE_META[lane];
            const collapsed = lane === 'now' ? false : isCollapsed(lane, items.length);
            return (
              <div key={lane} className="organize-mobile-lane-section" data-lane={lane}>
                <button
                  type="button"
                  onClick={() => toggleLane(lane, items.length)}
                  className="organize-mobile-lane-header flex w-full items-center justify-between py-2"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-[7px] w-[7px] rounded-full shrink-0" style={{ background: `var(${meta.colorVar})` }} aria-hidden />
                    <span
                      className="font-display text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{ color: `var(${meta.colorVar})` }}
                    >
                      {meta.label}
                    </span>
                    <span className="organize-mobile-lane-count rounded-full bg-white/[0.07] px-2 py-0.5 font-display text-[10px] text-[var(--color-text-muted)]">{items.length}</span>
                  </div>
                  {collapsed
                    ? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
                    : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
                  }
                </button>

                {!collapsed && (
                  <MobileLaneDropzone lane={lane}>
                    {items.length === 0 ? (
                      renderEmptyAdd(lane)
                    ) : items.map(b => (
                      <MobileTaskRow
                        key={b.id}
                        bullet={b}
                        lane={lane}
                        project={selectedProject ?? organization.projects.find(p => p.id === b.project) ?? null}
                        isEditing={editingBulletId === b.id}
                        isMenuOpen={mobileTaskMenuId === b.id}
                        editText={editingBulletId === b.id ? editingText : b.text}
                        onEditStart={() => startEditingBullet(b)}
                        onEditTextChange={setEditingText}
                        onCommitEdit={commitEditingBullet}
                        onCancelEdit={cancelEditingBullet}
                        onDone={() => toggleDone(b)}
                        onToggleMenu={() => setMobileTaskMenuId(current => current === b.id ? null : b.id)}
                        onMoveToLane={targetLane => moveMobileBulletToLane(b, targetLane)}
                        onDelete={() => deleteMobileTask(b.id)}
                      />
                    ))}
                  </MobileLaneDropzone>
                )}
              </div>
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}

function getProjectPalette(project?: ProjectMeta | null) {
  return project ? (PROJECT_PALETTE[project.color] ?? PROJECT_PALETTE.slate) : PROJECT_PALETTE.slate;
}

function formatSourceDate(bullet: ThoughtBullet) {
  if (!bullet.source?.dateKey) return null;
  return new Date(`${bullet.source.dateKey}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getActiveBullets(bullets: ThoughtBullet[]) {
  return bullets.filter(b => b.project && b.lane !== 'done');
}

function DesktopTaskCard({
  bullet,
  project,
  selected,
  onSelect,
  onDone,
}: {
  bullet: ThoughtBullet;
  project?: ProjectMeta;
  selected: boolean;
  onSelect: () => void;
  onDone: () => void;
}) {
  const palette = getProjectPalette(project);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: bullet.id,
    data: { type: 'bullet' },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.55 : 1,
    borderLeftColor: palette.dot,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={[
        'organize-command-task group',
        selected ? 'is-selected' : '',
      ].join(' ')}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      aria-label={`Inspect ${bullet.text || 'bullet'}`}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDone();
        }}
        className="organize-command-task-check"
        aria-label="Mark done"
      >
        <span />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start gap-2">
          <p className="organize-command-task-title">{bullet.text}</p>
        </div>
        {project ? (
          <span
            className="organize-command-project-pill"
            style={{ background: palette.bg, borderColor: palette.border }}
          >
            {project.label}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        className="organize-command-drag"
        aria-label="Drag bullet"
        {...listeners}
        {...attributes}
        onClick={(event) => event.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
    </article>
  );
}

function DesktopLaneColumn({
  lane,
  bullets,
  projects,
  selectedBulletId,
  onSelectBullet,
  onMarkDone,
  onAdd,
}: {
  lane: ThoughtLane;
  bullets: ThoughtBullet[];
  projects: ProjectMeta[];
  selectedBulletId: string | null;
  onSelectBullet: (id: string) => void;
  onMarkDone: (id: string) => void;
  onAdd: (lane: ThoughtLane) => void;
}) {
  const meta = LANE_META[lane];
  const { setNodeRef, isOver } = useDroppable({ id: `desktop-lane:${lane}` });

  return (
    <section
      ref={setNodeRef}
      className={[
        'organize-command-column',
        `organize-command-column-${lane}`,
        isOver ? 'is-over' : '',
      ].join(' ')}
      aria-label={`${LANE_SHORT_LABEL[lane as ActiveLane]} bullets, ${meta.label}`}
    >
      <div className="organize-command-column-header">
        <div className="flex items-center gap-2">
          <span
            className="organize-lane-header-dot h-2 w-2 shrink-0 rounded-full"
            style={{ background: `var(${meta.colorVar})` }}
            aria-hidden
          />
          <h3 style={{ color: `var(${meta.colorVar})` }}>{LANE_SHORT_LABEL[lane as ActiveLane]}</h3>
          <span>{bullets.length}</span>
          <small>{meta.label} · {LANE_HELPER_COPY[lane as ActiveLane]}</small>
        </div>
        <button type="button" onClick={() => onAdd(lane)} aria-label={`Add bullet to ${LANE_SHORT_LABEL[lane as ActiveLane]}`}>
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="organize-command-column-scroll">
        {bullets.length === 0 ? (
          <p className="organize-command-empty">{LANE_EMPTY_COPY[lane as ActiveLane]}</p>
        ) : (
          bullets.map(bullet => {
            const project = bullet.projectMeta ?? projects.find(p => p.id === bullet.project);
            return (
              <DesktopTaskCard
                key={bullet.id}
                bullet={bullet}
                project={project}
                selected={selectedBulletId === bullet.id}
                onSelect={() => onSelectBullet(bullet.id)}
                onDone={() => onMarkDone(bullet.id)}
              />
            );
          })
        )}
      </div>

      <button type="button" className="organize-command-add-row" onClick={() => onAdd(lane)}>
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Add bullet
      </button>
    </section>
  );
}

// ── Desktop: focus inspector ─────────────────────────────────────────────────
function FocusInspector({
  bullet,
  projects,
  onUpdate,
  onDelete,
  onClose,
}: {
  bullet: ThoughtBullet | null;
  projects: ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  if (!bullet) {
    return (
      <aside className="organize-command-inspector" aria-label="Inspector">
        <div className="organize-command-panel-heading">
          <span>Inspector</span>
        </div>
        <div className="organize-command-inspector-empty">
          <p>Click a bullet to inspect & edit.</p>
        </div>
      </aside>
    );
  }

  const project = projects.find(p => p.id === bullet.project);
  const palette = project ? (PROJECT_PALETTE[project.color] ?? PROJECT_PALETTE.slate) : null;
  const lane = bullet.lane as ThoughtLane | undefined;
  const created = formatSourceDate(bullet);

  return (
    <aside className="organize-command-inspector" aria-label="Inspector">
      <div className="organize-command-panel-heading">
        <span>Inspector</span>
        <button type="button" onClick={onClose} className="organize-command-inspector-close" aria-label="Close inspector" title="Close inspector">
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="organize-command-inspector-body">
        <div>
          <div className="flex items-start gap-2">
            {palette ? <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: palette.dot }} aria-hidden /> : null}
            <label className="sr-only" htmlFor={`organize-command-title-${bullet.id}`}>Bullet title</label>
            <textarea
              id={`organize-command-title-${bullet.id}`}
              value={bullet.text}
              onChange={event => onUpdate({ text: event.target.value })}
              onFocus={event => {
                if (bullet.text === 'New bullet') event.currentTarget.select();
              }}
              placeholder="Add bullet"
              className="organize-command-title-input"
              autoFocus={bullet.text === 'New bullet'}
              rows={2}
            />
          </div>
          {project && palette ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="organize-command-project-pill" style={{ background: palette.bg, borderColor: palette.border }}>
                {project.label}
              </span>
              <span className="text-[12px] text-[var(--color-text-muted)]">+ Add tag</span>
            </div>
          ) : null}
        </div>

        <section className="organize-command-detail-block">
          <h3>Details</h3>
          <dl>
            {project ? (
              <>
                <dt>Project</dt>
                <dd style={palette ? { color: palette.text } : undefined}>{project.label}</dd>
              </>
            ) : null}
            {lane ? (
              <>
                <dt>Priority</dt>
                <dd>{lane === 'now' ? 'High' : lane === 'next' ? 'Medium' : lane === 'later' ? 'Low' : 'Done'}</dd>
              </>
            ) : null}
            {created ? (
              <>
                <dt>Created</dt>
                <dd>{created}</dd>
              </>
            ) : null}
          </dl>
        </section>

        {projects.length > 0 && (
          <section className="organize-command-detail-block">
            <h3>Move to project</h3>
            <select
              className="organize-command-select"
              value={bullet.project ?? ''}
              onChange={e => {
                const pid = e.target.value;
                const meta = projects.find(p => p.id === pid);
                if (meta) onUpdate({ project: meta.id, projectMeta: meta, lane: bullet.lane ?? 'next', priority: laneToPriority(bullet.lane ?? 'next') });
                else onUpdate({ project: undefined, projectMeta: undefined });
              }}
            >
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </section>
        )}

        <section className="organize-command-detail-block">
          <h3>Actions</h3>
          <div className="organize-command-actions">
            <button type="button" onClick={() => onUpdate({ lane: 'done', priority: laneToPriority('done') })} className="is-done">
              <Check className="h-4 w-4" /> Mark done
            </button>
            {lane !== 'next' ? (
              <button type="button" onClick={() => onUpdate({ lane: 'next', priority: laneToPriority('next') })}>
                <ArrowRight className="h-4 w-4" /> Move Forward
              </button>
            ) : null}
            {lane !== 'later' ? (
              <button type="button" onClick={() => onUpdate({ lane: 'later', priority: laneToPriority('later') })}>
                <ArrowRight className="h-4 w-4 rotate-45" /> Move to Harbor
              </button>
            ) : null}
          <button type="button" onClick={onDelete} className="is-delete">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
          </div>
        </section>
      </div>
    </aside>
  );
}

// ── Desktop: project sidebar ─────────────────────────────────────────────────
function ProjectSidebar({
  projects, bullets, selectedProjectId, onSelectProject, onCreateProject,
}: {
  projects: ProjectMeta[];
  bullets: ThoughtBullet[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: () => void;
}) {
  const countFor = (id: string) => bullets.filter(b => b.project === id && b.lane !== 'done').length;
  const activeCount = getActiveBullets(bullets).length;

  return (
    <aside className="organize-project-sidebar organize-command-sidebar hidden xl:flex w-[200px] shrink-0 flex-col overflow-y-auto" aria-label="List sidebar">
      <div className="organize-command-section">
        <p className="organize-command-section-label">Filter</p>
        <button type="button" onClick={() => onSelectProject(null)} className={['organize-command-sidebar-row', selectedProjectId === null ? 'is-active' : ''].join(' ')}>
          <span className="h-2 w-2 rounded-full bg-[var(--color-lane-now)]" />
          <span>All active</span>
          <strong>{activeCount}</strong>
        </button>
      </div>

      <div className="organize-command-section">
        <div className="organize-command-section-header">
          <p className="organize-command-section-label">Projects</p>
          <button type="button" onClick={onCreateProject} aria-label="Create new project" title="New project">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {projects.map(p => {
          const palette = PROJECT_PALETTE[p.color] ?? PROJECT_PALETTE.slate;
          const count = countFor(p.id);
          const isActive = selectedProjectId === p.id;
          return (
            <button key={p.id} type="button" onClick={() => onSelectProject(p.id)} className={['organize-command-sidebar-row', isActive ? 'is-active' : ''].join(' ')}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.dot, boxShadow: isActive ? `0 0 10px ${palette.dot}` : undefined }} />
              <span>{p.label}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </div>

    </aside>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
interface ListViewHubProps {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  showDone: boolean;
  onToggleShowDone: () => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

export function ListViewHub({
  organization,
  onUpdateOrganization,
  showDone,
  onToggleShowDone,
  selectedProjectId,
  onSelectProject,
}: ListViewHubProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedBulletId, setSelectedBulletId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })
  );

  const handleImport = useCallback(
    (bullets: ThoughtBullet[], sourceDateKey: string) => {
      const newBullets = bullets.map((bullet, index) =>
        addImportMetadata({ ...bullet, id: nanoid(), displayOrder: organization.bullets.length + index }, sourceDateKey)
      );
      onUpdateOrganization({ ...organization, bullets: [...organization.bullets, ...newBullets] });
    },
    [organization, onUpdateOrganization]
  );

  const selectedBullet = useMemo(
    () => organization.bullets.find(b => b.id === selectedBulletId) ?? null,
    [organization.bullets, selectedBulletId]
  );

  const handleBulletUpdate = useCallback(
    (id: string, updates: Partial<ThoughtBullet>) => {
      onUpdateOrganization({ ...organization, bullets: organization.bullets.map(b => b.id === id ? { ...b, ...updates } : b) });
    },
    [organization, onUpdateOrganization]
  );

  const handleBulletDelete = useCallback(
    (id: string) => {
      onUpdateOrganization({ ...organization, bullets: organization.bullets.filter(b => b.id !== id) });
      if (selectedBulletId === id) setSelectedBulletId(null);
    },
    [organization, onUpdateOrganization, selectedBulletId]
  );

  const activeBullets = useMemo(() => getActiveBullets(organization.bullets), [organization.bullets]);
  const visibleBullets = useMemo(
    () => activeBullets.filter(bullet => selectedProjectId === null || bullet.project === selectedProjectId),
    [activeBullets, selectedProjectId]
  );
  const bulletsByLane = useMemo(
    () => ({
      now: visibleBullets.filter(b => b.lane === 'now'),
      next: visibleBullets.filter(b => b.lane === 'next'),
      later: visibleBullets.filter(b => b.lane === 'later'),
    }),
    [visibleBullets]
  );
  const selectedProject = organization.projects.find(project => project.id === selectedProjectId) ?? null;

  const addBulletToLane = useCallback((lane: ThoughtLane) => {
    const project = selectedProject ?? organization.projects[0];
    if (!project) return;
    const nextBullet: ThoughtBullet = {
      id: nanoid(),
      text: 'New bullet',
      lineNumber: 0,
      displayOrder: organization.bullets.length,
      lane,
      priority: laneToPriority(lane),
      project: project.id,
      projectMeta: project,
    };
    onUpdateOrganization({ ...organization, bullets: [nextBullet, ...organization.bullets] });
    setSelectedBulletId(nextBullet.id);
  }, [organization, onUpdateOrganization, selectedProject]);

  const markDone = useCallback((id: string) => {
    handleBulletUpdate(id, { lane: 'done', priority: laneToPriority('done') });
  }, [handleBulletUpdate]);

  const moveBulletToLane = useCallback((id: string, lane: ThoughtLane) => {
    const bullet = organization.bullets.find(item => item.id === id);
    if (!bullet) return;
    const project = bullet.project
      ? (bullet.projectMeta ?? organization.projects.find(item => item.id === bullet.project))
      : (selectedProject ?? organization.projects[0]);
    if (!project) return;
    handleBulletUpdate(id, {
      lane,
      priority: laneToPriority(lane),
      project: project.id,
      projectMeta: project,
    });
  }, [handleBulletUpdate, organization.bullets, organization.projects, selectedProject]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragId(null);
    const overId = event.over?.id ? String(event.over.id) : '';
    const lane = overId.startsWith('desktop-lane:') ? overId.replace('desktop-lane:', '') : null;
    if (lane && isActiveLane(lane)) {
      moveBulletToLane(String(event.active.id), lane);
    }
  }, [moveBulletToLane]);

  const createProject = useCallback(() => {
    const project: ProjectMeta = {
      id: nanoid(),
      label: 'New Project',
      color: 'lavender',
    };
    onUpdateOrganization({ ...organization, projects: [...organization.projects, project] });
    onSelectProject(project.id);
  }, [organization, onSelectProject, onUpdateOrganization]);

  return (
    <div className="organize-list-view-root flex h-full overflow-hidden">
      {/* ── MOBILE: full replacement list view ── */}
      <ListViewMobile
        organization={organization}
        onUpdateOrganization={onUpdateOrganization}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
      />

      {/* ── DESKTOP: sidebar + kanban + inspector ── */}
      <ProjectSidebar
        projects={organization.projects}
        bullets={organization.bullets}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
        onCreateProject={createProject}
      />

      <div className="organize-command-main hidden lg:flex flex-1 min-w-0 overflow-hidden flex-col">
        <OrganizeHeaderPortal>
          <details className="organize-clean-overflow">
            <summary className="organize-clean-icon-btn" aria-label="List actions" title="List actions">
              <MoreHorizontal className="h-4 w-4" />
            </summary>
            <div className="organize-clean-overflow-panel">
              <button type="button" onClick={(e) => { onToggleShowDone(); e.currentTarget.closest('details')?.removeAttribute('open'); }} className="organize-clean-overflow-item" aria-pressed={showDone}>
                {showDone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDone ? 'Hide done' : 'Show done'}
              </button>
              <button type="button" onClick={(e) => { setShowImportModal(true); e.currentTarget.closest('details')?.removeAttribute('open'); }} className="organize-clean-overflow-item">
                <Download className="h-4 w-4" /> Import tasks
              </button>
              <button type="button" onClick={(e) => { createProject(); e.currentTarget.closest('details')?.removeAttribute('open'); }} className="organize-clean-overflow-item">
                <Plus className="h-4 w-4" /> New project
              </button>
            </div>
          </details>
        </OrganizeHeaderPortal>

        <div className="organize-command-board-shell">
          <div className="organize-command-board-header">
            <div>
              <h2>{selectedProject ? selectedProject.label : 'All active bullets'}</h2>
              <p>{visibleBullets.length} across {selectedProject ? '1 project' : `${organization.projects.length} projects`}</p>
            </div>
          </div>

          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="organize-command-columns" data-dragging={activeDragId ? 'true' : 'false'}>
              {ACTIVE_LANES.map(lane => (
                <DesktopLaneColumn
                  key={lane}
                  lane={lane}
                  bullets={bulletsByLane[lane]}
                  projects={organization.projects}
                  selectedBulletId={selectedBulletId}
                  onSelectBullet={setSelectedBulletId}
                  onMarkDone={markDone}
                  onAdd={addBulletToLane}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>

      {selectedBullet ? (
        <FocusInspector
          bullet={selectedBullet}
          projects={organization.projects}
          onUpdate={updates => handleBulletUpdate(selectedBullet.id, updates)}
          onDelete={() => handleBulletDelete(selectedBullet.id)}
          onClose={() => setSelectedBulletId(null)}
        />
      ) : null}

      <ImportFromThoughtDownload
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        existingBullets={organization.bullets}
      />
    </div>
  );
}
