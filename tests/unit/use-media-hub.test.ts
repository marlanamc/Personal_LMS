import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeMediaHubStore } from '@/lib/media-hub';
import {
  createMediaItemRecord,
  createPodcastRecord,
  shouldPersistMediaHubMigration,
} from '@/hooks/useMediaHub';

describe('useMediaHub helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-07T12:34:56.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('flags repaired podcast payloads for one-time migration persistence', () => {
    const rawStore = {
      podcasts: [
        {
          name: 'The Daily',
          imageUrl: 'https://cdn.example.com/daily.jpg',
        },
      ],
      mediaItems: [],
    };
    const normalizedStore = normalizeMediaHubStore(rawStore);

    expect(shouldPersistMediaHubMigration(rawStore, normalizedStore)).toBe(true);
  });

  it('does not flag already-normalized podcast payloads', () => {
    const rawStore = {
      podcasts: [
        {
          id: 'pod-1',
          name: 'The Daily',
          category: 'news',
          addedAt: '2026-04-01T00:00:00.000Z',
          link: 'https://example.com/daily',
          coverUrl: 'https://cdn.example.com/daily.jpg',
        },
      ],
      mediaItems: [],
    };
    const normalizedStore = normalizeMediaHubStore(rawStore);

    expect(shouldPersistMediaHubMigration(rawStore, normalizedStore)).toBe(false);
  });

  it('creates podcast records with persisted artwork', () => {
    const podcast = createPodcastRecord(
      ' Search Engine ',
      ' educational ',
      ' https://example.com/show ',
      ' https://cdn.example.com/show.jpg ',
    );

    expect(podcast).toMatchObject({
      name: 'Search Engine',
      category: 'educational',
      addedAt: '2026-04-07T12:34:56.000Z',
      link: 'https://example.com/show',
      coverUrl: 'https://cdn.example.com/show.jpg',
    });
    expect(podcast.id).toMatch(/^\d+-/);
  });

  it('creates media item records with coverUrl, platform, and link', () => {
    const item = createMediaItemRecord(' Atomic Habits ', 'book', 'on-deck', {
      author: ' James Clear ',
      coverUrl: ' https://cdn.example.com/atomic-habits.jpg ',
      platform: ' Kindle ',
      link: ' https://example.com/books/atomic-habits ',
    });

    expect(item).toMatchObject({
      title: 'Atomic Habits',
      type: 'book',
      status: 'on-deck',
      author: 'James Clear',
      coverUrl: 'https://cdn.example.com/atomic-habits.jpg',
      platform: 'Kindle',
      link: 'https://example.com/books/atomic-habits',
      addedAt: '2026-04-07T12:34:56.000Z',
      lastTouchedAt: '2026-04-07T12:34:56.000Z',
    });
    expect(item.id).toMatch(/^\d+-/);
  });
});
