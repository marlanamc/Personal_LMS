'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type UtilitySubjectKey = 'health' | 'job-search';

interface UtilityChecklistItem {
    id: string;
    text: string;
    done: boolean;
}

interface UtilityLinkItem {
    id: string;
    label: string;
    href: string;
}

interface UtilitySubjectPanelProps {
    subjectKey: UtilitySubjectKey;
    subjectName: string;
}

const SUBJECT_CONFIG: Record<UtilitySubjectKey, {
    emoji: string;
    tagline: string;
    color: string;
    bgGradient: string;
    badgeLabel: string;
}> = {
    health: {
        emoji: '🩺',
        tagline: 'Track appointments, notes, and important health links.',
        color: '#0891b2',          // cyan-600
        bgGradient: 'linear-gradient(135deg, rgba(8, 145, 178, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
        badgeLabel: 'Wellness',
    },
    'job-search': {
        emoji: '💼',
        tagline: 'Stay on top of applications, your resume, and opportunities.',
        color: '#6d28d9',          // violet-700
        bgGradient: 'linear-gradient(135deg, rgba(109, 40, 217, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
        badgeLabel: 'Career',
    },
};

const DEFAULT_CHECKLISTS: Record<UtilitySubjectKey, UtilityChecklistItem[]> = {
    health: [
        { id: 'health-1', text: 'Review upcoming appointments', done: false },
        { id: 'health-2', text: 'Check medications or supplies', done: false },
        { id: 'health-3', text: 'Read one important health note', done: false },
    ],
    'job-search': [
        { id: 'job-1', text: 'Check application replies', done: false },
        { id: 'job-2', text: 'Update resume or portfolio', done: false },
        { id: 'job-3', text: 'Save one strong opportunity', done: false },
    ],
};

const DEFAULT_LINKS: Record<UtilitySubjectKey, UtilityLinkItem[]> = {
    health: [
        { id: 'health-link-1', label: 'Patient Portal', href: '' },
        { id: 'health-link-2', label: 'Insurance Docs', href: '' },
    ],
    'job-search': [
        { id: 'job-link-1', label: 'My Resume', href: '' },
        { id: 'job-link-2', label: 'Job Tracker', href: '' },
    ],
};

const withProtocol = (url: string): string => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
};

export function UtilitySubjectPanel({ subjectKey, subjectName }: UtilitySubjectPanelProps) {
    const config = SUBJECT_CONFIG[subjectKey];
    const storagePrefix = `utility-subject:${subjectKey}`;
    const checklistStorageKey = `${storagePrefix}:checklist`;
    const linksStorageKey = `${storagePrefix}:links`;

    const [checklist, setChecklist] = useState<UtilityChecklistItem[]>([]);
    const [links, setLinks] = useState<UtilityLinkItem[]>([]);
    const [newTask, setNewTask] = useState('');
    const [linkLabel, setLinkLabel] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [showAddLink, setShowAddLink] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const storedChecklist = localStorage.getItem(checklistStorageKey);
            const storedLinks = localStorage.getItem(linksStorageKey);

            if (storedChecklist) {
                const parsed = JSON.parse(storedChecklist) as UtilityChecklistItem[];
                setChecklist(Array.isArray(parsed) ? parsed : DEFAULT_CHECKLISTS[subjectKey]);
            } else {
                setChecklist(DEFAULT_CHECKLISTS[subjectKey]);
            }

            if (storedLinks) {
                const parsed = JSON.parse(storedLinks) as UtilityLinkItem[];
                setLinks(Array.isArray(parsed) ? parsed : DEFAULT_LINKS[subjectKey]);
            } else {
                setLinks(DEFAULT_LINKS[subjectKey]);
            }
        } catch {
            setChecklist(DEFAULT_CHECKLISTS[subjectKey]);
            setLinks(DEFAULT_LINKS[subjectKey]);
        } finally {
            setHydrated(true);
        }
    }, [checklistStorageKey, linksStorageKey, subjectKey]);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(checklistStorageKey, JSON.stringify(checklist));
    }, [checklist, checklistStorageKey, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(linksStorageKey, JSON.stringify(links));
    }, [links, linksStorageKey, hydrated]);

    const completedCount = useMemo(
        () => checklist.filter((item) => item.done).length,
        [checklist]
    );

    const toggleChecklistItem = (id: string) => {
        setAnimatingIds(prev => new Set(prev).add(id));
        setTimeout(() => {
            setAnimatingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 300);
        setChecklist((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, done: !item.done } : item
            )
        );
    };

    const addChecklistItem = () => {
        const trimmed = newTask.trim();
        if (!trimmed) return;
        if (checklist.length >= 10) return;

        setChecklist((prev) => [
            ...prev,
            {
                id: `${subjectKey}-task-${Date.now()}`,
                text: trimmed,
                done: false,
            },
        ]);
        setNewTask('');
    };

    const removeChecklistItem = (id: string) => {
        setChecklist((prev) => prev.filter((item) => item.id !== id));
    };

    const addLinkItem = () => {
        const trimmedLabel = linkLabel.trim();
        const trimmedUrl = linkUrl.trim();
        if (!trimmedLabel || !trimmedUrl) return;

        setLinks((prev) => [
            ...prev,
            {
                id: `${subjectKey}-link-${Date.now()}`,
                label: trimmedLabel,
                href: withProtocol(trimmedUrl),
            },
        ]);

        setLinkLabel('');
        setLinkUrl('');
        setShowAddLink(false);
    };

    const removeLinkItem = (id: string) => {
        setLinks((prev) => prev.filter((item) => item.id !== id));
    };

    const pct = checklist.length === 0 ? 0 : Math.round((completedCount / checklist.length) * 100);

    return (
        <div className="space-y-5 animate-fade-in">
            {/* ── Hero Banner ── */}
            <div
                className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
                style={{
                    background: config.bgGradient,
                    border: `1.5px solid ${config.color}30`,
                }}
            >
                {/* Subtle radial glow */}
                <div
                    className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: config.color }}
                />

                <div className="relative z-10 flex items-start gap-4">
                    <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: `${config.color}18`, border: `1.5px solid ${config.color}30` }}
                    >
                        {config.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h2 className="text-xl sm:text-2xl font-bold font-display text-text">
                                {subjectName}
                            </h2>
                            <span
                                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${config.color}18`, color: config.color }}
                            >
                                {config.badgeLabel}
                            </span>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed">{config.tagline}</p>
                    </div>
                </div>

                {/* Progress bar */}
                {checklist.length > 0 && (
                    <div className="relative z-10 mt-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted font-medium">
                                {completedCount} of {checklist.length} tasks done
                            </span>
                            <span
                                className="text-xs font-bold"
                                style={{ color: config.color }}
                            >
                                {pct}%
                            </span>
                        </div>
                        <div className="h-1.5 bg-border/20 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${pct}%`, backgroundColor: config.color }}
                            />
                        </div>
                    </div>
                )}

                {/* Quick actions */}
                <div className="relative z-10 flex flex-wrap gap-2 mt-4">
                    <Link
                        href="/dashboard/calendar"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                        style={{
                            backgroundColor: `${config.color}15`,
                            color: config.color,
                            border: `1px solid ${config.color}30`,
                        }}
                    >
                        📅 View Reminders
                    </Link>
                    <Link
                        href="/dashboard/calendar/new"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                        style={{
                            backgroundColor: `${config.color}15`,
                            color: config.color,
                            border: `1px solid ${config.color}30`,
                        }}
                    >
                        ＋ Add Reminder
                    </Link>
                </div>
            </div>

            {/* ── Two-column body ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Checklist Card */}
                <div className="rounded-2xl border border-border/50 bg-bg-secondary/90 p-4 sm:p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-text flex items-center gap-2">
                            <span>📋</span> Today's Tasks
                        </p>
                        {checklist.length > 0 && (
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${config.color}12`, color: config.color }}
                            >
                                {completedCount}/{checklist.length}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        {checklist.map((item) => (
                            <div
                                key={item.id}
                                className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                                    item.done
                                        ? 'bg-bg-light/30'
                                        : 'hover:bg-bg-light/40'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleChecklistItem(item.id)}
                                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                        animatingIds.has(item.id) ? 'scale-90' : 'scale-100'
                                    }`}
                                    style={{
                                        borderColor: item.done ? config.color : 'var(--border)',
                                        backgroundColor: item.done ? config.color : 'transparent',
                                    }}
                                    aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                                >
                                    {item.done && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                                <p className={`text-sm flex-1 leading-snug transition-all duration-200 ${
                                    item.done ? 'text-text-muted line-through' : 'text-text'
                                }`}>
                                    {item.text}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => removeChecklistItem(item.id)}
                                    className="opacity-0 group-hover:opacity-100 text-[11px] text-text-muted hover:text-error transition-all ml-auto flex-shrink-0 cursor-pointer"
                                    aria-label="Remove item"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                        <input
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addChecklistItem();
                                }
                            }}
                            placeholder="Add a task…"
                            className="flex-1 rounded-xl border border-border/60 bg-bg-light/40 px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 transition-shadow"
                            style={{ ['--tw-ring-color' as string]: `${config.color}40` }}
                        />
                        <button
                            type="button"
                            onClick={addChecklistItem}
                            className="px-3 py-2 rounded-xl text-white text-xs font-bold hover:brightness-110 transition-[filter] active:scale-95 cursor-pointer"
                            style={{ backgroundColor: config.color }}
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Links Card */}
                <div className="rounded-2xl border border-border/50 bg-bg-secondary/90 p-4 sm:p-5 shadow-sm space-y-3">
                    <p className="text-sm font-bold text-text flex items-center gap-2">
                        <span>🔗</span> My Links
                    </p>

                    {links.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {links.map((item) => (
                                <div key={item.id} className="group relative">
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
                                            style={{
                                                backgroundColor: `${config.color}12`,
                                                border: `1.5px solid ${config.color}30`,
                                                color: config.color,
                                            }}
                                        >
                                            🌐 {item.label}
                                        </a>
                                    ) : (
                                        <span
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor: 'var(--bg-light)',
                                                border: '1.5px solid var(--border)',
                                                color: 'var(--text-muted)',
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeLinkItem(item.id)}
                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer shadow-sm"
                                        aria-label="Remove link"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-text-muted italic">No links saved yet.</p>
                    )}

                    {!showAddLink ? (
                        <button
                            type="button"
                            onClick={() => setShowAddLink(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-border/70 text-text-muted text-xs font-semibold hover:border-border hover:text-text transition-colors cursor-pointer"
                        >
                            ＋ Add Link
                        </button>
                    ) : (
                        <div className="space-y-2 pt-1">
                            <input
                                value={linkLabel}
                                onChange={(e) => setLinkLabel(e.target.value)}
                                placeholder="Label (e.g. My Resume)"
                                className="w-full rounded-xl border border-border/60 bg-bg-light/40 px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 transition-shadow"
                                style={{ ['--tw-ring-color' as string]: `${config.color}40` }}
                            />
                            <input
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addLinkItem();
                                    }
                                }}
                                placeholder="URL"
                                className="w-full rounded-xl border border-border/60 bg-bg-light/40 px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 transition-shadow"
                                style={{ ['--tw-ring-color' as string]: `${config.color}40` }}
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={addLinkItem}
                                    className="px-3 py-1.5 rounded-lg text-white text-xs font-bold hover:brightness-110 transition-[filter] active:scale-95 cursor-pointer"
                                    style={{ backgroundColor: config.color }}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddLink(false);
                                        setLinkLabel('');
                                        setLinkUrl('');
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-border/60 text-text text-xs font-semibold hover:bg-bg-secondary transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
