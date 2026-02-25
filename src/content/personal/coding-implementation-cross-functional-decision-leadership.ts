import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationCrossFunctionalDecisionLeadershipContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation Cross-Functional Decision Leadership",
            icon: "network",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Strong implementation leaders create alignment across Product, Engineering, Operations, and stakeholders without waiting for perfect consensus.</p>
                </div>
                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Frame decisions with constraints, options, and tradeoffs</li>
                    <li>Facilitate cross-functional decisions without authority friction</li>
                    <li>Resolve conflict with evidence-driven alignment</li>
                    <li>Document decisions clearly for fast execution</li>
                </ul>
            `,
            tipBox: {
                title: "Leadership Rule",
                content: "Decision quality equals clarity of objective, constraints, options, and ownership.",
            },
            exercises: [
                {
                    id: "cicfdl-intro-1",
                    title: "Decision Intent",
                    instructions: "Choose the strongest leadership posture.",
                    items: [
                        {
                            type: "radio",
                            label: "Best cross-functional leadership behavior:",
                            options: [
                                { value: "facilitate", label: "Facilitate aligned decisions with explicit tradeoffs and owners" },
                                { value: "push", label: "Push one function's preference without context" },
                            ],
                            expectedAnswer: "facilitate",
                        },
                    ],
                },
            ],
        },
        {
            id: "decision-framing",
            stepNumber: 1,
            title: "Decision Framing System",
            icon: "scan-search",
            explanation: `
                <h3>Frame Every Decision the Same Way</h3>
                <p>Use a repeatable model so stakeholders can compare options quickly and act confidently.</p>
            `,
            verbTable: {
                title: "Decision Frame",
                headers: ["Component", "Question", "Output"],
                rows: [
                    ["Objective", "What are we optimizing for?", "Clear outcome statement"],
                    ["Constraints", "What cannot change?", "Boundary list"],
                    ["Options", "What paths are available?", "Option set"],
                    ["Tradeoffs", "What do we gain/lose?", "Risk/benefit summary"],
                    ["Owner", "Who decides and executes?", "Decision + action owner"],
                ],
            },
            exercises: [
                {
                    id: "cicfdl-frame-1",
                    title: "Framing Quality",
                    instructions: "Choose the strongest decision framing move.",
                    items: [
                        {
                            type: "radio",
                            label: "Before a high-impact decision meeting, best prep is:",
                            options: [
                                { value: "structured", label: "Prepare objective/constraints/options/tradeoffs in writing" },
                                { value: "open", label: "Start discussion without framing to stay flexible" },
                            ],
                            expectedAnswer: "structured",
                        },
                        {
                            type: "text",
                            label: "Write one constraint statement for a fixed-date rollout decision:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "facilitation-without-authority",
            stepNumber: 2,
            title: "Facilitation Without Formal Authority",
            icon: "users-round",
            explanation: `
                <h3>Lead Through Process and Clarity</h3>
                <p>You do not need title authority to drive decisions. You need a trusted process, neutral framing, and follow-through.</p>
            `,
            exercises: [
                {
                    id: "cicfdl-facilitate-1",
                    title: "Facilitation Moves",
                    instructions: "Select the strongest facilitation behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "Two teams disagree on rollout scope. Best first move:",
                            options: [
                                { value: "criteria", label: "Align on decision criteria before debating options" },
                                { value: "vote", label: "Force quick vote without criteria" },
                            ],
                            expectedAnswer: "criteria",
                        },
                        {
                            type: "text",
                            label: "Write one meeting prompt that de-escalates opinion conflict into criteria discussion:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "conflict-resolution",
            stepNumber: 3,
            title: "Conflict Resolution with Evidence",
            icon: "scale",
            explanation: `
                <h3>Convert Position Conflict into Evidence Review</h3>
                <p>When functions disagree, map assumptions, test evidence, and unresolved risks before selecting direction.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Positions -> Assumptions -> Evidence -> Risks -> Decision -> Owner
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "cicfdl-conflict-1",
                    title: "Conflict Handling",
                    instructions: "Choose the strongest conflict-resolution posture.",
                    items: [
                        {
                            type: "radio",
                            label: "Product wants broader scope, Engineering flags risk. Best step:",
                            options: [
                                { value: "tradeoff", label: "Document tradeoffs and decide against agreed criteria" },
                                { value: "winner", label: "Choose whichever team is louder" },
                            ],
                            expectedAnswer: "tradeoff",
                        },
                        {
                            type: "text",
                            label: "Write one neutral sentence to capture both sides before recommending a path:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "decision-docs-and-follow-through",
            stepNumber: 4,
            title: "Decision Memos and Follow-Through",
            icon: "file-text",
            verbTable: {
                title: "RACI Template for Cross-Functional Decisions",
                headers: ["Role", "Responsible", "Accountable", "Consulted", "Informed"],
                rows: [
                    ["Product", "Scope definition", "Scope sign-off", "Tech feasibility", "Launch timeline"],
                    ["Engineering", "Build + deploy", "Technical delivery", "Scope tradeoffs", "Go-live readiness"],
                    ["Implementation", "UAT + rollout", "Adoption success", "Support readiness", "Cutover plan"],
                    ["Stakeholders", "Requirements", "Business approval", "Change impact", "Status updates"],
                ],
            },
            explanation: `
                <h3>Decision Quality Includes Execution Clarity</h3>
                <p>Every decision needs a record: chosen option, rationale, owner, timeline impact, and validation checkpoint. Use RACI (Responsible, Accountable, Consulted, Informed) to clarify roles and avoid ambiguity when cross-functional teams execute.</p>
                <p><strong>Decision log format:</strong> Date | Decision | Rationale | Owner | Validation checkpoint | Status</p>
                <p>Include Decision, Rationale, Owner, and Validation in every memo so execution owners can move immediately without re-clarifying.</p>
            `,
            comparison: {
                title: "Decision Log Format Quality",
                leftLabel: "Strong Decision Log",
                rightLabel: "Weak Decision Log",
                rows: [
                    { label: "Content", left: "Decision + rationale + owner + validation checkpoint", right: "Decision only; no context" },
                    { label: "Executability", left: "Owner knows what to do and how success is measured", right: "Ambiguous; requires follow-up" },
                    { label: "Traceability", left: "Date + status; audit trail for future reference", right: "No date; no status" },
                ],
            },
            exercises: [
                {
                    id: "cicfdl-memo-1",
                    title: "Memo Precision",
                    instructions: "Choose the strongest decision memo behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "Best decision note format:",
                            options: [
                                { value: "explicit", label: "Decision + rationale + owner + validation checkpoint" },
                                { value: "brief", label: "Decision only, no context" },
                            ],
                            expectedAnswer: "explicit",
                        },
                        {
                            type: "text",
                            label: "Write one validation checkpoint line for a cross-functional rollout decision:",
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
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> review decision doc -> write alignment note -> conflict scenario.</p>
            `,
            exercises: [
                {
                    id: "cicfdl-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence describing what makes a cross-functional decision high quality:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cicfdl-cadence-read",
                    title: "Read Decision",
                    instructions: "Audit one decision artifact for clarity.",
                    items: [
                        {
                            type: "text",
                            label: "Find one planning/decision note in this repo and identify one missing field (owner/rationale/validation):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cicfdl-cadence-write",
                    title: "Write Alignment",
                    instructions: "Draft a concise cross-functional alignment note.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 5-line decision note: objective, options, tradeoff, decision, owner:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cicfdl-cadence-debug",
                    title: "Conflict Scenario",
                    instructions: "Choose the strongest conflict response.",
                    items: [
                        {
                            type: "radio",
                            label: "If teams stay deadlocked after discussion, best next move is:",
                            options: [
                                { value: "escalate", label: "Escalate with criteria, options, and recommendation for decision owner" },
                                { value: "pause", label: "Pause indefinitely until consensus appears" },
                            ],
                            expectedAnswer: "escalate",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Frame cross-functional decisions with explicit tradeoffs.</li>
                    <li>Facilitate alignment without relying on formal authority.</li>
                    <li>Resolve conflict using assumptions/evidence/risk framing.</li>
                    <li>Document decisions so execution owners can move immediately.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "cicfdl-q1",
            question: "Best first step in cross-functional decision facilitation:",
            options: [
                { value: "a", label: "Align on objective and decision criteria" },
                { value: "b", label: "Jump to voting" },
                { value: "c", label: "Defer to loudest stakeholder" },
            ],
            correctAnswer: "a",
            explanation: "Criteria alignment reduces opinion-driven conflict.",
            topic: "facilitation",
            skill: "leadership",
            skillTag: "criteria-first",
            difficulty: "easy",
        },
        {
            id: "cicfdl-q2",
            question: "Strong decision memo must include:",
            options: [
                { value: "a", label: "Decision, rationale, owner, and validation checkpoint" },
                { value: "b", label: "Decision only" },
                { value: "c", label: "Meeting attendance" },
            ],
            correctAnswer: "a",
            explanation: "Execution quality depends on explicit ownership and validation.",
            topic: "decision-docs",
            skill: "operations",
            skillTag: "decision-memo-quality",
            difficulty: "medium",
        },
        {
            id: "cicfdl-q3",
            question: "Product vs Engineering conflict is best resolved by:",
            options: [
                { value: "a", label: "Tradeoff analysis using shared criteria and evidence" },
                { value: "b", label: "Authority pressure" },
                { value: "c", label: "Avoiding the decision" },
            ],
            correctAnswer: "a",
            explanation: "Evidence-based tradeoff framing preserves trust and pace.",
            topic: "conflict",
            skill: "judgment",
            skillTag: "tradeoff-resolution",
            difficulty: "hard",
        },
        {
            id: "cicfdl-q4",
            question: "If deadlock remains, strongest next action is:",
            options: [
                { value: "a", label: "Escalate with options and recommendation to decision owner" },
                { value: "b", label: "Wait indefinitely" },
                { value: "c", label: "Reset project scope silently" },
            ],
            correctAnswer: "a",
            explanation: "Decision flow requires explicit ownership when consensus stalls.",
            topic: "escalation",
            skill: "stakeholder-management",
            skillTag: "deadlock-resolution",
            difficulty: "hard",
        },
        {
            id: "cicfdl-q5",
            question: "Leading without authority relies most on:",
            options: [
                { value: "a", label: "Process clarity, trust, and consistent follow-through" },
                { value: "b", label: "Title-based escalation only" },
                { value: "c", label: "Avoiding conflict" },
            ],
            correctAnswer: "a",
            explanation: "Operational leadership is built through reliable facilitation and execution discipline.",
            topic: "leadership",
            skill: "influence",
            skillTag: "influence-without-authority",
            difficulty: "medium",
        },
    ],
};
