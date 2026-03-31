'use client';

import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { SparkCard } from './SparkCard';
import { SPARK_PROMPTS, shuffleArray, type SparkPrompt, type SparkCategory } from './spark-content';

interface SparkCardDeckProps {
  savedSparkIds: Set<string>;
  onSaveSpark: (prompt: SparkPrompt) => void;
  prefersReducedMotion?: boolean;
}

const CATEGORY_FILTERS: { id: SparkCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'wonder', label: 'Wonder' },
  { id: 'memory', label: 'Memory' },
  { id: 'sensory', label: 'Sensory' },
  { id: 'future', label: 'Future' },
  { id: 'micro', label: 'Micro' },
];

export function SparkCardDeck({
  savedSparkIds,
  onSaveSpark,
  prefersReducedMotion = false,
}: SparkCardDeckProps) {
  const [categoryFilter, setCategoryFilter] = useState<SparkCategory | 'all'>('all');
  const [shuffledPrompts, setShuffledPrompts] = useState<SparkPrompt[]>(() =>
    shuffleArray(SPARK_PROMPTS)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter prompts by category
  const filteredPrompts = useMemo(() => {
    if (categoryFilter === 'all') return shuffledPrompts;
    return shuffledPrompts.filter((p) => p.category === categoryFilter);
  }, [shuffledPrompts, categoryFilter]);

  // Current prompt (with wraparound)
  const currentPrompt = filteredPrompts[currentIndex % filteredPrompts.length];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredPrompts.length);
  }, [filteredPrompts.length]);

  const handleShuffle = useCallback(() => {
    setShuffledPrompts(shuffleArray(SPARK_PROMPTS));
    setCurrentIndex(0);
  }, []);

  const handleCategoryChange = (category: SparkCategory | 'all') => {
    setCategoryFilter(category);
    setCurrentIndex(0);
  };

  if (!currentPrompt) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p>No prompts available. Try selecting a different category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider
              transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base
              ${
                categoryFilter === cat.id
                  ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/30'
                  : 'bg-white/[0.04] text-text-muted hover:bg-white/[0.08] hover:text-text-secondary border border-transparent'
              }
            `}
            aria-pressed={categoryFilter === cat.id}
          >
            {cat.label}
          </button>
        ))}

        {/* Shuffle button */}
        <button
          type="button"
          onClick={handleShuffle}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
            text-xs font-semibold text-text-muted hover:text-text-secondary
            bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          aria-label="Shuffle all prompts"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Shuffle
        </button>
      </div>

      {/* Card display */}
      <div className="relative min-h-[280px] sm:min-h-[320px]">
        <AnimatePresence mode="wait">
          <SparkCard
            key={currentPrompt.id}
            prompt={currentPrompt}
            onSave={onSaveSpark}
            onNext={handleNext}
            isSaved={savedSparkIds.has(currentPrompt.id)}
            prefersReducedMotion={prefersReducedMotion}
          />
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {filteredPrompts.slice(0, 8).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex % filteredPrompts.length
                ? 'w-6 bg-accent-teal'
                : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
        {filteredPrompts.length > 8 && (
          <span className="text-xs text-text-muted ml-1">
            +{filteredPrompts.length - 8}
          </span>
        )}
      </div>
    </div>
  );
}
