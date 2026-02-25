# Coding Lessons To Build

This is a focused roadmap to make me a stronger communicator with developers and grow into a stronger developer myself.

## Primary Goals

1. Explain problems clearly using technical language and reproducible steps.
2. Read errors and debug with confidence.
3. Understand React/Next.js behavior well enough to reason about UI and data flow.
4. Use TypeScript as a tool, not a blocker.
5. Collaborate cleanly with git, PRs, and code reviews.
6. Build testing habits that prevent regressions.

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
