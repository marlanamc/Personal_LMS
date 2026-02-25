import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationUatDefectTriageContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Implementation UAT Leadership + Defect Triage",
            icon: "clipboard-check",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">UAT is where plans meet real-world behavior. Strong UAT leadership prevents late surprises and creates confident launch decisions.</p>
                </div>
                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Design UAT plans tied to real workflows</li>
                    <li>Set clear acceptance and sign-off criteria</li>
                    <li>Triage defects by impact and launch risk</li>
                    <li>Run decision-ready UAT summaries for stakeholders</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ciudt-intro-1",
                    title: "UAT Intent",
                    instructions: "Choose the strongest UAT principle.",
                    items: [
                        {
                            type: "radio",
                            label: "Best goal of UAT:",
                            options: [
                                { value: "confidence", label: "Validate business workflows and launch confidence" },
                                { value: "qa-only", label: "Duplicate unit tests manually" },
                            ],
                            expectedAnswer: "confidence",
                        },
                    ],
                },
            ],
        },
        {
            id: "uat-plan-design",
            stepNumber: 1,
            title: "UAT Plan Design",
            icon: "layout-list",
            explanation: `
                <h3>Build UAT Around User-Critical Flows</h3>
                <p>Define scenarios by role and business impact, not by component lists alone.</p>
            `,
            verbTable: {
                title: "UAT Plan Core Fields",
                headers: ["Field", "Question", "Output"],
                rows: [
                    ["User role", "Who performs this workflow?", "Persona + owner"],
                    ["Scenario", "What must succeed end-to-end?", "Test flow"],
                    ["Expected result", "What counts as success?", "Acceptance criteria"],
                    ["Evidence", "How do we verify outcome?", "Proof artifact"],
                ],
            },
            exercises: [
                {
                    id: "ciudt-plan-1",
                    title: "Plan Quality",
                    instructions: "Pick the better UAT design move.",
                    items: [
                        {
                            type: "radio",
                            label: "Best UAT coverage strategy:",
                            options: [
                                { value: "workflow", label: "Prioritize high-impact user workflows" },
                                { value: "ui-tour", label: "Click every screen once" },
                            ],
                            expectedAnswer: "workflow",
                        },
                        {
                            type: "text",
                            label: "Write one UAT scenario for a critical LMS learning flow:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "acceptance-signoff",
            stepNumber: 2,
            title: "Acceptance Criteria and Sign-Off",
            icon: "check-square",
            explanation: `
                <h3>Sign-Off Must Be Criteria-Driven</h3>
                <p>Define pass/fail gates before testing starts so launch decisions are objective.</p>
            `,
            exercises: [
                {
                    id: "ciudt-signoff-1",
                    title: "Gate Decisions",
                    instructions: "Choose the strongest sign-off policy.",
                    items: [
                        {
                            type: "radio",
                            label: "Best sign-off baseline:",
                            options: [
                                { value: "gated", label: "All P0/P1 scenarios pass; open defects meet explicit risk threshold" },
                                { value: "general", label: "Team feels mostly good" },
                            ],
                            expectedAnswer: "gated",
                        },
                        {
                            type: "text",
                            label: "Write one acceptance criterion for activity filtering behavior:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "defect-severity-priority",
            stepNumber: 3,
            title: "Defect Severity and Priority Model",
            icon: "bug",
            explanation: `
                <h3>Classify Defects by User Impact and Launch Risk</h3>
                <p>Severity is impact; priority is when to fix. Keep these distinct for cleaner decisions.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
P0: launch blocker
P1: major workflow risk
P2: moderate impact, workaround exists
P3: low impact polish
</pre>
                </div>
            `,
            exercises: [
                {
                    id: "ciudt-defect-1",
                    title: "Defect Classification",
                    instructions: "Classify severity/priority accurately.",
                    items: [
                        {
                            type: "radio",
                            label: "User cannot submit assignment in core path. Best classification:",
                            options: [
                                { value: "p0", label: "P0 launch blocker" },
                                { value: "p3", label: "P3 cosmetic issue" },
                            ],
                            expectedAnswer: "p0",
                        },
                        {
                            type: "text",
                            label: "Write one rule to distinguish P1 from P2 defects:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "triage-ritual",
            stepNumber: 4,
            title: "Defect Triage Ritual and SLA",
            icon: "timer",
            explanation: `
                <h3>Run Triage as a Fast Decision Loop</h3>
                <p>Set a recurring triage with engineering + product + implementation ownership and clear SLAs by severity.</p>
            `,
            verbTable: {
                title: "Triage Cadence",
                headers: ["Severity", "Triage SLA", "Decision Expectation"],
                rows: [
                    ["P0", "Same-day", "Contain + owner + patch plan"],
                    ["P1", "24h", "Fix window + launch risk impact"],
                    ["P2/P3", "Weekly batch", "Prioritize against roadmap"],
                ],
            },
            exercises: [
                {
                    id: "ciudt-triage-1",
                    title: "Triage Operations",
                    instructions: "Choose the strongest triage behavior.",
                    items: [
                        {
                            type: "radio",
                            label: "A P0 defect appears during UAT. First move:",
                            options: [
                                { value: "contain", label: "Contain impact and assign immediate owner + ETA" },
                                { value: "queue", label: "Add to next weekly meeting" },
                            ],
                            expectedAnswer: "contain",
                        },
                        {
                            type: "text",
                            label: "Write one triage meeting output line with owner, SLA, and next checkpoint:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "uat-reporting",
            stepNumber: 5,
            title: "UAT Reporting for Launch Decisions",
            icon: "file-chart-column",
            explanation: `
                <h3>Report Launch Readiness, Not Raw Defect Lists</h3>
                <p>Stakeholders need scenario pass rate, open risk posture, and recommendation (go, conditional go, no-go).</p>
            `,
            exercises: [
                {
                    id: "ciudt-report-1",
                    title: "Readiness Recommendation",
                    instructions: "Practice clear launch recommendations.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 2-sentence conditional-go recommendation with one mitigation requirement:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Best UAT summary format:",
                            options: [
                                { value: "decision", label: "Pass rates + open risk + recommendation + next action" },
                                { value: "dump", label: "Unstructured defect dump" },
                            ],
                            expectedAnswer: "decision",
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
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> review UAT plan -> write triage note -> launch decision scenario.</p>
            `,
            exercises: [
                {
                    id: "ciudt-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence explaining why severity and priority are not the same:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "ciudt-cadence-read",
                    title: "Read UAT",
                    instructions: "Audit a UAT artifact for decision readiness.",
                    items: [
                        {
                            type: "text",
                            label: "Find one testing artifact in this repo and identify one missing acceptance gate:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "ciudt-cadence-write",
                    title: "Write Triage",
                    instructions: "Write an actionable defect triage update.",
                    items: [
                        {
                            type: "text",
                            label: "Draft a 4-line triage note: defect, severity, owner, SLA/ETA:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "ciudt-cadence-debug",
                    title: "Launch Scenario",
                    instructions: "Choose the strongest go/no-go response.",
                    items: [
                        {
                            type: "radio",
                            label: "If one P0 remains unresolved near launch, best recommendation is:",
                            options: [
                                { value: "no-go", label: "No-go or conditional-go only with explicit containment accepted by owners" },
                                { value: "go", label: "Go-live anyway and patch later" },
                            ],
                            expectedAnswer: "no-go",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Design UAT plans tied to business-critical workflows.</li>
                    <li>Set clear acceptance and sign-off gates for launch readiness.</li>
                    <li>Classify and triage defects with impact-aware discipline.</li>
                    <li>Deliver launch recommendations with risk context and mitigation paths.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "ciudt-q1",
            question: "Primary purpose of UAT in implementation delivery:",
            options: [
                { value: "a", label: "Validate real user workflows and launch readiness" },
                { value: "b", label: "Replace all automated testing" },
                { value: "c", label: "Generate more tickets" },
            ],
            correctAnswer: "a",
            explanation: "UAT confirms business use-case readiness under realistic conditions.",
            topic: "uat",
            skill: "delivery",
            skillTag: "workflow-validation",
            difficulty: "easy",
        },
        {
            id: "ciudt-q2",
            question: "Severity is best defined as:",
            options: [
                { value: "a", label: "User/business impact of defect" },
                { value: "b", label: "How loud the reporter is" },
                { value: "c", label: "Developer preference" },
            ],
            correctAnswer: "a",
            explanation: "Severity reflects impact; priority reflects scheduling urgency.",
            topic: "triage",
            skill: "risk-management",
            skillTag: "severity-definition",
            difficulty: "medium",
        },
        {
            id: "ciudt-q3",
            question: "A core submission flow is broken with no workaround. Correct class:",
            options: [
                { value: "a", label: "P0 blocker" },
                { value: "b", label: "P2" },
                { value: "c", label: "P3" },
            ],
            correctAnswer: "a",
            explanation: "Core flow break with no workaround is launch-blocking.",
            topic: "triage",
            skill: "judgment",
            skillTag: "blocker-classification",
            difficulty: "hard",
        },
        {
            id: "ciudt-q4",
            question: "Best UAT sign-off gate:",
            options: [
                { value: "a", label: "Explicit pass criteria with open-risk thresholds" },
                { value: "b", label: "Team confidence only" },
                { value: "c", label: "No formal gate needed" },
            ],
            correctAnswer: "a",
            explanation: "Objective gates reduce bias in launch decisions.",
            topic: "acceptance",
            skill: "governance",
            skillTag: "gated-signoff",
            difficulty: "medium",
        },
        {
            id: "ciudt-q5",
            question: "Most useful UAT summary for stakeholders:",
            options: [
                { value: "a", label: "Scenario pass rate, open risks, recommendation, next actions" },
                { value: "b", label: "Raw ticket list only" },
                { value: "c", label: "Generic positivity statement" },
            ],
            correctAnswer: "a",
            explanation: "Decision-oriented summaries improve launch clarity and accountability.",
            topic: "reporting",
            skill: "communication",
            skillTag: "launch-readiness-summary",
            difficulty: "hard",
        },
    ],
};
