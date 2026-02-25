import type { InteractiveGuideContent } from "@/types/activity";

export const codingImplementationDiscoveryScopingContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Implementation Discovery + Scoping Discipline",
            icon: "🗺️",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">Strong implementation starts before build work begins. The difference between successful and failed projects is rarely technical skill—it's the quality of discovery. When you clarify objectives, constraints, scope boundaries, dependencies, and escalation conditions <em>before</em> committing to timelines, you transform ambiguity into actionable plans that teams can actually deliver.</p>
                </div>

                <h3>Why Discovery Matters More Than You Think</h3>
                <p>Most implementation failures trace back to discovery gaps. A stakeholder says "we need this feature" and teams jump straight to building. Three weeks later, everyone realizes they had different definitions of "this feature." Discovery prevents these costly surprises by surfacing assumptions, aligning expectations, and documenting what success actually looks like.</p>

                <p>Implementation specialists who master discovery become invaluable because they prevent entire categories of problems that other teams repeatedly stumble into.</p>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Run discovery using repeatable intake questions that de-risk delivery</li>
                    <li>Turn ambiguous requests into scoped, testable implementation plans</li>
                    <li>Define out-of-scope boundaries and identify decision owners</li>
                    <li>Map dependencies and risks before they become blockers</li>
                    <li>Prepare handoff artifacts that keep cross-functional teams aligned</li>
                    <li>Detect and prevent scope creep using documented boundaries</li>
                </ul>
            `,
            tipBox: {
                title: "Execution Principle",
                content:
                    "Unclear scope creates hidden risk. A single hour of discovery often saves 20+ hours of rework. Clarify success criteria and boundaries before discussing delivery dates.",
            },
            exercises: [
                {
                    id: "cids-intro-1",
                    title: "Discovery Mindset",
                    instructions: "Choose the strongest response for each scenario.",
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
                        {
                            type: "radio",
                            label: "A feature request arrives with no success metrics. You should:",
                            options: [
                                {
                                    value: "ask",
                                    label: "Ask 'What does success look like? How will we measure it?'",
                                },
                                { value: "assume", label: "Assume you know what they want and start building" },
                            ],
                            expectedAnswer: "ask",
                        },
                        {
                            type: "radio",
                            label: "Discovery feels like it's slowing down the project. In reality:",
                            options: [
                                {
                                    value: "prevents",
                                    label: "Discovery prevents larger delays from rework and misalignment",
                                },
                                { value: "waste", label: "Discovery is overhead that should be minimized" },
                            ],
                            expectedAnswer: "prevents",
                        },
                        {
                            type: "text",
                            label: "In your own words, why might skipping discovery lead to project failure?",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 1: Discovery Intake Framework
        {
            id: "discovery-intake",
            stepNumber: 1,
            title: "Discovery Intake Framework",
            icon: "📋",
            explanation: `
                <h3>Ask Questions That De-Risk Delivery</h3>
                <p>Effective discovery uses a structured intake process that transforms aspirational requirements into operational specifications. Without structured questions, stakeholders share what they <em>think</em> is important, which often misses critical constraints and dependencies that will derail delivery later.</p>

                <p>The goal is not just to gather information—it's to surface hidden assumptions, identify missing stakeholders, and establish shared definitions of success that everyone can reference throughout implementation.</p>

                <h3>The Five Intake Categories</h3>
                <p>Every implementation needs answers in these five areas before meaningful planning can begin. Missing any category creates blind spots that become expensive surprises.</p>
            `,
            verbTable: {
                title: "Discovery Intake Categories",
                headers: ["Category", "Key Question", "What You Get"],
                rows: [
                    ["Business Objective", "What outcome should improve? By how much?", "Success metric + baseline + target"],
                    ["User Impact", "Who is affected? What changes for them?", "Primary user scenarios + adoption requirements"],
                    ["Constraints", "What technical, compliance, or budget limits exist?", "Non-negotiable boundaries + workaround options"],
                    ["Timeline", "What date is fixed? Why that date specifically?", "Milestone assumptions + external dependencies"],
                    ["Ownership", "Who decides priority tradeoffs? Who approves scope changes?", "Decision owner map + escalation path"],
                ],
            },
            usageMeanings: [
                {
                    title: "📊 Business Objective Questions",
                    description: "Uncover what success actually looks like in measurable terms",
                    examples: [
                        {
                            sentence: "What metric will change if this implementation succeeds?",
                            explanation: "Forces stakeholders to think beyond 'we want this feature' to actual outcomes.",
                        },
                        {
                            sentence: "What is the current baseline? What is the target?",
                            explanation: "Establishes measurable before/after so you can validate success.",
                        },
                        {
                            sentence: "How will we know if the implementation failed?",
                            explanation: "Defines failure conditions, which often reveals unstated success criteria.",
                        },
                    ],
                },
                {
                    title: "👥 User Impact Questions",
                    description: "Understand who changes behavior and how",
                    examples: [
                        {
                            sentence: "Walk me through a day in the life of the user before and after this change.",
                            explanation: "Reveals workflow impacts that feature descriptions miss.",
                        },
                        {
                            sentence: "Who needs training? What does adoption look like?",
                            explanation: "Surfaces change management requirements that often get forgotten.",
                        },
                    ],
                },
                {
                    title: "⚠️ Constraint Questions",
                    description: "Find the walls you cannot move",
                    examples: [
                        {
                            sentence: "What technical systems must integrate? Any we cannot modify?",
                            explanation: "Reveals API dependencies and legacy system constraints.",
                        },
                        {
                            sentence: "Are there compliance, security, or legal requirements?",
                            explanation: "Uncovers requirements that are non-negotiable regardless of timeline.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "Pro Tip: The 'Why' Follow-up",
                content:
                    "When a stakeholder gives an answer, ask 'Why is that important?' at least once. The first answer is often a symptom; the follow-up reveals the actual need.",
            },
            exercises: [
                {
                    id: "cids-intake-1",
                    title: "Intake Quality",
                    instructions: "Pick the best discovery question or approach for each scenario.",
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
                            type: "radio",
                            label: "A stakeholder says 'make it faster.' Best follow-up:",
                            options: [
                                { value: "specific", label: "What specific action is too slow? What's acceptable response time?" },
                                { value: "general", label: "Okay, we'll optimize everything" },
                            ],
                            expectedAnswer: "specific",
                        },
                        {
                            type: "radio",
                            label: "To uncover hidden dependencies, ask:",
                            options: [
                                { value: "dependencies", label: "What other teams or systems does this touch? Who owns them?" },
                                { value: "ignore", label: "We'll figure out dependencies during build" },
                            ],
                            expectedAnswer: "dependencies",
                        },
                        {
                            type: "text",
                            label: "Write one discovery question that uncovers hidden dependency risk:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write a question to identify who has final approval authority on scope changes:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 2: Scope Definition and Boundaries
        {
            id: "scope-definition",
            stepNumber: 2,
            title: "Scope Definition and Boundaries",
            icon: "🎯",
            explanation: `
                <h3>Define In-Scope, Out-of-Scope, and Deferred</h3>
                <p>Implementation plans fail when everything stays "possible." Without explicit boundaries, stakeholders assume their preferred features are included, teams make different assumptions about what "done" means, and scope expands invisibly until timelines collapse.</p>

                <p>Strong scope definition creates three explicit categories: what we <strong>will</strong> deliver, what we <strong>will not</strong> deliver, and what we <strong>might deliver later</strong> under specific conditions.</p>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">✅ In Scope</h4>
                        <p style="margin: 0.5rem 0; font-size: 0.95rem;">Must-have deliverables for current phase</p>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">Committed work with acceptance criteria</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">❌ Out of Scope</h4>
                        <p style="margin: 0.5rem 0; font-size: 0.95rem;">Explicitly excluded from this work</p>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">Prevents assumption-driven creep</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">⏸️ Deferred</h4>
                        <p style="margin: 0.5rem 0; font-size: 0.95rem;">Next-phase candidates</p>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">With trigger criteria for inclusion</p>
                    </div>
                </div>

                <h3>The Scope Statement Formula</h3>
                <p>Every scope statement should follow this structure to ensure completeness:</p>
            `,
            formula: [
                { text: "Objective", type: "subject" },
                { text: "+", type: "other" },
                { text: "Constraints", type: "verb" },
                { text: "+", type: "other" },
                { text: "Must-haves", type: "subject" },
                { text: "+", type: "other" },
                { text: "Deferrals", type: "verb" },
                { text: "+", type: "other" },
                { text: "Success Criteria", type: "object" },
            ],
            comparison: {
                title: "Scope Boundary Examples",
                leftLabel: "In Scope (Phase 1)",
                rightLabel: "Out of Scope / Deferred",
                rows: [
                    {
                        label: "User Authentication",
                        left: "Email/password login, password reset flow",
                        right: "SSO integration (deferred to Phase 2 if adoption > 80%)",
                    },
                    {
                        label: "Reporting",
                        left: "3 core reports with CSV export",
                        right: "Custom report builder (out of scope this release)",
                    },
                    {
                        label: "Mobile Support",
                        left: "Responsive web design",
                        right: "Native mobile app (deferred pending user research)",
                    },
                    {
                        label: "Integrations",
                        left: "Salesforce sync for contacts",
                        right: "Slack notifications (deferred, evaluate at Phase 2)",
                    },
                ],
            },
            exercises: [
                {
                    id: "cids-scope-1",
                    title: "Boundary Decisions",
                    instructions: "Choose the best scoping approach for each scenario.",
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
                            type: "radio",
                            label: "A feature is 'nice to have' but unclear if needed. Best categorization:",
                            options: [
                                { value: "deferred", label: "Deferred with trigger criteria (e.g., 'if user research shows demand')" },
                                { value: "inscope", label: "In scope because stakeholder mentioned it" },
                            ],
                            expectedAnswer: "deferred",
                        },
                        {
                            type: "radio",
                            label: "The scope document should be:",
                            options: [
                                { value: "written", label: "Written, shared with all stakeholders, and versioned" },
                                { value: "verbal", label: "Discussed verbally in meetings" },
                            ],
                            expectedAnswer: "written",
                        },
                        {
                            type: "text",
                            label: "Write one explicit out-of-scope statement for a first-phase rollout:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write a deferred item with a trigger condition for when it should be reconsidered:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 3: Requirement Validation Techniques (NEW)
        {
            id: "requirement-validation",
            stepNumber: 3,
            title: "Requirement Validation Techniques",
            icon: "🔍",
            explanation: `
                <h3>Validate Before You Build</h3>
                <p>Requirements that sound clear in meetings often hide ambiguity, contradictions, or impossible expectations. Validation techniques help you catch these issues during discovery—when they're cheap to fix—rather than during build, when changes are expensive.</p>

                <p>The goal of validation is not to challenge stakeholders, but to ensure everyone shares the same understanding of what will be built and why.</p>

                <h3>The Validation Toolkit</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1.25rem; border-radius: 0.75rem;">
                        <h4 style="margin-top: 0; color: #0369a1;">📝 Paraphrase Back</h4>
                        <p style="margin: 0; font-size: 0.95rem;">"So what I'm hearing is... [restate]. Is that accurate?"</p>
                    </div>
                    <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1.25rem; border-radius: 0.75rem;">
                        <h4 style="margin-top: 0; color: #0369a1;">🎭 Scenario Testing</h4>
                        <p style="margin: 0; font-size: 0.95rem;">"What happens when [edge case]? How should the system respond?"</p>
                    </div>
                    <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1.25rem; border-radius: 0.75rem;">
                        <h4 style="margin-top: 0; color: #0369a1;">⚖️ Priority Forcing</h4>
                        <p style="margin: 0; font-size: 0.95rem;">"If we can only do A or B, not both, which is more critical?"</p>
                    </div>
                    <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1.25rem; border-radius: 0.75rem;">
                        <h4 style="margin-top: 0; color: #0369a1;">🔄 Contradiction Check</h4>
                        <p style="margin: 0; font-size: 0.95rem;">"Earlier you mentioned X, but now we're discussing Y. How do these relate?"</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🚨 Common Validation Failures",
                    description: "Patterns that indicate requirements need more work",
                    examples: [
                        {
                            sentence: "Stakeholder says 'make it easy to use' with no specific criteria",
                            explanation: "Vague quality requirements need concrete acceptance criteria. Ask: 'What would users say if it's easy enough?'",
                        },
                        {
                            sentence: "Two stakeholders give contradictory priorities",
                            explanation: "Surface the conflict now, not during build. Ask: 'Let's align on which is primary.'",
                        },
                        {
                            sentence: "Requirements reference undefined terms ('the dashboard', 'the report')",
                            explanation: "Create shared definitions document. Ask: 'When you say dashboard, what specific views do you mean?'",
                        },
                    ],
                },
                {
                    title: "✅ Validation Success Signals",
                    description: "How to know requirements are solid",
                    examples: [
                        {
                            sentence: "Stakeholders can answer 'how will we know this is done?' with specifics",
                            explanation: "Clear acceptance criteria exist.",
                        },
                        {
                            sentence: "Edge cases have documented expected behavior",
                            explanation: "Team won't need to guess during implementation.",
                        },
                        {
                            sentence: "Priorities are stack-ranked, not all 'high priority'",
                            explanation: "Tradeoff decisions can be made without escalation.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cids-validate-1",
                    title: "Validation Practice",
                    instructions: "Choose the best validation approach for each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "A stakeholder says 'users should be able to search easily.' Validate by:",
                            options: [
                                { value: "specific", label: "Ask for specific search scenarios and acceptable response times" },
                                { value: "accept", label: "Accept 'easily' as sufficient guidance" },
                            ],
                            expectedAnswer: "specific",
                        },
                        {
                            type: "radio",
                            label: "Two departments have different definitions of 'customer.' You should:",
                            options: [
                                { value: "align", label: "Create a shared definition document and align both departments" },
                                { value: "pick", label: "Pick one definition and hope the other department adapts" },
                            ],
                            expectedAnswer: "align",
                        },
                        {
                            type: "radio",
                            label: "All 10 features are marked 'high priority.' Best response:",
                            options: [
                                { value: "force", label: "Force stack ranking: 'If we can only ship 5, which 5?'" },
                                { value: "all", label: "Accept all as high priority and try to deliver everything" },
                            ],
                            expectedAnswer: "force",
                        },
                        {
                            type: "text",
                            label: "Write a paraphrase-back statement to confirm you understand a complex requirement:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write an edge-case question to test a 'user login' requirement:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 4: Dependency Mapping + RAID
        {
            id: "dependency-and-raid-mapping",
            stepNumber: 4,
            title: "Dependency Mapping + RAID Basics",
            icon: "🔗",
            explanation: `
                <h3>Map Risks Before They Trigger Delays</h3>
                <p>Every implementation depends on other teams, systems, decisions, or inputs. When these dependencies are untracked, they become surprise blockers that derail timelines. RAID (Risks, Assumptions, Issues, Dependencies) tracking transforms reactive firefighting into proactive planning.</p>

                <p>The goal is not to eliminate all risk—that's impossible. The goal is to know what risks exist, who owns them, and what you'll do if they materialize.</p>

                <h3>RAID Category Definitions</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">🎲 Risks</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Potential future problems. Might happen. Track probability, impact, and mitigation plan.</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">📋 Assumptions</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Things we believe are true but haven't verified. Can become risks if wrong.</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">🚧 Issues</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Current problems that exist right now. Need active resolution, not monitoring.</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">🔗 Dependencies</h4>
                        <p style="margin: 0; font-size: 0.95rem;">External inputs required. Other teams, systems, or decisions we're waiting on.</p>
                    </div>
                </div>
            `,
            verbTable: {
                title: "RAID Log Structure",
                headers: ["Field", "Description", "Example"],
                rows: [
                    ["ID", "Unique identifier for tracking", "R-001, D-003"],
                    ["Description", "Clear statement of the item", "API v2 may not be ready by launch date"],
                    ["Category", "Risk, Assumption, Issue, or Dependency", "Risk"],
                    ["Probability", "Likelihood (High/Medium/Low)", "Medium"],
                    ["Impact", "Consequence if it occurs (High/Medium/Low)", "High"],
                    ["Owner", "Person accountable for tracking/resolving", "Sarah (Platform Team Lead)"],
                    ["Mitigation/Action", "What we'll do about it", "Fallback to v1 API + compatibility layer"],
                    ["Due Date", "When action/decision is needed by", "March 15"],
                    ["Escalation Trigger", "When to escalate to leadership", "If no v2 ETA by March 10"],
                    ["Status", "Open, In Progress, Resolved, Closed", "Open"],
                ],
            },
            usageMeanings: [
                {
                    title: "📍 Dependency Tracking Best Practices",
                    description: "How to manage dependencies effectively",
                    examples: [
                        {
                            sentence: "Dependency: Design team mockups needed by Feb 20. Owner: Lisa. Fallback: Use wireframes.",
                            explanation: "Clear owner, date, and fallback if dependency slips.",
                        },
                        {
                            sentence: "Dependency: Legal approval for data handling. Escalation: If no response by Day 10, VP escalation.",
                            explanation: "Escalation path prevents indefinite waiting.",
                        },
                    ],
                },
                {
                    title: "🚨 Risk Tracking Best Practices",
                    description: "How to make risks actionable",
                    examples: [
                        {
                            sentence: "Risk: Third-party API rate limits may cause performance issues. Probability: Medium. Impact: High. Mitigation: Implement caching layer before launch.",
                            explanation: "Probability + Impact + Mitigation makes risk actionable, not abstract.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cids-raid-1",
                    title: "RAID Prioritization",
                    instructions: "Choose the strongest tracking behavior for each scenario.",
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
                            type: "radio",
                            label: "An assumption says 'users will have modern browsers.' How to validate:",
                            options: [
                                { value: "check", label: "Check analytics data and document actual browser distribution" },
                                { value: "hope", label: "Assume it's true and proceed" },
                            ],
                            expectedAnswer: "check",
                        },
                        {
                            type: "radio",
                            label: "A risk has no mitigation plan documented. You should:",
                            options: [
                                { value: "add", label: "Add a mitigation plan or accept-and-monitor decision" },
                                { value: "ignore", label: "Risks don't need mitigation until they happen" },
                            ],
                            expectedAnswer: "add",
                        },
                        {
                            type: "text",
                            label: "Write one escalation trigger condition for a critical dependency:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write a risk entry with probability, impact, and mitigation:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 5: Scope Creep Detection + Prevention (NEW)
        {
            id: "scope-creep-prevention",
            stepNumber: 5,
            title: "Scope Creep Detection + Prevention",
            icon: "🛡️",
            explanation: `
                <h3>Scope Creep: The Silent Project Killer</h3>
                <p>Scope creep happens when project boundaries expand without corresponding adjustments to timeline, resources, or explicit approval. It rarely happens through one big change—it accumulates through many small "just add this" requests that seem harmless individually but devastate delivery collectively.</p>

                <p>Prevention requires both detection systems (recognizing creep when it starts) and response protocols (what to do when it's detected).</p>

                <h3>The Creep Detection Decision Tree</h3>
                <div class="diagram-surface-light" style="background: #f8fafc; border: 2px solid rgba(148, 163, 184, 0.45); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0;">
                    <div style="font-family: monospace; font-size: 0.95rem; line-height: 1.8;">
                        <p style="margin: 0;"><strong>New request arrives →</strong></p>
                        <p style="margin: 0 0 0 1.5rem;">├── Is it in the scope document? → <span style="color: #22c55e;">✅ Proceed</span></p>
                        <p style="margin: 0 0 0 1.5rem;">├── Is it explicitly out of scope? → <span style="color: #ef4444;">❌ Decline with reference to scope doc</span></p>
                        <p style="margin: 0 0 0 1.5rem;">└── It's ambiguous → <strong>Scope Change Process:</strong></p>
                        <p style="margin: 0 0 0 3rem;">├── Document the request formally</p>
                        <p style="margin: 0 0 0 3rem;">├── Assess impact on timeline/resources</p>
                        <p style="margin: 0 0 0 3rem;">├── Get decision owner approval</p>
                        <p style="margin: 0 0 0 3rem;">└── Update scope document + communicate change</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🚨 Scope Creep Warning Signs",
                    description: "Red flags that creep is happening",
                    examples: [
                        {
                            sentence: "'Can we just add...' or 'While you're in there, could you...'",
                            explanation: "Small additions that bypass formal scope review.",
                        },
                        {
                            sentence: "Requirements changing without timeline discussion",
                            explanation: "Scope expanding without resource adjustment.",
                        },
                        {
                            sentence: "Multiple stakeholders adding requests directly to the team",
                            explanation: "No single point of scope control.",
                        },
                        {
                            sentence: "Sprint velocity dropping without explanation",
                            explanation: "Hidden work consuming capacity.",
                        },
                    ],
                },
                {
                    title: "✅ Healthy Scope Change Process",
                    description: "How to handle legitimate scope changes",
                    examples: [
                        {
                            sentence: "Request → Impact Assessment → Decision Owner Approval → Timeline Adjustment → Documentation",
                            explanation: "Changes are possible but must follow the process.",
                        },
                        {
                            sentence: "Trade-off conversation: 'We can add X if we remove Y or extend by 2 weeks'",
                            explanation: "Scope changes require resource/timeline adjustments.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "The Scope Document is Your Shield",
                content:
                    "When you document scope clearly upfront, you can reference it when creep attempts happen: 'That's a great idea—it's currently listed as deferred. Here's the process to evaluate adding it to this phase.'",
            },
            exercises: [
                {
                    id: "cids-creep-1",
                    title: "Scope Creep Response",
                    instructions: "Choose the best response to potential scope creep.",
                    items: [
                        {
                            type: "radio",
                            label: "A stakeholder says 'can we just add one more field to the form?' Best response:",
                            options: [
                                { value: "process", label: "Evaluate impact, check scope doc, follow change process if needed" },
                                { value: "sure", label: "Sure, it's just one field" },
                            ],
                            expectedAnswer: "process",
                        },
                        {
                            type: "radio",
                            label: "Scope creep is best prevented by:",
                            options: [
                                { value: "document", label: "Clear scope documentation + change control process" },
                                { value: "say-no", label: "Just saying no to all new requests" },
                            ],
                            expectedAnswer: "document",
                        },
                        {
                            type: "radio",
                            label: "When a legitimate scope change is approved, you should:",
                            options: [
                                { value: "update", label: "Update scope document, timeline, and communicate to all stakeholders" },
                                { value: "verbal", label: "Accept verbally and keep building" },
                            ],
                            expectedAnswer: "update",
                        },
                        {
                            type: "text",
                            label: "Write a professional response to decline a scope creep request while maintaining the relationship:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write a trade-off statement for adding a new feature: what must change?",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 6: Stakeholder Communication Plan
        {
            id: "stakeholder-communication-plan",
            stepNumber: 6,
            title: "Stakeholder Communication Plan",
            icon: "📢",
            explanation: `
                <h3>Different Audiences Need Different Signal Levels</h3>
                <p>Implementation specialists translate the same project reality into the right format for different audiences. An executive needs outcome status and decisions required in 3 sentences. A delivery team needs task-level blockers and dependency changes in detail. A customer needs confidence and adoption readiness information.</p>

                <p>Getting communication wrong—too much detail for executives, too little for delivery teams—creates confusion, erodes trust, and generates unnecessary meetings to "get clarity."</p>
            `,
            verbTable: {
                title: "Communication Cadence Matrix",
                headers: ["Audience", "Cadence", "Primary Content", "Format"],
                rows: [
                    ["Executive/Sponsor", "Weekly", "Outcome status, major risks, decisions needed", "3-5 bullets, red/yellow/green status"],
                    ["Steering Committee", "Bi-weekly or milestone", "Progress vs. plan, resource issues, escalations", "Slide deck or structured doc"],
                    ["Delivery Team", "2-3x/week", "Task status, blockers, dependency changes", "Standup notes, Slack/Teams updates"],
                    ["Customer/Client", "Weekly or milestone-based", "Progress, timeline confidence, adoption readiness", "Email summary or call"],
                    ["Partner Teams", "As needed + weekly sync", "Integration points, shared dependencies", "Meeting notes + shared tracker"],
                ],
            },
            usageMeanings: [
                {
                    title: "📊 Executive Update Pattern",
                    description: "Concise, decision-focused communication",
                    examples: [
                        {
                            sentence: "Status: Yellow. On track for scope, timeline at risk due to API dependency. Decision needed: approve fallback plan by Friday.",
                            explanation: "Status, reason, action required—all in one sentence.",
                        },
                        {
                            sentence: "Phase 1 complete (100%). Phase 2 at 60%, tracking to March 15. No blockers. No decisions needed this week.",
                            explanation: "Clear progress, timeline, and explicit 'no action needed.'",
                        },
                    ],
                },
                {
                    title: "🔧 Delivery Team Update Pattern",
                    description: "Detailed, action-oriented communication",
                    examples: [
                        {
                            sentence: "Blocked: Auth integration waiting on Security team review. Owner: @Mike. Escalation: @PM if no response by EOD.",
                            explanation: "Clear blocker, owner, and escalation path.",
                        },
                        {
                            sentence: "Dependency change: Design mockups delayed 2 days. Adjusting task sequence—no timeline impact.",
                            explanation: "Change communicated with impact assessment.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cids-comms-1",
                    title: "Update Drafting",
                    instructions: "Practice concise communication by audience.",
                    items: [
                        {
                            type: "radio",
                            label: "An executive asks for project status. Best response format:",
                            options: [
                                { value: "brief", label: "3-5 bullets: status color, progress summary, risks, decisions needed" },
                                { value: "detailed", label: "Full task list with all technical details" },
                            ],
                            expectedAnswer: "brief",
                        },
                        {
                            type: "radio",
                            label: "The delivery team needs blocker communication. Include:",
                            options: [
                                { value: "actionable", label: "What's blocked, who owns resolution, escalation trigger" },
                                { value: "vague", label: "Something is blocked, working on it" },
                            ],
                            expectedAnswer: "actionable",
                        },
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
                        {
                            type: "text",
                            label: "Write a customer-facing progress update that maintains confidence while acknowledging a minor delay:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 7: Discovery Artifact Templates (NEW)
        {
            id: "discovery-artifacts",
            stepNumber: 7,
            title: "Discovery Artifact Templates",
            icon: "📄",
            explanation: `
                <h3>Turn Discovery Into Build-Ready Artifacts</h3>
                <p>Discovery outputs must be documented in artifacts that teams can reference throughout implementation. Verbal agreements fade, email threads become unreadable, and meeting notes get lost. Structured artifacts create a single source of truth that keeps everyone aligned.</p>

                <h3>The Implementation Brief</h3>
                <p>The implementation brief is the master artifact that synthesizes all discovery outputs into a single document that Product, Engineering, and Operations can all use.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1.25rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
                    <h4 style="margin-top: 0; color: #22d3ee;">Implementation Brief Structure</h4>
                    <div style="font-family: monospace; font-size: 0.9rem; line-height: 1.7;">
                        <p style="margin: 0.25rem 0;"><strong>1. Objective:</strong> What outcome are we driving? Success metric?</p>
                        <p style="margin: 0.25rem 0;"><strong>2. Scope:</strong> In-scope deliverables, out-of-scope items, deferred items</p>
                        <p style="margin: 0.25rem 0;"><strong>3. Constraints:</strong> Non-negotiable boundaries (technical, compliance, timeline)</p>
                        <p style="margin: 0.25rem 0;"><strong>4. Dependencies:</strong> External inputs required, owners, due dates</p>
                        <p style="margin: 0.25rem 0;"><strong>5. RAID Summary:</strong> Top risks/issues with owners and mitigations</p>
                        <p style="margin: 0.25rem 0;"><strong>6. Timeline:</strong> Key milestones with dates and owners</p>
                        <p style="margin: 0.25rem 0;"><strong>7. Validation:</strong> How we'll know each phase is complete</p>
                        <p style="margin: 0.25rem 0;"><strong>8. Decision Owners:</strong> Who approves scope changes? Escalation path?</p>
                        <p style="margin: 0.25rem 0;"><strong>9. Communication Plan:</strong> Who gets updates, how often, in what format?</p>
                    </div>
                </div>
            `,
            verbTable: {
                title: "Supporting Artifacts",
                headers: ["Artifact", "Purpose", "When to Create"],
                rows: [
                    ["Scope Document", "Defines in/out/deferred scope with boundaries", "During discovery, before commitment"],
                    ["RAID Log", "Tracks risks, assumptions, issues, dependencies", "Ongoing throughout implementation"],
                    ["Decision Log", "Records key decisions with rationale and owners", "Whenever significant decisions are made"],
                    ["Stakeholder Map", "Documents who needs what communication", "During discovery"],
                    ["Acceptance Criteria", "Defines 'done' for each deliverable", "Before build starts"],
                ],
            },
            exercises: [
                {
                    id: "cids-artifacts-1",
                    title: "Artifact Quality Check",
                    instructions: "Evaluate artifact completeness and quality.",
                    items: [
                        {
                            type: "radio",
                            label: "An implementation brief without a scope section is:",
                            options: [
                                { value: "incomplete", label: "Incomplete—scope is essential for alignment" },
                                { value: "ok", label: "Fine if everyone knows what we're building" },
                            ],
                            expectedAnswer: "incomplete",
                        },
                        {
                            type: "radio",
                            label: "RAID items should be reviewed:",
                            options: [
                                { value: "regularly", label: "Weekly or at each milestone—status changes over time" },
                                { value: "once", label: "Once at project start, then forgotten" },
                            ],
                            expectedAnswer: "regularly",
                        },
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
                            label: "Write one validation criterion that signals Phase 1 is ready for delivery:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Draft a 5-line implementation brief (objective, in-scope, out-of-scope, top risk, next milestone):",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },

        // Section 8: Practice Cadence
        {
            id: "practice-cadence-and-outcomes",
            stepNumber: 99,
            title: "Practice Cadence + I Can Now",
            icon: "✅",
            explanation: `
                <h3>Standard Practice Cadence</h3>
                <p>Use this repeatable sequence whenever you learn a new concept: concept check → read examples → write artifacts → debug scenarios.</p>

                <h3>Discovery + Scoping Quick Reference</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0;">
                    <div class="diagram-surface-light" style="background: #f0fdf4; border: 1px solid #86efac; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin-top: 0; color: #166534;">✅ Do This</h4>
                        <ul style="margin: 0; padding-left: 1rem; font-size: 0.95rem;">
                            <li>Document scope before committing timeline</li>
                            <li>Track all dependencies with owners</li>
                            <li>Use change control for scope additions</li>
                            <li>Communicate at audience-appropriate level</li>
                        </ul>
                    </div>
                    <div class="diagram-surface-light" style="background: #fef2f2; border: 1px solid #fca5a5; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin-top: 0; color: #991b1b;">❌ Avoid This</h4>
                        <ul style="margin: 0; padding-left: 1rem; font-size: 0.95rem;">
                            <li>Verbal-only scope agreements</li>
                            <li>Unowned dependencies</li>
                            <li>Silent scope additions</li>
                            <li>Same update format for all audiences</li>
                        </ul>
                    </div>
                </div>
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
                            label: "Draft a scope statement with in-scope, out-of-scope, and one deferred item with trigger criteria:",
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
                    <li>Run structured discovery and convert ambiguity into clear, measurable objectives.</li>
                    <li>Set explicit scope boundaries with in-scope, out-of-scope, and deferred categories.</li>
                    <li>Validate requirements using paraphrase-back, scenario testing, and priority forcing.</li>
                    <li>Track dependencies and RAID items with owners, due dates, and escalation triggers.</li>
                    <li>Detect scope creep early and use change control processes to manage it.</li>
                    <li>Communicate implementation status and risk in audience-appropriate formats.</li>
                    <li>Create implementation briefs that align Product, Engineering, and Operations.</li>
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
            explanation: "Reliable timelines depend on validated scope and constraints. Committing without clarity creates preventable failures.",
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
            explanation: "Phasing preserves trust and delivery quality. Silent compression leads to burnout or failure.",
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
            explanation: "Dependencies without accountability become predictable delays. Ownership creates accountability.",
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
            explanation: "Executive communication should focus on outcomes and decision support, not task-level details.",
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
            explanation: "Undefined boundaries invite unmanaged expansion of commitments, which erodes timelines.",
            topic: "scoping",
            skill: "delivery",
            skillTag: "scope-creep-prevention",
            difficulty: "hard",
        },
        {
            id: "cids-q6",
            question: "When all requirements are marked 'high priority,' you should:",
            options: [
                { value: "a", label: "Force stack ranking: 'If we can only ship 5, which 5?'" },
                { value: "b", label: "Accept all as high priority and try to deliver everything" },
                { value: "c", label: "Assume the stakeholder knows best" },
            ],
            correctAnswer: "a",
            explanation: "Without stack ranking, you cannot make tradeoff decisions when reality forces choices.",
            topic: "requirement-validation",
            skill: "judgment",
            skillTag: "priority-forcing",
            difficulty: "medium",
        },
        {
            id: "cids-q7",
            question: "A stakeholder says 'make it easy to use.' Best validation response:",
            options: [
                { value: "a", label: "Ask for specific scenarios and acceptance criteria" },
                { value: "b", label: "Accept 'easy to use' as sufficient guidance" },
                { value: "c", label: "Interpret it yourself based on experience" },
            ],
            correctAnswer: "a",
            explanation: "Vague requirements need concrete criteria. 'Easy' means different things to different people.",
            topic: "requirement-validation",
            skill: "communication",
            skillTag: "criteria-validation",
            difficulty: "easy",
        },
        {
            id: "cids-q8",
            question: "The RAID log should be reviewed:",
            options: [
                { value: "a", label: "Weekly or at each milestone—status changes over time" },
                { value: "b", label: "Once at project start, then archived" },
                { value: "c", label: "Only when something goes wrong" },
            ],
            correctAnswer: "a",
            explanation: "Risks and dependencies evolve. Regular review catches changes before they become crises.",
            topic: "raid",
            skill: "risk-management",
            skillTag: "raid-maintenance",
            difficulty: "medium",
        },
        {
            id: "cids-q9",
            question: "A 'small' scope addition request arrives mid-sprint. Best response:",
            options: [
                { value: "a", label: "Evaluate impact, check scope doc, follow change process" },
                { value: "b", label: "Add it silently—it's small" },
                { value: "c", label: "Reject all changes during active sprints" },
            ],
            correctAnswer: "a",
            explanation: "Small additions accumulate into scope creep. Follow the process to maintain timeline integrity.",
            topic: "scope-creep",
            skill: "judgment",
            skillTag: "change-control",
            difficulty: "medium",
        },
        {
            id: "cids-q10",
            question: "An implementation brief without explicit success criteria is:",
            options: [
                { value: "a", label: "Incomplete—you won't know when you're done" },
                { value: "b", label: "Fine if everyone generally agrees on the goal" },
                { value: "c", label: "Acceptable for small projects" },
            ],
            correctAnswer: "a",
            explanation: "Without success criteria, 'done' becomes subjective and scope expands indefinitely.",
            topic: "discovery-artifacts",
            skill: "documentation",
            skillTag: "success-criteria",
            difficulty: "easy",
        },
        {
            id: "cids-q11",
            question: "Two departments define 'customer' differently. You should:",
            options: [
                { value: "a", label: "Create a shared definition document and align both departments" },
                { value: "b", label: "Pick one definition and hope the other adapts" },
                { value: "c", label: "Use both definitions in different parts of the system" },
            ],
            correctAnswer: "a",
            explanation: "Shared definitions prevent confusion and rework. Alignment now saves conflict later.",
            topic: "requirement-validation",
            skill: "communication",
            skillTag: "definition-alignment",
            difficulty: "medium",
        },
        {
            id: "cids-q12",
            question: "The best time to document scope boundaries is:",
            options: [
                { value: "a", label: "During discovery, before committing to timeline" },
                { value: "b", label: "After build starts, once we understand the work better" },
                { value: "c", label: "At project end, to document what we delivered" },
            ],
            correctAnswer: "a",
            explanation: "Scope boundaries set expectations. Documenting them late defeats their purpose.",
            topic: "scoping",
            skill: "planning",
            skillTag: "early-documentation",
            difficulty: "easy",
        },
        {
            id: "cids-q13",
            question: "A dependency with no fallback plan is:",
            options: [
                { value: "a", label: "A timeline risk that needs mitigation" },
                { value: "b", label: "Normal—most dependencies work out" },
                { value: "c", label: "Only concerning if the dependency is already late" },
            ],
            correctAnswer: "a",
            explanation: "Dependencies without fallbacks become single points of failure. Plan for what happens if they slip.",
            topic: "raid",
            skill: "risk-management",
            skillTag: "fallback-planning",
            difficulty: "hard",
        },
        {
            id: "cids-q14",
            question: "Deferred scope items should include:",
            options: [
                { value: "a", label: "Trigger criteria for when to reconsider inclusion" },
                { value: "b", label: "Just the feature name in a list" },
                { value: "c", label: "Nothing—deferred means never" },
            ],
            correctAnswer: "a",
            explanation: "Trigger criteria (e.g., 'if adoption exceeds 80%') make deferrals actionable, not forgotten.",
            topic: "scoping",
            skill: "planning",
            skillTag: "deferral-criteria",
            difficulty: "medium",
        },
        {
            id: "cids-q15",
            question: "The primary purpose of discovery is to:",
            options: [
                { value: "a", label: "Surface hidden assumptions and align expectations before build" },
                { value: "b", label: "Generate detailed technical specifications" },
                { value: "c", label: "Create documentation for compliance purposes" },
            ],
            correctAnswer: "a",
            explanation: "Discovery prevents costly surprises by ensuring everyone shares the same understanding before work begins.",
            topic: "discovery",
            skill: "synthesis",
            skillTag: "discovery-purpose",
            difficulty: "hard",
        },
    ],
};
