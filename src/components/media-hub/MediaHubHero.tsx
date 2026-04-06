'use client';

import { useState, useCallback } from 'react';
import { Shuffle, Sparkles, ChevronRight, Zap, Coffee, Sofa } from 'lucide-react';
import {
  getRandomSuggestion,
  MEDIA_TYPE_CONFIG,
  ENERGY_LEVEL_CONFIG,
  type MediaHubStore,
  type MediaItem,
  type EnergyLevel,
} from '@/lib/media-hub';

interface MediaHubHeroProps {
  store: MediaHubStore;
  onMoveToActive: (id: string) => void;
  onTouch: (id: string) => void;
}

const ENERGY_ICONS: Record<EnergyLevel, typeof Zap> = {
  high: Zap,
  medium: Coffee,
  low: Sofa,
};

export function MediaHubHero({ store, onMoveToActive, onTouch }: MediaHubHeroProps) {
  const [suggestion, setSuggestion] = useState<MediaItem | null>(null);
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel | undefined>(undefined);
  const [isRevealed, setIsRevealed] = useState(false);

  const hasItems = store.mediaItems.some(
    (m) => m.status === 'active' || m.status === 'on-deck',
  );

  const shuffleItem = useCallback(() => {
    const item = getRandomSuggestion(store, energyFilter, suggestion?.id);
    setSuggestion(item);
    setIsRevealed(true);
  }, [store, energyFilter, suggestion?.id]);

  const handleLetsGo = () => {
    if (!suggestion) return;
    if (suggestion.status === 'on-deck') {
      onMoveToActive(suggestion.id);
    } else {
      onTouch(suggestion.id);
    }
    setSuggestion(null);
    setIsRevealed(false);
  };

  const handleShuffle = () => {
    shuffleItem();
  };

  if (!hasItems) return null;

  const typeConfig = suggestion ? MEDIA_TYPE_CONFIG[suggestion.type] : null;

  return (
    <section className="media-hub-hero">
      {!isRevealed ? (
        /* ---- Collapsed state: big CTA ---- */
        <button
          type="button"
          onClick={shuffleItem}
          className="media-hub-hero-cta"
        >
          <div className="media-hub-hero-cta-glow" />
          <div className="media-hub-hero-cta-content">
            <div className="media-hub-hero-cta-icon-wrap">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="media-hub-hero-cta-text">
              <h2 className="media-hub-hero-cta-title">What should I do?</h2>
              <p className="media-hub-hero-cta-subtitle">
                Can&apos;t decide? Let me pick for you.
              </p>
            </div>
            <div className="media-hub-hero-cta-action">
              <span>Surprise Me</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      ) : (
        /* ---- Expanded state: suggestion card ---- */
        <div className="media-hub-hero-card">
          {/* Energy filter pills */}
          <div className="media-hub-hero-energy-row">
            <span className="media-hub-hero-energy-label">Energy:</span>
            <div className="media-hub-hero-energy-pills">
              {(Object.entries(ENERGY_LEVEL_CONFIG) as [EnergyLevel, typeof ENERGY_LEVEL_CONFIG.low][]).map(
                ([level, config]) => {
                  const Icon = ENERGY_ICONS[level];
                  const isActive = energyFilter === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setEnergyFilter(isActive ? undefined : level);
                        // Re-shuffle with new filter
                        const item = getRandomSuggestion(
                          store,
                          isActive ? undefined : level,
                          suggestion?.id,
                        );
                        setSuggestion(item);
                      }}
                      className={`media-hub-hero-energy-pill ${isActive ? 'media-hub-hero-energy-pill--active' : ''}`}
                      data-level={level}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{config.emoji}</span>
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {suggestion ? (
            <div className="media-hub-hero-suggestion">
              <div className="media-hub-hero-suggestion-media">
                {suggestion.coverUrl ? (
                  <div className="media-hub-hero-suggestion-cover-wrapper">
                    <img 
                      src={suggestion.coverUrl} 
                      alt={suggestion.title}
                      className="media-hub-hero-suggestion-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="media-hub-hero-suggestion-emoji">
                    {suggestion.coverEmoji || typeConfig?.emoji || '✨'}
                  </div>
                )}
              </div>

              {/* Type badge */}
              <span className="media-hub-hero-suggestion-type">
                {typeConfig?.label}
              </span>

              {/* Title */}
              <h2 className="media-hub-hero-suggestion-title">
                {suggestion.title}
              </h2>

              {suggestion.author?.trim() && (
                <p className="text-sm text-text-muted mt-1 text-center max-w-md mx-auto line-clamp-2">
                  {suggestion.author.trim()}
                </p>
              )}

              {/* Notes preview */}
              {suggestion.notes && (
                <p className="media-hub-hero-suggestion-notes">
                  {suggestion.notes}
                </p>
              )}

              {/* Energy badge */}
              {suggestion.energyLevel && (
                <span
                  className="media-hub-hero-suggestion-energy"
                  data-level={suggestion.energyLevel}
                >
                  {ENERGY_LEVEL_CONFIG[suggestion.energyLevel].emoji}{' '}
                  {ENERGY_LEVEL_CONFIG[suggestion.energyLevel].label}
                </span>
              )}
            </div>
          ) : (
            <div className="media-hub-hero-empty">
              <p>Nothing matches that energy level right now.</p>
              <p className="media-hub-hero-empty-hint">
                Try removing the energy filter, or add energy tags to your items.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="media-hub-hero-actions">
            <button
              type="button"
              onClick={handleShuffle}
              className="media-hub-hero-action-shuffle"
            >
              <Shuffle className="w-5 h-5" />
              <span>Not this one</span>
            </button>
            {suggestion && (
              <button
                type="button"
                onClick={handleLetsGo}
                className="media-hub-hero-action-go"
              >
                <span>Let&apos;s go</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => {
              setIsRevealed(false);
              setSuggestion(null);
            }}
            className="media-hub-hero-dismiss"
          >
            Nevermind, I&apos;ll browse
          </button>
        </div>
      )}
    </section>
  );
}
