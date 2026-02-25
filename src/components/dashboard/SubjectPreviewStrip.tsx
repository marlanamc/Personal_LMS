'use client';

import React from 'react';
import Link from 'next/link';

interface SubjectStat {
    key: string;
    name: string;
    emoji: string;
    kind: 'academic' | 'utility';
    accentColor: string;
    bgColor: string;
    subtitle: string;
    /** undefined means no activities found (subject not yet set up) */
    completed?: number;
    total?: number;
}

interface SubjectPreviewStripProps {
    subjects: SubjectStat[];
}

export function SubjectPreviewStrip({ subjects }: SubjectPreviewStripProps) {
    if (subjects.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                    Your Subjects
                </p>
                <Link
                    href="/dashboard/subjects"
                    className="text-xs font-semibold text-primary hover:underline transition-colors"
                >
                    See all →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject) => {
                    const pct =
                        subject.total && subject.total > 0
                            ? Math.round(((subject.completed ?? 0) / subject.total) * 100)
                            : null;

                    const href = `/dashboard/subjects?subject=${subject.key}`;

                    return (
                        <Link
                            key={subject.key}
                            href={href}
                            className="group flex flex-col rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            style={{
                                borderColor: `${subject.accentColor}30`,
                                background:
                                    subject.kind === 'utility'
                                        ? `linear-gradient(135deg, ${subject.accentColor}12 0%, var(--bg-secondary) 100%)`
                                        : 'var(--bg-secondary)',
                            }}
                        >
                            {/* Icon area */}
                            <div
                                className="flex items-center justify-center py-5 relative"
                                style={{ backgroundColor: subject.bgColor }}
                            >
                                <div className="absolute inset-0 shadow-[inset_0_-6px_10px_-6px_rgba(0,0,0,0.07)]" />
                                <span className="text-3xl select-none group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    {subject.emoji}
                                </span>
                            </div>

                            {/* Info area */}
                            <div className="flex flex-col gap-1 px-3 py-3">
                                <span className="text-sm font-bold text-text leading-tight">
                                    {subject.name}
                                </span>

                                {subject.kind === 'utility' ? (
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full self-start"
                                        style={{
                                            backgroundColor: `${subject.accentColor}15`,
                                            color: subject.accentColor,
                                        }}
                                    >
                                        Personal
                                    </span>
                                ) : pct !== null ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-text-muted font-medium">
                                                {subject.completed}/{subject.total} done
                                            </span>
                                            <span
                                                className="text-[10px] font-bold"
                                                style={{ color: subject.accentColor }}
                                            >
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-1 bg-border/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${pct}%`,
                                                    backgroundColor: subject.accentColor,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-text-muted font-medium">
                                        {subject.subtitle}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
