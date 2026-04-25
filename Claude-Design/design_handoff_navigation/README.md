# Handoff: Navigation Architecture Redesign
**Project:** Marlie LMS  
**Design reference files:** See HTML files in this folder  
**Fidelity:** High-fidelity — implement pixel-accurately using the existing codebase patterns (Next.js App Router, TypeScript, Tailwind v4, Framer Motion)

---

## Overview

This handoff covers a full navigation system overhaul across mobile and desktop. The goal is to make the app's navigation feel native, fast, and consistent — with the right chrome on the right pages.

**Three deliverables:**
1. **Bottom nav update** — swap 5 tabs to match actual usage patterns
2. **Desktop icon rail** — replace the click-to-open drawer with a persistent collapsible sidebar
3. **Page tier system** — define which pages get full nav, back-arrow nav, or no nav

---

## About the Design Files

The HTML files in this folder are **interactive design prototypes** — they demonstrate the intended look, layout, and behaviour. They are **not** production code to copy directly.

Your task is to **recreate these designs inside the existing Next.js codebase** using its established patterns: Tailwind v4 utility classes, Framer Motion for animation, `usePathname` for active states, and the `@theme` design tokens already defined in `src/app/globals.css`.

---

## Design Token Reference

All tokens are already defined in `src/app/globals.css` under `@theme`. Use these — do not invent new hex values.

```
--color-bg-base:       #122033   (page background)
--color-bg-surface:    #18273a   (cards, panels)
--color-bg-elevated:   #1e3046   (elevated surfaces)
--color-border-subtle: rgba(255,255,255,0.05)
--color-text:          #e6edf6   (primary text)
--color-text-secondary:#a9b7c8
--color-text-muted:    #6e7e91
--color-primary:       #d48aa6   (sakura — active states)
--color-accent-teal:   #4f8c9e
--color-accent-mint:   #78bfa5
--color-accent-amethyst:#a089c7
--font-display:        'Outfit', sans-serif
--font-body:           'Manrope', sans-serif
--bottom-nav-height:   64px
--header-height-mobile:44px
```

---

## Page Tier System

Before implementing, understand the three tiers that control what navigation chrome each page shows.

### Tier A — Hub pages (full nav)
Header always visible. Bottom tabs on mobile. Icon rail on desktop.

| Page | Route |
|---|---|
| Home | `/dashboard` |
| Day Planner | `/dashboard/day-planner` |
| Organize | `/dashboard/organize` |
| Thought Download | `/dashboard/thought-download` |
| Focus Timer (idle) | `/dashboard/timer` |

### Tier B — Deep-dive pages (back-arrow nav)
Header shows a back arrow instead of the hamburger logo. Bottom tabs still visible on mobile. Desktop rail visible but collapses to icon-only.

All other dashboard pages fall here: `/dashboard/calendar`, `/dashboard/meal-planner`, `/dashboard/skincare-planner`, `/dashboard/cleaning-planner`, `/dashboard/quarterly-planner`, `/dashboard/anchors`, `/dashboard/media-hub`, `/dashboard/workspace`, `/dashboard/interstitial-journalling`, `/dashboard/daily-wins`, `/dashboard/subjects`, `/dashboard/spanish-course-map`, `/dashboard/coding-course-map`, `/dashboard/health-tracker`, `/dashboard/profile`, `/dashboard/notifications`, `/dashboard/threads`

### Tier C — Immersive pages (no nav)
No header, no bottom tabs, no sidebar. Single exit control only.

| Page | Exit control |
|---|---|
| Focus Timer (while session is running) | Pause/stop buttons only |
| `/activity/[id]` | ← Back arrow, top-left |
| `/dashboard/crisis` | ✕ button, top-right |

---

## Phase 1 — Bottom Nav Update

**Effort:** ~45 minutes  
**Files to change:** `src/app/dashboard/layout.tsx`  
**Risk:** Low — just swapping `items` array

### What to change

In `src/app/dashboard/layout.tsx`, replace the current `items` array passed to `<BottomNav>`:

**Current:**
```tsx
items={[
  { href: "/dashboard",            label: "Home",        icon: <HomeIcon /> },
  { href: "/dashboard/day-planner",label: "Day Planner", icon: <Calendar size={20} /> },
  { href: "/dashboard/timer",      label: "Focus Timer", icon: <Timer size={20} /> },
  { href: "/dashboard/calendar",   label: "Calendar",    icon: <CalendarDays size={20} /> },
  { href: "/dashboard/subjects",   label: "Subjects",    icon: <BookOpenIcon /> },
]}
```

**New:**
```tsx
items={[
  { href: "/dashboard",                  label: "Home",     icon: <HomeIcon /> },
  { href: "/dashboard/day-planner",      label: "Plan",     icon: <Calendar size={20} /> },
  { href: "/dashboard/organize",         label: "Organize", icon: <FolderKanban size={20} /> },
  { href: "/dashboard/thought-download", label: "Think",    icon: <FileText size={20} /> },
  { href: "/dashboard/timer",            label: "Timer",    icon: <Timer size={20} /> },
]}
```

**New imports to add:**
```tsx
import { Calendar, Timer, FolderKanban, FileText } from "lucide-react";
```

Remove the old imports: `CalendarDays`, `BookOpenIcon` (if no longer used elsewhere in the file).

### BottomNav active-state logic

The existing `BottomNav.tsx` has special-case logic for the home tab (`isHomeTab`) and timer tab (`isTimerTab`). After this change, the `isTimerTab` special case can remain — it still applies. No changes needed to `BottomNav.tsx` itself.

### Label truncation

Current labels are long ("Day Planner", "Focus Timer"). New labels are short (Plan, Organize, Think, Timer) — this improves mobile display. The existing CSS for bottom nav item labels should handle this fine. If labels are currently hidden via CSS (`sr-only` on the label `<span>`), check `globals.css` for `.bottom-nav-item` styles — the label may need to be surfaced. In the current implementation the label is visually hidden (`sr-only`) so icons render without text below them. This is fine to keep as-is; the labels serve accessibility.

---

## Phase 2 — Desktop Icon Rail Sidebar

**Effort:** ~4–6 hours  
**New files:** `src/components/shared/DesktopNavRail.tsx`  
**Modified files:** `src/components/dashboard/DashboardLayoutClient.tsx`, `src/app/dashboard/layout.tsx`, `src/app/globals.css`  
**Risk:** Medium — additive change, doesn't break mobile

### Behaviour spec

- **Default state:** 56px wide, shows icons only, no labels
- **Expanded state:** 240px wide, shows icons + labels + section group headers
- **Trigger:** Hover the rail to expand; mouse leave to collapse. Also toggle via keyboard shortcut `Cmd+\` (Mac) / `Ctrl+\` (Windows)
- **Animation:** Width transition `200ms ease-out`. Icon labels fade in with `opacity` transition, `150ms` delay after expand starts
- **Position:** Fixed left, full viewport height, below the top header (top: `var(--header-height-desktop)` = 72px on desktop)
- **Z-index:** Below the header (header is `z-50`), so use `z-40`
- **No overlay/backdrop:** Unlike the current slide-in panel, the rail doesn't darken the page. It overlaps content when expanded (like VS Code)

### Component structure

```tsx
// src/components/shared/DesktopNavRail.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
// ... icon imports from lucide-react

const RAIL_COLLAPSED_WIDTH = 56;   // px
const RAIL_EXPANDED_WIDTH = 240;   // px

const NAV_SECTIONS = [
  {
    id: 'top',
    label: null,  // no header for top items
    items: [
      { href: '/dashboard',                  label: 'Home',            icon: Home },
      { href: '/dashboard/day-planner',      label: 'Plan',            icon: CalendarDays },
      { href: '/dashboard/organize',         label: 'Organize',        icon: FolderKanban },
      { href: '/dashboard/thought-download', label: 'Think',           icon: FileText },
      { href: '/dashboard/timer',            label: 'Timer',           icon: Timer },
    ],
  },
  {
    id: 'planning',
    label: 'Planning',
    items: [
      { href: '/dashboard/calendar',          label: 'Calendar',        icon: CalendarDays },
      { href: '/dashboard/quarterly-planner', label: 'Quarterly',       icon: Goal },
      { href: '/dashboard/meal-planner',      label: 'Meals',           icon: UtensilsCrossed },
      { href: '/dashboard/skincare-planner',  label: 'Skincare',        icon: Sparkle },
      { href: '/dashboard/cleaning-planner',  label: 'Cleaning',        icon: Sparkles },
      { href: '/dashboard/anchors',           label: 'Anchors',         icon: Anchor },
      { href: '/dashboard/media-hub',         label: 'Media Hub',       icon: Headphones },
    ],
  },
  {
    id: 'thinking',
    label: 'Thinking',
    items: [
      { href: '/dashboard/workspace',              label: 'Workspace',      icon: Sparkles },
      { href: '/dashboard/interstitial-journalling',label: 'Moment Log',    icon: MessageSquare },
      { href: '/dashboard/daily-wins',             label: 'Daily Wins',     icon: Trophy },
    ],
  },
  {
    id: 'focus',
    label: 'Focus',
    items: [
      { href: '/dashboard/crisis',        label: 'Crisis Mode',  icon: AlertCircle },
      { href: '/dashboard/health-tracker',label: 'Health Log',   icon: Heart },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
    items: [
      { href: '/dashboard/subjects',           label: 'All Subjects', icon: BookOpen },
      { href: '/dashboard/spanish-course-map', label: 'Spanish',      icon: Globe },
      { href: '/dashboard/coding-course-map',  label: 'Coding',       icon: Code },
    ],
  },
];
```

### Key CSS / Tailwind classes to use

The rail should use these design token classes from globals.css:

```tsx
// Rail container
className="fixed left-0 top-[72px] h-[calc(100vh-72px)] bg-bg-elevated border-r border-border-subtle z-40 hidden lg:flex flex-col overflow-hidden transition-all duration-200 ease-out"
style={{ width: isExpanded ? 240 : 56 }}

// Active item background
className="bg-primary/10 text-primary"

// Inactive item
className="text-text-muted hover:text-text hover:bg-bg-surface/60"

// Section header (only visible when expanded)
className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted px-3 pt-4 pb-1.5"
```

### Keyboard shortcut

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
      e.preventDefault();
      setIsExpanded(prev => !prev);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Content area offset

When the rail is present on desktop, the main content needs a left offset to avoid being hidden behind it. In `DashboardLayoutClient.tsx`, add `lg:pl-14` (56px = 3.5rem) to the content wrapper. This keeps the rail overlapping when expanded (desired behaviour — don't shift the content on expand, only on collapse/expand of rail width).

```tsx
// DashboardLayoutClient.tsx
<div className="lg:pl-14">  {/* 56px = collapsed rail width */}
  {children}
</div>
```

### Relationship with existing NavigationSidePanel

The `NavigationSidePanel` (the current slide-in drawer) should be **kept for mobile** — it's triggered by the MARLIE logo button in the header and is the only full-nav access on mobile (since the bottom tabs only cover 5 pages). On desktop, hide the hamburger button and disable the panel since the rail replaces it:

```tsx
// DashboardHeader.tsx — hide logo burger on desktop
<button className="... lg:hidden" ...>  {/* add lg:hidden */}
```

---

## Phase 3 — Header Tier Behaviour

**Effort:** ~2–3 hours  
**Files:** `src/components/dashboard/DashboardHeader.tsx`, new utility `src/lib/nav-tiers.ts`  
**Risk:** Low-medium — additive logic

### Create `src/lib/nav-tiers.ts`

```typescript
export type NavTier = 'A' | 'B' | 'C';

// Tier A: hub pages (full nav, tabs, rail)
const TIER_A_ROUTES = new Set([
  '/dashboard',
  '/dashboard/day-planner',
  '/dashboard/organize',
  '/dashboard/thought-download',
  '/dashboard/timer',
]);

// Tier C: immersive pages (no nav at all)
const TIER_C_PREFIXES = [
  '/activity/',
  '/dashboard/crisis',
];

export function getNavTier(pathname: string): NavTier {
  if (TIER_C_PREFIXES.some(prefix => pathname.startsWith(prefix))) return 'C';
  if (TIER_A_ROUTES.has(pathname)) return 'A';
  return 'B';
}

// Whether to show back arrow instead of hamburger
export function showsBackArrow(pathname: string): boolean {
  return getNavTier(pathname) === 'B';
}
```

### DashboardHeader changes

Add the back arrow for Tier B pages:

```tsx
// In DashboardHeader.tsx
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { showsBackArrow } from '@/lib/nav-tiers';

// Inside the component:
const pathname = usePathname();
const router = useRouter();
const isTierB = showsBackArrow(pathname);

// Replace the brandBlock's hamburger button:
const brandBlock = isTierB ? (
  <button
    type="button"
    onClick={() => router.back()}
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle/75 bg-bg-surface/75 text-text-muted transition-colors hover:border-primary/35 hover:text-primary"
    aria-label="Go back"
  >
    <ChevronLeft className="h-5 w-5" />
  </button>
) : (
  // ... existing hamburger button, unchanged
);
```

### Tier C — completely hide the header

The header is rendered in `DashboardLayoutClient.tsx`. For Tier C pages, it should not render. Since this is a client component, you can use `usePathname`:

```tsx
// DashboardLayoutClient.tsx
'use client';
import { usePathname } from 'next/navigation';
import { getNavTier } from '@/lib/nav-tiers';

export function DashboardLayoutClient({ userName, children }) {
  const pathname = usePathname();
  const tier = getNavTier(pathname);
  
  return (
    <DashboardHeaderCenterProvider>
      {tier !== 'C' && <DashboardHeader userName={userName} />}
      {children}
    </DashboardHeaderCenterProvider>
  );
}
```

Similarly, the `BottomNav` in `layout.tsx` should be hidden on Tier C pages. Since `layout.tsx` is a Server Component, the cleanest approach is to wrap `<BottomNav>` in a client wrapper that reads the pathname:

```tsx
// New file: src/components/ui/ConditionalBottomNav.tsx
'use client';
import { usePathname } from 'next/navigation';
import { getNavTier } from '@/lib/nav-tiers';
import { BottomNav } from './BottomNav';

export function ConditionalBottomNav({ items }) {
  const pathname = usePathname();
  if (getNavTier(pathname) === 'C') return null;
  return <BottomNav items={items} />;
}
```

Then use `<ConditionalBottomNav>` in `layout.tsx` instead of `<BottomNav>`.

---

## Phase 4 — Focus Timer Immersive Mode

**Effort:** ~2 hours  
**Files:** `src/app/dashboard/timer/page.tsx` and the FocusTimer component  
**Risk:** Low — scoped to timer page

### Behaviour

When a focus session is **actively running**, the timer page should enter Tier C (no header, no bottom tabs). When idle (no session running), it stays Tier A.

The `getNavTier` function currently makes `/dashboard/timer` a static Tier A route. This needs to become **dynamic** based on timer state.

### Recommended approach

The `FocusTimerContext` already tracks `isActive`. Use this to dynamically update the tier:

```tsx
// Extend src/lib/nav-tiers.ts to support a dynamic override
// Or: in the timer page/component, add a `data-nav-tier` attribute to `<body>` when active

// Simplest approach: in FocusTimerContext, when isActive changes,
// set document.body.dataset.navTier = isActive ? 'C' : ''

// Then in ConditionalBottomNav:
// Also check document.body.dataset.navTier === 'C'
```

Alternatively, expose a context value `isImmersive` from `FocusTimerContext` and consume it in `ConditionalBottomNav` and `DashboardLayoutClient`.

The FocusTimer component itself should render its own full-screen overlay when active, which visually covers the header and nav anyway — but removing them from the DOM is cleaner for accessibility.

---

## Implementation Order

Complete phases in order — each builds on the previous cleanly:

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
  ~1hr      ~5hrs     ~3hrs     ~2hrs
```

Total estimated effort: **~11 hours** across 4 phases. Each phase is independently shippable.

---

## Files Summary

| Phase | File | Action |
|---|---|---|
| 1 | `src/app/dashboard/layout.tsx` | Update BottomNav items array |
| 2 | `src/components/shared/DesktopNavRail.tsx` | **Create** new component |
| 2 | `src/components/dashboard/DashboardLayoutClient.tsx` | Add `lg:pl-14` offset, hide hamburger on desktop |
| 2 | `src/app/globals.css` | Add `.desktop-nav-rail` CSS if needed |
| 3 | `src/lib/nav-tiers.ts` | **Create** tier utility |
| 3 | `src/components/dashboard/DashboardHeader.tsx` | Add back arrow for Tier B |
| 3 | `src/components/dashboard/DashboardLayoutClient.tsx` | Hide header on Tier C |
| 3 | `src/components/ui/ConditionalBottomNav.tsx` | **Create** wrapper |
| 3 | `src/app/dashboard/layout.tsx` | Use ConditionalBottomNav |
| 4 | `src/context/FocusTimerContext.tsx` | Expose immersive state |
| 4 | Timer page / components | Hide nav when session running |

---

## Design Reference Files

| File | What it shows |
|---|---|
| `Navigation Architecture.html` | Full system spec — tier map, mobile phone visual, desktop rail visual, all page assignments |
| `Organize Mobile Redesign.html` | Interactive Organize page prototype — shows how Tier A header + bottom tabs look in context |
| `Dashboard Home Redesign.html` | Interactive Home page prototype — shows header, bottom tabs, and content area together |

Open these HTML files in a browser to see the intended designs interactively.

---

## Questions to Resolve Before Starting

1. **Think tab destination:** Currently set to `/dashboard/thought-download`. Confirm this is correct, or change to `/dashboard/workspace` if Workspace is the preferred landing page for the Think tab.

2. **Timer immersive trigger:** Confirm that the focus timer should hide nav only when a session is *running*, not when on the timer setup screen.

3. **Rail on which breakpoint:** Currently specified as `lg:` (1024px+). Confirm this is the right breakpoint, or adjust to `xl:` (1280px+) if you prefer the rail only on larger screens.
