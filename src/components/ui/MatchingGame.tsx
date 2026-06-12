"use client";

import type { Props } from "./matching-game/shared";
import { detectMatchingGameMode, parseVocabPairs } from "./matching-game/parsers";
import { CountableMatchingUI } from "./matching-game/CountableMatchingUI";
import { VocabMatchingUI } from "./matching-game/VocabMatchingUI";
import { TimeIndicatorSortingUI } from "./matching-game/TimeIndicatorSortingUI";
import { VerbSoundsRightSortingUI } from "./matching-game/VerbSoundsRightSortingUI";

export default function MatchingGame({ contentStr, activityId, assignmentId, vocabType }: Props) {
    const gameMode = detectMatchingGameMode(contentStr);
    const vocabPairs = gameMode === "vocab" ? parseVocabPairs(contentStr) : [];

    // Time Indicators sorting game
    if (gameMode === "time-indicators") {
        return (
            <TimeIndicatorSortingUI
                contentStr={contentStr}
                activityId={activityId}
                assignmentId={assignmentId}
                vocabType={vocabType}
            />
        );
    }

    // Verb Sounds Right sorting game
    if (gameMode === "verb-sounds-right") {
        return (
            <VerbSoundsRightSortingUI
                contentStr={contentStr}
                activityId={activityId}
                assignmentId={assignmentId}
                vocabType={vocabType}
            />
        );
    }

    if (gameMode === "vocab") {
        if (vocabPairs.length > 0) {
            return (
                <VocabMatchingUI
                    pairs={vocabPairs}
                    activityId={activityId}
                    assignmentId={assignmentId}
                    vocabType={vocabType}
                />
            );
        }
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <p className="text-text-muted">No vocabulary pairs to match.</p>
            </div>
        );
    }

    // Countable/Uncountable game - delegate to separate component to avoid hooks-after-return
    return (
        <CountableMatchingUI
            contentStr={contentStr}
            activityId={activityId}
            assignmentId={assignmentId}
            vocabType={vocabType}
        />
    );
}
