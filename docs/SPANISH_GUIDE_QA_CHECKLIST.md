# Spanish Guide QA Checklist

Use this before merging any new Spanish guide.

## Required checks

- [ ] Tier (Basics/Intermediate/Advanced) is explicitly set and matches the objective in `src/content/spanish/course-map.ts`.
- [ ] Guide ID is added to `src/content/spanish/registry.ts` and `SPANISH_GUIDE_META` (tier, lesson number, topic, description).
- [ ] Guide is wired in `prisma/seed-spanish-guides.ts` (content in `contentByGuideId`).
- [ ] `miniQuiz` has 10-20 questions.
- [ ] Mini quiz covers form, meaning/usage, and error recognition.
- [ ] At least one production task exists in guide exercises.
- [ ] Exercises are progressively harder from section 1 to final section.

## Language by tier

- **Basics:** May use English (or mixed English/Spanish) for explanations, instructions, and feedback.
- **Intermediate and Advanced:** Must be Spanish only. All pedagogical text (titles, explanations, instructions, options, feedback) must be in Spanish.
- [ ] No English translation blocks in Intermediate/Advanced guide content.
- [ ] `npm run check:spanish-b1-language` passes (validates Intermediate/Advanced guides).

## Overlap and consolidation gate

- [ ] Objective is not duplicating an existing canonical objective in `course-map.ts`.
- [ ] If related content already exists, this guide extends practice scope rather than reteaching the same explanation.
- [ ] Vocabulary overlap with scenario guides is intentional and minimal.

## Validation commands

```bash
npm run typecheck
npm run check:spanish-b1-language
npm run check:spanish-guides
```

Use the analysis script to verify section counts (6–10 per guide), exercise blocks, exercise items, and mini quiz questions (10–20).
