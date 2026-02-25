import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationPlanningMechanicsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation Planning Mechanics",
            icon: "route",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Strong implementation planning turns goals into sequence, ownership, and risk controls. This lesson focuses on mechanics that make delivery predictable.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Create workback plans from fixed milestones</li>
                    <li>Map critical dependencies and failure paths</li>
                    <li>Maintain RAID logs that support action and escalation</li>
                    <li>Re-baseline plans without losing stakeholder trust</li>
                </ul>
            `,
            tipBox: {
                title: "Planning Rule",
                content: "A plan without owners, dates, and risk triggers is a timeline guess, not an execution system.",
            },
            exercises: [
                {
                    id: "cipm-intro-1",
                    title: "Planning Intent",
                    instructions: "Choose the strongest planning behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "Best definition of implementation planning:",
                            options: [
                                { value: "system", label: "A delivery system with sequence, ownership, dependencies, and risk controls" },
                                { value: "calendar", label: "A list of target dates only" },
                            ],
                            expectedAnswer: "system",
                        },
                    ],
                },
            ],
        },
        {
            id: "workback-planning",
            stepNumber: 1,
            title: "Workback Planning from Milestones",
            icon: "calendar-clock",
            explanation: `
                <h3>Plan Backward from Non-Negotiable Dates</h3>
                <p>Start from the fixed milestone, then map required predecessor events, buffers, and owner handoffs backward to today.</p>
            `,
            verbTable: {
                title: "Workback Structure",
                headers: ["Element", "Question", "Output"],
                rows: [
                    ["Milestone", "What date cannot move?", "Anchor date + rationale"],
                    ["Prerequisites", "What must be true before milestone?", "Dependency checklist"],
                    ["Buffers", "Where can slippage occur?", "Contingency windows"],
                    ["Ownership", "Who is accountable for each gate?", "Owner matrix"],
                ],
            },
            exercises: [
                {
                    id: "cipm-workback-1",
                    title: "Workback Decisions",
                    instructions: "Choose the strongest planning move.",
                    items: [
                        {
                            type: "radio",
                            label: "Launch date is fixed by contract. First planning step:",
                            options: [
                                { value: "backward", label: "Build backward workback with prerequisite gates and owners" },
                                { value: "forward", label: "Start with current tasks and guess arrival date" },
                            ],
                            expectedAnswer: "backward",
                        },
                        {
                            type: "text",
                            label: "Write one prerequisite gate that must be complete before go-live:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "dependency-mapping",
            stepNumber: 2,
            title: "Dependency Mapping",
            icon: "git-branch",
            explanation: `
                <h3>Dependencies Determine Real Timeline Risk</h3>
                <p>Map dependencies by criticality, owner, due date, and fallback path. Unknown dependencies are hidden blockers.</p>
            `,
            exercises: [
                {
                    id: "cipm-deps-1",
                    title: "Dependency Quality",
                    instructions: "Pick the lowest-risk dependency pattern.",
                    items: [
                        {
                            type: "radio",
                            label: "A dependency is external and high-risk. Best entry in plan:",
                            options: [
                                {
                                    value: "full",
                                    label: "Owner + due date + fallback option + escalation trigger",
                                },
                                { value: "minimal", label: "Short note with no owner or due date" },
                            ],
                            expectedAnswer: "full",
                        },
                        {
                            type: "text",
                            label: "Write one fallback strategy for a delayed third-party dependency:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "raid-operations",
            stepNumber: 3,
            title: "RAID Operations (Risks, Assumptions, Issues, Dependencies)",
            icon: "shield-alert",
            explanation: `
                <h3>RAID Should Drive Action, Not Documentation Overhead</h3>
                <p>Use RAID as a live operations artifact: update frequently, assign clear owners, and escalate based on trigger criteria.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Risk: potential future impact
Issue: current active blocker
Assumption: statement that must be validated
Dependency: external/internal prerequisite
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "cipm-raid-1",
                    title: "RAID Classification",
                    instructions: "Classify and act correctly.",
                    items: [
                        {
                            type: "select",
                            label: "'Vendor credentials not yet delivered, launch in 9 days' is best tracked as:",
                            options: ["Risk", "Issue", "Assumption", "Dependency"],
                            expectedAnswer: "Issue",
                        },
                        {
                            type: "radio",
                            label: "Best response to a high-probability/high-impact risk:",
                            options: [
                                { value: "mitigate", label: "Define mitigation owner, due date, and trigger for escalation" },
                                { value: "watch", label: "Monitor informally with no owner" },
                            ],
                            expectedAnswer: "mitigate",
                        },
                    ],
                },
            ],
        },
        {
            id: "rebaselining-and-tradeoffs",
            stepNumber: 4,
            title: "Re-Baselining and Tradeoff Management",
            icon: "scale",
            explanation: `
                <h3>Plans Change; Discipline Is How You Update Them</h3>
                <p>When assumptions fail, re-baseline scope/timeline/resources explicitly and communicate tradeoffs immediately.</p>
            `,
            verbTable: {
                title: "Re-Baseline Options",
                headers: ["Constraint", "Tradeoff Option", "Communication Need"],
                rows: [
                    ["Fixed date", "Reduce scope", "State what moved out and why"],
                    ["Fixed scope", "Add resources or extend timeline", "Confirm cost/timing impacts"],
                    ["Quality risk rising", "Add validation gates", "Explain confidence impact"],
                ],
            },
            exercises: [
                {
                    id: "cipm-rebase-1",
                    title: "Tradeoff Judgment",
                    instructions: "Choose the strongest re-baseline move.",
                    items: [
                        {
                            type: "radio",
                            label: "A key dependency slips 1 week and launch date is fixed. Best immediate decision path:",
                            options: [
                                { value: "scope", label: "Re-scope phase 1 and document deferred items" },
                                { value: "silent", label: "Keep full scope and absorb risk silently" },
                            ],
                            expectedAnswer: "scope",
                        },
                        {
                            type: "text",
                            label: "Write one stakeholder sentence that explains a re-baseline without sounding vague:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "planning-rituals",
            stepNumber: 5,
            title: "Planning Rituals and Governance",
            icon: "repeat",
            explanation: `
                <h3>Rituals Keep Plans Alive</h3>
                <p>Establish weekly rituals: plan review, RAID refresh, dependency check, and decision log update.</p>
            `,
            exercises: [
                {
                    id: "cipm-rituals-1",
                    title: "Governance Design",
                    instructions: "Select the best planning governance pattern.",
                    items: [
                        {
                            type: "radio",
                            label: "Most effective planning cadence in active implementation:",
                            options: [
                                { value: "weekly", label: "Weekly plan/RAID/dependency review with owner updates" },
                                { value: "monthly", label: "Monthly high-level review only" },
                            ],
                            expectedAnswer: "weekly",
                        },
                        {
                            type: "text",
                            label: "Write one agenda line for a weekly implementation planning review:",
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
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> review plan -> write plan update -> triage scenario.</p>
            `,
            exercises: [
                {
                    id: "cipm-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence on why workback + RAID is stronger than date-only planning:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cipm-cadence-read",
                    title: "Read Plan",
                    instructions: "Inspect planning artifacts for risk quality.",
                    items: [
                        {
                            type: "text",
                            label: "Find one implementation plan in this repo and note one missing dependency or risk owner:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cipm-cadence-write",
                    title: "Write Update",
                    instructions: "Practice plan maintenance under change.",
                    items: [
                        {
                            type: "text",
                            label: "Draft a 5-line re-baseline update: trigger, impact, tradeoff chosen, owner, next checkpoint:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cipm-cadence-debug",
                    title: "Triage Scenario",
                    instructions: "Choose the strongest recovery posture.",
                    items: [
                        {
                            type: "radio",
                            label: "If 2 critical dependencies slip simultaneously, first move is:",
                            options: [
                                { value: "priority", label: "Prioritize by impact, update RAID, and escalate decisions quickly" },
                                { value: "hope", label: "Continue unchanged and hope recovery happens" },
                            ],
                            expectedAnswer: "priority",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Build workback plans that connect milestones to prerequisites and owners.</li>
                    <li>Track dependencies and RAID items as live execution controls.</li>
                    <li>Re-baseline plans using explicit tradeoff language.</li>
                    <li>Run planning rituals that keep stakeholders aligned and risks visible.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "cipm-q1",
            question: "Best first planning move when milestone date is fixed:",
            options: [
                { value: "a", label: "Build backward workback with prerequisite gates" },
                { value: "b", label: "Start tasks and estimate date later" },
                { value: "c", label: "Skip dependency mapping" },
            ],
            correctAnswer: "a",
            explanation: "Workback planning anchors execution to real milestone constraints.",
            topic: "workback",
            skill: "planning",
            skillTag: "backward-mapping",
            difficulty: "easy",
        },
        {
            id: "cipm-q2",
            question: "A high-impact external blocker with no owner should be treated as:",
            options: [
                { value: "a", label: "Immediate ownership + due date + escalation trigger" },
                { value: "b", label: "Optional note" },
                { value: "c", label: "Deferred documentation" },
            ],
            correctAnswer: "a",
            explanation: "Unowned critical dependencies create predictable slippage.",
            topic: "dependencies",
            skill: "risk-management",
            skillTag: "owner-discipline",
            difficulty: "medium",
        },
        {
            id: "cipm-q3",
            question: "Most accurate RAID distinction:",
            options: [
                { value: "a", label: "Risk is future uncertainty; issue is active blocker" },
                { value: "b", label: "Risk and issue are interchangeable" },
                { value: "c", label: "Dependencies are optional to track" },
            ],
            correctAnswer: "a",
            explanation: "Correct classification improves response speed and ownership.",
            topic: "raid",
            skill: "operations",
            skillTag: "risk-vs-issue",
            difficulty: "medium",
        },
        {
            id: "cipm-q4",
            question: "If date is fixed and dependency slips, strongest response is usually:",
            options: [
                { value: "a", label: "Re-scope and document deferred scope explicitly" },
                { value: "b", label: "Keep scope and hide risk" },
                { value: "c", label: "Remove validation to save time" },
            ],
            correctAnswer: "a",
            explanation: "Transparent tradeoff management preserves delivery trust.",
            topic: "rebaseline",
            skill: "judgment",
            skillTag: "scope-tradeoff",
            difficulty: "hard",
        },
        {
            id: "cipm-q5",
            question: "Why run weekly planning rituals?",
            options: [
                { value: "a", label: "Keep risks/dependencies current and decisions timely" },
                { value: "b", label: "Increase documentation volume" },
                { value: "c", label: "Replace execution with reporting" },
            ],
            correctAnswer: "a",
            explanation: "Rituals maintain execution accuracy and reduce surprise.",
            topic: "governance",
            skill: "delivery",
            skillTag: "planning-rituals",
            difficulty: "hard",
        },
    ],
};
