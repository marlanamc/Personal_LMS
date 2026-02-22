# Guide Creation README

This document defines the non-negotiable requirements for creating or updating interactive guides in:

- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/grammar`
- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/personal` (coding guides: `coding-*.ts`)

## Mini Quiz Requirements (Required)

Every grammar and coding guide must end with a `miniQuiz` that is:

- 10 to 20 questions total (inclusive).
- Comprehensive for the guide content (cover the main forms, meanings, and common mistakes from the guide).
- Built with clear answer explanations for every question.

## Comprehensive Coverage Standard

A mini quiz is considered comprehensive when it checks the core things students must control after finishing the guide:

- Form/structure (how to build the grammar correctly).
- Meaning/usage (when and why to use that form).
- Error recognition/correction (common learner mistakes).
- Context use (realistic situations aligned to the guide topic).

Use a balanced mix of question types and prompt styles so the quiz does not only test one narrow skill.

## Enforcement

Mini quiz compliance is validated by:

- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/scripts/check-guide-mini-quizzes.ts` (checks grammar + coding guides)

Run it directly with:

```bash
npm run check:guide-mini-quizzes
```

It also runs automatically during `npm run prebuild`.
