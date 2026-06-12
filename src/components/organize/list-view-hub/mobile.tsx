'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical, MoreHorizontal, Plus } from 'lucide-react';
import { TaskSubtasks } from '../TaskSubtasks';
import { showToast } from '@/lib/flow-notifications';
import { laneToPriority, type ProjectMeta, type ThoughtBullet, type ThoughtLane, type ThoughtOrganization } from '@/lib/thought-organization';
import { nanoid } from 'nanoid';
import { PROJECT_PALETTE, LANE_META, ActiveLane, ACTIVE_LANES, LANE_MOVE_COPY, completionAwareUpdate, mobileLaneDropId, mobileBulletDragId, parseMobileLaneDropId, parseMobileBulletDragId, getProjectPalette } from './helpers';
import { ListWinsPanel } from './ListWinsPanel';

export function MobileLaneDropzone({
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

export function MobileTaskRow({
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
  onUpdate,
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
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
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
            style={{ background: palette.bg, borderColor: palette.border, color: palette.text }}
          >
            {project.label}
          </span>
        ) : null}
        <TaskSubtasks bullet={bullet} onUpdate={onUpdate} compact className="mt-1.5" />
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
export function ListViewMobile({
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
    const current = organization.bullets.find(b => b.id === bulletId);
    if (current && updates.lane === 'done' && current.lane !== 'done') {
      showToast(`Done: ${current.text}`, 'success');
    }

    onUpdateOrganization({
      ...organization,
      bullets: organization.bullets.map(b =>
        b.id === bulletId ? { ...b, ...completionAwareUpdate(b, updates) } : b
      ),
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
                border: `1.5px solid ${active ? pal.border : `color-mix(in srgb, ${pal.border} 58%, transparent)`}`,
                background: active ? pal.bg : `color-mix(in srgb, ${pal.bg} 42%, transparent)`,
                color: pal.text,
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
                        onUpdate={(updates) => updateMobileBullet(b.id, updates)}
                      />
                    ))}
                  </MobileLaneDropzone>
                )}
              </div>
            );
          })}
        </DndContext>

        <ListWinsPanel
          bullets={organization.bullets}
          projects={organization.projects}
          showDone={false}
          onToggleShowDone={() => undefined}
          onReopen={(id) => updateMobileBullet(id, { lane: 'next', priority: laneToPriority('next') })}
          showToggle={false}
        />
      </div>
    </div>
  );
}

