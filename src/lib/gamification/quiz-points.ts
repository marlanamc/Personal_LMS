import { POINTS } from "./constants";

/**
 * Calculate quiz points based on score.
 * Pure function - no database access.
 */
export function calculateQuizPoints(score: number | null): number {
  if (score === null) return 0;

  // Score-based points only - must earn through accuracy
  if (score === 100) {
    return POINTS.QUIZ_PERFECT_SCORE; // 15 points
  } else if (score >= 90) {
    return POINTS.QUIZ_HIGH_SCORE; // 10 points
  } else if (score >= 80) {
    return POINTS.QUIZ_GOOD_SCORE; // 5 points
  } else if (score >= 70) {
    return POINTS.QUIZ_PASSING_SCORE; // 2 points
  }

  // Below 70% = 0 points - need to study more!
  return 0;
}
