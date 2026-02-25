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
                        {
                            type: "radio",
                            label: "A delivery team needs to know about a vendor API integration delay. Best communication includes:",
                            options: [
                                { value: "blockers", label: "Blockers, ownership, next actions, timeline impact" },
                                { value: "status", label: "Status update and general timeline" },
                            ],
                            expectedAnswer: "blockers",
                        },
                        {
                            type: "text",
                            label: "Draft a one-line customer update about a feature delay (focus on impact they care about):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When communicating with operations/support team pre-launch, avoid:",
                            options: [
                                { value: "vague", label: "Vague timelines and surprise rollout plans" },
                                { value: "technical", label: "Technical implementation details" },
                                { value: "both", label: "Both of the above" },
                            ],
                            expectedAnswer: "vague",
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
                        {
                            type: "radio",
                            label: "During normal delivery, delivery team sync frequency should be:",
                            options: [
                                { value: "frequent", label: "2-3x weekly to surface blockers quickly" },
                                { value: "sparse", label: "Once per week to minimize interruption" },
                            ],
                            expectedAnswer: "frequent",
                        },
                        {
                            type: "text",
                            label: "Define what 'incident mode' communication looks like (frequency, decision speed, escalation protocol):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Cadence should increase if:",
                            options: [
                                { value: "risk", label: "Risk exposure increases or timeline compresses" },
                                { value: "happy", label: "Team morale is high and progress is fast" },
                                { value: "team", label: "Team size grows" },
                            ],
                            expectedAnswer: "risk",
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
                        {
                            type: "radio",
                            label: "A status update should flow in this order:",
                            options: [
                                { value: "flow", label: "Objective → Confidence → Risk → Decision needed → Next milestone" },
                                { value: "time", label: "Timeline → budget → scope → team → status" },
                            ],
                            expectedAnswer: "flow",
                        },
                        {
                            type: "text",
                            label: "Write a 'risk' paragraph for an executive update (1-2 sentences, include timeline impact):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When project status is green, executive update should focus on:",
                            options: [
                                { value: "milestone", label: "Milestone completion, upcoming decisions, confidence for next phase" },
                                { value: "detail", label: "Technical details of what was completed" },
                            ],
                            expectedAnswer: "milestone",
                        },
                        {
                            type: "text",
                            label: "Draft a 1-line confidence statement for a project tracking on timeline:",
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
                        {
                            type: "radio",
                            label: "A strong escalation message always includes:",
                            options: [
                                { value: "structure", label: "Specific trigger, business impact, decision options, and deadline" },
                                { value: "emotion", label: "Urgency and frustration to motivate action" },
                            ],
                            expectedAnswer: "structure",
                        },
                        {
                            type: "text",
                            label: "Compare: weak escalation vs strong escalation. Write the weak version first, then the strong version:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When escalating a critical issue, recommendation should include:",
                            options: [
                                { value: "options", label: "2-3 options with tradeoffs so decision-maker can choose" },
                                { value: "single", label: "Single recommended path to speed decision" },
                            ],
                            expectedAnswer: "options",
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
                        {
                            type: "radio",
                            label: "A meeting without clear owners or deadlines results in:",
                            options: [
                                { value: "drift", label: "Accountability drift and unexecuted actions" },
                                { value: "progress", label: "Faster progress due to no blocking constraints" },
                            ],
                            expectedAnswer: "drift",
                        },
                        {
                            type: "text",
                            label: "Design a post-meeting recap template with 4 key sections:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When an action remains unresolved after a meeting:",
                            options: [
                                { value: "track", label: "Track it in the unresolved log with escalation trigger" },
                                { value: "drop", label: "Drop it from tracking to avoid noise" },
                            ],
                            expectedAnswer: "track",
                        },
                    ],
                },
            ],
        },
        {
            id: "translating-technical-issues",
            stepNumber: 6,
            title: "Translating Technical Issues to Business Impact",
            icon: "zap",
            explanation: `
                <h3>The Translation Problem</h3>
                <p>When a technical issue arises, stakeholders don't care about the technical details—they care about impact on delivery, cost, and user experience. Your job is to translate the technical constraint into business language that enables faster decisions.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Translation pattern:</strong></p>
                    <p style="margin: 0; line-height: 1.7;"><em>Technical issue</em> → <em>business consequence</em> → <em>decision needed</em> → <em>recommendation</em></p>
                </div>

                <h3>Common Translation Scenarios</h3>
                <p>Technical issues map to specific business impacts. Understanding which impact matters most to your stakeholder audience helps you frame the message for faster alignment.</p>
            `,
            verbTable: {
                title: "Technical Issue → Business Impact Translation",
                headers: ["Technical Issue", "Business Impact", "Decision Framing", "Stakeholder Concern"],
                rows: [
                    ["API vendor onboarding delayed 2 weeks", "Timeline risk: launch date now at risk", "Phased launch vs extended timeline", "Executive: cost of delay vs quality"],
                    ["Database schema migration incomplete", "Scope risk: feature flagging required", "Ship without feature vs extend prep", "Team: rollback safety vs new timeline"],
                    ["Third-party library security patch pending", "Delivery risk: blocker until patched", "Patch in QA vs extend timeline vs skip", "Security lead: risk tolerance vs launch date"],
                    ["Performance regression in core flow", "User experience risk: may not meet SLA", "Optimize vs accept degradation vs scope cut", "Product: quality vs users waiting"],
                ],
            },
            exercises: [
                {
                    id: "cisc-translate-1",
                    title: "Issue Translation",
                    instructions: "Translate technical issues to business language.",
                    items: [
                        {
                            type: "text",
                            label: "You discover a critical payment processing API is rate-limited. Translate this technical issue into a stakeholder-facing business impact (1-2 sentences):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "A key data import takes 6 hours instead of 1 hour due to volume. What is the business consequence for go-live cutover?",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When translating technical delays, highest-value framing includes:",
                            options: [
                                { value: "impact", label: "Business consequence (timeline/cost/risk) + decision options" },
                                { value: "blame", label: "Who caused the delay and technical details" },
                                { value: "emotion", label: "Frustration and urgency signals" },
                            ],
                            expectedAnswer: "impact",
                        },
                    ],
                },
            ],
        },
        {
            id: "meeting-facilitation-action-capture",
            stepNumber: 7,
            title: "Meeting Facilitation and Action Capture",
            icon: "clipboard-list",
            explanation: `
                <h3>Not All Meetings Drive Decisions</h3>
                <p>Status meetings that end without owners, decisions, or next actions waste time. Implementation-grade meetings require pre-meeting clarity, real-time decision capture, and post-meeting artifact distribution.</p>

                <h3>Three Meeting Types in Implementation</h3>
                <p>Different meetings serve different purposes. Mixing purposes creates confusion and wasted time.</p>
            `,
            verbTable: {
                title: "Meeting Types: Purpose × Preparation × Closeout",
                headers: ["Meeting Type", "Purpose", "Prep Required", "Key Outcome", "Minimum Attendees"],
                rows: [
                    ["Operational Sync", "Unblock delivery, surface blockers", "Shared ticket view or status template", "Action log with owners/dates", "Team lead, dependencies"],
                    ["Escalation Review", "Decide on risk response, approve options", "3+ options with tradeoffs pre-written", "Decision recorded with reasoning", "Decision-maker, impacted teams"],
                    ["Stakeholder Alignment", "Drive cross-functional consensus, remove ambiguity", "Shared charter or scope doc pre-reviewed", "Owner, timeline, and unresolved questions", "All decision-makers, exec sponsor"],
                    ["Go-Live Readiness", "Final risk verification before cutover", "Readiness checklist, runbook review", "Go/no-go decision, rollback plan", "All teams, incident commander"],
                ],
            },
            tipBox: {
                title: "Post-Meeting Artifact Template",
                content: `Decision made | Action log (Owner/Action/Date) | Unresolved issues | Next sync date and purpose`,
            },
            exercises: [
                {
                    id: "cisc-facilitation-1",
                    title: "Meeting Preparation",
                    instructions: "Identify the prep required for decision meetings.",
                    items: [
                        {
                            type: "radio",
                            label: "Before an escalation meeting to decide on timeline extension, best prep is:",
                            options: [
                                { value: "options", label: "3+ options with cost/risk tradeoffs pre-analyzed" },
                                { value: "problem", label: "A complete problem description and team morale" },
                                { value: "data", label: "Historical data on past delays" },
                            ],
                            expectedAnswer: "options",
                        },
                        {
                            type: "text",
                            label: "Design a pre-meeting agenda for an operational sync that unblocks a critical delivery path (3-4 items):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one action log entry with owner, action, and due date for a stakeholder alignment meeting:",
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
        {
            id: "cisc-q6",
            question: "Delivery team updates should focus most on:",
            options: [
                { value: "a", label: "Blockers, dependencies, ownership, and next actions" },
                { value: "b", label: "Completed tasks and team velocity" },
                { value: "c", label: "Budget spend and resource utilization" },
            ],
            correctAnswer: "a",
            explanation: "Delivery teams need operational clarity to execute, not status reporting.",
            topic: "audience-mapping",
            skill: "stakeholder-management",
            skillTag: "delivery-team-signal",
            difficulty: "easy",
        },
        {
            id: "cisc-q7",
            question: "When translating technical issues for stakeholders, avoid:",
            options: [
                { value: "a", label: "The technical details; focus on business impact instead" },
                { value: "b", label: "Mentioning the problem at all" },
                { value: "c", label: "Any admission of the issue" },
            ],
            correctAnswer: "a",
            explanation: "Technical jargon obscures decision-making. Frame around impact: timeline, cost, or quality.",
            topic: "translating-technical-issues",
            skill: "communication",
            skillTag: "impact-translation",
            difficulty: "easy",
        },
        {
            id: "cisc-q8",
            question: "A vendor delay affects your launch date. Best escalation structure:",
            options: [
                { value: "a", label: "Trigger: API delayed 2 weeks | Impact: launch at risk | Ask: approve phased launch" },
                { value: "b", label: "The vendor really dropped the ball, we need their help immediately" },
                { value: "c", label: "Status is yellow, timeline now uncertain" },
            ],
            correctAnswer: "a",
            explanation: "Clear trigger, specific impact, and actionable ask enable faster decisions.",
            topic: "escalation",
            skill: "risk-management",
            skillTag: "escalation-structure",
            difficulty: "medium",
        },
        {
            id: "cisc-q9",
            question: "During incident mode communication, priority sequence is:",
            options: [
                { value: "a", label: "Decision owners first, then delivery team, then executives with wrapped summary" },
                { value: "b", label: "Executives first to get approval, then execute" },
                { value: "c", label: "Deliver team first for full details, then exec summary" },
            ],
            correctAnswer: "a",
            explanation: "Decision-makers need real-time access to unblock; teams need clarity; exec needs summary.",
            topic: "cadence",
            skill: "operations",
            skillTag: "incident-communication",
            difficulty: "medium",
        },
        {
            id: "cisc-q10",
            question: "Status update flow that drives decisions is:",
            options: [
                { value: "a", label: "Objective → Milestone confidence → Risks → Decisions needed → Next milestone" },
                { value: "b", label: "Tasks completed → Blockers → Status → Schedule" },
                { value: "c", label: "What happened → What we're doing → When it will finish" },
            ],
            correctAnswer: "a",
            explanation: "Decision-oriented flow puts outcome clarity first, then risks, then asks.",
            topic: "status-update-architecture",
            skill: "communication",
            skillTag: "update-structure",
            difficulty: "medium",
        },
        {
            id: "cisc-q11",
            question: "Meeting prep for escalation decisions should include:",
            options: [
                { value: "a", label: "3+ options with costs/risks/timelines pre-analyzed" },
                { value: "b", label: "Complete problem description to discuss" },
                { value: "c", label: "Historical context and emotional buy-in" },
            ],
            correctAnswer: "a",
            explanation: "Pre-analysis of options enables faster, higher-quality decisions.",
            topic: "meeting-facilitation-action-capture",
            skill: "delivery",
            skillTag: "meeting-prep",
            difficulty: "medium",
        },
        {
            id: "cisc-q12",
            question: "Customer communication before a feature delay should include:",
            options: [
                { value: "a", label: "Clear impact on their use, new timeline, what they can do in the meantime" },
                { value: "b", label: "Technical reason for the delay and apologies" },
                { value: "c", label: "Internal team struggles and resource constraints" },
            ],
            correctAnswer: "a",
            explanation: "Customers care about impact on them: when they get it, alternatives meanwhile, and confidence in new date.",
            topic: "audience-mapping",
            skill: "stakeholder-management",
            skillTag: "customer-framing",
            difficulty: "medium",
        },
        {
            id: "cisc-q13",
            question: "An unresolved action after a meeting creates risk because:",
            options: [
                { value: "a", label: "Ambiguity → no owner → no execution → missed deadline" },
                { value: "b", label: "It shows the meeting was inefficient" },
                { value: "c", label: "The team will naturally complete it later" },
            ],
            correctAnswer: "a",
            explanation: "Ownership ambiguity breaks execution. Every action needs explicit owner, timeline, and escalation trigger.",
            topic: "meeting-facilitation-action-capture",
            skill: "delivery",
            skillTag: "action-tracking",
            difficulty: "hard",
        },
        {
            id: "cisc-q14",
            question: "Risk-based cadence adjustment means:",
            options: [
                { value: "a", label: "Higher risk = tighter communication loops and faster decision cycles" },
                { value: "b", label: "Lower risk = daily updates to stay aligned" },
                { value: "c", label: "Cadence should always stay fixed regardless of risk" },
            ],
            correctAnswer: "a",
            explanation: "Risk exposure should drive communication frequency. Compressed timelines need compressed decision cycles.",
            topic: "cadence-and-channel-design",
            skill: "operations",
            skillTag: "risk-cadence-link",
            difficulty: "hard",
        },
        {
            id: "cisc-q15",
            question: "When a technical issue has dual impacts (cost and timeline), best escalation:",
            options: [
                { value: "a", label: "Present both impacts with 2-3 options and let decision-maker choose tradeoff" },
                { value: "b", label: "Choose the worst impact to force immediate action" },
                { value: "c", label: "Wait until one impact becomes clear" },
            ],
            correctAnswer: "a",
            explanation: "Multi-dimensional impacts require transparent tradeoff analysis. Let decision-makers see full picture.",
            topic: "translating-technical-issues",
            skill: "risk-management",
            skillTag: "multi-impact-escalation",
            difficulty: "hard",
        },
    ],
};
