'use client';

import { useState, useCallback, useRef } from 'react';
import { Download, Cloud, Plus, Eye, EyeOff } from 'lucide-react';
import { useThoughtOrganizer } from './useThoughtOrganizer';
import { ImportFromThoughtDownload } from './ImportFromThoughtDownload';
import { ThoughtOrganizeMode, type ThoughtOrganizeModeActions } from '@/components/dashboard/ThoughtOrganizeMode';
import { addImportMetadata, type ThoughtBullet, type ThoughtOrganization } from '@/lib/thought-organization';
import { nanoid } from 'nanoid';

export function OrganizeView() {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const organizerRef = useRef<ThoughtOrganizeModeActions>(null);


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
