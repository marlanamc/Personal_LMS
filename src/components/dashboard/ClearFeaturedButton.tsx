"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface ClearFeaturedButtonProps {
    variant?: "default" | "subtle";
}

export default function ClearFeaturedButton({ variant = "subtle" }: ClearFeaturedButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClear = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/assignments/featured", {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to clear featured assignments");
            }

            alert(data.message || "Featured assignments cleared successfully!");
            setShowConfirm(false);
            router.refresh();
        } catch (error) {
            console.error("Error clearing featured assignments:", error);
            alert(error instanceof Error ? error.message : "Failed to clear featured assignments");
        } finally {
            setIsLoading(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="px-2.5 py-1.5 text-meta font-semibold rounded-md bg-primary text-bg-base hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Clearing..." : "Confirm"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                    className="px-2.5 py-1.5 text-meta font-medium rounded-md text-text-muted hover:text-text hover:bg-bg-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        );
    }

    if (variant === "default") {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className="px-3 py-2 text-body font-semibold rounded-lg border border-border/50 text-text hover:bg-bg-light transition flex items-center gap-2"
            >
                <X className="h-4 w-4" aria-hidden />
                Clear All Featured
            </button>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-1.5 px-1.5 py-1 text-meta font-medium text-text-muted hover:text-text transition-colors"
            aria-label="Clear all featured assignments"
        >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear all featured
        </button>
    );
}
