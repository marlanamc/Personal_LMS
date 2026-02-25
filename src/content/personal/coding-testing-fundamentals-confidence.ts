import type { InteractiveGuideContent } from "@/types/activity";

export const codingTestingFundamentalsConfidenceContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Testing Fundamentals for Confidence",
            icon: "🧪",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Testing is not about maximizing test count. It is about reducing deployment fear by proving critical behavior with the smallest useful test set.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Choose unit vs integration vs e2e based on risk, not habit</li>
                    <li>Write regression tests that prevent repeat bugs</li>
                    <li>Design reliable assertions that survive refactors</li>
                    <li>Name tests and diagnose flaky failures systematically</li>
                    <li>Explain testing strategy clearly in PRs and incident follow-ups</li>
                </ul>
            `,
            tipBox: {
                title: "Confidence Rule",
                content:
                    "Write tests for behaviors users care about and failures you cannot afford, not for every line of implementation.",
            },
            exercises: [
                {
                    id: "ctfc-intro-1",
                    title: "Strategy Mindset",
                    instructions: "Choose the strongest testing mindset.",
                    items: [
                        {
                            type: "radio",
                            label: "Best reason to add tests in this LMS:",
                            options: [
                                { value: "risk", label: "Reduce release risk on high-impact user flows" },
                                { value: "coverage", label: "Hit 100% coverage regardless of test quality" },
                            ],
                            expectedAnswer: "risk",
                        },
                        {
                            type: "radio",
                            label: "Strong tests should primarily verify:",
                            options: [
                                { value: "behavior", label: "Observable behavior and outcomes" },
                                { value: "internals", label: "Private internal implementation details" },
                            ],
                            expectedAnswer: "behavior",
                        },
                    ],
                },
            ],
        },
        {
            id: "test-type-decision-tree",
            stepNumber: 1,
            title: "Unit vs Integration vs E2E Decision Tree",
            icon: "🌲",
            explanation: `
                <h3>Pick the Cheapest Test That Proves the Right Risk</h3>
                <p>Use unit tests for pure logic, integration tests for component/data interaction, and e2e tests for critical user journeys across app boundaries.</p>

                <p>Unit tests are fast and cheap—use them for anything with no side effects. Integration tests add network or database boundaries—use them when components interact with data. E2E tests are slow and brittle—use them sparingly for the few flows that users cannot afford to have broken.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Test Type Decision Tree</strong></p>
                    <pre style="margin: 0; font-size: 0.85rem; line-height: 1.6; background: rgba(0,0,0,0.05); padding: 0.75rem; border-radius: 0.5rem;">
Is it pure logic with no side effects?
  → YES: Unit test (fastest feedback)
  → NO: Does it involve UI/component rendering?
    → YES: Does it require user interaction across multiple pages?
      → YES: E2E test (highest confidence)
      → NO: Integration test (component + state)
    → NO: Does it touch external APIs or database?
      → YES: Mock boundary, write integration test
      → NO: Unit test with focused setup</pre>
                </div>
            `,
            verbTable: {
                title: "Test Type Selection",
                headers: ["Test Type", "Best For", "Common Mistake"],
                rows: [
                    ["Unit", "Pure logic and utility rules", "Mocking everything then asserting implementation"],
                    ["Integration", "Component + state/data interactions", "Over-mocking so nothing real is exercised"],
                    ["E2E", "Critical route-to-route user journeys", "Trying to cover every edge case only in e2e"],
                ],
            },
            exercises: [
                {
                    id: "ctfc-types-1",
                    title: "Risk-to-Test Mapping",
                    instructions: "Choose the strongest first test for each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "A pure `formatProgressLabel(completed, total)` utility has bug risk. First test type:",
                            options: [
                                { value: "unit", label: "Unit test" },
                                { value: "e2e", label: "E2E test" },
                            ],
                            expectedAnswer: "unit",
                        },
                        {
                            type: "radio",
                            label: "Notebook filter chips map selected type to visible activity cards. First test type:",
                            options: [
                                { value: "integration", label: "Integration test around rendered UI behavior" },
                                { value: "unit", label: "Only unit tests on helper constants" },
                            ],
                            expectedAnswer: "integration",
                        },
                        {
                            type: "radio",
                            label: "Login -> dashboard -> complete activity -> progress updates. First safety net:",
                            options: [
                                { value: "e2e", label: "E2E smoke test on primary journey" },
                                { value: "unit", label: "Unit tests only" },
                            ],
                            expectedAnswer: "e2e",
                        },
                    ],
                },
            ],
        },
        {
            id: "writing-high-value-assertions",
            stepNumber: 2,
            title: "Writing High-Value Assertions",
            icon: "🎯",
            comparison: {
                title: "Assertion Quality Comparison",
                leftLabel: "Strong Assertion",
                rightLabel: "Weak Assertion",
                rows: [
                    {
                        label: "Target",
                        left: "User-visible behavior or outcome",
                        right: "Implementation detail (class names, DOM structure)",
                    },
                    {
                        label: "Stability",
                        left: "Survives refactors when behavior is unchanged",
                        right: "Breaks on style or structural changes",
                    },
                    {
                        label: "Example",
                        left: "After selecting 'Guides', only guide activities are rendered",
                        right: "Card container has exact Tailwind class ordering",
                    },
                ],
            },
            explanation: `
                <h3>Assert Outcomes, Not Internal Wiring</h3>
                <p>Tests become fragile when they over-couple to implementation details (class names, hook call counts, or private function ordering). Prefer user-visible behavior and stable semantic selectors.</p>

                <p>Strong assertions describe what the user or system cares about: visible results, data shape, navigation state. Weak assertions lock you to how the code achieves that outcome—so any refactor breaks the test even when behavior is correct.</p>

                <p><strong>Common mistake:</strong> Asserting on CSS class names or DOM structure order. These change with style refactors and break tests without catching real bugs. Instead, assert on semantic attributes (e.g., <code>data-testid</code>) or user-visible text.</p>
            `,
            usageMeanings: [
                {
                    title: "Strong assertion pattern",
                    description: "User-facing and stable",
                    examples: [
                        {
                            sentence: "Expect 'Guide' activities to be visible after clicking Guides chip.",
                            explanation: "Checks business behavior directly.",
                        },
                        {
                            sentence: "Expect focus timer button text/state to change when timer starts.",
                            explanation: "Verifies meaningful interaction outcome.",
                        },
                    ],
                },
                {
                    title: "Weak assertion pattern",
                    description: "Implementation-coupled",
                    examples: [
                        {
                            sentence: "Assert specific tailwind class ordering on every element.",
                            explanation: "Breaks often without behavior regressions.",
                        },
                        {
                            sentence: "Assert internal hook call sequence.",
                            explanation: "Locks tests to refactor-sensitive internals.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ctfc-assertions-1",
                    title: "Assertion Quality Drill",
                    instructions: "Pick the stronger assertion strategy.",
                    items: [
                        {
                            type: "radio",
                            label: "Testing activity filtering behavior. Better assertion:",
                            options: [
                                {
                                    value: "behavior",
                                    label: "After selecting 'Flash Cards', only flash-card activities are rendered",
                                },
                                {
                                    value: "classes",
                                    label: "Card container has exact class string with expected ordering",
                                },
                            ],
                            expectedAnswer: "behavior",
                        },
                        {
                            type: "text",
                            label: "Write one resilient assertion for progress-bar behavior after completing an activity:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "regression-test-patterns",
            stepNumber: 3,
            title: "Regression Test Patterns",
            icon: "🛡️",
            explanation: `
                <h3>Bug -> Failing Test -> Fix -> Passing Test</h3>
                <p>For repeat issues, regression tests should encode the exact failure mode that escaped. This changes debugging pain into permanent safety.</p>

                <p>The key is to write the test while the bug is still present—it must fail first. Then apply the fix and verify the test passes. If you fix first and then write the test, you risk asserting the wrong behavior or missing edge cases.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
1) Reproduce bug
2) Write test that fails for the bug
3) Apply minimal fix
4) Verify test passes and nearby behavior still works
</pre>
                </div>
            `,
            tipBox: {
                title: "Scope Control",
                content:
                    "Fix only the proven cause first. Large refactors during incidents increase risk unless separately planned and tested.",
            },
            exercises: [
                {
                    id: "ctfc-regression-1",
                    title: "Regression Design",
                    instructions: "Decide the best regression test shape for each bug.",
                    items: [
                        {
                            type: "radio",
                            label: "Bug: Featured card icon shows emoji instead of subject lucide icon. Strong regression test:",
                            options: [
                                {
                                    value: "icon-contract",
                                    label: "Assert featured card uses same icon mapping source as subject metadata",
                                },
                                { value: "screenshot-only", label: "Only compare full-page screenshot snapshots" },
                            ],
                            expectedAnswer: "icon-contract",
                        },
                        {
                            type: "radio",
                            label: "Bug: Build failed due to missing `accentBorder` type key. Best prevention test:",
                            options: [
                                {
                                    value: "typecheck",
                                    label: "Run strict TypeScript check in CI on PRs",
                                },
                                { value: "manual", label: "Rely on manual browser checks" },
                            ],
                            expectedAnswer: "typecheck",
                        },
                        {
                            type: "text",
                            label: "Describe one regression test for 'chip selected but all cards still look identical' issue:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "mocks-fixtures-and-test-data",
            stepNumber: 4,
            title: "Mocks, Fixtures, and Test Data",
            icon: "📦",
            explanation: `
                <h3>Mock Boundaries, Not Everything</h3>
                <p>Mock external dependencies (network/time/randomness) but keep business logic real. Use realistic fixtures so tests represent actual user data shape.</p>

                <p>Over-mocking creates false confidence: the test passes because nothing real runs. When you mock the network but keep transformation logic real, you verify that your code correctly handles API responses. When you mock everything, you only verify that your mocks return what you told them to—which tells you nothing about production behavior.</p>
            `,
            exercises: [
                {
                    id: "ctfc-mocks-1",
                    title: "Mocking Decisions",
                    instructions: "Choose the lower-risk strategy.",
                    items: [
                        {
                            type: "radio",
                            label: "For API integration tests in UI components, what should usually be mocked?",
                            options: [
                                {
                                    value: "network-boundary",
                                    label: "Network boundary/HTTP layer while keeping transformation logic real",
                                },
                                { value: "everything", label: "All helper logic and all component internals" },
                            ],
                            expectedAnswer: "network-boundary",
                        },
                        {
                            type: "radio",
                            label: "Best fixture data for activity cards tests:",
                            options: [
                                { value: "realistic", label: "Realistic mixed activity types and status states" },
                                { value: "minimal", label: "Single hardcoded item with placeholder fields" },
                            ],
                            expectedAnswer: "realistic",
                        },
                        {
                            type: "select",
                            label: "For a test that calls an API to fetch user progress, what should you mock?",
                            options: [
                                "Network/HTTP layer only",
                                "Business logic that transforms the response",
                                "Both network and logic",
                                "Neither—use real API in test",
                            ],
                            expectedAnswer: "Network/HTTP layer only",
                        },
                    ],
                },
            ],
        },
        {
            id: "test-naming-and-flaky-diagnosis",
            stepNumber: 5,
            title: "Test Naming and Flaky Test Diagnosis",
            icon: "🔬",
            formula: [
                { text: "should ", type: "other" },
                { text: "[action]", type: "verb" },
                { text: " when ", type: "other" },
                { text: "[condition]", type: "subject" },
                { text: " expect ", type: "other" },
                { text: "[outcome]", type: "object" },
            ],
            explanation: `
                <h3>Test Names Should Explain Intent, Not Just Check Existence</h3>
                <p>A test name should tell you what behavior is being verified without reading the test body. Names like "test activity" or "test1" force reviewers to read the entire test to understand scope. Names like "should render only guides when filter chip selects guide type" are self-documenting.</p>

                <p>For flaky tests, follow a diagnostic checklist to isolate the true cause and stabilize. Retries hide the problem; fixing the root cause prevents future pain.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Test Naming Formula</strong></p>
                    <code style="display: block; background: rgba(0,0,0,0.05); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.95rem;">
                        should + [action] + when [condition] + expect [outcome]
                    </code>
                    <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem;"><strong>Examples:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0; padding-left: 1rem; font-size: 0.9rem;">
                        <li><code>should render only guides when filter chip selects guide type</code></li>
                        <li><code>should increment progress bar when activity completes successfully</code></li>
                        <li><code>should reject login when password is incorrect</code></li>
                    </ul>
                </div>

                <h4 style="margin-top: 1.5rem;">Flaky Test Diagnosis Workflow</h4>
                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
1) Run test 10+ times → does it fail randomly or always?
2) Check timing → does it fail on slower machines?
3) Check state → does it pass/fail based on test order?
4) Check randomness → seeded or uncontrolled random data?
5) Fix by controlling timing, seeding, or isolating state
</pre>
                </div>

                <h4>Common Flaky Test Causes</h4>
                <p>Most flakiness traces to one of four sources: real-time clocks (date-dependent logic), async race conditions (tests not waiting for promises), shared global state (tests affecting each other), or uncontrolled randomness (Math.random, unseeded generators). Fix by controlling the non-deterministic dependency rather than retrying the test.</p>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0;">
                    <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Real-time clock</p>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Fix:</strong> Mock date/time in test setup; use fake timers like jest.useFakeTimers().</p>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Async race conditions</p>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Fix:</strong> Use proper async/await; ensure promises resolve before assertions.</p>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Global state leakage</p>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Fix:</strong> Clear mocks/timers in beforeEach; isolate test environments.</p>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Uncontrolled randomness</p>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Fix:</strong> Seed random generators; avoid Math.random() in tests.</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "Flakiness Is a Bug",
                content:
                    "A flaky test is not reliable and should be fixed or deleted. Do not add retry logic—find and eliminate the non-determinism.",
            },
            exercises: [
                {
                    id: "ctfc-naming-1",
                    title: "Naming and Flaky Drill",
                    instructions: "Practice strong test naming and flaky test diagnosis.",
                    items: [
                        {
                            type: "text",
                            label: "Rewrite this weak test name into high-signal format: 'test activity':",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "A test fails only when run after midnight (clock-dependent). Best fix:",
                            options: [
                                { value: "mock-time", label: "Control date/time in test setup" },
                                { value: "retry", label: "Retry the test 5 times" },
                            ],
                            expectedAnswer: "mock-time",
                        },
                        {
                            type: "text",
                            label: "Describe one flaky test scenario you have seen and how you would diagnose it:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "ci-gates-and-release-confidence",
            stepNumber: 6,
            title: "CI Gates and Release Confidence",
            icon: "🚦",
            explanation: `
                <h3>Testing Strategy Must Tie to Deploy Gates</h3>
                <p>Tests only protect production when they run consistently in CI with clear pass/fail criteria. Pair lint + typecheck + targeted test suites with release smoke checks.</p>

                <p>Each gate serves a distinct purpose: lint catches style and anti-patterns, typecheck catches contract mismatches before runtime, core tests guard critical user flows, and smoke checks validate deployment in the real environment. Missing any layer leaves a gap that production will eventually find.</p>
            `,
            tipBox: {
                title: "Gate Order Matters",
                content:
                    "Run lint and typecheck first—they are fast and catch many issues. Run slower integration/e2e tests after. A failing typecheck should block test runs to save CI time.",
            },
            verbTable: {
                title: "Minimum Quality Gates",
                headers: ["Gate", "Purpose", "Failure Signal"],
                rows: [
                    ["Lint", "Code quality and anti-pattern checks", "Style/logic rule violations"],
                    ["Typecheck", "Compile-time contract correctness", "Type incompatibilities and missing keys"],
                    ["Core tests", "Protect critical behavior", "Regression in user-impact paths"],
                    ["Smoke checks", "Post-deploy runtime confidence", "Broken key flows in production environment"],
                ],
            },
            exercises: [
                {
                    id: "ctfc-ci-1",
                    title: "Release Safety Drill",
                    instructions: "Pick the best release strategy under constraints.",
                    items: [
                        {
                            type: "radio",
                            label: "A PR changes global theme tokens and subject activity rendering. What must run before merge?",
                            options: [
                                {
                                    value: "full-gates",
                                    label: "Lint + typecheck + targeted UI tests + documented manual smoke checks",
                                },
                                { value: "compile-only", label: "Compile only if no runtime error locally" },
                            ],
                            expectedAnswer: "full-gates",
                        },
                        {
                            type: "text",
                            label: "Write one post-deploy smoke check for filters and one for progress bars:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "CI fails on typecheck. Before re-running tests, you should:",
                            options: [
                                { value: "fix-first", label: "Fix the type error so typecheck passes, then run tests" },
                                { value: "skip-typecheck", label: "Skip typecheck and merge if tests pass" },
                            ],
                            expectedAnswer: "fix-first",
                        },
                    ],
                },
            ],
        },
        {
            id: "testing-communication",
            stepNumber: 7,
            title: "Communicating Test Strategy in PRs",
            icon: "🗣️",
            explanation: `
                <h3>Explain Why Your Tests Matter</h3>
                <p>Reviewers need to know not just that tests exist, but which risks they cover and which risks remain.</p>

                <p>A PR that says only "tests added" leaves reviewers guessing: What did you test? What could still break? A concise testing summary—risk covered, test layers, key assertions, and known gaps—builds confidence and surfaces edge cases before merge.</p>

                <p>Example: "Risk covered: filter chip selection now maps to activity type correctly; integration test asserts chip click updates card list. Known gap: empty-state behavior untested—manual check recommended." This tells reviewers exactly what is protected and what to verify. Documenting known gaps builds trust—it shows you thought through the risk surface.</p>

                <p>When a test fails in CI, your PR description should help the team understand whether the failure is in the change or in the test itself. A clear testing summary makes that distinction obvious and speeds up triage.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>PR testing summary template:</strong></p>
                    <ul style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li><strong>Risk covered:</strong> what bug classes are now protected</li>
                        <li><strong>Test layers:</strong> unit/integration/e2e included</li>
                        <li><strong>Evidence:</strong> commands run + key assertions</li>
                        <li><strong>Known gaps:</strong> what is still untested and why</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "ctfc-comm-1",
                    title: "PR Testing Summary Drill",
                    instructions: "Practice concise and high-signal communication.",
                    items: [
                        {
                            type: "text",
                            label: "Write 2 sentences summarizing test coverage for a PR that adds activity-type filters:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one sentence naming an untested risk and how you plan to cover it next:",
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
            icon: "✅",
            explanation: `
                <h3>Standard Practice Cadence</h3>
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> read code -> write code -> debug scenario.</p>
            `,
            exercises: [
                {
                    id: "tfc-cadence-concept",
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
                    id: "tfc-cadence-read",
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
                    id: "tfc-cadence-write",
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
                    id: "tfc-cadence-debug",
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
            id: "ctfc-q1",
            question: "Best first test for a pure utility function with deterministic input/output?",
            options: [
                { value: "a", label: "Unit test" },
                { value: "b", label: "E2E only" },
                { value: "c", label: "No test needed" },
            ],
            correctAnswer: "a",
            explanation: "Pure logic is fastest and clearest to verify with unit tests.",
            topic: "test-types",
            skill: "decision-making",
            skillTag: "unit-selection",
            difficulty: "easy",
        },
        {
            id: "ctfc-q2",
            question: "Most appropriate test layer for verifying filter chip selection changes rendered activity cards?",
            options: [
                { value: "a", label: "Integration test" },
                { value: "b", label: "Unit test only" },
                { value: "c", label: "Database migration test" },
            ],
            correctAnswer: "a",
            explanation: "This behavior crosses UI interaction + rendering logic boundaries.",
            topic: "test-types",
            skill: "architecture",
            skillTag: "integration-selection",
            difficulty: "medium",
        },
        {
            id: "ctfc-q3",
            question: "Which assertion is most resilient?",
            options: [
                { value: "a", label: "Exact class string order on every element" },
                { value: "b", label: "User-visible outcome after interaction" },
                { value: "c", label: "Private function call count" },
            ],
            correctAnswer: "b",
            explanation: "Behavior-focused assertions survive refactors better.",
            topic: "assertions",
            skill: "quality",
            skillTag: "behavior-over-implementation",
            difficulty: "medium",
        },
        {
            id: "ctfc-q4",
            question: "Best regression workflow after reproducing a bug:",
            options: [
                { value: "a", label: "Fix first, maybe test later" },
                { value: "b", label: "Write failing test, apply minimal fix, verify pass" },
                { value: "c", label: "Refactor full module before confirming cause" },
            ],
            correctAnswer: "b",
            explanation: "This creates permanent protection against the exact failure mode.",
            topic: "regressions",
            skill: "debugging",
            skillTag: "fail-then-fix",
            difficulty: "medium",
        },
        {
            id: "ctfc-q5",
            question: "CI gate most likely to catch the `accentBorder` missing-key issue before deploy:",
            options: [
                { value: "a", label: "TypeScript typecheck" },
                { value: "b", label: "Screenshot test only" },
                { value: "c", label: "Manual click-through only" },
            ],
            correctAnswer: "a",
            explanation: "Type errors should fail CI before runtime deployment.",
            topic: "ci",
            skill: "risk-management",
            skillTag: "typecheck-gate",
            difficulty: "hard",
        },
        {
            id: "ctfc-q6",
            question: "A flaky test sometimes fails due to real-time clock differences. Best improvement?",
            options: [
                { value: "a", label: "Control time in test setup and assert deterministic output" },
                { value: "b", label: "Retry test 10 times and ignore failures" },
                { value: "c", label: "Delete the test" },
            ],
            correctAnswer: "a",
            explanation: "Stabilize non-deterministic dependencies like time.",
            topic: "stability",
            skill: "test-design",
            skillTag: "deterministic-fixtures",
            difficulty: "hard",
        },
        {
            id: "ctfc-q7",
            question: "When should you prefer e2e tests?",
            options: [
                { value: "a", label: "For critical user journeys that cross multiple layers" },
                { value: "b", label: "For every tiny helper function" },
                { value: "c", label: "Only when unit tests are impossible" },
            ],
            correctAnswer: "a",
            explanation: "E2E is best for high-value end-to-end confidence, not all cases.",
            topic: "test-types",
            skill: "strategy",
            skillTag: "e2e-risk-alignment",
            difficulty: "easy",
        },
        {
            id: "ctfc-q8",
            question: "A PR says 'tests added' but gives no details. Biggest collaboration risk?",
            options: [
                { value: "a", label: "Reviewers cannot judge risk coverage or remaining gaps" },
                { value: "b", label: "No risk if CI is green" },
                { value: "c", label: "PR title automatically explains scope" },
            ],
            correctAnswer: "a",
            explanation: "Quality communication includes what risks are covered and what is not.",
            topic: "communication",
            skill: "collaboration",
            skillTag: "test-coverage-explanation",
            difficulty: "medium",
        },
        {
            id: "ctfc-q9",
            question: "What is the most common cost of over-mocking integration tests?",
            options: [
                { value: "a", label: "False confidence because real interactions are never exercised" },
                { value: "b", label: "Faster execution with better realism" },
                { value: "c", label: "Automatic regression prevention" },
            ],
            correctAnswer: "a",
            explanation: "Over-mocking can hide real integration breakpoints.",
            topic: "mocks",
            skill: "architecture",
            skillTag: "mock-boundary-discipline",
            difficulty: "hard",
        },
        {
            id: "ctfc-q10",
            question: "Best manual smoke check after deploying notebook filter changes:",
            options: [
                {
                    value: "a",
                    label: "Open subject page, switch several filter chips, verify card list and counts update correctly",
                },
                { value: "b", label: "Only verify page loads" },
                { value: "c", label: "Assume behavior if tests passed locally" },
            ],
            correctAnswer: "a",
            explanation: "Smoke checks should target changed high-risk user behaviors.",
            topic: "release",
            skill: "quality",
            skillTag: "targeted-smoke-tests",
            difficulty: "medium",
        },
        {
            id: "ctfc-q11",
            question: "You can write only one new test before release. Which gives highest protection?",
            options: [
                {
                    value: "a",
                    label: "Test the most business-critical flow touched by your change",
                },
                { value: "b", label: "Test a low-impact utility unrelated to current PR" },
                { value: "c", label: "Random snapshot on untouched page" },
            ],
            correctAnswer: "a",
            explanation: "Prioritize by user impact and changed risk surface.",
            topic: "prioritization",
            skill: "judgment",
            skillTag: "risk-first-testing",
            difficulty: "hard",
        },
        {
            id: "ctfc-q12",
            question: "Most accurate statement about coverage metrics:",
            options: [
                { value: "a", label: "Coverage is useful context, but behavior confidence matters more" },
                { value: "b", label: "High coverage guarantees no production bugs" },
                { value: "c", label: "Coverage should replace scenario testing" },
            ],
            correctAnswer: "a",
            explanation: "Coverage alone does not prove meaningful behavior protection.",
            topic: "metrics",
            skill: "strategy",
            skillTag: "coverage-vs-confidence",
            difficulty: "medium",
        },
        {
            id: "ctfc-q13",
            question: "Best test name format for a function that formats activity progress labels?",
            options: [
                { value: "a", label: "should_format_progress" },
                { value: "b", label: "should render correct label text when completed equals total" },
                { value: "c", label: "test1" },
            ],
            correctAnswer: "b",
            explanation: "Clear test names that explain intent and expected behavior are self-documenting.",
            topic: "test-design",
            skill: "communication",
            skillTag: "test-naming",
            difficulty: "easy",
        },
        {
            id: "ctfc-q14",
            question: "A test fails only when run after 11pm due to clock-dependent logic. Best diagnosis approach?",
            options: [
                { value: "a", label: "Mock the system date/time in test setup to control it" },
                { value: "b", label: "Add retry logic to ignore intermittent failures" },
                { value: "c", label: "Skip the test and assume it works" },
            ],
            correctAnswer: "a",
            explanation: "Mock time-dependent behavior to make tests deterministic and reliable.",
            topic: "flaky-tests",
            skill: "debugging",
            skillTag: "flaky-test-diagnosis",
            difficulty: "hard",
        },
        {
            id: "ctfc-q15",
            question: "Most accurate statement about test isolation:",
            options: [
                { value: "a", label: "Tests should be independent; failing one should not break others" },
                { value: "b", label: "Tests should run in a specific order to ensure reliability" },
                { value: "c", label: "Global state setup is fine as long as tests pass locally" },
            ],
            correctAnswer: "a",
            explanation: "Isolated tests run reliably in any order and catch real issues, not test infrastructure problems.",
            topic: "test-design",
            skill: "architecture",
            skillTag: "test-isolation",
            difficulty: "medium",
        },
    ],
};
