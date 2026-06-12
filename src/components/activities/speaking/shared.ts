'use client';

import type { SpeakingActivityContent } from '@/types/activity';

export const MIN_SENTENCE_LENGTH = 5;

export interface Props {
  content: SpeakingActivityContent;
  activityId: string;
  assignmentId?: string | null;
}

export interface SoloFormData {
  sentences: [string, string, string];
  followUpQuestions: [string, string];
}

export interface SpeakingFormData {
  bestSentence: string;
}
