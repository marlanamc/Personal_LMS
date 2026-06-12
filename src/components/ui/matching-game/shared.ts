export interface CountableWord {
    id: number;
    word: string;
    category: "countable" | "uncountable";
    explanation: string;
}

export interface GameState {
    currentWordIndex: number;
    correctCount: number;
    incorrectAttempts: number;
    completedWords: Set<number>;
    showExplanation: boolean;
    explanationText: string;
    isAutoAdvancing: boolean;
    bounceWord: boolean;
}

export interface Round {
    roundNumber: number;
    words: CountableWord[];
}

export interface VocabPair {
    id: number;
    term: string;
    definition: string;
}

export interface TimeIndicatorWord {
    id: number;
    word: string;
    category: "specified" | "unspecified";
    explanation: string;
}

export interface TimeIndicatorRound {
    roundNumber: number;
    difficulty: "easy" | "medium" | "hard";
    words: TimeIndicatorWord[];
}

export const VERB_TENSE_HINTS: Record<string, { emoji: string; label: string; bgClass: string; textClass: string }> = {
    "present-simple": { emoji: "👤", label: "Present simple", bgClass: "bg-sky-100", textClass: "text-sky-800" },
    "present-continuous": { emoji: "🔄", label: "Present continuous", bgClass: "bg-teal-100", textClass: "text-teal-800" },
    "present-perfect": { emoji: "✨", label: "Present perfect", bgClass: "bg-violet-100", textClass: "text-violet-800" },
    "present-perfect-continuous": { emoji: "💫", label: "Present perfect continuous", bgClass: "bg-purple-100", textClass: "text-purple-800" },
    "past-simple": { emoji: "⏪", label: "Past simple", bgClass: "bg-amber-100", textClass: "text-amber-800" },
    "past-continuous": { emoji: "📖", label: "Past continuous", bgClass: "bg-orange-100", textClass: "text-orange-800" },
    "past-perfect": { emoji: "⏮️", label: "Past perfect", bgClass: "bg-rose-100", textClass: "text-rose-800" },
    "past-perfect-continuous": { emoji: "📜", label: "Past perfect continuous", bgClass: "bg-red-100", textClass: "text-red-800" },
    "future-simple": { emoji: "🚀", label: "Future simple", bgClass: "bg-indigo-100", textClass: "text-indigo-800" },
    "future-continuous": { emoji: "🌊", label: "Future continuous", bgClass: "bg-cyan-100", textClass: "text-cyan-800" },
    "future-perfect": { emoji: "🎯", label: "Future perfect", bgClass: "bg-emerald-100", textClass: "text-emerald-800" },
};

export interface VerbBlank {
    correctWord: string;
    wrongWord: string;
    explanation: string;
    tense?: string;
}

export interface VerbSoundsRightItem {
    id: number;
    sentence: string;
    blanks: VerbBlank[];
    // Legacy single-blank support (will be converted to blanks array)
    correctWord?: string;
    wrongWord?: string;
    explanation?: string;
    tense?: string;
}

export interface VerbSoundsRightRound {
    roundNumber: number;
    items: VerbSoundsRightItem[];
}

export function normalizeVerbOption(word: string): string {
    return word.trim().replace(/\s+/g, " ").toLowerCase();
}

export function isSupportedVerbTense(value: string | undefined): boolean {
    return !!(value && VERB_TENSE_HINTS[value]);
}

export function buildVerbOptions(blank: VerbBlank, shouldSwap: boolean): string[] {
    const ordered = shouldSwap
        ? [blank.wrongWord, blank.correctWord]
        : [blank.correctWord, blank.wrongWord];
    const options: string[] = [];
    const seen = new Set<string>();

    for (const rawOption of ordered) {
        const option = rawOption.trim();
        const normalized = normalizeVerbOption(option);
        if (!normalized || seen.has(normalized)) continue;
        seen.add(normalized);
        options.push(option);
    }

    if (options.length > 0) return options;
    const fallback = blank.correctWord.trim();
    return fallback ? [fallback] : [];
}

export interface Props {
    contentStr: string;
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
}

export enum InteractionMode {
    Idle = "idle",
    WordSelected = "word-selected",
    Dragging = "dragging",
    Checking = "checking",
}
