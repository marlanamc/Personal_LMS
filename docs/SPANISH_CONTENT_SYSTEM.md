# Spanish Content System

This is the single playbook for adding Spanish content.

If you only remember one rule: update `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/registry.ts` first, then follow the checklist for your content type.

## 1) Source Of Truth

Use these files as the canonical structure:

- Registry and ordering: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/registry.ts`
- Vocabulary content modules: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/vocabulary/`
- Spanish grammar guide content: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/grammar/spanish-*.ts`
- Core Spanish seed scripts:
  - `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-spanish-guides.ts`
  - `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-spanish-games.ts`
- Legacy Spanish game seed script:
  - `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-personal-games.ts`

`ActivityCategories` now reads Spanish ordering directly from the registry, so no more repeated ID lists there.

## 2) Naming Rules

- ID prefix must be `spanish-`
- Use kebab-case IDs only
- Keep one ID pattern per content type:
  - Guide: `spanish-<topic>-guide`
  - Vocab set: `spanish-vocab-<topic>`
  - Numbers game: `spanish-numbers-game-<mode>`
  - Verb game: `spanish-verb-game-<topic>`

## 3) ADHD-Friendly Checklist

### Add a new Spanish guide

1. Create content file in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/grammar/` (follow `spanish-*.ts` pattern).
2. Import and add it in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-spanish-guides.ts`.
3. Add the new guide ID to `SPANISH_GUIDE_IDS` in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/registry.ts`.
4. Run:
```bash
npm run db:seed:spanish
```

### Add a new Spanish vocabulary set

1. Add a module in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/vocabulary/`.
2. Export it from `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/vocabulary/index.ts`.
3. Add activity upsert entry in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-spanish-games.ts`.
4. Add the ID to:
   - `SPANISH_CORE_GAME_IDS`
   - `SPANISH_VOCAB_ACTIVITY_IDS`
   in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/registry.ts`.
5. Run:
```bash
npm run db:seed:spanish-games
```

### Add a new Spanish verb or numbers game

1. Add/upsert the activity in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-spanish-games.ts`.
2. Add ID to:
   - `SPANISH_CORE_GAME_IDS`
   - Plus the matching display list:
     - `SPANISH_VERB_ACTIVITY_IDS` or `SPANISH_NUMBERS_ACTIVITY_IDS`
3. Run:
```bash
npm run db:seed:spanish-games
```

### Add a legacy text-based Spanish game

1. Add entry in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/prisma/seed-personal-games.ts`.
2. Add ID to `SPANISH_LEGACY_GAME_IDS` in `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/spanish/registry.ts`.
3. Run:
```bash
npx tsx prisma/seed-personal-games.ts
```

## 4) Guardrails Already Added

- Seed scripts now validate registry alignment and fail fast if an ID is added in one place but not the other.
- Dashboard category ordering uses registry constants instead of duplicated hardcoded arrays.
- Removed stale dashboard ordering reference to `spanish-refresher` (that activity is removed by `seed-personal-content`).

## 5) Quick Verification

After adding content:

1. Run `npm run typecheck`
2. Seed the relevant script(s)
3. Open `/dashboard/activities?category=spanish`
4. Confirm your activity appears in the expected Spanish section

