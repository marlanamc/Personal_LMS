import type { InteractiveGuideContent } from "@/types/activity";

export const codingJsTsInterviewPrepContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "JS/TS Interview Prep Sprint",
            icon: "🎯",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.06rem; margin: 0;">This guide is focused on the exact interview moves that help you pass JavaScript/TypeScript questions: clarify, plan, implement clearly, and test edge cases out loud.</p>
                </div>
                <p><strong>Professional note:</strong> Interviewers care about process—clarifying inputs/outputs, stating assumptions, walking through edge cases, and explaining tradeoffs. A slower, deliberate solution with clear reasoning often scores better than a rushed answer.</p>
                <h3>What this prep covers</h3>
                <ul>
                    <li>How to structure your answer before coding</li>
                    <li>Fast complexity and data structure decisions</li>
                    <li>Frequent JS interview patterns (arrays, objects, closures, async)</li>
                    <li>TS follow-ups (unions, narrowing, generics)</li>
                    <li>A full mock walkthrough with tradeoff reasoning</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cjti-intro-1",
                    title: "Interview Focus",
                    instructions: "What gets you credit in most coding interviews?",
                    items: [
                        {
                            type: "radio",
                            label: "Best overall approach:",
                            options: [
                                { value: "process", label: "Explain your process while solving, not just the final code" },
                                { value: "silent", label: "Stay silent and only paste a final answer" },
                            ],
                            expectedAnswer: "process",
                        },
                    ],
                },
            ],
        },
        {
            id: "problem-framing",
            stepNumber: 1,
            title: "Frame The Problem Before You Code",
            icon: "🧭",
            explanation: `
                <h3>Use the 4-step interview rhythm</h3>
                <ol>
                    <li><strong>Clarify:</strong> Confirm input shape, output shape, and constraints.</li>
                    <li><strong>Plan:</strong> Say your approach and complexity target.</li>
                    <li><strong>Code:</strong> Build a clean first version with readable naming.</li>
                    <li><strong>Verify:</strong> Run sample + edge cases aloud.</li>
                </ol>

                <div class="diagram-surface-light" style="background: linear-gradient(135deg, #fff7ed 0%, #e0f2fe 100%); border: 1px solid rgba(14, 165, 233, 0.22); padding: 1rem; border-radius: 0.75rem; margin-top: 1rem;">
                    <p style="margin: 0; color: #1f2937;"><strong>Good talk track:</strong> "I will start with a linear pass using a Map to keep lookups O(1), then validate duplicates and empty input."</p>
                </div>
            `,
            tipBox: {
                title: "Interview Signal",
                content: "Interviewers grade communication and tradeoff reasoning, not just syntax speed.",
            },
            exercises: [
                {
                    id: "cjti-frame-1",
                    title: "Best First Question",
                    instructions: "Pick the best clarification to ask first.",
                    items: [
                        {
                            type: "select",
                            label: "Before coding, ask:",
                            options: [
                                "What are the input constraints and expected return format?",
                                "Can I skip test cases and optimize later?",
                                "Should I use advanced syntax even if it is less readable?",
                            ],
                            expectedAnswer: "What are the input constraints and expected return format?",
                        },
                        {
                            type: "radio",
                            label: "If optimization is needed:",
                            options: [
                                { value: "iterative", label: "Start with a correct approach, then improve with clear tradeoffs" },
                                { value: "premature", label: "Jump straight to a complex optimization without baseline" },
                            ],
                            expectedAnswer: "iterative",
                        },
                    ],
                },
            ],
        },
        {
            id: "complexity-and-ds",
            stepNumber: 2,
            title: "Complexity And Data Structure Picks",
            icon: "📊",
            explanation: `
                <h3>Choose tools based on the operation</h3>
                <p>Most interview improvements come from replacing repeated linear lookups with constant-time lookups.</p>
            `,
            verbTable: {
                title: "Fast Matching Guide",
                headers: ["Need", "Best Tool", "Typical Cost"],
                rows: [
                    ["Frequent existence checks", "Set", "O(1) average lookup"],
                    ["Key -> value mapping", "Map or object", "O(1) average lookup"],
                    ["Preserve order + transform all values", "Array + map/filter", "O(n) pass"],
                    ["Find top/bottom after ordering", "Sort", "O(n log n)"],
                    ["Single pass aggregation", "reduce / loop", "O(n)"],
                ],
            },
            usageMeanings: [
                {
                    title: "Set for membership",
                    description: "Use Set when you ask 'have we seen this?' many times",
                    examples: [
                        {
                            sentence: "const seen = new Set<number>();",
                            explanation: "Insert and check in O(1) average time.",
                        },
                        {
                            sentence: "if (seen.has(value)) return true;",
                            explanation: "Avoid repeated array includes scans.",
                        },
                    ],
                },
                {
                    title: "Map for index lookup",
                    description: "Map stores extra info for each value",
                    examples: [
                        {
                            sentence: "indexByValue.set(nums[i], i);",
                            explanation: "Classic Two Sum interview pattern.",
                        },
                        {
                            sentence: "const prior = indexByValue.get(target - nums[i]);",
                            explanation: "Check complement instantly.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cjti-ds-1",
                    title: "Complexity Picks",
                    instructions: "Choose the best tool and complexity.",
                    items: [
                        {
                            type: "select",
                            label: "You need to check duplicates in a large list quickly:",
                            options: ["Set", "Array with includes inside a loop", "Nested loops"],
                            expectedAnswer: "Set",
                        },
                        {
                            type: "text",
                            label: "Complexity for one loop through n items: O(____)",
                            expectedAnswers: ["n"],
                        },
                        {
                            type: "text",
                            label: "Complexity for nested loops over n and n: O(____)",
                            expectedAnswers: ["n^2", "n*n", "n * n"],
                        },
                    ],
                },
            ],
        },
        {
            id: "javascript-patterns",
            stepNumber: 3,
            title: "JavaScript Patterns Frequently Asked",
            icon: "🧩",
            explanation: `
                <h3>Patterns interviewers expect</h3>
                <ul>
                    <li><strong>Array transforms:</strong> map/filter/reduce or a clear single loop</li>
                    <li><strong>Scope correctness:</strong> avoid <code>var</code> loop closure bugs</li>
                    <li><strong>Immutability:</strong> return new objects/arrays instead of mutation when appropriate</li>
                    <li><strong>Edge handling:</strong> empty input, nullish values, duplicates</li>
                </ul>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #0f172a 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; margin-top: 1rem; color: white;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.55;">
const total = [1, 2, 3]
  .map((n) => n * 2)
  .filter((n) => n > 2)
  .reduce((sum, n) => sum + n, 0); // 10
                    </pre>
                </div>
            `,
            exercises: [
                {
                    id: "cjti-js-1",
                    title: "JS Pattern Check",
                    instructions: "Answer the interview-style prompts.",
                    items: [
                        {
                            type: "text",
                            label: "[1, 2, 3].map((n) => n * 2).filter((n) => n > 2).reduce((sum, n) => sum + n, 0)",
                            expectedAnswers: ["10"],
                        },
                        {
                            type: "select",
                            label: "Fix this loop callback bug: for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0)",
                            options: [
                                "Use let instead of var for i",
                                "Use more console.log calls",
                                "Remove setTimeout",
                            ],
                            expectedAnswer: "Use let instead of var for i",
                        },
                        {
                            type: "radio",
                            label: "Preferred immutable update:",
                            options: [
                                { value: "spread", label: "{ ...user, score: user.score + 1 }" },
                                { value: "mutate", label: "user.score++; return user;" },
                            ],
                            expectedAnswer: "spread",
                        },
                    ],
                },
            ],
        },
        {
            id: "async-and-errors",
            stepNumber: 4,
            title: "Async And Error Handling Follow-Ups",
            icon: "⏱️",
            explanation: `
                <h3>Show async maturity</h3>
                <p>Interviewers often ask how you handle multiple requests and failures.</p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.9rem; margin: 1rem 0;">
                    <div class="diagram-surface-light" style="background: #ecfeff; border: 1px solid #67e8f9; border-radius: 0.65rem; padding: 0.85rem;">
                        <h4 style="margin: 0 0 0.4rem 0; color: #0c4a6e;">Promise.all</h4>
                        <p style="margin: 0; color: #164e63;">Best for independent tasks when all must succeed.</p>
                    </div>
                    <div class="diagram-surface-light" style="background: #fefce8; border: 1px solid #fde047; border-radius: 0.65rem; padding: 0.85rem;">
                        <h4 style="margin: 0 0 0.4rem 0; color: #713f12;">Promise.allSettled</h4>
                        <p style="margin: 0; color: #854d0e;">Use when partial success still has value.</p>
                    </div>
                </div>

                <div class="diagram-surface-dark" style="background: #111827; border-radius: 0.75rem; padding: 1rem; color: #f9fafb;">
                    <pre style="margin: 0; font-size: 0.9rem;">
try {
  const [profile, settings] = await Promise.all([
    fetchProfile(),
    fetchSettings(),
  ]);
  return { profile, settings };
} catch (error) {
  throw new Error("Failed to load dashboard data");
}
                    </pre>
                </div>
            `,
            exercises: [
                {
                    id: "cjti-async-1",
                    title: "Async Interview Decisions",
                    instructions: "Pick the correct async strategy.",
                    items: [
                        {
                            type: "radio",
                            label: "Three independent API calls, all required to render:",
                            options: [
                                { value: "all", label: "Promise.all for parallel execution" },
                                { value: "serial", label: "Await each one sequentially by default" },
                            ],
                            expectedAnswer: "all",
                        },
                        {
                            type: "select",
                            label: "You want to keep successes even if one request fails:",
                            options: ["Promise.allSettled", "Promise.race", "JSON.stringify"],
                            expectedAnswer: "Promise.allSettled",
                        },
                    ],
                },
            ],
        },
        {
            id: "typescript-patterns",
            stepNumber: 5,
            title: "TypeScript Patterns That Earn Strong Signals",
            icon: "🔷",
            explanation: `
                <h3>Common TS follow-up areas</h3>
                <p>After your JS solution, interviewers often ask for typing quality and safety.</p>
            `,
            verbTable: {
                title: "TS Follow-up Cheatsheet",
                headers: ["Pattern", "Interviewer Might Ask", "Strong Response"],
                rows: [
                    ["Union types", "How do you model variant states?", "Use discriminated union with a shared kind/status field"],
                    ["Type narrowing", "How do you access safe fields?", "Narrow with === checks, in, or custom type guards"],
                    ["Generics", "Can this function stay reusable?", "Use <T> and key constraints when indexing"],
                    ["Unknown vs any", "How do you keep safety?", "Prefer unknown and validate before use"],
                ],
            },
            usageMeanings: [
                {
                    title: "Discriminated union",
                    description: "Model success/failure state safely",
                    examples: [
                        {
                            sentence: "type Result = { kind: 'ok'; data: User } | { kind: 'error'; message: string };",
                            explanation: "kind lets TypeScript narrow reliably.",
                        },
                        {
                            sentence: "if (result.kind === 'ok') return result.data;",
                            explanation: "Safe property access after narrowing.",
                        },
                    ],
                },
                {
                    title: "Generic index safety",
                    description: "Return the exact property type from a helper",
                    examples: [
                        {
                            sentence: "function pluck<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }",
                            explanation: "K is constrained to valid keys of T.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cjti-ts-1",
                    title: "TypeScript Follow-up Drill",
                    instructions: "Choose the safest typing answers.",
                    items: [
                        {
                            type: "select",
                            label: "Best generic signature for property pluck helper:",
                            options: [
                                "function pluck<T, K extends keyof T>(obj: T, key: K): T[K]",
                                "function pluck(obj: any, key: any): any",
                                "function pluck<T>(obj: T, key: string): string",
                            ],
                            expectedAnswer: "function pluck<T, K extends keyof T>(obj: T, key: K): T[K]",
                        },
                        {
                            type: "radio",
                            label: "Safest way to read Result data below?",
                            options: [
                                { value: "narrow", label: "Check result.kind first, then access data/message" },
                                { value: "assume", label: "Assume result is always success and cast as any" },
                            ],
                            expectedAnswer: "narrow",
                        },
                        {
                            type: "text",
                            label: "In pluck<T, K extends keyof T>, K extends ________",
                            expectedAnswers: ["keyof t"],
                        },
                    ],
                },
            ],
        },
        {
            id: "mock-walkthrough",
            stepNumber: 6,
            title: "Mock Interview Walkthrough",
            icon: "🧪",
            explanation: `
                <h3>Prompt</h3>
                <p>"Given an array of users, return names of active users sorted by score descending."</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: white;">
                    <pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
type User = { name: string; active: boolean; score: number };

function topActiveNames(users: User[]): string[] {
  return users
    .filter((u) => u.active)
    .sort((a, b) => b.score - a.score)
    .map((u) => u.name);
}
                    </pre>
                </div>

                <h4>Talk track to say out loud</h4>
                <ul>
                    <li>Filtering is O(n), sort is O(n log n), final map is O(n).</li>
                    <li>Overall time is dominated by sort: O(n log n).</li>
                    <li>Space is O(n) for intermediate arrays.</li>
                </ul>
            `,
            postExplanation: `
                <p><strong>Interview close-out:</strong> Mention edge cases (empty array, equal scores, null names if schema allows) and ask if stable ordering is required for ties.</p>
            `,
            exercises: [
                {
                    id: "cjti-mock-1",
                    title: "Mock Question Check",
                    instructions: "Treat this like a real interview follow-up.",
                    items: [
                        {
                            type: "text",
                            label: "Output for users [{name:'Ana', active:true, score:8}, {name:'Bo', active:false, score:10}, {name:'Kai', active:true, score:9}] (comma-separated)",
                            expectedAnswers: ["kai,ana", "kai, ana"],
                        },
                        {
                            type: "select",
                            label: "Overall time complexity with filter + sort + map:",
                            options: ["O(n)", "O(n log n)", "O(n^2)"],
                            expectedAnswer: "O(n log n)",
                        },
                        {
                            type: "text",
                            label: "Name one edge case you would mention to the interviewer:",
                            acceptAnyAttempt: true,
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
                    id: "jtip-cadence-concept",
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
                    id: "jtip-cadence-read",
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
                    id: "jtip-cadence-write",
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
                    id: "jtip-cadence-debug",
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
            id: "cjti-q1",
            question: "Best first move before coding an interview solution?",
            options: [
                { value: "a", label: "Clarify inputs, outputs, and constraints" },
                { value: "b", label: "Write code immediately without discussion" },
                { value: "c", label: "Pick the hardest algorithm first" },
            ],
            correctAnswer: "a",
            explanation: "Clarifying scope prevents wrong assumptions and shows strong communication.",
            topic: "interview-process",
            skill: "strategy",
            skillTag: "clarify-constraints",
            difficulty: "easy",
        },
        {
            id: "cjti-q2",
            question: "You need frequent duplicate checks in a large array. Best structure?",
            options: [
                { value: "a", label: "Set" },
                { value: "b", label: "Nested loops" },
                { value: "c", label: "String concatenation" },
            ],
            correctAnswer: "a",
            explanation: "Set membership is O(1) average and ideal for seen-value checks.",
            topic: "complexity",
            skill: "data-structures",
            skillTag: "set-membership",
            difficulty: "easy",
        },
        {
            id: "cjti-q3",
            question: "What is the dominant complexity of sorting n items?",
            options: [
                { value: "a", label: "O(1)" },
                { value: "b", label: "O(n)" },
                { value: "c", label: "O(n log n)" },
            ],
            correctAnswer: "c",
            explanation: "Comparison sort dominates at O(n log n).",
            topic: "complexity",
            skill: "analysis",
            skillTag: "sort-complexity",
            difficulty: "medium",
        },
        {
            id: "cjti-q4",
            question: "What fixes the classic setTimeout loop closure bug?",
            options: [
                { value: "a", label: "Use let for loop index binding" },
                { value: "b", label: "Add more timeouts" },
                { value: "c", label: "Convert numbers to strings first" },
            ],
            correctAnswer: "a",
            explanation: "let creates block-scoped bindings per iteration.",
            topic: "javascript",
            skill: "debugging",
            skillTag: "scope-let-var",
            difficulty: "medium",
        },
        {
            id: "cjti-q5",
            question: "Independent async calls where all results are required should usually use:",
            options: [
                { value: "a", label: "Promise.all" },
                { value: "b", label: "Sequential awaits by default" },
                { value: "c", label: "Promise.race" },
            ],
            correctAnswer: "a",
            explanation: "Promise.all runs in parallel and fails fast when one fails.",
            topic: "async",
            skill: "implementation",
            skillTag: "promise-all",
            difficulty: "medium",
        },
        {
            id: "cjti-q6",
            question: "If partial API success is acceptable, prefer:",
            options: [
                { value: "a", label: "Promise.allSettled" },
                { value: "b", label: "Promise.all with no catch" },
                { value: "c", label: "while(true)" },
            ],
            correctAnswer: "a",
            explanation: "allSettled preserves fulfilled results and rejected reasons.",
            topic: "async",
            skill: "error-handling",
            skillTag: "promise-allsettled",
            difficulty: "medium",
        },
        {
            id: "cjti-q7",
            question: "In TypeScript, which is safest for untrusted external values?",
            options: [
                { value: "a", label: "any" },
                { value: "b", label: "unknown with runtime checks" },
                { value: "c", label: "never checking the value" },
            ],
            correctAnswer: "b",
            explanation: "unknown forces narrowing before use.",
            topic: "typescript",
            skill: "safety",
            skillTag: "unknown-over-any",
            difficulty: "hard",
        },
        {
            id: "cjti-q8",
            question: "What does K extends keyof T do in a generic helper?",
            options: [
                { value: "a", label: "Restricts keys to valid properties of T" },
                { value: "b", label: "Converts all keys to numbers" },
                { value: "c", label: "Disables type checking for keys" },
            ],
            correctAnswer: "a",
            explanation: "It guarantees key arguments are valid for the object type.",
            topic: "typescript",
            skill: "generics",
            skillTag: "keyof-constraint",
            difficulty: "hard",
        },
        {
            id: "cjti-q9",
            question: "When discussing your solution, what impresses interviewers most?",
            options: [
                { value: "a", label: "Tradeoffs, complexity, and edge-case testing" },
                { value: "b", label: "Only code length" },
                { value: "c", label: "Avoiding any explanation" },
            ],
            correctAnswer: "a",
            explanation: "Reasoning quality is a major part of the evaluation.",
            topic: "interview-process",
            skill: "communication",
            skillTag: "tradeoff-explanation",
            difficulty: "easy",
        },
        {
            id: "cjti-q10",
            question: "For a transformation with filter + sort + map, what usually dominates runtime?",
            options: [
                { value: "a", label: "sort" },
                { value: "b", label: "map" },
                { value: "c", label: "variable declaration" },
            ],
            correctAnswer: "a",
            explanation: "Sort is generally O(n log n), which dominates O(n) passes.",
            topic: "complexity",
            skill: "analysis",
            skillTag: "dominant-operation",
            difficulty: "medium",
        },
        {
            id: "cjti-q11",
            question: "Best first step when given a coding problem in an interview:",
            options: [
                { value: "a", label: "Clarify inputs, outputs, and edge cases" },
                { value: "b", label: "Start typing immediately" },
                { value: "c", label: "Ask for hints" },
            ],
            correctAnswer: "a",
            explanation: "Clarifying before coding avoids rework and demonstrates communication skills.",
            topic: "interview-process",
            skill: "communication",
            skillTag: "clarify-first",
            difficulty: "easy",
        },
        {
            id: "cjti-q12",
            question: "Why mention edge cases aloud while coding?",
            options: [
                { value: "a", label: "Shows you think about robustness and helps catch bugs" },
                { value: "b", label: "Slows you down" },
                { value: "c", label: "Only needed for senior roles" },
            ],
            correctAnswer: "a",
            explanation: "Talking through edge cases demonstrates thoroughness and catches mistakes before submission.",
            topic: "interview-process",
            skill: "verification",
            skillTag: "edge-case-awareness",
            difficulty: "medium",
        },
    ],
};
