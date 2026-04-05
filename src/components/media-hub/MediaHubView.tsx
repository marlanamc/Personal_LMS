'use client';

import { useMediaHub } from '@/hooks/useMediaHub';
import { getActiveMedia, getOnDeckMedia, getFinishedMedia } from '@/lib/media-hub';
import { GoToPodcastsSection } from './GoToPodcastsSection';
import { CurrentlyReadingSection } from './CurrentlyReadingSection';
import { OnDeckSection } from './OnDeckSection';
import { FinishedSection } from './FinishedSection';
import { Loader2 } from 'lucide-react';

export interface MediaHubViewProps {
  storageScope: string;
}

export function MediaHubView({ storageScope }: MediaHubViewProps) {
  const {
    store,
    isLoaded,
    isSaving,
    saveError,
    addPodcast,
    removePodcast,
    addMediaItem,
    moveToActive,
    markAsFinished,
    removeMediaItem,
  } = useMediaHub(storageScope);

  const activeMedia = getActiveMedia(store);
  const onDeckMedia = getOnDeckMedia(store);
  const finishedMedia = getFinishedMedia(store, 5);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-display text-xl md:text-2xl text-text-primary tracking-tight">
            Media Hub
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Your go-to podcasts and reading tracker
          </p>
        </div>
        {/* Save status */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          {isSaving && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveError && (
            <span className="text-warning">{saveError}</span>
          )}
        </div>
      </header>

      {/* Go-To Podcasts */}
      <GoToPodcastsSection
        podcasts={store.podcasts}
        onAddPodcast={addPodcast}
        onRemovePodcast={removePodcast}
      />

      {/* Currently Reading/Listening */}
      <CurrentlyReadingSection
        items={activeMedia}
        onMarkFinished={markAsFinished}
        onRemove={removeMediaItem}
        onAddItem={addMediaItem}
      />

      {/* On Deck */}
      <OnDeckSection
        items={onDeckMedia}
        onMoveToActive={moveToActive}
        onRemove={removeMediaItem}
        onAddItem={addMediaItem}
      />

      {/* Finished */}
      {finishedMedia.length > 0 && (
        <FinishedSection items={finishedMedia} />
      )}
    </div>
  );
}
