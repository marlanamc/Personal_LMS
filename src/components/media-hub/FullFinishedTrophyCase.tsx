'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Search, Trash2, Calendar, BookOpen, Headphones, Tv, Popcorn, FileText, Music, MoreVertical, Edit2, MessageSquareQuote, Undo2 } from 'lucide-react';
import { ENERGY_LEVEL_CONFIG, type MediaType, type MediaItem, type MediaStatus } from '@/lib/media-hub';
import { EditMediaDialog } from './EditMediaDialog';
import { ThoughtDownloadDrawer } from './ThoughtDownloadDrawer';

interface FullFinishedTrophyCaseProps {
  items: MediaItem[];
  onUpdateMediaItem: (id: string, updates: Partial<Omit<MediaItem, 'id' | 'addedAt'>>) => void;
  onRemove: (id: string) => void;
  onAddThought: (mediaId: string, content: string, progress?: string) => void;
  onRemoveThought: (mediaId: string, thoughtId: string) => void;
  onSetStatus: (id: string, status: MediaStatus) => void;
}

const MEDIA_ICONS: Record<MediaType, typeof BookOpen> = {
  book: BookOpen,
  audiobook: Headphones,
  video: Tv,
  show: Popcorn,
  article: FileText,
  music: Music,
};

export function FullFinishedTrophyCase({
  items,
  onUpdateMediaItem,
  onRemove,
  onAddThought,
  onRemoveThought,
  onSetStatus,
}: FullFinishedTrophyCaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [journalingId, setJournalingId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type matching
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesAuthor = item.author?.toLowerCase().includes(q);
        const matchesPlatform = item.platform?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesPlatform && !matchesNotes) return false;
      }
      return true;
    }).sort((a, b) => {
      // Sort newest finished first
      const dateA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
      const dateB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [items, searchQuery, typeFilter]);

  const journalingItem = items.find(i => i.id === journalingId);

  return (
    <div className="media-hub-shell">
      <div className="media-hub-orb media-hub-orb--1" aria-hidden />
      <div className="media-hub-orb media-hub-orb--2" aria-hidden />
      <div className="media-hub-orb media-hub-orb--3" aria-hidden />

      <div className="media-hub-content space-y-8 pb-12 sm:pb-16">
        {/* Header — stacked on small screens; title + fixed-width search on large (reads as a desktop shelf, not edge-pinned mobile) */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex min-w-0 items-start gap-4">
            <Link
              href="/dashboard/media-hub"
              className="mt-0.5 shrink-0 rounded-xl bg-white/5 p-2 text-text-muted transition-all hover:bg-white/10 hover:text-text-primary group"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <div className="min-w-0">
              <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-white">
                Trophy Case
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Your completed collection of knowledge and entertainment.
              </p>
            </div>
          </div>

          <div className="relative w-full shrink-0 lg:max-w-sm lg:pt-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Search trophies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-text-primary transition-all placeholder:text-text-muted/70 focus:border-success/50 focus:outline-none"
            />
          </div>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
            typeFilter === 'all' 
              ? 'bg-success/20 border-success/30 text-success' 
              : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10'
          }`}
        >
          All
        </button>
        {Object.entries(MEDIA_ICONS).map(([type, Icon]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type as MediaType)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 whitespace-nowrap ${
              typeFilter === type 
                ? 'bg-success/20 border-success/30 text-success' 
                : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="text-6xl grayscale opacity-30">🏆</div>
          <h2 className="text-xl font-display font-bold text-white">
            {searchQuery ? 'No matches found' : 'Trophy case is empty'}
          </h2>
          <p className="text-text-muted text-sm max-w-xs mx-auto">
            {searchQuery 
              ? "Try adjusting your search terms or filters to find what you're looking for." 
              : "Your completed adventures will appear here. Time to start something new!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => {
            const Icon = MEDIA_ICONS[item.type];
            const finishedDate = item.finishedAt ? new Date(item.finishedAt) : null;

            return (
              <Card
                key={item.id}
                className="group relative flex flex-col h-full hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out overflow-hidden bg-white/[0.03] border-white/5 hover:border-success/30 shadow-2xl cursor-pointer"
                onClick={() => setJournalingId(item.id)}
              >
                {/* Book Cover Aesthetic */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/[0.02]">
                  {item.coverUrl ? (
                    <img 
                      src={item.coverUrl} 
                      alt={item.title}
                      className="h-full w-full object-cover transform-gpu backface-hidden transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                      {item.coverEmoji ? (
                        <span className="text-7xl transform group-hover:scale-125 transition-transform duration-500">{item.coverEmoji}</span>
                      ) : (
                        <Icon className="h-16 w-16 text-text-muted/30" />
                      )}
                      <div className="space-y-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{item.type}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Floating Actions on Hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === item.id ? null : item.id);
                      }}
                      className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all shadow-xl"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {openMenuId === item.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                        <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-white/10 rounded-2xl shadow-2xl z-40 py-2 overflow-hidden backdrop-blur-2xl">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingItem(item); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-white/10 flex items-center gap-3 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit Details
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onSetStatus(item.id, 'active'); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-primary/10 flex items-center gap-3 transition-colors border-t border-white/5 mt-1 pt-2.5"
                          >
                            <Undo2 className="h-4 w-4" />
                            Move to Active
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onRemove(item.id); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/10 flex items-center gap-3 transition-colors border-t border-white/5 mt-1 pt-2.5 font-medium"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Permanent
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-black/20">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-lg border border-white/25 bg-success/55 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                        Finished
                      </span>
                      {item.platform && (
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{item.platform}</span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-display font-bold text-white leading-tight line-clamp-2">
                      {item.title}
                    </h3>

                    {item.author?.trim() && (
                      <p className="text-sm text-text-muted line-clamp-1 mt-1">{item.author.trim()}</p>
                    )}

                    {item.notes && (
                      <p className="text-xs text-text-muted line-clamp-2 italic leading-relaxed">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[10px] font-medium tracking-wide">
                        {finishedDate ? finishedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 group-hover:bg-success/10 group-hover:text-success transition-all border border-transparent group-hover:border-success/20">
                      <MessageSquareQuote className="h-3 w-3" />
                      <span className="text-[10px] font-bold">{item.thoughts?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

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
      </div>
    </div>
  );
}
