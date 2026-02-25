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
    const isGuideActivity = activity?.type === "guide";
    const categoryRaw = (activity?.category || "").toLowerCase();
    const titleLower = (activity?.title || "").toLowerCase();
    const idLower = (activity?.id || "").toLowerCase();
    const isCodingLike =
        categoryRaw === "coding" ||
        idLower.startsWith("coding-") ||
        titleLower.includes("coding") ||
        titleLower.includes("javascript") ||
        titleLower.includes("typescript") ||
        titleLower.includes("js/ts");
    const isSpanishLike =
        categoryRaw === "spanish" ||
        idLower.startsWith("spanish-") ||
        titleLower.includes("spanish");
    const categoryCrumb = isCodingLike
        ? { label: "Coding", href: "/dashboard/subjects?subject=coding" }
        : isSpanishLike
            ? { label: "Spanish", href: "/dashboard/subjects?subject=spanish" }
            : { label: "Subjects", href: "/dashboard/subjects" };

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

                    <div className="flex-1 min-w-0">
                        <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-2 text-sm text-text-muted">
                            <a href="/dashboard" className="hover:text-text transition-colors">Home</a>
                            <span aria-hidden>/</span>
                            <a href="/dashboard/subjects" className="hover:text-text transition-colors">Subjects</a>
                            {categoryCrumb && (
                                <>
                                    <span aria-hidden>/</span>
                                    <a href={categoryCrumb.href} className="hover:text-text transition-colors">
                                        {categoryCrumb.label}
                                    </a>
                                </>
                            )}
                            <span aria-hidden>/</span>
                            <span className="text-text">Timer</span>
                        </nav>
                        <h2 className="text-lg sm:text-xl font-display font-bold text-text truncate">
                            {activity?.title || "Activity"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                        ? "flex-1 overflow-hidden min-h-0"
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
