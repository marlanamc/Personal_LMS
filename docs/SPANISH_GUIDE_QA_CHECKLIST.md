# Spanish Guide QA Checklist

Use this before merging any new Spanish guide.

## Required checks

- [ ] Tier (Basics/Intermediate/Advanced) is explicitly set and matches the objective in `src/content/spanish/course-map.ts`.
- [ ] Guide ID is added to `src/content/spanish/registry.ts` and `SPANISH_GUIDE_META` (tier, lesson number, topic, description).
- [ ] Guide is wired in `prisma/seed-spanish-guides.ts` (content in `contentByGuideId`).
- [ ] Redesigned guides start with a meaning-focused task, not a rule lecture.
- [ ] If the guide uses task-first mode, `taskScenario`, `taskStages`, and `focusOnFormTriggers` are present and aligned.
- [ ] If the guide uses task-first mode, section 1 has a `taskStageId`.
- [ ] If the guide uses task-first mode, there are at least 2 `inputMaterials`.
- [ ] If the guide uses task-first mode, there is at least 1 visual/structured support block (`comparison`, `timeline`, `decisionMap`, `sceneCards`, `repairStacks`, `microStories`, `phraseBank`, `verbTable`, etc.).
- [ ] If the guide uses task-first mode, there is at least 1 `repairStacks` block.
- [ ] `communicativeCheckpoint` or `miniQuiz` exists and matches the task outcomes.
- [ ] Checkpoint/quiz covers meaning/usage, repair, and context-based choices.
- [ ] At least one production task exists in guide exercises.
- [ ] Exercises are progressively harder from section 1 to final section.
- [ ] At least one revise-after-feedback moment exists via `postTaskReflection` or equivalent.

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
npm run check:spanish-task-first
npm run check:spanish-guides
```

Use the analysis scripts to verify section counts, exercise blocks, exercise items, and whether redesigned guides include task-first fields.
