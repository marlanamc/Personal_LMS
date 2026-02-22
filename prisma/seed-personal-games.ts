/**
 * Seed script for personal coding and Spanish games
 * Run with: npx tsx prisma/seed-personal-games.ts
 */

import { PrismaClient } from "@prisma/client";
import { SPANISH_LEGACY_GAME_IDS } from "../src/content/spanish/registry";
import { CODING_GAME_IDS } from "../src/content/coding/registry";

const prisma = new PrismaClient();

function validateLegacySpanishRegistryAlignment(ids: readonly string[], gameIds: string[]): void {
    const missingFromRegistry = gameIds.filter((id) => !ids.includes(id));
    const missingFromSeed = ids.filter((id) => !gameIds.includes(id));

    if (missingFromRegistry.length || missingFromSeed.length) {
        throw new Error(
            `Spanish legacy game registry mismatch.\n` +
            `Missing in registry: ${missingFromRegistry.join(", ") || "none"}\n` +
            `Missing in seed: ${missingFromSeed.join(", ") || "none"}`
        );
    }
}

function validateCodingGameRegistryAlignment(ids: readonly string[], gameIds: string[]): void {
    const missingFromRegistry = gameIds.filter((id) => !ids.includes(id));
    const missingFromSeed = ids.filter((id) => !gameIds.includes(id));

    if (missingFromRegistry.length || missingFromSeed.length) {
        throw new Error(
            `Coding game registry mismatch.\n` +
            `Missing in registry: ${missingFromRegistry.join(", ") || "none"}\n` +
            `Missing in seed: ${missingFromSeed.join(", ") || "none"}`
        );
    }
}

// ============================================================================
// SPANISH GAMES
// ============================================================================

const spanishFlashcards = {
    id: "spanish-common-verbs-flashcards",
    title: "Spanish Common Verbs — Flashcards",
    description: "Master the 20 most common Spanish verbs with flashcards. Practice infinitives and their English meanings.",
    type: "game",
    category: "Spanish",
    level: "beginner",
    ui: "flashcards",
    content: `1) hablar — to speak/talk
   Example: Yo hablo español. (I speak Spanish.)

2) comer — to eat
   Example: Nosotros comemos pizza. (We eat pizza.)

3) vivir — to live
   Example: Ella vive en Nueva York. (She lives in New York.)

4) ser — to be (permanent)
   Example: Yo soy estudiante. (I am a student.)

5) estar — to be (temporary/location)
   Example: Estoy cansado. (I am tired.)

6) tener — to have
   Example: Tengo dos hermanos. (I have two siblings.)

7) hacer — to do/make
   Example: ¿Qué haces? (What are you doing?)

8) ir — to go
   Example: Vamos al cine. (We're going to the movies.)

9) poder — to be able to/can
   Example: Puedo ayudarte. (I can help you.)

10) querer — to want/love
   Example: Quiero aprender español. (I want to learn Spanish.)

11) saber — to know (facts)
   Example: Sé la respuesta. (I know the answer.)

12) conocer — to know (people/places)
   Example: Conozco a María. (I know María.)

13) decir — to say/tell
   Example: Él dice la verdad. (He tells the truth.)

14) venir — to come
   Example: Vengo de México. (I come from Mexico.)

15) ver — to see
   Example: Veo la montaña. (I see the mountain.)

16) dar — to give
   Example: Te doy un regalo. (I give you a gift.)

17) pensar — to think
   Example: Pienso que sí. (I think so.)

18) trabajar — to work
   Example: Trabajo en un restaurante. (I work in a restaurant.)

19) estudiar — to study
   Example: Estudio inglés. (I study English.)

20) comprar — to buy
   Example: Compro comida. (I buy food.)`,
};

const spanishNumbersFlashcards = {
    id: "spanish-numbers-flashcards",
    title: "Spanish Numbers 1-20 — Flashcards",
    description: "Learn Spanish numbers from 1 to 20 with pronunciation tips.",
    type: "game",
    category: "Spanish",
    level: "beginner",
    ui: "flashcards",
    content: `1) uno — one
   Example: Tengo uno. (I have one.)

2) dos — two
   Example: Dos más dos son cuatro. (Two plus two is four.)

3) tres — three
   Example: Hay tres gatos. (There are three cats.)

4) cuatro — four
   Example: Cuatro estaciones. (Four seasons.)

5) cinco — five
   Example: Cinco dedos. (Five fingers.)

6) seis — six
   Example: Seis días. (Six days.)

7) siete — seven
   Example: Siete colores. (Seven colors.)

8) ocho — eight
   Example: Ocho horas. (Eight hours.)

9) nueve — nine
   Example: Nueve planetas. (Nine planets.)

10) diez — ten
   Example: Diez minutos. (Ten minutes.)

11) once — eleven
   Example: Once jugadores. (Eleven players.)

12) doce — twelve
   Example: Doce meses. (Twelve months.)

13) trece — thirteen
   Example: Trece años. (Thirteen years.)

14) catorce — fourteen
   Example: Catorce días. (Fourteen days.)

15) quince — fifteen
   Example: Quince minutos. (Fifteen minutes.)

16) dieciséis — sixteen
   Example: Dieciséis estudiantes. (Sixteen students.)

17) diecisiete — seventeen
   Example: Diecisiete páginas. (Seventeen pages.)

18) dieciocho — eighteen
   Example: Dieciocho años. (Eighteen years old.)

19) diecinueve — nineteen
   Example: Diecinueve libros. (Nineteen books.)

20) veinte — twenty
   Example: Veinte dólares. (Twenty dollars.)`,
};

const spanishVerbMatchingGame = {
    id: "spanish-verb-conjugation-matching",
    title: "Spanish Present Tense Matching Game",
    description: "Match Spanish verb conjugations with their English translations. Test your knowledge of present tense!",
    type: "game",
    category: "Spanish",
    level: "beginner",
    ui: "matching",
    content: `yo hablo :: I speak
tú hablas :: you speak
él habla :: he speaks
nosotros hablamos :: we speak
yo como :: I eat
tú comes :: you eat
él come :: he eats
nosotros comemos :: we eat
yo vivo :: I live
tú vives :: you live
él vive :: he lives
nosotros vivimos :: we live
yo soy :: I am (permanent)
tú eres :: you are (permanent)
yo estoy :: I am (temporary)
tú estás :: you are (temporary)
yo tengo :: I have
tú tienes :: you have
yo voy :: I go
tú vas :: you go`,
};

const spanishAdjectivesFlashcards = {
    id: "spanish-adjectives-flashcards",
    title: "Spanish Common Adjectives — Flashcards",
    description: "Learn essential Spanish adjectives for describing people, places, and things.",
    type: "game",
    category: "Spanish",
    level: "beginner",
    ui: "flashcards",
    content: `1) grande — big/large
   Example: Una casa grande. (A big house.)

2) pequeño/pequeña — small
   Example: Un perro pequeño. (A small dog.)

3) bueno/buena — good
   Example: Una buena idea. (A good idea.)

4) malo/mala — bad
   Example: Un día malo. (A bad day.)

5) nuevo/nueva — new
   Example: Un carro nuevo. (A new car.)

6) viejo/vieja — old
   Example: Una casa vieja. (An old house.)

7) bonito/bonita — pretty/beautiful
   Example: Una flor bonita. (A pretty flower.)

8) feo/fea — ugly
   Example: Un edificio feo. (An ugly building.)

9) alto/alta — tall/high
   Example: Un hombre alto. (A tall man.)

10) bajo/baja — short/low
   Example: Una mesa baja. (A low table.)

11) largo/larga — long
   Example: Un camino largo. (A long road.)

12) corto/corta — short (length)
   Example: Un pelo corto. (Short hair.)

13) fácil — easy
   Example: Un examen fácil. (An easy exam.)

14) difícil — difficult
   Example: Una pregunta difícil. (A difficult question.)

15) rápido/rápida — fast
   Example: Un tren rápido. (A fast train.)

16) lento/lenta — slow
   Example: Un proceso lento. (A slow process.)

17) caliente — hot
   Example: Café caliente. (Hot coffee.)

18) frío/fría — cold
   Example: Agua fría. (Cold water.)

19) feliz — happy
   Example: Una persona feliz. (A happy person.)

20) triste — sad
   Example: Una historia triste. (A sad story.)`,
};

const spanishFillInBlank = {
    id: "spanish-ser-estar-fill-blank",
    title: "Ser vs Estar — Fill in the Blank",
    description: "Practice choosing between ser and estar with context clues. Master the most important Spanish distinction!",
    type: "game",
    category: "Spanish",
    level: "intermediate",
    ui: "fill-in-blank",
    content: JSON.stringify({
        sentences: [
            {
                id: "1",
                text: "Yo _____ de México. (I am from Mexico.)",
                blanks: ["soy"],
                correctAnswers: ["soy"],
                options: ["soy", "estoy"],
                explanation: "Use SER for origin/nationality. 'Soy de México' = I am from Mexico."
            },
            {
                id: "2",
                text: "Ella _____ cansada hoy. (She is tired today.)",
                blanks: ["está"],
                correctAnswers: ["está"],
                options: ["es", "está"],
                explanation: "Use ESTAR for temporary conditions/feelings. Being tired is temporary."
            },
            {
                id: "3",
                text: "El libro _____ en la mesa. (The book is on the table.)",
                blanks: ["está"],
                correctAnswers: ["está"],
                options: ["es", "está"],
                explanation: "Use ESTAR for location. Where something IS = estar."
            },
            {
                id: "4",
                text: "Mi padre _____ médico. (My father is a doctor.)",
                blanks: ["es"],
                correctAnswers: ["es"],
                options: ["es", "está"],
                explanation: "Use SER for professions. Being a doctor is an identity."
            },
            {
                id: "5",
                text: "Nosotros _____ muy contentos. (We are very happy.)",
                blanks: ["estamos"],
                correctAnswers: ["estamos"],
                options: ["somos", "estamos"],
                explanation: "Use ESTAR for emotions/feelings. Happiness is a current state."
            },
            {
                id: "6",
                text: "La pizza _____ deliciosa. (The pizza is delicious.)",
                blanks: ["está"],
                correctAnswers: ["está"],
                options: ["es", "está"],
                explanation: "Use ESTAR when describing how food tastes RIGHT NOW."
            },
            {
                id: "7",
                text: "Hoy _____ lunes. (Today is Monday.)",
                blanks: ["es"],
                correctAnswers: ["es"],
                options: ["es", "está"],
                explanation: "Use SER for dates, days, and time."
            },
            {
                id: "8",
                text: "¿Dónde _____ tú? (Where are you?)",
                blanks: ["estás"],
                correctAnswers: ["estás"],
                options: ["eres", "estás"],
                explanation: "Use ESTAR when asking about location."
            },
            {
                id: "9",
                text: "María _____ inteligente. (María is intelligent.)",
                blanks: ["es"],
                correctAnswers: ["es"],
                options: ["es", "está"],
                explanation: "Use SER for inherent characteristics and personality traits."
            },
            {
                id: "10",
                text: "El café _____ frío. (The coffee is cold.)",
                blanks: ["está"],
                correctAnswers: ["está"],
                options: ["es", "está"],
                explanation: "Use ESTAR for temporary states. The coffee became cold."
            }
        ]
    }),
};

// ============================================================================
// CODING GAMES
// ============================================================================

const codingConceptsFlashcards = {
    id: "coding-concepts-flashcards",
    title: "JavaScript Concepts — Flashcards",
    description: "Master fundamental JavaScript concepts with these flashcards. Great for beginners!",
    type: "game",
    category: "Coding",
    level: "beginner",
    ui: "flashcards",
    content: `1) variable — a named container that stores data
   Example: let name = "Alice"; // 'name' is a variable

2) const — declares a constant that cannot be reassigned
   Example: const PI = 3.14159; // Cannot change PI later

3) let — declares a variable that can be reassigned
   Example: let count = 0; count++; // count is now 1

4) function — a reusable block of code that performs a task
   Example: function greet() { return "Hello!"; }

5) parameter — an input variable in a function definition
   Example: function greet(name) { } // 'name' is a parameter

6) argument — an actual value passed to a function
   Example: greet("Alice"); // "Alice" is an argument

7) return — sends a value back from a function
   Example: function double(x) { return x * 2; }

8) array — an ordered list of values
   Example: const colors = ["red", "blue", "green"];

9) object — a collection of key-value pairs
   Example: const user = { name: "Alice", age: 25 };

10) loop — code that repeats multiple times
   Example: for (let i = 0; i < 5; i++) { console.log(i); }

11) if statement — executes code based on a condition
   Example: if (age >= 18) { console.log("Adult"); }

12) boolean — a true or false value
   Example: const isLoggedIn = true;

13) string — text data enclosed in quotes
   Example: const greeting = "Hello, World!";

14) number — numeric data (integers or decimals)
   Example: const price = 19.99;

15) null — an intentional absence of value
   Example: let user = null; // explicitly empty

16) undefined — a variable declared but not assigned
   Example: let x; console.log(x); // undefined

17) callback — a function passed to another function
   Example: array.map(item => item * 2);

18) async — marks a function as asynchronous
   Example: async function fetchData() { }

19) await — pauses execution until a Promise resolves
   Example: const data = await fetch(url);

20) Promise — represents a future value (pending, fulfilled, or rejected)
   Example: fetch(url).then(response => response.json());`,
};

const codingOperatorsFlashcards = {
    id: "coding-operators-flashcards",
    title: "JavaScript Operators — Flashcards",
    description: "Learn JavaScript operators: arithmetic, comparison, logical, and assignment.",
    type: "game",
    category: "Coding",
    level: "beginner",
    ui: "flashcards",
    content: `1) + (addition) — adds numbers or concatenates strings
   Example: 5 + 3 = 8; "Hello" + "World" = "HelloWorld"

2) - (subtraction) — subtracts numbers
   Example: 10 - 4 = 6

3) * (multiplication) — multiplies numbers
   Example: 6 * 7 = 42

4) / (division) — divides numbers
   Example: 20 / 4 = 5

5) % (modulo) — returns the remainder of division
   Example: 17 % 5 = 2 (17 ÷ 5 = 3 remainder 2)

6) ++ (increment) — increases a number by 1
   Example: let x = 5; x++; // x is now 6

7) -- (decrement) — decreases a number by 1
   Example: let x = 5; x--; // x is now 4

8) === (strict equality) — checks value AND type
   Example: 5 === "5" // false (different types)

9) == (loose equality) — checks value only (type coercion)
   Example: 5 == "5" // true (coerces string to number)

10) !== (strict inequality) — checks if NOT equal (value and type)
   Example: 5 !== "5" // true

11) > (greater than) — checks if left is greater
   Example: 10 > 5 // true

12) < (less than) — checks if left is smaller
   Example: 3 < 7 // true

13) >= (greater than or equal) — checks if left is greater or equal
   Example: 5 >= 5 // true

14) <= (less than or equal) — checks if left is smaller or equal
   Example: 4 <= 5 // true

15) && (logical AND) — both conditions must be true
   Example: true && false // false

16) || (logical OR) — at least one condition must be true
   Example: true || false // true

17) ! (logical NOT) — inverts a boolean
   Example: !true // false

18) = (assignment) — assigns a value
   Example: let x = 10;

19) += (add and assign) — adds and assigns
   Example: x += 5; // same as x = x + 5

20) ?? (nullish coalescing) — returns right if left is null/undefined
   Example: null ?? "default" // "default"`,
};

const codingArrayMethodsMatching = {
    id: "coding-array-methods-matching",
    title: "JavaScript Array Methods — Matching Game",
    description: "Match JavaScript array methods with what they do. Master the most common array operations!",
    type: "game",
    category: "Coding",
    level: "intermediate",
    ui: "matching",
    content: `.push() :: Add item to end of array
.pop() :: Remove and return last item
.shift() :: Remove and return first item
.unshift() :: Add item to beginning
.map() :: Transform each item, return new array
.filter() :: Keep items that pass a test
.find() :: Return first item that matches
.findIndex() :: Return index of first match
.includes() :: Check if array contains value
.indexOf() :: Find index of a value
.forEach() :: Loop through each item
.reduce() :: Combine all items into one value
.some() :: Check if any item passes test
.every() :: Check if all items pass test
.slice() :: Copy part of array
.splice() :: Add/remove items at position
.concat() :: Merge arrays together
.join() :: Convert array to string
.reverse() :: Reverse array order
.sort() :: Sort array items`,
};

const codingFillInBlank = {
    id: "coding-syntax-fill-blank",
    title: "JavaScript Syntax — Fill in the Blank",
    description: "Practice JavaScript syntax by filling in the missing code. Great for reinforcing fundamentals!",
    type: "game",
    category: "Coding",
    level: "beginner",
    ui: "fill-in-blank",
    content: JSON.stringify({
        sentences: [
            {
                id: "1",
                text: "Declare a constant: _____ name = 'Alice';",
                blanks: ["const"],
                correctAnswers: ["const"],
                options: ["const", "let", "var"],
                explanation: "Use 'const' when the value won't change. It prevents accidental reassignment."
            },
            {
                id: "2",
                text: "Declare a variable that can change: _____ count = 0;",
                blanks: ["let"],
                correctAnswers: ["let"],
                options: ["const", "let", "var"],
                explanation: "Use 'let' when you need to reassign the variable later."
            },
            {
                id: "3",
                text: "Check strict equality: if (x _____ 5) { }",
                blanks: ["==="],
                correctAnswers: ["==="],
                options: ["==", "===", "="],
                explanation: "Use === for strict equality (checks both value AND type). It's safer than ==."
            },
            {
                id: "4",
                text: "Define a function: _____ greet(name) { return 'Hello ' + name; }",
                blanks: ["function"],
                correctAnswers: ["function"],
                options: ["function", "def", "func"],
                explanation: "In JavaScript, use 'function' keyword to declare a function."
            },
            {
                id: "5",
                text: "Create an array: const colors = _____ 'red', 'blue' ___;",
                blanks: ["[", "]"],
                correctAnswers: ["[", "]"],
                options: ["[", "]", "{", "}", "(", ")"],
                explanation: "Arrays use square brackets []. Objects use curly braces {}."
            },
            {
                id: "6",
                text: "Access array element: const first = colors_____0_____;",
                blanks: ["[", "]"],
                correctAnswers: ["[", "]"],
                options: ["[", "]", "(", ")", ".", "->"],
                explanation: "Use bracket notation with index to access array elements. Arrays are zero-indexed!"
            },
            {
                id: "7",
                text: "Arrow function: const double = (x) _____ x * 2;",
                blanks: ["=>"],
                correctAnswers: ["=>"],
                options: ["=>", "->", "=", ":"],
                explanation: "Arrow functions use => (fat arrow). They're a shorter syntax for functions."
            },
            {
                id: "8",
                text: "Template literal: const msg = _____Hello, ${name}!_____;",
                blanks: ["`", "`"],
                correctAnswers: ["`", "`"],
                options: ["`", "'", "\""],
                explanation: "Template literals use backticks ` and allow ${} for interpolation."
            },
            {
                id: "9",
                text: "Logical AND: if (age >= 18 _____ hasID) { }",
                blanks: ["&&"],
                correctAnswers: ["&&"],
                options: ["&&", "||", "&", "and"],
                explanation: "Use && for logical AND. Both conditions must be true."
            },
            {
                id: "10",
                text: "Loop through array: colors._____(color => console.log(color));",
                blanks: ["forEach"],
                correctAnswers: ["forEach"],
                options: ["forEach", "forAll", "each", "loop"],
                explanation: "forEach() loops through each item in an array and runs a function on it."
            }
        ]
    }),
};

const codingKeywordsMatching = {
    id: "coding-keywords-matching",
    title: "JavaScript Keywords — Matching Game",
    description: "Match JavaScript keywords with their purposes. Test your knowledge of JS fundamentals!",
    type: "game",
    category: "Coding",
    level: "beginner",
    ui: "matching",
    content: `const :: Declare unchangeable variable
let :: Declare reassignable variable
function :: Define reusable code block
return :: Send value back from function
if :: Execute code conditionally
else :: Alternative when if is false
for :: Loop a specific number of times
while :: Loop while condition is true
break :: Exit a loop early
continue :: Skip to next loop iteration
switch :: Multiple condition branches
case :: Single branch in switch
try :: Attempt code that might fail
catch :: Handle errors from try
throw :: Create custom error
async :: Mark function as asynchronous
await :: Wait for Promise to resolve
class :: Define object blueprint
new :: Create instance of class
this :: Reference current object`,
};

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
    // Get marlie user (created by main seed)
    const marlie = await prisma.user.findFirst({
        where: { username: "marlie" },
    });

    if (!marlie) {
        console.error("❌ No 'marlie' user found. Run npm run db:seed first.");
        process.exit(1);
    }

    const teacher = marlie; // Use marlie as the creator

    const allGames = [
        // Spanish games
        spanishFlashcards,
        spanishNumbersFlashcards,
        spanishVerbMatchingGame,
        spanishAdjectivesFlashcards,
        spanishFillInBlank,
        // Coding games
        codingConceptsFlashcards,
        codingOperatorsFlashcards,
        codingArrayMethodsMatching,
        codingFillInBlank,
        codingKeywordsMatching,
    ];

    const spanishGameIds = allGames
        .filter((game) => game.category === "Spanish")
        .map((game) => game.id);
    validateLegacySpanishRegistryAlignment(SPANISH_LEGACY_GAME_IDS, spanishGameIds);
    const codingGameIds = allGames
        .filter((game) => game.category === "Coding")
        .map((game) => game.id);
    validateCodingGameRegistryAlignment(CODING_GAME_IDS, codingGameIds);

    for (const game of allGames) {
        const upserted = await prisma.activity.upsert({
            where: { id: game.id },
            update: {
                title: game.title,
                description: game.description,
                type: game.type,
                category: game.category,
                level: game.level,
                ui: game.ui,
                content: game.content,
                createdBy: teacher.id,
            },
            create: {
                id: game.id,
                title: game.title,
                description: game.description,
                type: game.type,
                category: game.category,
                level: game.level,
                ui: game.ui,
                content: game.content,
                createdBy: teacher.id,
            },
        });
        const emoji = game.category === "Spanish" ? "🇪🇸" : "💻";
        console.log(`${emoji} Game added: ${upserted.title}`);
    }

    console.log("\n✅ All personal games seeded successfully!");
    console.log(`   Total: ${allGames.length} games (${allGames.filter(g => g.category === "Spanish").length} Spanish, ${allGames.filter(g => g.category === "Coding").length} Coding)`);
}

main()
    .catch((e) => {
        console.error("Error seeding games:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
