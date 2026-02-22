import type { InteractiveGuideContent } from "@/types/activity";

export const codingJsTsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "variables",
            title: "Variables & Scope",
            icon: "📦",
            explanation: `
                <h3>const, let, and var</h3>
                <p>In modern JavaScript/TypeScript, we prefer <code>const</code> and <code>let</code> over <code>var</code>.</p>
                <ul>
                    <li><strong>const</strong>: For values that won't be reassigned.</li>
                    <li><strong>let</strong>: For values that might change.</li>
                </ul>
            `,
            exercises: [
                {
                    id: "coding-var-1",
                    title: "Variable Declaration",
                    instructions: "Which keyword is best for a value that never changes?",
                    items: [
                        {
                            type: "radio",
                            label: "Value that won't change...",
                            options: [
                                { value: "let", label: "let" },
                                { value: "const", label: "const" },
                                { value: "var", label: "var" },
                            ],
                            expectedAnswer: "const",
                        },
                    ],
                },
            ],
        },
        {
            id: "ts-basics",
            title: "TypeScript Basics",
            icon: "🛡️",
            explanation: `
                <h3>Adding Types</h3>
                <p>TypeScript allows you to define the shape of your data using interfaces and types.</p>
                <pre><code>interface User {
  id: string;
  name: string;
}</code></pre>
            `,
            exercises: [
                {
                    id: "coding-ts-1",
                    title: "Type Definition",
                    instructions: "How would you type a number variable in TS?",
                    items: [
                        {
                            type: "text",
                            label: "let count: ___ = 5;",
                            expectedAnswer: "number",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "coding-js-ts-q1",
            question: "Which keyword should you use by default for variables?",
            options: [
                { value: "a", label: "var" },
                { value: "b", label: "let" },
                { value: "c", label: "const" },
            ],
            correctAnswer: "c",
            explanation: "Use const by default. Switch to let only when reassignment is needed.",
        },
        {
            id: "coding-js-ts-q2",
            question: "In TypeScript, what type fills this blank: let count: ___ = 5;",
            options: [
                { value: "a", label: "string" },
                { value: "b", label: "number" },
                { value: "c", label: "boolean" },
            ],
            correctAnswer: "b",
            explanation: "The literal 5 is a number, so the type is number.",
        },
        {
            id: "coding-js-ts-q3",
            question: "Which declaration allows reassignment?",
            options: [
                { value: "a", label: "const" },
                { value: "b", label: "let" },
                { value: "c", label: "interface" },
            ],
            correctAnswer: "b",
            explanation: "let supports reassignment; const does not.",
        },
        {
            id: "coding-js-ts-q4",
            question: "What is a main benefit of TypeScript?",
            options: [
                { value: "a", label: "It removes the need to run code" },
                { value: "b", label: "It catches type mistakes earlier" },
                { value: "c", label: "It replaces JavaScript syntax completely" },
            ],
            correctAnswer: "b",
            explanation: "TypeScript helps catch many errors at development time via static typing.",
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
