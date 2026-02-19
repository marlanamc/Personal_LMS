"use client";

import { useEffect } from "react";
import { BackButton } from "@/components/ui/BackButton";

export default function ActivityError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Activity Error]", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="bg-white border border-border/60 rounded-2xl shadow-sm p-6 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">This activity couldn’t load</h1>
                    <p className="text-sm text-gray-600">
                        It might be temporarily unavailable. You can try again, or go back.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={reset}
                            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition"
                        >
                            Reload activity
                        </button>
                        <BackButton href="/dashboard">Back to Dashboard</BackButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

