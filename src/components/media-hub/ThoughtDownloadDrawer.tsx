'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, BookOpen, Trash2, Clock, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MEDIA_TYPE_CONFIG, type MediaItem } from '@/lib/media-hub';
import { formatThoughtDate } from '@/lib/media-hub';

interface ThoughtDownloadDrawerProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onAddThought: (mediaId: string, content: string, progress?: string) => void;
  onRemoveThought: (mediaId: string, thoughtId: string) => void;
}

export function ThoughtDownloadDrawer({
  item,
  isOpen,
  onClose,
  onAddThought,
  onRemoveThought,
}: ThoughtDownloadDrawerProps) {
  const [content, setContent] = useState('');
  const [progress, setProgress] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when thoughts change or drawer opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, item.thoughts]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;

    onAddThought(item.id, content, progress);
    setContent('');
    setProgress('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const typeConfig = MEDIA_TYPE_CONFIG[item.type];
  const sortedThoughts = [...(item.thoughts || [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-bg-surface border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
        
        {/* Header */}
        <header className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-bg-elevated/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl overflow-hidden shadow-inner flex-shrink-0">
              {item.coverUrl ? (
                <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                item.coverEmoji || typeConfig.emoji
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-sm text-text-primary truncate leading-tight">
                {item.title}
              </h3>
              {item.author?.trim() && (
                <p className="text-xs text-text-muted truncate mt-0.5">{item.author.trim()}</p>
              )}
              <p className="text-[10px] font-bold text-success uppercase tracking-widest mt-0.5">
                Thought Download
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Thoughts List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {sortedThoughts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <MessageSquareQuote className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium">No thoughts logged yet.</p>
              <p className="text-xs mt-1">Start your download below – it stays with this book forever.</p>
            </div>
          ) : (
            sortedThoughts.map((thought, idx) => (
              <div key={thought.id} className="group flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    <Clock className="h-3 w-3" />
                    <span>{formatThoughtDate(thought.createdAt)}</span>
                    {thought.progressMarker && (
                      <>
                        <span className="opacity-30">·</span>
                        <span className="text-success">{thought.progressMarker}</span>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => onRemoveThought(item.id, thought.id)}
                    className="p-1 rounded-lg text-error/40 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete thought"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="relative">
                  {/* Visual timeline line */}
                  {idx < sortedThoughts.length - 1 && (
                    <div className="absolute left-[3px] top-full h-6 w-px bg-white/5 -z-10" />
                  )}
                  
                  <div className="p-4 rounded-2xl bg-bg-elevated border border-white/10 text-sm text-text-secondary leading-relaxed shadow-sm group-hover:border-white/20 transition-colors whitespace-pre-wrap">
                    {thought.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-bg-elevated border-t border-white/10 pb-8 sm:pb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Log a thought, quote, or reflection..."
                className="w-full bg-bg-surface border border-white/10 rounded-2xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-success/30 focus:border-success/50 transition-all resize-none min-h-[100px] shadow-inner"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-[9px] text-text-muted font-medium opacity-50 hidden sm:inline">
                  ⌘ + Enter to log
                </span>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm" 
                  disabled={!content.trim()}
                  className="rounded-xl px-3 bg-success hover:bg-success-light text-success-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-1">
              <BookOpen className="h-3.5 w-3.5 text-text-muted" />
              <input 
                type="text"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                placeholder="Chapter / Page (optional)"
                className="flex-1 bg-transparent border-none text-[10px] font-bold text-text-muted uppercase tracking-widest placeholder-text-muted/40 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
