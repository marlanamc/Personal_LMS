'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, BookOpen, Headphones, ChevronDown, ChevronUp } from 'lucide-react';
import { formatRelativeDate, type MediaItem } from '@/lib/media-hub';

interface FinishedSectionProps {
  items: MediaItem[];
}

export function FinishedSection({ items }: FinishedSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <section>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-2 mb-4 group"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <h2 className="font-display text-lg text-text-primary">Finished</h2>
          <span className="text-xs text-text-muted bg-success/10 text-success px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <span className="p-1 rounded-lg text-text-muted group-hover:text-text-primary group-hover:bg-white/5 transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          {items.map((item) => (
            <Card key={item.id} className="p-3 opacity-75">
              <div className="flex items-center gap-3">
                {item.type === 'audiobook' ? (
                  <Headphones className="h-4 w-4 text-text-muted flex-shrink-0" />
                ) : (
                  <BookOpen className="h-4 w-4 text-text-muted flex-shrink-0" />
                )}
                <span className="text-sm text-text-secondary flex-1 truncate">
                  {item.title}
                </span>
                <span className="text-xs text-text-muted flex-shrink-0">
                  {item.finishedAt ? formatRelativeDate(item.finishedAt) : 'completed'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
