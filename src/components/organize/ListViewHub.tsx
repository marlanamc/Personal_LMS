'use client';

import { useState, useRef, useCallback } from 'react';
import { Download, Plus, Eye, EyeOff } from 'lucide-react';
import { ThoughtOrganizeMode, type ThoughtOrganizeModeActions } from '@/components/dashboard/ThoughtOrganizeMode';
import { ImportFromThoughtDownload } from './ImportFromThoughtDownload';
import { OrganizeHeaderPortal } from './OrganizeHeaderSlot';
import { addImportMetadata, type ThoughtBullet, type ThoughtOrganization } from '@/lib/thought-organization';
import { nanoid } from 'nanoid';

interface ListViewHubProps {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  showDone: boolean;
  onToggleShowDone: () => void;
}

export function ListViewHub({
  organization,
  onUpdateOrganization,
  showDone,
  onToggleShowDone,
}: ListViewHubProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const organizerRef = useRef<ThoughtOrganizeModeActions>(null);

  const handleImport = useCallback(
    (bullets: ThoughtBullet[], sourceDateKey: string) => {
      // Add import metadata and generate new IDs for imported bullets
      const newBullets = bullets.map((bullet, index) =>
        addImportMetadata(
          {
            ...bullet,
            id: nanoid(),
            displayOrder: organization.bullets.length + index,
          },
          sourceDateKey
        )
      );

      onUpdateOrganization({
        ...organization,
        bullets: [...organization.bullets, ...newBullets],
      });
    },
    [organization, onUpdateOrganization]
  );

  return (
    <div className="flex h-full flex-col">
      <OrganizeHeaderPortal>
        <button
          type="button"
          onClick={onToggleShowDone}
          className={`flow-header-btn ${showDone ? 'is-open' : ''}`}
          title={showDone ? 'Hide completed tasks' : 'Show completed tasks'}
          aria-pressed={showDone}
        >
          {showDone ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{showDone ? 'Hide done' : 'Show done'}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowImportModal(true)}
          className="flow-header-btn"
          title="Import tasks from a Thought download"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button
          type="button"
          onClick={() => organizerRef.current?.openCreateProject()}
          className="flow-header-btn flow-header-btn-primary"
          title="Create a new project"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New project</span>
        </button>
      </OrganizeHeaderPortal>

      {/* List View Content */}
      <div className="flex-1 overflow-hidden px-0 sm:px-6 pb-0 sm:pb-6">
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

      {/* Import Modal (local to list view) */}
      <ImportFromThoughtDownload
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        existingBullets={organization.bullets}
      />
    </div>
  );
}
