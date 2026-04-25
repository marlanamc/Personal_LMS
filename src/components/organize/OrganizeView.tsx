'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Cloud, LayoutList, LayoutGrid, Zap, Plus, Command, Inbox } from 'lucide-react';
import { nanoid } from 'nanoid';
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

const VIEW_OPTIONS: { id: ViewMode; label: string; Icon: React.ElementType }[] = [
  { id: 'list', label: 'List', Icon: LayoutList },
  { id: 'bento', label: 'Bento', Icon: LayoutGrid },
  { id: 'flow', label: 'Flow', Icon: Zap },
];

export function OrganizeView() {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer();
  const [showDone, setShowDone] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [headerSlot, setHeaderSlot] = useState<HTMLDivElement | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddText, setQuickAddText] = useState('');
  const quickAddRef = useRef<HTMLInputElement>(null);

  // Load saved view preference
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'bento' || saved === 'list' || saved === 'flow') {
      setViewMode(saved);
    } else if (saved === 'orbital') {
      setViewMode('bento');
    }
  }, []);

  // Focus quick-add input when opened
  useEffect(() => {
    if (quickAddOpen) quickAddRef.current?.focus();
  }, [quickAddOpen]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }, []);

  const handleUpdateOrganization = useCallback(
    (org: ThoughtOrganization) => {
      updateOrganization(() => org);
    },
    [updateOrganization]
  );

  const handleQuickAdd = useCallback(() => {
    const text = quickAddText.trim();
    if (!text) {
      setQuickAddOpen(false);
      return;
    }
    updateOrganization(prev => ({
      ...prev,
      bullets: [
        {
          id: nanoid(),
          text,
          lineNumber: 0,
          displayOrder: -1, // prepend to inbox
          lane: undefined,
          project: undefined,
        },
        ...prev.bullets,
      ],
    }));
    setQuickAddText('');
    setQuickAddOpen(false);
  }, [quickAddText, updateOrganization]);

  useGlobalShortcuts({
    currentView: viewMode,
    onOpenPalette: useCallback(() => setCmdOpen(true), []),
    onOpenQuickAdd: useCallback(() => setQuickAddOpen(true), []),
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

  return (
    <div className="organize-clean-shell mx-auto flex min-h-screen w-full max-w-[88rem] lg:max-w-[104rem] 2xl:max-w-[120rem] flex-col">

      {/* ── Organize chrome header ──────────────────────────────────────── */}
      <header className="organize-chrome-header border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 lg:px-6 h-14 lg:h-16 shrink-0 flex items-center">

        {/* ── MOBILE header (< lg) ────────────────────────────────────── */}
        <div className="lg:hidden grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-2 w-full">
          <h1 className="font-display text-[18px] font-bold tracking-[-0.01em] text-[var(--color-text-primary)] leading-none min-w-0">
            Organize
          </h1>
          <div className="flex justify-center min-w-0 px-1">
            <div
              role="tablist"
              aria-label="Organize view"
              className="inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-[rgba(255,255,255,0.05)] p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {VIEW_OPTIONS.map(({ id, label }) => {
                const isActive = viewMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleViewModeChange(id)}
                    className={[
                      'shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold font-display transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30',
                      isActive
                        ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-[0_1px_4px_rgba(0,0,0,0.3)]'
                        : 'text-[var(--color-text-muted)]',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <span
            className="organize-sync-status justify-self-end"
            title={syncLabel}
            aria-label={syncLabel}
          >
            <span
              className={`organize-sync-dot ${saveError ? 'is-error' : isSaving ? 'is-saving' : 'is-synced'}`}
            />
            <span className="organize-sync-label" aria-hidden>{syncLabel}</span>
          </span>
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
              {bulletCount} bullet{bulletCount !== 1 ? 's' : ''} in flight
            </span>
          </div>

          <div className="flex-1" />

          {/* Center: view switcher with icons */}
          <div
            role="tablist"
            aria-label="Organize view"
            className="flex items-center gap-0.5 rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-1"
          >
            {VIEW_OPTIONS.map(({ id, label, Icon }) => {
              const isActive = viewMode === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleViewModeChange(id)}
                  className={[
                    'flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12px] font-semibold font-display transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
                    isActive
                      ? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                  ].join(' ')}
                >
                  <Icon size={13} strokeWidth={2} aria-hidden />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          {/* Right: quick-add, ⌘K pill, sync dot, inbox toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {quickAddOpen ? (
              <form
                onSubmit={e => { e.preventDefault(); handleQuickAdd(); }}
                className="flex items-center gap-1"
              >
                <input
                  ref={quickAddRef}
                  type="text"
                  value={quickAddText}
                  onChange={e => setQuickAddText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') { setQuickAddOpen(false); setQuickAddText(''); } }}
                  placeholder="Add to inbox…"
                  className="w-44 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[13px] font-body text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-[12px] font-semibold font-display text-[var(--color-bg-base)] transition-opacity hover:opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setQuickAddOpen(false); setQuickAddText(''); }}
                  className="rounded-lg px-2 py-1.5 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setQuickAddOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[12px] font-semibold font-display text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
                aria-label="Quick add bullet"
              >
                <Plus size={13} strokeWidth={2.5} aria-hidden />
                <span>Add</span>
                <kbd className="font-mono text-[10px] text-[var(--color-text-muted)] bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded px-1 py-px ml-0.5">/</kbd>
              </button>
            )}

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Open command palette (⌘K)"
              className="flex items-center gap-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
            >
              <Command size={11} strokeWidth={2} aria-hidden />
              <span>K</span>
            </button>

            <span
              className="organize-sync-status"
              title={syncLabel}
              aria-label={syncLabel}
            >
              <span
                className={`organize-sync-dot ${saveError ? 'is-error' : isSaving ? 'is-saving' : 'is-synced'}`}
              />
              <span className="organize-sync-label" aria-hidden>{syncLabel}</span>
            </span>

            <button
              type="button"
              onClick={() => setInboxOpen(o => !o)}
              aria-label={`Inbox (${inboxCount} items)`}
              aria-pressed={inboxOpen}
              className={[
                'relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40',
                inboxOpen
                  ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text-primary)]',
              ].join(' ')}
            >
              <Inbox size={16} strokeWidth={1.75} aria-hidden />
              {inboxCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold font-mono text-[var(--color-bg-base)]">
                  {inboxCount > 9 ? '9+' : inboxCount}
                </span>
              )}
            </button>

            <div
              ref={setHeaderSlot}
              className="organize-toolbar-actions"
              aria-label={`${viewMode} view actions`}
            />
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
            />
          ) : viewMode === 'bento' ? (
            <BentoOrganizeView
              organization={organization}
              onUpdateOrganization={handleUpdateOrganization}
            />
          ) : (
            <FlowOrganizeView
              organization={organization}
              onUpdateOrganization={handleUpdateOrganization}
              showDone={showDone}
              onToggleShowDone={() => setShowDone(!showDone)}
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

      {/* Mobile: Inbox FAB (design prototype — tray + badge, not a ringed header icon) */}
      <button
        type="button"
        onClick={() => setInboxOpen(o => !o)}
        aria-label={`Inbox${inboxCount > 0 ? `, ${inboxCount} items` : ''}`}
        aria-pressed={inboxOpen}
        className="lg:hidden fixed z-20 flex items-center gap-1.5 rounded-[22px] border border-white/10 bg-[var(--color-bg-elevated)] py-2 pl-2.5 pr-3.5 text-[13px] font-semibold font-display text-[var(--color-text-secondary)] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#243852] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 bottom-[calc(var(--bottom-nav-height)+10px)] right-3.5"
      >
        <Inbox size={17} strokeWidth={1.75} className="shrink-0 opacity-90" aria-hidden />
        <span>Inbox</span>
        {inboxCount > 0 && (
          <span className="rounded-[10px] bg-[rgba(160,137,199,0.2)] px-1.5 py-px text-[10px] font-bold text-[var(--color-accent)]">
            {inboxCount > 99 ? '99+' : inboxCount}
          </span>
        )}
      </button>
    </div>
  );
}
