'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Check, Trash2, X } from 'lucide-react';
import { TaskSubtasks } from '../TaskSubtasks';
import { laneToPriority, type ProjectColor, type ProjectMeta, type ThoughtBullet, type ThoughtLane } from '@/lib/thought-organization';
import { PROJECT_PALETTE, PROJECT_COLOR_KEYS, formatSourceDate } from './helpers';

// ── Desktop: focus inspector ─────────────────────────────────────────────────
export function ProjectEditorSection({
  project,
  onUpdateProject,
}: {
  project: ProjectMeta;
  onUpdateProject: (projectId: string, patch: { label: string; color: ProjectColor }) => void;
}) {
  const [projectNameDraft, setProjectNameDraft] = useState(project.label);

  useEffect(() => {
    setProjectNameDraft(project.label);
  }, [project.id, project.label]);

  const commitProjectName = () => {
    const trimmed = projectNameDraft.trim().slice(0, 50);
    if (!trimmed) {
      setProjectNameDraft(project.label);
      return;
    }
    if (trimmed !== project.label) {
      onUpdateProject(project.id, { label: trimmed, color: project.color });
    }
  };

  const applyProjectColor = (color: ProjectColor) => {
    const trimmed = projectNameDraft.trim().slice(0, 50) || project.label;
    if (!trimmed) return;
    onUpdateProject(project.id, { label: trimmed.slice(0, 50), color });
  };

  return (
    <section className="organize-command-detail-block">
      <h3>Project</h3>
      <label className="sr-only" htmlFor={`organize-project-name-${project.id}`}>Project name</label>
      <input
        id={`organize-project-name-${project.id}`}
        type="text"
        value={projectNameDraft}
        onChange={e => setProjectNameDraft(e.target.value.slice(0, 50))}
        onBlur={commitProjectName}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="organize-command-title-input min-h-0 py-2 text-[0.94rem]"
        placeholder="Project name"
        autoComplete="off"
      />
      <p className="mt-2 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Color</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Project color">
        {PROJECT_COLOR_KEYS.map((colorKey) => {
          const pal = PROJECT_PALETTE[colorKey];
          const selected = project.color === colorKey;
          return (
            <button
              key={colorKey}
              type="button"
              title={colorKey}
              aria-label={`${colorKey}${selected ? ', selected' : ''}`}
              aria-pressed={selected}
              onClick={() => applyProjectColor(colorKey)}
              className={[
                'h-8 w-8 shrink-0 rounded-full border-2 transition-[box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35',
                selected ? 'border-[var(--color-text-primary)] scale-105' : 'border-transparent',
              ].join(' ')}
              style={{
                background: pal.dot,
                boxShadow: selected ? '0 0 0 2px var(--color-text-primary)' : undefined,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

export function ProjectInspector({
  project,
  bullets,
  onUpdateProject,
  onClose,
}: {
  project: ProjectMeta;
  bullets: ThoughtBullet[];
  onUpdateProject: (projectId: string, patch: { label: string; color: ProjectColor }) => void;
  onClose: () => void;
}) {
  const palette = PROJECT_PALETTE[project.color] ?? PROJECT_PALETTE.slate;
  const activeCount = bullets.filter(b => b.project === project.id && b.lane !== 'done').length;
  const doneCount = bullets.filter(b => b.project === project.id && b.lane === 'done').length;

  return (
    <aside className="organize-command-inspector" aria-label="Project inspector">
      <div className="organize-command-panel-heading">
        <span>Project Inspector</span>
        <button type="button" onClick={onClose} className="organize-command-inspector-close" aria-label="Close inspector" title="Close inspector">
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="organize-command-inspector-body">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: palette.dot, boxShadow: `0 0 12px ${palette.dot}` }} aria-hidden />
          <h2>{project.label}</h2>
        </div>

        <ProjectEditorSection project={project} onUpdateProject={onUpdateProject} />

        <section className="organize-command-detail-block">
          <h3>Details</h3>
          <dl>
            <dt>Active</dt>
            <dd>{activeCount}</dd>
            <dt>Done</dt>
            <dd>{doneCount}</dd>
          </dl>
        </section>
      </div>
    </aside>
  );
}

export function FocusInspector({
  bullet,
  projects,
  onUpdate,
  onUpdateProject,
  onDelete,
  onClose,
}: {
  bullet: ThoughtBullet | null;
  projects: ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  onUpdateProject?: (projectId: string, patch: { label: string; color: ProjectColor }) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const project = bullet ? projects.find(p => p.id === bullet.project) : null;

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
        </div>

        {project && onUpdateProject ? <ProjectEditorSection project={project} onUpdateProject={onUpdateProject} /> : null}

        <section className="organize-command-detail-block">
          <h3>Sub-bullets</h3>
          <TaskSubtasks bullet={bullet} onUpdate={onUpdate} editable />
        </section>

        <section className="organize-command-detail-block">
          <h3>Details</h3>
          <dl>
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

