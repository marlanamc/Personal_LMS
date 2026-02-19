"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearFeaturedButton() {
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

            // Show success message
            alert(data.message || "Featured assignments cleared successfully!");

            // Close confirm dialog and refresh the page
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
            <div className="flex items-center gap-2">
                <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Clearing…" : "Confirm Clear"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-semibold rounded-lg border border-border/50 text-text hover:bg-bg-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-2 text-sm font-semibold rounded-lg border border-border/50 text-text hover:bg-bg-light transition flex items-center gap-2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            Clear All Featured
        </button>
    );
}
