import type { InteractiveGuideContent } from "@/types/activity";

// Map of slug to content import
const grammarContentMap: Record<
    string,
    () => Promise<{ default?: InteractiveGuideContent; [key: string]: InteractiveGuideContent | unknown }>
> = {
    "all-verb-tenses-overview": () => import("@/content/grammar/all-verb-tenses-overview"),
    "conditionals-zero-first": () => import("@/content/grammar/conditionals-zero-first"),
    "conditionals-second-third": () => import("@/content/grammar/conditionals-second-third"),
    "continuous-tenses-review": () => import("@/content/grammar/continuous-tenses-review"),
    "future-continuous": () => import("@/content/grammar/future-continuous"),
    "future-perfect-continuous": () => import("@/content/grammar/future-perfect-continuous"),
    "future-perfect": () => import("@/content/grammar/future-perfect"),
    "future-simple": () => import("@/content/grammar/future-simple"),
    "gerunds-infinitives": () => import("@/content/grammar/gerunds-infinitives"),
    "imperatives-declaratives": () => import("@/content/grammar/imperatives-declaratives"),
    "information-questions": () => import("@/content/grammar/information-questions"),
    "medical-instructions-complete": () => import("@/content/grammar/medical-instructions-complete"),
    "modals-obligation-permission": () => import("@/content/grammar/modals-obligation-permission"),
    "modals-health-advice-caution-consent": () => import("@/content/grammar/modals-health-advice-caution-consent"),
    "articles-community-resources": () => import("@/content/grammar/articles-community-resources"),
    "prepositions-time-place": () => import("@/content/grammar/prepositions-time-place"),
    "paragraph-format": () => import("@/content/grammar/paragraph-format"),
    "parts-of-speech": () => import("@/content/grammar/parts-of-speech"),
    "passive-voice": () => import("@/content/grammar/passive-voice"),
    "past-continuous": () => import("@/content/grammar/past-continuous"),
    "past-perfect-continuous": () => import("@/content/grammar/past-perfect-continuous"),
    "past-perfect": () => import("@/content/grammar/past-perfect"),
    "past-simple": () => import("@/content/grammar/past-simple"),
    "perfect-continuous-tenses-review": () => import("@/content/grammar/perfect-continuous-tenses-review"),
    "perfect-tenses-review": () => import("@/content/grammar/perfect-tenses-review"),
    "present-continuous": () => import("@/content/grammar/present-continuous"),
    "present-perfect-continuous": () => import("@/content/grammar/present-perfect-continuous"),
    "present-perfect": () => import("@/content/grammar/present-perfect"),
    "present-simple": () => import("@/content/grammar/present-simple"),
    "punctuation-capitalization": () => import("@/content/grammar/punctuation-capitalization"),
    "reported-speech": () => import("@/content/grammar/reported-speech"),
    "simple-tenses-review": () => import("@/content/grammar/simple-tenses-review"),
    "superlatives-quantifiers": () => import("@/content/grammar/superlatives-quantifiers"),
    "used-to-would-rather": () => import("@/content/grammar/used-to-would-rather"),
    "workplace-phrasal-verbs": () => import("@/content/grammar/workplace-phrasal-verbs"),
    "cycle-1-review": () => import("@/content/grammar/cycle-1-review"),
};

export async function getGrammarContent(
    slug: string
): Promise<InteractiveGuideContent | null> {
    const loader = grammarContentMap[slug];
    if (!loader) {
        return null;
    }

    try {
        const module = await loader();
        // Try different export patterns
        if (module.default && typeof module.default === "object" && "type" in module.default) {
            return module.default as InteractiveGuideContent;
        }
        // Look for Content export (e.g., reportedSpeechContent, presentSimpleContent)
        const contentKeys = Object.keys(module).filter(
            (key) =>
                key.toLowerCase().includes("content") &&
                typeof module[key] === "object" &&
                module[key] !== null &&
                module[key] !== undefined &&
                typeof module[key] === "object" &&
                "type" in (module[key] as Record<string, unknown>)
        );
        if (contentKeys.length > 0) {
            // Prefer the one that ends with "Content"
            const preferred = contentKeys.find((k) => k.toLowerCase().endsWith("content")) || contentKeys[0];
            return module[preferred] as InteractiveGuideContent;
        }
        return null;
    } catch (error) {
        console.error(`Error loading grammar content for slug: ${slug}`, error);
        return null;
    }
}
