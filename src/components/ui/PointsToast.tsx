"use client";

import { useEffect, useState } from "react";

interface PointsToastProps {
    points: number;
    onComplete?: () => void;
}

export function PointsToast({ points, onComplete }: PointsToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const showTimer = setTimeout(() => setIsVisible(true), 50);

        // Start exit animation after 2 seconds
        const hideTimer = setTimeout(() => {
            setIsLeaving(true);
        }, 2000);

        // Clean up after exit animation
        const cleanupTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            clearTimeout(cleanupTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
                isVisible && !isLeaving
                    ? "opacity-100 translate-y-0 scale-100"
                    : isLeaving
                        ? "opacity-0 -translate-y-4 scale-95"
                        : "opacity-0 translate-y-4 scale-95"
            }`}
            role="status"
            aria-live="polite"
        >
            <div className="bg-gradient-to-r from-accent to-yellow-400 text-text px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold">
                <span className="text-2xl">+{points}</span>
                <span className="text-sm">points!</span>
            </div>
        </div>
    );
}
