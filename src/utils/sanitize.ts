/**
 * Production-grade HTML/CSS sanitizers to prevent XSS attacks.
 * Uses sanitize-html (no DOM/jsdom dependency) for compatibility with serverless/edge.
 */

import sanitizeHtmlLib from "sanitize-html";

type SanitizeHtmlOptions = {
    allowStyles?: boolean;
};

const BASE_ALLOWED_TAGS = [
    "a", "b", "blockquote", "br", "code", "div", "em",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "li",
    "mark", "ol", "p", "pre", "span", "strong", "sub", "sup",
    "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul",
];

const BASE_ALLOWED_ATTR: Record<string, string[]> = {
    a: ["href", "rel", "target"],
    "*": ["class", "colspan", "rowspan"],
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses sanitize-html with a strict allowlist of safe tags and attributes
 */
export function sanitizeHtml(input?: string | null, options: SanitizeHtmlOptions = {}): string {
    if (!input) return "";

    const allowStyles = options.allowStyles === true;
    const allowedAttributes = { ...BASE_ALLOWED_ATTR };
    if (allowStyles) {
        allowedAttributes["*"] = [...(allowedAttributes["*"] ?? []), "style"];
    }

    return sanitizeHtmlLib(input, {
        allowedTags: BASE_ALLOWED_TAGS,
        allowedAttributes,
        allowedSchemes: ["http", "https", "mailto", "tel"],
        disallowedTagsMode: "discard",
    });
}

/**
 * Sanitize CSS to prevent CSS injection attacks
 * Removes dangerous CSS constructs like @import, javascript:, and expression()
 */
export function sanitizeCss(input?: string | null): string {
    if (!input) return "";

    let cleaned = input
        .replace(/@import[^;]+;/gi, "")
        .replace(/expression\s*\([^)]*\)/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/data:/gi, "")
        .replace(/vbscript:/gi, "");

    return cleaned;
}
