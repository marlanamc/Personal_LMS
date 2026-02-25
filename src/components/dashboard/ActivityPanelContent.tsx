"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
            <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-border/40 flex items-center gap-3 shrink-0 bg-bg-primary/95 backdrop-blur-sm">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary hover:bg-bg-light border border-border/40 transition-colors text-sm font-semibold text-text"
                    aria-label="Back to Focus Timer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Focus</span>
                </button>

                <h2 className="text-lg sm:text-xl font-display font-bold text-text truncate flex-1">
                    {activity?.title || "Activity"}
                </h2>

                {fullPageUrl && (
                    <a
                        href={fullPageUrl}
                        className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-light border border-border/40 transition-colors"
                        aria-label="Open in separate page"
                        title="Open in separate page"
                    >
                        <ExternalLink className="w-4 h-4 text-text-muted" />
                    </a>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 pb-[calc(8rem+env(safe-area-inset-bottom))]">
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
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
                                Back to Focus Timer
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
        </div>
    );
}
