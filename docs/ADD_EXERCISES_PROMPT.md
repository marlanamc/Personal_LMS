# Prompt: Continue Adding Exercises to Grammar Activities

## Current Status
- **Total sections:** 418
- **Sections WITH exercises:** 239 ( 57.2%)
- **Sections WITHOUT exercises:** 179 (42.8%)

## Task
Continue adding high-quality exercises to grammar activity sections that are missing them. Focus on ensuring all sections have meaningful exercises that test actual understanding, not just comprehension.

## Where These Exercises Live (Code Location)

- Grammar activity files live in `src/content/grammar/*.ts`
- Each file exports an `InteractiveGuideContent` object with `sections: [...]`
- Each `section` may include an `exercises: [...]` array
- Goal: add an `exercises` array to sections that are missing it (usually 1 exercise per section, 3–5 items per exercise)

## Guidelines for Creating Exercises

### Quality Standards
1. **Test understanding, not just comprehension** - Exercises should require students to apply grammar concepts, not just answer "yes/no" or "did you understand?"
2. **Include 3+ meaningful options** - Each multiple choice question should have at least 3 options that test different aspects of understanding
3. **Use real-world contexts** - Exercises should relate to workplace, health, daily life situations
4. **Focus on practical application** - Students should be able to use what they learn in real conversations

### Exercise Types
- **Radio questions** - Multiple choice with 3+ options
- **Text input** - Fill-in-the-blank or complete the sentence
- **Select dropdown** - Choose from a list of options
- **Word scramble** - Students click words to build a correct sentence (good for word order)

### What to Avoid
- ❌ Simple yes/no questions without meaningful options
- ❌ Questions like "Did you read and understand this section?"
- ❌ Exercises with only 2 options (unless testing binary concepts)
- ❌ Exercises that don't test actual grammar knowledge
- ❌ “Answer-giving” option labels like `"(correct)"`, `"(incorrect…)"`, or `"(wrong…)"` — don’t explain correctness inside the choices

## Implementation Constraints (How Answers Are Checked)

The UI checks answers with a simple normalization:
- Lowercases the user answer
- Trims whitespace
- Collapses multiple spaces into one

It does **not** strip punctuation. That means:
- Prefer short expected answers like `to work`, `working`, `was`, `were`, `because`
- Avoid making the expected answer include periods/commas/quotes unless you also add variants
- If multiple answers are reasonable, include:
  - `expectedAnswer`: one “best” canonical answer (also shown in feedback UI)
  - `expectedAnswers`: acceptable variants (contractions, spacing, common punctuation-free variants)

Radio items must match exactly:
- `expectedAnswer` must equal one of the option `value`s (not the label)

## ID Conventions (Important)

Exercise `id` is used as a stable key for storing answers and completion. Always include it, and keep it unique.

Recommended pattern:
- `id: "<topic>-<section-id>-<number>"`

Examples:
- `id: "passive-voice-introduction-1"`
- `id: "reported-speech-backshift-1"`

## Recommended Exercise Structure Per Section

Aim for **one** exercise block per section:
- 1 exercise object
- 3–5 items inside it
- Mix item types when helpful (radio + text is a good default)

If the section is a short reference table, it’s OK to add a quick 2–3 item “spot the rule” check.

## High-Value Exercise Patterns (Use These Often)

- **Choose the correct sentence** (same meaning, different form)
- **Error spotting** (pick the sentence with the grammar mistake)
- **Meaning choice** (same structure, different meaning/implication)
- **Form choice** (choose the correct auxiliary / verb form)
- **Time expression match** (choose which tense fits: “yesterday”, “right now”, “for 3 years”, etc.)
- **Transformation** (rewrite with the target structure, but keep the meaning)
- **Word order** (great for question formation, adverbs, negation, reported speech)

## Common “Wrong Answer” Sources (Make Distractors Realistic)

When writing wrong options, make them errors learners actually make:
- Missing auxiliary (`He going to work`)
- Wrong tense marker (`Yesterday I go`)
- Wrong word order in questions (`Where you are going?`)
- Wrong infinitive/gerund choice (`I enjoy to cook`)
- Overusing one form (`will` everywhere, or `to` everywhere)

## Priority Order

1. **Introduction sections** - First section of each grammar file (highest priority)
2. **Key concept sections** - Sections explaining main grammar rules (high priority)
3. **Usage/meaning sections** - Sections explaining when to use the grammar (medium-high priority)
4. **Form sections** - Sections explaining how to form the grammar (medium priority)
5. **Summary/reference sections** - Quick reference guides (lower priority, but still add if missing)

## How to Check Progress

Run this command to see current status:
```bash
node scripts/check-exercises.js
```

This will show:
- Total sections with/without exercises
- Percentage coverage
- List of files with missing exercises
- Specific sections missing exercises

## Example Exercise Format

```typescript
exercises: [
    {
        id: "unique-exercise-id",
        title: "Practice: [What Students Are Practicing]",
        instructions: "Clear instructions on what to do.",
        items: [
            {
                type: "radio",
                label: "Question or sentence to analyze",
                options: [
                    { value: "correct", label: "Correct answer with explanation" },
                    { value: "wrong1", label: "Plausible wrong answer" },
                    { value: "wrong2", label: "Another plausible wrong answer" },
                ],
                expectedAnswer: "correct",
            },
            // Add 2-3 more items per exercise
        ],
    },
]
```

## Quick Schema Cheat Sheet (What Fields Exist)

Exercise items can be:

- `type: "text"`
  - `label: string`
  - `expectedAnswer?: string` (shown to learners on incorrect)
  - `expectedAnswers?: string[]` (acceptable variants)
  - `placeholder?: string` (optional)
- `type: "select"`
  - `label: string`
  - `options: string[]`
  - `expectedAnswer?: string` (must match an option string)
  - `expectedAnswers?: string[]` (rare; only if you intentionally allow variants)
- `type: "radio"`
  - `label: string`
  - `options: Array<{ value: string; label: string }>`
  - `expectedAnswer?: string` (must match an option `value`)
- `type: "word-scramble"`
  - `label: string`
  - `words: string[]`
  - `correctAnswer: string`
  - `hint?: string`

## Mini Checklist (Before Moving On)

- Every targeted section has an `exercises: [...]` array (not empty).
- Each section has 1 exercise with 3–5 items (unless it’s truly a tiny reference).
- Every item has an `expectedAnswer` (and `expectedAnswers` when needed).
- Every radio item has **3+** options and the wrong options are realistic.
- Examples match the tone rules in `docs/grammar-activity-style-guide.md`.

## Files to Focus On

Based on the audit, these files have the most missing exercises:
- `paragraph-format.ts` - 14 sections missing
- `reported-speech.ts` - 14 sections missing
- `imperatives-declaratives.ts` - 13 sections missing
- `passive-voice.ts` - 13 sections missing
- `punctuation-capitalization.ts` - 13 sections missing
- `used-to-would-rather.ts` - 13 sections missing
- `verbs-plus-gerunds.ts` - 13 sections missing
- `gerunds-prepositions.ts` - 9 sections missing
- `infinitives-vs-gerunds.ts` - 9 sections missing
- `continuous-tenses-review.ts` - 9 sections missing
- `simple-tenses-review.ts` - 9 sections missing

## Instructions

1. Check current status using the script
2. Focus on introduction sections first, then key concept sections
3. Add exercises that test understanding, not just comprehension
4. Ensure each exercise has 3+ meaningful options
5. Use real-world contexts relevant to ESOL learners
6. After adding exercises, verify with the check script
7. Continue until all sections have exercises (or reach 100% coverage)

## Notes

- Some sections may be summary/reference sections that don't need exercises - use judgment
- Introduction sections should ALWAYS have exercises
- Key concept sections explaining grammar rules should have exercises
- Practice sections already have exercises - don't duplicate

## Suggested Work Loop (Fast + Safe)

1. Run `node scripts/check-exercises.js` and pick one file with many missing sections.
2. In that file, add exercises to 3–6 missing sections per pass (small batches are easier to review).
3. Re-run the check script to confirm the missing count drops.
4. If you add text answers, quickly scan for punctuation-sensitive expected answers and add variants as needed.
