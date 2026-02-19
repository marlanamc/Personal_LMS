"use client";

import { useMemo, useState } from "react";

type Student = {
    id: string;
    username: string;
    name: string | null;
    mustChangePassword: boolean;
};

type Props = {
    students: Student[];
};

type StatusState = Record<
    string,
    { state: "idle" | "saving" | "success" | "error"; message?: string }
>;

export function StudentPasswordManager({ students }: Props) {
    const [passwords, setPasswords] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<StatusState>({});

    const sorted = useMemo(
        () =>
            [...students].sort((a, b) =>
                a.username.localeCompare(b.username, undefined, { sensitivity: "base" })
            ),
        [students]
    );

    const updateStatus = (id: string, next: StatusState[string]) =>
        setStatus((prev) => ({ ...prev, [id]: next }));

    const handleSubmit = async (id: string, pwd: string) => {
        if (!pwd || pwd.length < 6) {
            updateStatus(id, { state: "error", message: "Min 6 characters" });
            return;
        }
        updateStatus(id, { state: "saving" });
        try {
            const res = await fetch("/api/admin/reset-student-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, newPassword: pwd }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to update");
            }
            updateStatus(id, { state: "success", message: "Updated" });
        } catch (err: unknown) {
            updateStatus(id, { state: "error", message: err instanceof Error ? err.message : "Failed" });
        }
    };

    return (
        <div className="border rounded-2xl p-6 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                    <p className="text-sm font-semibold text-text-muted">Student passwords</p>
                    <h3 className="text-xl font-bold text-text">Reset passwords quickly</h3>
                </div>
                <p className="text-xs text-text-muted">
                    Changes apply immediately. Students will not be prompted to reset.
                </p>
            </div>

            <div className="divide-y border rounded-xl overflow-hidden">
                {sorted.map((s) => {
                    const entry = status[s.id] || { state: "idle" };
                    return (
                        <div
                            key={s.id}
                            className="flex flex-col md:flex-row md:items-center gap-3 p-4 bg-white"
                        >
                            <div className="flex-1 min-w-[200px]">
                                <p className="font-semibold text-text">
                                    {s.name || s.username}
                                    <span className="ml-2 text-xs text-text-muted">@{s.username}</span>
                                </p>
                                {s.mustChangePassword && (
                                    <p className="text-[11px] text-amber-600 font-semibold mt-1">
                                        Currently flagged to change password
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col md:flex-row md:items-center gap-2">
                                <input
                                    type="password"
                                    placeholder="New password"
                                    className="w-full md:w-auto flex-1 px-3 py-2 border rounded-lg text-sm"
                                    value={passwords[s.id] || ""}
                                    onChange={(e) =>
                                        setPasswords((prev) => ({ ...prev, [s.id]: e.target.value }))
                                    }
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleSubmit(s.id, passwords[s.id] || "password123")
                                        }
                                        disabled={entry.state === "saving"}
                                        className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 active:scale-95 disabled:opacity-60"
                                    >
                                        {entry.state === "saving" ? "Saving…" : "Save"}
                                    </button>
                                    <button
                                        onClick={() => handleSubmit(s.id, "password123")}
                                        disabled={entry.state === "saving"}
                                        className="px-3 py-2 rounded-lg text-sm font-semibold border border-border text-text hover:bg-gray-50 active:scale-95 disabled:opacity-60"
                                    >
                                        Set to password123
                                    </button>
                                </div>
                            </div>
                            {entry.state === "error" && (
                                <p className="text-xs text-red-600">{entry.message}</p>
                            )}
                            {entry.state === "success" && (
                                <p className="text-xs text-green-700">Password updated</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

