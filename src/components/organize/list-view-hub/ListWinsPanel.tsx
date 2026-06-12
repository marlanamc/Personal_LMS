'use client';

import { CheckCircle2, Eye, EyeOff, RotateCcw, Trophy } from 'lucide-react';
import { type ProjectMeta, type ThoughtBullet } from '@/lib/thought-organization';
import { isDoneToday, sortDoneNewestFirst } from './helpers';

export function ListWinsPanel({
  bullets,
  projects,
  showDone,
  onToggleShowDone,
  onReopen,
  showToggle = true,
}: {
  bullets: ThoughtBullet[];
  projects: ProjectMeta[];
  showDone: boolean;
  onToggleShowDone: () => void;
  onReopen: (id: string) => void;
  showToggle?: boolean;
}) {
  const activeCount = bullets.filter((bullet) => bullet.project && bullet.lane !== 'done').length;
  const doneBullets = sortDoneNewestFirst(bullets.filter((bullet) => bullet.lane === 'done'));
  const doneToday = doneBullets.filter(isDoneToday);
  const recentDone = (showDone ? doneToday : doneToday.slice(0, 3));
  const totalCount = activeCount + doneToday.length;
  const progress = totalCount > 0 ? Math.round((doneToday.length / totalCount) * 100) : 0;
  const projectById = new Map(projects.map((project) => [project.id, project]));

  return (
    <section className="organize-wins-panel" aria-label="Wins today">
      <div className="organize-wins-summary">
        <div className="organize-wins-icon" aria-hidden>
          <Trophy className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="organize-wins-kicker">Wins today</p>
          <div className="organize-wins-line">
            <strong>{doneToday.length}</strong>
            <span>{doneToday.length === 1 ? 'task finished' : 'tasks finished'}</span>
            {activeCount > 0 ? <em>{activeCount} active</em> : null}
          </div>
          <div className="organize-wins-progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
        {showToggle ? (
          <button type="button" onClick={onToggleShowDone} className="organize-wins-toggle" aria-pressed={showDone}>
            {showDone ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showDone ? 'Hide done' : 'Done list'}
          </button>
        ) : null}
      </div>

      {recentDone.length > 0 ? (
        <div className="organize-wins-list" data-expanded={showDone ? 'true' : 'false'}>
          {recentDone.map((bullet) => {
            const project = bullet.project ? projectById.get(bullet.project) ?? bullet.projectMeta : bullet.projectMeta;
            return (
              <div key={bullet.id} className="organize-wins-item">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                <span className="organize-wins-item-title">{bullet.text}</span>
                {project ? (
                  <span className="organize-wins-item-project" style={{ color: `var(--project-${project.color})` }}>
                    {project.label}
                  </span>
                ) : null}
                <button type="button" onClick={() => onReopen(bullet.id)} className="organize-wins-reopen" aria-label={`Reopen ${bullet.text}`}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="organize-wins-empty">
          Finish something and it will land here.
        </p>
      )}
    </section>
  );
}

