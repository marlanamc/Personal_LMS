"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
}

interface Props {
    classId: string;
    activities: Activity[];
}

export default function CreateAssignmentForm({ classId, activities }: Props) {
    const router = useRouter();
    const [activityId, setActivityId] = useState("");
    const [title, setTitle] = useState("");
    const [instructions, setInstructions] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!activityId) {
            setError("Please select an activity");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    classId,
                    activityId,
                    title: title || undefined,
                    instructions: instructions || undefined,
                    dueDate: dueDate || undefined,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create assignment");
            }

            router.push(`/dashboard/classes/${classId}`);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create assignment");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedActivity = activities.find((a) => a.id === activityId);

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="activityId" className="block text-sm font-medium text-gray-700">
                            Select Activity *
                        </label>
                        <select
                            id="activityId"
                            value={activityId}
                            onChange={(e) => {
                                setActivityId(e.target.value);
                                const activity = activities.find((a) => a.id === e.target.value);
                                if (activity && !title) {
                                    setTitle(activity.title);
                                }
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                            required
                        >
                            <option value="">Choose an activity…</option>
                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.title} ({activity.type})
                                    {activity.category && ` - ${activity.category}`}
                                </option>
                            ))}
                        </select>
                        {selectedActivity && (
                            <p className="mt-2 text-sm text-gray-500">{selectedActivity.description}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Leave empty to use activity title"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                            Instructions
                        </label>
                        <textarea
                            id="instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            rows={4}
                            placeholder="Additional instructions for students…"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                            Due Date (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                        />
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
                            {isLoading ? "Creating…" : "Create Assignment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}










