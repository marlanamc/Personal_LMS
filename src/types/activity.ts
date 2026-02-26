export type ActivityType =
    | "quiz"
    | "worksheet"
    | "slides"
    | "guide"
    | "game"
    | "resource"
    | "speaking";

export type FormulaPartType = "subject" | "verb" | "object" | "other";

export interface FormulaPart {
    text: string;
    type?: FormulaPartType;
}

export type ExerciseItem =
    | {
        type: "text";
        label: string;
        placeholder?: string;
        correctAnswer?: string;
        expectedAnswer?: string;
        expectedAnswers?: string[];
        /** When true, any non-empty attempt counts as correct (for open-ended questions). */
        acceptAnyAttempt?: boolean;
    }
    | {
        type: "select";
        label: string;
        options: string[];
        expectedAnswer?: string;
        expectedAnswers?: string[];
    }
    | {
        type: "radio";
        label: string;
        options: Array<{ value: string; label: string }>;
        expectedAnswer?: string;
        expectedAnswers?: string[];
    }
    | {
        type: "word-select";
        label: string;
        selectWhat?: string; // e.g. "nouns and pronouns"
        tokens: Array<{
            text: string;
            after?: string; // defaults to " "
            isTarget?: boolean;
        }>;
    }
    | {
        type: "word-scramble";
        label: string;
        words: string[];
        correctAnswer: string;
        hint?: string;
    };

export interface Exercise {
    title: string;
    instructions?: string;
    /** Explicitly declare whether learners should type missing words or a full sentence. */
    answerExpectation?: "missing-words" | "full-sentence";
    items: ExerciseItem[];
    id?: string; // For tracking completion
}

export type LegacyExercise = ExerciseItem;

export interface UsageMeaning {
    title: string;
    description: string;
    examples: Array<{
        sentence: string;
        explanation?: string;
    }>;
}

export interface ComparisonRow {
    label: string;
    left: string;
    right: string;
}

export interface TimeExpression {
    word: string;
    usage: string;
    examples: string[];
}

export interface VerbTable {
    title: string;
    headers: string[];
    rows: string[][];
}

export interface InteractiveGuideSection {
    id?: string; // For tracking progress
    stepNumber?: number;
    title: string;
    icon?: string; // Emoji or icon name
    explanation?: string;
    formula?: FormulaPart[];
    examples?: string[];
    exercises?: Array<Exercise | LegacyExercise>;
    usageMeanings?: UsageMeaning[]; // For meaning sections
    comparison?: {
        title: string;
        leftLabel: string;
        rightLabel: string;
        rows: ComparisonRow[];
    };
    timeExpressions?: TimeExpression[];
    verbTable?: VerbTable;
    tipBox?: {
        title: string;
        content: string;
    };
    timeline?: {
        title: string;
        description: string;
        events: Array<{
            label: string;
            order: number;
            tenseLabel: string;
        }>;
    };
    futureChoiceFlow?: {
        title?: string;
        description?: string;
        options: Array<{
            form: "will" | "going-to" | "present-continuous" | "future-continuous";
            trigger: string;
            example: string;
            color: string; // e.g. "cyan", "green", "violet", "amber"
        }>;
    };
    postExplanation?: string;
}

export interface LegacyGuideMetadata {
    source: "legacy";
    originalFile: string;
    [key: string]: unknown;
}

export interface MiniQuizQuestion {
    id: string;
    question: string;
    options: Array<{ value: string; label: string }>;
    correctAnswer: string;
    explanation?: string;
    /** Topic tag for diagnostic reports (e.g., "present-simple", "time-expressions") */
    topic?: string;
    /** Skill category being tested (e.g., "recognition", "formation", "usage", "error-detection", "production") */
    skill?: string;
    /** Specific skill tag for granular diagnostic tracking (e.g., "form-positive-he-she-it", "meaning-habit-vs-now") */
    skillTag?: string;
    /** Difficulty level for adaptive learning and reporting */
    difficulty?: "easy" | "medium" | "hard";
}

/** Individual question response for diagnostic tracking */
export interface QuestionResponse {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    skillTag?: string;
    difficulty?: string;
    topic?: string;
}

export interface SpeakingPrompt {
    id: string;
    text: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    context?: string;

    // For warmup mode: Instructions for solo vs partnered practice
    soloInstructions?: string;
    partnerInstructions?: string;
}

export interface KeyPhrase {
    phrase: string;
    example?: string;
}

export type ActivityProgressStatus = "in_progress" | "completed" | "submitted";

export interface SoloStep {
    id: string;
    text: string;
    required?: boolean;
}

export interface SpeakingStep {
    id: string;
    text: string;
    required?: boolean;
}

export interface SoloModeConfig {
    title: string;
    subtitle: string;
    checklist: Array<{
        id: string;
        text: string;
        required: boolean;
    }>;
    inputs: Array<{
        id: string;
        label: string;
        type: "text" | "textarea";
        required: boolean;
    }>;
    help: {
        sentenceFrames: string[];
        questionStems: string[];
        wordBank: string[];
    };
}

export interface SpeakingModeConfig {
    title: string;
    subtitle: string;
    checklist: Array<{
        id: string;
        text: string;
        required: boolean;
    }>;
    inputs: Array<{
        id: string;
        label: string;
        type: "text" | "textarea";
        required: boolean;
    }>;
    noPartnerNote?: string;
}

export interface SpeakingSubmission {
    activityId: string;
    assignmentId?: string | null;
    userId: string;
    selectedPromptIds: string[];
    solo: {
        sentences: [string, string, string];
        followUpQuestions: [string, string];
        completedStepIds: string[];
    };
    speaking: {
        bestSentence: string;
        completedStepIds: string[];
    };
    submittedAt: string;
    status: "submitted";
}

export interface SpeakingActivityContent {
    type: "speaking";
    title: string;
    description?: string;
    keyPhrases?: KeyPhrase[];
    prompts: SpeakingPrompt[];
    reflectionPrompt?: string;
    reflectionMinLength?: number;
    minPromptsRequired?: number;
    released?: boolean; // Control visibility like quiz releases

    // NEW: Enable simple warmup mode
    warmupMode?: boolean;  // When true, use simple participation tracking

    // Warmup-specific settings
    participationPoints?: number;  // Default: 3 points

    // New two-phase warm-up structure
    soloMode?: SoloModeConfig;
    speakingMode?: SpeakingModeConfig;

    // Legacy structure (for backward compatibility)
    soloSteps?: SoloStep[];
    speakingSteps?: SpeakingStep[];
    soloHelp?: {
        sentenceFrames: string[];
        questionStems: string[];
        wordBank: string[];
    };
}

export interface InteractiveGuideContent {
    id?: string;
    title?: string;
    category?: string;
    description?: string;
    level?: string;
    estimatedMinutes?: number;
    type?: "interactive-guide";
    sections: InteractiveGuideSection[];
    miniQuiz?: MiniQuizQuestion[]; // Optional final comprehension check
    tableOfContents?: boolean; // Show TOC
    metadata?: LegacyGuideMetadata;
}

export type LegacyGuideContent = InteractiveGuideContent & {
    metadata: LegacyGuideMetadata;
};

export interface QuizQuestion {
    id?: string | number;
    question: string;
    type?: "text" | "multiple" | "single" | "radio" | "checkbox";
    options?: string[];
}

export interface QuizContent {
    questions: QuizQuestion[];
}

export interface WorksheetSection {
    title?: string;
    instructions?: string;
    content?: string;
}

export interface WorksheetContent {
    sections?: WorksheetSection[];
    content?: string;
}

export interface SlidesContent {
    slides?: unknown[];
}

export interface GuideSection {
    heading: string;
    content: string;
}

export interface GuideContent {
    title?: string;
    sections?: GuideSection[];
    content?: string;
    metadata?: LegacyGuideMetadata;
}

export interface FlashcardContent {
    cards?: Array<{
        term: string;
        definition: string;
        example?: string;
        pos?: string;
    }>;
    [key: string]: unknown;
}

export interface MatchingContent {
    pairs?: Array<{
        id: number;
        term: string;
        definition: string;
    }>;
    [key: string]: unknown;
}

export interface FillInBlankContent {
    sentences?: Array<{
        id: string;
        text: string;
        blanks: string[];
        correctAnswers: string[];
    }>;
    [key: string]: unknown;
}

export interface VocabularyContent {
    type: "vocabulary";
    wordList?: Record<string, unknown>;
    flashcards?: FlashcardContent;
    matching?: MatchingContent;
    fillInBlank?: FillInBlankContent;
}

export interface EdPronunciationContent {
    type: "ed-pronunciation";
    mode: "sorting" | "minimal-pairs" | "mixed";
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    /** Optional list of specific verbs to use (base forms). If omitted, uses built-in list. */
    verbs?: string[];
    /** Number of verbs per round (default: 15) */
    roundSize?: number;
}

export interface MinimalPairsContent {
    type: "minimal-pairs";
    contrastId?: "mixed" | "short-i-long-e" | "b-v" | "r-l" | "sh-ch";
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    roundSize?: number;
}

export type ActivityContent =
    | QuizContent
    | WorksheetContent
    | GuideContent
    | InteractiveGuideContent
    | LegacyGuideContent
    | SlidesContent
    | SpeakingActivityContent
    | VocabularyContent
    | EdPronunciationContent
    | MinimalPairsContent
    | SpanishVocabularyContent
    | SpanishNumbersContent
    | SpanishVerbGameContent
    | OutputPredictionContent
    | BugHuntContent
    | CodeCompletionContent
    | ConceptMatchContent
    | Record<string, unknown>;

export interface LegacyGuideResponse {
    html: string;
    styles: string[];
    scripts: string[];
    source: string;
}

export function parseActivityContent(raw: string): ActivityContent | null {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            return parsed as ActivityContent;
        }
    } catch {
        // ignore
    }
    return null;
}

export function isInteractiveGuideContent(value: unknown): value is InteractiveGuideContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "interactive-guide" && Array.isArray(candidate["sections"]);
}

export function isLegacyGuideContent(value: unknown): value is LegacyGuideContent {
    if (!isInteractiveGuideContent(value)) return false;
    const candidate = value as InteractiveGuideContent;
    const meta = candidate.metadata;
    return !!meta && meta.source === "legacy" && typeof meta.originalFile === "string";
}

export function isSpeakingActivityContent(value: unknown): value is SpeakingActivityContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "speaking" && Array.isArray(candidate["prompts"]);
}

export function isVocabularyContent(value: unknown): value is VocabularyContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "vocabulary";
}

export function isEdPronunciationContent(value: unknown): value is EdPronunciationContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "ed-pronunciation";
}

export function isMinimalPairsContent(value: unknown): value is MinimalPairsContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "minimal-pairs";
}

// ============================================================================
// SPANISH LEARNING TYPES
// ============================================================================

export interface SpanishVocabularyCard {
    id: string;
    spanish: string;
    english: string;
    pronunciation?: string;
    example: { spanish: string; english: string };
    gender?: "masculine" | "feminine" | null;
    difficulty: "beginner" | "intermediate" | "advanced";
    category?: string;
}

export interface SpanishVocabularyContent {
    type: "spanish-vocabulary";
    title: string;
    cards: SpanishVocabularyCard[];
    mode?: "flashcard" | "quiz" | "matching";
}

export interface SpanishNumbersContent {
    type: "spanish-numbers-game";
    difficulty: "easy" | "medium" | "hard" | "mixed";
    timedMode?: boolean;
    timeLimit?: number; // seconds
}

export interface SpanishVerbConjugation {
    infinitive: string;
    english: string;
    type: "ar" | "er" | "ir" | "irregular";
    present: {
        yo: string;
        tu: string;
        el: string;
        nosotros: string;
        ellos: string;
    };
    preterite?: {
        yo: string;
        tu: string;
        el: string;
        nosotros: string;
        ellos: string;
    };
    irregularNote?: string;
}

export interface SpanishVerbGameContent {
    type: "spanish-verb-game";
    tense: "present" | "preterite" | "mixed";
    verbTypes: ("ar" | "er" | "ir" | "irregular")[];
    verbs: SpanishVerbConjugation[];
    timedMode?: boolean;
    timeLimit?: number;
}

export function isSpanishVocabularyContent(value: unknown): value is SpanishVocabularyContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "spanish-vocabulary" && Array.isArray(candidate["cards"]);
}

export function isSpanishNumbersContent(value: unknown): value is SpanishNumbersContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "spanish-numbers-game";
}

export function isSpanishVerbGameContent(value: unknown): value is SpanishVerbGameContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "spanish-verb-game" && Array.isArray(candidate["verbs"]);
}

// ============================================================================
// CODING CHALLENGE TYPES
// ============================================================================

export interface OutputPredictionChallenge {
    id: string;
    code: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
    topic: string;
}

export interface OutputPredictionContent {
    type: "output-prediction";
    title: string;
    category: string;
    challenges: OutputPredictionChallenge[];
    timedMode?: boolean;
    timeLimit?: number;
}

export interface BugHuntChallenge {
    id: string;
    title: string;
    buggyCode: string;
    bugLine: number;
    bugDescription: string;
    fixOptions: string[];
    correctFix: string;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
    bugType: "syntax" | "logic" | "type" | "runtime";
    hints: string[];
}

export interface BugHuntContent {
    type: "bug-hunt";
    title: string;
    category: "syntax" | "logic" | "type" | "mixed";
    challenges: BugHuntChallenge[];
    timedMode?: boolean;
}

export interface CodeCompletionBlank {
    index: number;
    answer: string;
    options?: string[];
    hint?: string;
}

export interface CodeCompletionChallenge {
    id: string;
    description: string;
    codeWithBlanks: string;
    blanks: CodeCompletionBlank[];
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
}

export interface CodeCompletionContent {
    type: "code-completion";
    title: string;
    challenges: CodeCompletionChallenge[];
}

export interface ConceptMatchPair {
    id: string;
    concept: string;
    definition: string;
    example?: string;
}

export interface ConceptMatchContent {
    type: "concept-match";
    title: string;
    category: string;
    pairs: ConceptMatchPair[];
}

export function isOutputPredictionContent(value: unknown): value is OutputPredictionContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "output-prediction" && Array.isArray(candidate["challenges"]);
}

export function isBugHuntContent(value: unknown): value is BugHuntContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "bug-hunt" && Array.isArray(candidate["challenges"]);
}

export function isCodeCompletionContent(value: unknown): value is CodeCompletionContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "code-completion" && Array.isArray(candidate["challenges"]);
}

export function isConceptMatchContent(value: unknown): value is ConceptMatchContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "concept-match" && Array.isArray(candidate["pairs"]);
}
