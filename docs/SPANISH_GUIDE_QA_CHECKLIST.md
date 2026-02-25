# Spanish Guide QA Checklist

Use this before merging any new Spanish guide.

## Required checks

- [ ] CEFR level is explicitly set and matches the objective in `src/content/spanish/course-map.ts`.
- [ ] Guide ID is added to `src/content/spanish/registry.ts`.
- [ ] Guide is wired in `prisma/seed-spanish-guides.ts`.
- [ ] `miniQuiz` has 10-20 questions.
- [ ] Mini quiz covers form, meaning/usage, and error recognition.
- [ ] At least one production task exists in guide exercises.
- [ ] Exercises are progressively harder from section 1 to final section.

## B1-C2 additional gate (Spanish-only)

- [ ] All pedagogical text is in Spanish (titles, explanations, instructions, options, feedback).
- [ ] No English translation blocks in guide content.
- [ ] `npm run check:spanish-b1-language` passes.

## Overlap and consolidation gate

- [ ] Objective is not duplicating an existing canonical objective in `course-map.ts`.
- [ ] If related content already exists, this guide extends practice scope rather than reteaching the same explanation.
- [ ] Vocabulary overlap with scenario guides is intentional and minimal.

## Validation commands

```bash
npm run typecheck
npm run check:spanish-b1-language
```
