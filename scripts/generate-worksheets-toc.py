#!/usr/bin/env python3
"""Generate HTML table of contents for all worksheets."""

import os
import re
from pathlib import Path

worksheets_dir = Path('worksheets')
categories = ['banking', 'grammar', 'health', 'housing', 'other', 'workplace']
worksheet_data = {}

for category in categories:
    category_dir = worksheets_dir / category
    if not category_dir.exists():
        continue
    
    worksheets = []
    for html_file in sorted(category_dir.glob('*.html')):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract title from <title> tag
                title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
                if title_match:
                    title = title_match.group(1).strip()
                    # Remove (ESOL Level 3) suffix if present
                    title = re.sub(r'\s*\(ESOL Level 3\)\s*$', '', title)
                else:
                    # Fallback to filename
                    title = html_file.stem.replace('-', ' ').title()
                
                # Get relative path for link
                relative_path = html_file.relative_to(Path('.'))
                worksheets.append({
                    'title': title,
                    'path': str(relative_path),
                    'filename': html_file.name
                })
        except Exception as e:
            print(f'Error reading {html_file}: {e}')
    
    if worksheets:
        worksheet_data[category] = worksheets

total_count = sum(len(worksheets) for worksheets in worksheet_data.values())

category_names = {
    'banking': 'Banking',
    'grammar': 'Grammar',
    'health': 'Health',
    'housing': 'Housing',
    'other': 'Other',
    'workplace': 'Workplace'
}

# Generate HTML
html_parts = []
html_parts.append('''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Worksheets - Table of Contents</title>
    <style>
        @media print {
            body {
                margin: 0;
                padding: 20px;
            }
            .no-print {
                display: none;
            }
            a {
                color: #000;
                text-decoration: none;
            }
            .worksheet-item {
                page-break-inside: avoid;
                margin-bottom: 10px;
            }
        }
        @media screen {
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                background: #f5f5f5;
            }
            .header {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .controls {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            button {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 10px;
                font-size: 14px;
            }
            button:hover {
                background: #2563eb;
            }
            input {
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-right: 10px;
                width: 300px;
            }
            .worksheet-list {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .worksheet-item {
                padding: 10px;
                border-bottom: 1px solid #e5e5e5;
            }
            .worksheet-item:last-child {
                border-bottom: none;
            }
            a {
                color: #3b82f6;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            .category {
                font-weight: bold;
                color: #666;
                margin-top: 20px;
                margin-bottom: 10px;
                padding-top: 10px;
                border-top: 2px solid #e5e5e5;
                font-size: 18px;
            }
            .category:first-child {
                border-top: none;
                margin-top: 0;
            }
            .worksheet-title {
                font-weight: 500;
            }
            .worksheet-path {
                font-size: 12px;
                color: #999;
                margin-left: 10px;
            }
        }
        h1 {
            margin: 0 0 10px 0;
        }
        .subtitle {
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>All Worksheets - Table of Contents</h1>
        <p class="subtitle">Total: ''' + str(total_count) + ''' worksheets</p>
    </div>

    <div class="controls no-print">
        <label for="baseUrl">Base URL:</label>
        <input type="text" id="baseUrl" value="file:///Users/marlanacreed/Downloads/Projects/ESOL_Teacher_Resources/" placeholder="file:///path/to/worksheets/">
        <button onclick="updateLinks()">Update Links</button>
        <button onclick="window.print()">Print This Page</button>
    </div>

    <div class="worksheet-list">''')

for category in categories:
    if category in worksheet_data:
        html_parts.append(f'        <div class="category">{category_names[category]} ({len(worksheet_data[category])} worksheets)</div>')
        for worksheet in worksheet_data[category]:
            html_parts.append('        <div class="worksheet-item">')
            html_parts.append(f'            <a href="{worksheet["path"]}" class="worksheet-link" data-path="{worksheet["path"]}">')
            html_parts.append(f'                <span class="worksheet-title">{worksheet["title"]}</span>')
            html_parts.append(f'                <span class="worksheet-path">({worksheet["filename"]})</span>')
            html_parts.append('            </a>')
            html_parts.append('        </div>')

html_parts.append('''    </div>

    <script>
        function updateLinks() {
            const baseUrl = document.getElementById('baseUrl').value.trim();
            if (!baseUrl) {
                alert('Please enter a base URL');
                return;
            }
            
            // Ensure baseUrl ends with /
            const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
            
            const links = document.querySelectorAll('.worksheet-link');
            links.forEach(link => {
                const path = link.getAttribute('data-path');
                link.href = base + path;
            });
            
            alert('Links updated!');
        }
        
        // Auto-update links on load
        window.addEventListener('DOMContentLoaded', function() {
            updateLinks();
        });
    </script>
</body>
</html>''')

# Write to file
output_file = Path('print-all-worksheets.html')
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(html_parts))

print(f'Generated {output_file} with {total_count} worksheets')
