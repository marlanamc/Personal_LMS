"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    content: string;
}

interface Props {
    activity: Activity;
}

export default function EditActivityForm({ activity }: Props) {
    const router = useRouter();
    const [title, setTitle] = useState(activity.title);
    const [description, setDescription] = useState(activity.description || "");
    const [type, setType] = useState(activity.type);
    const [category, setCategory] = useState(activity.category || "");
    const [level, setLevel] = useState(activity.level || "");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Parse content and display as text
        try {
            const parsed = JSON.parse(activity.content);
            if (parsed.content) {
                setContent(parsed.content);
            } else if (parsed.questions) {
                // For quizzes, show a simplified view
                setContent(JSON.stringify(parsed, null, 2));
            } else {
                setContent(JSON.stringify(parsed, null, 2));
            }
        } catch {
            setContent(activity.content);
        }
    }, [activity.content]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        // Try to preserve JSON structure if it was JSON
        let activityContent;
        try {
            const parsed = JSON.parse(content);
            activityContent = JSON.stringify(parsed);
        } catch {
            // If not valid JSON, wrap in content object
            activityContent = JSON.stringify({ content });
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/activities/${activity.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    type,
                    category: category || null,
                    level: level || null,
                    content: activityContent,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update activity");
            }

            router.push("/dashboard/activities");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update activity");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                        
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Type *
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                    required
                                >
                                    <option value="worksheet">Worksheet</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="slides">Slides</option>
                                    <option value="guide">Guide</option>
                                    <option value="game">Game</option>
                                    <option value="resource">Resource</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                >
                                    <option value="">Select category</option>
                                    <option value="grammar">Grammar</option>
                                    <option value="vocab">Vocabulary</option>
                                    <option value="speaking">Speaking</option>
                                    <option value="writing-reading">Writing/Reading</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                                    Level
                                </label>
                                <select
                                    id="level"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                                >
                                    <option value="">Select level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={15}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 font-mono text-sm"
                                required
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Edit the activity content. For JSON-based activities, maintain the JSON structure.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}










