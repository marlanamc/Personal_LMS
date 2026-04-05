'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { X } from 'lucide-react';
import { THREAD_COLORS, type ThreadColor, type ThreadInput } from '@/lib/threads';

const AVAILABLE_COLORS: ThreadColor[] = ['sakura', 'mint', 'amethyst', 'teal', 'rose', 'slate'];

// Common emoji suggestions for threads
const EMOJI_SUGGESTIONS = ['', '💼', '🎨', '📚', '🎯', '🌱', '✨', '🔮', '🎵', '💪', '🧘', '🏠', '💻'];

interface AddThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ThreadInput) => void;
}

export function AddThreadModal({ isOpen, onClose, onSubmit }: AddThreadModalProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState<ThreadColor>('sakura');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        emoji: emoji || null,
        color,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setEmoji('');
      setColor('sakura');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[3px]"
          onClick={onClose}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2 }}
            className="w-full max-w-md rounded-[1.75rem] border border-border-subtle/70 bg-bg-elevated/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-thread-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="add-thread-title"
                  className="text-lg font-semibold text-text"
                >
                  Add a new thread
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  What&apos;s pulling at your attention?
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border-subtle/70 p-2 text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Title input */}
              <div>
                <label
                  htmlFor="thread-title"
                  className="mb-2 block text-xs font-medium text-text-muted"
                >
                  What is it?
                </label>
                <input
                  id="thread-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Learning Spanish, Job search, Apartment hunt..."
                  maxLength={100}
                  className="w-full rounded-2xl border border-border-subtle bg-bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                  required
                />
              </div>

              {/* Emoji picker */}
              <div>
                <label className="mb-2 block text-xs font-medium text-text-muted">
                  Give it a symbol (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_SUGGESTIONS.map((e) => (
                    <button
                      key={e || 'none'}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition-all ${
                        emoji === e
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                          : 'border-border-subtle/50 bg-bg-surface/50 hover:bg-bg-surface hover:border-border-subtle'
                      }`}
                    >
                      {e || (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="mb-2 block text-xs font-medium text-text-muted">
                  Thread color
                </label>
                <div className="flex gap-2">
                  {AVAILABLE_COLORS.map((c) => {
                    const colorConfig = THREAD_COLORS[c];
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`h-10 w-10 rounded-xl border transition-all ${
                          color === c
                            ? 'border-white/50 ring-2 ring-primary/30 ring-offset-2 ring-offset-bg-elevated scale-105'
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

              {/* Description (optional) */}
              <div>
                <label
                  htmlFor="thread-description"
                  className="mb-2 block text-xs font-medium text-text-muted"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="thread-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any context you want to remember..."
                  maxLength={280}
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-border-subtle bg-bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-border-subtle/40 bg-bg-base/50 p-4">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-muted/60">
                  Preview
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${THREAD_COLORS[color].stroke}30, ${THREAD_COLORS[color].stroke}10)`,
                    }}
                  >
                    {emoji || (
                      <div
                        className="h-3 w-0.5 rounded-full"
                        style={{ backgroundColor: THREAD_COLORS[color].stroke }}
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium text-text">
                    {title || 'Your thread'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-border-subtle/70 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || isSubmitting}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add thread'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
