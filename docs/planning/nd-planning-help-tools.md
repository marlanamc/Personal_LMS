# ND Planning Help Tool Brief

Product brief for additional Planning Help tools aimed at neurodivergent users. The intent is to expand the current Day Planner with tools that reduce friction, lower decision load, and create a clearer path into action.

## Product Principles

- Reduce decisions instead of adding more.
- Keep the tone supportive, calm, and non-scolding.
- Prefer guided inputs over blank states.
- Show the shape of the result before committing.
- Reuse the current planner rhythm: soft structure, rounded controls, lightweight schedule output.

## Strongest Early Candidates

These feel like the best next tools for the current UI and scheduling model:

1. **Brain Dump to Plan**
2. **Tiny Steps**
3. **Recovery Replan**
4. **Low Energy Mode**
5. **Appointment Buffer Builder**

## Tool Concepts

### Brain Dump to Plan

- **Problem**
  Convert mental clutter into a realistic short list for today.
- **Primary user moment**
  “I have too many things in my head and don’t know where to start.”
- **Inputs**
  Freeform list of thoughts or tasks, optional urgency flag, optional time available.
- **Output**
  A short prioritized plan grouped into `Now`, `Next`, and `Later`, with the `Now` items turned into blocks or starter tasks.
- **Suggested UI pattern**
  Multi-line text area plus lightweight sorting chips, followed by a compact review screen.
- **Why it fits**
  It pairs well with the existing planner because it can generate a smaller, calmer schedule from messy input.

### Tiny Steps

- **Problem**
  Help users start a task that feels too large, vague, or emotionally heavy.
- **Primary user moment**
  “I know what I need to do, but I cannot begin.”
- **Inputs**
  One task name, optional task type, optional available time, optional resistance level.
- **Output**
  A sequence of 5 to 15 minute micro-steps, with an option to turn the first few into time blocks.
- **Suggested UI pattern**
  Single-task setup screen followed by a simple ordered checklist preview.
- **Why it fits**
  This is a strong complement to On Again / Off Again because it solves “what do I even put in the blocks?”

### Low Energy Mode

- **Problem**
  Build a usable day when energy, executive function, or emotional capacity is limited.
- **Primary user moment**
  “Today is not a high-capacity day, but I still want some structure.”
- **Inputs**
  Energy level, available time window, desired intensity, optional must-do items.
- **Output**
  A gentle plan with low-friction tasks, rest buffers, and realistic pacing.
- **Suggested UI pattern**
  Quick-select energy scale plus a few supportive toggles, then a soft preview of the day.
- **Why it fits**
  It can reuse the existing block generation style while changing the selection logic.

### Task Starter

- **Problem**
  Turn intention into a concrete starting ritual.
- **Primary user moment**
  “I’m ready in theory, but I’m not actually in motion.”
- **Inputs**
  One target task, location/materials needed, optional start time.
- **Output**
  A short launch sequence such as gather materials, open file, set timer, and begin first 5 minutes.
- **Suggested UI pattern**
  Compact wizard with 3 to 4 prompts, ending in a starter sequence card.
- **Why it fits**
  Good as a lightweight tool that does not require a full-day plan.

### Priority Rescue

- **Problem**
  Reduce overwhelm when everything feels equally urgent.
- **Primary user moment**
  “There are too many priorities and I’m frozen.”
- **Inputs**
  List of competing tasks, optional urgency or consequence tags.
- **Output**
  One main task, one support task, and one backup task for today.
- **Suggested UI pattern**
  Guided triage with forced ranking and a short recommendation screen.
- **Why it fits**
  It could feed directly into the planner as a “minimum viable day” setup.

### Transition Planner

- **Problem**
  Make context-switching less abrupt by planning setup, travel, and reset time.
- **Primary user moment**
  “My day falls apart between activities, not during them.”
- **Inputs**
  Existing events or anchors, travel/setup needs, desired transition buffer length.
- **Output**
  Buffer blocks around classes, appointments, workouts, and other anchors.
- **Suggested UI pattern**
  Auto-detect important anchors, then confirm or adjust suggested buffers.
- **Why it fits**
  Strongly aligned with the current anchor-based planner model.

### Recovery Replan

- **Problem**
  Help users restart after a derailed morning, missed block, or unexpected disruption.
- **Primary user moment**
  “The day is off track and I need a reset that doesn’t make me feel worse.”
- **Inputs**
  Current time, what was missed, remaining obligations, current energy.
- **Output**
  A revised plan for the rest of the day, keeping only what still matters.
- **Suggested UI pattern**
  Fast “where are you now?” check-in followed by a shortened day preview.
- **Why it fits**
  This is likely one of the highest-value ND support tools because it addresses all-or-nothing thinking directly.

### Body Double Plan

- **Problem**
  Structure work around accountability and shared attention.
- **Primary user moment**
  “I work better when I’m not doing it entirely alone.”
- **Inputs**
  Session length, check-in cadence, partner or accountability mode.
- **Output**
  Planned work intervals with check-in points and session cues.
- **Suggested UI pattern**
  Session builder with check-in chips and a simple timeline preview.
- **Why it fits**
  It could connect well to the existing timer flow.

### Motivation Match

- **Problem**
  Pair difficult tasks with emotional or sensory supports.
- **Primary user moment**
  “I can do the task if I make it feel better somehow.”
- **Inputs**
  Necessary tasks, preferred rewards, preferred environments, preferred pairings.
- **Output**
  Task-support pairings like “email admin + favorite tea” or “cleanup + one playlist.”
- **Suggested UI pattern**
  Two-column matcher with quick suggestions.
- **Why it fits**
  Helpful for emotional regulation without needing complex scheduling logic.

### Decision Lightener

- **Problem**
  Reduce open-ended choice overload.
- **Primary user moment**
  “I need fewer options, not more.”
- **Inputs**
  A small list of possibilities, optional available time, optional energy.
- **Output**
  Two to three good-enough choices for the next step.
- **Suggested UI pattern**
  Decision cards with one recommended option and two alternates.
- **Why it fits**
  Very lightweight and easy to use inside Planning Help.

### Energy Map

- **Problem**
  Place tasks in a more realistic order based on mental and emotional load.
- **Primary user moment**
  “My plan looks fine on paper but not for the way my brain actually works.”
- **Inputs**
  Tasks plus quick ratings for mental load, physical load, and resistance.
- **Output**
  A reordered or color-coded plan that better matches likely capacity through the day.
- **Suggested UI pattern**
  Tagging chips followed by a reordered schedule preview.
- **Why it fits**
  This could become an advanced version of the current planner.

### Appointment Buffer Builder

- **Problem**
  Protect appointments and classes with enough prep and recovery time.
- **Primary user moment**
  “The appointment isn’t just the appointment.”
- **Inputs**
  Existing calendar items, prep needs, transit time, recovery time.
- **Output**
  Automatically inserted blocks before and after appointments.
- **Suggested UI pattern**
  Calendar-aware suggestions with adjustable buffer controls.
- **Why it fits**
  This is one of the most natural extensions of the existing event + timeline system.

### Must / Nice / If Extra

- **Problem**
  Separate a realistic minimum day from optional extras.
- **Primary user moment**
  “I need to know what counts as enough.”
- **Inputs**
  List of tasks, optional required items, optional time available.
- **Output**
  Three tiers: `Must`, `Nice`, and `If Extra`.
- **Suggested UI pattern**
  Column sort or progressive list builder.
- **Why it fits**
  Strong emotional value with low implementation complexity.

### Momentum Builder

- **Problem**
  Create motion first, then use it to enter deeper work.
- **Primary user moment**
  “I need to build momentum before I tackle the hard thing.”
- **Inputs**
  Quick-win tasks, target deep task, available time.
- **Output**
  A sequence that starts easy and gradually increases cognitive load.
- **Suggested UI pattern**
  Three-stage builder: warm-up, main focus, finish.
- **Why it fits**
  Feels compatible with the current alternating structure.

### Shutdown Helper

- **Problem**
  End the day cleanly and make tomorrow easier to start.
- **Primary user moment**
  “I don’t want to lose track of what still matters.”
- **Inputs**
  Unfinished tasks, calendar context, optional tomorrow focus.
- **Output**
  A short carry-forward list and tomorrow starter plan.
- **Suggested UI pattern**
  End-of-day checkoff with a simple tomorrow summary.
- **Why it fits**
  Good as a companion to the planner rather than a full replacement.

## Recommended Build Order

### Tier 1: Highest value with current system

- **Brain Dump to Plan**
- **Tiny Steps**
- **Recovery Replan**
- **Appointment Buffer Builder**

### Tier 2: Strong support tools with moderate complexity

- **Low Energy Mode**
- **Must / Nice / If Extra**
- **Decision Lightener**
- **Transition Planner**

### Tier 3: Useful but more specialized

- **Task Starter**
- **Body Double Plan**
- **Motivation Match**
- **Momentum Builder**
- **Shutdown Helper**
- **Energy Map**

## Suggested Shared UI Patterns

- **Quick setup tools**
  Best for `Tiny Steps`, `Task Starter`, `Decision Lightener`, `Low Energy Mode`
- **List-to-plan tools**
  Best for `Brain Dump to Plan`, `Must / Nice / If Extra`, `Priority Rescue`
- **Calendar-aware tools**
  Best for `Appointment Buffer Builder`, `Transition Planner`, `Recovery Replan`
- **Session tools**
  Best for `Body Double Plan`, `Momentum Builder`, `Shutdown Helper`

## Notes for Implementation

- Favor tools that can generate a preview before committing changes.
- Keep generated output editable after creation.
- Avoid requiring too many form fields up front.
- Prefer 1 to 3 high-signal decisions per step.
- Use language that lowers shame and supports re-entry after getting off track.
