'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Headphones, Plus, X, Shuffle } from 'lucide-react';
import type { Podcast } from '@/lib/media-hub';
import { AddPodcastDialog } from './AddPodcastDialog';

interface GoToPodcastsSectionProps {
  podcasts: Podcast[];
  onAddPodcast: (name: string, category?: string, link?: string, coverUrl?: string) => void;
  onRemovePodcast: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; glow: 'pink' | 'mint' | 'lavender' | 'aqua' }> = {
  comedy: { bg: 'bg-primary/20', text: 'text-primary', glow: 'pink' },
  'true crime': { bg: 'bg-error/20', text: 'text-error', glow: 'pink' },
  educational: { bg: 'bg-secondary/20', text: 'text-secondary', glow: 'mint' },
  relaxing: { bg: 'bg-accent/20', text: 'text-accent', glow: 'lavender' },
  news: { bg: 'bg-info/20', text: 'text-info', glow: 'aqua' },
  storytelling: { bg: 'bg-accent/20', text: 'text-accent', glow: 'lavender' },
  interviews: { bg: 'bg-secondary/20', text: 'text-secondary', glow: 'mint' },
  motivation: { bg: 'bg-warning/20', text: 'text-warning', glow: 'pink' },
};

function getCategoryStyle(category?: string) {
  if (!category) return { bg: 'bg-text-muted/20', text: 'text-text-muted', glow: 'pink' as const };
  const lower = category.toLowerCase();
  return CATEGORY_COLORS[lower] ?? { bg: 'bg-text-muted/20', text: 'text-text-muted', glow: 'pink' as const };
}

function PodcastArtwork({
  url,
  iconClassName,
  imgClassName = 'h-14 w-14',
}: {
  url?: string;
  iconClassName: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (!url || failed) {
    return <Headphones className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconClassName}`} />;
  }

  return (
    <img
      src={url}
      alt=""
      className={`${imgClassName} flex-shrink-0 rounded-lg object-cover border border-white/10 bg-white/5`}
      onError={() => setFailed(true)}
    />
  );
}

export function GoToPodcastsSection({ podcasts, onAddPodcast, onRemovePodcast }: GoToPodcastsSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [shufflePick, setShufflePick] = useState<Podcast | null>(null);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemovingId(id);
    setTimeout(() => {
      onRemovePodcast(id);
      setRemovingId(null);
    }, 200);
  };

  const shufflePodcast = useCallback(() => {
    if (podcasts.length === 0) return;
    let pick = podcasts[Math.floor(Math.random() * podcasts.length)];
    if (podcasts.length > 1 && shufflePick && pick.id === shufflePick.id) {
      const filtered = podcasts.filter((p) => p.id !== shufflePick.id);
      pick = filtered[Math.floor(Math.random() * filtered.length)];
    }
    setShufflePick(pick);
  }, [podcasts, shufflePick]);

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="media-section-icon media-section-icon--podcasts">
            <Headphones className="h-4 w-4" />
          </div>
          <h2 className="font-display text-lg text-text-primary">Go-To Podcasts</h2>
        </div>
        {podcasts.length > 1 && (
          <button
            onClick={shufflePodcast}
            className="media-podcast-shuffle-btn"
            aria-label="Shuffle a podcast"
          >
            <Shuffle className="h-4 w-4" />
            <span>Shuffle</span>
          </button>
        )}
      </div>

      {/* Shuffle pick banner */}
      {shufflePick && (
        <div className="media-podcast-shuffle-result">
          <div className="media-podcast-shuffle-result-content">
            <span className="text-xl" aria-hidden>
              🎲
            </span>
            <PodcastArtwork
              url={shufflePick.coverUrl}
              iconClassName="text-text-muted"
              imgClassName="h-12 w-12"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Listen to</p>
              <p className="text-text-primary font-bold truncate">{shufflePick.name}</p>
            </div>
          </div>
          <button
            onClick={() => setShufflePick(null)}
            className="p-1 rounded-full hover:bg-white/10 text-text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {podcasts.map((podcast) => {
          const style = getCategoryStyle(podcast.category);
          const Content = (
            <>
              <button
                onClick={(e) => handleRemove(podcast.id, e)}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-bg-elevated/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/20"
                aria-label={`Remove ${podcast.name}`}
              >
                <X className="h-3 w-3 text-text-muted hover:text-error" />
              </button>
              <div className="flex items-start gap-2 relative z-0">
                <PodcastArtwork url={podcast.coverUrl} iconClassName={style.text} />
                <span className={`font-medium text-text-primary text-sm leading-tight line-clamp-2 ${podcast.link ? 'hover:underline underline-offset-2' : ''}`}>
                  {podcast.name}
                </span>
              </div>
              {podcast.category && (
                <span className={`mt-3 relative z-0 inline-block text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {podcast.category}
                </span>
              )}
            </>
          );

          if (podcast.link) {
            return (
              <Card
                key={podcast.id}
                hover
                glow={style.glow}
                className={`relative min-w-[160px] max-w-[200px] p-4 flex-shrink-0 group transition-opacity duration-200 ${
                  removingId === podcast.id ? 'opacity-0 scale-95' : ''
                }`}
              >
                <a href={podcast.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" aria-label={`Open ${podcast.name}`} />
                {Content}
              </Card>
            );
          }

          return (
            <Card
              key={podcast.id}
              hover
              glow={style.glow}
              className={`relative min-w-[160px] max-w-[200px] p-4 flex-shrink-0 group transition-opacity duration-200 ${
                removingId === podcast.id ? 'opacity-0 scale-95' : ''
              }`}
            >
              {Content}
            </Card>
          );
        })}

        {/* Add podcast card */}
        <Card
          hover
          onClick={() => setIsAddDialogOpen(true)}
          className="min-w-[160px] max-w-[200px] p-4 flex-shrink-0 border-dashed flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-secondary hover:border-text-secondary/30"
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm">Add podcast</span>
        </Card>
      </div>

      <AddPodcastDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={onAddPodcast}
      />
    </section>
  );
}
