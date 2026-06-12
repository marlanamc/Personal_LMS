'use client';

import { Plus } from 'lucide-react';
import { type ProjectMeta, type ThoughtBullet } from '@/lib/thought-organization';
import { PROJECT_PALETTE, getActiveBullets } from './helpers';

// ── Desktop: project sidebar ─────────────────────────────────────────────────
export function ProjectSidebar({
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
    <aside className="organize-project-sidebar organize-command-sidebar hidden lg:flex w-[200px] shrink-0 flex-col overflow-y-auto" aria-label="List sidebar">
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
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProject(p.id)}
              className={['organize-command-sidebar-row', isActive ? 'is-active' : ''].join(' ')}
              style={{
                borderColor: isActive ? palette.border : `color-mix(in srgb, ${palette.border} 46%, transparent)`,
                background: isActive ? palette.bg : 'transparent',
                color: isActive ? palette.text : 'var(--app-text-soft)',
              }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.dot, boxShadow: isActive ? `0 0 10px ${palette.dot}` : undefined }} />
              <span>{p.label}</span>
              <strong style={{ background: palette.bg, color: palette.text }}>{count}</strong>
            </button>
          );
        })}
      </div>

    </aside>
  );
}

