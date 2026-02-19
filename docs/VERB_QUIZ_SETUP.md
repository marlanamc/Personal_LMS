# Weekly Verb Quiz Setup Guide

This document explains how to set up and use the weekly irregular verb quiz feature.

## Overview

The verb quiz system has been integrated into your ESOL teaching website. It includes:
- 14 weeks of irregular verb quizzes (5 verbs per week, 70 verbs total)
- Interactive quiz interface with mobile-responsive design
- Detailed results with correct/incorrect feedback
- Points-based scoring with bonuses
- Retake functionality
- Calendar integration for due dates

## Setup Instructions

### 1. Install Dependencies

First, install the `tsx` package (if not already installed):

```bash
npm install
```

### 2. Import Quiz Data

Run the import script to load all 14 weeks of verb quizzes into your database:

```bash
npm run import:verb-quizzes
```

This will:
- Create 14 quiz activities (one for each week)
- Set appropriate due dates
- Create calendar events for each quiz
- Link quizzes to your teacher account

Expected output:
```
🚀 Starting verb quiz import...

✓ Found teacher: [Your Name]

✅ Created Week 1 (Activity ID: ...)
   - Due date: 2025-12-09
   - Verbs: do, go, make, take, write
   📅 Calendar event created

...

📊 Import Summary:
   ✅ Imported: 14 quizzes
   ⏭️  Skipped: 0 quizzes (already existed)
   📝 Total in file: 14 quizzes
```

### 3. Verify Import

After importing, you can verify the quizzes by:
1. Logging in as a teacher
2. Going to the Dashboard
3. Checking the Activities section - you should see 14 "Week X - Irregular Verb Quiz" activities
4. Checking the Calendar - due dates should be visible

## Usage

### For Teachers

#### Assigning Quizzes
1. Go to your class management page
2. Create an assignment for a specific week's quiz
3. Set the assignment as "featured" to show in "This Week's Activities"
4. Students will see the quiz on their dashboard

#### Viewing Results
1. Go to the Teacher Dashboard
2. Navigate to the specific class
3. View student submissions for each quiz
4. Results include:
   - Overall score (%)
   - Points awarded
   - Detailed breakdown per verb
   - Individual form correctness (V1-3rd, V1-ing, V2, V3)

### For Students

#### Taking a Quiz
1. Access the quiz from:
   - "This Week's Activities" (if featured)
   - Activity browser (Grammar → Intermediate)
   - Direct link from teacher
2. Fill in all 4 verb forms for each of the 5 verbs
3. Click "Submit Quiz" when all fields are complete
4. View detailed results immediately

#### Quiz Format
Each quiz contains 5 irregular verbs with the following forms:
- **V1 (Base)**: Pre-filled for reference
- **V1 (3rd person)**: e.g., "does" (he/she/it form)
- **V1-ing**: e.g., "doing" (present participle)
- **V2**: e.g., "did" (simple past)
- **V3**: e.g., "done" (past participle)

#### Scoring
- **4 forms per verb** are scored (V1 is not scored, just displayed)
- **20 total forms** per quiz (5 verbs × 4 forms)
- **Case-insensitive** matching
- **Points awarded**:
  - Base: 10 points
  - 80-89%: +5 bonus points
  - 90-99%: +10 bonus points
  - 100%: +20 bonus points

#### Retaking Quizzes
- Students can retake quizzes to improve their scores
- Click "Try Again" on the results page
- New submission will update their score and progress

## Quiz Schedule

The quizzes are scheduled across 14 weeks:

| Week | Due Date | Verbs |
|------|----------|-------|
| Week 1 | Dec 9, 2025 | do, go, make, take, write |
| Week 2 | Dec 16, 2025 | find, think, see, come, get |
| Week 3 | Jan 13, 2026 | buy, sell, pay, break, build |
| Week 4 | Jan 20, 2026 | draw, lead, send, spend, teach |
| Week 5 | Jan 27, 2026 | bring, choose, give, hold, leave |
| Week 6 | Feb 3, 2026 | deal, grow, meet, read, speak |
| Week 7 | Feb 10, 2026 | begin, learn, run, understand, win |
| Week 8 | Feb 17, 2026 | drink, eat, fall, feel, fly |
| Week 9 | Feb 24, 2026 | hear, keep, know, lay, let |
| Week 10 | Mar 3, 2026 | lose, put, say, show, sit |
| Week 11 | Mar 10, 2026 | become, sleep, stand, tell, wear |
| Week 12 | Mar 17, 2026 | ring, wake, feed, forgive, hide |
| Week 13 | Mar 24, 2026 | catch, drive, swim, throw, forget |
| Week 14 | Mar 31, 2026 | bite, freeze, rise, shake, sing |

## Design Features

The verb quiz interface matches your app's design system:
- **Academic Terracotta** (#c86b51) for headers and primary actions
- **Library Sage** (#6e9176) for correct answers
- **Parchment Gold** (#e9c46a) for warnings/tips
- **Warm paper texture** backgrounds
- **Framer Motion animations** for smooth interactions
- **Fully responsive** - works on mobile, tablet, and desktop

### Mobile-Optimized
- Card-based layout on mobile devices
- Stacked form fields for easy input
- Touch-friendly buttons
- Optimized for small screens

### Desktop Experience
- Table layout for efficient data entry
- Keyboard navigation support
- Hover effects and visual feedback
- Multi-column responsive design

## Troubleshooting

### Quizzes Not Showing Up
- Verify import completed successfully (check console output)
- Ensure you have a teacher account in the database
- Check that activities have `type: "quiz"` and `content.type: "verb-quiz"`

### Submission Errors
- Check that the API endpoint `/api/activity/submit` is accessible
- Verify database permissions for Submission and ActivityProgress tables
- Check browser console for detailed error messages

### Points Not Awarded
- Verify the gamification system is enabled
- Check PointsLedger table for point transactions
- Ensure `awardPoints` function is working correctly

## Customization

### Modifying Quiz Schedule
Edit `ESOL_LMS/quizzes.json` and re-run the import script.

### Adding More Quizzes
1. Add new weeks to `quizzes.json` following the same format
2. Run the import script again
3. New quizzes will be added (existing ones will be skipped)

### Changing Point Values
Edit `/src/app/api/activity/submit/route.ts` to modify the points calculation logic.

### Customizing Quiz Design
- Modify `/src/components/activities/VerbQuiz.tsx` for the quiz interface
- Modify `/src/components/activities/VerbQuizResults.tsx` for the results display

## File Structure

```
src/
├── components/
│   └── activities/
│       ├── VerbQuiz.tsx              # Quiz interface component
│       ├── VerbQuizResults.tsx       # Results display component
│       └── VerbQuizContainer.tsx     # Quiz state management
├── types/
│   └── verb-quiz.ts                  # TypeScript type definitions
└── app/
    └── api/
        └── activity/
            └── submit/
                └── route.ts          # Quiz submission API endpoint

scripts/
└── import/
    └── import-verb-quizzes.ts        # Database import script

ESOL_LMS/
└── quizzes.json                      # Quiz data source
```

## Next Steps

1. **Import the quizzes**: Run `npm run import:verb-quizzes`
2. **Test the feature**: Log in as a student and take a quiz
3. **Assign to classes**: Create assignments for your students
4. **Delete ESOL_LMS folder**: Once you've verified everything works, you can safely delete the `ESOL_LMS` folder as the data is now in your database

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review the server logs for API errors
3. Verify database schema is up to date
4. Ensure all dependencies are installed

Enjoy your new verb quiz feature! 🎉
