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
};
