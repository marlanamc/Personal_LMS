# Points Menu

## Core point constants
| Constant | Points | Notes |
| --- | --- | --- |
| `POINTS.QUIZ_PERFECT_SCORE` | 15 | 100% on a scored quiz earns the full reward. |
| `POINTS.QUIZ_HIGH_SCORE` | 10 | 90–99% on a scored quiz. |
| `POINTS.QUIZ_GOOD_SCORE` | 5 | 80–89% on a scored quiz. |
| `POINTS.QUIZ_PASSING_SCORE` | 2 | 70–79% on a scored quiz. |
| `POINTS.FLASHCARDS` | 4 | Complete all cards (must flip every card). |
| `POINTS.MATCHING_GAME` | 5 | Match every pair (e.g., Countable vs Uncountable Nouns rounds). |
| `POINTS.FILL_IN_BLANK` | 7 | Answer every blank in the activity. |
| `POINTS.NUMBERS_GAME_EASY` | 3 | Basic/round numbers rounds. |
| `POINTS.NUMBERS_GAME_MEDIUM` | 5 | Hundreds and ordinal rounds. |
| `POINTS.NUMBERS_GAME_MEDIUM_HARD` | 7 | Thousands and ten-thousands. |
| `POINTS.NUMBERS_GAME_HARD` | 10 | Hundred thousands and larger. |
| `POINTS.NUMBERS_GAME_PERFECT_*` | +2–7 | Perfect accuracy bonus layered on each difficulty. |
| `POINTS.NUMBERS_GAME_HIGH_*` | +1–4 | ≥90% accuracy bonus layered on each difficulty. |
| `POINTS.GRAMMAR_GUIDE` | 10 | Guides with exercises; standardized award after completion. |
| `POINTS.SPEAKING_ACTIVITY` | 6 | Warm-up style speaking + reflection activities. |
| `POINTS.ACTIVITY_COMPLETION` | 3 | Fallback for unknown or miscellaneous games. |
| `POINTS.DAILY_STREAK` | 3 | Day-to-day consistency bonus (requires positive-point activity). |
| `POINTS.WEEKLY_STREAK` | 25 | Added every 7th day of a streak. |
| `POINTS.ACHIEVEMENT_BONUS` | 50 | Reserved for milestone bonuses (unused directly). |

## Activity point mapping
- `getActivityPoints(activity.type, activity)` resolves to the table above via the `activity.ui` hint (or `resolveActivityGameUi` content fallback). Flashcard, matching, fill-in-the-blank, and numbers rounds map directly to their constants so the ledger awards the right base points even if IDs or titles change, and unknown games default to `POINTS.ACTIVITY_COMPLETION`.
- Numbers game progress is reported per category; the API route makes a pass on the category string to assign difficulty and accuracy bonuses before calling `awardPoints`. Categories are drawn from the numbers game content (basic numbers, round numbers, hundreds, ordinal, one thousand to ten thousand, ten thousands, hundred thousands, millions, billions, trillions, all cardinal numbers, years), and the route maps them to easy/medium/medium-hard/hard buckets with the bases listed above plus perfect/high accuracy bonuses (e.g., easy perfect = 3+2, medium-high = 5+2, hard perfect = 10+7).
- Quiz submissions skip `getActivityPoints` and instead use `calculateQuizPoints(score)`: 100% → 15, 90–99% → 10, 80–89% → 5, 70–79% → 2, below 70% → 0.
- Grammar guides resolve to `POINTS.GRAMMAR_GUIDE = 8`, and speaking activities resolve to `POINTS.SPEAKING_ACTIVITY = 6`. Unrecognized activities default to `POINTS.ACTIVITY_COMPLETION = 3`, keeping the ledger consistent even for new content.
- Every `awardPoints` invocation increments both `points` and `weeklyPoints`, then logs a ledger entry with the given reason before returning the updated user record.

## Countable vs Uncountable Nouns matching game
- Imported via `scripts/import/import-countable-uncountable-game.ts`, the activity `countable-uncountable-nouns` is a matching-style game (matching words into the countable vs uncountable drop zones that use the shared `MatchingGame` UI in `src/components/ui/MatchingGame.tsx`). The data includes 60 noun entries across 6 rounds, each tagged with an explanation snippet about the countable/uncountable distinction.
- The import script now sets the activity as `type: "game"` with `category: "games"`, `level: "intermediate"`, and `ui: "matching"`. Because the matching UI reports progress through `saveActivityProgress`, the backend awards `awardPoints` on completion. `getActivityPoints`/`resolveActivityGameUi` prefer the `ui` hint (with a content-based fallback for legacy rows), so matching-style rounds reliably get `POINTS.MATCHING_GAME = 5` even if IDs change. Use `scripts/backfill-activity-ui.ts` to populate `ui: "matching"` for existing games whose content uses `::`-style pairs.
- Completing a round in this activity therefore registers as a completed “matching” game, awarding 5 points the first time progress reaches 100% per assignment/round, plus any streak/achievement bonuses triggered by `updateStreak`/`checkAndAwardAchievements`.

## API routes that award points
1. **`POST /api/activity/progress`** (main completion path). Validates progress/accuracy/category data, writes/updates the `activityProgress` row, and only awards points when a new completion is recorded. It calls `getActivityPoints`, special-cases the numbers game for difficulty/accuracy bonuses, awards `awardPoints`, then `updateStreak` and `checkAndAwardAchievements`. Categories let the route reward each numbers-game round independently instead of once per full activity.
2. **`POST /api/activity/submit`** (quiz/clickable submissions). Fetches the activity server-side, recalculates points via `calculateQuizPoints` for quizzes or `getActivityPoints` for others, upserts a `submission`, marks progress completed, and runs the award → streak → achievement flow if `calculatedPoints > 0`.
3. **`POST /api/grammar/complete`** ensures each slug awards points only once (checks the ledger for `reason = grammar:${slug}`), accepts a `points` override (default 1 but the GrammarReader sends 10), then runs streak/achievement updates after calling `awardPoints`.
4. **`POST /api/speaking/complete`** is the warm-up endpoint. It verifies the activity content opts into `warmupMode`, determines `participationPoints` (default 3, content can override), prevents duplicates by checking `activityProgress.status`, writes a completed progress row, awards the participation bonus, and runs streak/achievement updates before returning the updated user stats.
5. **`POST /api/gamification/award-points`** is a manual recovery path. It skips if `submission.pointsAwarded > 0`, recalculates points based on the stored `activityType` and score, calls `awardPoints`, updates the submission, refreshes the streak, re-checks achievements, and returns the refreshed totals.

## Bonus systems
- **Streaks:** `updateStreak` now requires a positive-point activity to count; it awards `POINTS.DAILY_STREAK = 3` per valid day, adds `POINTS.WEEKLY_STREAK = 25` every 7th such day, updates streak counters/longest streak, increments points/weekly points, and logs the ledger entry under `streak`. Missing a day resets the streak to 1, so login-only (0-point) entries no longer extend the streak.
- **Achievements:** `checkAndAwardAchievements` compares the user's streak length, total points, and quiz/activity submissions against the seeded achievements (activity, streak, quiz, and points categories). Earning one creates a `userAchievement`, awards the configured `points`, and records the ID returned to the caller.
  - Activity achievements (`First Steps`, `Getting Started`, `Dedicated Learner`, `Activity Master`) reward 10/25/50/100 points for completing 1/5/20/50 activities (`prisma/seed-achievements.ts:5`).
  - Streak achievements (`Day One`, `Week Warrior`, `Two Week Champion`, `Month Master`) reward 5/50/100/250 points for 1/7/14/30 day streaks (`prisma/seed-achievements.ts:40`).
  - Quiz achievements (`Perfect Start`, `Quiz Ace`, `Perfectionist`) reward 20/75/150 points for 1/5/10 perfect quizzes (`prisma/seed-achievements.ts:74`).
  - Points achievements (`Point Collector`, `Point Hoarder`, `Point Legend`) reward 25/100/250 points for reaching 100/500/1000 total points (`prisma/seed-achievements.ts:100`).

## Frontend triggers
- `saveActivityProgress` wraps `POST /api/activity/progress` and is called by FlashcardCarousel, MatchingGame, FillInBlankGame, NumbersGame, ActivityRenderer, GrammarReader, and SpeakingActivityRenderer to report completion/progress (see each file’s `saveActivityProgress` call for line numbers). NumbersGame passes `accuracy` and `category` so the backend can compute difficulty-specific totals.
- `VerbQuizContainer` hits `/api/activity/submit` to persist quiz answers and let the server award calculated quiz points even though the component temporarily computes `totalPoints` (`src/components/activities/VerbQuizContainer.tsx:99`).
- `GrammarReader` fires `/api/grammar/complete` with the guide slug, lets the server award the standardized `POINTS.GRAMMAR_GUIDE = 10`, and also triggers `saveActivityProgress` to report 100% (`src/components/grammar-reader/GrammarReader.tsx:113` and `:147`).
- `SpeakingActivityRenderer` posts to `/api/speaking/complete` once a warm-up is done and mirrors that completion via `saveActivityProgress` so progress is tracked (`src/components/activities/SpeakingActivityRenderer.tsx:54` and `:513`).
- `CategoryProgressDisplay` and other helpers may read progress but do not award points directly; the above flows are the ones that mutate the ledger.

## Notes
- `awardPoints` (the centralized helper) increments both `points` and `weeklyPoints`, logs into `pointsLedger`, and prints a console trace for every award, so every API route ultimately funnels through this gate (`src/lib/gamification.ts:144`).
- Login tracking writes a zero-point ledger entry (`trackLogin`) so the activity calendar can show consistent dates without inflating totals (`src/lib/gamification.ts:116`).
- Run `npx tsx scripts/backfill-activity-ui.ts` after deploying the migration to tag legacy matching games with `ui: "matching"` so the new detection logic applies consistently.
- Use `npm run test:gamification` for a quick sanity check that rewards, streak gating, and matching detection behave as expected without touching the database.
