# Handoff: Organize — Desktop Redesign

## Overview

Organize is the task-management surface of the app. Users capture bullets into an Inbox, route them to Projects, and place them in one of three lanes (**Now / Next / Later**) — with a fourth implicit lane **Done**. "Now" is the user's active commitment. "Chain" is a focus mode where Now-lane bullets are worked one at a time in sequence.

This handoff covers the **desktop (1920×1080+) redesign** with two locked-in layouts:

- **List view** — the default productivity canvas (project sidebar + 3-lane kanban + focus inspector).
- **Bento view** → **Focus-hero** variant (one dominant project card + supporting cards).
- **Flow view** → **Three-zone cockpit** variant (pool left · live chain center · telemetry right).

There is a single persistent chrome around all three views: left icon rail, top header with view switcher + quick-add + ⌘K palette, optional right-side Inbox panel.

## About the Design Files

The files in this bundle are **design references created in HTML+React (via inline Babel)** — prototypes showing intended look and behavior, not production code to copy directly.

Open `Organize Desktop Redesign.html` in a browser to interact with the prototype. The entry point is a 1920×1080 fixed stage scaled to fit the viewport, with source split into `desktop/*.jsx` and `desktop/data.js`. The prototype includes three Bento variants and three Flow variants toggleable via a Tweaks panel — **for implementation, only the chosen variants below matter** (Focus-hero bento, Three-zone cockpit flow). The other variants are preserved as inline source you can delete or keep for reference.

The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, etc.) using its established patterns, component library, and state management. Do not ship the HTML directly.

## Fidelity

**High-fidelity.** Exact colors, typography, spacing, radii, shadows, and interactions are specified. Recreate pixel-perfectly using the codebase's primitives (existing Button, Card, etc.) where possible; where the codebase has no equivalent, match the specs below.

---

## Design Tokens

All tokens are defined in `desktop/data.js` on `window.T`, `window.PROJECT_COLORS`, `window.LANE_CONFIG`. Port these into the codebase's token system.

### Surface / Text

| Token | Value | Usage |
|---|---|---|
| `bg` | `#122033` | App background, far-outer |
| `surface` | `#18273a` | Cards, panels, elevated rows |
| `elevated` | `#1e3046` | Hovered / focused surfaces |
| `hover` | `rgba(255,255,255,0.035)` | Row hover tint |
| `borderSubtle` | `rgba(255,255,255,0.06)` | Default borders |
| `borderStrong` | `rgba(255,255,255,0.10)` | Emphasized borders |
| `text` | `#e6edf6` | Primary text |
| `textSecondary` | `#a9b7c8` | Labels, meta |
| `textMuted` | `#6e7e91` | De-emphasized |
| `textFaint` | `#4a5a6a` | Disabled, placeholders |

### Accent

| Token | Value | Semantic |
|---|---|---|
| `primary` | `#d48aa6` (sakura pink) | Now-lane / Live chain |
| `teal` | `#4f8c9e` | Next-lane |
| `mint` | `#78bfa5` | Later-lane, Done, completion |
| `amethyst` | `#a089c7` | Neutral accent (telemetry) |

### Lane config (`LANE_CONFIG`)

```js
now:   { label: 'Now',   color: '#d48aa6', bg: 'rgba(212,138,166,0.08)', border: 'rgba(212,138,166,0.22)', glow: 'rgba(212,138,166,0.3)' }
next:  { label: 'Next',  color: '#4f8c9e', bg: 'rgba(79,140,158,0.08)',  border: 'rgba(79,140,158,0.22)',  glow: 'rgba(79,140,158,0.3)'  }
later: { label: 'Later', color: '#78bfa5', bg: 'rgba(120,191,165,0.08)', border: 'rgba(120,191,165,0.22)', glow: 'rgba(120,191,165,0.3)' }
done:  { label: 'Done',  color: '#5fba7d', bg: 'rgba(95,186,125,0.08)',  border: 'rgba(95,186,125,0.22)',  glow: 'rgba(95,186,125,0.3)'  }
```

### Project palette (`PROJECT_COLORS`)

Pastel hues, each project is tagged with one: `mint`, `sky`, `sage`, `peach`, `lavender`, `rose`. Every hue ships five variants — `dot`, `bg`, `bgStrong`, `border`, `text`, `glow` — see `data.js` for full HSL values. Example (`mint`):

```js
{ dot: 'hsl(162,38%,58%)',
  bg: 'hsla(162,38%,58%,0.10)',
  bgStrong: 'hsla(162,38%,58%,0.18)',
  border: 'hsla(162,38%,58%,0.28)',
  text: 'hsl(162,40%,74%)',
  glow: 'hsla(162,38%,58%,0.25)' }
```

### Typography

| Token | Stack | Role |
|---|---|---|
| `fontDisplay` | `'Outfit', system-ui, sans-serif` | Headings, labels, numbers |
| `fontBody` | `'Manrope', system-ui, sans-serif` | Bullet text, body copy |
| `fontMono` | `'JetBrains Mono', ui-monospace, monospace` | Counters, step indices, key hints |

Weights used: 400 / 500 / 600 / 700 / 800. Letter-spacing for uppercase labels is `0.12em`–`0.22em` — see component specs.

### Radii

| Size | px | Usage |
|---|---|---|
| Small | 6–8 | Badges, key hints, buttons |
| Medium | 10–14 | Rows, tray tiles, small cards |
| Large | 16 | Project cards |
| Extra large | 20–24 | Hero / Live-Now stage |
| Pill | 999 | Lane chips |

### Shadows / glows

- Card hover: `0 8px 24px rgba(0,0,0,0.2)`
- Scaled stage: `0 30px 120px rgba(0,0,0,0.5)`
- Live Now stage: `0 0 60px rgba(212,138,166,0.08), 0 20px 60px rgba(0,0,0,0.3)`
- Accent dot glows: `0 0 10px <color>88` (small) to `0 0 14px <color>` (hero)

### Key layout dimensions

- Stage: `1920 × 1080` (scaled to fit via `transform: scale()`)
- Left icon rail: `56px` (token: `T.railWidth`)
- Top header: `64px` tall
- Right Inbox panel: `320px` (when open)
- Bento: 3- or 4-column grid with `14px` gap, `24px` outer padding
- Flow cockpit: `320px | 1fr | 280px` three-column grid

---

## Data Model

From `desktop/data.js`:

```ts
type Bullet = {
  id: string;                              // 'b01', 'b02', …
  text: string;
  project: string | null;                  // PROJECT.id or null (inbox)
  lane: 'now' | 'next' | 'later' | 'done' | null;
};

type Project = {
  id: string;                              // 'p-spanish', …
  label: string;
  color: 'mint' | 'sky' | 'sage' | 'peach' | 'lavender' | 'rose';
  icon: string;                            // glyph hint — 'globe', 'code', 'heart', 'book', 'edit'
};
```

**Derived collections used throughout:**

- `inbox = bullets.filter(b => !b.project && b.lane !== 'done')`
- `chain = bullets.filter(b => b.lane === 'now')` — the active focus queue
- `pool = bullets.filter(b => b.project && b.lane !== 'now' && b.lane !== 'done')` — ready to pull into Now
- `done = bullets.filter(b => b.lane === 'done')`
- `active = chain[0] ?? null`, `queued = chain.slice(1)`

---

## Global Chrome

### Left icon rail — `LeftRail` (`desktop/chrome.jsx`)

- Width `56px`, full height, `background: T.surface`, `borderRight: 1px solid T.borderSubtle`.
- Stacked icon buttons, top-to-bottom: logo, **Organize** (active), Media, Dashboard, Spaces, then `flex: 1` spacer, then Settings + Account at bottom.
- Active item has `background: rgba(255,255,255,0.06)` and the primary accent color on the icon. Hover is `rgba(255,255,255,0.04)`.
- Each button is `40×40`, `border-radius: 10px`, icon `16px`.

### Top header — `TopHeader`

Left → right:
1. **Breadcrumb**: "Organize" in `fontDisplay 20px / 700` with a `primary`-colored dot prefix.
2. **Bullet counter**: small Outfit 11px muted — `"{n} bullets in flight"`.
3. `flex: 1`.
4. **View switcher** (segmented control): `List` · `Bento` · `Flow`. Segments `32px` tall, active pill uses `rgba(255,255,255,0.08)` with primary dot prefix; inactive is `textMuted`.
5. **Quick-add button**: outlined pill, Outfit 12px 600, with `/` key hint. Opens an inline input prepended to Inbox; submits on Enter.
6. **⌘K command palette trigger**: pill showing `⌘ K` in `fontMono`.
7. **Inbox toggle**: icon button with a badge dot (sakura) when `inboxCount > 0`.

Height `64px`, `padding: 0 24px`, `borderBottom: 1px solid T.borderSubtle`.

### Right Inbox panel — `InboxPanel`

- `320px` wide, full height of the content area, `borderLeft: 1px solid T.borderSubtle`, `background: T.surface`.
- Header: "Inbox" + count + close button (`×`, posts close).
- Body: vertical list of unrouted bullets. Each row has the bullet text + a compact project-picker (horizontal project dots — clicking one calls `onAssign(bulletId, projectId)`). Scrollable.
- Empty state: centered text `"Inbox zero — nice."`.

### Command palette — `CommandPalette`

- Centered modal, `560px` wide, `background: T.elevated`, `border-radius: 14px`, `padding: 14px`.
- Search input (Manrope 14px) at top. Below: grouped results — **Views** (List/Bento/Flow), **Projects**, **Bullets** (top 6 matches).
- Keyboard: `↑ ↓` to navigate, `Enter` to select, `Esc` to dismiss.

### Keyboard shortcuts (global)

| Key | Action |
|---|---|
| `1` / `2` / `3` | Switch to List / Bento / Flow view |
| `I` | Toggle Inbox panel |
| `/` | Focus quick-add input |
| `⌘K` / `Ctrl+K` | Open command palette |
| `X` | Mark active chain bullet done (Flow view) |
| `N` | Push active chain bullet to Next (stub) |
| `F` | Start focus timer (stub) |
| `Esc` | Close palette / dismiss |

Shortcut handler is skipped when focus is in an `INPUT` or `TEXTAREA`.

---

## Screen 1 — List View

**Purpose:** default working surface. Project sidebar on the left, 3-lane kanban in the middle, focus inspector on the right.

**Layout** (left → right, inside the chrome):
- **Project sidebar** — `240px` wide, `background: T.surface`. Header "Projects" + `+` button. Below: project rows (dot + label + unroute count). Active project highlighted with `rgba(255,255,255,0.06)` background. Bottom: "All projects" toggle.
- **Kanban center** — `flex: 1`. Three equal columns (Now / Next / Later), each with a column header (lane color dot + label + count) and a scrollable list of bullet rows. Column gap `14px`, internal padding `16px`. Column headers are sticky at `top: 0`.
- **Focus inspector** — `320px` wide, `borderLeft: 1px solid T.borderSubtle`. Shows the currently-selected bullet (or a prompt to pick one): project pill, lane selector, bullet text in Manrope 16/500, created date, related bullets list, action buttons ("Mark done", "Push to Next", "Delete").

**Bullet row (kanban):**
- Row: `padding: 10px 12px`, `border-radius: 10`, `background: T.surface`, `border: 1px solid T.borderSubtle`, `border-left: 3px solid <project dot>`.
- Layout: `[checkbox] [text] [project pill] [drag handle (hover only)]`, gap `10px`.
- Text: Manrope 13/500, `color: T.text`, `line-height: 1.4`, `white-space: nowrap; text-overflow: ellipsis`.
- Hover: `background: T.elevated`, drag handle (`⋮⋮`) fades in on the right.

**Column header:**
- Lane dot (`8px` with glow matching lane), label in Outfit 12/700 uppercase `letter-spacing: 0.16em`, count in `fontMono 12/500 textMuted`.
- Now column header has subtle `linear-gradient` tint using `LANE_CONFIG.now.bg`.

---

## Screen 2 — Bento View (Focus-hero variant)

**Purpose:** project-centric overview. One dominant project ("focus") in a large hero card, remaining projects as supporting cards.

**Layout:**
- **Lane filter bar** at top: segmented pill group (`All` · `Now` · `Next` · `Later`). Each pill has a lane-color dot; active pill uses the lane's `bg`. Right side: helper text (Manrope 11/500 muted) — `"Click a card to expand · Drag between projects to move"`.
- **Grid**: `grid-template-columns: repeat(4, 1fr)`, `gap: 14px`, `padding: 20px 24px 32px`.
- **Hero card**: spans `grid-column: span 2` and `grid-row: span 2`. Uses the project with the most `now` bullets.
- **Supporting cards**: `span 1` each. Order follows `projects` array after removing the hero.

### ProjectCard — hero size

- `padding: 20px`, `border-radius: 16`, `min-height: 420px`.
- Background: `linear-gradient(145deg, <project.bg> 0%, rgba(255,255,255,0.01) 100%)`. On hover swap to `bgStrong` → `bg`.
- Border: `1px solid T.borderSubtle`; on hover `1px solid <project.border>`.
- Transition: `all 0.18s`.

**Header row:**
- `[11px project dot with glow]` `[Outfit 22/700 project.text]` `[FOCUS chip]` on left; `[kebab more button]` on right.
- FOCUS chip: Outfit 10/700 uppercase `letter-spacing: 0.1em`, padding `2px 8px`, radius `10px`, `background: rgba(255,255,255,0.05)`, `color: T.textSecondary`.
- Below the title row: horizontal `LaneCountBadge` strip showing counts for any lane with >0 bullets (now / next / later), gap `12px`.

**Body — grouped by lane:**
For each lane with items, render a group:
- Group header: lane dot (`6px`, glow if now) + Outfit 10/800 uppercase `letter-spacing: 0.16em` + count in Outfit 10 muted.
- Body rows: `BentoBulletRow` — `[TaskCheck][text][lane dot on hover]`, `padding: 6px 0`, `border-bottom: 1px solid rgba(255,255,255,0.04)`. Text is Manrope 13.5/500, `line-height: 1.4`.

### ProjectCard — medium size (supporting)

- Same styling, `min-height: 220px`, `padding: 16px`, title Outfit 16/700.
- Shows a flat list of up to 5 bullets (no lane grouping). Overflow → `"+ N more"` link styled in the project's `text` color at 80% opacity.
- Each bullet row is `BentoBulletRow` at body 12.5px.

### TaskCheck (checkbox)

- Size: `15px` square at bento body, `16px` at hero.
- Default: `border: 1.5px solid T.borderStrong`, `border-radius: 4px`, transparent.
- Hover: border becomes `laneColor`.
- Checked: `background: laneColor`, `border-color: laneColor`, check glyph (`12px` checkmark) in `T.bg`.

### Lane filter behavior

- `laneFilter` state: `'all' | 'now' | 'next' | 'later'`.
- When not `'all'`, hero card still groups by lane but only renders the filtered lane's group.

---

## Screen 3 — Flow View (Three-zone cockpit variant)

**Purpose:** single-task focus. Pool of ready bullets on the left, live chain (active Now bullet + queue) in the center, telemetry on the right.

**Layout:** `grid-template-columns: 320px 1fr 280px`, fills remaining content area.

### LEFT zone — Pool

- `background: T.surface`, `borderRight: 1px solid T.borderSubtle`.
- Header (`padding: 16px 18px 12px`):
  - Eyebrow: Outfit 10/700 uppercase `letter-spacing: 0.16em` muted — `"Pool"`.
  - Title: Outfit 16/700 text — `"Ready to chain"`.
  - Meta: Manrope 11.5 muted — `"{pool.length} bullets waiting"`.
- Body: scrollable list.
- **Pool row:**
  - `padding: 10px 11px`, `border-radius: 9px`, `margin-bottom: 4px`.
  - `background: rgba(255,255,255,0.02)`, `border: 1px solid T.borderSubtle`, `border-left: 3px solid <project dot>`.
  - Contents: `[lane dot 5px] [text Manrope 12.5] [project pill sm]`.
  - Text truncates with ellipsis.
  - Clicking the row pulls it into the chain (sets `lane: 'now'`).

### CENTER zone — Active + Chain

**Live Now stage** (top, `padding: 28px 32px 14px`):
- Card: `padding: 28px`, `border-radius: 20px`, `border: 1.5px solid rgba(212,138,166,0.28)`.
- Background: `radial-gradient(140% 120% at 0% 0%, rgba(212,138,166,0.12) 0%, transparent 55%), T.surface`.
- Shadow: `0 0 50px rgba(212,138,166,0.06)`.
- Header row: `[8px primary dot with glow]` `[LIVE NOW label Outfit 10/800 uppercase letter-spacing 0.22em primary]` `[ProjectPill md]`.
- Bullet text: Manrope 26/600, color `T.text`, `line-height: 1.25`, `margin: 0 0 18px`.
- Action row (gap 8px):
  - **Mark done** (primary) — `X` key hint. Background `rgba(120,191,165,0.14)`, border `1px solid rgba(120,191,165,0.34)`, text color `T.mint`.
  - **Next** — `N` key hint. Default style.
  - **Focus timer** — `F` key hint. Default style.
  - Default action style: `padding: 9px 14px`, `border-radius: 10px`, `background: rgba(255,255,255,0.04)`, `border: 1px solid T.borderSubtle`, `color: T.textSecondary`, Outfit 12.5/600 with icon + label + key hint.

**Chain queue** (below stage, `padding: 10px 32px`, `overflow-y: auto`):
- Eyebrow: Outfit 10/700 uppercase `letter-spacing: 0.18em` muted — `"Chain — {queued.length} queued"`.
- For each queued bullet, a row with a step circle + card:
  - Step circle: `28×28`, `border-radius: 50%`, `background: rgba(255,255,255,0.04)`, `border: 1px solid T.borderSubtle`, contents: step number (`i + 2`) in JetBrains Mono 11/600 muted.
  - Gap `14px` between circle and card.
  - Card: `flex: 1`, `padding: 10px 14px`, `border-radius: 10px`, `background: T.surface`, `border: 1px solid T.borderSubtle`, `border-left: 3px solid <project dot>`. Contents: `[text Manrope 13.5 ellipsis] [project pill sm]`.

**Empty state** (`chain.length === 0`): centered `EmptyChain` — dashed border card, flow icon 24px, Outfit 18/700 `"Chain is empty"`, Manrope 13 muted body copy telling user to pull from the pool.

### RIGHT zone — Telemetry

- `borderLeft: 1px solid T.borderSubtle`, `background: T.bg`, `padding: 16px 18px`, `overflow-y: auto`.
- Eyebrow: `"Session"` in Outfit 10/700 uppercase `letter-spacing: 0.16em` muted.

**Progress ring** (hero widget):
- Card: `padding: 18px`, `border-radius: 14`, `background: T.surface`, `border: 1px solid T.borderSubtle`, centered content.
- Ring: `120×120` outer, `conic-gradient(T.mint 0deg → (done/total)*360deg, rgba(255,255,255,0.06) rest)`. Inner mask: `98×98`, `border-radius: 50%`, `background: T.surface`.
- Inner content: big number Outfit 26/700 = `doneCount`, below it Outfit 10 uppercase muted `"of {total} done"`.
- Beneath: Manrope 12 body — `"You're {pct}% through the chain."`.

**Stats grid** (`grid-template-columns: 1fr 1fr`, `gap: 8px`):
- Four `StatBox`es — padding `10px 12px`, radius `10px`, `background: T.surface`, border subtle.
- Each shows: big value in Outfit 20/700 using its own color (primary / mint / teal / amethyst), then Outfit 9.5/700 uppercase `letter-spacing: 0.14em` muted label.
- Values: `In chain = chain.length`, `Completed = doneCount`, `Pool = pool.length`, `Projects = new Set(chain.map(b => b.project)).size`.

**Just done** list:
- Eyebrow — Outfit 10/700 uppercase muted `"Just done"`.
- Empty: Manrope 12 muted `"Nothing yet — finish your first to unlock the streak."`.
- Otherwise: up to 3 rows, each `padding: 8px 10px`, `border-radius: 8`, `background: rgba(120,191,165,0.06)`, `border: 1px solid rgba(120,191,165,0.14)`. Contents: `[check icon 11 mint] [text Manrope 12 secondary ellipsis]`.

---

## Shared Atoms (`desktop/atoms.jsx`)

Port these as components (names are suggestions):

- **`ProjectPill`** — `[color dot + project.label]`, radius 999, `background: <project.bg>`, `color: <project.text>`. Sizes `sm` (Outfit 10, padding `2px 7px`) / `md` (Outfit 11, padding `3px 9px`).
- **`LaneDot`** — circular dot in lane color; sizes passed as prop; optional glow (`box-shadow: 0 0 8px <glow>`).
- **`KeyHint`** — inline pill for keyboard hints, JetBrains Mono 10/600, padding `1px 5px`, radius `4px`, `background: rgba(255,255,255,0.05)`, `color: T.textMuted`.
- **`Icon`** — centralized stroke-icon set; 13–16px. Used names: `list`, `bento`, `flow`, `check`, `arrowR`, `play`, `more`, `archive`, `sparkle`, `search`, `plus`, `inbox`, `globe`, `code`, `heart`, `book`, `edit`, `settings`, `account`. Stroke width 1.75, round caps.

---

## Interactions & State

### State (App-level)

```ts
const [view, setView] = useState<'list' | 'bento' | 'flow'>('list');
const [bullets, setBullets] = useState<Bullet[]>(INITIAL_BULLETS);
const [inboxOpen, setInboxOpen] = useState(true);
const [cmdOpen, setCmdOpen] = useState(false);
const [laneFilter, setLaneFilter] = useState<'all'|'now'|'next'|'later'>('all'); // bento only
const [selectedBulletId, setSelectedBulletId] = useState<string|null>(null);     // list only
```

### Actions

```ts
toggleDone(id)             // flips lane between current and 'done'
assign(id, projectId)      // sets project, defaults lane to 'next' if null
pullToNow(id)              // sets lane to 'now'
quickAdd(text)             // pushes new bullet with project:null, lane:null → Inbox
setLane(id, lane)          // generic lane mover (used by drag / kebab menu)
```

### Derived

- `inboxCount = bullets.filter(b => !b.project && b.lane !== 'done').length`
- `bulletCount = bullets.filter(b => b.lane !== 'done').length` (shown in header)
- Flow view derives `chain / pool / done / active / queued / total / doneCount` per-render.

### Transitions

- View switch — instant. Chrome persists; only the center region swaps.
- Card hover — `transition: all 0.18s`; background lerps between `bg` and `bgStrong`, border lifts from subtle → project.border.
- Bullet check — checkmark fade in `0.15s`; row stays in lane for visual stability (removed on next render).

### Loading / Error / Empty

- Prototype has no network. In the codebase:
  - **Loading**: skeleton rows (same row silhouette, `background: rgba(255,255,255,0.04)` pulsing) while bullets fetch.
  - **Error**: top-of-content inline banner using `LANE_CONFIG.now.color` text on `LANE_CONFIG.now.bg`, with retry button.
  - **Empty states** already designed: Inbox zero; Chain is empty; "No {lane} bullets" per project card.

### Responsive

Design targets 1920×1080 but should work down to 1280. Breakpoints:
- **< 1400px**: Inbox defaults closed (user can toggle on). Bento grid becomes 3-column.
- **< 1200px**: Flow cockpit collapses to `1fr | 280px` — Pool becomes a drawer behind a toggle. Bento becomes 2-column.
- Left rail is always 56px.

Mobile is out of scope here — there's a separate mobile redesign (see `reference/Organize Mobile Redesign.html` if included).

---

## Assets

No bitmap assets. All icons are inline SVG (see `Icon` in `desktop/atoms.jsx`). Fonts loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Replace with self-hosted equivalents in production per the codebase's font strategy.

---

## Files in this Bundle

| Path | Purpose |
|---|---|
| `Organize Desktop Redesign.html` | Entry point — scaled 1920×1080 stage, Babel + React. Open in a browser. |
| `desktop/data.js` | Tokens (`T`, `PROJECT_COLORS`, `LANE_CONFIG`) + `INITIAL_BULLETS` seed + `PROJECTS` list. **Start here.** |
| `desktop/atoms.jsx` | Shared primitives: `Icon`, `ProjectPill`, `LaneDot`, `KeyHint`, `TaskCheck`, etc. |
| `desktop/chrome.jsx` | `LeftRail`, `TopHeader`, `InboxPanel`. |
| `desktop/list-view.jsx` | `ListViewDesktop` — project sidebar + kanban + focus inspector. |
| `desktop/bento-view.jsx` | `BentoViewDesktop` — includes all 3 variants; **only `BentoFocus` is needed for production**. |
| `desktop/flow-view.jsx` | `FlowViewDesktop` — includes all 3 variants; **only `FlowCockpit` is needed for production**. |
| `desktop/app.jsx` | Root `App` component: state, routing, keyboard, Tweaks wiring (Tweaks can be discarded). |
| `desktop/tweaks-panel.jsx` | Design-time variant switcher. **Not shipped — discard.** |

## Implementation Checklist

1. Port tokens from `data.js` into the design system.
2. Build `Icon`, `ProjectPill`, `LaneDot`, `KeyHint`, `TaskCheck` primitives.
3. Build global chrome: `LeftRail`, `TopHeader`, `InboxPanel`, `CommandPalette`.
4. Build `ListViewDesktop` (the workhorse — users spend most time here).
5. Build `BentoFocus` (Focus-hero variant only).
6. Build `FlowCockpit` (Three-zone variant only).
7. Wire keyboard shortcuts globally; respect input focus.
8. Hook `quickAdd`, `assign`, `toggleDone`, `pullToNow`, `setLane` to real state / API.
9. Add loading skeletons, error banners, responsive breakpoints.
10. QA against the HTML prototype at `Organize Desktop Redesign.html`.
