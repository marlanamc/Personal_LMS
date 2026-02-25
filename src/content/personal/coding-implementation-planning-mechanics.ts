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
                        {
                            type: "radio",
                            label: "Workback planning means:",
                            options: [
                                { value: "backward", label: "Starting from fixed milestone and mapping prerequisites backward" },
                                { value: "forward", label: "Starting from now and optimistically estimating forward" },
                            ],
                            expectedAnswer: "backward",
                        },
                        {
                            type: "text",
                            label: "Create a 4-step workback for a 10-week launch (include gates, buffers, owner):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When creating workback plan, buffers should be:",
                            options: [
                                { value: "explicit", label: "Explicitly placed after high-risk prerequisites" },
                                { value: "implicit", label: "Hidden in individual task estimates" },
                            ],
                            expectedAnswer: "explicit",
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
                        {
                            type: "radio",
                            label: "Dependency risk level should be assessed on:",
                            options: [
                                { value: "dual", label: "Impact on downstream gates + probability of delay" },
                                { value: "hope", label: "Best-case optimism that they will deliver on time" },
                            ],
                            expectedAnswer: "dual",
                        },
                        {
                            type: "text",
                            label: "Map three critical dependencies for your implementation (include owner, due date, impact):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When a dependency owner is external, best risk control is:",
                            options: [
                                { value: "contract", label: "Contract commitment + independent status checks + fallback plan" },
                                { value: "trust", label: "Assume good intent and trust updates" },
                            ],
                            expectedAnswer: "contract",
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
                        {
                            type: "text",
                            label: "Classify this scenario and explain: 'DB migration assumes zero-downtime migration is possible':",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "An active blocker preventing progress should be tracked as:",
                            options: [
                                { value: "issue", label: "Issue with immediate owner and escalation plan" },
                                { value: "risk", label: "Risk to monitor passively" },
                            ],
                            expectedAnswer: "issue",
                        },
                        {
                            type: "text",
                            label: "Write one RAID item (including type, description, owner, mitigation/response, due date):",
                            acceptAnyAttempt: true,
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
                        {
                            type: "radio",
                            label: "When discovery reveals hidden work, best response is:",
                            options: [
                                { value: "rebase", label: "Quantify impact, present tradeoff options, re-baseline immediately" },
                                { value: "absorb", label: "Keep plan unchanged and work nights to absorb" },
                            ],
                            expectedAnswer: "rebase",
                        },
                        {
                            type: "text",
                            label: "Design a re-baseline decision process (trigger, who decides, timeline, communication):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Re-baselining should happen:",
                            options: [
                                { value: "early", label: "Early when variance is understood, not at crisis point" },
                                { value: "late", label: "As late as possible to give more time for recovery" },
                            ],
                            expectedAnswer: "early",
                        },
                    ],
                },
            ],
        },
        {
            id: "buffer-planning",
            stepNumber: 5,
            title: "Buffer Planning and Contingency Management",
            icon: "shield-check",
            explanation: `
                <h3>Buffers Are Not Padding; They Are Risk Absorption Mechanisms</h3>
                <p>Place buffers strategically at critical gates and between dependent paths. Buffer = (risk exposure × recovery window) / execution capacity.</p>

                <h3>Buffer Types</h3>
                <p>Different paths and constraints require different buffer strategies. Understanding buffer placement improves predictability without inflating timelines.</p>
            `,
            verbTable: {
                title: "Buffer Placement Strategy",
                headers: ["Buffer Type", "When to Use", "Sizing Rule", "Escalation Trigger"],
                rows: [
                    ["Critical path buffer", "High-impact dependencies with long lead times", "10-20% of path duration", "Consumed >50% with 40% time remaining"],
                    ["Integration buffer", "System integration and data cutover gates", "5-10 days per integration point", "Any blocking discovery"],
                    ["Validation buffer", "UAT and quality gates before go-live", "2+ weeks minimum", "Unresolved defects or scope growth"],
                    ["Leadership buffer", "Executive review and decision gates", "3-5 days per decision point", "Sponsor unavailability or scope conflict"],
                ],
            },
            exercises: [
                {
                    id: "cipm-buffer-1",
                    title: "Buffer Placement Decisions",
                    instructions: "Place buffers strategically on critical paths.",
                    items: [
                        {
                            type: "radio",
                            label: "Best buffer placement when a high-impact dependency has failed once historically:",
                            options: [
                                { value: "after", label: "Add buffer AFTER dependency to absorb recovery before next gate" },
                                { value: "before", label: "Add buffer BEFORE as hope for early completion" },
                            ],
                            expectedAnswer: "after",
                        },
                        {
                            type: "text",
                            label: "Design a buffer strategy for a 12-week implementation with 3 critical milestones (specify buffer size and trigger):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Buffer should be consumed if:",
                            options: [
                                { value: "risk", label: "Actual risks materialize (dependencies slip, discoveries made)" },
                                { value: "optimize", label: "Attempting to optimize timelines ahead of need" },
                                { value: "scope", label: "Unplanned scope creep appears" },
                            ],
                            expectedAnswer: "risk",
                        },
                        {
                            type: "text",
                            label: "Write a buffer escalation trigger (e.g., 'If critical path buffer is X% consumed by Y date, escalate Z decision'):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "milestone-definition",
            stepNumber: 6,
            title: "Milestone Definition and Gate Criteria",
            icon: "flag",
            explanation: `
                <h3>Clear Milestones Drive Accountability</h3>
                <p>Define each milestone by objective, entrance criteria, go/no-go decision, and ownership. Vague milestones create ambiguity on pass/fail.</p>

                <h3>Gate Design</h3>
                <p>Gates separate execution phases. Each gate has entrance criteria (what must be true), a decision point (go/no-go), and exit criteria (what delivers next).</p>
            `,
            formula: [
                { text: "Milestone = Objective + Entrance criteria + Go/No-go decision + Exit criteria + Owner", type: "subject" },
            ],
            exercises: [
                {
                    id: "cipm-milestone-1",
                    title: "Milestone Clarity",
                    instructions: "Define milestones with clear pass/fail criteria.",
                    items: [
                        {
                            type: "radio",
                            label: "Strongest milestone definition is:",
                            options: [
                                { value: "clear", label: "Objective + entrance criteria + pass/fail decision + owner + date" },
                                { value: "vague", label: "Target date with general description" },
                            ],
                            expectedAnswer: "clear",
                        },
                        {
                            type: "text",
                            label: "Define one UAT milestone with entrance criteria and pass/fail decision:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "A gate 'opens' (advances to next phase) when:",
                            options: [
                                { value: "criteria", label: "Exit criteria are measurably met and decision-maker approves" },
                                { value: "date", label: "The target date arrives regardless of readiness" },
                            ],
                            expectedAnswer: "criteria",
                        },
                        {
                            type: "text",
                            label: "Write one go/no-go decision question for a system readiness gate (e.g., 'Is X metric above Y threshold?'):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "progress-tracking",
            stepNumber: 7,
            title: "Progress Tracking and Variance Management",
            icon: "activity",
            explanation: `
                <h3>Variance Trending Beats Status Snapshots</h3>
                <p>Track plan vs actual at the task, gate, and milestone level. Early variance detection enables faster re-baselining before cascading delays.</p>

                <h3>Variance Response Ladder</h3>
                <p>Not all variances need escalation. Create clear decision rules for when to escalate, re-baseline, or absorb within buffers.</p>
            `,
            verbTable: {
                title: "Variance Response Decision Tree",
                headers: ["Variance Size", "Path Duration Impact", "Response", "Owner"],
                rows: [
                    ["Small (<2 days)", "Absorbed by task buffer", "Log and monitor", "Task owner"],
                    ["Medium (2-5 days)", "Impacts gate date by 1-2 days", "Re-assess path and escalate if impacting critical path", "Gate owner"],
                    ["Large (>5 days)", "Impacts critical path or milestone", "Trigger re-baselining and stakeholder decision", "Project lead"],
                    ["Cascading slippage", "Multiple gates affected", "Emergency RAID review and re-baseline decision", "Executive sponsor"],
                ],
            },
            exercises: [
                {
                    id: "cipm-progress-1",
                    title: "Variance Triage",
                    instructions: "Respond appropriately to schedule variance.",
                    items: [
                        {
                            type: "radio",
                            label: "When a task is 3 days late but non-critical path, best response is:",
                            options: [
                                { value: "monitor", label: "Monitor and assess impact; escalate only if critical path threatened" },
                                { value: "panic", label: "Escalate immediately as crisis" },
                            ],
                            expectedAnswer: "monitor",
                        },
                        {
                            type: "text",
                            label: "Design a weekly variance review question (e.g., 'Which gates are trending late by >X days?'):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "The best time to detect slippage risk is:",
                            options: [
                                { value: "early", label: "Early in task execution, via weekly trending vs weekly plans" },
                                { value: "late", label: "At task completion when slippage is unavoidable" },
                            ],
                            expectedAnswer: "early",
                        },
                        {
                            type: "text",
                            label: "Write one re-baselining rule (e.g., 'If critical path variance exceeds X, trigger re-baseline within Y hours'):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "planning-rituals",
            stepNumber: 8,
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
                        {
                            type: "radio",
                            label: "Weekly planning ritual should include:",
                            options: [
                                { value: "full", label: "Plan variance review, RAID status, dependency check, decision log" },
                                { value: "status", label: "Generic status update only" },
                            ],
                            expectedAnswer: "full",
                        },
                        {
                            type: "text",
                            label: "Define one metric tracked in your weekly planning review:",
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
        {
            id: "cipm-q6",
            question: "Buffer in implementation plan should be:",
            options: [
                { value: "a", label: "Explicitly placed after critical path risks, not hidden in tasks" },
                { value: "b", label: "Kept secret from stakeholders to avoid perception of padding" },
                { value: "c", label: "Distributed evenly across all tasks" },
            ],
            correctAnswer: "a",
            explanation: "Visible buffers enable risk-based planning and stakeholder confidence.",
            topic: "buffer",
            skill: "planning",
            skillTag: "buffer-placement",
            difficulty: "easy",
        },
        {
            id: "cipm-q7",
            question: "When a task on critical path is 2 days late, best response is:",
            options: [
                { value: "a", label: "Assess impact to gate date and escalate if impacting milestone" },
                { value: "b", label: "Ignore since 2 days is small" },
                { value: "c", label: "Assume other tasks will finish early to compensate" },
            ],
            correctAnswer: "a",
            explanation: "Critical path tasks have zero slack; any delay impacts milestone.",
            topic: "progress-tracking",
            skill: "operations",
            skillTag: "critical-path-discipline",
            difficulty: "medium",
        },
        {
            id: "cipm-q8",
            question: "Clear milestone definition includes:",
            options: [
                { value: "a", label: "Objective + entrance criteria + pass/fail decision + exit criteria + owner" },
                { value: "b", label: "Just a target date" },
                { value: "c", label: "Rough description of what should be done" },
            ],
            correctAnswer: "a",
            explanation: "Clarity on entrance and exit criteria removes ambiguity on readiness.",
            topic: "milestone",
            skill: "planning",
            skillTag: "gate-definition",
            difficulty: "medium",
        },
        {
            id: "cipm-q9",
            question: "A gate should open (advance to next phase) when:",
            options: [
                { value: "a", label: "Exit criteria are measurably met and decision-maker approves" },
                { value: "b", label: "Target date arrives, even if work incomplete" },
                { value: "c", label: "Team requests acceleration" },
            ],
            correctAnswer: "a",
            explanation: "Date-driven gates enable quality gates to slip; readiness gates reduce surprise.",
            topic: "milestone",
            skill: "judgment",
            skillTag: "readiness-gating",
            difficulty: "hard",
        },
        {
            id: "cipm-q10",
            question: "Schedule variance detection works best via:",
            options: [
                { value: "a", label: "Early task-level tracking vs weekly plans, trending before cascading" },
                { value: "b", label: "Waiting for task completion to see actual vs estimate" },
                { value: "c", label: "Monthly reviews only" },
            ],
            correctAnswer: "a",
            explanation: "Early variance trending enables corrective action before milestones slip.",
            topic: "progress-tracking",
            skill: "operations",
            skillTag: "early-detection",
            difficulty: "medium",
        },
        {
            id: "cipm-q11",
            question: "Small task variance (non-critical path, <2 days) should be:",
            options: [
                { value: "a", label: "Logged and monitored; escalate only if impacting critical path" },
                { value: "b", label: "Ignored completely" },
                { value: "c", label: "Immediately escalated as crisis" },
            ],
            correctAnswer: "a",
            explanation: "Variance response should match impact to downstream gates and milestone.",
            topic: "progress-tracking",
            skill: "judgment",
            skillTag: "variance-triage",
            difficulty: "medium",
        },
        {
            id: "cipm-q12",
            question: "When critical path variance exceeds buffer, first action is:",
            options: [
                { value: "a", label: "Trigger immediate RAID review and re-baseline decision" },
                { value: "b", label: "Continue with original plan and hope for recovery" },
                { value: "c", label: "Reduce quality gates to save time" },
            ],
            correctAnswer: "a",
            explanation: "Buffer consumption signals need for decision and potential re-baseline.",
            topic: "buffer",
            skill: "risk-management",
            skillTag: "trigger-response",
            difficulty: "hard",
        },
        {
            id: "cipm-q13",
            question: "Why is early re-baselining better than late re-baselining?",
            options: [
                { value: "a", label: "Stakeholders see disciplined response and adjust expectations before deadline" },
                { value: "b", label: "It gives more time for recovery before missing dates" },
                { value: "c", label: "Both A and B are true" },
            ],
            correctAnswer: "c",
            explanation: "Early baselining enables both stakeholder trust and recovery planning.",
            topic: "rebaseline",
            skill: "judgment",
            skillTag: "early-action-value",
            difficulty: "hard",
        },
        {
            id: "cipm-q14",
            question: "The most effective buffer sizing for critical path risk is:",
            options: [
                { value: "a", label: "10-20% of path duration based on actual risk exposure and recovery needs" },
                { value: "b", label: "Fixed 10% across all paths regardless of risk" },
                { value: "c", label: "As small as possible to avoid stakeholder pushback" },
            ],
            correctAnswer: "a",
            explanation: "Buffer sizing should match actual risk exposure and recovery capacity.",
            topic: "buffer",
            skill: "planning",
            skillTag: "risk-sized-buffers",
            difficulty: "hard",
        },
        {
            id: "cipm-q15",
            question: "Workback plan is stronger than forward estimate because it:",
            options: [
                { value: "a", label: "Anchors to fixed milestone constraint and maps prerequisites backward" },
                { value: "b", label: "Takes longer to create" },
                { value: "c", label: "Uses more optimistic timelines" },
            ],
            correctAnswer: "a",
            explanation: "Backward planning surfaces real prerequisite dependencies and required sequencing.",
            topic: "workback",
            skill: "planning",
            skillTag: "planning-discipline",
            difficulty: "hard",
        },
    ],
};
