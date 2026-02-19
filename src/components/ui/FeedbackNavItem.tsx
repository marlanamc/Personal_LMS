"use client";

import { useState } from "react";

export default function FeedbackNavItem() {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
        // Here you could open a feedback modal or navigate to feedback page
        console.log("Feedback clicked");
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="flex flex-col items-center justify-center gap-1 transition-[color,transform] duration-150 cursor-pointer touch-manipulation relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-95"
                style={{
                    color: 'var(--color-text-muted)',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                }}
            >
                <div className="w-6 h-6 transition-transform duration-150 pointer-events-none">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span className="text-xs font-medium pointer-events-none">Feedback</span>
            </button>
        </>
    );
}
