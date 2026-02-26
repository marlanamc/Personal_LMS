import type { InteractiveGuideContent } from "@/types/activity";

export const codingDependencyManagementDecisionsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Dependency Management Decisions: Knowing When and How to Upgrade",
      icon: "📦",
      explanation: `
        <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.25rem;">
          <p style="font-size: 1.05rem; margin: 0;"><strong>Every dependency is a decision: technical debt with benefits, complexity with capability.</strong> The wrong upgrade decision costs hours of debugging. The right one opens new possibilities.</p>
        </div>

        <h3>Why Dependency Decisions Matter</h3>
        <p>Dependencies aren't just packages. They're:</p>
        <ul>
          <li><strong>Attack surface:</strong> Security vulnerabilities in 300+ packages you didn't write</li>
          <li><strong>Technical debt:</strong> Outdated packages drag down development speed</li>
          <li><strong>Risk:</strong> Breaking changes can require significant refactoring</li>
          <li><strong>Opportunity:</strong> New versions unlock features, performance improvements, security fixes</li>
        </ul>

        <h3>Three Core Decisions</h3>
        <ol>
          <li><strong>Upgrade now or later?</strong> Evaluate the cost/benefit</li>
          <li><strong>What's in this update?</strong> Read the changelog to understand impact</li>
          <li><strong>How do I validate the upgrade?</strong> Test strategy before merging</li>
        </ol>

        <h3>What You Will Learn</h3>
        <ul>
          <li>Reading changelogs and migration guides effectively</li>
          <li>Understanding semantic versioning and what breaking changes mean</li>
          <li>The "upgrade now vs. later" decision tree</li>
          <li>Security patches: when to act immediately</li>
          <li>Testing upgrade impact before merge</li>
          <li>Communicating dependency risk to non-technical stakeholders</li>
        </ul>
      `,
      tipBox: {
        title: "Core Principle",
        content: "Every dependency is an investment. Upgrade only when the benefit outweighs the risk. Security patches always justify upgrade. Feature updates require judgment. Never upgrade for the sake of being current."
      },
      exercises: [
        {
          type: "text",
          label: "Think of a time a dependency upgrade caused problems in your or a project you know. What went wrong? How would you have avoided it?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "reading-changelogs",
      stepNumber: 1,
      title: "Reading Changelogs and Release Notes",
      icon: "📰",
      explanation: `
        <h3>The Changelog Is Your Crystal Ball</h3>
        <p>A good changelog tells you everything that changed and whether it affects you. A bad one says "bug fixes and improvements."</p>

        <h3>The Sections to Read (In Order)</h3>

        <h4>1. Breaking Changes (First!)</h4>
        <p><strong>This determines upgrade difficulty.</strong></p>
        <p>What APIs were removed or changed?</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Example changelog entry:
BREAKING: Removed deprecated getUser() method. Use fetchUser() instead.
BREAKING: Changed return type of submitForm() from Promise<boolean> to Promise<FormResult>.
BREAKING: Node.js < 14 no longer supported.</code>
        </pre>

        <p><strong>Questions to ask:</strong></p>
        <ul>
          <li>"Do we use the removed API?"</li>
          <li>"How many files import the changed function?"</li>
          <li>"Is our Node.js version new enough?"</li>
        </ul>

        <h4>2. Deprecations (Now/Soon Will Break)</h4>
        <p>Warnings about features that will break in the next version.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Example:
DEPRECATED: useLegacyFeature() is deprecated. Use useNewFeature() instead. Will be removed in v3.0.</code>
        </pre>

        <p><strong>Action:</strong> Update deprecated calls now, before they break. Makes future upgrades easier.</p>

        <h4>3. New Features (Nice to Have)</h4>
        <p>New APIs and capabilities.</p>
        <p><strong>Example:</strong> "Added useWindowSize() hook for responsive components"</p>
        <p><strong>Action:</strong> Evaluate if useful. Not a reason to upgrade alone.</p>

        <h4>4. Bug Fixes (Depends)</h4>
        <p>Some are critical, some aren't.</p>
        <p><strong>Example 1 (Critical):</strong> "Fixed memory leak in data fetching"</p>
        <p><strong>Example 2 (Not Critical):</strong> "Fixed label alignment in some browsers"</p>
        <p><strong>Action:</strong> Check if the bug affects you. If yes and you see it in production, upgrade.</p>

        <h4>5. Security Fixes (Always Upgrade)</h4>
        <p><strong>Always read these carefully.</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Example:
SECURITY: Fixed XSS vulnerability in user input sanitization (CVE-2024-1234)</code>
        </pre>

        <p><strong>Action:</strong> If you use the affected feature, upgrade immediately (or apply patch).</p>

        <h4>6. Performance Improvements (Helpful)</h4>
        <p>Faster is better, but not usually worth breaking changes.</p>
        <p><strong>Example:</strong> "Reduced bundle size by 15% through tree-shaking improvements"</p>

        <h3>Reading Strategy: The Fast Path</h3>

        <p><strong>To quickly assess upgrade impact:</strong></p>
        <ol>
          <li>Search for "BREAKING" or "Breaking Changes" section</li>
          <li>For each breaking change, ask: "Do we use this?"</li>
          <li>If yes, estimate effort to fix</li>
          <li>If no, mark as safe to upgrade</li>
          <li>Check for security fixes</li>
          <li>Evaluate benefit of new features vs. effort</li>
        </ol>

        <h3>Red Flags in Changelogs</h3>
        <ul>
          <li><strong>"We broke everything":</strong> Major version bump (1.x → 2.0) usually means significant changes</li>
          <li><strong>Many deprecations:</strong> Hints at big changes coming in next version</li>
          <li><strong>No changelog at all:</strong> Red flag—project may be inactive or poorly maintained</li>
          <li><strong>Vague entries like "bug fixes":</strong> No detail = harder to evaluate impact</li>
          <li><strong>Security fix without disclosure:</strong> Suspicious—good projects are transparent</li>
        </ul>

        <h3>Real Example: Trace a Changelog</h3>
        <p><strong>Scenario:</strong> Next.js 15 is released. Should you upgrade from 14?</p>

        <p><strong>Step 1: Find BREAKING CHANGES</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>From Next.js 15 changelog:
- BREAKING: Removed deprecated experimental.appDir (now standard)
- BREAKING: Minimum Node.js version 18.17+
- BREAKING: Changed route caching defaults</code>
        </pre>

        <p><strong>Step 2: Check if We Use These</strong></p>
        <ul>
          <li>We don't use experimental.appDir (using stable appRouter) ✅</li>
          <li>Our Node version is 20 ✅</li>
          <li>Route caching: need to review our routes ⚠️</li>
        </ul>

        <p><strong>Step 3: Check for Security Fixes</strong></p>
        <ul>
          <li>"Fixed CORS vulnerability" ✅ Important</li>
        </ul>

        <p><strong>Step 4: Evaluate Features</strong></p>
        <ul>
          <li>New React 19 support → Valuable, but not a reason to upgrade alone</li>
          <li>Improved image optimization → Nice, but not urgent</li>
        </ul>

        <p><strong>Decision:</strong> Safe to upgrade. Review caching changes. Do it in next sprint.</p>
      `,
      exercises: [
        {
          type: "text",
          label: "Find the changelog for a package you use (check npm.org or GitHub releases). Read the latest version's changelog. Summarize: (1) breaking changes, (2) security fixes, (3) new features.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "A package's changelog says 'minor version bump with bug fixes.' What's your assumption?",
          options: [
            { value: "a", label: "Definitely safe to upgrade, no breaking changes" },
            { value: "b", label: "Probably safe, but read BREAKING CHANGES section to confirm" },
            { value: "c", label: "Too risky, skip this version" },
            { value: "d", label: "Depends on the bug that was fixed" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "You see a changelog entry: 'SECURITY: Fixed critical vulnerability in data validation (CVE-2024-5678).' What's your next action?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "semver",
      stepNumber: 2,
      title: "Understanding Semantic Versioning and Breaking Changes",
      icon: "🔢",
      explanation: `
        <h3>Semantic Versioning: The Version Number Language</h3>
        <p>Versions follow the format: <code>MAJOR.MINOR.PATCH</code></p>

        <p><strong>Example:</strong> React 18.2.5</p>
        <ul>
          <li><code>18</code> = MAJOR (breaking changes)</li>
          <li><code>2</code> = MINOR (new features, no breaking changes)</li>
          <li><code>5</code> = PATCH (bug fixes, no breaking changes)</li>
        </ul>

        <h3>The Rules (Usually Followed)</h3>

        <h4>PATCH (18.2.4 → 18.2.5)</h4>
        <p><strong>What changed:</strong> Bug fixes only. No new features, no breaking changes.</p>
        <p><strong>Risk:</strong> Very low. Safe to upgrade automatically.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Example:
18.2.4 → 18.2.5: Fixed memory leak in useEffect cleanup</code>
        </pre>

        <h4>MINOR (18.1.x → 18.2.0)</h4>
        <p><strong>What changed:</strong> New features added, but old code still works.</p>
        <p><strong>Risk:</strong> Low to medium. New features might have bugs. Safe to upgrade, but test first.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Example:
18.1 → 18.2: Added useTransition hook, improved hydration performance</code>
        </pre>

        <h4>MAJOR (17.x → 18.0.0)</h4>
        <p><strong>What changed:</strong> Breaking changes. Old code WILL break.</p>
        <p><strong>Risk:</strong> High. Requires code review, refactoring, testing.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Example:
17 → 18: Removed legacy context API, changed auto-batching behavior, require Node 12+</code>
        </pre>

        <h3>The Upgrade Decision Based on Version Bump</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: rgba(123, 168, 132, 0.1);">
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Bump Type</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Risk</strong></th>
            <th style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1); text-align: left;"><strong>Recommendation</strong></th>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">PATCH</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Very low</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Upgrade ASAP (especially if security fix)</td>
          </tr>
          <tr style="background: rgba(20, 32, 47, 0.03);">
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">MINOR</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Low</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Upgrade in next sprint, test affected features</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">MAJOR</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">High</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(20, 32, 47, 0.1);">Plan carefully, read migration guide, allocate time</td>
          </tr>
        </table>

        <h3>When a Package Breaks the Rules</h3>
        <p><strong>Not all packages follow semver perfectly.</strong> Some common violations:</p>

        <h4>0.x Versions (No Stability Promise)</h4>
        <p><code>0.5.0 → 0.6.0</code> might have breaking changes even in "minor" bumps.</p>
        <p><strong>Example:</strong> Babel, Jest, many young projects use 0.x.</p>
        <p><strong>Action:</strong> Treat 0.x minor bumps like majors. Read changelog carefully.</p>

        <h4>Packages That Don't Care</h4>
        <p>Some projects change everything in minor versions.</p>
        <p><strong>Example:</strong> Some rapidly-evolving libraries like Next.js move fast.</p>
        <p><strong>Action:</strong> Check the project's track record. Do they break things in minor versions?</p>

        <h3>The Breaking Change Decision Tree</h3>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Is there a breaking change?
  ├─ YES: Do we use the changed API?
  │   ├─ NO: Safe to upgrade
  │   └─ YES: How many places use it?
  │       ├─ 1-2: Small refactor, upgrade in next task
  │       ├─ 3-10: Decent refactor, plan a sprint for it
  │       └─ 10+: Risky, plan carefully, consider staying on older version
  │
  └─ NO: Is there a security fix?
      ├─ YES: Upgrade immediately
      └─ NO: Are there useful features?
          ├─ YES: Upgrade in next sprint
          └─ NO: Stay on current version</code>
        </pre>
      `,
      exercises: [
        {
          type: "text",
          label: "Find 3 package versions in your projects (check package.json or package-lock.json). For each, identify: MAJOR, MINOR, PATCH numbers. What would each number change trigger?",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "You're using React 17.0.2. React 18.0.0 is available with a breaking change to auto-batching. What do you do?",
          options: [
            { value: "a", label: "Upgrade immediately" },
            { value: "b", label: "Read the migration guide, check if auto-batching affects you, plan the upgrade" },
            { value: "c", label: "Wait a few months for 18.1.0" },
            { value: "d", label: "Stay on 17 forever" }
          ],
          expectedAnswer: "b"
        },
        {
          type: "text",
          label: "A 0.x version bumps from 0.5.0 → 0.6.0. Is this safe to upgrade? Why or why not?",
          acceptAnyAttempt: true
        }
      ]
    },
    {
      id: "upgrade-decision",
      stepNumber: 3,
      title: "The 'Upgrade Now vs. Later' Decision",
      icon: "⏰",
      explanation: `
        <h3>The Real Decision: Is It Worth It?</h3>
        <p>Every upgrade has a cost (time, testing, risk) and a benefit (security, features, compatibility). Know when the benefit wins.</p>

        <h3>Always Upgrade (Security Takes Priority)</h3>

        <h4>Critical Security Patch</h4>
        <p><strong>Example:</strong> "Fixed remote code execution vulnerability"</p>
        <p><strong>Your job:</strong> Upgrade same day or apply patch. No debate.</p>
        <p><strong>Process:</strong></p>
        <ol>
          <li>Read the security advisory (CVE)</li>
          <li>Check if you use the affected code</li>
          <li>Upgrade or apply patch</li>
          <li>Deploy to production within 24 hours</li>
        </ol>

        <h4>Security Fix for Your Use Case</h4>
        <p><strong>Example:</strong> "Fixed XSS in form validation" (and you have forms)</p>
        <p><strong>Your job:</strong> Upgrade within a few days.</p>

        <h3>Should Upgrade (But Can Plan)</h3>

        <h4>Patch Version (Bug Fix)</h4>
        <p><strong>Example:</strong> 5.2.3 → 5.2.4 "Fixed rare memory leak"</p>
        <p><strong>Decision factors:</strong></p>
        <ul>
          <li>Do you see this bug in production? → Upgrade now</li>
          <li>Haven't hit it? → Upgrade next maintenance window</li>
          <li>Trivial bug? → Can wait until next coordinated upgrade</li>
        </ul>

        <h4>Minor Version (New Feature)</h4>
        <p><strong>Example:</strong> 5.1 → 5.2 "Added useWindowSize hook"</p>
        <p><strong>Evaluation:</strong></p>
        <ul>
          <li>Is the new feature useful to you?</li>
          <li>Is the library stable (not 0.x)?</li>
          <li>Are there any reported bugs in the new version?</li>
        </ul>

        <p><strong>Decision matrix:</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Useful feature?
  ├─ YES: Upgrade in next sprint (schedule testing)
  └─ NO: Stay on current version, re-evaluate next quarter</code>
        </pre>

        <h3>Can Probably Wait (Unless Forced)</h3>

        <h4>Major Version (Breaking Changes)</h4>
        <p><strong>Example:</strong> React 17 → 18</p>
        <p><strong>Factors to consider:</strong></p>
        <ul>
          <li>How breaking is the breaking change? (1 affected function vs. everything changed?)</li>
          <li>How much work to refactor?</li>
          <li>Will dependencies force us to upgrade? (Peer dependency hell)</li>
          <li>Are we blocked from using new tools/libraries?</li>
        </ul>

        <p><strong>Estimates:</strong></p>
        <ul>
          <li><strong>Small app, 1-2 breaking changes:</strong> 1-2 days → Upgrade when sprint allows</li>
          <li><strong>Medium app, 3-5 breaking changes:</strong> 3-5 days → Plan next major release cycle</li>
          <li><strong>Large app, 10+ breaking changes:</strong> 1-2 weeks → This IS the next release</li>
        </ul>

        <h3>Don't Upgrade (Yet)</h3>

        <h4>Broken Version (New Major, Lots of Bugs)</h4>
        <p><strong>Pattern:</strong> Version 5.0.0 is released, but 5.0.1 and 5.0.2 come out within a week.</p>
        <p><strong>Action:</strong> Wait for 5.0.3 or 5.1.0. New majors are often rough.</p>

        <h4>Forced to Upgrade (Dependency Hell)</h4>
        <p><strong>Example:</strong> Library A needs Package B v5.0, but you're on Package B v4.0</p>
        <p><strong>Action:</strong> Plan the upgrade chain. Which upgrade first? Can you do them together?</p>

        <h3>The Decision Tree</h3>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Do you need to upgrade this package?

Is there a security fix?
  ├─ YES: How critical?
  │   ├─ CRITICAL: Upgrade today
  │   ├─ HIGH: Upgrade within 2-3 days
  │   └─ MEDIUM: Upgrade within 1-2 weeks
  │
  └─ NO: Is this a major version bump?
      ├─ YES: How many breaking changes?
      │   ├─ 1-2: Can do in next sprint
      │   ├─ 3-10: Plan a full sprint
      │   └─ 10+: This is a major project
      │
      └─ NO (minor or patch):
          ├─ Are you seeing bugs this fixes? → Upgrade
          ├─ Do you need the new features? → Upgrade next sprint
          └─ Nothing useful? → Stay on current version</code>
        </pre>

        <h3>The "Stay Current" Trap</h3>
        <p><strong>Don't fall into this pattern:</strong></p>
        <ul>
          <li>Wait too long on old versions</li>
          <li>Dependencies start requiring newer versions</li>
          <li>Can't upgrade one without upgrading five others</li>
          <li>Eventually forced to do a massive upgrade</li>
        </ul>

        <p><strong>Healthier rhythm:</strong></p>
        <ul>
          <li>Minor versions: Upgrade every 3-6 months</li>
          <li>Patch versions: Upgrade as-released</li>
          <li>Major versions: Plan 1-2 per year</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Look at your package.json or package-lock.json. Find 3 packages you depend on. For each, decide: should you upgrade? Why or why not?",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "A package has a security patch (minor bump). You have 0 users reporting the vulnerability. Should you upgrade?",
          options: [
            { value: "a", label: "No, wait until you see reports" },
            { value: "b", label: "Yes, security patches should be deployed promptly" },
            { value: "c", label: "Maybe, if it affects your code" },
            { value: "d", label: "Never—applying patches is risky" }
          ],
          expectedAnswer: "b"
        }
      ]
    },
    {
      id: "testing-upgrades",
      stepNumber: 4,
      title: "Testing Upgrade Impact Before Merge",
      icon: "🧪",
      explanation: `
        <h3>The Upgrade Testing Strategy</h3>
        <p>Blind upgrades break things. <strong>Always test your upgrade before deploying.</strong></p>

        <h3>Step 1: Understand What Changed (Again)</h3>
        <p>Before running any tests:</p>
        <ol>
          <li>Read the changelog</li>
          <li>Identify breaking changes</li>
          <li>Mark which files might be affected</li>
          <li>Run grep: <code>grep -r "oldAPIName" src/</code> to find usages</li>
        </ol>

        <h3>Step 2: Upgrade in a Branch</h3>
        <p><strong>Never upgrade main.</strong> Always use a feature branch.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>git checkout -b chore/upgrade-next-js-15
npm install next@15.0.0
npm install  # Update lock file</code>
        </pre>

        <h3>Step 3: Run Automated Tests</h3>
        <p><strong>Your safety net.</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>npm run test           # Unit tests
npm run test:integration # Integration tests
npm run build            # Build check (catches type errors)
npm run lint             # Style and correctness checks</code>
        </pre>

        <p><strong>If tests pass:</strong> Good sign. Upgrade might be smooth.</p>
        <p><strong>If tests fail:</strong> Read the error. Is it the breaking change or a new bug?</p>

        <h3>Step 4: Manual Testing</h3>
        <p><strong>Tests can't catch everything.</strong> Manually test affected features.</p>

        <p><strong>For a major upgrade:</strong></p>
        <ol>
          <li>Start the app locally</li>
          <li>Walk through critical user flows</li>
          <li>Test the feature that changed</li>
          <li>Look for console errors or warnings</li>
        </ol>

        <p><strong>Specific tests:</strong></p>
        <ul>
          <li>If data fetching changed: Test a page that fetches data</li>
          <li>If routing changed: Test navigation between pages</li>
          <li>If API contract changed: Test API calls both ways</li>
        </ul>

        <h3>Step 5: TypeScript Checks (If Using TS)</h3>
        <p>TypeScript often catches API changes automatically.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>npm run typecheck

// Will show errors like:
// Property 'oldProp' does not exist on type 'Result'
// Type 'string' is not assignable to type 'number'</code>
        </pre>

        <p><strong>Action:</strong> Fix type errors before manual testing.</p>

        <h3>Step 6: Read Deprecation Warnings</h3>
        <p>Good packages warn about deprecated code.</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>npm run dev

// Watch for console warnings like:
// "Warning: useLayoutEffect does nothing on the server..."
// "Deprecated: setState will be removed in v6"</code>
        </pre>

        <p><strong>Action:</strong> Fix warnings now (they'll break in next major version).</p>

        <h3>Step 7: Test in Production-Like Environment</h3>
        <p><strong>If it's a risky upgrade:</strong> Deploy to staging first.</p>
        <ol>
          <li>Deploy PR to staging</li>
          <li>Run smoke tests (critical flows)</li>
          <li>Check monitoring/logs</li>
          <li>If all clear, merge</li>
        </ol>

        <h3>Common Upgrade Test Scenarios</h3>

        <p><strong>Scenario 1: React Major Upgrade</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Test plan:
1. npm install react@newversion
2. Run tests
3. Fix TypeScript errors
4. Load app, check console for warnings
5. Test: Click buttons, forms, navigation
6. Test: Data fetching pages
7. Test: Complex features (dashboard, admin)</code>
        </pre>

        <p><strong>Scenario 2: Database Library Upgrade</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Test plan:
1. npm install newlibrary
2. Run database tests
3. Run API tests (they hit the database)
4. Check query performance (new version might be slower)
5. Test with staging database (if safe)
6. Look for migration warnings</code>
        </pre>

        <p><strong>Scenario 3: Build Tool Upgrade (webpack, Vite, etc.)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Test plan:
1. npm install newtoolversion
2. npm run build (does it complete?)
3. Check bundle size (might change significantly)
4. npm run dev (does dev server start?)
5. Manual testing in dev mode
6. Check browser console for new warnings</code>
        </pre>

        <h3>The Testing Checklist</h3>
        <ul>
          <li>☑️ Branch created (not upgrading main)</li>
          <li>☑️ Changelog read (understand changes)</li>
          <li>☑️ Breaking changes identified (know what might break)</li>
          <li>☑️ Automated tests pass</li>
          <li>☑️ TypeScript checks pass</li>
          <li>☑️ Manual testing of affected features</li>
          <li>☑️ No console errors or warnings (or acceptable ones)</li>
          <li>☑️ Staging deployment (if high-risk upgrade)</li>
          <li>☑️ Ready to merge</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Plan a test strategy for upgrading one of your dependencies. Include: (1) what changed, (2) what to test manually, (3) how to validate it's safe.",
          acceptAnyAttempt: true
        },
        {
          type: "radio",
          label: "After upgrading a package, tests pass but you see a new console warning. Next step?",
          options: [
            { value: "a", label: "Ignore it, merge the PR" },
            { value: "b", label: "Read the warning, understand if it affects you, fix if needed before merging" },
            { value: "c", label: "Downgrade" },
            { value: "d", label: "Wait for next version" }
          ],
          expectedAnswer: "b"
        }
      ]
    },
    {
      id: "communicating-risk",
      stepNumber: 5,
      title: "Communicating Dependency Risk to Stakeholders",
      icon: "💬",
      explanation: `
        <h3>Translating Technical Risk to Business Language</h3>
        <p>Non-technical stakeholders don't care about semver. They care about impact:</p>
        <ul>
          <li>"Will users see downtime?"</li>
          <li>"Could this cause bugs?"</li>
          <li>"Do we need to delay the release?"</li>
        </ul>

        <h3>How to Frame Dependency Risk</h3>

        <h4>The Security Talk</h4>
        <p><strong>For security fixes:</strong> Always frame as "required" or "must-do".</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Technical: "There's a critical SQL injection vulnerability in our ORM."
Business: "We need to upgrade our database library immediately to close a security hole that could expose user data."

Technical: "XSS vulnerability in the rendering library."
Business: "User input could be executed as code. We need to patch this today."</code>
        </pre>

        <h4>The Feature Talk</h4>
        <p><strong>For useful features:</strong> Frame as "opportunity".</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Technical: "React 18 has improved auto-batching and transitions, reducing renders."
Business: "Upgrading will make the dashboard faster and improve user experience. Takes ~3 days of dev time."</code>
        </pre>

        <h4>The Maintenance Talk</h4>
        <p><strong>For routine updates:</strong> Frame as "technical health".</p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Technical: "Multiple minor versions behind on dependencies. Accumulating bugs, falling behind ecosystem."
Business: "Our stack is getting outdated. This is technical debt. We should spend 1 day updating to stay healthy and avoid major refactoring later."</code>
        </pre>

        <h3>The Risk Communication Template</h3>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Dependency Upgrade: [Package Name] [Old Version] → [New Version]

What's changing:
- [1-2 sentences explaining the update]

Why now:
- [Security / Feature / Maintenance]

Estimated effort:
- [X days of dev time]

Risk level:
- [Low / Medium / High]
- If HIGH: What could go wrong, and how will we mitigate

Timeline:
- Propose to complete by [date]
- Can fit in this sprint [yes/no]</code>
        </pre>

        <h3>Real Examples</h3>

        <p><strong>Example 1: Security Patch (Urgent)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Dependency: Express 4.16 → 4.17
Security: Fixed critical vulnerability in request parsing
Risk: Very low (patch version, only a bug fix)
Timeline: Merge and deploy today

Why: Users' data could be exposed if someone sends malicious requests.</code>
        </pre>

        <p><strong>Example 2: Major Version (Requires Planning)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>Dependency: Next.js 13 → 14
Changes: App Router (breaking change), improved image optimization
Risk: Medium (breaking changes, but well-documented)
Effort: 2-3 days for refactoring + testing
Timeline: Plan for next sprint

Why: Staying current prevents getting stuck on old tech. Improves performance.</code>
        </pre>

        <p><strong>Example 3: Routine Maintenance (Can Batch)</strong></p>
        <pre style="background: rgba(20, 32, 47, 0.06); padding: 1rim; border-radius: 0.5rem; overflow-x: auto;">
<code>Dependencies: 7 minor version bumps available
(lodash, axios, tailwindcss, etc.)
Risk: Very low (all minor versions)
Effort: 1 day (batch them together)
Timeline: Next maintenance window

Why: Keeps our dependencies fresh, fixes small bugs, stays compatible with new packages.</code>
        </pre>

        <h3>When to Ask for Help</h3>
        <ul>
          <li><strong>High-risk upgrade:</strong> "This needs careful planning. Can we discuss in a tech sync?"</li>
          <li><strong>Unsure about security:</strong> "I'm not sure if this vulnerability affects us. Let's review together."</li>
          <li><strong>Tight schedule:</strong> "This upgrade is important but will take 3 days. Can we shift other work?"</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Write a business-friendly explanation for a dependency upgrade someone on your team wants to make (or make one up). What's the change, why, what's the risk, what's the effort?",
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
        <h3>The Dependency Management Practice Loop</h3>

        <p><strong>Weekly practice:</strong></p>
        <ol>
          <li>Run <code>npm outdated</code> to see what's behind</li>
          <li>Pick one package to update</li>
          <li>Read its changelog</li>
          <li>Decide: upgrade now or later</li>
          <li>If upgrading, test and merge</li>
        </ol>

        <p><strong>Monthly practice:</strong></p>
        <ol>
          <li>Run <code>npm audit</code> to check for security issues</li>
          <li>Fix any security vulnerabilities</li>
          <li>Update 5-10 packages in one batch</li>
          <li>Test thoroughly, deploy</li>
        </ol>

        <p><strong>Quarterly practice:</strong></p>
        <ol>
          <li>Plan any major version upgrades</li>
          <li>Schedule dedicated sprint if needed</li>
          <li>Estimate effort</li>
          <li>Execute upgrade with full testing</li>
        </ol>

        <h3>I Can Now...</h3>
        <ul>
          <li>Read a changelog and understand what changed</li>
          <li>Identify breaking changes and evaluate their impact</li>
          <li>Understand semantic versioning</li>
          <li>Make smart upgrade decisions: now vs. later vs. never</li>
          <li>Evaluate security patches and act appropriately</li>
          <li>Plan and execute an upgrade with proper testing</li>
          <li>Communicate dependency risk in business terms</li>
          <li>Maintain healthy, up-to-date dependencies</li>
        </ul>

        <h3>Dependency Health Indicators</h3>
        <p>Your project is healthy when:</p>
        <ul>
          <li>Dependencies are updated at least quarterly</li>
          <li>No security vulnerabilities in npm audit</li>
          <li>Major versions are only 1-2 behind (not stuck on ancient versions)</li>
          <li>Package lock file is committed and consistent</li>
          <li>CI/CD tests run on every upgrade</li>
        </ul>

        <h3>Red Flags (Maintenance Debt)</h3>
        <ul>
          <li>Many "security" warnings from npm audit</li>
          <li>Dependencies 5+ major versions behind</li>
          <li>Can't upgrade because everything breaks</li>
          <li>New packages incompatible with old dependencies</li>
        </ul>
      `,
      exercises: [
        {
          type: "text",
          label: "Run npm outdated in your project. Pick 2 packages to assess. Would you upgrade each? Why or why not?",
          acceptAnyAttempt: true
        }
      ]
    }
  ],
  miniQuiz: [
    {
      id: "changelog-q1",
      question: "What should you read FIRST in a package changelog?",
      options: [
        { value: "a", label: "The performance improvements section" },
        { value: "b", label: "The breaking changes section" },
        { value: "c", label: "The new features section" },
        { value: "d", label: "The version number" }
      ],
      correctAnswer: "b",
      explanation: "Breaking changes determine upgrade difficulty. Know them first so you can decide if it's worth the effort.",
      topic: "reading-changelogs",
      skill: "dependency-management",
      skillTag: "changelog-reading",
      difficulty: "easy"
    },
    {
      id: "semver-q1",
      question: "What does a PATCH version bump (5.2.3 → 5.2.4) promise?",
      options: [
        { value: "a", label: "New features might be added" },
        { value: "b", label: "Backward-compatible bug fixes only" },
        { value: "c", label: "Breaking changes possible" },
        { value: "d", label: "Anything could change" }
      ],
      correctAnswer: "b",
      explanation: "Semantic versioning: PATCH = bug fixes, no breaking changes, no new features. Safe to upgrade automatically.",
      topic: "semver",
      skill: "dependency-management",
      skillTag: "versioning",
      difficulty: "easy"
    },
    {
      id: "breaking-q1",
      question: "How do you assess if a breaking change affects your code?",
      options: [
        { value: "a", label: "Assume it will break something" },
        { value: "b", label: "Search for usages of the removed/changed API" },
        { value: "c", label: "Just upgrade and see what breaks" },
        { value: "d", label: "Ask the package maintainer" }
      ],
      correctAnswer: "b",
      explanation: "Use grep/IDE search to find all usages of the changed API. If you don't use it, safe to upgrade.",
      topic: "semver",
      skill: "dependency-management",
      skillTag: "risk-assessment",
      difficulty: "medium"
    },
    {
      id: "security-q1",
      question: "You see a security patch for a library you use. Timeline?",
      options: [
        { value: "a", label: "Wait to see if others have problems first" },
        { value: "b", label: "Upgrade immediately or apply patch" },
        { value: "c", label: "Consider it in your next release cycle" },
        { value: "d", label: "Only if you see security breaches" }
      ],
      correctAnswer: "b",
      explanation: "Security patches are not optional. Upgrade same day. If you can't upgrade, disable the vulnerable feature.",
      topic: "upgrade-decision",
      skill: "dependency-management",
      skillTag: "security",
      difficulty: "easy"
    },
    {
      id: "major-q1",
      question: "React has a major version with breaking changes. Should you upgrade immediately?",
      options: [
        { value: "a", label: "Yes, always stay on latest" },
        { value: "b", label: "No, never upgrade majors" },
        { value: "c", label: "Read the migration guide, estimate effort, plan the upgrade" },
        { value: "d", label: "Wait until you're forced to" }
      ],
      correctAnswer: "c",
      explanation: "Major upgrades require planning. Understand the breaking changes, estimate time, schedule a sprint if needed.",
      topic: "upgrade-decision",
      skill: "dependency-management",
      skillTag: "planning",
      difficulty: "medium"
    },
    {
      id: "testing-q1",
      question: "After upgrading a package, tests pass but there's a new console warning. Should you merge?",
      options: [
        { value: "a", label: "Yes, tests passed so it's fine" },
        { value: "b", label: "No, ignore the warning it's not important" },
        { value: "c", label: "Investigate the warning first. Fix if it affects you." },
        { value: "d", label: "Downgrade" }
      ],
      correctAnswer: "c",
      explanation: "Warnings often indicate deprecation. Fix now before it breaks in the next major version.",
      topic: "testing-upgrades",
      skill: "dependency-management",
      skillTag: "testing",
      difficulty: "medium"
    },
    {
      id: "decision-q1",
      question: "A package has a minor update with a useful new feature. You're busy. Should you upgrade?",
      options: [
        { value: "a", label: "Yes, always stay current" },
        { value: "b", label: "No, features are never worth the effort" },
        { value: "c", label: "Evaluate: is the feature useful enough to justify testing time?" },
        { value: "d", label: "Wait until next major version" }
      ],
      correctAnswer: "c",
      explanation: "Every upgrade has a cost. Only upgrade minors if the feature is useful or you're doing other updates anyway.",
      topic: "upgrade-decision",
      skill: "dependency-management",
      skillTag: "judgment",
      difficulty: "hard"
    },
    {
      id: "communication-q1",
      question: "How would you explain a dependency upgrade to a non-technical stakeholder?",
      options: [
        { value: "a", label: "\"We're upgrading npm packages.\"" },
        { value: "b", label: "\"Semantic versioning requires us to update.\"" },
        { value: "c", label: "\"We're updating our tools to stay secure and keep up with industry standards. It takes 1-2 days.\"" },
        { value: "d", label: "\"Don't worry about it.\"" }
      ],
      correctAnswer: "c",
      explanation: "Translate to business language: what's the benefit, how long does it take, what's the risk.",
      topic: "communicating-risk",
      skill: "dependency-management",
      skillTag: "communication",
      difficulty: "hard"
    }
  ]
};
