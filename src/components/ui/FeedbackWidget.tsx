"use client";

import { useState } from "react";

interface FeedbackWidgetProps {
    activityId?: string;
    activityTitle?: string;
    className?: string;
}

export default function FeedbackWidget({ activityId, activityTitle, className = "" }: FeedbackWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [difficulty, setDifficulty] = useState<"easy" | "just-right" | "hard" | null>(null);
    const [feedbackType, setFeedbackType] = useState<"issue" | "suggestion" | null>(null);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activityId,
                    activityTitle,
                    difficulty,
                    type: feedbackType,
                    message: message.trim(),
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setIsOpen(false);
                    resetForm();
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setDifficulty(null);
        setFeedbackType(null);
        setMessage("");
        setSubmitted(false);
    };

    if (!isOpen) {
        return (
            <div className={`fixed bottom-4 right-4 z-[9999] ${className}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:shadow-xl transition-all duration-200 hover:scale-105 group cursor-pointer"
                    aria-label="Give feedback"
                    style={{ pointerEvents: 'auto' }}
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors hidden sm:block">
                            Feedback
                        </span>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Activity Feedback</h3>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            resetForm();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.066L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h4>
                            <p className="text-gray-600">Your feedback helps us improve the learning experience.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Activity Info */}
                            {activityTitle && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-600">Activity:</p>
                                    <p className="font-medium text-gray-900">{activityTitle}</p>
                                </div>
                            )}

                            {/* Difficulty Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    How difficult was this activity?
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: "easy", label: "Too Easy", color: "green" },
                                        { value: "just-right", label: "Just Right", color: "blue" },
                                        { value: "hard", label: "Too Hard", color: "red" },
                                    ].map(({ value, label, color }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setDifficulty(value as "easy" | "just-right" | "hard")}
                                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                                difficulty === value
                                                    ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                                                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    What type of feedback?
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFeedbackType("issue")}
                                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                            feedbackType === "issue"
                                                ? "border-red-500 bg-red-50 text-red-700"
                                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        Report Issue
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFeedbackType("suggestion")}
                                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                            feedbackType === "suggestion"
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Suggestion
                                    </button>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tell us more (optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="What did you think? Any issues or ideas for improvement?"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {message.length}/500 characters
                                </p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
