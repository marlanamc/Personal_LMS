import type { InteractiveGuideContent } from "@/types/activity";

export const codingTypescriptDeepDiveContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "TypeScript Deep Dive: Type Safety Mastery",
            icon: "🔷",
            explanation: `
                <div style="background: rgba(20, 32, 47, 0.06); border: 1px solid rgba(20, 32, 47, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">TypeScript adds types to JavaScript, catching bugs before your code runs. This guide covers advanced features that make TypeScript truly powerful!</p>
                </div>

                <h3>What You'll Learn</h3>
                <ul>
                    <li>Interfaces vs type aliases</li>
                    <li>Generics for reusable code</li>
                    <li>Union and intersection types</li>
                    <li>Type guards and narrowing</li>
                    <li>Utility types (Partial, Pick, Omit, etc.)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ctd-intro-1",
                    title: "TypeScript Basics",
                    instructions: "What does TypeScript add to JavaScript?",
                    items: [
                        {
                            type: "radio",
                            label: "TypeScript adds:",
                            options: [
                                { value: "types", label: "Static type checking" },
                                { value: "speed", label: "Faster runtime performance" },
                            ],
                            expectedAnswer: "types",
                        },
                    ],
                },
            ],
        },

        // Interfaces vs Types
        {
            id: "interfaces-vs-types",
            stepNumber: 1,
            title: "Interfaces vs Type Aliases",
            icon: "📐",
            explanation: `
                <h3>Two Ways to Define Types</h3>
                <p>Both <code>interface</code> and <code>type</code> define object shapes. Here's when to use each.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">interface</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
interface User {
  name: string;
  age: number;
}

// Can extend
interface Admin extends User {
  role: string;
}

// Can be merged
interface User {
  email: string;
}</pre>
                    </div>
                    <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.25rem; border-radius: 0.75rem; color: white;">
                        <h4 style="margin-top: 0;">type</h4>
                        <pre style="margin: 0; font-size: 0.85rem;">
type User = {
  name: string;
  age: number;
};

// Use & for extension
type Admin = User & {
  role: string;
};

// Can do more than objects
type ID = string | number;</pre>
                    </div>
                </div>
            `,
            verbTable: {
                title: "interface vs type",
                headers: ["Feature", "interface", "type"],
                rows: [
                    ["Object shapes", "✅", "✅"],
                    ["Extend/inherit", "extends", "& (intersection)"],
                    ["Declaration merging", "✅", "❌"],
                    ["Union types", "❌", "✅"],
                    ["Primitives", "❌", "✅"],
                    ["Mapped types", "❌", "✅"],
                ],
            },
            usageMeanings: [
                {
                    title: "📐 Use interface for:",
                    description: "Object shapes, especially in libraries",
                    examples: [
                        {
                            sentence: "interface Props { children: React.ReactNode; }",
                            explanation: "React component props - common convention.",
                        },
                        {
                            sentence: "interface API { getData(): Promise<Data>; }",
                            explanation: "API contracts that others implement.",
                        },
                    ],
                },
                {
                    title: "🔷 Use type for:",
                    description: "Everything else",
                    examples: [
                        {
                            sentence: "type Status = 'loading' | 'success' | 'error';",
                            explanation: "Union types (can't do with interface).",
                        },
                        {
                            sentence: "type Callback = (event: Event) => void;",
                            explanation: "Function types.",
                        },
                        {
                            sentence: "type Nullable<T> = T | null;",
                            explanation: "Generic utility types.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Rule",
                content:
                    "Use interface for objects that will be extended or implemented. Use type for unions, intersections, and mapped types. Both work for basic objects!",
            },
            exercises: [
                {
                    id: "ctd-ivt-1",
                    title: "Interface vs Type",
                    instructions: "Which would you use?",
                    items: [
                        {
                            type: "select",
                            label: "type Status = 'pending' | 'complete'",
                            options: ["interface", "type"],
                            expectedAnswer: "type",
                        },
                        {
                            type: "select",
                            label: "React component props",
                            options: ["interface (common convention)", "type"],
                            expectedAnswer: "interface (common convention)",
                        },
                    ],
                },
            ],
        },

        // Generics
        {
            id: "generics",
            stepNumber: 2,
            title: "Generics: Reusable Types",
            icon: "🧬",
            formula: [
                { text: "function ", type: "other" },
                { text: "name", type: "verb" },
                { text: "<", type: "other" },
                { text: "T", type: "subject" },
                { text: ">", type: "other" },
                { text: "(arg: T): T", type: "object" },
                { text: " { ... }", type: "other" },
            ],
            comparison: {
                title: "Type Inference Comparison",
                leftLabel: "Explicit Types",
                rightLabel: "Inferred Types",
                rows: [
                    {
                        label: "When",
                        left: "Function params, return types, when inference fails",
                        right: "Variable declarations, generic calls without type arg",
                    },
                    {
                        label: "Example",
                        left: "const x: number = 5;",
                        right: "const x = 5; // inferred as number",
                    },
                    {
                        label: "Tradeoff",
                        left: "Clear intent, catches mismatches",
                        right: "Less verbose, TS infers from context",
                    },
                ],
            },
            explanation: `
                <h3>Types That Take Parameters</h3>
                <p>Generics let you create flexible, reusable types. Think of them as "type parameters" - like function arguments, but for types!</p>

                <p><strong>Generics formula:</strong> function name&lt;T&gt;(arg: T): T. T is a type parameter—inferred from the call or specified explicitly. Use constraints (T extends Base) when you need T to have certain properties.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
// Without generics - need separate functions
function firstString(arr: string[]): string { return arr[0]; }
function firstNumber(arr: number[]): number { return arr[0]; }

// With generics - one reusable function!
function first&lt;T&gt;(arr: T[]): T {
  return arr[0];
}

first&lt;string&gt;(['a', 'b', 'c']);  // Returns string
first&lt;number&gt;([1, 2, 3]);        // Returns number
first([true, false]);             // T inferred as boolean</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔤 Generic Syntax",
                    description: "The &lt;T&gt; is like a type variable",
                    examples: [
                        {
                            sentence: "function identity<T>(value: T): T { return value; }",
                            explanation: "T is a placeholder for any type.",
                        },
                        {
                            sentence: "type Container<T> = { value: T };",
                            explanation: "Types can be generic too.",
                        },
                        {
                            sentence: "interface Box<T> { contents: T; }",
                            explanation: "Interfaces can also be generic.",
                        },
                    ],
                },
                {
                    title: "📦 Built-in Generic Types",
                    description: "You already use these!",
                    examples: [
                        {
                            sentence: "Array<string> // same as string[]",
                            explanation: "Arrays are generic.",
                        },
                        {
                            sentence: "Promise<User>",
                            explanation: "Promises have a generic type parameter.",
                        },
                        {
                            sentence: "Map<string, User>",
                            explanation: "Maps take key and value types.",
                        },
                        {
                            sentence: "Set<number>",
                            explanation: "Sets are generic collections.",
                        },
                    ],
                },
                {
                    title: "🔒 Constraints",
                    description: "Limit what types can be used",
                    examples: [
                        {
                            sentence: "function len<T extends { length: number }>(item: T): number { return item.length; }",
                            explanation: "T must have a length property.",
                        },
                        {
                            sentence: "<T extends string | number>",
                            explanation: "T can only be string or number.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ctd-gen-1",
                    title: "Generics",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "Generics allow you to:",
                            options: [
                                { value: "reuse", label: "Write reusable, type-safe code" },
                                { value: "faster", label: "Make code run faster" },
                            ],
                            expectedAnswer: "reuse",
                        },
                        {
                            type: "radio",
                            label: "Array<string> is:",
                            options: [
                                { value: "generic", label: "Using the generic Array type" },
                                { value: "syntax", label: "Invalid TypeScript" },
                            ],
                            expectedAnswer: "generic",
                        },
                    ],
                },
            ],
        },

        // Union Types
        {
            id: "union-types",
            stepNumber: 3,
            title: "Union Types: This OR That",
            icon: "🔀",
            explanation: `
                <h3>Multiple Possible Types</h3>
                <p>Union types allow a value to be one of several types. Use the <code>|</code> operator.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
// Basic union
type ID = string | number;
const userId: ID = "abc123";  // OK
const postId: ID = 42;        // Also OK

// Literal unions (like enums but simpler)
type Status = 'pending' | 'approved' | 'rejected';
type Direction = 'up' | 'down' | 'left' | 'right';

// Discriminated unions (powerful pattern!)
type Result =
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };

function handleResult(result: Result) {
  if (result.status === 'success') {
    console.log(result.data);     // TypeScript knows data exists
  } else {
    console.log(result.message);  // TypeScript knows message exists
  }
}</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔤 String Literal Unions",
                    description: "Better than enums for simple cases",
                    examples: [
                        {
                            sentence: "type Size = 'sm' | 'md' | 'lg' | 'xl';",
                            explanation: "Only these exact strings allowed.",
                        },
                        {
                            sentence: "type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';",
                            explanation: "Self-documenting allowed values.",
                        },
                    ],
                },
                {
                    title: "🎭 Discriminated Unions",
                    description: "Objects with a type field for branching",
                    examples: [
                        {
                            sentence: "type Event = { type: 'click'; x: number } | { type: 'keypress'; key: string };",
                            explanation: "Different shapes based on 'type' field.",
                        },
                        {
                            sentence: "if (event.type === 'click') { event.x; }",
                            explanation: "TypeScript narrows the type automatically.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ctd-union-1",
                    title: "Union Types",
                    instructions: "Answer these questions:",
                    items: [
                        {
                            type: "radio",
                            label: "type A = B | C means:",
                            options: [
                                { value: "or", label: "A can be B OR C" },
                                { value: "and", label: "A must be both B AND C" },
                            ],
                            expectedAnswer: "or",
                        },
                        {
                            type: "radio",
                            label: "type Status = 'on' | 'off' allows:",
                            options: [
                                { value: "literals", label: "Only 'on' or 'off' strings" },
                                { value: "any", label: "Any string" },
                            ],
                            expectedAnswer: "literals",
                        },
                    ],
                },
            ],
        },

        // Intersection Types
        {
            id: "intersection-types",
            stepNumber: 4,
            title: "Intersection Types: This AND That",
            icon: "➕",
            explanation: `
                <h3>Combining Types</h3>
                <p>Intersection types combine multiple types into one. Use the <code>&</code> operator.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
type HasName = { name: string };
type HasAge = { age: number };
type HasEmail = { email: string };

// Combine all three
type Person = HasName & HasAge & HasEmail;

const person: Person = {
  name: 'Alice',    // Required from HasName
  age: 25,          // Required from HasAge
  email: 'a@b.com'  // Required from HasEmail
};

// Extend existing types
type User = { id: string; name: string };
type Admin = User & { permissions: string[] };

const admin: Admin = {
  id: '123',
  name: 'Admin',
  permissions: ['read', 'write', 'delete']
};</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔗 Combining Types",
                    description: "Merge multiple type definitions",
                    examples: [
                        {
                            sentence: "type A & B // Must have ALL properties from both",
                            explanation: "Intersection requires all fields.",
                        },
                        {
                            sentence: "type WithTimestamps = T & { createdAt: Date; updatedAt: Date };",
                            explanation: "Add common fields to any type.",
                        },
                    ],
                },
                {
                    title: "🆚 Union vs Intersection",
                    description: "Remember the difference!",
                    examples: [
                        {
                            sentence: "A | B // Can be A or B (less restrictive)",
                            explanation: "Union allows either type.",
                        },
                        {
                            sentence: "A & B // Must be both A and B (more restrictive)",
                            explanation: "Intersection requires both.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ctd-inter-1",
                    title: "Intersection Types",
                    instructions: "What does & do?",
                    items: [
                        {
                            type: "radio",
                            label: "type C = A & B means:",
                            options: [
                                { value: "both", label: "C must have properties from BOTH A and B" },
                                { value: "either", label: "C can have properties from A or B" },
                            ],
                            expectedAnswer: "both",
                        },
                    ],
                },
            ],
        },

        // Type Guards
        {
            id: "type-guards",
            stepNumber: 5,
            title: "Type Guards & Narrowing",
            icon: "🛡️",
            explanation: `
                <h3>Tell TypeScript What Type Something Is</h3>
                <p>Type guards narrow a type to something more specific within a code block.</p>

                <div class="diagram-surface-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white; margin: 1.5rem 0;">
                    <pre style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
function process(value: string | number) {
  // typeof guard
  if (typeof value === 'string') {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
  }
}

// instanceof guard
function handleError(error: Error | string) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log(error);
  }
}

// 'in' operator guard
function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}</pre>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🔍 Built-in Type Guards",
                    description: "JavaScript operators that narrow types",
                    examples: [
                        {
                            sentence: "typeof x === 'string'",
                            explanation: "Works for primitives.",
                        },
                        {
                            sentence: "x instanceof Date",
                            explanation: "Works for class instances.",
                        },
                        {
                            sentence: "'property' in object",
                            explanation: "Check if property exists.",
                        },
                        {
                            sentence: "Array.isArray(x)",
                            explanation: "Check if something is an array.",
                        },
                    ],
                },
                {
                    title: "🎯 Custom Type Guards",
                    description: "Create your own with 'is' keyword",
                    examples: [
                        {
                            sentence: "function isUser(x: any): x is User { return 'name' in x && 'email' in x; }",
                            explanation: "Returns true/false AND narrows type.",
                        },
                        {
                            sentence: "if (isUser(data)) { data.name; } // TypeScript knows it's User",
                            explanation: "Use custom guard in conditionals.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ctd-guard-1",
                    title: "Type Guards",
                    instructions: "Which narrows to string?",
                    items: [
                        {
                            type: "radio",
                            label: "To check if x is a string:",
                            options: [
                                { value: "typeof", label: "typeof x === 'string'" },
                                { value: "is", label: "x.isString()" },
                            ],
                            expectedAnswer: "typeof",
                        },
                    ],
                },
            ],
        },

        // Utility Types
        {
            id: "utility-types",
            stepNumber: 6,
            title: "Utility Types",
            icon: "🧰",
            explanation: `
                <h3>Built-in Type Transformers</h3>
                <p>TypeScript includes utility types that transform existing types. Super useful!</p>
            `,
            verbTable: {
                title: "Common Utility Types",
                headers: ["Utility", "What It Does", "Example"],
                rows: [
                    ["Partial<T>", "All properties optional", "Partial<User>"],
                    ["Required<T>", "All properties required", "Required<Config>"],
                    ["Pick<T, K>", "Select specific properties", "Pick<User, 'id' | 'name'>"],
                    ["Omit<T, K>", "Remove specific properties", "Omit<User, 'password'>"],
                    ["Readonly<T>", "All properties readonly", "Readonly<State>"],
                    ["Record<K, V>", "Object with K keys and V values", "Record<string, number>"],
                    ["ReturnType<F>", "Get function's return type", "ReturnType<typeof fn>"],
                    ["Parameters<F>", "Get function's params as tuple", "Parameters<typeof fn>"],
                ],
            },
            usageMeanings: [
                {
                    title: "📝 Partial - Make Optional",
                    description: "For update operations where not all fields are required",
                    examples: [
                        {
                            sentence: "type UserUpdate = Partial<User>;",
                            explanation: "All User fields become optional.",
                        },
                        {
                            sentence: "function updateUser(id: string, updates: Partial<User>) {}",
                            explanation: "Pass only the fields you want to update.",
                        },
                    ],
                },
                {
                    title: "✂️ Pick & Omit",
                    description: "Create types from existing ones",
                    examples: [
                        {
                            sentence: "type PublicUser = Omit<User, 'password' | 'ssn'>;",
                            explanation: "Remove sensitive fields.",
                        },
                        {
                            sentence: "type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>;",
                            explanation: "Keep only needed fields.",
                        },
                    ],
                },
                {
                    title: "📖 Readonly",
                    description: "Prevent mutations",
                    examples: [
                        {
                            sentence: "type ImmutableState = Readonly<State>;",
                            explanation: "Can't modify any properties.",
                        },
                        {
                            sentence: "const config: Readonly<Config> = { ... };",
                            explanation: "Compile-time protection against mutation.",
                        },
                    ],
                },
                {
                    title: "📋 Record",
                    description: "Object with specific key and value types",
                    examples: [
                        {
                            sentence: "type Scores = Record<string, number>;",
                            explanation: "Object where all values are numbers.",
                        },
                        {
                            sentence: "type StatusMap = Record<'pending' | 'done', Task[]>;",
                            explanation: "Limit keys to specific strings.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ctd-util-1",
                    title: "Utility Types",
                    instructions: "Match the utility:",
                    items: [
                        {
                            type: "select",
                            label: "Make all fields optional",
                            options: ["Partial", "Required", "Pick", "Omit"],
                            expectedAnswer: "Partial",
                        },
                        {
                            type: "select",
                            label: "Remove specific fields",
                            options: ["Partial", "Required", "Pick", "Omit"],
                            expectedAnswer: "Omit",
                        },
                        {
                            type: "select",
                            label: "Keep only specific fields",
                            options: ["Partial", "Required", "Pick", "Omit"],
                            expectedAnswer: "Pick",
                        },
                    ],
                },
            ],
        },

        // Advanced Patterns
        {
            id: "advanced-patterns",
            stepNumber: 7,
            title: "Advanced Patterns",
            icon: "🚀",
            explanation: `
                <h3>Pro-Level TypeScript</h3>
                <p>Patterns used in libraries and complex applications.</p>
            `,
            usageMeanings: [
                {
                    title: "🎭 Conditional Types",
                    description: "Types that depend on conditions",
                    examples: [
                        {
                            sentence: "type IsString<T> = T extends string ? true : false;",
                            explanation: "Returns true or false type based on T.",
                        },
                        {
                            sentence: "type Flatten<T> = T extends Array<infer U> ? U : T;",
                            explanation: "Extract array element type with infer.",
                        },
                    ],
                },
                {
                    title: "🗺️ Mapped Types",
                    description: "Transform properties of a type",
                    examples: [
                        {
                            sentence: "type Optional<T> = { [K in keyof T]?: T[K] };",
                            explanation: "Same as Partial - make all optional.",
                        },
                        {
                            sentence: "type Getters<T> = { [K in keyof T as `get${Capitalize<K>}`]: () => T[K] };",
                            explanation: "Create getter method types from properties.",
                        },
                    ],
                },
                {
                    title: "🏷️ Template Literal Types",
                    description: "String manipulation in types",
                    examples: [
                        {
                            sentence: "type Event = `on${Capitalize<Action>}`;",
                            explanation: "'onClick', 'onSubmit', etc.",
                        },
                        {
                            sentence: "type Route = `/api/${Resource}/${string}`;",
                            explanation: "Typed URL patterns.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ctd-adv-1",
                    title: "Advanced Patterns",
                    instructions: "What does keyof do?",
                    items: [
                        {
                            type: "radio",
                            label: "keyof T returns:",
                            options: [
                                { value: "union", label: "Union of T's property names" },
                                { value: "values", label: "T's property values" },
                            ],
                            expectedAnswer: "union",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "TypeScript Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Takeaways</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>interface</strong> for objects, <strong>type</strong> for unions/intersections</li>
                    <li><strong>Generics &lt;T&gt;</strong> make code reusable with type safety</li>
                    <li><strong>Union |</strong> means OR, <strong>Intersection &</strong> means AND</li>
                    <li><strong>Type guards</strong> narrow types (typeof, instanceof, in)</li>
                    <li><strong>Partial&lt;T&gt;</strong> makes all fields optional</li>
                    <li><strong>Pick/Omit</strong> select or remove fields</li>
                    <li><strong>Readonly&lt;T&gt;</strong> prevents mutations</li>
                    <li><strong>Record&lt;K, V&gt;</strong> creates typed objects</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ctd-summary-1",
                    title: "Final Review",
                    instructions: "Test your knowledge!",
                    items: [
                        {
                            type: "radio",
                            label: "string | number means:",
                            options: [
                                { value: "union", label: "Can be string OR number" },
                                { value: "inter", label: "Must be string AND number" },
                            ],
                            expectedAnswer: "union",
                        },
                        {
                            type: "radio",
                            label: "Partial<User> makes properties:",
                            options: [
                                { value: "optional", label: "Optional" },
                                { value: "required", label: "Required" },
                            ],
                            expectedAnswer: "optional",
                        },
                        {
                            type: "radio",
                            label: "To check if x is a string at runtime:",
                            options: [
                                { value: "typeof", label: "typeof x === 'string'" },
                                { value: "type", label: "x: string" },
                            ],
                            expectedAnswer: "typeof",
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
                    id: "tdd-cadence-concept",
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
                    id: "tdd-cadence-read",
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
                    id: "tdd-cadence-write",
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
                    id: "tdd-cadence-debug",
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
            question: "What's the difference between | and & in TypeScript?",
            options: [
                { value: "a", label: "| means OR, & means AND" },
                { value: "b", label: "| means AND, & means OR" },
                { value: "c", label: "They're the same" },
            ],
            correctAnswer: "a",
            explanation:
                "| (union) means the value can be one type OR another. & (intersection) means the value must satisfy all combined types.",
        },
        {
            id: "q2",
            question: "What does Partial<User> do?",
            options: [
                { value: "a", label: "Makes all User properties optional" },
                { value: "b", label: "Removes some User properties" },
                { value: "c", label: "Makes User immutable" },
            ],
            correctAnswer: "a",
            explanation:
                "Partial<T> makes all properties of T optional. Useful for update functions where you only pass changed fields.",
        },
        {
            id: "q3",
            question: "Which narrows a type to string?",
            options: [
                { value: "a", label: "if (value: string)" },
                { value: "b", label: "if (typeof value === 'string')" },
                { value: "c", label: "if (value.isString())" },
            ],
            correctAnswer: "b",
            explanation:
                "typeof is a runtime check that TypeScript understands. It narrows the type within the if block.",
        },
        {
            id: "q4",
            question: "What does <T> mean in function identity<T>(x: T): T?",
            options: [
                { value: "a", label: "T is a type parameter (generic)" },
                { value: "b", label: "T is a required string" },
                { value: "c", label: "T is the return value" },
            ],
            correctAnswer: "a",
            explanation:
                "Generics (<T>) let you write reusable functions that work with any type while maintaining type safety.",
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
            question: "Generics syntax: function first<T>(arr: T[]): T — what is T?",
            options: [
                { value: "a", label: "Type parameter (placeholder for any type)" },
                { value: "b", label: "Variable name" },
                { value: "c", label: "Return value" },
            ],
            correctAnswer: "a",
            explanation: "T is a type parameter—filled in by inference or explicit call.",
        },
        {
            id: "q12",
            question: "const x = 5; — what type does TypeScript infer?",
            options: [
                { value: "a", label: "number" },
                { value: "b", label: "any" },
                { value: "c", label: "unknown" },
            ],
            correctAnswer: "a",
            explanation: "TypeScript infers number from literal 5.",
        },
        {
            id: "q13",
            question: "When to use type vs interface for a union like 'a' | 'b'?",
            options: [
                { value: "a", label: "type—interfaces cannot do unions" },
                { value: "b", label: "interface" },
                { value: "c", label: "Either works the same" },
            ],
            correctAnswer: "a",
            explanation: "type supports unions; interface does not.",
        },
        {
            id: "q14",
            question: "Array<string> and string[] are:",
            options: [
                { value: "a", label: "Equivalent—both mean array of strings" },
                { value: "b", label: "Different types" },
                { value: "c", label: "Only Array<string> is valid" },
            ],
            correctAnswer: "a",
            explanation: "Both are generic Array type with string parameter.",
        },
        {
            id: "q15",
            question: "Type inference vs explicit: when to add explicit types?",
            options: [
                { value: "a", label: "When inference fails or intent needs clarity" },
                { value: "b", label: "Never—always let TS infer" },
                { value: "c", label: "Always—never rely on inference" },
            ],
            correctAnswer: "a",
            explanation: "Use explicit types when helpful; inference reduces boilerplate.",
        },
    ],
};
