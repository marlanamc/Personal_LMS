"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Timer } from "lucide-react";
import ActivityRenderer from "@/components/ActivityRenderer";
import { useFocusTimer } from "@/context/FocusTimerContext";

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
    const { formattedTime, isActive } = useFocusTimer();
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
    const isGuideActivity = activity?.type === "guide";

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 border-b border-border/40 shrink-0 bg-bg-primary/95 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2 sm:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary hover:bg-bg-light border border-border/40 transition-colors text-sm font-semibold text-text"
                        aria-label="Back to Focus Timer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    <h2 className="text-base font-display font-bold text-text truncate flex-1 text-center px-2">
                        {activity?.title || "Activity"}
                    </h2>
                    <div className="flex items-center gap-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border/40 bg-bg-secondary text-xs font-semibold text-text">
                            <Timer className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-text-muted"}`} />
                            <span>{formattedTime}</span>
                        </div>
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
                </div>

                <div className="hidden sm:flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary hover:bg-bg-light border border-border/40 transition-colors text-sm font-semibold text-text shrink-0"
                        aria-label="Back to Focus Timer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Focus</span>
                    </button>

                    <h2 className="text-lg sm:text-xl font-display font-bold text-text truncate flex-1 min-w-0">
                        {activity?.title || "Activity"}
                    </h2>

                    <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/40 bg-bg-secondary text-sm font-semibold text-text">
                            <Timer className={`w-4 h-4 ${isActive ? "text-primary" : "text-text-muted"}`} />
                            <span>{formattedTime}</span>
                        </div>
                        {isGuideActivity && (
                            <div
                                id="interactive-guide-header-controls"
                                className="hidden sm:flex items-center gap-2 mr-1"
                            />
                        )}
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
                </div>
            </div>

            {/* Content */}
            <div
                className={
                    isGuideActivity
                        ? "flex-1 overflow-y-auto min-h-0"
                        : "flex-1 overflow-y-auto min-h-0 pb-[calc(8rem+env(safe-area-inset-bottom))]"
                }
            >
                <div className={isGuideActivity ? "w-full h-full min-h-0 p-0" : "max-w-4xl mx-auto p-4 sm:p-6"}>
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
