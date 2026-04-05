// ============================================
// Thread Suggestions - Smart AI-powered nudges for thread management
// ============================================

import type { Thread } from './threads';

export interface ThreadSuggestion {
  type: 'rest' | 'revive' | 'link-activities' | 'add-activity' | 'overwhelm';
  priority: 'low' | 'medium' | 'high';
  message: string;
  action?: {
    label: string;
    type: 'rest' | 'revive' | 'archive' | 'link';
  };
}

function daysBetween(date1: Date, date2: Date): number {
  const diffMs = date2.getTime() - date1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Generate smart suggestions for a thread based on its state and context
 */
export function getThreadSuggestions(thread: Thread, allThreads: Thread[]): ThreadSuggestion[] {
  const suggestions: ThreadSuggestion[] = [];
  const now = new Date();

  // Rest suggestion: active > 14 days
  if (thread.status === 'active' && thread.lastFocused) {
    const daysSinceFocused = daysBetween(new Date(thread.lastFocused), now);
    if (daysSinceFocused > 14) {
      suggestions.push({
        type: 'rest',
        priority: 'high',
        message: 'Active for 2+ weeks — consider resting',
        action: { label: 'Rest Thread', type: 'rest' },
      });
    } else if (daysSinceFocused > 7 && (!thread.lastActivityDate || daysBetween(new Date(thread.lastActivityDate), now) > 5)) {
      suggestions.push({
        type: 'rest',
        priority: 'medium',
        message: 'No recent activity — rest or re-engage?',
        action: { label: 'Rest Thread', type: 'rest' },
      });
    }
  }

  // Revive suggestion: resting > 7 days with activities
  if (thread.status === 'resting' && thread.lastRested) {
    const daysSinceRested = daysBetween(new Date(thread.lastRested), now);
    if (daysSinceRested > 7 && thread.activities && thread.activities.length > 0) {
      suggestions.push({
        type: 'revive',
        priority: 'medium',
        message: 'Ready to revive this thread?',
        action: { label: 'Revive', type: 'revive' },
      });
    } else if (daysSinceRested > 30) {
      suggestions.push({
        type: 'revive',
        priority: 'low',
        message: 'Still relevant? Archive or revive?',
        action: { label: 'Archive', type: 'archive' },
      });
    }
  }

  // Link activities suggestion
  if (thread.status === 'active' && (!thread.activities || thread.activities.length === 0)) {
    suggestions.push({
      type: 'link-activities',
      priority: 'medium',
      message: 'Link activities to track progress',
      action: { label: 'Link Activities', type: 'link' },
    });
  }

  // Add activity suggestion (no recent activity)
  if (thread.status === 'active' && thread.activities && thread.activities.length > 0) {
    if (!thread.lastActivityDate || daysBetween(new Date(thread.lastActivityDate), now) > 5) {
      suggestions.push({
        type: 'add-activity',
        priority: 'low',
        message: 'Keep momentum — complete an activity',
      });
    }
  }

  // Overwhelm warning (applies to all active threads when count > 5)
  const activeCount = allThreads.filter((t) => t.status === 'active').length;
  if (thread.status === 'active' && activeCount > 5) {
    suggestions.push({
      type: 'overwhelm',
      priority: 'high',
      message: `You have ${activeCount} active threads — consider resting some`,
    });
  }

  return suggestions;
}

/**
 * Get all suggestions across all threads, deduplicated and prioritized
 */
export function getAllThreadSuggestions(threads: Thread[]): Array<ThreadSuggestion & { threadId: string; threadTitle: string }> {
  const allSuggestions: Array<ThreadSuggestion & { threadId: string; threadTitle: string }> = [];

  threads.forEach((thread) => {
    const threadSuggestions = getThreadSuggestions(thread, threads);
    threadSuggestions.forEach((suggestion) => {
      allSuggestions.push({
        ...suggestion,
        threadId: thread.id,
        threadTitle: thread.title,
      });
    });
  });

  // Deduplicate overwhelm suggestions (show only once)
  const overwhelmSuggestions = allSuggestions.filter((s) => s.type === 'overwhelm');
  const otherSuggestions = allSuggestions.filter((s) => s.type !== 'overwhelm');

  const deduped = [...otherSuggestions];
  if (overwhelmSuggestions.length > 0) {
    deduped.push(overwhelmSuggestions[0]); // Take first overwhelm suggestion
  }

  // Sort by priority (high > medium > low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  deduped.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return deduped;
}
