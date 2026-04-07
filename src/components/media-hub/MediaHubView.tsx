'use client';

import { useMediaHub } from '@/hooks/useMediaHub';
import { getActiveMedia, getOnDeckMedia, getMediaStats } from '@/lib/media-hub';
import { MediaHubHero } from './MediaHubHero';
import { MediaStatsBar } from './MediaStatsBar';
import { GoToPodcastsSection } from './GoToPodcastsSection';
import { CurrentlyReadingSection } from './CurrentlyReadingSection';
import { OnDeckSection } from './OnDeckSection';
import { Loader2, Trophy } from 'lucide-react';
import Link from 'next/link';

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
    addPodcastThought,
    removePodcastThought,
    addMediaItem,
    updateMediaItem,
    moveToActive,
    markAsFinished,
    removeMediaItem,
    touchMediaItem,
    addThought,
    removeThought,
  } = useMediaHub(storageScope);

  const activeMedia = getActiveMedia(store);
  const onDeckMedia = getOnDeckMedia(store);
  const stats = getMediaStats(store);

  if (!isLoaded) {
    return (
      <div className="media-hub-loading">
        <div className="media-hub-loading-emoji">📚</div>
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
        <p className="text-sm text-text-muted mt-2">Loading your media hub...</p>
      </div>
    );
  }

  return (
    <div className="media-hub-shell">
      {/* Ambient background orbs */}
      <div className="media-hub-orb media-hub-orb--1" />
      <div className="media-hub-orb media-hub-orb--2" />
      <div className="media-hub-orb media-hub-orb--3" />

      {/* Content */}
      <div className="media-hub-content">
        {/* Header */}
        <header className="media-hub-header flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="media-hub-header-eyebrow">
              <span className="media-hub-header-eyebrow-dot" />
              <span>Media Hub</span>
            </div>
            <h1 className="media-hub-title">
              Your Shelf
            </h1>
          </div>
          
          <Link href="/dashboard/media-hub/finished" className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success hover:bg-success/20 rounded-xl font-medium transition-colors border border-success/20 shadow-sm shrink-0 self-start sm:self-auto">
            <Trophy className="h-4 w-4" />
            Trophy Case
          </Link>

          {/* Save status */}
          {(isSaving || saveError) && (
            <div className="media-hub-save-status">
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
          )}
        </header>

        {/* Stats Bar */}
        <MediaStatsBar stats={stats} />

        {/* Shuffle Hero */}
        <MediaHubHero
          store={store}
          onMoveToActive={moveToActive}
          onTouch={touchMediaItem}
        />

        {/* Main content grid */}
        <div className="media-hub-sections">
          {/* Go-To Podcasts */}
          <div className="media-hub-section-card">
            <GoToPodcastsSection
              podcasts={store.podcasts}
              onAddPodcast={addPodcast}
              onRemovePodcast={removePodcast}
              onAddPodcastThought={addPodcastThought}
              onRemovePodcastThought={removePodcastThought}
            />
          </div>

          {/* In Progress */}
          <div className="media-hub-section-card">
            <CurrentlyReadingSection
              items={activeMedia}
              onMarkFinished={markAsFinished}
              onRemove={removeMediaItem}
              onTouch={touchMediaItem}
              onAddItem={addMediaItem}
              onUpdateMediaItem={updateMediaItem}
              onAddThought={addThought}
              onRemoveThought={removeThought}
            />
          </div>

          {/* On Deck */}
          <div className="media-hub-section-card">
            <OnDeckSection
              items={onDeckMedia}
              onMoveToActive={moveToActive}
              onRemove={removeMediaItem}
              onAddItem={addMediaItem}
              onUpdateMediaItem={updateMediaItem}
              onAddThought={addThought}
              onRemoveThought={removeThought}
            />
          </div>

          {/* Finished section was moved to top header CTA */}
        </div>
      </div>
    </div>
  );
}
