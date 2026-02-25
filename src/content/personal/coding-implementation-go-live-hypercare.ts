import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationGoLiveHypercareContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation Go-Live + Hypercare Operations",
            icon: "rocket",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Go-live is an operations event, not a single technical step. Hypercare ensures early issues are contained before they become adoption failures.</p>
                </div>
                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Run go-live readiness checks with clear gates</li>
                    <li>Execute cutover using role-based runbooks</li>
                    <li>Operate hypercare cadence with issue triage discipline</li>
                    <li>Transition to steady-state support with clear ownership</li>
                </ul>
            `,
            tipBox: {
                title: "Go-Live Rule",
                content: "If cutover ownership and rollback criteria are unclear, you are not launch-ready.",
            },
            exercises: [
                {
                    id: "cigh-intro-1",
                    title: "Launch Mindset",
                    instructions: "Choose the strongest go-live principle.",
                    items: [
                        {
                            type: "radio",
                            label: "Best definition of go-live readiness:",
                            options: [
                                { value: "gated", label: "All critical gates passed with runbook ownership and rollback plan" },
                                { value: "momentum", label: "Team is excited and wants to ship" },
                            ],
                            expectedAnswer: "gated",
                        },
                    ],
                },
            ],
        },
        {
            id: "readiness-gates",
            stepNumber: 1,
            title: "Go-Live Readiness Gates",
            icon: "shield-check",
            explanation: `
                <h3>Gate Before You Launch</h3>
                <p>Use objective readiness gates across product, data, support, and communication. No gate, no launch.</p>
            `,
            verbTable: {
                title: "Readiness Gate Set",
                headers: ["Gate", "Check", "Owner"],
                rows: [
                    ["Functional", "Critical workflows pass UAT", "Product + QA"],
                    ["Data", "Migration/seed integrity verified", "Engineering + Data"],
                    ["Support", "Runbooks and escalation paths confirmed", "Support lead"],
                    ["Communication", "User-facing rollout messages approved", "Implementation lead"],
                ],
            },
            exercises: [
                {
                    id: "cigh-gates-1",
                    title: "Gate Decisions",
                    instructions: "Pick the safest launch decision behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "One critical gate remains red near launch. Best call:",
                            options: [
                                { value: "hold", label: "Hold or conditional-go with explicit risk acceptance" },
                                { value: "ship", label: "Launch and resolve gate later" },
                            ],
                            expectedAnswer: "hold",
                        },
                        {
                            type: "text",
                            label: "Write one concrete go-live gate criterion for your LMS context:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "cutover-runbook",
            stepNumber: 2,
            title: "Cutover Runbook Design",
            icon: "list-checks",
            explanation: `
                <h3>Cutover Needs Time-Ordered, Owner-Labeled Steps</h3>
                <p>Build runbooks with timestamped tasks, owner roles, verification checks, and rollback trigger criteria.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
T-60: pre-checks
T-30: freeze + backups
T-0: deploy/cutover
T+15: smoke checks
T+60: status checkpoint
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "cigh-runbook-1",
                    title: "Runbook Quality",
                    instructions: "Choose the strongest runbook structure.",
                    items: [
                        {
                            type: "radio",
                            label: "Best cutover runbook format:",
                            options: [
                                { value: "timed", label: "Timestamped steps with owner + verification + fallback" },
                                { value: "notes", label: "Loose checklist without assignments" },
                            ],
                            expectedAnswer: "timed",
                        },
                        {
                            type: "text",
                            label: "Write one runbook step with owner and explicit verification output:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "rollback-mitigation",
            stepNumber: 3,
            title: "Rollback and Mitigation Strategy",
            icon: "undo-2",
            explanation: `
                <h3>Define Exit Paths Before Entry</h3>
                <p>For each critical failure mode, specify rollback criteria or forward-fix mitigation with owner and decision authority.</p>
            `,
            exercises: [
                {
                    id: "cigh-rollback-1",
                    title: "Recovery Judgment",
                    instructions: "Choose the safest recovery decision.",
                    items: [
                        {
                            type: "radio",
                            label: "Post-launch issue affects core login flow. Best immediate posture:",
                            options: [
                                { value: "contain", label: "Contain impact and execute predefined rollback/mitigation path" },
                                { value: "explore", label: "Experiment with ad hoc fixes in production" },
                            ],
                            expectedAnswer: "contain",
                        },
                        {
                            type: "text",
                            label: "Write one rollback trigger condition that is objective and measurable:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "hypercare-operations",
            stepNumber: 4,
            title: "Hypercare Operating Model",
            icon: "heart-pulse",
            explanation: `
                <h3>Hypercare Is Time-Boxed Intensive Monitoring</h3>
                <p>Define hypercare window, triage cadence, severity paths, and daily summary format for rapid stabilization.</p>
            `,
            verbTable: {
                title: "Hypercare Cadence",
                headers: ["Window", "Cadence", "Outputs"],
                rows: [
                    ["Day 0-2", "High-frequency checks", "Incident board + owner ETAs"],
                    ["Day 3-7", "Twice-daily summaries", "Trend analysis + mitigation status"],
                    ["Exit", "Formal transition review", "Steady-state support handoff"],
                ],
            },
            exercises: [
                {
                    id: "cigh-hypercare-1",
                    title: "Hypercare Design",
                    instructions: "Choose the strongest operating pattern.",
                    items: [
                        {
                            type: "radio",
                            label: "Best hypercare model after a major workflow launch:",
                            options: [
                                { value: "structured", label: "Time-boxed daily triage with severity SLAs and summary reports" },
                                { value: "ad-hoc", label: "Ad hoc monitoring when someone notices issues" },
                            ],
                            expectedAnswer: "structured",
                        },
                        {
                            type: "text",
                            label: "Write one hypercare daily summary line including trend + action owner:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "handoff-to-steady-state",
            stepNumber: 5,
            title: "Handoff to Steady-State Support",
            icon: "arrow-right-left",
            explanation: `
                <h3>Exit Hypercare Intentionally</h3>
                <p>Transition only when incident volume, severity, and owner response times meet agreed thresholds.</p>
            `,
            exercises: [
                {
                    id: "cigh-handoff-1",
                    title: "Transition Criteria",
                    instructions: "Pick the strongest handoff criteria.",
                    items: [
                        {
                            type: "radio",
                            label: "Best trigger to exit hypercare:",
                            options: [
                                { value: "threshold", label: "Sustained metrics meet exit thresholds + support signoff" },
                                { value: "time", label: "Calendar date reached regardless of issue volume" },
                            ],
                            expectedAnswer: "threshold",
                        },
                        {
                            type: "text",
                            label: "Write one support handoff line with owner, SLA, and escalation path:",
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
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> review runbook -> write hypercare update -> launch-risk scenario.</p>
            `,
            exercises: [
                {
                    id: "cigh-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence explaining why go-live readiness must be gate-based:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cigh-cadence-read",
                    title: "Read Runbook",
                    instructions: "Audit an operations artifact.",
                    items: [
                        {
                            type: "text",
                            label: "Find one runbook or checklist in this repo and identify one missing rollback trigger:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cigh-cadence-write",
                    title: "Write Update",
                    instructions: "Write a concise hypercare update.",
                    items: [
                        {
                            type: "text",
                            label: "Draft a 4-line hypercare update: issue trend, top risk, owner action, next checkpoint:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cigh-cadence-debug",
                    title: "Launch Scenario",
                    instructions: "Choose the strongest incident response.",
                    items: [
                        {
                            type: "radio",
                            label: "If a critical issue appears at T+10 after cutover, first move is:",
                            options: [
                                { value: "path", label: "Execute predefined containment/rollback path and communicate immediately" },
                                { value: "trial", label: "Try unplanned patches first" },
                            ],
                            expectedAnswer: "path",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Run go-live readiness with objective launch gates.</li>
                    <li>Design cutover runbooks with owners, timings, and verification outputs.</li>
                    <li>Operate structured hypercare with severity-based triage loops.</li>
                    <li>Transition safely into steady-state support using exit thresholds.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "cigh-q1",
            question: "Best criterion for go-live decision quality:",
            options: [
                { value: "a", label: "Objective gate pass status with owner accountability" },
                { value: "b", label: "Team confidence only" },
                { value: "c", label: "External pressure" },
            ],
            correctAnswer: "a",
            explanation: "Gate-based decisions reduce bias and launch risk.",
            topic: "go-live",
            skill: "governance",
            skillTag: "readiness-gates",
            difficulty: "easy",
        },
        {
            id: "cigh-q2",
            question: "Strong cutover runbook step includes:",
            options: [
                { value: "a", label: "Time, owner, action, verification, fallback" },
                { value: "b", label: "Action title only" },
                { value: "c", label: "No verification needed" },
            ],
            correctAnswer: "a",
            explanation: "Execution reliability requires explicit operational fields.",
            topic: "cutover",
            skill: "operations",
            skillTag: "runbook-structure",
            difficulty: "medium",
        },
        {
            id: "cigh-q3",
            question: "Primary objective of hypercare:",
            options: [
                { value: "a", label: "Rapid stabilization and controlled issue response" },
                { value: "b", label: "Replace long-term support model" },
                { value: "c", label: "Delay user feedback" },
            ],
            correctAnswer: "a",
            explanation: "Hypercare is a short, intensive stabilization window.",
            topic: "hypercare",
            skill: "delivery",
            skillTag: "stabilization-window",
            difficulty: "medium",
        },
        {
            id: "cigh-q4",
            question: "When should hypercare end?",
            options: [
                { value: "a", label: "When exit thresholds and support handoff criteria are met" },
                { value: "b", label: "Automatically after one week" },
                { value: "c", label: "When update fatigue sets in" },
            ],
            correctAnswer: "a",
            explanation: "Metric and governance thresholds should define transition timing.",
            topic: "handoff",
            skill: "risk-management",
            skillTag: "threshold-based-exit",
            difficulty: "hard",
        },
        {
            id: "cigh-q5",
            question: "If core workflow fails minutes after cutover, best first action:",
            options: [
                { value: "a", label: "Execute containment path and communicate status immediately" },
                { value: "b", label: "Wait for trend confirmation" },
                { value: "c", label: "Silently patch without notifying stakeholders" },
            ],
            correctAnswer: "a",
            explanation: "Fast containment and communication protect users and decision flow.",
            topic: "incident-response",
            skill: "triage",
            skillTag: "contain-communicate",
            difficulty: "hard",
        },
    ],
};
