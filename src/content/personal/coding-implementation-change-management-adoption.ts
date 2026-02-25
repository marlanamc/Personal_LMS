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
                        {
                            type: "radio",
                            label: "Segmentation should be based on:",
                            options: [
                                { value: "impact", label: "Workflow impact, readiness level, and support needs" },
                                { value: "random", label: "Random grouping" },
                            ],
                            expectedAnswer: "impact",
                        },
                        {
                            type: "text",
                            label: "Map three user segments for your system (include role, adoption need, and support type):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Power users should receive:",
                            options: [
                                { value: "early", label: "Early pilot access + feedback loops + advanced workflow training" },
                                { value: "same", label: "Same training as standard users" },
                            ],
                            expectedAnswer: "early",
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
                        {
                            type: "radio",
                            label: "Launch-week messaging should focus on:",
                            options: [
                                { value: "action", label: "Clear action steps and support availability" },
                                { value: "background", label: "Background context only" },
                            ],
                            expectedAnswer: "action",
                        },
                        {
                            type: "text",
                            label: "Design a 3-wave communication plan (pre-launch, launch, post-launch) with messaging and timing:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Reinforcement communication post-launch should happen:",
                            options: [
                                { value: "weeks", label: "Weekly for 4-6 weeks to build habit and catch issues" },
                                { value: "once", label: "One summary message only" },
                            ],
                            expectedAnswer: "weeks",
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
                        {
                            type: "radio",
                            label: "Training materials should address:",
                            options: [
                                { value: "workflow", label: "Real user workflows and common failure points" },
                                { value: "feature", label: "Every feature regardless of actual user role" },
                            ],
                            expectedAnswer: "workflow",
                        },
                        {
                            type: "text",
                            label: "Design a training plan with 3+ delivery methods (live, self-paced, reference, mentoring):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Post-training validation should measure:",
                            options: [
                                { value: "workflow", label: "Can users execute critical tasks independently?" },
                                { value: "test", label: "Test score on feature knowledge" },
                            ],
                            expectedAnswer: "workflow",
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
                        {
                            type: "radio",
                            label: "When support tickets spike after launch, this means:",
                            options: [
                                { value: "signal", label: "Real friction to diagnose and fix via targeted support" },
                                { value: "complain", label: "Users just complaining; ignore and move forward" },
                            ],
                            expectedAnswer: "signal",
                        },
                        {
                            type: "text",
                            label: "Describe one anticipated resistance pattern and your diagnosis + response strategy:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "The most effective resistance response is:",
                            options: [
                                { value: "root", label: "Find root cause and remove friction" },
                                { value: "force", label: "Apply stronger mandate to force adoption" },
                            ],
                            expectedAnswer: "root",
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
                        {
                            type: "radio",
                            label: "Adoption health should be checked:",
                            options: [
                                { value: "weekly", label: "Weekly to catch issues before they cascade" },
                                { value: "monthly", label: "Monthly reviews only" },
                            ],
                            expectedAnswer: "weekly",
                        },
                        {
                            type: "text",
                            label: "Design a 3-metric dashboard for tracking adoption (specify metric, target, and escalation threshold):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When support tickets spike post-launch, this signals:",
                            options: [
                                { value: "friction", label: "User friction point that needs targeted enablement response" },
                                { value: "ignore", label: "Normal variation to ignore" },
                            ],
                            expectedAnswer: "friction",
                        },
                    ],
                },
            ],
        },
        {
            id: "training-design-principles",
            stepNumber: 6,
            title: "Training Design Principles and Delivery",
            icon: "book-open",
            explanation: `
                <h3>Good Training Is Outcome-Focused, Not Content-Focused</h3>
                <p>Training should be designed around learner goals, not feature list coverage. Use scenario-based methods that mirror real workflows.</p>

                <h3>Training Delivery Methods</h3>
                <p>Different user segments learn differently. Combine live sessions, self-paced modules, peer mentoring, and quick reference materials for maximum adoption.</p>
            `,
            verbTable: {
                title: "Training Delivery Methods by Segment and Style",
                headers: ["Method", "Best For", "Engagement Level", "Scalability"],
                rows: [
                    ["Live instructor-led", "Power users and managers who need depth and feedback", "High", "Low (resource intensive)"],
                    ["Self-paced e-learning", "Standard users with asynchronous schedules", "Medium", "High (scalable)"],
                    ["Peer mentoring/buddy system", "New users who benefit from role modeling", "High", "Medium (depends on mentors)"],
                    ["Quick reference/checklists", "All users as lookup during day-to-day work", "Low (reference only)", "High (evergreen)"],
                    ["Micro-learning (5-min videos)", "Focused skill-building and reinforcement", "Medium", "High"],
                ],
            },
            exercises: [
                {
                    id: "cicma-training-design-1",
                    title: "Training Design Decisions",
                    instructions: "Design training that drives behavior change.",
                    items: [
                        {
                            type: "radio",
                            label: "Most effective training focus is:",
                            options: [
                                { value: "outcome", label: "Learning outcomes and workflow competence by role" },
                                { value: "feature", label: "Complete feature coverage" },
                            ],
                            expectedAnswer: "outcome",
                        },
                        {
                            type: "text",
                            label: "Design a 3-part training strategy (pre-launch, launch week, post-launch):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Best training method for power users who need depth is:",
                            options: [
                                { value: "live", label: "Live instructor-led with Q&A and edge case exploration" },
                                { value: "selfpace", label: "Generic self-paced video" },
                            ],
                            expectedAnswer: "live",
                        },
                        {
                            type: "text",
                            label: "Write one learning objective for a standard user on your system (action-oriented):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "resistance-handling-playbook",
            stepNumber: 7,
            title: "Resistance Handling Playbook",
            icon: "shield-x",
            explanation: `
                <h3>Resistance Is Information, Not Opposition</h3>
                <p>Each resistance pattern signals a specific friction: unclear value, extra effort, missing support, or broken process. Diagnose and respond precisely.</p>

                <h3>The ADKAR Model for Change</h3>
                <p>Sustained adoption requires: Awareness → Desire → Knowledge → Ability → Reinforcement. Resistance often signals gaps in one of these.</p>
            `,
            verbTable: {
                title: "Resistance Patterns and Targeted Responses",
                headers: ["Resistance Pattern", "Likely Root Cause", "Diagnostic Question", "Response Strategy"],
                rows: [
                    ["Users revert to old workflow", "New process feels harder or unclear", "Is the new workflow actually easier?", "Add guardrails and role-specific reinforcement"],
                    ["Support tickets spike on one feature", "Training gap or usability friction", "Where in the workflow are users getting stuck?", "Deploy targeted micro-training and improve in-app guidance"],
                    ["Power users avoid adoption", "Unclear value or loss of flexibility", "What capabilities do they need that are missing?", "Expand to advanced workflows and empower power users"],
                    ["Manager/supervisor resistance", "Cannot see outcome impact or governance breaks", "What metrics show adoption is working?", "Share leading indicators and support manager coaching"],
                    ["Broad passive resistance", "Change culture or communication gap", "Do users understand why this change matters?", "Leadership visibility and stronger adoption narrative"],
                ],
            },
            exercises: [
                {
                    id: "cicma-playbook-1",
                    title: "Resistance Diagnosis and Response",
                    instructions: "Diagnose resistance accurately and respond with precision.",
                    items: [
                        {
                            type: "text",
                            label: "Describe a specific resistance scenario you anticipate and your diagnostic approach:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "When a user segment shows passive resistance, first move should be:",
                            options: [
                                { value: "diagnose", label: "Diagnose root cause via interview/survey, then targeted response" },
                                { value: "mandate", label: "Issue stronger mandate and require compliance" },
                            ],
                            expectedAnswer: "diagnose",
                        },
                        {
                            type: "text",
                            label: "Write one escalation trigger for adoption resistance (e.g., 'If segment X reaches Y% reversion by Z date, trigger leadership intervention'):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Resistance to change is most productively treated as:",
                            options: [
                                { value: "signal", label: "Actionable signal of friction that needs design/support response" },
                                { value: "problem", label: "User problem to overcome with stronger pushback" },
                            ],
                            expectedAnswer: "signal",
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
        {
            id: "cicma-q6",
            question: "User segmentation for adoption should be based on:",
            options: [
                { value: "a", label: "Workflow impact, readiness, and support needs" },
                { value: "b", label: "Department only" },
                { value: "c", label: "Random grouping" },
            ],
            correctAnswer: "a",
            explanation: "Different users need different adoption support based on impact and readiness.",
            topic: "segmentation",
            skill: "strategy",
            skillTag: "segment-definition",
            difficulty: "easy",
        },
        {
            id: "cicma-q7",
            question: "Power users in adoption plan should receive:",
            options: [
                { value: "a", label: "Early pilot access, feedback loops, and advanced training" },
                { value: "b", label: "Same generic training as standard users" },
                { value: "c", label: "No special treatment" },
            ],
            correctAnswer: "a",
            explanation: "Power users drive adoption through modeling and feedback if engaged early.",
            topic: "segmentation",
            skill: "delivery",
            skillTag: "power-user-enablement",
            difficulty: "medium",
        },
        {
            id: "cicma-q8",
            question: "Resistance to new workflow often signals:",
            options: [
                { value: "a", label: "Friction point in design or training that needs diagnosis" },
                { value: "b", label: "User obstinacy to override with mandate" },
                { value: "c", label: "Training failure with no solution" },
            ],
            correctAnswer: "a",
            explanation: "Resistance is diagnostic signal—diagnose root cause and remove friction.",
            topic: "resistance",
            skill: "judgment",
            skillTag: "resistance-as-signal",
            difficulty: "medium",
        },
        {
            id: "cicma-q9",
            question: "Best approach when repeat usage falls 25% post-launch:",
            options: [
                { value: "a", label: "Analyze segment-specific friction and run targeted intervention" },
                { value: "b", label: "Wait another month to see if it recovers naturally" },
                { value: "c", label: "Accept the drop as normal resistance" },
            ],
            correctAnswer: "a",
            explanation: "Early adoption drops are actionable signals; rapid diagnosis enables quick fixes.",
            topic: "metrics",
            skill: "operations",
            skillTag: "adoption-recovery",
            difficulty: "hard",
        },
        {
            id: "cicma-q10",
            question: "Pre-launch communication should focus on:",
            options: [
                { value: "a", label: "Why the change matters and how it benefits users" },
                { value: "b", label: "Technical implementation details" },
                { value: "c", label: "Only executives" },
            ],
            correctAnswer: "a",
            explanation: "Pre-launch messaging builds awareness and desire for change.",
            topic: "communication",
            skill: "stakeholder-management",
            skillTag: "pre-launch-messaging",
            difficulty: "medium",
        },
        {
            id: "cicma-q11",
            question: "Training content should be structured around:",
            options: [
                { value: "a", label: "Real user workflows and day-1 critical tasks by role" },
                { value: "b", label: "Complete feature list for every user" },
                { value: "c", label: "Instructor preference" },
            ],
            correctAnswer: "a",
            explanation: "Workflow-centered training drives competence and confidence faster.",
            topic: "training",
            skill: "design",
            skillTag: "outcome-focused-training",
            difficulty: "medium",
        },
        {
            id: "cicma-q12",
            question: "Adoption health should be reviewed:",
            options: [
                { value: "a", label: "Weekly by segment to catch and address issues early" },
                { value: "b", label: "Monthly only" },
                { value: "c", label: "Only if problems emerge" },
            ],
            correctAnswer: "a",
            explanation: "Weekly reviews enable early detection and rapid targeted response.",
            topic: "metrics",
            skill: "operations",
            skillTag: "adoption-cadence",
            difficulty: "medium",
        },
        {
            id: "cicma-q13",
            question: "When managers show resistance to change, best diagnostic is:",
            options: [
                { value: "a", label: "Interview on how new workflow impacts their outcomes and visibility" },
                { value: "b", label: "Assume they are blocking progress" },
                { value: "c", label: "Skip manager buy-in and focus on end users" },
            ],
            correctAnswer: "a",
            explanation: "Manager resistance often signals outcome/governance impact not yet addressed.",
            topic: "resistance",
            skill: "stakeholder-management",
            skillTag: "manager-enablement",
            difficulty: "hard",
        },
        {
            id: "cicma-q14",
            question: "Post-launch reinforcement communication should occur:",
            options: [
                { value: "a", label: "Weekly for 4-6 weeks to build habit and catch issues" },
                { value: "b", label: "Monthly reminder only" },
                { value: "c", label: "Only if adoption stalls" },
            ],
            correctAnswer: "a",
            explanation: "Habit formation and behavior stickiness require consistent reinforcement.",
            topic: "communication",
            skill: "delivery",
            skillTag: "reinforcement-cadence",
            difficulty: "hard",
        },
        {
            id: "cicma-q15",
            question: "The primary goal of adoption metrics tracking is:",
            options: [
                { value: "a", label: "Early detection of friction for rapid diagnosis and targeted response" },
                { value: "b", label: "Demonstrate that implementation was successful" },
                { value: "c", label: "Prove that users must comply" },
            ],
            correctAnswer: "a",
            explanation: "Metrics inform intervention and prevent small friction from becoming adoption failure.",
            topic: "metrics",
            skill: "measurement",
            skillTag: "metric-purpose",
            difficulty: "hard",
        },
    ],
};
