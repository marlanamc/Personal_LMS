# Content Category Playbook

Use this when adding a brand-new category (example: `math`, `writing`, `science`).

## Goal

For every category, keep one registry file and connect seed + dashboard + docs to it.

## Step-by-step Checklist

1. Create category registry file:
   - Path: `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/content/<category>/registry.ts`
   - Add constants for:
     - guide IDs
     - game IDs
     - grouped dashboard sections
2. Add category content files:
   - Guides in `src/content/...`
   - Any specialized content modules in `src/content/<category>/...`
3. Add or update seed scripts:
   - Upsert new activities
   - Import registry constants
   - Add alignment validation (fail fast on missing IDs)
4. Wire dashboard/pickers:
   - `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/components/dashboard/ActivityCategories.tsx`
   - `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/components/dashboard/ActivityCategoryPicker.tsx`
   - Add category card, filter behavior, and section ordering
5. Wire render/type support (only if category introduces new content shape):
   - `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/types/activity.ts`
   - `/Users/marlanacreed/Downloads/Projects/Personal_LMS/src/components/ActivityRenderer.tsx`
   - Add content type interfaces + type guards + renderer branch
6. Add category docs:
   - `docs/<CATEGORY>_CONTENT_SYSTEM.md`
   - Link docs from `README.md`
7. Verify:
```bash
npm run typecheck
```
   - Then run the relevant seed command(s) and confirm UI visibility in `/dashboard/activities`.

## Naming Convention

- IDs must be kebab-case
- Prefix every activity with the category name:
  - `<category>-<topic>`
  - `<category>-<topic>-guide`
  - `<category>-<topic>-game`

## Required Guardrail Pattern

Every seed script for the category should include registry alignment checks:

- IDs in seed but not registry -> throw error
- IDs in registry but not seed -> throw error

This prevents silent drift and keeps organization stable.

