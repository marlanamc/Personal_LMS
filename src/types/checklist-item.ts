import type { AnchorId } from '@/lib/anchors';

export interface VocabCategoryData {
  'word-list'?: { completed: boolean; progress: number; completedAt?: string };
  flashcards?: { completed: boolean; progress: number; completedAt?: string };
  matching?: { completed: boolean; progress: number; completedAt?: string };
  'fill-blank'?: { completed: boolean; progress: number; completedAt?: string };
}

export interface ChecklistItem {
  id: string;
  title?: string | null;
  activityId: string;
  dueDate?: string | Date | null;
  featuredAt?: string | Date | null;
  updatedAt?: string | Date | null;
  createdAt?: string | Date | null;
  isNewRelease?: boolean;
  progress?: number;
  progressStatus?: string;
  categoryData?: VocabCategoryData | string | null;
  anchorId?: AnchorId;
  activity: {
    title: string;
    description: string | null;
    type: string;
    category?: string | null;
  };
  submissions: Array<{
    id: string;
    status: string;
    completedAt: string | Date | null;
    score: number | null;
  }>;
}
