'use client';

import { useState } from 'react';
import { X, FolderKanban, Check } from 'lucide-react';
import type { ThoughtBullet } from '@/lib/thought-organization';

interface QuickOrganizeModalProps {
  bullets: string[];
  sourceDateKey: string;
  projects: Array<{ id: string; label: string; color: string }>;
  onImport: (selectedBullets: string[], projectId: string, lane: 'now' | 'next' | 'later') => void;
  onDismiss: () => void;
}

export function QuickOrganizeModal({
  bullets,
  sourceDateKey,
  projects,
  onImport,
  onDismiss,
}: QuickOrganizeModalProps) {
  const [selectedBullets, setSelectedBullets] = useState<Set<number>>(
    new Set(bullets.map((_, i) => i))
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [selectedLane, setSelectedLane] = useState<'now' | 'next' | 'later'>('now');

  const toggleBullet = (index: number) => {
    const newSelected = new Set(selectedBullets);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedBullets(newSelected);
  };

  const handleImport = () => {
    const bulletsToImport = bullets.filter((_, i) => selectedBullets.has(i));
    onImport(bulletsToImport, selectedProjectId, selectedLane);
    onDismiss();
  };

  const formattedDate = new Date(`${sourceDateKey}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-bg-surface rounded-2xl shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Quick Organize</h2>
              <p className="text-sm text-muted-foreground">
                Found {bullets.length} bullet{bullets.length !== 1 ? 's' : ''} from {formattedDate}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Bullets Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select bullets to organize
            </label>
            <div className="space-y-2">
              {bullets.map((bullet, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border-subtle hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBullets.has(index)}
                    onChange={() => toggleBullet(index)}
                    className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="flex-1 text-sm text-foreground">{bullet}</span>
                  {selectedBullets.has(index) && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <label htmlFor="project-select" className="block text-sm font-medium text-foreground mb-2">
              Assign to project
            </label>
            <select
              id="project-select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border-subtle bg-bg-surface text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lane Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Priority lane
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['now', 'next', 'later'] as const).map((lane) => (
                <button
                  key={lane}
                  onClick={() => setSelectedLane(lane)}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                    selectedLane === lane
                      ? 'border-primary bg-primary text-white'
                      : 'border-border-subtle bg-bg-surface text-foreground hover:bg-primary/5'
                  }`}
                >
                  {lane.charAt(0).toUpperCase() + lane.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle bg-bg-elevated/50">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleImport}
            disabled={selectedBullets.size === 0 || !selectedProjectId}
            className="px-6 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Import {selectedBullets.size} bullet{selectedBullets.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
