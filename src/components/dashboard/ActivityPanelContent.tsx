"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import ActivityRenderer from "@/components/ActivityRenderer";

type Activity = {
    id: string;
    title: string;
    description: string | null;
    content: string;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
};

type ActivityPanelContentProps = {
    activityId: string | null;
    assignmentId: string | null;
    onClose: () => void;
};

export function ActivityPanelContent({
    activityId,
    assignmentId,
    onClose,
}: ActivityPanelContentProps) {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!activityId) {
            setActivity(null);
            return;
        }

        const controller = new AbortController();

        setIsLoading(true);
        setError(null);

        fetch(
            `/api/activity/${activityId}${assignmentId ? `?assignment=${assignmentId}` : ""}`,
            { signal: controller.signal }
        )
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load activity");
                return res.json();
            })
            .then((data) => setActivity(data))
            .catch((err) => {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [activityId, assignmentId]);

    const fullPageUrl = activityId
        ? `/activity/${activityId}${assignmentId ? `?assignment=${assignmentId}` : ""}`
        : null;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-border/40 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-display font-bold text-text truncate flex-1 mr-4">
                    {activity?.title || "Activity"}
                </h2>
                <div className="flex items-center gap-2">
                    {fullPageUrl && (
                        <a
                            href={fullPageUrl}
                            className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-light border border-border/40 transition-colors"
                            aria-label="Open in full page"
                            title="Open in full page"
                        >
                            <ExternalLink className="w-4 h-4 text-text-muted" />
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-light border border-border/40 transition-colors"
                        aria-label="Close activity panel"
                    >
                        <X className="w-4 h-4 text-text-muted" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {isLoading && (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                )}
                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                        <p className="text-sm font-semibold text-red-600">{error}</p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 text-xs font-semibold text-red-500 underline hover:text-red-700"
                        >
                            Close panel
                        </button>
                    </div>
                )}
                {activity && !isLoading && (
                    <ActivityRenderer
                        activity={activity}
                        assignmentId={assignmentId}
                    />
                )}
            </div>
        </div>
    );
}
