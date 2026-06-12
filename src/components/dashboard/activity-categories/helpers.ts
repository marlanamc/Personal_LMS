import { stripVocabTypeSuffix } from "@/lib/vocab-display";
import { resolveActivityGameUi } from "@/lib/activity-ui";
import { SPANISH_LEGACY_GAME_IDS } from "@/content/spanish/registry";
import { type Activity, type SubCategory, type Category } from "./types";

export const isSpanishActivity = (activity: Activity): boolean => {
    if (!activity.id) return false;
    const title = (activity.title || '').toLowerCase();
    return activity.id.startsWith('spanish-') || title.includes('spanish');
};

export const isCodingActivity = (activity: Activity): boolean => {
    if (!activity.id) return false;
    const title = (activity.title || '').toLowerCase();
    return (
        activity.id.startsWith('coding-') ||
        title.includes('coding') ||
        title.includes('javascript') ||
        title.includes('typescript') ||
        title.includes('js') ||
        title.includes('ts')
    );
};

export const isInPersonalTrackCategory = (activity: Activity, track: 'spanish' | 'coding'): boolean => {
    const category = (activity.category || '').toLowerCase();
    if (track === 'spanish') return category === 'spanish';
    return category === 'coding';
};

export const isTrackGameActivity = (activity: Activity): boolean => {
    if (activity.type !== "game") return false;
    if (activity.id?.startsWith("vocab-")) return false;
    return true;
};

export const SPANISH_LEGACY_GAME_ID_SET = new Set<string>(SPANISH_LEGACY_GAME_IDS);
export const isLearnerFacingSpanishGame = (activity: Activity): boolean => {
    return isTrackGameActivity(activity) && !SPANISH_LEGACY_GAME_ID_SET.has(activity.id);
};

export const sortBySuggestedOrder = (activities: Activity[], orderedIds: string[]): Activity[] => {
    const orderIndex = new Map<string, number>(orderedIds.map((id, index) => [id, index]));
    return [...activities].sort((a, b) => {
        const aIdx = orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bIdx = orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        if (aIdx !== bIdx) return aIdx - bIdx;
        return (a.title || '').localeCompare(b.title || '');
    });
};

export const displayTitle = (title: string) =>
    stripVocabTypeSuffix(
        title
            .replace(/\s*-\s*Complete Step-by-Step Guide\s*$/i, ' Guide')
            .replace(/\s*-\s*Complete Guide\s*$/i, ' Guide')
            .trim()
    );

export const VOCAB_THEME_BY_UNIT_NUMBER: Record<number, string> = {
    1: 'Vocabulary Unit 1',
    2: 'Vocabulary Unit 2',
    3: 'Vocabulary Unit 3',
    4: 'Vocabulary Unit 4',
    5: 'Vocabulary Unit 5',
    6: 'Vocabulary Unit 6',
    7: 'Vocabulary Unit 7',
    8: 'Vocabulary Unit 8',
    9: 'Vocabulary Unit 9',
    10: 'Vocabulary Unit 10',
};

export const VOCAB_TYPE_ONLY_LABEL_RE = /^(word\s*list|flash\s*cards?(?:\s*game)?|matching|fill-?in-?(?:the-?)?blank)$/i;
export const MONTH_NAMES_RE = '(january|february|march|april|may|june|july|august|september|october|november|december)';
export const VOCAB_TITLE_MONTH_WITH_DAY_RE = new RegExp(`^${MONTH_NAMES_RE}\\s+\\d{1,2}(?:\\s*[–-]\\s*(?:\\d{1,2}|${MONTH_NAMES_RE}\\s+\\d{1,2}))?\\s*`, 'i');
export const VOCAB_TITLE_MONTH_ONLY_RE = new RegExp(`^${MONTH_NAMES_RE}\\s*[-–]\\s*`, 'i');

export const getVocabUnitNumberFromActivity = (activity: Activity): number | null => {
    const titleMatch = displayTitle(activity.title).match(/\bunit\s+(\d+)\b/i);
    if (titleMatch?.[1]) {
        const unitNumber = Number.parseInt(titleMatch[1], 10);
        if (Number.isFinite(unitNumber) && unitNumber >= 1 && unitNumber <= 10) {
            return unitNumber;
        }
    }

    const coreId = activity.id
        .toLowerCase()
        .replace(/^vocab-/, '')
        .replace(/-(packet|flashcards|matching|fillblank)$/, '');

    if (coreId.startsWith('feb')) return 6;
    if (coreId.startsWith('mar')) return 7;
    if (coreId.startsWith('apr')) return 8;
    if (coreId.startsWith('may')) return 9;
    if (coreId.startsWith('jun')) return 10;

    return null;
};

export const extractThemeFromVocabTitle = (title: string): string | null => {
    const normalized = displayTitle(title).trim();
    if (!/^unit\s+\d+\s*:/i.test(normalized)) return null;

    let candidate = normalized.replace(/^unit\s+\d+\s*:\s*/i, '').trim();

    // Handle weekly/date titles and month headers.
    candidate = candidate.replace(VOCAB_TITLE_MONTH_WITH_DAY_RE, '').trim();
    candidate = candidate.replace(VOCAB_TITLE_MONTH_ONLY_RE, '').trim();

    if (!candidate || VOCAB_TYPE_ONLY_LABEL_RE.test(candidate)) {
        return null;
    }

    return candidate;
};

export const getVocabThemeChip = (activity: Activity): string | null => {
    const isVocabActivity = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary';
    if (!isVocabActivity) return null;

    const themeFromTitle = extractThemeFromVocabTitle(activity.title);
    if (themeFromTitle) return themeFromTitle;

    const unitNumber = getVocabUnitNumberFromActivity(activity);
    if (!unitNumber) return null;

    return VOCAB_THEME_BY_UNIT_NUMBER[unitNumber] ?? null;
};

export const cleanVocabTerm = (value: string): string => {
    return value
        .replace(/^[\s"'`“”‘’]+|[\s"'`“”‘’]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

export const dedupeVocabTerms = (terms: string[]): string[] => {
    const seen = new Set<string>();
    const uniqueTerms: string[] = [];

    for (const rawTerm of terms) {
        const normalizedTerm = cleanVocabTerm(rawTerm);
        if (!normalizedTerm) continue;

        const key = normalizedTerm.toLowerCase();
        if (seen.has(key)) continue;

        seen.add(key);
        uniqueTerms.push(normalizedTerm);
    }

    return uniqueTerms;
};

export const extractTermsFromCards = (cards: unknown): string[] => {
    if (!Array.isArray(cards)) return [];
    return cards
        .map((card) => {
            if (!card || typeof card !== 'object') return null;
            const term = (card as { term?: unknown }).term;
            return typeof term === 'string' ? term : null;
        })
        .filter((term): term is string => Boolean(term));
};

export const extractTermsFromPairs = (pairs: unknown): string[] => {
    if (!Array.isArray(pairs)) return [];
    return pairs
        .map((pair) => {
            if (!pair || typeof pair !== 'object') return null;
            const term = (pair as { term?: unknown }).term;
            return typeof term === 'string' ? term : null;
        })
        .filter((term): term is string => Boolean(term));
};

export const extractTermsFromWordArray = (words: unknown): string[] => {
    if (!Array.isArray(words)) return [];
    return words
        .map((word) => {
            if (typeof word === 'string') return word;
            if (!word || typeof word !== 'object') return null;
            const term = (word as { term?: unknown; word?: unknown }).term ?? (word as { word?: unknown }).word;
            return typeof term === 'string' ? term : null;
        })
        .filter((term): term is string => Boolean(term));
};

export const extractTermsFromFillInBlank = (fillInBlank: unknown): string[] => {
    if (!fillInBlank || typeof fillInBlank !== 'object') return [];
    const sentences = (fillInBlank as { sentences?: unknown }).sentences;
    if (!Array.isArray(sentences)) return [];

    const terms: string[] = [];
    for (const sentence of sentences) {
        if (!sentence || typeof sentence !== 'object') continue;
        const blanks = (sentence as { blanks?: unknown }).blanks;
        if (Array.isArray(blanks)) {
            for (const blank of blanks) {
                if (typeof blank === 'string') terms.push(blank);
            }
        }
        const answers = (sentence as { correctAnswers?: unknown }).correctAnswers;
        if (Array.isArray(answers)) {
            for (const answer of answers) {
                if (typeof answer === 'string') terms.push(answer);
            }
        }
    }

    return terms;
};

export const extractVocabTermsFromJsonContent = (content: string): string[] => {
    try {
        const parsed = JSON.parse(content) as unknown;
        if (!parsed || typeof parsed !== 'object') return [];

        const obj = parsed as {
            cards?: unknown;
            pairs?: unknown;
            words?: unknown;
            wordList?: { cards?: unknown };
            flashcards?: { cards?: unknown };
            matching?: { pairs?: unknown };
            fillInBlank?: unknown;
        };

        const orderedTerms = [
            ...extractTermsFromCards(obj.cards),
            ...extractTermsFromCards(obj.wordList?.cards),
            ...extractTermsFromCards(obj.flashcards?.cards),
            ...extractTermsFromPairs(obj.pairs),
            ...extractTermsFromPairs(obj.matching?.pairs),
            ...extractTermsFromWordArray(obj.words),
            ...extractTermsFromFillInBlank(obj.fillInBlank),
        ];

        return dedupeVocabTerms(orderedTerms);
    } catch {
        return [];
    }
};

export const extractVocabTermsFromPlainTextContent = (content: string): string[] => {
    const lines = content.split(/\r?\n/);
    const terms: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const numberedDash = trimmed.match(/^\d+\)\s*(.+?)(?:\s*\([^)]+\))?\s*[—-]\s+/u);
        if (numberedDash?.[1]) {
            terms.push(numberedDash[1]);
            continue;
        }

        // Match "term :: definition" but avoid swallowing JSON/object prefixes.
        const matchPair = trimmed.match(/^([A-Za-z][A-Za-z\s'-]{0,60})\s*::\s+.+$/u);
        if (matchPair?.[1]) {
            terms.push(matchPair[1]);
            continue;
        }

        const answerLine = trimmed.match(/^A:\s*(.+)$/iu);
        if (answerLine?.[1]) {
            terms.push(answerLine[1]);
        }
    }

    return dedupeVocabTerms(terms);
};

export const extractVocabTermsFromJsonRawFields = (content: string): string[] => {
    try {
        const parsed = JSON.parse(content) as unknown;
        if (!parsed || typeof parsed !== 'object') return [];

        const obj = parsed as {
            raw?: unknown;
            wordList?: { raw?: unknown };
            flashcards?: { raw?: unknown };
            matching?: { raw?: unknown };
            fillInBlank?: { raw?: unknown };
        };

        const rawFields: unknown[] = [
            obj.raw,
            obj.wordList?.raw,
            obj.flashcards?.raw,
            obj.matching?.raw,
            obj.fillInBlank?.raw,
        ];

        const rawTerms = rawFields.flatMap((rawValue) => {
            if (typeof rawValue !== 'string') return [];
            return extractVocabTermsFromPlainTextContent(rawValue);
        });

        return dedupeVocabTerms(rawTerms);
    } catch {
        return [];
    }
};

export const extractVocabTermsFromDescription = (description: string | null): string[] => {
    if (!description) return [];

    // Common monthly/weekly seed format: "Unit X vocabulary: topic. word1, word2, word3"
    const vocabListMatch = description.match(/vocabulary:\s*[^.]*\.\s*(.+)$/i);
    const listText = vocabListMatch?.[1] ?? '';
    if (!listText) return [];

    const terms = listText
        .split(',')
        .map((part) => cleanVocabTerm(part))
        .filter(Boolean);

    return dedupeVocabTerms(terms);
};

export const getVocabWordsChip = (activity: Activity): string | null => {
    const isVocabActivity = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary';
    if (!isVocabActivity) return null;

    const content = activity.content || '';
    const jsonTerms = extractVocabTermsFromJsonContent(content);
    const jsonRawTerms = jsonTerms.length ? [] : extractVocabTermsFromJsonRawFields(content);
    const textTerms = jsonTerms.length || jsonRawTerms.length ? [] : extractVocabTermsFromPlainTextContent(content);
    const descriptionTerms = jsonTerms.length || jsonRawTerms.length || textTerms.length
        ? []
        : extractVocabTermsFromDescription(activity.description);

    const terms = jsonTerms.length
        ? jsonTerms
        : jsonRawTerms.length
            ? jsonRawTerms
            : textTerms.length
                ? textTerms
                : descriptionTerms;
    if (!terms.length) return null;

    return terms.slice(0, 3).join(', ');
};

export const getVerbQuizWordsChip = (activity: Activity): string | null => {
    const isQuizActivity = activity.type === 'quiz' || activity.category?.toLowerCase() === 'quizzes';
    if (!isQuizActivity || !activity.content) return null;

    try {
        const parsed = JSON.parse(activity.content) as unknown;
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

        const obj = parsed as {
            type?: unknown;
            verbs?: unknown;
        };

        const isVerbQuizType = obj.type === 'verb-quiz';
        const isVerbQuizTitle = /\bverb\s+quiz\b/i.test(activity.title ?? '');
        if (!isVerbQuizType && !isVerbQuizTitle) return null;

        const verbsObj = obj.verbs;
        if (!verbsObj || typeof verbsObj !== 'object' || Array.isArray(verbsObj)) return null;

        const keyTerms = Object.keys(verbsObj)
            .map((verb) => cleanVocabTerm(verb))
            .filter(Boolean);

        const valueTerms = Object.values(verbsObj as Record<string, unknown>)
            .map((entry) => {
                if (!entry || typeof entry !== 'object') return null;
                const v1 = (entry as { v1?: unknown }).v1;
                return typeof v1 === 'string' ? cleanVocabTerm(v1) : null;
            })
            .filter((verb): verb is string => Boolean(verb));

        const terms = dedupeVocabTerms(keyTerms.length ? keyTerms : valueTerms);
        if (!terms.length) return null;

        return terms.join(', ');
    } catch {
        return null;
    }
};

export const getActivityCardTitle = (activity: Activity): string => {
    const normalizedTitle = displayTitle(activity.title);
    const isVocabActivity = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary';
    if (!isVocabActivity) return normalizedTitle;

    return normalizedTitle;
};

export interface GrammarChipCopy {
    pattern: RegExp;
    friendlyTitle: string;
    useThisFor: string;
}

export const GRAMMAR_CHIP_COPY: GrammarChipCopy[] = [
    { pattern: /\bpresent perfect continuous\b/i, friendlyTitle: 'Talk about duration until now', useThisFor: 'showing ongoing actions up to the present' },
    { pattern: /\bpast perfect continuous\b/i, friendlyTitle: 'Talk about duration before a past event', useThisFor: 'showing how long something happened before another past action' },
    { pattern: /\bfuture perfect continuous\b/i, friendlyTitle: 'Talk about duration until a future time', useThisFor: 'showing ongoing duration up to a future point' },
    { pattern: /\bperfect continuous\b.*\breview\b/i, friendlyTitle: 'Review duration-focused tenses', useThisFor: 'comparing duration-focused tense choices' },
    { pattern: /\bpresent perfect\b/i, friendlyTitle: 'Connect past actions to now', useThisFor: 'life experience and recent results' },
    { pattern: /\bpast perfect\b/i, friendlyTitle: 'Show which past action happened first', useThisFor: 'ordering two past actions clearly' },
    { pattern: /\bfuture perfect\b/i, friendlyTitle: 'Talk about deadlines and completion', useThisFor: 'what will be finished before a future time' },
    { pattern: /\bperfect tenses\b.*\breview\b/i, friendlyTitle: 'Review perfect tenses', useThisFor: 'choosing the right perfect tense by timeline' },
    { pattern: /\bpresent continuous\b/i, friendlyTitle: 'Talk about actions happening now', useThisFor: 'describing actions in progress right now' },
    { pattern: /\bpast continuous\b/i, friendlyTitle: 'Describe actions in progress in the past', useThisFor: 'background actions at a past moment' },
    { pattern: /\bfuture continuous\b/i, friendlyTitle: 'Describe actions in progress in the future', useThisFor: 'actions that will be in progress later' },
    { pattern: /\bcontinuous tenses\b.*\breview\b/i, friendlyTitle: 'Review actions in progress across time', useThisFor: 'comparing present, past, and future continuous' },
    { pattern: /\bpresent simple\b/i, friendlyTitle: 'Talk about daily routines', useThisFor: 'habits, routines, and general facts' },
    { pattern: /\bpast simple\b/i, friendlyTitle: 'Talk about finished past events', useThisFor: 'completed actions in the past' },
    { pattern: /\bfuture simple\b/i, friendlyTitle: 'Talk about future plans', useThisFor: 'plans, predictions, and decisions' },
    { pattern: /\bsimple tenses\b.*\breview\b/i, friendlyTitle: 'Review simple past, present, and future', useThisFor: 'switching between basic time frames' },
    { pattern: /\bsimple\s*&\s*continuous tenses\b.*\breview\b/i, friendlyTitle: 'Review simple and continuous choices', useThisFor: 'choosing between habits and in-progress actions' },
    { pattern: /\ball verb tenses overview\b/i, friendlyTitle: 'Master all verb tenses', useThisFor: 'final tense review in real communication' },
    { pattern: /\bzero\s*&\s*first conditional/i, friendlyTitle: 'Talk about real situations and results', useThisFor: 'real conditions and likely outcomes' },
    { pattern: /\bsecond\s*&\s*third conditional/i, friendlyTitle: 'Talk about unreal and past hypotheticals', useThisFor: 'imaginary situations and regrets' },
    { pattern: /\bmodals?\b/i, friendlyTitle: 'Give rules, advice, and permission', useThisFor: 'must, should, can, and may in daily life' },
    { pattern: /\binformation questions?\b/i, friendlyTitle: 'Ask clear information questions', useThisFor: 'building accurate WH-questions' },
    { pattern: /\bimperatives?\b|\bdeclaratives?\b/i, friendlyTitle: 'Give instructions and statements', useThisFor: 'commands, advice, and clear statements' },
    { pattern: /\bparts of speech\b/i, friendlyTitle: 'Build stronger sentences', useThisFor: 'understanding nouns, verbs, adjectives, and adverbs' },
    { pattern: /\barticles?\b/i, friendlyTitle: 'Use a, an, and the correctly', useThisFor: 'choosing the right article in context' },
    { pattern: /\bprepositions? of time\s*&\s*place\b/i, friendlyTitle: 'Use prepositions for time and place', useThisFor: 'at, on, in, and location/time phrases' },
    { pattern: /\bgerunds?\b|\binfinitives?\b/i, friendlyTitle: 'Choose gerunds or infinitives', useThisFor: 'verb pattern accuracy after common verbs' },
    { pattern: /\bpassive voice\b/i, friendlyTitle: 'Focus on actions and results', useThisFor: 'when the doer is unknown or less important' },
    { pattern: /\breported speech\b/i, friendlyTitle: 'Report what someone said', useThisFor: 'sharing speech with correct tense changes' },
    { pattern: /\bworkplace phrasal verbs\b/i, friendlyTitle: 'Use common workplace verb phrases', useThisFor: 'everyday work communication' },
    { pattern: /\bsuperlatives?\b|\bquantifiers?\b/i, friendlyTitle: 'Compare things and describe quantity', useThisFor: 'more/most and amount words' },
    { pattern: /\bpunctuation\b|\bcapitalization\b/i, friendlyTitle: 'Improve punctuation and capitalization', useThisFor: 'clearer and more correct writing' },
    { pattern: /\bparagraph format\b/i, friendlyTitle: 'Write clear, organized paragraphs', useThisFor: 'building topic, support, and conclusion' },
    { pattern: /\bused to\b|\bwould rather\b/i, friendlyTitle: 'Talk about past habits and preferences', useThisFor: 'describing old habits and current preferences' },
];

export const getGrammarChipCopy = (title: string): { friendlyTitle: string; useThisFor: string } => {
    const normalizedTitle = displayTitle(title).replace(/\s*guide\s*$/i, '').trim();
    const match = GRAMMAR_CHIP_COPY.find(({ pattern }) => pattern.test(normalizedTitle));
    if (match) {
        return {
            friendlyTitle: match.friendlyTitle,
            useThisFor: match.useThisFor,
        };
    }
    return {
        friendlyTitle: 'Practice grammar in context',
        useThisFor: 'clearer speaking and writing',
    };
};

export const capitalizeFirstLetter = (value: string): string =>
    value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

export const parseTitleDateMs = (title?: string | null) => {
    if (!title) return null;
    const match = title.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})\s*:/);
    if (!match) return null;
    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = 2000 + Number(match[3]);
    const dt = new Date(year, month - 1, day);
    if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return null;
    return dt.getTime();
};

export const _compareByTitleDateDesc = (a: Activity, b: Activity) => {
    const aDate = parseTitleDateMs(a.title);
    const bDate = parseTitleDateMs(b.title);
    if (aDate !== null && bDate !== null) return bDate - aDate;
    if (aDate !== null) return -1;
    if (bDate !== null) return 1;
    return (b.title || '').localeCompare(a.title || '');
};

export const getSubCategoryCount = (subCategory: SubCategory) => {
    const directCount = subCategory.activities?.length || 0;
    const nestedCount = subCategory.subCategories
        ? subCategory.subCategories.reduce((sum, sub) => sum + (sub.activities?.length || 0), 0)
        : 0;
    return directCount + nestedCount;
};

export const getCategoryCount = (category: Category) => {
    const directCount = category.activities?.length || 0;
    const nestedCount = category.subCategories
        ? category.subCategories.reduce((sum, sub) => sum + getSubCategoryCount(sub), 0)
        : 0;
    return directCount + nestedCount;
};

export const getProgress = (id: string, progressMap?: Record<string, { progress: number; categoryData?: string }>) => {
    const data = progressMap?.[id];
    return data?.progress ?? 0;
};

export const isPronunciationPracticeActivity = (activity: Activity) => {
    if (activity.category === 'pronunciation') return true;
    if (activity.type !== 'game') return false;
    const gameUi = resolveActivityGameUi(activity);
    return gameUi === 'ed-pronunciation' || gameUi === 'minimal-pairs';
};

export const getDisplayProgress = (
    activity: Activity,
    progressMap?: Record<string, { progress: number; categoryData?: string }>
) => {
    if (isPronunciationPracticeActivity(activity)) return 0;
    return getProgress(activity.id, progressMap);
};

export const isActivityCompleted = (
    activity: Activity,
    completedActivityIds: Set<string>,
    progressMap?: Record<string, { progress: number; categoryData?: string }>
) => {
    if (activity.type === "game") return false;
    if (isPronunciationPracticeActivity(activity)) return false;
    const progressValue = getDisplayProgress(activity, progressMap);
    return completedActivityIds.has(activity.id) || progressValue >= 100;
};
