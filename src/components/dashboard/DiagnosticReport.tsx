"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle2, Users, TrendingDown } from "lucide-react";

interface SkillData {
    skillTag: string;
    totalAttempts: number;
    correctAttempts: number;
    percentCorrect: number;
    studentsStruggling: number;
}

interface DiagnosticReportProps {
    classId: string;
    activityId: string;
    totalStudents: number;
}

export function DiagnosticReport({
    classId,
    activityId,
    totalStudents,
}: DiagnosticReportProps) {
    const [skills, setSkills] = useState<SkillData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<string>("all");

    const fetchDiagnostics = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({ classId, activityId });
            if (difficulty !== "all") {
                params.set("difficulty", difficulty);
            }

            const res = await fetch(`/api/diagnostics/class-skills?${params}`);

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch diagnostics");
            }

            const data = await res.json();
            setSkills(data.skills || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [classId, activityId, difficulty]);

    useEffect(() => {
        fetchDiagnostics();
    }, [fetchDiagnostics]);

    const formatSkillTag = (tag: string) => {
        return tag
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const getColorClasses = (percent: number) => {
        if (percent >= 80)
            return "text-emerald-700 bg-emerald-50 border-emerald-200";
        if (percent >= 60)
            return "text-amber-700 bg-amber-50 border-amber-200";
        return "text-rose-700 bg-rose-50 border-rose-200";
    };

    const getProgressBarColor = (percent: number) => {
        if (percent >= 80) return "bg-emerald-500";
        if (percent >= 60) return "bg-amber-500";
        return "bg-rose-500";
    };

    const strugglingCount = skills.reduce(
        (acc, s) => acc + s.studentsStruggling,
        0
    );
    const skillsNeedingReview = skills.filter((s) => s.percentCorrect < 60);

    return (
        <div className="bg-white rounded-xl border border-border shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border bg-bg-light">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-text mb-1">
                            Skill Diagnostics
                        </h2>
                        <p className="text-sm text-text-muted flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {totalStudents} students enrolled
                        </p>
                    </div>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy Only</option>
                        <option value="medium">Medium Only</option>
                        <option value="hard">Hard Only</option>
                    </select>
                </div>

                {/* Summary Stats */}
                {!loading && skills.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className="text-2xl font-bold text-text">
                                {skills.length}
                            </div>
                            <div className="text-xs text-text-muted">
                                Skills Tracked
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className="text-2xl font-bold text-rose-600">
                                {skillsNeedingReview.length}
                            </div>
                            <div className="text-xs text-text-muted">
                                Need Review (&lt;60%)
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-border col-span-2 sm:col-span-1">
                            <div className="text-2xl font-bold text-amber-600">
                                {strugglingCount}
                            </div>
                            <div className="text-xs text-text-muted">
                                Total Struggles
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {loading ? (
                    <div className="text-center py-12 text-text-muted">
                        <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"></div>
                        Loading diagnostics...
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-rose-600 bg-rose-50 rounded-lg">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-semibold mb-2">
                            Error loading diagnostics
                        </p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="text-center py-12 text-text-muted bg-bg-light rounded-lg">
                        <TrendingDown className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                        <p className="font-semibold mb-2">
                            No diagnostic data available
                        </p>
                        <p className="text-sm">
                            Students need to complete mini-quizzes with skill
                            tags to generate diagnostic reports.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Skills needing review callout */}
                        {skillsNeedingReview.length > 0 && (
                            <div className="bg-rose-50 border-2 border-rose-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-rose-800 mb-1">
                                            {skillsNeedingReview.length} skill
                                            {skillsNeedingReview.length !== 1
                                                ? "s"
                                                : ""}{" "}
                                            need review
                                        </h3>
                                        <p className="text-sm text-rose-700">
                                            These skills have a class average
                                            below 60%. Consider additional
                                            practice or review activities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills List */}
                        {skills.map((skill) => (
                            <div
                                key={skill.skillTag}
                                className={`p-5 rounded-lg border-2 transition-all hover:shadow-md ${getColorClasses(
                                    skill.percentCorrect
                                )}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">
                                            {formatSkillTag(skill.skillTag)}
                                        </h3>
                                        <p className="text-sm opacity-80">
                                            {skill.correctAttempts} /{" "}
                                            {skill.totalAttempts} questions
                                            correct
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold">
                                            {skill.percentCorrect}%
                                        </div>
                                        {skill.percentCorrect >= 80 && (
                                            <CheckCircle2 className="w-5 h-5 inline-block ml-2 text-emerald-600" />
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-white/60 rounded-full mb-3 overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressBarColor(
                                            skill.percentCorrect
                                        )} transition-[width] duration-500 ease-out`}
                                        style={{
                                            width: `${skill.percentCorrect}%`,
                                        }}
                                    />
                                </div>

                                {/* Students Struggling */}
                                {skill.studentsStruggling > 0 && (
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <AlertTriangle className="w-4 h-4" />
                                        {skill.studentsStruggling}{" "}
                                        {skill.studentsStruggling === 1
                                            ? "student needs"
                                            : "students need"}{" "}
                                        help
                                        <span className="text-xs opacity-70 font-normal">
                                            (below 60%)
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Legend */}
            {skills.length > 0 && (
                <div className="px-6 py-4 border-t border-border bg-bg-light">
                    <p className="text-xs text-text-muted mb-3 font-semibold">
                        Performance Levels:
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-emerald-500"></div>
                            <span>Mastered (80%+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-amber-500"></div>
                            <span>Developing (60-79%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-rose-500"></div>
                            <span>Needs Review (&lt;60%)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
