# Spanish Guide Upgrade Standards

Use these standards when creating or upgrading Spanish grammar guides to ensure consistency, pedagogical quality, and engagement.

## 1. Section Count

- **Minimum:** 6 sections per guide
- **Target:** 6–10 sections
- Typical structure: overview → formation/usage → comparison (if applicable) → quick reference → common mistakes

Run `npm run check:spanish-guides` to verify section counts across all guides.

## 2. Exercise Requirements

- Each section should have at least one exercise block (unless purely reference)
- Exercise items: mix of radio, select, text, and open-ended as appropriate
- Include at least one **production task** per guide (e.g. write a short paragraph, compose a 4-step instruction sequence)
- Exercises should increase in difficulty from first to final section

## 3. Mini Quiz

- **10–20 questions** per guide
- Coverage: form recognition, meaning/usage, error recognition
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

## 5. Production Task Scaffolding

For open-ended production tasks (`acceptAnyAttempt: true`):

- **Instructions:** Be specific. Include success criteria, word count, and structure to use (e.g., "Use: Step 1 = affirmative tú command, Step 2 = negative tú command").
- **Labels:** Include format hints and examples in the label (e.g., "Step 1 (affirmative tú command, e.g. Abre la puerta):").
- **Placeholders:** Add `placeholder` with an example answer (e.g., `placeholder: "Ejemplo: Primero me levanto."`).
- **answerExpectation:** Set `answerExpectation: "full-sentence"` so learners know they should write full sentences.
- **Section explanation:** Add a "Success criteria" paragraph with model examples when helpful.

## 6. Content Patterns

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

## 7. Language Policy

- **Basics:** May use English or mixed English/Spanish
- **Intermediate and Advanced:** Spanish only—all pedagogical text (explanations, instructions, options, feedback) must be in Spanish

Run `npm run check:spanish-b1-language` to validate Intermediate/Advanced guides.

## 8. Validation Commands

```bash
npm run typecheck
npm run check:spanish-b1-language
npm run check:spanish-guides
```

## 9. Related Docs

- `docs/SPANISH_CONTENT_SYSTEM.md` – Source of truth and naming rules
- `docs/SPANISH_GUIDE_QA_CHECKLIST.md` – Pre-merge checklist
