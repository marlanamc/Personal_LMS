# Coding Content System

This is the single playbook for adding Coding track content.

If you only remember one rule: update `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/coding/registry.ts` first.

## Source Of Truth

- Registry and ordering: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/coding/registry.ts`
- Coding guide content files: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/personal/coding-*.ts`
- Coding guide seed script: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-personal-content.ts`
- Coding game seed script: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-personal-games.ts`

## Naming Rules

- ID prefix must be `coding-`
- Use kebab-case IDs only
- Prefer these patterns:
  - Guide: `coding-<topic>`
  - Game: `coding-<topic>-<mode>`

## ADHD-Friendly Checklist

### Add a new Coding guide

1. Create guide file in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/personal/` named `coding-<topic>.ts`.
2. Import it and add activity entry in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-personal-content.ts`.
3. Add guide ID to the appropriate list in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/coding/registry.ts`.
4. Run:
```bash
npx tsx prisma/seed-personal-content.ts
```

### Add a new Coding game

1. Add game entry in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-personal-games.ts`.
2. Add ID to `CODING_GAME_IDS` in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/coding/registry.ts`.
3. Run:
```bash
npx tsx prisma/seed-personal-games.ts
```

## Guardrails

- `seed-personal-content.ts` validates coding guide IDs against `CODING_GUIDE_IDS`.
- `seed-personal-games.ts` validates coding game IDs against `CODING_GAME_IDS`.
- Dashboard coding ordering reads registry constants (no duplicated hardcoded lists).

## Quick Verification

1. Run `npm run typecheck`
2. Run relevant seed command
3. Open `/dashboard/activities?category=coding`
4. Confirm activity appears in expected section

