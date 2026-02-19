"use client";

import { useMemo, useState } from "react";
import { StudentStatsView } from "./StudentStatsView";

type Student = {
    id: string;
    name: string | null;
    username: string;
};

type ActivityBase = {
    id: string;
    title: string;
    category: string | null;
    type: string | null;
};

type Props = {
    students: Student[];
    activities: ActivityBase[];
    progressByStudent: Record<string, Record<string, number>>;
    overallProgress: Record<string, number>;
};

export function TeacherStudentStatsPanel({ students, activities, progressByStudent, overallProgress }: Props) {
    const options = useMemo(
        () => [
            { id: "overall", label: "All students (average)" },
            ...students
                .map((s) => ({
                    id: s.id,
                    label: s.name || s.username,
                }))
                .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" })),
        ],
        [students]
    );

    const [selectedId, setSelectedId] = useState(options[0]?.id ?? "overall");

    const selectedProgress =
        selectedId === "overall"
            ? overallProgress
            : progressByStudent[selectedId] || {};

    const statsActivities = activities.map((a) => ({
        ...a,
        progress: selectedProgress[a.id] ?? 0,
    }));

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text">Student Activity Progress</h2>
                    <p className="text-sm text-text-muted">Switch between students or view the overall average.</p>
                </div>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border/60 text-sm font-semibold bg-white"
                >
                    {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <StudentStatsView activities={statsActivities} />
        </div>
    );
}





