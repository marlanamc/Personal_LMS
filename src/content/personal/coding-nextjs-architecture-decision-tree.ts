import type { InteractiveGuideContent } from "@/types/activity";

export const codingNextjsArchitectureDecisionTreeContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Next.js Architecture Decision Tree",
            icon: "🌲",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">This guide teaches architecture judgment: when to use Server Components vs Client Components, where to fetch data, when to use API routes, and how to explain these decisions clearly.</p>
                </div>

                <h3>What You Will Be Able To Explain</h3>
                <ul>
                    <li>Why this app uses Next.js instead of plain React SPA</li>
                    <li>How App Router structure affects implementation choices</li>
                    <li>How to choose server-side vs client-side logic placement</li>
                    <li>How to debug common build/runtime mistakes in Next projects</li>
                </ul>
            `,
            tipBox: {
                title: "Quality Bar",
                content:
                    "Focus on tradeoffs and decision quality. Strong architecture answers include constraints, alternatives, and validation strategy.",
            },
            exercises: [
                {
                    id: "cna-intro-1",
                    title: "Architecture Intent",
                    instructions: "Pick the strongest architecture mindset.",
                    items: [
                        {
                            type: "radio",
                            label: "Best reason to choose Next.js for a product app:",
                            options: [
                                { value: "integrated", label: "Integrated routing, server rendering options, and API capabilities in one framework" },
                                { value: "trend", label: "Because it is popular, regardless of app needs" },
                            ],
                            expectedAnswer: "integrated",
                        },
                        {
                            type: "radio",
                            label: "A good architecture answer should start with:",
                            options: [
                                { value: "constraints", label: "Constraints and problem context" },
                                { value: "libraries", label: "List of favorite libraries" },
                            ],
                            expectedAnswer: "constraints",
                        },
                    ],
                },
            ],
        },
        {
            id: "nextjs-vs-spa",
            stepNumber: 1,
            title: "Next.js vs Plain SPA Decisions",
            icon: "⚖️",
            explanation: `
                <h3>Choose Based On Product Constraints</h3>
                <p>For interactive products with authentication, mixed rendering needs, and route-level data requirements, Next.js usually reduces integration overhead compared to assembling many separate tools in a plain SPA.</p>
            `,
            verbTable: {
                title: "Decision Signals",
                headers: ["Need", "Stronger Fit", "Why"],
                rows: [
                    ["Route-level server logic", "Next.js", "Server and client patterns live in one app model"],
                    ["Simple client-only dashboard", "SPA can work", "Lower complexity if no SSR/SEO/server boundaries needed"],
                    ["Preview deploy workflow", "Next.js + Vercel", "High iteration speed for UI and feature review"],
                    ["Strict content-only site", "Static-first tools", "Less app complexity needed"],
                ],
            },
            exercises: [
                {
                    id: "cna-next-vs-spa-1",
                    title: "Decision Cases",
                    instructions: "Select the stronger architecture choice for each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "You need authenticated dashboards, route-level data, and API handlers in same codebase:",
                            options: [
                                { value: "next", label: "Next.js app architecture" },
                                { value: "spa", label: "Client-only SPA with ad hoc services first" },
                            ],
                            expectedAnswer: "next",
                        },
                        {
                            type: "radio",
                            label: "Static marketing page with minimal interaction and no logged-in user state:",
                            options: [
                                { value: "static", label: "Static-first approach can be enough" },
                                { value: "full-next", label: "Full app complexity by default" },
                            ],
                            expectedAnswer: "static",
                        },
                        {
                            type: "text",
                            label: "Write one constraint that would justify staying with a simple SPA:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "app-router-mental-model",
            stepNumber: 2,
            title: "App Router Mental Model",
            icon: "🧭",
            explanation: `
                <h3>Think in Route Trees and Layout Boundaries</h3>
                <p>In App Router, each folder segment defines structure. Layouts compose persistent UI shells; pages define route content.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #0f172a 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.9rem; line-height: 1.5;">
app/
  layout.tsx
  dashboard/
    layout.tsx
    page.tsx
    subjects/
      page.tsx
</pre>
                </div>

                <p>Use layouts for persistent chrome and shared route context. Keep page files focused on route-specific behavior.</p>
            `,
            tipBox: {
                title: "Avoid Confusion",
                content:
                    "Do not treat every file as a generic React component only. In App Router, file location has architectural meaning.",
            },
            exercises: [
                {
                    id: "cna-router-1",
                    title: "Route Structure Reasoning",
                    instructions: "Answer based on route responsibilities.",
                    items: [
                        {
                            type: "radio",
                            label: "Where should shared dashboard sidebar shell logic generally live?",
                            options: [
                                { value: "layout", label: "dashboard/layout.tsx" },
                                { value: "every-page", label: "Duplicate it in each page.tsx" },
                            ],
                            expectedAnswer: "layout",
                        },
                        {
                            type: "radio",
                            label: "Where should route-specific content for /dashboard/subjects live?",
                            options: [
                                { value: "subjects-page", label: "dashboard/subjects/page.tsx" },
                                { value: "root-layout", label: "root app/layout.tsx only" },
                            ],
                            expectedAnswer: "subjects-page",
                        },
                    ],
                },
            ],
        },
        {
            id: "server-vs-client-boundaries",
            stepNumber: 3,
            title: "Server vs Client Component Boundaries",
            icon: "🔀",
            explanation: `
                <h3>Boundary Rule: Put Interactivity on the Client, Keep Heavy Data Logic on the Server</h3>
                <p>Client components are for event handlers, local UI state, and browser APIs. Server components are ideal for secure data fetching and assembling initial view data.</p>
            `,
            usageMeanings: [
                {
                    title: "Use Client Component when",
                    description: "Browser interactivity is required",
                    examples: [
                        {
                            sentence: "Filter chip toggles and local selection state.",
                            explanation: "Requires user interaction and immediate UI updates.",
                        },
                        {
                            sentence: "Timer, keyboard events, or localStorage usage.",
                            explanation: "Depends on browser-only APIs.",
                        },
                    ],
                },
                {
                    title: "Use Server Component when",
                    description: "You can render from data without client-side handlers",
                    examples: [
                        {
                            sentence: "Initial dashboard data assembly from database queries.",
                            explanation: "Keeps secrets server-side and reduces client workload.",
                        },
                        {
                            sentence: "Route-level content that does not need live browser event handlers.",
                            explanation: "Simplifies hydration and bundle size.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cna-boundary-1",
                    title: "Boundary Classification",
                    instructions: "Classify each responsibility.",
                    items: [
                        {
                            type: "select",
                            label: "Local filter open/close state for a panel:",
                            options: ["Client component", "Server component"],
                            expectedAnswer: "Client component",
                        },
                        {
                            type: "select",
                            label: "Secure DB query requiring server credentials:",
                            options: ["Client component", "Server component"],
                            expectedAnswer: "Server component",
                        },
                        {
                            type: "radio",
                            label: "If a component needs onClick handlers and useState:",
                            options: [
                                { value: "client", label: "It must be a Client Component" },
                                { value: "server", label: "It should remain a Server Component" },
                            ],
                            expectedAnswer: "client",
                        },
                    ],
                },
            ],
        },
        {
            id: "data-fetching-and-api-routes",
            stepNumber: 4,
            title: "Data Fetching and API Route Strategy",
            icon: "📡",
            explanation: `
                <h3>Pick Fetch Location Based On Data Consumer</h3>
                <p>If data is only needed to render initial route UI, fetch server-side. If data is user-triggered and repeatedly refreshed on the client, use client fetching patterns. API routes are useful for browser-triggered mutations and controlled server-side orchestration.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.4rem 0;"><strong>Decision prompts:</strong></p>
                    <ol style="margin: 0; padding-left: 1rem;">
                        <li>Is this request needed for first paint?</li>
                        <li>Does it require secrets/server credentials?</li>
                        <li>Is it user-triggered with frequent updates?</li>
                    </ol>
                </div>
            `,
            exercises: [
                {
                    id: "cna-data-1",
                    title: "Fetch Placement Cases",
                    instructions: "Choose the strongest placement decision.",
                    items: [
                        {
                            type: "radio",
                            label: "Initial dashboard stats needed before user interaction:",
                            options: [
                                { value: "server", label: "Fetch on server route render" },
                                { value: "client", label: "Delay all data fetch until after hydration by default" },
                            ],
                            expectedAnswer: "server",
                        },
                        {
                            type: "radio",
                            label: "User clicks refresh comments every few seconds:",
                            options: [
                                { value: "client-refresh", label: "Client-driven fetch/update pattern" },
                                { value: "server-only", label: "Only server render once and never refetch" },
                            ],
                            expectedAnswer: "client-refresh",
                        },
                        {
                            type: "text",
                            label: "Name one reason to use an API route even in a full-stack Next app:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "build-debugging-and-communication",
            stepNumber: 5,
            title: "Build Debugging and Architecture Communication",
            icon: "🛠️",
            explanation: `
                <h3>Production Confidence = Logs + Clear Writeups</h3>
                <p>Many failures in deployment are type mismatches, environment issues, or build-time assumptions. Your advantage comes from reading logs precisely and writing concise root-cause notes.</p>
            `,
            postExplanation: `
                <p><strong>Strong incident note template:</strong> issue summary -> evidence from logs -> root cause -> code/config fix -> validation steps -> residual risk.</p>
            `,
            exercises: [
                {
                    id: "cna-debug-1",
                    title: "Build Log Triage",
                    instructions: "Use engineering triage decisions, not guesses.",
                    items: [
                        {
                            type: "radio",
                            label: "Log says property does not exist on type. First move?",
                            options: [
                                { value: "trace-type", label: "Find the type definition and align shape across usage points" },
                                { value: "cast-any", label: "Cast as any immediately and continue" },
                            ],
                            expectedAnswer: "trace-type",
                        },
                        {
                            type: "radio",
                            label: "Build fails because external fonts cannot be fetched in restricted env. Best interpretation?",
                            options: [
                                { value: "env-specific", label: "Environment/network constraint, not necessarily app logic failure" },
                                { value: "random", label: "Ignore all build output and retry repeatedly" },
                            ],
                            expectedAnswer: "env-specific",
                        },
                        {
                            type: "text",
                            label: "Write one sentence root-cause summary for a TypeScript deployment error:",
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
                    id: "nadt-cadence-concept",
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
                    id: "nadt-cadence-read",
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
                    id: "nadt-cadence-write",
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
                    id: "nadt-cadence-debug",
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
            id: "cna-q1",
            question: "Best default reason to choose Next.js over plain SPA in this LMS context:",
            options: [
                { value: "a", label: "Integrated routing + server/client boundaries + API capability" },
                { value: "b", label: "Random preference with no constraints" },
                { value: "c", label: "To avoid all architecture decisions" },
            ],
            correctAnswer: "a",
            explanation: "Framework choice should map to app constraints and integration needs.",
            topic: "framework-choice",
            skill: "architecture",
            skillTag: "nextjs-vs-spa-fit",
            difficulty: "medium",
        },
        {
            id: "cna-q2",
            question: "In App Router, layouts are primarily used for:",
            options: [
                { value: "a", label: "Persistent route shells and shared structure" },
                { value: "b", label: "Storing local input state by default" },
                { value: "c", label: "Replacing all page files" },
            ],
            correctAnswer: "a",
            explanation: "Layouts define persistent shells and shared route composition.",
            topic: "app-router",
            skill: "architecture",
            skillTag: "layout-responsibility",
            difficulty: "easy",
        },
        {
            id: "cna-q3",
            question: "A component requires onClick handlers and useState. It should be:",
            options: [
                { value: "a", label: "Client Component" },
                { value: "b", label: "Server Component only" },
                { value: "c", label: "Middleware file" },
            ],
            correctAnswer: "a",
            explanation: "Interactive browser state/handlers require client-side execution.",
            topic: "component-boundary",
            skill: "decision-making",
            skillTag: "client-interactivity",
            difficulty: "easy",
        },
        {
            id: "cna-q4",
            question: "Secure DB query requiring server credentials should run:",
            options: [
                { value: "a", label: "On server side boundary" },
                { value: "b", label: "In browser component directly" },
                { value: "c", label: "Inside CSS module" },
            ],
            correctAnswer: "a",
            explanation: "Secrets and privileged data access belong on server boundaries.",
            topic: "data-security",
            skill: "architecture",
            skillTag: "server-credentials",
            difficulty: "medium",
        },
        {
            id: "cna-q5",
            question: "If a value is needed only for initial route rendering and not interactive updates, default fetch location is:",
            options: [
                { value: "a", label: "Server-side route render path" },
                { value: "b", label: "Client-only refetch loop by default" },
                { value: "c", label: "Browser localStorage only" },
            ],
            correctAnswer: "a",
            explanation: "Server placement is often cleaner for initial render data needs.",
            topic: "fetch-placement",
            skill: "performance",
            skillTag: "initial-render-fetch",
            difficulty: "medium",
        },
        {
            id: "cna-q6",
            question: "Most likely risk of unclear server/client boundary decisions:",
            options: [
                { value: "a", label: "Hydration issues, misplaced logic, and debugging confusion" },
                { value: "b", label: "Automatic performance gains" },
                { value: "c", label: "No practical impact" },
            ],
            correctAnswer: "a",
            explanation: "Boundary confusion frequently causes reliability and maintenance issues.",
            topic: "component-boundary",
            skill: "debugging",
            skillTag: "boundary-risk",
            difficulty: "hard",
        },
        {
            id: "cna-q7",
            question: "Best first step when deployment log shows TypeScript property mismatch:",
            options: [
                { value: "a", label: "Trace declared type and reconcile all usage sites" },
                { value: "b", label: "Disable types globally" },
                { value: "c", label: "Retry deploy without reading log" },
            ],
            correctAnswer: "a",
            explanation: "Type errors are resolved by aligning data contracts, not suppressing signals.",
            topic: "build-triage",
            skill: "debugging",
            skillTag: "type-contract-alignment",
            difficulty: "hard",
        },
        {
            id: "cna-q8",
            question: "Strong architecture communication includes:",
            options: [
                { value: "a", label: "Constraints, options considered, decision, tradeoffs, and validation" },
                { value: "b", label: "Only final code diff" },
                { value: "c", label: "No mention of risk" },
            ],
            correctAnswer: "a",
            explanation: "High-quality communication improves review speed and decision trust.",
            topic: "communication",
            skill: "collaboration",
            skillTag: "decision-template",
            difficulty: "medium",
        },
        {
            id: "cna-q9",
            question: "A user-triggered refresh action that runs frequently is often best handled by:",
            options: [
                { value: "a", label: "Client-side fetch/update flow" },
                { value: "b", label: "Never updating after initial server render" },
                { value: "c", label: "Only build-time static output" },
            ],
            correctAnswer: "a",
            explanation: "Frequent user-triggered refresh is a client interaction pattern.",
            topic: "fetch-placement",
            skill: "decision-making",
            skillTag: "client-refresh-pattern",
            difficulty: "medium",
        },
        {
            id: "cna-q10",
            question: "In route architecture, duplicating common shell across many pages is usually:",
            options: [
                { value: "a", label: "A sign to use a layout boundary" },
                { value: "b", label: "Preferred for maintainability" },
                { value: "c", label: "Required by App Router" },
            ],
            correctAnswer: "a",
            explanation: "Layouts reduce duplication and centralize shared route structure.",
            topic: "app-router",
            skill: "architecture",
            skillTag: "layout-de-duplication",
            difficulty: "medium",
        },
        {
            id: "cna-q11",
            question: "Best interpretation of environment-specific font fetch build failures in a restricted sandbox:",
            options: [
                { value: "a", label: "Could be infra/network limitation, separate from app logic correctness" },
                { value: "b", label: "Guaranteed application architecture failure" },
                { value: "c", label: "Reason to ignore all build diagnostics" },
            ],
            correctAnswer: "a",
            explanation: "Different environments can fail for non-code network constraints.",
            topic: "build-triage",
            skill: "diagnostics",
            skillTag: "environment-vs-code",
            difficulty: "hard",
        },
        {
            id: "cna-q12",
            question: "Which statement reflects strong Next.js architecture judgment?",
            options: [
                { value: "a", label: "Use server and client boundaries intentionally based on data sensitivity and interactivity" },
                { value: "b", label: "Put all logic in client components by default" },
                { value: "c", label: "Avoid documenting framework decisions" },
            ],
            correctAnswer: "a",
            explanation: "Intentional boundary placement is core to robust Next.js systems.",
            topic: "architecture",
            skill: "synthesis",
            skillTag: "intentional-boundary-design",
            difficulty: "hard",
        },
    ],
};

