'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { BookOpen, Headphones, Check, Plus, MoreVertical, Trash2 } from 'lucide-react';
import { formatRelativeDate, type MediaItem, type MediaType } from '@/lib/media-hub';
import { AddMediaDialog } from './AddMediaDialog';

interface CurrentlyReadingSectionProps {
  items: MediaItem[];
  onMarkFinished: (id: string) => void;
  onRemove: (id: string) => void;
  onAddItem: (title: string, type: MediaType, status?: 'active' | 'on-deck' | 'finished') => void;
}

export function CurrentlyReadingSection({
  items,
  onMarkFinished,
  onRemove,
  onAddItem,
}: CurrentlyReadingSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleAddItem = (title: string, type: MediaType) => {
    onAddItem(title, type, 'active');
    setIsAddDialogOpen(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-secondary" />
          <h2 className="font-display text-lg text-text-primary">Currently Reading</h2>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
          aria-label="Add book or audiobook"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-text-muted text-sm">
            Nothing here yet. Add a book or audiobook you&apos;re currently enjoying!
          </p>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="mt-3 text-sm text-primary hover:text-primary-light transition-colors"
          >
            + Add your first item
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {item.type === 'audiobook' ? (
                    <Headphones className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary truncate">{item.title}</p>
                    <p className="text-xs text-text-muted mt-1">
                      Last touched {formatRelativeDate(item.lastTouchedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onMarkFinished(item.id)}
                    className="p-2 rounded-lg text-text-muted hover:text-success hover:bg-success/10 transition-colors"
                    aria-label="Mark as finished"
                    title="Mark as finished"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openMenuId === item.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-20 bg-bg-elevated border border-white/10 rounded-lg shadow-lg overflow-hidden min-w-[120px]">
                          <button
                            onClick={() => {
                              onRemove(item.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error/10 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {items.length >= 3 && (
        <p className="text-xs text-text-muted mt-3 text-center">
          Tip: Keep this list short (1-3 items) to avoid overwhelm
        </p>
      )}

      <AddMediaDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddItem}
        defaultStatus="active"
      />
    </section>
  );
}
