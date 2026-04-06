'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { BookOpen, Headphones, Check, Plus, MoreVertical, Trash2, Tv, Popcorn, FileText, Music, Edit2, MessageSquareQuote, Clock, Bookmark } from 'lucide-react';
import {
  formatRelativeDate,
  getStaleness,
  ENERGY_LEVEL_CONFIG,
  type MediaItem,
  type MediaType,
  type EnergyLevel,
} from '@/lib/media-hub';
import { AddMediaDialog } from './AddMediaDialog';
import { EditMediaDialog } from './EditMediaDialog';
import { ThoughtDownloadDrawer } from './ThoughtDownloadDrawer';

interface CurrentlyReadingSectionProps {
  items: MediaItem[];
  onMarkFinished: (id: string) => void;
  onRemove: (id: string) => void;
  onTouch: (id: string) => void;
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

const STALENESS_CONFIG: Record<
  ReturnType<typeof getStaleness>,
  { badge: string; badgeText: string; glow: string; accent: string; coverBorder: string }
> = {
  fresh:     { badge: '', badgeText: '', glow: 'bg-success/25', accent: 'from-success/50 via-success/20', coverBorder: 'border-success/20 group-hover:border-success/40' },
  warm:      { badge: '', badgeText: '', glow: 'bg-amber-400/20', accent: 'from-amber-400/40 via-amber-400/15', coverBorder: 'border-amber-400/15 group-hover:border-amber-400/35' },
  stale:     { badge: 'bg-warning/15 text-warning border border-warning/20', badgeText: 'Getting dusty', glow: 'bg-warning/20', accent: 'from-warning/40 via-warning/15', coverBorder: 'border-warning/20 group-hover:border-warning/40' },
  abandoned: { badge: 'bg-error/10 text-error border border-error/15', badgeText: 'Miss me?', glow: 'bg-error/15', accent: 'from-error/35 via-error/10', coverBorder: 'border-error/15 group-hover:border-error/35' },
};

export function CurrentlyReadingSection({
  items,
  onMarkFinished,
  onRemove,
  onTouch,
  onAddItem,
  onUpdateMediaItem,
  onAddThought,
  onRemoveThought,
}: CurrentlyReadingSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [journalingId, setJournalingId] = useState<string | null>(null);

  const journalingItem = items.find((i) => i.id === journalingId);

  const handleAddItem = (title: string, type: MediaType, extras?: { notes?: string; energyLevel?: EnergyLevel; coverEmoji?: string; author?: string }) => {
    onAddItem(title, type, 'active', extras);
    setIsAddDialogOpen(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="media-section-icon media-section-icon--active">
            <BookOpen className="h-4 w-4" />
          </div>
          <h2 className="font-display text-lg text-text-primary">In Progress</h2>
          {items.length > 0 && (
            <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-full font-bold">
              {items.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
          aria-label="Add book or audiobook"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <Card className="p-10 text-center border-dashed bg-white/[0.02]">
          <div className="text-5xl mb-4 grayscale opacity-50">📚</div>
          <h3 className="text-text-primary font-display font-medium mb-4">Nothing in progress</h3>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="text-sm font-bold text-primary hover:text-primary-light transition-colors"
          >
            + Start something now
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:gap-8">
          {items.map((item) => {
            const Icon = MEDIA_ICONS[item.type];
            const staleness = getStaleness(item.lastTouchedAt || item.addedAt);
            const cfg = STALENESS_CONFIG[staleness];
            const lastThought = item.thoughts?.length ? item.thoughts[item.thoughts.length - 1] : null;
            const lastProgress = lastThought?.progressMarker;
            const thoughtCount = item.thoughts?.length ?? 0;
            const energyCfg = item.energyLevel ? ENERGY_LEVEL_CONFIG[item.energyLevel] : null;

            return (
              <Card
                key={item.id}
                className={`group relative rounded-2xl text-left hover:-translate-y-0.5 hover:shadow-2xl transition-[transform,box-shadow,background-color] duration-300 ease-out cursor-pointer shadow-xl bg-white/[0.03] hover:bg-white/[0.05] ${openMenuId === item.id ? 'z-20' : ''}`}
                onClick={() => onTouch(item.id)}
              >
                {/* Top accent gradient bar */}
                <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${cfg.accent} to-transparent`} />

                <div className="flex min-w-0 flex-row gap-4 p-5 sm:gap-5 sm:p-6">
                  {/* Cover with ambient glow */}
                  <div className="relative shrink-0">
                    {/* Ambient glow behind cover */}
                    <div className={`absolute -inset-3 rounded-2xl blur-2xl ${cfg.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className={`relative h-[9rem] w-[6.5rem] shrink-0 overflow-hidden rounded-xl border ${cfg.coverBorder} bg-white/5 shadow-lg transition-all duration-300 flex items-center justify-center sm:h-[9.5rem] sm:w-28`}>
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
                        <span className="text-4xl transform group-hover:scale-125 transition-transform duration-500">{item.coverEmoji}</span>
                      ) : (
                        <Icon className="h-8 w-8 text-text-muted group-hover:text-primary transition-colors" />
                      )}

                      {/* Bottom gradient overlay on cover */}
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                      {/* Progress marker pinned to cover bottom */}
                      {lastProgress && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1 pointer-events-none">
                          <Bookmark className="h-2.5 w-2.5 text-white/80 shrink-0" />
                          <span className="text-[9px] font-bold text-white/90 truncate leading-none">
                            {lastProgress}
                          </span>
                        </div>
                      )}

                      {/* Staleness nudge badge on cover */}
                      {cfg.badgeText && (
                        <div className="absolute top-1.5 right-1.5">
                          <span className={`text-[7px] uppercase tracking-tight font-black px-1.5 py-0.5 rounded-md shadow-lg ${cfg.badge} backdrop-blur-md`}>
                            {cfg.badgeText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 min-w-0 justify-between gap-2.5 py-0.5">
                    <div className="space-y-3 min-w-0">
                      {/* Title + menu */}
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-bold text-text-primary text-[0.9375rem] sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          {item.author?.trim() && (
                            <p className="mt-0.5 text-xs text-text-muted line-clamp-1">{item.author.trim()}</p>
                          )}
                        </div>

                        <div className="relative shrink-0 -mr-1 -mt-0.5 self-start">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === item.id ? null : item.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
                            aria-label="More actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {openMenuId === item.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                              <div className="absolute right-0 top-full z-[100] mt-1 w-40 rounded-xl border border-white/10 bg-bg-card py-1.5 shadow-2xl backdrop-blur-xl">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingItem(item); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-white/10 flex items-center gap-2 transition-colors"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit details
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onMarkFinished(item.id); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-success hover:bg-success/10 flex items-center gap-2 transition-colors font-medium border-t border-white/5 mt-1 pt-2"
                                >
                                  <Check className="h-4 w-4" />
                                  Mark finished
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

                      {/* Metadata chips */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-text-muted bg-white/[0.06] pl-1.5 pr-2 py-0.5 rounded-md">
                          <Icon className="h-3 w-3 opacity-60" />
                          {item.type}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-text-muted bg-white/[0.04] px-2 py-0.5 rounded-md">
                          <Clock className="h-2.5 w-2.5 opacity-50" />
                          {formatRelativeDate(item.lastTouchedAt || item.addedAt)}
                        </span>
                        {energyCfg && (
                          <span className="text-[10px] text-text-muted bg-white/[0.04] px-2 py-0.5 rounded-md">
                            {energyCfg.emoji}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Thoughts quick-access */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setJournalingId(item.id);
                      }}
                      className="group/btn flex w-full min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left transition-all duration-200 hover:border-primary/25 hover:bg-primary/[0.08]"
                    >
                      <MessageSquareQuote className="h-4 w-4 shrink-0 text-primary/70 group-hover/btn:text-primary transition-colors" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-wide text-text-secondary group-hover/btn:text-primary transition-colors">
                        Thoughts
                      </span>
                      <span className={`inline-flex min-w-[1.75rem] shrink-0 items-center justify-center rounded-lg px-1.5 py-0.5 text-[11px] font-bold tabular-nums transition-colors ${thoughtCount > 0 ? 'bg-primary/15 text-primary group-hover/btn:bg-primary/25' : 'bg-white/[0.06] text-text-muted group-hover/btn:bg-primary/15 group-hover/btn:text-primary'}`}>
                        {thoughtCount}
                      </span>
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
        defaultStatus="active"
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
