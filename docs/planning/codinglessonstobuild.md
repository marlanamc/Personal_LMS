# Coding Lessons To Build

This is a focused roadmap to make me a stronger communicator with developers and grow into a stronger developer myself.

## Primary Goals

1. Explain problems clearly using technical language and reproducible steps.
2. Read errors and debug with confidence.
3. Understand React/Next.js behavior well enough to reason about UI and data flow.
4. Use TypeScript as a tool, not a blocker.
5. Collaborate cleanly with git, PRs, and code reviews.
6. Build testing habits that prevent regressions.

## Implementation TODO Tracker

Update this checklist after each content update so we always know progress at a glance.

- [x] Consolidation Sprint: archive legacy `coding-js-ts.ts`
- [x] Consolidation Sprint: normalize overlap/cross-links in existing guides
- [x] New Lesson: React Fundamentals for Product Builders
- [x] New Lesson: Next.js Big Picture + App Router Decision Tree
- [x] New Lesson: Git + PR Communication for Real Teams
- [x] New Lesson: Testing Fundamentals for Confidence
- [x] New Lesson: API Contract + Prisma Workflow
- [x] New Lesson: Debugging Production Issues (Vercel + env + triage)
- [x] Content pass: reduce heavy gradient intro blocks across coding guides
- [x] Content pass: standardize exercise cadence in every coding lesson
- [x] Content pass: add “I can now…” outcomes to every coding guide

## Implementation Manager Track TODO

Add this track to close the remaining gap between strong technical communication and high-performance implementation management.

- [x] New Track Foundation: Discovery + Scoping Discipline
- [x] New Track Foundation: Stakeholder Communication System
- [x] New Track Foundation: Planning Mechanics (workback, dependencies, RAID)
- [x] New Track Delivery: Change Management + Adoption
- [x] New Track Delivery: UAT Leadership + Defect Triage
- [x] New Track Delivery: Go-Live + Hypercare Operations
- [x] New Track Measurement: KPI Framework + Outcome Tracking
- [x] New Track Influence: Cross-Functional Decision Leadership
- [x] Toolkit Build: Templates library (BRD-lite, RAID log, status update, go-live runbook, postmortem)
- [x] Interview Prep: Implementation manager scenarios + story bank

## Current State Snapshot (Fully Updated)

This section reflects the actual, current implemented state after all additions.

### Core Coding Lessons (Implemented)

1. `coding-variables-types`
2. `coding-operators-expressions`
3. `coding-strings-methods`
4. `coding-error-handling`
5. `coding-functions-parameters`
6. `coding-loops-control-flow`
7. `coding-arrays-objects`
8. `coding-dom-manipulation`
9. `coding-classes-oop`
10. `coding-modules-imports`
11. `coding-working-with-apis`
12. `coding-async-promises`
13. `coding-react-fundamentals`
14. `coding-nextjs-architecture-decision-tree`
15. `coding-git-pr-communication`
16. `coding-testing-fundamentals-confidence`
17. `coding-api-contract-prisma-workflow`
18. `coding-debugging-production-issues`
19. `coding-typescript-deep-dive`
20. `coding-array-method-mastery`
21. `coding-debugging-devtools`
22. `coding-js-ts-interview-prep`

### Implementation Manager Lessons (Implemented)

1. `coding-implementation-discovery-scoping`
2. `coding-implementation-stakeholder-communication-system`
3. `coding-implementation-planning-mechanics`
4. `coding-implementation-change-management-adoption`
5. `coding-implementation-uat-defect-triage`
6. `coding-implementation-go-live-hypercare`
7. `coding-implementation-kpi-outcome-tracking`
8. `coding-implementation-cross-functional-decision-leadership`

### Implementation Manager Toolkit Assets (Implemented)

1. `docs/planning/implementation-manager-toolkit-templates.md`
2. `docs/planning/implementation-manager-interview-scenarios-story-bank.md`

### Course Quality Passes Completed

1. Intro callouts across coding guides were reduced to calmer neutral styling.
2. Standardized practice cadence section added across coding guides.
3. Explicit “I can now…” outcomes added across coding guides.

## Historical Audit Notes (Pre-Implementation)

This audit is based on current seeded coding guides and content files in `src/content/personal/*`.

### Active Seeded Coding Guides (Current Backbone)

1. `coding-variables-types`
2. `coding-operators-expressions`
3. `coding-strings-methods`
4. `coding-error-handling`
5. `coding-functions-parameters`
6. `coding-loops-control-flow`
7. `coding-arrays-objects`
8. `coding-dom-manipulation`
9. `coding-classes-oop`
10. `coding-modules-imports`
11. `coding-working-with-apis`
12. `coding-async-promises`
13. `coding-typescript-deep-dive`
14. `coding-array-method-mastery`
15. `coding-debugging-devtools`
16. `coding-js-ts-interview-prep`

### Legacy / Duplicate Candidate

- `src/content/personal/coding-js-ts.ts` is not in seeded active guides (already listed in seed cleanup as removed sample activity).
- Recommendation: archive this file or fold any unique quiz items into modern guides, then remove to avoid confusion.

### Consolidation Matrix (Keep / Merge / Archive)

1. Keep as standalone:
   - `coding-debugging-devtools`
   - `coding-working-with-apis`
   - `coding-typescript-deep-dive`
   - `coding-js-ts-interview-prep`
2. Merge concept overlap:
   - `coding-arrays-objects` + `coding-array-method-mastery`
     - Keep both, but formalize progression:
       - arrays/objects = foundation
       - array-method-mastery = applied patterns
     - Remove repeated explanations of basic array syntax from mastery lesson.
   - `coding-error-handling` + `coding-async-promises`
     - Keep both, but move async error patterns (`try/catch` with `await`, retry strategy) into a shared advanced module reference section.
   - `coding-modules-imports` + `coding-dom-manipulation`
     - Keep both, but reduce repeated “why organization matters” intros and add one shared “project structure” exercise.
3. Archive / deprecate:
   - `coding-js-ts.ts` (legacy starter, now superseded by `coding-variables-types` + `coding-typescript-deep-dive`)

### Missing High-Impact Lessons (Historical; now implemented)

1. React Fundamentals for real projects:
   - components, props, state, event flow, render cycle
2. Next.js App Router mental model:
   - server vs client components
   - route structure
   - data fetch placement
3. Git + PR Communication:
   - branch strategy, commit quality, PR summaries, review replies
4. Testing for confidence:
   - unit vs integration vs e2e
   - writing regression tests for real bugs
5. API Contract + Prisma Workflow:
   - request/response design
   - migration safety
   - seed strategy and rollback thinking
6. Debugging Production Issues:
   - reading build logs (Vercel)
   - environment/config failures
   - triage workflow

### Suggested Re-organization (Learning Paths)

1. Foundations Path:
   - variables-types -> operators-expressions -> strings-methods -> functions-parameters -> loops-control-flow -> arrays-objects
2. Web App Path:
   - dom-manipulation -> modules-imports -> working-with-apis -> async-promises -> error-handling
3. Professional Path:
   - typescript-deep-dive -> debugging-devtools -> js-ts-interview-prep -> (new) git/pr/testing/next/react lessons

### Content Consistency Improvements to Apply During Consolidation

1. Tone + depth consistency:
   - keep beginner guides practical, avoid repeating long conceptual intros in every lesson
2. Visual consistency:
   - reduce heavy gradient/emoji noise in lesson callouts to match calmer design system
3. Exercise consistency:
   - each lesson should include:
     - concept check
     - code reading task
     - code writing task
     - debugging scenario
4. Exit criteria consistency:
   - each lesson ends with “I can now…” outcomes tied to real LMS tasks

### First Consolidation Sprint (Recommended)

1. Archive `coding-js-ts.ts` after extracting any unique quiz items.
2. Normalize overlap between `coding-arrays-objects` and `coding-array-method-mastery`.
3. Add cross-links between:
   - `coding-async-promises` <-> `coding-error-handling`
   - `coding-working-with-apis` <-> `coding-debugging-devtools`
4. Draft new lesson outlines (no full build yet):
   - React Fundamentals
   - Next.js Decision Tree + App Router
   - Git/PR Communication
   - Testing Fundamentals

### Consolidation Progress Log

1. Completed: archived legacy `src/content/personal/coding-js-ts.ts`.
2. Reason: superseded by active guides:
   - `coding-variables-types`
   - `coding-typescript-deep-dive`
   - `coding-js-ts-interview-prep`
3. Verification:
   - no active seed/dashboard references to `coding-js-ts` content file
   - seed cleanup already removed legacy activity id `coding-js-ts`
4. Completed: added consolidation boundaries and companion cross-links:
   - `coding-arrays-objects` <-> `coding-array-method-mastery`
   - `coding-async-promises` <-> `coding-error-handling`
   - `coding-working-with-apis` <-> `coding-debugging-devtools`
5. Completed: implemented first new lesson:
   - `coding-react-fundamentals`
   - wired into seed script, coding registry, and coding notebook organization.
6. Completed: implemented second new lesson:
   - `coding-nextjs-architecture-decision-tree`
   - includes App Router, server/client boundaries, fetch placement, and deployment triage.
   - wired into seed script, coding registry, and coding notebook organization.
7. Completed: implemented third new lesson:
   - `coding-git-pr-communication`
   - includes branch/scope strategy, commit design, PR risk+validation writing, review response patterns, and git-based regression triage.
   - includes scenario-heavy exercises and a mixed-difficulty mini quiz with communication and debugging judgment.
   - wired into seed script, coding registry, and coding notebook organization.
8. Completed: implemented fourth new lesson:
   - `coding-testing-fundamentals-confidence`
   - includes test-type decision tree, resilient assertions, regression design, mock/fixture strategy, CI gates, and PR test communication.
   - includes scenario-heavy exercises and a mixed-difficulty mini quiz with risk-based testing judgment.
   - wired into seed script, coding registry, and coding notebook organization.
9. Completed: implemented fifth new lesson:
   - `coding-api-contract-prisma-workflow`
   - includes API contract design, Prisma schema evolution strategy, migration deploy sequencing, seed idempotency/safety, rollback thinking, and backend risk communication.
   - includes scenario-heavy exercises and a mixed-difficulty mini quiz with migration and contract judgment.
   - wired into seed script, coding registry, and coding notebook organization.
10. Completed: implemented sixth new lesson:
   - `coding-debugging-production-issues`
   - includes Vercel build log analysis, env/config triage, incident decision tree, rollback vs forward-fix strategy, status communication, and post-incident prevention.
   - includes scenario-heavy exercises and a mixed-difficulty mini quiz with incident/debugging judgment.
   - wired into seed script, coding registry, and coding notebook organization.
11. Completed: coding content consistency pass across all active coding guides (`src/content/personal/coding-*.ts`):
   - reduced heavy intro gradient callouts to calmer neutral callouts
   - added standardized practice cadence section (`concept check -> read code -> write code -> debug scenario`)
   - added explicit “I can now…” outcomes to every coding guide
   - applied consistently across 22 coding guide files
12. Completed: started Implementation Manager track with first lesson:
   - `coding-implementation-discovery-scoping`
   - includes discovery intake framework, scope boundary definition, dependency/RAID mapping, stakeholder communication planning, and implementation brief handoff.
   - wired into seed script, coding registry, and coding notebook organization.
13. Completed: Implementation Manager track second lesson:
   - `coding-implementation-stakeholder-communication-system`
   - includes audience mapping, cadence/channel design, status update architecture, escalation trigger language, and handoff discipline.
   - wired into seed script, coding registry, and coding notebook organization.
14. Completed: Implementation Manager track third lesson:
   - `coding-implementation-planning-mechanics`
   - includes workback planning, dependency mapping, RAID operations, re-baselining tradeoffs, and planning governance rituals.
   - wired into seed script, coding registry, and coding notebook organization.
15. Completed: Implementation Manager track fourth lesson:
   - `coding-implementation-change-management-adoption`
   - includes segmentation, communication waves, training/enablement design, resistance triage, and adoption metric loops.
   - wired into seed script, coding registry, and coding notebook organization.
16. Completed: Implementation Manager track fifth lesson:
   - `coding-implementation-uat-defect-triage`
   - includes UAT plan design, acceptance/sign-off gates, severity/priority triage model, triage SLAs, and launch-readiness reporting.
   - wired into seed script, coding registry, and coding notebook organization.
17. Completed: Implementation Manager track sixth lesson:
   - `coding-implementation-go-live-hypercare`
   - includes readiness gate system, cutover runbook structure, rollback/mitigation criteria, hypercare operating cadence, and steady-state handoff thresholds.
   - wired into seed script, coding registry, and coding notebook organization.
18. Completed: Implementation Manager track seventh lesson:
   - `coding-implementation-kpi-outcome-tracking`
   - includes KPI tree design, leading/lagging indicator use, metric specification contracts, and action-based review loops.
   - wired into seed script, coding registry, and coding notebook organization.
19. Completed: Implementation Manager track eighth lesson:
   - `coding-implementation-cross-functional-decision-leadership`
   - includes decision framing, facilitation without authority, evidence-based conflict resolution, and decision memo follow-through.
   - wired into seed script, coding registry, and coding notebook organization.
20. Completed: Implementation toolkit library:
   - created `docs/planning/implementation-manager-toolkit-templates.md`
   - includes BRD-lite, RAID log, status updates, UAT/triage templates, go-live runbook, hypercare summary, postmortem, and decision memo templates.
21. Completed: Implementation interview prep pack:
   - created `docs/planning/implementation-manager-interview-scenarios-story-bank.md`
   - includes high-value scenarios, STAR story bank framework, story quality checklist, and 4-week practice cadence.

## Exercise and Mini Quiz Quality Standard

For all new coding lessons:

1. At least 60% of exercises must be scenario/decision-based (not definition recall).
2. Include at least one bug diagnosis prompt per lesson.
3. Include at least one tradeoff or architecture-choice prompt per lesson.
4. Mini quiz must include mixed difficulty:
   - easy: foundational correctness
   - medium: applied reasoning
   - hard: debugging/architecture judgment
5. Mini quiz should tag `topic`, `skill`, `skillTag`, and `difficulty` for diagnostic value.
6. “Why” explanations should teach reasoning, not just reveal the answer.

## New Lesson Outlines (Drafts)

These are outlines only, ready for implementation after consolidation.

### 1) React Fundamentals for Product Builders

Learning goals:

1. Explain component architecture in plain language.
2. Understand props vs state vs derived UI.
3. Avoid common rendering and hook mistakes.

Sections:

1. Why React for interactive products
2. Components and composition
3. Props and one-way data flow
4. State and event handlers
5. Rendering model and re-renders
6. `useEffect` vs `useMemo` (when not to use them)
7. Common bug patterns and fixes

Exercises:

1. Refactor one LMS card into reusable component props.
2. Debug a stale-state interaction bug.
3. Explain a component tree as a product flow.

### 2) Next.js Big Picture + App Router Decision Tree

Learning goals:

1. Choose server vs client boundaries intentionally.
2. Place data fetching in the right layer.
3. Explain Next.js architecture decisions clearly.

Sections:

1. Why Next.js vs plain React in this LMS
2. App Router structure (`app/`, route segments, layouts)
3. Server Components vs Client Components
4. Data fetching patterns and API routes
5. Caching/revalidation mental model (intro level)
6. Build/deploy debugging (Vercel logs)

Exercises:

1. Classify existing LMS files as server/client and justify.
2. Trace one dashboard feature end-to-end (route -> data -> UI).
3. Write one ADR for a boundary decision.

### 3) Git + PR Communication for Real Teams

Learning goals:

1. Break changes into reviewable increments.
2. Write high-signal PRs.
3. Respond to review feedback effectively.

Sections:

1. Branch strategy for feature work
2. Commit quality and message format
3. PR description template and evidence
4. Risk notes and rollout notes
5. Review comment patterns (agree, clarify, propose alternative)

Exercises:

1. Convert one large change into 3-5 coherent commits.
2. Write a complete PR summary for a dashboard feature.
3. Simulate review comments and written responses.

### 4) Testing Fundamentals for Confidence

Learning goals:

1. Choose the right test type for the risk.
2. Prevent regressions from recurring bugs.
3. Use tests as communication artifacts.

Sections:

1. Unit vs integration vs e2e in practical terms
2. What to test first in UI-heavy apps
3. Regression test patterns for bug fixes
4. Test naming and readability
5. Pre-deploy smoke checklist

Exercises:

1. Add one regression test for a real recent bug.
2. Add two integration tests for subject filter behavior.
3. Build a deploy-checklist script for critical paths.

## Next Consolidation Backlog (After This Sprint)

1. Reduce repeated high-gradient intro blocks across coding guides to a calmer visual style.
2. Standardize each lesson to the same exercise cadence:
   - concept check
   - read code
   - write code
   - debug scenario
3. Add “I can now…” outcomes to every guide for clearer progression.

## Implementation Manager Competency Gaps (Now Added to Plan)

1. Discovery and scoping discipline:
   - intake checklist
   - constraints mapping
   - success criteria + out-of-scope boundaries
2. Stakeholder communication system:
   - executive summaries
   - customer-friendly updates
   - risk escalation cadence
3. Implementation planning mechanics:
   - workback plans
   - dependency mapping
   - RAID logs (Risks, Assumptions, Issues, Dependencies)
4. Change management and adoption:
   - training plans
   - rollout communication
   - resistance/risk handling
5. UAT leadership:
   - UAT test-plan design
   - acceptance criteria
   - defect triage workflow
6. Go-live and hypercare operations:
   - cutover checklist
   - rollback strategy
   - day-1/day-7 support model
7. KPI and business outcome tracking:
   - time-to-value
   - activation/adoption
   - issue rate and SLA metrics
8. Cross-functional influence:
   - decision facilitation without formal authority
   - conflict handling
   - alignment narratives for Product/Engineering/Ops

## Implementation Manager Build Plan

### Phase 1: Foundations (2 weeks)

1. Build `im-discovery-scoping`
   - deliverables:
     - discovery intake template
     - scoping worksheet
     - measurable success-criteria examples
2. Build `im-stakeholder-communication-system`
   - deliverables:
     - status update templates (exec/client/internal)
     - escalation trigger matrix
3. Build `im-planning-mechanics`
   - deliverables:
     - RAID template
     - dependency map template
     - workback plan template

Exit criteria:
- complete a mock implementation brief from messy requirements
- produce a weekly update pack with risk flags and decisions needed

### Phase 2: Delivery Operations (2 weeks)

1. Build `im-change-management-adoption`
   - deliverables:
     - adoption plan by user segment
     - communication timeline
2. Build `im-uat-leadership`
   - deliverables:
     - UAT plan template
     - defect severity rubric
     - sign-off checklist
3. Build `im-go-live-hypercare`
   - deliverables:
     - cutover runbook
     - rollback + mitigation playbook
     - hypercare operating cadence

Exit criteria:
- run a simulated go-live with incident drills and hypercare updates
- demonstrate clear defect triage prioritization under time pressure

### Phase 3: Measurement + Influence (2 weeks)

1. Build `im-kpi-outcomes`
   - deliverables:
     - KPI tree (leading + lagging indicators)
     - dashboard metric spec
2. Build `im-cross-functional-influence`
   - deliverables:
     - decision memo template
     - conflict-resolution scripts
3. Build `im-interview-story-bank`
   - deliverables:
     - 8 STAR stories mapped to core competencies
     - scenario-response drills

Exit criteria:
- present a full implementation narrative from discovery to outcomes
- pass mock interview with quantified impact and risk-management examples

## Sequencing Notes for Content Creation

1. Build the three Foundation lessons first because they unlock every downstream workflow.
2. Build Delivery Operations next with scenario-heavy simulations and timed triage drills.
3. Build Measurement + Influence last so each story is backed by realistic delivery artifacts.
4. For every new lesson in this track, include:
   - one scenario exercise with incomplete information
   - one escalation/communication writing drill
   - one decision tradeoff prompt
   - one artifact output (template or checklist completion)

## Priority Lesson Tracks

## 1) Debugging Workflow (Highest Priority)

- Reading stack traces and identifying the real failing line.
- Reproduction discipline:
  - expected behavior
  - actual behavior
  - exact steps to reproduce
  - environment/context
- Isolating variables:
  - UI issue vs data issue vs API issue vs state issue
- Fast debugging tools:
  - `console` strategy
  - breakpoints
  - network tab
  - React DevTools
- Root-cause writeups (not just symptom fixes).

Project exercises:
- Take one real LMS bug and write a “Bug Brief” before fixing.
- Fix a TypeScript build error from logs only (like Vercel output).
- Do a “regression hunt” after a theme/UI refactor.

## 2) TypeScript Fluency

- Interfaces vs types and when to use each.
- Optional fields, unions, narrowing, and safe guards.
- Function typing for callbacks and component props.
- Common TS errors and how to interpret them quickly.
- Preventing “any creep” and unsafe assumptions.

Project exercises:
- Add explicit shared types for dashboard card/filter data.
- Refactor one component with stricter prop types.
- Create a “TS Error Decoder” cheat sheet from real project errors.

## 3) React + Next.js Mental Model

- Server Components vs Client Components (`"use client"` boundaries).
- Props/state flow and render lifecycle basics.
- `useMemo`, `useEffect`, and common overuse/misuse patterns.
- Avoiding hook-order bugs and stale state bugs.
- Component composition for reusability and consistency.

Project exercises:
- Diagram one feature flow (dashboard subject filters) from server fetch to UI render.
- Refactor one large component into smaller composable parts.
- Add one “performance cleanup” pass (memoization only where needed).

## 4) API + Data Layer Communication

- API contract basics: request/response shape, error states.
- Prisma fundamentals:
  - schema mental model
  - migrations
  - seed scripts
- Distinguishing frontend bug vs backend/data bug.
- Writing reliable seed/update scripts safely.

Project exercises:
- Document one endpoint contract used by dashboard.
- Trace a single feature from DB -> API -> UI.
- Write a migration note template (what changed, why, risk).

## 5) Git, PRs, and Team Communication

- Branching and commit hygiene.
- Writing high-signal PR descriptions:
  - problem
  - scope
  - decisions
  - screenshots
  - test notes
- Giving/receiving code review feedback.
- Breaking work into safe, reviewable increments.

Project exercises:
- Create 3 commits for one feature with clean messages.
- Write a PR template and use it for your next change.
- Practice “review comments only” on an old PR or diff.

## 6) Testing Strategy for Confidence

- Unit vs integration vs e2e: what each catches.
- Testing user flows, not just implementation details.
- Regression tests for bug fixes.
- Smoke-test checklist before deploy.

Project exercises:
- Add 2 high-value tests around dashboard filter behavior.
- Add 1 regression test for a recent bug.
- Create a deploy-ready checklist for Vercel builds.

## Communication Skills Layer (Cross-Cutting)

For every technical task, practice:

1. Framing the problem in one sentence.
2. Defining success criteria before coding.
3. Stating assumptions explicitly.
4. Describing tradeoffs (what was chosen and why).
5. Writing “what changed / why / how verified” after completion.

Suggested output templates to build:

- Bug Report Template
- Feature Request Template
- PR Summary Template
- Release Note Template
- Postmortem Lite Template

## Suggested 8-Week Sequence

1. Weeks 1-2: Debugging + TypeScript
2. Weeks 3-4: React/Next mental model + component refactors
3. Weeks 5-6: API/Prisma + git/PR workflow
4. Weeks 7-8: Testing + communication templates + capstone

Capstone:
- Pick one meaningful dashboard feature.
- Write brief/spec first.
- Implement in 3-5 clean commits.
- Add tests.
- Write final PR-quality summary and rollout notes.

## “Done” Definition for Progress

A lesson track is complete when I can:

1. Explain the concept in plain language.
2. Apply it in this LMS codebase.
3. Show one artifact (code, test, doc, or PR summary).
4. Describe one mistake I made and how I fixed it.

## Big-Picture Architecture Decision Tree

This section is for understanding how to choose technology, not just how to code.

## 1) Frontend Framework: React vs Other Options

Ask:

1. Do I need a highly interactive UI with reusable components?
2. Will this product keep growing in complexity?
3. Do I want broad ecosystem and hiring support?

Decision:

- Choose React when UI complexity and long-term flexibility matter.
- Choose simpler static/content-first tools when interactivity is low.
- Choose highly opinionated frameworks when team conventions are the top priority.

Why React is often chosen:

- Strong component model for scaling UI.
- Large ecosystem and learning resources.
- Excellent fit for design systems and iterative UX work.

## 2) Next.js vs Plain React

Ask:

1. Do I need built-in routing, server rendering, API routes, auth-friendly patterns, and SEO?

Decision:

- Choose Next.js for full web apps with mixed server/client needs.
- Choose plain React SPA when app is fully client-side and simpler.

## 3) Database Selection

Ask:

1. Is the data relational (users, classes, assignments, progress, submissions)?
2. Do I need transactions and strong integrity?

Decision:

- Choose PostgreSQL for relational systems (best fit for LMS-like products).
- Choose document stores for less relational, highly flexible content structures.
- Add Redis for caching/session/queue concerns, not as the primary relational source.

## 4) ORM / Data Access Strategy

Ask:

1. Do I want fast iteration + type safety + migration support in a TS codebase?

Decision:

- Choose Prisma when developer speed and schema safety matter.
- Use raw SQL/query builders when fine-grained SQL control is the priority.

## 5) API Style Choice

Ask:

1. Do I need broad compatibility and straightforward CRUD?
2. Do clients need highly custom query shapes?
3. Is the team fully TypeScript and tightly coupled?

Decision:

- REST for straightforward, team-friendly APIs and integrations.
- GraphQL for complex client-driven query shapes.
- tRPC for end-to-end TypeScript teams wanting reduced API boilerplate.

## 6) Hosting / Deployment Choice

Ask:

1. Is fast iteration and preview deploy workflow important?
2. Do I need deep infrastructure/network customization?

Decision:

- Choose Vercel for fast Next.js workflows and preview-based collaboration.
- Choose custom cloud infrastructure when advanced infra controls are required.

## 7) Practical Scoring Model

For each candidate technology, score 1-5:

1. Team skill fit
2. Time-to-ship
3. Maintenance burden
4. Reliability/risk
5. Ecosystem/hiring support

Pick the highest score, then document the tradeoffs clearly.

## 8) Architecture Decision Record (ADR) Template

Use this format for every major tech decision:

1. Problem statement
2. Constraints (team, time, budget, scale, compliance)
3. Options considered
4. Pros and cons of each option
5. Final decision
6. Risks and mitigations
7. Revisit trigger (what would make us re-evaluate)

## Suggested Practice Assignments for Big-Picture Thinking

1. Write an ADR for “Why Next.js + React for this LMS?”
2. Write an ADR for “Why PostgreSQL + Prisma instead of alternatives?”
3. Create one architecture diagram:
   - UI (Next.js) -> API routes -> Prisma -> Postgres
4. Do one “what if” exercise:
   - If this app grows 10x users, what stays and what changes first?

## Communication Playbook (Data Analyst -> Developer)

My background in Python, R, Stata, and Flask is an advantage.  
The key growth area is explaining technical work clearly and consistently.

## Core Reframe

I am not “guessing until it works.”  
I am running iterative experiments, narrowing uncertainty, and shipping validated changes.

Use this language:

- Instead of: “I tried random things.”
- Say: “I tested hypotheses in sequence and validated the fix against expected behavior.”

## 5-Line Technical Story Script

For any bug fix or feature:

1. Problem: “The issue was ___.”
2. Evidence: “I confirmed it via ___ (logs, UI behavior, build output).”
3. Change: “I changed ___ in ___ file(s).”
4. Tradeoff: “I chose this approach because ___; tradeoff was ___.”
5. Validation: “I verified with ___ (lint/test/build/manual flow).”

## PR Summary Template (Use Every Time)

1. What changed:
   - short bullets of actual code/UI changes
2. Why:
   - user impact or bug prevented
3. Risks:
   - what could regress
4. Validation:
   - exact checks run
5. Follow-ups:
   - optional cleanup/debt

## Bug Report Template

1. Expected behavior
2. Actual behavior
3. Steps to reproduce
4. Scope/impact (who is affected)
5. Suspected layer:
   - UI
   - API
   - data/migration
   - environment/build

## Decision Explanation Template

When asked “why this tech/approach?” answer with:

1. Context: “Given ___ constraints…”
2. Options: “We considered A/B/C.”
3. Decision: “We chose B.”
4. Why: “Best fit for ___.”
5. Revisit trigger: “We will reconsider if ___.”

## Example: LMS Build Error (Modeled)

1. Problem:
   - Vercel build failed on TypeScript: missing `accentBorder` in `categoryStyle` type.
2. Evidence:
   - Error pointed to `TodaysAssignments.tsx` and exact property access.
3. Change:
   - Updated the inline `categoryStyle` type to include full style shape.
4. Tradeoff:
   - Kept local inline type for speed; could be moved later to shared type for consistency.
5. Validation:
   - Lint passed, and build progressed past that TS failure.

## Example: Product/UX Decision (Modeled)

1. Problem:
   - Filter chip row created visual noise.
2. Options:
   - Keep always visible, reduce styles, or collapse by default.
3. Decision:
   - Collapse filter row behind a compact toggle.
4. Why:
   - Preserves functionality while reducing cognitive load.
5. Validation:
   - UI cleaner, filter still reachable in one click.

## Weekly Practice Ritual (20-30 min)

After each coding session, write:

1. One bug/feature story using the 5-line script.
2. One decision note using the decision template.
3. One “what I learned” line:
   - error pattern
   - debugging shortcut
   - terminology improvement

## Terminology Upgrade List (Use Intentionally)

Use these words more often:

- “constraint”
- “tradeoff”
- “scope”
- “regression risk”
- “validation”
- “assumption”
- “fallback”
- “root cause”

## Confidence Rule

You do not need to sound like a senior architect.  
You need to be clear, falsifiable, and consistent:

1. what happened
2. what you changed
3. why you changed it
4. how you verified it
