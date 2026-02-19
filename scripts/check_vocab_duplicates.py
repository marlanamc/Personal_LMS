#!/usr/bin/env python3
"""
Check for duplicate vocabulary across all warmup worksheets.
"""

import re
from pathlib import Path
from collections import defaultdict

def extract_vocab_words(html_content: str) -> list:
    """Extract vocabulary words from Part A of a worksheet."""
    # Find the vocab-words section
    vocab_section = re.search(
        r'<div class="vocab-words">(.*?)</div>',
        html_content,
        re.DOTALL
    )

    if not vocab_section:
        return []

    # Extract all words from vocab-word spans
    words = re.findall(
        r'<span class="word">(.*?)</span>',
        vocab_section.group(1)
    )

    return [word.strip().lower() for word in words]

def main():
    worksheets_dir = Path("worksheets")
    html_files = sorted(worksheets_dir.glob("**/*.html"))

    # Track all vocabulary across worksheets
    vocab_to_files = defaultdict(list)
    file_to_vocab = {}

    print(f"Analyzing {len(html_files)} worksheets...\n")

    for file_path in html_files:
        content = file_path.read_text(encoding='utf-8')
        words = extract_vocab_words(content)

        if words:
            file_to_vocab[file_path.name] = words
            for word in words:
                vocab_to_files[word].append(file_path.name)

    # Find duplicates
    duplicates = {word: files for word, files in vocab_to_files.items() if len(files) > 1}

    if duplicates:
        print(f"Found {len(duplicates)} vocabulary words used in multiple worksheets:\n")

        for word, files in sorted(duplicates.items()):
            print(f"'{word}' appears in {len(files)} worksheets:")
            for filename in files:
                print(f"  - {filename}")
            print()
    else:
        print("✓ No duplicate vocabulary found! All words are unique across worksheets.")

    # Summary statistics
    total_words = sum(len(words) for words in file_to_vocab.values())
    unique_words = len(vocab_to_files)

    print(f"\n=== Summary ===")
    print(f"Total vocabulary words: {total_words}")
    print(f"Unique vocabulary words: {unique_words}")
    print(f"Duplicate words: {len(duplicates)}")
    print(f"Worksheets analyzed: {len(file_to_vocab)}")

if __name__ == "__main__":
    main()
