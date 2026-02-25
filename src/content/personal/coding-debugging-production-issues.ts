import type { InteractiveGuideContent } from "@/types/activity";

export const codingDebuggingProductionIssuesContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Debugging Production Issues (Vercel + Env + Triage)",
            icon: "🚨",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Production debugging is an incident workflow, not random code edits. This guide teaches how to triage quickly, isolate root causes, and communicate safely during live issues.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Read Vercel build/runtime signals with high accuracy</li>
                    <li>Diagnose env/config failures vs code regressions</li>
                    <li>Apply a repeatable triage decision tree under pressure</li>
                    <li>Write high-signal incident updates and resolution notes</li>
                </ul>
            `,
            tipBox: {
                title: "Incident Rule",
                content:
                    "Stabilize first, optimize second. During incidents, prioritize containment and clear communication over broad refactors.",
            },
            exercises: [
                {
                    id: "cdpi-intro-1",
                    title: "Incident Mindset",
                    instructions: "Choose the strongest first principle.",
                    items: [
                        {
                            type: "radio",
                            label: "When prod fails, first priority is:",
                            options: [
                                { value: "contain", label: "Contain impact and narrow failure scope" },
                                { value: "rewrite", label: "Rewrite major modules to be safe" },
                            ],
                            expectedAnswer: "contain",
                        },
                        {
                            type: "radio",
                            label: "Best debugging posture in incidents:",
                            options: [
                                { value: "hypothesis", label: "Hypothesis-driven checks with timestamped evidence" },
                                { value: "guess", label: "Frequent guesses until something changes" },
                            ],
                            expectedAnswer: "hypothesis",
                        },
                    ],
                },
            ],
        },
        {
            id: "vercel-build-log-analysis",
            stepNumber: 1,
            title: "Vercel Build Log Analysis",
            icon: "📜",
            explanation: `
                <h3>Separate Signal from Noise</h3>
                <p>Build logs include warnings, informational output, and hard failures. Your job is to locate the first true blocker and trace from there.</p>
            `,
            verbTable: {
                title: "Log Classification",
                headers: ["Log Type", "Typical Meaning", "Action"],
                rows: [
                    ["Deprecation warning", "Not immediate blocker", "Track as follow-up unless tied to failure"],
                    ["Type error", "Compile blocker", "Fix contract/type mismatch before redeploy"],
                    ["Missing env variable", "Runtime/build config blocker", "Verify env scopes and values"],
                    ["Prisma migration error", "Schema/data pipeline blocker", "Check DB connectivity and migration state"],
                ],
            },
            exercises: [
                {
                    id: "cdpi-logs-1",
                    title: "Failure Signal Detection",
                    instructions: "Pick the strongest first interpretation.",
                    items: [
                        {
                            type: "radio",
                            label: "Build log shows many warnings, then one TypeScript error and build exits 1. Root blocker is:",
                            options: [
                                { value: "ts", label: "TypeScript error" },
                                { value: "warnings", label: "Deprecation warnings" },
                            ],
                            expectedAnswer: "ts",
                        },
                        {
                            type: "text",
                            label: "Write one sentence explaining why warning noise should not distract from first hard failure:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "env-and-config-triage",
            stepNumber: 2,
            title: "Environment and Config Triage",
            icon: "🔐",
            explanation: `
                <h3>Config Bugs Often Masquerade as Code Bugs</h3>
                <p>Missing or mis-scoped env vars (preview vs production), incorrect secrets, and stale config are common production failure sources.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Config triage order:</strong></p>
                    <ol style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li>Confirm failing environment (preview vs production).</li>
                        <li>Verify required env keys exist and are scoped correctly.</li>
                        <li>Validate values format (URL, token, DB string).</li>
                        <li>Re-deploy with explicit note of what changed.</li>
                    </ol>
                </div>
            `,
            exercises: [
                {
                    id: "cdpi-env-1",
                    title: "Config Investigation",
                    instructions: "Choose the best troubleshooting move first.",
                    items: [
                        {
                            type: "radio",
                            label: "Preview works but production fails DB connection. Best first check:",
                            options: [
                                { value: "scope", label: "Compare production env var scope/value against preview" },
                                { value: "rewrite", label: "Rewrite DB client code immediately" },
                            ],
                            expectedAnswer: "scope",
                        },
                        {
                            type: "radio",
                            label: "Runtime error says missing API key. Best immediate action:",
                            options: [
                                { value: "verify", label: "Verify key exists in deployment environment and is loaded by runtime" },
                                { value: "ignore", label: "Ignore; likely transient" },
                            ],
                            expectedAnswer: "verify",
                        },
                    ],
                },
            ],
        },
        {
            id: "incident-triage-decision-tree",
            stepNumber: 3,
            title: "Incident Triage Decision Tree",
            icon: "🌲",
            explanation: `
                <h3>Use a Structured Flow Under Pressure</h3>
                <p>Triage is a narrowing process: scope impact, identify first failing layer, validate one hypothesis at a time, and capture evidence.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Scope -> Reproduce -> Classify (code/config/data) -> Hypothesis test -> Contain -> Fix -> Verify
</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Strong triage behavior",
                    description: "Small reversible checks",
                    examples: [
                        {
                            sentence: "Confirm which routes fail and whether failures correlate with one deployment.",
                            explanation: "Quickly reduces search surface.",
                        },
                        {
                            sentence: "Test one hypothesis (env key missing) and record outcome before next change.",
                            explanation: "Prevents chaotic debugging.",
                        },
                    ],
                },
                {
                    title: "Weak triage behavior",
                    description: "Unbounded reactive changes",
                    examples: [
                        {
                            sentence: "Change multiple files and env settings simultaneously with no notes.",
                            explanation: "Makes causality impossible to determine.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdpi-triage-1",
                    title: "Triage Path Selection",
                    instructions: "Choose the highest-leverage next action.",
                    items: [
                        {
                            type: "radio",
                            label: "After deploy, only subject detail pages fail with 500. Best first move:",
                            options: [
                                {
                                    value: "scope-route",
                                    label: "Inspect logs and recent changes touching subject route data dependencies",
                                },
                                { value: "all-refactor", label: "Refactor shared UI layer first" },
                            ],
                            expectedAnswer: "scope-route",
                        },
                        {
                            type: "text",
                            label: "Write one hypothesis you would test first and the exact evidence needed:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "rollback-vs-forward-fix",
            stepNumber: 4,
            title: "Rollback vs Forward Fix Decisions",
            icon: "⚖️",
            explanation: `
                <h3>Choose Recovery Strategy by Risk and Time</h3>
                <p>Rollback is fastest when safe and available. Forward-fix is better when rollback is risky or incompatible with data changes.</p>
            `,
            verbTable: {
                title: "Recovery Decision Signals",
                headers: ["Condition", "Preferred Move", "Reason"],
                rows: [
                    ["Recent code-only regression", "Rollback", "Quick restoration with low complexity"],
                    ["Non-reversible migration involved", "Forward-fix", "Rollback may worsen data state"],
                    ["Partial outage with clear guard available", "Contain + forward-fix", "Reduce impact while fixing root cause"],
                    ["Unknown root cause and broad impact", "Rollback + incident analysis", "Prioritize service restoration"],
                ],
            },
            exercises: [
                {
                    id: "cdpi-recovery-1",
                    title: "Recovery Judgment",
                    instructions: "Pick the safer response in each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "A pure UI release breaks timer visuals but core learning works. Best path:",
                            options: [
                                { value: "forward-small", label: "Small forward-fix with quick validation" },
                                { value: "panic", label: "Major rollback and architecture rewrite" },
                            ],
                            expectedAnswer: "forward-small",
                        },
                        {
                            type: "radio",
                            label: "Migration caused data mismatch and rollback is unsafe. Best path:",
                            options: [
                                { value: "compatible-fix", label: "Ship compatibility forward-fix and monitor closely" },
                                { value: "force-rollback", label: "Force rollback regardless of data risk" },
                            ],
                            expectedAnswer: "compatible-fix",
                        },
                    ],
                },
            ],
        },
        {
            id: "incident-communication",
            stepNumber: 5,
            title: "Incident Communication and Handoffs",
            icon: "📣",
            explanation: `
                <h3>Status Updates Are Part of the Fix</h3>
                <p>Good incident communication is short, factual, and timestamped: impact, current hypothesis, next check, and ETA for next update.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem;">
                    <p style="margin: 0 0 0.4rem 0;"><strong>Incident update template:</strong></p>
                    <ul style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li><strong>Impact:</strong> who/what is affected</li>
                        <li><strong>Status:</strong> current failure classification</li>
                        <li><strong>Action:</strong> what was just tested</li>
                        <li><strong>Next:</strong> next hypothesis and ETA</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "cdpi-comm-1",
                    title: "Status Update Drill",
                    instructions: "Practice concise incident communication.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 2-sentence incident update for a failed production build caused by a TypeScript type mismatch:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one handoff sentence so another developer can continue triage without context loss:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "post-incident-learning",
            stepNumber: 6,
            title: "Post-Incident Learning and Prevention",
            icon: "🧠",
            explanation: `
                <h3>Convert Incidents Into Better Systems</h3>
                <p>Every incident should end with one prevention action: test, alert, type contract, checklist, or documentation update.</p>
            `,
            exercises: [
                {
                    id: "cdpi-postmortem-1",
                    title: "Prevention Design",
                    instructions: "Choose the strongest follow-up action for each issue.",
                    items: [
                        {
                            type: "radio",
                            label: "Type mismatch broke production build. Best prevention:",
                            options: [
                                { value: "type-gate", label: "Require strict typecheck in CI and add typed shared interfaces" },
                                { value: "memory", label: "Try to remember to check manually" },
                            ],
                            expectedAnswer: "type-gate",
                        },
                        {
                            type: "radio",
                            label: "Env var scope mismatch caused runtime outage. Best prevention:",
                            options: [
                                { value: "checklist", label: "Deployment checklist with env-scope verification per environment" },
                                { value: "none", label: "No follow-up needed once fixed" },
                            ],
                            expectedAnswer: "checklist",
                        },
                        {
                            type: "text",
                            label: "Write one actionable postmortem item you would add for Vercel build incidents:",
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
                    id: "dpi-cadence-concept",
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
                    id: "dpi-cadence-read",
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
                    id: "dpi-cadence-write",
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
                    id: "dpi-cadence-debug",
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
            id: "cdpi-q1",
            question: "In a noisy build log, what should you prioritize first?",
            options: [
                { value: "a", label: "First hard failure that stops build" },
                { value: "b", label: "All warnings equally" },
                { value: "c", label: "Most recent informational tip" },
            ],
            correctAnswer: "a",
            explanation: "Blockers define immediate fix path; warnings can be triaged after restoration.",
            topic: "logs",
            skill: "triage",
            skillTag: "first-blocker",
            difficulty: "easy",
        },
        {
            id: "cdpi-q2",
            question: "Preview succeeds but production fails DB auth. Most likely first category to verify:",
            options: [
                { value: "a", label: "Environment variable scope/value differences" },
                { value: "b", label: "CSS modules" },
                { value: "c", label: "Font rendering" },
            ],
            correctAnswer: "a",
            explanation: "Environment-specific failures are frequently config scope/value issues.",
            topic: "environment",
            skill: "diagnosis",
            skillTag: "env-scope-check",
            difficulty: "medium",
        },
        {
            id: "cdpi-q3",
            question: "Best incident debugging style:",
            options: [
                { value: "a", label: "One hypothesis at a time with recorded evidence" },
                { value: "b", label: "Many simultaneous edits and redeploys" },
                { value: "c", label: "Wait for user reports before action" },
            ],
            correctAnswer: "a",
            explanation: "Controlled experiments preserve causality and speed root-cause analysis.",
            topic: "triage",
            skill: "process",
            skillTag: "hypothesis-driven-debugging",
            difficulty: "medium",
        },
        {
            id: "cdpi-q4",
            question: "When rollback is unsafe due to non-reversible migration, best recovery is usually:",
            options: [
                { value: "a", label: "Forward-fix with compatibility patch" },
                { value: "b", label: "Force rollback regardless" },
                { value: "c", label: "Pause and do nothing" },
            ],
            correctAnswer: "a",
            explanation: "Data integrity risks often require compatible forward remediation.",
            topic: "recovery",
            skill: "judgment",
            skillTag: "forward-fix-vs-rollback",
            difficulty: "hard",
        },
        {
            id: "cdpi-q5",
            question: "Strong incident status update includes:",
            options: [
                { value: "a", label: "Impact, current status, action taken, and next ETA" },
                { value: "b", label: "Only 'working on it'" },
                { value: "c", label: "Technical details only with no impact" },
            ],
            correctAnswer: "a",
            explanation: "Stakeholders need both technical progress and user impact context.",
            topic: "communication",
            skill: "collaboration",
            skillTag: "status-template",
            difficulty: "easy",
        },
        {
            id: "cdpi-q6",
            question: "A 500 error affects only subject detail routes. Best first narrowing move:",
            options: [
                { value: "a", label: "Inspect recent route-specific data changes and logs" },
                { value: "b", label: "Rewrite global theme tokens" },
                { value: "c", label: "Clear browser cache for all users" },
            ],
            correctAnswer: "a",
            explanation: "Scope-specific failures should be traced through route-specific dependencies.",
            topic: "triage",
            skill: "diagnosis",
            skillTag: "scope-first",
            difficulty: "medium",
        },
        {
            id: "cdpi-q7",
            question: "Most useful prevention after a TypeScript deploy-blocking error:",
            options: [
                { value: "a", label: "Strict CI typecheck gate on PRs" },
                { value: "b", label: "More manual browser checks only" },
                { value: "c", label: "Longer commit messages" },
            ],
            correctAnswer: "a",
            explanation: "Compile-time gates prevent known failure class from reaching deploy.",
            topic: "prevention",
            skill: "quality",
            skillTag: "typecheck-gate",
            difficulty: "hard",
        },
        {
            id: "cdpi-q8",
            question: "Which is a weak triage behavior?",
            options: [
                { value: "a", label: "Changing env vars and code together without notes" },
                { value: "b", label: "Timestamping checks and outcomes" },
                { value: "c", label: "Classifying failure as code/config/data" },
            ],
            correctAnswer: "a",
            explanation: "Untracked simultaneous changes make root cause ambiguous.",
            topic: "triage",
            skill: "process",
            skillTag: "avoid-chaos-edits",
            difficulty: "medium",
        },
        {
            id: "cdpi-q9",
            question: "If logs show missing env key at runtime, what is the immediate best action?",
            options: [
                { value: "a", label: "Verify key name/value/scope and redeploy" },
                { value: "b", label: "Ignore and retry later" },
                { value: "c", label: "Refactor route handlers" },
            ],
            correctAnswer: "a",
            explanation: "Runtime missing-key errors are typically configuration correctness issues.",
            topic: "environment",
            skill: "operations",
            skillTag: "env-verification",
            difficulty: "medium",
        },
        {
            id: "cdpi-q10",
            question: "Best way to speed incident handoff between developers:",
            options: [
                { value: "a", label: "Document impact, tested hypotheses, and next step" },
                { value: "b", label: "Share only error screenshot" },
                { value: "c", label: "Wait for next standup" },
            ],
            correctAnswer: "a",
            explanation: "High-signal handoff prevents duplicated investigation time.",
            topic: "communication",
            skill: "collaboration",
            skillTag: "handoff-quality",
            difficulty: "easy",
        },
        {
            id: "cdpi-q11",
            question: "Why classify failures as code vs config vs data early?",
            options: [
                { value: "a", label: "It narrows the search space and speeds resolution" },
                { value: "b", label: "It is required by Vercel" },
                { value: "c", label: "It removes need for testing" },
            ],
            correctAnswer: "a",
            explanation: "Classification focuses debugging effort on the right layer.",
            topic: "triage",
            skill: "systems-thinking",
            skillTag: "failure-classification",
            difficulty: "hard",
        },
        {
            id: "cdpi-q12",
            question: "Most accurate incident closure action:",
            options: [
                { value: "a", label: "Add one concrete prevention control tied to root cause" },
                { value: "b", label: "Close immediately once service returns" },
                { value: "c", label: "Rely on memory for future incidents" },
            ],
            correctAnswer: "a",
            explanation: "Closure should include prevention so the same class of failure is less likely.",
            topic: "postmortem",
            skill: "quality",
            skillTag: "preventive-followup",
            difficulty: "hard",
        },
    ],
};
