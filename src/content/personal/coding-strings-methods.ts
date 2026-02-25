import type { InteractiveGuideContent } from "@/types/activity";

export const codingStringsMethodsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Strings & String Methods: Text Mastery",
            icon: "📝",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Strings are everywhere in programming - usernames, messages, URLs, file paths. Master string manipulation and you'll handle text like a pro!</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul>
                    <li>String basics and template literals</li>
                    <li>Accessing characters and length</li>
                    <li>Searching within strings</li>
                    <li>Transforming and manipulating text</li>
                    <li>Splitting and joining strings</li>
                </ul>
            `,
            exercises: [
                {
                    id: "csm-intro-1",
                    title: "String Basics",
                    instructions: "Which creates a valid string?",
                    items: [
                        {
                            type: "radio",
                            label: "Valid string declaration:",
                            options: [
                                { value: "valid", label: "const name = 'Alice';" },
                                { value: "invalid", label: "const name = Alice;" },
                            ],
                            expectedAnswer: "valid",
                        },
                    ],
                },
            ],
        },

        // String Basics
        {
            id: "string-basics",
            stepNumber: 1,
            title: "String Fundamentals",
            icon: "🔤",
            explanation: `
                <h3>Three Ways to Create Strings</h3>
                <p>JavaScript gives you three quote styles. Template literals (backticks) are the most powerful!</p>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin: 0 0 0.5rem 0;">Single Quotes</h4>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem;">'Hello World'</code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin: 0 0 0.5rem 0;">Double Quotes</h4>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem;">"Hello World"</code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin: 0 0 0.5rem 0;">Template Literals ⭐</h4>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem;">\`Hello \${name}\`</code>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📏 String Length & Indexing",
                    description: "Access characters and get string length",
                    examples: [
                        {
                            sentence: "const str = 'Hello'; str.length // 5",
                            explanation: "The length property gives the number of characters.",
                        },
                        {
                            sentence: "'Hello'[0] // 'H'",
                            explanation: "Access individual characters by index (0-based).",
                        },
                        {
                            sentence: "'Hello'[4] // 'o' (last character)",
                            explanation: "Index 4 is the 5th character.",
                        },
                        {
                            sentence: "'Hello'.at(-1) // 'o' (modern way)",
                            explanation: "The at() method supports negative indices!",
                        },
                    ],
                },
                {
                    title: "✨ Template Literals (Backticks)",
                    description: "The modern way to work with strings",
                    examples: [
                        {
                            sentence: "`Hello, ${name}!`",
                            explanation: "Embed variables with ${...} - no more string concatenation!",
                        },
                        {
                            sentence: "`Total: $${price * quantity}`",
                            explanation: "You can put any expression inside ${}.",
                        },
                        {
                            sentence: "`Line 1\nLine 2`",
                            explanation: "Template literals preserve line breaks naturally.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "csm-basics-1",
                    title: "String Access",
                    instructions: "What do these expressions return?",
                    items: [
                        {
                            type: "text",
                            label: "'JavaScript'.length",
                            correctAnswer: "10",
                            expectedAnswers: ["10"],
                        },
                        {
                            type: "text",
                            label: "'Code'[0]",
                            correctAnswer: "C",
                            expectedAnswers: ["C", "'C'"],
                        },
                        {
                            type: "text",
                            label: "'Hello'.at(-1)",
                            correctAnswer: "o",
                            expectedAnswers: ["o", "'o'"],
                        },
                    ],
                },
            ],
        },

        // Search Methods
        {
            id: "search-methods",
            stepNumber: 2,
            title: "Searching in Strings",
            icon: "🔍",
            explanation: `
                <h3>Find What You're Looking For</h3>
                <p>These methods help you search within strings - essential for validation and parsing!</p>
            `,
            verbTable: {
                title: "String Search Methods",
                headers: ["Method", "Returns", "Example", "Result"],
                rows: [
                    ["includes()", "boolean", "'hello'.includes('ell')", "true"],
                    ["startsWith()", "boolean", "'hello'.startsWith('he')", "true"],
                    ["endsWith()", "boolean", "'hello'.endsWith('lo')", "true"],
                    ["indexOf()", "number (-1 if not found)", "'hello'.indexOf('l')", "2"],
                    ["lastIndexOf()", "number", "'hello'.lastIndexOf('l')", "3"],
                    ["search()", "number (supports regex)", "'hello'.search(/l/)", "2"],
                ],
            },
            usageMeanings: [
                {
                    title: "✅ includes() - Check if Contains",
                    description: "Returns true/false - most common search method",
                    examples: [
                        {
                            sentence: "'JavaScript'.includes('Script') // true",
                            explanation: "Case-sensitive search.",
                        },
                        {
                            sentence: "email.includes('@') // validate email has @",
                            explanation: "Simple validation check.",
                        },
                        {
                            sentence: "'Hello'.includes('hello') // false",
                            explanation: "Remember: case-sensitive!",
                        },
                    ],
                },
                {
                    title: "🎯 startsWith() / endsWith()",
                    description: "Check the beginning or end of a string",
                    examples: [
                        {
                            sentence: "url.startsWith('https://') // secure URL?",
                            explanation: "Check URL protocol.",
                        },
                        {
                            sentence: "filename.endsWith('.pdf') // is it a PDF?",
                            explanation: "Check file extension.",
                        },
                        {
                            sentence: "'Hello'.startsWith('He') // true",
                            explanation: "Checks from the start.",
                        },
                    ],
                },
                {
                    title: "📍 indexOf() - Find Position",
                    description: "Get the index where a substring starts",
                    examples: [
                        {
                            sentence: "'hello'.indexOf('l') // 2 (first occurrence)",
                            explanation: "Returns the first position found.",
                        },
                        {
                            sentence: "'hello'.indexOf('x') // -1 (not found)",
                            explanation: "Returns -1 if not found - check for this!",
                        },
                        {
                            sentence: "'hello'.lastIndexOf('l') // 3 (last occurrence)",
                            explanation: "Search from the end.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "csm-search-1",
                    title: "Search Methods Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "radio",
                            label: "'JavaScript'.includes('java')",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "false",
                        },
                        {
                            type: "radio",
                            label: "'hello.txt'.endsWith('.txt')",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "true",
                        },
                        {
                            type: "text",
                            label: "'banana'.indexOf('a')",
                            correctAnswer: "1",
                            expectedAnswers: ["1"],
                        },
                    ],
                },
            ],
        },

        // Transform Methods
        {
            id: "transform-methods",
            stepNumber: 3,
            title: "Transforming Strings",
            icon: "🔄",
            explanation: `
                <h3>Change and Clean Text</h3>
                <p>These methods return new strings (strings are immutable - the original never changes).</p>
            `,
            verbTable: {
                title: "String Transform Methods",
                headers: ["Method", "What It Does", "Example", "Result"],
                rows: [
                    ["toUpperCase()", "ALL CAPS", "'hello'.toUpperCase()", "'HELLO'"],
                    ["toLowerCase()", "all lowercase", "'HELLO'.toLowerCase()", "'hello'"],
                    ["trim()", "Remove whitespace", "'  hi  '.trim()", "'hi'"],
                    ["trimStart()", "Remove leading space", "'  hi'.trimStart()", "'hi'"],
                    ["trimEnd()", "Remove trailing space", "'hi  '.trimEnd()", "'hi'"],
                    ["padStart()", "Pad from start", "'5'.padStart(3, '0')", "'005'"],
                    ["padEnd()", "Pad from end", "'5'.padEnd(3, '0')", "'500'"],
                    ["repeat()", "Repeat n times", "'ha'.repeat(3)", "'hahaha'"],
                ],
            },
            usageMeanings: [
                {
                    title: "🔠 Case Conversion",
                    description: "Change between uppercase and lowercase",
                    examples: [
                        {
                            sentence: "username.toLowerCase() === storedUsername.toLowerCase()",
                            explanation: "Case-insensitive comparison.",
                        },
                        {
                            sentence: "title.toUpperCase() // for headings",
                            explanation: "Make text all caps.",
                        },
                    ],
                },
                {
                    title: "✂️ trim() - Remove Whitespace",
                    description: "Essential for cleaning user input!",
                    examples: [
                        {
                            sentence: "'  user@email.com  '.trim() // 'user@email.com'",
                            explanation: "Clean up form input.",
                        },
                        {
                            sentence: "input.trim() || 'default'",
                            explanation: "Trim and provide fallback if empty.",
                        },
                    ],
                },
                {
                    title: "📏 Padding",
                    description: "Add characters to reach a certain length",
                    examples: [
                        {
                            sentence: "'7'.padStart(2, '0') // '07'",
                            explanation: "Format numbers with leading zeros.",
                        },
                        {
                            sentence: "String(month).padStart(2, '0') // '01', '02', etc.",
                            explanation: "Format dates consistently.",
                        },
                        {
                            sentence: "'$'.padEnd(10, '-') // '$---------'",
                            explanation: "Create separator lines.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "csm-transform-1",
                    title: "Transform Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "'  hello  '.trim()",
                            correctAnswer: "hello",
                            expectedAnswers: ["hello", "'hello'"],
                        },
                        {
                            type: "text",
                            label: "'hi'.toUpperCase()",
                            correctAnswer: "HI",
                            expectedAnswers: ["HI", "'HI'"],
                        },
                        {
                            type: "text",
                            label: "'5'.padStart(3, '0')",
                            correctAnswer: "005",
                            expectedAnswers: ["005", "'005'"],
                        },
                    ],
                },
            ],
        },

        // Extract Methods
        {
            id: "extract-methods",
            stepNumber: 4,
            title: "Extracting Substrings",
            icon: "✂️",
            explanation: `
                <h3>Get Parts of a String</h3>
                <p>Extract portions of strings using these methods.</p>

                <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #d97757;">slice() vs substring()</h4>
                    <p style="margin: 0;">Both extract parts of strings, but <strong>slice()</strong> is more flexible - it supports negative indices!</p>
                </div>
            `,
            verbTable: {
                title: "Extraction Methods",
                headers: ["Method", "Syntax", "Example", "Result"],
                rows: [
                    ["slice()", "slice(start, end)", "'Hello'.slice(1, 4)", "'ell'"],
                    ["slice()", "slice(start)", "'Hello'.slice(2)", "'llo'"],
                    ["slice()", "negative index", "'Hello'.slice(-2)", "'lo'"],
                    ["substring()", "substring(start, end)", "'Hello'.substring(1, 4)", "'ell'"],
                    ["charAt()", "charAt(index)", "'Hello'.charAt(0)", "'H'"],
                ],
            },
            usageMeanings: [
                {
                    title: "🔪 slice() - The Swiss Army Knife",
                    description: "Extract any portion of a string",
                    examples: [
                        {
                            sentence: "'JavaScript'.slice(0, 4) // 'Java'",
                            explanation: "From index 0 up to (not including) index 4.",
                        },
                        {
                            sentence: "'JavaScript'.slice(4) // 'Script'",
                            explanation: "From index 4 to the end.",
                        },
                        {
                            sentence: "'JavaScript'.slice(-6) // 'Script'",
                            explanation: "Negative index counts from the end.",
                        },
                        {
                            sentence: "'filename.txt'.slice(0, -4) // 'filename'",
                            explanation: "Remove the last 4 characters (extension).",
                        },
                    ],
                },
                {
                    title: "🎯 Common Patterns",
                    description: "Real-world extraction examples",
                    examples: [
                        {
                            sentence: "url.slice(url.lastIndexOf('/') + 1)",
                            explanation: "Get filename from URL path.",
                        },
                        {
                            sentence: "filename.slice(0, filename.lastIndexOf('.'))",
                            explanation: "Get filename without extension.",
                        },
                        {
                            sentence: "email.slice(0, email.indexOf('@'))",
                            explanation: "Get username from email.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "csm-extract-1",
                    title: "Extraction Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "'JavaScript'.slice(0, 4)",
                            correctAnswer: "Java",
                            expectedAnswers: ["Java", "'Java'"],
                        },
                        {
                            type: "text",
                            label: "'Hello'.slice(-2)",
                            correctAnswer: "lo",
                            expectedAnswers: ["lo", "'lo'"],
                        },
                        {
                            type: "text",
                            label: "'test.js'.slice(0, -3)",
                            correctAnswer: "test",
                            expectedAnswers: ["test", "'test'"],
                        },
                    ],
                },
            ],
        },

        // Regex Basics
        {
            id: "regex-formula",
            stepNumber: 5,
            title: "Regex: Pattern Matching",
            icon: "🔤",
            formula: [
                { text: "/", type: "subject" },
                { text: "pattern", type: "verb" },
                { text: "/flags", type: "other" },
            ],
            explanation: `
                <h3>Regular Expression Formula</h3>
                <p>Regex lets you match patterns in text—emails, URLs, digits, or complex formats. The formula: <code>/pattern/flags</code>. Use <code>test()</code> for boolean, <code>match()</code> for matches.</p>
                <p><strong>Common patterns:</strong> <code>\\d</code> (digit), <code>\\w</code> (word char), <code>[a-z]</code> (range), <code>+</code> (one or more), <code>*</code> (zero or more), <code>^</code>/<code>$</code> (start/end).</p>
            `,
            verbTable: {
                title: "Regex Pattern Quick Reference",
                headers: ["Pattern", "Meaning", "Example"],
                rows: [
                    ["\\d", "Digit 0-9", "/\\d+/ matches '123'"],
                    ["\\w", "Word char (a-z, A-Z, 0-9, _)", "/\\w+/ matches 'hello'"],
                    ["[a-z]", "Character in range", "/[aeiou]/ matches any vowel"],
                    ["+", "One or more", "/\\d+/ matches '42', '1', '999'"],
                    ["*", "Zero or more", "/hi*/ matches 'h', 'hi', 'hiii'"],
                    ["?", "Zero or one", "/colou?r/ matches 'color' or 'colour'"],
                    ["^", "$", "Start, end of string", "/^hello$/ matches exactly 'hello'"],
                ],
            },
            tipBox: {
                title: "Regex Tip",
                content: "Start simple: includes('@') often beats regex for basic email checks. Use regex when you need structured validation (format, length, character set).",
            },
            exercises: [
                {
                    id: "csm-regex-1",
                    title: "Regex Basics",
                    instructions: "What do these match?",
                    items: [
                        {
                            type: "radio",
                            label: "/\\d+/.test('abc123')",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "true",
                        },
                        {
                            type: "text",
                            label: "'hello'.match(/l+/)?.[0] returns?",
                            correctAnswer: "ll",
                            expectedAnswers: ["ll", "'ll'"],
                        },
                    ],
                },
            ],
        },
        // Replace Methods
        {
            id: "replace-methods",
            stepNumber: 6,
            title: "Replacing Content",
            icon: "🔀",
            explanation: `
                <h3>Find and Replace</h3>
                <p>Replace parts of strings with new content. Use regex with replace() for powerful pattern-based replacement.</p>
            `,
            verbTable: {
                title: "Replace Methods",
                headers: ["Method", "What It Does", "Example", "Result"],
                rows: [
                    ["replace()", "Replace first match", "'hello'.replace('l', 'L')", "'heLlo'"],
                    ["replaceAll()", "Replace all matches", "'hello'.replaceAll('l', 'L')", "'heLLo'"],
                ],
            },
            usageMeanings: [
                {
                    title: "🔄 replace() vs replaceAll()",
                    description: "One match vs all matches",
                    examples: [
                        {
                            sentence: "'banana'.replace('a', 'o') // 'bonana'",
                            explanation: "Only replaces the first 'a'.",
                        },
                        {
                            sentence: "'banana'.replaceAll('a', 'o') // 'bonono'",
                            explanation: "Replaces ALL occurrences.",
                        },
                        {
                            sentence: "'hello world'.replace('world', 'there')",
                            explanation: "Simple word replacement.",
                        },
                    ],
                },
                {
                    title: "🎨 Practical Uses",
                    description: "Common replacement patterns",
                    examples: [
                        {
                            sentence: "phone.replaceAll('-', '')",
                            explanation: "Remove dashes from phone number.",
                        },
                        {
                            sentence: "text.replaceAll('\\n', '<br>')",
                            explanation: "Convert newlines to HTML breaks.",
                        },
                        {
                            sentence: "url.replaceAll(' ', '%20')",
                            explanation: "URL encode spaces.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "csm-replace-1",
                    title: "Replace Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "'hello'.replace('l', 'L')",
                            correctAnswer: "heLlo",
                            expectedAnswers: ["heLlo", "'heLlo'"],
                        },
                        {
                            type: "text",
                            label: "'aaa'.replaceAll('a', 'b')",
                            correctAnswer: "bbb",
                            expectedAnswers: ["bbb", "'bbb'"],
                        },
                    ],
                },
            ],
        },

        // Split and Join
        {
            id: "split-join",
            stepNumber: 7,
            title: "Split and Join",
            icon: "🔗",
            explanation: `
                <h3>Convert Between Strings and Arrays</h3>
                <p>split() breaks strings into arrays. join() combines arrays into strings. They're perfect partners!</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">split()</h4>
                        <p style="margin: 0.5rem 0;">String → Array</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.5rem; margin-top: 0.5rem;">
                            'a,b,c'.split(',') // ['a','b','c']
                        </code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">join()</h4>
                        <p style="margin: 0.5rem 0;">Array → String</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.5rem; margin-top: 0.5rem;">
                            ['a','b','c'].join(',') // 'a,b,c'
                        </code>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "✂️ split() - Break Apart",
                    description: "Split a string into an array",
                    examples: [
                        {
                            sentence: "'apple,banana,cherry'.split(',') // ['apple', 'banana', 'cherry']",
                            explanation: "Split on comma delimiter.",
                        },
                        {
                            sentence: "'hello'.split('') // ['h', 'e', 'l', 'l', 'o']",
                            explanation: "Empty string splits into characters.",
                        },
                        {
                            sentence: "'one two three'.split(' ') // ['one', 'two', 'three']",
                            explanation: "Split on spaces to get words.",
                        },
                    ],
                },
                {
                    title: "🔗 join() - Combine",
                    description: "Join array elements into a string",
                    examples: [
                        {
                            sentence: "['a', 'b', 'c'].join('-') // 'a-b-c'",
                            explanation: "Join with a dash.",
                        },
                        {
                            sentence: "['Hello', 'World'].join(' ') // 'Hello World'",
                            explanation: "Join with a space.",
                        },
                        {
                            sentence: "parts.join('') // concatenate without separator",
                            explanation: "Empty string joins directly.",
                        },
                    ],
                },
                {
                    title: "🔥 Common Pattern: Split → Transform → Join",
                    description: "Process each part and reassemble",
                    examples: [
                        {
                            sentence: "'hello world'.split(' ').map(w => w.toUpperCase()).join(' ')",
                            explanation: "Result: 'HELLO WORLD'. Transform each word.",
                        },
                        {
                            sentence: "path.split('/').filter(Boolean).join('/')",
                            explanation: "Remove empty segments from a path.",
                        },
                        {
                            sentence: "name.split('').reverse().join('')",
                            explanation: "Reverse a string.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "csm-splitjoin-1",
                    title: "Split and Join Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "'a-b-c'.split('-').length",
                            correctAnswer: "3",
                            expectedAnswers: ["3"],
                        },
                        {
                            type: "text",
                            label: "['x', 'y', 'z'].join('')",
                            correctAnswer: "xyz",
                            expectedAnswers: ["xyz", "'xyz'"],
                        },
                    ],
                },
            ],
        },

        // Template Literals Advanced
        {
            id: "template-literals",
            stepNumber: 8,
            title: "Template Literals Deep Dive",
            icon: "💫",
            explanation: `
                <h3>Beyond Basic Interpolation</h3>
                <p>Template literals have superpowers you might not know about!</p>
            `,
            usageMeanings: [
                {
                    title: "📝 Multi-line Strings",
                    description: "No more \\n everywhere!",
                    examples: [
                        {
                            sentence: "`Line 1\nLine 2\nLine 3`",
                            explanation: "Just press Enter - line breaks are preserved.",
                        },
                        {
                            sentence: "`\n  <div>\n    <p>Hello</p>\n  </div>\n`",
                            explanation: "Perfect for HTML templates.",
                        },
                    ],
                },
                {
                    title: "🧮 Expressions in ${}",
                    description: "Any JavaScript expression works!",
                    examples: [
                        {
                            sentence: "`${a} + ${b} = ${a + b}`",
                            explanation: "Math inside the template.",
                        },
                        {
                            sentence: "`Status: ${isActive ? 'Active' : 'Inactive'}`",
                            explanation: "Ternary operators work.",
                        },
                        {
                            sentence: "`Items: ${items.join(', ')}`",
                            explanation: "Call methods on values.",
                        },
                    ],
                },
                {
                    title: "🎨 Building HTML",
                    description: "Great for creating markup",
                    examples: [
                        {
                            sentence: "`<a href=\"${url}\">${text}</a>`",
                            explanation: "Dynamic links.",
                        },
                        {
                            sentence: "`<li class=\"${isActive ? 'active' : ''}\">${item}</li>`",
                            explanation: "Conditional classes.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "csm-template-1",
                    title: "Template Literal Practice",
                    instructions: "Given name = 'Alice' and age = 25, what do these produce?",
                    items: [
                        {
                            type: "text",
                            label: "`${name} is ${age}`",
                            correctAnswer: "Alice is 25",
                            expectedAnswers: ["Alice is 25", "'Alice is 25'"],
                        },
                        {
                            type: "text",
                            label: "`${name.toUpperCase()}`",
                            correctAnswer: "ALICE",
                            expectedAnswers: ["ALICE", "'ALICE'"],
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 9,
            title: "Strings Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Template literals (\`\`)</strong> - Best for interpolation and multi-line</li>
                    <li><strong>Search:</strong> includes(), startsWith(), endsWith(), indexOf()</li>
                    <li><strong>Transform:</strong> toUpperCase(), toLowerCase(), trim()</li>
                    <li><strong>Extract:</strong> slice() - supports negative indices!</li>
                    <li><strong>Replace:</strong> replace() for first, replaceAll() for all</li>
                    <li><strong>split()/join()</strong> - Convert between strings and arrays</li>
                    <li><strong>Strings are immutable</strong> - methods return new strings</li>
                </ul>
            `,
            exercises: [
                {
                    id: "csm-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "What does 'hello'.slice(-2) return?",
                            options: [
                                { value: "a", label: "'he'" },
                                { value: "b", label: "'lo'" },
                                { value: "c", label: "'llo'" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which removes whitespace from both ends?",
                            options: [
                                { value: "a", label: "strip()" },
                                { value: "b", label: "trim()" },
                                { value: "c", label: "clean()" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "What does 'a,b,c'.split(',') return?",
                            options: [
                                { value: "a", label: "'abc'" },
                                { value: "b", label: "['a', 'b', 'c']" },
                                { value: "c", label: "['a,b,c']" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },
        {
            id: "practice-cadence-and-outcomes",
            stepNumber: 99,
            title: "Practice Cadence + I Can Now",
            icon: "check-circle",
            explanation: `
                <h3>Standard Practice Cadence</h3>
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> read code -> write code -> debug scenario.</p>
            `,
            exercises: [
                {
                    id: "sm-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence that captures the most important concept from this guide:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "sm-cadence-read",
                    title: "Read Code",
                    instructions: "Practice code reading and explanation.",
                    items: [
                        {
                            type: "text",
                            label: "Find one existing code path in this project related to this lesson and explain what it does in 2-3 sentences:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "sm-cadence-write",
                    title: "Write Code",
                    instructions: "Translate understanding into implementation.",
                    items: [
                        {
                            type: "text",
                            label: "Describe one small code change you would implement using this lesson's concepts and how you would validate it:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "sm-cadence-debug",
                    title: "Debug Scenario",
                    instructions: "Choose the strongest debugging posture.",
                    items: [
                        {
                            type: "radio",
                            label: "If your change fails in review or testing, what is the best first response?",
                            options: [
                                { value: "narrow", label: "Narrow scope, reproduce, and collect evidence before additional edits" },
                                { value: "guess", label: "Apply multiple untracked changes quickly" },
                            ],
                            expectedAnswer: "narrow",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Explain this lesson's core concept clearly to another developer.</li>
                    <li>Read related project code and identify where this concept appears.</li>
                    <li>Implement a small change with a concrete validation plan.</li>
                    <li>Debug issues using a hypothesis-driven process instead of guesswork.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "What's the best way to check if a string contains another string?",
            options: [
                { value: "a", label: "indexOf() === -1" },
                { value: "b", label: "includes()" },
                { value: "c", label: "contains()" },
            ],
            correctAnswer: "b",
            explanation:
                "includes() returns true/false directly and is more readable than checking indexOf() !== -1.",
        },
        {
            id: "q2",
            question: "What does '  hello  '.trim() return?",
            options: [
                { value: "a", label: "'hello'" },
                { value: "b", label: "'  hello'" },
                { value: "c", label: "'hello  '" },
            ],
            correctAnswer: "a",
            explanation:
                "trim() removes whitespace from both the start and end of a string.",
        },
        {
            id: "q3",
            question: "How do you replace ALL occurrences of a substring?",
            options: [
                { value: "a", label: "replace()" },
                { value: "b", label: "replaceAll()" },
                { value: "c", label: "replaceEvery()" },
            ],
            correctAnswer: "b",
            explanation:
                "replaceAll() replaces all occurrences. replace() only replaces the first match.",
        },
        {
            id: "q4",
            question: "What's the advantage of slice() over substring()?",
            options: [
                { value: "a", label: "It's faster" },
                { value: "b", label: "It supports negative indices" },
                { value: "c", label: "It modifies the original string" },
            ],
            correctAnswer: "b",
            explanation:
                "slice() supports negative indices to count from the end, making it more versatile. 'hello'.slice(-2) gives 'lo'.",
        },
        {
            id: "q5",
            question: "Which is the best first step when code does not work as expected?",
            options: [
                { value: "a", label: "Guess and change many things" },
                { value: "b", label: "Reproduce the issue and inspect inputs/output" },
                { value: "c", label: "Delete the whole function" },
            ],
            correctAnswer: "b",
            explanation: "A reliable debugging flow starts by reproducing the problem and checking what data is actually flowing through the code.",
        },
        {
            id: "q6",
            question: "Why are clear variable and function names important?",
            options: [
                { value: "a", label: "They make code easier to read and maintain" },
                { value: "b", label: "They make JavaScript run faster automatically" },
                { value: "c", label: "They remove the need for testing" },
            ],
            correctAnswer: "a",
            explanation: "Readable naming improves collaboration, reduces mistakes, and makes future edits safer.",
        },
        {
            id: "q7",
            question: "What should you do before choosing a complex solution?",
            options: [
                { value: "a", label: "Start with the simplest working approach" },
                { value: "b", label: "Use advanced patterns immediately" },
                { value: "c", label: "Copy code without understanding it" },
            ],
            correctAnswer: "a",
            explanation: "Simple solutions are easier to test, debug, and extend. Complexity should be added only when necessary.",
        },
        {
            id: "q8",
            question: "Which habit best prevents regressions after code changes?",
            options: [
                { value: "a", label: "Run relevant tests or verify key scenarios" },
                { value: "b", label: "Skip validation to save time" },
                { value: "c", label: "Only check visual output" },
            ],
            correctAnswer: "a",
            explanation: "Quick validation of critical paths catches breakages early and keeps the codebase stable.",
        },
        {
            id: "q9",
            question: "When using async code, what is a common reliability practice?",
            options: [
                { value: "a", label: "Handle success and failure paths explicitly" },
                { value: "b", label: "Ignore errors and continue" },
                { value: "c", label: "Assume all network calls always succeed" },
            ],
            correctAnswer: "a",
            explanation: "Async operations can fail; handling errors explicitly prevents silent failures and confusing behavior.",
        },
        {
            id: "q10",
            question: "What makes a mini quiz comprehensive for a coding guide?",
            options: [
                { value: "a", label: "It checks only definitions" },
                { value: "b", label: "It checks concepts, usage, and common mistakes" },
                { value: "c", label: "It contains trick questions only" },
            ],
            correctAnswer: "b",
            explanation: "Comprehensive checks include understanding, practical use, and error recognition, not just memorized terms.",
        },
    ],
};
