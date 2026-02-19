"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type {
    ActivityContent,
    GuideContent,
    InteractiveGuideContent,
    LegacyGuideResponse,
    QuizContent,
    QuizQuestion,
    SlidesContent,
    WorksheetContent
} from "@/types/activity";
import {
    isInteractiveGuideContent,
    isLegacyGuideContent,
    parseActivityContent,
    isVocabularyContent,
    type VocabularyContent
} from "@/types/activity";
import InteractiveGuideViewer from "./InteractiveGuideViewer";
import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { sanitizeCss, sanitizeHtml } from "@/utils/sanitize";
import Link from "next/link";
import FlashcardCarousel from "./ui/FlashcardCarousel";
import FillInBlankGame from "./ui/FillInBlankGame";
import MatchingGame from "./ui/MatchingGame";
import NumbersGame from "./ui/NumbersGame";
import VerbFormsGame from "./ui/VerbFormsGame";
import EdPronunciationGame from "./ui/EdPronunciationGame";
import MinimalPairsGame from "./ui/MinimalPairsGame";
import VerbQuizContainer from "./activities/VerbQuizContainer";
import { VerbQuizContent } from "@/types/verb-quiz";
import SpeakingActivityRenderer from "./activities/SpeakingActivityRenderer";
import { isSpeakingActivityContent } from "@/types/activity";
import type { SpeakingActivityContent } from "@/types/activity";
import VocabularyRenderer from "./activities/VocabularyRenderer";
import { completionKeyFromActivityTitle } from "@/utils/completionKey";
import { saveActivityProgress } from "@/lib/activityProgress";
import { resolveActivityGameUi } from "@/lib/gamification/activity-points";

interface Props {
    activity: {
        id: string;
        title: string;
        description: string | null;
        content: string;
        type: string;
        category?: string | null;
        level?: string | null;
        ui?: string | null;
    };
    assignmentId?: string | null;
    existingSubmission?: {
        id: string;
        content: unknown;
        score: number | null;
    } | null;
}

export default function ActivityRenderer({ activity, assignmentId, existingSubmission }: Props) {
    const content = parseActivityContent(activity.content);
    if (!content && activity.type === "resource") {
        return (
            <ResourceRenderer
                contentStr={activity.content}
                activityId={activity.id}
                title={activity.title}
                category={activity.category}
            />
        );
    }

    // Check for external URL redirect
    if (content && 'externalUrl' in content && typeof content.externalUrl === 'string') {
        return <ExternalUrlRedirect url={content.externalUrl} />;
    }

    const renderActivityContent = () => {
        switch (activity.type) {
            case "quiz":
                return (
                    <QuizRenderer
                        content={content as QuizContent}
                        activityId={activity.id}
                        assignmentId={assignmentId}
                        activityTitle={activity.title}
                        existingSubmission={existingSubmission}
                    />
                );
            case "worksheet":
                return <WorksheetRenderer content={content as WorksheetContent} />;
            case "slides":
                return <SlidesRenderer content={content as SlidesContent} />;
            case "guide":
                if (isLegacyGuideContent(content)) {
                    return <LegacyGuideRenderer originalFile={content.metadata.originalFile} />;
                }
                if (isInteractiveGuideContent(content)) {
                    if (activity.category === "grammar") {
                        return (
                            <GrammarReader
                                content={content as InteractiveGuideContent}
                                completionKey={completionKeyFromActivityTitle(activity.title)}
                                activityId={activity.id}
                            />
                        );
                    }
                }
                return <InteractiveGuideViewer content={content as InteractiveGuideContent} title={activity.title} />;
            case "speaking":
                if (isSpeakingActivityContent(content)) {
                    return (
                        <SpeakingActivityRenderer
                            content={content as SpeakingActivityContent}
                            activityId={activity.id}
                            assignmentId={assignmentId}
                        />
                    );
                }
                return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Invalid speaking activity content.</div>;
            case "vocabulary":
                if (isVocabularyContent(content)) {
                    return (
                        <VocabularyRenderer
                            content={content as VocabularyContent}
                            activityId={activity.id}
                            title={activity.title}
                            assignmentId={assignmentId}
                        />
                    );
                }
                return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Invalid vocabulary activity content.</div>;
            case "game": {
                const gameUi = resolveActivityGameUi(activity);
                switch (gameUi) {
                    case "numbers":
                        return <NumbersGame contentStr={activity.content} activityId={activity.id} />;
                    case "fill-in-blank":
                        return <FillInBlankGame contentStr={activity.content} activityId={activity.id} assignmentId={assignmentId} />;
                    case "verb-forms":
                        return <VerbFormsGame contentStr={activity.content} activityId={activity.id} />;
                    case "ed-pronunciation":
                        return <EdPronunciationGame contentStr={activity.content} activityId={activity.id} assignmentId={assignmentId} />;
                    case "minimal-pairs":
                        return <MinimalPairsGame contentStr={activity.content} activityId={activity.id} assignmentId={assignmentId} />;
                     case "matching":
                         return (
                             <MatchingGame
                                 contentStr={activity.content}
                                 activityId={activity.id}
                                 assignmentId={assignmentId}
                             />
                         );
                     case "word-list":
                         return (
                             <ResourceRenderer
                                 contentStr={activity.content}
                                 activityId={activity.id}
                                 title={activity.title}
                                 category={activity.category}
                             />
                         );
                     default:
                        return <FlashcardRenderer contentStr={activity.content} activityId={activity.id} />;
                }
            }
            case "resource":
                return (
                    <ResourceRenderer
                        contentStr={activity.content}
                        activityId={activity.id}
                        title={activity.title}
                        category={activity.category}
                    />
                );
            default:
                if (!content) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Unable to load activity content.</div>;
                return <DefaultRenderer content={content} />;
        }
    };

    return (
        <div className="space-y-6">
            {renderActivityContent()}
        </div>
    );
}

function QuizRenderer({
    content,
    activityId,
    assignmentId,
    activityTitle,
    existingSubmission,
}: {
    content: QuizContent | VerbQuizContent;
    activityId: string;
    assignmentId?: string | null;
    activityTitle?: string;
    existingSubmission?: {
        id: string;
        content: unknown;
        score: number | null;
    } | null;
}) {
    // Check if this is a verb quiz
    if (content && typeof content === 'object' && 'type' in content && content.type === 'verb-quiz') {
        return (
                <VerbQuizContainer
                    content={content as VerbQuizContent}
                    activityId={activityId}
                    assignmentId={assignmentId}
                    activityTitle={activityTitle}
                    existingSubmission={existingSubmission}
                />
            );
    }

    // Regular quiz renderer
    const quizContent = content as QuizContent;
    const questions = quizContent.questions || [];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Quiz Questions</h3>
            {questions.map((q: QuizQuestion, index: number) => (
                <div key={q.id || index} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <p className="font-medium text-gray-900 mb-2">
                        {index + 1}. {q.question}
                    </p>
                    {q.options && (
                        <div className="space-y-2 ml-4">
                            {q.options.map((option: string, optIndex: number) => (
                                <label key={optIndex} className="flex items-center">
                                    <input
                                        type={q.type === "multiple" ? "checkbox" : "radio"}
                                        name={`question-${q.id || index}`}
                                        className="mr-2"
                                        disabled
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {q.type === "text" && (
                        <textarea
                            className="w-full mt-2 border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Your answer…"
                            disabled
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function WorksheetRenderer({ content }: { content: WorksheetContent }) {
    return (
        <div className="prose max-w-none">
            {content.sections?.map((section, index: number) => (
                <div key={index} className="mb-6">
                    {section.title && (
                        <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
                    )}
                    {section.instructions && (
                        <p className="text-gray-600 mb-3">{section.instructions}</p>
                    )}
                    {section.content && (
                        <div className="whitespace-pre-wrap text-gray-700">{section.content}</div>
                    )}
                </div>
            ))}
            {content.content && (
                <div className="whitespace-pre-wrap text-gray-700">{content.content}</div>
            )}
        </div>
    );
}

function SlidesRenderer({ content }: { content: SlidesContent }) {
    const slides = Array.isArray(content.slides) ? content.slides : [];

    return (
        <div className="space-y-4">
            <p className="text-gray-600 mb-4">
                This is a slide presentation with {slides.length} slide{slides.length !== 1 ? "s" : ""}.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-indigo-800">
                    💡 Slide presentations are best viewed in full-screen mode.
                    Use the arrow keys to navigate between slides.
                </p>
            </div>
        </div>
    );
}

function GuideRenderer({ content }: { content: GuideContent }) {
    return (
        <div className="prose max-w-none">
            {content.title && <h3 className="text-xl font-semibold mb-4">{content.title}</h3>}
            {content.sections?.map((section, index: number) => (
                <div key={index} className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">{section.heading}</h4>
                    <p className="text-gray-700">{section.content}</p>
                </div>
            ))}
            {content.content && (
                <div className="whitespace-pre-wrap text-gray-700">{content.content}</div>
            )}
        </div>
    );
}

// Replaced by external component
// function InteractiveGuideRenderer({ content }: { content: InteractiveGuideContent }) { ... }

function LegacyGuideRenderer({ originalFile }: { originalFile: string }) {
    const [html, setHtml] = useState<string | null>(null);
    const [styles, setStyles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sections, setSections] = useState<Array<{ id: string; title: string }>>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadGuide = async () => {
            try {
                const response = await fetch(`/api/legacy-guide?file=${encodeURIComponent(originalFile)}`);
                if (!response.ok) {
                    throw new Error(`Failed to load legacy guide (${response.status})`);
                }
                const data: LegacyGuideResponse = await response.json();
                if (!isMounted) return;
                setHtml(data.html || null);
                setStyles(Array.isArray(data.styles) ? data.styles : []);
            } catch (err) {
                if (isMounted) {
                    const message = err instanceof Error ? err.message : 'Unable to load legacy guide content.';
                    setError(message);
                }
            }
        };

        loadGuide();
        return () => {
            isMounted = false;
        };
    }, [originalFile]);

    useEffect(() => {
        if (!html) return;
        const container = containerRef.current;
        if (!container) return;

        const nodes = Array.from(container.querySelectorAll(".step-section"));
        const mapped = nodes.map((node, idx) => {
            const title =
                (node.querySelector(".step-title")?.textContent || "").trim() ||
                `Section ${idx + 1}`;
            let id = (node as HTMLElement).id;
            if (!id) {
                id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `section-${idx + 1}`;
                (node as HTMLElement).id = id;
            }
            return { id, title };
        });
        setSections(mapped);
    }, [html]);

    const handleJump = (id: string) => {
        const container = containerRef.current;
        if (!container) return;
        const target = container.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null;
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // useMemo hooks must be called before any early returns
    const safeHtml = useMemo(() => sanitizeHtml(html || ""), [html]);
    const safeStyles = useMemo(() => styles.map((css) => sanitizeCss(css)).filter(Boolean), [styles]);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
            </div>
        );
    }

    if (!html) {
        return (
            <div className="text-gray-600">
                Loading guide...
            </div>
        );
    }

    return (
        <div className="legacy-guide-wrapper">
            {sections.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
                    <div className="text-sm font-semibold text-gray-800">Jump to section:</div>
                    <select
                        onChange={(e) => e.target.value && handleJump(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                        defaultValue=""
                    >
                        <option value="" disabled>Select a section</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {safeStyles.map((css, idx) => (
                <style key={idx} dangerouslySetInnerHTML={{ __html: css }} />
            ))}
            {/* Scripts intentionally not injected to reduce XSS risk */}
            <div
                ref={containerRef}
                dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
        </div>
    );
}

function ExternalUrlRedirect({ url }: { url: string }) {
    useEffect(() => {
        window.location.href = url;
    }, [url]);

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to activity...</p>
            </div>
        </div>
    );
}

function DefaultRenderer({ content }: { content: ActivityContent }) {
    return (
        <div className="prose max-w-none">
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(content, null, 2)}
            </pre>
        </div>
    );
}

function ResourceRenderer({
    contentStr,
    activityId,
    title,
    category,
}: {
    contentStr: string;
    activityId?: string;
    title?: string;
    category?: string | null;
}) {
    const entries = parsePlainVocabulary(contentStr);
    const isWordList =
        title?.toLowerCase().includes("word list") ||
        ((category === "vocab" || category === "vocabulary") && entries.length > 0);

    useEffect(() => {
        if (!activityId || !isWordList) return;
        void saveActivityProgress(activityId, 100, "completed", undefined, category ?? undefined);
    }, [activityId, category, isWordList]);

    if (!entries || entries.length === 0) {
        return (
            <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{contentStr}</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((entry, idx) => (
                <div
                    key={`${entry.term}-${idx}`}
                    className="group relative overflow-hidden rounded-xl bg-white border border-border/60 p-6 shadow-sm transition-[box-shadow,border-color,transform] duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
                    <div className="absolute top-0 right-0 p-6 flex justify-end">
                        <span className="text-5xl font-black text-gray-100 transition-colors group-hover:text-primary/10 select-none">
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="relative z-10">
                        {/* Term & POS */}
                        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                            <h3 className="text-2xl font-bold text-gray-900 font-display tracking-tight group-hover:text-primary transition-colors">
                                {entry.term}
                            </h3>
                            {entry.pos && (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold italic border border-slate-200">
                                    {entry.pos}
                                </span>
                            )}
                        </div>

                        {/* Definition */}
                        <div className="mb-6">
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {entry.definition}
                            </p>
                        </div>

                        {/* Example Box */}
                        {entry.example && (
                            <div className="rounded-lg bg-orange-50 border border-orange-100 p-4 transition-colors group-hover:bg-orange-50/80">
                                <div className="flex gap-3">
                                    <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M10 2a6 6 0 00-6 6c0 1.887.454 3.665 1.257 5.234a.5.5 0 01.444.276L7.11 16.44a4.5 4.5 0 004.89 2.232 4.5 4.5 0 003.29-3.29 4.5 4.5 0 002.231-4.89.5.5 0 01.277-.444C19.546 8.335 20 6.557 20 5a6 6 0 00-6-6zm0 2a4 4 0 014 4c0 .87-.245 1.691-.68 2.399a.5.5 0 00-.095.53l.97 2.43a2.5 2.5 0 01-2.91 3.42 2.5 2.5 0 01-1.39-1.91l-.22-1.31a.5.5 0 00-.492-.417l-1.31-.22a2.5 2.5 0 01-1.91-1.39 2.5 2.5 0 013.42-2.91l2.43.97a.5.5 0 00.53-.095A3.996 3.996 0 0110 4z" />
                                            <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-1 opacity-70">
                                            Usage Example
                                        </p>
                                        <p className="text-sm text-gray-700 italic">
                                            "{entry.example}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function FlashcardRenderer({ contentStr, activityId }: { contentStr: string; activityId?: string }) {
    const cards = parseFlashcards(contentStr);
    if (!cards || cards.length === 0) {
        return <ResourceRenderer contentStr={contentStr} />;
    }

    return <FlashcardCarousel cards={cards} activityId={activityId} />;
}

function parsePlainVocabulary(contentStr: string): Array<{ term: string; pos?: string; definition: string; example?: string }> {
    const lines = contentStr
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);

    const entries: Array<{ term: string; pos?: string; definition: string; example?: string }> = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let term = "";
        let pos = "";
        let definition = "";
        
        // 1. Try standard regex with number, POS, and em-dash
        // "1) Term (part of speech) — Definition"
        const fullMatch = line.match(/^\d+\)\s*(.+?)\s+\((.+?)\)\s+[—-]\s+(.*)$/);
        
        // 2. Try number, no POS, em-dash or hyphen
        // "1) Term — Definition" or "1) Term - Definition"
        const simpleMatch = !fullMatch && line.match(/^\d+\)\s*(.+?)\s+[—-]\s+(.*)$/);
        
        // 3. Try no number, em-dash or hyphen
        // "Term — Definition" or "Term - Definition"
        const noNumMatch = !fullMatch && !simpleMatch && line.match(/^(.+?)\s+[—-]\s+(.*)$/);

        if (fullMatch) {
            term = fullMatch[1].trim();
            pos = fullMatch[2].trim();
            definition = fullMatch[3].trim();
        } else if (simpleMatch) {
            term = simpleMatch[1].trim();
            definition = simpleMatch[2].trim();
        } else if (noNumMatch) {
            term = noNumMatch[1].trim();
            definition = noNumMatch[2].trim();
        }

        if (term && definition) {
            // Check for Example in next line
            let example: string | undefined;
            const next = lines[i + 1];
            if (next && next.toLowerCase().startsWith("example:")) {
                example = next.replace(/^example:\s*/i, "").trim();
                i += 1; // skip example line
            }
            // Skip special countable definitions
            const lowerDef = definition.toLowerCase();
            if (!lowerDef.startsWith("countable") && !lowerDef.startsWith("uncountable")) {
                 entries.push({ term, pos, definition, example });
            }
        }
    }
    return entries;
}

interface FlashcardData {
    id: string;
    term: string;
    definition: string;
    example?: string;
}

function parseFlashcards(contentStr: string): Array<FlashcardData> {
    const lines = contentStr
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);

    const clean = (text?: string) =>
        (text || "")
            // Strip common Markdown emphasis wrappers
            .replace(/^\*\*(.+)\*\*$/i, "$1")
            .replace(/^\*(.+)\*$/i, "$1")
            .replace(/^__(.+)__$/i, "$1")
            .replace(/^_(.+)_$/i, "$1")
            .trim();

    const cards: Array<FlashcardData> = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Support "1) Term — Definition — Example" or "1) Term — Definition"
        const numberedMatch = line.match(/^\d+\)\s*(.+)$/);
        // Support "Q: Definition — Term — Example"
        const qMatch = line.match(/^(?:-\s*)?Q:\s*(.+)$/i);

        const parseSegments = (raw: string) => {
            const parts = raw
                .split("—")
                .map((p) => p.trim())
                .filter(Boolean);
            if (parts.length < 2) return null;
            const term = qMatch ? parts[1] : parts[0];
            const definition = qMatch ? parts[0] : parts[1];
            const example = parts[2] || undefined;
            return { term, definition, example };
        };

        if (numberedMatch) {
            const segments = parseSegments(numberedMatch[1]);
            if (!segments) continue;
            const { term, definition } = segments;
            let { example } = segments;
            const next = lines[i + 1];
            if (!example && next && /^example:/i.test(next)) {
                example = next.replace(/^example:\s*/i, "").trim();
                i += 1;
            }
            cards.push({
                id: `card-${i}`,
                term: clean(term),
                definition: clean(definition),
                example: example ? clean(example) : undefined
            });
        } else if (qMatch) {
            const segments = parseSegments(qMatch[1]);
            if (!segments) continue;
            const { term, definition } = segments;
            let { example } = segments;
            const next = lines[i + 1];
            if (!example && next && /^example:/i.test(next)) {
                example = next.replace(/^example:\s*/i, "").trim();
                i += 1;
            }
            cards.push({
                id: `card-${i}`,
                term: clean(term),
                definition: clean(definition),
                example: example ? clean(example) : undefined
            });
        }
    }
    return cards;
}
