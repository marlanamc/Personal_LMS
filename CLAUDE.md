# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Class Companion is an ESOL (English for Speakers of Other Languages) learning platform with gamification features. Built with Next.js 16 (App Router), TypeScript, Prisma, and NextAuth. The app uses PostgreSQL and includes a comprehensive points/achievements/leaderboard system to motivate students.

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
npm run db:seed                # Seed database with initial data
npx tsx prisma/seed-achievements.ts  # Seed gamification achievements
```

### Content Import Scripts
```bash
npm run import:verb-quizzes    # Import verb quiz activities
npm run delete:verb-quizzes    # Delete verb quiz activities
```

## Architecture Overview

### Authentication & Authorization
- **NextAuth.js** handles authentication with credentials provider (`src/lib/auth.ts`)
- Users have roles: `student` or `teacher`
- Session strategy: JWT (30-day expiration)
- Login automatically tracks user activity via `trackLogin()` in `src/lib/gamification.ts`
- Custom session includes: `id`, `role`, `username`, `mustChangePassword`

### Database Schema (Prisma)
The database uses PostgreSQL (not SQLite - the README is outdated). Key models:

**Core Models:**
- `User`: Teachers and students with gamification fields (points, streaks, weeklyPoints, lastWeekRank)
- `Class`: Classes with unique join codes
- `ClassEnrollment`: Many-to-many join table for student enrollment
- `Activity`: Teaching activities with JSON `content` field storing typed activity data
- `Assignment`: Links activities to classes with due dates and `isFeatured` flag
- `Submission`: Student submissions with scores and `pointsAwarded`

**Gamification Models:**
- `Achievement`: Unlockable badges with requirements (types: streak, points, quiz, activity)
- `UserAchievement`: Tracks which achievements users have earned
- `PointsLedger`: Immutable audit log of all point transactions (source: activity, streak, achievement, login, manual)
- `ActivityProgress`: Tracks user progress through activities (0-100%, status, per-category data)

**Other:**
- `CalendarEvent`: Class calendar events (holidays, reminders)

### Gamification System (`src/lib/gamification.ts`)
This is the core of student engagement:

**Points System:**
- Activity completion: 2-10 points based on type/difficulty
- Quiz completion: 10 points base, +20 for perfect score
- Numbers Game: 3-17 points based on difficulty and accuracy
- Daily streak: 3 points (requires a positive-point activity)
- Weekly streak (7+ days): 25 bonus points
- Achievement bonuses: 50 points

**Key Functions:**
- `awardPoints(userId, points, reason)` - Awards points and logs to ledger
- `updateStreak(userId, activityPoints)` - Updates daily streak only when activityPoints > 0 and awards streak points
- `checkAndAwardAchievements(userId)` - Checks and awards unlocked achievements
- `getTimeframedLeaderboard(range, limit, classId?)` - Gets leaderboard for day/week/month
- `getWeeklyLeaderboard(limit, classId?)` - Gets weekly leaderboard using `weeklyPoints` field
- `resetWeeklyPoints()` - Resets weekly points (saves ranks to `lastWeekRank`)
- `trackLogin(userId)` - Creates 0-point ledger entry for activity calendar

**Important Implementation Details:**
- Test account username 'marlie' is excluded from leaderboards
- Points are tracked in both `User.points` (lifetime) and `User.weeklyPoints` (reset weekly)
- `PointsLedger` is the source of truth for all point transactions
- Leaderboard uses ledger aggregation, not direct user fields
- Same points = same rank (ties are handled correctly)

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
const userId = (session.user as any).id;
const role = (session.user as any).role;
```

**Key API Routes:**
- `POST /api/grammar/complete` - Award points for completing grammar guide (idempotent via ledger check)
- `POST /api/activity/submit` - Submit activity (awards points, updates streak, checks achievements)
- `POST /api/activity/progress` - Update activity progress (tracks per-category completion)
- `GET /api/gamification/leaderboard?range=week&classId=xxx` - Get leaderboard
- `GET /api/gamification/stats` - Get user's gamification stats
- `POST /api/cron/reset-weekly-points` - Weekly reset (cron job)

### Component Organization
- `src/components/ui/` - Reusable UI components (Button, Card, Badge, etc.)
- `src/components/dashboard/` - Dashboard-specific components for both teacher and student views
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
1. Activity content is stored as JSON in the database but typed in TypeScript
2. Use type guards: `isInteractiveGuideContent()`, `isLegacyGuideContent()`
3. Parse with `parseActivityContent(raw: string)`
4. All activities should update streaks and check achievements on completion
5. Points are calculated based on activity type - see `getActivityPoints()` in `src/lib/gamification.ts`

### When Working with Gamification
1. **Always** log points to `PointsLedger` via `awardPoints()` or `logPointsLedger()`
2. Check for existing ledger entries to prevent duplicate awards
3. Update both `points` (lifetime) and `weeklyPoints` fields
4. Call `updateStreak()` on activity completion
5. Call `checkAndAwardAchievements()` after awarding points
6. Use ledger-based leaderboard queries, not direct user field sorting
7. Exclude test account ('marlie') from leaderboard queries

### When Working with Database
1. Database is PostgreSQL, accessed via `prisma` from `@/lib/prisma`
2. Environment variable is `POSTGRES_URL` (not `DATABASE_URL`)
3. Always use Prisma Client - don't write raw SQL
4. Migrations are auto-applied on build via `npm run build`
5. Use `@@unique` constraints for preventing duplicate enrollments/submissions

### When Working with Authentication
1. Server components: Use `getServerSession(authOptions)`
2. Client components: Use `useSession()` from `next-auth/react`
3. API routes: Always check session at the top of the handler
4. Role-based logic: Check `(session.user as any).role === "teacher"`
5. User must change password if `mustChangePassword === true`

### Weekly Points Reset
The `/api/cron/reset-weekly-points` endpoint should be called weekly (e.g., Sunday night):
1. Saves current ranks to `User.lastWeekRank`
2. Resets `User.weeklyPoints` to 0
3. Does NOT touch `PointsLedger` (immutable audit log)
4. Does NOT reset `User.points` (lifetime total)

### Content Import Scripts
Located in `scripts/import/`:
- Use `tsx` to run TypeScript scripts directly
- Scripts connect to database via Prisma
- Always check for duplicates before importing
- Use descriptive activity IDs for games (e.g., `numbers-game`, `flashcard-colors`)

### PWA Support
- Service worker registered in `src/components/ServiceWorkerRegistration.tsx`
- Manifest at `public/manifest.json`
- Install prompt in `src/components/PWAInstallPrompt.tsx`
- Icons in `public/icons/`

## Testing Accounts (After Seeding)
- Teacher: `teacher@example.com` / `teacher123`
- Student: `student@example.com` / `student123`
- Test account username: `marlie` (excluded from leaderboards)

## Environment Variables
See `.env.example` for required variables:
- `POSTGRES_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` or `AUTH_SECRET` - NextAuth secret key
