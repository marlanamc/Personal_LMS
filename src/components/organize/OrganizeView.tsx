'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Download, Cloud, Plus, Eye, EyeOff, Grid3x3, List } from 'lucide-react';
import { useThoughtOrganizer } from './useThoughtOrganizer';
import { ImportFromThoughtDownload } from './ImportFromThoughtDownload';
import { ThoughtOrganizeMode, type ThoughtOrganizeModeActions } from '@/components/dashboard/ThoughtOrganizeMode';
import { BentoOrganizeView } from '@/components/orbital/BentoOrganizeView';
import { addImportMetadata, type ThoughtBullet, type ThoughtOrganization } from '@/lib/thought-organization';
import { nanoid } from 'nanoid';

type ViewMode = 'list' | 'bento';

const VIEW_STORAGE_KEY = 'organize-view-mode';

export function OrganizeView() {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const organizerRef = useRef<ThoughtOrganizeModeActions>(null);

  // Load saved view preference
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'bento' || saved === 'list') {
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


  const handleImport = useCallback(
    (bullets: ThoughtBullet[], sourceDateKey: string) => {
      updateOrganization((prev) => {
        // Add import metadata and generate new IDs for imported bullets
        const newBullets = bullets.map((bullet, index) =>
          addImportMetadata(
            {
              ...bullet,
              id: nanoid(),
              displayOrder: prev.bullets.length + index,
            },
            sourceDateKey
          )
        );

        return {
          ...prev,
          bullets: [...prev.bullets, ...newBullets],
        };
      });
    },
    [updateOrganization]
  );

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
      {/* Header */}
      <div className="organize-page-header flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 pb-0">
        <h1 className="text-xl font-display font-semibold text-text tracking-tight">Organize</h1>

        <div className="organize-toolbar flex items-center gap-1 sm:gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg bg-bg-elevated p-0.5 mr-1 sm:mr-2">
            <button
              type="button"
              onClick={() => handleViewModeChange('list')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-bg-card text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
              title="List view"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('bento')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors ${
                viewMode === 'bento'
                  ? 'bg-bg-card text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
              title="Bento grid view"
            >
              <Grid3x3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bento</span>
            </button>
          </div>

          {viewMode === 'list' && (
            <>
              <button
                type="button"
                onClick={() => organizerRef.current?.openCreateProject()}
                className="organize-toolbar-button inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium text-text-muted transition-colors hover:text-text touch-manipulation"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="max-w-[5.5rem] truncate sm:max-w-none">New project</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDone((v: boolean) => !v)}
                className="organize-toolbar-button inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium text-text-muted transition-colors hover:text-text touch-manipulation"
              >
                {showDone ? <EyeOff className="h-4 w-4 shrink-0" /> : <Eye className="h-4 w-4 shrink-0" />}
                <span className="max-w-[4.5rem] truncate sm:max-w-none">{showDone ? 'Hide done' : 'Show done'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="organize-toolbar-button inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium text-text-muted transition-colors hover:text-text touch-manipulation"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="max-w-[3.5rem] truncate sm:max-w-none">Import</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'list' ? (
        <div className="flex-1 px-0 sm:px-6 pb-0 sm:pb-6 overflow-hidden">
          <ThoughtOrganizeMode
            ref={organizerRef}
            organization={organization}
            onUpdateOrganization={handleUpdateOrganization}
            isInline={true}
            standalone={true}
            hideHeader={true}
            showDone={showDone}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <BentoOrganizeView
            organization={organization}
            onUpdateOrganization={handleUpdateOrganization}
          />
        </div>
      )}

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

      {/* Import Modal */}
      <ImportFromThoughtDownload
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        existingBullets={organization.bullets}
      />
    </div>
  );
}
