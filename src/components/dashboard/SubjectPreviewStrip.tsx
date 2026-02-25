'use client';

import React from 'react';
import Link from 'next/link';

// Compact SVG Icons for preview strip - matching the portal design
const SubjectIcons: Record<string, React.ReactNode> = {
    spanish: (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="24" r="14" stroke="url(#spanishGradSmall)" strokeWidth="2.5" fill="none" />
            <ellipse cx="22" cy="24" rx="6" ry="14" stroke="url(#spanishGradSmall)" strokeWidth="1.5" fill="none" />
            <path d="M8 24h28" stroke="url(#spanishGradSmall)" strokeWidth="1.5" />
            <circle cx="40" cy="12" r="4" stroke="url(#spanishGradSmall)" strokeWidth="2" fill="none" />
            <defs>
                <linearGradient id="spanishGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#ffa07a" />
                </linearGradient>
            </defs>
        </svg>
    ),
    coding: (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 14L6 24l8 10" stroke="url(#codingGradSmall)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M34 14l8 10-8 10" stroke="url(#codingGradSmall)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M24 16v16" stroke="url(#codingGradSmall)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <defs>
                <linearGradient id="codingGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d9ff" />
                    <stop offset="100%" stopColor="#00ff88" />
                </linearGradient>
            </defs>
        </svg>
    ),
    health: (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 42s-16-10.5-16-21c0-6.1 4.9-11 11-11 3.7 0 5 1.9 5 1.9s1.3-1.9 5-1.9c6.1 0 11 4.9 11 11 0 10.5-16 21-16 21z"
                  stroke="url(#healthGradSmall)" strokeWidth="2.5" fill="none" />
            <path d="M8 24h8l2-6 4 12 4-12 2 6h12"
                  stroke="url(#healthGradSmall)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
            <defs>
                <linearGradient id="healthGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7bed9f" />
                    <stop offset="100%" stopColor="#26de81" />
                </linearGradient>
            </defs>
        </svg>
    ),
    'job-search': (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="16" width="28" height="22" rx="3" stroke="url(#jobGradSmall)" strokeWidth="2.5" fill="none" />
            <path d="M14 16v-4a4 4 0 014-4h4a4 4 0 014 4v4" stroke="url(#jobGradSmall)" strokeWidth="2.5" fill="none" />
            <path d="M38 32V12m0 0l-5 5m5-5l5 5" stroke="url(#jobGradSmall)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="jobGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a55eea" />
                    <stop offset="100%" stopColor="#8854d0" />
                </linearGradient>
            </defs>
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
                {subjects.map((subject, idx) => {
                    const pct =
                        subject.total && subject.total > 0
                            ? Math.round(((subject.completed ?? 0) / subject.total) * 100)
                            : null;
                    const isHighProgress = pct !== null && pct >= 75;
                    const href = `/dashboard/subjects?subject=${subject.key}`;

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
                                    {SubjectIcons[subject.key] || (
                                        <span className="text-2xl">{subject.emoji}</span>
                                    )}
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
