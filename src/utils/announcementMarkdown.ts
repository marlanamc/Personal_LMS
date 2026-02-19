import { sanitizeHtml } from "@/utils/sanitize";

function escapeHtml(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatInlineMarkdown(input: string): string {
    return input
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^\*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

function toSafeLink(url: string): string | null {
    try {
        const parsed = new URL(url.trim());
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return parsed.toString();
        }
        return null;
    } catch {
        return null;
    }
}

function tokenizeLinks(input: string): { withTokens: string; linkMap: Map<string, string> } {
    const linkMap = new Map<string, string>();
    let index = 0;

    const withTokens = input.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (full, label: string, rawUrl: string) => {
        const safeUrl = toSafeLink(rawUrl);
        if (!safeUrl) {
            return full;
        }

        const token = `@@ANNOUNCE_LINK_${index}@@`;
        index += 1;

        const html = `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(label)}</a>`;
        linkMap.set(token, html);
        return token;
    });

    return { withTokens, linkMap };
}

export function renderAnnouncementMarkdown(input?: string | null): string {
    const normalized = (input || "").trim();
    if (!normalized) {
        return "";
    }

    const lines = normalized.split(/\r?\n/);
    const htmlParts: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            htmlParts.push(`<ul>${listItems.join("")}</ul>`);
            listItems = [];
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            flushList();
            continue;
        }

        const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (listMatch) {
            const { withTokens, linkMap } = tokenizeLinks(listMatch[1]);
            let safe = formatInlineMarkdown(escapeHtml(withTokens));
            for (const [token, linkHtml] of linkMap.entries()) {
                safe = safe.replaceAll(token, linkHtml);
            }
            listItems.push(`<li>${safe}</li>`);
            continue;
        }

        flushList();
        const { withTokens, linkMap } = tokenizeLinks(trimmed);
        let safe = formatInlineMarkdown(escapeHtml(withTokens));
        for (const [token, linkHtml] of linkMap.entries()) {
            safe = safe.replaceAll(token, linkHtml);
        }
        htmlParts.push(`<p>${safe}</p>`);
    }

    flushList();

    return sanitizeHtml(htmlParts.join(""), {
        allowStyles: false,
    });
}
