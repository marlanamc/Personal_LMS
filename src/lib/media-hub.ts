export type MediaType = 'book' | 'audiobook';
export type MediaStatus = 'active' | 'on-deck' | 'finished';

export interface Podcast {
  id: string;
  name: string;
  category?: string;
  addedAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  lastTouchedAt: string;
  addedAt: string;
  finishedAt?: string;
}

export interface MediaHubStore {
  podcasts: Podcast[];
  mediaItems: MediaItem[];
}

export const EMPTY_MEDIA_HUB_STORE: MediaHubStore = {
  podcasts: [],
  mediaItems: [],
};

export const DEFAULT_PODCAST_CATEGORIES = [
  'comedy',
  'true crime',
  'educational',
  'relaxing',
  'news',
  'storytelling',
  'interviews',
  'motivation',
];

const MEDIA_TYPES = new Set<MediaType>(['book', 'audiobook']);
const MEDIA_STATUSES = new Set<MediaStatus>(['active', 'on-deck', 'finished']);

function normalizeMediaType(raw: unknown): MediaType {
  if (typeof raw === 'string' && MEDIA_TYPES.has(raw as MediaType)) {
    return raw as MediaType;
  }
  return 'book';
}

function normalizeMediaStatus(raw: unknown): MediaStatus {
  if (typeof raw === 'string' && MEDIA_STATUSES.has(raw as MediaStatus)) {
    return raw as MediaStatus;
  }
  return 'on-deck';
}

function normalizePodcast(raw: unknown): Podcast | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const name = typeof o.name === 'string' ? o.name.trim() : '';
  if (!id || !name) return null;
  const category = typeof o.category === 'string' && o.category.trim() ? o.category.trim() : undefined;
  const addedAt = typeof o.addedAt === 'string' ? o.addedAt : new Date().toISOString();
  return { id, name, category, addedAt };
}

function normalizeMediaItem(raw: unknown): MediaItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const title = typeof o.title === 'string' ? o.title.trim() : '';
  if (!id || !title) return null;
  const type = normalizeMediaType(o.type);
  const status = normalizeMediaStatus(o.status);
  const lastTouchedAt = typeof o.lastTouchedAt === 'string' ? o.lastTouchedAt : new Date().toISOString();
  const addedAt = typeof o.addedAt === 'string' ? o.addedAt : new Date().toISOString();
  const finishedAt = typeof o.finishedAt === 'string' && o.finishedAt.trim() ? o.finishedAt : undefined;
  return { id, title, type, status, lastTouchedAt, addedAt, finishedAt };
}

export function normalizeMediaHubStore(raw: unknown): MediaHubStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...EMPTY_MEDIA_HUB_STORE };
  }
  const o = raw as Record<string, unknown>;

  const podcasts = Array.isArray(o.podcasts)
    ? o.podcasts.map(normalizePodcast).filter((p): p is Podcast => p !== null)
    : [];

  const mediaItems = Array.isArray(o.mediaItems)
    ? o.mediaItems.map(normalizeMediaItem).filter((m): m is MediaItem => m !== null)
    : [];

  return { podcasts, mediaItems };
}

export function getActiveMedia(store: MediaHubStore): MediaItem[] {
  return store.mediaItems
    .filter((m) => m.status === 'active')
    .sort((a, b) => b.lastTouchedAt.localeCompare(a.lastTouchedAt));
}

export function getOnDeckMedia(store: MediaHubStore): MediaItem[] {
  return store.mediaItems
    .filter((m) => m.status === 'on-deck')
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt));
}

export function getFinishedMedia(store: MediaHubStore, limit = 5): MediaItem[] {
  return store.mediaItems
    .filter((m) => m.status === 'finished')
    .sort((a, b) => (b.finishedAt ?? b.addedAt).localeCompare(a.finishedAt ?? a.addedAt))
    .slice(0, limit);
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
}
