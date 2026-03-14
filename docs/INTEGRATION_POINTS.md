# Integration Points

This document describes how the main modules (auth, gamification, activities, API routes) communicate. Use it to understand data flow and avoid breaking integrations when refactoring.

## Auth and API Routes

- **Expectation:** All API routes require an authenticated session except `/api/health` and NextAuth routes.
- **Pattern:** Routes call `getServerSession(authOptions)` and return `401 Unauthorized` when `!session?.user`.
- **User ID:** `session.user.id` is the canonical identifier. The app is single-user; the authenticated user has full edit power.

## Activity Completion Flows

Different activity types complete via different API paths:

| Flow | API | Client | Gamification |
|------|-----|--------|--------------|
| Quiz, worksheet, verb quiz | `POST /api/activity/submit` | `VerbQuizContainer`, `SubmissionForm` | `awardPoints`, `updateStreak`, `checkAndAwardAchievements` |
| Guides, games, vocab flashcards | `POST /api/activity/progress` | `saveActivityProgress()` from `activityProgress.ts` | Same as above when `progress: 100` and `status: "completed"` |
| Grammar mini-quiz | `POST /api/grammar/complete` | `GrammarReader` | Does **not** award points; saves mini-quiz score to `Submission` |
| Grammar guide completion | `POST /api/activity/progress` | `GrammarReader` via `saveActivityProgress` | Awards points when guide is fully completed |
| Speaking warmup | `POST /api/speaking/complete` | `SpeakingActivityRenderer` | `awardPoints`, `updateStreak`, `checkAndAwardAchievements` |
| Speaking submission | `POST /api/speaking/submissions` | `SpeakingActivityRenderer` | Updates progress; points may come from speaking/complete or progress |

**Important:** Points are always calculated and awarded server-side. The client never sends `pointsAwarded`; the API computes it via `getActivityPoints()` or `calculateQuizPoints()`.

## Gamification Triggers

When activity completion is processed:

1. **awardPoints** – Adds points to `User.points`, `User.weeklyPoints`, and writes to `PointsLedger`.
2. **updateStreak** – Updates `User.currentStreak`, `User.lastActivityDate`; awards streak bonus when applicable.
3. **checkAndAwardAchievements** – Unlocks achievements and awards 50-point bonus per new achievement.

`PointsLedger` is the immutable audit log; `User.points` and `User.weeklyPoints` are derived and updated in sync.

## Login Flow

- Login via NextAuth credentials → `authorize()` in `src/lib/auth.ts` → `trackLogin(userId)`.
- `trackLogin` writes a 0-point `PointsLedger` entry with `source: "login"` for activity calendar visibility.
- Session is JWT-based; duration depends on device (mobile vs desktop).

## Environment Variables by Feature

| Feature | Required | Optional |
|---------|----------|----------|
| Core | `POSTGRES_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | `DATABASE_URL`, `STORAGE_*` (deploy overrides) |
| Rate limiting | - | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Weekly reset cron | - | `CRON_SECRET` (protect `/api/cron/reset-weekly-points`) |
| Spotify timer | - | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI` |
| TTS / pronunciation | - | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` |

## Client → API Patterns

- Session is cookie-based; no Bearer tokens.
- All `fetch` calls use `credentials: "include"` implicitly for same-origin requests.
- No React Query/SWR; raw `fetch` for API calls.
- Key client helpers: `saveActivityProgress()` in `src/lib/activityProgress.ts`, `submitSpeakingWarmup()` in `src/lib/speakingSubmissions.ts`.
