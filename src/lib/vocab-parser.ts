/**
 * Vocabulary parsing utilities extracted from ActivityRenderer
 * Used by both ActivityRenderer and VocabularyRenderer
 */

export interface FlashcardData {
    id: string;
    term: string;
    definition: string;
    example?: string;
}

export function parsePlainVocabulary(contentStr: string): Array<{
    term: string;
    pos?: string;
    definition: string;
    example?: string;
}> {
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

export function parseFlashcards(contentStr: string): Array<FlashcardData> {
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
                example: example ? clean(example) : undefined,
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
                example: example ? clean(example) : undefined,
            });
        }
    }
    return cards;
}
