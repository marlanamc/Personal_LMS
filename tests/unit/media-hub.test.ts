import { describe, expect, it } from 'vitest';

import { normalizeMediaHubStore } from '@/lib/media-hub';

describe('normalizeMediaHubStore', () => {
  it('keeps a current-shape podcast unchanged except for trimming', () => {
    const store = normalizeMediaHubStore({
      podcasts: [
        {
          id: 'pod-1',
          name: '  Search Engine  ',
          category: '  educational ',
          addedAt: '2026-04-01T12:00:00.000Z',
          link: ' https://example.com/show ',
          coverUrl: ' https://cdn.example.com/cover.jpg ',
        },
      ],
      mediaItems: [],
    });

    expect(store.podcasts).toEqual([
      {
        id: 'pod-1',
        name: 'Search Engine',
        category: 'educational',
        addedAt: '2026-04-01T12:00:00.000Z',
        link: 'https://example.com/show',
        coverUrl: 'https://cdn.example.com/cover.jpg',
      },
    ]);
  });

  it('repairs a legacy podcast missing id and addedAt instead of dropping it', () => {
    const store = normalizeMediaHubStore({
      podcasts: [
        {
          name: 'The Daily',
          url: 'https://example.com/daily',
        },
      ],
      mediaItems: [],
    });

    expect(store.podcasts).toHaveLength(1);
    expect(store.podcasts[0]).toEqual({
      id: expect.stringMatching(/^legacy-podcast-/),
      name: 'The Daily',
      category: undefined,
      addedAt: '1970-01-01T00:00:00.000Z',
      link: 'https://example.com/daily',
      coverUrl: undefined,
    });
  });

  it('normalizes legacy artwork aliases into coverUrl', () => {
    const store = normalizeMediaHubStore({
      podcasts: [
        {
          name: 'Radiolab',
          artworkUrl: ' https://cdn.example.com/radiolab.png ',
        },
      ],
      mediaItems: [],
    });

    expect(store.podcasts[0]?.coverUrl).toBe('https://cdn.example.com/radiolab.png');
  });

  it('discards invalid podcast records with no usable name', () => {
    const store = normalizeMediaHubStore({
      podcasts: [
        {
          id: 'broken-1',
          name: '   ',
          coverUrl: 'https://cdn.example.com/cover.jpg',
        },
      ],
      mediaItems: [],
    });

    expect(store.podcasts).toEqual([]);
  });
});
