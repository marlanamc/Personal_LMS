import { prisma } from "@/lib/prisma";

interface GrammarActivityCandidate {
    id: string;
    title: string;
    content: string;
    isReleased: boolean;
}

function titleCaseFromSlug(slug: string): string {
    return slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function hasMiniQuiz(content: string): boolean {
    try {
        const parsed = JSON.parse(content);
        return Boolean(parsed?.miniQuiz);
    } catch {
        return false;
    }
}

function scoreCandidate(candidate: GrammarActivityCandidate): number {
    let score = 0;
    if (candidate.isReleased) score += 10;
    if (hasMiniQuiz(candidate.content)) score += 5;
    return score;
}

export function normalizeGuideTitle(title: string): string {
    return title
        .replace(/\s*-\s*Complete Guide$/i, "")
        .replace(/\s+Guide$/i, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

/**
 * Resolve a single canonical grammar guide activity ID.
 * This prevents writes to duplicate/legacy guide rows that share the same title.
 */
export async function resolveCanonicalGrammarActivityId(input: {
    activityId?: string | null;
    slug?: string | null;
    title?: string | null;
}): Promise<string | undefined> {
    const { activityId, slug, title } = input;

    const candidateIds = Array.from(
        new Set([activityId, slug, slug ? `${slug}-guide` : undefined].filter(Boolean))
    ) as string[];

    const slugTitle = slug ? titleCaseFromSlug(slug) : undefined;
    const candidateTitles = Array.from(
        new Set([
            title,
            slugTitle,
            slugTitle ? `${slugTitle} Guide` : undefined,
            slugTitle ? `${slugTitle} - Complete Guide` : undefined,
        ].filter(Boolean))
    ) as string[];

    const candidates = await prisma.activity.findMany({
        where: {
            type: "guide",
            category: "grammar",
            OR: [
                candidateIds.length > 0 ? { id: { in: candidateIds } } : undefined,
                candidateTitles.length > 0 ? { title: { in: candidateTitles } } : undefined,
            ].filter(Boolean) as Array<Record<string, unknown>>,
        },
        select: {
            id: true,
            title: true,
            content: true,
            isReleased: true,
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });

    if (candidates.length === 0) {
        return undefined;
    }

    const [best] = [...candidates].sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
    return best?.id;
}
