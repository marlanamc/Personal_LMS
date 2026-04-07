export type MediaType = 'book' | 'audiobook' | 'video' | 'show' | 'article' | 'music';
export type MediaStatus = 'active' | 'on-deck' | 'finished';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface Podcast {
  id: string;
  name: string;
  category?: string;
  addedAt: string;
  link?: string;
  /** Cover / artwork image URL */
  coverUrl?: string;
  thoughts?: MediaThought[];
}

export interface MediaThought {
  id: string;
  content: string;
  createdAt: string;
  progressMarker?: string; // Optional context, e.g. "Ch 4" or "Pg 123"
}

export interface MediaItem {
  id: string;
  title: string;
  /** Creator, optional (author, artist, channel, etc.) */
  author?: string;
  type: MediaType;
  status: MediaStatus;
  lastTouchedAt: string;
  addedAt: string;
  finishedAt?: string;
  notes?: string;
  thoughts?: MediaThought[];
  energyLevel?: EnergyLevel;
  coverEmoji?: string;
  coverUrl?: string;
  platform?: string;
  link?: string;
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
  'mental health',
  'news',
  'storytelling',
  'interviews',
  'motivation',
];

export const MEDIA_TYPE_CONFIG: Record<MediaType, { label: string; emoji: string; color: string }> = {
  book: { label: 'Book', emoji: '📖', color: 'secondary' },
  audiobook: { label: 'Audiobook', emoji: '🎧', color: 'accent' },
  video: { label: 'Video', emoji: '📺', color: 'info' },
  show: { label: 'Show', emoji: '🍿', color: 'warning' },
  article: { label: 'Article', emoji: '📄', color: 'primary' },
  music: { label: 'Music', emoji: '🎵', color: 'accent' },
};

export const PLATFORM_OPTIONS = [
  'Audible', 'Libby', 'Kindle', 'eBook', 'PDF', 'Library', 'Physical', 'Spotify', 'Apple Podcasts', 'YouTube', 'Netflix', 'Hulu', 'Max', 'Disney+', 'Other'
] as const;

export const ENERGY_LEVEL_CONFIG: Record<EnergyLevel, { label: string; emoji: string; description: string }> = {
  low: { label: 'Low energy', emoji: '🫠', description: 'Couch mode — passive consumption' },
  medium: { label: 'Medium energy', emoji: '☕', description: 'Semi-engaged — following along' },
  high: { label: 'High energy', emoji: '⚡', description: 'Fully locked in — active learning' },
};

const LEGACY_MIGRATION_DATE = '1970-01-01T00:00:00.000Z';

const MEDIA_TYPES = new Set<MediaType>(['book', 'audiobook', 'video', 'show', 'article', 'music']);
const MEDIA_STATUSES = new Set<MediaStatus>(['active', 'on-deck', 'finished']);
const ENERGY_LEVELS = new Set<EnergyLevel>(['low', 'medium', 'high']);

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

function normalizeEnergyLevel(raw: unknown): EnergyLevel | undefined {
  if (typeof raw === 'string' && ENERGY_LEVELS.has(raw as EnergyLevel)) {
    return raw as EnergyLevel;
  }
  return undefined;
}

function normalizeOptionalString(raw: unknown): string | undefined {
  return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
}

function createStableLegacyPodcastId(name: string, link?: string): string {
  const source = `${name.toLowerCase()}|${link?.toLowerCase() ?? ''}`;
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }
  return `legacy-podcast-${hash.toString(36)}`;
}

function normalizePodcast(raw: unknown): Podcast | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const name = normalizeOptionalString(o.name);
  if (!name) return null;
  const link = normalizeOptionalString(o.link) ?? normalizeOptionalString(o.url) ?? normalizeOptionalString(o.href);
  const id = normalizeOptionalString(o.id) ?? createStableLegacyPodcastId(name, link);
  const category = normalizeOptionalString(o.category) ?? normalizeOptionalString(o.genre);
  const addedAt = normalizeOptionalString(o.addedAt) ?? LEGACY_MIGRATION_DATE;
  const coverUrl =
    normalizeOptionalString(o.coverUrl) ??
    normalizeOptionalString(o.imageUrl) ??
    normalizeOptionalString(o.artworkUrl) ??
    normalizeOptionalString(o.image) ??
    normalizeOptionalString(o.artwork) ??
    normalizeOptionalString(o.cover) ??
    normalizeOptionalString(o.coverImage) ??
    normalizeOptionalString(o.cover_image);
  const thoughts = Array.isArray(o.thoughts)
    ? o.thoughts.map(normalizeMediaThought).filter((t): t is MediaThought => t !== null)
    : undefined;
  return { id, name, category, addedAt, link, coverUrl, thoughts };
}

function normalizeMediaThought(raw: unknown): MediaThought | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : undefined;
  const content = typeof o.content === 'string' ? o.content : undefined;
  const createdAt = typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString();
  const progressMarker = typeof o.progressMarker === 'string' ? o.progressMarker : undefined;

  if (!id || !content) return null;
  return { id, content, createdAt, progressMarker };
}

function normalizeMediaItem(raw: unknown): MediaItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const title = typeof o.title === 'string' ? o.title.trim() : '';
  if (!id || !title) return null;
  const author = normalizeOptionalString(o.author);
  const type = normalizeMediaType(o.type);
  const status = normalizeMediaStatus(o.status);
  const lastTouchedAt = typeof o.lastTouchedAt === 'string' ? o.lastTouchedAt : new Date().toISOString();
  const addedAt = typeof o.addedAt === 'string' ? o.addedAt : new Date().toISOString();
  const finishedAt = normalizeOptionalString(o.finishedAt);
  const notes = normalizeOptionalString(o.notes);
  const energyLevel = normalizeEnergyLevel(o.energyLevel);
  const coverEmoji = normalizeOptionalString(o.coverEmoji);
  const coverUrl = normalizeOptionalString(o.coverUrl);
  const platform = normalizeOptionalString(o.platform);
  const link = normalizeOptionalString(o.link);
  
  const thoughts = Array.isArray(o.thoughts)
    ? o.thoughts.map(normalizeMediaThought).filter((t): t is MediaThought => t !== null)
    : undefined;

  return { 
    id, title, author, type, status, lastTouchedAt, addedAt, finishedAt, 
    notes, energyLevel, coverEmoji, coverUrl, platform, link, thoughts 
  };
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

export function getAllFinishedMedia(store: MediaHubStore): MediaItem[] {
  return store.mediaItems
    .filter((m) => m.status === 'finished')
    .sort((a, b) => (b.finishedAt ?? b.addedAt).localeCompare(a.finishedAt ?? a.addedAt));
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

/** More specific format for thoughts: "Today 4:41 PM" or "Oct 12, 11:30 AM" */
export function formatThoughtDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today ${timeStr}`;
  if (isYesterday) return `Yesterday ${timeStr}`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  }) + ` ${timeStr}`;
}

/** Staleness indicator: how many days since last touched */
export function getStaleness(lastTouchedAt: string): 'fresh' | 'warm' | 'stale' | 'abandoned' {
  const diffMs = Date.now() - new Date(lastTouchedAt).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 2) return 'fresh';
  if (diffDays <= 7) return 'warm';
  if (diffDays <= 21) return 'stale';
  return 'abandoned';
}

/** Stats for display */
export interface MediaStats {
  finishedThisYear: number;
  activeCount: number;
  onDeckCount: number;
  totalFinished: number;
}

export function getMediaStats(store: MediaHubStore): MediaStats {
  const now = new Date();
  const thisYear = now.getFullYear();

  const finishedThisYear = store.mediaItems.filter((m) => {
    if (m.status !== 'finished') return false;
    const d = m.finishedAt ?? m.addedAt;
    return new Date(d).getFullYear() === thisYear;
  }).length;

  const activeCount = store.mediaItems.filter((m) => m.status === 'active').length;
  const onDeckCount = store.mediaItems.filter((m) => m.status === 'on-deck').length;
  const totalFinished = store.mediaItems.filter((m) => m.status === 'finished').length;

  return { finishedThisYear, activeCount, onDeckCount, totalFinished };
}

/** Get a random suggestion from active + on-deck items, optionally filtered by energy */
export function getRandomSuggestion(
  store: MediaHubStore,
  energyFilter?: EnergyLevel,
  excludeId?: string,
): MediaItem | null {
  let pool = store.mediaItems.filter((m) => m.status === 'active' || m.status === 'on-deck');

  if (energyFilter) {
    const filtered = pool.filter((m) => m.energyLevel === energyFilter);
    // Fall back to unfiltered if nothing matches the energy level
    if (filtered.length > 0) pool = filtered;
  }

  if (excludeId) {
    const filtered = pool.filter((m) => m.id !== excludeId);
    if (filtered.length > 0) pool = filtered;
  }

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Group finished items by month for trophy case display */
export function groupFinishedByMonth(items: MediaItem[]): Array<{ month: string; items: MediaItem[] }> {
  const groups = new Map<string, MediaItem[]>();

  for (const item of items) {
    const d = new Date(item.finishedAt ?? item.addedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => {
      const d = new Date(`${key}-15T12:00:00`);
      const month = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      return { month, items };
    });
}
