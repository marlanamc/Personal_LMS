# Spanish Course Audit (A1-C2)

Date: February 25, 2026
Repo: `/Users/marlanacreed/Downloads/Projects/Personal_LMS`

## Progress tracker (update each iteration)

- [x] Consolidate learner-facing path by hiding legacy Spanish game overlaps.
- [x] Add CEFR course-map scaffold (`src/content/spanish/course-map.ts`).
- [x] Add B1-C2 Spanish-only QA gate (`npm run check:spanish-b1-language`).
- [x] Bring all existing Spanish guide mini quizzes to 10-question minimum.
- [x] Add A2 bridge guide: comparatives/superlatives.
- [x] Add A2 bridge guide: commands (tú/usted + polite requests).
- [x] Add A2 bridge guide: direct/indirect object pronoun basics.
- [x] Refine/trim overlap between restaurant guide and everyday phrase vocab set.
- [x] Start B1 Spanish-only guide set (present perfect first).
- [x] Add per-guide challenge/comprehensiveness checklist for authoring QA.
- [x] Add next B1 Spanish-only guide (subjuntivo introductorio).
- [x] Add B1 integrated assessment pack (lectura + escritura + mini proyecto).
- [x] Add B1 Spanish-only guide: conectores discursivos y argumentación breve.
- [x] Add B1 assessment rubric metadata (coherencia, precisión gramatical, alcance léxico).

### B2-C2 planning backlog

- [x] B2 guide: subjuntivo en cláusulas sustantivas y adjetivas (uso avanzado).
- [x] B2 guide: contraste fino de tiempos (indicativo/subjuntivo en discurso académico-laboral).
- [x] B2 guide: voz pasiva e impersonales con `se` en textos formales.
- [x] B2 integrated assessment: síntesis de lectura + audio + respuesta argumentada.
- [x] C1 guide: control de registro (formal, semiformal, cercano) con reescritura.
- [x] C1 guide: conectores avanzados y organización de discurso persuasivo.
- [x] C1 production lab: ensayo breve con revisión por criterios.
- [x] C2 guide: matices pragmáticos, intención y tono en contextos complejos.
- [x] C2 precision lab: corrección de errores sutiles y reformulación de alta precisión.
- [x] C2 capstone: simulación profesional/académica integrada (lectura, escritura, exposición).
- [x] C1 guide (special track): español para docentes ESOL con enfoque contrastivo aplicado.

## Current quality check (A1-C2, implemented state)

Overall status: high-quality and substantially complete in structure.  
The course now has a full A1-C2 guide path with seeded content and progression mapping.

Current implemented scope (from registry/seed):
- Total Spanish guides: **28**
- Level distribution:
  - A1: 4
  - A1-A2: 2
  - A2: 8
  - B1: 4
  - B2: 4
  - C1: 3
  - C2: 3

What is now strong:
1. Curriculum coverage
- A1-C2 path exists with explicit guide IDs, CEFR-level labeling, and seeded registration.
- Major B1-B2 grammar gaps previously identified are now filled in guide form.
- C1 and C2 advanced production/pragmatics tracks are now present.

2. Quality controls and consistency
- B1+ Spanish-only gate is active and passing.
- Guide mini quizzes are standardized to 10+ items (including new B1-C2 guides).
- CEFR course map and authoring QA checklist are in place.

3. Redundancy reduction
- Legacy overlap has been reduced in learner-facing pathways.
- Restaurant/everyday phrase overlap was trimmed to reduce repetition.

Remaining high-impact gaps to close:
1. Listening infrastructure (major)
- Current “audio” tasks are mostly transcript/simulated.
- Need real audio assets, graded listening sets, and item-level listening diagnostics by CEFR band.

2. Speaking assessment systemization
- Speaking prompts and production tasks exist, but rubric-driven speaking progression is not yet fully operational across B1-C2.
- Need explicit oral scoring descriptors aligned to coherence, interactional control, pronunciation/fluency, and pragmatic appropriateness.

3. CEFR can-do mastery checkpoints
- Course map exists, but mastery gates are still content-centric, not yet competency-verified.
- Need checkpoint packs per level/sublevel (e.g., A2 exit, B1 exit, B2 exit) with pass criteria.

4. Spiral review scheduling
- Coverage breadth is now strong, but recurrence loops are not formalized.
- Need planned review cycles where earlier forms reappear in higher-level communicative tasks.

5. Analytics + progression telemetry
- Need objective-level analytics to detect weak spots (not only completion).
- Recommended: track per-objective accuracy, retry frequency, and time-to-mastery by CEFR objective ID.

## Gap-closing suggestions (next phase)

1. Build a listening pack pipeline
- Add dedicated audio seed flow and asset manifest by CEFR level.
- Start with B1-B2 listening modules tied to existing integrated assessments.

2. Add speaking rubrics to metadata
- Extend rubric metadata (already started for B1 writing) to speaking tasks.
- Define 4-band rubric per CEFR level for oral production.

3. Implement CEFR exit checkpoints
- Create A2, B1, B2, C1, C2 checkpoint activities with explicit pass thresholds.
- Gate next-level recommendations on checkpoint outcomes.

4. Add spiral-review objective links
- Tag each new higher-level guide with prerequisite objective IDs and “review-of” objective IDs.
- Auto-surface targeted review tasks when errors cluster on older objectives.

5. Add performance dashboard for Spanish track
- Instructor-facing and learner-facing views: objective mastery heatmap, weak-skill alerts, and recommended next tasks.

## Scope and method
- Audited Spanish content from source files and seed scripts:
  - `src/content/spanish/guides/*`
  - `src/content/spanish/vocabulary/*`
  - `src/content/spanish/registry.ts`
  - `prisma/seed-spanish-guides.ts`
  - `prisma/seed-spanish-games.ts`
  - `prisma/seed-personal-games.ts` (legacy Spanish items)
- Could not verify live DB inventory because Prisma could not connect to `localhost:5432`; findings are based on repo source of truth.

---

## 1) What you currently have

### Inventory summary
- Spanish guides: **11**
- Core Spanish games/activities: **15**
  - Vocabulary sets: 6
  - Numbers games: 3
  - Verb games: 6
- Legacy Spanish games still in registry: **5**
- Total Spanish IDs in registry: **31**

### Guide coverage now (mostly A1-A2)
- A1-heavy foundations:
  - Alphabet/pronunciation
  - Noun gender/articles
  - Present tense
  - Ser vs estar
  - Adjective agreement
  - Question words/basic sentence building
- A2 coverage:
  - Preterite
  - Imperfect
  - Immediate future (ir + a)
  - Reflexive routine verbs
  - Restaurant conversations

### Vocabulary/game coverage now
- Strong beginner lexical base: greetings, numbers, colors/shapes, family, common verbs, everyday phrases.
- Strong beginner mechanical practice: present/preterite verb drills and numbers games.
- Very little integrated practice by skill (reading/listening/writing/speaking progression) beyond guided exercises.

---

## 2) What is overlapping / repetitive

### High-overlap items to consolidate
1. `spanish-common-verbs-flashcards` (legacy) vs `spanish-vocab-verbs` (core)
- Legacy has 20 verbs; core set has 41 verbs.
- Approx overlap: **19/20** legacy verbs already present in core vocab.
- Recommendation: retire legacy verbs flashcards or convert to a "review mode" that references the core verb bank.

2. `spanish-numbers-flashcards` (legacy) vs `spanish-vocab-numbers` + numbers games
- Legacy 1-20 is subsumed by core numbers vocab (0-100) plus dedicated numbers games.
- Approx overlap: **19/20** legacy numbers already in core numbers set.
- Recommendation: retire legacy numbers flashcards.

3. Restaurant phrase overlap
- `spanish-restaurant-conversations-guide` overlaps significantly with restaurant cards in `spanish-vocab-everyday`.
- Recommendation: keep guide as scenario training and trim duplicated phrase cards from everyday set, or tag those cards as "supports restaurant guide" and avoid reteaching full explanations in both places.

4. Ser/estar duplicated in multiple places
- Full guide + verb irregular practice + legacy `spanish-ser-estar-fill-blank`.
- Recommendation: keep one core lesson (`ser-vs-estar-guide`) and redesign others as short mastery checkpoints with fewer duplicate explanations.

### Structural repetition causing maintenance drag
- Two parallel systems for Spanish games: core (`seed-spanish-games.ts`) and legacy (`seed-personal-games.ts`), both surfaced in registry and dashboard.
- In dashboard category filters, vocabulary captures IDs with `vocab` or `flashcard`, so legacy and core frequently appear together.
- Recommendation: deprecate legacy Spanish IDs from active learner path; keep only if needed for migration/admin.

### Quality inconsistency to fix now
- Guide mini quiz policy requires **10-20** questions (`docs/GUIDE_CREATION_README.md`).
- Current Spanish guides with ~6-question mini quizzes (below policy):
  - `spanish-alphabet-pronunciation.ts`
  - `spanish-immediate-future.ts`
  - `spanish-imperfect-tense.ts`
  - `spanish-noun-gender-articles.ts`
  - `spanish-question-words-sentences.ts`
  - `spanish-reflexive-verbs-routines.ts`

---

## 3) What is missing for a true A1-C2 course

Right now the track is effectively **A1-A2 only**. To be a proper A1-C2 program, these are the major missing blocks.

### A1 missing (foundational gaps)
- Present tense of high-frequency irregulars as separate mastery path (not just inside one guide)
- Core prepositions (`a`, `de`, `en`, `con`, `para`, `por`) basics
- Possessives and demonstratives
- Basic object pronouns (`lo/la`, `me/te`) intro
- Core listening/phonics discrimination activities beyond alphabet

### A2 missing (bridge gaps)
- Periphrasis: `tener que`, `hay que`, `acabar de`, `volver a`
- Comparative/superlative grammar (`más que`, `menos que`, `tan...como`, `el más...`)
- Command forms (affirmative tú/usted)
- Direct + indirect object pronouns in common frames
- More practical domain units: housing, health, travel logistics, work/school routines

### B1 missing (major gap)
- Present perfect (`he comido`) and contrast with preterite/imperfect
- Future simple, conditional simple
- Introduction to subjunctive (wishes, recommendations, doubt)
- Relative clauses (`que`, `quien`, `lo que`) in connected discourse
- Paragraph-level writing and intermediate reading/listening units

### B2 missing
- Full subjunctive system (present + imperfect) in dependent clauses
- Sequence of tenses, discourse connectors, argumentation language
- Passive/impersonal structures (`se`, passive voice)
- Register control (formal/informal, regional variation awareness)
- Multi-source reading/listening tasks and summarization

### C1 missing
- Advanced clause compression and style variation
- Nuanced modality and stance (hedging, certainty, persuasion)
- Idiomatic collocations and phraseology at scale
- Long-form writing with revision rubrics
- Advanced listening with note-taking/synthesis tasks

### C2 missing
- Near-native precision tasks (error diagnosis, rewriting for register/tone)
- Deep sociolinguistic range (dialects, pragmatic intent)
- Professional/academic domain performance simulations
- Capstone assessments integrating all four skills under time pressure

---

## 4) Recommended consolidation model (so overlap is easy to manage)

### Core principle
Use **one canonical lesson per grammar/vocab objective**, then attach multiple practice activities to that objective instead of creating new standalone content that reteaches the same thing.

### Suggested structure
1. `Guide` (teach concept once)
2. `Controlled practice` (drill)
3. `Context practice` (scenario/dialogue)
4. `Skill task` (reading/listening/speaking/writing)
5. `Mastery check` (short assessment)

### Content architecture improvements
- Add a `spanishCourseMap` (A1-C2) with:
  - level
  - module
  - objective IDs
  - prerequisite IDs
  - canonical guide ID
  - attached practice IDs
- Add tags on activities: `objective`, `skill`, `domain`, `grammarFocus`, `cefr`.
- Prevent duplicate objective creation by requiring objective ID linkage before merge.

---

## 5) Proposed A1-C2 roadmap (practical and buildable)

### Phase 1 (stabilize current A1-A2 in 2-3 weeks)
- Remove/deprecate redundant legacy Spanish games from learner-facing path.
- Expand all Spanish mini quizzes to 10-20 questions for consistency.
- Add missing A1/A2 essentials:
  - Possessives/demonstratives
  - Comparatives/superlatives
  - Commands basics
  - Core pronouns sequence

### Phase 2 (build B1 foundation in 4-6 weeks)
- New guide cluster:
  - Present perfect
  - Future simple
  - Conditional simple
  - Subjunctive intro
- Add first serious writing and reading tracks with rubrics and progression.

### Phase 3 (B2 in 6-8 weeks)
- Full subjunctive pathway + discourse management.
- Listening and reading sets with authentic/semi-authentic texts.
- Argumentation and summary writing modules.

### Phase 4 (C1-C2 in 8-12 weeks)
- Advanced production and refinement modules.
- Professional/academic simulation units.
- End-to-end capstones per level with assessment criteria.

---

## 6) Language-of-instruction policy (new requirement)

This should be enforced as a hard rule across new content:

- A1-A2: Spanish content with scaffolded support in English where needed.
- B1-C2: **Spanish-only** guides, instructions, hints, feedback, and assessments.

Implementation notes:
- Transition point starts immediately after A2 completion.
- For B1+, keep support through simplification, examples, and glosses in Spanish (not English translation blocks).
- Keep UI chrome labels as-is if needed for platform consistency, but all pedagogical text should be Spanish-only from B1 onward.

---

## 7) Exercise rigor standard (new requirement)

For B1-C2, exercises should be both challenging and comprehensive by design:

- Minimum mix per guide:
  - controlled form practice
  - meaning/usage discrimination
  - error correction
  - production task (written and/or spoken)
  - integrated comprehension (reading/listening prompt + response)
- Difficulty progression inside each guide:
  - start with constrained accuracy
  - move to open-ended output
  - end with time/complexity pressure
- Coverage rule:
  - every major point in the guide must appear in at least 2 exercise contexts.
- Assessment rule:
  - mini quiz remains 10-20 questions, but at B1+ at least half should be scenario/context-based instead of isolated sentence items.

---

## 8) Immediate priority list (highest ROI)

1. Consolidate overlaps now
- Deprecate or hide:
  - `spanish-common-verbs-flashcards`
  - `spanish-numbers-flashcards`
  - (possibly) `spanish-verb-conjugation-matching` if replaced by core verb drills

2. Bring all guides into policy compliance
- Upgrade mini quizzes in the 6 under-length guides to 10-20 questions.

3. Fill A2 bridge holes before adding B1+
- Commands, comparatives/superlatives, pronoun handling, key periphrastic structures.

4. Add B1+ Spanish-only enforcement to content QA
- Add a checklist gate so any B1-C2 guide fails review if pedagogical text is not Spanish-only.

5. Build a formal CEFR map file
- Define explicit A1-C2 objectives so new material always maps to a gap, not an overlap.

---

## Bottom line
You already have a strong **A1-A2 starter course** with good interactive momentum. The biggest improvements are:
- consolidate duplicate legacy content,
- enforce uniform assessment quality,
- and build a structured CEFR objective map before expanding into B1-C2.

That combination will let you scale content confidently without duplication while turning this into a real comprehensive Spanish program.
