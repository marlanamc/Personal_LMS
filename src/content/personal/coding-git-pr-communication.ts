import type { InteractiveGuideContent } from "@/types/activity";

export const codingGitPrCommunicationContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Git + PR Communication for Real Teams",
            icon: "🧩",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
                    <p style="font-size: 1.05rem; margin: 0;">This guide teaches the part most courses skip: how to communicate code decisions clearly so teammates can review, trust, and ship your work safely.</p>
                </div>

                <h3>What You Will Be Able To Do</h3>
                <ul>
                    <li>Break large changes into reviewable commit sequences</li>
                    <li>Write PR summaries with risk and validation evidence</li>
                    <li>Respond to feedback without being defensive or vague</li>
                    <li>Use git history as a communication tool, not just storage</li>
                </ul>
            `,
            tipBox: {
                title: "Communication Standard",
                content:
                    "Every technical update should answer: what changed, why now, risks, and how you validated behavior.",
            },
            exercises: [
                {
                    id: "cgpc-intro-1",
                    title: "Mindset Check",
                    instructions: "Choose the strongest team-oriented approach.",
                    items: [
                        {
                            type: "radio",
                            label: "Best purpose of commits and PRs:",
                            options: [
                                {
                                    value: "communication",
                                    label: "Communicate intention, scope, and safety of a change to teammates",
                                },
                                { value: "backup", label: "Only backup code in case your laptop crashes" },
                            ],
                            expectedAnswer: "communication",
                        },
                        {
                            type: "radio",
                            label: "When a reviewer asks why you changed architecture, best response style is:",
                            options: [
                                {
                                    value: "reasoned",
                                    label: "State constraint, decision, tradeoff, and test evidence",
                                },
                                { value: "authority", label: "I changed it because I felt like it" },
                            ],
                            expectedAnswer: "reasoned",
                        },
                    ],
                },
            ],
        },
        {
            id: "branch-and-scope-strategy",
            stepNumber: 1,
            title: "Branch and Scope Strategy",
            icon: "🌿",
            explanation: `
                <h3>Small, Focused Branches Win Reviews</h3>
                <p>Branch scope should map to one coherent goal. If a branch includes theme refactor, seed script edits, and notebook filtering with no clear boundary, reviewers cannot reason about risk.</p>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">✅ Good Branch Scope</h4>
                        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem;">
                            <li>One feature or one bug fix</li>
                            <li>Clear rollback boundary</li>
                            <li>Single area of the codebase</li>
                            <li>Reviewable in 15-30 minutes</li>
                        </ul>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">❌ Risky Branch Scope</h4>
                        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem;">
                            <li>Multiple unrelated changes</li>
                            <li>Impossible to rollback one piece</li>
                            <li>Touches auth, UI, and database</li>
                            <li>200+ lines across 15 files</li>
                        </ul>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Good branch scope",
                    description: "One target behavior or concern",
                    examples: [
                        {
                            sentence: "feat/theme-glacial-sakura focuses only on token wiring + visual cleanup.",
                            explanation: "Makes QA and rollback straightforward.",
                        },
                        {
                            sentence: "fix/timer-ring-visual-noise only adjusts ring visuals, no logic.",
                            explanation: "Clear blast radius and easy review.",
                        },
                    ],
                },
                {
                    title: "Risky branch scope",
                    description: "Unrelated changes mixed together",
                    examples: [
                        {
                            sentence: "Single branch modifies auth flow, styling, Prisma seeds, and deploy config.",
                            explanation: "Hard to isolate regressions and impossible to review well.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cgpc-branch-1",
                    title: "Scope Decisions",
                    instructions: "Pick the strongest branch strategy for each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: "You need to redesign activity cards and also fix an unrelated auth redirect bug. Best plan:",
                            options: [
                                { value: "split", label: "Create separate branches/PRs by concern" },
                                { value: "mix", label: "Bundle both to ship faster in one PR" },
                            ],
                            expectedAnswer: "split",
                        },
                        {
                            type: "text",
                            label: "Write a concise branch name for this task: add activity-type filters in subject pages only:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "commit-quality-and-history",
            stepNumber: 2,
            title: "Commit Quality and History Design",
            icon: "🧱",
            formula: [
                { text: "type", type: "subject" },
                { text: "(", type: "other" },
                { text: "scope", type: "verb" },
                { text: "):", type: "other" },
                { text: "imperative description", type: "object" },
            ],
            explanation: `
                <h3>Commit Sequence Should Tell a Story</h3>
                <p>Reviewers should understand your intent by reading commit messages in order. The question is not only "does it run?" but also "can someone audit what happened later?"</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Commit Message Formula</strong></p>
                    <code style="display: block; background: rgba(0,0,0,0.05); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.95rem;">
                        type(scope): imperative verb + what changed
                    </code>
                    <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem;"><strong>Types:</strong> feat, fix, refactor, test, docs, style, chore</p>
                </div>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Example high-signal sequence</strong></p>
                    <ol style="margin: 0; padding-left: 1rem;">
                        <li><code>feat(theme): add glacial sakura tokens for dark/light</code></li>
                        <li><code>refactor(cards): replace neon gradients with layered surfaces</code></li>
                        <li><code>fix(timer): smooth focus ring end-cap visuals only</code></li>
                        <li><code>test(ui): add assertions for theme attribute switching</code></li>
                    </ol>
                </div>
            `,
            tipBox: {
                title: "Atomicity Rule",
                content:
                    "Each commit should compile and represent one meaningful step. Avoid giant 'misc fixes' commits.",
            },
            exercises: [
                {
                    id: "cgpc-commit-1",
                    title: "Commit Refactor Drill",
                    instructions: "Choose the better commit strategy and explain briefly.",
                    items: [
                        {
                            type: "radio",
                            label: "You changed 14 files across three concerns. Better approach before PR:",
                            options: [
                                { value: "organize", label: "Reorganize into coherent commits by concern" },
                                { value: "single", label: "One giant commit: update everything" },
                            ],
                            expectedAnswer: "organize",
                        },
                        {
                            type: "text",
                            label: "Rewrite this weak commit message into a high-signal one: 'fixed stuff':",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "pr-description-and-risk",
            stepNumber: 3,
            title: "PR Description, Risk Notes, and Validation",
            icon: "📝",
            comparison: {
                title: "PR Description Quality Comparison",
                leftLabel: "Strong PR Description",
                rightLabel: "Weak PR Description",
                rows: [
                    {
                        label: "Problem Statement",
                        left: "Filter chips show activity cards instead of notebook cards due to type mismatch",
                        right: "Fixed bug",
                    },
                    {
                        label: "Decision Rationale",
                        left: "Chose to map chip selection to activity.type enum for consistency with existing filters",
                        right: "(no explanation)",
                    },
                    {
                        label: "Scope",
                        left: "Changes: SubjectPage.tsx, FilterChip.tsx. No backend changes.",
                        right: "Changed some files",
                    },
                    {
                        label: "Risk Assessment",
                        left: "Risk: filter state could persist incorrectly on navigation. Mitigated by resetting on route change.",
                        right: "(no risk noted)",
                    },
                    {
                        label: "Validation",
                        left: "Tested: all 5 filter chips toggle correctly, card counts match, dark/light modes verified",
                        right: "Looks good to me",
                    },
                ],
            },
            explanation: `
                <h3>PRs Should Reduce Reviewer Cognitive Load</h3>
                <p>A strong PR description includes context, change scope, user impact, risks, and explicit validation steps.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1rem; border-radius: 0.75rem; color: #f8fafc; margin: 1rem 0;">
<pre style="margin: 0; font-size: 0.88rem; line-height: 1.55;">
Problem -> Decision -> Scope -> Risks -> Validation -> Screenshots
</pre>
                </div>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>PR Description Template</strong></p>
                    <pre style="margin: 0; font-size: 0.85rem; line-height: 1.6; background: rgba(0,0,0,0.05); padding: 0.75rem; border-radius: 0.5rem;">
## Problem
[What user-facing issue does this solve?]

## Solution
[What approach did you take and why?]

## Changes
- [ ] File1.tsx - description
- [ ] File2.ts - description

## Risk Assessment
[What could go wrong? How did you mitigate?]

## Validation
- [ ] Test case 1
- [ ] Test case 2
- [ ] Screenshots attached</pre>
                </div>
            `,
            postExplanation: `
                <p><strong>Risk note example:</strong> "This changes color token wiring globally; potential regressions include unreadable chip text and low-contrast progress bars in light mode."</p>
            `,
            exercises: [
                {
                    id: "cgpc-pr-1",
                    title: "PR Writing Drill",
                    instructions: "Practice the exact communication structure reviewers need.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence for 'Problem' in a PR where notebook filter chips now show activity cards instead of notebooks:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one validation bullet proving dark and light mode are both safe after a theme refactor:",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "radio",
                            label: "Which PR note best supports deploy safety?",
                            options: [
                                {
                                    value: "detailed",
                                    label: "Includes exact smoke tests, affected pages, and known risk areas",
                                },
                                { value: "vague", label: "Looks good on my machine" },
                            ],
                            expectedAnswer: "detailed",
                        },
                    ],
                },
            ],
        },
        {
            id: "code-review-conversations",
            stepNumber: 4,
            title: "Code Review Conversations",
            icon: "💬",
            explanation: `
                <h3>Review Replies Are Part of Engineering Work</h3>
                <p>Good review communication is concise and evidence-based: acknowledge, clarify constraint, propose action, and confirm follow-up.</p>
            `,
            usageMeanings: [
                {
                    title: "Strong review reply pattern",
                    description: "Acknowledge + reason + action",
                    examples: [
                        {
                            sentence: "Great catch. I switched to a shared token to avoid inline color drift and added a snapshot check.",
                            explanation: "Shows you accepted feedback and strengthened quality.",
                        },
                    ],
                },
                {
                    title: "Weak review reply pattern",
                    description: "Defensive or context-free response",
                    examples: [
                        {
                            sentence: "It works for me, so I left it.",
                            explanation: "Blocks collaboration and leaves risk unresolved.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cgpc-review-1",
                    title: "Review Response Simulation",
                    instructions: "Choose the strongest response strategy in each case.",
                    items: [
                        {
                            type: "radio",
                            label: "Reviewer: 'Can we avoid hard-coded colors in this component?' Best response:",
                            options: [
                                {
                                    value: "tokenize",
                                    label: "Agree, move to theme tokens, and note where you updated references",
                                },
                                { value: "defend", label: "Keep as-is; hard-coded colors are faster" },
                            ],
                            expectedAnswer: "tokenize",
                        },
                        {
                            type: "text",
                            label: "Draft a one-sentence response when you disagree with a suggestion but have benchmark evidence:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "debugging-with-git-history",
            stepNumber: 5,
            title: "Debugging with Git History",
            icon: "🕵️",
            explanation: `
                <h3>When Production Breaks, History Is Your Diagnostic Tool</h3>
                <p>Use commit history and diffs to isolate regression windows quickly. You are not searching all code; you are narrowing the timeline.</p>
            `,
            verbTable: {
                title: "Triage Workflow",
                headers: ["Step", "Question", "Action"],
                rows: [
                    ["1. Confirm failure", "What broke and where?", "Reproduce with exact route, user role, and environment"],
                    ["2. Narrow window", "When did it start?", "Inspect recent deploy commits and changed files"],
                    ["3. Validate cause", "Which change explains symptom?", "Compare before/after behavior and run targeted checks"],
                    ["4. Contain risk", "How to ship safely?", "Patch small, add regression test, document rollout notes"],
                ],
            },
            exercises: [
                {
                    id: "cgpc-debug-1",
                    title: "Regression Investigation",
                    instructions: "Pick the strongest debugging move first.",
                    items: [
                        {
                            type: "radio",
                            label: "After merge, activity filters show wrong cards. Best first step:",
                            options: [
                                {
                                    value: "window",
                                    label: "Check recent commits touching filter mapping/render logic to narrow regression window",
                                },
                                { value: "rewrite", label: "Rewrite feature from scratch immediately" },
                            ],
                            expectedAnswer: "window",
                        },
                        {
                            type: "text",
                            label: "Write one regression test idea that would have caught this filter mismatch before deploy:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "merge-conflict-resolution",
            stepNumber: 6,
            title: "Merge Conflict Resolution Strategy",
            icon: "⚔️",
            explanation: `
                <h3>Conflicts Are Coordination Signals, Not Failures</h3>
                <p>When git flags a merge conflict, it means two branches changed the same lines. Resolve conflicts carefully by understanding both changes, testing thoroughly, and communicating the choice in commit messages.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Conflict Resolution Checklist</strong></p>
                    <ul style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li>Understand what each branch changed and why</li>
                        <li>Combine logic carefully, do not just delete one side</li>
                        <li>Test the merged result thoroughly (both changes must work)</li>
                        <li>Commit with clear message: 'merge: resolve conflict in X by combining A and B logic'</li>
                        <li>Notify the other developer about your resolution strategy</li>
                    </ul>
                </div>

                <h4 style="margin-top: 1.5rem;">Common Conflict Patterns</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0;">
                    <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Import/export additions</p>
                        <p style="margin: 0; font-size: 0.9rem;">Both branches added new exports. Combine all exports, removing duplicates.</p>
                    </div>
                    <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Function signature changes</p>
                        <p style="margin: 0; font-size: 0.9rem;">Different branch modified the same function. Keep signature from main, adapt calls if needed.</p>
                    </div>
                    <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Merge with main frequently</p>
                        <p style="margin: 0; font-size: 0.9rem;">Rebase or merge main into feature branch weekly to catch conflicts early.</p>
                    </div>
                    <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 1rem; border-radius: 0.75rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Semantic conflicts</p>
                        <p style="margin: 0; font-size: 0.9rem;">Git merges but logic is broken. Always test after resolving conflicts, do not trust automatic resolution.</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "Conflict Prevention",
                content:
                    "Keep branches short-lived (2-3 days max) and merge main frequently to reduce conflict risk. Communicate with teammates about who is touching which files.",
            },
            exercises: [
                {
                    id: "cgpc-conflict-1",
                    title: "Conflict Resolution Drill",
                    instructions: "Choose the strongest resolution strategy.",
                    items: [
                        {
                            type: "radio",
                            label: "You have a merge conflict where both branches added new theme tokens. Best approach:",
                            options: [
                                { value: "combine", label: "Combine both token sets, remove duplicates, test all references" },
                                { value: "delete", label: "Delete one branch's changes to resolve faster" },
                            ],
                            expectedAnswer: "combine",
                        },
                        {
                            type: "text",
                            label: "Write a clear commit message after resolving a conflict where two branches modified activity filter logic:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
            ],
        },
        {
            id: "professional-communication-playbook",
            stepNumber: 7,
            title: "Professional Communication Playbook",
            icon: "🎯",
            explanation: `
                <h3>Reusable Template for Technical Updates</h3>
                <p>Use this structure in PRs, standups, and handoffs to keep communication clear under pressure.</p>

                <div class="diagram-surface-light" style="background: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.45); padding: 1rem; border-radius: 0.75rem;">
                    <ul style="margin: 0; padding-left: 1rem; line-height: 1.7;">
                        <li><strong>Context:</strong> what user/problem area is affected</li>
                        <li><strong>Decision:</strong> what you changed and why this option</li>
                        <li><strong>Tradeoff:</strong> what you accepted or deferred</li>
                        <li><strong>Validation:</strong> concrete checks you ran</li>
                        <li><strong>Risk:</strong> what to monitor after deploy</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "cgpc-playbook-1",
                    title: "Decision Narrative Drill",
                    instructions: "Practice concise communication under realistic constraints.",
                    items: [
                        {
                            type: "text",
                            label: "Write a 2-sentence update using Context + Decision for the timer ring visual refactor (no logic changes):",
                            acceptAnyAttempt: true,
                        },
                        {
                            type: "text",
                            label: "Write one sentence capturing Tradeoff + Risk for hiding a noisy homepage component:",
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
            icon: "✅",
            explanation: `
                <h3>Standard Practice Cadence</h3>
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> read code -> write code -> debug scenario.</p>
            `,
            exercises: [
                {
                    id: "gpc-cadence-concept",
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
                    id: "gpc-cadence-read",
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
                    id: "gpc-cadence-write",
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
                    id: "gpc-cadence-debug",
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
            id: "cgpc-q1",
            question: "Best branch strategy when implementing theme tokens and fixing unrelated auth callback bug?",
            options: [
                { value: "a", label: "Separate branches/PRs by concern" },
                { value: "b", label: "One branch to reduce overhead" },
                { value: "c", label: "Direct commits to main" },
            ],
            correctAnswer: "a",
            explanation: "Separated scope improves review quality and rollback safety.",
            topic: "branching",
            skill: "collaboration",
            skillTag: "scope-isolation",
            difficulty: "medium",
        },
        {
            id: "cgpc-q2",
            question: "Which commit message is highest signal?",
            options: [
                { value: "a", label: "update files" },
                { value: "b", label: "fix bug" },
                { value: "c", label: "feat(filters): map chip selection to activity card rendering" },
            ],
            correctAnswer: "c",
            explanation: "Specific scope + intent makes history useful.",
            topic: "commits",
            skill: "communication",
            skillTag: "commit-message-quality",
            difficulty: "easy",
        },
        {
            id: "cgpc-q3",
            question: "Most important missing element in this PR summary: 'Refactored dashboard cards' ?",
            options: [
                { value: "a", label: "Risk and validation evidence" },
                { value: "b", label: "A fun emoji" },
                { value: "c", label: "Company history" },
            ],
            correctAnswer: "a",
            explanation: "Reviewers need safety evidence and known risk areas.",
            topic: "prs",
            skill: "risk-management",
            skillTag: "validation-evidence",
            difficulty: "medium",
        },
        {
            id: "cgpc-q4",
            question: "Reviewer asks to remove hard-coded color values. Best response?",
            options: [
                { value: "a", label: "Ignore and resolve conversation" },
                { value: "b", label: "Move values to shared tokens and reference updated locations" },
                { value: "c", label: "Say it's just stylistic so it does not matter" },
            ],
            correctAnswer: "b",
            explanation: "Accepting actionable feedback with concrete changes improves codebase consistency.",
            topic: "review",
            skill: "collaboration",
            skillTag: "constructive-review-response",
            difficulty: "easy",
        },
        {
            id: "cgpc-q5",
            question: "A regression appears after merge. Best first debugging move?",
            options: [
                { value: "a", label: "Narrow to recent commits affecting the behavior" },
                { value: "b", label: "Refactor entire module immediately" },
                { value: "c", label: "Wait for another user report" },
            ],
            correctAnswer: "a",
            explanation: "Timeline narrowing accelerates root-cause analysis.",
            topic: "debugging",
            skill: "triage",
            skillTag: "regression-window",
            difficulty: "medium",
        },
        {
            id: "cgpc-q6",
            question: "Which PR validation note is strongest?",
            options: [
                { value: "a", label: "Tested quickly" },
                {
                    value: "b",
                    label: "Validated in dark/light modes on dashboard and subject pages; checked activity filters and progress bars",
                },
                { value: "c", label: "No validation, but code compiles" },
            ],
            correctAnswer: "b",
            explanation: "Specific validation coverage helps reviewers trust change safety.",
            topic: "prs",
            skill: "quality",
            skillTag: "explicit-validation",
            difficulty: "hard",
        },
        {
            id: "cgpc-q7",
            question: "A teammate suggests a change you disagree with. Best path?",
            options: [
                { value: "a", label: "Reject with no explanation" },
                { value: "b", label: "Explain constraint, show evidence, and propose an alternative" },
                { value: "c", label: "Accept immediately even if unsafe" },
            ],
            correctAnswer: "b",
            explanation: "Evidence-backed discussion preserves quality and collaboration.",
            topic: "review",
            skill: "communication",
            skillTag: "disagree-constructively",
            difficulty: "hard",
        },
        {
            id: "cgpc-q8",
            question: "Why avoid mixed-concern commits like 'theme + auth + seed changes' in one commit?",
            options: [
                { value: "a", label: "Harder review, testing, rollback, and blame analysis" },
                { value: "b", label: "Git does not allow it" },
                { value: "c", label: "Because commit messages cannot be long" },
            ],
            correctAnswer: "a",
            explanation: "Mixed concerns increase operational risk and reduce maintainability.",
            topic: "commits",
            skill: "architecture",
            skillTag: "atomic-changes",
            difficulty: "medium",
        },
        {
            id: "cgpc-q9",
            question: "Best rollout note for a UI token refactor?",
            options: [
                { value: "a", label: "Ship and watch social media" },
                {
                    value: "b",
                    label: "Monitor text contrast, chip readability, and progress-bar visibility across dark/light after deploy",
                },
                { value: "c", label: "No rollout note needed for UI" },
            ],
            correctAnswer: "b",
            explanation: "Targeted monitoring aligns with known regression risk.",
            topic: "release",
            skill: "risk-management",
            skillTag: "post-deploy-monitoring",
            difficulty: "hard",
        },
        {
            id: "cgpc-q10",
            question: "Most accurate statement about PR size:",
            options: [
                { value: "a", label: "Smaller coherent PRs are generally reviewed faster and more accurately" },
                { value: "b", label: "Bigger PRs are always better because fewer links" },
                { value: "c", label: "PR size has no impact on defects" },
            ],
            correctAnswer: "a",
            explanation: "Smaller scope reduces reviewer fatigue and missed issues.",
            topic: "prs",
            skill: "process",
            skillTag: "reviewability",
            difficulty: "easy",
        },
        {
            id: "cgpc-q11",
            question: "Which status update is strongest in a standup?",
            options: [
                { value: "a", label: "Worked on code all day" },
                {
                    value: "b",
                    label: "Implemented activity filter mapping, validated chip-to-card rendering, and flagged one edge case on empty states",
                },
                { value: "c", label: "Done soon maybe" },
            ],
            correctAnswer: "b",
            explanation: "Concrete change + validation + risk signal improves team coordination.",
            topic: "communication",
            skill: "collaboration",
            skillTag: "high-signal-status",
            difficulty: "medium",
        },
        {
            id: "cgpc-q12",
            question: "When is a squashed single commit acceptable?",
            options: [
                {
                    value: "a",
                    label: "When the PR is small, coherent, and the final message still captures intent and validation",
                },
                { value: "b", label: "Always, even for multi-concern changes" },
                { value: "c", label: "Never under any circumstance" },
            ],
            correctAnswer: "a",
            explanation: "Commit strategy should serve readability, traceability, and team conventions.",
            topic: "git-history",
            skill: "judgment",
            skillTag: "squash-tradeoff",
            difficulty: "hard",
        },
        {
            id: "cgpc-q13",
            question: "Two branches both modified theme token definitions. What should NOT be your resolution strategy?",
            options: [
                { value: "a", label: "Delete one branch's tokens to reduce file size" },
                { value: "b", label: "Combine both token sets and test all references" },
                { value: "c", label: "Verify that neither change breaks the other's intended behavior" },
            ],
            correctAnswer: "a",
            explanation: "Deleting one side of a conflict loses functionality. Always combine changes and validate.",
            topic: "conflicts",
            skill: "collaboration",
            skillTag: "conflict-resolution",
            difficulty: "medium",
        },
        {
            id: "cgpc-q14",
            question: "Best practice to prevent merge conflicts on long-running branches?",
            options: [
                { value: "a", label: "Merge or rebase main into feature branch weekly" },
                { value: "b", label: "Wait until the end and resolve all conflicts at once" },
                { value: "c", label: "Keep teammates away from the same files" },
            ],
            correctAnswer: "a",
            explanation: "Frequent syncs with main catch conflicts early when they are easier to resolve.",
            topic: "conflicts",
            skill: "process",
            skillTag: "conflict-prevention",
            difficulty: "medium",
        },
        {
            id: "cgpc-q15",
            question: "After resolving a merge conflict in git, most important validation step?",
            options: [
                { value: "a", label: "Run typecheck, build, and relevant tests to ensure merged code works" },
                { value: "b", label: "Trust git's conflict markers are correct" },
                { value: "c", label: "Just commit without testing" },
            ],
            correctAnswer: "a",
            explanation: "Git resolves line-level conflicts but cannot validate semantic correctness. Testing proves both changes work together.",
            topic: "conflicts",
            skill: "quality",
            skillTag: "post-merge-validation",
            difficulty: "hard",
        },
    ],
};
