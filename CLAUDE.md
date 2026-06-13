# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal LMS is a personal learning platform built with Next.js 16 (App Router), TypeScript, Prisma, and NextAuth on PostgreSQL. It is single-user: one authenticated user with full edit power (no teacher/student roles).

> **Note:** The original user-level points/achievements/leaderboard system was removed (migration `20260331020037_remove_gamification`). `src/lib/gamification.ts`, the `PointsLedger`/`Achievement`/`UserAchievement` models, and the `User` points/streak fields no longer exist. A separate, still-active **thread-level** XP/leveling system lives in `src/lib/thread-gamification.ts` (see below). If you find docs or code referencing the old user-points system, treat them as stale.

## Common Development Commands

### Development
```bash
npm run dev                    # Start development server on localhost:3000
npm run build                  # Build for production (includes prisma generate & migrate)
npm run typecheck              # Run TypeScript type checking
npm run lint                   # Run ESLint
```

### Database Operations
```bash
npx prisma migrate dev         # Create and apply new migration
npx prisma migrate deploy      # Apply migrations (production)
npx prisma studio              # Open Prisma Studio GUI
npm run db:seed                # Seed database with base content (users + personal/spanish content & games)
npm run db:seed:users          # Seed only the user account(s)
npm run db:reset:clean         # Clean reset + reseed
```

Additional seed scripts live in `prisma/seed-*.ts` (run with `npx tsx`), e.g. `seed-personal-content.ts`, `seed-spanish-guides.ts`, `seed-spanish-games.ts`, `seed-ed-pronunciation.ts`, `seed-minimal-pairs.ts`. See the `db:seed*` entries in `package.json` for the wired-up combinations.

## Architecture Overview

### Authentication & Authorization
- **NextAuth.js** handles authentication with credentials provider (`src/lib/auth.ts`)
- Single-user model: one authenticated user has full edit power; no teacher/student roles
- Session strategy: JWT (30-day expiration)
- Custom session includes: `id`, `username`, `mustChangePassword` — these are properly typed via `src/types/next-auth.d.ts` (no `as any` casts needed; use `session.user.id` directly)

### Database Schema (Prisma)
The database uses PostgreSQL (not SQLite - the README is outdated). Key models:

**Core Models:**
- `User`: Single user. No points/streak fields — those were removed with gamification.
- `Class`: Classes owned by the user (legacy from ESOL LMS; personal LMS uses one owner)
- `Activity`: Teaching activities with JSON `content` field (stored as a `String` column) holding typed activity data
- `Assignment`: Links activities to classes with due dates and `isFeatured` flag
- `Submission`: Activity submissions with `score`, `status`, `completedAt`. Unique on `(userId, activityId, assignmentId)`. (No `pointsAwarded` — removed with gamification.)
- `ActivityProgress`: Tracks user progress through activities (0-100%, status, per-category JSON data). Unique on `(userId, activityId, assignmentId)`.
- `QuizResponse`: Per-question quiz responses
- `SpeakingSubmission`: Speaking-activity submissions
- `CalendarEvent`: Calendar events (holidays, reminders)

**Threads (active gamification surface):**
- `Thread`: A learning/focus "thread" with its own `xp` and derived level (`Math.floor(xp / 100)`)
- `ThreadActivity`: Activities attached to a thread

**Personal / utility models:**
- `HealthTracker`, `HealthTrackerEntry`, `BloodPressureReading`, `MomentTracker`, `MomentReading` — health/mood tracking (time-series; indexed by `(userId, recordedAt/createdAt)`)
- `DailyWin`, `WorkspaceContext`, `UtilitySubjectState`, `SpotifyConnection`

> `ClassEnrollment`, `PointsLedger`, `Achievement`, and `UserAchievement` no longer exist.

### Thread Gamification (`src/lib/thread-gamification.ts`)
The only gamification system still in the app is **thread-level** XP/leveling — there is no user-level points/streak/leaderboard system anymore.

- XP is awarded to a `Thread` (not the `User`) via `awardThreadXP(threadId, xp, source)`
- Level is derived from XP: `level = Math.floor(xp / 100)`; crossing a 100-XP boundary is a "level up"
- See also `src/lib/thread-suggestions.ts` and `src/lib/medal-utils.ts` for related thread UX

Completing activities records a `Submission` and updates `ActivityProgress`; it no longer awards user points or touches a ledger.

### Activity Content System
Activities store rich, typed content in the `Activity.content` JSON field:

**Content Types (see `src/types/activity.ts`):**
- `InteractiveGuideContent` - Grammar guides with sections, exercises, mini-quizzes
- `QuizContent` - Standard quizzes with questions
- `WorksheetContent` - Worksheets with sections
- `SlidesContent` - Slide presentations
- Game types: Flashcards, Matching, Fill-in-Blank, Numbers Game, Word Scramble

**Interactive Guide Structure:**
- Sections with formulas, examples, exercises, comparisons, time expressions
- Table of contents support
- Exercise types: text, select, radio, word-scramble
- Usage meanings with real-world examples
- Mini-quizzes for comprehension checks
- Legacy guides include `metadata.source: "legacy"` and `metadata.originalFile`

**Important Files:**
- `src/content/grammar/*.ts` - TypeScript-defined grammar guide content
- `src/components/InteractiveGuideViewer.tsx` - Renders interactive guides
- `src/components/grammar-reader/` - Sub-components for guide rendering
- `src/components/ActivityRenderer.tsx` - Main activity dispatcher

### API Route Patterns
All API routes follow Next.js 14+ App Router conventions:

**Authentication:**
```typescript
const session = await getServerSession(authOptions);
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = session.user.id; // typed via src/types/next-auth.d.ts
```

Use the shared `ApiError` / `handleApiError(error, context)` helpers (`src/lib/api-error.ts`) for consistent error responses. `handleApiError` returns a `400` with field details for `zod` validation failures. Rate-limit mutating routes with `enforceRateLimit` (`src/lib/rate-limit.ts`, Upstash-backed).

**Key API Routes:**
- `POST /api/grammar/complete` - Records a graded `Submission` for a completed grammar guide (no points)
- `POST /api/activity/submit` - Submit activity. Persists the `Submission` and marks `ActivityProgress` complete **in a single `$transaction`**. Server validates input; never trusts client-supplied points.
- `POST /api/activity/progress` - Update activity progress (per-category completion); the per-assignment write and the global vocab sync run in one `$transaction`.
- `POST /api/cron/push-reminders` - Push-notification reminders cron (bearer `CRON_SECRET`, production-gated)

### Component Organization
- `src/components/ui/` - Reusable UI components (Button, Card, Badge, etc.)
- `src/components/dashboard/` - Dashboard components (single-user view)
- `src/components/grammar-reader/` - Grammar guide viewer sub-components
- `src/components/activities/` - Activity-specific components (VerbQuiz, etc.)
- `src/components/icons/` - SVG icon components

### Design System
Colors are defined in `src/app/globals.css` as CSS variables:
- `--primary` (Terracotta #d97757): Buttons, links, highlights
- `--secondary` (Sage Green #7ba884): Success states, growth
- `--accent` (Sunny Yellow #f4d35e): Achievements, highlights
- `--background` (#fef9f3): Warm cream background
- `--text` (#2b3a4a): Dark blue-gray text

Fonts: Fraunces (display), DM Sans (body), Caveat (handwritten)

### TypeScript Path Aliases
```typescript
"@/*" maps to "./src/*"
```
Always use `@/` imports for internal modules.

## Important Development Notes

### When Working with Activities
1. Activity content is stored as a JSON `String` in the database but typed in TypeScript
2. Use type guards: `isInteractiveGuideContent()`, `isLegacyGuideContent()` (`src/types/activity.ts`)
3. Parse with `parseActivityContent(raw: string)` — it returns `null` on malformed content rather than throwing, so reads degrade gracefully
4. Validate write payloads with the shared `zod` schema (`src/lib/validation/activity.ts`) before persisting (shape, size cap, and that `content` is parseable JSON)
5. Completion records a `Submission` + updates `ActivityProgress` — there are no points/streaks/achievements to update

### When Working with Database
1. Database is PostgreSQL, accessed via `prisma` from `@/lib/prisma`
2. Connection URL: Prisma reads `POSTGRES_PRISMA_URL` (pooled/pgbouncer) first, then falls back to `POSTGRES_URL`/`DATABASE_URL`/`STORAGE_*`. **Use a pooled URL in production** to avoid exhausting Postgres `max_connections` under serverless concurrency.
3. Always use Prisma Client - don't write raw SQL
4. Migrations are auto-applied on build via `npm run build`
5. Use `@@unique` constraints to prevent duplicate submissions/progress; prefer `upsert` over find-then-create on those constraints
6. Wrap related multi-record writes in `prisma.$transaction(...)` so partial failures can't leave divergent state (see the submit and progress routes)

### When Working with Authentication
1. Server components: Use `getServerSession(authOptions)`
2. Client components: Use `useSession()` from `next-auth/react`
3. API routes: Always check session at the top of the handler
4. Single-user model: no role checks; authenticated user has full access
5. User must change password if `mustChangePassword === true`

### Cron Jobs
The only cron endpoint is `POST /api/cron/push-reminders` (push-notification reminders). It is protected by a bearer `CRON_SECRET`, gated to production, and idempotent via a delivery-log dedupe. (The old `reset-weekly-points` endpoint was removed with gamification.)

### Seed / Content Scripts
Located in `prisma/seed-*.ts`, run with `npx tsx` (or the wired-up `db:seed*` npm scripts):
- Scripts connect to the database via Prisma
- Always check for duplicates before inserting
- Use descriptive activity IDs for games (e.g., `numbers-game`, `flashcard-colors`)

### PWA Support
- Service worker registered in `src/components/ServiceWorkerRegistration.tsx`
- Manifest at `public/manifest.json`
- Install prompt in `src/components/PWAInstallPrompt.tsx`
- Icons in `public/icons/`

## Testing Accounts (After Seeding)
- Username: `marlie` / Password: `password123`

## Environment Variables
See `.env.example` for the full list. Key ones:
- `POSTGRES_PRISMA_URL` - Pooled (pgbouncer) connection string, preferred in production
- `POSTGRES_URL` - Direct PostgreSQL connection string (fine for local dev; used as fallback)
- `NEXTAUTH_SECRET` or `AUTH_SECRET` - NextAuth secret key (validated at load; must be ≥32 chars)
- `CRON_SECRET` - Bearer token required by the push-reminders cron
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - Optional, enables API rate limiting
