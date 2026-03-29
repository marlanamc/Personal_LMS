'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Download, AlertCircle } from 'lucide-react';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { getTodayKey } from '@/lib/unified-scheduler';
import type { ThoughtBullet } from '@/lib/thought-organization';
import { extractBullets, isDuplicateBullet } from '@/lib/thought-organization';

interface ImportFromThoughtDownloadProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (bullets: ThoughtBullet[], sourceDateKey: string) => void;
  existingBullets: ThoughtBullet[];
}

export function ImportFromThoughtDownload({
  isOpen,
  onClose,
  onImport,
  existingBullets,
}: ImportFromThoughtDownloadProps) {
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [selectedBulletIds, setSelectedBulletIds] = useState<Set<string>>(new Set());

  const { getPlan } = useCalendarPlanner('default');
  const plan = getPlan(selectedDateKey);
  const thoughtDownload = plan.thoughtDownload ?? '';

  // Parse bullets from the selected day's thought download
  const parsedBullets = useMemo(() => {
    const bullets = extractBullets(thoughtDownload);
    return bullets.map((parsed, idx) => ({
      id: `import-${selectedDateKey}-${idx}`,
      text: parsed.text,
      lineNumber: parsed.lineNumber,
      displayOrder: idx,
      priority: undefined,
      lane: undefined,
      project: undefined,
      projectMeta: undefined,
    } as ThoughtBullet));
  }, [thoughtDownload, selectedDateKey]);

  // Check for duplicates
  const duplicateInfo = useMemo(() => {
    const duplicates = parsedBullets.filter((bullet) =>
      isDuplicateBullet(bullet, existingBullets)
    );
    return {
      count: duplicates.length,
      bulletIds: new Set(duplicates.map((b) => b.id)),
    };
  }, [parsedBullets, existingBullets]);

  const handleToggleBullet = (bulletId: string) => {
    setSelectedBulletIds((prev) => {
      const next = new Set(prev);
      if (next.has(bulletId)) {
        next.delete(bulletId);
      } else {
        next.add(bulletId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedBulletIds(new Set(parsedBullets.map((b) => b.id)));
  };

  const handleSelectNone = () => {
    setSelectedBulletIds(new Set());
  };

  const handleImport = () => {
    const bulletsToImport = parsedBullets.filter((bullet) =>
      selectedBulletIds.has(bullet.id)
    );
    onImport(bulletsToImport, selectedDateKey);
    setSelectedBulletIds(new Set());
    onClose();
  };

  const selectedDate = useMemo(
    () => new Date(`${selectedDateKey}T12:00:00`),
    [selectedDateKey]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-2xl rounded-2xl border border-border-subtle/60 bg-bg-elevated/95 p-6 sm:p-8"
          style={{
            boxShadow: 'var(--shadow-organize-card-hover), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(var(--blur-glass-lg))',
            WebkitBackdropFilter: 'blur(var(--blur-glass-lg))',
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-modal-title"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Import
              </p>
              <h3 id="import-modal-title" className="mt-2 text-xl font-display font-bold text-text">
                Import from Thought Download
              </h3>
              <p className="mt-2 text-sm text-text-muted/90 leading-relaxed">
                Select bullets from any day's thought download to bring into your organize workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border-subtle/80 p-2.5 text-text-muted transition-all hover:bg-bg-surface hover:text-text hover:scale-110"
              aria-label="Close import dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Date Picker */}
          <div className="mb-5">
            <label htmlFor="import-date" className="mb-2.5 block text-xs font-semibold text-text-muted uppercase tracking-wide">
              Select Date
            </label>
            <input
              id="import-date"
              type="date"
              value={selectedDateKey}
              onChange={(e) => {
                setSelectedDateKey(e.target.value || todayKey);
                setSelectedBulletIds(new Set());
              }}
              className="w-full rounded-xl border border-border-subtle/80 bg-bg-surface/80 px-4 py-3 text-sm font-medium text-text transition-all focus:border-primary focus:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="mt-2.5 text-sm text-text-muted/90">
              {selectedDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Duplicate Warning */}
          {duplicateInfo.count > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 rounded-xl border border-accent/40 bg-accent/12 p-4 flex items-start gap-3"
              style={{ boxShadow: '0 2px 8px rgba(168, 137, 199, 0.15)' }}
            >
              <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-text leading-relaxed">
                <strong className="font-bold">{duplicateInfo.count}</strong> bullet{duplicateInfo.count !== 1 ? 's' : ''}{' '}
                already exist in your organize workspace (matching by text).
              </p>
            </motion.div>
          )}

          {/* Bullet List */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-text">
                Bullets from this day ({parsedBullets.length})
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Select All
                </button>
                <span className="text-text-muted">•</span>
                <button
                  type="button"
                  onClick={handleSelectNone}
                  className="text-xs font-medium text-text-muted hover:text-text hover:underline"
                >
                  Select None
                </button>
              </div>
            </div>

            {parsedBullets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-surface/40 p-8 text-center">
                <p className="text-sm font-medium text-text-muted">No bullets found</p>
                <p className="mt-1 text-xs text-text-muted/70">
                  This day's thought download doesn't have any list items.
                </p>
              </div>
            ) : (
              <div className="max-h-[20rem] overflow-y-auto rounded-2xl border border-border-subtle bg-bg-surface p-2 space-y-1">
                {parsedBullets.map((bullet) => {
                  const isSelected = selectedBulletIds.has(bullet.id);
                  const isDuplicate = duplicateInfo.bulletIds.has(bullet.id);

                  return (
                    <label
                      key={bullet.id}
                      className={`flex items-start gap-3 rounded-xl p-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-bg-elevated border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleBullet(bullet.id)}
                        className="mt-0.5 h-4 w-4 rounded border-border-subtle text-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text">{bullet.text}</p>
                        {isDuplicate && (
                          <p className="mt-1 text-[10px] text-accent font-medium">
                            Already exists
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border-subtle/70 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={selectedBulletIds.size === 0}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Import {selectedBulletIds.size > 0 ? `(${selectedBulletIds.size})` : ''}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
