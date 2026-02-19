"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string | null;
    username: string;
}

interface Submission {
    id: string;
    content: string;
    status: string;
    score: number | null;
    feedback: string | null;
    createdAt: Date;
    user: User;
}

interface Assignment {
    id: string;
    title: string | null;
    activity: {
        id: string;
        title: string;
    };
    submissions: Submission[];
}

interface Props {
    assignment: Assignment;
    students: User[];
}

export default function SubmissionsList({ assignment, students }: Props) {
    const router = useRouter();
    const [gradingSubmission, setGradingSubmission] = useState<string | null>(null);
    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGrade = async (submissionId: string) => {
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/submissions/grade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submissionId,
                    score: score ? parseInt(score) : null,
                    feedback: feedback || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to grade submission");
            }

            setGradingSubmission(null);
            setScore("");
            setFeedback("");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to grade submission");
        } finally {
            setIsLoading(false);
        }
    };

    const submittedStudentIds = new Set(assignment.submissions.map((s) => s.user.id));
    const missingSubmissions = students.filter((s) => !submittedStudentIds.has(s.id));

    const parseContent = (content: string) => {
        try {
            const parsed = JSON.parse(content);
            return parsed.text || content;
        } catch {
            return content;
        }
    };

    return (
        <div className="space-y-6">
            {/* Submitted Work */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Submitted Work</h2>
                {assignment.submissions.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <p className="text-gray-500">No submissions yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {assignment.submissions.map((submission) => (
                            <div key={submission.id} className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {submission.user.name || submission.user.username}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Submitted: {new Date(submission.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                                        submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                    </span>
                                </div>

                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {parseContent(submission.content)}
                                    </p>
                                </div>

                                {submission.status === "graded" && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        {submission.score !== null && (
                                            <p className="text-lg font-semibold text-green-900 mb-2">
                                                Score: {submission.score}%
                                            </p>
                                        )}
                                        {submission.feedback && (
                                            <p className="text-green-800">{submission.feedback}</p>
                                        )}
                                    </div>
                                )}

                                {submission.status === "submitted" && (
                                    <div>
                                        {gradingSubmission === submission.id ? (
                                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Score (0-100)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={score}
                                                        onChange={(e) => setScore(e.target.value)}
                                                        className="w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                                        placeholder="Score"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Feedback
                                                    </label>
                                                    <textarea
                                                        value={feedback}
                                                        onChange={(e) => setFeedback(e.target.value)}
                                                        rows={3}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                                        placeholder="Provide feedback…"
                                                    />
                                                </div>
                                                {error && (
                                                    <div className="rounded-md bg-red-50 p-3">
                                                        <p className="text-sm text-red-800">{error}</p>
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleGrade(submission.id)}
                                                        disabled={isLoading}
                                                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                                    >
                                                        {isLoading ? "Grading…" : "Submit Grade"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setGradingSubmission(null);
                                                            setScore("");
                                                            setFeedback("");
                                                            setError("");
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setGradingSubmission(submission.id);
                                                    setScore(submission.score?.toString() || "");
                                                    setFeedback(submission.feedback || "");
                                                }}
                                                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Grade Submission
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Missing Submissions */}
            {missingSubmissions.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-4">
                        Missing Submissions ({missingSubmissions.length})
                    </h2>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <ul className="space-y-2">
                            {missingSubmissions.map((student) => (
                                <li key={student.id} className="text-gray-700">
                                    {student.name || student.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </div>
    );
}




