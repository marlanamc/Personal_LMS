'use client';

/**
 * @deprecated This function has been deprecated due to overly broad regex matching.
 * It incorrectly highlights non-verbs and fails to identify correct verbs in complex constructions.
 * Use emphasizeExampleByFormula() instead when you have FormulaPart[] data.
 * This file is kept for reference only - do not use in new code.
 */

const SKIP_WORDS = new Set([
    "i", "you", "we", "they", "he", "she", "it",
    "a", "an", "the", "my", "your", "our", "their", "his", "her", "its",
]);

const VERB_PATTERN = /\b([A-Za-z']+)\b/g;
const VERB_CANDIDATE = /^(am|is|are|was|were|be|being|been|do|does|did|has|have|had|will|would|can|could|should|may|might|must|[A-Za-z]+(?:s|es|ed|ing)?)$/i;

export function emphasizeVerb(text: string): string {
    if (!text) return "";
    if (/<strong>/i.test(text)) return text;

    for (const match of text.matchAll(VERB_PATTERN)) {
        const word = match[1];
        if (SKIP_WORDS.has(word.toLowerCase())) continue;
        if (!VERB_CANDIDATE.test(word)) continue;

        const start = match.index ?? 0;
        const end = start + word.length;
        return text.slice(0, start) + `<strong>${word}</strong>` + text.slice(end);
    }

    return text;
}


