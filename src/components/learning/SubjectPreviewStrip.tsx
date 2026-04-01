'use client';

import React from 'react';
import Link from 'next/link';

// Compact SVG Icons for preview strip - matching the portal design
const SubjectIcons: Record<string, React.ReactNode> = {
    spanish: (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <ellipse cx="22" cy="24" rx="6" ry="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M8 24h28" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="40" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    coding: (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 14L6 24l8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M34 14l8 10-8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M24 16v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        </svg>
    ),
};

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

const normalizeSubjectKey = (value: string): string =>
    value
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, '-');

const getSubjectIcon = (subject: SubjectStat): React.ReactNode => {
    const key = normalizeSubjectKey(subject.key);
    const nameKey = normalizeSubjectKey(subject.name);
    const resolvedKey =
        SubjectIcons[key]
            ? key
            : SubjectIcons[nameKey]
                ? nameKey
                : nameKey === 'job-search'
                    ? 'job-search'
                    : key === 'job-search'
                        ? 'job-search'
                        : '';

    if (resolvedKey && SubjectIcons[resolvedKey]) {
        return SubjectIcons[resolvedKey];
    }

    return (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="9" y="10" width="30" height="28" rx="6" stroke="currentColor" strokeWidth="2.5" />
            <path d="M16 18h16M16 24h12M16 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

export function SubjectPreviewStrip({ subjects }: SubjectPreviewStripProps) {
    if (subjects.length === 0) return null;

    const getSubjectHref = (subject: SubjectStat): string => {
        const normalizedKey = normalizeSubjectKey(subject.key);
        if (normalizedKey === 'spanish' || normalizedKey === 'coding') {
            return `/dashboard/subjects?subject=${normalizedKey}`;
        }
        if (subject.kind === 'utility') {
            return '/dashboard/workspace';
        }
        return '/dashboard/subjects';
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                    Learning Subjects
                </p>
                <Link
                    href="/dashboard/subjects"
                    className="text-xs font-semibold text-primary hover:underline transition-colors"
                >
                    See all →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject, idx) => {
                    const pct =
                        subject.total && subject.total > 0
                            ? Math.round(((subject.completed ?? 0) / subject.total) * 100)
                            : null;
                    const isHighProgress = pct !== null && pct >= 75;
                    const href = getSubjectHref(subject);

                    return (
                        <Link
                            key={subject.key}
                            href={href}
                            data-subject={subject.key}
                            className="subject-card subject-card-animate group"
                            style={{ animationDelay: `${idx * 80}ms` }}
                        >
                            {/* Compact portal icon area */}
                            <div className="subject-card-portal !py-5 !min-h-0">
                                <div className="subject-card-icon !w-12 !h-12 !rounded-xl">
                                    {getSubjectIcon(subject)}
                                </div>
                            </div>

                            {/* Compact content area */}
                            <div className="subject-card-content !py-3 !px-3 !gap-1">
                                <h3 className="subject-card-title !text-sm">{subject.name}</h3>

                                {subject.kind === 'utility' ? (
                                    <span className="subject-card-badge !text-[9px] !py-0.5 !px-2">
                                        Personal
                                    </span>
                                ) : pct !== null ? (
                                    <div className="subject-card-progress !mt-1">
                                        <div className="subject-card-progress-header !mb-1">
                                            <span className="subject-card-progress-label !text-[9px]">
                                                {subject.completed}/{subject.total}
                                            </span>
                                            <span className="subject-card-progress-value !text-[10px]">
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="subject-card-progress-track !h-[4px]">
                                            <div
                                                className="subject-card-progress-fill !h-[4px]"
                                                data-high-progress={isHighProgress}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="subject-card-subtitle !text-[10px]">
                                        {subject.subtitle}
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
