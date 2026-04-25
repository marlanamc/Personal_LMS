'use client';

import { useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Inbox, MoveRight } from 'lucide-react';
import type { ThoughtBullet, ThoughtOrganization, ProjectMeta } from '@/lib/thought-organization';

type ProjectColor =
  | 'peach' | 'sky' | 'mint' | 'periwinkle' | 'lavender'
  | 'rose' | 'coral' | 'sage' | 'blush' | 'slate';

const PROJECT_COLOR_DOT: Record<ProjectColor, string> = {
  peach: '#f4a47a',
  sky: '#7ab8d4',
  mint: '#78bfa5',
  periwinkle: '#9b9fd4',
  lavender: '#c3a8d1',
  rose: '#d48aa6',
  coral: '#e07b6c',
  sage: '#8fa987',
  blush: '#e8b4b8',
  slate: '#8498aa',
};

type InboxPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
};

function usePrefersReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  return ref.current;
}

export function InboxPanel({ isOpen, onClose, organization, onUpdateOrganization }: InboxPanelProps) {
  const reduced = usePrefersReducedMotion();
  const duration = reduced ? 0 : 0.22;

  const inboxBullets = organization.bullets.filter(b => !b.project && b.lane !== 'done');

  const handleAssign = useCallback((bullet: ThoughtBullet, project: ProjectMeta) => {
    onUpdateOrganization({
      ...organization,
      bullets: organization.bullets.map(b =>
        b.id === bullet.id
          ? { ...b, project: project.id, projectMeta: project, lane: b.lane ?? 'next' }
          : b
      ),
    });
  }, [organization, onUpdateOrganization]);

  const handleDiscard = useCallback((bulletId: string) => {
    onUpdateOrganization({
      ...organization,
      bullets: organization.bullets.filter(b => b.id !== bulletId),
    });
  }, [organization, onUpdateOrganization]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only — panel is fixed on desktop) */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onMouseDown={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            role="complementary"
            aria-label="Inbox panel"
            className="fixed right-0 top-0 z-[100] flex h-full w-80 flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-elevated)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300, duration }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-3.5 shrink-0">
              <Inbox className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />
              <h2 className="flex-1 font-display text-[15px] font-bold text-[var(--color-text-primary)]">
                Inbox
              </h2>
              <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                {inboxBullets.length} unsorted
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close inbox panel"
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Bullet list */}
            <div className="flex-1 overflow-y-auto py-2">
              {inboxBullets.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                  <Inbox className="h-8 w-8 text-[var(--color-text-muted)] opacity-40" aria-hidden />
                  <p className="font-body text-[13px] text-[var(--color-text-muted)]">
                    Inbox is empty
                  </p>
                  <p className="font-body text-[11px] text-[var(--color-text-muted)] opacity-60">
                    Use quick-add or "/" to capture bullets
                  </p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-[var(--color-border-subtle)]">
                  {inboxBullets.map(bullet => (
                    <InboxBulletRow
                      key={bullet.id}
                      bullet={bullet}
                      projects={organization.projects}
                      onAssign={project => handleAssign(bullet, project)}
                      onDiscard={() => handleDiscard(bullet.id)}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-[var(--color-border-subtle)] px-4 py-2.5 shrink-0">
              <p className="font-body text-[11px] text-[var(--color-text-muted)]">
                Press <kbd className="rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-1 py-px font-mono text-[10px]">I</kbd> to toggle
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

type InboxBulletRowProps = {
  bullet: ThoughtBullet;
  projects: ProjectMeta[];
  onAssign: (project: ProjectMeta) => void;
  onDiscard: () => void;
};

function InboxBulletRow({ bullet, projects, onAssign, onDiscard }: InboxBulletRowProps) {
  return (
    <li className="group px-4 py-3">
      {/* Bullet text */}
      <p className="mb-2 font-body text-[13px] leading-snug text-[var(--color-text-primary)] line-clamp-2">
        {bullet.text}
      </p>

      {/* Project picker */}
      {projects.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {projects.map(project => {
            const color = PROJECT_COLOR_DOT[project.color as ProjectColor] ?? '#8498aa';
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onAssign(project)}
                title={`Assign to ${project.label}`}
                className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2 py-0.5 font-body text-[11px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: color }}
                  aria-hidden
                />
                <span>{project.label}</span>
                <MoveRight className="h-3 w-3 opacity-50" aria-hidden />
              </button>
            );
          })}
          <button
            type="button"
            onClick={onDiscard}
            title="Discard bullet"
            className="flex items-center gap-1 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2 py-0.5 font-body text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-red-400/40 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
          >
            <X className="h-3 w-3" aria-hidden />
            Discard
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onDiscard}
          className="font-body text-[11px] text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
        >
          Discard
        </button>
      )}
    </li>
  );
}
