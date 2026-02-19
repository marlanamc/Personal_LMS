"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

interface Student {
    id: string;
    name: string | null;
    username: string;
}

interface Activity {
    id: string;
    title: string;
}

interface Submission {
    userId: string;
    activityId: string;
    score: number | null;
    updatedAt: Date;
}

interface ClassOption {
    id: string;
    name: string;
}

interface Props {
    students: Student[];
    activities: Activity[];
    submissions: Submission[];
    classes?: ClassOption[];
    selectedClassId?: string | null;
    onClassChange?: (classId: string | null) => void;
}

export default function GrammarGradebook({
    students,
    activities,
    submissions,
    classes,
    selectedClassId,
    onClassChange,
}: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = useMemo(() => {
        return students.filter(
            (s) =>
                (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);

    // Map submissions for easy lookup
    const scoreMap = useMemo(() => {
        const map: Record<string, Record<string, number>> = {};
        submissions.forEach((s) => {
            if (!map[s.userId]) map[s.userId] = {};
            map[s.userId][s.activityId] = s.score ?? 0;
        });
        return map;
    }, [submissions]);

    const getScoreColor = (score: number | undefined) => {
        if (score === undefined) return "text-text-muted/30";
        if (score >= 80) return "bg-emerald-50 text-emerald-700 font-bold border-emerald-100";
        if (score >= 60) return "bg-amber-50 text-amber-700 font-bold border-amber-100";
        return "bg-rose-50 text-rose-700 font-bold border-rose-100";
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-border/40 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 max-w-md px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    {classes && classes.length > 0 && onClassChange && (
                        <select
                            value={selectedClassId || ""}
                            onChange={(e) =>
                                onClassChange(e.target.value || null)
                            }
                            className="px-4 py-2 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        >
                            <option value="">All Classes</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border/40 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-bg-light border-b border-border/60">
                                <th className="sticky left-0 z-20 bg-bg-light px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text border-r border-border/40 min-w-[200px] shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                    Student
                                </th>
                                {activities.map((activity) => (
                                    <th
                                        key={activity.id}
                                        className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-tighter text-text-muted border-r border-border/20 max-w-[120px] whitespace-normal flex-shrink-0"
                                    >
                                        <div className="line-clamp-2 leading-tight mb-2">
                                            {activity.title}
                                        </div>
                                        {selectedClassId && (
                                            <Link
                                                href={`/dashboard/diagnostics?classId=${selectedClassId}&activityId=${activity.id}`}
                                                className="inline-flex items-center gap-1 text-[9px] text-primary hover:text-primary/80 font-normal normal-case tracking-normal transition-colors"
                                            >
                                                <BarChart3 className="w-3 h-3" />
                                                Diagnostics
                                            </Link>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={activities.length + 1}
                                        className="px-6 py-10 text-center text-text-muted italic"
                                    >
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-bg-light/30 transition-colors">
                                        <td className="sticky left-0 z-10 bg-white hover:bg-bg-light/30 transition-colors px-6 py-4 border-r border-border/40 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                            <Link
                                                href={`/dashboard/students/${student.id}`}
                                                className="block group"
                                            >
                                                <div className="font-bold text-text group-hover:text-primary transition-colors">
                                                    {student.name || "No name"}
                                                </div>
                                                <div className="text-[10px] text-text-muted">
                                                    @{student.username}
                                                </div>
                                            </Link>
                                        </td>
                                        {activities.map((activity) => {
                                            const score = scoreMap[student.id]?.[activity.id];
                                            return (
                                                <td
                                                    key={activity.id}
                                                    className={`px-2 py-4 text-center border-r border-border/10 text-sm`}
                                                >
                                                    <div
                                                        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${getScoreColor(
                                                            score
                                                        )}`}
                                                    >
                                                        {score !== undefined ? `${score}%` : "—"}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-text-muted bg-white p-4 rounded-xl border border-border/40">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></div>
                    <span>Mastered (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div>
                    <span>Progressing (60-79%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-rose-100 border border-rose-200"></div>
                    <span>Review Needed (&lt;60%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200"></div>
                    <span>Not Attempted</span>
                </div>
            </div>
        </div>
    );
}
