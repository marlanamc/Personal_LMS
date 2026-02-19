import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { parse } from "node-html-parser";
import type { LegacyGuideResponse } from "@/types/activity";

const LEGACY_BASE = path.join(process.cwd(), "_legacy", "activities");

async function fileExists(filePath: string) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function findFileByName(fileName: string) {
    const stack = [LEGACY_BASE];
    while (stack.length) {
        const current = stack.pop()!;
        const entries = await fs.readdir(current, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(fullPath);
            } else if (entry.isFile() && entry.name === fileName) {
                return fullPath;
            }
        }
    }
    return null;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get("file");

    if (!fileParam) {
        return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
    }

    const sanitized = fileParam.replace(/^\/+/, "");
    const requestedPath = path.join(LEGACY_BASE, sanitized);

    let resolvedPath: string | null = null;

    // If the user provided a relative path, use it when it stays inside LEGACY_BASE and exists
    if (requestedPath.startsWith(LEGACY_BASE) && await fileExists(requestedPath)) {
        resolvedPath = requestedPath;
    } else {
        // Fallback: search by filename anywhere inside legacy activities
        const found = await findFileByName(path.basename(sanitized));
        if (found) {
            resolvedPath = found;
        }
    }

    if (!resolvedPath) {
        return NextResponse.json({ error: "Legacy guide not found" }, { status: 404 });
    }

    try {
        const htmlContent = await fs.readFile(resolvedPath, "utf-8");
        const root = parse(htmlContent);

        const guideEl = root.querySelector(".grammar-guide");
        const guideHtml = guideEl?.toString() ?? root.innerHTML;
        const inlineStyles = root.querySelectorAll("style")
            .map((style) => style.textContent?.trim() ?? "")
            .filter(Boolean);
        const inlineScripts = root.querySelectorAll("script")
            .filter((script) => !script.getAttribute("src"))
            .map((script) => script.textContent?.trim() ?? "")
            .filter(Boolean);

        // Load the base CSS variables from the legacy main.css
        const mainCssPath = path.join(process.cwd(), "css-from-legacy", "main.css");
        let mainCss = "";
        try {
            mainCss = await fs.readFile(mainCssPath, "utf-8");
        } catch {
            // If main.css doesn't exist, continue without it
        }

        // Prepend the main CSS to the inline styles
        const allStyles = mainCss ? [mainCss, ...inlineStyles] : inlineStyles;

        const payload: LegacyGuideResponse = {
            html: guideHtml,
            styles: allStyles,
            scripts: inlineScripts,
            source: path.relative(LEGACY_BASE, resolvedPath),
        };

        return NextResponse.json(payload);
    } catch {
        return NextResponse.json({ error: "Failed to read legacy guide" }, { status: 500 });
    }
}
