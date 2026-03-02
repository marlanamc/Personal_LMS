import { describe, expect, it } from "vitest";
import { POINTS } from "@/lib/gamification/constants";
import { getActivityPoints, resolveActivityGameUi } from "@/lib/gamification/activity-points";
import { determineGrammarCompletionPoints } from "@/lib/gamification/grammar-points";
import { calculateQuizPoints } from "@/lib/gamification";
import { getEffectiveStreak, getNextStreakState, shouldAwardStreak } from "@/lib/gamification/streak-utils";

describe("gamification helpers", () => {
  it("awards streak only when points are earned", () => {
    expect(shouldAwardStreak(0)).toBe(false);
    expect(shouldAwardStreak(4)).toBe(true);
  });

  it("computes effective and next streak state", () => {
    const yesterday = new Date("2026-02-09T12:00:00.000Z");
    const today = new Date("2026-02-10T12:00:00.000Z");
    const missedWindow = new Date("2026-02-12T12:00:00.000Z");

    expect(getEffectiveStreak(5, yesterday, today)).toBe(5);
    expect(getEffectiveStreak(5, yesterday, missedWindow)).toBe(0);

    expect(getNextStreakState(5, yesterday, today)).toEqual({
      streakUpdated: true,
      newStreak: 6,
    });
    expect(getNextStreakState(5, yesterday, missedWindow)).toEqual({
      streakUpdated: true,
      newStreak: 1,
    });
  });

  it("keeps grammar completion points fixed", () => {
    expect(determineGrammarCompletionPoints(0)).toBe(POINTS.GRAMMAR_GUIDE);
    expect(determineGrammarCompletionPoints(999)).toBe(POINTS.GRAMMAR_GUIDE);
  });

  it("uses activity UI/content to resolve points", () => {
    expect(getActivityPoints("game", { ui: "matching" })).toBe(POINTS.MATCHING_GAME);
    expect(resolveActivityGameUi({ content: "word :: countable" })).toBe("matching");
  });

  it("calculates quiz points by score bands", () => {
    expect(calculateQuizPoints(null)).toBe(0);
    expect(calculateQuizPoints(69)).toBe(0);
    expect(calculateQuizPoints(70)).toBe(POINTS.QUIZ_PASSING_SCORE);
    expect(calculateQuizPoints(80)).toBe(POINTS.QUIZ_GOOD_SCORE);
    expect(calculateQuizPoints(90)).toBe(POINTS.QUIZ_HIGH_SCORE);
    expect(calculateQuizPoints(100)).toBe(POINTS.QUIZ_PERFECT_SCORE);
  });
});
