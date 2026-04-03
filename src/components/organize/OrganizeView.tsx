'use client';

import { useState, useCallback } from 'react';
import { Download, Plus, Check, Cloud, ListTree } from 'lucide-react';
import { useThoughtOrganizer } from './useThoughtOrganizer';
import { ImportFromThoughtDownload } from './ImportFromThoughtDownload';
import { ThoughtOrganizeMode } from '@/components/dashboard/ThoughtOrganizeMode';
import { addImportMetadata, type ThoughtBullet, type ThoughtOrganization } from '@/lib/thought-organization';
import { nanoid } from 'nanoid';

export function OrganizeView() {
  const { organization, isLoaded, isSaving, saveError, lastSyncedAt, updateOrganization } =
    useThoughtOrganizer();
  const [showImportModal, setShowImportModal] = useState(false);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 pb-4 animate-organize-fade-in-up">
        <header className="flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-accent-teal/12 border border-accent-teal/25 flex items-center justify-center transition-all duration-200 hover:scale-105"
               style={{ boxShadow: '0 4px 12px rgba(79, 140, 158, 0.15)' }}>
            <ListTree className="w-6 h-6 text-accent-teal" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-text tracking-tight">Organize</h1>
            <p className="text-sm text-text-muted/90 mt-1">Cross-day project workspace</p>
          </div>
        </header>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle/80 bg-bg-elevated/90 px-5 py-2.5 text-sm font-semibold text-text transition-all hover:bg-bg-elevated hover:scale-105 hover:border-border-subtle"
            style={{ boxShadow: 'var(--shadow-organize-card)' }}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Import from Thought Download</span>
            <span className="sm:hidden">Import</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6">
        {organization.bullets.length === 0 && organization.projects.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh] animate-organize-scale-in">
            <div className="max-w-md text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-accent-teal/15 border border-accent-teal/30 flex items-center justify-center mb-6 transition-all hover:scale-105"
                   style={{ boxShadow: '0 8px 24px rgba(79, 140, 158, 0.2)' }}>
                <ListTree className="w-10 h-10 text-accent-teal" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text mb-3">Welcome to Organize!</h2>
              <p className="text-base text-text-muted/90 mb-8 leading-relaxed">
                This is your cross-day project workspace. Organize thoughts from any day into projects
                with Now, Next, Later, and Done lanes.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-primary/90 shadow-lg hover:shadow-xl"
                >
                  <Download className="h-5 w-5" />
                  Import from Thought Download
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border-subtle bg-bg-surface/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm overflow-hidden">
            <ThoughtOrganizeMode
              organization={organization}
              onUpdateOrganization={handleUpdateOrganization}
              isInline={true}
              standalone={true}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-surface/60 border border-border-subtle/60"
             style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="min-h-[1.25rem] text-xs font-semibold text-text-muted flex items-center gap-2">
            {saveError ? (
              <span className="text-error">{saveError}</span>
            ) : isSaving ? (
              <>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Saving to cloud…</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-accent-teal" />
                <span className="flex items-center gap-1.5">
                  Synced to cloud
                  {lastSyncedAt &&
                    <span className="text-text-muted/70">
                      • {lastSyncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  }
                </span>
              </>
            )}
          </div>
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
