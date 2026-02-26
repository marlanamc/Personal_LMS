import type { Exercise, LegacyExercise } from "@/types/activity";

export function normalizeGuideExercise(
    exercise: Exercise | LegacyExercise,
    index: number
): Exercise {
    const maybeExercise = exercise as Exercise;
    if (Array.isArray(maybeExercise.items)) {
        return maybeExercise;
    }

    return {
        id: `legacy-exercise-${index}`,
        title: "Practice",
        items: [exercise as LegacyExercise],
    };
}
