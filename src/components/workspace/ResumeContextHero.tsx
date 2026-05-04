'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, FileText, FolderKanban, MessageSquare } from 'lucide-react';
import type { ResumeContext } from '@/types/workspace';

interface ResumeContextHeroProps {
  resumeContext: ResumeContext;
}

export function ResumeContextHero({ resumeContext }: ResumeContextHeroProps) {
  const { tool, workspaceId, label, preview, lastEditedAt, resumeHref } = resumeContext;

  const getIcon = () => {
    switch (tool) {
      case 'thought-download':
        return <FileText className="w-6 h-6" />;
      case 'organize':
        return workspaceId === 'work'
          ? <BriefcaseBusiness className="w-6 h-6" />
          : <FolderKanban className="w-6 h-6" />;
      case 'moment-log':
        return <MessageSquare className="w-6 h-6" />;
    }
  };

  const getTimeAgo = (date: Date) => {
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
    <div className="cosmic-hero-field rounded-xl p-6 md:p-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            {getIcon()}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">You were working on...</p>
            <p className="font-medium text-lg text-foreground">{label}</p>
          </div>
        </div>

        {/* Preview */}
        <div className="pl-1">
          <p className="text-base text-foreground/80 line-clamp-2 max-w-3xl">
            {preview}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Last edited {getTimeAgo(lastEditedAt)}
          </p>

          <Link
            href={resumeHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
          >
            Pick up where you left off
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
