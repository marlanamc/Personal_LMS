'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Sparkles } from 'lucide-react';
import { TaskSubtasks } from '../TaskSubtasks';
import { type ProjectMeta, type ThoughtBullet, type ThoughtLane } from '@/lib/thought-organization';
import { LANE_META, ActiveLane, LANE_EMPTY_COPY, LANE_HELPER_COPY, LANE_SHORT_LABEL, getProjectPalette } from './helpers';

export function DesktopTaskCard({
  bullet,
  project,
  selected,
  onSelect,
  onDone,
  onUpdate,
  celebrating = false,
}: {
  bullet: ThoughtBullet;
  project?: ProjectMeta;
  selected: boolean;
  onSelect: () => void;
  onDone: () => void;
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  celebrating?: boolean;
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
        celebrating ? 'is-celebrating' : '',
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
      {celebrating ? (
        <span className="organize-task-sparkle-burst" aria-hidden>
          <Sparkles className="h-4 w-4" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start gap-2">
          <p className="organize-command-task-title">{bullet.text}</p>
        </div>
        {project ? (
          <span
            className="organize-command-project-pill"
            style={{ background: palette.bg, borderColor: palette.border, color: palette.text }}
          >
            {project.label}
          </span>
        ) : null}
        <TaskSubtasks bullet={bullet} onUpdate={onUpdate} compact className="mt-2" />
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

export function DesktopLaneColumn({
  lane,
  bullets,
  projects,
  selectedBulletId,
  onSelectBullet,
  onMarkDone,
  onUpdateBullet,
  completedBurstId,
  onAdd,
}: {
  lane: ThoughtLane;
  bullets: ThoughtBullet[];
  projects: ProjectMeta[];
  selectedBulletId: string | null;
  onSelectBullet: (id: string) => void;
  onMarkDone: (id: string) => void;
  onUpdateBullet: (id: string, updates: Partial<ThoughtBullet>) => void;
  completedBurstId: string | null;
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
                onUpdate={(updates) => onUpdateBullet(bullet.id, updates)}
                celebrating={completedBurstId === bullet.id}
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

