/**
 * Medal tier utilities - shared between server and client
 *
 * Tiers:
 * - Platinum: 100%
 * - Gold: 90-99%
 * - Silver: 80-89%
 * - Bronze: 70-79%
 * - No medal: under 70%
 */

export type MedalTier = "bronze" | "silver" | "gold" | "platinum";

/**
 * Check if a score qualifies for a medal (70% or higher)
 */
export function qualifiesForMedal(score: number): boolean {
    return score >= 70;
}

/**
 * Get the tier name for a score
 * Returns null for scores under 70%
 */
export function getMedalTier(score: number): MedalTier | null {
    if (score >= 100) return "platinum";
    if (score >= 90) return "gold";
    if (score >= 80) return "silver";
    if (score >= 70) return "bronze";
    return null;
}

/**
 * Get tier display name
 */
export function getMedalTierLabel(tier: MedalTier | null): string {
    if (tier === null) return "Needs Improvement";
    const labels: Record<MedalTier, string> = {
        bronze: "Bronze",
        silver: "Silver",
        gold: "Gold",
        platinum: "Platinum"
    };
    return labels[tier];
}
