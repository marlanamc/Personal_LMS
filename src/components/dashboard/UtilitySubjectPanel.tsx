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
        { id: 'job-link-1', label: 'Resume', href: '' },
        { id: 'job-link-2', label: 'Job Tracker', href: '' },
    ],
};

const withProtocol = (url: string): string => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
};

export function UtilitySubjectPanel({ subjectKey, subjectName }: UtilitySubjectPanelProps) {
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
        setChecklist((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, done: !item.done } : item
            )
        );
    };

    const addChecklistItem = () => {
        const trimmed = newTask.trim();
        if (!trimmed) return;
        if (checklist.length >= 8) return;

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

    return (
        <section className="rounded-2xl border border-border/50 bg-bg-secondary/90 p-4 sm:p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.12em] text-text-muted">
                        {subjectName} Board
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                        Low-noise checklist and essential links.
                    </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {completedCount}/{checklist.length} done
                </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Link
                    href="/dashboard/calendar"
                    className="px-3 py-1.5 rounded-lg border border-border/60 text-text text-xs font-semibold hover:bg-bg-light transition-colors"
                >
                    View Reminders
                </Link>
                <Link
                    href="/dashboard/calendar/new"
                    className="px-3 py-1.5 rounded-lg border border-border/60 text-text text-xs font-semibold hover:bg-bg-light transition-colors"
                >
                    Add Reminder
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                    <p className="text-xs font-semibold text-text mb-2">Checklist</p>
                    <div className="space-y-2 mb-3">
                        {checklist.map((item) => (
                            <div key={item.id} className="flex items-start gap-2">
                                <button
                                    type="button"
                                    onClick={() => toggleChecklistItem(item.id)}
                                    className={`mt-0.5 w-4 h-4 rounded border ${item.done ? 'bg-primary border-primary' : 'border-border'} transition-colors`}
                                    aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                                >
                                    {item.done && (
                                        <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                                <p className={`text-sm flex-1 ${item.done ? 'text-text-muted line-through' : 'text-text'}`}>
                                    {item.text}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => removeChecklistItem(item.id)}
                                    className="text-xs text-text-muted hover:text-error transition-colors"
                                    aria-label="Remove item"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addChecklistItem();
                                }
                            }}
                            placeholder="Add a checklist item"
                            className="flex-1 rounded-lg border border-border/60 bg-bg-secondary px-2.5 py-1.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button
                            type="button"
                            onClick={addChecklistItem}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:brightness-110 transition-[filter]"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="rounded-lg border border-border/40 bg-bg-light/40 p-3">
                    <p className="text-xs font-semibold text-text mb-2">Important Links</p>
                    <div className="space-y-2 mb-3">
                        {links.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-primary hover:underline flex-1"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <p className="text-sm text-text-muted flex-1">{item.label}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeLinkItem(item.id)}
                                    className="text-xs text-text-muted hover:text-error transition-colors"
                                    aria-label="Remove link"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {!showAddLink ? (
                        <button
                            type="button"
                            onClick={() => setShowAddLink(true)}
                            className="px-3 py-1.5 rounded-lg border border-border/60 text-text text-xs font-semibold hover:bg-bg-secondary transition-colors"
                        >
                            Add Link
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <input
                                value={linkLabel}
                                onChange={(e) => setLinkLabel(e.target.value)}
                                placeholder="Label"
                                className="w-full rounded-lg border border-border/60 bg-bg-secondary px-2.5 py-1.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                                className="w-full rounded-lg border border-border/60 bg-bg-secondary px-2.5 py-1.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={addLinkItem}
                                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:brightness-110 transition-[filter]"
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
                                    className="px-3 py-1.5 rounded-lg border border-border/60 text-text text-xs font-semibold hover:bg-bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

