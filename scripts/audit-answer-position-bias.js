#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "src", "content", "grammar");
const BASELINE_PATH = path.join(ROOT, "scripts", "answer-position-audit-baseline.json");

const args = new Set(process.argv.slice(2));
const shouldUpdateBaseline = args.has("--update-baseline");
const strictMissingMappings = args.has("--strict-missing");

const TOLERANCE = readNumber(process.env.ANSWER_AUDIT_TOLERANCE, 0.03);
const MIN_QUESTIONS = readInt(process.env.ANSWER_AUDIT_MIN_QUESTIONS, 10);
const MAX_NEW_FILE_FIRST_RATE = readNumber(process.env.ANSWER_AUDIT_MAX_NEW_FILE_FIRST_RATE, 0.5);

if (!fs.existsSync(TARGET_DIR)) {
    console.error(`ERROR: target directory not found: ${TARGET_DIR}`);
    process.exit(1);
}

const files = listTypeScriptFiles(TARGET_DIR)
    .map((absPath) => path.relative(ROOT, absPath).replace(/\\/g, "/"))
    .sort();

const perFile = {};
for (const file of files) {
    const content = fs.readFileSync(path.join(ROOT, file), "utf8");
    perFile[file] = analyzeContent(content);
}

const globalStats = Object.values(perFile).reduce(
    (acc, stats) => {
        acc.totalBlocks += stats.totalBlocks;
        acc.analyzedBlocks += stats.analyzedBlocks;
        acc.skippedNonChoiceBlocks += stats.skippedNonChoiceBlocks;
        acc.first += stats.first;
        acc.second += stats.second;
        acc.thirdPlus += stats.thirdPlus;
        acc.missingMappings += stats.missingMappings;
        return acc;
    },
    {
        totalBlocks: 0,
        analyzedBlocks: 0,
        skippedNonChoiceBlocks: 0,
        first: 0,
        second: 0,
        thirdPlus: 0,
        missingMappings: 0,
    },
);
globalStats.firstRate = ratio(globalStats.first, globalStats.analyzedBlocks);

if (shouldUpdateBaseline) {
    const baseline = {
        version: 1,
        generatedAt: new Date().toISOString(),
        scope: "src/content/grammar/**/*.ts",
        settings: {
            tolerance: TOLERANCE,
            minQuestions: MIN_QUESTIONS,
            maxNewFileFirstRate: MAX_NEW_FILE_FIRST_RATE,
        },
        global: compactStats(globalStats),
        files: Object.fromEntries(
            Object.entries(perFile).map(([file, stats]) => [file, compactStats(stats)]),
        ),
    };

    fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
    console.log(`Wrote baseline: ${path.relative(ROOT, BASELINE_PATH)}`);
    printSummary(globalStats, perFile);
    process.exit(0);
}

if (!fs.existsSync(BASELINE_PATH)) {
    console.error(`ERROR: baseline not found: ${path.relative(ROOT, BASELINE_PATH)}`);
    console.error("Run: npm run audit:answer-position:update-baseline");
    process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
const failures = [];
const warnings = [];

for (const [file, current] of Object.entries(perFile)) {
    const base = baseline.files?.[file];

    if (!base) {
        if (current.analyzedBlocks >= MIN_QUESTIONS && current.firstRate > MAX_NEW_FILE_FIRST_RATE) {
            failures.push(
                `${file}: new file first-rate ${(current.firstRate * 100).toFixed(1)}% exceeds ${(
                    MAX_NEW_FILE_FIRST_RATE * 100
                ).toFixed(1)}%`,
            );
        } else {
            warnings.push(`${file}: new file has no baseline entry`);
        }
        continue;
    }

    if (current.missingMappings > (base.missingMappings || 0)) {
        failures.push(
            `${file}: missing mappings increased (${base.missingMappings || 0} -> ${current.missingMappings})`,
        );
    }

    const baselineComparable = (base.analyzedBlocks || 0) >= MIN_QUESTIONS;
    const currentComparable = current.analyzedBlocks >= MIN_QUESTIONS;
    if (baselineComparable && currentComparable && current.firstRate > (base.firstRate || 0) + TOLERANCE) {
        failures.push(
            `${file}: first-rate regressed ${((base.firstRate || 0) * 100).toFixed(1)}% -> ${(
                current.firstRate * 100
            ).toFixed(1)}% (tolerance ${(TOLERANCE * 100).toFixed(1)}%)`,
        );
    }
}

for (const file of Object.keys(baseline.files || {})) {
    if (!perFile[file]) {
        warnings.push(`${file}: exists in baseline but file is missing now`);
    }
}

if (
    (baseline.global?.analyzedBlocks || 0) >= MIN_QUESTIONS &&
    globalStats.analyzedBlocks >= MIN_QUESTIONS &&
    globalStats.firstRate > (baseline.global?.firstRate || 0) + TOLERANCE
) {
    failures.push(
        `Global first-rate regressed ${((baseline.global?.firstRate || 0) * 100).toFixed(1)}% -> ${(
            globalStats.firstRate * 100
        ).toFixed(1)}% (tolerance ${(TOLERANCE * 100).toFixed(1)}%)`,
    );
}

if (strictMissingMappings && globalStats.missingMappings > 0) {
    failures.push(`Strict mode: found ${globalStats.missingMappings} missing answer mappings`);
}

printSummary(globalStats, perFile);

if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of warnings) {
        console.log(`- ${warning}`);
    }
}

if (failures.length > 0) {
    console.error("\nAudit failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log("\nAnswer-position audit passed.");
process.exit(0);

function analyzeContent(content) {
    const blockRegex =
        /options:\s*\[([\s\S]*?)\],\s*(?:expectedAnswer|correctAnswer):\s*"((?:\\.|[^"\\])*)"/g;
    const valueRegex = /value:\s*"((?:\\.|[^"\\])*)"/g;

    const stats = {
        totalBlocks: 0,
        analyzedBlocks: 0,
        skippedNonChoiceBlocks: 0,
        first: 0,
        second: 0,
        thirdPlus: 0,
        missingMappings: 0,
        firstRate: 0,
    };

    let match;
    while ((match = blockRegex.exec(content))) {
        stats.totalBlocks += 1;
        const optionsBlock = match[1];
        const answerValue = match[2];

        const values = [...optionsBlock.matchAll(valueRegex)].map((item) => item[1]);
        if (values.length === 0) {
            stats.skippedNonChoiceBlocks += 1;
            continue;
        }

        const index = values.indexOf(answerValue);
        if (index === -1) {
            stats.missingMappings += 1;
            continue;
        }

        stats.analyzedBlocks += 1;
        if (index === 0) stats.first += 1;
        else if (index === 1) stats.second += 1;
        else stats.thirdPlus += 1;
    }

    stats.firstRate = ratio(stats.first, stats.analyzedBlocks);
    return stats;
}

function listTypeScriptFiles(startDir) {
    const out = [];
    const entries = fs.readdirSync(startDir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(startDir, entry.name);
        if (entry.isDirectory()) {
            out.push(...listTypeScriptFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".ts")) {
            out.push(fullPath);
        }
    }
    return out;
}

function compactStats(stats) {
    return {
        totalBlocks: stats.totalBlocks,
        analyzedBlocks: stats.analyzedBlocks,
        skippedNonChoiceBlocks: stats.skippedNonChoiceBlocks,
        first: stats.first,
        second: stats.second,
        thirdPlus: stats.thirdPlus,
        missingMappings: stats.missingMappings,
        firstRate: Number(stats.firstRate.toFixed(6)),
    };
}

function printSummary(globalStats, perFile) {
    console.log("Answer Position Audit Summary");
    console.log(
        `Global: analyzed=${globalStats.analyzedBlocks}/${globalStats.totalBlocks} | first=${globalStats.first} | second=${globalStats.second} | third+=${globalStats.thirdPlus} | missing=${globalStats.missingMappings} | firstRate=${(
            globalStats.firstRate * 100
        ).toFixed(1)}%`,
    );

    const ranked = Object.entries(perFile)
        .filter(([, stats]) => stats.analyzedBlocks >= MIN_QUESTIONS)
        .sort((a, b) => b[1].firstRate - a[1].firstRate)
        .slice(0, 10);

    if (ranked.length > 0) {
        console.log(`Top files by first-answer rate (min ${MIN_QUESTIONS} analyzed):`);
        for (const [file, stats] of ranked) {
            console.log(
                `- ${file}: ${(stats.firstRate * 100).toFixed(1)}% (first=${stats.first}, analyzed=${stats.analyzedBlocks})`,
            );
        }
    }
}

function ratio(a, b) {
    if (!b) return 0;
    return a / b;
}

function readNumber(raw, fallback) {
    if (raw == null || raw === "") return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
}

function readInt(raw, fallback) {
    if (raw == null || raw === "") return fallback;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) ? value : fallback;
}
