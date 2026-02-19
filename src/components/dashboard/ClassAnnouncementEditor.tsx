"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClassAnnouncementEditorProps {
    classId: string;
    initialAnnouncement: string | null;
}

const MAX_ANNOUNCEMENT_LENGTH = 1000;

export function ClassAnnouncementEditor({
    classId,
    initialAnnouncement,
}: ClassAnnouncementEditorProps) {
    const router = useRouter();
    const [announcement, setAnnouncement] = useState(initialAnnouncement ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const remaining = MAX_ANNOUNCEMENT_LENGTH - announcement.length;

    const saveAnnouncement = async () => {
        setIsSaving(true);
        setError(null);
        setIsSaved(false);

        try {
            const response = await fetch(`/api/classes/${classId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    announcement: announcement.trim() ? announcement : null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.error || "Failed to save announcement");
            }

            setIsSaved(true);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save announcement");
        } finally {
            setIsSaving(false);
        }
    };

    const clearAnnouncement = async () => {
        setAnnouncement("");
        setIsSaving(true);
        setError(null);
        setIsSaved(false);

        try {
            const response = await fetch(`/api/classes/${classId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ announcement: null }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.error || "Failed to clear announcement");
            }

            setIsSaved(true);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to clear announcement");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <h2 className="text-xl font-semibold">Class Announcement</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        This appears on the student dashboard above the weekly checklist.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Markdown supported: <code>**bold**</code>, <code>*italic*</code>, <code>`code`</code>, and bullet lines starting with <code>- </code>.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Links: <code>[Quiz Review](https://example.com)</code>
                    </p>
                </div>
            </div>

            <textarea
                value={announcement}
                onChange={(event) => setAnnouncement(event.target.value)}
                rows={4}
                maxLength={MAX_ANNOUNCEMENT_LENGTH}
                placeholder="Example: Quiz on Friday. Complete all speaking activities by Thursday."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />

            <div className="mt-2 text-xs text-gray-500">
                {remaining} characters left
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-700">{error}</p>
            )}
            {isSaved && !error && (
                <p className="mt-3 text-sm text-green-700">Announcement saved.</p>
            )}

            <div className="mt-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={saveAnnouncement}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                >
                    {isSaving ? "Saving..." : "Save Announcement"}
                </button>
                <button
                    type="button"
                    onClick={clearAnnouncement}
                    disabled={isSaving || announcement.trim().length === 0}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
