# Spanish Integration and Upgrade Plan

This document tracks implementation of integration, spiral review, new guides (Present Progressive, Obligation, Travel), Intermediate/Advanced depth, and scenario guides.

## 1. Integration (grammar ↔ vocab, spiral review) — DONE

### Links between guides and vocabulary
- **Course map** (`src/content/spanish/course-map.ts`): Add `relatedVocabIds?: string[]` and `recyclesObjectives?: string[]` to `SpanishCourseObjective`.
- **GrammarReader**: Add "Related practice" section showing linked vocab activities and verb games from course-map.
- **Spiral review**: Add `recyclesObjectives` so guides surface "Review" callouts (e.g., "Before this, review: Present Tense").

### Implementation
- [x] Extend `SpanishCourseObjective` with `relatedVocabIds`, `recyclesObjectives`
- [x] Populate key objectives with links
- [x] Add `RelatedPracticeSection` component to GrammarReader

## 2. New guides: Present Progressive, Obligation, Travel — DONE

### Present Progressive (estar + gerundio)
- **Guide ID:** `spanish-present-progressive-guide`
- **Tier:** Basics (after Present Tense, before Immediate Future)
- **Content:** estar + -ando/-iendo, irregular gerunds (leyendo, durmiendo, pidiendo), contrast with simple present
- **Placement:** After adjective agreement, before immediate future

### Obligation / Necessity (tener que, deber, necesitar)
- **Guide ID:** `spanish-obligation-necessity-guide`
- **Tier:** Basics (after Commands)
- **Content:** tener + que + infinitive, deber + infinitive, necesitar + infinitive, contrast in strength
- **Placement:** After commands, before object pronouns

## 3. Intermediate/Advanced depth

- Add more demanding tasks (longer production, nuanced reformulation)
- Increase use of register, complex subordination, pragmatic nuance
- Focus on: subjunctive-clauses, contrast-tiempos, register-control, matices-pragmaticos

## 4. Scenario guides

- **Travel:** `spanish-travel-conversations-guide` — DONE. Airports, hotels, directions, emergencies.
- **Health:** `spanish-health-conversations-guide` – pharmacy, doctor, symptoms
- **Work:** `spanish-work-conversations-guide` – meetings, email, small talk
- **Family:** `spanish-family-conversations-guide` – family members, descriptions, celebrations

Priority order: Travel, Health (most useful for learners).
