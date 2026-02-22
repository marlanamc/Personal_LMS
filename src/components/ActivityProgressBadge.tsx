"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
    activityId: string;
    assignmentId?: string | null;
    initialProgress?: number | null;
    userRole?: string | null;
};

export function ActivityProgressBadge({
    activityId,
    assignmentId = null,
    initialProgress = 0,
    userRole,
}: Props) {
    const [progress, setProgress] = useState(initialProgress ?? 0);
    const normalizedRole = userRole?.toLowerCase();
    const normalizedAssignmentId =
        typeof assignmentId === "string" && assignmentId.trim().length > 0 ? assignmentId.trim() : null;

    useEffect(() => {
        setProgress(initialProgress ?? 0);
    }, [initialProgress]);

    useEffect(() => {
        if (!activityId) return;
        if (normalizedRole && normalizedRole !== "student") return;

        let isMounted = true;

        const fetchProgress = async () => {
            try {
                const params = new URLSearchParams({ activityId });
                if (assignmentId) params.set("assignmentId", assignmentId);
                const response = await fetch(`/api/activity/progress?${params.toString()}`, {
                    method: "GET",
                    cache: "no-store",
                });
                if (!response.ok) return;
                const data = (await response.json()) as { progress?: unknown };
                const nextProgress = typeof data.progress === "number" ? data.progress : 0;
                if (isMounted) {
                    setProgress(Math.max(0, Math.min(100, Math.round(nextProgress))));
                }
            } catch {
                // Keep previous value if refresh fails.
            }
        };

        void fetchProgress();
        const interval = window.setInterval(fetchProgress, 7000);

        return () => {
            isMounted = false;
            window.clearInterval(interval);
        };
    }, [activityId, assignmentId, normalizedRole]);

    useEffect(() => {
        if (!activityId) return;
        if (normalizedRole && normalizedRole !== "student") return;

        const handleProgressUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<{ activityId?: unknown; assignmentId?: unknown; progress?: unknown }>;
            const detail = customEvent.detail;
            if (!detail || detail.activityId !== activityId) return;

            const detailAssignmentId =
                typeof detail.assignmentId === "string" && detail.assignmentId.trim().length > 0
                    ? detail.assignmentId.trim()
                    : null;
            if (detailAssignmentId !== normalizedAssignmentId) return;

            if (typeof detail.progress === "number") {
                setProgress(Math.max(0, Math.min(100, Math.round(detail.progress))));
            }
        };

        window.addEventListener("activity-progress-updated", handleProgressUpdated);
        return () => {
            window.removeEventListener("activity-progress-updated", handleProgressUpdated);
        };
    }, [activityId, normalizedAssignmentId, normalizedRole]);

    const color = useMemo(
        () =>
            progress >= 100
                ? "bg-pink-500/20 text-pink-100 border-pink-300/60"
                : "bg-pink-500/12 text-pink-300 border-pink-400/45",
        [progress]
    );

    return (
        <div
            className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${color}`}
            aria-label={`Progress ${progress}%`}
        >
            <span>{progress}%</span>
            <span className="uppercase tracking-wide hidden sm:inline">Done</span>
        </div>
    );
}
