import type { InteractiveGuideContent } from "@/types/activity";

export const codingErrorHandlingContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Error Handling: Write Resilient Code",
            icon: "🛡️",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Errors are inevitable in programming. The difference between amateur and professional code is how gracefully it handles things going wrong!</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul>
                    <li>try/catch/finally syntax</li>
                    <li>Different error types in JavaScript</li>
                    <li>Throwing custom errors</li>
                    <li>Error handling in async code</li>
                    <li>Best practices for robust applications</li>
                </ul>
            `,
            tipBox: {
                title: "Companion Guide",
                content:
                    "Use this guide for defensive coding patterns. Pair it with Async/Await & Promises to handle rejected promises and failed network calls cleanly.",
            },
            exercises: [
                {
                    id: "ceh-intro-1",
                    title: "Why Handle Errors?",
                    instructions: "What happens when an error isn't caught?",
                    items: [
                        {
                            type: "radio",
                            label: "Uncaught errors:",
                            options: [
                                { value: "crash", label: "Crash the program/stop execution" },
                                { value: "ignore", label: "Are silently ignored" },
                            ],
                            expectedAnswer: "crash",
                        },
                    ],
                },
            ],
        },

        // try/catch/finally
        {
            id: "try-catch-finally",
            stepNumber: 1,
            title: "try/catch/finally",
            icon: "🎯",
            explanation: `
                <h3>The Error Handling Trio</h3>
                <p>Wrap risky code in try/catch to prevent crashes and handle problems gracefully.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.95rem; line-height: 1.6;">
try {
    // Code that might throw an error
    riskyOperation();
} catch (error) {
    // Handle the error
    console.error('Something went wrong:', error.message);
} finally {
    // Always runs (optional)
    cleanup();
}</pre>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #22c55e;">try</h4>
                        <p style="margin: 0; font-size: 0.9rem;">Code that might fail</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #ef4444;">catch</h4>
                        <p style="margin: 0; font-size: 0.9rem;">Runs if error occurs</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(99, 102, 241, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6366f1;">finally</h4>
                        <p style="margin: 0; font-size: 0.9rem;">Always runs (cleanup)</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🎣 Catching Errors",
                    description: "The error object gives you details about what went wrong",
                    examples: [
                        {
                            sentence: "catch (error) { console.log(error.message); }",
                            explanation: "error.message gives a human-readable description.",
                        },
                        {
                            sentence: "catch (error) { console.log(error.name); }",
                            explanation: "error.name tells you the error type (TypeError, ReferenceError, etc.).",
                        },
                        {
                            sentence: "catch (error) { console.log(error.stack); }",
                            explanation: "error.stack shows where the error occurred (for debugging).",
                        },
                    ],
                },
                {
                    title: "🧹 finally Block",
                    description: "Runs whether or not an error occurred - perfect for cleanup",
                    examples: [
                        {
                            sentence: "finally { connection.close(); }",
                            explanation: "Always close connections, even if something failed.",
                        },
                        {
                            sentence: "finally { setLoading(false); }",
                            explanation: "Reset loading state regardless of success/failure.",
                        },
                        {
                            sentence: "finally { clearTimeout(timer); }",
                            explanation: "Clean up timers to prevent memory leaks.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ceh-trycatch-1",
                    title: "try/catch Understanding",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "When does the catch block run?",
                            options: [
                                { value: "error", label: "Only when an error occurs" },
                                { value: "always", label: "Always" },
                            ],
                            expectedAnswer: "error",
                        },
                        {
                            type: "radio",
                            label: "When does the finally block run?",
                            options: [
                                { value: "error", label: "Only when an error occurs" },
                                { value: "always", label: "Always, error or not" },
                            ],
                            expectedAnswer: "always",
                        },
                    ],
                },
            ],
        },

        // Error Types
        {
            id: "error-types",
            stepNumber: 2,
            title: "JavaScript Error Types",
            icon: "📋",
            explanation: `
                <h3>Know Your Errors</h3>
                <p>JavaScript has built-in error types that tell you what kind of problem occurred.</p>
            `,
            verbTable: {
                title: "Common Error Types",
                headers: ["Error Type", "When It Occurs", "Example"],
                rows: [
                    ["SyntaxError", "Invalid code syntax", "const x = ; (missing value)"],
                    ["ReferenceError", "Using undefined variable", "console.log(undefinedVar)"],
                    ["TypeError", "Wrong type for operation", "null.toString()"],
                    ["RangeError", "Value out of range", "new Array(-1)"],
                    ["URIError", "Invalid URI function use", "decodeURI('%')"],
                    ["Error", "Generic error", "throw new Error('Oops')"],
                ],
            },
            usageMeanings: [
                {
                    title: "🔍 TypeError",
                    description: "Most common - wrong type for an operation",
                    examples: [
                        {
                            sentence: "null.toString() // Cannot read properties of null",
                            explanation: "Trying to call a method on null.",
                        },
                        {
                            sentence: "undefined.map() // undefined is not a function",
                            explanation: "Calling a method on undefined.",
                        },
                        {
                            sentence: "'hello'.push('!') // push is not a function",
                            explanation: "Strings don't have push (arrays do).",
                        },
                    ],
                },
                {
                    title: "🔗 ReferenceError",
                    description: "Variable doesn't exist",
                    examples: [
                        {
                            sentence: "console.log(notDefined) // notDefined is not defined",
                            explanation: "Using a variable that was never declared.",
                        },
                        {
                            sentence: "Use before declaration with let/const",
                            explanation: "Accessing let/const before initialization.",
                        },
                    ],
                },
                {
                    title: "✏️ SyntaxError",
                    description: "Code structure is invalid",
                    examples: [
                        {
                            sentence: "const x = // Missing value",
                            explanation: "Incomplete statement.",
                        },
                        {
                            sentence: "if (true { } // Missing )",
                            explanation: "Mismatched brackets.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ceh-types-1",
                    title: "Identify the Error Type",
                    instructions: "What error type would this cause?",
                    items: [
                        {
                            type: "select",
                            label: "null.length",
                            options: ["TypeError", "ReferenceError", "SyntaxError"],
                            expectedAnswer: "TypeError",
                        },
                        {
                            type: "select",
                            label: "console.log(undeclaredVariable)",
                            options: ["TypeError", "ReferenceError", "SyntaxError"],
                            expectedAnswer: "ReferenceError",
                        },
                    ],
                },
            ],
        },

        // Throwing Errors
        {
            id: "throwing-errors",
            stepNumber: 3,
            title: "Throwing Custom Errors",
            icon: "🎪",
            explanation: `
                <h3>Create Your Own Errors</h3>
                <p>Use <code>throw</code> to create errors when something is wrong in your code's logic.</p>

                <div class="diagram-surface-light" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: #1f2937;">
                    <h4 style="margin-top: 0; color: #d97757;">Syntax</h4>
                    <code style="display: block; background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 0.5rem; font-size: 1rem;">
throw new Error('Something went wrong');
                    </code>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🚀 Basic throw",
                    description: "Stop execution and signal an error",
                    examples: [
                        {
                            sentence: "throw new Error('Invalid input');",
                            explanation: "Create and throw a new Error with a message.",
                        },
                        {
                            sentence: "throw new TypeError('Expected a number');",
                            explanation: "Use specific error types for clarity.",
                        },
                    ],
                },
                {
                    title: "✅ Validation Pattern",
                    description: "Throw errors for invalid inputs",
                    examples: [
                        {
                            sentence: "if (!email.includes('@')) throw new Error('Invalid email');",
                            explanation: "Validate input and throw if invalid.",
                        },
                        {
                            sentence: "if (age < 0) throw new RangeError('Age cannot be negative');",
                            explanation: "Use RangeError for out-of-bounds values.",
                        },
                        {
                            sentence: "if (typeof value !== 'number') throw new TypeError('Expected number');",
                            explanation: "Use TypeError for wrong types.",
                        },
                    ],
                },
                {
                    title: "🏗️ Custom Error Classes",
                    description: "Create specific error types for your app",
                    examples: [
                        {
                            sentence: "class ValidationError extends Error { constructor(msg) { super(msg); this.name = 'ValidationError'; } }",
                            explanation: "Extend Error to create custom types.",
                        },
                        {
                            sentence: "throw new ValidationError('Email is required');",
                            explanation: "Use your custom error class.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ceh-throw-1",
                    title: "Throwing Practice",
                    instructions: "Complete the validation:",
                    items: [
                        {
                            type: "radio",
                            label: "To throw an error, use:",
                            options: [
                                { value: "throw", label: "throw new Error('message')" },
                                { value: "return", label: "return Error('message')" },
                            ],
                            expectedAnswer: "throw",
                        },
                        {
                            type: "radio",
                            label: "What keyword stops execution and signals an error?",
                            options: [
                                { value: "throw", label: "throw" },
                                { value: "catch", label: "catch" },
                            ],
                            expectedAnswer: "throw",
                        },
                    ],
                },
            ],
        },

        // Async Error Handling
        {
            id: "async-errors",
            stepNumber: 4,
            title: "Errors in Async Code",
            icon: "⚡",
            explanation: `
                <h3>Async Error Handling</h3>
                <p>Async code needs special handling. Use try/catch with async/await!</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: rgba(239, 68, 68, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #ef4444;">❌ Won't Catch</h4>
                        <pre style="margin: 0; font-size: 0.85rem; color: #1f2937;">
try {
  fetchData(); // Returns promise
} catch (e) {
  // Never runs!
}</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(34, 197, 94, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
                        <h4 style="margin-top: 0; color: #22c55e;">✅ Will Catch</h4>
                        <pre style="margin: 0; font-size: 0.85rem; color: #1f2937;">
try {
  await fetchData();
} catch (e) {
  // Catches errors!
}</pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔄 async/await with try/catch",
                    description: "The cleanest way to handle async errors",
                    examples: [
                        {
                            sentence: "async function load() { try { const data = await fetch(url); } catch (e) { handleError(e); } }",
                            explanation: "Wrap await calls in try/catch.",
                        },
                        {
                            sentence: "const data = await fetch(url).catch(e => null);",
                            explanation: "Alternative: catch on the promise itself.",
                        },
                    ],
                },
                {
                    title: "⛓️ Promise .catch()",
                    description: "Handle errors in promise chains",
                    examples: [
                        {
                            sentence: "fetch(url).then(res => res.json()).catch(e => console.error(e))",
                            explanation: ".catch() handles any error in the chain.",
                        },
                        {
                            sentence: "promise.then(onSuccess, onError)",
                            explanation: "Second argument to .then() catches errors.",
                        },
                    ],
                },
                {
                    title: "🌐 Fetch Error Pattern",
                    description: "Common pattern for API calls",
                    examples: [
                        {
                            sentence: "if (!response.ok) throw new Error(`HTTP ${response.status}`);",
                            explanation: "fetch() doesn't throw on HTTP errors - check manually!",
                        },
                        {
                            sentence: "const data = await response.json().catch(() => null);",
                            explanation: "Handle JSON parse errors separately.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "⚠️ fetch() Gotcha",
                content:
                    "fetch() only throws on network errors, NOT HTTP errors (404, 500). Always check response.ok!",
            },
            exercises: [
                {
                    id: "ceh-async-1",
                    title: "Async Error Handling",
                    instructions: "Choose the correct approach:",
                    items: [
                        {
                            type: "radio",
                            label: "To catch errors from await, you need:",
                            options: [
                                { value: "try", label: "try/catch around the await" },
                                { value: "if", label: "if/else after the await" },
                            ],
                            expectedAnswer: "try",
                        },
                        {
                            type: "radio",
                            label: "fetch() throws an error when:",
                            options: [
                                { value: "network", label: "Network failure (no internet)" },
                                { value: "404", label: "Server returns 404" },
                            ],
                            expectedAnswer: "network",
                        },
                    ],
                },
            ],
        },

        // Error Handling Patterns
        {
            id: "error-patterns",
            stepNumber: 5,
            title: "Common Error Patterns",
            icon: "🎨",
            explanation: `
                <h3>Real-World Patterns</h3>
                <p>These patterns are used in production code everywhere.</p>
            `,
            usageMeanings: [
                {
                    title: "🔁 Retry Pattern",
                    description: "Try again on failure",
                    examples: [
                        {
                            sentence: "async function fetchWithRetry(url, retries = 3) { for (let i = 0; i < retries; i++) { try { return await fetch(url); } catch { await delay(1000); } } throw new Error('All retries failed'); }",
                            explanation: "Retry a few times before giving up.",
                        },
                    ],
                },
                {
                    title: "🎭 Graceful Degradation",
                    description: "Provide fallback when something fails",
                    examples: [
                        {
                            sentence: "const data = await fetchData().catch(() => defaultData);",
                            explanation: "Use default data if fetch fails.",
                        },
                        {
                            sentence: "const parsed = JSON.parse(str).catch(() => ({}));",
                            explanation: "Return empty object if parsing fails.",
                        },
                    ],
                },
                {
                    title: "📊 Error Boundaries (React)",
                    description: "Catch errors in component trees",
                    examples: [
                        {
                            sentence: "<ErrorBoundary fallback={<ErrorPage />}><App /></ErrorBoundary>",
                            explanation: "Wrap components to catch render errors.",
                        },
                    ],
                },
                {
                    title: "📝 Error Logging",
                    description: "Always log errors for debugging",
                    examples: [
                        {
                            sentence: "catch (error) { console.error('API Error:', error); logToService(error); }",
                            explanation: "Log locally and to a service.",
                        },
                        {
                            sentence: "catch (error) { Sentry.captureException(error); }",
                            explanation: "Send to error tracking service.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ceh-patterns-1",
                    title: "Pattern Recognition",
                    instructions: "Which pattern is being used?",
                    items: [
                        {
                            type: "select",
                            label: "fetchData().catch(() => defaultValue)",
                            options: ["Retry", "Graceful Degradation", "Logging"],
                            expectedAnswer: "Graceful Degradation",
                        },
                        {
                            type: "select",
                            label: "for (let i = 0; i < 3; i++) { try { return await fetch(); } catch {} }",
                            options: ["Retry", "Graceful Degradation", "Logging"],
                            expectedAnswer: "Retry",
                        },
                    ],
                },
            ],
        },

        // Console Methods
        {
            id: "console-methods",
            stepNumber: 6,
            title: "Debugging with Console",
            icon: "🔧",
            explanation: `
                <h3>Beyond console.log()</h3>
                <p>The console object has many useful methods for debugging!</p>
            `,
            verbTable: {
                title: "Console Methods",
                headers: ["Method", "Purpose", "Example"],
                rows: [
                    ["console.log()", "General output", "console.log('value:', x)"],
                    ["console.error()", "Error messages (red)", "console.error('Failed!')"],
                    ["console.warn()", "Warnings (yellow)", "console.warn('Deprecated')"],
                    ["console.table()", "Display arrays/objects", "console.table(users)"],
                    ["console.group()", "Group related logs", "console.group('API')"],
                    ["console.time()", "Measure performance", "console.time('fetch')"],
                    ["console.trace()", "Show call stack", "console.trace()"],
                ],
            },
            usageMeanings: [
                {
                    title: "🎨 console.error() / console.warn()",
                    description: "Styled output for different severity levels",
                    examples: [
                        {
                            sentence: "console.error('Critical failure:', error);",
                            explanation: "Shows in red, easy to spot in console.",
                        },
                        {
                            sentence: "console.warn('This API is deprecated');",
                            explanation: "Shows in yellow, indicates warnings.",
                        },
                    ],
                },
                {
                    title: "📊 console.table()",
                    description: "Display data in a nice table",
                    examples: [
                        {
                            sentence: "console.table([{name: 'Alice', age: 25}, {name: 'Bob', age: 30}]);",
                            explanation: "Shows array of objects as a table - much easier to read!",
                        },
                        {
                            sentence: "console.table(object, ['key1', 'key2']);",
                            explanation: "Show only specific columns.",
                        },
                    ],
                },
                {
                    title: "⏱️ console.time()",
                    description: "Measure how long something takes",
                    examples: [
                        {
                            sentence: "console.time('fetch'); await fetch(url); console.timeEnd('fetch');",
                            explanation: "Outputs: 'fetch: 234ms' - great for performance!",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ceh-console-1",
                    title: "Console Methods",
                    instructions: "Which method should you use?",
                    items: [
                        {
                            type: "select",
                            label: "Display an array of objects nicely",
                            options: ["console.log()", "console.table()", "console.error()"],
                            expectedAnswer: "console.table()",
                        },
                        {
                            type: "select",
                            label: "Log an error message",
                            options: ["console.log()", "console.warn()", "console.error()"],
                            expectedAnswer: "console.error()",
                        },
                    ],
                },
            ],
        },

        // Best Practices
        {
            id: "best-practices",
            stepNumber: 7,
            title: "Error Handling Best Practices",
            icon: "✨",
            explanation: `
                <h3>Professional Error Handling</h3>
                <p>Follow these practices to write robust, maintainable code.</p>
            `,
            usageMeanings: [
                {
                    title: "✅ DO",
                    description: "Best practices to follow",
                    examples: [
                        {
                            sentence: "Catch specific errors when possible",
                            explanation: "Handle different error types differently.",
                        },
                        {
                            sentence: "Always provide meaningful error messages",
                            explanation: "'Failed to load user profile' > 'Error'",
                        },
                        {
                            sentence: "Log errors for debugging",
                            explanation: "You can't fix what you can't see.",
                        },
                        {
                            sentence: "Clean up resources in finally",
                            explanation: "Close connections, reset state.",
                        },
                        {
                            sentence: "Show user-friendly error messages",
                            explanation: "Don't show raw error.stack to users!",
                        },
                    ],
                },
                {
                    title: "❌ DON'T",
                    description: "Anti-patterns to avoid",
                    examples: [
                        {
                            sentence: "catch (e) { } // Empty catch - swallows errors!",
                            explanation: "Silent failures are the worst to debug.",
                        },
                        {
                            sentence: "catch (e) { throw e; } // Pointless re-throw",
                            explanation: "If you're not handling it, don't catch it.",
                        },
                        {
                            sentence: "Showing raw error messages to users",
                            explanation: "Security risk and bad UX.",
                        },
                        {
                            sentence: "Using try/catch for control flow",
                            explanation: "Check conditions instead of catching expected errors.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Golden Rule",
                content:
                    "Handle errors at the level where you can do something useful about them. If you can't handle it, let it bubble up.",
            },
            exercises: [
                {
                    id: "ceh-best-1",
                    title: "Best Practice Quiz",
                    instructions: "Which is the better approach?",
                    items: [
                        {
                            type: "radio",
                            label: "Error handling approach:",
                            options: [
                                { value: "good", label: "catch (e) { console.error(e); showErrorUI(); }" },
                                { value: "bad", label: "catch (e) { }" },
                            ],
                            expectedAnswer: "good",
                        },
                        {
                            type: "radio",
                            label: "For user-facing errors:",
                            options: [
                                { value: "good", label: "Show friendly message, log detailed error" },
                                { value: "bad", label: "Show error.stack to the user" },
                            ],
                            expectedAnswer: "good",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "Error Handling Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>try/catch/finally</strong> - Catch errors, always clean up</li>
                    <li><strong>Error types</strong> - TypeError, ReferenceError, etc. tell you what went wrong</li>
                    <li><strong>throw</strong> - Create your own errors for validation</li>
                    <li><strong>async errors</strong> - Use try/catch with await, or .catch() with promises</li>
                    <li><strong>fetch() gotcha</strong> - Check response.ok, it doesn't throw on HTTP errors</li>
                    <li><strong>Console methods</strong> - console.error(), table(), time() for debugging</li>
                    <li><strong>Never swallow errors</strong> - Empty catch blocks are evil!</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ceh-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "Which block always runs?",
                            options: [
                                { value: "try", label: "try" },
                                { value: "catch", label: "catch" },
                                { value: "finally", label: "finally" },
                            ],
                            expectedAnswer: "finally",
                        },
                        {
                            type: "radio",
                            label: "What error occurs when accessing undefined.property?",
                            options: [
                                { value: "ref", label: "ReferenceError" },
                                { value: "type", label: "TypeError" },
                                { value: "syntax", label: "SyntaxError" },
                            ],
                            expectedAnswer: "type",
                        },
                        {
                            type: "radio",
                            label: "To throw a custom error, use:",
                            options: [
                                { value: "throw", label: "throw new Error('message')" },
                                { value: "return", label: "return new Error('message')" },
                                { value: "catch", label: "catch new Error('message')" },
                            ],
                            expectedAnswer: "throw",
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
                    id: "eh-cadence-concept",
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
                    id: "eh-cadence-read",
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
                    id: "eh-cadence-write",
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
                    id: "eh-cadence-debug",
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
            question: "What keyword do you use to create an error?",
            options: [
                { value: "a", label: "error" },
                { value: "b", label: "throw" },
                { value: "c", label: "catch" },
            ],
            correctAnswer: "b",
            explanation:
                "Use 'throw' to create and throw an error. Example: throw new Error('message')",
        },
        {
            id: "q2",
            question: "What happens in an empty catch block - catch(e) {}?",
            options: [
                { value: "a", label: "The error is fixed" },
                { value: "b", label: "The error is silently swallowed" },
                { value: "c", label: "The program crashes" },
            ],
            correctAnswer: "b",
            explanation:
                "Empty catch blocks swallow errors silently. This is an anti-pattern because you lose all information about what went wrong.",
        },
        {
            id: "q3",
            question: "Does fetch() throw an error for a 404 response?",
            options: [
                { value: "a", label: "Yes" },
                { value: "b", label: "No - you must check response.ok" },
                { value: "c", label: "Only with strict mode" },
            ],
            correctAnswer: "b",
            explanation:
                "fetch() only throws on network errors. For HTTP errors (404, 500), you need to check response.ok yourself.",
        },
        {
            id: "q4",
            question: "Which console method shows data as a table?",
            options: [
                { value: "a", label: "console.log()" },
                { value: "b", label: "console.table()" },
                { value: "c", label: "console.display()" },
            ],
            correctAnswer: "b",
            explanation:
                "console.table() displays arrays and objects in a nice table format, making it easier to read complex data.",
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
    ],
};
