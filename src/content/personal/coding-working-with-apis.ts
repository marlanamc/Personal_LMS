import type { InteractiveGuideContent } from "@/types/activity";

export const codingWorkingWithApisContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Working with APIs: Connect to the World",
            icon: "🌐",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">APIs let your code talk to servers and services. Fetch weather data, save user profiles, load products - it all happens through APIs!</p>
                </div>
                <p><strong>Professional note:</strong> Always handle non-2xx responses and network errors. In production, use retry/backoff for transient failures and surface clear errors to users—never assume the API will always succeed.</p>
                <h3>What You'll Learn</h3>
                <ul>
                    <li>What APIs are and how they work</li>
                    <li>The fetch() function</li>
                    <li>Working with JSON data</li>
                    <li>HTTP methods (GET, POST, PUT, DELETE)</li>
                    <li>Headers and authentication</li>
                    <li>Error handling best practices</li>
                </ul>
            `,
            tipBox: {
                title: "Companion Guide",
                content:
                    "Pair this with Debugging & Dev Tools. Most API problems are diagnosed in the Network tab first, then confirmed with console traces and breakpoints.",
            },
            exercises: [
                {
                    id: "cwa-intro-1",
                    title: "API Basics",
                    instructions: "What does API stand for?",
                    items: [
                        {
                            type: "radio",
                            label: "API means:",
                            options: [
                                { value: "correct", label: "Application Programming Interface" },
                                { value: "wrong", label: "Advanced Protocol Internet" },
                            ],
                            expectedAnswer: "correct",
                        },
                    ],
                },
            ],
        },

        // What is an API
        {
            id: "what-is-api",
            stepNumber: 1,
            title: "What is an API?",
            icon: "🔌",
            explanation: `
                <h3>APIs: How Apps Talk to Servers</h3>
                <p>An API is like a waiter in a restaurant - you tell it what you want, it goes to the kitchen (server), and brings back your food (data).</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0; text-align: center;">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <div>
                            <div style="font-size: 2rem;">💻</div>
                            <div>Your App</div>
                        </div>
                        <div style="font-size: 1.5rem;">→ Request →</div>
                        <div>
                            <div style="font-size: 2rem;">🔌</div>
                            <div>API</div>
                        </div>
                        <div style="font-size: 1.5rem;">→</div>
                        <div>
                            <div style="font-size: 2rem;">🖥️</div>
                            <div>Server</div>
                        </div>
                    </div>
                    <div style="margin-top: 1rem;">← Response (JSON data) ←</div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🌐 REST APIs",
                    description: "The most common API style",
                    examples: [
                        {
                            sentence: "GET /api/users - Get all users",
                            explanation: "URLs represent resources.",
                        },
                        {
                            sentence: "POST /api/users - Create a user",
                            explanation: "HTTP methods indicate the action.",
                        },
                        {
                            sentence: "GET /api/users/123 - Get user with ID 123",
                            explanation: "IDs in the URL for specific resources.",
                        },
                    ],
                },
                {
                    title: "📦 JSON",
                    description: "Data format for APIs",
                    examples: [
                        {
                            sentence: "{ \"name\": \"Alice\", \"age\": 25 }",
                            explanation: "JSON: JavaScript Object Notation.",
                        },
                        {
                            sentence: "Response: { \"data\": [...], \"total\": 100 }",
                            explanation: "APIs return JSON that you parse in JS.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cwa-what-1",
                    title: "API Concepts",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "REST APIs use:",
                            options: [
                                { value: "http", label: "HTTP methods and URLs" },
                                { value: "email", label: "Email messages" },
                            ],
                            expectedAnswer: "http",
                        },
                    ],
                },
            ],
        },

        // Fetch Basics
        {
            id: "fetch-basics",
            stepNumber: 2,
            title: "The fetch() Function",
            icon: "📡",
            explanation: `
                <h3>Making HTTP Requests</h3>
                <p>fetch() is the built-in way to make HTTP requests in JavaScript. It returns a Promise!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
// Basic GET request
const response = await fetch('https://api.example.com/users');
const data = await response.json();
console.log(data);

// Or with .then()
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📥 The Response Object",
                    description: "fetch() returns a Response, not the data directly",
                    examples: [
                        {
                            sentence: "response.ok // true if status 200-299",
                            explanation: "Check if request succeeded.",
                        },
                        {
                            sentence: "response.status // 200, 404, 500, etc.",
                            explanation: "The HTTP status code.",
                        },
                        {
                            sentence: "response.json() // Parse body as JSON",
                            explanation: "Returns a Promise with parsed JSON.",
                        },
                        {
                            sentence: "response.text() // Get body as text",
                            explanation: "For non-JSON responses.",
                        },
                    ],
                },
                {
                    title: "⚠️ Two-Step Process",
                    description: "fetch() requires two awaits",
                    examples: [
                        {
                            sentence: "const response = await fetch(url); // First await",
                            explanation: "Get the response object.",
                        },
                        {
                            sentence: "const data = await response.json(); // Second await",
                            explanation: "Parse the response body.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "⚠️ fetch() Gotcha",
                content:
                    "fetch() only throws on NETWORK errors (no internet). It does NOT throw on HTTP errors (404, 500). Always check response.ok!",
            },
            exercises: [
                {
                    id: "cwa-fetch-1",
                    title: "fetch() Basics",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "fetch() returns:",
                            options: [
                                { value: "promise", label: "A Promise" },
                                { value: "data", label: "The data directly" },
                            ],
                            expectedAnswer: "promise",
                        },
                        {
                            type: "radio",
                            label: "To get JSON from a response:",
                            options: [
                                { value: "json", label: "await response.json()" },
                                { value: "parse", label: "JSON.parse(response)" },
                            ],
                            expectedAnswer: "json",
                        },
                    ],
                },
            ],
        },

        // HTTP Methods
        {
            id: "http-methods",
            stepNumber: 3,
            title: "HTTP Methods: CRUD Operations",
            icon: "🔧",
            explanation: `
                <h3>Different Actions, Different Methods</h3>
                <p>HTTP methods tell the server what you want to do. They map to CRUD operations.</p>
            `,
            verbTable: {
                title: "HTTP Methods",
                headers: ["Method", "CRUD", "Purpose", "Has Body?"],
                rows: [
                    ["GET", "Read", "Fetch data", "No"],
                    ["POST", "Create", "Create new resource", "Yes"],
                    ["PUT", "Update", "Replace entire resource", "Yes"],
                    ["PATCH", "Update", "Update part of resource", "Yes"],
                    ["DELETE", "Delete", "Remove resource", "Usually no"],
                ],
            },
            usageMeanings: [
                {
                    title: "📖 GET - Read Data",
                    description: "Fetch data from the server",
                    examples: [
                        {
                            sentence: "fetch('/api/users') // Default is GET",
                            explanation: "No method needed for GET.",
                        },
                        {
                            sentence: "fetch('/api/users?page=2&limit=10')",
                            explanation: "Query params for filtering.",
                        },
                    ],
                },
                {
                    title: "✏️ POST - Create",
                    description: "Send data to create something",
                    examples: [
                        {
                            sentence: "fetch('/api/users', { method: 'POST', body: JSON.stringify(user), headers: { 'Content-Type': 'application/json' } })",
                            explanation: "Include method, body, and headers.",
                        },
                    ],
                },
                {
                    title: "🔄 PUT/PATCH - Update",
                    description: "Modify existing data",
                    examples: [
                        {
                            sentence: "fetch('/api/users/123', { method: 'PUT', body: JSON.stringify(updatedUser), headers: { 'Content-Type': 'application/json' } })",
                            explanation: "PUT replaces the entire resource.",
                        },
                        {
                            sentence: "fetch('/api/users/123', { method: 'PATCH', body: JSON.stringify({ name: 'New Name' }) ... })",
                            explanation: "PATCH updates only specified fields.",
                        },
                    ],
                },
                {
                    title: "🗑️ DELETE - Remove",
                    description: "Delete a resource",
                    examples: [
                        {
                            sentence: "fetch('/api/users/123', { method: 'DELETE' })",
                            explanation: "Usually no body needed.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cwa-methods-1",
                    title: "HTTP Methods",
                    instructions: "Match the operation:",
                    items: [
                        {
                            type: "select",
                            label: "Create a new user",
                            options: ["GET", "POST", "PUT", "DELETE"],
                            expectedAnswer: "POST",
                        },
                        {
                            type: "select",
                            label: "Get user list",
                            options: ["GET", "POST", "PUT", "DELETE"],
                            expectedAnswer: "GET",
                        },
                        {
                            type: "select",
                            label: "Remove a user",
                            options: ["GET", "POST", "PUT", "DELETE"],
                            expectedAnswer: "DELETE",
                        },
                    ],
                },
            ],
        },

        // Sending Data
        {
            id: "sending-data",
            stepNumber: 4,
            title: "Sending Data with fetch()",
            icon: "📤",
            explanation: `
                <h3>POST/PUT Request Structure</h3>
                <p>Sending data requires specifying the method, headers, and body.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
const newUser = { name: 'Alice', email: 'alice@example.com' };

const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',  // Tell server it's JSON
  },
  body: JSON.stringify(newUser),  // Convert to JSON string
});

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

const createdUser = await response.json();
console.log('Created:', createdUser);</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📋 Request Options",
                    description: "Configure the fetch request",
                    examples: [
                        {
                            sentence: "method: 'POST' // HTTP method",
                            explanation: "Specify the HTTP method.",
                        },
                        {
                            sentence: "headers: { 'Content-Type': 'application/json' }",
                            explanation: "Tell server what format the body is in.",
                        },
                        {
                            sentence: "body: JSON.stringify(data)",
                            explanation: "Convert JS object to JSON string.",
                        },
                    ],
                },
                {
                    title: "🎭 Common Headers",
                    description: "Headers you'll use frequently",
                    examples: [
                        {
                            sentence: "'Content-Type': 'application/json'",
                            explanation: "Request body is JSON.",
                        },
                        {
                            sentence: "'Authorization': 'Bearer token123'",
                            explanation: "Send auth token.",
                        },
                        {
                            sentence: "'Accept': 'application/json'",
                            explanation: "Tell server you want JSON back.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cwa-send-1",
                    title: "Sending Data",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "To send JSON, the body must be:",
                            options: [
                                { value: "string", label: "JSON.stringify(data)" },
                                { value: "object", label: "Just the object directly" },
                            ],
                            expectedAnswer: "string",
                        },
                        {
                            type: "radio",
                            label: "Content-Type header tells the server:",
                            options: [
                                { value: "format", label: "The format of the request body" },
                                { value: "size", label: "The size of the data" },
                            ],
                            expectedAnswer: "format",
                        },
                    ],
                },
            ],
        },

        // Error Handling
        {
            id: "error-handling",
            stepNumber: 5,
            title: "API Error Handling",
            icon: "🛡️",
            explanation: `
                <h3>Handle Errors Gracefully</h3>
                <p>APIs can fail for many reasons. Handle errors to provide good user experience!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);

    // Check for HTTP errors (fetch doesn't throw on 404/500!)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(\`HTTP error: \${response.status}\`);
    }

    return await response.json();

  } catch (error) {
    // Network error or our thrown error
    console.error('Fetch failed:', error.message);
    throw error;  // Re-throw or handle appropriately
  }
}</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "⚠️ Two Types of Errors",
                    description: "Network errors vs HTTP errors",
                    examples: [
                        {
                            sentence: "catch (error) // Only catches network errors!",
                            explanation: "fetch() doesn't throw on 404/500.",
                        },
                        {
                            sentence: "if (!response.ok) throw new Error(...)",
                            explanation: "You must check response.ok manually.",
                        },
                    ],
                },
                {
                    title: "🔢 HTTP Status Codes",
                    description: "Know what different codes mean",
                    examples: [
                        {
                            sentence: "200 - OK (success)",
                            explanation: "Request succeeded.",
                        },
                        {
                            sentence: "201 - Created (POST success)",
                            explanation: "Resource was created.",
                        },
                        {
                            sentence: "400 - Bad Request",
                            explanation: "Your request was invalid.",
                        },
                        {
                            sentence: "401 - Unauthorized",
                            explanation: "Need to log in.",
                        },
                        {
                            sentence: "403 - Forbidden",
                            explanation: "Logged in but not allowed.",
                        },
                        {
                            sentence: "404 - Not Found",
                            explanation: "Resource doesn't exist.",
                        },
                        {
                            sentence: "500 - Internal Server Error",
                            explanation: "Server broke - not your fault.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Always Check response.ok",
                content:
                    "This is the #1 fetch() mistake! Always check response.ok before parsing. A 404 still returns a response, it just has ok=false.",
            },
            exercises: [
                {
                    id: "cwa-error-1",
                    title: "Error Handling",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "fetch() throws an error when:",
                            options: [
                                { value: "network", label: "Network fails (no internet)" },
                                { value: "404", label: "Server returns 404" },
                            ],
                            expectedAnswer: "network",
                        },
                        {
                            type: "radio",
                            label: "401 status means:",
                            options: [
                                { value: "auth", label: "Need to log in" },
                                { value: "notfound", label: "Resource not found" },
                            ],
                            expectedAnswer: "auth",
                        },
                    ],
                },
            ],
        },

        // Authentication
        {
            id: "authentication",
            stepNumber: 6,
            title: "Authentication & Headers",
            icon: "🔐",
            explanation: `
                <h3>Sending Auth Tokens</h3>
                <p>Most APIs require authentication. The most common method is Bearer tokens in headers.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
const token = localStorage.getItem('authToken');

const response = await fetch('/api/profile', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
});

if (response.status === 401) {
  // Token expired or invalid
  redirectToLogin();
}</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🎫 Bearer Tokens",
                    description: "Most common auth method",
                    examples: [
                        {
                            sentence: "'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'",
                            explanation: "JWT token in Authorization header.",
                        },
                        {
                            sentence: "After login, store token and include in all requests",
                            explanation: "Token proves you're logged in.",
                        },
                    ],
                },
                {
                    title: "🔧 API Keys",
                    description: "For server-to-server or public APIs",
                    examples: [
                        {
                            sentence: "'X-API-Key': 'your-api-key'",
                            explanation: "Some APIs use custom headers.",
                        },
                        {
                            sentence: "fetch(`/api/data?api_key=${key}`)",
                            explanation: "Some use query parameters.",
                        },
                    ],
                },
                {
                    title: "🍪 Cookies",
                    description: "Automatic with credentials option",
                    examples: [
                        {
                            sentence: "fetch('/api/data', { credentials: 'include' })",
                            explanation: "Send cookies with cross-origin requests.",
                        },
                        {
                            sentence: "credentials: 'same-origin'",
                            explanation: "Default - cookies only for same domain.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cwa-auth-1",
                    title: "Authentication",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "Bearer tokens go in which header?",
                            options: [
                                { value: "auth", label: "Authorization" },
                                { value: "content", label: "Content-Type" },
                            ],
                            expectedAnswer: "auth",
                        },
                        {
                            type: "radio",
                            label: "To send cookies, use:",
                            options: [
                                { value: "cred", label: "credentials: 'include'" },
                                { value: "cookie", label: "cookies: true" },
                            ],
                            expectedAnswer: "cred",
                        },
                    ],
                },
            ],
        },

        // Real World Patterns
        {
            id: "real-world-patterns",
            stepNumber: 7,
            title: "Real-World API Patterns",
            icon: "🎨",
            explanation: `
                <h3>Production-Ready Code</h3>
                <p>Patterns used in real applications for robust API handling.</p>
            `,
            usageMeanings: [
                {
                    title: "📦 Reusable API Client",
                    description: "Wrap fetch in a helper function",
                    examples: [
                        {
                            sentence: "async function api(endpoint, options = {}) { const res = await fetch(`/api${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } }); if (!res.ok) throw new Error(res.status); return res.json(); }",
                            explanation: "Centralize headers and error handling.",
                        },
                        {
                            sentence: "api.get = (url) => api(url); api.post = (url, data) => api(url, { method: 'POST', body: JSON.stringify(data) });",
                            explanation: "Add convenience methods.",
                        },
                    ],
                },
                {
                    title: "⏳ Loading States",
                    description: "Track loading for better UX",
                    examples: [
                        {
                            sentence: "const [loading, setLoading] = useState(false); const [error, setError] = useState(null); const [data, setData] = useState(null);",
                            explanation: "Three states: loading, error, data.",
                        },
                        {
                            sentence: "setLoading(true); try { ... } finally { setLoading(false); }",
                            explanation: "Always reset loading in finally.",
                        },
                    ],
                },
                {
                    title: "🔄 Retry Logic",
                    description: "Retry failed requests",
                    examples: [
                        {
                            sentence: "for (let i = 0; i < 3; i++) { try { return await fetch(url); } catch { await delay(1000 * i); } }",
                            explanation: "Exponential backoff retry.",
                        },
                    ],
                },
                {
                    title: "❌ Cancel Requests",
                    description: "Abort fetch when component unmounts",
                    examples: [
                        {
                            sentence: "const controller = new AbortController(); fetch(url, { signal: controller.signal }); controller.abort();",
                            explanation: "AbortController cancels in-flight requests.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cwa-patterns-1",
                    title: "API Patterns",
                    instructions: "Which is a best practice?",
                    items: [
                        {
                            type: "radio",
                            label: "For loading states, track:",
                            options: [
                                { value: "three", label: "loading, error, and data" },
                                { value: "one", label: "Just the data" },
                            ],
                            expectedAnswer: "three",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "API Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>fetch()</strong> returns a Promise, not data directly</li>
                    <li><strong>response.json()</strong> parses the body (another await)</li>
                    <li><strong>response.ok</strong> - Always check! fetch() doesn't throw on HTTP errors</li>
                    <li><strong>GET</strong> = read, <strong>POST</strong> = create, <strong>PUT</strong> = update, <strong>DELETE</strong> = remove</li>
                    <li><strong>JSON.stringify()</strong> for request body</li>
                    <li><strong>Content-Type: application/json</strong> for JSON requests</li>
                    <li><strong>Authorization: Bearer token</strong> for auth</li>
                    <li>Track <strong>loading, error, data</strong> states in UI</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cwa-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "fetch() returns:",
                            options: [
                                { value: "promise", label: "A Promise" },
                                { value: "json", label: "JSON data directly" },
                            ],
                            expectedAnswer: "promise",
                        },
                        {
                            type: "radio",
                            label: "To check if request succeeded:",
                            options: [
                                { value: "ok", label: "response.ok" },
                                { value: "success", label: "response.success" },
                            ],
                            expectedAnswer: "ok",
                        },
                        {
                            type: "radio",
                            label: "POST requests need:",
                            options: [
                                { value: "both", label: "method, headers, and body" },
                                { value: "just", label: "Just the URL" },
                            ],
                            expectedAnswer: "both",
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
                    id: "wwa-cadence-concept",
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
                    id: "wwa-cadence-read",
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
                    id: "wwa-cadence-write",
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
                    id: "wwa-cadence-debug",
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
            question: "What does fetch() return?",
            options: [
                { value: "a", label: "The data directly" },
                { value: "b", label: "A Promise that resolves to a Response" },
                { value: "c", label: "A JSON object" },
            ],
            correctAnswer: "b",
            explanation:
                "fetch() returns a Promise. You await it to get a Response object, then await response.json() to get the data.",
        },
        {
            id: "q2",
            question: "When does fetch() throw an error?",
            options: [
                { value: "a", label: "On 404 Not Found" },
                { value: "b", label: "Only on network errors (no internet)" },
                { value: "c", label: "On any non-200 status" },
            ],
            correctAnswer: "b",
            explanation:
                "fetch() only throws on network failures. For HTTP errors (404, 500), you must check response.ok yourself!",
        },
        {
            id: "q3",
            question: "Which HTTP method creates a new resource?",
            options: [
                { value: "a", label: "GET" },
                { value: "b", label: "POST" },
                { value: "c", label: "DELETE" },
            ],
            correctAnswer: "b",
            explanation:
                "POST is used to create new resources. GET reads, PUT/PATCH updates, and DELETE removes.",
        },
        {
            id: "q4",
            question: "What's the correct header for JSON requests?",
            options: [
                { value: "a", label: "'Content-Type': 'text/plain'" },
                { value: "b", label: "'Content-Type': 'application/json'" },
                { value: "c", label: "'Data-Type': 'json'" },
            ],
            correctAnswer: "b",
            explanation:
                "Content-Type: application/json tells the server your request body is JSON formatted.",
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
            question: "fetch() returns:",
            options: [
                { value: "a", label: "A Promise that resolves to a Response object" },
                { value: "b", label: "The parsed JSON directly" },
                { value: "c", label: "The raw HTTP body" },
            ],
            correctAnswer: "a",
            explanation: "fetch() returns a Promise. Use response.json() or response.text() to parse the body.",
        },
        {
            id: "q12",
            question: "Best practice for handling API errors:",
            options: [
                { value: "a", label: "Check response.ok and handle non-2xx explicitly" },
                { value: "b", label: "Assume 200 and ignore errors" },
                { value: "c", label: "Only handle network failures" },
            ],
            correctAnswer: "a",
            explanation: "Check response.ok or response.status—non-2xx means the request failed even if fetch resolved.",
        },
    ],
};
