#!/usr/bin/env python3
"""
Fix header layout and add dates to basics worksheets.

Changes:
1. Update CSS to put Name and Date on separate line below title
2. Update HTML structure to match new CSS
3. Add dates to 8 basics worksheets from the official schedule
"""

import re
from pathlib import Path

# Mapping of basics worksheets to their scheduled dates
BASICS_DATES = {
    "classroom-basics-warmup.html": "January 6, 2026",
    "food-basics-warmup.html": "January 15, 2026",
    "banking-basics-warmup.html": "January 27, 2026",
    "career-basics-warmup.html": "February 24, 2026",
    "workplace-basics-warmup.html": "February 26, 2026",
    "transportation-basics-warmup.html": "March 3, 2026",
    "healthcare-basics-warmup.html": "April 14, 2026",
    "wellness-basics-warmup.html": "May 12, 2026",
}

def update_css(content: str) -> str:
    """Update CSS to use new header layout."""

    # Remove old header-left and header-right styles
    content = re.sub(
        r'\.header \{[^}]+\}',
        r'''.header {
      border-bottom: 2px solid var(--ink);
      padding-bottom: 8px;
      margin-bottom: 16px;
    }''',
        content,
        count=1
    )

    # Remove .header-left h1 style and add .header h1 style
    content = re.sub(
        r'\.header-left h1 \{[^}]+\}',
        r'''.header h1 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }''',
        content,
        count=1
    )

    # Replace .header-right with .header-fields
    content = re.sub(
        r'\.header-right \{[^}]+\}',
        r'''.header-fields {
      display: flex;
      gap: 32px;
      font-size: 13px;
    }''',
        content,
        count=1
    )

    return content

def update_html_structure(content: str, filename: str) -> str:
    """Update HTML header structure and add date if needed."""

    # Check if this is a basics worksheet that needs a date added
    needs_date = filename in BASICS_DATES

    # More flexible pattern that handles both compact and multi-line formats
    # This pattern handles optional whitespace and newlines between elements
    pattern = r'<header\s+class="header">\s*<div\s+class="header-left">\s*<h1>(.*?)</h1>\s*</div>\s*<div\s+class="header-right">(.*?)</div>\s*</header>'

    def replace_header(match):
        title = match.group(1).strip()
        header_right_content = match.group(2)

        # Check if there's already a date field
        has_date = '<label>Date</label>' in header_right_content

        # Extract existing date if present
        existing_date = None
        if has_date:
            date_match = re.search(r'<span\s+class="date-value">(.*?)</span>', header_right_content)
            if date_match:
                existing_date = date_match.group(1).strip()

        # Determine what date to use
        if needs_date:
            date_value = BASICS_DATES[filename]
        elif existing_date:
            date_value = existing_date
        else:
            date_value = None

        # Build the new header
        if date_value:
            date_field = f'''
        <div class="field">
          <label>Date</label>
          <span class="date-value">{date_value}</span>
        </div>'''
        else:
            date_field = ''

        return f'''<header class="header">
      <h1>{title}</h1>
      <div class="header-fields">
        <div class="field">
          <label>Name</label>
          <div class="field-line" style="width: 160px;"></div>
        </div>{date_field}
      </div>
    </header>'''

    # Try to replace using the pattern
    new_content = re.sub(pattern, replace_header, content, flags=re.DOTALL)

    return new_content

def process_worksheet(file_path: Path):
    """Process a single worksheet file."""
    print(f"Processing {file_path.name}...")

    content = file_path.read_text(encoding='utf-8')

    # Update CSS
    content = update_css(content)

    # Update HTML structure and add date if needed
    new_content = update_html_structure(content, file_path.name)

    # Check if anything changed
    if new_content == content:
        print(f"  ⚠ No changes made (pattern didn't match)")
    else:
        # Write back
        file_path.write_text(new_content, encoding='utf-8')

        if file_path.name in BASICS_DATES:
            print(f"  ✓ Added date: {BASICS_DATES[file_path.name]}")
        else:
            print(f"  ✓ Updated header layout")

def main():
    # Find all HTML worksheets
    worksheets_dir = Path("worksheets")
    html_files = list(worksheets_dir.glob("**/*.html"))

    print(f"Found {len(html_files)} worksheets to update\n")

    for file_path in sorted(html_files):
        process_worksheet(file_path)

    print(f"\n✓ Finished processing all {len(html_files)} worksheets!")

if __name__ == "__main__":
    main()
