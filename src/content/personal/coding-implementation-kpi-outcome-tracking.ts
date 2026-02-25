import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationKpiOutcomeTrackingContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation KPI Framework + Outcome Tracking",
            icon: "bar-chart-3",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Implementation quality is proven by outcomes. KPI frameworks help teams track whether adoption and business goals are actually improving.</p>
                </div>
                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Build KPI trees from business goals to team actions</li>
                    <li>Separate leading indicators from lagging outcomes</li>
                    <li>Define metric ownership and review cadences</li>
                    <li>Turn metric movement into decisions and interventions</li>
                </ul>
            `,
            tipBox: {
                title: "Measurement Rule",
                content: "A metric is useful only if it influences a decision or action.",
            },
            exercises: [
                {
                    id: "cikot-intro-1",
                    title: "Outcome Mindset",
                    instructions: "Choose the strongest measurement perspective.",
                    items: [
                        {
                            type: "radio",
                            label: "Best indicator implementation succeeded:",
                            options: [
                                { value: "outcomes", label: "Target outcomes improved with sustainable usage" },
                                { value: "launch", label: "Project launched on date" },
                            ],
                            expectedAnswer: "outcomes",
                        },
                    ],
                },
            ],
        },
        {
            id: "kpi-tree-design",
            stepNumber: 1,
            title: "KPI Tree Design",
            icon: "git-merge",
            explanation: `
                <h3>Start from Business Goal, Then Cascade</h3>
                <p>Map top-level outcomes to supporting process and behavior indicators so teams know what to monitor weekly.</p>
            `,
            verbTable: {
                title: "KPI Tree Layers",
                headers: ["Layer", "Question", "Example"],
                rows: [
                    ["Outcome KPI", "What business result must move?", "Completion rate +15%"],
                    ["Behavior KPI", "What user behavior drives result?", "Weekly active learners"],
                    ["Process KPI", "What delivery behavior enables adoption?", "Issue resolution SLA"],
                ],
            },
            exercises: [
                {
                    id: "cikot-tree-1",
                    title: "Tree Mapping",
                    instructions: "Choose the strongest KPI mapping approach.",
                    items: [
                        {
                            type: "radio",
                            label: "Best way to select KPIs:",
                            options: [
                                { value: "cascade", label: "Cascade from business objective to behavior/process drivers" },
                                { value: "available", label: "Use whatever metrics are easiest to collect" },
                            ],
                            expectedAnswer: "cascade",
                        },
                        {
                            type: "text",
                            label: "Write one behavior KPI that could support an LMS completion-rate goal:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "leading-vs-lagging",
            stepNumber: 2,
            title: "Leading vs Lagging Indicators",
            icon: "activity",
            explanation: `
                <h3>Track Early Warnings and Final Outcomes</h3>
                <p>Lagging indicators show results after the fact. Leading indicators provide early warning so teams can intervene sooner.</p>
            `,
            exercises: [
                {
                    id: "cikot-leading-1",
                    title: "Indicator Classification",
                    instructions: "Classify each indicator correctly.",
                    items: [
                        {
                            type: "select",
                            label: "First-week activation rate",
                            options: ["Leading", "Lagging"],
                            expectedAnswer: "Leading",
                        },
                        {
                            type: "select",
                            label: "Quarterly retention outcome",
                            options: ["Leading", "Lagging"],
                            expectedAnswer: "Lagging",
                        },
                        {
                            type: "text",
                            label: "Write one leading indicator that would warn of adoption decline before quarterly outcomes drop:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "metric-specification",
            stepNumber: 3,
            title: "Metric Specification and Data Contracts",
            icon: "file-cog",
            explanation: `
                <h3>Define Metrics Precisely</h3>
                <p>Each metric needs formula, data source, ownership, refresh cadence, and interpretation guidance to avoid reporting confusion.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Metric name
Formula
Source table/API
Refresh cadence
Owner
Decision threshold
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "cikot-spec-1",
                    title: "Spec Quality",
                    instructions: "Choose the strongest metric definition pattern.",
                    items: [
                        {
                            type: "radio",
                            label: "Best metric spec style:",
                            options: [
                                { value: "explicit", label: "Formula + source + owner + threshold + cadence" },
                                { value: "name-only", label: "Metric name only" },
                            ],
                            expectedAnswer: "explicit",
                        },
                        {
                            type: "text",
                            label: "Write one decision threshold for a metric (e.g., when to escalate):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "review-cadence-and-actions",
            stepNumber: 4,
            title: "Review Cadence and Action Loops",
            icon: "refresh-cw",
            explanation: `
                <h3>Metrics Must Trigger Decisions</h3>
                <p>Run recurring metric reviews with predefined action paths so trend changes lead to concrete interventions.</p>
            `,
            verbTable: {
                title: "Review Rhythm",
                headers: ["Cadence", "Focus", "Action Output"],
                rows: [
                    ["Weekly", "Leading indicator movement", "Intervention tasks + owners"],
                    ["Monthly", "Outcome trend and segment deltas", "Scope/cadence adjustments"],
                    ["Quarterly", "Strategic impact", "Roadmap-level decisions"],
                ],
            },
            exercises: [
                {
                    id: "cikot-review-1",
                    title: "Actionable Review",
                    instructions: "Choose the strongest metric governance behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "Activation drops 18% in one segment. Best response:",
                            options: [
                                { value: "intervene", label: "Run root-cause review and assign targeted intervention owner" },
                                { value: "wait", label: "Wait for quarter-end report" },
                            ],
                            expectedAnswer: "intervene",
                        },
                        {
                            type: "text",
                            label: "Write one weekly KPI review output line with metric, insight, and owner action:",
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
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> review metrics -> write insight -> intervention scenario.</p>
            `,
            exercises: [
                {
                    id: "cikot-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence explaining why KPI trees should start from outcomes:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cikot-cadence-read",
                    title: "Read KPI",
                    instructions: "Audit one metric for decision usefulness.",
                    items: [
                        {
                            type: "text",
                            label: "Find one metric/report in this repo and identify one missing field (formula/source/owner/threshold):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cikot-cadence-write",
                    title: "Write Insight",
                    instructions: "Draft a decision-ready KPI summary.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 4-line KPI summary: trend, likely cause, risk, owner action:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "cikot-cadence-debug",
                    title: "Intervention Scenario",
                    instructions: "Choose the strongest response to KPI deterioration.",
                    items: [
                        {
                            type: "radio",
                            label: "If leading indicators worsen for 2 weeks, first move is:",
                            options: [
                                { value: "intervene", label: "Trigger predefined intervention and review impact next cycle" },
                                { value: "ignore", label: "Continue monitoring only" },
                            ],
                            expectedAnswer: "intervene",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Build KPI trees that connect business outcomes to team actions.</li>
                    <li>Use leading indicators for early risk detection and intervention.</li>
                    <li>Define metrics with clear formulas, owners, and thresholds.</li>
                    <li>Run metric reviews that produce concrete actions and accountability.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "cikot-q1",
            question: "Best first step in KPI design:",
            options: [
                { value: "a", label: "Start from business outcome objective" },
                { value: "b", label: "Start from easiest available metric" },
                { value: "c", label: "Start from dashboard design" },
            ],
            correctAnswer: "a",
            explanation: "Outcome-first design keeps measurement aligned to impact.",
            topic: "kpi-design",
            skill: "strategy",
            skillTag: "outcome-first",
            difficulty: "easy",
        },
        {
            id: "cikot-q2",
            question: "Which is a leading indicator?",
            options: [
                { value: "a", label: "First-week activation" },
                { value: "b", label: "Annual retention result" },
                { value: "c", label: "Year-end revenue" },
            ],
            correctAnswer: "a",
            explanation: "Leading indicators provide earlier signal for intervention.",
            topic: "indicators",
            skill: "analysis",
            skillTag: "leading-signal",
            difficulty: "medium",
        },
        {
            id: "cikot-q3",
            question: "Most critical missing field in a metric that cannot drive decisions:",
            options: [
                { value: "a", label: "Decision threshold and owner" },
                { value: "b", label: "Color palette" },
                { value: "c", label: "Dashboard title" },
            ],
            correctAnswer: "a",
            explanation: "Without threshold/owner, no clear action path exists.",
            topic: "metric-spec",
            skill: "governance",
            skillTag: "actionability",
            difficulty: "hard",
        },
        {
            id: "cikot-q4",
            question: "If KPI trend worsens, strongest review output is:",
            options: [
                { value: "a", label: "Owner-assigned intervention with next review checkpoint" },
                { value: "b", label: "General concern noted" },
                { value: "c", label: "Wait for quarterly trend only" },
            ],
            correctAnswer: "a",
            explanation: "Action loops convert insight into execution.",
            topic: "review-cadence",
            skill: "operations",
            skillTag: "intervention-loop",
            difficulty: "hard",
        },
        {
            id: "cikot-q5",
            question: "Why combine leading and lagging metrics?",
            options: [
                { value: "a", label: "To detect early risk and validate final outcomes" },
                { value: "b", label: "To increase reporting volume" },
                { value: "c", label: "To avoid prioritization" },
            ],
            correctAnswer: "a",
            explanation: "This combination supports both proactive and retrospective management.",
            topic: "measurement",
            skill: "systems-thinking",
            skillTag: "leading-lagging-balance",
            difficulty: "medium",
        },
    ],
};
