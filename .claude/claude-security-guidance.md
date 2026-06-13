# Personal LMS — security review rules

Codebase-specific invariants for the security-guidance plugin's diff review. The plugin's
built-in rules already cover generic web-vuln classes (XSS, SSRF, injection, unsafe
deserialization, hardcoded secrets, IDOR). The rules below are the things the model can't
infer — this app's hand-enforced auth/ownership/trust conventions. Treat a diff that violates
one of these as a finding and cite the canonical helper.

This is a **single-user** app (one authenticated user, no teacher/student roles). There is no
user-level points/streak/leaderboard system — it was removed (migration `remove_gamification`).
The only gamification left is thread-level XP in `src/lib/thread-gamification.ts`.

## 1. Auth gate (every API route)
Every handler under `src/app/api/**/route.ts` must call `getServerSession(authOptions)` and
return `401` when `!session?.user` **before** any DB work or side effect. Derive the user id
from `session.user.id` only (typed via `src/types/next-auth.d.ts`) — never from the request
body, query string, or a header. Canonical: `src/app/api/activity/submit/route.ts` (session
check at top, `const userId = session.user.id`). A route that trusts a body/query `userId` is
a finding.

## 2. Ownership / IDOR
Every Prisma read or write on a user-owned model must filter by the session `userId` in its
`where`. User-owned models include `Submission`, `ActivityProgress`, `QuizResponse`,
`SpeakingSubmission`, `Thread`, `ThreadActivity`, `HealthTracker*`, `BloodPressureReading`,
`MomentTracker*`, `MomentReading`, `DailyWin`, `WorkspaceContext`, `UtilitySubjectState`,
`SpotifyConnection`. A `findFirst`/`findMany`/`update`/`delete` on one of these with no
`userId` constraint (or scoped only by an id that came from the client) is a finding —
it lets one record be read or mutated via another's id. Canonical:
`where: { userId, activityId, assignmentId }` in the submit route.

## 3. Never trust client-supplied authority fields
Fields that confer progress or scoring — `score`, `progress`, `status`, `xp`, anything
points-like — must be computed or bounds-checked server-side, never persisted raw from the
request body. **Known latent issue to fix and not reproduce:** in
`src/app/api/activity/submit/route.ts` the comment says *"Never trust points from client —
calculate server-side only,"* but the handler persists `body.score` directly with no
recomputation or range check. Flag any new route that writes a client-supplied score/progress/xp
without server-side validation, and flag re-introductions of this pattern.

## 4. Validate write payloads with zod
Mutating routes must parse the request body through a shared schema in `src/lib/validation/`
before persisting — e.g. `activityInputSchema` (`src/lib/validation/activity.ts`), which enforces
shape, a 1 MB `content` size cap, and that `content` is parseable JSON. A route that takes
`await request.json()` and writes it to the DB without schema validation is a finding.
Validation failures should surface as `400`s via `handleApiError` (it formats `ZodError` with
field-level details).

## 5. Rate-limit mutations
State-changing routes (POST/PUT/PATCH/DELETE) must call `enforceRateLimit`
(`src/lib/rate-limit.ts`) with a defined limiter name (`activity-submit`, `award-points`) and
return its response when non-null, before doing work. A new mutating route with no rate-limit
call is a finding.

## 6. Atomic multi-record writes
Related writes that must not diverge (e.g. `Submission` + `ActivityProgress`, or a per-assignment
write + the global vocab sync) must run inside `prisma.$transaction(...)`. Sequential awaited
writes to interdependent records outside a transaction are a finding — a mid-way failure leaves
split state. Canonical: the `prisma.$transaction` block in the submit route.

## 7. Consistent, non-leaky error handling
Route `catch` blocks must funnel through `handleApiError(error, context)` / `ApiError`
(`src/lib/api-error.ts`). Do not return raw `error.message`, stack traces, or DB error text to
the client — `handleApiError` already masks 5xx messages in production. A handler that
`NextResponse.json({ error: String(err) })` or echoes a caught exception is a finding.

## 8. Cron auth
Cron endpoints (`src/app/api/cron/**`) must require the `CRON_SECRET` bearer token and be gated
to production. An unauthenticated or non-gated cron handler is a finding. Canonical:
`/api/cron/push-reminders`.

## 9. Untrusted activity content
`Activity.content` is stored as a JSON **string** and is untrusted. Parse it with
`parseActivityContent()` (`src/types/activity.ts`) — it returns `null` on malformed input rather
than throwing, so reads degrade gracefully. Never `eval`/`new Function`/`JSON.parse`-then-trust
its shape without the type guards (`isInteractiveGuideContent()`, etc.). Rendering raw content
fields as HTML is a finding.
