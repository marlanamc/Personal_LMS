import React from "react";
import { Brain } from "lucide-react";
import type { InteractiveGuideSection } from "@/types/activity";

interface TableOfContentsProps {
    sections: InteractiveGuideSection[];
    currentIndex: number;
    completedSections: Set<string>;
    onSelectSection: (index: number) => void;
    hasMiniQuiz?: boolean;
    showingQuiz?: boolean;
    onSelectQuiz?: () => void;
}

export const TableOfContents = React.memo(function TableOfContents({
    sections,
    currentIndex,
    completedSections,
    onSelectSection,
    hasMiniQuiz,
    showingQuiz,
    onSelectQuiz,
}: TableOfContentsProps) {
    return (
        <div className="table-of-contents bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2 font-display">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                </svg>
                Table of Contents
            </h3>

            <ul className="space-y-2">
                {sections.map((section, index) => {
                    const isCompleted = section.id && completedSections.has(section.id);
                    const isCurrent = index === currentIndex && !showingQuiz;
                    const displayNumber = index + 1;

                    return (
                        <li key={section.id || index}>
                            <button
                                onClick={() => onSelectSection(index)}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-[background-color,color,border-color,box-shadow] duration-200 flex items-center gap-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isCurrent
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : isCompleted
                                            ? "bg-success/10 text-success border-success/40 hover:bg-success/20"
                                            : "bg-white text-text border-border hover:bg-bg-light hover:border-primary/60"
                                    }`}
                                aria-current={isCurrent ? "page" : undefined}
                                aria-label={`${displayNumber}. ${section.title}${isCompleted ? " (completed)" : ""}${isCurrent ? " (current section)" : ""}`}
                            >
                                {/* Icon/Emoji */}
                                <span className="flex-shrink-0 text-lg">
                                    {isCompleted ? (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className={`w-6 h-6 ${isCurrent ? "text-primary" : "text-text-muted"}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                        </svg>
                                    )}
                                </span>

                                {/* Title */}
                                <span className="flex-1 text-sm font-medium">
                                    <span className="font-bold mr-2">
                                        {displayNumber}.
                                    </span>
                                    {section.title}
                                </span>

                                {/* Current Indicator */}
                                {isCurrent && (
                                    <span className="flex-shrink-0">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}

                {/* Mini Quiz Entry */}
                {hasMiniQuiz && onSelectQuiz && (
                    <li>
                        <button
                            onClick={onSelectQuiz}
                            className={`w-full text-left px-4 py-3 rounded-lg border transition-[background-color,color,border-color,box-shadow] duration-200 flex items-center gap-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${showingQuiz
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white text-text border-border hover:bg-bg-light hover:border-primary/60"
                                }`}
                            aria-current={showingQuiz ? "page" : undefined}
                            aria-label={`Mini Quiz${showingQuiz ? " (current)" : ""}`}
                        >
                            {/* Brain Icon */}
                            <span className="flex-shrink-0">
                                <Brain className={`w-6 h-6 ${showingQuiz ? "text-white" : "text-primary"}`} />
                            </span>

                            {/* Title */}
                            <span className="flex-1 text-sm font-medium">
                                <span className="font-bold mr-2">
                                    {sections.length + 1}.
                                </span>
                                Mini Quiz
                            </span>

                            {/* Current Indicator */}
                            {showingQuiz && (
                                <span className="flex-shrink-0">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </span>
                            )}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
});
