'use client';

import { useState, useCallback, useEffect } from 'react';
import { Cloud, Inbox, Search, ListChecks, Play } from 'lucide-react';
import { useThoughtOrganizer } from './useThoughtOrganizer';
import { FlowOrganizeView } from './FlowOrganizeView';
import { ListViewHub } from './ListViewHub';
import { OrganizeHeaderSlotProvider } from './OrganizeHeaderSlot';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { InboxPanel } from './InboxPanel';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import type { ThoughtOrganization } from '@/lib/thought-organization';
import { getOrganizerWorkspace, type OrganizerWorkspaceConfig } from '@/lib/organize-workspaces';

type ViewMode = 'list' | 'flow';

const VIEW_OPTIONS: { id: ViewMode; label: string; hint: string; Icon: typeof ListChecks }[] = [
  { id: 'list', label: 'List', hint: 'Clarify & sort', Icon: ListChecks },
  { id: 'flow', label: 'Flow', hint: 'Do the next thing', Icon: Play },
];

type OrganizeViewProps = {
  workspace?: OrganizerWorkspaceConfig;
};

export function OrganizeView({ workspace = getOrganizerWorkspace('personal') }: OrganizeViewProps) {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer(workspace.id);
  const [showDone, setShowDone] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [headerSlot, setHeaderSlot] = useState<HTMLDivElement | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  // Load saved view preference
  useEffect(() => {
    const saved = localStorage.getItem(workspace.viewStorageKey);
    if (saved === 'list' || saved === 'flow') {
      setViewMode(saved);
    } else if (saved === 'bento' || saved === 'orbital') {
      setViewMode('list');
      localStorage.setItem(workspace.viewStorageKey, 'list');
    }
  }, [workspace.viewStorageKey]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(workspace.viewStorageKey, mode);
  }, [workspace.viewStorageKey]);

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

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Cloud className="mx-auto h-8 w-8 text-[var(--color-text-muted)] animate-pulse" />
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{workspace.loadingLabel}</p>
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
  return (
    <div className="organize-clean-shell mx-auto flex min-h-screen w-full max-w-[88rem] lg:max-w-[104rem] 2xl:max-w-[120rem] flex-col">

      {/* ── Organize chrome header ──────────────────────────────────────── */}
      <header className="organize-chrome-header border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shrink-0 flex items-center px-3 py-2.5 sm:px-6 md:py-4 lg:px-8">

        {/* ── MOBILE header (< lg) ────────────────────────────────────── */}
        <div className="lg:hidden grid grid-cols-[minmax(5.8rem,1fr)_minmax(8.5rem,12rem)_auto] items-center gap-2 w-full">
          <div className="min-w-0">
            <h1 className="font-display text-[24px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] leading-none">
              {workspace.title}
            </h1>
          </div>
          <div className="flex justify-center min-w-0">
            <div
              role="tablist"
              aria-label="Organize view"
              className="organize-view-toggle organize-view-toggle-mobile inline-flex w-full shrink-0 items-stretch rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
          <div className="justify-self-end flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInboxOpen(o => !o)}
              className="organize-mobile-header-action"
              aria-label={`Open ${workspace.inboxToggleTitle.toLowerCase()}${inboxCount > 0 ? `, ${inboxCount} items` : ''}`}
              aria-pressed={inboxOpen}
              title={workspace.inboxToggleTitle}
            >
              <Inbox className="h-4 w-4" strokeWidth={2} aria-hidden />
              {inboxCount > 0 ? (
                <span className="organize-mobile-header-action-badge">
                  {inboxCount > 9 ? '9+' : inboxCount}
                </span>
              ) : null}
            </button>
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
              {workspace.title}
            </h1>
            <span className="font-body text-[11px] text-[var(--color-text-muted)] ml-1 whitespace-nowrap">
              {bulletCount} {bulletCount === 1 ? workspace.itemSingular : workspace.itemPlural} • {organization.projects.length} project{organization.projects.length !== 1 ? 's' : ''}
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

          {/* Right: ⌘K pill, sync dot, inbox toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Open command palette (⌘K)"
              className={[
                'organize-header-search organize-header-action flex items-center gap-2 rounded-lg text-[12px] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
                'h-9 w-9 justify-center px-0 py-0',
              ].join(' ')}
            >
              <Search size={14} strokeWidth={1.8} aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => setInboxOpen(o => !o)}
              aria-label={`Inbox (${inboxCount} items)`}
              aria-pressed={inboxOpen}
              className={[
                'relative flex h-9 items-center justify-center gap-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
                'w-9 px-0',
                inboxOpen
                  ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'organize-header-action text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)]',
              ].join(' ')}
            >
              <Inbox size={16} strokeWidth={1.75} aria-hidden />
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
              className="organize-sync-status organize-sync-status-compact"
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
          ) : (
            <FlowOrganizeView
              organization={organization}
              onUpdateOrganization={handleUpdateOrganization}
              showDone={showDone}
              onToggleShowDone={() => setShowDone(!showDone)}
              onOpenList={() => handleViewModeChange('list')}
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
        copy={{
          title: workspace.inboxTitle,
          ariaLabel: workspace.inboxAriaLabel,
          emptyLabel: workspace.inboxEmptyLabel,
          placeholder: workspace.inboxPlaceholder,
          closeLabel: workspace.closeInboxLabel,
        }}
      />

    </div>
  );
}
