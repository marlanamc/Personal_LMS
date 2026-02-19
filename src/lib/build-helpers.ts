import { prisma } from "@/lib/prisma";
import { resolveCanonicalGrammarActivityId } from "@/lib/grammar-activity-resolution";

/**
 * Safely fetches an activity ID during build time.
 * Returns undefined if database is unavailable (e.g., during Vercel build).
 * This allows pages to be built without database access while still
 * functioning correctly at runtime.
 */
export async function getActivityIdSafely(
    title: string,
    type: string,
    category: string
): Promise<string | undefined> {
    try {
        if (type === "guide" && category === "grammar") {
            // Prefer the canonical released mini-quiz guide when duplicate titles exist.
            const canonicalId = await resolveCanonicalGrammarActivityId({ title });
            if (canonicalId) return canonicalId;
        }

        const activity = await prisma.activity.findFirst({
            where: { title, type, category },
            select: { id: true }
        });
        return activity?.id;
    } catch (error) {
        // Database unavailable during build - this is expected in build environments
        console.warn(`Could not fetch activity "${title}" during build. This is normal for static generation.`);
        return undefined;
    }
}
