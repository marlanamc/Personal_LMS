'use client';

import { useState, useCallback, useEffect } from 'react';
import { Cloud, Inbox, Search, ListChecks, LayoutGrid, Play } from 'lucide-react';
import { useThoughtOrganizer } from './useThoughtOrganizer';
import { FlowOrganizeView } from './FlowOrganizeView';
import { ListViewHub } from './ListViewHub';
import { BentoOrganizeView } from '@/components/orbital/BentoOrganizeView';
import { OrganizeHeaderSlotProvider } from './OrganizeHeaderSlot';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { InboxPanel } from './InboxPanel';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import type { ThoughtOrganization } from '@/lib/thought-organization';

type ViewMode = 'list' | 'bento' | 'flow';

const VIEW_STORAGE_KEY = 'organize-view-mode';

const VIEW_OPTIONS: { id: ViewMode; label: string; hint: string; helper: string; Icon: typeof ListChecks }[] = [
  { id: 'list', label: 'List', hint: 'Clarify & sort', helper: 'Sort, prioritize, and route your bullets.', Icon: ListChecks },
  { id: 'bento', label: 'Bento', hint: 'See projects', helper: 'See your projects at a glance.', Icon: LayoutGrid },
  { id: 'flow', label: 'Flow', hint: 'Do the next thing', helper: 'Move through your next actions.', Icon: Play },
];

export function OrganizeView() {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer();
  const [showDone, setShowDone] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [headerSlot, setHeaderSlot] = useState<HTMLDivElement | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  // Load saved view preference
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'bento' || saved === 'list' || saved === 'flow') {
      setViewMode(saved);
    } else if (saved === 'orbital') {
      setViewMode('bento');
    }
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }, []);

  const activeViewMeta = VIEW_OPTIONS.find(option => option.id === viewMode) ?? VIEW_OPTIONS[0];

  const handleUpdateOrganization = useCallback(
    (org: ThoughtOrganization) => {
      updateOrganization(() => org);
    },
    [updateOrganization]
  );

  useGlobalShortcuts({
    currentView: viewMode,
    onOpenPalette: useCallback(() => setCmdOpen(true), []),
    onOpenQuickAdd: useCallback(() => setInboxOpen(true), []),
    onToggleInbox: useCallback(() => setInboxOpen(o => !o), []),
    onSwitchView: handleViewModeChange,
  });

  const inboxCount = organization.bullets.filter(
    b => !b.project && b.lane !== 'done'
  ).length;

  const bulletCount = organization.bullets.filter(b => b.lane !== 'done').length;
  const seedFlow = useCallback((projectId?: string | null) => {
    const scoped = organization.bullets
      .filter(b => b.lane !== 'done' && b.project && (!projectId || b.project === projectId));
    const laneRank = { now: 0, next: 1, later: 2, done: 3 } as const;
    const candidates = scoped
      .filter(b => b.lane === 'now' || b.lane === 'next')
      .sort((a, b) => {
        const laneDelta = laneRank[a.lane ?? 'next'] - laneRank[b.lane ?? 'next'];
        return laneDelta || (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      })
      .slice(0, 6);

    updateOrganization(prev => ({
      ...prev,
      flow: {
        ...(prev.flow ?? {}),
        globalOrder: candidates.map(b => b.id),
      },
    }));
    handleViewModeChange('flow');
  }, [handleViewModeChange, organization.bullets, updateOrganization]);

  const organizeProjectInList = useCallback((projectId: string) => {
    setFocusedProjectId(projectId);
    handleViewModeChange('list');
  }, [handleViewModeChange]);

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Cloud className="mx-auto h-8 w-8 text-[var(--color-text-muted)] animate-pulse" />
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">Loading organize workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  const syncLabel = saveError
    ? saveError
    : isSaving
      ? 'Saving…'
      : lastSyncedAt
        ? `Synced ${lastSyncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
        : 'Synced';
  const compactHeaderActions = viewMode === 'list' || viewMode === 'bento' || viewMode === 'flow';

  return (
    <div className="organize-clean-shell mx-auto flex min-h-screen w-full max-w-[88rem] lg:max-w-[104rem] 2xl:max-w-[120rem] flex-col">

      {/* ── Organize chrome header ──────────────────────────────────────── */}
      <header className="organize-chrome-header border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-1.5 lg:px-6 lg:py-0 min-h-[5.7rem] lg:h-16 lg:min-h-0 shrink-0 flex items-center">

        {/* ── MOBILE header (< lg) ────────────────────────────────────── */}
        <div className="lg:hidden grid grid-cols-[1fr_minmax(0,auto)] grid-rows-[auto_auto] items-center gap-x-3 gap-y-1 w-full">
          <div className="min-w-0">
            <h1 className="font-display text-[24px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] leading-none">
              Organize
            </h1>
          </div>
          <div className="justify-self-end flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInboxOpen(o => !o)}
              className="organize-mobile-header-action"
              aria-label={`Open task tray${inboxCount > 0 ? `, ${inboxCount} items` : ''}`}
              aria-pressed={inboxOpen}
              title="Task tray"
            >
              <Inbox className="h-4 w-4" strokeWidth={2} aria-hidden />
              {inboxCount > 0 ? (
                <span className="organize-mobile-header-action-badge">
                  {inboxCount > 9 ? '9+' : inboxCount}
                </span>
              ) : null}
            </button>
          </div>
          <div className="col-span-2 flex justify-center min-w-0">
            <div
              role="tablist"
              aria-label="Organize view"
              className="organize-view-toggle organize-view-toggle-mobile inline-flex w-[min(100%,15rem)] shrink-0 items-stretch rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {VIEW_OPTIONS.map(({ id, label, hint, Icon }) => {
                const isActive = viewMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${label}: ${hint}`}
                    title={`${label}: ${hint}`}
                    onClick={() => handleViewModeChange(id)}
                    className={[
                      'organize-view-toggle-mobile-btn flex-1 rounded-lg font-semibold font-display transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30',
                      isActive
                        ? 'organize-view-toggle-active organize-view-toggle-mobile-btn-active text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                    ].join(' ')}
                  >
                    <span className="organize-view-toggle-mobile-content">
                      <Icon className="organize-view-toggle-mobile-icon" aria-hidden />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── DESKTOP header (≥ lg) ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-3 w-full">
          {/* Left: breadcrumb + bullet count */}
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]"
              style={{ boxShadow: '0 0 8px var(--color-lane-now-glow)' }}
              aria-hidden
            />
            <h1 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] leading-none">
              Organize
            </h1>
            <span className="font-body text-[11px] text-[var(--color-text-muted)] ml-1 whitespace-nowrap">
              {bulletCount} bullet{bulletCount !== 1 ? 's' : ''} • {organization.projects.length} project{organization.projects.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex-1" />

          {/* Center: view switcher */}
          <div
            role="tablist"
            aria-label="Organize view"
            className="organize-view-toggle flex items-stretch rounded-2xl"
          >
            {VIEW_OPTIONS.map(({ id, label, hint }) => {
              const isActive = viewMode === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${label}: ${hint}`}
                  title={`${label}: ${hint}`}
                  onClick={() => handleViewModeChange(id)}
                  className={[
                    'rounded-lg px-5 py-1.5 text-[13px] font-semibold font-display transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
                    isActive
                      ? 'organize-view-toggle-active text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                  ].join(' ')}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          {!compactHeaderActions ? (
            <p className="organize-mode-helper" aria-live="polite">
              {activeViewMeta.helper}
            </p>
          ) : null}

          {/* Right: ⌘K pill, sync dot, inbox toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Open command palette (⌘K)"
              className={[
                'organize-header-search organize-header-action flex items-center gap-2 rounded-lg text-[12px] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
                compactHeaderActions ? 'h-9 w-9 justify-center px-0 py-0' : 'px-3 py-1.5',
              ].join(' ')}
            >
              <Search size={14} strokeWidth={1.8} aria-hidden />
              {!compactHeaderActions ? (
                <>
                  <span className="min-w-[8rem] text-left text-[var(--color-text-muted)]">Search bullets...</span>
                  <kbd className="font-mono text-[10px] text-[var(--color-text-muted)] bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded px-1 py-px">⌘ K</kbd>
                </>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setInboxOpen(o => !o)}
              aria-label={`Inbox (${inboxCount} items)`}
              aria-pressed={inboxOpen}
              className={[
                'relative flex h-9 items-center justify-center gap-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
                compactHeaderActions ? 'w-9 px-0' : 'px-3',
                inboxOpen
                  ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'organize-header-action text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)]',
              ].join(' ')}
            >
              <Inbox size={16} strokeWidth={1.75} aria-hidden />
              {!compactHeaderActions ? <span className="text-[12px] font-semibold">Inbox</span> : null}
              {inboxCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-bold font-mono text-[var(--color-bg-base)]">
                  {inboxCount > 9 ? '9+' : inboxCount}
                </span>
              )}
            </button>

            <div
              ref={setHeaderSlot}
              className="organize-toolbar-actions"
              aria-label={`${viewMode} view actions`}
            />

            <span
              className={compactHeaderActions ? 'organize-sync-status organize-sync-status-compact' : 'organize-sync-status'}
              title={syncLabel}
              aria-label={syncLabel}
            >
              <span
                className={`organize-sync-dot ${saveError ? 'is-error' : isSaving ? 'is-saving' : 'is-synced'}`}
              />
              <span className="organize-sync-label" aria-hidden>{syncLabel}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Active View */}
      <OrganizeHeaderSlotProvider slot={headerSlot}>
        <div className="flex-1 overflow-hidden">
          {viewMode === 'list' ? (
            <ListViewHub
              organization={organization}
              onUpdateOrganization={handleUpdateOrganization}
              showDone={showDone}
              onToggleShowDone={() => setShowDone(!showDone)}
              selectedProjectId={focusedProjectId}
              onSelectProject={setFocusedProjectId}
            />
          ) : viewMode === 'bento' ? (
            <BentoOrganizeView
              organization={organization}
              onUpdateOrganization={handleUpdateOrganization}
              focusedProjectId={focusedProjectId}
              onOrganizeProject={organizeProjectInList}
              onFocusProjectInFlow={seedFlow}
            />
          ) : (
            <FlowOrganizeView
              organization={organization}
              onUpdateOrganization={handleUpdateOrganization}
              showDone={showDone}
              onToggleShowDone={() => setShowDone(!showDone)}
              onOpenList={() => handleViewModeChange('list')}
              onOpenBento={() => handleViewModeChange('bento')}
            />
          )}
        </div>
      </OrganizeHeaderSlotProvider>

      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        organization={organization}
        currentView={viewMode}
        onSwitchView={handleViewModeChange}
      />

      <InboxPanel
        isOpen={inboxOpen}
        onClose={() => setInboxOpen(false)}
        organization={organization}
        onUpdateOrganization={handleUpdateOrganization}
      />

    </div>
  );
}
