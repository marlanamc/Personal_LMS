import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationStakeholderCommunicationSystemContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation Stakeholder Communication System",
            icon: "messages-square",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Implementation leaders reduce project risk by communicating the right detail to the right audience at the right time.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Design audience-specific communication cadences</li>
                    <li>Write status updates that drive decisions</li>
                    <li>Escalate risks early with clear action requests</li>
                    <li>Run concise cross-functional alignment updates</li>
                </ul>
            `,
            tipBox: {
                title: "Core Rule",
                content: "Communication is a delivery system. If decision-makers are unclear, execution slows even when engineering is strong.",
            },
            exercises: [
                {
                    id: "cisc-intro-1",
                    title: "Communication Intent",
                    instructions: "Choose the strongest communication objective.",
                    items: [
                        {
                            type: "radio",
                            label: "Best purpose of project status updates:",
                            options: [
                                { value: "decisions", label: "Enable decisions, surface risks, and align execution" },
                                { value: "activity", label: "List everything everyone did" },
                            ],
                            expectedAnswer: "decisions",
                        },
                    ],
                },
            ],
        },
        {
            id: "audience-mapping",
            stepNumber: 1,
            title: "Audience Mapping and Signal Levels",
            icon: "users",
            explanation: `
                <h3>Different Stakeholders Need Different Detail</h3>
                <p>One update format does not fit all audiences. Map each group to the decisions they own.</p>
            `,
            verbTable: {
                title: "Audience-to-Signal Map",
                headers: ["Audience", "Needs", "Avoid"],
                rows: [
                    ["Executive", "Outcome trajectory, risk exposure, decisions required", "Task-level noise"],
                    ["Delivery team", "Blockers, dependencies, ownership, next actions", "Vague optimism"],
                    ["Customer/client", "Progress confidence, milestones, adoption readiness", "Internal-only technical jargon"],
                    ["Ops/support", "Go-live risk, support impact, fallback plans", "Late surprises"],
                ],
            },
            exercises: [
                {
                    id: "cisc-audience-1",
                    title: "Audience Fit",
                    instructions: "Pick the strongest communication fit.",
                    items: [
                        {
                            type: "radio",
                            label: "For executive weekly update, highest-value lead section is:",
                            options: [
                                { value: "outcomes", label: "Outcome status + risk + decisions needed" },
                                { value: "commits", label: "Commits merged and files touched" },
                            ],
                            expectedAnswer: "outcomes",
                        },
                        {
                            type: "text",
                            label: "Write one sentence translating a technical blocker into stakeholder-friendly language:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "cadence-and-channel-design",
            stepNumber: 2,
            title: "Cadence and Channel Design",
            icon: "calendar-range",
            explanation: `
                <h3>Cadence Controls Surprise</h3>
                <p>Set explicit rhythm by audience so risks are surfaced before milestones break.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Baseline cadence model:</strong></p>
                    <ul style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li>Executive: weekly summary + exception escalations</li>
                        <li>Delivery team: 2-3x weekly operational sync</li>
                        <li>Customer/client: weekly or milestone checkpoint</li>
                        <li>Incident mode: hourly or time-boxed updates</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "cisc-cadence-1",
                    title: "Cadence Decisions",
                    instructions: "Choose the lowest-risk communication plan.",
                    items: [
                        {
                            type: "radio",
                            label: "A critical dependency is unstable near launch. Best communication shift:",
                            options: [
                                { value: "increase", label: "Increase update cadence and include decision timestamps" },
                                { value: "hold", label: "Keep normal cadence to avoid concern" },
                            ],
                            expectedAnswer: "increase",
                        },
                        {
                            type: "text",
                            label: "Write one rule for when to switch from normal cadence to incident cadence:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "status-update-architecture",
            stepNumber: 3,
            title: "Status Update Architecture",
            icon: "file-output",
            explanation: `
                <h3>Use a Repeatable Structure</h3>
                <p>High-quality updates are short, scannable, and decision-oriented.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Objective status -> Milestone confidence -> Risks -> Decisions needed -> Next milestone
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "cisc-status-1",
                    title: "Status Writing Drill",
                    instructions: "Practice clear, high-signal updates.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 2-sentence executive update for a project that is yellow due to one unresolved vendor dependency:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one decision request line that names owner, decision needed, and deadline:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "escalation-system",
            stepNumber: 4,
            title: "Escalation Triggers and Risk Language",
            icon: "alert-triangle",
            explanation: `
                <h3>Escalate Early, Not Loud</h3>
                <p>Escalation should be based on trigger criteria: timeline impact, scope impact, or critical dependency breach.</p>
            `,
            usageMeanings: [
                {
                    title: "Strong escalation format",
                    description: "Clear trigger, impact, ask, deadline",
                    examples: [
                        {
                            sentence: "Trigger: vendor API access delayed 5 days; Impact: launch date at risk; Ask: approve phased launch by Friday.",
                            explanation: "Actionable escalation with clear decision path.",
                        },
                    ],
                },
                {
                    title: "Weak escalation format",
                    description: "Emotional, vague, no ask",
                    examples: [
                        {
                            sentence: "Things are bad, we need help.",
                            explanation: "No concrete trigger or decision request.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cisc-escalation-1",
                    title: "Escalation Quality",
                    instructions: "Select the strongest escalation behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "When risk likely impacts launch date, best action:",
                            options: [
                                { value: "escalate", label: "Escalate with impact + options + recommendation" },
                                { value: "hide", label: "Wait until date slips to avoid alarm" },
                            ],
                            expectedAnswer: "escalate",
                        },
                        {
                            type: "text",
                            label: "Write one escalation line using trigger/impact/ask/deadline:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "meeting-and-handoff-discipline",
            stepNumber: 5,
            title: "Meeting and Handoff Discipline",
            icon: "handshake",
            explanation: `
                <h3>Every Sync Should End with Ownership</h3>
                <p>Avoid status-only meetings. End each communication cycle with owners, dates, and unresolved decisions explicitly listed.</p>
            `,
            exercises: [
                {
                    id: "cisc-handoff-1",
                    title: "Handoff Drill",
                    instructions: "Choose the strongest close-out pattern.",
                    items: [
                        {
                            type: "radio",
                            label: "Best end-of-meeting artifact:",
                            options: [
                                { value: "actions", label: "Action log with owner/date/decision status" },
                                { value: "summary", label: "General summary with no assignments" },
                            ],
                            expectedAnswer: "actions",
                        },
                        {
                            type: "text",
                            label: "Write one action-log line with owner, action, and due date:",
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
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> read plans -> write update -> escalation scenario.</p>
            `,
            exercises: [
                {
                    id: "cisc-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence describing what makes communication 'implementation-grade':",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cisc-cadence-read",
                    title: "Read Update",
                    instructions: "Critique an update from a stakeholder perspective.",
                    items: [
                        {
                            type: "text",
                            label: "Find one project update in this repo and identify one missing decision or risk signal:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cisc-cadence-write",
                    title: "Write Update",
                    instructions: "Write a concise high-signal status package.",
                    items: [
                        {
                            type: "text",
                            label: "Draft a 5-line weekly update: objective status, milestone confidence, top risk, decision needed, next milestone:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cisc-cadence-debug",
                    title: "Escalation Scenario",
                    instructions: "Choose the strongest response when risk increases.",
                    items: [
                        {
                            type: "radio",
                            label: "A dependency misses its deadline and affects scope. Best first move:",
                            options: [
                                { value: "trigger", label: "Trigger escalation path and share options with recommendation" },
                                { value: "silent", label: "Absorb the work silently to protect timeline optics" },
                            ],
                            expectedAnswer: "trigger",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Build audience-specific communication plans with the right signal level.</li>
                    <li>Write concise updates that drive decisions instead of only reporting activity.</li>
                    <li>Escalate risk using clear triggers, impacts, and asks.</li>
                    <li>Close meetings and handoffs with accountable action logs.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "cisc-q1",
            question: "Executive status updates should prioritize:",
            options: [
                { value: "a", label: "Outcome trajectory, top risks, decisions required" },
                { value: "b", label: "Task-by-task implementation details" },
                { value: "c", label: "No risk signals until resolved" },
            ],
            correctAnswer: "a",
            explanation: "Executives need decision-grade signal, not operational noise.",
            topic: "audience-mapping",
            skill: "stakeholder-management",
            skillTag: "exec-signal-design",
            difficulty: "easy",
        },
        {
            id: "cisc-q2",
            question: "Strong escalation message includes:",
            options: [
                { value: "a", label: "Trigger, impact, decision ask, and deadline" },
                { value: "b", label: "General concern and urgency" },
                { value: "c", label: "Only technical stack trace" },
            ],
            correctAnswer: "a",
            explanation: "Escalations must be actionable and decision-oriented.",
            topic: "escalation",
            skill: "risk-management",
            skillTag: "trigger-impact-ask",
            difficulty: "medium",
        },
        {
            id: "cisc-q3",
            question: "If launch risk increases suddenly, best cadence response is:",
            options: [
                { value: "a", label: "Increase communication cadence and timestamp decisions" },
                { value: "b", label: "Keep cadence unchanged to reduce noise" },
                { value: "c", label: "Pause updates until certainty improves" },
            ],
            correctAnswer: "a",
            explanation: "Higher risk requires tighter communication loops.",
            topic: "cadence",
            skill: "operations",
            skillTag: "risk-based-cadence",
            difficulty: "medium",
        },
        {
            id: "cisc-q4",
            question: "A meeting ends with no owners or due dates. Primary risk is:",
            options: [
                { value: "a", label: "Accountability drift and execution ambiguity" },
                { value: "b", label: "Faster progress" },
                { value: "c", label: "Higher decision quality" },
            ],
            correctAnswer: "a",
            explanation: "Unowned actions become unexecuted actions.",
            topic: "handoff",
            skill: "delivery",
            skillTag: "action-ownership",
            difficulty: "hard",
        },
        {
            id: "cisc-q5",
            question: "Best communication goal for implementation specialists:",
            options: [
                { value: "a", label: "Reduce decision latency and delivery risk" },
                { value: "b", label: "Maximize meeting count" },
                { value: "c", label: "Hide uncertainty until final week" },
            ],
            correctAnswer: "a",
            explanation: "Communication quality is measured by alignment and faster decisions.",
            topic: "communication-strategy",
            skill: "systems-thinking",
            skillTag: "decision-flow",
            difficulty: "hard",
        },
    ],
};
