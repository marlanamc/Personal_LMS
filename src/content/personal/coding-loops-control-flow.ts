import type { InteractiveGuideContent } from "@/types/activity";

export const codingLoopsControlFlowContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Loops & Control Flow: Making Decisions & Repetitions",
            icon: "🔁",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Control flow is how you tell your program to make decisions. Loops let you repeat code without typing it a hundred times. These are the building blocks of program logic!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Every program needs to make decisions (if/else) and repeat tasks (loops). Master these and you can build any algorithm.</p>
            `,
            exercises: [
                {
                    id: "clcf-intro-1",
                    title: "Quick Check: Control Flow",
                    instructions: "What does if/else do?",
                    items: [
                        {
                            type: "radio",
                            label: "If/else is used for...",
                            options: [
                                { value: "decisions", label: "Making decisions based on conditions" },
                                { value: "loops", label: "Repeating code multiple times" },
                            ],
                            expectedAnswer: "decisions",
                        },
                        {
                            type: "radio",
                            label: "Loops are used for...",
                            options: [
                                { value: "decisions", label: "Making decisions" },
                                { value: "repetition", label: "Repeating code" },
                            ],
                            expectedAnswer: "repetition",
                        },
                    ],
                },
            ],
        },

        // If/Else Statements
        {
            id: "if-else",
            stepNumber: 1,
            title: "If/Else: Making Decisions",
            icon: "❓",
            explanation: `
                <h3>Conditional Statements</h3>
                <p>If/else lets your code make decisions based on conditions. Very powerful!</p>

                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 0.75rem; margin: 1.5rem 0; color: white;">
                    <h4 style="margin: 0 0 1.5rem 0; text-align: center; font-size: 1.2rem;">Decision Flow</h4>
                    <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap;">
                        <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 0.5rem; text-align: center; min-width: 120px;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">❓</div>
                            <div style="font-weight: bold; font-size: 0.9rem;">Condition</div>
                        </div>
                        <div style="font-size: 2rem; margin: 0 1rem;">↓</div>
                        <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 0.5rem; text-align: center; min-width: 120px;">
                            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">✅</div>
                            <div style="font-weight: bold; font-size: 0.9rem;">TRUE</div>
                        </div>
                        <div style="font-size: 2rem; margin: 0 1rem;">vs</div>
                        <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 0.5rem; text-align: center; min-width: 120px;">
                            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">❌</div>
                            <div style="font-weight: bold; font-size: 0.9rem;">FALSE</div>
                        </div>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "if: Execute if true",
                    description: "Run code only if a condition is true",
                    examples: [
                        {
                            sentence: `const age = 18;
if (age >= 18) {
  console.log('You can vote');
}`,
                            explanation:
                                "The code inside { } only runs if age >= 18 is true.",
                        },
                        {
                            sentence: `if (user.isLoggedIn) {
  showDashboard();
}`,
                            explanation: "If the condition is true, the function runs.",
                        },
                    ],
                },
                {
                    title: "if/else: Two paths",
                    description: "Do one thing if true, another if false",
                    examples: [
                        {
                            sentence: `const age = 15;
if (age >= 18) {
  console.log('You can vote');
} else {
  console.log('Too young to vote');
}`,
                            explanation:
                                "If age >= 18, first block runs. Otherwise, else block runs.",
                        },
                        {
                            sentence: `if (score > 90) {
  grade = 'A';
} else {
  grade = 'B';
}`,
                            explanation: "Two possible paths depending on the condition.",
                        },
                    ],
                },
                {
                    title: "if/else if/else: Multiple conditions",
                    description: "Test multiple conditions in order",
                    examples: [
                        {
                            sentence: `const score = 75;
if (score >= 90) {
  console.log('A');
} else if (score >= 80) {
  console.log('B');
} else if (score >= 70) {
  console.log('C');
} else {
  console.log('F');
}`,
                            explanation:
                                "Each condition is tested in order. First true one runs.",
                        },
                        {
                            sentence: `if (score > 90) {
  grade = 'A+';
} else if (score > 85) {
  grade = 'A';
} else if (score > 80) {
  grade = 'A-';
} else {
  grade = 'B';
}`,
                            explanation: "Allows fine-grained control.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "clcf-if-1",
                    title: "Write If/Else",
                    instructions: "Complete the if/else statement.",
                    items: [
                        {
                            type: "text",
                            label: "If x > 10, log 'big', else log 'small'",
                            correctAnswer: "if (x > 10) { console.log('big'); } else { console.log('small'); }",
                            expectedAnswers: ["if (x > 10) { console.log('big'); } else { console.log('small'); }"],
                        },
                    ],
                },
                {
                    id: "clcf-if-2",
                    title: "What Gets Logged?",
                    instructions: "What will be printed?",
                    items: [
                        {
                            type: "text",
                            label: `const x = 5;
if (x > 10) {
  console.log('A');
} else if (x > 0) {
  console.log('B');
} else {
  console.log('C');
}`,
                            correctAnswer: "B",
                            expectedAnswers: ["B"],
                        },
                    ],
                },
            ],
        },

        // Switch Statements
        {
            id: "switch",
            stepNumber: 2,
            title: "Switch: When You Have Many Options",
            icon: "🔀",
            explanation: `
                <h3>Switch Statements</h3>
                <p>Switch is cleaner than if/else if/else when you have many specific values to check.</p>
            `,
            usageMeanings: [
                {
                    title: "Switch Structure",
                    description: "Compare one value against many cases",
                    examples: [
                        {
                            sentence: `const day = 'Monday';
switch (day) {
  case 'Monday':
    console.log('Start of work week');
    break;
  case 'Friday':
    console.log('Almost weekend!');
    break;
  case 'Saturday':
  case 'Sunday':
    console.log('Weekend!');
    break;
  default:
    console.log('Just another day');
}`,
                            explanation:
                                "switch checks day against each case. break prevents fall-through.",
                        },
                        {
                            sentence: `const grade = 'A';
switch (grade) {
  case 'A':
    console.log('Excellent!');
    break;
  case 'B':
    console.log('Good!');
    break;
  default:
    console.log('Try harder');
}`,
                            explanation: "Clean and readable when comparing one value.",
                        },
                    ],
                },
                {
                    title: "break is Important!",
                    description: "Without break, code falls through to next case",
                    examples: [
                        {
                            sentence: `const x = 1;
switch (x) {
  case 1:
    console.log('One');
    break; // Don't forget this!
  case 2:
    console.log('Two');
    break;
}`,
                            explanation:
                                "break stops execution. Without it, your code will keep going!",
                        },
                        {
                            sentence: `// Fall-through (intentional)
case 'A':
case 'B':
case 'C':
  console.log('Good grades');
  break;`,
                            explanation:
                                "Sometimes you want multiple cases to do the same thing. This is called fall-through.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "clcf-switch-1",
                    title: "Switch vs If/Else",
                    instructions: "When would you use switch instead of if/else?",
                    items: [
                        {
                            type: "radio",
                            label: "Choose the best approach for checking a grade (A, B, C, D, F).",
                            options: [
                                { value: "switch", label: "Switch statement" },
                                { value: "if", label: "If/else if" },
                            ],
                            expectedAnswer: "switch",
                        },
                    ],
                },
            ],
        },

        // For Loops
        {
            id: "for-loops",
            stepNumber: 3,
            title: "For Loops: Count-Based Repetition",
            icon: "📍",
            explanation: `
                <h3>For Loops</h3>
                <p>For loops repeat code a specific number of times. Perfect when you know exactly how many iterations you need.</p>

                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: white;">
                    <h4 style="margin: 0 0 1rem 0;">For Loop Anatomy</h4>
                    <code style="display: block; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; font-size: 0.9rem; line-height: 1.8;">
for (<span style="background: rgba(255,255,255,0.3); padding: 0.2rem 0.4rem;">let i = 0</span>; <span style="background: rgba(255,255,0,0.3); padding: 0.2rem 0.4rem;">i &lt; 5</span>; <span style="background: rgba(0,255,255,0.3); padding: 0.2rem 0.4rem;">i++</span>) {<br/>
&nbsp;&nbsp;console.log(i);<br/>
}
                    </code>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
                        <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.25rem;">
                            <div style="font-size: 0.85rem; color: #ffeb3b;">🔵 Start</div>
                            <div style="font-size: 0.8rem; margin-top: 0.25rem;">i = 0</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.25rem;">
                            <div style="font-size: 0.85rem; color: #ffeb3b;">🟡 Condition</div>
                            <div style="font-size: 0.8rem; margin-top: 0.25rem;">i &lt; 5</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.25rem;">
                            <div style="font-size: 0.85rem; color: #ffeb3b;">🔵 Update</div>
                            <div style="font-size: 0.8rem; margin-top: 0.25rem;">i++</div>
                        </div>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Traditional For Loop",
                    description: "Loop with counter variable",
                    examples: [
                        {
                            sentence: `for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}`,
                            explanation:
                                "i starts at 0, increases by 1 each time, stops when i < 5 is false.",
                        },
                        {
                            sentence: `for (let i = 1; i <= 10; i++) {
  console.log(i * 2); // 2, 4, 6, 8, ..., 20
}`,
                            explanation: "Use i in calculations inside the loop.",
                        },
                    ],
                },
                {
                    title: "Looping Through Arrays",
                    description: "Traditional for loop with array",
                    examples: [
                        {
                            sentence: `const names = ['Alice', 'Bob', 'Charlie'];
for (let i = 0; i < names.length; i++) {
  console.log(names[i]);
}`,
                            explanation: "Use i to access each array element.",
                        },
                    ],
                },
                {
                    title: "For...of Loop (Modern)",
                    description: "Simpler syntax for iterating values",
                    examples: [
                        {
                            sentence: `const names = ['Alice', 'Bob', 'Charlie'];
for (const name of names) {
  console.log(name);
}`,
                            explanation:
                                "for...of automatically gives you each value. Cleaner than traditional for.",
                        },
                        {
                            sentence: `const str = 'Hello';
for (const char of str) {
  console.log(char); // H, e, l, l, o
}`,
                            explanation: "Works with strings too!",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "clcf-for-1",
                    title: "For Loop Output",
                    instructions: "What will this print?",
                    items: [
                        {
                            type: "text",
                            label: `for (let i = 0; i < 3; i++) {
  console.log(i);
}`,
                            correctAnswer: "0, 1, 2",
                            expectedAnswers: ["0, 1, 2", "0 1 2", "0\\n1\\n2"],
                        },
                        {
                            type: "text",
                            label: `const arr = ['a', 'b', 'c'];
for (const item of arr) {
  console.log(item);
}`,
                            correctAnswer: "a, b, c",
                            expectedAnswers: ["a, b, c", "a b c"],
                        },
                    ],
                },
                {
                    id: "clcf-for-2",
                    title: "Write a For Loop",
                    instructions: "Write a loop that prints numbers 1 to 5.",
                    items: [
                        {
                            type: "text",
                            label: "for (let i = 1; i <= 5; i++) { console.log(i); }",
                            correctAnswer: "for (let i = 1; i <= 5; i++) { console.log(i); }",
                            expectedAnswers: ["for (let i = 1; i <= 5; i++) { console.log(i); }"],
                        },
                    ],
                },
            ],
        },

        // While Loops
        {
            id: "while-loops",
            stepNumber: 4,
            title: "While & Do/While Loops",
            icon: "♾️",
            explanation: `
                <h3>While Loops</h3>
                <p>While loops repeat while a condition is true. Use when you don't know how many iterations you need.</p>
            `,
            usageMeanings: [
                {
                    title: "While Loop",
                    description: "Repeat while condition is true",
                    examples: [
                        {
                            sentence: `let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}`,
                            explanation:
                                "While count < 5 is true, keep looping. Increment count manually.",
                        },
                        {
                            sentence: `let password = '';
while (password !== 'secret') {
  password = prompt('Enter password:');
}`,
                            explanation: "Useful when you need to repeat until a condition changes.",
                        },
                    ],
                },
                {
                    title: "Do/While Loop",
                    description: "Run at least once, then check condition",
                    examples: [
                        {
                            sentence: `let guess;
do {
  guess = prompt('Guess a number:');
} while (guess !== '42');`,
                            explanation:
                                "do/while runs the body first, then checks condition. Useful for menus!",
                        },
                    ],
                },
                {
                    title: "⚠️ Infinite Loops (Watch Out!)",
                    description: "When the condition never becomes false",
                    examples: [
                        {
                            sentence: `// DANGER! Don't do this:
while (true) {
  console.log('This never stops!');
}`,
                            explanation: "This will freeze your program. Always make sure the loop ends!",
                        },
                        {
                            sentence: `let i = 0;
while (i < 5) {
  console.log(i);
  // Forgot i++! This is infinite!
}`,
                            explanation: "Easy mistake to make. Always update the condition variable.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "clcf-while-1",
                    title: "While Loop Output",
                    instructions: "What does this print?",
                    items: [
                        {
                            type: "text",
                            label: `let i = 0;
while (i < 3) {
  console.log(i);
  i++;
}`,
                            correctAnswer: "0, 1, 2",
                            expectedAnswers: ["0, 1, 2"],
                        },
                    ],
                },
            ],
        },

        // Break & Continue
        {
            id: "break-continue",
            stepNumber: 5,
            title: "Break & Continue",
            icon: "⏹️",
            explanation: `
                <h3>Control Loop Execution</h3>
                <p>break stops a loop immediately. continue skips to the next iteration.</p>
            `,
            usageMeanings: [
                {
                    title: "break: Exit the Loop",
                    description: "Stop looping immediately",
                    examples: [
                        {
                            sentence: `for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break; // Stop here
  }
  console.log(i); // 0, 1, 2, 3, 4
}`,
                            explanation: "When i === 5, break stops the loop.",
                        },
                        {
                            sentence: `const arr = [1, 2, 3, 4, 5];
for (const num of arr) {
  if (num === 3) break;
  console.log(num); // 1, 2
}`,
                            explanation: "Useful for searching and exiting early.",
                        },
                    ],
                },
                {
                    title: "continue: Skip This Iteration",
                    description: "Jump to the next iteration",
                    examples: [
                        {
                            sentence: `for (let i = 0; i < 5; i++) {
  if (i === 2) continue; // Skip 2
  console.log(i); // 0, 1, 3, 4
}`,
                            explanation: "When i === 2, continue skips the console.log.",
                        },
                        {
                            sentence: `const numbers = [1, 2, 3, 4, 5];
for (const num of numbers) {
  if (num % 2 === 0) continue; // Skip even numbers
  console.log(num); // 1, 3, 5
}`,
                            explanation: "Skip iteration for certain conditions.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "clcf-break-1",
                    title: "Break Output",
                    instructions: "What gets printed?",
                    items: [
                        {
                            type: "text",
                            label: `for (let i = 0; i < 5; i++) {
  if (i === 2) break;
  console.log(i);
}`,
                            correctAnswer: "0, 1",
                            expectedAnswers: ["0, 1"],
                        },
                        {
                            type: "text",
                            label: `for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);
}`,
                            correctAnswer: "0, 1, 3, 4",
                            expectedAnswers: ["0, 1, 3, 4"],
                        },
                    ],
                },
            ],
        },

        // Array Methods as Loops
        {
            id: "array-methods",
            stepNumber: 6,
            title: "Modern Loop Alternatives: map, filter, reduce",
            icon: "📚",
            explanation: `
                <h3>Array Methods Are Powerful</h3>
                <p>Instead of traditional for loops, modern JavaScript uses map, filter, reduce. These are more readable and functional.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1rem;">🎨 map()</h4>
                        <p style="margin: 0.5rem 0; font-size: 0.85rem;">Transform each element</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">[1,2,3].map(x =&gt; x*2)</code>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">[2,4,6]</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.25rem; border-radius: 0.5rem; color: white;">
                        <h4 style="margin-top: 0; font-size: 1rem;">🔍 filter()</h4>
                        <p style="margin: 0.5rem 0; font-size: 0.85rem;">Keep matching items</p>
                        <code style="display: block; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">[1,2,3].filter(x =&gt; x&gt;1)</code>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">[2,3]</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.25rem; border-radius: 0.5rem; color: #2b3a4a;">
                        <h4 style="margin-top: 0; font-size: 1rem;">➕ reduce()</h4>
                        <p style="margin: 0.5rem 0; font-size: 0.85rem;">Combine into one value</p>
                        <code style="display: block; background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">[1,2,3].reduce((a,b)=&gt;a+b)</code>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">6</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "map: Transform Each Element",
                    description: "Create a new array with transformed values",
                    examples: [
                        {
                            sentence: `const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2);
// [2, 4, 6, 8]`,
                            explanation: "map applies the function to each element.",
                        },
                        {
                            sentence: `const users = ['Alice', 'Bob'];
const greetings = users.map(name => 'Hello, ' + name);
// ['Hello, Alice', 'Hello, Bob']`,
                            explanation: "Transform array of names to greetings.",
                        },
                    ],
                },
                {
                    title: "filter: Keep Only Matching Elements",
                    description: "Create array with only elements that match condition",
                    examples: [
                        {
                            sentence: `const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(x => x % 2 === 0);
// [2, 4]`,
                            explanation: "filter keeps only even numbers.",
                        },
                        {
                            sentence: `const users = [{name: 'Alice', age: 25}, {name: 'Bob', age: 17}];
const adults = users.filter(u => u.age >= 18);
// [{name: 'Alice', age: 25}]`,
                            explanation: "Filter users by age.",
                        },
                    ],
                },
                {
                    title: "reduce: Combine Into Single Value",
                    description: "Combine all elements into one result",
                    examples: [
                        {
                            sentence: `const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((total, x) => total + x, 0);
// 10`,
                            explanation:
                                "reduce adds all numbers together. 0 is the starting value.",
                        },
                        {
                            sentence: `const items = ['apple', 'banana', 'apple'];
const count = items.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1;
  return acc;
}, {});
// {apple: 2, banana: 1}`,
                            explanation: "Count occurrences of each item.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "clcf-methods-1",
                    title: "Map, Filter, Reduce Output",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: `[1, 2, 3].map(x => x * 2)`,
                            correctAnswer: "[2, 4, 6]",
                            expectedAnswers: ["[2, 4, 6]", "2, 4, 6"],
                        },
                        {
                            type: "text",
                            label: `[1, 2, 3, 4].filter(x => x > 2)`,
                            correctAnswer: "[3, 4]",
                            expectedAnswers: ["[3, 4]", "3, 4"],
                        },
                        {
                            type: "text",
                            label: `[1, 2, 3].reduce((a, b) => a + b, 0)`,
                            correctAnswer: "6",
                            expectedAnswers: ["6"],
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 7,
            title: "Control Flow Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>if/else:</strong> Make decisions based on conditions</li>
                    <li><strong>switch:</strong> Clean when comparing one value to many cases</li>
                    <li><strong>for loop:</strong> Repeat a specific number of times</li>
                    <li><strong>while loop:</strong> Repeat while condition is true</li>
                    <li><strong>break:</strong> Exit a loop immediately</li>
                    <li><strong>continue:</strong> Skip to next iteration</li>
                    <li><strong>map/filter/reduce:</strong> Modern alternatives to traditional loops</li>
                </ul>
            `,
            exercises: [
                {
                    id: "clcf-summary-1",
                    title: "Mixed Review",
                    instructions: "Test your control flow knowledge.",
                    items: [
                        {
                            type: "radio",
                            label: "Use for loop when...",
                            options: [
                                { value: "a", label: "You know how many times to repeat" },
                                { value: "b", label: "You want to make a decision" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Use while loop when...",
                            options: [
                                { value: "a", label: "You know the exact count" },
                                { value: "b", label: "You repeat until a condition changes" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "What does break do?",
                            options: [
                                { value: "a", label: "Stops the loop immediately" },
                                { value: "b", label: "Skips to next iteration" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "When would you use if/else?",
            options: [
                { value: "a", label: "To repeat code multiple times" },
                { value: "b", label: "To make a decision based on a condition" },
                { value: "c", label: "To declare a variable" },
            ],
            correctAnswer: "b",
            explanation: "if/else handles conditional logic. Loops handle repetition.",
        },
        {
            id: "q2",
            question: "What does break do in a loop?",
            options: [
                { value: "a", label: "Skips the current iteration" },
                { value: "b", label: "Stops the loop completely" },
                { value: "c", label: "Starts the loop over" },
            ],
            correctAnswer: "b",
            explanation: "break exits the loop. continue skips the current iteration.",
        },
        {
            id: "q3",
            question: "What does this print? for (let i = 0; i < 3; i++) { console.log(i); }",
            options: [
                { value: "a", label: "0, 1, 2" },
                { value: "b", label: "1, 2, 3" },
                { value: "c", label: "0, 1, 2, 3" },
            ],
            correctAnswer: "a",
            explanation: "i starts at 0 and goes up to 2 (stops before 3).",
        },
        {
            id: "q4",
            question: "What does array.map() do?",
            options: [
                { value: "a", label: "Filters the array" },
                { value: "b", label: "Transforms each element into a new array" },
                { value: "c", label: "Adds elements to the array" },
            ],
            correctAnswer: "b",
            explanation: "map transforms each element. filter selects elements. reduce combines them.",
        },
    ],
};
