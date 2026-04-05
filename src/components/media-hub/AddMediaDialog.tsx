'use client';

import { useState, useRef, useEffect } from 'react';
import { StableDialog } from '@/components/ui/StableDialog';
import { Button } from '@/components/ui/Button';
import { BookOpen, Headphones, X } from 'lucide-react';
import type { MediaType } from '@/lib/media-hub';

interface AddMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, type: MediaType) => void;
  defaultStatus?: 'active' | 'on-deck';
}

export function AddMediaDialog({ isOpen, onClose, onAdd, defaultStatus = 'on-deck' }: AddMediaDialogProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('book');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setType('book');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAdd(trimmedTitle, type);
    onClose();
  };

  const statusLabel = defaultStatus === 'active' ? 'Currently Reading' : 'On Deck';

  return (
    <StableDialog
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="add-media-title"
      initialFocusRef={inputRef}
    >
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            <h2 id="add-media-title" className="font-display text-lg text-text-primary">
              Add to {statusLabel}
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
          <label htmlFor="media-title" className="block text-sm font-medium text-text-secondary mb-2">
            Title
          </label>
          <input
            ref={inputRef}
            id="media-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Atomic Habits"
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('book')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                type === 'book'
                  ? 'border-secondary/50 bg-secondary/10 text-secondary'
                  : 'border-white/10 bg-bg-elevated text-text-muted hover:border-white/20 hover:text-text-secondary'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Book</span>
            </button>
            <button
              type="button"
              onClick={() => setType('audiobook')}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                type === 'audiobook'
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-white/10 bg-bg-elevated text-text-muted hover:border-white/20 hover:text-text-secondary'
              }`}
            >
              <Headphones className="h-5 w-5" />
              <span className="font-medium">Audiobook</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!title.trim()} className="flex-1">
            Add {type === 'book' ? 'Book' : 'Audiobook'}
          </Button>
        </div>
      </form>
    </StableDialog>
  );
}
