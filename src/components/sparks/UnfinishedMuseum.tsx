'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

export type MuseumItem = {
  id: string;
  title: string;
  note?: string;
  createdAt: string;
};

interface UnfinishedMuseumProps {
  items: MuseumItem[];
  onAddItem: (item: Omit<MuseumItem, 'id' | 'createdAt'>) => void;
  onRemoveItem: (id: string) => void;
  prefersReducedMotion?: boolean;
}

export function UnfinishedMuseum({
  items,
  onAddItem,
  onRemoveItem,
  prefersReducedMotion = false,
}: UnfinishedMuseumProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      title: newTitle.trim(),
      note: newNote.trim() || undefined,
    });

    setNewTitle('');
    setNewNote('');
    setIsAddingNew(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      };

  const itemAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 10 },
        transition: { duration: 0.2 },
      };

  return (
    <div className="rounded-2xl border border-accent-amethyst/20 bg-accent-amethyst/[0.04] backdrop-blur-sm overflow-hidden">
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={isExpanded}
        aria-controls="museum-content"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-amethyst/10">
            <Archive className="h-5 w-5 text-accent-amethyst" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text">Unfinished Things Museum</h3>
            <p className="text-sm text-text-muted">
              {items.length === 0
                ? 'A place for projects that mattered'
                : `${items.length} ${items.length === 1 ? 'thing' : 'things'} honored here`}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-text-muted" />
        ) : (
          <ChevronDown className="h-5 w-5 text-text-muted" />
        )}
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div id="museum-content" {...animationProps} className="overflow-hidden">
            <div className="px-5 pb-5 space-y-4">
              {/* Philosophy note */}
              <p className="text-xs text-text-muted italic border-l-2 border-accent-amethyst/30 pl-3">
                This is not a graveyard. It's a museum. These things existed. They mattered.
                They don't need to be finished to have been worth starting.
              </p>

              {/* Add button or form */}
              <AnimatePresence mode="wait">
                {isAddingNew ? (
                  <motion.form
                    key="form"
                    {...itemAnimation}
                    onSubmit={handleSubmit}
                    className="space-y-3 p-4 rounded-xl bg-white/[0.04] border border-border-subtle"
                  >
                    <div>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="What did you start?"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-border-subtle
                          text-text placeholder:text-text-muted text-sm
                          focus:outline-none focus:ring-2 focus:ring-accent-amethyst focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    <div>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Why did it matter? What did you learn? (optional)"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-border-subtle
                          text-text placeholder:text-text-muted text-sm resize-none
                          focus:outline-none focus:ring-2 focus:ring-accent-amethyst focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!newTitle.trim()}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold
                          bg-accent-amethyst text-bg-base
                          hover:bg-accent-amethyst/90 disabled:opacity-40 disabled:cursor-not-allowed
                          transition-all duration-200"
                      >
                        Add to museum
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNew(false);
                          setNewTitle('');
                          setNewNote('');
                        }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold
                          text-text-muted hover:text-text hover:bg-white/[0.04]
                          transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.button
                    key="add-button"
                    {...itemAnimation}
                    type="button"
                    onClick={() => setIsAddingNew(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                      text-sm font-semibold text-accent-amethyst bg-accent-amethyst/10
                      hover:bg-accent-amethyst/20 border border-dashed border-accent-amethyst/30
                      transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-amethyst focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                  >
                    <Plus className="h-4 w-4" />
                    Honor something unfinished
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Museum items */}
              {items.length > 0 && (
                <div className="space-y-2">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        {...itemAnimation}
                        className="group relative p-4 rounded-xl bg-white/[0.03] border border-border-subtle hover:bg-white/[0.05] transition-colors"
                      >
                        <div className="pr-8">
                          <h4 className="text-sm font-medium text-text">{item.title}</h4>
                          {item.note && (
                            <p className="text-xs text-text-muted mt-1 leading-relaxed">
                              {item.note}
                            </p>
                          )}
                          <p className="text-[10px] text-text-muted/60 mt-2 uppercase tracking-wider">
                            Added {formatDate(item.createdAt)}
                          </p>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg
                            opacity-0 group-hover:opacity-100
                            text-text-muted hover:text-text hover:bg-white/10
                            transition-all duration-200"
                          aria-label={`Remove ${item.title} from museum`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Empty state */}
              {items.length === 0 && !isAddingNew && (
                <p className="text-sm text-text-muted text-center py-4">
                  Nothing here yet. And that's okay too.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
