import type { InteractiveGuideContent } from "@/types/activity";

export const codingModulesImportsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Modules & Imports: Organize Large Codebases",
            icon: "📦",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Modules let you split code into separate files and share functionality between them. No more giant 5000-line files!</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul>
                    <li>Why modules matter for organization</li>
                    <li>Named exports and imports</li>
                    <li>Default exports</li>
                    <li>Re-exporting and barrel files</li>
                    <li>Dynamic imports for code splitting</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cmi-intro-1",
                    title: "Why Modules?",
                    instructions: "What problem do modules solve?",
                    items: [
                        {
                            type: "radio",
                            label: "Modules help with:",
                            options: [
                                { value: "org", label: "Organizing code into separate files" },
                                { value: "speed", label: "Making code run faster" },
                            ],
                            expectedAnswer: "org",
                        },
                    ],
                },
            ],
        },

        // Why Modules
        {
            id: "why-modules",
            stepNumber: 1,
            title: "Why Use Modules?",
            icon: "🤔",
            explanation: `
                <h3>Problems Without Modules</h3>
                <p>Before modules, all JavaScript shared the global scope. This caused real problems:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: rgba(239, 68, 68, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #ef4444;">❌ Without Modules</h4>
                        <ul style="margin: 0; padding-left: 1rem; font-size: 0.9rem;">
                            <li>Name collisions (two files define 'utils')</li>
                            <li>No clear dependencies</li>
                            <li>Order of script tags matters</li>
                            <li>Hard to maintain large codebases</li>
                        </ul>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(34, 197, 94, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
                        <h4 style="margin-top: 0; color: #22c55e;">✅ With Modules</h4>
                        <ul style="margin: 0; padding-left: 1rem; font-size: 0.9rem;">
                            <li>Each file has its own scope</li>
                            <li>Explicit imports/exports</li>
                            <li>Clear dependency graph</li>
                            <li>Better tooling support</li>
                        </ul>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📁 One File = One Module",
                    description: "Each file is its own isolated module",
                    examples: [
                        {
                            sentence: "// utils.js - this is a module",
                            explanation: "Every .js or .ts file can be a module.",
                        },
                        {
                            sentence: "Variables in utils.js don't leak to other files",
                            explanation: "Module scope keeps things contained.",
                        },
                    ],
                },
                {
                    title: "🔗 Explicit Connections",
                    description: "import/export makes dependencies clear",
                    examples: [
                        {
                            sentence: "import { formatDate } from './utils';",
                            explanation: "Explicitly say what you need from where.",
                        },
                        {
                            sentence: "export function formatDate() { ... }",
                            explanation: "Explicitly say what others can use.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cmi-why-1",
                    title: "Module Benefits",
                    instructions: "Which is true about modules?",
                    items: [
                        {
                            type: "radio",
                            label: "Variables in a module:",
                            options: [
                                { value: "private", label: "Are private unless exported" },
                                { value: "global", label: "Are always global" },
                            ],
                            expectedAnswer: "private",
                        },
                    ],
                },
            ],
        },

        // Named Exports
        {
            id: "named-exports",
            stepNumber: 2,
            title: "Named Exports & Imports",
            icon: "🏷️",
            explanation: `
                <h3>Export Multiple Things</h3>
                <p>Named exports let you export multiple values from a module. Import them by name with curly braces.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0;">math.js</h4>
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.5;">
// Named exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// Or export at the end:
const subtract = (a, b) => a - b;
export { subtract };</pre>
                </div>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0;">main.js</h4>
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.5;">
// Import specific named exports
import { PI, add } from './math.js';

console.log(PI);       // 3.14159
console.log(add(2, 3)); // 5</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📤 Exporting",
                    description: "Two ways to export",
                    examples: [
                        {
                            sentence: "export const value = 42;",
                            explanation: "Inline export - export right where you define.",
                        },
                        {
                            sentence: "const value = 42; export { value };",
                            explanation: "Export at end - define first, export later.",
                        },
                        {
                            sentence: "export { oldName as newName };",
                            explanation: "Rename when exporting.",
                        },
                    ],
                },
                {
                    title: "📥 Importing",
                    description: "Import with curly braces",
                    examples: [
                        {
                            sentence: "import { add, multiply } from './math';",
                            explanation: "Import multiple things at once.",
                        },
                        {
                            sentence: "import { add as sum } from './math';",
                            explanation: "Rename on import to avoid conflicts.",
                        },
                        {
                            sentence: "import * as math from './math';",
                            explanation: "Import everything as a namespace object.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 File Extensions",
                content:
                    "In Node.js/TypeScript, you often omit .js/.ts. In browsers and some tools, you need the extension. Bundlers like Webpack handle this for you.",
            },
            exercises: [
                {
                    id: "cmi-named-1",
                    title: "Named Exports",
                    instructions: "Complete these tasks:",
                    items: [
                        {
                            type: "radio",
                            label: "Import named exports using:",
                            options: [
                                { value: "braces", label: "import { name } from '...'" },
                                { value: "plain", label: "import name from '...'" },
                            ],
                            expectedAnswer: "braces",
                        },
                        {
                            type: "radio",
                            label: "To rename on import:",
                            options: [
                                { value: "as", label: "import { old as new } from '...'" },
                                { value: "to", label: "import { old to new } from '...'" },
                            ],
                            expectedAnswer: "as",
                        },
                    ],
                },
            ],
        },

        // Default Exports
        {
            id: "default-exports",
            stepNumber: 3,
            title: "Default Exports",
            icon: "⭐",
            explanation: `
                <h3>One Main Export Per Module</h3>
                <p>Each module can have one default export - the "main" thing the module provides. Import without braces.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">Button.js</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
function Button({ label }) {
  return <button>{label}</button>;
}

export default Button;</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">App.js</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
// No braces! Can name it anything
import Button from './Button';
import MyButton from './Button'; // Same thing!

<Button label="Click me" /></pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📤 Default Export Syntax",
                    description: "Export the main thing",
                    examples: [
                        {
                            sentence: "export default function App() { }",
                            explanation: "Export function as default inline.",
                        },
                        {
                            sentence: "export default class User { }",
                            explanation: "Export class as default.",
                        },
                        {
                            sentence: "const config = { }; export default config;",
                            explanation: "Export at the end.",
                        },
                    ],
                },
                {
                    title: "📥 Import Without Braces",
                    description: "No curly braces for default imports",
                    examples: [
                        {
                            sentence: "import App from './App';",
                            explanation: "Import default - no braces.",
                        },
                        {
                            sentence: "import WhateverName from './App';",
                            explanation: "You can name it anything!",
                        },
                        {
                            sentence: "import React, { useState } from 'react';",
                            explanation: "Mix default and named imports.",
                        },
                    ],
                },
            ],
            verbTable: {
                title: "Named vs Default Exports",
                headers: ["Feature", "Named", "Default"],
                rows: [
                    ["Quantity", "Multiple per file", "One per file"],
                    ["Export syntax", "export const x", "export default x"],
                    ["Import syntax", "import { x }", "import x"],
                    ["Naming", "Must match", "Any name works"],
                    ["Use case", "Utilities, constants", "Main component/class"],
                ],
            },
            exercises: [
                {
                    id: "cmi-default-1",
                    title: "Default Exports",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "How many default exports per file?",
                            options: [
                                { value: "one", label: "One" },
                                { value: "many", label: "As many as you want" },
                            ],
                            expectedAnswer: "one",
                        },
                        {
                            type: "radio",
                            label: "Import default exports:",
                            options: [
                                { value: "no", label: "Without curly braces" },
                                { value: "yes", label: "With curly braces" },
                            ],
                            expectedAnswer: "no",
                        },
                    ],
                },
            ],
        },

        // Re-exporting
        {
            id: "re-exporting",
            stepNumber: 4,
            title: "Re-exporting & Barrel Files",
            icon: "🛢️",
            explanation: `
                <h3>Simplify Imports</h3>
                <p>Re-export from an index file to create clean import paths. This pattern is called a "barrel file."</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0;">components/index.js (Barrel File)</h4>
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.5;">
// Re-export from multiple files
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';

// Or re-export everything:
export * from './forms';</pre>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div class="diagram-surface-dark" style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                        <h5 style="margin: 0 0 0.5rem 0; color: #ef4444;">❌ Without Barrel</h5>
                        <pre style="margin: 0; font-size: 0.8rem; color: #1f2937;">
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Modal } from './components/Modal';</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                        <h5 style="margin: 0 0 0.5rem 0; color: #22c55e;">✅ With Barrel</h5>
                        <pre style="margin: 0; font-size: 0.8rem; color: #1f2937;">
import { Button, Card, Modal }
  from './components';</pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔄 Re-export Syntax",
                    description: "Different ways to re-export",
                    examples: [
                        {
                            sentence: "export { Button } from './Button';",
                            explanation: "Re-export specific named export.",
                        },
                        {
                            sentence: "export { default as Button } from './Button';",
                            explanation: "Re-export default as named.",
                        },
                        {
                            sentence: "export * from './utils';",
                            explanation: "Re-export all named exports.",
                        },
                        {
                            sentence: "export * as utils from './utils';",
                            explanation: "Re-export as namespace.",
                        },
                    ],
                },
                {
                    title: "📂 Folder Structure",
                    description: "Common pattern for organizing",
                    examples: [
                        {
                            sentence: "components/index.js - barrel file",
                            explanation: "Index file at folder root.",
                        },
                        {
                            sentence: "import { X } from './components'",
                            explanation: "Import from folder loads index automatically.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cmi-barrel-1",
                    title: "Re-exports",
                    instructions: "Which re-exports everything?",
                    items: [
                        {
                            type: "radio",
                            label: "Re-export all named exports:",
                            options: [
                                { value: "star", label: "export * from './file'" },
                                { value: "named", label: "export { } from './file'" },
                            ],
                            expectedAnswer: "star",
                        },
                    ],
                },
            ],
        },

        // Dynamic Imports
        {
            id: "dynamic-imports",
            stepNumber: 5,
            title: "Dynamic Imports",
            icon: "⚡",
            explanation: `
                <h3>Load Code On-Demand</h3>
                <p>Dynamic imports let you load modules when needed, not at startup. Great for code splitting!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
// Regular import - loads immediately
import { heavyFeature } from './heavyFeature';

// Dynamic import - loads when needed
async function loadFeature() {
    const module = await import('./heavyFeature');
    module.heavyFeature();
}

// Or with .then()
import('./analytics').then(module => {
    module.trackEvent('page_view');
});</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "⏰ When to Use",
                    description: "Load code only when needed",
                    examples: [
                        {
                            sentence: "const { Chart } = await import('chart.js');",
                            explanation: "Load charting library only when user views chart.",
                        },
                        {
                            sentence: "if (isAdmin) { const admin = await import('./admin'); }",
                            explanation: "Load admin features only for admin users.",
                        },
                        {
                            sentence: "button.onclick = async () => { const { Modal } = await import('./Modal'); }",
                            explanation: "Load modal code when button clicked.",
                        },
                    ],
                },
                {
                    title: "⚛️ React Lazy Loading",
                    description: "Built-in support in React",
                    examples: [
                        {
                            sentence: "const LazyComponent = lazy(() => import('./HeavyComponent'));",
                            explanation: "React.lazy for component splitting.",
                        },
                        {
                            sentence: "<Suspense fallback={<Loading />}><LazyComponent /></Suspense>",
                            explanation: "Show loading state while importing.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Code Splitting Benefits",
                content:
                    "Dynamic imports create separate bundles. Users only download code for features they actually use, making initial page load faster!",
            },
            exercises: [
                {
                    id: "cmi-dynamic-1",
                    title: "Dynamic Imports",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "Dynamic import returns:",
                            options: [
                                { value: "promise", label: "A Promise" },
                                { value: "module", label: "The module directly" },
                            ],
                            expectedAnswer: "promise",
                        },
                        {
                            type: "radio",
                            label: "Dynamic imports are good for:",
                            options: [
                                { value: "split", label: "Loading code only when needed" },
                                { value: "fast", label: "Making code run faster" },
                            ],
                            expectedAnswer: "split",
                        },
                    ],
                },
            ],
        },

        // CommonJS vs ESM
        {
            id: "commonjs-vs-esm",
            stepNumber: 6,
            title: "CommonJS vs ES Modules",
            icon: "🔀",
            explanation: `
                <h3>Two Module Systems</h3>
                <p>You'll encounter both systems. ES Modules (ESM) is the modern standard, CommonJS (CJS) is legacy Node.js.</p>
            `,
            verbTable: {
                title: "CommonJS vs ES Modules",
                headers: ["Feature", "CommonJS (CJS)", "ES Modules (ESM)"],
                rows: [
                    ["Export", "module.exports = { }", "export { }"],
                    ["Import", "const x = require('./x')", "import x from './x'"],
                    ["Loading", "Synchronous", "Async-friendly"],
                    ["Where", "Node.js (legacy)", "Browsers, modern Node"],
                    ["File ext", ".js or .cjs", ".js, .mjs, or .ts"],
                    ["Static analysis", "No", "Yes (tree shaking)"],
                ],
            },
            usageMeanings: [
                {
                    title: "📦 CommonJS (Legacy)",
                    description: "Still seen in older Node.js code",
                    examples: [
                        {
                            sentence: "const fs = require('fs');",
                            explanation: "Import with require().",
                        },
                        {
                            sentence: "module.exports = { add, subtract };",
                            explanation: "Export with module.exports.",
                        },
                        {
                            sentence: "exports.add = function() { };",
                            explanation: "Shorthand for adding to exports.",
                        },
                    ],
                },
                {
                    title: "✨ ES Modules (Modern)",
                    description: "The standard - use this!",
                    examples: [
                        {
                            sentence: "import fs from 'fs';",
                            explanation: "ES import syntax.",
                        },
                        {
                            sentence: "export { add, subtract };",
                            explanation: "ES export syntax.",
                        },
                        {
                            sentence: "\"type\": \"module\" in package.json",
                            explanation: "Enable ESM in Node.js projects.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Which to Use?",
                content:
                    "Use ES Modules! They're the standard, work everywhere, and enable tree-shaking (removing unused code). Only use CommonJS if a library requires it.",
            },
            exercises: [
                {
                    id: "cmi-systems-1",
                    title: "Module Systems",
                    instructions: "Identify the syntax:",
                    items: [
                        {
                            type: "select",
                            label: "require('./module')",
                            options: ["CommonJS", "ES Modules"],
                            expectedAnswer: "CommonJS",
                        },
                        {
                            type: "select",
                            label: "import x from './module'",
                            options: ["CommonJS", "ES Modules"],
                            expectedAnswer: "ES Modules",
                        },
                    ],
                },
            ],
        },

        // Module Patterns
        {
            id: "module-patterns",
            stepNumber: 7,
            title: "Common Module Patterns",
            icon: "🎨",
            explanation: `
                <h3>Best Practices</h3>
                <p>Follow these patterns for clean, maintainable module organization.</p>
            `,
            usageMeanings: [
                {
                    title: "📂 One Component Per File",
                    description: "Keep files focused",
                    examples: [
                        {
                            sentence: "Button.tsx - just the Button component",
                            explanation: "Each component in its own file.",
                        },
                        {
                            sentence: "Export component as default, types as named",
                            explanation: "Common React convention.",
                        },
                    ],
                },
                {
                    title: "🗂️ Feature Folders",
                    description: "Group related files together",
                    examples: [
                        {
                            sentence: "features/auth/Login.tsx, useAuth.ts, authSlice.ts",
                            explanation: "All auth-related code together.",
                        },
                        {
                            sentence: "features/auth/index.ts - barrel file for the feature",
                            explanation: "Clean imports from outside.",
                        },
                    ],
                },
                {
                    title: "📌 Absolute Imports",
                    description: "Avoid ../../../ paths",
                    examples: [
                        {
                            sentence: "import { Button } from '@/components/Button'",
                            explanation: "@ alias for src folder.",
                        },
                        {
                            sentence: "import { api } from '@/lib/api'",
                            explanation: "Clean paths from anywhere.",
                        },
                    ],
                },
                {
                    title: "🌳 Tree Shaking",
                    description: "Remove unused exports from bundles",
                    examples: [
                        {
                            sentence: "import { pick } from 'lodash-es';",
                            explanation: "Only import what you use.",
                        },
                        {
                            sentence: "Avoid: import _ from 'lodash'",
                            explanation: "Imports entire library!",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cmi-patterns-1",
                    title: "Best Practices",
                    instructions: "Which is better?",
                    items: [
                        {
                            type: "radio",
                            label: "For tree-shaking, import:",
                            options: [
                                { value: "named", label: "import { specific } from 'lib'" },
                                { value: "all", label: "import * as lib from 'lib'" },
                            ],
                            expectedAnswer: "named",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "Modules Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Named exports</strong>: export { x }, import { x }</li>
                    <li><strong>Default exports</strong>: export default x, import x</li>
                    <li><strong>Re-exports</strong>: export { x } from './file'</li>
                    <li><strong>Barrel files</strong>: index.js that re-exports all</li>
                    <li><strong>Dynamic imports</strong>: await import('./module')</li>
                    <li><strong>Use ES Modules</strong> over CommonJS</li>
                    <li><strong>Tree shaking</strong>: import only what you need</li>
                    <li><strong>@ aliases</strong>: cleaner than ../../../</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cmi-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "Named imports use:",
                            options: [
                                { value: "braces", label: "Curly braces { }" },
                                { value: "no", label: "No braces" },
                            ],
                            expectedAnswer: "braces",
                        },
                        {
                            type: "radio",
                            label: "How many default exports per file?",
                            options: [
                                { value: "one", label: "One" },
                                { value: "many", label: "Unlimited" },
                            ],
                            expectedAnswer: "one",
                        },
                        {
                            type: "radio",
                            label: "Dynamic import() returns:",
                            options: [
                                { value: "promise", label: "A Promise" },
                                { value: "sync", label: "The module synchronously" },
                            ],
                            expectedAnswer: "promise",
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
                    id: "mi-cadence-concept",
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
                    id: "mi-cadence-read",
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
                    id: "mi-cadence-write",
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
                    id: "mi-cadence-debug",
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
            question: "How do you import a named export?",
            options: [
                { value: "a", label: "import name from './file'" },
                { value: "b", label: "import { name } from './file'" },
                { value: "c", label: "require('./file').name" },
            ],
            correctAnswer: "b",
            explanation:
                "Named exports are imported with curly braces: import { name } from './file'. Without braces imports the default export.",
        },
        {
            id: "q2",
            question: "What's a barrel file?",
            options: [
                { value: "a", label: "A compressed code file" },
                { value: "b", label: "An index.js that re-exports from multiple files" },
                { value: "c", label: "A backup file" },
            ],
            correctAnswer: "b",
            explanation:
                "A barrel file (usually index.js) re-exports from multiple files, letting you import from a folder instead of specific files.",
        },
        {
            id: "q3",
            question: "When should you use dynamic imports?",
            options: [
                { value: "a", label: "For all imports" },
                { value: "b", label: "For code that should load on-demand" },
                { value: "c", label: "Never - they're deprecated" },
            ],
            correctAnswer: "b",
            explanation:
                "Dynamic imports load code when needed, not at startup. Great for large features, admin panels, or heavy libraries.",
        },
        {
            id: "q4",
            question: "What does tree shaking do?",
            options: [
                { value: "a", label: "Removes unused code from bundles" },
                { value: "b", label: "Organizes files into folders" },
                { value: "c", label: "Compresses images" },
            ],
            correctAnswer: "a",
            explanation:
                "Tree shaking removes unused exports from the final bundle. It only works with ES Modules (not CommonJS).",
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
