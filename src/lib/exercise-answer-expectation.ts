import type { Exercise, ExerciseItem } from "@/types/activity";

export type ExerciseAnswerExpectation = "missing-words" | "full-sentence";

const BLANK_MARKER_REGEX = /_{2,}|\(\s*[^()]{1,40}\s*\)|\bblank\b/i;
const FULL_SENTENCE_INSTRUCTION_REGEX =
    /\b(rewrite|write the corrected version|write the correct version|write the corrected sentence|write the correct sentence|change each sentence|combine the two actions|put the words in the correct order|write complete sentences|write a complete sentence|write full sentences|write a full sentence)\b/i;
const FULL_SENTENCE_LABEL_REGEX = /^(make negative|make affirmative|make a question|rewrite|correct|change)/i;
const MISSING_WORD_INSTRUCTION_REGEX =
    /\b(write only the verb|write only|type only the missing|fill in (?:the )?blank|fill in (?:the )?blanks|complete the conjugation chart|complete this conjugation chart)\b/i;

function getTextItems(exercise: Exercise): Array<Extract<ExerciseItem, { type: "text" }>> {
    return exercise.items.filter((item): item is Extract<ExerciseItem, { type: "text" }> => {
        return item.type === "text";
    });
}

export function getExerciseAnswerExpectation(exercise: Exercise): ExerciseAnswerExpectation | null {
    if (exercise.answerExpectation) {
        return exercise.answerExpectation;
    }

    const textItems = getTextItems(exercise);
    if (textItems.length === 0) {
        return null;
    }

    const exerciseText = `${exercise.title} ${exercise.instructions ?? ""}`.toLowerCase();

    if (FULL_SENTENCE_INSTRUCTION_REGEX.test(exerciseText)) {
        return "full-sentence";
    }

    if (MISSING_WORD_INSTRUCTION_REGEX.test(exerciseText)) {
        return "missing-words";
    }

    const allHaveBlankMarkers = textItems.every((item) => BLANK_MARKER_REGEX.test(item.label));
    const hasAnyBlankMarker = textItems.some((item) => BLANK_MARKER_REGEX.test(item.label));
    const hasFullSentenceLabelCue = textItems.some((item) => {
        const normalizedLabel = item.label.trim();
        return FULL_SENTENCE_LABEL_REGEX.test(normalizedLabel) && !BLANK_MARKER_REGEX.test(normalizedLabel);
    });

    if (hasFullSentenceLabelCue) {
        return "full-sentence";
    }

    if (allHaveBlankMarkers) {
        return "missing-words";
    }

    if (!hasAnyBlankMarker) {
        return "full-sentence";
    }

    return null;
}

export function getExerciseAnswerExpectationMessage(
    expectation: ExerciseAnswerExpectation | null
): string | null {
    if (expectation === "missing-words") {
        return "Type only the missing word(s). Do not write the full sentence.";
    }

    if (expectation === "full-sentence") {
        return "Write the full sentence.";
    }

    return null;
}

export function getExerciseDefaultPlaceholder(
    expectation: ExerciseAnswerExpectation | null
): string | undefined {
    if (expectation === "missing-words") {
        return "Type only the missing word(s)";
    }

    if (expectation === "full-sentence") {
        return "Write the full sentence";
    }

    return undefined;
}
