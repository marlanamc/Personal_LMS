import type { InteractiveGuideContent } from "@/types/activity";

export const codingAsyncPromisesContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Async/Await & Promises: Handling Delayed Operations",
            icon: "⏳",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">In real programming, some operations take time: fetching data from the internet, reading files, database queries. Promises and async/await let you handle these gracefully without freezing your app!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Modern web applications rely on asynchronous operations. Understanding how to handle them is essential for building responsive apps.</p>
            `,
            tipBox: {
                title: "Companion Guide",
                content:
                    "Use this guide for async flow and promise patterns. Pair it with Error Handling to practice resilient try/catch + recovery strategies in real async code.",
            },
            exercises: [
                {
                    id: "cap-intro-1",
                    title: "Quick Check: Async Basics",
                    instructions: "What is asynchronous code?",
                    items: [
                        {
                            type: "radio",
                            label: "What is asynchronous code?",
                            options: [
                                { value: "right", label: "Code that runs and finishes later, not immediately" },
                                { value: "wrong", label: "Code that runs in a different language" },
                            ],
                            expectedAnswer: "right",
                        },
                        {
                            type: "radio",
                            label: "Why do we need async?",
                            options: [
                                { value: "right", label: "To prevent waiting from freezing the app" },
                                { value: "wrong", label: "To make code run faster" },
                            ],
                            expectedAnswer: "right",
                        },
                    ],
                },
            ],
        },

        // Synchronous vs Asynchronous
        {
            id: "sync-vs-async",
            stepNumber: 1,
            title: "Synchronous vs Asynchronous",
            icon: "🔀",
            explanation: `
                <h3>The Difference</h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.5rem; border-radius: 0.75rem; color: #1f2937;">
                        <h4 style="margin-top: 0; color: #7a2a2a;">⏹️ Synchronous</h4>
                        <p style="margin: 0.5rem 0; font-size: 1rem; color: #2f2f2f;"><strong>Blocking:</strong> Wait for each step</p>
                        <div style="background: rgba(255,255,255,0.9); padding: 1rem; border-radius: 0.5rem; margin: 0.75rem 0;">
                            <div style="display: flex; align-items: center; margin: 0.5rem 0;">
                                <div class="diagram-surface-dark" style="background: #ff6b6b; color: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: bold;">Step 1</div>
                                <div style="flex: 1; height: 2px; background: #ff6b6b; margin: 0 0.5rem;"></div>
                                <div class="diagram-surface-light" style="font-size: 0.85rem; color: #1f2937;">5 seconds ⏳</div>
                            </div>
                            <div style="display: flex; align-items: center; margin: 0.5rem 0;">
                                <div class="diagram-surface-dark" style="background: #ff6b6b; color: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: bold;">Step 2</div>
                                <div style="flex: 1; height: 2px; background: #ff6b6b; margin: 0 0.5rem;"></div>
                                <div class="diagram-surface-light" style="font-size: 0.85rem; color: #1f2937;">3 seconds ⏳</div>
                            </div>
                            <div style="display: flex; align-items: center; margin: 0.5rem 0;">
                                <div class="diagram-surface-dark" style="background: #ff6b6b; color: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: bold;">Step 3</div>
                                <div style="flex: 1; height: 2px; background: #ff6b6b; margin: 0 0.5rem;"></div>
                                <div class="diagram-surface-light" style="font-size: 0.85rem; color: #1f2937;">2 seconds ⏳</div>
                            </div>
                            <div style="border-top: 2px dashed #ff6b6b; padding-top: 0.75rem; margin-top: 0.75rem; text-align: center; font-weight: bold; color: #8a3b2f;">⏱️ Total: 10 seconds</div>
                        </div>
                        <p style="margin: 0.5rem 0; font-size: 0.95rem; color: #8a3b2f;">❌ App freezes while waiting!</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.5rem; border-radius: 0.75rem; color: #1f2937;">
                        <h4 style="margin-top: 0; color: #004ea8;">⚡ Asynchronous</h4>
                        <p style="margin: 0.5rem 0; font-size: 1rem; color: #1f2937;"><strong>Non-blocking:</strong> Start and continue</p>
                        <div style="background: rgba(255,255,255,0.9); padding: 1rem; border-radius: 0.5rem; margin: 0.75rem 0;">
                            <div style="display: flex; align-items: center; margin: 0.5rem 0;">
                                <div class="diagram-surface-dark" style="background: #0080ff; color: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: bold;">Step 1</div>
                                <div style="flex: 1; height: 2px; background: #0080ff; margin: 0 0.5rem;"></div>
                                <div class="diagram-surface-light" style="font-size: 0.85rem; color: #1f2937;">→ starts</div>
                            </div>
                            <div style="display: flex; align-items: center; margin: 0.5rem 0;">
                                <div class="diagram-surface-dark" style="background: #0080ff; color: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: bold;">Step 2</div>
                                <div style="flex: 1; height: 2px; background: #0080ff; margin: 0 0.5rem;"></div>
                                <div class="diagram-surface-light" style="font-size: 0.85rem; color: #1f2937;">→ starts</div>
                            </div>
                            <div style="display: flex; align-items: center; margin: 0.5rem 0;">
                                <div class="diagram-surface-dark" style="background: #0080ff; color: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: bold;">Step 3</div>
                                <div style="flex: 1; height: 2px; background: #0080ff; margin: 0 0.5rem;"></div>
                                <div class="diagram-surface-light" style="font-size: 0.85rem; color: #1f2937;">→ starts</div>
                            </div>
                            <div style="border-top: 2px dashed #0080ff; padding-top: 0.75rem; margin-top: 0.75rem; text-align: center; font-weight: bold; color: #0057c2;">⏱️ Total: 5 seconds (parallel!)</div>
                        </div>
                        <p style="margin: 0.5rem 0; font-size: 0.95rem; color: #0057c2;">✅ App keeps working!</p>
                    </div>
                </div>

                <p style="margin: 1.5rem 0 0 0;"><strong>Synchronous:</strong> Each line waits for the previous one. Code runs line-by-line, waiting for each operation to finish.</p>
                <p><strong>Asynchronous:</strong> Code continues without waiting. Callbacks or promises handle results later.</p>
            `,
            usageMeanings: [
                {
                    title: "📌 Synchronous Code",
                    description: "Blocking - waits for each operation",
                    examples: [
                        {
                            sentence: `console.log('Start');
const result = fetchData(); // Waits here!
console.log('Data:', result);
console.log('Done');`,
                            explanation:
                                "If fetchData takes 5 seconds, everything waits. App freezes!",
                        },
                        {
                            sentence: `// Real world example:
const fileContent = readFileSync('large-file.txt');
console.log(fileContent);`,
                            explanation:
                                "Sync file reading blocks everything else.",
                        },
                    ],
                },
                {
                    title: "⚡ Asynchronous Code",
                    description: "Non-blocking - continues while waiting",
                    examples: [
                        {
                            sentence: `console.log('Start');
fetchData().then(result => {
  console.log('Data:', result);
});
console.log('Done'); // Runs immediately!`,
                            explanation:
                                "Don't wait. Continue with the next thing. Handle the result later.",
                        },
                        {
                            sentence: `// Modern async/await:
console.log('Start');
const result = await fetchData();
console.log('Data:', result);
console.log('Done');`,
                            explanation:
                                "Looks sync, works async. Much cleaner!",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cap-sync-1",
                    title: "Sync vs Async",
                    instructions: "Which approach is better for network requests?",
                    items: [
                        {
                            type: "radio",
                            label: "For fetching data from a server:",
                            options: [
                                { value: "sync", label: "Synchronous - wait for data" },
                                { value: "async", label: "Asynchronous - don't freeze the app" },
                            ],
                            expectedAnswer: "async",
                        },
                    ],
                },
            ],
        },

        // Promises
        {
            id: "promises",
            stepNumber: 2,
            title: "Promises: Handle Async Operations",
            icon: "📦",
            explanation: `
                <h3>What is a Promise?</h3>
                <p>A Promise represents something that will happen eventually: success (resolve) or failure (reject).</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: white;">
                    <h4 style="margin: 0 0 1.5rem 0; text-align: center; font-size: 1.1rem;">Promise Lifecycle</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="text-align: center; flex: 1;">
                            <div style="background: rgba(255,255,255,0.3); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 2rem;">⏳</div>
                            <h5 style="margin: 0.75rem 0 0 0;">Pending</h5>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">Operation in progress</p>
                        </div>
                        <div style="flex: 1; height: 2px; background: rgba(255,255,255,0.5); margin: 2rem 1rem;"></div>
                        <div style="text-align: center; flex: 1;">
                            <div style="background: rgba(76, 175, 80, 0.8); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 2rem;">✅</div>
                            <h5 style="margin: 0.75rem 0 0 0;">Resolved</h5>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">Success! Got result</p>
                        </div>
                        <div style="flex: 1; height: 2px; background: rgba(255,255,255,0.5); margin: 2rem 1rem;"></div>
                        <div style="text-align: center; flex: 1;">
                            <div style="background: rgba(244, 67, 54, 0.8); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 2rem;">❌</div>
                            <h5 style="margin: 0.75rem 0 0 0;">Rejected</h5>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">Failed! Got error</p>
                        </div>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Promise States",
                    description: "A promise has three states",
                    examples: [
                        {
                            sentence: `// Pending: Operation hasn't finished yet
// Resolved: Operation succeeded, we have the result
// Rejected: Operation failed, we have an error`,
                            explanation:
                                "A promise starts pending, then becomes resolved or rejected.",
                        },
                    ],
                },
                {
                    title: "Creating a Promise",
                    description: "Wrap an async operation",
                    examples: [
                        {
                            sentence: `const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});`,
                            explanation:
                                "new Promise takes a function with resolve and reject callbacks.",
                        },
                        {
                            sentence: `const myPromise = new Promise((resolve, reject) => {
  if (Math.random() > 0.5) {
    resolve('Lucky!');
  } else {
    reject('Unlucky!');
  }
});`,
                            explanation: "Call resolve() for success, reject() for failure.",
                        },
                    ],
                },
                {
                    title: ".then() to Handle Success",
                    description: "What to do when the promise resolves",
                    examples: [
                        {
                            sentence: `myPromise.then(result => {
  console.log('Result:', result);
});`,
                            explanation:
                                "then() gets called when the promise resolves.",
                        },
                        {
                            sentence: `fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data));`,
                            explanation:
                                "Chain .then() calls for multiple steps.",
                        },
                    ],
                },
                {
                    title: ".catch() to Handle Errors",
                    description: "What to do when the promise rejects",
                    examples: [
                        {
                            sentence: `myPromise
  .then(result => console.log(result))
  .catch(error => console.log('Error:', error));`,
                            explanation:
                                "catch() handles rejections/errors.",
                        },
                        {
                            sentence: `fetch('/api/users')
  .then(response => response.json())
  .catch(error => console.log('Failed to fetch'));`,
                            explanation:
                                "Always add catch() for robustness.",
                        },
                    ],
                },
                {
                    title: ".finally() for Cleanup",
                    description: "Code to run whether success or failure",
                    examples: [
                        {
                            sentence: `myPromise
  .then(result => console.log(result))
  .catch(error => console.log(error))
  .finally(() => console.log('Done'));`,
                            explanation:
                                "finally() runs regardless of outcome. Good for cleanup.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cap-promise-1",
                    title: "Promise Structure",
                    instructions: "What methods would you use?",
                    items: [
                        {
                            type: "radio",
                            label: "Handle successful result from a promise:",
                            options: [
                                { value: "a", label: ".then()" },
                                { value: "b", label: ".catch()" },
                                { value: "c", label: ".finally()" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Handle an error from a promise:",
                            options: [
                                { value: "a", label: ".then()" },
                                { value: "b", label: ".catch()" },
                                { value: "c", label: ".finally()" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "cap-promise-2",
                    title: "Promise Chaining",
                    instructions: "What will be logged?",
                    items: [
                        {
                            type: "text",
                            label: `Promise.resolve(5)
  .then(x => x * 2)
  .then(x => console.log(x));`,
                            correctAnswer: "10",
                            expectedAnswers: ["10"],
                        },
                    ],
                },
            ],
        },

        // Async/Await
        {
            id: "async-await",
            stepNumber: 3,
            title: "Async/Await: Modern Promise Syntax",
            icon: "🚀",
            explanation: `
                <h3>Easier Than Promises</h3>
                <p>async/await makes asynchronous code look synchronous and read more naturally.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.5rem; border-radius: 0.75rem; color: #1f2937;">
                        <h4 style="margin-top: 0; color: #d97757;">Promise Style</h4>
                        <code style="display: block; background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem; line-height: 1.6; color: #1f2937;">fetch('/data')<br/>&nbsp;&nbsp;.then(r =&gt; r.json())<br/>&nbsp;&nbsp;.then(d =&gt; console.log(d))<br/>&nbsp;&nbsp;.catch(e =&gt; console.log(e))</code>
                        <p style="margin: 0.75rem 0 0 0; font-size: 0.85rem; color: #d97757;">📌 More verbose, harder to read</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.5rem; border-radius: 0.75rem; color: #1f2937;">
                        <h4 style="margin-top: 0; color: #0080ff;">Async/Await Style</h4>
                        <code style="display: block; background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem; line-height: 1.6; color: #1f2937;">async function load() {<br/>&nbsp;&nbsp;try {<br/>&nbsp;&nbsp;&nbsp;&nbsp;const r = await fetch(…)<br/>&nbsp;&nbsp;&nbsp;&nbsp;const d = await r.json()<br/>&nbsp;&nbsp;&nbsp;&nbsp;console.log(d)<br/>&nbsp;&nbsp;} catch(e) {}<br/>}</code>
                        <p style="margin: 0.75rem 0 0 0; font-size: 0.85rem; color: #0080ff;">⭐ Cleaner, easier to follow</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "async Functions",
                    description: "A function that returns a promise",
                    examples: [
                        {
                            sentence: `async function getUser() {
  return { name: 'Alice' };
}`,
                            explanation:
                                "async function automatically returns a promise.",
                        },
                        {
                            sentence: `const result = await getUser();
// result = { name: 'Alice' }`,
                            explanation:
                                "await waits for the promise to resolve, then returns the value.",
                        },
                    ],
                },
                {
                    title: "await: Wait for Promise",
                    description: "Pause until promise resolves",
                    examples: [
                        {
                            sentence: `async function fetchUserData() {
  const response = await fetch('/api/user');
  const user = await response.json();
  return user;
}`,
                            explanation:
                                "Each await pauses until that promise resolves.",
                        },
                        {
                            sentence: `// Can only use await inside async function
const data = await fetch('/api/data'); // Error!

async function getData() {
  const data = await fetch('/api/data'); // OK!
}`,
                            explanation: "await only works inside async functions.",
                        },
                    ],
                },
                {
                    title: "Error Handling with Try/Catch",
                    description: "Catch errors from async operations",
                    examples: [
                        {
                            sentence: `async function fetchUser() {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.log('Error:', error.message);
  }
}`,
                            explanation:
                                "Use try/catch to handle promise rejections.",
                        },
                    ],
                },
                {
                    title: "Running Multiple Async Operations",
                    description: "Parallel vs Sequential",
                    examples: [
                        {
                            sentence: `// Sequential - slower
async function getData() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  return { user, posts };
}`,
                            explanation:
                                "Wait for user, then wait for posts. Could be faster in parallel!",
                        },
                        {
                            sentence: `// Parallel - faster!
async function getData() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
  return { user, posts };
}`,
                            explanation:
                                "Promise.all() waits for all promises together.",
                        },
                        {
                            sentence: `// Race to completion
const firstResult = await Promise.race([
  fetchUser(),
  fetchPosts()
]);`,
                            explanation: "Promise.race() returns whichever finishes first.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cap-async-1",
                    title: "Async/Await vs Promises",
                    instructions: "Which is cleaner?",
                    items: [
                        {
                            type: "radio",
                            label: "Which is easier to read?",
                            options: [
                                { value: "promise", label: "fetch().then().then().catch()" },
                                { value: "async", label: "async function with await" },
                            ],
                            expectedAnswer: "async",
                        },
                    ],
                },
                {
                    id: "cap-async-2",
                    title: "Try/Catch",
                    instructions: "What does this do?",
                    items: [
                        {
                            type: "text",
                            label: `Explain: try { ... } catch (e) { ... }`,
                            correctAnswer: "try catches any errors and catch handles them",
                            expectedAnswers: ["catches errors", "handles errors", "error handling"],
                        },
                    ],
                },
            ],
        },

        // Real-World Examples
        {
            id: "real-world",
            stepNumber: 4,
            title: "Real-World Async Examples",
            icon: "🌐",
            explanation: `
                <h3>Common Patterns</h3>
                <p>These patterns appear constantly in modern web development.</p>
            `,
            usageMeanings: [
                {
                    title: "Fetching Data from API",
                    description: "The most common async operation",
                    examples: [
                        {
                            sentence: `async function loadUsers() {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}`,
                            explanation:
                                "Classic pattern: fetch, parse JSON, handle errors.",
                        },
                    ],
                },
                {
                    title: "Waiting for Multiple Requests",
                    description: "Fetch multiple resources efficiently",
                    examples: [
                        {
                            sentence: `async function loadDashboard() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/comments').then(r => r.json())
    ]);
    return { users, posts, comments };
  } catch (error) {
    console.error('Dashboard load failed:', error);
  }
}`,
                            explanation:
                                "Load multiple resources in parallel.",
                        },
                    ],
                },
                {
                    title: "Delayed Operations",
                    description: "Pause and resume execution",
                    examples: [
                        {
                            sentence: `async function retryWithDelay() {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const data = await fetch('/api/data');
      return data;
    } catch (error) {
      attempts++;
      if (attempts < 3) {
        await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
      }
    }
  }
}`,
                            explanation:
                                "Retry failed requests with delays.",
                        },
                    ],
                },
                {
                    title: "Processing Arrays Asynchronously",
                    description: "Map, filter, reduce with async",
                    examples: [
                        {
                            sentence: `async function loadAllUsers(userIds) {
  const users = await Promise.all(
    userIds.map(id => fetch(\`/api/users/\${id}\`).then(r => r.json()))
  );
  return users;
}`,
                            explanation:
                                "Load multiple resources in parallel using map and Promise.all.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cap-realworld-1",
                    title: "Choose the Right Approach",
                    instructions: "Which would you use?",
                    items: [
                        {
                            type: "radio",
                            label: "Loading 3 independent API endpoints:",
                            options: [
                                { value: "sequential", label: "Sequential - wait for each" },
                                { value: "parallel", label: "Promise.all() - load in parallel" },
                            ],
                            expectedAnswer: "parallel",
                        },
                    ],
                },
            ],
        },

        // Common Mistakes
        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Async Mistakes",
            icon: "⚠️",
            explanation: `
                <h3>Watch Out For These!</h3>
                <p>Easy mistakes when working with async code.</p>
            `,
            usageMeanings: [
                {
                    title: "❌ Forgetting await",
                    description: "Returns promise instead of value",
                    examples: [
                        {
                            sentence: `❌ const data = fetch('/api/data');
// data is a Promise, not the actual data!

✓ const data = await fetch('/api/data');
// data is the actual response`,
                            explanation:
                                "WRONG: Forget await, get a promise. CORRECT: Use await for the value.",
                        },
                    ],
                },
                {
                    title: "❌ Using await Outside async",
                    description: "await only works in async functions",
                    examples: [
                        {
                            sentence: `❌ const data = await fetch('/api/data');
// SyntaxError!

✓ async function getData() {
  const data = await fetch('/api/data');
}`,
                            explanation:
                                "WRONG: await outside async function. CORRECT: Wrap in async function.",
                        },
                    ],
                },
                {
                    title: "❌ Not Handling Errors",
                    description: "Silent failures are dangerous",
                    examples: [
                        {
                            sentence: `❌ async function getData() {
  const response = await fetch('/api/data');
  // What if request fails? No error handling!
}

✓ async function getData() {
  try {
    const response = await fetch('/api/data');
  } catch (error) {
    console.error('Failed:', error);
  }
}`,
                            explanation:
                                "WRONG: No error handling. CORRECT: Always use try/catch.",
                        },
                    ],
                },
                {
                    title: "❌ Sequential When Parallel Would Work",
                    description: "Slow when you could be fast",
                    examples: [
                        {
                            sentence: `❌ const user = await fetchUser();
const posts = await fetchPosts();
// Waits for user, THEN waits for posts - slow!

✓ const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts()
]);
// Both load at the same time - fast!`,
                            explanation:
                                "WRONG: Sequential is slow. CORRECT: Use Promise.all() for parallel.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cap-mistakes-1",
                    title: "Spot the Error",
                    instructions: "Which code is wrong?",
                    items: [
                        {
                            type: "radio",
                            label: `const data = fetch('/api/data');
console.log(data);`,
                            options: [
                                { value: "wrong", label: "Wrong - data is a promise" },
                                { value: "right", label: "Right" },
                            ],
                            expectedAnswer: "wrong",
                        },
                        {
                            type: "radio",
                            label: `function getData() {
  const data = await fetch('/api/data');
}`,
                            options: [
                                { value: "wrong", label: "Wrong - await outside async" },
                                { value: "right", label: "Right" },
                            ],
                            expectedAnswer: "wrong",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 6,
            title: "Async/Await Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Asynchronous:</strong> Operations that take time, don't freeze the app</li>
                    <li><strong>Promises:</strong> .then() for success, .catch() for errors</li>
                    <li><strong>async/await:</strong> Modern, cleaner promise syntax</li>
                    <li><strong>await:</strong> Only works inside async functions</li>
                    <li><strong>try/catch:</strong> Always handle errors in async code</li>
                    <li><strong>Promise.all():</strong> Run multiple operations in parallel</li>
                    <li><strong>Common operations:</strong> fetch API, file I/O, timers, database queries</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cap-summary-1",
                    title: "Mixed Review",
                    instructions: "Test your async knowledge.",
                    items: [
                        {
                            type: "radio",
                            label: "What does await do?",
                            options: [
                                { value: "a", label: "Pauses until promise resolves" },
                                { value: "b", label: "Runs code in background" },
                                { value: "c", label: "Returns a promise" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Where can you use await?",
                            options: [
                                { value: "a", label: "Anywhere in your code" },
                                { value: "b", label: "Only inside async functions" },
                                { value: "c", label: "Only with fetch()" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "For multiple independent requests, use:",
                            options: [
                                { value: "a", label: "Sequential await calls" },
                                { value: "b", label: "Promise.all()" },
                                { value: "c", label: "setTimeout()" },
                            ],
                            expectedAnswer: "b",
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
                    id: "ap-cadence-concept",
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
                    id: "ap-cadence-read",
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
                    id: "ap-cadence-write",
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
                    id: "ap-cadence-debug",
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
            question: "What does async/await do?",
            options: [
                { value: "a", label: "Makes async code look synchronous" },
                { value: "b", label: "Makes code run faster" },
                { value: "c", label: "Prevents errors" },
            ],
            correctAnswer: "a",
            explanation:
                "async/await is syntactic sugar that makes promises more readable and easier to work with.",
        },
        {
            id: "q2",
            question: "Can you use await outside an async function?",
            options: [
                { value: "a", label: "Yes, anywhere" },
                { value: "b", label: "No, only inside async functions" },
                { value: "c", label: "Only if you import a library" },
            ],
            correctAnswer: "b",
            explanation: "await only works inside async functions. It's a syntax error otherwise.",
        },
        {
            id: "q3",
            question: "What does Promise.all() do?",
            options: [
                { value: "a", label: "Runs promises one after another" },
                { value: "b", label: "Runs promises in parallel, waits for all" },
                { value: "c", label: "Returns the first promise result" },
            ],
            correctAnswer: "b",
            explanation: "Promise.all() runs multiple promises in parallel and waits for all to finish.",
        },
        {
            id: "q4",
            question: "What should you use to handle async errors?",
            options: [
                { value: "a", label: "if/else statements" },
                { value: "b", label: ".catch() method" },
                { value: "c", label: "try/catch blocks (in async/await)" },
            ],
            correctAnswer: "c",
            explanation:
                "With async/await, use try/catch to handle errors. With promises, use .catch().",
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
