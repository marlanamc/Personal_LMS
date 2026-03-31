'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Flame } from 'lucide-react';
import type { SparkPrompt } from './spark-content';
import { CATEGORY_CONFIG } from './spark-content';

export type SavedSpark = {
  id: string;
  text: string;
  emoji?: string;
  color: 'sakura' | 'teal' | 'mint' | 'amethyst';
  createdAt: string;
  sourcePromptId?: string; // If saved from a prompt
};

interface CurrentSparksPanelProps {
  savedSparks: SavedSpark[];
  onAddSpark: (spark: Omit<SavedSpark, 'id' | 'createdAt'>) => void;
  onRemoveSpark: (id: string) => void;
  prefersReducedMotion?: boolean;
}

const COLOR_OPTIONS: { id: SavedSpark['color']; label: string; class: string }[] = [
  { id: 'sakura', label: 'Sakura', class: 'bg-accent-sakura' },
  { id: 'teal', label: 'Teal', class: 'bg-accent-teal' },
  { id: 'mint', label: 'Mint', class: 'bg-accent-mint' },
  { id: 'amethyst', label: 'Amethyst', class: 'bg-accent-amethyst' },
];

const EMOJI_OPTIONS = ['✨', '🔥', '💡', '🌟', '💜', '🌈', '🎯', '🧠'];

export function CurrentSparksPanel({
  savedSparks,
  onAddSpark,
  onRemoveSpark,
  prefersReducedMotion = false,
}: CurrentSparksPanelProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSparkText, setNewSparkText] = useState('');
  const [selectedColor, setSelectedColor] = useState<SavedSpark['color']>('sakura');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('✨');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSparkText.trim()) return;

    onAddSpark({
      text: newSparkText.trim(),
      emoji: selectedEmoji,
      color: selectedColor,
    });

    setNewSparkText('');
    setIsAddingNew(false);
  };

  const getColorClass = (color: SavedSpark['color']) => {
    switch (color) {
      case 'sakura':
        return 'bg-accent-sakura/15 border-accent-sakura/30 text-accent-sakura';
      case 'teal':
        return 'bg-accent-teal/15 border-accent-teal/30 text-accent-teal';
      case 'mint':
        return 'bg-accent-mint/15 border-accent-mint/30 text-accent-mint';
      case 'amethyst':
        return 'bg-accent-amethyst/15 border-accent-amethyst/30 text-accent-amethyst';
      default:
        return 'bg-white/10 border-white/20 text-text';
    }
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.2 },
      };

  return (
    <div className="rounded-2xl border border-border-subtle bg-white/[0.04] backdrop-blur-sm p-5 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-sakura/10">
              <Flame className="h-5 w-5 text-accent-sakura" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text">Current Sparks</h3>
              <p className="text-sm text-text-muted">Your saved interests</p>
            </div>
          </div>

          {!isAddingNew && (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                text-sm font-semibold text-accent-sakura bg-accent-sakura/10
                hover:bg-accent-sakura/20 transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>

        {/* Add new spark form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.form
              {...animationProps}
              onSubmit={handleSubmit}
              className="space-y-3 p-4 rounded-xl bg-white/[0.04] border border-border-subtle"
            >
              <input
                type="text"
                value={newSparkText}
                onChange={(e) => setNewSparkText(e.target.value)}
                placeholder="What lights you up?"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-border-subtle
                  text-text placeholder:text-text-muted text-sm
                  focus:outline-none focus:ring-2 focus:ring-accent-sakura focus:border-transparent"
                autoFocus
              />

              {/* Emoji picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Emoji:</span>
                <div className="flex gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`p-1.5 rounded-lg text-lg transition-all ${
                        selectedEmoji === emoji
                          ? 'bg-white/10 scale-110'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Color:</span>
                <div className="flex gap-1.5">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-6 h-6 rounded-full ${color.class} transition-all ${
                        selectedColor === color.id
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-base scale-110'
                          : 'hover:scale-105'
                      }`}
                      aria-label={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!newSparkText.trim()}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-accent-sakura text-bg-base
                    hover:bg-accent-sakura/90 disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200"
                >
                  Save spark
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewSparkText('');
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold
                    text-text-muted hover:text-text hover:bg-white/[0.04]
                    transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Saved sparks list */}
        {savedSparks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {savedSparks.map((spark) => (
                <motion.div
                  key={spark.id}
                  {...animationProps}
                  layout
                  className={`group inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${getColorClass(
                    spark.color
                  )}`}
                >
                  {spark.emoji && <span className="text-sm">{spark.emoji}</span>}
                  <span className="text-sm font-medium text-text max-w-[200px] truncate">
                    {spark.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveSpark(spark.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-all"
                    aria-label={`Remove ${spark.text}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-sm text-text-muted text-center py-4 italic">
            No sparks saved yet. That's okay.
          </p>
        )}
      </div>
    </div>
  );
}

// Helper to create a SavedSpark from a SparkPrompt
export function sparkFromPrompt(prompt: SparkPrompt): Omit<SavedSpark, 'id' | 'createdAt'> {
  const categoryToColor: Record<string, SavedSpark['color']> = {
    wonder: 'teal',
    memory: 'sakura',
    sensory: 'mint',
    future: 'amethyst',
    micro: 'sakura',
  };

  return {
    text: prompt.text,
    color: categoryToColor[prompt.category] || 'sakura',
    sourcePromptId: prompt.id,
  };
}
