import { CountableWord, Round, VocabPair, TimeIndicatorWord, TimeIndicatorRound, VerbSoundsRightItem, VerbSoundsRightRound, VERB_TENSE_HINTS, normalizeVerbOption, isSupportedVerbTense } from "./shared";

export function detectMatchingGameMode(content: string): "vocab" | "countable" | "time-indicators" | "verb-sounds-right" {
    // Match [ROUND 1], [ROUND 2 - Title], etc.
    const hasRoundMarkers = /\[ROUND\s*\d+/.test(content);
    const lines = content.split("\n");
    let hasCountableUncountableLine = false;
    let hasTimeIndicatorLine = false;
    let hasVerbSoundsRightLine = false;

    // Check for game mode indicators
    for (const line of lines) {
        if (!line.includes("::")) continue;
        const parts = line.split("::").map((s) => s.trim());
        const first = parts[0] ?? "";
        const afterColon = parts[1] ?? "";
        const lower = afterColon.toLowerCase();
        if (lower.startsWith("countable") || lower.startsWith("uncountable")) {
            hasCountableUncountableLine = true;
        }
        if (lower.startsWith("specified") || lower.startsWith("unspecified")) {
            hasTimeIndicatorLine = true;
        }
        // Verb sounds right: sentence with _____ and at least 3 parts (sentence :: correct :: wrong)
        if (first.includes("_____") && parts.length >= 3 && !lower.startsWith("countable") && !lower.startsWith("uncountable") && !lower.startsWith("specified") && !lower.startsWith("unspecified")) {
            hasVerbSoundsRightLine = true;
        }
    }

    if (hasRoundMarkers && hasVerbSoundsRightLine) return "verb-sounds-right";
    if (hasRoundMarkers && hasTimeIndicatorLine) return "time-indicators";
    if (hasRoundMarkers && hasCountableUncountableLine) return "countable";
    return "vocab";
}

export function parseVocabPairs(content: string): VocabPair[] {
    // Try to parse as JSON first (for consolidated vocab activities)
    try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object' && 'pairs' in parsed && Array.isArray(parsed.pairs)) {
            const pairs = parsed.pairs as Array<{ id?: number; term?: string; definition?: string }>;
            return pairs
                .filter((p) => p && p.term && p.definition)
                .map((p, index) => ({
                    id: p?.id ?? index + 1,
                    term: String(p.term).trim(),
                    definition: String(p.definition).trim()
                }));
        }
    } catch {
        // Not JSON, fall through to plain text parsing
    }

    // Plain text parsing (legacy format)
    const pairs: VocabPair[] = [];
    let id = 1;
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    for (const line of lines) {
        let term = "";
        let definition = "";

        // Support "Term::Definition" format
        if (line.includes("::")) {
            const idx = line.indexOf("::");
            term = line.slice(0, idx).trim();
            definition = line.slice(idx + 2).trim();
        }
        // Support "1) Term — Definition" or "Term — Definition" format (em-dash)
        else if (line.includes("—")) {
            // Remove optional numbering like "1) "
            const cleanLine = line.replace(/^\d+\)\s*/, "");
            const parts = cleanLine.split("—");
            if (parts.length >= 2) {
                term = parts[0].trim();
                definition = parts.slice(1).join("—").trim(); // Rejoin in case def has dash
            }
        }
        // Support "1) Term - Definition" format (hyphen)
        else if (line.match(/^\d+\)\s*.+\s+-\s+.+$/)) {
             const cleanLine = line.replace(/^\d+\)\s*/, "");
             const firstDash = cleanLine.indexOf("-");
             if (firstDash > 0) {
                 term = cleanLine.substring(0, firstDash).trim();
                 definition = cleanLine.substring(firstDash + 1).trim();
             }
        }

        if (!term || !definition) continue;

        // Skip special countable definitions
        const lower = definition.toLowerCase();
        if (lower.startsWith("countable") || lower.startsWith("uncountable")) continue;

        // Remove Part of Speech from term if present e.g. "Term (noun)"
        term = term.replace(/\s*\([^)]+\)$/, "").trim();

        pairs.push({ id: id++, term, definition });
    }
    return pairs;
}

// Helper function: Parse rounds from content (countable/uncountable format only)
export function parseRounds(content: string): Round[] {
    const rounds: Round[] = [];
    const roundBlocks = content.split(/\[ROUND \d+\]/).filter((b) => b.trim());

    let roundNumber = 1;
    let globalId = 1;

    for (const block of roundBlocks) {
        const words: CountableWord[] = [];
        const lines = block.trim().split("\n").filter((l) => l.trim());

        for (const line of lines) {
            if (line.includes("::")) {
                const [word, definition] = line.split("::").map((s) => s.trim());
                if (!word || !definition) continue;

                // Determine category from definition start
                const isCountable =
                    definition.toLowerCase().startsWith("countable");
                const category = isCountable ? "countable" : "uncountable";

                // Extract explanation (everything after "Countable - " or "Uncountable - ")
                const explanationMatch = definition.match(
                    /(?:Countable|Uncountable)\s*-\s*(.+)/i
                );
                const explanation = explanationMatch
                    ? explanationMatch[1]
                    : definition;

                words.push({
                    id: globalId++,
                    word,
                    category,
                    explanation,
                });
            }
        }

        if (words.length > 0) {
            rounds.push({
                roundNumber,
                words,
            });
            roundNumber++;
        }
    }

    return rounds;
}

// Helper function: Parse rounds from content (verb-sounds-right format)
// Single-blank format: sentence :: correctWord :: wrongWord :: tense :: explanation
// Two-blank format: sentence :: correct1 :: wrong1 :: tense1 :: explain1 :: correct2 :: wrong2 :: tense2 :: explain2
// Legacy two-blank format (still supported): sentence :: correct1 :: wrong1 :: correct2 :: wrong2 :: tense1 :: tense2 :: explanation
export function parseVerbSoundsRightRounds(content: string): VerbSoundsRightRound[] {
    const rounds: VerbSoundsRightRound[] = [];
    const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*[^\]]+)?\]/).filter((b) => b.trim());

    let roundNumber = 1;
    let globalId = 1;

    for (const block of roundBlocks) {
        const items: VerbSoundsRightItem[] = [];
        const lines = block.trim().split("\n").filter((l) => l.trim());

        for (const line of lines) {
            if (!line.includes("_____") || !line.includes("::")) continue;
            const parts = line.split("::").map((s) => s.trim());
            if (parts.length < 3) continue;

            const sentence = parts[0];
            const blankCount = (sentence.match(/_____/g) || []).length;

            if (blankCount === 1) {
                // Single-blank: sentence :: correct :: wrong :: tense :: explanation
                const correctWord = parts[1];
                const wrongWord = parts[2];
                const tense = parts[3] ?? "";
                const explanation = parts[4] ?? "";
                if (!correctWord || !wrongWord) continue;
                if (normalizeVerbOption(correctWord) === normalizeVerbOption(wrongWord)) continue;

                items.push({
                    id: globalId++,
                    sentence,
                    blanks: [{
                        correctWord,
                        wrongWord,
                        tense: tense && VERB_TENSE_HINTS[tense] ? tense : undefined,
                        explanation,
                    }],
                });
            } else if (blankCount === 2 && parts.length >= 7) {
                let correct1 = "";
                let wrong1 = "";
                let tense1 = "";
                let explain1 = "";
                let correct2 = "";
                let wrong2 = "";
                let tense2 = "";
                let explain2 = "";

                if (parts.length >= 9) {
                    // Canonical two-blank format
                    correct1 = parts[1] ?? "";
                    wrong1 = parts[2] ?? "";
                    tense1 = parts[3] ?? "";
                    explain1 = parts[4] ?? "";
                    correct2 = parts[5] ?? "";
                    wrong2 = parts[6] ?? "";
                    tense2 = parts[7] ?? "";
                    explain2 = parts[8] ?? "";
                } else if (parts.length >= 8 && !isSupportedVerbTense(parts[3]) && isSupportedVerbTense(parts[5])) {
                    // Legacy compact format with one shared explanation
                    correct1 = parts[1] ?? "";
                    wrong1 = parts[2] ?? "";
                    correct2 = parts[3] ?? "";
                    wrong2 = parts[4] ?? "";
                    tense1 = parts[5] ?? "";
                    tense2 = parts[6] ?? "";
                    explain1 = parts[7] ?? "";
                    explain2 = parts[7] ?? "";
                } else {
                    // Fallback for shorter canonical rows
                    correct1 = parts[1] ?? "";
                    wrong1 = parts[2] ?? "";
                    tense1 = parts[3] ?? "";
                    explain1 = parts[4] ?? "";
                    correct2 = parts[5] ?? "";
                    wrong2 = parts[6] ?? "";
                    tense2 = parts[7] ?? "";
                    explain2 = parts[8] ?? "";
                }

                if (!correct1 || !wrong1 || !correct2 || !wrong2) continue;
                if (normalizeVerbOption(correct1) === normalizeVerbOption(wrong1)) continue;
                if (normalizeVerbOption(correct2) === normalizeVerbOption(wrong2)) continue;

                items.push({
                    id: globalId++,
                    sentence,
                    blanks: [
                        {
                            correctWord: correct1,
                            wrongWord: wrong1,
                            tense: tense1 && VERB_TENSE_HINTS[tense1] ? tense1 : undefined,
                            explanation: explain1,
                        },
                        {
                            correctWord: correct2,
                            wrongWord: wrong2,
                            tense: tense2 && VERB_TENSE_HINTS[tense2] ? tense2 : undefined,
                            explanation: explain2,
                        },
                    ],
                });
            }
        }

        if (items.length > 0) {
            rounds.push({ roundNumber, items });
            roundNumber++;
        }
    }

    return rounds;
}

// Helper function: Parse rounds from content (time-indicators format)
export function parseTimeIndicatorRounds(content: string): TimeIndicatorRound[] {
    const rounds: TimeIndicatorRound[] = [];
    // Split on [ROUND n] or [ROUND n - DIFFICULTY] patterns
    const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*\w+)?\]/).filter((b) => b.trim());

    let roundNumber = 1;
    let globalId = 1;

    for (const block of roundBlocks) {
        const words: TimeIndicatorWord[] = [];
        const lines = block.trim().split("\n").filter((l) => l.trim());

        // Derive difficulty from round number (1-2: easy, 3-4: medium, 5-6: hard)
        const difficulty: "easy" | "medium" | "hard" =
            roundNumber <= 2 ? "easy" : roundNumber <= 4 ? "medium" : "hard";

        for (const line of lines) {
            if (line.includes("::")) {
                const [word, definition] = line.split("::").map((s) => s.trim());
                if (!word || !definition) continue;

                // Determine category from definition start
                const isSpecified = definition.toLowerCase().startsWith("specified");
                const category: "specified" | "unspecified" = isSpecified ? "specified" : "unspecified";

                // Extract explanation (everything after "Specified - " or "Unspecified - ")
                const explanationMatch = definition.match(
                    /(?:Specified|Unspecified)\s*-\s*(.+)/i
                );
                const explanation = explanationMatch ? explanationMatch[1] : definition;

                words.push({
                    id: globalId++,
                    word,
                    category,
                    explanation,
                });
            }
        }

        if (words.length > 0) {
            rounds.push({
                roundNumber,
                difficulty,
                words,
            });
            roundNumber++;
        }
    }

    return rounds;
}

// Helper function: Derive a stable shuffle seed per round
export function deriveShuffleSeed(roundNumber: number, activityId?: string): number {
    let seed = roundNumber;
    if (activityId) {
        for (let i = 0; i < activityId.length; i++) {
            seed = (seed * 31 + activityId.charCodeAt(i)) >>> 0;
        }
    }
    return seed;
}

// Helper function: Deterministically shuffle an array using a seed
export function deterministicShuffle<T>(arr: T[], seed: number): T[] {
    const shuffled = [...arr];
    let value = seed >>> 0;
    const random = () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 0x100000000;
    };

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    return shuffled;
}
