import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type Rgba = { r: number; g: number; b: number; a: number };

function listTsFiles(dir: string): string[] {
  return readdirSync(resolve(process.cwd(), dir))
    .filter((entry) => entry.endsWith(".ts"))
    .map((entry) => `${dir}/${entry}`);
}

const TARGET_FILES = [
  ...listTsFiles("src/content/personal"),
  ...listTsFiles("src/content/grammar"),
];

const VIEWER_BASE_BG = parseColor("#0a1738");
const LIGHT_SURFACE_BG = parseColor("#f2e6de");
const WCAG_AA_NORMAL = 4.5;

function parseColor(value: string): Rgba | null {
  const color = value.trim().toLowerCase();

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b, a: 1 };
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, a: 1 };
    }
    return null;
  }

  const rgbaMatch =
    color.match(/^rgba\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)$/) ||
    color.match(/^rgb\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)$/);

  if (!rgbaMatch) return null;
  const r = Number(rgbaMatch[1]);
  const g = Number(rgbaMatch[2]);
  const b = Number(rgbaMatch[3]);
  const a = rgbaMatch[4] === undefined ? 1 : Number(rgbaMatch[4]);
  return { r, g, b, a };
}

function blend(fg: Rgba, bg: Rgba): Rgba {
  const alpha = fg.a + bg.a * (1 - fg.a);
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
    a: alpha,
  };
}

function luminance(color: Rgba): number {
  const toLinear = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(color.r);
  const g = toLinear(color.g);
  const b = toLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: Rgba, b: Rgba): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function extractStyleValue(style: string, key: string): string | null {
  const pattern = new RegExp(`${key}\\s*:\\s*([^;]+)`, "i");
  const match = style.match(pattern);
  return match ? match[1].trim() : null;
}

function getLine(source: string, offset: number): number {
  return source.slice(0, offset).split("\n").length;
}

function main() {
  if (!VIEWER_BASE_BG || !LIGHT_SURFACE_BG) {
    throw new Error("Failed to parse baseline colors.");
  }

  let issues = 0;

  for (const relPath of TARGET_FILES) {
    const filePath = resolve(process.cwd(), relPath);
    const source = readFileSync(filePath, "utf8");
    const stylePattern = /style="([^"]+)"/g;
    let match: RegExpExecArray | null;

    while ((match = stylePattern.exec(source)) !== null) {
      const style = match[1];
      const colorRaw = extractStyleValue(style, "color");
      const backgroundRaw = extractStyleValue(style, "background");
      if (!colorRaw || !backgroundRaw) continue;

      if (backgroundRaw.includes("linear-gradient(")) continue;

      const fg = parseColor(colorRaw);
      let bg = parseColor(backgroundRaw);
      if (!fg || !bg) continue;

      let ratio = contrastRatio(fg, bg);
      if (bg.a < 1) {
        const darkBlend = blend(bg, VIEWER_BASE_BG);
        const lightBlend = blend(bg, LIGHT_SURFACE_BG);
        const darkRatio = contrastRatio(fg, darkBlend);
        const lightRatio = contrastRatio(fg, lightBlend);
        ratio = Math.max(darkRatio, lightRatio);
      }

      if (ratio < WCAG_AA_NORMAL) {
        issues += 1;
        const line = getLine(source, match.index);
        console.log(
          `[contrast] ${relPath}:${line} ratio=${ratio.toFixed(2)} color=${colorRaw} background=${backgroundRaw}`
        );
      }
    }
  }

  if (issues > 0) {
    console.log(`\nFound ${issues} potential contrast issues (target >= ${WCAG_AA_NORMAL}:1).`);
    process.exitCode = 1;
    return;
  }

  console.log("No inline color/background contrast issues found in scanned personal + grammar guides.");
}

main();
