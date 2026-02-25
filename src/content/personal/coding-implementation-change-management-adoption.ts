import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationChangeManagementAdoptionContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation Change Management + Adoption",
            icon: "sparkles",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Implementation succeeds when people adopt the new process or product behavior, not just when features ship.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Build an adoption plan by user segment</li>
                    <li>Design communication and training rollout timelines</li>
                    <li>Identify resistance signals and mitigation tactics</li>
                    <li>Track adoption health with leading indicators</li>
                </ul>
            `,
            tipBox: {
                title: "Adoption Rule",
                content: "Feature launch is a milestone. Behavior change is the outcome.",
            },
            exercises: [
                {
                    id: "cicma-intro-1",
                    title: "Adoption Mindset",
                    instructions: "Choose the strongest implementation perspective.",
                    items: [
                        {
                            type: "radio",
                            label: "Most accurate success definition:",
                            options: [
                                { value: "behavior", label: "Users adopt target workflows with measurable outcomes" },
                                { value: "release", label: "Code deployed with no immediate errors" },
                            ],
                            expectedAnswer: "behavior",
                        },
                    ],
                },
            ],
        },
        {
            id: "segmenting-users",
            stepNumber: 1,
            title: "User Segmentation for Adoption",
            icon: "users",
            explanation: `
                <h3>Different Users Need Different Enablement</h3>
                <p>Segment users by workflow impact, readiness, and support needs. One-size rollout usually fails adoption.</p>
            `,
            verbTable: {
                title: "Segmentation Framework",
                headers: ["Segment", "Typical Need", "Adoption Support"],
                rows: [
                    ["Power users", "Early depth and edge cases", "Pilot access + feedback loops"],
                    ["Standard users", "Clear day-to-day workflow guidance", "Role-based training + quick reference"],
                    ["Managers", "Outcome visibility and governance", "Metric dashboards + escalation paths"],
                    ["Support staff", "Issue handling consistency", "Playbooks + runbook updates"],
                ],
            },
            exercises: [
                {
                    id: "cicma-segment-1",
                    title: "Segmentation Decisions",
                    instructions: "Pick the strongest segmentation approach.",
                    items: [
                        {
                            type: "radio",
                            label: "Best rollout strategy for mixed user maturity:",
                            options: [
                                { value: "tiered", label: "Tiered enablement by segment and workflow impact" },
                                { value: "single", label: "Single generic training for everyone" },
                            ],
                            expectedAnswer: "tiered",
                        },
                        {
                            type: "text",
                            label: "Write one segment definition for your LMS with a specific adoption need:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "communication-rollout-plan",
            stepNumber: 2,
            title: "Communication Rollout Plan",
            icon: "megaphone",
            explanation: `
                <h3>Communicate in Waves</h3>
                <p>Plan pre-launch, launch-week, and post-launch messages with clear calls to action and support channels.</p>
            `,
            exercises: [
                {
                    id: "cicma-comms-1",
                    title: "Rollout Messaging",
                    instructions: "Choose the best communication sequence.",
                    items: [
                        {
                            type: "radio",
                            label: "Best cadence for change communication:",
                            options: [
                                { value: "waves", label: "Pre-brief -> launch brief -> follow-up reinforcement" },
                                { value: "one", label: "Single launch-day message only" },
                            ],
                            expectedAnswer: "waves",
                        },
                        {
                            type: "text",
                            label: "Write one pre-launch message line that explains why the change matters:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "training-and-enablement",
            stepNumber: 3,
            title: "Training and Enablement Design",
            icon: "graduation-cap",
            explanation: `
                <h3>Training Should Match Real User Tasks</h3>
                <p>Design task-based training: what users do on day one, week one, and month one.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Role -> Top 3 tasks -> Common failure points -> Support material -> Validation check
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "cicma-training-1",
                    title: "Enablement Mapping",
                    instructions: "Pick the strongest training design.",
                    items: [
                        {
                            type: "radio",
                            label: "Best structure for training content:",
                            options: [
                                { value: "task", label: "Task-based by role and workflow" },
                                { value: "feature", label: "Feature list walkthrough without role context" },
                            ],
                            expectedAnswer: "task",
                        },
                        {
                            type: "text",
                            label: "Write one 'day-1 critical task' training objective for a user segment:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "resistance-and-risk-handling",
            stepNumber: 4,
            title: "Resistance and Adoption Risk Handling",
            icon: "alert-circle",
            explanation: `
                <h3>Treat Resistance as Operational Signal</h3>
                <p>Resistance usually indicates friction: unclear value, extra effort, or missing support. Diagnose and adapt quickly.</p>
            `,
            usageMeanings: [
                {
                    title: "Common resistance signals",
                    description: "What to watch and how to respond",
                    examples: [
                        {
                            sentence: "Users revert to old workflow after launch.",
                            explanation: "Add workflow guardrails and role-based reinforcement.",
                        },
                        {
                            sentence: "Support ticket volume spikes on one feature.",
                            explanation: "Targeted micro-training and clearer in-app guidance.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cicma-risk-1",
                    title: "Resistance Triage",
                    instructions: "Choose the strongest first intervention.",
                    items: [
                        {
                            type: "radio",
                            label: "Adoption stalls due to confusion on a new workflow. Best first move:",
                            options: [
                                { value: "diagnose", label: "Diagnose friction points and deploy targeted enablement" },
                                { value: "blame", label: "Assume users are resistant and wait it out" },
                            ],
                            expectedAnswer: "diagnose",
                        },
                        {
                            type: "text",
                            label: "Write one measurable trigger that indicates adoption risk is increasing:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "adoption-metrics",
            stepNumber: 5,
            title: "Adoption Metrics and Feedback Loops",
            icon: "line-chart",
            explanation: `
                <h3>Track Leading Indicators, Not Just Final Outcomes</h3>
                <p>Use activation, repeat usage, completion rates, and support signals to monitor adoption health weekly.</p>
            `,
            verbTable: {
                title: "Adoption KPI Examples",
                headers: ["Metric", "Type", "Why It Matters"],
                rows: [
                    ["First-week activation", "Leading", "Early signal of onboarding quality"],
                    ["Repeat usage rate", "Leading", "Behavior stickiness"],
                    ["Workflow completion rate", "Outcome", "End-to-end adoption impact"],
                    ["Support tickets per active user", "Risk", "Operational friction level"],
                ],
            },
            exercises: [
                {
                    id: "cicma-metrics-1",
                    title: "Metric Selection",
                    instructions: "Choose metrics that actually inform adoption decisions.",
                    items: [
                        {
                            type: "radio",
                            label: "Best early warning metric for poor adoption:",
                            options: [
                                { value: "activation", label: "Declining first-week activation by segment" },
                                { value: "followers", label: "Social media follower count" },
                            ],
                            expectedAnswer: "activation",
                        },
                        {
                            type: "text",
                            label: "Write one weekly adoption review question based on metrics:",
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
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> read rollout -> write adoption plan -> risk scenario.</p>
            `,
            exercises: [
                {
                    id: "cicma-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence explaining why launch does not equal adoption:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cicma-cadence-read",
                    title: "Read Rollout",
                    instructions: "Review rollout communication quality.",
                    items: [
                        {
                            type: "text",
                            label: "Find one rollout/update artifact in this repo and identify one missing adoption signal:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cicma-cadence-write",
                    title: "Write Plan",
                    instructions: "Draft a concise adoption plan.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 5-line adoption plan: segment, change message, training asset, metric, risk trigger:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cicma-cadence-debug",
                    title: "Risk Scenario",
                    instructions: "Choose the strongest response when adoption drops.",
                    items: [
                        {
                            type: "radio",
                            label: "If repeat usage falls 25% after launch, first move is:",
                            options: [
                                { value: "analyze", label: "Analyze segment-specific friction and run targeted intervention" },
                                { value: "ignore", label: "Wait another month without changes" },
                            ],
                            expectedAnswer: "analyze",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Design adoption plans by segment with role-appropriate support.</li>
                    <li>Build communication and training waves tied to workflow outcomes.</li>
                    <li>Use resistance signals as diagnostic input for interventions.</li>
                    <li>Track adoption health with actionable leading indicators.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "cicma-q1",
            question: "Best indicator that change management is working:",
            options: [
                { value: "a", label: "Sustained workflow adoption and completion outcomes" },
                { value: "b", label: "Launch announcement sent" },
                { value: "c", label: "No one asked questions" },
            ],
            correctAnswer: "a",
            explanation: "Adoption is measured by behavior and outcomes, not announcements.",
            topic: "adoption",
            skill: "strategy",
            skillTag: "behavior-outcome-focus",
            difficulty: "easy",
        },
        {
            id: "cicma-q2",
            question: "Most effective training model for implementation adoption:",
            options: [
                { value: "a", label: "Role/task-based enablement" },
                { value: "b", label: "Generic feature catalog" },
                { value: "c", label: "One-time slide deck only" },
            ],
            correctAnswer: "a",
            explanation: "Task-oriented enablement reduces day-to-day workflow friction.",
            topic: "training",
            skill: "delivery",
            skillTag: "task-based-enablement",
            difficulty: "medium",
        },
        {
            id: "cicma-q3",
            question: "Support tickets spike after launch. Best first response:",
            options: [
                { value: "a", label: "Diagnose workflow friction and deploy targeted support" },
                { value: "b", label: "Assume resistance and do nothing" },
                { value: "c", label: "Delay all communication" },
            ],
            correctAnswer: "a",
            explanation: "Tickets are actionable adoption signals, not noise.",
            topic: "resistance",
            skill: "triage",
            skillTag: "signal-to-intervention",
            difficulty: "hard",
        },
        {
            id: "cicma-q4",
            question: "Which is a leading indicator for adoption risk?",
            options: [
                { value: "a", label: "First-week activation rate by segment" },
                { value: "b", label: "Year-end budget forecast" },
                { value: "c", label: "Team headcount" },
            ],
            correctAnswer: "a",
            explanation: "Early activation trends reveal onboarding and usability issues quickly.",
            topic: "metrics",
            skill: "measurement",
            skillTag: "leading-indicators",
            difficulty: "medium",
        },
        {
            id: "cicma-q5",
            question: "Most effective communication cadence for major change rollout:",
            options: [
                { value: "a", label: "Pre-launch, launch, and reinforcement waves" },
                { value: "b", label: "Single launch-day blast" },
                { value: "c", label: "Only post-launch summary" },
            ],
            correctAnswer: "a",
            explanation: "Behavior change requires repeated, contextual reinforcement.",
            topic: "communication",
            skill: "stakeholder-management",
            skillTag: "wave-based-rollout",
            difficulty: "hard",
        },
    ],
};
