import type { InteractiveGuideContent } from "@/types/activity";

export const codingOperatorsExpressionsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Operators & Expressions: The Building Blocks",
            icon: "🧮",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Operators are symbols that perform operations on values. Expressions combine values and operators to produce new values. Master these and you'll write cleaner, more powerful code!</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul>
                    <li>Arithmetic operators for math</li>
                    <li>Comparison operators for decisions</li>
                    <li>Logical operators for combining conditions</li>
                    <li>Modern operators like <code>??</code> and <code>?.</code></li>
                </ul>
            `,
            exercises: [
                {
                    id: "coe-intro-1",
                    title: "Quick Check",
                    instructions: "Which of these is an operator?",
                    items: [
                        {
                            type: "radio",
                            label: "Identify the operator:",
                            options: [
                                { value: "plus", label: "+" },
                                { value: "const", label: "const" },
                            ],
                            expectedAnswer: "plus",
                        },
                    ],
                },
            ],
        },

        // Arithmetic Operators
        {
            id: "arithmetic-operators",
            stepNumber: 1,
            title: "Arithmetic Operators",
            icon: "➕",
            explanation: `
                <h3>Math in JavaScript</h3>
                <p>These operators perform mathematical calculations. You'll use them constantly!</p>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.75rem; color: white; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">+</h4>
                        <p style="margin: 0.5rem 0 0 0;">Addition</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.75rem; color: white; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">-</h4>
                        <p style="margin: 0.5rem 0 0 0;">Subtraction</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.25rem; border-radius: 0.75rem; color: white; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">*</h4>
                        <p style="margin: 0.5rem 0 0 0;">Multiplication</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.25rem; border-radius: 0.75rem; color: white; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">/</h4>
                        <p style="margin: 0.5rem 0 0 0;">Division</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.25rem; border-radius: 0.75rem; color: #2b3a4a; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">%</h4>
                        <p style="margin: 0.5rem 0 0 0;">Modulo (remainder)</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 1.25rem; border-radius: 0.75rem; color: #2b3a4a; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">**</h4>
                        <p style="margin: 0.5rem 0 0 0;">Exponentiation</p>
                    </div>
                </div>
            `,
            verbTable: {
                title: "Arithmetic Operators Reference",
                headers: ["Operator", "Name", "Example", "Result"],
                rows: [
                    ["+", "Addition", "5 + 3", "8"],
                    ["-", "Subtraction", "10 - 4", "6"],
                    ["*", "Multiplication", "3 * 4", "12"],
                    ["/", "Division", "15 / 3", "5"],
                    ["%", "Modulo", "17 % 5", "2 (remainder)"],
                    ["**", "Exponentiation", "2 ** 3", "8 (2³)"],
                ],
            },
            usageMeanings: [
                {
                    title: "🔢 Basic Math",
                    description: "Standard arithmetic operations",
                    examples: [
                        {
                            sentence: "const sum = 10 + 5; // 15",
                            explanation: "Addition works as expected.",
                        },
                        {
                            sentence: "const product = 4 * 7; // 28",
                            explanation: "Multiplication uses the asterisk.",
                        },
                        {
                            sentence: "const average = (85 + 90 + 78) / 3; // 84.33...",
                            explanation: "Parentheses control order of operations.",
                        },
                    ],
                },
                {
                    title: "📊 Modulo (Remainder)",
                    description: "Returns the remainder after division - super useful!",
                    examples: [
                        {
                            sentence: "17 % 5 // 2 (17 ÷ 5 = 3 remainder 2)",
                            explanation: "Modulo gives you the leftover after division.",
                        },
                        {
                            sentence: "const isEven = num % 2 === 0;",
                            explanation: "Check if a number is even (remainder 0 when divided by 2).",
                        },
                        {
                            sentence: "const hour12 = hour24 % 12 || 12;",
                            explanation: "Convert 24-hour time to 12-hour format.",
                        },
                    ],
                },
                {
                    title: "⚡ Exponentiation",
                    description: "Raise a number to a power",
                    examples: [
                        {
                            sentence: "2 ** 3 // 8 (2 × 2 × 2)",
                            explanation: "2 to the power of 3.",
                        },
                        {
                            sentence: "const squared = num ** 2;",
                            explanation: "Square a number.",
                        },
                        {
                            sentence: "const cubeRoot = num ** (1/3);",
                            explanation: "Fractional exponents for roots.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "coe-arith-1",
                    title: "Calculate the Results",
                    instructions: "What do these expressions evaluate to?",
                    items: [
                        {
                            type: "text",
                            label: "15 % 4",
                            correctAnswer: "3",
                            expectedAnswers: ["3"],
                        },
                        {
                            type: "text",
                            label: "3 ** 4",
                            correctAnswer: "81",
                            expectedAnswers: ["81"],
                        },
                        {
                            type: "text",
                            label: "20 / 4 + 2",
                            correctAnswer: "7",
                            expectedAnswers: ["7"],
                        },
                    ],
                },
            ],
        },

        // Comparison Operators
        {
            id: "comparison-operators",
            stepNumber: 2,
            title: "Comparison Operators",
            icon: "⚖️",
            explanation: `
                <h3>Comparing Values</h3>
                <p>Comparison operators compare two values and return <code>true</code> or <code>false</code>. Essential for conditions!</p>

                <div class="diagram-surface-light" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: #1f2937;">
                    <h4 style="margin-top: 0; color: #d97757;">⚠️ == vs === (Important!)</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: rgba(255,255,255,0.7); padding: 1rem; border-radius: 0.5rem;">
                            <h5 style="margin: 0 0 0.5rem 0; color: #dc2626;">== (Loose)</h5>
                            <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 0.25rem;">5 == '5' // true 😱</code>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">Converts types before comparing</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.7); padding: 1rem; border-radius: 0.5rem;">
                            <h5 style="margin: 0 0 0.5rem 0; color: #16a34a;">=== (Strict)</h5>
                            <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 0.25rem;">5 === '5' // false ✅</code>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">Compares value AND type</p>
                        </div>
                    </div>
                </div>
            `,
            verbTable: {
                title: "Comparison Operators Reference",
                headers: ["Operator", "Name", "Example", "Result"],
                rows: [
                    ["===", "Strict equality", "5 === 5", "true"],
                    ["!==", "Strict inequality", "5 !== '5'", "true"],
                    ["==", "Loose equality", "5 == '5'", "true (avoid!)"],
                    ["!=", "Loose inequality", "5 != '5'", "false (avoid!)"],
                    ["<", "Less than", "3 < 5", "true"],
                    [">", "Greater than", "10 > 7", "true"],
                    ["<=", "Less than or equal", "5 <= 5", "true"],
                    [">=", "Greater than or equal", "8 >= 10", "false"],
                ],
            },
            tipBox: {
                title: "💡 Always Use === and !==",
                content:
                    "Strict equality (===) is safer and more predictable. It avoids confusing type coercion bugs. Only use == if you specifically need type coercion (rare).",
            },
            usageMeanings: [
                {
                    title: "✅ Strict Equality (===)",
                    description: "Compares both value AND type",
                    examples: [
                        {
                            sentence: "5 === 5 // true",
                            explanation: "Same value, same type.",
                        },
                        {
                            sentence: "5 === '5' // false",
                            explanation: "Different types (number vs string).",
                        },
                        {
                            sentence: "null === undefined // false",
                            explanation: "Different types.",
                        },
                    ],
                },
                {
                    title: "📏 Relational Operators",
                    description: "Compare order/magnitude",
                    examples: [
                        {
                            sentence: "const canVote = age >= 18;",
                            explanation: "Check if age is 18 or higher.",
                        },
                        {
                            sentence: "const isNegative = num < 0;",
                            explanation: "Check if number is negative.",
                        },
                        {
                            sentence: "'apple' < 'banana' // true",
                            explanation: "Strings compare alphabetically.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "coe-comp-1",
                    title: "True or False?",
                    instructions: "What do these comparisons return?",
                    items: [
                        {
                            type: "radio",
                            label: "10 === '10'",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "false",
                        },
                        {
                            type: "radio",
                            label: "10 == '10'",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "true",
                        },
                        {
                            type: "radio",
                            label: "5 >= 5",
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

        // Logical Operators
        {
            id: "logical-operators",
            stepNumber: 3,
            title: "Logical Operators",
            icon: "🔗",
            explanation: `
                <h3>Combining Conditions</h3>
                <p>Logical operators let you combine multiple conditions. They're the backbone of complex decision-making!</p>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">&&</h4>
                        <p style="margin: 0.5rem 0; font-weight: bold;">AND</p>
                        <p style="margin: 0; font-size: 0.9rem;">Both must be true</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">||</h4>
                        <p style="margin: 0.5rem 0; font-weight: bold;">OR</p>
                        <p style="margin: 0; font-size: 0.9rem;">At least one true</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; text-align: center;">
                        <h4 style="margin: 0; font-size: 2rem;">!</h4>
                        <p style="margin: 0.5rem 0; font-weight: bold;">NOT</p>
                        <p style="margin: 0; font-size: 0.9rem;">Flips the value</p>
                    </div>
                </div>
            `,
            verbTable: {
                title: "Logical Operators Truth Table",
                headers: ["A", "B", "A && B", "A || B", "!A"],
                rows: [
                    ["true", "true", "true", "true", "false"],
                    ["true", "false", "false", "true", "false"],
                    ["false", "true", "false", "true", "true"],
                    ["false", "false", "false", "false", "true"],
                ],
            },
            usageMeanings: [
                {
                    title: "&& (AND)",
                    description: "Both conditions must be true",
                    examples: [
                        {
                            sentence: "const canDrive = age >= 16 && hasLicense;",
                            explanation: "Must be old enough AND have a license.",
                        },
                        {
                            sentence: "if (isLoggedIn && isAdmin) { showAdminPanel(); }",
                            explanation: "Both conditions required.",
                        },
                        {
                            sentence: "const valid = name && name.length > 0;",
                            explanation: "Name must exist AND have length.",
                        },
                    ],
                },
                {
                    title: "|| (OR)",
                    description: "At least one condition must be true",
                    examples: [
                        {
                            sentence: "const hasAccess = isAdmin || isOwner;",
                            explanation: "Either role grants access.",
                        },
                        {
                            sentence: "const name = user.name || 'Anonymous';",
                            explanation: "Use default if name is falsy (short-circuit).",
                        },
                        {
                            sentence: "if (isWeekend || isHoliday) { relax(); }",
                            explanation: "Either triggers the action.",
                        },
                    ],
                },
                {
                    title: "! (NOT)",
                    description: "Inverts a boolean value",
                    examples: [
                        {
                            sentence: "const isLoggedOut = !isLoggedIn;",
                            explanation: "Flip true to false, false to true.",
                        },
                        {
                            sentence: "if (!error) { proceed(); }",
                            explanation: "Proceed if there's no error.",
                        },
                        {
                            sentence: "const hasItems = !isEmpty;",
                            explanation: "Invert the condition.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "coe-logic-1",
                    title: "Evaluate the Logic",
                    instructions: "What do these expressions return?",
                    items: [
                        {
                            type: "radio",
                            label: "true && false",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "false",
                        },
                        {
                            type: "radio",
                            label: "true || false",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "true",
                        },
                        {
                            type: "radio",
                            label: "!true",
                            options: [
                                { value: "true", label: "true" },
                                { value: "false", label: "false" },
                            ],
                            expectedAnswer: "false",
                        },
                        {
                            type: "radio",
                            label: "(5 > 3) && (10 < 20)",
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

        // Ternary Operator
        {
            id: "ternary-operator",
            stepNumber: 4,
            title: "Ternary Operator",
            icon: "❓",
            explanation: `
                <h3>Inline Conditionals</h3>
                <p>The ternary operator is a shorthand for <code>if/else</code>. It's perfect for simple conditions!</p>

                <div class="diagram-surface-light" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: #1f2937;">
                    <h4 style="margin-top: 0; color: #2b3a4a;">Syntax</h4>
                    <code style="display: block; background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 0.5rem; font-size: 1.1rem;">
                        condition ? valueIfTrue : valueIfFalse
                    </code>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div class="diagram-surface-dark" style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                        <h5 style="margin: 0 0 0.5rem 0; color: #ef4444;">❌ Without Ternary</h5>
                        <pre style="margin: 0; font-size: 0.9rem;">let status;
if (score >= 60) {
  status = 'Pass';
} else {
  status = 'Fail';
}</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                        <h5 style="margin: 0 0 0.5rem 0; color: #22c55e;">✅ With Ternary</h5>
                        <pre style="margin: 0; font-size: 0.9rem;">const status = score >= 60
  ? 'Pass'
  : 'Fail';</pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📝 Common Uses",
                    description: "Clean, readable conditional assignments",
                    examples: [
                        {
                            sentence: "const greeting = hour < 12 ? 'Good morning' : 'Hello';",
                            explanation: "Choose greeting based on time.",
                        },
                        {
                            sentence: "const fee = isMember ? 0 : 10;",
                            explanation: "Members get free shipping.",
                        },
                        {
                            sentence: "const color = isActive ? 'green' : 'gray';",
                            explanation: "Dynamic styling.",
                        },
                    ],
                },
                {
                    title: "🎨 In JSX/React",
                    description: "Very common in React components",
                    examples: [
                        {
                            sentence: "<button>{isLoading ? 'Loading...' : 'Submit'}</button>",
                            explanation: "Show different button text.",
                        },
                        {
                            sentence: "{isLoggedIn ? <Dashboard /> : <Login />}",
                            explanation: "Render different components.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Don't Over-Nest",
                content:
                    "Avoid nested ternaries like a ? b : c ? d : e. They're hard to read. Use if/else for complex logic instead.",
            },
            exercises: [
                {
                    id: "coe-ternary-1",
                    title: "Write Ternary Expressions",
                    instructions: "What value is assigned?",
                    items: [
                        {
                            type: "text",
                            label: "const result = 10 > 5 ? 'yes' : 'no';",
                            correctAnswer: "yes",
                            expectedAnswers: ["yes", "'yes'"],
                        },
                        {
                            type: "text",
                            label: "const size = items.length === 0 ? 'empty' : 'has items'; // if items = []",
                            correctAnswer: "empty",
                            expectedAnswers: ["empty", "'empty'"],
                        },
                    ],
                },
            ],
        },

        // Nullish Coalescing and Optional Chaining
        {
            id: "modern-operators",
            stepNumber: 5,
            title: "Modern Operators: ?? and ?.",
            icon: "✨",
            explanation: `
                <h3>Handle Missing Values Gracefully</h3>
                <p>These modern operators make dealing with null/undefined much cleaner!</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.5rem;">?? (Nullish Coalescing)</h4>
                        <p>Provide a fallback for <code>null</code> or <code>undefined</code> only</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.5rem; margin-top: 0.5rem;">
                            value ?? defaultValue
                        </code>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.5rem;">?. (Optional Chaining)</h4>
                        <p>Safely access nested properties</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.5rem; margin-top: 0.5rem;">
                            obj?.property?.nested
                        </code>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "?? vs || (Important Difference!)",
                    description: "?? only checks for null/undefined, || checks all falsy values",
                    examples: [
                        {
                            sentence: "0 || 10 // 10 (0 is falsy, so falls back)",
                            explanation: "|| treats 0 as falsy - not always what you want!",
                        },
                        {
                            sentence: "0 ?? 10 // 0 (0 is not null/undefined)",
                            explanation: "?? keeps 0 because it's a real value.",
                        },
                        {
                            sentence: "'' ?? 'default' // '' (empty string kept)",
                            explanation: "?? keeps empty strings too.",
                        },
                        {
                            sentence: "null ?? 'default' // 'default'",
                            explanation: "?? provides fallback for null.",
                        },
                    ],
                },
                {
                    title: "?. (Safe Property Access)",
                    description: "Access nested properties without crashing",
                    examples: [
                        {
                            sentence: "user?.address?.city",
                            explanation: "Returns undefined if user or address is null/undefined, instead of throwing an error.",
                        },
                        {
                            sentence: "users?.[0]?.name",
                            explanation: "Works with array access too.",
                        },
                        {
                            sentence: "obj?.method?.()",
                            explanation: "Safely call methods that might not exist.",
                        },
                    ],
                },
                {
                    title: "🔥 Combining ?? and ?.",
                    description: "They work great together!",
                    examples: [
                        {
                            sentence: "const city = user?.address?.city ?? 'Unknown';",
                            explanation: "Try to get city, fall back to 'Unknown' if missing.",
                        },
                        {
                            sentence: "const count = response?.data?.items?.length ?? 0;",
                            explanation: "Safely get array length or default to 0.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "coe-modern-1",
                    title: "Modern Operators Practice",
                    instructions: "What do these expressions return?",
                    items: [
                        {
                            type: "text",
                            label: "null ?? 'fallback'",
                            correctAnswer: "fallback",
                            expectedAnswers: ["fallback", "'fallback'"],
                        },
                        {
                            type: "text",
                            label: "0 ?? 100",
                            correctAnswer: "0",
                            expectedAnswers: ["0"],
                        },
                        {
                            type: "text",
                            label: "0 || 100",
                            correctAnswer: "100",
                            expectedAnswers: ["100"],
                        },
                    ],
                },
            ],
        },

        // Assignment Operators
        {
            id: "assignment-operators",
            stepNumber: 6,
            title: "Assignment Operators",
            icon: "📥",
            explanation: `
                <h3>Shorthand for Common Updates</h3>
                <p>Assignment operators combine an operation with assignment. They make code cleaner!</p>
            `,
            verbTable: {
                title: "Assignment Operators Reference",
                headers: ["Operator", "Example", "Equivalent To"],
                rows: [
                    ["=", "x = 5", "Assign 5 to x"],
                    ["+=", "x += 3", "x = x + 3"],
                    ["-=", "x -= 2", "x = x - 2"],
                    ["*=", "x *= 4", "x = x * 4"],
                    ["/=", "x /= 2", "x = x / 2"],
                    ["%=", "x %= 3", "x = x % 3"],
                    ["**=", "x **= 2", "x = x ** 2"],
                    ["&&=", "x &&= y", "x = x && y"],
                    ["||=", "x ||= y", "x = x || y"],
                    ["??=", "x ??= y", "x = x ?? y"],
                ],
            },
            usageMeanings: [
                {
                    title: "📈 Increment/Decrement",
                    description: "Common patterns for updating values",
                    examples: [
                        {
                            sentence: "count += 1; // or count++",
                            explanation: "Add 1 to count.",
                        },
                        {
                            sentence: "total -= discount;",
                            explanation: "Subtract discount from total.",
                        },
                        {
                            sentence: "price *= 1.1; // Add 10%",
                            explanation: "Multiply price by 1.1.",
                        },
                    ],
                },
                {
                    title: "🆕 Logical Assignment (ES2021)",
                    description: "Conditional assignment shortcuts",
                    examples: [
                        {
                            sentence: "user.name ||= 'Anonymous';",
                            explanation: "Only assign if name is falsy.",
                        },
                        {
                            sentence: "config.timeout ??= 3000;",
                            explanation: "Only assign if timeout is null/undefined.",
                        },
                        {
                            sentence: "options.enabled &&= validate();",
                            explanation: "Only run validate if enabled is truthy.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "coe-assign-1",
                    title: "Assignment Practice",
                    instructions: "What's the value of x after each operation?",
                    items: [
                        {
                            type: "text",
                            label: "let x = 10; x += 5;",
                            correctAnswer: "15",
                            expectedAnswers: ["15"],
                        },
                        {
                            type: "text",
                            label: "let x = 20; x /= 4;",
                            correctAnswer: "5",
                            expectedAnswers: ["5"],
                        },
                        {
                            type: "text",
                            label: "let x = 3; x **= 2;",
                            correctAnswer: "9",
                            expectedAnswers: ["9"],
                        },
                    ],
                },
            ],
        },

        // Operator Precedence
        {
            id: "operator-precedence",
            stepNumber: 7,
            title: "Operator Precedence",
            icon: "📊",
            explanation: `
                <h3>Order of Operations</h3>
                <p>Just like PEMDAS in math, operators have precedence. Higher precedence runs first!</p>

                <div class="diagram-surface-light" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: #1f2937;">
                    <h4 style="margin-top: 0;">Precedence Order (High to Low)</h4>
                    <ol style="margin: 0; padding-left: 1.5rem;">
                        <li><strong>()</strong> - Parentheses (always first!)</li>
                        <li><strong>** </strong> - Exponentiation</li>
                        <li><strong>* / %</strong> - Multiplication, division, modulo</li>
                        <li><strong>+ -</strong> - Addition, subtraction</li>
                        <li><strong>&lt; &gt; &lt;= &gt;=</strong> - Comparisons</li>
                        <li><strong>=== !==</strong> - Equality</li>
                        <li><strong>&&</strong> - Logical AND</li>
                        <li><strong>||</strong> - Logical OR</li>
                        <li><strong>??</strong> - Nullish coalescing</li>
                        <li><strong>? :</strong> - Ternary</li>
                        <li><strong>= += -=</strong> - Assignment (last!)</li>
                    </ol>
                </div>
            `,
            tipBox: {
                title: "💡 When in Doubt, Use Parentheses!",
                content:
                    "Don't memorize the entire precedence table. Use parentheses () to make your intentions clear. Your future self will thank you!",
            },
            usageMeanings: [
                {
                    title: "🧮 Examples",
                    description: "See precedence in action",
                    examples: [
                        {
                            sentence: "2 + 3 * 4 // 14, not 20",
                            explanation: "Multiplication happens before addition.",
                        },
                        {
                            sentence: "(2 + 3) * 4 // 20",
                            explanation: "Parentheses force addition first.",
                        },
                        {
                            sentence: "true || false && false // true",
                            explanation: "&& has higher precedence than ||.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "coe-precedence-1",
                    title: "Precedence Quiz",
                    instructions: "What do these evaluate to?",
                    items: [
                        {
                            type: "text",
                            label: "2 + 3 * 4",
                            correctAnswer: "14",
                            expectedAnswers: ["14"],
                        },
                        {
                            type: "text",
                            label: "(2 + 3) * 4",
                            correctAnswer: "20",
                            expectedAnswers: ["20"],
                        },
                        {
                            type: "text",
                            label: "10 - 4 / 2",
                            correctAnswer: "8",
                            expectedAnswers: ["8"],
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "Operators Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Arithmetic:</strong> + - * / % ** for math</li>
                    <li><strong>Comparison:</strong> Always use === and !== (strict)</li>
                    <li><strong>Logical:</strong> && (AND), || (OR), ! (NOT)</li>
                    <li><strong>Ternary:</strong> condition ? a : b for inline conditionals</li>
                    <li><strong>??</strong> for null/undefined fallbacks (better than ||)</li>
                    <li><strong>?.</strong> for safe property access</li>
                    <li><strong>Use parentheses</strong> when precedence is unclear!</li>
                </ul>
            `,
            exercises: [
                {
                    id: "coe-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "Which is safer for equality checks?",
                            options: [
                                { value: "strict", label: "===" },
                                { value: "loose", label: "==" },
                            ],
                            expectedAnswer: "strict",
                        },
                        {
                            type: "radio",
                            label: "What does ?? check for?",
                            options: [
                                { value: "nullish", label: "null and undefined only" },
                                { value: "falsy", label: "All falsy values" },
                            ],
                            expectedAnswer: "nullish",
                        },
                        {
                            type: "radio",
                            label: "What does user?.name return if user is null?",
                            options: [
                                { value: "undefined", label: "undefined" },
                                { value: "error", label: "Throws an error" },
                            ],
                            expectedAnswer: "undefined",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "What does 17 % 5 return?",
            options: [
                { value: "a", label: "3.4" },
                { value: "b", label: "2" },
                { value: "c", label: "12" },
            ],
            correctAnswer: "b",
            explanation:
                "The modulo operator % returns the remainder. 17 ÷ 5 = 3 with remainder 2.",
        },
        {
            id: "q2",
            question: "What's the difference between == and ===?",
            options: [
                { value: "a", label: "No difference" },
                { value: "b", label: "=== checks type AND value, == only checks value" },
                { value: "c", label: "== is for numbers, === is for strings" },
            ],
            correctAnswer: "b",
            explanation:
                "=== (strict equality) checks both type and value. == (loose equality) converts types before comparing, which can cause bugs.",
        },
        {
            id: "q3",
            question: "What does 0 ?? 'default' return?",
            options: [
                { value: "a", label: "0" },
                { value: "b", label: "'default'" },
                { value: "c", label: "null" },
            ],
            correctAnswer: "a",
            explanation:
                "?? only falls back for null or undefined. 0 is a valid value, so it's kept.",
        },
        {
            id: "q4",
            question: "What does user?.address?.city do if user is undefined?",
            options: [
                { value: "a", label: "Throws an error" },
                { value: "b", label: "Returns undefined" },
                { value: "c", label: "Returns null" },
            ],
            correctAnswer: "b",
            explanation:
                "Optional chaining (?.) returns undefined instead of throwing an error when accessing properties of null/undefined.",
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
