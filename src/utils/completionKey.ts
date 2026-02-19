export function completionKeyFromActivityTitle(title: string): string {
    const normalized = title
        .trim()
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Many DB activity titles use a "... Guide" suffix, while the grammar-reader slugs do not.
    return normalized.replace(/-guide$/i, "");
}

