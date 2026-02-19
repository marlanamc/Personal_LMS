"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EditableMarkdownProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    className?: string;
}

export function EditableMarkdown({ initialContent, onSave, className = "" }: EditableMarkdownProps) {
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        setSuccess(false);

        try {
            await onSave(content);
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => {
                setSuccess(false);
                router.refresh();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setContent(initialContent);
        setIsEditing(false);
        setError("");
        setSuccess(false);
    };

    if (!isEditing) {
        return (
            <div className={`relative ${className}`}>
                <div className="prose prose-sm max-w-none bg-bg-light rounded-lg p-6 border border-border/50">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-text leading-relaxed">
                        {content}
                    </pre>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition text-sm font-medium"
                >
                    ✏️ Edit Schedule
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="bg-bg-light rounded-lg border border-border/50">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[600px] p-6 font-mono text-sm text-text bg-transparent border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
                    placeholder="Enter markdown content…"
                />
            </div>

            {error && (
                <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                    ✓ Schedule saved successfully!
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Saving…" : "💾 Save Changes"}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-lg border border-border/50 hover:bg-bg-light transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

