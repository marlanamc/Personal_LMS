import type { QuestionResponse } from "@/types/activity";

export interface AggregatedSkillStat {
    skillTag: string;
    attempts: number;
    correct: number;
    percentCorrect: number;
    lastAttemptDate?: string;
    communicativeGoalTag?: string | null;
    failureReasonTag?: string | null;
    improvedAfterSupportCount?: number;
}

function asString(value: unknown): string | null {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asBoolean(value: unknown): boolean | null {
    return typeof value === "boolean" ? value : null;
}

export function parseResponsesFromSubmissionContent(content: string): QuestionResponse[] {
    try {
        const parsed = JSON.parse(content) as { responses?: unknown };
        if (!Array.isArray(parsed.responses)) return [];

        const results: QuestionResponse[] = [];
        for (const item of parsed.responses) {
            if (!item || typeof item !== "object") continue;
            const candidate = item as Record<string, unknown>;
            const questionId = asString(candidate.questionId);
            const userAnswer = asString(candidate.userAnswer) ?? "";
            const isCorrect = asBoolean(candidate.isCorrect);
            if (!questionId || isCorrect === null) continue;

            results.push({
                    questionId,
                    userAnswer,
                    isCorrect,
                    skillTag: asString(candidate.skillTag) ?? undefined,
                    communicativeGoalTag: asString(candidate.communicativeGoalTag) ?? undefined,
                    failureReasonTag: asString(candidate.failureReasonTag) ?? undefined,
                    improvedAfterSupport: asBoolean(candidate.improvedAfterSupport) ?? undefined,
                    difficulty: asString(candidate.difficulty) ?? undefined,
                    topic: asString(candidate.topic) ?? undefined,
                });
        }

        return results;
    } catch {
        return [];
    }
}

export function aggregateResponsesBySkill(
    responses: Array<{ response: QuestionResponse; completedAt?: Date | null }>,
    difficulty?: string | null
): AggregatedSkillStat[] {
    const map = new Map<string, AggregatedSkillStat>();

    for (const { response, completedAt } of responses) {
        if (difficulty && response.difficulty && response.difficulty !== difficulty) continue;

        const key =
            response.skillTag ??
            response.failureReasonTag ??
            response.communicativeGoalTag ??
            null;
        if (!key) continue;

        const existing = map.get(key) ?? {
            skillTag: key,
            attempts: 0,
            correct: 0,
            percentCorrect: 0,
            communicativeGoalTag: response.communicativeGoalTag ?? null,
            failureReasonTag: response.failureReasonTag ?? null,
            improvedAfterSupportCount: 0,
            lastAttemptDate: undefined,
        };

        existing.attempts += 1;
        if (response.isCorrect) existing.correct += 1;
        if (response.improvedAfterSupport) {
            existing.improvedAfterSupportCount = (existing.improvedAfterSupportCount ?? 0) + 1;
        }
        if (completedAt) {
            const stamp = completedAt.toISOString();
            if (!existing.lastAttemptDate || stamp > existing.lastAttemptDate) {
                existing.lastAttemptDate = stamp;
            }
        }

        map.set(key, existing);
    }

    return Array.from(map.values())
        .map((stat) => ({
            ...stat,
            percentCorrect:
                stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 0,
        }))
        .sort((a, b) => a.percentCorrect - b.percentCorrect);
}
