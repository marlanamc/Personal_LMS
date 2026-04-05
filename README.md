# Personal LMS

Personal learning system built on Next.js, Prisma, and React. The app combines assignment tracking, planning tools, workspace/thought organization, course-map content, and personal support tools inside a single dashboard-first product.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Prisma
- Vitest
- Playwright
- Tailwind CSS 4

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables and database access.

3. Apply migrations and seed base data:

```bash
npx prisma migrate deploy
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

## Architecture

The repo is organized around ownership boundaries:

- `src/app`: route entrypoints, server data loading, page composition, API routes
- `src/features`: feature-owned hooks, server helpers, state modules, and feature-local types
- `src/components/ui`: reusable presentation primitives
- `src/components/*`: existing feature UI that has not yet moved into `src/features`
- `src/lib`: shared infrastructure and pure cross-feature utilities
- `src/types`: shared domain contracts
- `src/content`: authored learning content and static registries

Current first-class feature boundaries introduced in the cleanup pass:

- `src/features/planning`: shared planning types, calendar-event loaders, planning hooks, and planner client state
- `src/features/dashboard-home`: dashboard-home server orchestration and view-model assembly

## Placement Rules

When adding code, use these defaults:

- Put route-only orchestration in `src/app`.
- Put business logic or feature-specific data shaping in `src/features/<domain>`.
- Put shared contracts in `src/types` only when multiple features need them.
- Keep `src/lib` free of component imports.
- Keep `src/context` free of component imports.
- Use `src/components/ui` only for generic UI primitives, not feature behavior.

Guardrail:

- ESLint blocks imports from `@/components/*` inside `src/lib`, `src/types`, and `src/context`.

## Important Paths

- `src/app/dashboard`: dashboard pages and route shells
- `src/features/planning`: planning data contracts, server loaders, and client planner state
- `src/features/dashboard-home`: dashboard-home server loaders and mappers
- `src/components/planning`: current planning UI
- `src/components/dashboard`: current dashboard UI
- `prisma/schema.prisma`: database schema
- `tests/unit`: unit coverage
- `tests/integration`: integration checks
- `tests/e2e`: browser coverage

## Commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Notes

- `graveyard/` is intentional archival code and rationale, not active runtime code.
- `docs/` holds setup and planning material that should not live at the repo root.
