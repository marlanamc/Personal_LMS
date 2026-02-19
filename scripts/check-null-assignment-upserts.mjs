#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIRS = [path.join(ROOT, "src")];
const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx"]);
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (ALLOWED_EXTENSIONS.has(path.extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

function getLineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function findUpsertCallSpans(source) {
  const spans = [];
  const marker = ".upsert(";
  let searchFrom = 0;

  while (true) {
    const markerIndex = source.indexOf(marker, searchFrom);
    if (markerIndex === -1) break;

    const openParenIndex = markerIndex + marker.length - 1;
    let depth = 0;
    let endIndex = -1;

    for (let i = openParenIndex; i < source.length; i += 1) {
      const char = source[i];
      if (char === "(") depth += 1;
      if (char === ")") {
        depth -= 1;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex === -1) {
      searchFrom = markerIndex + marker.length;
      continue;
    }

    spans.push({ start: markerIndex, end: endIndex + 1 });
    searchFrom = endIndex + 1;
  }

  return spans;
}

function isSuspiciousAssignmentExpr(expr) {
  const normalized = expr.replace(/\s+/g, "");
  if (normalized === "null") return true;
  if (normalized.includes("asany")) return true;
  if (/\|\|null/.test(normalized)) return true;
  if (/\?\?null/.test(normalized)) return true;
  return false;
}

const findings = [];

for (const targetDir of TARGET_DIRS) {
  const files = walk(targetDir);

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const spans = findUpsertCallSpans(source);

    for (const span of spans) {
      const callSource = source.slice(span.start, span.end);
      if (!callSource.includes("userId_activityId_assignmentId")) continue;

      const match = callSource.match(
        /userId_activityId_assignmentId\s*:\s*{[\s\S]*?assignmentId\s*:\s*([^,\n}]+)/
      );
      if (!match) continue;

      const expression = match[1].trim();
      if (!isSuspiciousAssignmentExpr(expression)) continue;

      const absoluteIndex = span.start + (match.index ?? 0);
      findings.push({
        file,
        line: getLineNumber(source, absoluteIndex),
        expression,
      });
    }
  }
}

if (findings.length > 0) {
  console.error("Found unsafe nullable assignmentId usage in composite-key upsert:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} -> assignmentId: ${finding.expression}`);
  }
  process.exit(1);
}

console.log("No unsafe nullable assignmentId composite-key upserts found.");
