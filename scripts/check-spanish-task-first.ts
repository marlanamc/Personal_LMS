import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const GUIDES_DIR = path.join(ROOT, "src/content/spanish/guides");

interface Finding {
  guide: string;
  problem: string;
}

function countMatches(source: string, pattern: RegExp): number {
  return Array.from(source.matchAll(pattern)).length;
}

function extractBlock(source: string, startLabel: string, endLabel: string): string {
  const startIndex = source.indexOf(startLabel);
  if (startIndex === -1) return "";
  const endIndex = source.indexOf(endLabel, startIndex);
  if (endIndex === -1) return source.slice(startIndex);
  return source.slice(startIndex, endIndex);
}

function main(): void {
  const files = fs
    .readdirSync(GUIDES_DIR)
    .filter((name) => name.startsWith("spanish-") && name.endsWith(".ts"));

  const findings: Finding[] = [];

  for (const file of files) {
    const fullPath = path.join(GUIDES_DIR, file);
    const source = fs.readFileSync(fullPath, "utf8");
    const usesTaskFirst =
      source.includes("taskScenario:") ||
      source.includes("taskStages:") ||
      source.includes("focusOnFormTriggers:");

    if (!usesTaskFirst) continue;

    if (!source.includes("taskScenario:")) {
      findings.push({ guide: file, problem: "missing taskScenario" });
    }
    if (!source.includes("taskStages:")) {
      findings.push({ guide: file, problem: "missing taskStages" });
    }
    if (!source.includes("focusOnFormTriggers:")) {
      findings.push({ guide: file, problem: "missing focusOnFormTriggers" });
    }
    if (!source.includes("inputMaterials:")) {
      findings.push({ guide: file, problem: "missing inputMaterials" });
    }
    if (!source.includes("communicativeCheckpoint:") && !source.includes("miniQuiz:")) {
      findings.push({ guide: file, problem: "missing communicativeCheckpoint or miniQuiz" });
    }
    if (!source.includes("postTaskReflection:")) {
      findings.push({ guide: file, problem: "missing revise-after-feedback reflection" });
    }

    const inputMaterialsBlock = extractBlock(source, "inputMaterials:", "taskStages:");
    const inputMaterialCount = countMatches(inputMaterialsBlock, /id:\s*"[^"]+"/g);
    if (inputMaterialCount < 2) {
      findings.push({ guide: file, problem: "needs at least 2 input materials" });
    }

    const hasVisualBlock =
      source.includes("usageMeanings:") ||
      source.includes("comparison:") ||
      source.includes("timeline:") ||
      source.includes("futureChoiceFlow:") ||
      source.includes("decisionMap:") ||
      source.includes("sceneCards:") ||
      source.includes("repairStacks:") ||
      source.includes("microStories:") ||
      source.includes("phraseBank:") ||
      source.includes("verbTable:");
    if (!hasVisualBlock) {
      findings.push({ guide: file, problem: "needs at least 1 visual or structured support block" });
    }

    if (!source.includes("repairStacks:")) {
      findings.push({ guide: file, problem: "needs at least 1 repair stack" });
    }

    const firstSectionChunk = source.split("sections: [")[1]?.slice(0, 1200) ?? "";
    if (!firstSectionChunk.includes("taskStageId:")) {
      findings.push({ guide: file, problem: "first section is not wired to a task stage" });
    }

    const stageIds = Array.from(source.matchAll(/id:\s*"([^"]+)"/g)).map((match) => match[1]);
    const triggerStageIds = Array.from(source.matchAll(/stageId:\s*"([^"]+)"/g)).map((match) => match[1]);
    for (const stageId of triggerStageIds) {
      if (!stageIds.includes(stageId)) {
        findings.push({ guide: file, problem: `focus-on-form trigger references unknown stageId ${stageId}` });
      }
    }
  }

  if (findings.length > 0) {
    console.error("❌ Spanish task-first validation failed.");
    for (const finding of findings) {
      console.error(`  - ${finding.guide}: ${finding.problem}`);
    }
    process.exit(1);
  }

  console.log("✅ Spanish task-first validation passed.");
}

main();
