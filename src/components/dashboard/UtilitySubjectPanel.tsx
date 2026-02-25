'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    color: string;
    soft: string;
}> = {
    health: {
        color: 'var(--color-accent-mint)',
        soft: 'color-mix(in srgb, var(--color-accent-mint) 16%, transparent)',
    },
    'job-search': {
        color: 'var(--color-accent-amethyst)',
        soft: 'color-mix(in srgb, var(--color-accent-amethyst) 16%, transparent)',
    },
};

const DEFAULT_CHECKLISTS: Record<UtilitySubjectKey, UtilityChecklistItem[]> = {
    health: [],
    'job-search': [],
};

const DEFAULT_LINKS: Record<UtilitySubjectKey, UtilityLinkItem[]> = {
    health: [],
    'job-search': [],
};

const TEMPLATE_CHECKLIST_IDS = new Set([
    'health-1',
    'health-2',
    'health-3',
    'job-1',
    'job-2',
    'job-3',
]);

const TEMPLATE_LINK_IDS = new Set([
    'health-link-1',
    'health-link-2',
    'job-link-1',
    'job-link-2',
]);

const withProtocol = (url: string): string => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
};

const isChecklistItem = (value: unknown): value is UtilityChecklistItem => {
    if (!value || typeof value !== 'object') return false;
    const item = value as Record<string, unknown>;
    return typeof item.id === 'string' && typeof item.text === 'string' && typeof item.done === 'boolean';
};

const isLinkItem = (value: unknown): value is UtilityLinkItem => {
    if (!value || typeof value !== 'object') return false;
    const item = value as Record<string, unknown>;
    return typeof item.id === 'string' && typeof item.label === 'string' && typeof item.href === 'string';
};

const stripTemplateChecklistItems = (items: UtilityChecklistItem[]): UtilityChecklistItem[] =>
    items.filter((item) => !TEMPLATE_CHECKLIST_IDS.has(item.id));

const stripTemplateLinkItems = (items: UtilityLinkItem[]): UtilityLinkItem[] =>
    items.filter((item) => !TEMPLATE_LINK_IDS.has(item.id));

export function UtilitySubjectPanel({ subjectKey, subjectName }: UtilitySubjectPanelProps) {
    const config = SUBJECT_CONFIG[subjectKey];

    const [checklist, setChecklist] = useState<UtilityChecklistItem[]>([]);
    const [links, setLinks] = useState<UtilityLinkItem[]>([]);
    const [newTask, setNewTask] = useState('');
    const [linkLabel, setLinkLabel] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [showAddLink, setShowAddLink] = useState(false);
    const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [readyToPersist, setReadyToPersist] = useState(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setSaveError(null);
        setReadyToPersist(false);

        const loadState = async () => {
            try {
                const response = await fetch(`/api/utility-subjects/${subjectKey}`, {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Failed to load utility subject data');
                }

                const data = await response.json() as { checklist?: unknown; links?: unknown };
                const checklistData = Array.isArray(data.checklist) && data.checklist.every(isChecklistItem)
                    ? stripTemplateChecklistItems(data.checklist)
                    : DEFAULT_CHECKLISTS[subjectKey];
                const linksData = Array.isArray(data.links) && data.links.every(isLinkItem)
                    ? stripTemplateLinkItems(data.links)
                    : DEFAULT_LINKS[subjectKey];

                if (!cancelled) {
                    setChecklist(checklistData);
                    setLinks(linksData);
                }
            } catch (error) {
                console.error('[UtilitySubjectPanel] Failed to load subject state', error);
                if (!cancelled) {
                    setChecklist(DEFAULT_CHECKLISTS[subjectKey]);
                    setLinks(DEFAULT_LINKS[subjectKey]);
                    setSaveError('Could not load saved data. Showing defaults.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                    setReadyToPersist(true);
                }
            }
        };

        loadState();

        return () => {
            cancelled = true;
        };
    }, [subjectKey]);

    useEffect(() => {
        if (!readyToPersist) return;

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(async () => {
            setIsSaving(true);
            setSaveError(null);
            try {
                const response = await fetch(`/api/utility-subjects/${subjectKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ checklist, links }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save utility subject data');
                }
            } catch (error) {
                console.error('[UtilitySubjectPanel] Failed to save subject state', error);
                setSaveError('Could not save changes right now.');
            } finally {
                setIsSaving(false);
            }
        }, 350);

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
                saveTimerRef.current = null;
            }
        };
    }, [checklist, links, readyToPersist, subjectKey]);

    const completedCount = useMemo(
        () => checklist.filter((item) => item.done).length,
        [checklist]
    );

    const toggleChecklistItem = (id: string) => {
        if (isLoading) return;
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
        if (isLoading) return;
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
        if (isLoading) return;
        setChecklist((prev) => prev.filter((item) => item.id !== id));
    };

    const addLinkItem = () => {
        if (isLoading) return;
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
        if (isLoading) return;
        setLinks((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="space-y-5 animate-fade-in" aria-busy={isLoading || isSaving}>
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-text-muted">
                    {subjectName} tools: {isLoading ? 'loading' : isSaving ? 'saving' : saveError ? saveError : 'saved'}
                </p>
                <div className="flex items-center justify-end gap-2">
                <Link
                    href="/dashboard/calendar"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border-subtle bg-bg-surface hover:border-border/70 hover:bg-bg-elevated transition-colors"
                    style={{ color: config.color }}
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Reminders
                </Link>
                <Link
                    href="/dashboard/calendar/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border-subtle bg-bg-surface hover:border-border/70 hover:bg-bg-elevated transition-colors"
                    style={{ color: config.color }}
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Add Reminder
                </Link>
                </div>
            </div>

            {/* ── Two-column body ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

                {/* Checklist Card - Portal Style */}
                <div className="utility-card rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col relative overflow-hidden">
                    <div className="relative flex items-center justify-between border-b border-border-subtle pb-3">
                        <h3 className="text-base font-bold text-text flex items-center gap-2.5 m-0 tracking-tight">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                                <rect x="3" y="2" width="14" height="16" rx="2" stroke={config.color} strokeWidth="1.5" />
                                <path d="M7 6h6M7 10h6M7 14h4" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Tasks
                        </h3>
                        {checklist.length > 0 && (
                            <span
                                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                style={{
                                    background: config.soft,
                                    color: config.color,
                                    border: `1px solid color-mix(in srgb, ${config.color} 22%, transparent)`,
                                }}
                            >
                                {completedCount}/{checklist.length}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2 flex-grow">
                        {checklist.length > 0 ? checklist.map((item) => (
                            <label
                                key={item.id}
                                className={`group flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                                    item.done
                                        ? 'bg-bg-elevated/30'
                                        : 'hover:bg-bg-elevated/30 border border-transparent hover:border-border/50'
                                }`}
                                htmlFor={`task-${item.id}`}
                            >
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        id={`task-${item.id}`}
                                        checked={item.done}
                                        onChange={() => toggleChecklistItem(item.id)}
                                        className="sr-only" /* Visually hidden, but focusable */
                                    />
                                    <div
                                        className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                            animatingIds.has(item.id) ? 'scale-90' : 'scale-100 group-hover:scale-105'
                                        }`}
                                        style={{
                                            borderColor: item.done ? config.color : 'var(--color-border-subtle)',
                                            backgroundColor: item.done ? config.color : 'var(--color-bg-surface)',
                                        }}
                                        aria-hidden="true"
                                    >
                                        {item.done && (
                                            <svg className="w-3.5 h-3.5 text-bg-base animate-[drawCheck_0.3s_ease-out_forwards]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeDasharray: 24, strokeDashoffset: 0 }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    {/* Focus ring wrapper */}
                                    <div className="absolute inset-[-4px] rounded-lg sm:rounded-full peer-focus-visible:ring-2 pointer-events-none" style={{ ['--tw-ring-color' as string]: config.color }}></div>
                                </div>
                                
                                <span className={`text-sm sm:text-base flex-1 leading-snug transition-all duration-300 select-none ${
                                    item.done ? 'text-text-muted line-through opacity-70' : 'text-text group-hover:text-text'
                                }`}>
                                    {item.text}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); removeChecklistItem(item.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-text-light hover:text-error hover:bg-error/10 w-8 h-8 rounded-full transition-all ml-auto flex-shrink-0 cursor-pointer flex items-center justify-center focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none touch-manipulation"
                                    aria-label={`Remove task ${item.text}`}
                                    style={{ '--tw-ring-color': 'var(--color-error)' } as React.CSSProperties}
                                    title="Remove task"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </label>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full py-8 text-center space-y-2 opacity-60">
                                <span className="text-3xl grayscale">📝</span>
                                <p className="text-sm text-text-muted font-medium">No tasks yet.</p>
                                <p className="text-xs text-text-light">Add one below to get started.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border/30 group/input focus-within:ring-0">
                        <label htmlFor="newTaskInput" className="sr-only">New task</label>
                        <input
                            id="newTaskInput"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addChecklistItem();
                                }
                            }}
                            placeholder="Add a new task…"
                            autoComplete="off"
                            className="flex-1 rounded-xl border border-border/60 bg-bg-light/40 hover:bg-bg-light/60 px-4 py-2.5 text-sm sm:text-base text-text placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:bg-bg-light transition-all shadow-inner"
                            style={{ ['--tw-ring-color' as string]: config.color }}
                        />
                        <button
                            type="button"
                            onClick={addChecklistItem}
                            disabled={!newTask.trim()}
                            className="px-4 py-2.5 rounded-xl text-bg-base text-sm font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 group"
                            style={{ 
                                backgroundColor: config.color,
                                ['--tw-ring-color' as string]: config.color
                            }}
                        >
                            <span>Add</span>
                        </button>
                    </div>
                </div>

                {/* Links Card - Portal Style */}
                <div className="utility-card rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col relative overflow-hidden">
                    <div className="relative border-b border-border-subtle pb-3">
                        <h3 className="text-base font-bold text-text flex items-center gap-2.5 m-0 tracking-tight">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                                <path d="M8 12l4-4M8 6h.01M12 14h.01" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M14 8l2-2a2.83 2.83 0 00-4-4l-2 2M6 12l-2 2a2.83 2.83 0 004 4l2-2" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Essential Links
                        </h3>
                    </div>

                    <div className="flex-grow flex flex-col space-y-3">
                        {links.length > 0 ? (
                            <div className="flex flex-wrap gap-2.5">
                                {links.map((item) => (
                                    <div key={item.id} className="group relative">
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
                                                style={{
                                                    backgroundColor: config.soft,
                                                    border: `1.5px solid color-mix(in srgb, ${config.color} 30%, transparent)`,
                                                    color: config.color,
                                                    ['--tw-ring-color' as string]: config.color
                                                }}
                                            >
                                                <span className="opacity-70 group-hover:opacity-100 transition-opacity">🌐</span> {item.label}
                                            </a>
                                        ) : (
                                            <span
                                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm"
                                                style={{
                                                    backgroundColor: 'var(--color-bg-light)',
                                                    border: '1.5px solid var(--color-border)',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                <span className="opacity-50">🌐</span> {item.label}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeLinkItem(item.id)}
                                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-bg-primary text-text-muted border border-border hover:bg-error hover:text-bg-base hover:border-error text-[10px] font-bold opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all flex items-center justify-center cursor-pointer shadow-sm z-10 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none touch-manipulation scale-75 group-hover:scale-100"
                                            aria-label={`Remove link ${item.label}`}
                                            title="Remove link"
                                            style={{ ['--tw-ring-color' as string]: 'var(--color-error)' }}
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 opacity-60">
                                <span className="text-3xl grayscale">🔗</span>
                                <p className="text-sm text-text-muted font-medium">No links saved yet.</p>
                            </div>
                        )}
                    </div>

                    {!showAddLink ? (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddLink(true)}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border/70 bg-bg-primary/30 text-text-muted text-sm font-semibold hover:border-border hover:text-text hover:bg-bg-light/30 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation group"
                                style={{ ['--tw-ring-color' as string]: config.color }}
                            >
                                <span className="group-hover:rotate-90 transition-transform duration-300 text-lg leading-none">＋</span> Add Link
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-3 border-t border-border/30">
                            <div>
                                <label htmlFor="linkLabelInput" className="sr-only">Link Label</label>
                                <input
                                    id="linkLabelInput"
                                    value={linkLabel}
                                    onChange={(e) => setLinkLabel(e.target.value)}
                                    placeholder="Label (e.g. My Resume)"
                                    autoComplete="off"
                                    className="w-full rounded-xl border border-border/60 bg-bg-light/40 hover:bg-bg-light/60 px-4 py-2.5 text-sm text-text placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:bg-bg-light transition-all shadow-inner"
                                    style={{ ['--tw-ring-color' as string]: config.color }}
                                />
                            </div>
                            <div>
                                <label htmlFor="linkUrlInput" className="sr-only">Link URL</label>
                                <input
                                    id="linkUrlInput"
                                    type="url"
                                    inputMode="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addLinkItem();
                                        }
                                    }}
                                    placeholder="URL (e.g. example.com)"
                                    autoComplete="off"
                                    className="w-full rounded-xl border border-border/60 bg-bg-light/40 hover:bg-bg-light/60 px-4 py-2.5 text-sm text-text placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:bg-bg-light transition-all shadow-inner"
                                    style={{ ['--tw-ring-color' as string]: config.color }}
                                />
                            </div>
                            <div className="flex gap-2.5 pt-1">
                                <button
                                    type="button"
                                    onClick={addLinkItem}
                                    disabled={!linkLabel.trim() || !linkUrl.trim()}
                                    className="flex-1 py-2.5 rounded-xl text-bg-base text-sm font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    style={{ 
                                        backgroundColor: config.color,
                                        ['--tw-ring-color' as string]: config.color
                                    }}
                                >
                                    Save Link
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddLink(false);
                                        setLinkLabel('');
                                        setLinkUrl('');
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-border/60 bg-bg-primary/50 text-text font-semibold text-sm hover:bg-bg-light hover:border-border transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border focus-visible:outline-none touch-manipulation cursor-pointer"
                                    aria-label="Cancel adding link"
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
