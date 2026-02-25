import type { InteractiveGuideContent } from "@/types/activity";

export const codingDomManipulationContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "DOM Manipulation: Make Pages Interactive",
            icon: "🌐",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">The DOM (Document Object Model) is how JavaScript sees and interacts with HTML. Master DOM manipulation to build dynamic, interactive websites!</p>
                </div>
                <p><strong>Professional note:</strong> In React/Next.js you rarely touch the DOM directly—use state and components instead. But understanding the DOM helps debug refs, Portals, and integration code.</p>
                <h3>What You'll Learn</h3>
                <ul>
                    <li>What the DOM is and how it works</li>
                    <li>Selecting elements from the page</li>
                    <li>Changing content, styles, and attributes</li>
                    <li>Handling user events (clicks, input, etc.)</li>
                    <li>Creating and removing elements</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cdm-intro-1",
                    title: "DOM Basics",
                    instructions: "What does DOM stand for?",
                    items: [
                        {
                            type: "radio",
                            label: "DOM stands for:",
                            options: [
                                { value: "correct", label: "Document Object Model" },
                                { value: "wrong", label: "Data Object Manager" },
                            ],
                            expectedAnswer: "correct",
                        },
                    ],
                },
            ],
        },

        // What is the DOM
        {
            id: "what-is-dom",
            stepNumber: 1,
            title: "What is the DOM?",
            icon: "🌳",
            explanation: `
                <h3>The DOM is a Tree</h3>
                <p>When a browser loads HTML, it creates a tree structure representing the page. Each HTML element becomes a <strong>node</strong> in this tree.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem;">
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1
        ├── p
        └── div
            └── button</pre>
                </div>

                <p>JavaScript can <strong>read</strong>, <strong>modify</strong>, <strong>add</strong>, and <strong>remove</strong> any part of this tree!</p>
            `,
            usageMeanings: [
                {
                    title: "🔑 The document Object",
                    description: "Your entry point to the DOM",
                    examples: [
                        {
                            sentence: "document.title // The page title",
                            explanation: "Access the <title> element's text.",
                        },
                        {
                            sentence: "document.body // The <body> element",
                            explanation: "Direct access to the body.",
                        },
                        {
                            sentence: "document.URL // Current page URL",
                            explanation: "Get the current URL.",
                        },
                    ],
                },
                {
                    title: "🔗 DOM Relationships",
                    description: "Elements are connected in a family tree",
                    examples: [
                        {
                            sentence: "element.parentElement // The parent",
                            explanation: "Go up the tree.",
                        },
                        {
                            sentence: "element.children // Child elements",
                            explanation: "Get direct children.",
                        },
                        {
                            sentence: "element.nextElementSibling // Next sibling",
                            explanation: "Navigate sideways.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdm-what-1",
                    title: "DOM Understanding",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "The DOM represents HTML as:",
                            options: [
                                { value: "tree", label: "A tree structure" },
                                { value: "list", label: "A flat list" },
                            ],
                            expectedAnswer: "tree",
                        },
                    ],
                },
            ],
        },

        // Selecting Elements
        {
            id: "selecting-elements",
            stepNumber: 2,
            title: "Selecting Elements",
            icon: "🎯",
            explanation: `
                <h3>Find Elements on the Page</h3>
                <p>Before you can modify elements, you need to select them. Here are the main methods:</p>
            `,
            verbTable: {
                title: "Element Selection Methods",
                headers: ["Method", "Returns", "Example"],
                rows: [
                    ["querySelector()", "First match or null", "document.querySelector('.btn')"],
                    ["querySelectorAll()", "NodeList of all matches", "document.querySelectorAll('p')"],
                    ["getElementById()", "Element or null", "document.getElementById('main')"],
                    ["getElementsByClassName()", "Live HTMLCollection", "document.getElementsByClassName('item')"],
                    ["getElementsByTagName()", "Live HTMLCollection", "document.getElementsByTagName('div')"],
                ],
            },
            usageMeanings: [
                {
                    title: "⭐ querySelector() - The Most Useful",
                    description: "Select using any CSS selector - use this most!",
                    examples: [
                        {
                            sentence: "document.querySelector('#header')",
                            explanation: "Select by ID (use #).",
                        },
                        {
                            sentence: "document.querySelector('.btn-primary')",
                            explanation: "Select by class (use .).",
                        },
                        {
                            sentence: "document.querySelector('nav a')",
                            explanation: "Select descendants.",
                        },
                        {
                            sentence: "document.querySelector('[data-id=\"123\"]')",
                            explanation: "Select by attribute.",
                        },
                    ],
                },
                {
                    title: "📋 querySelectorAll() - Get Multiple",
                    description: "Returns all matching elements",
                    examples: [
                        {
                            sentence: "document.querySelectorAll('.card')",
                            explanation: "Get all elements with class 'card'.",
                        },
                        {
                            sentence: "document.querySelectorAll('li')",
                            explanation: "Get all list items.",
                        },
                        {
                            sentence: "const items = document.querySelectorAll('.item'); items.forEach(el => ...)",
                            explanation: "Loop through results with forEach.",
                        },
                    ],
                },
                {
                    title: "🆔 getElementById() - Fast ID Lookup",
                    description: "Fastest way to get an element by ID",
                    examples: [
                        {
                            sentence: "document.getElementById('app')",
                            explanation: "Note: No # symbol needed!",
                        },
                        {
                            sentence: "const form = document.getElementById('signup-form');",
                            explanation: "Returns null if not found.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Best Practice",
                content:
                    "Use querySelector() and querySelectorAll() for most cases - they're flexible and accept any CSS selector. Use getElementById() when you need raw speed for ID lookups.",
            },
            exercises: [
                {
                    id: "cdm-select-1",
                    title: "Selection Practice",
                    instructions: "Choose the right method:",
                    items: [
                        {
                            type: "radio",
                            label: "To select ALL paragraphs, use:",
                            options: [
                                { value: "one", label: "querySelector('p')" },
                                { value: "all", label: "querySelectorAll('p')" },
                            ],
                            expectedAnswer: "all",
                        },
                        {
                            type: "radio",
                            label: "querySelector('.menu') selects by:",
                            options: [
                                { value: "class", label: "Class name" },
                                { value: "id", label: "ID" },
                            ],
                            expectedAnswer: "class",
                        },
                    ],
                },
            ],
        },

        // Modifying Content
        {
            id: "modifying-content",
            stepNumber: 3,
            title: "Modifying Content",
            icon: "✏️",
            explanation: `
                <h3>Change What's on the Page</h3>
                <p>Once you've selected an element, you can change its content.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">textContent</h4>
                        <p style="margin: 0.5rem 0;">Plain text only (safer)</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem;">
                            el.textContent = 'Hello'
                        </code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">innerHTML</h4>
                        <p style="margin: 0.5rem 0;">HTML content (use carefully)</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem;">
                            el.innerHTML = '&lt;strong&gt;Bold&lt;/strong&gt;'
                        </code>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📝 textContent",
                    description: "Set or get plain text - safe from XSS",
                    examples: [
                        {
                            sentence: "element.textContent = 'New text';",
                            explanation: "Replace all text content.",
                        },
                        {
                            sentence: "const text = element.textContent;",
                            explanation: "Read the current text.",
                        },
                        {
                            sentence: "element.textContent = userInput; // Safe!",
                            explanation: "HTML is escaped, preventing XSS attacks.",
                        },
                    ],
                },
                {
                    title: "🏗️ innerHTML",
                    description: "Set or get HTML content",
                    examples: [
                        {
                            sentence: "element.innerHTML = '<p>Paragraph</p>';",
                            explanation: "Insert HTML markup.",
                        },
                        {
                            sentence: "element.innerHTML = ''; // Clear all content",
                            explanation: "Empty an element.",
                        },
                        {
                            sentence: "⚠️ Never use innerHTML with user input!",
                            explanation: "Security risk - could inject malicious scripts.",
                        },
                    ],
                },
                {
                    title: "🔧 Attributes",
                    description: "Get and set HTML attributes",
                    examples: [
                        {
                            sentence: "element.getAttribute('href')",
                            explanation: "Read an attribute.",
                        },
                        {
                            sentence: "element.setAttribute('href', 'https://...')",
                            explanation: "Set an attribute.",
                        },
                        {
                            sentence: "element.id = 'newId'; element.className = 'active';",
                            explanation: "Direct property access for common attributes.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdm-content-1",
                    title: "Content Modification",
                    instructions: "Choose the safer option:",
                    items: [
                        {
                            type: "radio",
                            label: "To safely display user input, use:",
                            options: [
                                { value: "text", label: "textContent" },
                                { value: "html", label: "innerHTML" },
                            ],
                            expectedAnswer: "text",
                        },
                        {
                            type: "radio",
                            label: "To insert HTML markup, use:",
                            options: [
                                { value: "text", label: "textContent" },
                                { value: "html", label: "innerHTML" },
                            ],
                            expectedAnswer: "html",
                        },
                    ],
                },
            ],
        },

        // Styling Elements
        {
            id: "styling-elements",
            stepNumber: 4,
            title: "Changing Styles",
            icon: "🎨",
            explanation: `
                <h3>Style Elements with JavaScript</h3>
                <p>Modify CSS directly or toggle classes for styling.</p>
            `,
            usageMeanings: [
                {
                    title: "🎨 Direct Style Changes",
                    description: "Set inline styles via the style property",
                    examples: [
                        {
                            sentence: "element.style.color = 'red';",
                            explanation: "Change text color.",
                        },
                        {
                            sentence: "element.style.backgroundColor = '#f0f0f0';",
                            explanation: "Note: camelCase, not kebab-case!",
                        },
                        {
                            sentence: "element.style.display = 'none'; // Hide",
                            explanation: "Hide an element.",
                        },
                        {
                            sentence: "element.style.display = ''; // Reset to CSS default",
                            explanation: "Empty string removes inline style.",
                        },
                    ],
                },
                {
                    title: "⭐ classList - The Better Way",
                    description: "Add/remove CSS classes - preferred approach!",
                    examples: [
                        {
                            sentence: "element.classList.add('active');",
                            explanation: "Add a class.",
                        },
                        {
                            sentence: "element.classList.remove('hidden');",
                            explanation: "Remove a class.",
                        },
                        {
                            sentence: "element.classList.toggle('open');",
                            explanation: "Add if missing, remove if present.",
                        },
                        {
                            sentence: "element.classList.contains('active'); // true/false",
                            explanation: "Check if class exists.",
                        },
                        {
                            sentence: "element.classList.replace('old', 'new');",
                            explanation: "Swap one class for another.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 classList vs style",
                content:
                    "Prefer classList for styling! Keep styles in CSS and toggle classes with JS. Direct style changes are harder to maintain and override CSS specificity.",
            },
            exercises: [
                {
                    id: "cdm-style-1",
                    title: "Styling Practice",
                    instructions: "How would you toggle a class?",
                    items: [
                        {
                            type: "radio",
                            label: "Toggle the 'active' class:",
                            options: [
                                { value: "toggle", label: "element.classList.toggle('active')" },
                                { value: "style", label: "element.style.class = 'active'" },
                            ],
                            expectedAnswer: "toggle",
                        },
                        {
                            type: "radio",
                            label: "CSS property 'background-color' in JS becomes:",
                            options: [
                                { value: "camel", label: "backgroundColor" },
                                { value: "kebab", label: "background-color" },
                            ],
                            expectedAnswer: "camel",
                        },
                    ],
                },
            ],
        },

        // Event Handling
        {
            id: "event-handling",
            stepNumber: 5,
            title: "Handling Events",
            icon: "👆",
            explanation: `
                <h3>Respond to User Actions</h3>
                <p>Events are things that happen on the page - clicks, typing, scrolling, etc. Use event listeners to respond!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0;">Basic Syntax</h4>
                    <pre style="margin: 0; font-size: 0.95rem;">
element.addEventListener('click', function(event) {
    // Handle the click
    console.log('Clicked!', event.target);
});</pre>
                </div>
            `,
            verbTable: {
                title: "Common Events",
                headers: ["Event", "Triggers When", "Example Use"],
                rows: [
                    ["click", "Element is clicked", "Button press, link click"],
                    ["input", "Input value changes", "Live search, validation"],
                    ["submit", "Form is submitted", "Form validation"],
                    ["keydown", "Key is pressed", "Keyboard shortcuts"],
                    ["mouseover", "Mouse enters element", "Hover effects"],
                    ["mouseout", "Mouse leaves element", "Undo hover effects"],
                    ["focus", "Element receives focus", "Input field selected"],
                    ["blur", "Element loses focus", "Validation on leave"],
                    ["load", "Resource finished loading", "Image loaded, page ready"],
                    ["scroll", "Element is scrolled", "Infinite scroll, parallax"],
                ],
            },
            usageMeanings: [
                {
                    title: "🎧 addEventListener()",
                    description: "The modern way to handle events",
                    examples: [
                        {
                            sentence: "button.addEventListener('click', handleClick);",
                            explanation: "Attach a click handler.",
                        },
                        {
                            sentence: "input.addEventListener('input', (e) => console.log(e.target.value));",
                            explanation: "Get input value as user types.",
                        },
                        {
                            sentence: "form.addEventListener('submit', (e) => { e.preventDefault(); });",
                            explanation: "Prevent form from refreshing page.",
                        },
                    ],
                },
                {
                    title: "📦 The Event Object",
                    description: "Contains info about the event",
                    examples: [
                        {
                            sentence: "event.target // The element that triggered the event",
                            explanation: "What was clicked, typed in, etc.",
                        },
                        {
                            sentence: "event.preventDefault() // Stop default behavior",
                            explanation: "Prevent form submit, link navigation, etc.",
                        },
                        {
                            sentence: "event.stopPropagation() // Stop bubbling",
                            explanation: "Prevent event from reaching parent elements.",
                        },
                    ],
                },
                {
                    title: "🧹 Removing Listeners",
                    description: "Clean up when needed",
                    examples: [
                        {
                            sentence: "element.removeEventListener('click', handleClick);",
                            explanation: "Must pass the same function reference!",
                        },
                        {
                            sentence: "const controller = new AbortController(); element.addEventListener('click', fn, { signal: controller.signal }); controller.abort();",
                            explanation: "Modern approach with AbortController.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdm-events-1",
                    title: "Event Handling",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "To prevent a form from refreshing the page:",
                            options: [
                                { value: "prevent", label: "event.preventDefault()" },
                                { value: "stop", label: "event.stopForm()" },
                            ],
                            expectedAnswer: "prevent",
                        },
                        {
                            type: "radio",
                            label: "event.target refers to:",
                            options: [
                                { value: "element", label: "The element that triggered the event" },
                                { value: "window", label: "The window object" },
                            ],
                            expectedAnswer: "element",
                        },
                    ],
                },
            ],
        },

        // Creating Elements
        {
            id: "creating-elements",
            stepNumber: 6,
            title: "Creating & Removing Elements",
            icon: "🔨",
            explanation: `
                <h3>Build the DOM Dynamically</h3>
                <p>Create new elements from scratch and add them to the page.</p>
            `,
            usageMeanings: [
                {
                    title: "🏗️ Creating Elements",
                    description: "Build new DOM nodes",
                    examples: [
                        {
                            sentence: "const div = document.createElement('div');",
                            explanation: "Create a new <div> element.",
                        },
                        {
                            sentence: "div.textContent = 'Hello'; div.className = 'card';",
                            explanation: "Set content and attributes.",
                        },
                        {
                            sentence: "const text = document.createTextNode('Hello');",
                            explanation: "Create a text node.",
                        },
                    ],
                },
                {
                    title: "➕ Adding to the DOM",
                    description: "Insert elements into the page",
                    examples: [
                        {
                            sentence: "parent.appendChild(child);",
                            explanation: "Add as last child.",
                        },
                        {
                            sentence: "parent.prepend(child);",
                            explanation: "Add as first child.",
                        },
                        {
                            sentence: "parent.insertBefore(newEl, referenceEl);",
                            explanation: "Insert before a specific element.",
                        },
                        {
                            sentence: "element.after(newEl); element.before(newEl);",
                            explanation: "Insert adjacent to an element.",
                        },
                    ],
                },
                {
                    title: "➖ Removing Elements",
                    description: "Remove elements from the DOM",
                    examples: [
                        {
                            sentence: "element.remove();",
                            explanation: "Remove the element (modern way).",
                        },
                        {
                            sentence: "parent.removeChild(child);",
                            explanation: "Remove via parent (older way).",
                        },
                        {
                            sentence: "element.replaceWith(newElement);",
                            explanation: "Replace with a different element.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdm-create-1",
                    title: "Creating Elements",
                    instructions: "Choose the correct method:",
                    items: [
                        {
                            type: "radio",
                            label: "To create a new <p> element:",
                            options: [
                                { value: "create", label: "document.createElement('p')" },
                                { value: "new", label: "new Element('p')" },
                            ],
                            expectedAnswer: "create",
                        },
                        {
                            type: "radio",
                            label: "To remove an element from the DOM:",
                            options: [
                                { value: "remove", label: "element.remove()" },
                                { value: "delete", label: "delete element" },
                            ],
                            expectedAnswer: "remove",
                        },
                    ],
                },
            ],
        },

        // Event Delegation
        {
            id: "event-delegation",
            stepNumber: 7,
            title: "Event Delegation",
            icon: "🎪",
            explanation: `
                <h3>Handle Many Elements Efficiently</h3>
                <p>Instead of adding listeners to every element, add one listener to a parent and check what was clicked. This is called <strong>event delegation</strong>.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: rgba(239, 68, 68, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #ef4444;">❌ Without Delegation</h4>
                        <pre style="margin: 0; font-size: 0.8rem; color: #1f2937;">
// 100 buttons = 100 listeners!
buttons.forEach(btn => {
  btn.addEventListener('click', handler);
});</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(34, 197, 94, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
                        <h4 style="margin-top: 0; color: #22c55e;">✅ With Delegation</h4>
                        <pre style="margin: 0; font-size: 0.8rem; color: #1f2937;">
// 1 listener handles all!
container.addEventListener('click', (e) => {
  if (e.target.matches('.btn')) handler(e);
});</pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🎯 How It Works",
                    description: "Events bubble up from child to parent",
                    examples: [
                        {
                            sentence: "event.target // The actual clicked element",
                            explanation: "What was directly clicked.",
                        },
                        {
                            sentence: "event.currentTarget // The element with the listener",
                            explanation: "The parent that caught the event.",
                        },
                        {
                            sentence: "if (e.target.matches('button')) { ... }",
                            explanation: "Check if the clicked element matches.",
                        },
                        {
                            sentence: "const button = e.target.closest('button');",
                            explanation: "Find the nearest parent matching selector.",
                        },
                    ],
                },
                {
                    title: "✨ Benefits",
                    description: "Why delegation is powerful",
                    examples: [
                        {
                            sentence: "Less memory - fewer event listeners",
                            explanation: "One listener vs hundreds.",
                        },
                        {
                            sentence: "Works with dynamic content",
                            explanation: "New elements added later are automatically handled!",
                        },
                        {
                            sentence: "Easier cleanup",
                            explanation: "Remove one listener instead of many.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdm-delegation-1",
                    title: "Event Delegation",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "Event delegation means:",
                            options: [
                                { value: "parent", label: "Listen on parent, handle child events" },
                                { value: "child", label: "Listen on every child element" },
                            ],
                            expectedAnswer: "parent",
                        },
                        {
                            type: "radio",
                            label: "e.target.closest('button') returns:",
                            options: [
                                { value: "nearest", label: "Nearest ancestor matching 'button'" },
                                { value: "all", label: "All button elements" },
                            ],
                            expectedAnswer: "nearest",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "DOM Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>DOM</strong> = Document Object Model - tree of HTML elements</li>
                    <li><strong>querySelector()</strong> - Select with CSS selectors (use most!)</li>
                    <li><strong>textContent</strong> vs <strong>innerHTML</strong> - text is safer</li>
                    <li><strong>classList</strong> - Add/remove/toggle CSS classes</li>
                    <li><strong>addEventListener()</strong> - Handle clicks, input, etc.</li>
                    <li><strong>event.preventDefault()</strong> - Stop default behavior</li>
                    <li><strong>createElement()</strong> + <strong>appendChild()</strong> - Build DOM dynamically</li>
                    <li><strong>Event delegation</strong> - Listen on parent, more efficient</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cdm-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "Select element by ID:",
                            options: [
                                { value: "query", label: "querySelector('#myId')" },
                                { value: "class", label: "querySelector('.myId')" },
                            ],
                            expectedAnswer: "query",
                        },
                        {
                            type: "radio",
                            label: "Add a class to an element:",
                            options: [
                                { value: "add", label: "element.classList.add('active')" },
                                { value: "set", label: "element.class = 'active'" },
                            ],
                            expectedAnswer: "add",
                        },
                        {
                            type: "radio",
                            label: "Remove an element from the page:",
                            options: [
                                { value: "remove", label: "element.remove()" },
                                { value: "hide", label: "element.style.display = 'none'" },
                            ],
                            expectedAnswer: "remove",
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
                    id: "dm-cadence-concept",
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
                    id: "dm-cadence-read",
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
                    id: "dm-cadence-write",
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
                    id: "dm-cadence-debug",
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
            question: "What does querySelector('.menu') select?",
            options: [
                { value: "a", label: "Element with id='menu'" },
                { value: "b", label: "First element with class='menu'" },
                { value: "c", label: "All elements with class='menu'" },
            ],
            correctAnswer: "b",
            explanation:
                "The dot (.) indicates a class selector. querySelector returns only the FIRST match. Use querySelectorAll for all matches.",
        },
        {
            id: "q2",
            question: "Which is safer for displaying user input?",
            options: [
                { value: "a", label: "innerHTML" },
                { value: "b", label: "textContent" },
                { value: "c", label: "Both are equally safe" },
            ],
            correctAnswer: "b",
            explanation:
                "textContent escapes HTML, preventing XSS attacks. innerHTML renders HTML, which is dangerous with user input.",
        },
        {
            id: "q3",
            question: "What does event.preventDefault() do?",
            options: [
                { value: "a", label: "Stops the event completely" },
                { value: "b", label: "Stops the default browser behavior" },
                { value: "c", label: "Removes the event listener" },
            ],
            correctAnswer: "b",
            explanation:
                "preventDefault() stops default behavior (like form submission or link navigation) but the event still fires and bubbles.",
        },
        {
            id: "q4",
            question: "Why use event delegation?",
            options: [
                { value: "a", label: "It's required for click events" },
                { value: "b", label: "Better performance and handles dynamic content" },
                { value: "c", label: "It looks more professional" },
            ],
            correctAnswer: "b",
            explanation:
                "Event delegation uses fewer listeners (better memory) and automatically works with elements added later.",
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
        {
            id: "q11",
            question: "querySelector('.btn') vs querySelectorAll('.btn') returns:",
            options: [
                { value: "a", label: "querySelector: first match; querySelectorAll: NodeList of all" },
                { value: "b", label: "Both return arrays" },
                { value: "c", label: "querySelector: all; querySelectorAll: first" },
            ],
            correctAnswer: "a",
            explanation: "querySelector returns the first matching element or null; querySelectorAll returns a NodeList of all matches.",
        },
        {
            id: "q12",
            question: "addEventListener vs inline onclick:",
            options: [
                { value: "a", label: "addEventListener allows multiple handlers; inline is one only" },
                { value: "b", label: "No difference" },
                { value: "c", label: "Inline is preferred for accessibility" },
            ],
            correctAnswer: "a",
            explanation: "addEventListener supports multiple handlers and is preferred for separation of concerns and cleanup.",
        },
    ],
};
