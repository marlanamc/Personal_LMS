#!/usr/bin/env python3
"""
Replace duplicate vocabulary words with unique alternatives.
"""

import re
from pathlib import Path

# Define replacements: {filename: {old_word: (new_word, new_definition)}}
REPLACEMENTS = {
    "wellness-basics-warmup.html": {
        "habit": ("balance", "healthy mix of work, rest, and activity")
    },
    "used-to-structures-warmup.html": {
        "habit": ("custom", "something you regularly do")
    },
    "final-presentation-2026-06-16-warmup.html": {
        "presentation": ("showcase", "formal sharing of your work or learning")
    },
    "career-basics-warmup.html": {
        "resume": ("portfolio", "collection of your work samples and skills")
    },
    "healthcare-basics-warmup.html": {
        "symptom": ("diagnosis", "what the doctor says is wrong with you")
    }
}

def replace_vocab_word(content: str, old_word: str, new_word: str, new_definition: str) -> str:
    """Replace a vocabulary word and its definition in the HTML."""

    # Replace the word in vocab-word span
    content = re.sub(
        f'<span class="word">{re.escape(old_word)}</span>',
        f'<span class="word">{new_word}</span>',
        content,
        flags=re.IGNORECASE
    )

    # Find and replace the definition
    # First, find which letter corresponds to this word by looking at the ordering
    # We need to match the original definition and replace it

    # For symptom -> diagnosis in healthcare-basics
    if old_word == "symptom" and new_word == "diagnosis":
        content = re.sub(
            r'<div class="vocab-def"><span class="letter">a\.</span> a sign of illness \(like cough, headache\)</div>',
            f'<div class="vocab-def"><span class="letter">a.</span> {new_definition}</div>',
            content
        )

    # For habit -> balance in wellness-basics
    elif old_word == "habit" and new_word == "balance":
        content = re.sub(
            r'<div class="vocab-def"><span class="letter">d\.</span> something you do regularly</div>',
            f'<div class="vocab-def"><span class="letter">d.</span> {new_definition}</div>',
            content
        )

    # For habit -> custom in used-to-structures
    elif old_word == "habit" and new_word == "custom":
        content = re.sub(
            r'<div class="vocab-def"><span class="letter">a\.</span> something you do regularly</div>',
            f'<div class="vocab-def"><span class="letter">a.</span> {new_definition}</div>',
            content
        )

    # For presentation -> showcase in final-presentation
    elif old_word == "presentation" and new_word == "showcase":
        content = re.sub(
            r'<div class="vocab-def"><span class="letter">a\.</span> formal talk or speech</div>',
            f'<div class="vocab-def"><span class="letter">a.</span> {new_definition}</div>',
            content
        )

    # For resume -> portfolio in career-basics
    elif old_word == "resume" and new_word == "portfolio":
        # Need to find the correct letter - let me search for the resume definition
        content = re.sub(
            r'(<div class="vocab-def"><span class="letter">[a-f]\.</span>) document listing your work history and skills(</div>)',
            f'\\1 {new_definition}\\2',
            content
        )

    return content

def main():
    worksheets_dir = Path("worksheets")

    print("Replacing duplicate vocabulary words...\n")

    for filename, replacements in REPLACEMENTS.items():
        # Find the file
        file_paths = list(worksheets_dir.glob(f"**/{filename}"))

        if not file_paths:
            print(f"⚠ Could not find {filename}")
            continue

        file_path = file_paths[0]
        print(f"Processing {filename}...")

        content = file_path.read_text(encoding='utf-8')

        for old_word, (new_word, new_definition) in replacements.items():
            content = replace_vocab_word(content, old_word, new_word, new_definition)
            print(f"  ✓ Replaced '{old_word}' → '{new_word}'")

        file_path.write_text(content, encoding='utf-8')

    print(f"\n✓ All duplicate vocabulary has been replaced!")
    print("\nRun check_vocab_duplicates.py again to verify.")

if __name__ == "__main__":
    main()
