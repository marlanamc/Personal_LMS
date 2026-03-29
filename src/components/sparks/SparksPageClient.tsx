'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { GentleBodyCheckIn } from './GentleBodyCheckIn';
import { SparkCardDeck } from './SparkCardDeck';
import { RandomDelightWheel } from './RandomDelightWheel';
import { SensoryResetGuide } from './SensoryResetGuide';
import { CurrentSparksPanel, sparkFromPrompt, type SavedSpark } from './CurrentSparksPanel';
import { UnfinishedMuseum, type MuseumItem } from './UnfinishedMuseum';
import { CelebrationCorner, type GamificationStats } from './CelebrationCorner';
import { AffirmationDrawer } from './AffirmationDrawer';
import { useSparks } from './useSparks';
import type { SparkPrompt } from './spark-content';

interface SparksPageClientProps {
  storageScope: string;
  initialStats: GamificationStats | null;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }
  }, []);

  return prefersReducedMotion;
}

export function SparksPageClient({ storageScope, initialStats }: SparksPageClientProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    savedSparks,
    savedSparkIds,
    addSpark,
    removeSpark,
    museumItems,
    addMuseumItem,
    removeMuseumItem,
    isLoaded,
  } = useSparks(storageScope);

  const handleSavePrompt = useCallback(
    (prompt: SparkPrompt) => {
      // Check if already saved
      if (savedSparkIds.has(prompt.id)) {
        // Remove it
        const existing = savedSparks.find((s) => s.sourcePromptId === prompt.id);
        if (existing) {
          removeSpark(existing.id);
        }
      } else {
        // Add it
        addSpark(sparkFromPrompt(prompt));
      }
    },
    [savedSparkIds, savedSparks, addSpark, removeSpark]
  );

  const handleAddCustomSpark = useCallback(
    (spark: Omit<SavedSpark, 'id' | 'createdAt'>) => {
      addSpark(spark);
    },
    [addSpark]
  );

  const handleAddMuseumItem = useCallback(
    (item: Omit<MuseumItem, 'id' | 'createdAt'>) => {
      addMuseumItem(item);
    },
    [addMuseumItem]
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header section */}
      <section className="card-elevated relative overflow-hidden rounded-[2rem] px-5 py-6 sm:px-7 sm:py-8">
        {/* Decorative gradient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.85,
            background:
              'radial-gradient(circle at top right, color-mix(in srgb, var(--color-accent-sakura) 10%, transparent) 0%, transparent 40%), radial-gradient(circle at left bottom, color-mix(in srgb, var(--color-accent-amethyst) 8%, transparent) 0%, transparent 50%), linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, white 4%) 0%, color-mix(in srgb, var(--color-bg-elevated) 94%, var(--color-accent-teal) 6%) 100%)',
          }}
        />

        <div className="relative space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-accent-sakura/15 border border-accent-sakura/20">
                  <Sparkles className="h-6 w-6 text-accent-sakura" />
                </div>
                <h1 className="text-[2rem] leading-none font-display font-semibold text-text sm:text-[2.5rem]">
                  Sparks
                </h1>
              </div>
              <p className="max-w-lg text-base leading-relaxed text-text-secondary">
                Your brain runs on interest. Let's find some.
              </p>
              <p className="text-sm text-text-muted italic">
                All brains welcome. This one's built for the spicy ones.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>
      </section>

      {/* Body check-in - collapsible */}
      <GentleBodyCheckIn prefersReducedMotion={prefersReducedMotion} />

      {/* Sensory Reset Guide */}
      <SensoryResetGuide prefersReducedMotion={prefersReducedMotion} />

      {/* Spark Cards - main feature */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-semibold text-text">Find a spark</h2>
          <p className="text-sm text-text-muted">
            Curiosity prompts to reignite your interest
          </p>
        </div>
        <SparkCardDeck
          savedSparkIds={savedSparkIds}
          onSaveSpark={handleSavePrompt}
          prefersReducedMotion={prefersReducedMotion}
        />
      </section>

      {/* Random Delight */}
      <RandomDelightWheel prefersReducedMotion={prefersReducedMotion} />

      {/* Current Sparks - saved interests */}
      {isLoaded && (
        <CurrentSparksPanel
          savedSparks={savedSparks}
          onAddSpark={handleAddCustomSpark}
          onRemoveSpark={removeSpark}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      {/* Unfinished Things Museum */}
      {isLoaded && (
        <UnfinishedMuseum
          items={museumItems}
          onAddItem={handleAddMuseumItem}
          onRemoveItem={removeMuseumItem}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      {/* Celebration Corner - past wins */}
      <CelebrationCorner stats={initialStats} prefersReducedMotion={prefersReducedMotion} />

      {/* Affirmation Drawer */}
      <AffirmationDrawer prefersReducedMotion={prefersReducedMotion} />
    </div>
  );
}
