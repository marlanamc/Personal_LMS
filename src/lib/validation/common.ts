import { z } from "zod";

// Reusable validation primitives shared across API route schemas. Keep these
// permissive enough not to reject legitimate existing payloads, but strict
// enough to catch malformed/oversized input before it reaches the database.

/** A required, trimmed, non-empty string (e.g. an id or title). */
export const nonEmptyString = z.string().trim().min(1);

/** An id-like string (cuid). Bounded but not format-locked. */
export const idString = z.string().trim().min(1).max(100);

/** A trimmed string with an upper bound; use for free-text fields. */
export const boundedText = (max: number) => z.string().trim().max(max);

/** `HH:MM` 24-hour time string, matching the existing route regex. */
export const timeString = z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format");

/** `YYYY-MM-DD` date string. */
export const dateOnlyString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format");

/**
 * Upper bound (bytes) on a serialized "store"/"state" JSON blob. These are
 * client-owned documents (planners, focus-timer state, etc.) persisted as JSON;
 * the cap prevents a single oversized payload from bloating the row and slowing
 * later reads. 2 MB is far above any legitimate document.
 */
export const MAX_STORE_BYTES = 2_000_000;

/**
 * An arbitrary JSON value that is size-bounded once serialized. Deep shape
 * validation stays in each feature's `normalizeX` helper; this only guards the
 * envelope against oversized/garbage payloads.
 */
export const boundedJsonValue = z.unknown().refine(
    (value) => {
        if (value === undefined) return true;
        try {
            return JSON.stringify(value).length <= MAX_STORE_BYTES;
        } catch {
            // Circular / non-serializable payloads are rejected.
            return false;
        }
    },
    { message: "payload exceeds maximum allowed size" }
);

/**
 * Envelope schema for the many utility routes that accept `{ store: <json> }`
 * and hand the value to a dedicated `normalizeX` helper. Deep shape validation
 * stays in the normalizer; this guards the envelope and caps payload size.
 */
export const storeEnvelopeSchema = z.object({ store: boundedJsonValue.optional() });

/** Like {@link storeEnvelopeSchema} for routes that accept `{ state: <json> }`. */
export const stateEnvelopeSchema = z.object({ state: boundedJsonValue.optional() });

/** Like {@link storeEnvelopeSchema} for routes that accept `{ preferences: <json> }`. */
export const preferencesEnvelopeSchema = z.object({ preferences: boundedJsonValue.optional() });
