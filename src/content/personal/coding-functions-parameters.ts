import type { InteractiveGuideContent } from "@/types/activity";

export const codingFunctionsParametersContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Functions & Parameters: Reusable Code Blocks",
            icon: "🔧",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Functions are one of the most important concepts in programming. They let you write code once and use it many times. Parameters make functions flexible and powerful!</p>
                </div>

                <h3>Why Functions Matter</h3>
                <p>Without functions, you'd write the same code over and over. Functions eliminate repetition and make code easier to maintain and understand.</p>
            `,
            exercises: [
                {
                    id: "cfp-intro-1",
                    title: "Quick Check: Function Basics",
                    instructions: "Which best describes a function?",
                    items: [
                        {
                            type: "radio",
                            label: "What is a function?",
                            options: [
                                { value: "right", label: "A reusable block of code that performs a task" },
                                { value: "wrong", label: "A variable that holds a number" },
                            ],
                            expectedAnswer: "right",
                        },
                        {
                            type: "radio",
                            label: "What are parameters?",
                            options: [
                                { value: "right", label: "Inputs to a function that customize its behavior" },
                                { value: "wrong", label: "The output of a function" },
                            ],
                            expectedAnswer: "right",
                        },
                    ],
                },
            ],
        },

        // Declaring Functions
        {
            id: "declaring-functions",
            stepNumber: 1,
            title: "Declaring Functions",
            icon: "📝",
            formula: [
                { text: "function ", type: "subject" },
                { text: "name", type: "verb" },
                { text: "(", type: "other" },
                { text: "params", type: "verb" },
                { text: ") { return ", type: "other" },
                { text: "value", type: "verb" },
                { text: "; }", type: "other" },
            ],
            comparison: {
                title: "Parameter Pattern Comparison",
                leftLabel: "Declaration / Expression",
                rightLabel: "Arrow Function",
                rows: [
                    { label: "Hoisting", left: "Function declarations hoisted; expressions not", right: "Not hoisted (expression)" },
                    { label: "this binding", left: "Own this; varies by call context", right: "Inherits this from enclosing scope" },
                    { label: "Best for", left: "Main entry points, constructors", right: "Callbacks, handlers, short transforms" },
                    { label: "Single expression", left: "function add(a,b){ return a+b; }", right: "const add = (a,b) => a + b;" },
                ],
            },
            explanation: `
                <h3>Three Ways to Create Functions</h3>
                <p>JavaScript has different syntax for declaring functions. All work, but some are better than others for modern code. Function declarations are hoisted; arrow functions inherit <code>this</code> from the enclosing scope—critical for callbacks and event handlers.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">1️⃣ Declaration</h4>
                        <code style="display: block; background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.85rem; margin: 0.5rem 0;">function add(a,b) {}</code>
                        <p style="margin: 0.5rem 0; font-size: 0.85rem;">Traditional &amp; Hoisted</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">2️⃣ Expression</h4>
                        <code style="display: block; background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.85rem; margin: 0.5rem 0;">const add = fn(){}</code>
                        <p style="margin: 0.5rem 0; font-size: 0.85rem;">Flexible &amp; Versatile</p>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1.1rem;">3️⃣ Arrow</h4>
                        <code style="display: block; background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.85rem; margin: 0.5rem 0;">const add = (a,b) =&gt; {}</code>
                        <p style="margin: 0.5rem 0; font-size: 0.85rem;">Modern &amp; Concise ⭐</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔹 Function Declaration",
                    description: "The traditional way - function name { }",
                    examples: [
                        {
                            sentence: `function greet(name) {
  return 'Hello, ' + name;
}`,
                            explanation:
                                "function keyword, then name, then parameters in ( ), then body in { }.",
                        },
                        {
                            sentence: `function calculateTotal(price, tax) {
  const total = price + tax;
  return total;
}`,
                            explanation: "Multiple parameters separated by commas.",
                        },
                    ],
                },
                {
                    title: "🔹 Function Expression (Anonymous)",
                    description: "Store a function in a variable",
                    examples: [
                        {
                            sentence: `const greet = function(name) {
  return 'Hello, ' + name;
};`,
                            explanation:
                                "Function without a name. The variable name is what you call it by.",
                        },
                        {
                            sentence: `const double = function(x) {
  return x * 2;
};`,
                            explanation: "This function is stored in the variable 'double'.",
                        },
                    ],
                },
                {
                    title: "🔹 Arrow Functions (Modern)",
                    description: "Concise syntax with => (arrow)",
                    examples: [
                        {
                            sentence: `const greet = (name) => {
  return 'Hello, ' + name;
};`,
                            explanation:
                                "Modern syntax. Parentheses contain parameters, => starts the body.",
                        },
                        {
                            sentence: `const double = x => x * 2;`,
                            explanation:
                                "Super concise! Single parameter doesn't need ( ), single expression doesn't need { }.",
                        },
                        {
                            sentence: `const add = (a, b) => a + b;`,
                            explanation:
                                "Multiple parameters need ( ). Returns the expression result automatically.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Which Should You Use?",
                content:
                    "Modern JavaScript prefers arrow functions for their conciseness. Use function declarations for main functions, arrow functions for callbacks and handlers.",
            },
            exercises: [
                {
                    id: "cfp-declare-1",
                    title: "Identify Function Types",
                    instructions: "Which type of function declaration is this?",
                    items: [
                        {
                            type: "radio",
                            label: "function add(a, b) { return a + b; }",
                            options: [
                                { value: "declaration", label: "Declaration" },
                                { value: "expression", label: "Expression" },
                                { value: "arrow", label: "Arrow" },
                            ],
                            expectedAnswer: "declaration",
                        },
                        {
                            type: "radio",
                            label: "const add = (a, b) => a + b;",
                            options: [
                                { value: "declaration", label: "Declaration" },
                                { value: "expression", label: "Expression" },
                                { value: "arrow", label: "Arrow" },
                            ],
                            expectedAnswer: "arrow",
                        },
                    ],
                },
                {
                    id: "cfp-declare-2",
                    title: "Write Arrow Functions",
                    instructions: "Convert to arrow function syntax.",
                    items: [
                        {
                            type: "text",
                            label: "const square = (x) => { return x * x; } // Simpler?",
                            correctAnswer: "const square = x => x * x;",
                            expectedAnswers: ["const square = x => x * x;", "x => x * x"],
                        },
                    ],
                },
            ],
        },

        // Parameters & Arguments
        {
            id: "parameters-arguments",
            stepNumber: 2,
            title: "Parameters & Arguments",
            icon: "📥",
            explanation: `
                <h3>Parameters vs Arguments</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 1.5rem; border-radius: 0.75rem; color: #1f2937;">
                        <h4 style="margin-top: 0; color: #d97757; font-size: 1.1rem;">📋 Parameters</h4>
                        <p style="margin: 0; font-size: 0.95rem;">The <strong>placeholders</strong> in the function <strong>definition</strong></p>
                        <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.75rem; border-radius: 0.25rem; margin-top: 0.75rem; font-size: 0.9rem;">function greet(<span style="background: #ffeb3b; padding: 0.2rem 0.4rem; border-radius: 0.2rem;">name</span>) {}</code>
                        <p style="margin: 0.75rem 0 0 0; font-size: 0.85rem; color: #555;"><code>name</code> is the parameter</p>
                    </div>
                    <div class="diagram-surface-light" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.5rem; border-radius: 0.75rem; color: #1f2937;">
                        <h4 style="margin-top: 0; color: #2b3a4a; font-size: 1.1rem;">🎯 Arguments</h4>
                        <p style="margin: 0; font-size: 0.95rem;">The actual <strong>values</strong> you pass when you <strong>call</strong> the function</p>
                        <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.75rem; border-radius: 0.25rem; margin-top: 0.75rem; font-size: 0.9rem;">greet(<span style="background: #ffeb3b; padding: 0.2rem 0.4rem; border-radius: 0.2rem;">'Alice'</span>)</code>
                        <p style="margin: 0.75rem 0 0 0; font-size: 0.85rem; color: #555;"><code>'Alice'</code> is the argument</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📤 Passing Arguments",
                    description: "How to give data to functions",
                    examples: [
                        {
                            sentence: `function greet(name) { // name is the parameter
  return 'Hello, ' + name;
}
greet('Alice'); // 'Alice' is the argument`,
                            explanation: "You pass 'Alice' as an argument. Inside, it's called 'name'.",
                        },
                        {
                            sentence: `const result = greet('Bob');
console.log(result); // 'Hello, Bob'`,
                            explanation: "The function returns a value that you can use.",
                        },
                    ],
                },
                {
                    title: "🔄 Multiple Parameters",
                    description: "Functions can take many inputs",
                    examples: [
                        {
                            sentence: `function add(a, b) {
  return a + b;
}
add(5, 3); // Returns 8`,
                            explanation: "a and b are two separate parameters.",
                        },
                        {
                            sentence: `const greetFormally = (firstName, lastName) => {
  return 'Hello, ' + firstName + ' ' + lastName;
};`,
                            explanation:
                                "Two parameters let you customize the function's behavior.",
                        },
                    ],
                },
                {
                    title: "📌 Default Parameters",
                    description: "Parameters with default values if not provided",
                    examples: [
                        {
                            sentence: `function greet(name = 'Guest') {
  return 'Hello, ' + name;
}
greet(); // 'Hello, Guest'
greet('Alice'); // 'Hello, Alice'`,
                            explanation:
                                "If you don't provide name, it defaults to 'Guest'.",
                        },
                        {
                            sentence: `const calculateArea = (width, height = width) => {
  return width * height;
};`,
                            explanation:
                                "Default parameters can reference other parameters.",
                        },
                    ],
                },
                {
                    title: "🎁 Rest Parameters (...)",
                    description: "Accept any number of arguments",
                    examples: [
                        {
                            sentence: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4, 5); // 15`,
                            explanation:
                                "...numbers collects all arguments into an array.",
                        },
                        {
                            sentence: `const logAll = (first, ...rest) => {
  console.log('First:', first);
  console.log('Rest:', rest);
};
logAll('a', 'b', 'c', 'd');`,
                            explanation:
                                "You can combine regular parameters with rest parameters.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cfp-params-1",
                    title: "Parameter vs Argument",
                    instructions: "Identify which is the parameter and which is the argument.",
                    items: [
                        {
                            type: "text",
                            label: "In 'function multiply(x) { return x * 2; }', what is the parameter?",
                            correctAnswer: "x",
                            expectedAnswers: ["x"],
                        },
                        {
                            type: "text",
                            label: "In 'multiply(5);', what is the argument?",
                            correctAnswer: "5",
                            expectedAnswers: ["5"],
                        },
                    ],
                },
                {
                    id: "cfp-params-2",
                    title: "Write Functions with Parameters",
                    instructions: "Complete the function to use parameters.",
                    items: [
                        {
                            type: "text",
                            label: "Write a function that takes two numbers and returns their sum.",
                            correctAnswer: "function add(a, b) { return a + b; }",
                            expectedAnswers: ["function add(a, b) { return a + b; }", "const add = (a, b) => a + b;"],
                        },
                    ],
                },
            ],
        },

        // Return Values
        {
            id: "return-values",
            stepNumber: 3,
            title: "Return Values",
            icon: "📤",
            explanation: `
                <h3>Functions Give Back Data</h3>
                <p>The return keyword stops the function and sends back a value. Without return, the function returns undefined.</p>
            `,
            usageMeanings: [
                {
                    title: "Return a Value",
                    description: "Send data back from a function",
                    examples: [
                        {
                            sentence: `function double(x) {
  return x * 2;
}
const result = double(5); // result = 10`,
                            explanation:
                                "return sends the value back. You can use it in variables or other operations.",
                        },
                        {
                            sentence: `const triple = x => {
  return x * 3;
};
console.log(triple(4)); // 12`,
                            explanation: "Arrow functions also use return (unless you omit the braces).",
                        },
                    ],
                },
                {
                    title: "Early Return",
                    description: "Exit a function early with return",
                    examples: [
                        {
                            sentence: `function validateEmail(email) {
  if (!email.includes('@')) {
    return 'Invalid email';
  }
  if (email.length < 5) {
    return 'Email too short';
  }
  return 'Valid';
}`,
                            explanation:
                                "Early returns let you exit when you find a problem.",
                        },
                    ],
                },
                {
                    title: "Return Multiple Values with Objects/Arrays",
                    description: "Return multiple values using objects or arrays",
                    examples: [
                        {
                            sentence: `function getCoordinates() {
  return { x: 10, y: 20 };
}
const pos = getCoordinates();
console.log(pos.x); // 10`,
                            explanation: "Objects let you return multiple named values.",
                        },
                        {
                            sentence: `function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5]);`,
                            explanation:
                                "Arrays let you return multiple values. Destructuring makes it easy to use.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cfp-return-1",
                    title: "What Does This Return?",
                    instructions: "What value is returned?",
                    items: [
                        {
                            type: "text",
                            label: `function test() {
  return 5;
  return 10;
}
test(); // Returns?`,
                            correctAnswer: "5",
                            expectedAnswers: ["5"],
                        },
                    ],
                },
                {
                    id: "cfp-return-2",
                    title: "Missing Return",
                    instructions: "What does a function return if no return statement?",
                    items: [
                        {
                            type: "text",
                            label: `function noReturn() {
  const x = 5;
}
noReturn(); // Returns?`,
                            correctAnswer: "undefined",
                            expectedAnswers: ["undefined"],
                        },
                    ],
                },
            ],
        },

        // Function Scope
        {
            id: "function-scope",
            stepNumber: 4,
            title: "Function Scope & Variables",
            icon: "🔒",
            explanation: `
                <h3>Variables Inside Functions Are Local</h3>
                <p>Variables declared inside a function only exist inside that function. This prevents name conflicts and keeps code clean. Scope follows a chain: inner functions can access outer scope, but not the reverse.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 1.25rem; border-radius: 0.75rem; color: #f8fafc; margin: 1.25rem 0;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1rem;">Scope Chain Diagram</h4>
                    <pre style="margin: 0; font-size: 0.88rem; line-height: 1.6;">
┌─ global scope ─────────────────────────────────────┐
│  const x = 1;  (accessible everywhere)              │
│  ┌─ outer() ────────────────────────────────────┐  │
│  │  const y = 2;  (outer + inner can see)        │  │
│  │  ┌─ inner() ───────────────────────────────┐ │  │
│  │  │  const z = 3;  (inner only)              │ │  │
│  │  │  console.log(x, y, z);  // 1, 2, 3       │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  │  console.log(z);  // ReferenceError!          │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘</pre>
                    <p style="margin: 1rem 0 0 0; font-size: 0.9rem;">Inner scopes can read outer; outer cannot read inner.</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Local vs Global",
                    description: "Where variables can be accessed",
                    examples: [
                        {
                            sentence: `const globalVar = 'global';
function myFunction() {
  const localVar = 'local';
  console.log(globalVar); // 'global' - can access global
  console.log(localVar); // 'local' - can access local
}
console.log(localVar); // Error! localVar is not accessible here`,
                            explanation:
                                "Local variables are only accessible inside the function.",
                        },
                    ],
                },
                {
                    title: "Scope Chain",
                    description: "Looking up the scope hierarchy",
                    examples: [
                        {
                            sentence: `const x = 1; // global
function outer() {
  const x = 2; // local to outer
  function inner() {
    console.log(x); // 2 - uses outer's x
  }
  inner();
}
outer(); // logs 2`,
                            explanation:
                                "Inner functions can access variables from outer scopes.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cfp-scope-1",
                    title: "Identify Scope Issues",
                    instructions: "Will this code work?",
                    items: [
                        {
                            type: "radio",
                            label: `const x = 5;
function test() {
  console.log(x);
}
test();`,
                            options: [
                                { value: "yes", label: "Yes - prints 5" },
                                { value: "no", label: "No - error" },
                            ],
                            expectedAnswer: "yes",
                        },
                        {
                            type: "radio",
                            label: `function test() {
  const x = 5;
}
console.log(x);`,
                            options: [
                                { value: "yes", label: "Yes - prints 5" },
                                { value: "no", label: "No - error" },
                            ],
                            expectedAnswer: "no",
                        },
                    ],
                },
            ],
        },

        // Common Patterns
        {
            id: "common-patterns",
            stepNumber: 5,
            title: "Common Function Patterns",
            icon: "📚",
            explanation: `
                <h3>Real-World Function Patterns</h3>
                <p>These patterns appear constantly in professional code.</p>
            `,
            usageMeanings: [
                {
                    title: "Higher-Order Functions",
                    description: "Functions that take or return functions",
                    examples: [
                        {
                            sentence: `const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2);
// [2, 4, 6, 8]`,
                            explanation:
                                "map() takes a function as an argument. It's a higher-order function.",
                        },
                    ],
                },
                {
                    title: "Callback Functions",
                    description: "Functions passed to other functions",
                    examples: [
                        {
                            sentence: `button.addEventListener('click', () => {
  console.log('Clicked!');
});`,
                            explanation:
                                "The arrow function is a callback - it runs when the event happens.",
                        },
                    ],
                },
                {
                    title: "Pure Functions",
                    description: "Functions with no side effects",
                    examples: [
                        {
                            sentence: `// Pure function - always returns same output for same input
const add = (a, b) => a + b;

// NOT pure - depends on external state
let total = 0;
const addToTotal = (x) => {
  total += x; // Side effect!
  return total;
};`,
                            explanation:
                                "Pure functions are easier to test and understand.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cfp-patterns-1",
                    title: "Higher-Order Functions",
                    instructions: "What will this return?",
                    items: [
                        {
                            type: "text",
                            label: `[1, 2, 3].map(x => x + 1);`,
                            correctAnswer: "[2, 3, 4]",
                            expectedAnswers: ["[2, 3, 4]", "2,3,4"],
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 6,
            title: "Functions Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Functions avoid repetition</strong> - write once, use many times</li>
                    <li><strong>Parameters make functions flexible</strong> - input controls behavior</li>
                    <li><strong>return sends data back</strong> - functions are useful when they return values</li>
                    <li><strong>Local variables are isolated</strong> - prevents conflicts</li>
                    <li><strong>Arrow functions are modern</strong> - use them for conciseness</li>
                    <li><strong>Functions can work with functions</strong> - callbacks, map, filter, reduce</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cfp-summary-1",
                    title: "Mixed Review",
                    instructions: "Test your function knowledge.",
                    items: [
                        {
                            type: "radio",
                            label: "What do parameters do?",
                            options: [
                                { value: "a", label: "Make functions flexible by accepting input" },
                                { value: "b", label: "Prevent the function from working" },
                                { value: "c", label: "Store the output" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What does return do?",
                            options: [
                                { value: "a", label: "Starts the function again" },
                                { value: "b", label: "Stops the function and sends back a value" },
                                { value: "c", label: "Declares a variable" },
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
                    id: "fp-cadence-concept",
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
                    id: "fp-cadence-read",
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
                    id: "fp-cadence-write",
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
                    id: "fp-cadence-debug",
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
            question: "What is a parameter?",
            options: [
                { value: "a", label: "The actual value passed to a function" },
                { value: "b", label: "A placeholder in the function definition" },
                { value: "c", label: "The value returned by a function" },
            ],
            correctAnswer: "b",
            explanation:
                "Parameters are placeholders. Arguments are the actual values you pass. In 'function add(a, b)', a and b are parameters.",
        },
        {
            id: "q2",
            question: "Which is an arrow function?",
            options: [
                { value: "a", label: "function greet(name) { }" },
                { value: "b", label: "const greet = (name) => { }" },
                { value: "c", label: "const greet = function(name) { }" },
            ],
            correctAnswer: "b",
            explanation: "Arrow functions use => syntax. They're modern and concise.",
        },
        {
            id: "q3",
            question: "What does this return? const f = x => x * 2; f(5);",
            options: [
                { value: "a", label: "5" },
                { value: "b", label: "10" },
                { value: "c", label: "undefined" },
            ],
            correctAnswer: "b",
            explanation: "Arrow functions with single expressions return automatically. x * 2 with x=5 is 10.",
        },
        {
            id: "q4",
            question: "Can a function access variables declared outside it?",
            options: [
                { value: "a", label: "Yes, global variables are accessible" },
                { value: "b", label: "No, never" },
                { value: "c", label: "Only if they're const" },
            ],
            correctAnswer: "a",
            explanation: "Functions can access global variables. But variables declared inside functions are local.",
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
