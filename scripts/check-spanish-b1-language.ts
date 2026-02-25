import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SEED_FILE = path.join(ROOT, "prisma/seed-spanish-guides.ts");
const GUIDES_DIR = path.join(ROOT, "src/content/spanish/guides");

const B_LEVEL_RE = /\b(B1|B2|C1|C2)\b/i;
const ENGLISH_SIGNAL_RE =
  /\b(the|and|with|from|your|about|which|choose|complete|instructions?|question|questions|explanation|explanations|practice|quick\s+check|fill\s+in|match|correct\s+answer)\b/gi;

function getSeedGuideLevelMap(seedSource: string): Map<string, string> {
  const map = new Map<string, string>();
  const entryRe = /id:\s*'([^']+)'\s*,[\s\S]*?level:\s*'([^']+)'/g;

  for (const match of seedSource.matchAll(entryRe)) {
    const [, id, level] = match;
    map.set(id, level);
  }

  return map;
}

function guideIdToFilePath(guideId: string): string {
  const slug = guideId.replace(/^spanish-/, "").replace(/-guide$/, "");
  return path.join(GUIDES_DIR, `spanish-${slug}.ts`);
}

function extractUserFacingLiterals(source: string): string {
  const literals: string[] = [];
  const stringRe = /(["'`])((?:\\.|(?!\1)[\s\S])*)\1/g;

  for (const match of source.matchAll(stringRe)) {
    const [, , body] = match;
    literals.push(body);
  }

  return literals.join("\n");
}

function countEnglishSignals(source: string): number {
  const literalsOnly = extractUserFacingLiterals(source);
  return (literalsOnly.match(ENGLISH_SIGNAL_RE) || []).length;
}

function main(): void {
  if (!fs.existsSync(SEED_FILE)) {
    throw new Error(`Missing seed file: ${SEED_FILE}`);
  }

  const seedSource = fs.readFileSync(SEED_FILE, "utf8");
  const levelMap = getSeedGuideLevelMap(seedSource);
  const findings: Array<{ id: string; level: string; signalCount: number }> = [];

  for (const [guideId, level] of levelMap.entries()) {
    if (!B_LEVEL_RE.test(level)) continue;

    const filePath = guideIdToFilePath(guideId);
    if (!fs.existsSync(filePath)) {
      findings.push({ id: guideId, level, signalCount: Number.POSITIVE_INFINITY });
      continue;
    }

    const source = fs.readFileSync(filePath, "utf8");
    const signalCount = countEnglishSignals(source);

    // Keep threshold conservative to reduce false positives.
    if (signalCount >= 8) {
      findings.push({ id: guideId, level, signalCount });
    }
  }

  if (findings.length > 0) {
    console.error("❌ B1+ Spanish-only check failed.");
    for (const finding of findings) {
      if (!Number.isFinite(finding.signalCount)) {
        console.error(`  - ${finding.id} (${finding.level}): guide source file not found`);
      } else {
        console.error(
          `  - ${finding.id} (${finding.level}): detected ${finding.signalCount} English-language signals`
        );
      }
    }
    process.exit(1);
  }

  console.log("✅ B1+ Spanish-only check passed.");
}

main();
