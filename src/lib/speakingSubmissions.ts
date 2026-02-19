import type { SpeakingSubmission } from "@/types/activity";

const STORAGE_KEY = "speaking-warmup-draft";

export interface DraftData {
    activityId: string;
    assignmentId?: string | null;
    selectedPromptIds: string[];
    solo: {
        sentences: [string, string, string];
        followUpQuestions: [string, string];
        completedStepIds: string[];
    };
    speaking: {
        bestSentence: string;
        completedStepIds: string[];
    };
    lastSaved: string;
}

export function saveDraft(data: Omit<DraftData, 'lastSaved'>): void {
    if (typeof window === 'undefined') return;
    
    const draftData: DraftData = {
        ...data,
        lastSaved: new Date().toISOString(),
    };
    
    const key = `${STORAGE_KEY}-${data.activityId}-${data.assignmentId || 'no-assignment'}`;
    localStorage.setItem(key, JSON.stringify(draftData));
}

export function loadDraft(activityId: string, assignmentId?: string | null): DraftData | null {
    if (typeof window === 'undefined') return null;
    
    const key = `${STORAGE_KEY}-${activityId}-${assignmentId || 'no-assignment'}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) return null;
    
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

export function clearDraft(activityId: string, assignmentId?: string | null): void {
    if (typeof window === 'undefined') return;
    
    const key = `${STORAGE_KEY}-${activityId}-${assignmentId || 'no-assignment'}`;
    localStorage.removeItem(key);
}

export type SpeakingSubmissionPayload = Omit<SpeakingSubmission, "submittedAt" | "status" | "userId">;

export interface SubmitSpeakingWarmupResult {
    success: boolean;
    submission?: SpeakingSubmission | null;
    error?: string;
}

export async function submitSpeakingWarmup(submission: SpeakingSubmissionPayload): Promise<SubmitSpeakingWarmupResult> {
    try {
        const response = await fetch("/api/speaking/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission),
        });
        
        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            return { 
                success: false, 
                error: data.error || `HTTP ${response.status}: ${response.statusText}` 
            };
        }
        // Clear draft on successful submission
        clearDraft(submission.activityId, submission.assignmentId);
        
        return { success: true, submission: data.submission || null };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        };
    }
}

export async function getSpeakingSubmission(activityId: string, assignmentId?: string | null): Promise<SpeakingSubmission | null> {
    try {
        const params = new URLSearchParams({ activityId });
        if (assignmentId) params.append('assignmentId', assignmentId);
        
        const response = await fetch(`/api/speaking/submissions?${params}`);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.submission || null;
    } catch {
        return null;
    }
}
