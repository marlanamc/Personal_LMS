import type { InteractiveGuideContent } from "@/types/activity";

export const codingEstimationScopingCommunication: InteractiveGuideContent = {
  id: "coding-estimation-scoping-communication",
  title: "Estimation, Scoping & Technical Communication",
  category: "Advanced Implementation",
  description:
    "Master the art of scoping features, estimating timelines, and communicating technical uncertainty to non-technical stakeholders.",
  level: "advanced",
  estimatedMinutes: 180,
  sections: [
    {
      id: "intro-estimation",
      title: "Bridging Developer Estimates and Stakeholder Expectations",
      stepNumber: undefined,
      icon: "🌉",
      explanation: `
When you say "this will take 3-5 days," your stakeholder hears "we'll ship on Thursday." When you later realize it's actually two weeks, they feel misled—even though your estimate was reasonable.

The gap isn't in your technical judgment. It's in communication.

This lesson teaches a skill that separates individual contributors from technical leads: the ability to scope a feature accurately, estimate with appropriate uncertainty, communicate risk honestly, and maintain credibility when reality differs from the plan.

**Why This Matters for Implementation Managers:**
- Broken estimates undermine stakeholder trust and derail roadmaps
- Vague scoping causes team misalignment and rework
- Undisclosed risks emerge during shipping (always)
- Clear communication prevents "surprise" delays and scope creep
- Credible estimates compound: each accurate estimate makes the next one believable

**What You'll Learn:**
- How to break down a feature into estimable units
- Questions that expose hidden complexity before estimation
- How to present uncertainty ranges that stakeholders actually understand
- When to push back on aggressive timelines and when to accept them
- How to adjust your estimates and communicate changes transparently

The goal isn't to be "right" every time. It's to be honest, clear, and calibrated. Over time, that builds more trust than any perfectly-timed estimate.
      `,
    },

    {
      id: "anatomy-estimate",
      stepNumber: 1,
      title: "The Anatomy of a Developer Estimate",
      icon: "🧬",
      explanation: `
Every estimate you give has three invisible components:

**1. The Core Task Complexity**
This is the actual work: write the code, run the tests, deploy. For a simple feature, this might be 4 hours. You usually estimate this part correctly.

**2. The Uncertainty Buffer**
This is where reality lives. You've estimated the happy path, but:
- Existing code might be messier than you thought
- You might hit an unexpected library limitation
- Cross-team dependencies might block you
- The "simple" database migration might have cascading effects

Most developers either ignore this entirely (leading to "I forgot about edge cases") or add a blanket 50% buffer (leading to "we finished early, so I guess my estimate was conservative").

**3. The Context Switching Tax**
While you're building, you might:
- Get interrupted for urgent questions
- Need to review a colleague's code
- Spend time in meetings about how you're spending time
- Debug something in another part of the codebase

This is real, and it compounds. A "2-hour feature" becomes a full day when context switching is included.

**The Breakdown Model:**

Total Estimate = Core Task + Uncertainty Buffer + Context Tax
15 days = 8 days (core) + 4 days (buffer) + 3 days (context)

**When to Adjust Each Component:**

| Component | You Underestimate When | You Overestimate When |
| --- | --- | --- |
| Core Task | You're unfamiliar with the tech stack | You're extending existing, well-understood code |
| Uncertainty | You haven't looked at the codebase yet | You've recently done similar work |
| Context Tax | The team is understaffed or context-heavy | You have dedicated, uninterrupted focus time |

**Exercise: Decompose an Estimate**

Think of a feature you recently estimated. Break down your estimate into:
- Core task hours (write code + test)
- Uncertainty hours (what could go wrong?)
- Context hours (meetings, reviews, interruptions)

Were you explicit about all three, or did you conflate them into a single number?
      `,
    },

    {
      id: "clarifying-questions",
      stepNumber: 2,
      title: "Questions to Ask When Estimates Feel Off",
      icon: "❓",
      explanation: `
Sometimes you estimate a feature at 3 weeks, and the stakeholder expects 3 days. Or you say "2-4 weeks" and they commit to "2 weeks" without acknowledging the range.

Before you re-estimate, ask questions. The best questions expose hidden assumptions—from both you and the stakeholder.

**Questions About Scope Clarity:**

1. **"What does 'done' look like?"**
   - Does this include mobile responsiveness? (2-4 days of work)
   - Does this include analytics/logging? (1-2 days)
   - Do we need to migrate existing data? (1-3 weeks)
   - Is this a v1 or v1 + subsequent refinements?

   Why: "Build the checkout flow" could mean "one button that calls an API" or "full payment integration with error recovery and analytics." Same phrase, 10x different time.

2. **"Are there dependencies I'm not aware of?"**
   - Does this depend on another team completing something?
   - Do we need a security review before shipping?
   - Are there compliance/regulatory requirements?
   - Is the API contract with mobile already locked in, or can we adjust it?

   Why: You might estimate correctly, but if you're blocked on someone else, the stakeholder's timeline is wrong.

3. **"What's the downside of shipping later vs. sooner?"**
   - Is this blocking a big customer? (changes the timeline analysis)
   - Is this for a planned announcement? (hard deadline)
   - Is this a nice-to-have improvement? (can slip)
   - Does this need to ship with something else?

   Why: If shipping on Tuesday vs. Thursday makes no business difference, your estimate might expand to include more quality.

4. **"How much rework are we budgeting for?"**
   - Is design still fluid, or is it locked in?
   - Have we done this before, or is this new territory?
   - Are we planning a full QA cycle, or just smoke testing?

   Why: First implementation is different from "implement a pattern we already use." Rework time is often undisclosed.

5. **"If this takes longer than estimated, what happens?"**
   - Does the roadmap slip?
   - Does something else get delayed?
   - Do we reduce scope instead?

   Why: This reveals whether your timeline is hard ("we committed to a partner") or soft ("nice to have"). Hard timelines change how you estimate.

**Questions About Your Estimate:**

After asking the above, use these to pressure-test your own math:

1. **"Have I done this exact thing before?"**
   - If yes, my estimate should be 60-80% of last time (learning curve paid, patterns known)
   - If no, I should add 50-100% buffer

2. **"What's the ONE thing that could double this estimate?"**
   - That's your uncertainty zone. Quantify it.
   - Example: "If the database migration is messy, this goes from 5 days to 10."

3. **"Would I bet $1,000 that we'd ship within this timeline?"**
   - If not, the estimate isn't real. Revise upward until you would.

4. **"Am I accounting for the 'gotchas' in this codebase?"**
   - Slow tests you'll wait on?
   - Flaky test suites that need reruns?
   - API contract ambiguities that need clarification?

**Exercise: Ask Questions First**

In your next estimation meeting, ask these questions before giving a number:
- "What does done look like?"
- "What are the dependencies?"
- "What's the business driver for this timeline?"
- "What happens if we take longer?"

Record the answers. Then estimate. You'll likely be more accurate and more confident.
      `,
    },

    {
      id: "uncertainty-ranges",
      stepNumber: 3,
      title: "Communicating Uncertainty Ranges to Stakeholders",
      icon: "📊",
      explanation: `
Here's the mistake most engineers make: they give a single number ("5 days") and the stakeholder treats it as a commitment.

Here's the better approach: you give three numbers, each with explicit meaning.

**The Three-Point Estimate:**

| Term | What It Means | Example |
| --- | --- | --- |
| **Best Case** | Everything goes right, no surprises, you stay focused | "If the API contract is locked and existing code is clean: 3 days" |
| **Likely Case** | Realistic middle ground with normal interruptions | "With typical context switching and one round of clarification: 5 days" |
| **Worst Case** | Something goes seriously wrong but it's still fixable | "If the database schema needs changes and we hit a library limitation: 12 days" |

**How to Present This to Stakeholders:**

❌ **Bad:** "5 to 12 days"
Stakeholder hears "it'll be done in 5 days" and plans accordingly

✅ **Good:** "Most likely 5 days. Best case 3 if we can lock the API contract. Worst case 12 if the database schema needs changes. I'd plan for 5."

**Why the Worst Case Matters:**

The worst case isn't pessimism. It's risk management. It answers: "What if we're wrong about something?"

The worst case also gives stakeholders permission to ask: "What would make that worst case NOT happen?"

Examples:
- "If we finalize the design now instead of iterating, we cut 3 days"
- "If we can borrow someone from the API team to help with the contract, we reduce risk"
- "If we delay this two weeks, the database team will have completed their refactor, which saves us a week"

**The Probability Distribution:**

You're not saying "there's a 33% chance of each outcome." You're saying:

Best case (3 days):      5% probability  ▮
Likely case (5 days):   70% probability  ▰▰▰▰▰▰▰
Worst case (12 days):   20% probability  ▰▰
Rare disaster (3+ weeks): <5% probability ▮

If you have 5-10 estimates like this across a roadmap, the math works out: some come in under estimate, some over, and the roadmap lands near your "likely" projection.

**Red Flags That Your Range Is Dishonest:**

1. **"2 weeks, but probably more"**
   - If it's probably more, that's not your likely case. Revise.
   - "Likely case: 3 weeks" is more honest and more useful.

2. **Huge range ("3 days to 6 weeks")**
   - This means you don't understand the problem yet.
   - Say: "I need to investigate the codebase first. I'll give you a real estimate by tomorrow."

3. **"I'm 90% confident in this estimate"**
   - Over-confidence kills credibility when you miss.
   - "I'm 60% confident, which is why the range is this wide" is more realistic.

4. **Estimates that don't account for your actual interruptions**
   - If you know you're in 4 meetings a day, your context tax is real.
   - Your "likely case" includes that tax, or it's not realistic.

**Exercise: Present a Range**

Take a task from your work (or use: "Add a login-with-Google button to the app").

Break it down:
- **Best case:** What would have to be true?
- **Likely case:** What's realistic?
- **Worst case:** What could go seriously wrong?

Don't overthink it. The habit of thinking in three scenarios is more valuable than the precision.
      `,
    },

    {
      id: "translate-business-timeline",
      stepNumber: 4,
      title: "Translating Technical Estimates Into Business Timelines",
      icon: "🗓️",
      explanation: `
Engineers think in units: "5 days of work."

Stakeholders think in dates: "Ship by March 15th."

The translation is where miscommunication lives.

**The Unit Problem:**

When you say "5 days," you might mean:
- 5 days of my focused work (which requires 2 weeks of calendar time if I'm 50% allocated)
- 5 business days (Mon-Fri, no holidays)
- 5 consecutive workdays starting Monday
- 40 hours of actual coding time (not counting meetings)

The stakeholder might hear:
- "Shipping on Friday" (if you said this on Monday)
- "Shipping February 23rd" (if they think business days starting from today)
- "Shipping in 5 calendar days" (wrong if there's a weekend)

**The Allocation Problem:**

"5 days of work" at different allocations:
- 100% allocated:        Ship in 5 calendar days (Wed-Mon)
- 50% allocated:         Ship in 10 calendar days (2 weeks)
- 25% allocated:         Ship in 20 calendar days (4 weeks)
- On-call duties:        Add 2-3 days for incidents
- Quarterly planning:    Add 1 week per quarter
- Other projects:        ??? (unclear)

The stakeholder often doesn't know your allocation. You must state it.

**How to Translate Correctly:**

**Step 1: State your allocation clearly**

"I'm at 50% on project X, 25% on on-call, and 25% available for this. So 5 days of work is 2 weeks of calendar time."

**Step 2: Pick a start date**

"If we start this Monday, and there are no blockers…"

**Step 3: Account for known interruptions**

- "I'll be in the annual conference that week, so add 3 days"
- "Q2 planning starts the 15th, so we'd start after that"
- "You mentioned the design isn't final yet. When do you need it by?"

**Step 4: Give a date range**

"Most likely shipping March 10th. Could be March 7th if we move fast. March 17th if we hit complications."

**Step 5: Call out the unknowns**

"This assumes the API contract is locked in. If we need to iterate on that, it could slip another week."

**The Dependency Timeline:**

Legend: — = waiting, ==== = working

Design:      —————————————————— (locked Feb 22)
   └─> Your implementation: Feb 22 to Mar 10 (15 calendar days, 5 of work at 50%)
   └─> QA and fixes: Mar 10 to Mar 14
   └─> Ship: Mar 15

Show this to stakeholders. It's far clearer than "5 days."

**The Optimization Conversation:**

Once you've given a timeline, stakeholders often ask: "Can we ship sooner?"

You have levers:

1. **More allocation** ("If I go to 100%, it's March 7th instead of March 10")
2. **Earlier start** ("If design ships by Feb 15, we could ship by March 7")
3. **Reduced scope** ("If we ship v1 without analytics, it's February 28")
4. **More people** ("With another engineer, we could parallelize and ship by March 3")
5. **Fewer unknowns** ("If we lock the API contract now, I lose the 3-day uncertainty buffer")

These conversations are healthy. They let stakeholders make tradeoff choices consciously.

**The Dangerous Assumption:**

Many stakeholders assume "5 days" means "5 business days starting today."

Preempt this by being explicit:

"5 business days of focused work. I'm 50% allocated, so that's 2 calendar weeks. Assuming we start Monday and there are no blockers, shipping by March 10th. Design needs to ship by Feb 22. Once it does, I can start immediately."

**Exercise: Create a Timeline**

Take a task from your backlog:
1. Break down the work into units (design: 3 days, implementation: 5 days, testing: 2 days)
2. Note your allocation (50%? 80%?)
3. Identify dependencies ("design must be done first")
4. Pick a calendar start date
5. Calculate the ship date
6. List what could slip it later

Then share this with a teammate. Is your translation clear to them?
      `,
    },

    {
      id: "push-back-accept",
      stepNumber: 5,
      title: "When to Push Back vs. When to Accept Aggressive Timelines",
      icon: "⚖️",
      explanation: `
Your stakeholder asks: "Can we ship the new dashboard by end of week?"

You know it's a 3-week job. Do you:
- Push back hard ("That's impossible")?
- Accept and hope ("Sure, I'll try my best")?
- Negotiate ("How about 2 weeks if I go to 100% allocation?")?

The wrong choice here damages either the product, your credibility, or both.

**When to Push Back (Hard):**

Push back when accepting the timeline would require:

1. **Cutting essential quality**
   - "Shipping without error handling would let production outages silently fail"
   - "Shipping without tests means we break this in 2 weeks and spend a month debugging"
   - "Cutting database optimization means this feature hits the API at 1,000 requests/second"

   These aren't nice-to-haves. They're non-negotiable.

2. **Lying about what's possible**
   - "We can't rewrite the authentication system in 3 days. It's architecturally complex."
   - "The database migration alone is 2 weeks of testing. No way around it."
   - "We've never integrated with this API before. Estimating 3 days is dishonest."

   If you accept, you're committing to failure. Better to be honest now.

3. **Burning out your team**
   - "This requires 60-hour weeks for a month. That's not sustainable."
   - "I'm already on-call and managing deployments. Adding this would crash the system."

   Crunch time is occasionally necessary. Regular crunch means leadership is broken.

4. **Blocking other commitments that matter more**
   - "If I do this in 3 days, the security audit slips by a month. That's a bigger risk."
   - "This pushes out the API migration, which 3 other teams depend on."

   If your stakeholder doesn't know the tradeoff, they can't decide. Tell them.

**How to Push Back Effectively:**

❌ **Bad:** "That's impossible."
Sounds dismissive. Stakeholder digs in.

✅ **Good:** "Here's why that's risky, and here are the options."

"I've estimated this at 3 weeks of actual work. To ship by end of week,
I'd need to:

Option A: Skip testing and error handling (not recommended—production risk)
Option B: Cut features (what's the priority order?)
Option C: Add more people (someone would need to context-switch)
Option D: Ship v1 by end of week, v2 features the week after

Which of these would work for you?"

You're not refusing. You're clarifying what "end of week" actually costs.

**When to Accept (Even If It's Tight):**

1. **The timeline is negotiable under pressure**
   - "End of week if possible, but next Wednesday is fine"
   - You can probably make next Wednesday. Accept.

2. **Cutting scope is on the table**
   - "What's the smallest version that would solve the problem?"
   - If you can deliver a focused v1 in the timeline, accept.

3. **The business genuinely can't wait**
   - "A customer is deciding between us and our competitor. Decision Monday."
   - These moments are rare and important. Accept, deliver, then debrief on how to prevent the last-minute crunch.

4. **You have more allocation available**
   - "I can go to 100% and call in help. We could ship by next Friday."
   - If you actually can move other work, this is a real offer. Make it.

5. **You're more confident than you thought**
   - You've done this 10 times. Today feels different.
   - "Actually, I've done this pattern before. I can ship by Thursday."
   - Trust your instincts, but verify them.

**The Conversation Framework:**

Stakeholder: "Can we ship by end of week?"

You: "Let me be concrete. Here's my estimate and what would need to change:

Best case: 2 weeks (if everything goes right)
Likely: 3 weeks (normal pace)
If we remove [feature], we could do 2 weeks"

[Pause. Let them decide.]

Stakeholder: "We need it by end of week."

You: "I need to be honest: I can't commit to that without cutting something significant or risking production stability. Here's what I can offer:

A) Ship v1 without [feature] by Friday, full version next week
B) Ship the full thing by next Friday at 100% focus (I'd drop other projects)
C) Ship by Friday if you can add another engineer to help

Which works for you?"

**The Red Flag (for you):**

If you find yourself regularly accepting timelines you don't believe in, the problem is bigger than estimation. It's your team's velocity, prioritization, or your ability to say no.

Push back on the system, not just individual asks:

"We keep committing to 3-week projects that actually take 4-5 weeks. Can we:
- Build a 20% buffer into all timelines?
- Reduce how many projects we take on?
- Be more honest about what 'done' means?"

**Exercise: Practice Pushing Back**

Imagine these scenarios. Draft your response:

1. **Scenario:** "We promised the customer this feature ships next month. Can you do it?"
   Your response: _________

2. **Scenario:** "Everyone is working weekends on this launch. Can you pull all-nighters to help?"
   Your response: _________

3. **Scenario:** "The business needs a decision. Can you give us a 3-day estimate by end of day?"
   Your response: _________

For each, is your response:
- Honest about the constraint?
- Offering options instead of just saying no?
- Clear about what accepting costs?
      `,
    },

    {
      id: "credibility-over-time",
      stepNumber: 6,
      title: "Building Estimate Credibility Over Time",
      icon: "📈",
      explanation: `
After six months, one team member is asked for estimates constantly. Another is avoided.

The difference isn't that the first person is always right. It's that they're consistently honest.

Credibility isn't about being accurate. It's about being calibrated.

**What Builds Credibility:**

1. **Acknowledging when you're wrong**
   - "I estimated 3 days, it took 5. Here's why: [specific reason]"
   - "I was too optimistic about the existing codebase complexity"
   - This is better than "I was right, the scope just expanded"

2. **Giving ranges, not commitments**
   - "Likely 3 weeks, possibly 4 if we hit complications"
   - When you deliver in 3 weeks, stakeholders are happy (you beat the estimate)
   - When you deliver in 4, they're not surprised (you warned them)

3. **Updating as you learn**
   - Week 1: "Estimated 3 weeks total, on track"
   - Week 2: "Discovered more complexity, revising to 4 weeks"
   - This is better than discovering it on week 3 and surprising everyone

4. **Calling out hidden assumptions**
   - "This assumes the API contract stays stable"
   - "This assumes no major incidents consume our time"
   - "This assumes design is final before I start"
   - Stakeholders remember these. When assumptions change, they understand.

5. **Tracking your actual performance**
   - Keep a simple log: estimated X days, took Y days, reason
   - Review it quarterly: "I tend to underestimate database work by 30%"
   - Use that pattern to improve future estimates

**The Calibration Model:**

Over time, you want your estimates to cluster around your actual time:

Perfect Calibration:
- Estimate 3 weeks, deliver in 3 weeks: 40% of projects
- Estimate 3 weeks, deliver in 2: 30% of projects (ahead)
- Estimate 3 weeks, deliver in 4: 30% of projects (behind)

Over-Confident (bad):
- Estimate 3 weeks, deliver in 5: 60% of projects
- Estimate 3 weeks, deliver in 3: 20% of projects
- Estimate 3 weeks, deliver in 2: 20% of projects

Overly Conservative (wastes time):
- Estimate 3 weeks, deliver in 1.5: 60% of projects
- Estimate 3 weeks, deliver in 3: 30% of projects
- Estimate 3 weeks, deliver in 4: 10% of projects

The goal is the first pattern. Some early. Some late. Mostly on time.

**How to Improve Your Calibration:**

1. **Pick a measurement period (one quarter)**
   - List all estimates you gave
   - Actual time taken
   - Variance (% over/under)

2. **Look for patterns**
   - "I'm 30% over on backend work, 20% under on frontend"
   - "I'm always optimistic in the morning, more realistic after coffee"
   - "I'm terrible at database migrations"

3. **Adjust your process**
   - If you're over on backend, build a 25% buffer into backend estimates
   - If you discover you missed dependency risks, ask dependency questions earlier
   - If incidents keep derailing you, plan lower allocation (50% instead of 75%)

4. **Share your pattern**
   - "I've noticed I tend to underestimate by 20-30%. I'm building that into my estimates."
   - Stakeholders trust you more when you're self-aware about your biases

**The Credibility Killer:**

"I'll have it done by Friday." (Thursday: still 3 days of work)
"Maybe by end of next week." (Friday of next week: almost done)
"Early the following week." (Following Monday: waiting for review)
"By Wednesday." (Wednesday: finally done)

Once you've moved a deadline three times, stakeholders stop trusting you. Not because you were wrong—because you were unclear.

The fix: give a range upfront.

"I'll likely have it done by Friday. Worst case, Wednesday of next week. I'll update you Tuesday if it'll slip."

Then you meet that range. Credibility built.

**The Career Implication:**

Good estimators get asked to estimate hard projects. Bad estimators get assumed to be slow and get fewer responsibilities.

Being good at estimation—and communication about estimation—is a key skill for senior roles. This is how you demonstrate judgment and integrity.

**Exercise: Track Your Estimates**

Starting today:
1. Write down 5 recent estimates you gave
2. Check the actual time taken
3. Calculate the variance (% over/under)
4. Identify the pattern
5. What adjustment would improve your next estimate?

Share this pattern with someone on your team. Use it to inform your next estimate.
      `,
    },

    {
      id: "practice-estimation",
      stepNumber: 99,
      title: "Practice Cadence & I Can Now",
      icon: "🎯",
      explanation: `
**You Should Now Be Able To:**

- [ ] Ask clarifying questions about scope before giving an estimate
- [ ] Decompose an estimate into core task, uncertainty, and context components
- [ ] Present estimates as three-point ranges (best/likely/worst) with meaning
- [ ] Translate technical days-of-work into calendar timelines with dependencies
- [ ] Identify when to push back hard on aggressive timelines
- [ ] Build and maintain credibility through honest, calibrated estimates
- [ ] Recognize your personal estimation biases and adjust for them
- [ ] Update stakeholders when estimates change, with clear reasons
- [ ] Have productive negotiations about scope/timeline/allocation tradeoffs

**Daily Practice:**

Your next 3 estimation tasks:
1. **Practice with clarity:** Estimate something in your backlog. Write out best/likely/worst case. Don't give a single number.
2. **Practice with updates:** If something you estimated earlier is now different, write an update email explaining why (specific reason, not "scope changed").
3. **Practice with questions:** In your next estimation, ask at least 3 clarifying questions before estimating.

**Weekly Reflection:**

Every Friday:
- What estimates were accurate? Why?
- What estimates were off? What did you miss?
- Did you communicate uncertainty clearly?
- Did you build credibility or lose it?

**Mini-Quiz: Estimation Communication**

---

**Question 1:** Your CTO asks, "Can we ship the new reporting dashboard by end of month?"

You've estimated 4 weeks of core work, plus uncertainty. It's currently mid-month.

What do you say?

A) "No, that's impossible."
B) "Yes, if the design is locked and there are no blockers."
C) "I've estimated 4 weeks of work. To ship by month-end, we'd need to cut the export feature. That's the best-case scenario."
D) "Probably not, but I'll try my best."

**Correct answer:** C

**Why:** A is dismissive. B is overconfident. D is vague and builds false hope. C acknowledges the ask, gives what's possible, and makes the tradeoff explicit.

---

**Question 2:** You've estimated a feature at "3-5 days."

Your stakeholder schedules it for next Monday and plans to announce it Tuesday.

What went wrong?

A) Your estimate was too optimistic.
B) Your range was too wide.
C) You didn't translate days-of-work into calendar time and dependencies.
D) You should have said "3 days" instead of a range.

**Correct answer:** C

**Why:** A range of 3-5 days is reasonable. But the stakeholder heard "3 days" and didn't account for Monday startup and Tuesday announcement pressure. You should have said: "If we start Monday, likely shipping Wednesday. Best case Tuesday if everything goes right. Worst case Thursday."

---

**Question 3:** Mid-project, you realize your estimate was too aggressive. You're 3 days in, with 4 days of work remaining.

You originally said "4 days total."

What do you do?

A) Keep your head down. Deliver on day 6 and explain later.
B) Tell the stakeholder immediately: "I was wrong, it's 7 days total."
C) Update today with specifics: "I found more complexity in the data layer than expected. I'm revising to 7 days. To avoid further slippage, can we lock the requirements now?"
D) Ask for 2 more days without explanation.

**Correct answer:** C

**Why:** A loses credibility when you miss. B is honest but vague. C is honest, specific about why, and proactive about preventing further slippage. D comes across as asking for sympathy without taking responsibility.

---

**Question 4:** Your team regularly overruns estimates by 30-40%.

What's the systemic problem?

A) Your team is slow.
B) Estimates aren't accounting for your actual interruption rate, incident rate, or complexity of existing code.
C) You need to push your team harder.
D) Requirements always expand mid-project.

**Correct answer:** B (though D contributes)

**Why:** If everyone misses by 30-40%, individual speed isn't the issue. It's that your estimation process isn't accounting for real constraints. Measure your actual allocation, incident frequency, and codebase complexity. Build those into baseline estimates.

---

**Question 5:** You're asked for a "quick estimate" for a feature you've never seen before.

What's the honest answer?

A) Give your best guess in 5 minutes.
B) "I need 2 hours to investigate the codebase first. Then I can give you a real estimate."
C) "Probably 2-3 weeks?"
D) "Let me check with the team and get back to you tomorrow."

**Correct answer:** B

**Why:** A and C are guesses. D is delaying. B is honest: estimating without understanding the codebase is a guess. You need time to read the code, understand dependencies, and ask questions. 2 hours of investigation yields a 1-hour estimate that's better than 5 minutes of guessing.

---

**Question 6:** You've committed to a 3-week feature. Week 2, you realize it'll actually take 5 weeks.

How do you communicate this?

A) Wait until week 3 to say something.
B) "I was too optimistic. It's now 5 weeks total."
C) "I've done more investigation and found additional complexity. Here's what I missed: [specific technical debt, dependencies, unknown unknowns]. New estimate is 5 weeks. To mitigate, I can ship v1 in 3 weeks without [feature], or we can extend the timeline."
D) Ask for more help to "catch up."

**Correct answer:** C

**Why:** You communicate early (not week 3), you're specific about why you missed, and you offer options instead of just asking for pity. This preserves credibility because you own the miss and offer solutions.

---

**Question 7:** Your manager says, "Our biggest customer needs this feature next month. Can you commit?"

You know it's a 6-week job realistically.

A) "I'll try my best."
B) "No."
C) "I can ship v1 without [feature] in 4 weeks, or the full thing in 6-7 weeks realistically. Which is the priority?"
D) "Only if I get 100% allocation and no interruptions."

**Correct answer:** C

**Why:** A is vague and sets up false hope. B leaves no room for negotiation. C offers what's realistic and gives the manager a choice. D is a condition that sounds demanding. C sounds collaborative.

---

**Question 8 (Hard):** You've shipped 10 projects. Your estimates were:

Est: 2w, Actual: 2w
Est: 3w, Actual: 5w
Est: 1w, Actual: 1w
Est: 4w, Actual: 3w
Est: 2w, Actual: 2w
Est: 3w, Actual: 4w
Est: 2w, Actual: 3w
Est: 5w, Actual: 6w
Est: 1w, Actual: 1w
Est: 3w, Actual: 3w

What's your credibility status?

A) Excellent—you hit 4/10 on the nose.
B) Poor—you missed on 6/10.
C) Good—your actual average (3.3w) vs. estimated average (2.6w) shows a consistent 20% underestimation, which you can account for.
D) Unknown—you need more data.

**Correct answer:** C

**Why:** You're not calibrated perfectly, but you're consistently biased by about 20%. That's useful information. Adjust your next 10 estimates up by 20% and see if you converge. Consistency in bias is better than random misses because it's correctable.

---

**Question 9:** You realize that estimates for "backend work" are always off by 30%, but "frontend work" is usually accurate.

What do you do?

A) Apologize for being bad at backend estimates.
B) Stop estimating backend work.
C) Add a 30% buffer to all backend estimates going forward.
D) Investigate: Why is backend underestimated? (Database complexity? Unfamiliarity? Integration surprises?) Fix the root cause, then adjust buffers.

**Correct answer:** D

**Why:** Understanding why you miss is better than just adding buffer. Maybe you need more backend code review time upfront. Maybe you need to investigate database schema deeper. Maybe you're unfamiliar with the API integration patterns. Fix the root, not the symptom.

---

**Question 10 (Practical):** You're estimating this LMS feature: "Add a new badge type to the achievement system."

Break down your estimate:

Core task: ________ hours
(Write new code, update database schema, write tests)

Uncertainty: ________ hours
(What could be messier than expected?)

Context tax: ________ hours
(Meetings, reviews, interruptions)

Total: ________ hours or ________ days at your current allocation

**Sample answer:**
- Core task: 6 hours (schema change + code + tests)
- Uncertainty: 3 hours (might need to handle backward compatibility for existing badges)
- Context tax: 2 hours (code review, deployment check-in)
- Total: 11 hours approximately 1.5 days at 100% focus, or 2-3 days at 50% allocation

Your estimate: Did you account for all three components? Or did you just guess a number?
      `,
    },
  ],
};
