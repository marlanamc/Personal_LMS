'use client';

import { useState, useRef, useEffect } from 'react';
import { StableDialog } from '@/components/ui/StableDialog';
import { Button } from '@/components/ui/Button';
import { Headphones, X } from 'lucide-react';
import { DEFAULT_PODCAST_CATEGORIES } from '@/lib/media-hub';

interface AddPodcastDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, category?: string) => void;
}

export function AddPodcastDialog({ isOpen, onClose, onAdd }: AddPodcastDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setCategory('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onAdd(trimmedName, category.trim() || undefined);
    onClose();
  };

  return (
    <StableDialog
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="add-podcast-title"
      initialFocusRef={inputRef}
    >
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            <h2 id="add-podcast-title" className="font-display text-lg text-text-primary">
              Add Podcast
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

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label htmlFor="podcast-name" className="block text-sm font-medium text-text-secondary mb-2">
            Podcast Name
          </label>
          <input
            ref={inputRef}
            id="podcast-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., The Daily"
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="podcast-category" className="block text-sm font-medium text-text-secondary mb-2">
            Category (optional)
          </label>
          <select
            id="podcast-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
          >
            <option value="">No category</option>
            {DEFAULT_PODCAST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <p className="text-xs text-text-muted mt-2">
            Categories help you pick based on your mood
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim()} className="flex-1">
            Add Podcast
          </Button>
        </div>
      </form>
    </StableDialog>
  );
}
