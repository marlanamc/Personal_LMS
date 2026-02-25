import type { InteractiveGuideContent } from "@/types/activity";

export const codingArrayMethodMasteryContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Array Method Mastery: Transform Data Like a Pro",
            icon: "🔥",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Array methods are core transformation tools in modern JavaScript. This guide assumes you already know basic arrays/objects and focuses on fluent data-shaping patterns.</p>
                </div>
                <p><strong>Professional note:</strong> Prefer declarative map/filter/reduce over imperative for-loops when transforming data—clearer intent, fewer mutation bugs, and easier testing. Chain methods for readability; break into variables if a chain gets long.</p>
                <h3>What You'll Learn</h3>
                <ul>
                    <li>map() - Transform every element</li>
                    <li>filter() - Keep elements that pass a test</li>
                    <li>reduce() - Combine all elements into one value</li>
                    <li>find(), some(), every() - Search and check</li>
                    <li>Chaining methods together</li>
                    <li>Real-world patterns</li>
                </ul>
            `,
            tipBox: {
                title: "Prerequisite",
                content:
                    "If array indexing, push/pop, or object property access still feels shaky, do Arrays & Objects first. This lesson is the advanced continuation.",
            },
            exercises: [
                {
                    id: "cam-intro-1",
                    title: "Quick Check",
                    instructions: "Which method transforms each element?",
                    items: [
                        {
                            type: "radio",
                            label: "Transform each element:",
                            options: [
                                { value: "map", label: "map()" },
                                { value: "filter", label: "filter()" },
                            ],
                            expectedAnswer: "map",
                        },
                    ],
                },
            ],
        },

        // map()
        {
            id: "map",
            stepNumber: 1,
            title: "map() - Transform Everything",
            icon: "🗺️",
            explanation: `
                <h3>Transform Each Element</h3>
                <p><code>map()</code> creates a new array by applying a function to every element. The original array stays unchanged!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// Extract properties from objects
const users = [{ name: 'Alice' }, { name: 'Bob' }];
const names = users.map(user => user.name);
// ['Alice', 'Bob']

// Original arrays unchanged!
console.log(numbers); // Still [1, 2, 3, 4, 5]</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔄 Basic Transformations",
                    description: "Change each element",
                    examples: [
                        {
                            sentence: "[1, 2, 3].map(x => x * 2) // [2, 4, 6]",
                            explanation: "Double each number.",
                        },
                        {
                            sentence: "['a', 'b'].map(s => s.toUpperCase()) // ['A', 'B']",
                            explanation: "Transform strings.",
                        },
                        {
                            sentence: "prices.map(p => p * 1.1) // Add 10% to each price",
                            explanation: "Calculate new prices.",
                        },
                    ],
                },
                {
                    title: "📦 Object Extraction",
                    description: "Pull out properties",
                    examples: [
                        {
                            sentence: "users.map(u => u.name) // Get all names",
                            explanation: "Extract a single property.",
                        },
                        {
                            sentence: "users.map(u => ({ id: u.id, name: u.name }))",
                            explanation: "Create new objects with selected fields.",
                        },
                        {
                            sentence: "items.map((item, index) => ({ ...item, position: index }))",
                            explanation: "Add index to each object.",
                        },
                    ],
                },
                {
                    title: "⚛️ React Patterns",
                    description: "Render lists from arrays",
                    examples: [
                        {
                            sentence: "items.map(item => <Item key={item.id} {...item} />)",
                            explanation: "Render a component for each item.",
                        },
                        {
                            sentence: "options.map(opt => <option value={opt}>{opt}</option>)",
                            explanation: "Create select options.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Return Something!",
                content:
                    "map() always returns an array the same length as the original. If your callback doesn't return anything, you'll get an array of undefined!",
            },
            exercises: [
                {
                    id: "cam-map-1",
                    title: "map() Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "[1, 2, 3].map(x => x + 10).join(',')",
                            correctAnswer: "11,12,13",
                            expectedAnswers: ["11,12,13"],
                        },
                        {
                            type: "text",
                            label: "['hi', 'bye'].map(s => s.length).join(',')",
                            correctAnswer: "2,3",
                            expectedAnswers: ["2,3"],
                        },
                    ],
                },
            ],
        },

        // filter()
        {
            id: "filter",
            stepNumber: 2,
            title: "filter() - Keep What Passes",
            icon: "🔍",
            explanation: `
                <h3>Keep Elements That Match</h3>
                <p><code>filter()</code> creates a new array with only elements that pass your test (return true).</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Keep only even numbers
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6, 8, 10]

// Keep numbers greater than 5
const big = numbers.filter(n => n > 5);
// [6, 7, 8, 9, 10]

// Filter objects
const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
  { name: 'Carol', active: true }
];
const activeUsers = users.filter(u => u.active);
// [{ name: 'Alice', active: true }, { name: 'Carol', active: true }]</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "✅ Basic Filtering",
                    description: "Keep matching elements",
                    examples: [
                        {
                            sentence: "[1, 2, 3, 4].filter(n => n > 2) // [3, 4]",
                            explanation: "Keep numbers greater than 2.",
                        },
                        {
                            sentence: "['', 'a', 'b'].filter(Boolean) // ['a', 'b']",
                            explanation: "Remove falsy values (empty strings, null, etc.).",
                        },
                        {
                            sentence: "items.filter(item => item.price < 100)",
                            explanation: "Filter by object property.",
                        },
                    ],
                },
                {
                    title: "🚫 Removing Items",
                    description: "Filter out unwanted elements",
                    examples: [
                        {
                            sentence: "todos.filter(t => !t.completed) // Active todos",
                            explanation: "Keep incomplete items.",
                        },
                        {
                            sentence: "users.filter(u => u.id !== deletedId)",
                            explanation: "Remove a specific item by ID.",
                        },
                        {
                            sentence: "items.filter((_, i) => i !== indexToRemove)",
                            explanation: "Remove by index.",
                        },
                    ],
                },
                {
                    title: "🔗 Search & Match",
                    description: "Find matching items",
                    examples: [
                        {
                            sentence: "users.filter(u => u.name.includes(searchTerm))",
                            explanation: "Search by name.",
                        },
                        {
                            sentence: "products.filter(p => p.category === 'electronics')",
                            explanation: "Filter by category.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cam-filter-1",
                    title: "filter() Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "[1, 2, 3, 4, 5].filter(n => n > 3).length",
                            correctAnswer: "2",
                            expectedAnswers: ["2"],
                        },
                        {
                            type: "text",
                            label: "['a', '', 'b', ''].filter(Boolean).length",
                            correctAnswer: "2",
                            expectedAnswers: ["2"],
                        },
                    ],
                },
            ],
        },

        // reduce()
        {
            id: "reduce",
            stepNumber: 3,
            title: "reduce() - Combine Into One",
            icon: "🎯",
            explanation: `
                <h3>The Swiss Army Knife</h3>
                <p><code>reduce()</code> combines all elements into a single value. It's the most powerful (and sometimes confusing) array method!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
// Sum all numbers
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
// 15

// How it works:
// acc=0, curr=1 → 0+1=1
// acc=1, curr=2 → 1+2=3
// acc=3, curr=3 → 3+3=6
// acc=6, curr=4 → 6+4=10
// acc=10, curr=5 → 10+5=15

// Group by property
const people = [
  { name: 'Alice', dept: 'eng' },
  { name: 'Bob', dept: 'sales' },
  { name: 'Carol', dept: 'eng' }
];
const byDept = people.reduce((acc, person) => {
  (acc[person.dept] ??= []).push(person);
  return acc;
}, {});
// { eng: [...], sales: [...] }</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🧮 Basic Reduction",
                    description: "Combine into a single value",
                    examples: [
                        {
                            sentence: "[1, 2, 3].reduce((sum, n) => sum + n, 0) // 6",
                            explanation: "Sum all numbers.",
                        },
                        {
                            sentence: "[2, 3, 4].reduce((prod, n) => prod * n, 1) // 24",
                            explanation: "Multiply all numbers.",
                        },
                        {
                            sentence: "[[1], [2], [3]].reduce((flat, arr) => [...flat, ...arr], []) // [1, 2, 3]",
                            explanation: "Flatten nested arrays.",
                        },
                    ],
                },
                {
                    title: "📊 Building Objects",
                    description: "Reduce to an object",
                    examples: [
                        {
                            sentence: "items.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})",
                            explanation: "Array to object lookup.",
                        },
                        {
                            sentence: "words.reduce((counts, word) => ({ ...counts, [word]: (counts[word] || 0) + 1 }), {})",
                            explanation: "Count occurrences.",
                        },
                    ],
                },
                {
                    title: "🔧 reduce() Anatomy",
                    description: "Understand the parameters",
                    examples: [
                        {
                            sentence: "array.reduce((accumulator, current, index, array) => { }, initialValue)",
                            explanation: "Full signature with all parameters.",
                        },
                        {
                            sentence: "acc - The running result, curr - Current element",
                            explanation: "Most common: just acc and curr.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Always Include Initial Value",
                content:
                    "Always pass an initial value (the second argument). Without it, reduce behaves unexpectedly on empty arrays and single-element arrays.",
            },
            exercises: [
                {
                    id: "cam-reduce-1",
                    title: "reduce() Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "[1, 2, 3, 4].reduce((a, b) => a + b, 0)",
                            correctAnswer: "10",
                            expectedAnswers: ["10"],
                        },
                        {
                            type: "text",
                            label: "[5, 10, 15].reduce((max, n) => n > max ? n : max, 0)",
                            correctAnswer: "15",
                            expectedAnswers: ["15"],
                        },
                    ],
                },
            ],
        },

        // find() and findIndex()
        {
            id: "find",
            stepNumber: 4,
            title: "find() & findIndex() - Locate Elements",
            icon: "🔎",
            explanation: `
                <h3>Find the First Match</h3>
                <p><code>find()</code> returns the first element that passes the test. <code>findIndex()</code> returns its index.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' }
];

// Find user by ID
const user = users.find(u => u.id === 2);
// { id: 2, name: 'Bob' }

// Find index
const index = users.findIndex(u => u.id === 2);
// 1

// Not found returns undefined (find) or -1 (findIndex)
users.find(u => u.id === 999);      // undefined
users.findIndex(u => u.id === 999); // -1</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🎯 find() - Get the Element",
                    description: "Returns the first matching element or undefined",
                    examples: [
                        {
                            sentence: "[1, 2, 3, 4].find(n => n > 2) // 3",
                            explanation: "First number greater than 2.",
                        },
                        {
                            sentence: "users.find(u => u.email === email)",
                            explanation: "Find user by email.",
                        },
                        {
                            sentence: "items.find(i => i.id === id) ?? defaultItem",
                            explanation: "Find or use default.",
                        },
                    ],
                },
                {
                    title: "📍 findIndex() - Get the Position",
                    description: "Returns index of first match or -1",
                    examples: [
                        {
                            sentence: "['a', 'b', 'c'].findIndex(x => x === 'b') // 1",
                            explanation: "Find position of 'b'.",
                        },
                        {
                            sentence: "if (users.findIndex(u => u.id === id) !== -1) { ... }",
                            explanation: "Check if item exists.",
                        },
                    ],
                },
            ],
            verbTable: {
                title: "find vs filter",
                headers: ["Method", "Returns", "Use When"],
                rows: [
                    ["find()", "First match or undefined", "You need ONE item"],
                    ["filter()", "Array of ALL matches", "You need ALL items"],
                    ["findIndex()", "Index of first match or -1", "You need the position"],
                ],
            },
            exercises: [
                {
                    id: "cam-find-1",
                    title: "find() Practice",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "[1, 2, 3, 4, 5].find(n => n > 3)",
                            correctAnswer: "4",
                            expectedAnswers: ["4"],
                        },
                        {
                            type: "text",
                            label: "[1, 2, 3].findIndex(n => n === 2)",
                            correctAnswer: "1",
                            expectedAnswers: ["1"],
                        },
                    ],
                },
            ],
        },

        // some() and every()
        {
            id: "some-every",
            stepNumber: 5,
            title: "some() & every() - Test Arrays",
            icon: "✅",
            explanation: `
                <h3>Check If Elements Pass</h3>
                <p><code>some()</code> returns true if ANY element passes. <code>every()</code> returns true if ALL elements pass.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">some() - At Least One</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
[1, 2, 3].some(n => n > 2)
// true (3 passes)

[1, 2, 3].some(n => n > 5)
// false (none pass)</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">every() - All Must Pass</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
[2, 4, 6].every(n => n % 2 === 0)
// true (all even)

[1, 2, 3].every(n => n > 1)
// false (1 fails)</pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔘 some() - Any Match?",
                    description: "Returns true if at least one element passes",
                    examples: [
                        {
                            sentence: "users.some(u => u.isAdmin) // Any admins?",
                            explanation: "Check if any user is admin.",
                        },
                        {
                            sentence: "items.some(i => i.id === searchId) // Item exists?",
                            explanation: "Check existence without filter.",
                        },
                        {
                            sentence: "errors.some(Boolean) // Any truthy errors?",
                            explanation: "Check if any errors exist.",
                        },
                    ],
                },
                {
                    title: "✅ every() - All Match?",
                    description: "Returns true only if ALL elements pass",
                    examples: [
                        {
                            sentence: "items.every(i => i.valid) // All valid?",
                            explanation: "Validate all items.",
                        },
                        {
                            sentence: "numbers.every(n => n > 0) // All positive?",
                            explanation: "Check a condition on all.",
                        },
                        {
                            sentence: "form.every(field => field.value) // All filled?",
                            explanation: "Form validation.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cam-someevery-1",
                    title: "some() & every()",
                    instructions: "True or false?",
                    items: [
                        {
                            type: "radio",
                            label: "[1, 2, 3].some(n => n > 2)",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "true",
                        },
                        {
                            type: "radio",
                            label: "[1, 2, 3].every(n => n > 2)",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "false",
                        },
                    ],
                },
            ],
        },

        // Chaining Methods
        {
            id: "chaining",
            stepNumber: 6,
            title: "Chaining Methods",
            icon: "⛓️",
            explanation: `
                <h3>Combine Methods for Power</h3>
                <p>Chain methods together for complex transformations in a readable way.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
const products = [
  { name: 'Widget', price: 25, inStock: true },
  { name: 'Gadget', price: 99, inStock: false },
  { name: 'Gizmo', price: 50, inStock: true },
  { name: 'Thing', price: 10, inStock: true }
];

// Get names of affordable in-stock products
const affordable = products
  .filter(p => p.inStock)       // Keep in-stock
  .filter(p => p.price < 50)    // Keep affordable
  .map(p => p.name)             // Get names
  .sort();                       // Alphabetize

// ['Thing', 'Widget']

// Calculate total of in-stock items
const total = products
  .filter(p => p.inStock)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);
// 85</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔗 Common Chains",
                    description: "Frequently used combinations",
                    examples: [
                        {
                            sentence: ".filter().map() // Filter then transform",
                            explanation: "Select items, then extract data.",
                        },
                        {
                            sentence: ".map().filter() // Transform then filter",
                            explanation: "Transform, then filter results.",
                        },
                        {
                            sentence: ".filter().reduce() // Filter then combine",
                            explanation: "Select items, then sum/count.",
                        },
                    ],
                },
                {
                    title: "🎨 Formatting Chains",
                    description: "Keep chains readable",
                    examples: [
                        {
                            sentence: "array\\n  .filter(...)\\n  .map(...)\\n  .sort();",
                            explanation: "One method per line for clarity.",
                        },
                        {
                            sentence: "// Add comments explaining each step",
                            explanation: "Comment complex chains.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "⚡ Performance Tip",
                content:
                    "Each method creates a new array. For huge arrays (10k+ items), consider using a single reduce() instead of chaining, or use lazy evaluation libraries.",
            },
            exercises: [
                {
                    id: "cam-chain-1",
                    title: "Chaining Practice",
                    instructions: "What does this return?",
                    items: [
                        {
                            type: "text",
                            label: "[1, 2, 3, 4, 5].filter(n => n > 2).map(n => n * 2).reduce((a, b) => a + b, 0)",
                            correctAnswer: "24",
                            expectedAnswers: ["24"],
                        },
                    ],
                },
            ],
        },

        // Other Useful Methods
        {
            id: "other-methods",
            stepNumber: 7,
            title: "More Useful Methods",
            icon: "🧰",
            explanation: `
                <h3>Complete Your Toolkit</h3>
                <p>Other methods you'll use often.</p>
            `,
            verbTable: {
                title: "More Array Methods",
                headers: ["Method", "Returns", "Example"],
                rows: [
                    ["flat()", "Flattened array", "[[1], [2]].flat() // [1, 2]"],
                    ["flatMap()", "map + flat", "[1, 2].flatMap(n => [n, n*2])"],
                    ["sort()", "Sorted array (mutates!)", "[3, 1, 2].sort()"],
                    ["reverse()", "Reversed (mutates!)", "[1, 2, 3].reverse()"],
                    ["includes()", "Boolean", "[1, 2].includes(2) // true"],
                    ["indexOf()", "Index or -1", "[1, 2].indexOf(2) // 1"],
                    ["join()", "String", "[1, 2, 3].join('-') // '1-2-3'"],
                    ["slice()", "Subset array", "[1, 2, 3].slice(1) // [2, 3]"],
                ],
            },
            usageMeanings: [
                {
                    title: "📐 flat() & flatMap()",
                    description: "Flatten nested arrays",
                    examples: [
                        {
                            sentence: "[[1, 2], [3, 4]].flat() // [1, 2, 3, 4]",
                            explanation: "Flatten one level.",
                        },
                        {
                            sentence: "[1, 2].flatMap(n => [n, n * 10]) // [1, 10, 2, 20]",
                            explanation: "Map and flatten in one step.",
                        },
                    ],
                },
                {
                    title: "📊 sort()",
                    description: "Sort in place (careful - mutates!)",
                    examples: [
                        {
                            sentence: "[...arr].sort() // Sort copy, not original",
                            explanation: "Spread to avoid mutation.",
                        },
                        {
                            sentence: "arr.sort((a, b) => a - b) // Numeric sort",
                            explanation: "Default sort is alphabetical!",
                        },
                        {
                            sentence: "arr.sort((a, b) => a.name.localeCompare(b.name))",
                            explanation: "Sort objects by property.",
                        },
                    ],
                },
                {
                    title: "🔍 includes() & indexOf()",
                    description: "Simple searches",
                    examples: [
                        {
                            sentence: "if (allowed.includes(value)) { ... }",
                            explanation: "Check if value is in array.",
                        },
                        {
                            sentence: "arr.indexOf(value) !== -1",
                            explanation: "Same check, returns index.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cam-other-1",
                    title: "Other Methods",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: "[[1], [2], [3]].flat().join('')",
                            correctAnswer: "123",
                            expectedAnswers: ["123"],
                        },
                        {
                            type: "radio",
                            label: "[1, 2, 3].includes(2)",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "true",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "Array Methods Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>map()</strong> - Transform each element, same length</li>
                    <li><strong>filter()</strong> - Keep elements that pass test</li>
                    <li><strong>reduce()</strong> - Combine all into one value</li>
                    <li><strong>find()</strong> - Get first match (or undefined)</li>
                    <li><strong>some()</strong> - Any pass? <strong>every()</strong> - All pass?</li>
                    <li><strong>Chain methods</strong> for complex transformations</li>
                    <li><strong>sort() mutates!</strong> Use [...arr].sort()</li>
                    <li>These methods <strong>don't mutate</strong>: map, filter, reduce, find</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cam-summary-1",
                    title: "Final Review",
                    instructions: "Match the method:",
                    items: [
                        {
                            type: "select",
                            label: "Transform each element",
                            options: ["map()", "filter()", "reduce()", "find()"],
                            expectedAnswer: "map()",
                        },
                        {
                            type: "select",
                            label: "Keep matching elements",
                            options: ["map()", "filter()", "reduce()", "find()"],
                            expectedAnswer: "filter()",
                        },
                        {
                            type: "select",
                            label: "Combine into single value",
                            options: ["map()", "filter()", "reduce()", "find()"],
                            expectedAnswer: "reduce()",
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
                    id: "amm-cadence-concept",
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
                    id: "amm-cadence-read",
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
                    id: "amm-cadence-write",
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
                    id: "amm-cadence-debug",
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
            question: "What does map() return?",
            options: [
                { value: "a", label: "A new array with transformed elements" },
                { value: "b", label: "A single value" },
                { value: "c", label: "The first matching element" },
            ],
            correctAnswer: "a",
            explanation:
                "map() creates a new array by applying a function to every element. The new array is always the same length.",
        },
        {
            id: "q2",
            question: "What's the difference between find() and filter()?",
            options: [
                { value: "a", label: "find() returns first match, filter() returns all matches" },
                { value: "b", label: "They're the same" },
                { value: "c", label: "filter() is faster" },
            ],
            correctAnswer: "a",
            explanation:
                "find() stops at the first match and returns the element. filter() checks all elements and returns an array of all matches.",
        },
        {
            id: "q3",
            question: "What does [1,2,3].reduce((a,b) => a+b, 0) return?",
            options: [
                { value: "a", label: "[1, 2, 3]" },
                { value: "b", label: "6" },
                { value: "c", label: "123" },
            ],
            correctAnswer: "b",
            explanation:
                "reduce() accumulates: 0+1=1, 1+2=3, 3+3=6. The second argument (0) is the initial value.",
        },
        {
            id: "q4",
            question: "Which method mutates the original array?",
            options: [
                { value: "a", label: "map()" },
                { value: "b", label: "filter()" },
                { value: "c", label: "sort()" },
            ],
            correctAnswer: "c",
            explanation:
                "sort() and reverse() mutate the original array! Use [...arr].sort() to sort a copy instead.",
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
            question: "reduce((acc, x) => acc + x, 0) on [1,2,3] returns:",
            options: [
                { value: "a", label: "6" },
                { value: "b", label: "[1,2,3]" },
                { value: "c", label: "0" },
            ],
            correctAnswer: "a",
            explanation: "reduce accumulates: 0+1=1, 1+2=3, 3+3=6.",
        },
        {
            id: "q12",
            question: "find() vs filter() for single-match search:",
            options: [
                { value: "a", label: "find() returns first match; filter() returns array of all matches" },
                { value: "b", label: "Both return arrays" },
                { value: "c", label: "filter() stops at first match" },
            ],
            correctAnswer: "a",
            explanation: "find() stops and returns the element; filter() returns all matches. Use find() when you need one result.",
        },
    ],
};
