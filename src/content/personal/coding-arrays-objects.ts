import type { InteractiveGuideContent } from "@/types/activity";

export const codingArraysObjectsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Arrays & Objects: Organizing Complex Data",
            icon: "📦",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Variables store single values. But what if you need to store many values together? Arrays and objects let you organize complex data. These are essential for real-world programs!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Every real application works with collections of data: lists of users, products, messages. Master arrays and objects and you can handle any data structure.</p>
            `,
            exercises: [
                {
                    id: "cao-intro-1",
                    title: "Quick Check: Collections",
                    instructions: "What do arrays and objects do?",
                    items: [
                        {
                            type: "radio",
                            label: "What is an array?",
                            options: [
                                { value: "right", label: "An ordered list of values" },
                                { value: "wrong", label: "A mathematical formula" },
                            ],
                            expectedAnswer: "right",
                        },
                        {
                            type: "radio",
                            label: "What is an object?",
                            options: [
                                { value: "right", label: "Key-value pairs that organize data" },
                                { value: "wrong", label: "A type of number" },
                            ],
                            expectedAnswer: "right",
                        },
                    ],
                },
            ],
        },

        // Arrays
        {
            id: "arrays",
            stepNumber: 1,
            title: "Arrays: Ordered Lists",
            icon: "📋",
            explanation: `
                <h3>What Are Arrays?</h3>
                <p>Arrays store multiple values in a specific order. Access elements by their index (position).</p>

                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: white;">
                    <h4 style="margin: 0 0 1rem 0; text-align: center;">Array Index Visualization</h4>
                    <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <div style="background: rgba(255,255,255,0.3); padding: 1rem; border-radius: 0.5rem; width: 80px;">
                                <div style="font-size: 1.5rem; font-weight: bold;">🔴</div>
                                <div style="font-size: 0.8rem; margin-top: 0.5rem;">red</div>
                            </div>
                            <div style="font-size: 0.75rem; margin-top: 0.5rem; background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem; width: fit-content; margin-left: auto; margin-right: auto;">Index 0</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="background: rgba(255,255,255,0.3); padding: 1rem; border-radius: 0.5rem; width: 80px;">
                                <div style="font-size: 1.5rem; font-weight: bold;">🟢</div>
                                <div style="font-size: 0.8rem; margin-top: 0.5rem;">green</div>
                            </div>
                            <div style="font-size: 0.75rem; margin-top: 0.5rem; background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem; width: fit-content; margin-left: auto; margin-right: auto;">Index 1</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="background: rgba(255,255,255,0.3); padding: 1rem; border-radius: 0.5rem; width: 80px;">
                                <div style="font-size: 1.5rem; font-weight: bold;">🔵</div>
                                <div style="font-size: 0.8rem; margin-top: 0.5rem;">blue</div>
                            </div>
                            <div style="font-size: 0.75rem; margin-top: 0.5rem; background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem; width: fit-content; margin-left: auto; margin-right: auto;">Index 2</div>
                        </div>
                    </div>
                    <p style="margin: 1rem 0 0 0; text-align: center; font-size: 0.9rem;">💡 First item is always index 0!</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Creating Arrays",
                    description: "Initialize with values or empty",
                    examples: [
                        {
                            sentence: `const colors = ['red', 'green', 'blue'];`,
                            explanation:
                                "Array with three strings. Square brackets [ ] create arrays.",
                        },
                        {
                            sentence: `const numbers = [1, 2, 3, 4, 5];`,
                            explanation: "Array with numbers.",
                        },
                        {
                            sentence: `const mixed = [1, 'hello', true, null];`,
                            explanation:
                                "Arrays can mix types. Not recommended, but possible.",
                        },
                        {
                            sentence: `const empty = [];`,
                            explanation: "Empty array. Add items later.",
                        },
                    ],
                },
                {
                    title: "Accessing Elements",
                    description: "Use index to get or set values",
                    examples: [
                        {
                            sentence: `const colors = ['red', 'green', 'blue'];
console.log(colors[0]); // 'red' - first element`,
                            explanation:
                                "Arrays are 0-indexed! First item is at index 0.",
                        },
                        {
                            sentence: `console.log(colors[2]); // 'blue' - third element`,
                            explanation: "Index 2 is the third element.",
                        },
                        {
                            sentence: `colors[1] = 'yellow';
// Now: ['red', 'yellow', 'blue']`,
                            explanation: "Change array elements by index.",
                        },
                    ],
                },
                {
                    title: "Array Length",
                    description: "How many items in the array",
                    examples: [
                        {
                            sentence: `const colors = ['red', 'green', 'blue'];
console.log(colors.length); // 3`,
                            explanation: "length property tells you the number of elements.",
                        },
                        {
                            sentence: `const lastColor = colors[colors.length - 1];
// Gets the last element ('blue')`,
                            explanation:
                                "Use length - 1 to get the last element. Very common pattern!",
                        },
                    ],
                },
                {
                    title: "Array Methods",
                    description: "Built-in functions for working with arrays",
                    examples: [
                        {
                            sentence: `const items = [1, 2, 3];
items.push(4); // Add to end - [1, 2, 3, 4]`,
                            explanation: "push adds to the end.",
                        },
                        {
                            sentence: `items.pop(); // Remove last - [1, 2, 3]`,
                            explanation: "pop removes the last element.",
                        },
                        {
                            sentence: `items.shift(); // Remove first - [2, 3]`,
                            explanation: "shift removes from the beginning.",
                        },
                        {
                            sentence: `items.unshift(0); // Add to beginning - [0, 2, 3]`,
                            explanation: "unshift adds to the start.",
                        },
                        {
                            sentence: `const index = items.indexOf(2); // 1`,
                            explanation: "indexOf finds where an element is.",
                        },
                        {
                            sentence: `const has3 = items.includes(3); // true`,
                            explanation: "includes checks if element exists.",
                        },
                        {
                            sentence: `const doubled = items.map(x => x * 2); // [4, 6]`,
                            explanation: "map transforms each element.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cao-array-1",
                    title: "Array Basics",
                    instructions: "Answer these questions.",
                    items: [
                        {
                            type: "text",
                            label: `const arr = [10, 20, 30];
arr[0] = ?`,
                            correctAnswer: "10",
                            expectedAnswers: ["10"],
                        },
                        {
                            type: "text",
                            label: `const arr = ['a', 'b', 'c'];
arr.length = ?`,
                            correctAnswer: "3",
                            expectedAnswers: ["3"],
                        },
                        {
                            type: "text",
                            label: `const arr = [1, 2, 3];
arr[arr.length - 1] = ?`,
                            correctAnswer: "3",
                            expectedAnswers: ["3"],
                        },
                    ],
                },
                {
                    id: "cao-array-2",
                    title: "Array Methods",
                    instructions: "What does each method do?",
                    items: [
                        {
                            type: "radio",
                            label: "[1, 2, 3].push(4) returns...",
                            options: [
                                { value: "a", label: "The new length: 4" },
                                { value: "b", label: "[1, 2, 3, 4]" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "[1, 2, 3].pop() returns...",
                            options: [
                                { value: "a", label: "3 (the removed element)" },
                                { value: "b", label: "[1, 2]" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Objects
        {
            id: "objects",
            stepNumber: 2,
            title: "Objects: Key-Value Pairs",
            icon: "🔑",
            explanation: `
                <h3>What Are Objects?</h3>
                <p>Objects store data as key-value pairs. Use keys to access values by name instead of position.</p>

                <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: white;">
                    <h4 style="margin: 0 0 1rem 0; text-align: center;">Object Structure</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem;">
                            <h5 style="margin: 0 0 0.75rem 0; font-size: 0.9rem;">Key (Property)</h5>
                            <div style="background: rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.9rem;">name</div>
                            <div style="background: rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.9rem; margin-top: 0.5rem;">age</div>
                            <div style="background: rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.9rem; margin-top: 0.5rem;">email</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem;">
                            <h5 style="margin: 0 0 0.75rem 0; font-size: 0.9rem;">Value (Data)</h5>
                            <div style="background: rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.9rem;">'Alice'</div>
                            <div style="background: rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.9rem; margin-top: 0.5rem;">25</div>
                            <div style="background: rgba(255,255,255,0.3); padding: 0.75rem; border-radius: 0.25rem; font-size: 0.9rem; margin-top: 0.5rem;">alice@email.com</div>
                        </div>
                    </div>
                    <p style="margin: 1rem 0 0 0; text-align: center; font-size: 0.9rem;">💡 Access by key name, not position!</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Creating Objects",
                    description: "Initialize with properties",
                    examples: [
                        {
                            sentence: `const user = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
};`,
                            explanation:
                                "Curly braces { } create objects. Each property has a key and value.",
                        },
                        {
                            sentence: `const car = {
  brand: 'Toyota',
  model: 'Camry',
  year: 2023,
  isElectric: false
};`,
                            explanation: "Objects can have different value types.",
                        },
                        {
                            sentence: `const empty = {};`,
                            explanation: "Empty object. Add properties later.",
                        },
                    ],
                },
                {
                    title: "Accessing Properties",
                    description: "Two ways to get values",
                    examples: [
                        {
                            sentence: `const user = { name: 'Alice', age: 25 };
console.log(user.name); // 'Alice' - dot notation`,
                            explanation: "Dot notation: object.property",
                        },
                        {
                            sentence: `console.log(user['age']); // 25 - bracket notation`,
                            explanation:
                                "Bracket notation: object['property']. Useful for dynamic keys.",
                        },
                        {
                            sentence: `const key = 'age';
console.log(user[key]); // 25 - using variable`,
                            explanation: "With brackets, you can use a variable as the key.",
                        },
                    ],
                },
                {
                    title: "Modifying Properties",
                    description: "Change or add properties",
                    examples: [
                        {
                            sentence: `const user = { name: 'Alice' };
user.name = 'Bob'; // Change existing`,
                            explanation: "Change a property by assigning a new value.",
                        },
                        {
                            sentence: `user.age = 25; // Add new property`,
                            explanation:
                                "You can add new properties anytime. No pre-declaration needed!",
                        },
                        {
                            sentence: `delete user.age; // Remove property`,
                            explanation: "delete removes a property.",
                        },
                    ],
                },
                {
                    title: "Object Methods",
                    description: "Functions inside objects",
                    examples: [
                        {
                            sentence: `const user = {
  name: 'Alice',
  greet: function() {
    return 'Hello, ' + this.name;
  }
};
user.greet(); // 'Hello, Alice'`,
                            explanation:
                                "Methods are functions inside objects. this refers to the object.",
                        },
                        {
                            sentence: `const user = {
  name: 'Alice',
  greet() { // Shorthand syntax
    return 'Hello, ' + this.name;
  }
};`,
                            explanation: "Modern syntax without 'function' keyword.",
                        },
                        {
                            sentence: `const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};`,
                            explanation: "Multiple methods in one object.",
                        },
                    ],
                },
                {
                    title: "Looping Through Objects",
                    description: "Iterate over properties",
                    examples: [
                        {
                            sentence: `const user = { name: 'Alice', age: 25 };
for (const key in user) {
  console.log(key + ': ' + user[key]);
}
// name: Alice
// age: 25`,
                            explanation:
                                "for...in loop gives you the keys. Use key to access values.",
                        },
                        {
                            sentence: `Object.keys(user); // ['name', 'age']`,
                            explanation: "Get all keys as an array.",
                        },
                        {
                            sentence: `Object.values(user); // ['Alice', 25]`,
                            explanation: "Get all values as an array.",
                        },
                        {
                            sentence: `Object.entries(user); // [['name', 'Alice'], ['age', 25]]`,
                            explanation: "Get [key, value] pairs as an array.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cao-obj-1",
                    title: "Object Basics",
                    instructions: "Answer these questions.",
                    items: [
                        {
                            type: "text",
                            label: `const user = { name: 'Bob', age: 30 };
user.name = ?`,
                            correctAnswer: "Bob",
                            expectedAnswers: ["Bob", "'Bob'"],
                        },
                        {
                            type: "text",
                            label: `const user = { name: 'Bob', age: 30 };
user.city = 'NYC'; // What happens?`,
                            correctAnswer: "New property 'city' is added",
                            expectedAnswers: ["New property added", "city property added", "new property"],
                        },
                    ],
                },
                {
                    id: "cao-obj-2",
                    title: "Object Keys and Values",
                    instructions: "What do these return?",
                    items: [
                        {
                            type: "text",
                            label: `Object.keys({ a: 1, b: 2, c: 3 })`,
                            correctAnswer: "['a', 'b', 'c']",
                            expectedAnswers: ["['a', 'b', 'c']", "a, b, c"],
                        },
                        {
                            type: "text",
                            label: `Object.values({ a: 1, b: 2 })`,
                            correctAnswer: "[1, 2]",
                            expectedAnswers: ["[1, 2]", "1, 2"],
                        },
                    ],
                },
            ],
        },

        // Arrays of Objects
        {
            id: "complex-data",
            stepNumber: 3,
            title: "Combining Arrays & Objects",
            icon: "🎯",
            explanation: `
                <h3>Real-World Data Structures</h3>
                <p>Most real applications use arrays of objects. A list of users, products, messages, etc.</p>
            `,
            usageMeanings: [
                {
                    title: "Array of Objects",
                    description: "Common real-world pattern",
                    examples: [
                        {
                            sentence: `const users = [
  { name: 'Alice', age: 25, role: 'admin' },
  { name: 'Bob', age: 30, role: 'user' },
  { name: 'Charlie', age: 22, role: 'user' }
];`,
                            explanation:
                                "Array of user objects. Each object has properties.",
                        },
                        {
                            sentence: `console.log(users[0].name); // 'Alice'`,
                            explanation: "Access: array index, then dot notation.",
                        },
                        {
                            sentence: `const admins = users.filter(u => u.role === 'admin');`,
                            explanation: "Filter to get specific users.",
                        },
                        {
                            sentence: `const names = users.map(u => u.name);
// ['Alice', 'Bob', 'Charlie']`,
                            explanation: "Extract just the names.",
                        },
                    ],
                },
                {
                    title: "Object with Nested Objects",
                    description: "Objects containing other objects",
                    examples: [
                        {
                            sentence: `const user = {
  name: 'Alice',
  address: {
    street: '123 Main St',
    city: 'NYC'
  },
  contact: {
    email: 'alice@example.com',
    phone: '555-1234'
  }
};`,
                            explanation: "Nested objects organize related data.",
                        },
                        {
                            sentence: `console.log(user.address.city); // 'NYC'`,
                            explanation: "Access nested properties with multiple dots.",
                        },
                    ],
                },
                {
                    title: "Destructuring (Modern)",
                    description: "Extract values cleanly",
                    examples: [
                        {
                            sentence: `const user = { name: 'Alice', age: 25, role: 'admin' };
const { name, age } = user;
// name = 'Alice', age = 25`,
                            explanation:
                                "Destructuring pulls out specific properties. Very clean!",
                        },
                        {
                            sentence: `const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]`,
                            explanation:
                                "Destructuring works with arrays too. ...rest captures the rest.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cao-complex-1",
                    title: "Array of Objects Access",
                    instructions: "Access the data correctly.",
                    items: [
                        {
                            type: "text",
                            label: `const users = [{name: 'Alice'}, {name: 'Bob'}];
users[0].name = ?`,
                            correctAnswer: "Alice",
                            expectedAnswers: ["Alice", "'Alice'"],
                        },
                    ],
                },
                {
                    id: "cao-complex-2",
                    title: "Destructuring",
                    instructions: "What do these assign?",
                    items: [
                        {
                            type: "text",
                            label: `const { a, b } = { a: 1, b: 2, c: 3 };
a = ?`,
                            correctAnswer: "1",
                            expectedAnswers: ["1"],
                        },
                    ],
                },
            ],
        },

        // Common Mistakes
        {
            id: "common-mistakes",
            stepNumber: 4,
            title: "Common Array & Object Mistakes",
            icon: "⚠️",
            explanation: `
                <h3>Watch Out For These!</h3>
                <p>Easy mistakes when working with arrays and objects.</p>
            `,
            usageMeanings: [
                {
                    title: "❌ Forgetting Array Index Starts at 0",
                    description: "Off-by-one errors are common",
                    examples: [
                        {
                            sentence: "❌ const first = arr[1]; ✓ const first = arr[0];",
                            explanation:
                                "WRONG: arr[1] is the second element. CORRECT: arr[0] is first.",
                        },
                    ],
                },
                {
                    title: "❌ Confusing Array and Object",
                    description: "Similar syntax, different purpose",
                    examples: [
                        {
                            sentence: `const arr = [1, 2, 3];
const obj = { a: 1, b: 2 };
arr[0]; // 1
obj.a; // 1`,
                            explanation:
                                "Array uses index [0]. Object uses property name .a.",
                        },
                    ],
                },
                {
                    title: "❌ Mutating When You Should Copy",
                    description: "Arrays and objects are references",
                    examples: [
                        {
                            sentence: `const original = [1, 2, 3];
const copy = original;
copy[0] = 99;
console.log(original[0]); // 99! (both point to same array)`,
                            explanation:
                                "Assignment just copies the reference, not the data!",
                        },
                        {
                            sentence: `const copy = [...original]; // Spread operator
copy[0] = 99;
console.log(original[0]); // 1 (safe now!)`,
                            explanation: "Use spread operator or .slice() to create true copy.",
                        },
                    ],
                },
                {
                    title: "❌ Comparing Objects/Arrays",
                    description: "Comparison compares references, not contents",
                    examples: [
                        {
                            sentence: `const obj1 = { a: 1 };
const obj2 = { a: 1 };
obj1 === obj2; // false! (different objects)`,
                            explanation:
                                "Even with same contents, different objects aren't equal.",
                        },
                        {
                            sentence: `JSON.stringify(obj1) === JSON.stringify(obj2); // true`,
                            explanation: "Compare contents this way, not with ===.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cao-mistakes-1",
                    title: "Spot the Error",
                    instructions: "Which code is wrong?",
                    items: [
                        {
                            type: "radio",
                            label: "Getting first array element:",
                            options: [
                                { value: "wrong", label: "const first = arr[1];" },
                                { value: "right", label: "const first = arr[0];" },
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
            stepNumber: 5,
            title: "Arrays & Objects Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Arrays:</strong> Ordered lists accessed by index (0, 1, 2, ...)</li>
                    <li><strong>Objects:</strong> Key-value pairs accessed by property name</li>
                    <li><strong>Array methods:</strong> push, pop, map, filter, reduce, etc.</li>
                    <li><strong>Object methods:</strong> keys, values, entries, Object static methods</li>
                    <li><strong>Complex data:</strong> Combine arrays and objects for real-world structures</li>
                    <li><strong>Beware references:</strong> Copying arrays/objects copies the reference, not the data</li>
                    <li><strong>Destructuring:</strong> Modern syntax to extract values cleanly</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cao-summary-1",
                    title: "Mixed Review",
                    instructions: "Test your array and object knowledge.",
                    items: [
                        {
                            type: "radio",
                            label: "Arrays use ____ to access elements:",
                            options: [
                                { value: "a", label: "Index numbers (0, 1, 2...)" },
                                { value: "b", label: "Property names" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Objects use ____ to access values:",
                            options: [
                                { value: "a", label: "Index numbers" },
                                { value: "b", label: "Property names (keys)" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "[1, 2, 3][0] returns:",
                            options: [
                                { value: "a", label: "0" },
                                { value: "b", label: "1" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "What is the first index in an array?",
            options: [
                { value: "a", label: "0" },
                { value: "b", label: "1" },
                { value: "c", label: "It depends" },
            ],
            correctAnswer: "a",
            explanation: "Arrays are 0-indexed. The first element is always at index 0.",
        },
        {
            id: "q2",
            question: "What does this return? const arr = [1, 2, 3]; arr[1]",
            options: [
                { value: "a", label: "1" },
                { value: "b", label: "2" },
                { value: "c", label: "3" },
            ],
            correctAnswer: "b",
            explanation: "Index 1 is the second element. arr[0] = 1, arr[1] = 2, arr[2] = 3.",
        },
        {
            id: "q3",
            question: "How do you access an object property?",
            options: [
                { value: "a", label: "object[0]" },
                { value: "b", label: "object.propertyName" },
                { value: "c", label: "object(propertyName)" },
            ],
            correctAnswer: "b",
            explanation: "Use dot notation for objects: object.propertyName",
        },
        {
            id: "q4",
            question: "What does array.push() do?",
            options: [
                { value: "a", label: "Removes the last element" },
                { value: "b", label: "Adds an element to the end" },
                { value: "c", label: "Returns the first element" },
            ],
            correctAnswer: "b",
            explanation: "push adds to the end. pop removes from the end.",
        },
    ],
};
