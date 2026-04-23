'use client';

import { useState, useCallback, useEffect } from 'react';
import { Cloud, Grid3x3, List, Route } from 'lucide-react';
import { useThoughtOrganizer } from './useThoughtOrganizer';
import { FlowOrganizeView } from './FlowOrganizeView';
import { ListViewHub } from './ListViewHub';
import { BentoOrganizeView } from '@/components/orbital/BentoOrganizeView';
import { OrganizeHeaderSlotProvider } from './OrganizeHeaderSlot';
import type { ThoughtOrganization } from '@/lib/thought-organization';

type ViewMode = 'list' | 'bento' | 'flow';

const VIEW_STORAGE_KEY = 'organize-view-mode';

export function OrganizeView() {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer();
  const [showDone, setShowDone] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [headerSlot, setHeaderSlot] = useState<HTMLDivElement | null>(null);

  // Load saved view preference
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'bento' || saved === 'list' || saved === 'flow') {
      setViewMode(saved);
    } else if (saved === 'orbital') {
      // Migrate old 'orbital' to 'bento'
      setViewMode('bento');
    }
  }, []);

  // Save view preference
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

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Cloud className="mx-auto h-8 w-8 text-text-muted animate-pulse" />
            <p className="mt-3 text-sm text-text-muted">Loading organize workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl flex flex-col min-h-screen">
      {/* Unified toolbar: title · view switcher · view actions (portal slot) */}
      <div className="organize-page-header organize-toolbar-row">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-xl font-display font-semibold text-text tracking-tight">
            Organize
          </h1>
          <div className="organize-view-switcher">
            <button
              type="button"
              onClick={() => handleViewModeChange('list')}
              className={`organize-view-switcher-btn ${viewMode === 'list' ? 'is-active' : ''}`}
              title="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('bento')}
              className={`organize-view-switcher-btn ${viewMode === 'bento' ? 'is-active' : ''}`}
              title="Bento grid view"
              aria-pressed={viewMode === 'bento'}
            >
              <Grid3x3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bento</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('flow')}
              className={`organize-view-switcher-btn ${viewMode === 'flow' ? 'is-active' : ''}`}
              title="Flow view"
              aria-pressed={viewMode === 'flow'}
            >
              <Route className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Flow</span>
            </button>
          </div>
        </div>
        <div
          ref={setHeaderSlot}
          className="organize-toolbar-actions"
          aria-label={`${viewMode} view actions`}
        />
      </div>

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
            />
          )}
        </div>
      </OrganizeHeaderSlotProvider>

      {/* Status — above home-indicator / thumb zone on phones */}
      <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-4 z-10 pointer-events-none sm:bottom-6 sm:right-6">
        <div className="min-h-[1.25rem] text-[10px] font-medium text-text-muted/60 flex items-center gap-2 bg-bg-base/40 backdrop-blur-sm px-2 py-1 rounded-full max-w-[14rem]">
          {saveError ? (
            <span className="text-error">{saveError}</span>
          ) : isSaving ? (
            <span>Saving…</span>
          ) : (
            <span>
              Synced {lastSyncedAt && lastSyncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
