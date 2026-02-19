/**
 * Safely parse categoryData values coming from the database/API.
 * The DB stores this as TEXT, so callers may receive a JSON string or an object.
 */
export function parseCategoryData<T extends object = Record<string, unknown>>(value: unknown): T | null {
    if (!value) return null;

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value) as unknown;
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return parsed as T;
            }
            return null;
        } catch {
            return null;
        }
    }

    if (typeof value === "object" && !Array.isArray(value)) {
        return value as T;
    }

    return null;
}
