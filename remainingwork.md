# Remaining Work: Grammar Exercise Visual Emphasis

## ✅ Completed (January 13, 2026)

### Infrastructure (100% Complete)
All the code infrastructure is ready and working:

1. **Exercise Components Updated** - All exercise rendering components now support HTML with sanitization:
   - [src/components/grammar-reader/exercises/SelectExercise.tsx](src/components/grammar-reader/exercises/SelectExercise.tsx)
   - [src/components/grammar-reader/exercises/RadioExercise.tsx](src/components/grammar-reader/exercises/RadioExercise.tsx)
   - [src/components/grammar-reader/exercises/TextInputExercise.tsx](src/components/grammar-reader/exercises/TextInputExercise.tsx)

2. **CSS Color Classes Added** - [src/app/globals.css](src/app/globals.css) lines 747-780:
   - `.eg-helper` (purple #6d28d9) - for modals and helper verbs
   - `.eg-verb` (orange #c2410c) - for main verbs
   - `.eg-superlative` (amber #d97706) - for superlative forms
   - `.eg-quantifier` (emerald #059669) - for quantifiers (much/many, less/fewer)
   - `.eg-comparative` (cyan #0891b2) - for comparative forms

3. **Sample Content Updated** - 2 guides completed as examples:
   - [src/content/grammar/superlatives-quantifiers.ts](src/content/grammar/superlatives-quantifiers.ts) - Lines 46, 55, 85, 94
   - [src/content/grammar/modals-obligation-permission.ts](src/content/grammar/modals-obligation-permission.ts) - Lines 52, 62

## 📊 Priority Order

**High Priority (verb tenses - used most frequently by students):**
1. `past-simple.ts`
2. `present-perfect.ts`
3. `present-continuous.ts`
4. `past-continuous.ts`
5. `future-simple.ts`

**Medium Priority (common grammar topics):**
6. `conditionals-zero-first.ts`
7. `conditionals-second.ts`
8. `passive-voice.ts`
9. `infinitives-vs-gerunds.ts`
10. `reported-speech.ts`

**Lower Priority (review guides and specialized topics):**
11-33. All remaining files

## ✅ Progress Checklist

Use this to track each guide as you update it (visual emphasis + fresh exercises + 15-question mini quiz).

### Completed
- [x] `superlatives-quantifiers.ts`
- [x] `modals-obligation-permission.ts`
- [x] `past-simple.ts`
- [x] `present-perfect.ts`
- [x] `present-continuous.ts`
- [x] `past-continuous.ts`
- [x] `future-simple.ts`
- [x] `conditionals-zero-first.ts`
- [x] `conditionals-second.ts`
- [x] `passive-voice.ts`
- [x] `infinitives-vs-gerunds.ts`
- [x] `reported-speech.ts`
- [x] `conditionals-review.ts`
- [x] `workplace-phrasal-verbs.ts`
- [x] `all-verb-tenses-overview.ts`
- [x] `parts-of-speech.ts`
- [x] `punctuation-capitalization.ts`
- [x] `future-conditional.ts`
- [x] `verbs-plus-gerunds.ts`
- [x] `used-to-would-rather.ts`
- [x] `paragraph-format.ts`

### Remaining (Lower Priority)
- [ ] `imperatives-declaratives.ts`
- [ ] `continuous-tenses-review.ts`
- [ ] `future-continuous.ts`
- [ ] `future-perfect-continuous.ts`
- [ ] `future-perfect.ts`
- [ ] `gerunds-prepositions.ts`
- [ ] `information-questions.ts`
- [ ] `past-perfect-continuous.ts`
- [ ] `past-perfect.ts`
- [ ] `perfect-continuous-tenses-review.ts`
- [ ] `perfect-tenses-review.ts`
- [ ] `present-perfect-continuous.ts`
- [ ] `present-simple.ts`
- [ ] `simple-tenses-review.ts`

## 📋 Remaining Work: Content Updates

### Files to Update (15 grammar guides)

The following grammar guide files need their exercise labels updated with color-coded emphasis spans:

```
src/content/grammar/
├── paragraph-format.ts
├── imperatives-declaratives.ts
├── continuous-tenses-review.ts
├── future-continuous.ts
├── future-perfect-continuous.ts
├── future-perfect.ts
├── gerunds-prepositions.ts
├── information-questions.ts
├── past-perfect-continuous.ts
├── past-perfect.ts
├── perfect-continuous-tenses-review.ts
├── perfect-tenses-review.ts
├── present-perfect-continuous.ts
├── present-simple.ts
├── simple-tenses-review.ts
└── (Completed already: superlatives-quantifiers.ts, modals-obligation-permission.ts, past-simple.ts, present-perfect.ts, present-continuous.ts, past-continuous.ts, future-simple.ts, conditionals-zero-first.ts, conditionals-second.ts, passive-voice.ts, infinitives-vs-gerunds.ts, reported-speech.ts, conditionals-review.ts, workplace-phrasal-verbs.ts, all-verb-tenses-overview.ts, parts-of-speech.ts, punctuation-capitalization.ts, future-conditional.ts, verbs-plus-gerunds.ts, used-to-would-rather.ts)
```

### Diversify Exercises & Mini Quizzes

Since students are seeing the explanation sentences before they work the exercises, we now need to **write new practice sentences** for every exercise and keep the quiz options fresh. Follow the new pattern:

1. **Contextualize locally** (avoid travel or experiences students can’t access). In `src/content/grammar/present-perfect.ts` we now talk about East Boston Harborwalk/Blue Line, neighborhood gardens, housing renewals, and work badges instead of Paris, Madrid, or Japan.
2. **Change the verbs/outcomes** so the exercise sentences don’t repeat what’s in the explanation. Each exercise should feel like a new example even if it tests the same idea.
3. **Expand every mini quiz to 15 thoughtful questions** that vary across meaning, time expressions (for/since/ever/never), question forms, negative forms, and result-based situations. The updated mini quiz in `src/content/grammar/present-perfect.ts` shows how to do this while keeping the difficulty aligned with what the guide just taught.
4. **Pair new quiz items with contextual explanations** (even short ones) so teachers/students immediately see why the correct answer works.

Apply these same rules when you touch another guide—pick new situations, avoid repeating the explanation text, and grow the mini quiz before reviewing with students.

### What to Look For

Most exercises are **fill-in-the-blank** format and don't need highlighting. Focus on these patterns:

#### Pattern 1: "Quick Check" Introduction Exercises
These typically appear early in each guide and ask students to identify grammar types.

#### Pattern 2: Complete Sentence Examples
Some exercises present complete sentences where students analyze grammar usage.

**Example (from superlatives-quantifiers.ts):**
```typescript
// BEFORE:
label: "This is the cheapest apartment I found."

// AFTER:
label: "This is <span class='eg-superlative'>the cheapest</span> apartment I found."
```

**Example (from past-simple.ts line 138):**
```typescript
// BEFORE:
label: '"My daughter graduated from college in May 2023."'

// AFTER:
label: '"My daughter <span class='eg-verb'>graduated</span> from college in May 2023."'
```

### Which CSS Class to Use

| Grammar Concept | CSS Class | Color | Example |
|----------------|-----------|-------|---------|
| Modals (must, can, may, could, should, would, might) | `eg-helper` | Purple | `<span class='eg-helper'>must</span>` |
| Helper verbs (have, has, had, will, do, does, did, am, is, are) | `eg-helper` | Purple | `<span class='eg-helper'>have</span>` |
| Main verbs (action verbs, past tense, etc.) | `eg-verb` | Orange | `<span class='eg-verb'>graduated</span>` |
| Superlatives (cheapest, best, most expensive) | `eg-superlative` | Amber | `<span class='eg-superlative'>the cheapest</span>` |
| Quantifiers (much/many, less/fewer, most/least) | `eg-quantifier` | Green | `<span class='eg-quantifier'>less</span>` |
| Comparatives (cheaper, better, more expensive) | `eg-comparative` | Cyan | `<span class='eg-comparative'>cheaper</span>` |
| Subjects (when teaching subject identification) | `eg-subject` | Blue | `<span class='eg-subject'>She</span>` |
| Punctuation marks (.,?!,"", apostrophes) | `eg-punctuation` | Teal | `<span class='eg-punctuation'>,</span>` |
| Capitalization targets | `eg-capital` | Rose | `<span class='eg-capital'>Boston</span>` |

### Process for Updating Each File

1. **Open the grammar guide file** in your editor
2. **Search for exercises** - Look for `exercises: [` blocks
3. **Find exercise labels** with complete sentences (not fill-in-the-blank)
4. **Identify the grammatical element** to highlight
5. **Wrap it in the appropriate span** with CSS class
6. **Test in browser** to verify colors appear correctly

### Estimated Time

- **Per file:** 5-15 minutes (depending on number of exercises)
- **Total:** 2-4 hours for all 33 files

Most files will only have 1-3 exercises that need updating (typically just the intro "Quick Check" exercises).

## 🔧 How to Resume This Work

### Step 1: Pick a File
Start with verb tense guides since they're likely to have the most examples:
- `past-simple.ts` (already identified as having complete sentences)
- `present-perfect.ts`
- `past-continuous.ts`
- `present-continuous.ts`

### Step 2: Search for Exercise Labels
Use grep to find exercises with complete sentences:
```bash
grep -n "label:" src/content/grammar/past-simple.ts | grep -v "___"
```

This shows exercise labels that don't have blanks (___), which are the ones that need highlighting.

### Step 3: Update Labels
Follow the pattern from completed files:

```typescript
// Pattern: Wrap the key grammatical element in a span
label: "Subject <span class='eg-CLASS'>ELEMENT</span> rest of sentence."
```

### Step 4: Test
Start the dev server and navigate to the grammar guide:
```bash
npm run dev
# Visit: http://localhost:3000/teacher/grammar/GUIDE_NAME
```

Verify that:
- The grammatical element is colored correctly
- The color makes sense for the grammar concept
- It's not overwhelming or distracting

## 🎯 Success Criteria

When complete, all grammar guide "Quick Check" and complete-sentence exercises should:
- ✅ Have grammatical elements color-coded for easy identification
- ✅ Use semantically correct CSS classes (eg-verb for verbs, eg-helper for modals, etc.)
- ✅ Not overwhelm students with too many colors in one sentence
- ✅ Help students immediately identify what grammatical element they're analyzing

## 📝 Notes

- **TypeScript compiles successfully** - No errors in the current implementation
- **Sanitization is working** - All HTML is properly sanitized via DOMPurify
- **Example guides are ready** - Reference superlatives-quantifiers.ts and modals-obligation-permission.ts for patterns
- **Fill-in-the-blank exercises don't need updating** - Only complete sentence examples need highlighting

## 🚀 Future Enhancements (Optional)

Once all content is updated, consider:
1. **Legend/Key** - Add a legend showing what each color represents (could be in a tooltip or help section)
2. **Toggle** - Allow students to toggle highlighting on/off if they find it distracting
3. **Accessibility** - Add ARIA labels for screen readers to announce the highlighted elements
4. **Consistency Check** - Script to verify all grammar concepts use the correct CSS classes

---

**Last Updated:** January 14, 2026
**Status:** Infrastructure complete, 20/35 guides updated, 15 guides remaining
**Next Step:** Update paragraph-format.ts
