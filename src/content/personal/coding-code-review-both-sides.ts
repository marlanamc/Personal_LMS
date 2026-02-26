import type { InteractiveGuideContent } from "@/types/activity";

export const codingCodeReviewBothSidesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Reading and Giving Code Review Feedback: Dialogue, Not Judgment",
      icon: "🔍",
      explanation: `
        <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
          <p style="font-size: 1.05rem; margin: 0;"><strong>Code review is the most underrated learning tool in software development. Done right, it's a conversation that makes both reviewers and authors better.</strong> Done wrong, it kills team morale and creates defensiveness.</p>
        </div>

        <h3>Why Code Review Matters</h3>
        <p>Code review isn't about finding bugs (tests do that). It's about:</p>
        <ul>
          <li><strong>Shared ownership:</strong> Multiple people understand every piece of code</li>
          <li><strong>Learning:</strong> Reviewers learn new patterns, authors learn new perspectives</li>
          <li><strong>Standards:</strong> Team agrees on how code should be written</li>
          <li><strong>Risk reduction:</strong> Catching architectural issues before they cost hours</li>
        </ul>

        <h3>The Two Sides of Code Review</h3>
        <p><strong>As a reviewer,</strong> you give feedback that helps the author (and teaches you).</p>
        <p><strong>As an author,</strong> you receive feedback professionally and learn from it.</p>

        <h3>What You Will Learn</h3>
        <ul>
          <li>How to read a PR effectively (what to look for first)</li>
          <li>Distinguishing blocking issues from suggestions</li>
          <li>Giving feedback via questions (not commands)</li>
          <li>The three-move response: Agree / Clarify / Propose</li>
          <li>What good code review feedback looks like</li>
          <li>How to learn from reviews, even critical ones</li>
          <li>Code review anti-patterns to avoid</li>
        </ul>
      `,
      tipBox: {
        title: "Core Principle",
        content: "Code review is a gift, not a judgment. As a reviewer: Help, don't criticize. As an author: Listen, don't defend. Both sides are trying to improve the code together."
      },
      exercises: [
        {
          type: "text",
          label: "When you receive code review feedback, do you usually feel defensive, grateful, or something else? Why?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "reading-pr",
      stepNumber: 1,
      title: "Reading a PR: What to Look For First",
      icon: "📋",
      explanation: `
        <h3>The PR Reading Strategy</h3>
        <p>Don't dive into code immediately. Follow this order:</p>

        <h3>Step 1: Read the PR Description</h3>
        <p><strong>Goal:</strong> Understand what changed and why.</p>
        <p><strong>Look for:</strong></p>
        <ul>
          <li><strong>Problem statement:</strong> What bug is being fixed or feature is being added?</li>
          <li><strong>Scope:</strong> What files are touched?</li>
          <li><strong>Decisions:</strong> Why was this approach chosen?</li>
          <li><strong>Testing:</strong> How was this validated?</li>
          <li><strong>Risk notes:</strong> What could go wrong?</li>
        </ul>

        <p><strong>Red flag:</strong> PR with no description or "small fix." (Likely indicates low effort or unclear thinking.)</p>

        <h3>Step 2: Check the Files Changed</h3>
        <p><strong>Goal:</strong> Understand scope before reading code.</p>
        <p><strong>Questions:</strong></p>
        <ul>
          <li>How many files? (1-2 is focused; 20+ is unfocused)</li>
          <li>Are changes in expected places? (Or surprising?)</li>
          <li>Are tests included?</li>
          <li>Are migrations or breaking changes present?</li>
        </ul>

        <h3>Step 3: Read the Code Diff (Not the Full Files)</h3>
        <p><strong>Goal:</strong> See only what changed, in context.</p>
        <p><strong>Best practices:</strong></p>
        <ul>
          <li>Use the diff view (GitHub/GitLab shows additions/deletions)</li>
          <li>Start with the most important file first</li>
          <li>Skip refactoring-only changes unless they're complex</li>
          <li>Pay attention to lines marked + (added) and - (removed)</li>
        </ul>

        <h3>Step 4: Identify High-Risk Areas</h3>
        <p><strong>Ask:</strong> Where could bugs hide?</p>
        <ul>
          <li><strong>Database changes:</strong> Migrations, schema changes, queries</li>
          <li><strong>API contract changes:</strong> Request/response shape differences</li>
          <li><strong>Business logic:</strong> Calculations, validations, conditions</li>
          <li><strong>Error handling:</strong> Are all paths covered?</li>
          <li><strong>Concurrency issues:</strong> Race conditions, locks, async ordering</li>
        </ul>

        <h3>The PR Reading Checklist</h3>
        <ol>
          <li>☑️ Read PR description (understand intent)</li>
          <li>☑️ Check files changed (understand scope)</li>
          <li>☑️ Identify high-risk areas (database, API, business logic)</li>
          <li>☑️ Read tests (understand expected behavior)</li>
          <li>☑️ Read code changes (line by line)</li>
          <li>☑️ Ask clarifying questions</li>
          <li>☑️ Approve or request changes</li>
        </ol>

        <h3>Red Flags While Reading</h3>
        <ul>
          <li>Inconsistent error handling (some paths throw, others silently fail)</li>
          <li>Unclear variable names (single letter vars, cryptic names)</li>
          <li>Missing null checks (assuming data exists)</li>
          <li>Hardcoded values instead of config</li>
          <li>Duplicate code (refactor missed opportunity)</li>
          <li>Missing tests for risky changes</li>
          <li>Comments explaining what code does (should be obvious from code)</li>
        </ul>

        <h3>Real Example: Trace a PR</h3>
        <p><strong>Hypothetical PR: "Add subject filtering to dashboard"</strong></p>
        <p><strong>Step 1: Description</strong></p>
        <ul>
          <li>Problem: "Dashboard shows all assignments regardless of student interest"</li>
          <li>Solution: "Add chips for Math/Science/History filtering"</li>
          <li>Testing: "Verified filtering works on Chrome and Firefox"</li>
        </ul>

        <p><strong>Step 2: Files changed</strong></p>
        <ul>
          <li><code>src/components/Dashboard.tsx</code> - UI changes</li>
          <li><code>src/lib/filtering.ts</code> - Filter logic</li>
          <li><code>src/components/__tests__/Dashboard.test.tsx</code> - Tests</li>
        </ul>

        <p><strong>Step 3: High-risk areas</strong></p>
        <ul>
          <li>API query: Does it respect the subject filter?</li>
          <li>Caching: If user A filters and user B doesn't, do they see correct data?</li>
          <li>URL state: Is filter persisted in URL or lost on refresh?</li>
        </ul>

        <p><strong>Step 4: Questions to ask</strong></p>
        <ul>
          <li>"Does filtering update the URL, so users can share filtered views?"</li>
          <li>"What happens if subject is invalid? Does it fall back to 'all'?"</li>
          <li>"Are the filter chips server-rendered or loaded client-side?"</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Find a recent PR in this LMS (check git history). Read the description and list: (1) what changed, (2) what's the business reason, (3) what are high-risk areas.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You're reviewing a 50-file PR. What's your first move?",
          options: [
            { value: "a", label: "Read all the code line by line" },
            { value: "b", label: "Read the PR description, check files changed, ask for clarification" },
            { value: "c", label: "Request the author break it into smaller PRs" },
            { value: "d", label: "Approve it quickly—probably fine" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "Find a PR with a risk area (database change, API change, or business logic). What questions would you ask the author?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "blocking-vs-suggestions",
      stepNumber: 2,
      title: "Blocking vs. Non-Blocking Feedback",
      icon: "🚫",
      explanation: `
        <h3>The Most Important Skill in Code Review</h3>
        <p><strong>Distinguish what must change from what could improve.</strong> This prevents review from becoming a gatekeeping tool instead of a learning tool.</p>

        <h3>What Should Block Approval? (Blocking Issues)</h3>

        <h4>🚫 Correctness Issues</h4>
        <p>Code doesn't work as intended:</p>
        <ul>
          <li>Logic error: <code>if (user.points > 100) award points</code> when it should be <code>&lt; 100</code></li>
          <li>Missing return statement: Function continues when it should exit</li>
          <li>Off-by-one error in loops or array access</li>
          <li>Unhandled null/undefined references</li>
        </ul>
        <p><strong>Example blocking comment:</strong> "If pointsDifference is negative, this calculates the wrong total. Should we use Math.abs()?"</p>

        <h4>🚫 Security Issues</h4>
        <p>Code is vulnerable:</p>
        <ul>
          <li>SQL injection (unsanitized database query)</li>
          <li>XSS risk (user input rendered as HTML without escaping)</li>
          <li>Authentication bypass (missing permission check)</li>
          <li>Hardcoded secrets</li>
        </ul>
        <p><strong>Example blocking comment:</strong> "This query includes unsanitized user input. Use parameterized queries to prevent SQL injection."</p>

        <h4>🚫 Test-Breaking Changes</h4>
        <p>PR fails existing tests or has no tests for risky changes:</p>
        <ul>
          <li>Existing tests fail (regression)</li>
          <li>Database migration without rollback testing</li>
          <li>API contract change with no migration plan</li>
          <li>Core logic change with zero test coverage</li>
        </ul>
        <p><strong>Example blocking comment:</strong> "This changes the Achievement unlock logic but tests still expect the old criteria. Which is correct?"</p>

        <h4>🚫 Architecture Issues</h4>
        <p>Decision violates team standards:</p>
        <ul>
          <li>Imports that create circular dependencies</li>
          <li>Coupling that contradicts module design</li>
          <li>Performance regression in hot path</li>
          <li>Breaking API contract without migration</li>
        </ul>
        <p><strong>Example blocking comment:</strong> "This directly imports from a private module. Use the public API instead."</p>

        <h3>What Should NOT Block? (Suggestions)</h3>

        <h4>💡 Style Preferences</h4>
        <p>Code works, but style could be different:</p>
        <ul>
          <li>Variable naming (unless truly unclear)</li>
          <li>Formatting (use linters/prettier instead)</li>
          <li>Code organization (comments vs. variables)</li>
          <li>Comment verbosity</li>
        </ul>
        <p><strong>Example suggestion comment:</strong> "Consider renaming d to duration for clarity, but this works as-is."</p>

        <h4>💡 Potential Improvements</h4>
        <p>Code works, but could be better:</p>
        <ul>
          <li>Performance optimizations (unless it's a bottleneck)</li>
          <li>Code consolidation (unless duplication is intentional)</li>
          <li>Additional test coverage (unless critical path is uncovered)</li>
          <li>Documentation (nice-to-have)</li>
        </ul>
        <p><strong>Example suggestion comment:</strong> "This could use a utility function since it appears twice, but not a blocker."</p>

        <h4>💡 "Nice to Have" Questions</h4>
        <p>You're curious, not demanding:</p>
        <ul>
          <li>"Have you considered X approach?"</li>
          <li>"What if this behavior changed in the future?"</li>
          <li>"Does this need documentation?"</li>
        </ul>
        <p><strong>Example suggestion comment:</strong> "What if we also allow filtering by category? Future-proof thought, but not needed now."</p>

        <h3>How to Signal Blocking vs. Non-Blocking</h3>

        <p><strong>Blocking comment pattern:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Use strong language
❌ "This code is broken."
🚫 "This violates our API contract and will break existing clients. Here's how to fix it:"

// Clear action
"Please [action] before merge."
"This must change because [reason]."</code>
        </pre>

        <p><strong>Suggestion pattern:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Use softer language
💡 "Consider [suggestion]"
🤔 "What if we [alternative]?"
✨ "Nice opportunity for [improvement]"

// Clear non-blocking
"This works, but [improvement] would be nice."
"Consider this for a future refactor."</code>
        </pre>

        <h3>The Blocking vs. Non-Blocking Checklist</h3>

        <p><strong>Ask yourself:</strong></p>
        <ul>
          <li>☑️ Does this prevent the code from working? → BLOCKING</li>
          <li>☑️ Does this create security risk? → BLOCKING</li>
          <li>☑️ Does this break tests or contracts? → BLOCKING</li>
          <li>☑️ Does this violate team standards? → BLOCKING (or warning)</li>
          <li>☑️ Is this a "nice to have"? → SUGGESTION</li>
          <li>☑️ Would this be nice but not necessary? → SUGGESTION</li>
          <li>☑️ Am I enforcing personal preference? → DON'T COMMENT</li>
        </ul>

        <h3>Real Examples</h3>

        <p><strong>Example 1: Logic Bug (BLOCKING)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Code:
const totalPoints = userPoints + awardedPoints;

// Comment:
"If awardedPoints is 0, this skips the ledger entry. Should we log all transactions? The spec says we must log everything. Please clarify."</code>
        </pre>

        <p><strong>Example 2: Variable Name (SUGGESTION)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Code:
const d = new Date();

// Comment:
"Consider renaming d to today or currentDate for clarity. Not blocking, but helps readability."</code>
        </pre>

        <p><strong>Example 3: Missing Test (BLOCKING)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Code:
Function changed from returning {status: 'success'} to {status: 'success', userId: string}

// Comment:
"This changes the API response contract. Without a test showing the new response shape, we can't ensure callers update. Please add a test."</code>
        </pre>

        <p><strong>Example 4: Future Improvement (SUGGESTION)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Code:
Filter only supports 'subject'; could be extended to 'category'

// Comment:
"Nice thought for the future: could this filter accept multiple types? Not needed now, but worth considering for generality."</code>
        </pre>
      `,
      exercises: [
        {
          type: "text",
          label: "Read a recent code change in this LMS. Identify 3 things you'd comment on: (1) blocking issue, (2) non-blocking suggestion, (3) nice-to-have idea.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You notice the PR changes the return type of a frequently-used function but no tests verify the new type. This is...",
          options: [
            { value: "a", label: "A suggestion—probably fine" },
            { value: "b", label: "A blocking issue—this breaks the contract" },
            { value: "c", label: "Just a style thing" },
            { value: "d", label: "Not worth mentioning" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "Rewrite these blocking comments as non-blocking where appropriate: (1) 'This variable name sucks', (2) 'Missing error handling', (3) 'Could use a helper function'.",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "asking-not-commanding",
      stepNumber: 3,
      title: "Using Questions to Coach (Not Command)",
      icon: "❓",
      explanation: `
        <h3>The Question Technique</h3>
        <p><strong>Instead of telling someone they're wrong, ask why they did it that way.</strong> This opens dialogue instead of creating defensiveness.</p>

        <h3>The Command Pattern (Avoid This)</h3>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "This is inefficient. Change it to use a Set instead of an array."
❌ "You should always null-check this."
❌ "This logic is wrong. Fix it."</code>
        </pre>

        <p><strong>Why this fails:</strong></p>
        <ul>
          <li>Author feels criticized instead of helped</li>
          <li>You might be wrong (maybe the author has a reason you don't see)</li>
          <li>Author defends instead of learning</li>
          <li>No dialogue happens</li>
        </ul>

        <h3>The Question Pattern (Do This)</h3>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>✅ "I noticed this uses an array for lookups. Have you considered a Set for O(1) instead of O(n) lookup? Did you measure performance?"
✅ "What happens if this value is null? Should we add a guard?"
✅ "Can you walk me through this logic? I'm getting lost on why we do X before Y."</code>
        </pre>

        <p><strong>Why this works:</strong></p>
        <ul>
          <li>Invites explanation (maybe they have a reason)</li>
          <li>Shows you're thinking, not just judging</li>
          <li>Author can defend or agree</li>
          <li>Opens dialogue</li>
        </ul>

        <h3>Question Patterns</h3>

        <h4>Pattern 1: The Clarifying Question</h4>
        <p>You don't understand, so you ask.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "This makes no sense."
✅ "Can you explain why we check subject before category? What breaks if we reverse the order?"</code>
        </pre>

        <h4>Pattern 2: The Assumption Question</h4>
        <p>You think something could go wrong, so you ask.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "This will crash if data is empty."
✅ "What happens if assignments is empty? Does the function handle that gracefully?"</code>
        </pre>

        <h4>Pattern 3: The Alternative Question</h4>
        <p>You suggest an alternative approach.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "This is inefficient. Use a loop instead."
✅ "Would a single database query be more efficient than N+1 queries? Any reason to keep it this way?"</code>
        </pre>

        <h4>Pattern 4: The Consistency Question</h4>
        <p>You noticed something doesn't match other code.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "You're not following the pattern."
✅ "I see similar functions use context for state. Why does this one use localStorage instead? Intentional difference?"</code>
        </pre>

        <h3>When to Use Questions vs. Statements</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: rgba(123, 168, 132, 0.1);">
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Situation</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Use Question</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Use Statement</strong></th>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Correctness bug</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">"Are we sure this doesn't overflow when count > X?"</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">"This overflows when count > X. Fix it."</td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">You don't understand</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">✅ "Can you explain...?"</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">❌ "This is confusing"</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Security issue</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">"Could this be exploited if someone passes malicious input?"</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">"This is vulnerable to XSS. Escape the input."</td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Suggestion</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">✅ "Have you considered...?"</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">❌ "You should..."</td>
          </tr>
        </table>

        <h3>The Tone Question Checklist</h3>
        <p>Before posting a comment, ask:</p>
        <ul>
          <li>☑️ Am I being helpful or critical?</li>
          <li>☑️ Would this comment make me defensive or curious?</li>
          <li>☑️ Am I asking a genuine question or rhetorical?</li>
          <li>☑️ Could they have a valid reason I haven't considered?</li>
          <li>☑️ Am I enforcing a preference or pointing out a real issue?</li>
        </ul>

        <h3>Real Examples</h3>

        <p><strong>Example 1: Before and After</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Code being reviewed:
const processAssignments = (list) => list.map(a => ({...a, completed: false}));

// ❌ Before (commanding):
"This is inefficient. Use a loop instead of map. This is bad functional programming."

// ✅ After (questioning):
"Why reset completed to false for every assignment? Is this intentional, or should we only update specific assignments?"</code>
        </pre>

        <p><strong>Example 2: Clarity Question</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>// Code being reviewed:
const updateScore = async (userId, score) => {
  await updateLeaderboard(score);
  await updatePoints(userId, score);
};

// ❌ Before:
"Wrong order. Points should update before leaderboard."

// ✅ After:
"I notice we update leaderboard before points. Should these be reversed to ensure points exist before leaderboard uses them? Any race condition risk?"</code>
        </pre>
      `,
      exercises: [
        {
          type: "text",
          label: "Find a code change that could use improvement. Write TWO versions: (1) commanding feedback, (2) question-based feedback.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "Code might be inefficient. Best approach?",
          options: [
            { value: "a", label: "\"This is inefficient. Optimize it.\"" },
            { value: "b", label: "\"Is this performance-tested? Could we optimize for the common case?\"" },
            { value: "c", label: "Ignore it if it works" },
            { value: "d", label: "Reject the PR" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "Rewrite as questions: (1) 'Your variable name sucks.' (2) 'You should null-check this.' (3) 'This is wrong.'",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "receiving-feedback",
      stepNumber: 4,
      title: "Receiving Feedback: Agree / Clarify / Propose",
      icon: "📩",
      explanation: `
        <h3>The Three Response Moves</h3>
        <p>When you receive code review feedback, you have three professional responses:</p>

        <h3>Move 1: Agree</h3>
        <p><strong>The reviewer is right. Your code should change.</strong></p>

        <p><strong>How to respond:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>✅ "Good catch. You're right—this doesn't handle the null case. Fixing now."
✅ "I see what you mean. The security vulnerability is real. I'll use parameterized queries."
✅ "I agree. The variable name is unclear. Renaming to totalScoreChange."</code>
        </pre>

        <p><strong>What happens next:</strong></p>
        <ol>
          <li>You make the change</li>
          <li>You commit with a clear message (referencing the feedback)</li>
          <li>You let the reviewer know: "Fixed in [commit hash]"</li>
        </ol>

        <p><strong>Why this works:</strong></p>
        <ul>
          <li>Shows you're learning and not defensive</li>
          <li>Builds trust with reviewers</li>
          <li>Improves the code</li>
        </ul>

        <h3>Move 2: Clarify</h3>
        <p><strong>You think the reviewer misunderstood. You need to explain your reasoning.</strong></p>

        <p><strong>How to respond:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>✅ "Good question. We checked for null at the parent level (in Dashboard.tsx line 42), so it's guaranteed to exist here. Does that make sense?"
✅ "I see the concern about performance. We measured this with a 10k-item list and it's <10ms, so it's fine for our use case."
✅ "The order matters because updateLeaderboard runs async, and we need points updated first. I'll add a comment explaining this."</code>
        </pre>

        <p><strong>What happens next:</strong></p>
        <ol>
          <li>Reviewer reads your explanation</li>
          <li>Either they're satisfied, or you continue dialogue</li>
          <li>Result: Better shared understanding</li>
        </ol>

        <p><strong>Why this works:</strong></p>
        <ul>
          <li>Reviewer understands the full picture</li>
          <li>Builds trust that you thought it through</li>
          <li>If they still disagree, you're more informed</li>
        </ul>

        <h3>Move 3: Propose</h3>
        <p><strong>You see the reviewer's point but have a different solution.</strong></p>

        <p><strong>How to respond:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>✅ "I see the concern about code duplication. Instead of extracting a helper function (which might be over-engineering), could we just add a comment noting the similarity?"
✅ "Good point about error handling. Instead of throwing, should we return a {success: false, error: string} object? That way callers can handle it gracefully."
✅ "True that this could be more performant. I'm thinking about [alternative approach]. Does that address your concern?"</code>
        </pre>

        <p><strong>What happens next:</strong></p>
        <ol>
          <li>Reviewer considers your alternative</li>
          <li>You both agree on the best approach</li>
          <li>You make the change</li>
        </ol>

        <p><strong>Why this works:</strong></p>
        <ul>
          <li>Shows collaborative thinking</li>
          <li>Often leads to better solutions</li>
          <li>Builds mutual respect</li>
        </ul>

        <h3>What NOT to Do</h3>

        <h4>❌ Defensive Responses</h4>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "That's just your preference."
❌ "It works fine how it is."
❌ "I know what I'm doing."
❌ "That's a silly suggestion."</code>
        </pre>

        <p><strong>Why this fails:</strong> Ends dialogue, builds resentment, reviewer feels disrespected.</p>

        <h4>❌ Over-Apologizing</h4>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "I'm so sorry, I'm terrible at code."
❌ "You're absolutely right, I should have known better."
❌ "I'm an idiot for missing this."</code>
        </pre>

        <p><strong>Why this fails:</strong> Puts blame on yourself, makes reviewer uncomfortable, doesn't improve code.</p>

        <h4>❌ Ignoring Feedback</h4>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ [No response to comments]
❌ "Approving anyway."</code>
        </pre>

        <p><strong>Why this fails:</strong> Shows disrespect, breaks trust, code quality suffers.</p>

        <h3>The Agree/Clarify/Propose Checklist</h3>
        <p>When you get feedback:</p>
        <ul>
          <li>☑️ Read the feedback fully before responding</li>
          <li>☑️ Assume the reviewer is well-intentioned</li>
          <li>☑️ Ask yourself: "Is this valid?"</li>
          <li>☑️ If yes → AGREE and fix it</li>
          <li>☑️ If no → CLARIFY why their concern doesn't apply</li>
          <li>☑️ If different approach works better → PROPOSE it</li>
          <li>☑️ Make changes or explain why</li>
          <li>☑️ Respond to the reviewer</li>
        </ul>

        <h3>Real Examples</h3>

        <p><strong>Scenario 1: Clear Bug Found</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Reviewer: "If startDate is null, this crashes. Should we handle it?"

✅ AGREE response:
"You're right. I'll add a null check and default to today's date if not provided."</code>
        </pre>

        <p><strong>Scenario 2: Reviewer Misunderstood</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Reviewer: "Why update the database before calling the API? Shouldn't we call the API first?"

✅ CLARIFY response:
"Good question. We need the database ID before calling the API (line 3 passes it as a parameter). The order matters for that reason. Does that make sense?"</code>
        </pre>

        <p><strong>Scenario 3: Different Approach</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Reviewer: "This would be clearer as a separate utility function instead of inline."

✅ PROPOSE response:
"I see the readability concern. Rather than extract a utility, what if I add a detailed comment explaining the algorithm? That way it's inline but documented. Would that help?"</code>
        </pre>
      `,
      exercises: [
        {
          type: "text",
          label: "Write three responses to this review comment: (1) AGREE, (2) CLARIFY, (3) PROPOSE: 'This logic checks points > 100 but the spec says >= 100. Bug?'",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "Best response when you disagree with feedback?",
          options: [
            { value: "a", label: "Say nothing and ignore it" },
            { value: "b", label: "Respond defensively: 'That's just your opinion'" },
            { value: "c", label: "Explain your reasoning or propose an alternative" },
            { value: "d", label: "Approve anyway" }
          ],
          expectedAnswer: "c"
        },
        {
          type: "text",
          label: "Rewrite these defensive responses professionally: (1) 'That's stupid.' (2) 'I already considered that.' (3) 'It works fine.'",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "learning-from-reviews",
      stepNumber: 5,
      title: "Code Review as a Learning Tool",
      icon: "🎓",
      explanation: `
        <h3>Every Review Comment Is a Data Point</h3>
        <p><strong>Code reviews aren't just gatekeeping. They're a window into how experienced developers think.</strong> Track patterns in feedback to improve faster.</p>

        <h3>What to Extract From Each Review</h3>

        <h4>1. The Concrete Improvement</h4>
        <p>Track specific feedback:</p>
        <ul>
          <li>"Use const instead of let when value doesn't change"</li>
          <li>"Always null-check API responses"</li>
          <li>"Transactions required for multi-step operations"</li>
        </ul>
        <p><strong>Action:</strong> Write these down. Build a personal checklist. Use it in your next PR.</p>

        <h4>2. The Pattern</h4>
        <p>Look for recurring feedback:</p>
        <ul>
          <li>If multiple reviews mention "add more tests", you found a gap</li>
          <li>If people ask "why this order?", you're not commenting enough</li>
          <li>If reviews say "unclear variable name", you need to improve naming</li>
        </ul>
        <p><strong>Action:</strong> Track patterns. Work on the most-common issue first.</p>

        <h4>3. The Reasoning</h4>
        <p>Don't just learn WHAT to do. Learn WHY:</p>
        <ul>
          <li>"Why do we null-check at the API boundary?" → Security and error handling</li>
          <li>"Why extract this function?" → Reusability and testability</li>
          <li>"Why test this specific case?" → Because it broke last year</li>
        </ul>
        <p><strong>Action:</strong> Ask follow-up questions. Build mental models.</p>

        <h3>The Learning Questions</h3>
        <p>When you get feedback, ask yourself:</p>
        <ol>
          <li><strong>What did I miss?</strong> Did I overlook a case, pattern, or principle?</li>
          <li><strong>Why did I miss it?</strong> Lack of knowledge, careless, or unclear requirements?</li>
          <li><strong>How do I avoid this next time?</strong> Checklist item? More testing? Ask before coding?</li>
          <li><strong>What's the bigger lesson?</strong> Is this about testing, architecture, communication, or something else?</li>
        </ol>

        <h3>Your Personal Code Review Checklist</h3>
        <p>Build this as you grow:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Before submitting a PR:
☑️ Do I null-check all inputs?
☑️ Are error paths tested?
☑️ Is the "why" clear (comments where needed)?
☑️ Did I consider the happy path AND edge cases?
☑️ Are variables clearly named (not d, i, x)?
☑️ Is this the simplest solution, or did I over-engineer?
☑️ Did I break any architectural rules?
☑️ Would my past self understand this code?</code>
        </pre>

        <h3>Red Flags That Indicate Learning Opportunities</h3>
        <ul>
          <li><strong>Same feedback twice:</strong> You have a blind spot. Fix it.</li>
          <li><strong>Feedback on a different topic each time:</strong> You're rushing. Slow down.</li>
          <li><strong>Feedback about "why":</strong> Your code isn't self-documenting. Add comments or clear naming.</li>
          <li><strong>Feedback about tests:</strong> You're not thinking through edge cases. Practice test writing.</li>
        </ul>

        <h3>Learning From Other People's Reviews</h3>
        <p>Read reviews on PRs you're not involved in:</p>
        <ul>
          <li><strong>What feedback is common across different PRs?</strong> That's a team standard.</li>
          <li><strong>What questions does the reviewer ask?</strong> These reveal how good reviewers think.</li>
          <li><strong>How does the author respond?</strong> Model their Agree/Clarify/Propose.</li>
        </ul>

        <h3>Building a Feedback Archive</h3>
        <p>Keep a running list:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code># Code Review Feedback Archive

## Authentication (3 mentions)
- Always verify user permissions before modifying data
- Tokens should have expiration
- Log security-relevant actions

## Testing (5 mentions)
- Edge cases are as important as happy path
- Don't just test "if it works", test "what breaks"
- Error paths need tests too

## Naming (2 mentions)
- Single-letter variables are OK for loops, not for state
- Names should be nouns (thing) not verbs (action)</code>
        </pre>

        <h3>The Monthly Review Ritual</h3>
        <p>Once a month:</p>
        <ol>
          <li>Read all your PRs from the month</li>
          <li>Collect all feedback you received</li>
          <li>Identify the top 3 patterns</li>
          <li>Pick ONE to focus on in the next month</li>
          <li>Note: "In March I'll focus on better error handling"</li>
        </ol>

        <p><strong>Result:</strong> Visible growth in code quality over time.</p>
      `,
      exercises: [
        {
          type: "text",
          label: "Look at your last 3 PRs (or read from a teammate's). What feedback appears more than once? What's the pattern? Why does it keep coming up?",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "Create your personal 'Code Review Learning Checklist' based on feedback you've received. What do you want to improve first?",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "Find a good code review example (in this LMS or OSS project). What did the reviewer do well? How could you emulate that in your own reviews?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "anti-patterns",
      stepNumber: 6,
      title: "Code Review Anti-Patterns to Avoid",
      icon: "🚩",
      explanation: `
        <h3>How Code Review Goes Wrong</h3>

        <h4>❌ Anti-Pattern 1: Perfectionism</h4>
        <p><strong>The problem:</strong> Reviewer blocks PR until code is "perfect" according to their standards.</p>
        <ul>
          <li>"Rename this variable" (preference, not correctness)</li>
          <li>"Add more comments" (subjective)</li>
          <li>"Refactor this function" (not part of this feature)</li>
        </ul>

        <p><strong>Fix:</strong> Distinguish must-haves from nice-to-haves. Only block on correctness/security/standards.</p>

        <h4>❌ Anti-Pattern 2: Scope Creep</h4>
        <p><strong>The problem:</strong> Review feedback expands beyond the PR scope.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>PR: "Fix dashboard loading spinner"
Reviewer: "While you're at it, refactor the entire dashboard component."</code>
        </pre>

        <p><strong>Fix:</strong> Review the PR as written. Suggest separate PRs for improvements.</p>

        <h4>❌ Anti-Pattern 3: Nit-Picking</h4>
        <p><strong>The problem:</strong> Reviewer comments on things that don't matter (spacing, formatting).</p>
        <p><strong>Fix:</strong> Use linters and formatters. Reserve comments for things humans should decide.</p>

        <h4>❌ Anti-Pattern 4: Ghosting</h4>
        <p><strong>The problem:</strong> Reviewer disappears mid-review. Author waits days for feedback.</p>
        <p><strong>Fix:</strong> Commit to reviewing. If you can't, let the author know. Aim for 24-hour turnaround.</p>

        <h4>❌ Anti-Pattern 5: Bike-Shedding</h4>
        <p><strong>The problem:</strong> Team argues about small details (naming) instead of big decisions (architecture).</p>
        <p><strong>Fix:</strong> Use conventions and standards. Don't re-debate the same issue in every PR.</p>

        <h4>❌ Anti-Pattern 6: Authority-Based Review</h4>
        <p><strong>The problem:</strong> Reviewer blocks PR because "I said so" without explanation.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>❌ "No, that's wrong."
✅ "I see the concern. Here's why we usually do it differently: [explanation]"</code>
        </pre>

        <p><strong>Fix:</strong> Explain the reasoning. Invite discussion.</p>

        <h4>❌ Anti-Pattern 7: Author Defensiveness</h4>
        <p><strong>The problem:</strong> Author gets defensive and argues with every comment instead of considering it.</p>
        <p><strong>Fix:</strong> Assume reviewers are trying to help. Listen first, respond after reflecting.</p>

        <h4>❌ Anti-Pattern 8: No Feedback on Good Code</h4>
        <p><strong>The problem:</strong> Reviewer only comments on problems, never acknowledges what went well.</p>
        <p><strong>Fix:</strong> Praise good practices. Make reviews balanced.</p>

        <h3>The Healthy Code Review Culture</h3>
        <ul>
          <li>✅ Review as teammates, not gatekeepers</li>
          <li>✅ Comment on substance, not preference</li>
          <li>✅ Explain the reasoning</li>
          <li>✅ Separate blocking from non-blocking</li>
          <li>✅ Respond within 24 hours</li>
          <li>✅ Assume good intent</li>
          <li>✅ Use standards, not personal style</li>
          <li>✅ Make reviews learning opportunities</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Think of a bad code review experience (yours or observed). What anti-pattern was it? How would you fix it?",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You notice every comment in a review is about style/formatting. What's wrong?",
          options: [
            { value: "a", label: "The reviewer is thorough" },
            { value: "b", label: "This should be automated by linters, not human review" },
            { value: "c", label: "Nothing—code style matters" },
            { value: "d", label: "The author should pay more attention" }
          ],
          expectedAnswer: "b"
        }
      ]
    },
    {
      id: "practice-reviews",
      stepNumber: 7,
      title: "Practice: Review Real Code",
      icon: "🔍",
      explanation: `
        <h3>Apply What You've Learned</h3>

        <h3>Exercise 1: Review This LMS Code</h3>
        <p>Find a recent PR or commit in this LMS. Act as a reviewer:</p>
        <ol>
          <li>Read the PR description</li>
          <li>Identify high-risk areas</li>
          <li>Write 3 comments (1 blocking if needed, 2 non-blocking)</li>
          <li>Use the question technique in your comments</li>
        </ol>

        <h3>Exercise 2: Review Open Source Code</h3>
        <p>Find an open PR in a popular OSS project (Next.js, React, etc.):</p>
        <ol>
          <li>Read the change and description</li>
          <li>Identify what you'd comment on</li>
          <li>Write your review (as practice—don't post if uncomfortable)</li>
          <li>Compare to actual reviews from maintainers</li>
        </ol>

        <h3>Exercise 3: Role-Play Feedback Receiving</h3>
        <p>Take a piece of code you wrote. Imagine tough feedback. Practice responding:</p>
        <ol>
          <li>Get a comment like: "This is inefficient and uses global state"</li>
          <li>Write an AGREE response</li>
          <li>Write a CLARIFY response (if you disagree)</li>
          <li>Write a PROPOSE response (alternative solution)</li>
        </ol>
      `,
      exercises: [
        {
          type: "text",
          label: "PRACTICE 1: Find a recent commit or PR in this LMS. Act as a reviewer. Write 3 comments: (1) blocking issue if found, (2) non-blocking suggestion, (3) question about intent.",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "PRACTICE 2: Find an open PR in a popular OSS project (Next.js, React, Redux, etc.). Imagine you're reviewing it. What would you comment on? Why?",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "PRACTICE 3: Get tough feedback on your code: 'This logic is overly complex and hard to understand.' Write AGREE, CLARIFY, and PROPOSE responses.",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "practice-cadence",
      stepNumber: 99,
      title: "Practice Cadence + I Can Now",
      icon: "✅",
      explanation: `
        <h3>The Code Review Practice Loop</h3>
        <p><strong>Weekly practice:</strong></p>
        <ol>
          <li>Review 2-3 PRs (in your repo or OSS)</li>
          <li>Write kind, high-signal comments</li>
          <li>Extract one learning point</li>
          <li>Note it in your feedback archive</li>
        </ol>

        <p><strong>Monthly practice:</strong></p>
        <ol>
          <li>Reflect on feedback you received</li>
          <li>Identify the top 1-2 patterns</li>
          <li>Focus on improving one area next month</li>
          <li>Notice improvement in your code</li>
        </ol>

        <h3>I Can Now...</h3>
        <ul>
          <li>Read a PR efficiently (description → files → code → risks)</li>
          <li>Distinguish blocking issues from suggestions</li>
          <li>Give constructive feedback via questions, not commands</li>
          <li>Respond professionally to feedback (Agree/Clarify/Propose)</li>
          <li>Extract learning from every code review</li>
          <li>Build a personal code quality checklist</li>
          <li>Participate in code review as both author and reviewer</li>
          <li>Help my team improve through thoughtful feedback</li>
        </ul>

        <h3>The Code Review Culture You'll Build</h3>
        <p>When you and your team practice healthy code review:</p>
        <ul>
          <li>Everyone learns from every PR</li>
          <li>Code quality improves over time</li>
          <li>Team feels safe to ask questions</li>
          <li>Architectural issues get caught early</li>
          <li>Onboarding is faster (new team members learn by reviewing/being reviewed)</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Summarize what good code review looks like (both reviewer and author). How will you practice this skill moving forward?",
          acceptAnyAttempt: true
        }
      ]
    }
  ],
  miniQuiz: [
    {
      id: "reading-q1",
      question: "When reading a PR, what should you read FIRST?",
      options: [
        { value: "a", label: "The full code changes line by line" },
        { value: "b", label: "The PR description to understand intent" },
        { value: "c", label: "The test file to see what's expected" },
        { value: "d", label: "The git history of the files" }
      ],
      correctAnswer: "b",
      explanation: "The PR description explains what changed and why. Understanding intent first makes code reading much more efficient.",
      topic: "reading-pr",
      skill: "code-review",
      skillTag: "reading-strategy",
      difficulty: "easy"
    },
    {
      id: "blocking-q1",
      question: "Which of these should block approval?",
      options: [
        { value: "a", label: "Variable name could be clearer" },
        { value: "b", label: "Missing null check for a frequently-accessed field" },
        { value: "c", label: "Could use a helper function" },
        { value: "d", label: "Comment could be more detailed" }
      ],
      correctAnswer: "b",
      explanation: "Correctness issues (missing null check) should block. Style issues should not. The null check could cause a crash.",
      topic: "blocking-vs-suggestions",
      skill: "code-review",
      skillTag: "judgment",
      difficulty: "easy"
    },
    {
      id: "tone-q1",
      question: "Better code review comment?",
      options: [
        { value: "a", label: "\"This is inefficient.\"" },
        { value: "b", label: "\"Have you measured the performance of this lookup? An array is O(n), could a Set be O(1)?\"" },
        { value: "c", label: "\"Use a Set instead.\"" },
        { value: "d", label: "\"This is wrong.\"" }
      ],
      correctAnswer: "b",
      explanation: "This asks a genuine question, shows thinking, and invites discussion. The author may have a reason or data you don't see.",
      topic: "asking-not-commanding",
      skill: "code-review",
      skillTag: "communication",
      difficulty: "easy"
    },
    {
      id: "feedback-q1",
      question: "You receive feedback: 'This validation should happen at the API boundary, not in the component.' Best response?",
      options: [
        { value: "a", label: "\"No, it's fine here.\" (defensive)" },
        { value: "b", label: "\"I agree. Validation belongs at the API boundary. Moving it now.\" (AGREE)" },
        { value: "c", label: "\"I checked frontend validation first because it's faster feedback to users. We also validate at the API.\" (CLARIFY)" },
        { value: "d", label: "Both B and C are reasonable" }
      ],
      correctAnswer: "d",
      explanation: "Both AGREE and CLARIFY are professional. Either accept and fix, or explain why both places have the validation. Either shows you listened.",
      topic: "receiving-feedback",
      skill: "code-review",
      skillTag: "professionalism",
      difficulty: "medium"
    },
    {
      id: "learning-q1",
      question: "You get the same feedback twice from different reviewers. What should you do?",
      options: [
        { value: "a", label: "Ignore it—different reviewers, different opinions" },
        { value: "b", label: "Recognize this as a blind spot and add it to your personal checklist" },
        { value: "c", label: "Ask for clarification" },
        { value: "d", label: "It means reviewers are nitpicking" }
      ],
      correctAnswer: "b",
      explanation: "When multiple people point out the same thing, you found a pattern. Add it to your checklist and focus on improving it.",
      topic: "learning-from-reviews",
      skill: "code-review",
      skillTag: "growth",
      difficulty: "medium"
    },
    {
      id: "antipattern-q1",
      question: "Which is a code review anti-pattern?",
      options: [
        { value: "a", label: "Blocking on correctness issues" },
        { value: "b", label: "Commenting on style/formatting preferences instead of using linters" },
        { value: "c", label: "Asking questions instead of making demands" },
        { value: "d", label: "Explaining the reasoning behind feedback" }
      ],
      correctAnswer: "b",
      explanation: "Linters should catch style issues, freeing reviewers to focus on substance. Commenting on things tools can enforce is wasted effort.",
      topic: "anti-patterns",
      skill: "code-review",
      skillTag: "efficiency",
      difficulty: "medium"
    },
    {
      id: "judgment-q1",
      question: "A PR changes the return type of a frequently-used function but includes no tests. This is...",
      options: [
        { value: "a", label: "A suggestion—could add tests later" },
        { value: "b", label: "A blocking issue—code contract changed without validation" },
        { value: "c", label: "Not worth mentioning" },
        { value: "d", label: "The author should handle it" }
      ],
      correctAnswer: "b",
      explanation: "Breaking changes to public APIs must be tested. Without tests, we can't ensure callers still work. This blocks.",
      topic: "blocking-vs-suggestions",
      skill: "code-review",
      skillTag: "architecture",
      difficulty: "hard"
    },
    {
      id: "role-q1",
      question: "As a reviewer, when should you comment on code?",
      options: [
        { value: "a", label: "Whenever you think of something" },
        { value: "b", label: "Only on correctness and architecture" },
        { value: "c", label: "On correctness, security, tests, and architectural issues; suggest improvements sparingly" },
        { value: "d", label: "Never—let the code speak for itself" }
      ],
      correctAnswer: "c",
      explanation: "Focus on substance: does it work, is it secure, is it tested, does it fit the architecture. Suggest improvements but don't block on them.",
      topic: "blocking-vs-suggestions",
      skill: "code-review",
      skillTag: "judgment",
      difficulty: "hard"
    },
    {
      id: "propose-q1",
      question: "Best example of the PROPOSE move?",
      options: [
        { value: "a", label: "\"I disagree with your approach.\"" },
        { value: "b", label: "\"I see your point about performance. Would a caching layer solve this better than your fix?\"" },
        { value: "c", label: "\"Do it my way.\"" },
        { value: "d", label: "Ignore the feedback" }
      ],
      correctAnswer: "b",
      explanation: "PROPOSE shows you understand their concern and suggest an alternative that might work better. Invites collaboration.",
      topic: "receiving-feedback",
      skill: "code-review",
      skillTag: "communication",
      difficulty: "hard"
    }
  ]
};
