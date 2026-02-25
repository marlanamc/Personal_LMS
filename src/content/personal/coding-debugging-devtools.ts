import type { InteractiveGuideContent } from "@/types/activity";

export const codingDebuggingDevtoolsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Debugging & Dev Tools: Find Bugs Fast",
            icon: "🐛",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Every developer spends time debugging. The difference between struggling and flying through bugs is knowing your tools. Master debugging and save hours!</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul>
                    <li>Console methods beyond log()</li>
                    <li>Browser DevTools essentials</li>
                    <li>Setting and using breakpoints</li>
                    <li>The Network tab</li>
                    <li>Debugging strategies</li>
                    <li>Common debugging patterns</li>
                </ul>
            `,
            tipBox: {
                title: "Companion Guide",
                content:
                    "Apply this directly in Working with APIs. Debugging API failures is mostly a Network panel + response inspection skill, then code-level trace validation.",
            },
            exercises: [
                {
                    id: "cdd-intro-1",
                    title: "Quick Check",
                    instructions: "How do you open DevTools?",
                    items: [
                        {
                            type: "radio",
                            label: "Open DevTools shortcut:",
                            options: [
                                { value: "f12", label: "F12 or Cmd/Ctrl + Shift + I" },
                                { value: "enter", label: "Press Enter" },
                            ],
                            expectedAnswer: "f12",
                        },
                    ],
                },
            ],
        },

        // Console Methods
        {
            id: "console-methods",
            stepNumber: 1,
            title: "Console Methods Beyond log()",
            icon: "💬",
            explanation: `
                <h3>More Than Just console.log()</h3>
                <p>The console object has many useful methods. Use the right one for the job!</p>
            `,
            verbTable: {
                title: "Console Methods",
                headers: ["Method", "Purpose", "When to Use"],
                rows: [
                    ["log()", "General output", "Default debugging"],
                    ["error()", "Error messages (red)", "Errors and failures"],
                    ["warn()", "Warnings (yellow)", "Potential issues"],
                    ["info()", "Informational", "Status updates"],
                    ["table()", "Tabular data", "Arrays/objects"],
                    ["group()/groupEnd()", "Group logs", "Related logs"],
                    ["time()/timeEnd()", "Measure duration", "Performance"],
                    ["trace()", "Stack trace", "Find call origin"],
                    ["assert()", "Conditional log", "Test assumptions"],
                    ["clear()", "Clear console", "Fresh start"],
                ],
            },
            usageMeanings: [
                {
                    title: "🎨 Styled Output",
                    description: "Make important logs stand out",
                    examples: [
                        {
                            sentence: "console.error('Failed to save!');",
                            explanation: "Shows in red, easy to spot.",
                        },
                        {
                            sentence: "console.warn('API deprecated');",
                            explanation: "Yellow warning style.",
                        },
                        {
                            sentence: "console.log('%cHello', 'color: blue; font-size: 20px');",
                            explanation: "Custom CSS styling!",
                        },
                    ],
                },
                {
                    title: "📊 console.table()",
                    description: "Display arrays/objects as tables",
                    examples: [
                        {
                            sentence: "console.table([{a:1}, {a:2}, {a:3}]);",
                            explanation: "Beautiful table view.",
                        },
                        {
                            sentence: "console.table(users, ['name', 'email']);",
                            explanation: "Show only specific columns.",
                        },
                    ],
                },
                {
                    title: "⏱️ console.time()",
                    description: "Measure execution time",
                    examples: [
                        {
                            sentence: "console.time('fetch'); await fetchData(); console.timeEnd('fetch');",
                            explanation: "Outputs: 'fetch: 234ms'",
                        },
                        {
                            sentence: "console.time('loop'); for(...) { ... } console.timeEnd('loop');",
                            explanation: "Measure loop performance.",
                        },
                    ],
                },
                {
                    title: "📁 console.group()",
                    description: "Group related logs",
                    examples: [
                        {
                            sentence: "console.group('User Data'); console.log(name); console.log(email); console.groupEnd();",
                            explanation: "Collapsible group in console.",
                        },
                        {
                            sentence: "console.groupCollapsed('Details');",
                            explanation: "Start collapsed.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdd-console-1",
                    title: "Console Methods",
                    instructions: "Which method to use?",
                    items: [
                        {
                            type: "select",
                            label: "Display an array as a table",
                            options: ["log()", "table()", "error()", "time()"],
                            expectedAnswer: "table()",
                        },
                        {
                            type: "select",
                            label: "Measure how long code takes",
                            options: ["log()", "table()", "error()", "time()"],
                            expectedAnswer: "time()",
                        },
                    ],
                },
            ],
        },

        // DevTools Overview
        {
            id: "devtools-overview",
            stepNumber: 2,
            title: "Browser DevTools Overview",
            icon: "🔧",
            explanation: `
                <h3>Know Your Tools</h3>
                <p>DevTools has several panels. Know what each does!</p>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">Elements</h4>
                        <p style="margin: 0; font-size: 0.9rem;">Inspect HTML & CSS. Edit live. See computed styles.</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">Console</h4>
                        <p style="margin: 0; font-size: 0.9rem;">Run JS, see logs, errors, warnings.</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">Sources</h4>
                        <p style="margin: 0; font-size: 0.9rem;">Breakpoints, step through code, watch variables.</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">Network</h4>
                        <p style="margin: 0; font-size: 0.9rem;">API calls, load times, request/response data.</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.25rem; border-radius: 0.75rem; color: #2b3a4a;">
                        <h4 style="margin-top: 0;">Application</h4>
                        <p style="margin: 0; font-size: 0.9rem;">localStorage, cookies, service workers.</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 1.25rem; border-radius: 0.75rem; color: #2b3a4a;">
                        <h4 style="margin-top: 0;">Performance</h4>
                        <p style="margin: 0; font-size: 0.9rem;">Profiling, rendering, memory usage.</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "⌨️ Essential Shortcuts",
                    description: "Speed up your workflow",
                    examples: [
                        {
                            sentence: "F12 or Cmd/Ctrl + Shift + I - Open DevTools",
                            explanation: "The most important shortcut!",
                        },
                        {
                            sentence: "Cmd/Ctrl + Shift + C - Inspect element mode",
                            explanation: "Click any element to inspect.",
                        },
                        {
                            sentence: "Cmd/Ctrl + Shift + J - Open Console directly",
                            explanation: "Jump straight to console.",
                        },
                        {
                            sentence: "Escape - Toggle console drawer",
                            explanation: "Show console while in other tabs.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdd-devtools-1",
                    title: "DevTools Panels",
                    instructions: "Which panel for each task?",
                    items: [
                        {
                            type: "select",
                            label: "See API request/response",
                            options: ["Elements", "Console", "Sources", "Network"],
                            expectedAnswer: "Network",
                        },
                        {
                            type: "select",
                            label: "Set breakpoints in code",
                            options: ["Elements", "Console", "Sources", "Network"],
                            expectedAnswer: "Sources",
                        },
                    ],
                },
            ],
        },

        // Breakpoints
        {
            id: "breakpoints",
            stepNumber: 3,
            title: "Breakpoints: Pause & Inspect",
            icon: "⏸️",
            explanation: `
                <h3>Stop Code and Inspect State</h3>
                <p>Breakpoints pause execution so you can see variable values, call stack, and step through code line by line.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0;">Setting Breakpoints</h4>
                    <ol style="margin: 0; padding-left: 1.5rem;">
                        <li>Open Sources panel</li>
                        <li>Find your file in the left panel</li>
                        <li>Click the line number to set a breakpoint (blue marker)</li>
                        <li>Trigger the code (reload, click button, etc.)</li>
                        <li>Code pauses at the breakpoint!</li>
                    </ol>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔵 Types of Breakpoints",
                    description: "Different ways to pause execution",
                    examples: [
                        {
                            sentence: "Line breakpoint - Click line number",
                            explanation: "Always pauses at this line.",
                        },
                        {
                            sentence: "Conditional breakpoint - Right-click > Add conditional",
                            explanation: "Only pauses when condition is true.",
                        },
                        {
                            sentence: "debugger; statement in code",
                            explanation: "Programmatic breakpoint.",
                        },
                        {
                            sentence: "XHR/fetch breakpoint - Break on API calls",
                            explanation: "Pause when specific URL is requested.",
                        },
                    ],
                },
                {
                    title: "🎮 Stepping Controls",
                    description: "Navigate through paused code",
                    examples: [
                        {
                            sentence: "▶️ Resume (F8) - Continue to next breakpoint",
                            explanation: "Keep running.",
                        },
                        {
                            sentence: "⏭️ Step Over (F10) - Execute line, skip into functions",
                            explanation: "Stay at current level.",
                        },
                        {
                            sentence: "⬇️ Step Into (F11) - Go into function calls",
                            explanation: "Dive deeper.",
                        },
                        {
                            sentence: "⬆️ Step Out (Shift+F11) - Finish current function",
                            explanation: "Back to caller.",
                        },
                    ],
                },
                {
                    title: "👀 While Paused",
                    description: "Inspect state at breakpoint",
                    examples: [
                        {
                            sentence: "Scope panel shows local/global variables",
                            explanation: "See all variable values.",
                        },
                        {
                            sentence: "Hover over variables to see values",
                            explanation: "Quick inline inspection.",
                        },
                        {
                            sentence: "Watch panel - Track specific expressions",
                            explanation: "Add custom expressions to monitor.",
                        },
                        {
                            sentence: "Call Stack shows how you got here",
                            explanation: "Trace back through function calls.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 debugger Statement",
                content:
                    "Add 'debugger;' in your code to create a breakpoint programmatically. Great for conditional debugging: if (x > 100) debugger;",
            },
            exercises: [
                {
                    id: "cdd-break-1",
                    title: "Breakpoints",
                    instructions: "Match the action:",
                    items: [
                        {
                            type: "select",
                            label: "Continue to next breakpoint",
                            options: ["Resume (F8)", "Step Over (F10)", "Step Into (F11)"],
                            expectedAnswer: "Resume (F8)",
                        },
                        {
                            type: "select",
                            label: "Execute line, skip into functions",
                            options: ["Resume (F8)", "Step Over (F10)", "Step Into (F11)"],
                            expectedAnswer: "Step Over (F10)",
                        },
                    ],
                },
            ],
        },

        // Network Tab
        {
            id: "network-tab",
            stepNumber: 4,
            title: "Network Tab: Debug API Calls",
            icon: "🌐",
            explanation: `
                <h3>See All Network Requests</h3>
                <p>The Network tab shows every request your page makes - APIs, images, scripts, everything!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0;">Key Features</h4>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li><strong>Filter:</strong> XHR, Fetch, JS, CSS, etc.</li>
                        <li><strong>Preview:</strong> See response data</li>
                        <li><strong>Headers:</strong> Request/response headers</li>
                        <li><strong>Timing:</strong> How long each phase took</li>
                        <li><strong>Preserve log:</strong> Keep requests across page loads</li>
                    </ul>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔍 Inspecting Requests",
                    description: "Dig into any request",
                    examples: [
                        {
                            sentence: "Click any request to see details",
                            explanation: "Opens detailed view.",
                        },
                        {
                            sentence: "Headers tab - See request/response headers",
                            explanation: "Check auth tokens, content-type, etc.",
                        },
                        {
                            sentence: "Preview tab - See formatted response",
                            explanation: "JSON is nicely formatted.",
                        },
                        {
                            sentence: "Response tab - See raw response",
                            explanation: "Exact bytes returned.",
                        },
                    ],
                },
                {
                    title: "🚨 Spotting Problems",
                    description: "Find issues quickly",
                    examples: [
                        {
                            sentence: "Red requests = errors (4xx, 5xx)",
                            explanation: "Failed requests stand out.",
                        },
                        {
                            sentence: "Check Status column for HTTP codes",
                            explanation: "200 OK, 404 Not Found, etc.",
                        },
                        {
                            sentence: "Look at request payload for POST errors",
                            explanation: "Is the data you're sending correct?",
                        },
                    ],
                },
                {
                    title: "🎯 Filtering",
                    description: "Find specific requests",
                    examples: [
                        {
                            sentence: "Click XHR/Fetch to see only API calls",
                            explanation: "Hide images, CSS, etc.",
                        },
                        {
                            sentence: "Type in filter box: /api/ or method:POST",
                            explanation: "Search by URL or method.",
                        },
                        {
                            sentence: "Right-click > Copy > Copy as fetch",
                            explanation: "Get code to replay request!",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdd-network-1",
                    title: "Network Tab",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "Red requests indicate:",
                            options: [
                                { value: "error", label: "HTTP errors (4xx/5xx)" },
                                { value: "slow", label: "Slow requests" },
                            ],
                            expectedAnswer: "error",
                        },
                        {
                            type: "radio",
                            label: "To see JSON response data:",
                            options: [
                                { value: "preview", label: "Click Preview tab" },
                                { value: "timing", label: "Click Timing tab" },
                            ],
                            expectedAnswer: "preview",
                        },
                    ],
                },
            ],
        },

        // Debugging Strategies
        {
            id: "debugging-strategies",
            stepNumber: 5,
            title: "Debugging Strategies",
            icon: "🧠",
            explanation: `
                <h3>Approach Bugs Systematically</h3>
                <p>Good debugging is about having a strategy, not just randomly adding console.logs!</p>
            `,
            usageMeanings: [
                {
                    title: "🔬 The Scientific Method",
                    description: "Debug like a scientist",
                    examples: [
                        {
                            sentence: "1. Reproduce - Can you make the bug happen?",
                            explanation: "First step is always reproducing.",
                        },
                        {
                            sentence: "2. Hypothesize - What do you think is wrong?",
                            explanation: "Form a theory.",
                        },
                        {
                            sentence: "3. Test - Add logs/breakpoints to verify",
                            explanation: "Check your hypothesis.",
                        },
                        {
                            sentence: "4. Fix - Make the smallest change that fixes it",
                            explanation: "Don't change everything at once.",
                        },
                        {
                            sentence: "5. Verify - Is it actually fixed?",
                            explanation: "Test the fix thoroughly.",
                        },
                    ],
                },
                {
                    title: "🎯 Binary Search Debugging",
                    description: "Find bugs in large codebases fast",
                    examples: [
                        {
                            sentence: "Add a log halfway through the code path",
                            explanation: "Is the bug before or after this point?",
                        },
                        {
                            sentence: "Narrow down: before = move log earlier, after = move log later",
                            explanation: "Each step eliminates half the code.",
                        },
                        {
                            sentence: "Repeat until you find the exact line",
                            explanation: "Very efficient for large codebases.",
                        },
                    ],
                },
                {
                    title: "🦆 Rubber Duck Debugging",
                    description: "Explain the problem out loud",
                    examples: [
                        {
                            sentence: "Explain what the code should do, line by line",
                            explanation: "To a rubber duck, colleague, or yourself.",
                        },
                        {
                            sentence: "You'll often realize the bug while explaining",
                            explanation: "Verbalizing forces careful thinking.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Read Error Messages!",
                content:
                    "Error messages tell you exactly what's wrong. Read the whole thing - the file, line number, and message. Don't just google the first line!",
            },
            exercises: [
                {
                    id: "cdd-strategy-1",
                    title: "Debugging Strategy",
                    instructions: "What's the first step?",
                    items: [
                        {
                            type: "radio",
                            label: "First step when debugging:",
                            options: [
                                { value: "reproduce", label: "Reproduce the bug" },
                                { value: "fix", label: "Start changing code" },
                            ],
                            expectedAnswer: "reproduce",
                        },
                    ],
                },
            ],
        },

        // Common Bugs
        {
            id: "common-bugs",
            stepNumber: 6,
            title: "Common Bug Patterns",
            icon: "🐞",
            explanation: `
                <h3>Recognize Common Issues</h3>
                <p>Many bugs follow patterns. Learn to spot them quickly!</p>
            `,
            usageMeanings: [
                {
                    title: "❌ undefined is not a function",
                    description: "Calling something that isn't a function",
                    examples: [
                        {
                            sentence: "Check: Does the function exist?",
                            explanation: "Typo in name? Wrong import?",
                        },
                        {
                            sentence: "Check: Is it actually a function?",
                            explanation: "Maybe it's null or undefined.",
                        },
                        {
                            sentence: "Check: Are you calling it correctly?",
                            explanation: "Missing parentheses?",
                        },
                    ],
                },
                {
                    title: "❌ Cannot read property of undefined",
                    description: "Accessing property on null/undefined",
                    examples: [
                        {
                            sentence: "user.name - but user is undefined",
                            explanation: "Check if parent object exists.",
                        },
                        {
                            sentence: "Fix: Use optional chaining - user?.name",
                            explanation: "Returns undefined instead of crashing.",
                        },
                        {
                            sentence: "Check: Is async data loaded yet?",
                            explanation: "Often happens with API data.",
                        },
                    ],
                },
                {
                    title: "❌ Async/Timing Issues",
                    description: "Code runs in wrong order",
                    examples: [
                        {
                            sentence: "Data is undefined after API call",
                            explanation: "Forgot await? Missing callback?",
                        },
                        {
                            sentence: "State isn't updated immediately",
                            explanation: "React state is async!",
                        },
                        {
                            sentence: "Event listener fires multiple times",
                            explanation: "Adding listeners in useEffect without cleanup.",
                        },
                    ],
                },
                {
                    title: "❌ Off-by-one Errors",
                    description: "Loop goes one too many/few times",
                    examples: [
                        {
                            sentence: "i <= arr.length vs i < arr.length",
                            explanation: "Array index out of bounds.",
                        },
                        {
                            sentence: "Starting at 1 instead of 0",
                            explanation: "Most things are 0-indexed.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdd-bugs-1",
                    title: "Common Bugs",
                    instructions: "What likely causes this?",
                    items: [
                        {
                            type: "select",
                            label: "Cannot read property 'name' of undefined",
                            options: ["Object is null/undefined", "Syntax error", "Network error"],
                            expectedAnswer: "Object is null/undefined",
                        },
                    ],
                },
            ],
        },

        // React DevTools
        {
            id: "react-devtools",
            stepNumber: 7,
            title: "Framework-Specific Tools",
            icon: "⚛️",
            explanation: `
                <h3>Tools for React, Vue, etc.</h3>
                <p>Frameworks have their own DevTools extensions with special powers!</p>
            `,
            usageMeanings: [
                {
                    title: "⚛️ React DevTools",
                    description: "Inspect React component tree",
                    examples: [
                        {
                            sentence: "Components tab - See component hierarchy",
                            explanation: "Like Elements but for React.",
                        },
                        {
                            sentence: "Click component to see props and state",
                            explanation: "Inspect current values.",
                        },
                        {
                            sentence: "Edit props/state live in DevTools",
                            explanation: "Test changes without code edits.",
                        },
                        {
                            sentence: "Profiler tab - Find slow components",
                            explanation: "See render times.",
                        },
                    ],
                },
                {
                    title: "🟢 Vue DevTools",
                    description: "Similar features for Vue",
                    examples: [
                        {
                            sentence: "Component inspector with reactive data",
                            explanation: "See computed properties.",
                        },
                        {
                            sentence: "Vuex/Pinia state management tools",
                            explanation: "Debug stores.",
                        },
                    ],
                },
                {
                    title: "📦 Redux DevTools",
                    description: "Time-travel debugging for Redux",
                    examples: [
                        {
                            sentence: "See every action dispatched",
                            explanation: "Full action history.",
                        },
                        {
                            sentence: "Jump to any previous state",
                            explanation: "Time travel!",
                        },
                        {
                            sentence: "Replay actions",
                            explanation: "Reproduce bugs easily.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cdd-react-1",
                    title: "React DevTools",
                    instructions: "What can you do?",
                    items: [
                        {
                            type: "radio",
                            label: "React DevTools lets you:",
                            options: [
                                { value: "inspect", label: "Inspect component props and state" },
                                { value: "deploy", label: "Deploy to production" },
                            ],
                            expectedAnswer: "inspect",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "Debugging Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>console.table()</strong> for arrays, <strong>.error()</strong> for errors</li>
                    <li><strong>F12</strong> opens DevTools everywhere</li>
                    <li><strong>Breakpoints</strong> pause code - use Sources tab</li>
                    <li><strong>debugger;</strong> statement for programmatic breakpoints</li>
                    <li><strong>Network tab</strong> shows API requests/responses</li>
                    <li><strong>Read error messages</strong> - they tell you what's wrong</li>
                    <li><strong>Reproduce first</strong>, then hypothesize, then fix</li>
                    <li><strong>React DevTools</strong> for inspecting components</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cdd-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "To see API responses, use:",
                            options: [
                                { value: "network", label: "Network tab" },
                                { value: "elements", label: "Elements tab" },
                            ],
                            expectedAnswer: "network",
                        },
                        {
                            type: "radio",
                            label: "To pause code at a specific line:",
                            options: [
                                { value: "break", label: "Set a breakpoint in Sources" },
                                { value: "log", label: "Add console.log()" },
                            ],
                            expectedAnswer: "break",
                        },
                        {
                            type: "radio",
                            label: "First step when debugging:",
                            options: [
                                { value: "reproduce", label: "Reproduce the bug" },
                                { value: "fix", label: "Start fixing" },
                            ],
                            expectedAnswer: "reproduce",
                        },
                    ],
                },
            ],
        },
        {
            id: "practice-cadence-and-outcomes",
            stepNumber: 99,
            title: "Practice Cadence + I Can Now",
            icon: "check-circle",
            explanation: `
                <h3>Standard Practice Cadence</h3>
                <p>Use this repeatable sequence whenever you learn a new concept: concept check -> read code -> write code -> debug scenario.</p>
            `,
            exercises: [
                {
                    id: "dd-cadence-concept",
                    title: "Concept Check",
                    instructions: "State one core rule from this lesson in your own words.",
                    items: [
                        {
                            type: "text",
                            label: "Write one sentence that captures the most important concept from this guide:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "dd-cadence-read",
                    title: "Read Code",
                    instructions: "Practice code reading and explanation.",
                    items: [
                        {
                            type: "text",
                            label: "Find one existing code path in this project related to this lesson and explain what it does in 2-3 sentences:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "dd-cadence-write",
                    title: "Write Code",
                    instructions: "Translate understanding into implementation.",
                    items: [
                        {
                            type: "text",
                            label: "Describe one small code change you would implement using this lesson's concepts and how you would validate it:",
                            acceptAnyAttempt: true,
                        },
                    ],
                },
                {
                    id: "dd-cadence-debug",
                    title: "Debug Scenario",
                    instructions: "Choose the strongest debugging posture.",
                    items: [
                        {
                            type: "radio",
                            label: "If your change fails in review or testing, what is the best first response?",
                            options: [
                                { value: "narrow", label: "Narrow scope, reproduce, and collect evidence before additional edits" },
                                { value: "guess", label: "Apply multiple untracked changes quickly" },
                            ],
                            expectedAnswer: "narrow",
                        },
                    ],
                },
            ],
            postExplanation: `
                <h4>I can now...</h4>
                <ul>
                    <li>Explain this lesson's core concept clearly to another developer.</li>
                    <li>Read related project code and identify where this concept appears.</li>
                    <li>Implement a small change with a concrete validation plan.</li>
                    <li>Debug issues using a hypothesis-driven process instead of guesswork.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "What does console.table() do?",
            options: [
                { value: "a", label: "Displays data as a formatted table" },
                { value: "b", label: "Creates an HTML table" },
                { value: "c", label: "Saves data to a file" },
            ],
            correctAnswer: "a",
            explanation:
                "console.table() displays arrays and objects as a nicely formatted table in the console, making data much easier to read.",
        },
        {
            id: "q2",
            question: "How do you set a breakpoint?",
            options: [
                { value: "a", label: "Click the line number in Sources tab" },
                { value: "b", label: "Type 'stop' in the console" },
                { value: "c", label: "Right-click the page" },
            ],
            correctAnswer: "a",
            explanation:
                "Click any line number in the Sources tab to set a breakpoint. You can also add 'debugger;' in your code.",
        },
        {
            id: "q3",
            question: "What's the Network tab used for?",
            options: [
                { value: "a", label: "Editing CSS" },
                { value: "b", label: "Seeing API requests and responses" },
                { value: "c", label: "Writing JavaScript" },
            ],
            correctAnswer: "b",
            explanation:
                "The Network tab shows all HTTP requests - API calls, images, scripts. Essential for debugging fetch/API issues.",
        },
        {
            id: "q4",
            question: "What should you do first when debugging?",
            options: [
                { value: "a", label: "Start changing code" },
                { value: "b", label: "Reproduce the bug" },
                { value: "c", label: "Ask someone else" },
            ],
            correctAnswer: "b",
            explanation:
                "Always reproduce the bug first. If you can't make it happen consistently, you can't verify your fix works.",
        },
        {
            id: "q5",
            question: "Which is the best first step when code does not work as expected?",
            options: [
                { value: "a", label: "Guess and change many things" },
                { value: "b", label: "Reproduce the issue and inspect inputs/output" },
                { value: "c", label: "Delete the whole function" },
            ],
            correctAnswer: "b",
            explanation: "A reliable debugging flow starts by reproducing the problem and checking what data is actually flowing through the code.",
        },
        {
            id: "q6",
            question: "Why are clear variable and function names important?",
            options: [
                { value: "a", label: "They make code easier to read and maintain" },
                { value: "b", label: "They make JavaScript run faster automatically" },
                { value: "c", label: "They remove the need for testing" },
            ],
            correctAnswer: "a",
            explanation: "Readable naming improves collaboration, reduces mistakes, and makes future edits safer.",
        },
        {
            id: "q7",
            question: "What should you do before choosing a complex solution?",
            options: [
                { value: "a", label: "Start with the simplest working approach" },
                { value: "b", label: "Use advanced patterns immediately" },
                { value: "c", label: "Copy code without understanding it" },
            ],
            correctAnswer: "a",
            explanation: "Simple solutions are easier to test, debug, and extend. Complexity should be added only when necessary.",
        },
        {
            id: "q8",
            question: "Which habit best prevents regressions after code changes?",
            options: [
                { value: "a", label: "Run relevant tests or verify key scenarios" },
                { value: "b", label: "Skip validation to save time" },
                { value: "c", label: "Only check visual output" },
            ],
            correctAnswer: "a",
            explanation: "Quick validation of critical paths catches breakages early and keeps the codebase stable.",
        },
        {
            id: "q9",
            question: "When using async code, what is a common reliability practice?",
            options: [
                { value: "a", label: "Handle success and failure paths explicitly" },
                { value: "b", label: "Ignore errors and continue" },
                { value: "c", label: "Assume all network calls always succeed" },
            ],
            correctAnswer: "a",
            explanation: "Async operations can fail; handling errors explicitly prevents silent failures and confusing behavior.",
        },
        {
            id: "q10",
            question: "What makes a mini quiz comprehensive for a coding guide?",
            options: [
                { value: "a", label: "It checks only definitions" },
                { value: "b", label: "It checks concepts, usage, and common mistakes" },
                { value: "c", label: "It contains trick questions only" },
            ],
            correctAnswer: "b",
            explanation: "Comprehensive checks include understanding, practical use, and error recognition, not just memorized terms.",
        },
        {
            id: "q11",
            question: "Best tool for debugging failed API calls:",
            options: [
                { value: "a", label: "Network tab to inspect request/response and status" },
                { value: "b", label: "Only console.log" },
                { value: "c", label: "Application tab" },
            ],
            correctAnswer: "a",
            explanation: "Network tab shows request payload, response body, status codes, and headers—essential for API debugging.",
        },
        {
            id: "q12",
            question: "When stepping through code, Step Over (F10) vs Step Into (F11):",
            options: [
                { value: "a", label: "Step Over skips into functions; Step Into executes line only" },
                { value: "b", label: "Step Over executes line, skips functions; Step Into goes into function" },
                { value: "c", label: "They do the same thing" },
            ],
            correctAnswer: "b",
            explanation: "Step Over runs the current line without entering functions; Step Into enters function calls.",
        },
    ],
};
