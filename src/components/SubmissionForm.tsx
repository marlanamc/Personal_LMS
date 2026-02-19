"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Submission {
    id: string;
    content: string;
    status: string;
    score: number | null;
    feedback: string | null;
}

interface Props {
    activityId: string;
    assignmentId: string;
    existingSubmission: Submission | null;
}

export default function SubmissionForm({ activityId, assignmentId, existingSubmission }: Props) {
    const router = useRouter();
    const [submissionContent, setSubmissionContent] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const submitButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (existingSubmission) {
            setSubmissionContent(existingSubmission.content || "");
            setIsSubmitted(existingSubmission.status === "submitted" || existingSubmission.status === "graded");
        }
    }, [existingSubmission]);

    const handleTextareaFocus = () => {
        // On mobile, scroll the submit button into view after keyboard appears
        if (window.innerWidth < 768) {
            setTimeout(() => {
                submitButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 300);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!submissionContent.trim()) {
            setError("Please provide your submission");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/submissions", {
                method: existingSubmission ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activityId,
                    assignmentId,
                    content: submissionContent,
                    submissionId: existingSubmission?.id,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to submit");
            }

            setIsSubmitted(true);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to submit");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted && existingSubmission?.status === "graded") {
        return null; // Don't show form if already graded
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        id="submission"
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        onFocus={handleTextareaFocus}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 resize-y min-h-[120px] max-h-[40vh] md:min-h-[240px] md:max-h-[400px]"
                        placeholder="Type your answers, responses, or work here…"
                        disabled={isSubmitted && existingSubmission?.status === "graded"}
                    />
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {isSubmitted && existingSubmission?.status === "submitted" && (
                    <div className="rounded-md bg-blue-50 p-4">
                        <p className="text-sm text-blue-800">
                            ✓ Your submission has been submitted. Waiting for teacher review.
                        </p>
                    </div>
                )}

                {(!isSubmitted || existingSubmission?.status === "pending") && (
                    <div ref={submitButtonRef} className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 min-h-[44px] border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? "Submitting…" : existingSubmission ? "Update Submission" : "Submit"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}










