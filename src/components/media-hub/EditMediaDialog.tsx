'use client';

import { useState, useEffect } from 'react';
import { StableDialog } from '@/components/ui/StableDialog';
import { Button } from '@/components/ui/Button';
import { BookOpen, Headphones, X, Tv, Popcorn, FileText, Music, Zap, Coffee, Sofa } from 'lucide-react';
import { MEDIA_TYPE_CONFIG, ENERGY_LEVEL_CONFIG, PLATFORM_OPTIONS, type MediaType, type EnergyLevel, type MediaItem, type MediaStatus } from '@/lib/media-hub';

interface EditMediaDialogProps {
  initialItem: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<MediaItem, 'id' | 'addedAt'>>) => void;
}

const TYPE_ICONS: Record<MediaType, typeof BookOpen> = {
  book: BookOpen,
  audiobook: Headphones,
  video: Tv,
  show: Popcorn,
  article: FileText,
  music: Music,
};

const TYPE_ACCENT: Record<MediaType, string> = {
  book: 'secondary',
  audiobook: 'accent',
  video: 'info',
  show: 'warning',
  article: 'primary',
  music: 'accent',
};

const ENERGY_ICONS: Record<EnergyLevel, typeof Zap> = {
  high: Zap,
  medium: Coffee,
  low: Sofa,
};

const STATUS_OPTIONS: { value: MediaStatus; label: string }[] = [
  { value: 'active', label: 'In Progress' },
  { value: 'on-deck', label: 'On Deck' },
  { value: 'finished', label: 'Finished' },
];

export function EditMediaDialog({ initialItem, isOpen, onClose, onSave }: EditMediaDialogProps) {
  const [title, setTitle] = useState(initialItem.title);
  const [author, setAuthor] = useState(initialItem.author || '');
  const [type, setType] = useState<MediaType>(initialItem.type);
  const [status, setStatus] = useState<MediaStatus>(initialItem.status || 'on-deck');
  const [notes, setNotes] = useState(initialItem.notes || '');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | ''>(initialItem.energyLevel || '');
  const [coverEmoji, setCoverEmoji] = useState(initialItem.coverEmoji || '');
  const [coverUrl, setCoverUrl] = useState(initialItem.coverUrl || '');
  const [platform, setPlatform] = useState(initialItem.platform || '');
  const [link, setLink] = useState(initialItem.link || '');

  // Reset form when opened with a new item
  useEffect(() => {
    if (isOpen) {
      setTitle(initialItem.title);
      setAuthor(initialItem.author || '');
      setType(initialItem.type);
      setStatus(initialItem.status || 'on-deck');
      setNotes(initialItem.notes || '');
      setEnergyLevel(initialItem.energyLevel || '');
      setCoverEmoji(initialItem.coverEmoji || '');
      setCoverUrl(initialItem.coverUrl || '');
      setPlatform(initialItem.platform || '');
      setLink(initialItem.link || '');
    }
  }, [isOpen, initialItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    
    onSave(initialItem.id, {
      title: trimmedTitle,
      author: author.trim() || undefined,
      type,
      status,
      notes: notes.trim() || undefined,
      energyLevel: energyLevel || undefined,
      coverEmoji: coverEmoji.trim() || undefined,
      coverUrl: coverUrl.trim() || undefined,
      platform: platform.trim() || undefined,
      link: link.trim() || undefined,
    });
    onClose();
  };

  const allTypes = Object.keys(MEDIA_TYPE_CONFIG) as MediaType[];

  return (
    <StableDialog
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="edit-media-title"
    >
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-${TYPE_ACCENT[type]}/20 text-${TYPE_ACCENT[type]}`}>
              {(() => {
                const Icon = TYPE_ICONS[type];
                return <Icon className="h-4 w-4" />;
              })()}
            </div>
            <h2 id="edit-media-title" className="font-display text-lg text-text-primary">
              Edit Media
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Title */}
        <div>
          <label htmlFor="edit-media-title-input" className="block text-sm font-medium text-text-secondary mb-2">
            Title
          </label>
          <input
            id="edit-media-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label htmlFor="edit-media-author" className="block text-sm font-medium text-text-secondary mb-2">
            Author / creator <span className="text-text-muted">(optional)</span>
          </label>
          <input
            id="edit-media-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g., James Clear"
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
            autoComplete="off"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Status
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  status === opt.value
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-white/10 bg-bg-elevated text-text-muted hover:border-white/20 hover:text-text-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type selector - grid */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {allTypes.map((t) => {
              const Icon = TYPE_ICONS[t];
              const config = MEDIA_TYPE_CONFIG[t];
              const accent = TYPE_ACCENT[t];
              const isSelected = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? `border-${accent}/50 bg-${accent}/10 text-${accent}`
                      : 'border-white/10 bg-bg-elevated text-text-muted hover:border-white/20 hover:text-text-secondary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform (only for books/audiobooks) */}
        {(type === 'book' || type === 'audiobook') && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Platform/Format <span className="text-text-muted">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPlatform(opt === platform ? '' : opt)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    platform === opt
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-white/10 bg-bg-elevated text-text-muted hover:border-white/20 hover:text-text-secondary'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Cover Emoji */}
          <div>
            <label htmlFor="edit-media-emoji" className="block text-sm font-medium text-text-secondary mb-2">
              Cover Emoji <span className="text-text-muted">(optional)</span>
            </label>
            <input
              id="edit-media-emoji"
              type="text"
              value={coverEmoji}
              onChange={(e) => setCoverEmoji(e.target.value)}
              placeholder={MEDIA_TYPE_CONFIG[type].emoji}
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary text-center text-xl placeholder-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
              maxLength={2}
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="edit-media-cover-url" className="block text-sm font-medium text-text-secondary mb-2">
              Image URL <span className="text-text-muted">(optional)</span>
            </label>
            <input
              id="edit-media-cover-url"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
            />
          </div>
        </div>

        {/* Link / URL */}
        <div>
          <label htmlFor="edit-media-link" className="block text-sm font-medium text-text-secondary mb-2">
            Direct Link <span className="text-text-muted">(optional)</span>
          </label>
          <input
            id="edit-media-link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link to Audible, Kindle, Netflix, etc."
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
          />
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Energy level <span className="text-text-muted">(optional)</span>
          </label>
          <div className="flex gap-2">
            {(Object.entries(ENERGY_LEVEL_CONFIG) as [EnergyLevel, typeof ENERGY_LEVEL_CONFIG.low][]).map(
              ([level, config]) => {
                const Icon = ENERGY_ICONS[level];
                const isSelected = energyLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergyLevel(isSelected ? '' : level)}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-white/10 bg-bg-elevated text-text-muted hover:border-white/20 hover:text-text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className="h-4 w-4" />
                      <span className="text-base">{config.emoji}</span>
                    </div>
                    <span className="text-[10px] font-medium capitalize">{level}</span>
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Notes / Summary */}
        <div>
          <label htmlFor="edit-media-notes" className="block text-sm font-medium text-text-secondary mb-2">
            Summary/Notes <span className="text-text-muted">(optional)</span>
          </label>
          <textarea
            id="edit-media-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors resize-none h-20"
            maxLength={300}
            placeholder="A brief summary or quick thoughts..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!title.trim()} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </StableDialog>
  );
}
