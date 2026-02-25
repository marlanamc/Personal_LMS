import type { InteractiveGuideContent } from "@/types/activity";

export const codingVariablesTypesContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "JavaScript Variables & Data Types: The Foundation",
            icon: "🏗️",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Variables are containers for storing data. Data types define what kind of data you can store. Master these fundamentals and you'll understand everything else in programming!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Every program you write will use variables and data types. Understanding how they work is essential for writing correct, efficient code.</p>
            `,
            exercises: [
                {
                    id: "cvt-intro-1",
                    title: "Quick Check: Variable Basics",
                    instructions: "Which statement correctly declares a variable?",
                    items: [
                        {
                            type: "radio",
                            label: "Which is valid JavaScript?",
                            options: [
                                { value: "valid", label: "const name = 'John';" },
                                { value: "invalid", label: "5 = name;" },
                            ],
                            expectedAnswer: "valid",
                        },
                        {
                            type: "radio",
                            label: "Which declares a constant?",
                            options: [
                                { value: "const", label: "const PI = 3.14;" },
                                { value: "let", label: "let PI = 3.14;" },
                            ],
                            expectedAnswer: "const",
                        },
                    ],
                },
            ],
        },

        // Declaring Variables
        {
            id: "declaring-variables",
            stepNumber: 1,
            title: "Declaring Variables: const, let, var",
            icon: "📝",
            explanation: `
                <h3>Three Ways to Declare Variables</h3>
                <p>JavaScript gives you three keywords to declare variables. Modern code prefers <strong>const</strong> and <strong>let</strong>.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.25rem;">⭐ const</h4>
                        <p style="margin: 0.5rem 0;"><strong>Can Reassign:</strong> ❌ No</p>
                        <p style="margin: 0.5rem 0;"><strong>Block Scope:</strong> ✅ Yes</p>
                        <p style="margin: 0.5rem 0; font-size: 0.9rem;">Use first! Prevents accidents</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.25rem;">🔄 let</h4>
                        <p style="margin: 0.5rem 0;"><strong>Can Reassign:</strong> ✅ Yes</p>
                        <p style="margin: 0.5rem 0;"><strong>Block Scope:</strong> ✅ Yes</p>
                        <p style="margin: 0.5rem 0; font-size: 0.9rem;">When you need to change values</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.5rem; border-radius: 0.75rem; color: #2b3a4a;">
                        <h4 style="margin-top: 0; font-size: 1.25rem;">⚠️ var</h4>
                        <p style="margin: 0.5rem 0;"><strong>Can Reassign:</strong> ✅ Yes</p>
                        <p style="margin: 0.5rem 0;"><strong>Block Scope:</strong> ❌ No</p>
                        <p style="margin: 0.5rem 0; font-size: 0.9rem;">Old code - avoid! Confusing.</p>
                    </div>
                </div>
            `,
            verbTable: {
                title: "Variable Declaration Keywords",
                headers: ["Keyword", "Can Be Reassigned?", "Has Block Scope?", "Use Case"],
                rows: [
                    ["const", "No", "Yes", "Default choice - values that won't change"],
                    ["let", "Yes", "Yes", "Values that will change - use when const won't work"],
                    ["var", "Yes", "No (function scope)", "Old code - avoid in modern JavaScript"],
                ],
            },
            usageMeanings: [
                {
                    title: "📌 const: Prevent Accidental Changes",
                    description: "Use const by default for everything",
                    examples: [
                        {
                            sentence: "const PI = 3.14159;",
                            explanation:
                                "PI will never change. If you try to reassign it, JavaScript throws an error. This prevents bugs!",
                        },
                        {
                            sentence: "const user = { name: 'Alice', age: 25 };",
                            explanation:
                                "Even with const, you can modify object properties (user.name = 'Bob'). You just can't reassign the variable itself.",
                        },
                        {
                            sentence: "const colors = ['red', 'blue']; colors.push('green');",
                            explanation:
                                "With const arrays, you can modify contents but not reassign. Very useful for preventing mistakes!",
                        },
                    ],
                },
                {
                    title: "🔄 let: For Values That Change",
                    description: "Use when you need to reassign",
                    examples: [
                        {
                            sentence: "let count = 0; count++;",
                            explanation:
                                "Count changes with each increment. let allows reassignment.",
                        },
                        {
                            sentence: "let message = 'Hello'; if (true) { message = 'Hi'; }",
                            explanation:
                                "let has block scope - the variable is only available within { }.",
                        },
                        {
                            sentence: "let total = 0; for (let i = 1; i <= 5; i++) { total += i; }",
                            explanation:
                                "Perfect for loop counters. Each iteration i is a fresh variable in block scope.",
                        },
                    ],
                },
                {
                    title: "⚠️ var: Old-School (Avoid This)",
                    description: "Historical JavaScript - don't use in new code",
                    examples: [
                        {
                            sentence: "var name = 'John';",
                            explanation:
                                "This works but var is outdated. Use const/let instead.",
                        },
                        {
                            sentence: "if (true) { var x = 5; } console.log(x); // 5",
                            explanation:
                                "var doesn't have block scope - it bleeds out. This causes bugs! Use let instead.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cvt-declare-1",
                    title: "Choose the Right Keyword",
                    instructions: "Select const, let, or var for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Storing a username that won't change",
                            options: [
                                { value: "const", label: "const" },
                                { value: "let", label: "let" },
                                { value: "var", label: "var" },
                            ],
                            expectedAnswer: "const",
                        },
                        {
                            type: "radio",
                            label: "A counter that increments in a loop",
                            options: [
                                { value: "const", label: "const" },
                                { value: "let", label: "let" },
                                { value: "var", label: "var" },
                            ],
                            expectedAnswer: "let",
                        },
                        {
                            type: "radio",
                            label: "Mathematical constants like PI",
                            options: [
                                { value: "const", label: "const" },
                                { value: "let", label: "let" },
                                { value: "var", label: "var" },
                            ],
                            expectedAnswer: "const",
                        },
                    ],
                },
                {
                    id: "cvt-declare-2",
                    title: "Spot the Declaration Errors",
                    instructions: "Which of these will cause an error?",
                    items: [
                        {
                            type: "radio",
                            label: "const PI = 3.14; PI = 3.15;",
                            options: [
                                { value: "error", label: "Error - can't reassign const" },
                                { value: "ok", label: "OK - works fine" },
                            ],
                            expectedAnswer: "error",
                        },
                        {
                            type: "radio",
                            label: "let x = 5; let x = 10;",
                            options: [
                                { value: "error", label: "Error - can't redeclare" },
                                { value: "ok", label: "OK - works fine" },
                            ],
                            expectedAnswer: "error",
                        },
                    ],
                },
            ],
        },

        // Data Types
        {
            id: "data-types",
            stepNumber: 2,
            title: "JavaScript Data Types",
            icon: "🎯",
            explanation: `
                <h3>Seven Primitive Data Types (Plus Objects)</h3>
                <p>JavaScript has 7 primitive types and objects. Understanding which type you're using prevents bugs.</p>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0;">🔢 Numbers</h4>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem; margin: 0.5rem 0;">42, 3.14, Infinity, NaN</code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0;">📝 Strings</h4>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem; margin: 0.5rem 0;">'hello', "world", \`template\`</code>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.25rem; border-radius: 0.5rem; color: #2b3a4a;">
                        <h4 style="margin-top: 0;">✅ Booleans</h4>
                        <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 0.25rem; margin: 0.5rem 0;">true, false</code>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 1.25rem; border-radius: 0.5rem; color: #2b3a4a;">
                        <h4 style="margin-top: 0;">🚫 null & undefined</h4>
                        <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 0.25rem; margin: 0.5rem 0;">null, undefined</code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0;">🏷️ Symbols</h4>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem; margin: 0.5rem 0;">Symbol('id')</code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0;">📦 Objects & Arrays</h4>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem; margin: 0.5rem 0;">{}, [], functions</code>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔢 Numbers",
                    description: "All numbers - integers and decimals",
                    examples: [
                        {
                            sentence: "const age = 25;",
                            explanation:
                                "Integer. JavaScript doesn't distinguish between int and float.",
                        },
                        {
                            sentence: "const price = 19.99;",
                            explanation: "Decimal number. Same type as integers.",
                        },
                        {
                            sentence: "const result = 1 / 0; // Infinity",
                            explanation:
                                "JavaScript has special values like Infinity and NaN (Not a Number).",
                        },
                    ],
                },
                {
                    title: "📝 Strings",
                    description: "Text data - sequences of characters",
                    examples: [
                        {
                            sentence: "const name = 'Alice'; // Single quotes",
                            explanation: "Single quotes work fine.",
                        },
                        {
                            sentence: 'const greeting = "Hello"; // Double quotes',
                            explanation: "Double quotes also work. Pick one style and be consistent.",
                        },
                        {
                            sentence: "const message = `Hello, ${name}!`; // Template literals",
                            explanation:
                                "Backticks allow ${} for interpolation. Modern and powerful!",
                        },
                    ],
                },
                {
                    title: "✅ Booleans",
                    description: "true or false - used for conditions",
                    examples: [
                        {
                            sentence: "const isLoggedIn = true;",
                            explanation: "Boolean values are true or false (lowercase!).",
                        },
                        {
                            sentence: "const isAdult = age >= 18;",
                            explanation: "Comparisons return booleans.",
                        },
                    ],
                },
                {
                    title: "🚫 null & undefined",
                    description: "Special values for 'no value'",
                    examples: [
                        {
                            sentence: "let value = null; // Intentional emptiness",
                            explanation:
                                "null means you've explicitly set it to nothing. Programmer's intent.",
                        },
                        {
                            sentence: "let unknown; // undefined - never assigned",
                            explanation:
                                "undefined means a variable was declared but never given a value.",
                        },
                    ],
                },
                {
                    title: "🏷️ Symbols",
                    description: "Unique identifiers (advanced - rarely used)",
                    examples: [
                        {
                            sentence: "const id = Symbol('user');",
                            explanation: "Symbols create unique values. Usually not needed for beginners.",
                        },
                    ],
                },
                {
                    title: "🔧 Objects & Arrays",
                    description: "Complex types that hold collections",
                    examples: [
                        {
                            sentence: "const user = { name: 'Alice', age: 25 };",
                            explanation: "Objects store key-value pairs.",
                        },
                        {
                            sentence: "const colors = ['red', 'blue', 'green'];",
                            explanation: "Arrays are objects that store ordered lists.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cvt-types-1",
                    title: "Identify Data Types",
                    instructions: "What data type is each value?",
                    items: [
                        {
                            type: "select",
                            label: "42",
                            options: ["string", "number", "boolean"],
                            expectedAnswer: "number",
                        },
                        {
                            type: "select",
                            label: "'Hello World'",
                            options: ["string", "number", "boolean"],
                            expectedAnswer: "string",
                        },
                        {
                            type: "select",
                            label: "true",
                            options: ["string", "number", "boolean"],
                            expectedAnswer: "boolean",
                        },
                        {
                            type: "select",
                            label: "['a', 'b', 'c']",
                            options: ["array", "object", "both"],
                            expectedAnswer: "both",
                        },
                    ],
                },
                {
                    id: "cvt-types-2",
                    title: "Type Coercion",
                    instructions: "What will this output?",
                    items: [
                        {
                            type: "text",
                            label: "console.log('5' + 3); // What is the result?",
                            correctAnswer: "53",
                            expectedAnswers: ["53", "'53'"],
                        },
                        {
                            type: "text",
                            label: "console.log(5 + 3); // What is the result?",
                            correctAnswer: "8",
                            expectedAnswers: ["8"],
                        },
                    ],
                },
            ],
        },

        // Type Checking
        {
            id: "type-checking",
            stepNumber: 3,
            title: "Checking Data Types",
            icon: "🔍",
            explanation: `
                <h3>How to Know What Type You Have</h3>
                <p>Use typeof operator to check what type a value is. Essential for debugging!</p>
            `,
            usageMeanings: [
                {
                    title: "typeof Operator",
                    description: "Returns a string telling you the type",
                    examples: [
                        {
                            sentence: "typeof 42; // 'number'",
                            explanation: "Returns the string 'number'.",
                        },
                        {
                            sentence: "typeof 'hello'; // 'string'",
                            explanation: "Returns the string 'string'.",
                        },
                        {
                            sentence: "typeof true; // 'boolean'",
                            explanation: "Returns the string 'boolean'.",
                        },
                        {
                            sentence: "typeof [1, 2, 3]; // 'object' (arrays are objects!)",
                            explanation:
                                "Arrays are technically objects in JavaScript. Use Array.isArray() to check specifically for arrays.",
                        },
                        {
                            sentence: "Array.isArray([1, 2, 3]); // true",
                            explanation: "Use Array.isArray() to check if something is an array.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cvt-check-1",
                    title: "Use typeof",
                    instructions: "What will typeof return?",
                    items: [
                        {
                            type: "text",
                            label: "typeof 42",
                            correctAnswer: "number",
                            expectedAnswers: ["number", "'number'"],
                        },
                        {
                            type: "text",
                            label: "typeof 'world'",
                            correctAnswer: "string",
                            expectedAnswers: ["string", "'string'"],
                        },
                        {
                            type: "text",
                            label: "typeof undefined",
                            correctAnswer: "undefined",
                            expectedAnswers: ["undefined", "'undefined'"],
                        },
                    ],
                },
            ],
        },

        // Type Coercion
        {
            id: "type-coercion",
            stepNumber: 4,
            title: "Type Coercion: When Types Convert Automatically",
            icon: "🔄",
            explanation: `
                <h3>JavaScript Converts Types (Sometimes Surprisingly!)</h3>
                <p>JavaScript will try to convert types automatically in certain situations. This can help, but it can also cause bugs!</p>

                <div class="diagram-surface-light" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0; color: #1f2937;">
                    <h4 style="margin-top: 0; color: #d97757;">⚠️ Type Coercion Examples</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: rgba(255,255,255,0.7); padding: 1rem; border-radius: 0.5rem;">
                            <h5 style="margin: 0 0 0.5rem 0; color: #d97757;">String + Number</h5>
                            <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 0.25rem; color: #1f2937;">'5' + 3 = '53'</code>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #1f2937;">Result is STRING!</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.7); padding: 1rem; border-radius: 0.5rem;">
                            <h5 style="margin: 0 0 0.5rem 0; color: #d97757;">Number - String</h5>
                            <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 0.25rem; color: #1f2937;">'10' - 3 = 7</code>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #1f2937;">Result is NUMBER!</p>
                        </div>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "✏️ String Concatenation",
                    description: "Adding a number and string always makes a string",
                    examples: [
                        {
                            sentence: "'5' + 3 // '53' (not 8!)",
                            explanation: "When you add a string to anything, JavaScript converts to string first.",
                        },
                        {
                            sentence: "'Age: ' + age // 'Age: 25'",
                            explanation: "Useful for building messages.",
                        },
                    ],
                },
                {
                    title: "🔢 Math Operations",
                    description: "Most math operations convert to numbers",
                    examples: [
                        {
                            sentence: "'10' - '3' // 7 (math works, not concatenation!)",
                            explanation: "Subtraction converts strings to numbers.",
                        },
                        {
                            sentence: "'10' * 2 // 20",
                            explanation: "Multiplication also converts to numbers.",
                        },
                        {
                            sentence: "'hello' - 5 // NaN (can't convert 'hello' to number)",
                            explanation: "When conversion fails, you get NaN (Not a Number).",
                        },
                    ],
                },
                {
                    title: "⚠️ Equality Coercion",
                    description: "Be careful with == vs ===",
                    examples: [
                        {
                            sentence: "5 == '5' // true (type coercion)",
                            explanation:
                                "== converts types before comparing. Can cause unexpected results!",
                        },
                        {
                            sentence: "5 === '5' // false (strict comparison)",
                            explanation:
                                "=== checks both value AND type. Safer choice!",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Best Practice",
                content:
                    "Always use === and !== instead of == and !=. Strict comparison is safer and prevents bugs from unexpected type conversions.",
            },
            exercises: [
                {
                    id: "cvt-coercion-1",
                    title: "Predict the Output",
                    instructions: "What will these expressions evaluate to?",
                    items: [
                        {
                            type: "text",
                            label: "'10' + 5",
                            correctAnswer: "105",
                            expectedAnswers: ["105", "'105'"],
                        },
                        {
                            type: "text",
                            label: "'10' - 5",
                            correctAnswer: "5",
                            expectedAnswers: ["5"],
                        },
                        {
                            type: "text",
                            label: "true + 1",
                            correctAnswer: "2",
                            expectedAnswers: ["2"],
                        },
                    ],
                },
            ],
        },

        // Common Mistakes
        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Variable & Type Mistakes",
            icon: "⚠️",
            explanation: `
                <h3>Pitfalls to Avoid</h3>
                <p>These mistakes are extremely common when learning JavaScript.</p>
            `,
            usageMeanings: [
                {
                    title: "❌ Reassigning const",
                    description: "const prevents reassignment - this is a feature!",
                    examples: [
                        {
                            sentence: "❌ const x = 5; x = 10; ✓ let x = 5; x = 10;",
                            explanation:
                                "WRONG: const throws an error. CORRECT: Use let if you need to reassign.",
                        },
                    ],
                },
                {
                    title: "❌ Redeclaring with let",
                    description: "Can't redeclare a let variable in same scope",
                    examples: [
                        {
                            sentence: "❌ let x = 5; let x = 10; ✓ let x = 5; x = 10;",
                            explanation:
                                "WRONG: Can't redeclare. CORRECT: Just reassign without 'let'.",
                        },
                    ],
                },
                {
                    title: "❌ Using == Instead of ===",
                    description: "Type coercion can cause unexpected behavior",
                    examples: [
                        {
                            sentence: "❌ if (x == '5') { } ✓ if (x === 5) { }",
                            explanation:
                                "WRONG: == coerces types unpredictably. CORRECT: Use === for safety.",
                        },
                    ],
                },
                {
                    title: "❌ Mutating const Objects",
                    description: "const prevents reassignment, not mutation",
                    examples: [
                        {
                            sentence: "const user = { name: 'Alice' }; user.name = 'Bob'; // OK!",
                            explanation:
                                "This works - you're not reassigning user, just changing a property. const only prevents reassignment.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cvt-mistakes-1",
                    title: "Spot the Error",
                    instructions: "Which code will cause an error?",
                    items: [
                        {
                            type: "radio",
                            label: "Scenario 1:",
                            options: [
                                { value: "error", label: "const x = 5; x = 10;" },
                                { value: "ok", label: "let x = 5; x = 10;" },
                            ],
                            expectedAnswer: "error",
                        },
                        {
                            type: "radio",
                            label: "Scenario 2:",
                            options: [
                                { value: "error", label: "if (0 == false) { }" },
                                { value: "ok", label: "if (0 === false) { }" },
                            ],
                            expectedAnswer: "error",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 6,
            title: "Variables & Types Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Use const by default</strong> - prevents accidental reassignment</li>
                    <li><strong>Use let when you need to reassign</strong></li>
                    <li><strong>Avoid var</strong> - it's outdated and confusing</li>
                    <li><strong>Know the 7 primitive types</strong> - number, string, boolean, null, undefined, symbol, object</li>
                    <li><strong>Use === instead of ==</strong> - strict comparison is safer</li>
                    <li><strong>Be aware of type coercion</strong> - it can surprise you!</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cvt-summary-1",
                    title: "Mixed Review",
                    instructions: "Answer these comprehensive questions.",
                    items: [
                        {
                            type: "radio",
                            label: "Which variable declaration is best?",
                            options: [
                                { value: "const", label: "const name = 'Alice';" },
                                { value: "let", label: "let name = 'Alice';" },
                                { value: "var", label: "var name = 'Alice';" },
                            ],
                            expectedAnswer: "const",
                        },
                        {
                            type: "radio",
                            label: "What will '3' + 2 return?",
                            options: [
                                { value: "a", label: "5" },
                                { value: "b", label: "'32'" },
                                { value: "c", label: "'5'" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "What is typeof []?",
                            options: [
                                { value: "array", label: "'array'" },
                                { value: "object", label: "'object'" },
                                { value: "list", label: "'list'" },
                            ],
                            expectedAnswer: "object",
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
                    id: "vt-cadence-concept",
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
                    id: "vt-cadence-read",
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
                    id: "vt-cadence-write",
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
                    id: "vt-cadence-debug",
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
            question: "What's the difference between let and const?",
            options: [
                { value: "a", label: "const can be reassigned, let cannot" },
                { value: "b", label: "let can be reassigned, const cannot" },
                { value: "c", label: "They're the same thing" },
            ],
            correctAnswer: "b",
            explanation:
                "let allows reassignment. const prevents it. Use const by default, let when you need to change the value.",
        },
        {
            id: "q2",
            question: "What does typeof operator return?",
            options: [
                { value: "a", label: "A number" },
                { value: "b", label: "A string describing the type" },
                { value: "c", label: "A boolean" },
            ],
            correctAnswer: "b",
            explanation: "typeof returns a string. typeof 42 returns 'number', typeof 'hello' returns 'string'.",
        },
        {
            id: "q3",
            question: "What does '5' + 3 evaluate to?",
            options: [
                { value: "a", label: "8" },
                { value: "b", label: "'53'" },
                { value: "c", label: "NaN" },
            ],
            correctAnswer: "b",
            explanation:
                "String concatenation! When you add a string to anything, it becomes a string. '5' + 3 = '53'.",
        },
        {
            id: "q4",
            question: "Is null the same as undefined?",
            options: [
                { value: "a", label: "Yes, they're identical" },
                { value: "b", label: "No - null is intentional, undefined means never assigned" },
                { value: "c", label: "undefined is for objects, null is for primitives" },
            ],
            correctAnswer: "b",
            explanation:
                "null is what you set explicitly. undefined is what JavaScript assigns when you don't give a value. Similar but different!",
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
