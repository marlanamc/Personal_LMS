'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Headphones, Plus, X } from 'lucide-react';
import type { Podcast } from '@/lib/media-hub';
import { AddPodcastDialog } from './AddPodcastDialog';

interface GoToPodcastsSectionProps {
  podcasts: Podcast[];
  onAddPodcast: (name: string, category?: string) => void;
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

export function GoToPodcastsSection({ podcasts, onAddPodcast, onRemovePodcast }: GoToPodcastsSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemovingId(id);
    setTimeout(() => {
      onRemovePodcast(id);
      setRemovingId(null);
    }, 200);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg text-text-primary">Go-To Podcasts</h2>
      </div>
      <p className="text-sm text-text-muted mb-4">
        Quick picks for when you don&apos;t know what to listen to
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {podcasts.map((podcast) => {
          const style = getCategoryStyle(podcast.category);
          return (
            <Card
              key={podcast.id}
              hover
              glow={style.glow}
              className={`relative min-w-[160px] max-w-[200px] p-4 flex-shrink-0 group transition-opacity duration-200 ${
                removingId === podcast.id ? 'opacity-0 scale-95' : ''
              }`}
            >
              <button
                onClick={(e) => handleRemove(podcast.id, e)}
                className="absolute top-2 right-2 p-1 rounded-full bg-bg-elevated/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/20"
                aria-label={`Remove ${podcast.name}`}
              >
                <X className="h-3 w-3 text-text-muted hover:text-error" />
              </button>
              <div className="flex items-start gap-2">
                <Headphones className={`h-5 w-5 flex-shrink-0 ${style.text}`} />
                <span className="font-medium text-text-primary text-sm leading-tight line-clamp-2">
                  {podcast.name}
                </span>
              </div>
              {podcast.category && (
                <span className={`mt-3 inline-block text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {podcast.category}
                </span>
              )}
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
