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
                    <li>Props vs state vs derived values—the most important React decision</li>
                    <li>Render behavior, batching, and stale state pitfalls</li>
                    <li>When to use (and avoid) useEffect</li>
                    <li>Functional setState vs direct updates—when each is correct</li>
                    <li>How to explain React decisions to developers clearly</li>
                </ul>

                <p>Professional React code minimizes state, derives what it can, and uses effects only for external synchronization. This guide teaches that mindset through decision trees, comparison tables, and real-world scenarios.</p>

                <p>You will see state vs derived comparison tables, a useEffect decision tree, component boundary comparisons, and bug diagnosis drills. Each section builds toward the same principle: model data flow correctly first, then implement UI.</p>

                <p><strong>Learning path:</strong> Start with component boundaries—where to split and where to keep together. Then master state vs derived—the most common React bug source. Finally, learn when to use effects and when to derive in render. Together these form the professional React mindset.</p>
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
            tipBox: {
                title: "Boundary Rule",
                content:
                    "A component boundary should match a responsibility boundary. If you cannot describe a component in one sentence, split it.",
            },
            comparison: {
                title: "Component Boundary Comparison",
                leftLabel: "Split Into Smaller Components",
                rightLabel: "Keep Together",
                rows: [
                    {
                        label: "When",
                        left: "Multiple unrelated concerns (fetch, filter, render, analytics)",
                        right: "Tiny UI, tightly coupled (single toggle + panel)",
                    },
                    {
                        label: "Signal",
                        left: "8+ state values, 500+ lines, cannot describe in one sentence",
                        right: "Splitting adds complexity without maintainability gain",
                    },
                    {
                        label: "Example",
                        left: "<SubjectPage><FilterBar /><ActivityList /></SubjectPage>",
                        right: "Single <ThemeToggle /> with one state value",
                    },
                ],
            },
            explanation: `
                <h3>Good Components Have One Job</h3>
                <p>A component boundary should reflect a responsibility boundary. If one component handles unrelated concerns (fetching, filtering, rendering, animation, analytics), split it.</p>

                <p>When in doubt, ask: can I describe what this component does in one sentence? If not, the boundary is probably wrong. Splitting by behavior (controls, list rendering, item card) makes code easier to test, review, and refactor.</p>

                <p>Split by responsibility: FilterBar owns filter state and chip clicks; ActivityList receives filter and activities as props and renders cards; ActivityCard receives a single activity. Each component has one job and clear props interface.</p>

                <p><strong>Testing benefit:</strong> Split components are easier to unit test. FilterBar can be tested for chip clicks; ActivityList can be tested with mock filter and activities. A 700-line monolith is hard to test in isolation.</p>

                <p>When to keep together: A small toggle and its panel that share tight state—splitting would add props without real benefit. A single-purpose form with a few fields—no need to extract each input. The rule: split when responsibilities diverge, not when the file grows.</p>

                <p><strong>Reviewability:</strong> A PR with 5 focused components is easier to review than a PR with one 500-line component. Reviewers can understand each piece in isolation.</p>

                <p>Over-splitting tiny, tightly coupled UI (e.g., a single toggle and its panel) adds file and prop-drilling overhead without real benefit. The goal is clarity and maintainability, not file count.</p>

                <p><strong>Real-world rule:</strong> If you cannot describe what a component does in one sentence, split it. If splitting would require passing 10+ props down, consider lifting state or using a different boundary—sometimes the split point is at a different level.</p>

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
                        {
                            type: "radio",
                            label: "A 200-line component handles filter state, card rendering, and API fetching. Best refactor:",
                            options: [
                                {
                                    value: "split",
                                    label: "Split into FilterBar (state), ActivityList (data), and ActivityCard (render)",
                                },
                                { value: "keep", label: "Keep together because it works" },
                            ],
                            expectedAnswer: "split",
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
            comparison: {
                title: "State vs Derived Decision",
                leftLabel: "Store in State",
                rightLabel: "Derive During Render",
                rows: [
                    {
                        label: "When",
                        left: "User-driven or async-changing; cannot be computed from existing data",
                        right: "Can be calculated from props or state each render",
                    },
                    {
                        label: "Examples",
                        left: "Search input text, selected filter chip, API response data",
                        right: "visibleActivities = activities.filter(...), completedPct = completed/total",
                    },
                    {
                        label: "Bug risk",
                        left: "Correct when value changes from user or async source",
                        right: "Duplicating derived data in state causes stale UI",
                    },
                ],
            },
            explanation: `
                <h3>The Most Important React Decision</h3>
                <p>If a value can be calculated from existing props/state, prefer deriving it during render instead of storing duplicate state.</p>

                <p>This is the single most common source of React bugs: storing both <code>items</code> and <code>filteredItems</code> in state. When the filter changes, you must remember to update both—and if you forget, the UI shows stale data. Derive instead: <code>const visible = items.filter(...)</code>.</p>

                <p><strong>Example:</strong> For activities and filter chip selection, do not store <code>visibleActivities</code> in state. Derive it: <code>const visible = activities.filter(a => a.type === filter)</code>. When filter changes, the derived value updates automatically on the next render.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.6rem 0;"><strong>Rule of thumb:</strong></p>
                    <ul style="margin: 0; padding-left: 1rem;">
                        <li><strong>Props:</strong> read-only input from parent</li>
                        <li><strong>State:</strong> user-driven or async-changing data you cannot derive</li>
                        <li><strong>Derived:</strong> computed from props/state (do not duplicate)</li>
                    </ul>
                </div>

                <p><strong>Decision flow:</strong> Can I compute this value from props or state during render? Yes → derive it, do not store in state. No → is it user-driven or from async? Yes → state. No → reconsider whether you need it.</p>

                <p><strong>Common mistake:</strong> Storing <code>filteredItems</code> in state when it can be computed from <code>items</code> and <code>filter</code>. When filter changes, you must remember to call <code>setFilteredItems</code>. If you forget or update in wrong order, the UI shows stale data. Derive instead.</p>
            `,
            verbTable: {
                title: "State vs Derived Decision",
                headers: ["Question", "Answer", "Action"],
                rows: [
                    ["Can I compute this from props/state?", "Yes", "Derive in render—do not store"],
                    ["Can I compute this from props/state?", "No", "Is it user-driven or async?"],
                    ["User-driven or async?", "Yes", "useState"],
                    ["User-driven or async?", "No", "Reconsider whether you need it"],
                ],
            },
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
                        {
                            type: "select",
                            label: "You have activities array and selected filter chip. visibleActivities should be:",
                            options: [
                                "Derived: activities.filter(a => a.type === filter)",
                                "State: stored in useState(activities)",
                                "Props: passed from parent",
                            ],
                            expectedAnswer: "Derived: activities.filter(a => a.type === filter)",
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
            tipBox: {
                title: "Functional setState Rule",
                content:
                    "When next state depends on previous state (e.g., increment, append), use the functional form: setCount(prev => prev + 1). Avoid setCount(count + 1) in callbacks—closures capture stale count.",
            },
            explanation: `
                <h3>Why <code>setState</code> Bugs Happen</h3>
                <p>State updates are scheduled and batched. If you rely on stale closures—reading <code>count</code> instead of using the functional form <code>prev => prev + 1</code>—rapid updates can overwrite each other and you lose increments.</p>

                <p>Similarly, mutating objects or arrays in state (e.g., <code>items.push(newItem)</code>) breaks React's change detection. React compares by reference; mutating the same object does not trigger re-renders. Always create new references: <code>setItems(prev => [...prev, newItem])</code> or <code>setUser(prev => ({ ...prev, name }))</code>.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin-top: 1rem;">
<pre style="margin: 0; font-size: 0.9rem; line-height: 1.55;">
// Safer when next state depends on previous state:
setCount((prev) => prev + 1);

// Risky in rapid updates:
setCount(count + 1);
</pre>
                </div>

                <p><strong>Why functional updates matter:</strong> When you click "increment" twice quickly, React may batch updates. With <code>setCount(count + 1)</code>, both reads see the same stale <code>count</code>. With <code>setCount(prev => prev + 1)</code>, each update receives the latest previous value.</p>
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
                        {
                            type: "text",
                            label: "In one sentence, why does mutating state with push fail to update React UI?",
                            acceptAnyAttempt: true,
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
            verbTable: {
                title: "useEffect Decision Tree",
                headers: ["Question", "Answer", "Action"],
                rows: [
                    ["Can I compute this during render?", "Yes", "No effect—derive in render"],
                    ["Can I compute this during render?", "No", "Next: Is it syncing to external system?"],
                    ["Syncing to API / DOM / subscription / timer?", "Yes", "useEffect with proper deps"],
                    ["Syncing to API / DOM / subscription / timer?", "No", "Reconsider—maybe derive in render"],
                    ["Effect creates subscription or timer?", "Yes", "Add cleanup function in return"],
                    ["Effect creates subscription or timer?", "No", "Ensure deps array includes all used values"],
                ],
            },
            explanation: `
                <h3>Not Everything Needs an Effect</h3>
                <p>Effects are for syncing with the outside world: subscriptions, timers, network, browser APIs. If logic is pure derivation from props/state, keep it in render.</p>

                <p>Common mistake: using useEffect to set state from props. If <code>completedPct</code> can be computed as <code>completed / total * 100</code>, do that in render—do not call <code>setCompletedPct</code> in an effect. Effects should run when you need to talk to something outside React (network, DOM, global listeners).</p>

                <p>Effects with missing dependencies are another frequent bug. If your effect uses <code>userId</code> but the dependency array is empty, the effect will run once with the initial value and never update when <code>userId</code> changes. Include all values from the effect body in the dependency array—or refactor so you do not need the effect.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.4rem 0;"><strong>Quick check:</strong></p>
                    <ol style="margin: 0; padding-left: 1rem;">
                        <li>Can I compute this during render? → No effect.</li>
                        <li>Am I syncing to external system (API, DOM API, subscription)? → Effect is appropriate.</li>
                        <li>Do I need cleanup (unsubscribe/cancel timer)? → Add cleanup function.</li>
                    </ol>
                </div>

                <h4 style="margin-top: 1.5rem;">When Effects Are Correct</h4>
                <p>Effects are appropriate for: fetching data on mount or when IDs change, subscribing to WebSockets or browser events, syncing to localStorage or document.title, and starting timers. Always add cleanup when you create subscriptions or timers so they do not leak across renders.</p>

                <p><strong>Example effect with cleanup:</strong> <code>useEffect(() => { const id = setInterval(fetchProgress, 5000); return () => clearInterval(id); }, [userId])</code>. The return function runs on unmount or when userId changes, preventing orphaned intervals.</p>

                <p><strong>Dependency array rule:</strong> Include every value from the effect body that can change. Missing dependencies cause stale closures—the effect runs with outdated values. If you need to omit something intentionally (e.g., stable callback), document why.</p>

                <h4 style="margin-top: 1.5rem;">When Not to Use Effects</h4>
                <p>Do not use effects for: computing derived values (do that in render), resetting state on prop change when you can lift state, or syncing two pieces of state—usually one should be derived. Effects are escape hatches for external systems, not for modeling React state.</p>

                <p><strong>Anti-pattern:</strong> <code>useEffect(() => setFilteredItems(items.filter(...)), [items, filter])</code>. This syncs state from props—better to derive: <code>const filteredItems = items.filter(...)</code> in render. Effects are for external sync, not for React-to-React state mirroring.</p>

                <p><strong>When effects are required:</strong> Fetching data on mount or when IDs change; subscribing to WebSocket or window events; syncing to document.title or localStorage; starting and cleaning up timers or intervals. In all cases, include a cleanup function if the effect creates something that persists.</p>

                <p><strong>Cleanup example:</strong> <code>useEffect(() => { const sub = subscribe(userId); return () => sub.unsubscribe(); }, [userId])</code>. The return function runs when the effect re-runs (userId changed) or when the component unmounts. Always clean up subscriptions and timers to prevent memory leaks.</p>

                <p><strong>Effect checklist:</strong> (1) Can I derive this in render? If yes, no effect. (2) Am I syncing to external system? If yes, effect. (3) Do I create subscription or timer? If yes, add cleanup. (4) Does the dependency array include all used values? If no, add them.</p>

                <p><strong>Debugging tip:</strong> When an effect seems to run with stale data, check the dependency array. If you use <code>userId</code> inside the effect but the deps are <code>[]</code>, the effect will never re-run when userId changes. Add <code>userId</code> to the dependency array.</p>
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
                            type: "radio",
                            label: "Sync document.title when route changes:",
                            options: [
                                { value: "effect", label: "useEffect (external DOM API)" },
                                { value: "render", label: "Compute in render only" },
                            ],
                            expectedAnswer: "effect",
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

                <p>Example: "I kept <code>filter</code> in state because it is user-driven; derived <code>visibleActivities</code> in render to avoid stale UI; avoided useEffect for filtering because it is pure derivation. Validated by toggling filters and checking progress counts." This tells reviewers what you decided and why.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #334155 0%, #475569 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Problem -> Constraint -> Decision -> Tradeoff -> Validation
</pre>
                </div>

                <p><strong>Problem:</strong> Filter chip selection was not updating activity list. <strong>Constraint:</strong> Data flow must stay top-down. <strong>Decision:</strong> Keep filter in state, derive visible list in render. <strong>Tradeoff:</strong> Computation runs each render; acceptable for moderate list sizes. <strong>Validation:</strong> Toggle filters and verify card counts and selection state.</p>

                <h4 style="margin-top: 1.5rem;">Common Communication Mistakes</h4>
                <p>Weak PR notes: "Fixed React stuff" or "Updated components." Strong notes: "Moved filter to state, derived visible list in render; validated by toggling chips and checking counts." The difference is specificity—reviewers need to know what changed and how you validated it.</p>

                <p><strong>Professional habit:</strong> Before opening a PR, write 2–3 sentences summarizing: what state you added or changed, what you derived, what effects you use and why, and how you validated the behavior. This becomes your PR description and improves review quality.</p>

                <p><strong>Example PR summary:</strong> "Refactored filter state: moved chip selection to useState, derived visible activities in render. No useEffect for filtering—pure derivation. Validated by toggling chips and verifying card counts. Added integration test for filter-to-card mapping."</p>

                <p>This level of specificity tells reviewers exactly what changed, why, and how you validated it. Avoid vague notes like "fixed React bugs" or "updated components"—they block efficient review.</p>

                <p><strong>Refactor communication:</strong> When changing component boundaries, explain what you split and why. When changing state model, explain what you moved to state vs derived. When adding effects, explain what external system you sync to.</p>

                <p>These habits scale: the same structure works for standups, incident follow-ups, and design docs. Model data flow first, then implement; communicate decisions clearly.</p>

                <h4 style="margin-top: 1.5rem;">Practice Pattern</h4>
                <p>Before every React PR: state what changed, why, and how you validated it. This habit improves code review and reduces defects. Strong communication is as important as strong code—teams that document decisions ship with fewer regressions.</p>
            `,
            postExplanation: `
                <p><strong>Example:</strong> "I kept <code>filter</code> in state, derived <code>visibleActivities</code> in render, avoided duplicated state to prevent stale UI, and verified by toggling filters + checking progress counts."</p>
                <p><strong>Tradeoff example:</strong> Splitting a large component improves testability and reviewability but adds prop interfaces and file overhead. Keep together when the UI is tiny and tightly coupled; split when responsibilities diverge or when testing/review becomes hard.</p>
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
                        {
                            type: "radio",
                            label: "After refactoring filter state, best PR note style:",
                            options: [
                                {
                                    value: "specific",
                                    label: "Moved filter to state, derived visible list; validated by toggling chips",
                                },
                                { value: "vague", label: "Updated React components" },
                            ],
                            expectedAnswer: "specific",
                        },
                    ],
                },
            ],
        },
        {
            id: "practice-cadence-and-outcomes",
            stepNumber: 99,
            title: "Practice Cadence + I Can Now",
            icon: "✅",
            explanation: `
                <h3>Standard Practice Cadence</h3>
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> read code -> write code -> debug scenario.</p>
                <p>For React specifically: identify state vs derived, trace data flow top-down, and validate that filter changes propagate to UI without stale closures or duplicate state.</p>
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
                    <li>Distinguish state vs derived, choose component boundaries, and use useEffect only for external sync.</li>
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
        {
            id: "crf-q13",
            question: "You need to update document.title when route changes. Best approach?",
            options: [
                { value: "a", label: "useEffect syncing to DOM API" },
                { value: "b", label: "Compute in render body only" },
                { value: "c", label: "Use global variable and set in event handler" },
            ],
            correctAnswer: "a",
            explanation: "document.title is external; effects sync React to external systems.",
            topic: "effects",
            skill: "decision-making",
            skillTag: "effect-dom-sync",
            difficulty: "easy",
        },
        {
            id: "crf-q14",
            question: "A component has filter state and filtered list. Filter changes but list does not update. Most likely cause:",
            options: [
                { value: "a", label: "Filtered list stored in state and not recalculated on filter change" },
                { value: "b", label: "Using functional setState incorrectly" },
                { value: "c", label: "Too many components" },
            ],
            correctAnswer: "a",
            explanation: "Derived values in state drift; derive during render instead.",
            topic: "state-modeling",
            skill: "debugging",
            skillTag: "derived-not-synced",
            difficulty: "hard",
        },
        {
            id: "crf-q15",
            question: "Which component boundary choice is strongest for a page with filter chips and activity cards?",
            options: [
                { value: "a", label: "FilterBar + ActivityList + ActivityCard as separate components" },
                { value: "b", label: "One 800-line component for everything" },
                { value: "c", label: "Only split when the file exceeds 1000 lines" },
            ],
            correctAnswer: "a",
            explanation: "Boundaries by responsibility improve testability and reviewability.",
            topic: "composition",
            skill: "architecture",
            skillTag: "component-boundaries",
            difficulty: "medium",
        },
    ],
};
