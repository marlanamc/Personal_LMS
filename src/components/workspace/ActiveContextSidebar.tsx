'use client';

import Link from 'next/link';
import { BriefcaseBusiness, Clock, FileText, FolderKanban, MessageSquare } from 'lucide-react';
import type { RecentCapture } from '@/types/workspace';

interface ActiveContextSidebarProps {
  recentCaptures: RecentCapture[];
}

export function ActiveContextSidebar({ recentCaptures }: ActiveContextSidebarProps) {
  const getIcon = (capture: RecentCapture) => {
    switch (capture.type) {
      case 'thought-download':
        return <FileText className="w-4 h-4" />;
      case 'organize':
        return capture.workspaceId === 'work'
          ? <BriefcaseBusiness className="w-4 h-4" />
          : <FolderKanban className="w-4 h-4" />;
      case 'moment-log':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getHref = (capture: RecentCapture) => {
    switch (capture.type) {
      case 'thought-download':
        return capture.dateKey ? `/dashboard/thought-download?date=${capture.dateKey}` : '/dashboard/thought-download';
      case 'organize':
        return capture.workspaceId === 'work' ? '/dashboard/work-desk' : '/dashboard/organize';
      case 'moment-log':
        return capture.dateKey ? `/dashboard/interstitial-journalling?date=${capture.dateKey}` : '/dashboard/interstitial-journalling';
      default:
        return '/dashboard/workspace';
    }
  };

  const getLabel = (capture: RecentCapture) => {
    switch (capture.type) {
      case 'thought-download':
        return capture.dateKey || 'Thought Download';
      case 'organize':
        return capture.workspaceId === 'work' ? 'Work Desk' : 'Organize';
      case 'moment-log':
        return capture.dateKey || 'Moment Log';
      default:
        return 'Capture';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-medium text-foreground">Recent Captures</h3>
      </div>

      {/* Captures List */}
      <div className="space-y-2">
        {recentCaptures.length === 0 ? (
          <p className="text-sm text-muted-foreground px-1">No recent captures yet</p>
        ) : (
          recentCaptures.slice(0, 10).map((capture, index) => (
            <Link
              key={index}
              href={getHref(capture)}
              className="block p-3 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                  {getIcon(capture)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {getLabel(capture)}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getTimeAgo(capture.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {capture.preview}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
