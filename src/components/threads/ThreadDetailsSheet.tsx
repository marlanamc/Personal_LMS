'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { X, Trash2, Archive, RotateCcw } from 'lucide-react';
import { THREAD_COLORS, type Thread, type ThreadColor } from '@/lib/threads';

// Simple relative time formatter
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'just now';
}

const AVAILABLE_COLORS: ThreadColor[] = ['sakura', 'mint', 'amethyst', 'teal', 'rose', 'slate'];
const EMOJI_SUGGESTIONS = ['', '💼', '🎨', '📚', '🎯', '🌱', '✨', '🔮', '🎵', '💪', '🧘', '🏠', '💻'];

interface ThreadDetailsSheetProps {
  thread: Thread | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Thread>) => void;
  onDelete: (id: string, archive?: boolean) => void;
}

export function ThreadDetailsSheet({
  thread,
  onClose,
  onUpdate,
  onDelete,
}: ThreadDetailsSheetProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState<ThreadColor>('sakura');
  const [isCore, setIsCore] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state when thread changes
  useEffect(() => {
    if (thread) {
      setTitle(thread.title);
      setDescription(thread.description || '');
      setEmoji(thread.emoji || '');
      setColor(thread.color);
      setIsCore(thread.isCore);
      setShowDeleteConfirm(false);
    }
  }, [thread]);

  const handleSave = () => {
    if (!thread || !title.trim()) return;

    onUpdate(thread.id, {
      title: title.trim(),
      description: description.trim() || null,
      emoji: emoji || null,
      color,
      isCore,
    });
    onClose();
  };

  const handleStatusChange = (newStatus: 'active' | 'resting') => {
    if (!thread) return;
    onUpdate(thread.id, { status: newStatus });
    onClose();
  };

  const handleDelete = (archive: boolean) => {
    if (!thread) return;
    onDelete(thread.id, archive);
    onClose();
  };

  const isOpen = thread !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
            transition={
              prefersReducedMotion
                ? { duration: 0.01 }
                : { type: 'spring', damping: 25, stiffness: 300 }
            }
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-[1.5rem] border-t border-border-subtle bg-bg-surface shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className="h-1 w-10 rounded-full bg-border-subtle" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${THREAD_COLORS[color].stroke}30, ${THREAD_COLORS[color].stroke}10)`,
                  }}
                >
                  {emoji || (
                    <div
                      className="h-4 w-0.5 rounded-full"
                      style={{ backgroundColor: THREAD_COLORS[color].stroke }}
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Edit Thread</h2>
                  {thread && (
                    <p className="text-xs text-text-muted">
                      Created {formatRelativeTime(new Date(thread.createdAt))}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border-subtle/70 p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-auto px-5 pb-8" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label htmlFor="edit-title" className="mb-2 block text-xs font-medium text-text-muted">
                    Title
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="w-full rounded-xl border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Emoji */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">
                    Symbol
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_SUGGESTIONS.map((e) => (
                      <button
                        key={e || 'none'}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-base transition-all ${
                          emoji === e
                            ? 'border-primary bg-primary/10 ring-1 ring-primary/20'
                            : 'border-border-subtle/50 bg-bg-base hover:bg-bg-surface'
                        }`}
                      >
                        {e || <span className="text-xs text-text-muted">—</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-text-muted">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {AVAILABLE_COLORS.map((c) => {
                      const colorConfig = THREAD_COLORS[c];
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`h-9 w-9 rounded-lg border transition-all ${
                            color === c
                              ? 'border-white/50 ring-2 ring-primary/30 ring-offset-1 ring-offset-bg-surface scale-105'
                              : 'border-white/10 hover:scale-102'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${colorConfig.hex}, ${colorConfig.hex}cc)`,
                          }}
                          title={colorConfig.label}
                          aria-label={`Select ${colorConfig.label} color`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="edit-description" className="mb-2 block text-xs font-medium text-text-muted">
                    Notes
                  </label>
                  <textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Any context..."
                    maxLength={280}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Core Thread Toggle */}
                <div className="rounded-xl border border-border-subtle/40 bg-bg-base/50 p-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isCore}
                      onChange={(e) => setIsCore(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border-subtle text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                        Core Thread
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        Foundational thread — thicker and more prominent. Other threads weave around it.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Status actions */}
                {thread && (
                  <div className="rounded-xl border border-border-subtle/40 bg-bg-base/50 p-4">
                    <p className="mb-3 text-xs font-medium text-text-muted">Quick actions</p>
                    <div className="flex flex-wrap gap-2">
                      {thread.status === 'resting' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange('active')}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Bring back to focus
                        </button>
                      )}
                      {thread.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange('resting')}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                        >
                          Let it rest
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Danger zone */}
                <div className="rounded-xl border border-error/20 bg-error/[0.03] p-4">
                  <p className="mb-3 text-xs font-medium text-error/80">Danger zone</p>
                  {showDeleteConfirm ? (
                    <div className="space-y-2">
                      <p className="text-sm text-text-muted">Are you sure? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(false)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-error px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete forever
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="rounded-full border border-border-subtle/60 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-bg-surface"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-bg-elevated"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-error/30 px-3 py-1.5 text-xs font-medium text-error/80 transition-colors hover:bg-error/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Save button */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-border-subtle/70 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!title.trim()}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
