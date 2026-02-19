export type ActivityProgressStatus = "in_progress" | "completed" | "submitted";

export interface ActivityProgressResult {
    ok: boolean;
    progress: number;
    status: string;
    pointsAwarded?: number;
}

export interface FetchedActivityProgress {
    progress: number;
    status: string;
    categoryData: Record<string, { completed?: boolean; progress?: number; accuracy?: number }> | null;
    updatedAt: string | null;
}

export interface GuideState {
    lastSectionIndex: number;
    completedSectionIds?: string[];
}

export async function fetchActivityProgress(
    activityId: string,
    assignmentId?: string | null
): Promise<FetchedActivityProgress | null> {
    if (!activityId) return null;

    try {
        const params = new URLSearchParams({ activityId });
        if (assignmentId) {
            params.append("assignmentId", assignmentId);
        }

        const response = await fetch(`/api/activity/progress?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const data = await response.json();
            return {
                progress: data.progress ?? 0,
                status: data.status ?? "in_progress",
                categoryData: data.categoryData ? JSON.parse(data.categoryData) : null,
                updatedAt: data.updatedAt ?? null,
            };
        }
        return null;
    } catch {
        return null;
    }
}

export async function saveActivityProgress(
    activityId: string,
    progress: number,
    status?: ActivityProgressStatus,
    accuracy?: number,
    category?: string,
    assignmentId?: string | null,
    guideState?: GuideState,
    vocabType?: string
): Promise<ActivityProgressResult | null> {
    if (!activityId) return null;
    const value = Math.max(0, Math.min(100, Math.round(progress)));
    const finalStatus: ActivityProgressStatus = status ?? (value >= 100 ? "completed" : "in_progress");

    try {
        const response = await fetch("/api/activity/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                activityId,
                progress: value,
                status: finalStatus,
                accuracy: accuracy !== undefined ? Math.max(0, Math.min(100, Math.round(accuracy))) : undefined,
                category: category,
                assignmentId: assignmentId ?? undefined,
                guideState: guideState ?? undefined,
                vocabType: vocabType ?? undefined
            }),
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch {
        // best-effort; silent fail
        return null;
    }
}
