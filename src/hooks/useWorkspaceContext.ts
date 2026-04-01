import { useState, useEffect } from 'react';
import type { WorkspaceContext, ResumeContext, WorkspaceToolType } from '@/types/workspace';

export function useWorkspaceContext() {
  const [context, setContext] = useState<WorkspaceContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContext() {
      try {
        const response = await fetch('/api/workspace/context');
        const data = await response.json();

        if (response.ok) {
          if (data.hasContext) {
            setContext({
              ...data.context,
              lastEditedAt: new Date(data.context.lastEditedAt),
              createdAt: new Date(data.context.createdAt),
            });
          } else {
            setContext(null);
          }
        } else {
          setError(data.error || 'Failed to fetch workspace context');
        }
      } catch (err) {
        setError('Failed to fetch workspace context');
        console.error('[useWorkspaceContext] Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContext();

    // Refetch on window focus to keep context fresh
    const handleFocus = () => {
      fetchContext();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const hasActiveContext = context?.lastTool !== null && context !== null;

  const resumeContext: ResumeContext | null = context && context.lastTool
    ? {
        tool: context.lastTool,
        label: getToolLabel(context.lastTool),
        preview: getPreview(context),
        lastEditedAt: context.lastEditedAt,
        resumeHref: getResumeHref(context),
      }
    : null;

  return {
    context,
    isLoading,
    error,
    hasActiveContext,
    resumeContext,
    recentCaptures: context?.recentCaptures || [],
  };
}

function getToolLabel(tool: WorkspaceToolType): string {
  switch (tool) {
    case 'thought-download':
      return 'Thought Download';
    case 'organize':
      return 'Organize';
    case 'moment-log':
      return 'Moment Log';
    default:
      return 'Workspace';
  }
}

function getPreview(context: WorkspaceContext): string {
  // Get preview from most recent capture
  if (context.recentCaptures.length > 0) {
    return context.recentCaptures[0].preview;
  }
  return 'Continue where you left off...';
}

function getResumeHref(context: WorkspaceContext): string {
  if (!context.lastTool) return '/dashboard/workspace';

  switch (context.lastTool) {
    case 'thought-download':
      return context.lastDateKey
        ? `/dashboard/thought-download?date=${context.lastDateKey}`
        : '/dashboard/thought-download';
    case 'organize':
      return '/dashboard/organize';
    case 'moment-log':
      return context.lastDateKey
        ? `/dashboard/interstitial-journalling?date=${context.lastDateKey}`
        : '/dashboard/interstitial-journalling';
    default:
      return '/dashboard/workspace';
  }
}
