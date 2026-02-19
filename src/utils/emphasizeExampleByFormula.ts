'use client';

import type { FormulaPart } from "@/types/activity";

const WORD_RE = /[A-Za-z']+/g;

const SUBJECT_DETERMINERS = new Set([
    "a",
    "an",
    "the",
    "my",
    "your",
    "our",
    "their",
    "his",
    "her",
    "its",
    "this",
    "that",
    "these",
    "those",
]);

const SKIP_VERB_TARGET_WORDS = new Set([
    "a",
    "an",
    "the",
    "my",
    "your",
    "our",
    "their",
    "his",
    "her",
    "its",
]);

function escapeHtml(text: string): string {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function isHelperVerb(text: string, type?: FormulaPart["type"]) {
    if (type !== "verb") return false;
    return /\b(am|is|are|was|were|do|does|did|have|has|will|won't|shall|should|would|could|can|may|might|didn't|don't|doesn't|haven't|hasn't|won't)\b/i.test(
        text.trim()
    );
}

function extractHelperWords(parts: FormulaPart[]): Set<string> {
    const words = new Set<string>();
    for (const part of parts) {
        if (!isHelperVerb(part.text, part.type)) continue;
        const rawPieces = part.text
            .split(/[^\w']+/)
            .map(p => p.trim())
            .filter(Boolean);
        for (const piece of rawPieces) {
            words.add(piece.toLowerCase());
        }
    }

    if (words.has("have") || words.has("has")) {
        words.add("haven't");
        words.add("hasn't");
    }

    if (words.has("do") || words.has("does") || words.has("did")) {
        words.add("don't");
        words.add("doesn't");
        words.add("didn't");
    }

    return words;
}

type Span = { start: number; end: number; className: string };

function buildHighlightedHtml(text: string, spans: Span[]): string {
    const sorted = [...spans].sort((a, b) => a.start - b.start || a.end - b.end);
    const merged: Span[] = [];

    for (const span of sorted) {
        const last = merged.at(-1);
        if (!last || span.start >= last.end) {
            merged.push(span);
            continue;
        }
        // Overlap: keep the earlier span and drop the later one.
    }

    let out = "";
    let cursor = 0;

    for (const span of merged) {
        if (span.start < cursor) continue;
        out += escapeHtml(text.slice(cursor, span.start));
        out += `<span class="${span.className}">${escapeHtml(text.slice(span.start, span.end))}</span>`;
        cursor = span.end;
    }

    out += escapeHtml(text.slice(cursor));
    return out;
}

function getWordMatches(text: string) {
    const matches: Array<{ word: string; start: number; end: number }> = [];
    for (const match of text.matchAll(WORD_RE)) {
        const word = match[0];
        const start = match.index ?? 0;
        matches.push({ word, start, end: start + word.length });
    }
    return matches;
}

export function emphasizeExampleByFormula(text: string, parts?: FormulaPart[]): string {
    if (!text) return "";
    if (!parts || parts.length === 0) return escapeHtml(text);

    const helperWords = extractHelperWords(parts);
    if (helperWords.size === 0) return escapeHtml(text);

    const words = getWordMatches(text);
    if (words.length === 0) return escapeHtml(text);

    const subjectPartIndex = parts.findIndex(p => p.type === "subject");
    const helperPartIndex = parts.findIndex(p => isHelperVerb(p.text, p.type));
    const subjectBeforeHelper = subjectPartIndex !== -1 && helperPartIndex !== -1
        ? subjectPartIndex < helperPartIndex
        : true;

    const helperWordIndex = words.findIndex(w => helperWords.has(w.word.toLowerCase()));

    const spans: Span[] = [];
    let subjectEndWordIndexExclusive: number | null = null;

    // Helper(s): highlight every helper word occurrence.
    for (const w of words) {
        if (!helperWords.has(w.word.toLowerCase())) continue;
        spans.push({ start: w.start, end: w.end, className: "eg-helper" });
    }

    // Subject: either before helper (statement) or just after helper (question form).
    if (helperWordIndex !== -1) {
        if (subjectBeforeHelper) {
            const subjectStart = words[0].start;
            const subjectEnd = words[helperWordIndex].start;
            if (subjectEnd > subjectStart) {
                spans.push({ start: subjectStart, end: subjectEnd, className: "eg-subject" });
            }
        } else {
            const startIdx = helperWordIndex + 1;
            if (startIdx >= words.length) return buildHighlightedHtml(text, spans);

            // Usually the subject in question form is either one word (you/she)
            // or a short noun phrase ("the city", "my daughter").
            let endIdxExclusive = Math.min(words.length, startIdx + 1);
            const first = words[startIdx]?.word.toLowerCase();
            if (first && SUBJECT_DETERMINERS.has(first)) {
                endIdxExclusive = Math.min(words.length, startIdx + 2);
            }

            if (startIdx < endIdxExclusive) {
                subjectEndWordIndexExclusive = endIdxExclusive;
                spans.push({
                    start: words[startIdx].start,
                    end: words[endIdxExclusive - 1].end,
                    className: "eg-subject",
                });
            }
        }
    }

    // Main verb/past participle: first non-helper word after helper (skip "not").
    if (helperWordIndex !== -1) {
        let i = helperWordIndex + 1;
        while (i < words.length && words[i].word.toLowerCase() === "not") i++;

        // If subject appears after helper, skip the detected subject span.
        if (!subjectBeforeHelper && subjectEndWordIndexExclusive !== null) {
            i = Math.max(i, subjectEndWordIndexExclusive);
        }

        while (i < words.length && helperWords.has(words[i].word.toLowerCase())) i++;
        while (i < words.length && SKIP_VERB_TARGET_WORDS.has(words[i].word.toLowerCase())) i++;
        if (i < words.length) {
            spans.push({ start: words[i].start, end: words[i].end, className: "eg-verb" });
        }
    }

    return buildHighlightedHtml(text, spans);
}
