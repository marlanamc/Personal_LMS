"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClassForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCode(result);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, code: code || undefined }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create class");
            }

            const data = await response.json();
            router.push(`/dashboard/classes/${data.id}`);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create class");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-bg-secondary/90 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text">
                            Class Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary/40 text-text"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-text">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            autoComplete="off"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary/40 text-text"
                        />
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-text">
                            Class Code
                        </label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="Leave empty to auto-generate"
                                maxLength={10}
                                className="block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary/40 text-text"
                            />
                            <button
                                type="button"
                                onClick={generateCode}
                                className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-text bg-bg-secondary/90 hover:bg-bg-tertiary/70"
                            >
                                Generate
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-text-muted">
                            Use this code to open or share this class
                        </p>
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
                            className="px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-text bg-bg-secondary/90 hover:bg-bg-tertiary/70"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40 disabled:opacity-50"
                        >
                            {isLoading ? "Creating…" : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}









