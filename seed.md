# 🌱 Safe Seeding Guide

Use these commands to manage database content without losing student progress.

## 🚀 Quick Reference

| Command                    | Safety Level  | Purpose                                                                                     |
| -------------------------- | :-----------: | ------------------------------------------------------------------------------------------- |
| **`npm run db:seed`**      |  ✅ **SAFE**  | Upserts grammar guides. Use this for standard content updates.                              |
| `npm run db:seed:grammar`  |  ✅ **SAFE**  | Explicitly updates grammar guides only. Same as `db:seed`.                                  |
| `npm run db:seed:users`    |  ✅ **SAFE**  | Adds/updates teacher & student accounts.                                                    |
| `npm run db:seed:vocab`    |  ✅ **SAFE**  | Updates vocabulary flashcards.                                                              |
| `npm run db:seed:quizzes`  |  ✅ **SAFE**  | Imports/updates verb quizzes.                                                               |
| **`npm run db:seed:full`** | ⚠️ **UNSAFE** | **Destructive Reset.** Deletes ALL progress and activity data. Use only for fresh installs. |

---

## 📖 detailed Instructions

### 1. Updating Grammar Content

To update grammar guides (e.g., after editing a guide file):

```bash
npm run db:seed
```

- **What it does:** Updates titles, descriptions, and content of grammar guides.
- **What it keeps:** Student progress, submissions, and quiz scores.

### 2. Adding New Students

To add new students defined in `prisma/seed-users-only.ts`:

```bash
npm run db:seed:users
```

- **What it does:** Creates new users if they don't exist. Enroll them in classes.
- **What it keeps:** Existing users and their passwords remain unchanged.

### 3. Updating Vocabulary or Quizzes

For specific updates to games or quizzes:

```bash
npm run db:seed:vocab    # for flashcards
npm run db:seed:quizzes  # for verb quizzes
```

### 4. Full Database Reset (Danger Zone)

If you need to completely wipe the database and start fresh (e.g., on a new machine):

```bash
npm run db:seed:full
```

- **⚠️ WARNING:** This will delete **ALL** student data, progress, and submissions.
- **Safety:** It includes a confirmation prompt. You must type `y` to proceed.
