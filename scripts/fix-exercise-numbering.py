#!/usr/bin/env python3
"""
Fix double numbering in grammar guide exercise labels.

This script removes hardcoded numbers (e.g., "1. ", "2. ") from the beginning of
exercise item labels, since the rendering components already add numbering automatically.

Example:
    BEFORE: label: "1. This is ___ (cheap) apartment I can afford."
    AFTER:  label: "This is ___ (cheap) apartment I can afford."
"""

import re
import os
import sys
from pathlib import Path

def fix_exercise_numbering(file_path):
    """Remove hardcoded numbers from exercise labels in a TypeScript file."""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Pattern to match: label: "1. Some text"
    # Captures the number and period, and the rest of the label
    pattern = r'(label:\s*")\d+\.\s+([^"]+)'

    # Replace with just the label text without the number
    fixed_content = re.sub(pattern, r'\1\2', content)

    # Count how many replacements were made
    changes = len(re.findall(pattern, original_content))

    if changes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"✓ Fixed {changes} labels in {file_path.name}")
        return changes
    else:
        print(f"  No changes needed in {file_path.name}")
        return 0

def main():
    """Process all grammar guide files in src/content/grammar/"""

    # Get the project root directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    grammar_dir = project_root / "src" / "content" / "grammar"

    if not grammar_dir.exists():
        print(f"Error: Grammar directory not found at {grammar_dir}")
        sys.exit(1)

    print("Fixing exercise numbering in grammar guides...")
    print("=" * 60)

    total_changes = 0
    files_modified = 0

    # Process all .ts files in the grammar directory
    for file_path in sorted(grammar_dir.glob("*.ts")):
        changes = fix_exercise_numbering(file_path)
        if changes > 0:
            files_modified += 1
            total_changes += changes

    print("=" * 60)
    print(f"\nSummary:")
    print(f"  Files modified: {files_modified}")
    print(f"  Total labels fixed: {total_changes}")
    print(f"\n✓ Done! All exercise labels now have single numbering.")

if __name__ == "__main__":
    main()
