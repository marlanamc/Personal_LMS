'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface Suggestion {
  id: string;
  type: 'project-stale' | 'floating-bullets' | 'old-capture' | 'pattern';
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  metadata?: {
    count?: number;
    dateKey?: string;
    projectId?: string;
  };
}

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const getGradient = () => {
    switch (suggestion.type) {
      case 'project-stale':
        return 'from-accent-amethyst/10 to-accent-amethyst/5';
      case 'floating-bullets':
        return 'from-accent-teal/10 to-accent-teal/5';
      case 'old-capture':
        return 'from-primary/10 to-primary/5';
      case 'pattern':
        return 'from-accent-mint/10 to-accent-mint/5';
      default:
        return 'from-primary/10 to-primary/5';
    }
  };

  const getIconColor = () => {
    switch (suggestion.type) {
      case 'project-stale':
        return 'text-accent-amethyst';
      case 'floating-bullets':
        return 'text-accent-teal';
      case 'old-capture':
        return 'text-primary';
      case 'pattern':
        return 'text-accent-mint';
      default:
        return 'text-primary';
    }
  };

  return (
    <Link
      href={suggestion.actionHref}
      className="group block rounded-2xl border border-border-subtle/70 bg-gradient-to-br hover:border-primary/30 transition-all duration-200 hover:shadow-md p-4"
      style={{
        background: `linear-gradient(to bottom right, var(--color-bg-surface), var(--color-bg-elevated))`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg bg-gradient-to-br ${getGradient()} flex-shrink-0`}>
          <Sparkles className={`w-4 h-4 ${getIconColor()}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground">{suggestion.title}</h3>
            {suggestion.metadata?.count && (
              <span className="text-xs font-medium text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                {suggestion.metadata.count}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {suggestion.description}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors">
            {suggestion.actionLabel}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Helper function to generate suggestions based on workspace data
export function generateSuggestions(workspaceData: {
  projects: Array<{ id: string; label: string; lastEditedDays?: number; bulletCount: number }>;
  floatingBullets: number;
  oldCaptures: Array<{ dateKey: string; preview: string }>;
}): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Stale projects (not edited in 3+ days)
  const staleProjects = workspaceData.projects.filter(
    (p) => p.lastEditedDays && p.lastEditedDays >= 3 && p.bulletCount > 0
  );
  if (staleProjects.length > 0) {
    const project = staleProjects[0];
    suggestions.push({
      id: `stale-${project.id}`,
      type: 'project-stale',
      title: `Haven't checked "${project.label}" lately`,
      description: `You have ${project.bulletCount} bullets in this project. Want to revisit?`,
      actionLabel: 'Open project',
      actionHref: '/dashboard/organize',
      metadata: { projectId: project.id, count: project.bulletCount },
    });
  }

  // Floating bullets
  if (workspaceData.floatingBullets >= 5) {
    suggestions.push({
      id: 'floating-bullets',
      type: 'floating-bullets',
      title: 'Bullets waiting to be organized',
      description: `You have ${workspaceData.floatingBullets} thoughts that haven't been assigned to a project yet.`,
      actionLabel: 'Organize them',
      actionHref: '/dashboard/organize',
      metadata: { count: workspaceData.floatingBullets },
    });
  }

  // Old captures worth revisiting
  if (workspaceData.oldCaptures.length > 0) {
    const capture = workspaceData.oldCaptures[0];
    const formattedDate = new Date(`${capture.dateKey}T12:00:00`).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    suggestions.push({
      id: `old-capture-${capture.dateKey}`,
      type: 'old-capture',
      title: `Thought from ${formattedDate} might be useful today`,
      description: capture.preview,
      actionLabel: 'Reopen',
      actionHref: `/dashboard/thought-download?date=${capture.dateKey}`,
      metadata: { dateKey: capture.dateKey },
    });
  }

  return suggestions;
}
