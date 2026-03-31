# 🪦 Graveyard

A resting place for ideas that were great in theory... but will never see the light of day.

> *"Here lies code that had dreams."*

---

## Autopsy: Why These Features Failed

Four productivity features were archived on March 30, 2026:
1. **Daily Focus Triad** - "Must/Need/Want" daily planning
2. **Get Unstuck** - Freeze-state diagnosis tool
3. **Sparks** - Interest-based nervous system support
4. **Project Planner** - Template-based project breakdown

### The Fatal Pattern

All four features followed the same broken architecture:

```
Support/Guidance Tool → Capture Plan → Self-Execution
(Modal/Page)          (Storage)       (Your responsibility)
```

**Why it failed:** For demand-avoidant ADHD, using a support tool requires the exact thing you don't have—the ability to choose and initiate. **The choosing IS the stuck.**

### The Core Paradox

**To use a productivity tool for demand-avoidant ADHD, you need the exact thing the tool is supposed to help you get: the ability to initiate and sustain engagement.**

Every feature required:
- Remembering to navigate to a separate page
- Choosing to engage with the tool
- Self-diagnosing your state
- Planning or committing to actions
- Self-executing without external accountability

Each of these steps is a micro-demand that activates avoidance.

### What Works Instead

**Daily Overview & Anchors** succeed because they:
- Show what's next (don't ask you to decide)
- Are passively visible (no navigation required)
- Provide external structure (time-based accountability)
- Give immediate feedback (points/streaks)
- Remove the demand of choosing

### Design Principles for Future Features

**✅ DO:**
- Passive visibility over active engagement
- Meet them where they are
- External structure beats internal motivation
- Immediate feedback loops
- Remove choosing as much as possible
- Build on existing engagement
- Make failure invisible

**❌ DON'T:**
- Create new pages for support tools
- Ask for planning/reflection
- Use guided modals or multi-step flows
- Create long-term commitment systems
- Rely on self-diagnosis
- Show unfinished museums
- Make "using the tool" a task

### Full Autopsy

For a detailed analysis of each feature and why it failed, see:
- [Full Autopsy Document](../.claude/plans/drifting-noodling-lamport.md)

---

## Archived Components

### Sparks Feature
- `components/sparks/` - All Sparks components
- `app/dashboard/sparks/page.tsx` - Route page

### Get Unstuck Feature
- `components/GetUnstuckPage.tsx` - Main component
- `components/GetUnstuckCallout.tsx` - Dashboard callout
- `app/dashboard/reset/page.tsx` - Route page

### Daily Focus Triad Feature
- `components/DailyFocusTriad.tsx` - Main component
- `components/useDailyFocusTriad.ts` - Hook

### Project Planner Feature
- `lib/project-planner.ts` - Core logic
- `components/ProjectPlannerView.tsx` - Main view
- `components/useProjectPlanner.ts` - Hook
- `components/ProjectDetailSheet.tsx`
- `components/ProjectTaskRow.tsx`
- `components/AddProjectSheet.tsx`
- `components/ProjectMonthCalendar.tsx`
- `components/ProjectTimelineStrip.tsx`
- `components/ProjectCard.tsx`
- `components/ProjectProgressRing.tsx`
- `app/dashboard/projects/page.tsx` - Route page

---

*Last updated: March 30, 2026*
