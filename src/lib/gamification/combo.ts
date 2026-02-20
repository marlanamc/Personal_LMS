/**
 * Combo System for gamification
 *
 * Provides multipliers based on consecutive correct answers
 * to reward sustained performance and create addictive gameplay.
 */

export interface ComboState {
  currentCombo: number;
  maxCombo: number;
  lastCorrectTime: number;
  comboDecayMs: number; // Time before combo resets (default 5000ms)
}

export function createComboState(decayMs = 5000): ComboState {
  return {
    currentCombo: 0,
    maxCombo: 0,
    lastCorrectTime: Date.now(),
    comboDecayMs: decayMs,
  };
}

/**
 * Get the multiplier for the current combo streak
 *
 * Combo 0-2: 1.0x (no bonus)
 * Combo 3-4: 1.25x
 * Combo 5-9: 1.5x
 * Combo 10-19: 1.75x
 * Combo 20+: 2.0x (max)
 */
export function getComboMultiplier(combo: number): number {
  if (combo < 3) return 1.0;
  if (combo < 5) return 1.25;
  if (combo < 10) return 1.5;
  if (combo < 20) return 1.75;
  return 2.0;
}

/**
 * Get the display label for the current multiplier tier
 */
export function getComboTierLabel(combo: number): string | null {
  if (combo < 3) return null;
  if (combo < 5) return "Nice!";
  if (combo < 10) return "Great!";
  if (combo < 20) return "Amazing!";
  return "On Fire!";
}

/**
 * Get the CSS color class for the combo tier
 */
export function getComboTierColor(combo: number): string {
  if (combo < 3) return "text-gray-400";
  if (combo < 5) return "text-blue-500";
  if (combo < 10) return "text-green-500";
  if (combo < 20) return "text-orange-500";
  return "text-red-500";
}

/**
 * Apply combo multiplier to base points
 */
export function applyComboBonus(basePoints: number, combo: number): number {
  const multiplier = getComboMultiplier(combo);
  return Math.floor(basePoints * multiplier);
}

/**
 * Update combo state after a correct answer
 */
export function incrementCombo(state: ComboState): ComboState {
  const now = Date.now();
  const timeSinceLastCorrect = now - state.lastCorrectTime;

  // If too much time has passed, reset combo
  if (timeSinceLastCorrect > state.comboDecayMs && state.currentCombo > 0) {
    return {
      ...state,
      currentCombo: 1,
      lastCorrectTime: now,
    };
  }

  const newCombo = state.currentCombo + 1;
  return {
    ...state,
    currentCombo: newCombo,
    maxCombo: Math.max(state.maxCombo, newCombo),
    lastCorrectTime: now,
  };
}

/**
 * Reset combo after an incorrect answer
 */
export function resetCombo(state: ComboState): ComboState {
  return {
    ...state,
    currentCombo: 0,
    lastCorrectTime: Date.now(),
  };
}

/**
 * Check if combo should be decayed (for use in useEffect intervals)
 */
export function shouldDecayCombo(state: ComboState): boolean {
  if (state.currentCombo === 0) return false;
  return Date.now() - state.lastCorrectTime > state.comboDecayMs;
}

/**
 * Calculate bonus points for reaching combo milestones
 * Returns the bonus points to award (0 if no milestone reached)
 */
export function getComboMilestoneBonus(previousCombo: number, newCombo: number): number {
  const milestones = [
    { threshold: 5, bonus: 3 },
    { threshold: 10, bonus: 5 },
    { threshold: 20, bonus: 10 },
    { threshold: 50, bonus: 25 },
  ];

  let totalBonus = 0;
  for (const milestone of milestones) {
    if (previousCombo < milestone.threshold && newCombo >= milestone.threshold) {
      totalBonus += milestone.bonus;
    }
  }

  return totalBonus;
}

/**
 * Get animation intensity based on combo (for visual effects)
 * Returns a value from 0-4 for CSS animation classes
 */
export function getComboAnimationIntensity(combo: number): number {
  if (combo < 3) return 0;
  if (combo < 5) return 1;
  if (combo < 10) return 2;
  if (combo < 20) return 3;
  return 4;
}
