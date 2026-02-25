import type { InteractiveGuideContent } from "@/types/activity";

export const codingApiContractPrismaWorkflowContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "API Contract + Prisma Workflow",
            icon: "🔗",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">This guide teaches how to make backend changes safely: design API contracts deliberately, evolve Prisma schema with migration discipline, and keep seed data reliable.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Define request/response contracts that frontend can trust</li>
                    <li>Make schema and migration decisions with rollback awareness</li>
                    <li>Structure seed scripts for predictable environments</li>
                    <li>Communicate backend risk clearly in PRs and deploy notes</li>
                </ul>
            `,
            tipBox: {
                title: "Contract Rule",
                content:
                    "A stable API contract is a product surface. Treat shape changes like user-facing changes, not hidden implementation details.",
            },
            exercises: [
                {
                    id: "capw-intro-1",
                    title: "Mindset Check",
                    instructions: "Pick the strongest engineering approach.",
                    items: [
                        {
                            type: "radio",
                            label: "When adding a new API field used by UI, best default is:",
                            options: [
                                { value: "contract-first", label: "Define and document response shape before wiring UI" },
                                { value: "ad-hoc", label: "Return whatever is convenient and adjust later" },
                            ],
                            expectedAnswer: "contract-first",
                        },
                        {
                            type: "radio",
                            label: "Migrations should be treated as:",
                            options: [
                                { value: "deploy-risk", label: "Deploy-risk changes requiring validation and rollback thinking" },
                                { value: "minor", label: "Minor details that do not affect release safety" },
                            ],
                            expectedAnswer: "deploy-risk",
                        },
                    ],
                },
            ],
        },
        {
            id: "api-contract-design",
            stepNumber: 1,
            title: "API Contract Design",
            icon: "📐",
            explanation: `
                <h3>Design for Predictability, Not Convenience</h3>
                <p>Contracts should be explicit about required fields, nullable fields, status/error shape, and pagination metadata. Frontend confidence depends on consistency.</p>
            `,
            verbTable: {
                title: "Contract Essentials",
                headers: ["Area", "Good Pattern", "Risky Pattern"],
                rows: [
                    ["Success payload", "Stable object shape with explicit keys", "Conditional random keys by code path"],
                    ["Error payload", "Consistent code/message/details structure", "Plain string errors with no machine-readable code"],
                    ["Nullability", "Documented nullable fields", "Hidden null behavior discovered at runtime"],
                    ["Lists", "items + pagination metadata", "Raw array without context"],
                ],
            },
            exercises: [
                {
                    id: "capw-contract-1",
                    title: "Contract Decisions",
                    instructions: "Choose the stronger API design choice.",
                    items: [
                        {
                            type: "radio",
                            label: "For a list endpoint powering activity cards, best response shape:",
                            options: [
                                {
                                    value: "structured",
                                    label: "{ items: Activity[], total: number, page: number, pageSize: number }",
                                },
                                { value: "raw", label: "Activity[] only" },
                            ],
                            expectedAnswer: "structured",
                        },
                        {
                            type: "radio",
                            label: "For errors, best baseline:",
                            options: [
                                {
                                    value: "typed-error",
                                    label: "{ error: { code: string, message: string, details?: unknown } }",
                                },
                                { value: "string", label: "Random error strings only" },
                            ],
                            expectedAnswer: "typed-error",
                        },
                        {
                            type: "text",
                            label: "Write one contract rule that would prevent frontend null crashes:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "prisma-schema-evolution",
            stepNumber: 2,
            title: "Prisma Schema Evolution Decisions",
            icon: "🧬",
            explanation: `
                <h3>Schema Changes Need Data Transition Strategy</h3>
                <p>Adding required columns, renaming fields, and relation changes can break production data paths unless migration steps are staged.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Safe pattern for new required field:
1) Add nullable field
2) Backfill existing rows
3) Enforce required constraint in follow-up migration
</pre>
                </div>
            `,
            tipBox: {
                title: "Migration Smell",
                content:
                    "One-step 'add required column with no default on large existing table' is a common deploy failure pattern.",
            },
            exercises: [
                {
                    id: "capw-schema-1",
                    title: "Schema Safety Drill",
                    instructions: "Choose the safer migration strategy.",
                    items: [
                        {
                            type: "radio",
                            label: "Need new required `difficulty` field on existing `Activity` rows. Best rollout:",
                            options: [
                                { value: "staged", label: "Nullable -> backfill -> required" },
                                { value: "direct", label: "Add required immediately with no plan" },
                            ],
                            expectedAnswer: "staged",
                        },
                        {
                            type: "radio",
                            label: "Renaming a widely used column should include:",
                            options: [
                                {
                                    value: "compat",
                                    label: "Compatibility period or coordinated app + DB deploy plan",
                                },
                                { value: "instant", label: "Immediate rename with no app coordination" },
                            ],
                            expectedAnswer: "compat",
                        },
                    ],
                },
            ],
        },
        {
            id: "migration-deploy-workflow",
            stepNumber: 3,
            title: "Migration + Deploy Workflow",
            icon: "🚚",
            explanation: `
                <h3>Think in Pre-Deploy, Deploy, Post-Deploy Checks</h3>
                <p>Migration quality is process quality. Validate local, validate staging/prod assumptions, run deploy in correct order, and verify key routes after.</p>
            `,
            usageMeanings: [
                {
                    title: "Strong migration workflow",
                    description: "Explicit checks and order",
                    examples: [
                        {
                            sentence: "Run migration in CI/staging, verify affected API routes, then deploy app changes.",
                            explanation: "Reduces contract mismatch windows.",
                        },
                        {
                            sentence: "Capture rollback steps before production migration.",
                            explanation: "Shortens incident recovery.",
                        },
                    ],
                },
                {
                    title: "Risky migration workflow",
                    description: "Implicit assumptions",
                    examples: [
                        {
                            sentence: "Ship migration and app code together with no post-checks.",
                            explanation: "Hard to diagnose failures quickly.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "capw-migrate-1",
                    title: "Deploy Order Decisions",
                    instructions: "Choose the lower-risk sequence.",
                    items: [
                        {
                            type: "radio",
                            label: "Endpoint now expects new DB field. Safer rollout order:",
                            options: [
                                {
                                    value: "compatible",
                                    label: "Deploy backward-compatible app logic + migrate + remove old path in follow-up",
                                },
                                { value: "hard-switch", label: "Hard-switch app first, migrate later" },
                            ],
                            expectedAnswer: "compatible",
                        },
                        {
                            type: "text",
                            label: "Write one concrete post-deploy smoke check for a migration touching activity progress:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "seed-strategy-and-safety",
            stepNumber: 4,
            title: "Seed Strategy and Safety",
            icon: "🌱",
            explanation: `
                <h3>Seed Scripts Are Part of Environment Reliability</h3>
                <p>Seeds should be idempotent, deterministic, and explicit about cleanup behavior. They should not silently destroy unrelated data.</p>
            `,
            verbTable: {
                title: "Seed Script Quality",
                headers: ["Property", "Good Practice", "Failure Pattern"],
                rows: [
                    ["Idempotency", "Upsert and stable keys", "Duplicate records every run"],
                    ["Scope", "Targeted cleanup only", "Broad delete without safeguards"],
                    ["Determinism", "Consistent seeded identifiers", "Random IDs breaking references"],
                    ["Visibility", "Clear logs of created/updated records", "Silent partial failures"],
                ],
            },
            exercises: [
                {
                    id: "capw-seed-1",
                    title: "Seed Risk Scenarios",
                    instructions: "Pick the safest seed strategy per scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "Need to ensure personal activities exist in all environments. Best pattern:",
                            options: [
                                { value: "upsert", label: "Use stable IDs with upsert per activity" },
                                { value: "insert", label: "Blind insert on every run" },
                            ],
                            expectedAnswer: "upsert",
                        },
                        {
                            type: "radio",
                            label: "For cleanup, safest default:",
                            options: [
                                { value: "targeted", label: "Delete only explicit deprecated IDs" },
                                { value: "broad", label: "Delete all records in category each run" },
                            ],
                            expectedAnswer: "targeted",
                        },
                        {
                            type: "text",
                            label: "Write one logging line you would add to make seed runs easier to debug:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "rollback-and-incident-thinking",
            stepNumber: 5,
            title: "Rollback and Incident Thinking",
            icon: "🧯",
            explanation: `
                <h3>Plan Recovery Before You Need It</h3>
                <p>For any schema/API change, define rollback options upfront. Not all migrations are fully reversible, so include a mitigation path.</p>
            `,
            exercises: [
                {
                    id: "capw-rollback-1",
                    title: "Incident Triage Decisions",
                    instructions: "Select the strongest response strategy.",
                    items: [
                        {
                            type: "radio",
                            label: "Production error appears right after migration. First move:",
                            options: [
                                {
                                    value: "triage",
                                    label: "Confirm affected endpoints + compare migration/app change window + contain blast radius",
                                },
                                { value: "guess", label: "Random code edits without narrowing cause" },
                            ],
                            expectedAnswer: "triage",
                        },
                        {
                            type: "radio",
                            label: "If rollback is not cleanly possible, best mitigation:",
                            options: [
                                {
                                    value: "forward-fix",
                                    label: "Forward-fix with compatibility patch and clear incident notes",
                                },
                                { value: "hide", label: "Hide errors and wait for next sprint" },
                            ],
                            expectedAnswer: "forward-fix",
                        },
                    ],
                },
            ],
        },
        {
            id: "communicating-backend-changes",
            stepNumber: 6,
            title: "Communicating Backend Change Risk",
            icon: "🗣️",
            explanation: `
                <h3>High-Signal PR Notes for API/DB Changes</h3>
                <p>Good PRs describe contract changes, migration plan, seed impact, validation, and rollback path. This is how teams ship safely.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem;">
                    <ul style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li><strong>Contract change:</strong> what field/shape changed</li>
                        <li><strong>Migration plan:</strong> exact deploy sequence</li>
                        <li><strong>Seed impact:</strong> whether seed scripts changed</li>
                        <li><strong>Validation:</strong> commands + critical route checks</li>
                        <li><strong>Rollback/mitigation:</strong> fallback path if errors appear</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "capw-comm-1",
                    title: "PR Communication Drill",
                    instructions: "Practice concise, risk-aware communication.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence explaining a contract change for activity progress API:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one sentence describing rollback/mitigation if migration introduces null errors:",
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
                    id: "acpw-cadence-concept",
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
                    id: "acpw-cadence-read",
                    title: "Read Code",
                    instructions: "Practice code reading and explanation.",
                    items: [
                        {
                            type: "text",
                            label: "Find one existing code path in this project related to this lesson and explain what it does in 2-3 sentences:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "acpw-cadence-write",
                    title: "Write Code",
                    instructions: "Translate understanding into implementation.",
                    items: [
                        {
                            type: "text",
                            label: "Describe one small code change you would implement using this lesson's concepts and how you would validate it:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "acpw-cadence-debug",
                    title: "Debug Scenario",
                    instructions: "Choose the strongest debugging posture.",
                    items: [
                        {
                            type: "radio",
                            label: "If your change fails in review or testing, what is the best first response?",
                            options: [
                                { value: "narrow", label: "Narrow scope, reproduce, and collect evidence before additional edits" },
                                { value: "guess", label: "Apply multiple untracked changes quickly" },
                            ],
                            expectedAnswer: "narrow",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Explain this lesson's core concept clearly to another developer.</li>
                    <li>Read related project code and identify where this concept appears.</li>
                    <li>Implement a small change with a concrete validation plan.</li>
                    <li>Debug issues using a hypothesis-driven process instead of guesswork.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "capw-q1",
            question: "Which response shape is best for a paginated endpoint used by the dashboard?",
            options: [
                { value: "a", label: "{ items, total, page, pageSize }" },
                { value: "b", label: "Raw array only" },
                { value: "c", label: "Sometimes object, sometimes array" },
            ],
            correctAnswer: "a",
            explanation: "Metadata is required for predictable UI pagination behavior.",
            topic: "api-contracts",
            skill: "architecture",
            skillTag: "paginated-shape",
            difficulty: "easy",
        },
        {
            id: "capw-q2",
            question: "Safest way to introduce a new required DB field on existing data?",
            options: [
                { value: "a", label: "Add required field directly" },
                { value: "b", label: "Nullable -> backfill -> required" },
                { value: "c", label: "Skip migration and infer value at runtime" },
            ],
            correctAnswer: "b",
            explanation: "Staged transitions reduce migration failure risk.",
            topic: "migrations",
            skill: "risk-management",
            skillTag: "staged-migration",
            difficulty: "medium",
        },
        {
            id: "capw-q3",
            question: "Best seed behavior for repeated deploys:",
            options: [
                { value: "a", label: "Idempotent upserts with stable IDs" },
                { value: "b", label: "Insert new random IDs every run" },
                { value: "c", label: "Delete all rows and hope recreation works" },
            ],
            correctAnswer: "a",
            explanation: "Idempotency prevents duplicates and preserves references.",
            topic: "seeding",
            skill: "reliability",
            skillTag: "idempotent-seeds",
            difficulty: "medium",
        },
        {
            id: "capw-q4",
            question: "A migration touches a heavily used endpoint. What should be in the PR?",
            options: [
                { value: "a", label: "Only migration file name" },
                {
                    value: "b",
                    label: "Contract impact, deploy sequence, validation evidence, and mitigation plan",
                },
                { value: "c", label: "No extra notes if lint passes" },
            ],
            correctAnswer: "b",
            explanation: "Backend change safety depends on explicit risk communication.",
            topic: "communication",
            skill: "collaboration",
            skillTag: "backend-pr-notes",
            difficulty: "hard",
        },
        {
            id: "capw-q5",
            question: "Most useful first step when prod errors begin right after migration deploy:",
            options: [
                { value: "a", label: "Narrow affected endpoints and change window before editing" },
                { value: "b", label: "Refactor unrelated modules" },
                { value: "c", label: "Ignore until next release" },
            ],
            correctAnswer: "a",
            explanation: "Fast triage requires narrowing blast radius and timeline.",
            topic: "incidents",
            skill: "debugging",
            skillTag: "change-window-triage",
            difficulty: "hard",
        },
        {
            id: "capw-q6",
            question: "Why are random-seeded IDs risky in content-heavy apps?",
            options: [
                { value: "a", label: "They can break cross-table references and reproducibility" },
                { value: "b", label: "They improve migration speed" },
                { value: "c", label: "They reduce need for schema" },
            ],
            correctAnswer: "a",
            explanation: "Stable IDs support deterministic references across runs/environments.",
            topic: "seeding",
            skill: "architecture",
            skillTag: "stable-identifiers",
            difficulty: "medium",
        },
        {
            id: "capw-q7",
            question: "Best error contract baseline:",
            options: [
                { value: "a", label: "Structured code/message/details object" },
                { value: "b", label: "Only free-text messages" },
                { value: "c", label: "No error body" },
            ],
            correctAnswer: "a",
            explanation: "Structured errors enable both user-friendly and programmatic handling.",
            topic: "api-contracts",
            skill: "design",
            skillTag: "structured-errors",
            difficulty: "easy",
        },
        {
            id: "capw-q8",
            question: "A column rename breaks older app code still in production. Root process gap likely was:",
            options: [
                { value: "a", label: "No compatibility/coordinated rollout plan" },
                { value: "b", label: "Too many lint rules" },
                { value: "c", label: "Using TypeScript" },
            ],
            correctAnswer: "a",
            explanation: "Schema and app deploys must be coordinated for compatibility windows.",
            topic: "migrations",
            skill: "systems-thinking",
            skillTag: "compatibility-window",
            difficulty: "hard",
        },
        {
            id: "capw-q9",
            question: "Which cleanup strategy is safest in seed scripts?",
            options: [
                { value: "a", label: "Delete explicit deprecated IDs only" },
                { value: "b", label: "Delete all category rows every run" },
                { value: "c", label: "No logs and broad deletes" },
            ],
            correctAnswer: "a",
            explanation: "Targeted cleanup minimizes accidental data loss.",
            topic: "seeding",
            skill: "risk-management",
            skillTag: "targeted-cleanup",
            difficulty: "medium",
        },
        {
            id: "capw-q10",
            question: "Most accurate statement about migration rollback:",
            options: [
                { value: "a", label: "Not all migrations are cleanly reversible; pre-plan mitigation" },
                { value: "b", label: "All migrations can always be rolled back instantly" },
                { value: "c", label: "Rollback planning is unnecessary with Prisma" },
            ],
            correctAnswer: "a",
            explanation: "Operational safety requires both rollback and forward-fix planning.",
            topic: "deploy",
            skill: "judgment",
            skillTag: "rollback-vs-mitigation",
            difficulty: "hard",
        },
        {
            id: "capw-q11",
            question: "Strongest validation evidence for API + DB change PR:",
            options: [
                {
                    value: "a",
                    label: "Migration applied, key endpoints exercised, and response shape verified",
                },
                { value: "b", label: "One local page loaded" },
                { value: "c", label: "No checks but no immediate complaints" },
            ],
            correctAnswer: "a",
            explanation: "Validation should cover schema and contract behavior end-to-end.",
            topic: "validation",
            skill: "quality",
            skillTag: "end-to-end-contract-check",
            difficulty: "medium",
        },
        {
            id: "capw-q12",
            question: "If seed script silently skips failures, biggest downside is:",
            options: [
                { value: "a", label: "Hidden partial data state that is hard to diagnose" },
                { value: "b", label: "Faster deploys with clearer outcomes" },
                { value: "c", label: "Stronger data integrity" },
            ],
            correctAnswer: "a",
            explanation: "Silent failures destroy confidence and complicate incident response.",
            topic: "seeding",
            skill: "debugging",
            skillTag: "observability-in-seeds",
            difficulty: "medium",
        },
    ],
};
