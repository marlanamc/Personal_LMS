'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Library, BookOpen, Headphones, Plus, MoreVertical, Trash2, Tv, Popcorn, FileText, Music, Edit2, MessageSquareQuote } from 'lucide-react';
import { ENERGY_LEVEL_CONFIG, type MediaItem, type MediaType, type EnergyLevel } from '@/lib/media-hub';
import { AddMediaDialog } from './AddMediaDialog';
import { EditMediaDialog } from './EditMediaDialog';
import { ThoughtDownloadDrawer } from './ThoughtDownloadDrawer';

interface OnDeckSectionProps {
  items: MediaItem[];
  onMoveToActive: (id: string) => void;
  onRemove: (id: string) => void;
  onAddItem: (title: string, type: MediaType, status?: 'active' | 'on-deck' | 'finished', extras?: { notes?: string; energyLevel?: EnergyLevel; coverEmoji?: string; author?: string }) => void;
  onUpdateMediaItem: (id: string, updates: Partial<Omit<MediaItem, 'id' | 'addedAt'>>) => void;
  onAddThought: (mediaId: string, content: string, progress?: string) => void;
  onRemoveThought: (mediaId: string, thoughtId: string) => void;
}

const MEDIA_ICONS: Record<MediaType, typeof BookOpen> = {
  book: BookOpen,
  audiobook: Headphones,
  video: Tv,
  show: Popcorn,
  article: FileText,
  music: Music,
};

export function OnDeckSection({
  items,
  onMoveToActive,
  onRemove,
  onAddItem,
  onUpdateMediaItem,
  onAddThought,
  onRemoveThought,
}: OnDeckSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [journalingId, setJournalingId] = useState<string | null>(null);

  const journalingItem = items.find((i) => i.id === journalingId);

  const handleAddItem = (title: string, type: MediaType, extras?: { notes?: string; energyLevel?: EnergyLevel; coverEmoji?: string; author?: string }) => {
    onAddItem(title, type, 'on-deck', extras);
    setIsAddDialogOpen(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="media-section-icon media-section-icon--ondeck">
            <Library className="h-4 w-4" />
          </div>
          <h2 className="font-display text-lg text-text-primary">On Deck</h2>
          {items.length > 0 && (
            <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-full font-bold">
              {items.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
          aria-label="Add to on-deck"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <Card className="p-10 text-center border-dashed bg-white/[0.02]">
          <div className="text-4xl mb-4 grayscale opacity-50">🧊</div>
          <h3 className="text-text-primary font-display font-medium mb-4">Queue is empty</h3>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="text-sm font-bold text-warning hover:text-warning/80 transition-colors"
          >
            + Queue something up
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:gap-8">
          {items.map((item) => {
            const Icon = MEDIA_ICONS[item.type];

            return (
              <Card
                key={item.id}
                className={`group relative rounded-xl text-left hover:-translate-y-0.5 hover:shadow-xl transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out bg-white/[0.03] hover:bg-white/[0.05] border-white/5 hover:border-warning/20 shadow-lg ${openMenuId === item.id ? 'z-20' : ''}`}
              >
                <div className="flex flex-row gap-4 p-4">
                  {/* Larger Cover Image */}
                  <div className="relative w-20 h-28 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl group-hover:border-warning/30 transition-[border-color,box-shadow] duration-300">
                    {item.coverUrl ? (
                      <img 
                        src={item.coverUrl} 
                        alt={item.title}
                        className="h-full w-full object-cover transform-gpu backface-hidden transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : item.coverEmoji ? (
                      <span className="text-3xl transform group-hover:scale-125 transition-transform duration-500">{item.coverEmoji}</span>
                    ) : (
                      <Icon className="h-6 w-6 text-text-muted group-hover:text-warning transition-colors" />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-bold text-text-primary text-base leading-tight line-clamp-2 group-hover:text-warning transition-colors">
                            {item.title}
                          </h3>
                          {item.author?.trim() && (
                            <p className="mt-0.5 text-xs text-text-muted line-clamp-1">{item.author.trim()}</p>
                          )}
                        </div>

                        <div className="relative shrink-0 self-start">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === item.id ? null : item.id);
                            }}
                            className="p-1 rounded-lg hover:bg-white/10 text-text-muted transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {openMenuId === item.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                              <div className="absolute right-0 top-full z-[100] mt-1 w-40 rounded-xl border border-white/10 bg-bg-card py-1.5 shadow-2xl backdrop-blur-xl">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onMoveToActive(item.id); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 flex items-center gap-2 transition-colors font-medium"
                                >
                                  <Plus className="h-4 w-4" />
                                  Start reading
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingItem(item); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-white/10 flex items-center gap-2 transition-colors border-t border-white/5 mt-1 pt-2"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit details
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onRemove(item.id); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2 transition-colors border-t border-white/5 mt-1 pt-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-70">
                          {item.type}
                        </span>
                        {item.energyLevel && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-white/10" />
                            <span className="text-[10px] text-text-muted font-medium">
                              {ENERGY_LEVEL_CONFIG[item.energyLevel].label}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Thoughts/Journaling Quick Access */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setJournalingId(item.id);
                      }}
                      className="flex items-center justify-between p-2 mt-2 rounded-lg bg-white/5 hover:bg-warning/10 hover:text-warning transition-all group/btn border border-transparent hover:border-warning/20"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquareQuote className="h-3.5 w-3.5 text-warning" />
                        <span className="text-[11px] font-bold uppercase tracking-wide">Thoughts</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-white/5 group-hover/btn:bg-warning/20 px-1.5 py-0.5 rounded-md transition-colors">
                          {item.thoughts?.length || 0}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddMediaDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddItem}
        defaultStatus="on-deck"
      />

      {editingItem && (
        <EditMediaDialog
          initialItem={editingItem}
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSave={onUpdateMediaItem}
        />
      )}

      {journalingId && journalingItem && (
        <ThoughtDownloadDrawer
          item={journalingItem}
          isOpen={true}
          onClose={() => setJournalingId(null)}
          onAddThought={onAddThought}
          onRemoveThought={onRemoveThought}
        />
      )}
    </section>
  );
}
