import { z } from "zod";

// Upper bound on a single activity's serialized content. Grammar guides and
// slide decks are the largest payloads we store; 1 MB is comfortably above any
// legitimate activity while preventing a malformed/oversized blob from being
// persisted and later slowing down reads.
const MAX_CONTENT_BYTES = 1_000_000;

const jsonStringContent = z
    .string()
    .min(1, "content is required")
    .max(MAX_CONTENT_BYTES, "content exceeds maximum allowed size")
    .refine(
        (value) => {
            try {
                JSON.parse(value);
                return true;
            } catch {
                return false;
            }
        },
        { message: "content must be valid JSON" }
    );

/**
 * Shared schema for creating/updating an Activity. `content` is stored as a
 * JSON string column, so we validate that it is non-empty, size-bounded, and
 * actually parseable JSON before it ever reaches the database.
 */
export const activityInputSchema = z.object({
    title: z.string().trim().min(1, "title is required").max(300),
    type: z.string().trim().min(1, "type is required").max(100),
    content: jsonStringContent,
    description: z.string().max(2000).nullish(),
    category: z.string().max(100).nullish(),
    level: z.string().max(100).nullish(),
    ui: z.string().max(100).nullish(),
});

export type ActivityInput = z.infer<typeof activityInputSchema>;
