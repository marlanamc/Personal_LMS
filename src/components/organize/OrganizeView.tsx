'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
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

function getLocalGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return 'Good morning, Marlie';
  if (hour >= 12 && hour < 17) return 'Good afternoon, Marlie';
  if (hour >= 17 && hour < 22) return 'Good evening, Marlie 🌙';
  return 'Working late, Marlie 🌙';
}

export function OrganizeView() {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer();
  const [showDone, setShowDone] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [headerSlot, setHeaderSlot] = useState<HTMLDivElement | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);
  const [localGreeting, setLocalGreeting] = useState(() => getLocalGreeting());

  // Load saved view preference
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'bento' || saved === 'list' || saved === 'flow') {
      setViewMode(saved);
    } else if (saved === 'orbital') {
      setViewMode('bento');
    }
  }, []);

  useEffect(() => {
    const updateGreeting = () => setLocalGreeting(getLocalGreeting());
    updateGreeting();
    const timer = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(timer);
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
  const nowBullets = useMemo(
    () => organization.bullets
      .filter(b => b.lane === 'now' && b.project)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [organization.bullets]
  );

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

  const viewProjectInBento = useCallback((projectId: string) => {
    setFocusedProjectId(projectId);
    handleViewModeChange('bento');
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
  const compactHeaderActions = viewMode === 'list' || viewMode === 'flow';

  return (
    <div className="organize-clean-shell mx-auto flex min-h-screen w-full max-w-[88rem] lg:max-w-[104rem] 2xl:max-w-[120rem] flex-col">

      {/* ── Organize chrome header ──────────────────────────────────────── */}
      <header className="organize-chrome-header border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-3 lg:px-6 lg:py-0 min-h-[8.75rem] lg:h-16 lg:min-h-0 shrink-0 flex items-center">

        {/* ── MOBILE header (< lg) ────────────────────────────────────── */}
        <div className="lg:hidden grid grid-cols-[1fr_minmax(0,auto)] grid-rows-[auto_auto] items-center gap-x-3 gap-y-2 w-full">
          <div className="min-w-0">
            <p className="mb-0.5 font-display text-[12px] font-semibold tracking-[0.02em] text-[var(--color-primary)]">
              {localGreeting}
            </p>
            <h1 className="font-display text-[25px] font-bold tracking-[-0.03em] text-[var(--color-text-primary)] leading-none min-w-0">
              Organize
            </h1>
          </div>
          <div className="justify-self-end flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="organize-mobile-header-action organize-mobile-header-action-search"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setInboxOpen(o => !o)}
              className="organize-mobile-header-action organize-mobile-header-action-add"
              aria-label={`Inbox${inboxCount > 0 ? `, ${inboxCount} items` : ''}`}
              aria-pressed={inboxOpen}
            >
              <Inbox className="h-5 w-5" strokeWidth={2} aria-hidden />
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
              className="organize-view-toggle organize-view-toggle-mobile inline-flex w-full max-w-[22rem] items-stretch rounded-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                      'organize-view-toggle-mobile-btn flex-1 rounded-full font-semibold font-display transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30',
                      isActive
                        ? 'organize-view-toggle-active organize-view-toggle-mobile-btn-active text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                    ].join(' ')}
                  >
                    <span className="organize-view-toggle-mobile-content">
                      <Icon className="organize-view-toggle-mobile-icon" aria-hidden />
                      <span className="organize-view-toggle-mobile-copy">
                        <span className="organize-view-toggle-mobile-label">{label}</span>
                        <span className="organize-view-toggle-mobile-subtitle">{hint}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="organize-mobile-purpose-row col-span-2 min-w-0">
            <p>{activeViewMeta.helper}</p>
            {viewMode === 'list' && nowBullets.length > 0 ? (
              <button type="button" onClick={() => seedFlow(focusedProjectId)}>
                <Play className="h-3.5 w-3.5" aria-hidden />
                Start Flow
              </button>
            ) : null}
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
            className="organize-view-toggle flex items-stretch rounded-full"
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
                    'rounded-full px-5 py-1.5 text-[13px] font-semibold font-display transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
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
              onStartFlow={seedFlow}
              onViewProjectInBento={viewProjectInBento}
              nowBulletCount={nowBullets.length}
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
