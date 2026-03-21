# Spanish Guide Upgrade Standards

Use these standards when creating or upgrading Spanish guides to ensure consistency, pedagogical quality, and task-first alignment.

## 0. Default Lesson Architecture

Spanish guides now default to a task-first focus-on-form structure:

- `communicative task -> rich input -> learner attempt -> focus-on-form support -> revised attempt -> checkpoint`
- Grammar explanations are support materials, not the main spine of the lesson.
- New or redesigned guides should use `taskScenario`, `taskStages`, `inputMaterials`, `focusOnFormTriggers`, and `communicativeCheckpoint`.
- Legacy explanation-first guides may remain temporarily, but every migrated guide should start with a task stage in section 1.

## 1. Section Count

- **Minimum:** 6 sections per guide
- **Target:** 6–10 sections
- For migrated guides, sections should follow task stages rather than a rule lecture sequence.

Run `npm run check:spanish-guides` to verify section counts across all guides.

## 2. Exercise Requirements

- Each task stage should have at least one exercise block or attempt prompt (unless purely reference)
- Exercise items: mix of radio, select, text, and open-ended as appropriate
- Include at least one **production task** per guide (e.g. write a short paragraph, compose a 4-step instruction sequence)
- Exercises should increase in difficulty from first to final section
- Rich input should be less impoverished than old drill-style prompts: use short dialogues, notices, menus, messages, routes, or transcripts when relevant
- Redesigned guides should include at least **2 input materials**

## 3. Checkpoint

- Use `communicativeCheckpoint` for redesigned guides; `miniQuiz` remains valid for legacy guides
- **6–20 questions** per checkpoint, depending on task scope
- Coverage should emphasize interpretation, choice-in-context, repair, and short production decisions
- Options should be plausible distractors, not obviously wrong

## 4. Visual and Structural Elements

Use these where they add clarity:

| Element      | When to use                                | Example guides            |
|-------------|---------------------------------------------|---------------------------|
| **formula** | Formulaic patterns (ir + a, tener + que, estar + gerundio) | Immediate Future, Present Tense, Commands |
| **timeline**| Narrative sequence (preterite vs imperfect) | Imperfect Tense           |
| **comparison** | Contrasting forms or uses               | Imperfect vs Preterite, Ser vs Estar |
| **timeExpressions** | Tense or planning markers            | Immediate Future, Preterite |
| **tipBox**  | Common mistakes, quick reference           | All guides                |
| **verbTable** | Conjugations or command forms          | Present, Preterite, Commands |
| **decisionMap** | “Which form do I need here?” branching support | Present Tense, Ser vs Estar |
| **sceneCards** | Real-world setting with goals and likely phrases | Travel, Restaurant, Question Words |
| **repairStacks** | Before/after repair with rationale | Requests, Ser vs Estar, Restaurant |
| **microStories** | Connected mini-scenes with meaning callouts | Reflexives, Directions, Present Tense |
| **phraseBank** | High-frequency chunks grouped by communicative job | Travel, Restaurant, Introductions |

## 5. Task-First Authoring Rules

- The first section of a redesigned guide must attach to a `taskStageId`.
- `taskScenario.summary` should state the real-world problem before any grammar explanation.
- `inputMaterials` should supply context learners can interpret before they are asked to produce.
- `focusOnFormTriggers` must be tied to a stage via `stageId`.
- Each redesigned guide should include at least one revise-after-feedback moment via `postTaskReflection` or a section reflection.
- Keep grammar support brief and local to the learner problem; avoid long standalone lectures at the start.
- Each redesigned guide should include at least one visual or structured support block (`comparison`, `timeline`, `decisionMap`, `sceneCards`, `repairStacks`, `microStories`, `phraseBank`, `verbTable`, etc.).
- Each redesigned guide should include at least one `repairStacks` block so learners see awkward vs improved output directly.

## 6. Production Task Scaffolding

For open-ended production tasks (`acceptAnyAttempt: true`):

- **Instructions:** Be specific. Include success criteria, word count, and structure to use (e.g., "Use: Step 1 = affirmative tú command, Step 2 = negative tú command").
- **Labels:** Include format hints and examples in the label (e.g., "Step 1 (affirmative tú command, e.g. Abre la puerta):").
- **Placeholders:** Add `placeholder` with an example answer (e.g., `placeholder: "Ejemplo: Primero me levanto."`).
- **answerExpectation:** Set `answerExpectation: "full-sentence"` so learners know they should write full sentences.
- **Section explanation:** Add a "Success criteria" paragraph with model examples when helpful.

## 7. Content Patterns

### Formula boxes (`section.formula`)

Use for patterns like:
- `ir + a + infinitive`
- `tener + que + infinitive`
- `estar + gerundio (-ando/-iendo)`

Format: array of `{ text: string, type?: "subject" | "verb" | "object" | "other" }`.

### Timeline (`section.timeline`)

Use for narrative sequences, e.g. preterite vs imperfect in a story:
- `title`, `description`, `events[]` with `order`, `label`, `tenseLabel`

### Comparison tables (`section.comparison`)

Use when contrasting two forms or uses:
- `title`, `leftLabel`, `rightLabel`, `rows[]` with `label`, `left`, `right`

### Time expressions (`section.timeExpressions`)

Use for tense markers (ayer, mañana, etc.):
- `word`, `usage`, `examples[]`

## 8. Language Policy

- **Basics:** May use English or mixed English/Spanish
- **Intermediate and Advanced:** Spanish only—all pedagogical text (explanations, instructions, options, feedback) must be in Spanish

Run `npm run check:spanish-b1-language` to validate Intermediate/Advanced guides.

## 9. Validation Commands

```bash
npm run typecheck
npm run check:spanish-b1-language
npm run check:spanish-task-first
npm run check:spanish-guides
```

## 10. Related Docs

- `docs/SPANISH_CONTENT_SYSTEM.md` – Source of truth and naming rules
- `docs/SPANISH_GUIDE_QA_CHECKLIST.md` – Pre-merge checklist
