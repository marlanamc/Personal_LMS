import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationDiscoveryScopingContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation Discovery + Scoping Discipline",
            icon: "map",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Strong implementation starts before build work: clear objectives, constraints, scope boundaries, dependencies, and escalation conditions.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Run discovery using repeatable intake questions</li>
                    <li>Turn ambiguous requests into scoped, testable plans</li>
                    <li>Define out-of-scope boundaries and decision owners</li>
                    <li>Prepare handoff artifacts that keep delivery aligned</li>
                </ul>
            `,
            tipBox: {
                title: "Execution Principle",
                content:
                    "Unclear scope creates hidden risk. Clarify success criteria and boundaries before discussing delivery dates.",
            },
            exercises: [
                {
                    id: "cids-intro-1",
                    title: "Discovery Mindset",
                    instructions: "Choose the strongest first move.",
                    items: [
                        {
                            type: "radio",
                            label: "A stakeholder says: 'We need this ASAP.' Best response:",
                            options: [
                                {
                                    value: "clarify",
                                    label: "Clarify goals, constraints, and must-have outcomes before estimating",
                                },
                                { value: "promise", label: "Promise a date immediately to show urgency" },
                            ],
                            expectedAnswer: "clarify",
                        },
                    ],
                },
            ],
        },
        {
            id: "discovery-intake",
            stepNumber: 1,
            title: "Discovery Intake Framework",
            icon: "clipboard-list",
            explanation: `
                <h3>Ask Questions That De-Risk Delivery</h3>
                <p>Use a structured intake so requirements become operational, not aspirational.</p>
            `,
            verbTable: {
                title: "Intake Categories",
                headers: ["Category", "Key Question", "Output"],
                rows: [
                    ["Business objective", "What outcome should improve?", "Success metric + baseline"],
                    ["User impact", "Who is affected and how?", "Primary user scenarios"],
                    ["Constraints", "What technical/compliance limits exist?", "Non-negotiable boundaries"],
                    ["Timeline", "What date is fixed and why?", "Milestone assumptions"],
                    ["Ownership", "Who decides priority tradeoffs?", "Decision owner map"],
                ],
            },
            exercises: [
                {
                    id: "cids-intake-1",
                    title: "Intake Quality",
                    instructions: "Pick the best discovery question for each goal.",
                    items: [
                        {
                            type: "radio",
                            label: "To prevent ambiguous success criteria, ask:",
                            options: [
                                { value: "metric", label: "What metric should change, by how much, and by when?" },
                                { value: "vibe", label: "What should this feel like generally?" },
                            ],
                            expectedAnswer: "metric",
                        },
                        {
                            type: "text",
                            label: "Write one discovery question that uncovers hidden dependency risk:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "scope-definition",
            stepNumber: 2,
            title: "Scope Definition and Boundaries",
            icon: "crop",
            explanation: `
                <h3>Define In-Scope, Out-of-Scope, and Deferred</h3>
                <p>Implementation plans fail when everything stays "possible". Boundaries improve focus and stakeholder trust.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Scope statement template:</strong></p>
                    <ul style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li><strong>In scope:</strong> must-have deliverables in current phase</li>
                        <li><strong>Out of scope:</strong> explicitly excluded work</li>
                        <li><strong>Deferred:</strong> next-phase candidates with trigger criteria</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "cids-scope-1",
                    title: "Boundary Decisions",
                    instructions: "Choose the best scoping approach.",
                    items: [
                        {
                            type: "radio",
                            label: "A request includes 12 features but deadline supports 5. Best move:",
                            options: [
                                {
                                    value: "phased",
                                    label: "Define phase-1 must-haves and defer remaining items with criteria",
                                },
                                { value: "all", label: "Accept all 12 and hope delivery catches up" },
                            ],
                            expectedAnswer: "phased",
                        },
                        {
                            type: "text",
                            label: "Write one explicit out-of-scope statement for a first-phase rollout:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "dependency-and-raid-mapping",
            stepNumber: 3,
            title: "Dependency Mapping + RAID Basics",
            icon: "link",
            explanation: `
                <h3>Map Risks Before They Trigger Delays</h3>
                <p>Track dependencies and RAID items early so blockers become planned decisions, not surprises.</p>
            `,
            usageMeanings: [
                {
                    title: "RAID structure",
                    description: "Minimum tracking fields",
                    examples: [
                        {
                            sentence: "Risk: probability + impact + mitigation owner + due date",
                            explanation: "Makes risk actionable, not abstract.",
                        },
                        {
                            sentence: "Dependency: required team/input + due date + fallback",
                            explanation: "Clarifies sequencing and escalation path.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cids-raid-1",
                    title: "RAID Prioritization",
                    instructions: "Choose the strongest tracking behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "A high-risk dependency has no owner. Best action:",
                            options: [
                                { value: "assign", label: "Assign owner, due date, and escalation trigger immediately" },
                                { value: "note", label: "Leave as note until it becomes urgent" },
                            ],
                            expectedAnswer: "assign",
                        },
                        {
                            type: "text",
                            label: "Write one escalation trigger condition for a critical dependency:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "stakeholder-communication-plan",
            stepNumber: 4,
            title: "Stakeholder Communication Plan",
            icon: "megaphone",
            explanation: `
                <h3>Different Audiences Need Different Signal Levels</h3>
                <p>Implementation specialists translate the same project reality into the right format for executives, partners, and delivery teams.</p>
            `,
            verbTable: {
                title: "Communication Cadence",
                headers: ["Audience", "Cadence", "Primary Content"],
                rows: [
                    ["Executive", "Weekly", "Outcome status, major risks, decisions needed"],
                    ["Delivery team", "2-3x/week", "Task status, blockers, dependency changes"],
                    ["Customer/client", "Weekly or milestone-based", "Progress, timeline confidence, adoption readiness"],
                ],
            },
            exercises: [
                {
                    id: "cids-comms-1",
                    title: "Update Drafting",
                    instructions: "Practice concise communication by audience.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 1-2 sentence executive update for a project at risk due to one unresolved dependency:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one delivery-team update line with a clear owner/action/date:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "implementation-brief-handoff",
            stepNumber: 5,
            title: "Implementation Brief + Handoff",
            icon: "file-text",
            explanation: `
                <h3>Turn Discovery Into a Build-Ready Brief</h3>
                <p>A strong handoff artifact aligns Product, Engineering, and Operations on scope, sequencing, risks, and validation.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Objective -> Scope -> Dependencies -> RAID -> Timeline -> Validation -> Escalation path
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "cids-brief-1",
                    title: "Brief Quality Check",
                    instructions: "Select the stronger implementation brief characteristics.",
                    items: [
                        {
                            type: "radio",
                            label: "Best brief behavior:",
                            options: [
                                {
                                    value: "operational",
                                    label: "Contains owners, dates, risks, and explicit success criteria",
                                },
                                { value: "narrative", label: "High-level narrative with no accountable fields" },
                            ],
                            expectedAnswer: "operational",
                        },
                        {
                            type: "text",
                            label: "Write one validation criterion that signals this phase is ready for delivery:",
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
                    id: "cids-cadence-concept",
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
                    id: "cids-cadence-read",
                    title: "Read Plans",
                    instructions: "Practice reading and critiquing implementation docs.",
                    items: [
                        {
                            type: "text",
                            label: "Find one project plan in this repo and identify one missing scope boundary or risk owner:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cids-cadence-write",
                    title: "Write Brief",
                    instructions: "Translate discovery into an implementation artifact.",
                    items: [
                        {
                            type: "text",
                            label: "Draft a 5-line implementation brief (objective, in-scope, out-of-scope, top risk, next milestone):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cids-cadence-debug",
                    title: "Debug Scenario",
                    instructions: "Choose the strongest recovery posture.",
                    items: [
                        {
                            type: "radio",
                            label: "If scope creep appears mid-sprint, best first move:",
                            options: [
                                {
                                    value: "rebaseline",
                                    label: "Re-baseline scope with stakeholders and document tradeoffs before adding work",
                                },
                                { value: "silent", label: "Add work silently to avoid uncomfortable conversations" },
                            ],
                            expectedAnswer: "rebaseline",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Run structured discovery and convert ambiguity into clear objectives.</li>
                    <li>Set explicit scope boundaries and deferment criteria.</li>
                    <li>Track dependencies and RAID items with owners and escalation triggers.</li>
                    <li>Communicate implementation status and risk in audience-appropriate formats.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "cids-q1",
            question: "First priority before committing timeline in discovery:",
            options: [
                { value: "a", label: "Clarify objective, constraints, and success metric" },
                { value: "b", label: "Promise date to create confidence" },
                { value: "c", label: "Start build immediately" },
            ],
            correctAnswer: "a",
            explanation: "Reliable timelines depend on validated scope and constraints.",
            topic: "discovery",
            skill: "planning",
            skillTag: "objective-first",
            difficulty: "easy",
        },
        {
            id: "cids-q2",
            question: "Best response to oversized request against fixed deadline:",
            options: [
                { value: "a", label: "Phase scope with explicit must-haves and deferrals" },
                { value: "b", label: "Accept everything and compress silently" },
                { value: "c", label: "Drop quality gates" },
            ],
            correctAnswer: "a",
            explanation: "Phasing preserves trust and delivery quality.",
            topic: "scoping",
            skill: "judgment",
            skillTag: "phase-based-delivery",
            difficulty: "medium",
        },
        {
            id: "cids-q3",
            question: "A high-impact dependency has no owner. Most effective next action:",
            options: [
                { value: "a", label: "Assign owner, due date, and escalation trigger" },
                { value: "b", label: "Track later if it becomes blocking" },
                { value: "c", label: "Assume engineering will handle it" },
            ],
            correctAnswer: "a",
            explanation: "Dependencies without accountability become predictable delays.",
            topic: "raid",
            skill: "risk-management",
            skillTag: "ownership-discipline",
            difficulty: "medium",
        },
        {
            id: "cids-q4",
            question: "Strong executive update includes:",
            options: [
                { value: "a", label: "Outcome status, top risks, decisions needed" },
                { value: "b", label: "Detailed low-level task list only" },
                { value: "c", label: "No risks until solved" },
            ],
            correctAnswer: "a",
            explanation: "Executive communication should focus on outcomes and decision support.",
            topic: "communication",
            skill: "stakeholder-management",
            skillTag: "exec-signal",
            difficulty: "easy",
        },
        {
            id: "cids-q5",
            question: "Most common failure from unclear out-of-scope boundaries:",
            options: [
                { value: "a", label: "Scope creep and hidden timeline erosion" },
                { value: "b", label: "Faster decision cycles" },
                { value: "c", label: "Lower stakeholder confusion" },
            ],
            correctAnswer: "a",
            explanation: "Undefined boundaries invite unmanaged expansion of commitments.",
            topic: "scoping",
            skill: "delivery",
            skillTag: "scope-creep-prevention",
            difficulty: "hard",
        },
    ],
};
