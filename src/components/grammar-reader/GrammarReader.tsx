"use client";

import type { InteractiveGuideContent } from "@/types/activity";
import InteractiveGuideViewer from "@/components/InteractiveGuideViewer";

interface GrammarReaderProps {
    content: InteractiveGuideContent;
    completionKey?: string;
    activityId?: string;
}

export function GrammarReader({ content, activityId }: GrammarReaderProps) {
    return (
        <div className="grammar-reader-container min-h-screen bg-bg">
            <InteractiveGuideViewer
                content={content}
                showHeader={true}
                activityId={activityId}
            />
        </div>
    );
}

