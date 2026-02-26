import type { InteractiveGuideContent } from "@/types/activity";

export const codingCodeReadingNonAuthorsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Code Reading for Non-Authors: Understanding Code You Didn't Write",
      icon: "📖",
      explanation: `
        <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
          <p style="font-size: 1.05rem; margin: 0;"><strong>In software development, you'll spend 10x more time reading code than writing it.</strong> As an implementation manager and growing developer, reading unfamiliar code is a core skill—more important than writing it from scratch.</p>
        </div>

        <h3>Why Code Reading Matters</h3>
        <p>When you join a team, inherit a project, or review a PR, you face this question: <em>"How does this work?"</em> You can't modify what you don't understand. You can't communicate clearly about code you haven't read. You can't estimate work or anticipate risks without tracing dependencies.</p>

        <p><strong>This lesson teaches you a systematic approach to reading unfamiliar code:</strong></p>
        <ul>
          <li>Find entry points without getting lost in implementation details</li>
          <li>Trace data flow from user action → business logic → database</li>
          <li>Read tests as a map of expected behavior</li>
          <li>Ask high-signal questions when you don't understand</li>
          <li>Estimate the "blast radius" of changes</li>
        </ul>

        <h3>What You Will Learn</h3>
        <ul>
          <li>The systematic entry-point discovery pattern</li>
          <li>How to follow data flow without running code</li>
          <li>Reading tests as documentation and behavior contracts</li>
          <li>Asking clarifying questions that show you've done your homework</li>
          <li>Identifying dependencies and change impact</li>
        </ul>
      `,
      tipBox: {
        title: "Core Principle",
        content: "Reading code is a skill you learn by doing it repeatedly. Start with clear entry points, trace one feature end-to-end, and always ask yourself: 'What could go wrong if I change this?'"
      },
      exercises: [
        {
          type: "text",
          label: "Why is reading code important to your role as an implementation manager? What situations have you faced where you needed to understand code quickly?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "entry-points",
      stepNumber: 1,
      title: "Finding Entry Points: Routes, Handlers, and Main Exports",
      icon: "🚪",
      explanation: `
        <h3>The Entry Point Discovery Pattern</h3>
        <p>The biggest mistake junior developers make: they start reading code at random and get lost in implementation details. Instead, <strong>always start with the entry point—where the code is first called.</strong></p>

        <h3>Types of Entry Points</h3>

        <h4>1. Routes (Web Applications)</h4>
        <p>For Next.js apps, routes are your first stop:</p>
        <ul>
          <li><code>app/dashboard/page.tsx</code> = route that renders the dashboard</li>
          <li><code>app/api/assignments/route.ts</code> = API endpoint handling requests</li>
          <li>Questions to ask: What's rendered? What data is fetched? What happens on user interaction?</li>
        </ul>

        <h4>2. API Handlers</h4>
        <p>API routes are the bridge between frontend and backend:</p>
        <ul>
          <li>Located in <code>app/api/</code> directory</li>
          <li>Entry point is the exported handler function (usually <code>GET</code>, <code>POST</code>, <code>PATCH</code>, <code>DELETE</code>)</li>
          <li>Trace: incoming request → validation → database operation → response</li>
        </ul>

        <h4>3. Component Exports</h4>
        <p>In React, a component's props are your entry point:</p>
        <ul>
          <li>Look at the function signature: <code>export default function Dashboard({ subject }: DashboardProps)</code></li>
          <li>Questions: Where does <code>subject</code> come from? What does it do?</li>
        </ul>

        <h4>4. Function Exports from Utilities</h4>
        <p>Utility functions have a clear contract:</p>
        <ul>
          <li>Function name and parameters = what it does</li>
          <li>Return type = what you can do with the result</li>
          <li>Example: <code>export function awardPoints(userId: string, points: number, reason: string)</code></li>
        </ul>

        <h3>The Discovery Algorithm</h3>
        <ol>
          <li>Identify the feature you want to understand (e.g., "How are achievements awarded?")</li>
          <li>Find the main route or handler that starts this feature</li>
          <li>Read that file top-to-bottom (ignore internals for now)</li>
          <li>Mark the function/component calls it makes (these become your next entry points)</li>
          <li>Repeat for each function, building a mental map</li>
        </ol>

        <h3>Real Example: Tracing the "Complete Activity" Feature</h3>
        <p><strong>Goal:</strong> Understand how students complete activities and earn points.</p>
        <p><strong>Step 1:</strong> Find the route → <code>app/activities/[id]/page.tsx</code></p>
        <p><strong>Step 2:</strong> Read it → Renders a form, on submit calls <code>POST /api/activity/submit</code></p>
        <p><strong>Step 3:</strong> Read the API handler → <code>app/api/activity/submit/route.ts</code></p>
        <p><strong>Step 4:</strong> See what it calls → <code>awardPoints()</code>, <code>updateStreak()</code>, <code>checkAndAwardAchievements()</code></p>
        <p><strong>Step 5:</strong> Read each utility function in <code>src/lib/gamification.ts</code></p>
        <p><strong>Result:</strong> You now understand the complete flow from UI → API → database.</p>
      `,
      exercises: [
        {
          type: "text",
          label: "Think of a feature in a web app you use (Slack, Gmail, GitHub, etc.). What's the entry point (route, button, API call) that starts this feature?",
          acceptAnyAttempt: true
        },
        {
          type: "select",
          label: "When reading a Next.js route file, what should you look for FIRST?",
          options: [
            "The smallest helper function defined in the file",
            "The component export at the top level and what props it receives",
            "How the styling is done",
            "All the TypeScript types at the bottom"
          ],
          expectedAnswer: "The component export at the top level and what props it receives"
        },
        {
          type: "text",
          label: "⏱️ TIMED DRILL (10 minutes): Open this LMS codebase. Find where students click 'Submit' on an activity. Trace the entry point: route file → API handler → any functions it calls. List the files involved.",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "data-flow",
      stepNumber: 2,
      title: "Following the Data Flow: Props → State → API → Database",
      icon: "🔄",
      explanation: `
        <h3>The Data Flow Mental Model</h3>
        <p>Every feature moves data through layers. Understanding this flow lets you find bugs, estimate changes, and spot risks.</p>

        <h3>The Classic Web App Data Flow</h3>
        <ol>
          <li><strong>User Interaction:</strong> Click a button, type in a form, etc.</li>
          <li><strong>Frontend State:</strong> React updates component state</li>
          <li><strong>API Call:</strong> Frontend makes HTTP request to backend</li>
          <li><strong>Backend Processing:</strong> Validate, transform, query database</li>
          <li><strong>Database:</strong> Read/write data</li>
          <li><strong>Response:</strong> Return result to frontend</li>
          <li><strong>UI Update:</strong> Frontend re-renders with new data</li>
        </ol>

        <h3>Reading the Flow Without Running Code</h3>

        <h4>Step 1: Find Where Data Enters (User Input)</h4>
        <p>Look for event handlers in React components:</p>
        <ul>
          <li><code>onClick</code>, <code>onChange</code>, <code>onSubmit</code> = entry points</li>
          <li>Example: <code>&lt;button onClick={handleSubmit}&gt;Submit&lt;/button&gt;</code></li>
          <li>Then find the <code>handleSubmit</code> function definition</li>
        </ul>

        <h4>Step 2: Trace the API Call</h4>
        <p>Look for these patterns:</p>
        <ul>
          <li><code>fetch()</code>, <code>axios.post()</code>, or framework helpers</li>
          <li>Question: What URL? What's in the request body?</li>
          <li>Example: <code>const response = await fetch('/api/activity/submit', { method: 'POST', body: JSON.stringify({ activityId, score }) })</code></li>
        </ul>

        <h4>Step 3: Read the API Handler</h4>
        <p>In Next.js, handlers are in <code>app/api/</code>:</p>
        <ul>
          <li>Function receives <code>request</code> object</li>
          <li>Parse request body: <code>const body = await request.json()</code></li>
          <li>Call database/business logic functions</li>
          <li>Return response: <code>return NextResponse.json({ success: true, data: ... })</code></li>
        </ul>

        <h4>Step 4: Read Database Operations (Prisma)</h4>
        <p>In this LMS, database access uses Prisma:</p>
        <ul>
          <li>Look for patterns like: <code>await prisma.user.update({ where: {...}, data: {...} })</code></li>
          <li>Understand the schema by reading <code>prisma/schema.prisma</code></li>
          <li>Question: What data is being read/written? What relationships are involved?</li>
        </ul>

        <h4>Step 5: Trace the Response Back to Frontend</h4>
        <p>Follow how the frontend handles the API response:</p>
        <ul>
          <li><code>const data = await response.json()</code></li>
          <li>Update state: <code>setScore(data.score)</code></li>
          <li>Re-render: Component shows new data to user</li>
        </ul>

        <h3>Red Flags While Tracing Data Flow</h3>
        <p>As you trace, watch for these warning signs:</p>
        <ul>
          <li><strong>Unexpected data transformations:</strong> Data changes shape between layers</li>
          <li><strong>Silent failures:</strong> Errors aren't logged or returned clearly</li>
          <li><strong>Multiple sources of truth:</strong> Same data in local state AND API response</li>
          <li><strong>Missing validation:</strong> No checks at layer boundaries</li>
          <li><strong>Implicit dependencies:</strong> Feature A assumes Feature B ran first</li>
        </ul>

        <h3>Quick Reference: Common Patterns</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: rgba(123, 168, 132, 0.1);">
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Layer</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Look For</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Example Location</strong></th>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">React Component</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Event handlers, state, API calls</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1;"><code>src/components/</code> or route <code>page.tsx</code></td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">API Handler</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Request validation, business logic, DB calls</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1;"><code>app/api/</code></td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Business Logic</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Calculations, validations, workflows</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1;"><code>src/lib/</code></td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Database Schema</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Tables, relationships, constraints</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1;"><code>prisma/schema.prisma</code></td>
          </tr>
        </table>
      `,
      exercises: [
        {
          type: "text",
          label: "Draw or describe the data flow for one feature you use regularly (e.g., 'submitting a form', 'liking a post'). What are the 7 layers?",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You're reading an API handler and see: `const score = req.body.score; await updateUserScore(score)`. What's a red flag here?",
          options: [
            { value: "a", label: "No validation—score could be negative, null, or a string" },
            { value: "b", label: "The variable name isn't descriptive enough" },
            { value: "c", label: "It should use snake_case instead of camelCase" },
            { value: "d", label: "Nothing—this is fine" }
          ],
          expectedAnswer: "a"
        },
        {
          type: "text",
          label: "Find a route file in this LMS. Trace the data flow for ONE user action. List: (1) the component event handler, (2) the API endpoint called, (3) the database operation, (4) the UI update.",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "reading-tests",
      stepNumber: 3,
      title: "Reading Tests as Documentation and Behavior Contracts",
      icon: "✅",
      explanation: `
        <h3>Tests Are the Best Documentation</h3>
        <p>Code comments lie. Code changes. But tests define the contract: <em>"This is what this code is supposed to do."</em> Reading tests tells you:</p>
        <ul>
          <li>What inputs does this function accept?</li>
          <li>What output should it produce?</li>
          <li>What edge cases matter?</li>
          <li>What happens when things go wrong?</li>
        </ul>

        <h3>Test Structure: AAA Pattern (Arrange, Act, Assert)</h3>
        <p>Most tests follow this pattern:</p>
        <ol>
          <li><strong>Arrange:</strong> Set up the test data and environment</li>
          <li><strong>Act:</strong> Call the function being tested</li>
          <li><strong>Assert:</strong> Check that the output is correct</li>
        </ol>

        <p><strong>Example test:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>test('awardPoints increases user points and logs to ledger', async () => {
  // ARRANGE: Set up test data
  const userId = 'user-123';
  const pointsToAward = 10;

  // ACT: Call the function
  await awardPoints(userId, pointsToAward, 'activity-complete');

  // ASSERT: Verify the results
  const updatedUser = await db.user.findUnique({ where: { id: userId } });
  expect(updatedUser.points).toBe(previousPoints + 10);

  const ledgerEntry = await db.pointsLedger.findFirst({
    where: { userId, reason: 'activity-complete' }
  });
  expect(ledgerEntry).toBeDefined();
});</code>
        </pre>

        <h3>What Tests Tell You About Code</h3>

        <h4>Happy Path Tests</h4>
        <p>Tests with names like <code>test('should calculate correctly')</code> show you:</p>
        <ul>
          <li>The normal, expected behavior</li>
          <li>Example inputs and outputs</li>
          <li>The "happy path" that most users hit</li>
        </ul>

        <h4>Edge Case Tests</h4>
        <p>Tests with names like <code>test('should handle empty array')</code> show:</p>
        <ul>
          <li>What happens with unusual inputs</li>
          <li>Boundary conditions that matter</li>
          <li>Potential bugs that were caught and fixed</li>
        </ul>

        <h4>Error Tests</h4>
        <p>Tests with names like <code>test('should throw error when user not found')</code> show:</p>
        <ul>
          <li>How the code fails gracefully</li>
          <li>What errors should be thrown</li>
          <li>What shouldn't happen</li>
        </ul>

        <h3>Reading a Test Suite Like a Spec</h3>
        <p>Instead of reading function code, read the test file first:</p>
        <ol>
          <li>Scan all test names → this is your feature spec</li>
          <li>Pick a few representative tests and read the AAA structure</li>
          <li>Now read the actual function code (you'll understand it faster)</li>
          <li>If a test fails, you know exactly what broke</li>
        </ol>

        <h3>What to Look For in Tests</h3>
        <ul>
          <li><strong>Test coverage:</strong> Are all branches tested or just happy path?</li>
          <li><strong>Mock dependencies:</strong> What external functions are being faked?</li>
          <li><strong>Data setup:</strong> How complex is the test data? (Hint: complex tests = complex feature)</li>
          <li><strong>Assertions:</strong> Is the function checking the right things?</li>
        </ul>

        <h3>Red Flags in Tests</h3>
        <ul>
          <li><strong>No tests at all:</strong> Feature is poorly understood or risky</li>
          <li><strong>Only happy path tests:</strong> Error handling might be fragile</li>
          <li><strong>Brittle tests:</strong> Tests that fail on minor changes (usually testing implementation, not behavior)</li>
          <li><strong>Very complex test setup:</strong> Feature might be too complicated, or test is testing too much at once</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Find ONE test file in this LMS (probably in `__tests__` or `.test.ts`). List the test names. What does this test suite tell you the feature should do?",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You read a test: `expect(calculateScore(answer, correctAnswer)).toBe(10)`. What are you learning?",
          options: [
            { value: "a", label: "How the function is implemented internally" },
            { value: "b", label: "The expected output given a specific input (the behavior contract)" },
            { value: "c", label: "The performance of the function" },
            { value: "d", label: "Nothing useful—you should read the code instead" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "Pick a utility function in this LMS (like `awardPoints` or `updateStreak`). If it has tests, read them. If not, write pseudocode for what tests SHOULD exist for this function.",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "asking-questions",
      stepNumber: 4,
      title: "Asking High-Signal Questions About Unfamiliar Code",
      icon: "❓",
      explanation: `
        <h3>The Difference Between Good and Bad Questions</h3>
        <p><strong>Bad question:</strong> "How does this work?" (too vague, shows you didn't read anything)</p>
        <p><strong>Good question:</strong> "I traced the flow from the button click to this API call, but I don't understand why you check the user's streak before awarding points. Is there a specific bug that happens if you don't?" (shows you've done homework, asks about intent)</p>

        <h3>High-Signal Question Framework</h3>
        <p>Before asking a question, always show your work:</p>
        <ol>
          <li><strong>What I've read:</strong> "I looked at the Submit handler and traced it to awardPoints()"</li>
          <li><strong>What I understand:</strong> "I see it updates the user's points and logs to the ledger"</li>
          <li><strong>What I don't understand:</strong> "But I'm not clear on why updateStreak() is called before checkAchievements()"</li>
          <li><strong>My hypothesis:</strong> "Is it because achievements depend on current streak?"</li>
          <li><strong>The actual question:</strong> "Can you confirm that order matters, and what breaks if we reverse it?"</li>
        </ol>

        <h3>Types of High-Signal Questions</h3>

        <h4>1. Clarifying Intent ("Why" Questions)</h4>
        <p>These show you understand the code but not the design decision:</p>
        <ul>
          <li>"I see you're caching the leaderboard. What was the performance problem you were solving?"</li>
          <li>"Why does the submission validation happen on the frontend AND backend? What's the tradeoff?"</li>
          <li>"I see a try/catch here. What specific error are you protecting against?"</li>
        </ul>
        <p><strong>Best for:</strong> Understanding architectural decisions, spotting potential risks</p>

        <h4>2. Confirming Assumptions ("Is This Right?" Questions)</h4>
        <p>These show you've traced the code but want confirmation:</p>
        <ul>
          <li>"If I'm reading this right, activities always award points, but only update streak if points > 0. Is that correct?"</li>
          <li>"It looks like achievements are checked on login. Why not just check them when points are awarded?"</li>
        </ul>
        <p><strong>Best for:</strong> Confirming your understanding before making changes</p>

        <h4>3. Impact Questions ("What Breaks?" Questions)</h4>
        <p>These show you're thinking about dependencies and risk:</p>
        <ul>
          <li>"If we change the achievement unlock criteria, what code would break?"</li>
          <li>"I see three different places that call updateStreak(). If we change the logic, would all three still work?"</li>
          <li>"What would happen if a user's weeklyPoints reset while they're mid-assignment?"</li>
        </ul>
        <p><strong>Best for:</strong> Change estimation, risk assessment, understanding dependencies</p>

        <h4>4. Consistency Questions ("Why Different?" Questions)</h4>
        <p>These show you've read multiple parts and noticed inconsistencies:</p>
        <ul>
          <li>"I see points logged in two places—once in awardPoints() and once in the activity submit handler. Why both?"</li>
          <li>"Some components use Context for state, but others lift state to a parent. What's the pattern?"</li>
        </ul>
        <p><strong>Best for:</strong> Identifying bugs, technical debt, or intentional redundancy</p>

        <h3>Questions to Avoid (Low-Signal)</h3>
        <ul>
          <li>"What does this do?" (You didn't read the code)</li>
          <li>"Why is the code like this?" (Too vague—specify which code)</li>
          <li>"Can you explain the whole feature?" (Ask about specific parts instead)</li>
          <li>"Is this a bug?" (Only ask if you have evidence, not a guess)</li>
        </ul>

        <h3>The Question Checklist</h3>
        <p>Before asking, verify you've done this:</p>
        <ul>
          <li>☑️ Read the code (not just skimmed it)</li>
          <li>☑️ Traced at least one feature end-to-end</li>
          <li>☑️ Read related tests</li>
          <li>☑️ Checked if there's existing documentation or comments</li>
          <li>☑️ Formulated a hypothesis about what's happening</li>
          <li>☑️ Identified the specific line or function you're confused about</li>
        </ul>
        <p>Only after checking these should you ask.</p>
      `,
      exercises: [
        {
          type: "text",
          label: "Read the awardPoints() function (in src/lib/gamification.ts or wherever it's defined). Write ONE high-signal question about this function using the framework: what I've read → what I understand → what I don't understand → my hypothesis → the question.",
          acceptAnyAttempt: true
        },
        {
          type: "select",
          label: "Which of these is a high-signal question?",
          options: [
            "How does the leaderboard work?",
            "I traced the getTimeframedLeaderboard function and see it filters by classId, but I don't understand why leaderboard queries exclude the 'marlie' test account. Is it a privacy concern or a testing artifact?",
            "Why is this code so complicated?",
            "Can you explain the whole gamification system?"
          ],
          expectedAnswer: "I traced the getTimeframedLeaderboard function and see it filters by classId, but I don't understand why leaderboard queries exclude the 'marlie' test account. Is it a privacy concern or a testing artifact?"
        },
        {
          type: "text",
          label: "Find ONE place in this codebase where two pieces of code do similar things (or the same thing in different ways). Ask a consistency question: 'Why are these different? Is this intentional or technical debt?'",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "blast-radius",
      stepNumber: 5,
      title: "Identifying Blast Radius: What Breaks If I Change This?",
      icon: "💥",
      explanation: `
        <h3>Why Blast Radius Matters</h3>
        <p>The most important question before making a code change: <em>"What else depends on this?"</em> A "simple" change to one function can break five others if you don't understand dependencies.</p>

        <p><strong>Blast radius = the set of code that will break if you change this.</strong></p>

        <h3>Tracing Dependencies: The Reverse Flow</h3>
        <p>Instead of tracing "what does this call," trace "what calls this."</p>

        <h4>Step 1: Identify the Change Point</h4>
        <p>You want to change something. Be specific:</p>
        <ul>
          <li>❌ "Change the activity system"</li>
          <li>✅ "Change the signature of awardPoints() from (userId, points, reason) to (userId, points, reason, metadata?)"</li>
        </ul>

        <h4>Step 2: Find All Callers</h4>
        <p>Use your IDE's "Find References" or "Find All Usages" feature to locate every place that calls this function:</p>
        <ul>
          <li>Search for: <code>awardPoints(</code></li>
          <li>Result: "Found in 12 files"</li>
          <li>Now check each one</li>
        </ul>

        <h4>Step 3: Assess Impact</h4>
        <p>For each caller, ask:</p>
        <ul>
          <li>Will this change break the caller?</li>
          <li>Do I need to update the caller too?</li>
          <li>Are there tests for the caller?</li>
        </ul>

        <h4>Step 4: Test Coverage</h4>
        <p>For each place that calls the code you're changing:</p>
        <ul>
          <li>Find and run tests for that caller</li>
          <li>If no tests exist, the change is riskier</li>
          <li>If tests exist, run them after your change</li>
        </ul>

        <h3>Common Blast Radius Patterns</h3>

        <h4>Function Return Type Changed</h4>
        <p><strong>Example:</strong> Change <code>getUserScore() → number</code> to <code>getUserScore() → { score: number, perfect: boolean }</code></p>
        <p><strong>Blast radius:</strong> Every place that calls <code>getUserScore()</code> and expects a number will break</p>
        <p><strong>Mitigation:</strong> Find all callers, update them, run their tests</p>

        <h4>Function Parameter Changed</h4>
        <p><strong>Example:</strong> Change <code>awardPoints(userId, points)</code> to <code>awardPoints(userId, points, reason)</code></p>
        <p><strong>Blast radius:</strong> All callers must pass the new <code>reason</code> parameter (unless it's optional with a default)</p>
        <p><strong>Mitigation:</strong> Make new parameters optional with defaults to avoid breaking existing calls</p>

        <h4>Database Schema Changed</h4>
        <p><strong>Example:</strong> Add a required column <code>category</code> to the Activities table</p>
        <p><strong>Blast radius:</strong> All code that creates activities must provide a category; all queries might need filtering logic</p>
        <p><strong>Mitigation:</strong> Use Prisma migrations; run database seed; test all activity creation flows</p>

        <h4>File/Module Moved or Renamed</h4>
        <p><strong>Example:</strong> Move <code>awardPoints()</code> from <code>src/lib/gamification.ts</code> to <code>src/services/points.ts</code></p>
        <p><strong>Blast radius:</strong> All imports must be updated</p>
        <p><strong>Mitigation:</strong> IDE refactoring tools usually handle this automatically</p>

        <h3>The Blast Radius Checklist</h3>
        <p>Before making a change, verify:</p>
        <ul>
          <li>☑️ Used IDE search to find all references to code you're changing</li>
          <li>☑️ Read each caller to understand how it uses the code</li>
          <li>☑️ Identified tests that cover each caller</li>
          <li>☑️ Ran those tests before your change (baseline)</li>
          <li>☑️ Made your change</li>
          <li>☑️ Updated all callers if necessary</li>
          <li>☑️ Ran all tests after your change</li>
          <li>☑️ Estimated rollback risk (how hard to revert?)</li>
        </ul>

        <h3>Red Flags: High Blast Radius</h3>
        <ul>
          <li>Function called in 10+ places</li>
          <li>No tests for the function or callers</li>
          <li>Function is exported from a public API</li>
          <li>Database schema change that requires migration</li>
          <li>Type definition change in a frequently imported file</li>
        </ul>
        <p><strong>When you see red flags:</strong> Plan extra time, test thoroughly, consider a gradual rollout</p>
      `,
      exercises: [
        {
          type: "text",
          label: "Find the awardPoints() function. Use your IDE to search for all references to it. How many places call this function? For 3 of them, describe: what does the caller do, and what would break if awardPoints() returned a different value?",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You want to add a required parameter to a frequently-used function. What's the safest way to avoid breaking all the callers?",
          options: [
            { value: "a", label: "Make the new parameter optional with a sensible default value" },
            { value: "b", label: "Change all callers at the same time" },
            { value: "c", label: "Add the parameter as a breaking change and update version number" },
            { value: "d", label: "Create a new function instead of modifying the old one" }
          ],
          expectedAnswer: "a"
        },
        {
          type: "text",
          label: "Imagine you want to change the achievement unlock criteria (e.g., 100 points instead of 50). Trace the blast radius: (1) Find where achievement unlock is checked, (2) list all places that code is called, (3) estimate the risk.",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "practice-features",
      stepNumber: 6,
      title: "Practice: Trace 3 Features Through This LMS",
      icon: "🔍",
      explanation: `
        <h3>Now It's Your Turn</h3>
        <p>You've learned the systematic approach. Now practice it three times on this actual LMS codebase. Each practice should take 20-40 minutes.</p>

        <h3>How to Structure Your Practice</h3>
        <ol>
          <li>Pick ONE feature you want to understand</li>
          <li>Write down the feature name and what you want to know</li>
          <li>Find the entry point (route or component)</li>
          <li>Trace the data flow end-to-end</li>
          <li>Read any tests for this feature</li>
          <li>Identify the blast radius (what depends on this?)</li>
          <li>Write a one-paragraph summary of what the feature does and how it works</li>
        </ol>

        <h3>Practice Feature 1: Subject Filtering (Easy)</h3>
        <p><strong>Goal:</strong> Understand how the "Filter by Subject" feature works in the dashboard.</p>
        <p><strong>What to trace:</strong></p>
        <ul>
          <li>Where is the subject filter UI rendered?</li>
          <li>What happens when a student clicks a subject chip?</li>
          <li>How does the backend receive the subject filter?</li>
          <li>How does the API response differ when a subject is selected?</li>
          <li>What re-renders in the UI?</li>
        </ul>

        <h3>Practice Feature 2: Points & Streak Awards (Medium)</h3>
        <p><strong>Goal:</strong> Understand the complete points and streak system.</p>
        <p><strong>What to trace:</strong></p>
        <ul>
          <li>Where does a student trigger activity completion?</li>
          <li>What API endpoint is called?</li>
          <li>How are points calculated?</li>
          <li>When is the streak updated?</li>
          <li>How does the frontend know points/streak changed?</li>
          <li>What edge cases exist? (e.g., what if points are 0?)</li>
        </ul>

        <h3>Practice Feature 3: Achievements (Hard)</h3>
        <p><strong>Goal:</strong> Understand how achievements are unlocked and displayed.</p>
        <p><strong>What to trace:</strong></p>
        <ul>
          <li>How are achievement unlock criteria defined?</li>
          <li>When are achievements checked for unlock?</li>
          <li>What data flows from backend to frontend?</li>
          <li>How are earned achievements displayed vs. locked ones?</li>
          <li>What happens if an unlock criteria changes mid-user-session?</li>
          <li>Find at least one edge case or potential bug</li>
        </ul>

        <h3>What to Document</h3>
        <p>For each feature, create a brief write-up:</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code># Feature: [Name]

## Entry Point
- Route: [file path]
- Component: [component name]

## Data Flow (7 steps)
1. User interaction: [describe what user does]
2. Frontend state: [what state changes?]
3. API call: [URL, method, payload]
4. Backend processing: [what file, what logic?]
5. Database: [what table, what operation?]
6. Response: [what data returned?]
7. UI update: [what re-renders?]

## Code Involved
- Frontend: [file1, file2, ...]
- Backend: [file1, file2, ...]
- Database: [schema model]
- Tests: [test file, test names]

## Dependencies & Blast Radius
- What depends on this feature?
- What would break if you changed [key function]?

## One Thing I Learned
[Write one interesting insight from reading this code]</code>
        </pre>
      `,
      exercises: [
        {
          type: "text",
          label: "PRACTICE 1: Trace the Subject Filter feature. Write the one-paragraph summary + entry point + data flow (7 steps). This is a real exercise—take your time.",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "PRACTICE 2: Trace the Points & Streak feature. Identify: (1) the main API endpoint, (2) the business logic function, (3) the database operations, (4) one edge case you found.",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "PRACTICE 3: Trace the Achievements feature. Answer: (1) How are achievement unlock criteria defined? (2) When are they checked? (3) What could go wrong? (4) What's the blast radius if you change unlock criteria?",
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
        <h3>The Code Reading Practice Loop</h3>
        <p>Reading code is a skill that improves with deliberate practice. Here's how to build the habit:</p>

        <h4>Weekly Practice (20-30 min)</h4>
        <ol>
          <li>Pick ONE feature in an unfamiliar codebase</li>
          <li>Trace it end-to-end using the systematic approach</li>
          <li>Write a one-paragraph explanation of how it works</li>
          <li>Ask ONE high-signal question about something you don't understand</li>
        </ol>

        <h4>Monthly Challenge (2-3 hours)</h4>
        <ol>
          <li>Pick an OSS project you've never seen</li>
          <li>Find where a specific feature is implemented</li>
          <li>Write a technical summary suitable for a PR review</li>
          <li>Find one bug or edge case that isn't tested</li>
        </ol>

        <h4>As You Grow</h4>
        <ul>
          <li>Reduce time spent tracing (you'll get faster)</li>
          <li>Increase code complexity (read bigger features)</li>
          <li>Start reviewing PRs in unfamiliar code</li>
          <li>Help others understand code (teaching cements learning)</li>
        </ul>

        <h3>The "Code Reading Speed" Metric</h3>
        <p>Track how fast you can trace a feature to understand your progress:</p>
        <ul>
          <li><strong>Month 1:</strong> 60-90 minutes to trace a medium feature</li>
          <li><strong>Month 3:</strong> 30-45 minutes (you know the patterns)</li>
          <li><strong>Month 6:</strong> 15-20 minutes (you spot dependencies quickly)</li>
          <li><strong>Month 12:</strong> 5-10 minutes (you can skim and jump to key spots)</li>
        </ul>
        <p>Track your progress by noting how long each practice takes.</p>

        <h3>I Can Now...</h3>
        <ul>
          <li>Find entry points without getting lost in implementation details</li>
          <li>Trace data flow from user action → UI update without running the code</li>
          <li>Read tests as documentation to understand what code should do</li>
          <li>Ask high-signal questions that show I've done my homework</li>
          <li>Identify dependencies and estimate the blast radius of a change</li>
          <li>Read unfamiliar code confidently and explain it to others</li>
          <li>Estimate how long a feature will take to modify based on code reading alone</li>
        </ul>

        <h3>Real-World Applications</h3>
        <p>Code reading becomes powerful when you use it:</p>
        <ul>
          <li><strong>Code reviews:</strong> Understand why a change was made and what could break</li>
          <li><strong>Estimates:</strong> Size work accurately by reading the code first</li>
          <li><strong>Debugging:</strong> Find the root cause faster by understanding the full flow</li>
          <li><strong>Technical decisions:</strong> Propose changes confidently because you understand the impact</li>
          <li><strong>Communication:</strong> Explain features to non-technical stakeholders with confidence</li>
          <li><strong>Onboarding:</strong> Help new team members understand the codebase</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "What's one feature in this LMS that you still don't fully understand? Write a plan to trace it this week using the systematic approach.",
          acceptAnyAttempt: true
        },
        {
          type: "text",
          label: "Find a code review from this project (in git history or on GitHub). Does the reviewer ask high-signal questions about the code? What questions would you have asked?",
          acceptAnyAttempt: true
        }
      ]
    }
  ],
  miniQuiz: [
    {
      id: "entry-q1",
      question: "When reading a Next.js application, where should you START to understand a feature?",
      options: [
        { value: "a", label: "The smallest utility function that's called" },
        { value: "b", label: "The route file or API handler where the feature is triggered" },
        { value: "c", label: "The database schema" },
        { value: "d", label: "The package.json to understand dependencies" }
      ],
      correctAnswer: "b",
      explanation: "Entry points (routes and API handlers) show you where code is first called. Starting there gives you context and direction for tracing dependencies.",
      topic: "entry-points",
      skill: "code-reading",
      skillTag: "finding-entry-points",
      difficulty: "easy"
    },
    {
      id: "data-q1",
      question: "You're tracing the data flow for 'user submits a quiz'. What's the correct sequence?",
      options: [
        { value: "a", label: "Database → API handler → Frontend state → UI re-render → User interaction" },
        { value: "b", label: "User interaction → Frontend state → API call → Backend processing → Database → Response → UI update" },
        { value: "c", label: "API handler → Frontend component → User interaction → Database" },
        { value: "d", label: "Database → Business logic → API → Frontend state" }
      ],
      correctAnswer: "b",
      explanation: "Data flows from user action through frontend state, to API, to backend, to database, back to frontend. This is the classic web app flow.",
      topic: "data-flow",
      skill: "code-reading",
      skillTag: "tracing-flow",
      difficulty: "easy"
    },
    {
      id: "tests-q1",
      question: "What's the most valuable thing to learn from reading a test suite?",
      options: [
        { value: "a", label: "How to write tests" },
        { value: "b", label: "The expected behavior and edge cases the code should handle" },
        { value: "c", label: "The internal implementation details of the function" },
        { value: "d", label: "Performance characteristics of the code" }
      ],
      correctAnswer: "b",
      explanation: "Tests define the contract: what inputs should produce what outputs and what edge cases matter. They're like living documentation of behavior.",
      topic: "reading-tests",
      skill: "code-reading",
      skillTag: "test-as-documentation",
      difficulty: "easy"
    },
    {
      id: "questions-q1",
      question: "Which is a high-signal question about code?",
      options: [
        { value: "a", label: "How does this code work?" },
        { value: "b", label: "I traced the awardPoints() flow, and it updates both User.points and PointsLedger. Is one a backup in case the other fails, or is this intentional double-logging?" },
        { value: "c", label: "Why is this code so complicated?" },
        { value: "d", label: "Can you explain the whole system?" }
      ],
      correctAnswer: "b",
      explanation: "High-signal questions show your work, state what you understand, ask about a specific detail, and include a hypothesis. They demonstrate you've read the code.",
      topic: "asking-questions",
      skill: "code-reading",
      skillTag: "communication",
      difficulty: "medium"
    },
    {
      id: "blast-q1",
      question: "You want to change a function's return type. How do you estimate the blast radius?",
      options: [
        { value: "a", label: "Just make the change and see what breaks" },
        { value: "b", label: "Use your IDE to find all references/usages of the function, then assess if each caller needs updates" },
        { value: "c", label: "Ask the person who wrote the function" },
        { value: "d", label: "Check if there are any comments mentioning the function" }
      ],
      correctAnswer: "b",
      explanation: "Find all places a function is called, then check if your change breaks each caller. This gives you an accurate picture of the blast radius.",
      topic: "blast-radius",
      skill: "code-reading",
      skillTag: "dependency-analysis",
      difficulty: "medium"
    },
    {
      id: "strategy-q1",
      question: "You have 30 minutes to understand how 'subject filtering' works in a dashboard. What's your strategy?",
      options: [
        { value: "a", label: "Read every line of code related to filtering" },
        { value: "b", label: "Find the entry point (filter UI), trace one click end-to-end, check the tests, skip implementation details" },
        { value: "c", label: "Ask someone to explain it" },
        { value: "d", label: "Run the app and click around to see what happens" }
      ],
      correctAnswer: "b",
      explanation: "Time-boxed code reading requires strategic skipping. Start with entry points, trace the happy path, use tests as documentation, then dig deeper if needed.",
      topic: "entry-points",
      skill: "code-reading",
      skillTag: "time-management",
      difficulty: "medium"
    },
    {
      id: "red-flags-q1",
      question: "You're reading a feature and notice it has NO tests. What's your biggest concern?",
      options: [
        { value: "a", label: "The team doesn't care about code quality" },
        { value: "b", label: "You have less documentation of expected behavior, and changes to this feature are riskier" },
        { value: "c", label: "The code must be perfect (untested code is always perfect)" },
        { value: "d", label: "Nothing—tests are nice to have, not essential" }
      ],
      correctAnswer: "b",
      explanation: "Untested code lacks documented behavior contracts. You have to infer behavior from code, which is slower and error-prone. Changes are riskier.",
      topic: "reading-tests",
      skill: "code-reading",
      skillTag: "risk-assessment",
      difficulty: "medium"
    },
    {
      id: "architecture-q1",
      question: "After reading a feature, you realize it's called from 15 different places. What does this tell you?",
      options: [
        { value: "a", label: "The feature is poorly designed" },
        { value: "b", label: "The feature is very important and heavily used; changes are high-risk" },
        { value: "c", label: "The code is not DRY (Don't Repeat Yourself)" },
        { value: "d", label: "Nothing—high usage is normal" }
      ],
      correctAnswer: "b",
      explanation: "High-usage functions have large blast radius. A bug or change affects many callers. These are areas where changes need extra testing and care.",
      topic: "blast-radius",
      skill: "code-reading",
      skillTag: "dependency-analysis",
      difficulty: "medium"
    },
    {
      id: "decision-q1",
      question: "You're estimating work to add a new parameter to frequently-used function. What's your estimate adjustment?",
      options: [
        { value: "a", label: "1x estimate (no adjustment—it's just adding one parameter)" },
        { value: "b", label: "2x estimate (need to understand all callers and update them)" },
        { value: "c", label: "5x estimate (major refactor)" },
        { value: "d", label: "Depends on if the parameter is optional with a default" }
      ],
      correctAnswer: "d",
      explanation: "If optional with a default, no caller changes needed (1x). If required, all callers must update (2-5x depending on count and test coverage). Always check this first.",
      topic: "blast-radius",
      skill: "code-reading",
      skillTag: "estimation",
      difficulty: "hard"
    },
    {
      id: "learning-q1",
      question: "After tracing a feature, you realize you don't understand WHY a specific check happens. What's your next move?",
      options: [
        { value: "a", label: "Give up—if you don't understand it immediately, the code is poorly written" },
        { value: "b", label: "Ask a high-signal question: 'I see you check X before Y. What specific bug happens if you don't?'" },
        { value: "c", label: "Look at git history to see when that check was added and why" },
        { value: "d", label: "Both B and C are good moves" }
      ],
      correctAnswer: "d",
      explanation: "Git history reveals intent (bug fixes, requirements), while a high-signal question to the team clarifies design intent. Both are valuable tools.",
      topic: "asking-questions",
      skill: "code-reading",
      skillTag: "investigation",
      difficulty: "hard"
    },
    {
      id: "judgment-q1",
      question: "You traced a feature and found it relies on three hidden assumptions (implicit dependencies). What's your assessment?",
      options: [
        { value: "a", label: "Nothing wrong—implicit dependencies are fine" },
        { value: "b", label: "Major risk: changes in unrelated code could break this feature; good candidate for refactoring" },
        { value: "c", label: "This means the code is well-factored" },
        { value: "d", label: "Only a problem if the assumptions are documented" }
      ],
      correctAnswer: "b",
      explanation: "Implicit dependencies are fragile. If Code A silently depends on Code B running first, changes to B can break A without obvious cause. Refactoring to make dependencies explicit is valuable.",
      topic: "blast-radius",
      skill: "code-reading",
      skillTag: "architecture-judgment",
      difficulty: "hard"
    }
  ]
};
