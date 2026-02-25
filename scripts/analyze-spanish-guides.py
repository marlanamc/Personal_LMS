#!/usr/bin/env python3
"""
Analyze Spanish guide content files and output a summary table.

Usage: python scripts/analyze-spanish-guides.py
       or from repo root: python scripts/analyze-spanish-guides.py

Output: Markdown table with guide name, section count, detailed explanations (YES/NO),
        total exercise blocks, total exercise items, and mini quiz question count.
"""

import re
from pathlib import Path

GUIDES_DIR = Path(__file__).resolve().parent.parent / "src" / "content" / "spanish" / "guides"
REGISTRY_PATH = Path(__file__).resolve().parent.parent / "src" / "content" / "spanish" / "registry.ts"

# Display names: file stem (e.g. spanish-present-tense) -> "Present Tense" style
def file_to_display_name(stem: str) -> str:
    # spanish-present-tense -> Present Tense; strip A1-C2 from name
    no_prefix = stem.replace("spanish-", "").replace("-guide", "")
    name = no_prefix.replace("-", " ").title()
    for level in (" B1", " B2", " C1", " C2", " A1", " A2"):
        name = name.replace(level, "")
    return name

def analyze_guide(filepath: Path) -> dict:
    text = filepath.read_text(encoding="utf-8")
    stem = filepath.stem  # e.g. spanish-immediate-future
    guide_id = stem + "-guide" if not stem.endswith("-guide") else stem

    # Split at miniQuiz so we don't count exercise items inside mini quiz
    if "miniQuiz:" in text:
        before_quiz, after_quiz = text.split("miniQuiz:", 1)
    else:
        before_quiz, after_quiz = text, ""

    # 1) Section count: count "icon: " at section level (each section has icon)
    #    Avoid counting icon inside tipBox/other. Section blocks have icon after id/title.
    section_count = len(re.findall(r"\bicon:\s*[\"']", before_quiz))

    # If no icons (unlikely), fallback: count section id pattern
    if section_count == 0:
        section_count = len(re.findall(r'\n\s+id:\s*"[^"]+",\s*\n\s+title:\s*"', before_quiz))

    # 2) Detailed explanations: YES if "Why this matters" (any case) or any explanation
    #    block has substantial content (e.g. > 200 chars or multiple <p>/<h3>)
    why_matters = bool(re.search(r"Why\s+this\s+matters|Why\s+This\s+Matters", text, re.I))
    # Or at least one long explanation block (explanation: ` ... ` with 200+ chars)
    long_explanation = bool(re.search(r"explanation:\s*`[^`]{200,}", text))
    detailed_explanations = "YES" if (why_matters or long_explanation) else "NO"

    # 3) Number of exercise blocks (each has "instructions: ")
    exercise_blocks = len(re.findall(r'\binstructions:\s*["\']', before_quiz))

    # 4) Total exercise items (each item has type: "text" | "select" | "radio" | etc.)
    #    Only in before_quiz to exclude mini quiz
    exercise_items = len(re.findall(r'\btype:\s*"(?:text|select|radio|word-scramble|word-select)"', before_quiz))

    # 5) Mini quiz question count: after "miniQuiz: [", count correctAnswer:
    mini_quiz_count = len(re.findall(r'\bcorrectAnswer\s*:', after_quiz))

    return {
        "name": file_to_display_name(stem),
        "guide_id": guide_id,
        "sections": section_count,
        "detailed_explanations": detailed_explanations,
        "exercise_blocks": exercise_blocks,
        "exercise_items": exercise_items,
        "mini_quiz_questions": mini_quiz_count,
    }


def get_registry_order() -> list[str]:
    """Read SPANISH_GUIDE_IDS order from registry.ts so table matches learning path."""
    if not REGISTRY_PATH.exists():
        return []
    text = REGISTRY_PATH.read_text(encoding="utf-8")
    # Match "spanish-...-guide" inside the array (handles comments between items)
    # Single capturing group so we get a list of strings in array order
    ids = re.findall(r'"(spanish-[a-z0-9-]+-guide)"', text)
    # Keep first occurrence of each (registry lists each ID once in SPANISH_GUIDE_IDS)
    seen = set()
    ordered = [x for x in ids if x not in seen and not seen.add(x)]
    return ordered


def main():
    guide_files = sorted(GUIDES_DIR.glob("spanish-*.ts"))
    if not guide_files:
        print("No Spanish guide files found in", GUIDES_DIR)
        return

    rows = []
    for path in guide_files:
        try:
            rows.append(analyze_guide(path))
        except Exception as e:
            rows.append({
                "name": path.stem,
                "guide_id": path.stem,
                "sections": "?",
                "detailed_explanations": "?",
                "exercise_blocks": "?",
                "exercise_items": "?",
                "mini_quiz_questions": f"Error: {e}",
            })

    # Sort by learning path order (registry) if available; else alphabetical by name
    registry_order = get_registry_order()
    if registry_order:
        order_index = {gid: i for i, gid in enumerate(registry_order)}
        rows.sort(key=lambda r: (order_index.get(r["guide_id"], 999), r["name"].lower()))
    else:
        rows.sort(key=lambda r: (r["name"].lower(),))

    # Print markdown table
    print("| Guide | Sections | Detailed explanations | Exercise blocks | Exercise items | Mini quiz questions |")
    print("|-------|----------|------------------------|-----------------|----------------|---------------------|")
    for r in rows:
        print(
            f"| {r['name']} | {r['sections']} | {r['detailed_explanations']} | "
            f"{r['exercise_blocks']} | {r['exercise_items']} | {r['mini_quiz_questions']} |"
        )

    # Summary
    total_sections = sum(r["sections"] for r in rows if isinstance(r["sections"], int))
    total_blocks = sum(r["exercise_blocks"] for r in rows if isinstance(r["exercise_blocks"], int))
    total_items = sum(r["exercise_items"] for r in rows if isinstance(r["exercise_items"], int))
    total_quiz = sum(r["mini_quiz_questions"] for r in rows if isinstance(r["mini_quiz_questions"], int))
    yes_count = sum(1 for r in rows if r["detailed_explanations"] == "YES")
    print()
    print("**Totals:**", len(rows), "guides |", total_sections, "sections |", yes_count, "with detailed explanations |",
          total_blocks, "exercise blocks |", total_items, "exercise items |", total_quiz, "mini quiz questions")


if __name__ == "__main__":
    main()
