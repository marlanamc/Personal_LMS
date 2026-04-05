'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Library, BookOpen, Headphones, Play, Plus, MoreVertical, Trash2 } from 'lucide-react';
import type { MediaItem, MediaType } from '@/lib/media-hub';
import { AddMediaDialog } from './AddMediaDialog';

interface OnDeckSectionProps {
  items: MediaItem[];
  onMoveToActive: (id: string) => void;
  onRemove: (id: string) => void;
  onAddItem: (title: string, type: MediaType, status?: 'active' | 'on-deck' | 'finished') => void;
}

export function OnDeckSection({
  items,
  onMoveToActive,
  onRemove,
  onAddItem,
}: OnDeckSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleAddItem = (title: string, type: MediaType) => {
    onAddItem(title, type, 'on-deck');
    setIsAddDialogOpen(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Library className="h-5 w-5 text-accent" />
          <h2 className="font-display text-lg text-text-primary">On Deck</h2>
          {items.length > 0 && (
            <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
          aria-label="Add to queue"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-text-muted text-sm">
            Your reading queue is empty. Add books you want to read next!
          </p>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="mt-3 text-sm text-primary hover:text-primary-light transition-colors"
          >
            + Add to queue
          </button>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <Card key={item.id} className="p-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted font-mono w-5 text-center flex-shrink-0">
                  {index + 1}
                </span>
                {item.type === 'audiobook' ? (
                  <Headphones className="h-4 w-4 text-accent flex-shrink-0" />
                ) : (
                  <BookOpen className="h-4 w-4 text-secondary flex-shrink-0" />
                )}
                <span className="font-medium text-text-primary text-sm flex-1 truncate">
                  {item.title}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onMoveToActive(item.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label="Start reading"
                    title="Start reading"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
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

      <AddMediaDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddItem}
        defaultStatus="on-deck"
      />
    </section>
  );
}
