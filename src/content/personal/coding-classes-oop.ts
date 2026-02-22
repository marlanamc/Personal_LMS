import type { InteractiveGuideContent } from "@/types/activity";

export const codingClassesOopContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Classes & OOP: Organize Your Code",
            icon: "🏗️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Object-Oriented Programming (OOP) is a way to organize code into reusable blueprints called classes. Think of classes as cookie cutters and objects as the cookies!</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul>
                    <li>What OOP is and why it matters</li>
                    <li>Creating classes with constructors</li>
                    <li>Methods and properties</li>
                    <li>The mysterious <code>this</code> keyword</li>
                    <li>Inheritance with extends</li>
                    <li>Static members and getters/setters</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cco-intro-1",
                    title: "OOP Concept",
                    instructions: "What is a class?",
                    items: [
                        {
                            type: "radio",
                            label: "A class is:",
                            options: [
                                { value: "blueprint", label: "A blueprint for creating objects" },
                                { value: "variable", label: "A type of variable" },
                            ],
                            expectedAnswer: "blueprint",
                        },
                    ],
                },
            ],
        },

        // What is OOP
        {
            id: "what-is-oop",
            stepNumber: 1,
            title: "What is OOP?",
            icon: "💡",
            explanation: `
                <h3>Object-Oriented Programming</h3>
                <p>OOP organizes code around <strong>objects</strong> - bundles of related data and functions. It's like organizing a kitchen: utensils go in one drawer, pots in another.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: rgba(239, 68, 68, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #ef4444;">❌ Without OOP</h4>
                        <pre style="margin: 0; font-size: 0.8rem; color: #1f2937;">
const userName = 'Alice';
const userAge = 25;
function greetUser() { ... }
function getUserAge() { ... }
// Variables and functions everywhere!</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: rgba(34, 197, 94, 0.1); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
                        <h4 style="margin-top: 0; color: #22c55e;">✅ With OOP</h4>
                        <pre style="margin: 0; font-size: 0.8rem; color: #1f2937;">
const user = new User('Alice', 25);
user.greet();
user.age;
// Everything organized in one object!</pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🧱 The Four Pillars of OOP",
                    description: "Core concepts of object-oriented design",
                    examples: [
                        {
                            sentence: "Encapsulation - Bundle data and methods together",
                            explanation: "User object contains name, age, AND methods to work with them.",
                        },
                        {
                            sentence: "Abstraction - Hide complexity, expose simple interface",
                            explanation: "user.save() works without knowing database details.",
                        },
                        {
                            sentence: "Inheritance - Child classes inherit from parents",
                            explanation: "Admin extends User, gets all User features plus more.",
                        },
                        {
                            sentence: "Polymorphism - Same interface, different behavior",
                            explanation: "Both Dog and Cat have speak(), but sound different.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cco-oop-1",
                    title: "OOP Concepts",
                    instructions: "Match the concept:",
                    items: [
                        {
                            type: "select",
                            label: "Hiding internal complexity from users",
                            options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
                            expectedAnswer: "Abstraction",
                        },
                        {
                            type: "select",
                            label: "Child class gets parent's features",
                            options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
                            expectedAnswer: "Inheritance",
                        },
                    ],
                },
            ],
        },

        // Class Syntax
        {
            id: "class-syntax",
            stepNumber: 2,
            title: "Creating Classes",
            icon: "📝",
            explanation: `
                <h3>Class Syntax</h3>
                <p>A class defines the structure of objects. The <code>constructor</code> runs when creating new instances.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
class User {
    constructor(name, age) {
        this.name = name;  // Instance property
        this.age = age;
    }

    greet() {  // Instance method
        return \`Hi, I'm \${this.name}!\`;
    }
}

const alice = new User('Alice', 25);
console.log(alice.greet()); // "Hi, I'm Alice!"</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🏭 constructor()",
                    description: "Special method that runs when creating instances",
                    examples: [
                        {
                            sentence: "constructor(name) { this.name = name; }",
                            explanation: "Set up the object with initial values.",
                        },
                        {
                            sentence: "const user = new User('Alice');",
                            explanation: "The 'new' keyword triggers the constructor.",
                        },
                        {
                            sentence: "constructor() { } // Optional - default if omitted",
                            explanation: "Empty constructor created automatically if not defined.",
                        },
                    ],
                },
                {
                    title: "🔧 Methods",
                    description: "Functions that belong to the class",
                    examples: [
                        {
                            sentence: "greet() { return `Hello, ${this.name}`; }",
                            explanation: "No 'function' keyword needed in classes.",
                        },
                        {
                            sentence: "user.greet(); // Call the method",
                            explanation: "Methods are called on instances.",
                        },
                    ],
                },
                {
                    title: "📦 Properties",
                    description: "Data stored on instances",
                    examples: [
                        {
                            sentence: "this.name = name; // Set in constructor",
                            explanation: "Properties are set using 'this'.",
                        },
                        {
                            sentence: "user.name; // Access property",
                            explanation: "Read properties with dot notation.",
                        },
                        {
                            sentence: "user.name = 'Bob'; // Modify property",
                            explanation: "Properties can be changed after creation.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cco-syntax-1",
                    title: "Class Syntax",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "To create a new instance, use:",
                            options: [
                                { value: "new", label: "new ClassName()" },
                                { value: "create", label: "ClassName.create()" },
                            ],
                            expectedAnswer: "new",
                        },
                        {
                            type: "radio",
                            label: "The constructor runs:",
                            options: [
                                { value: "create", label: "When creating a new instance" },
                                { value: "method", label: "When calling any method" },
                            ],
                            expectedAnswer: "create",
                        },
                    ],
                },
            ],
        },

        // The this Keyword
        {
            id: "this-keyword",
            stepNumber: 3,
            title: "The 'this' Keyword",
            icon: "👆",
            explanation: `
                <h3>Understanding 'this'</h3>
                <p><code>this</code> refers to the current instance of the class. It's how methods access the object's own data.</p>

                <div class="diagram-surface-light" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; color: #1f2937;">
                    <h4 style="margin-top: 0; color: #d97757;">⚠️ Common Gotcha</h4>
                    <p style="margin: 0.5rem 0;">'this' can change depending on HOW a function is called!</p>
                    <pre style="margin: 0.5rem 0; font-size: 0.85rem; background: rgba(0,0,0,0.05); padding: 0.75rem; border-radius: 0.5rem;">
// Problem: 'this' is lost
const greet = user.greet;
greet(); // 'this' is undefined!

// Solution 1: Arrow function
button.onclick = () => user.greet();

// Solution 2: bind()
button.onclick = user.greet.bind(user);</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "✅ When 'this' Works",
                    description: "Calling method directly on object",
                    examples: [
                        {
                            sentence: "user.greet(); // 'this' = user",
                            explanation: "Method called with dot notation - 'this' is the object before the dot.",
                        },
                        {
                            sentence: "class User { greet() { console.log(this.name); } }",
                            explanation: "Inside class methods, 'this' is the instance.",
                        },
                    ],
                },
                {
                    title: "❌ When 'this' Breaks",
                    description: "Common situations where 'this' is wrong",
                    examples: [
                        {
                            sentence: "const greet = user.greet; greet();",
                            explanation: "Extracting method loses 'this' context.",
                        },
                        {
                            sentence: "setTimeout(user.greet, 1000);",
                            explanation: "Callbacks lose 'this' - use arrow function instead.",
                        },
                        {
                            sentence: "array.forEach(user.process);",
                            explanation: "Passing method as callback loses 'this'.",
                        },
                    ],
                },
                {
                    title: "🔧 Fixing 'this'",
                    description: "Ways to preserve 'this' context",
                    examples: [
                        {
                            sentence: "setTimeout(() => user.greet(), 1000);",
                            explanation: "Arrow functions preserve outer 'this'.",
                        },
                        {
                            sentence: "setTimeout(user.greet.bind(user), 1000);",
                            explanation: "bind() locks 'this' to a specific value.",
                        },
                        {
                            sentence: "greet = () => { console.log(this.name); }",
                            explanation: "Arrow function as class property preserves 'this'.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Pro Tip",
                content:
                    "When in doubt, use arrow functions for callbacks and event handlers. They automatically preserve 'this' from the surrounding code.",
            },
            exercises: [
                {
                    id: "cco-this-1",
                    title: "'this' Understanding",
                    instructions: "What does 'this' refer to?",
                    items: [
                        {
                            type: "radio",
                            label: "Inside user.greet(), 'this' is:",
                            options: [
                                { value: "user", label: "The user object" },
                                { value: "window", label: "The window object" },
                            ],
                            expectedAnswer: "user",
                        },
                        {
                            type: "radio",
                            label: "To fix 'this' in callbacks, use:",
                            options: [
                                { value: "arrow", label: "Arrow functions or bind()" },
                                { value: "var", label: "var instead of const" },
                            ],
                            expectedAnswer: "arrow",
                        },
                    ],
                },
            ],
        },

        // Inheritance
        {
            id: "inheritance",
            stepNumber: 4,
            title: "Inheritance with extends",
            icon: "🌳",
            explanation: `
                <h3>Building on Existing Classes</h3>
                <p>Use <code>extends</code> to create a child class that inherits from a parent. The child gets all parent features plus its own.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        console.log(\`\${this.name} makes a sound\`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    speak() {  // Override parent method
        console.log(\`\${this.name} barks!\`);
    }
}

const rex = new Dog('Rex', 'German Shepherd');
rex.speak();  // "Rex barks!"</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔗 extends Keyword",
                    description: "Create a child class",
                    examples: [
                        {
                            sentence: "class Dog extends Animal { }",
                            explanation: "Dog inherits all of Animal's properties and methods.",
                        },
                        {
                            sentence: "dog instanceof Animal // true",
                            explanation: "Child instances are also instances of parent.",
                        },
                    ],
                },
                {
                    title: "📞 super() - Call Parent",
                    description: "Access parent class features",
                    examples: [
                        {
                            sentence: "super(name); // Call parent constructor",
                            explanation: "MUST be called first in child constructor.",
                        },
                        {
                            sentence: "super.speak(); // Call parent method",
                            explanation: "Run the parent's version of a method.",
                        },
                    ],
                },
                {
                    title: "🔄 Method Overriding",
                    description: "Replace parent methods with child versions",
                    examples: [
                        {
                            sentence: "speak() { console.log(`${this.name} barks!`); }",
                            explanation: "Define same method name to override.",
                        },
                        {
                            sentence: "speak() { super.speak(); console.log('Woof!'); }",
                            explanation: "Extend parent behavior instead of replacing.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cco-inherit-1",
                    title: "Inheritance",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "To inherit from a class, use:",
                            options: [
                                { value: "extends", label: "extends" },
                                { value: "inherits", label: "inherits" },
                            ],
                            expectedAnswer: "extends",
                        },
                        {
                            type: "radio",
                            label: "In a child constructor, super() must be:",
                            options: [
                                { value: "first", label: "Called first, before using 'this'" },
                                { value: "last", label: "Called last" },
                            ],
                            expectedAnswer: "first",
                        },
                    ],
                },
            ],
        },

        // Static Members
        {
            id: "static-members",
            stepNumber: 5,
            title: "Static Methods & Properties",
            icon: "🔒",
            explanation: `
                <h3>Class-Level vs Instance-Level</h3>
                <p>Static members belong to the <strong>class itself</strong>, not to instances. Call them without creating an object.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">Instance Members</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
const user = new User();
user.name;      // Instance property
user.greet();   // Instance method</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">Static Members</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
User.count;        // Static property
User.fromJSON({}); // Static method
// No instance needed!</pre>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔧 Static Methods",
                    description: "Utility functions that don't need instance data",
                    examples: [
                        {
                            sentence: "static fromJSON(json) { return new User(json.name, json.age); }",
                            explanation: "Factory method - creates instances from data.",
                        },
                        {
                            sentence: "User.fromJSON({ name: 'Alice' })",
                            explanation: "Call on the class, not an instance.",
                        },
                        {
                            sentence: "Math.random(), Array.isArray()",
                            explanation: "Built-in static methods you already use!",
                        },
                    ],
                },
                {
                    title: "📊 Static Properties",
                    description: "Shared data across all instances",
                    examples: [
                        {
                            sentence: "static count = 0; constructor() { User.count++; }",
                            explanation: "Track how many users were created.",
                        },
                        {
                            sentence: "static MAX_AGE = 150;",
                            explanation: "Constants that apply to the whole class.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cco-static-1",
                    title: "Static vs Instance",
                    instructions: "How would you call these?",
                    items: [
                        {
                            type: "radio",
                            label: "Call a static method:",
                            options: [
                                { value: "class", label: "ClassName.method()" },
                                { value: "instance", label: "instance.method()" },
                            ],
                            expectedAnswer: "class",
                        },
                        {
                            type: "radio",
                            label: "Math.random() is:",
                            options: [
                                { value: "static", label: "A static method" },
                                { value: "instance", label: "An instance method" },
                            ],
                            expectedAnswer: "static",
                        },
                    ],
                },
            ],
        },

        // Getters and Setters
        {
            id: "getters-setters",
            stepNumber: 6,
            title: "Getters & Setters",
            icon: "🎛️",
            explanation: `
                <h3>Computed Properties</h3>
                <p>Getters and setters let you define properties that compute values or run code when accessed.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
class Circle {
    constructor(radius) {
        this._radius = radius;  // Convention: _ for "private"
    }

    get area() {  // Computed on access
        return Math.PI * this._radius ** 2;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {  // Validation on set
        if (value < 0) throw new Error('Radius must be positive');
        this._radius = value;
    }
}

const c = new Circle(5);
console.log(c.area);    // 78.54... (no parentheses!)
c.radius = 10;          // Calls the setter</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📖 get - Computed Properties",
                    description: "Calculate values when accessed",
                    examples: [
                        {
                            sentence: "get fullName() { return `${this.first} ${this.last}`; }",
                            explanation: "Combine properties on the fly.",
                        },
                        {
                            sentence: "user.fullName // Access like a property, no ()",
                            explanation: "Looks like a property, works like a method.",
                        },
                        {
                            sentence: "get age() { return new Date().getFullYear() - this.birthYear; }",
                            explanation: "Always returns current age.",
                        },
                    ],
                },
                {
                    title: "✏️ set - Validation & Side Effects",
                    description: "Run code when setting a value",
                    examples: [
                        {
                            sentence: "set age(value) { if (value < 0) throw new Error('Invalid'); this._age = value; }",
                            explanation: "Validate before storing.",
                        },
                        {
                            sentence: "user.age = 25; // Triggers the setter",
                            explanation: "Assignment runs the setter function.",
                        },
                        {
                            sentence: "set theme(value) { this._theme = value; this.updateUI(); }",
                            explanation: "Trigger side effects on change.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 _ Convention",
                content:
                    "Properties starting with _ (like _radius) are conventionally 'private' - not truly private, just a signal to other developers not to access directly. Use getters/setters for the public interface.",
            },
            exercises: [
                {
                    id: "cco-getset-1",
                    title: "Getters & Setters",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "To access a getter, you:",
                            options: [
                                { value: "no", label: "Don't use parentheses - obj.getter" },
                                { value: "yes", label: "Use parentheses - obj.getter()" },
                            ],
                            expectedAnswer: "no",
                        },
                        {
                            type: "radio",
                            label: "Setters are useful for:",
                            options: [
                                { value: "validate", label: "Validation before storing values" },
                                { value: "speed", label: "Making code faster" },
                            ],
                            expectedAnswer: "validate",
                        },
                    ],
                },
            ],
        },

        // Private Fields
        {
            id: "private-fields",
            stepNumber: 7,
            title: "Private Fields (Modern JS)",
            icon: "🔐",
            explanation: `
                <h3>True Privacy with #</h3>
                <p>Modern JavaScript supports truly private fields using the <code>#</code> prefix. These can't be accessed from outside the class at all!</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
class BankAccount {
    #balance = 0;  // Private field - truly inaccessible outside

    deposit(amount) {
        if (amount > 0) this.#balance += amount;
    }

    get balance() {
        return this.#balance;  // Read-only access through getter
    }
}

const account = new BankAccount();
account.deposit(100);
console.log(account.balance);  // 100
console.log(account.#balance); // SyntaxError! Can't access private</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔒 Private Fields",
                    description: "Truly encapsulated data",
                    examples: [
                        {
                            sentence: "#secretData = 'hidden';",
                            explanation: "Declare with # prefix.",
                        },
                        {
                            sentence: "this.#secretData // Only inside the class",
                            explanation: "Access with # from class methods.",
                        },
                        {
                            sentence: "obj.#secretData // SyntaxError",
                            explanation: "Cannot access from outside - true privacy!",
                        },
                    ],
                },
                {
                    title: "🔐 Private Methods",
                    description: "Internal helper functions",
                    examples: [
                        {
                            sentence: "#validate(data) { ... }",
                            explanation: "Private helper method.",
                        },
                        {
                            sentence: "save() { if (this.#validate()) { ... } }",
                            explanation: "Only called internally.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "cco-private-1",
                    title: "Private Fields",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "Private fields are declared with:",
                            options: [
                                { value: "hash", label: "#fieldName" },
                                { value: "private", label: "private fieldName" },
                            ],
                            expectedAnswer: "hash",
                        },
                        {
                            type: "radio",
                            label: "Private fields can be accessed:",
                            options: [
                                { value: "inside", label: "Only inside the class" },
                                { value: "anywhere", label: "From anywhere" },
                            ],
                            expectedAnswer: "inside",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "Classes & OOP Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Classes</strong> are blueprints for objects</li>
                    <li><strong>constructor()</strong> initializes new instances</li>
                    <li><strong>this</strong> refers to the current instance</li>
                    <li><strong>extends</strong> creates child classes (inheritance)</li>
                    <li><strong>super()</strong> calls parent constructor/methods</li>
                    <li><strong>static</strong> members belong to the class, not instances</li>
                    <li><strong>get/set</strong> create computed properties with logic</li>
                    <li><strong>#private</strong> fields are truly inaccessible from outside</li>
                </ul>
            `,
            exercises: [
                {
                    id: "cco-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "To create a new instance:",
                            options: [
                                { value: "new", label: "new ClassName()" },
                                { value: "create", label: "ClassName()" },
                            ],
                            expectedAnswer: "new",
                        },
                        {
                            type: "radio",
                            label: "To inherit from a parent class:",
                            options: [
                                { value: "extends", label: "class Child extends Parent" },
                                { value: "inherits", label: "class Child inherits Parent" },
                            ],
                            expectedAnswer: "extends",
                        },
                        {
                            type: "radio",
                            label: "Static methods are called on:",
                            options: [
                                { value: "class", label: "The class itself" },
                                { value: "instance", label: "An instance" },
                            ],
                            expectedAnswer: "class",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "What does the constructor() method do?",
            options: [
                { value: "a", label: "Destroys the object" },
                { value: "b", label: "Initializes a new instance" },
                { value: "c", label: "Creates static methods" },
            ],
            correctAnswer: "b",
            explanation:
                "The constructor runs automatically when you create a new instance with 'new'. It sets up initial property values.",
        },
        {
            id: "q2",
            question: "What does 'this' refer to inside a class method?",
            options: [
                { value: "a", label: "The class definition" },
                { value: "b", label: "The current instance" },
                { value: "c", label: "The window object" },
            ],
            correctAnswer: "b",
            explanation:
                "'this' refers to the specific instance the method is called on. user.greet() makes 'this' = user.",
        },
        {
            id: "q3",
            question: "What must you call first in a child constructor?",
            options: [
                { value: "a", label: "this.init()" },
                { value: "b", label: "super()" },
                { value: "c", label: "parent()" },
            ],
            correctAnswer: "b",
            explanation:
                "super() calls the parent constructor and must be called before using 'this' in a child class constructor.",
        },
        {
            id: "q4",
            question: "How do you declare a truly private field?",
            options: [
                { value: "a", label: "private field" },
                { value: "b", label: "#field" },
                { value: "c", label: "_field" },
            ],
            correctAnswer: "b",
            explanation:
                "Use # prefix for true privacy. The _ prefix is just a convention - #field is actually inaccessible from outside the class.",
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
