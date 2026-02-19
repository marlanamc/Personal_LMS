"use client";

import { EditableMarkdown } from "./EditableMarkdown";

interface TeachingScheduleEditorProps {
    initialContent: string;
}

export function TeachingScheduleEditor({ initialContent }: TeachingScheduleEditorProps) {
    const handleSave = async (content: string) => {
        const response = await fetch("/api/teaching-schedule/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to save schedule");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-display font-semibold text-text mb-2">Edit Teaching Schedule</h2>
                <p className="text-sm text-text/70">
                    Edit the teaching schedule markdown below. Changes will be saved to the schedule file.
                </p>
            </div>
            <EditableMarkdown initialContent={initialContent} onSave={handleSave} />
        </div>
    );
}

