'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronRight, Download, Eye, EyeOff, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { ThoughtOrganizeMode, type ThoughtOrganizeModeActions } from '@/components/dashboard/ThoughtOrganizeMode';
import { ImportFromThoughtDownload } from './ImportFromThoughtDownload';
import { OrganizeHeaderPortal } from './OrganizeHeaderSlot';
import {
  addImportMetadata,
  laneToPriority,
  type ProjectMeta,
  type ThoughtBullet,
  type ThoughtLane,
  type ThoughtOrganization,
} from '@/lib/thought-organization';
import { nanoid } from 'nanoid';

// ── Project color palette ────────────────────────────────────────────────────
const PROJECT_PALETTE: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  peach:      { dot: 'hsl(24,45%,73%)',   bg: 'hsla(24,45%,73%,0.15)',  border: 'hsla(24,45%,73%,0.28)',  text: 'hsl(24,40%,55%)' },
  sky:        { dot: 'hsl(205,60%,75%)',  bg: 'hsla(205,60%,75%,0.15)', border: 'hsla(205,60%,75%,0.28)', text: 'hsl(205,55%,52%)' },
  mint:       { dot: 'hsl(162,38%,58%)',  bg: 'hsla(162,38%,58%,0.15)', border: 'hsla(162,38%,58%,0.28)', text: 'hsl(162,38%,42%)' },
  periwinkle: { dot: 'hsl(235,38%,72%)',  bg: 'hsla(235,38%,72%,0.15)', border: 'hsla(235,38%,72%,0.28)', text: 'hsl(235,35%,55%)' },
  lavender:   { dot: 'hsl(270,25%,68%)',  bg: 'hsla(270,25%,68%,0.15)', border: 'hsla(270,25%,68%,0.28)', text: 'hsl(270,25%,52%)' },
  rose:       { dot: 'hsl(343,32%,67%)',  bg: 'hsla(343,32%,67%,0.15)', border: 'hsla(343,32%,67%,0.28)', text: 'hsl(343,30%,50%)' },
  coral:      { dot: 'hsl(12,48%,74%)',   bg: 'hsla(12,48%,74%,0.15)',  border: 'hsla(12,48%,74%,0.28)',  text: 'hsl(12,44%,52%)' },
  sage:       { dot: 'hsl(167,35%,66%)',  bg: 'hsla(167,35%,66%,0.15)', border: 'hsla(167,35%,66%,0.28)', text: 'hsl(167,32%,46%)' },
  blush:      { dot: 'hsl(330,28%,74%)',  bg: 'hsla(330,28%,74%,0.15)', border: 'hsla(330,28%,74%,0.28)', text: 'hsl(330,26%,52%)' },
  slate:      { dot: 'hsl(220,18%,70%)',  bg: 'hsla(220,18%,70%,0.15)', border: 'hsla(220,18%,70%,0.28)', text: 'hsl(220,16%,48%)' },
};

const LANE_META: Record<ThoughtLane, { label: string; colorVar: string; bgVar: string; borderVar: string }> = {
  now:   { label: 'Now',   colorVar: '--color-lane-now',   bgVar: '--color-lane-now-bg',   borderVar: '--color-lane-now-border' },
  next:  { label: 'Next',  colorVar: '--color-lane-next',  bgVar: '--color-lane-next-bg',  borderVar: '--color-lane-next-border' },
  later: { label: 'Later', colorVar: '--color-lane-later', bgVar: '--color-lane-later-bg', borderVar: '--color-lane-later-border' },
  done:  { label: 'Done',  colorVar: '--color-lane-done',  bgVar: '--color-lane-done-bg',  borderVar: '--color-lane-done-border' },
};

// ── Mobile list view ─────────────────────────────────────────────────────────
function ListViewMobile({
  organization,
  onUpdateOrganization,
}: {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
}) {
  const firstProjectId = organization.projects[0]?.id ?? null;
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(firstProjectId);
  const [collapsedLanes, setCollapsedLanes] = useState<Set<string>>(new Set(['later']));

  const toggleLane = (lane: string) => {
    setCollapsedLanes(prev => {
      const next = new Set(prev);
      next.has(lane) ? next.delete(lane) : next.add(lane);
      return next;
    });
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

  const nowBullets = organization.bullets.filter(b => b.lane === 'now' && b.project);

  const projectBullets = useMemo(() =>
    organization.bullets.filter(b => b.project === selectedProjectId && b.lane !== 'done'),
    [organization.bullets, selectedProjectId]
  );

  const byLane = (lane: ThoughtLane) => projectBullets.filter(b => b.lane === lane);
  const selectedProject = organization.projects.find(p => p.id === selectedProjectId);
  const selectedPalette = selectedProject ? (PROJECT_PALETTE[selectedProject.color] ?? PROJECT_PALETTE.slate) : null;

  return (
    <div className="lg:hidden flex flex-col h-full overflow-hidden">
      {/* Now spotlight */}
      <div
        className="mx-3.5 mt-3 mb-0 shrink-0 rounded-[14px] px-4 py-3"
        style={{
          background: 'var(--color-lane-now-bg)',
          border: '1px solid var(--color-lane-now-border)',
        }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className="h-[7px] w-[7px] rounded-full bg-[var(--color-lane-now)]"
            style={{ boxShadow: '0 0 7px var(--color-lane-now-glow)' }}
            aria-hidden
          />
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-lane-now)]">Now</span>
          <span className="font-body text-[11px] text-[var(--color-text-muted)]">{nowBullets.length} active</span>
        </div>
        {nowBullets.length === 0 ? (
          <p className="font-body text-[13px] text-[var(--color-text-muted)]">Pull a task in to get started</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {nowBullets.slice(0, 2).map((b, i) => {
              const proj = organization.projects.find(p => p.id === b.project);
              const pal = proj ? (PROJECT_PALETTE[proj.color] ?? PROJECT_PALETTE.slate) : null;
              return (
                <div
                  key={b.id}
                  className="flex items-center gap-2"
                  style={{
                    borderBottom: i < Math.min(nowBullets.length, 2) - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    paddingBottom: i < Math.min(nowBullets.length, 2) - 1 ? 6 : 0,
                  }}
                >
                  {pal && <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: pal.dot }} aria-hidden />}
                  <span className="flex-1 font-body text-[13px] font-medium leading-snug text-[var(--color-text-primary)] line-clamp-1">{b.text}</span>
                  {proj && pal && (
                    <span className="shrink-0 rounded-full px-2 py-0.5 font-display text-[10px] font-semibold" style={{ background: pal.bg, color: pal.text, border: `1px solid ${pal.border}` }}>
                      {proj.label}
                    </span>
                  )}
                </div>
              );
            })}
            {nowBullets.length > 2 && (
              <p className="font-body text-[11px] text-[var(--color-text-muted)]">+{nowBullets.length - 2} more across projects</p>
            )}
          </div>
        )}
      </div>

      {/* Project chips */}
      <div className="shrink-0 flex gap-2 overflow-x-auto px-3.5 py-2.5" style={{ scrollbarWidth: 'none' }}>
        {organization.projects.map(p => {
          const pal = PROJECT_PALETTE[p.color] ?? PROJECT_PALETTE.slate;
          const active = p.id === selectedProjectId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedProjectId(p.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-display text-[13px] font-semibold transition-all"
              style={{
                border: `1.5px solid ${active ? pal.border : 'var(--color-border-subtle)'}`,
                background: active ? pal.bg : 'transparent',
                color: active ? pal.text : 'var(--color-text-muted)',
              }}
            >
              <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: pal.dot, opacity: active ? 1 : 0.5 }} aria-hidden />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Lane sections */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-24">
        {selectedProject && selectedPalette && (
          <div className="flex items-center gap-2 py-2 mb-1">
            <div className="h-4 w-[3px] rounded-full shrink-0" style={{ background: selectedPalette.dot }} aria-hidden />
            <span className="font-display text-[13px] font-bold" style={{ color: selectedPalette.text }}>{selectedProject.label}</span>
            <span className="font-body text-[11px] text-[var(--color-text-muted)]">{projectBullets.length} tasks</span>
          </div>
        )}

        {(['now', 'next', 'later'] as ThoughtLane[]).map(lane => {
          const items = byLane(lane);
          const meta = LANE_META[lane];
          const collapsed = collapsedLanes.has(lane);
          return (
            <div key={lane}>
              <button
                type="button"
                onClick={() => toggleLane(lane)}
                className="flex w-full items-center justify-between py-3 border-b border-[var(--color-border-subtle)]"
              >
                <div className="flex items-center gap-2">
                  <span className="h-[7px] w-[7px] rounded-full shrink-0" style={{ background: `var(${meta.colorVar})` }} aria-hidden />
                  <span className="font-display text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: `var(${meta.colorVar})` }}>{meta.label}</span>
                  <span className="font-body text-[11px] text-[var(--color-text-muted)]">{items.length}</span>
                </div>
                {collapsed
                  ? <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden />
                  : <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden />
                }
              </button>

              {!collapsed && (
                <div className="pb-1">
                  {items.length === 0 ? (
                    <p className="py-2 pb-3 pl-1 font-body text-[13px] text-[var(--color-text-muted)]">Nothing here yet</p>
                  ) : items.map(b => (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border-subtle)]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDone(b)}
                        className="h-[22px] w-[22px] shrink-0 rounded-full transition-all flex items-center justify-center border border-[var(--color-border-subtle)]"
                        style={{ background: 'transparent' }}
                        aria-label="Mark complete"
                      />
                      <span className="flex-1 font-body text-[14px] font-medium leading-snug text-[var(--color-text-primary)]">{b.text}</span>
                      <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: `var(${meta.colorVar})` }} aria-hidden />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
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
  bullet: ThoughtBullet;
  projects: ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const project = projects.find(p => p.id === bullet.project);
  const palette = project ? (PROJECT_PALETTE[project.color] ?? PROJECT_PALETTE.slate) : null;
  const lane = bullet.lane as ThoughtLane | undefined;

  return (
    <aside
      className="hidden lg:flex w-[300px] shrink-0 flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] overflow-y-auto"
      aria-label="Focus inspector"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Inspector</span>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors" aria-label="Close inspector">✕</button>
      </div>
      <div className="flex flex-col gap-4 p-5">
        {project && palette && (
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold font-display" style={{ background: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}>
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: palette.dot }} />
            {project.label}
          </div>
        )}
        <p className="font-body text-[16px] font-medium leading-[1.4] text-[var(--color-text-primary)]">{bullet.text}</p>
        <div>
          <p className="mb-2 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Lane</p>
          <div className="flex flex-col gap-1">
            {(['now', 'next', 'later', 'done'] as ThoughtLane[]).map(l => {
              const meta = LANE_META[l];
              const isActive = lane === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => onUpdate({ lane: l, priority: laneToPriority(l) })}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium font-body text-left transition-colors"
                  style={isActive ? { background: `var(${meta.bgVar})`, color: `var(${meta.colorVar})`, border: `1px solid var(${meta.borderVar})` } : { color: 'var(--color-text-muted)', border: '1px solid transparent' }}
                  aria-pressed={isActive}
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: `var(${meta.colorVar})` }} />
                  {meta.label}
                  {isActive && <Check className="ml-auto h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
        {projects.length > 0 && (
          <div>
            <p className="mb-2 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Project</p>
            <select
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[13px] font-body text-[var(--color-text-primary)] focus:border-[var(--color-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              value={bullet.project ?? ''}
              onChange={e => {
                const pid = e.target.value;
                const meta = projects.find(p => p.id === pid);
                if (meta) onUpdate({ project: meta.id, projectMeta: meta, lane: bullet.lane ?? 'next', priority: laneToPriority(bullet.lane ?? 'next') });
                else onUpdate({ project: undefined, projectMeta: undefined });
              }}
            >
              <option value="">— No project —</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        )}
        {bullet.source && (
          <p className="font-body text-[12px] text-[var(--color-text-muted)]">
            Imported {new Date(bullet.source.dateKey + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
        <div className="flex flex-col gap-2 border-t border-[var(--color-border-subtle)] pt-4">
          <button type="button" onClick={() => { onUpdate({ lane: 'done', priority: laneToPriority('done') }); onClose(); }} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold font-display text-left transition-colors" style={{ background: 'var(--color-lane-done-bg)', color: 'var(--color-lane-done)', border: '1px solid var(--color-lane-done-border)' }}>
            <Check className="h-3.5 w-3.5" /> Mark done
          </button>
          {lane !== 'next' && (
            <button type="button" onClick={() => onUpdate({ lane: 'next', priority: laneToPriority('next') })} className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[13px] font-semibold font-display text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]">
              <ArrowRight className="h-3.5 w-3.5" /> Push to Next
            </button>
          )}
          <button type="button" onClick={() => { onDelete(); onClose(); }} className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[13px] font-semibold font-display text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/8">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
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
  const inboxCount = bullets.filter(b => !b.project && b.lane !== 'done').length;

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] overflow-y-auto" aria-label="Projects sidebar">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border-subtle)]">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Projects</span>
        <button type="button" onClick={onCreateProject} className="rounded-lg p-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors" aria-label="Create new project" title="New project">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex flex-col gap-0.5 p-2">
        <button type="button" onClick={() => onSelectProject(null)} className={['flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium font-body transition-colors', selectedProjectId === null ? 'bg-[rgba(255,255,255,0.06)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--color-text-primary)]'].join(' ')}>
          <span className="h-2 w-2 rounded-full shrink-0 bg-[var(--color-text-muted)]" />
          <span className="flex-1 truncate">All projects</span>
          {inboxCount > 0 && <span className="font-mono text-[11px] text-[var(--color-text-muted)]">{inboxCount}</span>}
        </button>
        {projects.map(p => {
          const palette = PROJECT_PALETTE[p.color] ?? PROJECT_PALETTE.slate;
          const count = countFor(p.id);
          const isActive = selectedProjectId === p.id;
          return (
            <button key={p.id} type="button" onClick={() => onSelectProject(p.id)} className={['flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium font-body transition-colors', isActive ? 'bg-[rgba(255,255,255,0.06)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--color-text-primary)]'].join(' ')}>
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: palette.dot }} />
              <span className="flex-1 truncate">{p.label}</span>
              {count > 0 && <span className="font-mono text-[11px] text-[var(--color-text-muted)]">{count}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
interface ListViewHubProps {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  showDone: boolean;
  onToggleShowDone: () => void;
}

export function ListViewHub({ organization, onUpdateOrganization, showDone, onToggleShowDone }: ListViewHubProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedBulletId, setSelectedBulletId] = useState<string | null>(null);
  const organizerRef = useRef<ThoughtOrganizeModeActions>(null);

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

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── MOBILE: full replacement list view ── */}
      <ListViewMobile organization={organization} onUpdateOrganization={onUpdateOrganization} />

      {/* ── DESKTOP: sidebar + kanban + inspector ── */}
      <ProjectSidebar
        projects={organization.projects}
        bullets={organization.bullets}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onCreateProject={() => organizerRef.current?.openCreateProject()}
      />

      <div className="hidden lg:flex flex-1 min-w-0 overflow-hidden flex-col">
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
              <button type="button" onClick={(e) => { organizerRef.current?.openCreateProject(); e.currentTarget.closest('details')?.removeAttribute('open'); }} className="organize-clean-overflow-item">
                <Plus className="h-4 w-4" /> New project
              </button>
            </div>
          </details>
        </OrganizeHeaderPortal>

        <div className="flex-1 overflow-hidden">
          <ThoughtOrganizeMode
            ref={organizerRef}
            organization={organization}
            onUpdateOrganization={onUpdateOrganization}
            isInline={true}
            standalone={true}
            hideHeader={true}
            showDone={showDone}
          />
        </div>
      </div>

      {selectedBullet && (
        <FocusInspector
          bullet={selectedBullet}
          projects={organization.projects}
          onUpdate={updates => handleBulletUpdate(selectedBullet.id, updates)}
          onDelete={() => handleBulletDelete(selectedBullet.id)}
          onClose={() => setSelectedBulletId(null)}
        />
      )}

      <ImportFromThoughtDownload
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        existingBullets={organization.bullets}
      />
    </div>
  );
}
