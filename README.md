# Marlie LMS

A personal learning management system with class management, assignments, submissions, and gamification.

## Features

### For Teachers
- **Class Management**: Create and manage multiple classes with unique class codes
- **Student Roster**: View enrolled students and track class enrollment
- **Activity Library**: Browse and organize teaching activities (grammar, vocabulary, speaking, writing)
- **Assignment System**: Assign activities to classes with due dates
- **Student Progress**: Track student submissions and grades

### For Students
- **Class Enrollment**: Join classes using class codes
- **Assignment Dashboard**: View assigned activities and due dates
- **Activity Completion**: Complete and submit assignments
- **Gamification**: Earn points, build streaks, and unlock achievements
- **Weekly Leaderboard**: Compete with classmates and track your rank
- **Progress Tracking**: View submission status and feedback

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Personal_LMS
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Accounts

After seeding, you can log in with:

**Teacher Account:**
- Username: `teacher`
- Password: `password123`

**Student Account:**
- Username: `student`
- Password: `password123`

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── dashboard/         # Dashboard pages (teacher/student)
│   │   │   └── leaderboard/   # Weekly leaderboard page
│   │   ├── activity/          # Activity viewing pages
│   │   └── api/               # API routes
│   │       └── gamification/  # Points, streaks, achievements
│   ├── components/
│   │   ├── ui/                # Reusable UI components (Button, Card, Badge, etc.)
│   │   └── icons/             # SVG icon components
│   └── lib/
│       ├── auth.ts            # NextAuth configuration
│       ├── prisma.ts          # Prisma client
│       └── gamification.ts    # Points, streaks, achievements logic
├── prisma/
│   ├── schema.prisma          # Database schema (includes gamification)
│   ├── seed.js                # Database seed script
│   └── seed-achievements.ts   # Achievement seed script
└── public/
    └── manifest.json          # PWA manifest for mobile
```

## Database Schema

### Core Models
- **User**: Teachers and students with authentication + gamification fields (points, streaks)
- **Class**: Classes created by teachers with unique codes
- **ClassEnrollment**: Student enrollments in classes
- **Activity**: Teaching activities (quizzes, games, guides, and learning modules)
- **Assignment**: Activities assigned to classes with due dates
- **Submission**: Student submissions with scores and points awarded

### Gamification Models
- **Achievement**: Unlockable badges and milestones
- **UserAchievement**: Tracks which achievements each user has earned

## Deployment

### Updating Content for Students

When you add new activities or content, students using the PWA need to receive the update. The app checks for updates every 5 minutes, but you must increment the cache version:

1. Open `public/sw.js`
2. Update the `CACHE_VERSION` constant:
```javascript
const CACHE_VERSION = '2024-12-18-v1'; // Change date or increment version
```
3. Commit and deploy

Students will see an "Update Available" notification within 5 minutes of opening the app. After 2 dismissals, a full-screen modal ensures they update.

### Environment Variables

Copy `.env.example` to `.env` and configure:
- `POSTGRES_URL` - Database connection string
- `NEXTAUTH_SECRET` - Auth secret (generate with `openssl rand -base64 32`)
- `CRON_SECRET` - Secret for weekly points reset cron job

## Development

### Database Migrations
```bash
npx prisma migrate dev --name migration_name
```

### Database Seed
```bash
npm run db:seed
```

### Spanish Content Authoring

Use the Spanish content system guide for a clear add-content workflow:

- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/docs/SPANISH_CONTENT_SYSTEM.md`
- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/docs/CODING_CONTENT_SYSTEM.md`
- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/docs/CONTENT_CATEGORY_PLAYBOOK.md`
- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/docs/GUIDE_CREATION_README.md` (required mini quiz standards for grammar and coding guides)
- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/docs/planning/seed.md` (seed/runbook notes)

### Prisma Studio (Database GUI)
```bash
npx prisma studio
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS 4 + Custom Design System
- **ORM**: Prisma
- **Fonts**: Fraunces (display), DM Sans (body), Caveat (handwritten)

## Design System

The app uses a **Warm Educational** color palette:
- **Primary (Terracotta)**: `#d97757` - Buttons, links, highlights
- **Secondary (Sage Green)**: `#7ba884` - Success states, growth indicators
- **Accent (Sunny Yellow)**: `#f4d35e` - Achievements, highlights
- **Background**: `#fef9f3` - Warm cream
- **Text**: `#2b3a4a` - Dark blue-gray

All colors are defined in `/src/app/globals.css` as CSS variables for consistency.

## Gamification System

The app includes a comprehensive gamification system to motivate students:

### Points
Students earn points for:
- Completing activities: **5-10 points**
- Quiz completion: **10 points**
- Perfect quiz score (100%): **+20 bonus points**
- Daily streak: **5 points**
- Weekly streak (7 days): **25 bonus points**

### Streaks
- Students build streaks by completing activities on consecutive days
- Streaks reset if a day is missed
- Bonus points awarded for maintaining streaks

### Achievements
14 unlockable achievements across 4 categories:
- **Activity Milestones**: First Steps, Getting Started, Dedicated Learner, Activity Master
- **Streak Achievements**: Day One, Week Warrior, Two Week Champion, Month Master
- **Quiz Perfection**: Perfect Start, Quiz Ace, Perfectionist
- **Point Milestones**: Point Collector, Point Hoarder, Point Legend

### Weekly Leaderboard
- Shows top performers by weekly points
- Resets every week
- Displays rank changes from previous week
- Students can see "You're up 3 spots!" type messages

## Workspace Organization

To keep the root directory clean and focused, project documents are grouped as follows:

- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/docs/setup/` - deployment and Vercel setup docs
- `/Users/marlanacreed/Downloads/Projects/Personal_LMS/docs/planning/` - active planning notes

## Completed Features

- [x] User authentication (teachers & students)
- [x] Class management with join codes
- [x] Activity library (quizzes, guides, games, and modules)
- [x] Assignment system with due dates
- [x] Student submissions and grading
- [x] **Gamification system** (points, streaks, achievements)
- [x] **Weekly leaderboard** with rank tracking
- [x] **Mobile-first responsive design**
- [x] PWA support (installable on mobile)

## Future Enhancements

- [ ] **Auto-grading quiz system** with immediate feedback
- [ ] **Flashcard system** with images, audio, and study modes
- [ ] **Live polling** for classroom interaction
- [ ] **Progress analytics** (completion rates, areas of struggle)
- [ ] Activity creation/editing interface for teachers
- [ ] Advanced activity renderers
- [ ] File uploads for assignments
- [ ] Class announcements and messaging
- [ ] Dark mode toggle

## License

Free for educational use. Created by teachers, for teachers.
