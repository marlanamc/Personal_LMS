"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { InteractiveGuideSection } from "@/types/activity";

interface BreadcrumbTrailProps {
    sections: InteractiveGuideSection[];
    currentIndex: number;
    completedSections: Set<string>;
    onJumpToSection: (index: number) => void;
    showQuiz: boolean;
}

export function BreadcrumbTrail({
    sections,
    currentIndex,
    completedSections,
    onJumpToSection: _onJumpToSection,
    showQuiz,
}: BreadcrumbTrailProps) {
    void _onJumpToSection;
    const [isDesktop, setIsDesktop] = useState(false);
    const grammarActivitiesHref = "/dashboard/activities?category=grammar";

    // Detect if we're on desktop (md breakpoint: 768px)
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    return (
        <div className="breadcrumb-trail bg-white border-b border-border sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-3">
                <nav className="flex items-center gap-2 text-sm overflow-x-auto">
                    <Link
                        href={isDesktop ? "/dashboard" : "/dashboard/activities"}
                        className="text-primary hover:underline flex-shrink-0"
                    >
                        Activities
                    </Link>
                    <span className="text-text-muted flex-shrink-0">/</span>
                    <Link
                        href={grammarActivitiesHref}
                        className="text-primary hover:underline flex-shrink-0"
                    >
                        Grammar
                    </Link>
                    <span className="text-text-muted flex-shrink-0">/</span>
                    <span className="text-text font-medium flex-shrink-0">Present Perfect</span>

                    {!showQuiz && (
                        <>
                            <span className="text-text-muted flex-shrink-0">/</span>
                            <span className="text-text-muted flex items-center gap-2">
                                {sections[currentIndex]?.id &&
                                    completedSections.has(sections[currentIndex].id) && (
                                        <svg
                                            className="w-4 h-4 text-success"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}
                                <span className="truncate max-w-xs">
                                    {sections[currentIndex]?.title}
                                </span>
                            </span>
                        </>
                    )}

                    {showQuiz && (
                        <>
                            <span className="text-text-muted flex-shrink-0">/</span>
                            <span className="text-text-muted">Mini Quiz</span>
                        </>
                    )}
                </nav>
            </div>
        </div>
    );
}
