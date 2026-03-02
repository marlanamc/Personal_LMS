/**
 * Validates a redirect URL to prevent open redirect attacks.
 * Only allows http and https protocols. Rejects javascript:, data:, and protocol-relative URLs.
 * @returns The URL if safe, null if invalid or unsafe
 */
export function getSafeRedirectUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
