import type { InteractiveGuideContent } from "@/types/activity";

export const codingReactFundamentalsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "React Fundamentals: Components, State, and Decisions",
            icon: "⚛️",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">This guide is not about memorizing syntax. It is about making correct UI decisions: what should be state, what should be derived, where data should live, and how to avoid common React bugs.</p>
                </div>

                <h3>What You'll Build Confidence In</h3>
                <ul>
                    <li>Component boundaries and composition choices</li>
                    <li>Props vs state vs derived values</li>
                    <li>Render behavior and stale state pitfalls</li>
                    <li>When to use (and avoid) useEffect</li>
                    <li>How to explain React decisions to developers clearly</li>
                </ul>
            `,
            tipBox: {
                title: "Comprehension Standard",
                content:
                    "This lesson uses scenario-based questions and bug diagnosis prompts. Aim to justify decisions, not just pick definitions.",
            },
            exercises: [
                {
                    id: "crf-intro-1",
                    title: "Decision Framing",
                    instructions: "Pick the strongest engineering-first mindset.",
                    items: [
                        {
                            type: "radio",
                            label: "Best approach to React work:",
                            options: [
                                { value: "decisions", label: "Model data flow first, then implement UI components" },
                                { value: "ui-only", label: "Style UI first and decide data flow later" },
                            ],
                            expectedAnswer: "decisions",
                        },
                        {
                            type: "radio",
                            label: "A strong React explanation should include:",
                            options: [
                                { value: "tradeoffs", label: "State placement, tradeoffs, and validation steps" },
                                { value: "just-code", label: "Only final code without rationale" },
                            ],
                            expectedAnswer: "tradeoffs",
                        },
                    ],
                },
            ],
        },
        {
            id: "components-and-boundaries",
            stepNumber: 1,
            title: "Component Boundaries and Composition",
            icon: "🧱",
            explanation: `
                <h3>Good Components Have One Job</h3>
                <p>A component boundary should reflect a responsibility boundary. If one component handles unrelated concerns (fetching, filtering, rendering, animation, analytics), split it.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1f2937 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.9rem; line-height: 1.55;">
// Better split
&lt;SubjectPage&gt;
  &lt;FilterBar /&gt;
  &lt;ActivityList /&gt;
&lt;/SubjectPage&gt;

// vs one giant component with all concerns mixed together
</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Boundary signal: split now",
                    description: "Indicators a component is carrying too much responsibility",
                    examples: [
                        {
                            sentence: "One component holds 8+ unrelated state values and 500+ lines of mixed logic.",
                            explanation: "Split by behavior: controls, list rendering, and item card can be separate.",
                        },
                        {
                            sentence: "You cannot describe what the component does in one sentence.",
                            explanation: "Lack of clarity usually means boundary mismatch.",
                        },
                    ],
                },
                {
                    title: "Boundary signal: keep together",
                    description: "When keeping a component whole is actually better",
                    examples: [
                        {
                            sentence: "UI is tiny and tightly coupled (single toggle + single panel).",
                            explanation: "Splitting may add complexity without maintainability benefit.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "crf-boundary-1",
                    title: "Boundary Decisions",
                    instructions: "Choose the strongest architecture move for each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "A component handles filter chips, fetch retries, analytics events, and card rendering. Best next step?",
                            options: [
                                { value: "split", label: "Split into focused components/hooks by responsibility" },
                                { value: "keep", label: "Keep together to avoid extra files" },
                            ],
                            expectedAnswer: "split",
                        },
                        {
                            type: "text",
                            label: "Write one sentence defining a good responsibility for a `FilterBar` component:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "props-state-derived",
            stepNumber: 2,
            title: "Props vs State vs Derived Values",
            icon: "🔁",
            explanation: `
                <h3>The Most Important React Decision</h3>
                <p>If a value can be calculated from existing props/state, prefer deriving it during render instead of storing duplicate state.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.6rem 0;"><strong>Rule of thumb:</strong></p>
                    <ul style="margin: 0; padding-left: 1rem;">
                        <li><strong>Props:</strong> read-only input from parent</li>
                        <li><strong>State:</strong> user-driven or async-changing data you cannot derive</li>
                        <li><strong>Derived:</strong> computed from props/state (do not duplicate)</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "Common Bug",
                content:
                    "Keeping both `items` and `filteredItems` in state can cause stale UI. Store source state, derive filtered output from it.",
            },
            exercises: [
                {
                    id: "crf-state-1",
                    title: "State Modeling Drill",
                    instructions: "Identify what should be state vs derived.",
                    items: [
                        {
                            type: "radio",
                            label: "You have `activities` and selected `filter`. Should `visibleActivities` be state?",
                            options: [
                                { value: "derived", label: "No, derive it from activities + filter" },
                                { value: "state", label: "Yes, store visibleActivities in separate state" },
                            ],
                            expectedAnswer: "derived",
                        },
                        {
                            type: "radio",
                            label: "User input text in a search box should be:",
                            options: [
                                { value: "state", label: "State (changes from user interactions)" },
                                { value: "derived", label: "Derived only" },
                            ],
                            expectedAnswer: "state",
                        },
                        {
                            type: "text",
                            label: "Given total=12 and completed=9, derive completion percentage:",
                            expectedAnswers: ["75", "75%"],
                        },
                    ],
                },
            ],
        },
        {
            id: "render-cycle-and-updates",
            stepNumber: 3,
            title: "Render Cycle, Batching, and Stale State",
            icon: "🧠",
            explanation: `
                <h3>Why <code>setState</code> Bugs Happen</h3>
                <p>State updates are scheduled. If you rely on stale closures, your UI can drift from expected behavior.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin-top: 1rem;">
<pre style="margin: 0; font-size: 0.9rem; line-height: 1.55;">
// Safer when next state depends on previous state:
setCount((prev) => prev + 1);

// Risky in rapid updates:
setCount(count + 1);
</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Functional setState",
                    description: "Use when next value depends on previous value",
                    examples: [
                        {
                            sentence: "setItems((prev) => [...prev, newItem]);",
                            explanation: "Prevents stale reference issues during queued updates.",
                        },
                    ],
                },
                {
                    title: "Avoid accidental mutation",
                    description: "Mutating objects in state can prevent predictable renders",
                    examples: [
                        {
                            sentence: "setUser((prev) => ({ ...prev, name: 'Ana' }));",
                            explanation: "Create a new object instead of mutating `prev`.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "crf-render-1",
                    title: "Bug Diagnosis",
                    instructions: "Pick the safer fix for each bug pattern.",
                    items: [
                        {
                            type: "radio",
                            label: "Counter increments twice on one click, but result is only +1. Best fix?",
                            options: [
                                { value: "functional", label: "Use functional updates: setCount(prev => prev + 1)" },
                                { value: "double", label: "Call setCount(count + 1) twice again" },
                            ],
                            expectedAnswer: "functional",
                        },
                        {
                            type: "radio",
                            label: "A list update mutates original state with `push`. Better pattern?",
                            options: [
                                { value: "copy", label: "Create a new array with spread or concat" },
                                { value: "mutate", label: "Keep mutating then force render" },
                            ],
                            expectedAnswer: "copy",
                        },
                    ],
                },
            ],
        },
        {
            id: "effect-decision-tree",
            stepNumber: 4,
            title: "useEffect Decision Tree (Use Less, Use Better)",
            icon: "🌲",
            explanation: `
                <h3>Not Everything Needs an Effect</h3>
                <p>Effects are for syncing with the outside world: subscriptions, timers, network, browser APIs. If logic is pure derivation from props/state, keep it in render.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.4rem 0;"><strong>Decision tree:</strong></p>
                    <ol style="margin: 0; padding-left: 1rem;">
                        <li>Can I compute this during render? -> No effect.</li>
                        <li>Am I syncing to external system (API, DOM API, subscription)? -> Effect is appropriate.</li>
                        <li>Do I need cleanup (unsubscribe/cancel timer)? -> Add cleanup function.</li>
                    </ol>
                </div>
            `,
            exercises: [
                {
                    id: "crf-effect-1",
                    title: "Effect or Not?",
                    instructions: "Classify each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "Compute `completedPct` from `completed` and `total`:",
                            options: [
                                { value: "render", label: "Derive during render (no effect)" },
                                { value: "effect", label: "Use effect and setCompletedPct state" },
                            ],
                            expectedAnswer: "render",
                        },
                        {
                            type: "radio",
                            label: "Start a polling interval and stop on unmount:",
                            options: [
                                { value: "effect-cleanup", label: "useEffect with cleanup" },
                                { value: "render-only", label: "Do it directly in render" },
                            ],
                            expectedAnswer: "effect-cleanup",
                        },
                        {
                            type: "text",
                            label: "One sentence: why are missing dependencies in effects risky?",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "communication-and-tradeoffs",
            stepNumber: 5,
            title: "Explain React Decisions Like an Engineer",
            icon: "🗣️",
            explanation: `
                <h3>Use a Repeatable Communication Pattern</h3>
                <p>Strong developers do not just fix issues. They explain constraints, decisions, tradeoffs, and validation.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #334155 0%, #475569 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Problem -> Constraint -> Decision -> Tradeoff -> Validation
</pre>
                </div>
            `,
            postExplanation: `
                <p><strong>Example:</strong> "I kept <code>filter</code> in state, derived <code>visibleActivities</code> in render, avoided duplicated state to prevent stale UI, and verified by toggling filters + checking progress counts."</p>
            `,
            exercises: [
                {
                    id: "crf-comm-1",
                    title: "Engineering Explanation Drill",
                    instructions: "Practice concise technical communication.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence describing a tradeoff between splitting components vs keeping one large component:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one validation step you would include in a PR after changing filter state logic:",
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
                    id: "rf-cadence-concept",
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
                    id: "rf-cadence-read",
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
                    id: "rf-cadence-write",
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
                    id: "rf-cadence-debug",
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
            id: "crf-q1",
            question: "A value is fully computable from existing props/state each render. Best approach?",
            options: [
                { value: "a", label: "Derive it during render" },
                { value: "b", label: "Store duplicate state with useEffect" },
                { value: "c", label: "Move it to global state immediately" },
            ],
            correctAnswer: "a",
            explanation: "Derived values should usually not be duplicated in state.",
            topic: "state-modeling",
            skill: "architecture",
            skillTag: "derive-vs-store",
            difficulty: "medium",
        },
        {
            id: "crf-q2",
            question: "When next state depends on previous state, safest update pattern is:",
            options: [
                { value: "a", label: "setCount(count + 1)" },
                { value: "b", label: "setCount(prev => prev + 1)" },
                { value: "c", label: "count++ and re-render manually" },
            ],
            correctAnswer: "b",
            explanation: "Functional updates avoid stale closure issues.",
            topic: "state-updates",
            skill: "correctness",
            skillTag: "functional-setstate",
            difficulty: "medium",
        },
        {
            id: "crf-q3",
            question: "Which scenario most clearly requires useEffect?",
            options: [
                { value: "a", label: "Formatting a date string from props" },
                { value: "b", label: "Subscribing to a websocket and cleaning up" },
                { value: "c", label: "Computing visible count from an array" },
            ],
            correctAnswer: "b",
            explanation: "Effects are for external synchronization side effects.",
            topic: "effects",
            skill: "decision-making",
            skillTag: "effect-external-sync",
            difficulty: "medium",
        },
        {
            id: "crf-q4",
            question: "A child component needs to notify parent about filter changes. Best data flow?",
            options: [
                { value: "a", label: "Parent passes callback prop down" },
                { value: "b", label: "Child mutates parent state directly" },
                { value: "c", label: "Use window globals for simplicity" },
            ],
            correctAnswer: "a",
            explanation: "React data flow is top-down; callbacks communicate upward.",
            topic: "props",
            skill: "architecture",
            skillTag: "callback-props",
            difficulty: "easy",
        },
        {
            id: "crf-q5",
            question: "Most likely cause of stale filtered list UI:",
            options: [
                { value: "a", label: "Stored filtered list in state and forgot sync path" },
                { value: "b", label: "Used map/filter on render output" },
                { value: "c", label: "Used semantic variable names" },
            ],
            correctAnswer: "a",
            explanation: "Duplicated state frequently drifts out of sync.",
            topic: "state-modeling",
            skill: "debugging",
            skillTag: "duplicate-derived-state",
            difficulty: "hard",
        },
        {
            id: "crf-q6",
            question: "Which refactor is strongest for a 700-line mixed-responsibility component?",
            options: [
                { value: "a", label: "Split by behavior into smaller components/hooks with clear interfaces" },
                { value: "b", label: "Keep all logic in one file for faster search" },
                { value: "c", label: "Only rename variables" },
            ],
            correctAnswer: "a",
            explanation: "Responsibility-based decomposition improves maintainability and reviewability.",
            topic: "composition",
            skill: "architecture",
            skillTag: "split-by-responsibility",
            difficulty: "medium",
        },
        {
            id: "crf-q7",
            question: "If an effect uses `userId` but dependency array is empty, biggest risk is:",
            options: [
                { value: "a", label: "Effect may run with stale userId after changes" },
                { value: "b", label: "TypeScript automatically fixes it" },
                { value: "c", label: "No risk if UI looks fine once" },
            ],
            correctAnswer: "a",
            explanation: "Missing dependencies can freeze effect logic to outdated values.",
            topic: "effects",
            skill: "correctness",
            skillTag: "missing-effect-dependency",
            difficulty: "hard",
        },
        {
            id: "crf-q8",
            question: "Best PR statement after React state architecture changes:",
            options: [
                { value: "a", label: "Changed stuff, seems okay now" },
                { value: "b", label: "Moved filter to state, derived visible list in render, validated with filter toggle regression checks" },
                { value: "c", label: "No notes needed if tests pass" },
            ],
            correctAnswer: "b",
            explanation: "Clear decision + validation communication is critical.",
            topic: "communication",
            skill: "collaboration",
            skillTag: "decision-tradeoff-validation",
            difficulty: "medium",
        },
        {
            id: "crf-q9",
            question: "When deciding local component state vs global store, first question should be:",
            options: [
                { value: "a", label: "How many unrelated areas actually need this state?" },
                { value: "b", label: "Which option has more hype?" },
                { value: "c", label: "Can I avoid naming variables?" },
            ],
            correctAnswer: "a",
            explanation: "State scope should match actual sharing needs.",
            topic: "state-scope",
            skill: "architecture",
            skillTag: "state-local-vs-global",
            difficulty: "hard",
        },
        {
            id: "crf-q10",
            question: "If two independent API calls are required for one screen, default baseline is:",
            options: [
                { value: "a", label: "Start both in parallel, then handle success/failure intentionally" },
                { value: "b", label: "Always run sequentially by habit" },
                { value: "c", label: "Skip error handling for speed" },
            ],
            correctAnswer: "a",
            explanation: "Parallel startup is generally better when calls are independent.",
            topic: "async-in-react",
            skill: "performance",
            skillTag: "parallel-fetch-baseline",
            difficulty: "medium",
        },
        {
            id: "crf-q11",
            question: "Strongest reason to avoid mutating React state directly:",
            options: [
                { value: "a", label: "Mutations can break predictable updates and debugging assumptions" },
                { value: "b", label: "Mutations are always faster" },
                { value: "c", label: "Mutation is required for hooks to work" },
            ],
            correctAnswer: "a",
            explanation: "Immutability patterns support reliable renders and reasoning.",
            topic: "immutability",
            skill: "correctness",
            skillTag: "immutable-updates",
            difficulty: "easy",
        },
        {
            id: "crf-q12",
            question: "Most accurate architecture summary:",
            options: [
                { value: "a", label: "Minimize state, derive what you can, and isolate side effects" },
                { value: "b", label: "Store every computed value in state by default" },
                { value: "c", label: "Avoid explaining decisions to keep momentum" },
            ],
            correctAnswer: "a",
            explanation: "That principle leads to cleaner, safer React systems.",
            topic: "architecture",
            skill: "synthesis",
            skillTag: "react-core-principle",
            difficulty: "medium",
        },
    ],
};
