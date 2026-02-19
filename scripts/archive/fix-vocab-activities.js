const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const oldIds = [
   "vocab-september",
   "vocab-october",
   "vocab-november",
   "vocab-december",
   "vocab-january",
   "vocab-february",
   "vocab-march",
   "vocab-april",
   "vocab-may",
   "vocab-june",
];

const septPacketId = "vocab-september-packet";
const septFlashId = "vocab-september-flashcards";

const septContent = `
September Vocabulary — Getting to Know You

1) background (noun) — your life experiences and history.
   Example: Her art background helps her design posters quickly.

2) registration (noun) — the process of signing up for school or services.
   Example: Online registration closes on Friday.

3) vocational (adjective) — education/training that prepares you for a specific job.
   Example: He joined a vocational program to become a mechanic.

4) motivation (noun) — the reason or drive behind someone's actions or goals.
   Example: Her motivation for studying English is to get a better job.

5) transition (noun) — the process of change from one situation to another.
   Example: Moving to a new country can be a big transition.

6) immigration (noun) — moving to a new country to live permanently.
   Example: Her immigration story inspires her classmates.

7) commitment (noun) — dedication to a task, goal, or promise.
   Example: His commitment to homework shows in his grades.

8) barrier (noun) — something that blocks or makes it difficult to move forward.
   Example: Lack of childcare is a barrier to attending class.

9) opportunity (noun) — a chance to do something or achieve success.
   Example: The job fair is an opportunity to meet employers.

10) qualification (noun) — proof of training or education.
    Example: She needs a qualification to apply for the nursing program.
`.trim();

const septFlashcards = `
1) background — your life experiences and history.
   Example: Her art background helps her design posters quickly.

2) registration — the process of signing up for school or services.
   Example: Online registration closes on Friday.

3) vocational — education/training that prepares you for a specific job.
   Example: He joined a vocational program to become a mechanic.

4) motivation — the reason or drive behind someone's actions or goals.
   Example: Her motivation for studying English is to get a better job.

5) transition — the process of change from one situation to another.
   Example: Moving to a new country can be a big transition.

6) immigration — moving to a new country to live permanently.
   Example: Her immigration story inspires her classmates.

7) commitment — dedication to a task, goal, or promise.
   Example: His commitment to homework shows in his grades.

8) barrier — something that blocks or makes it difficult to move forward.
   Example: Lack of childcare is a barrier to attending class.

9) opportunity — a chance to do something or achieve success.
   Example: The job fair is an opportunity to meet employers.

10) qualification — proof of training or education.
    Example: She needs a qualification to apply for the nursing program.
`.trim();

async function main() {
   // Remove legacy vocab records (without packet/flashcards suffix)
   const deleted = await prisma.activity.deleteMany({
      where: { id: { in: oldIds } },
   });
   console.log(`Deleted legacy vocab activities: ${deleted.count}`);

   // Ensure flashcards are typed as "game"
   const flashcardsUpdated = await prisma.activity.updateMany({
      where: { id: { endsWith: "-flashcards" } },
      data: { type: "game", category: "vocab" },
   });
   console.log(`Updated flashcard types to 'game': ${flashcardsUpdated.count}`);

   // Update September packet with richer content/examples
   const sept = await prisma.activity.update({
      where: { id: septPacketId },
      data: {
         title: "Unit 1: Word List",
         description:
            "September vocabulary with definitions and examples: background, registration, vocational, motivation, transition, immigration, commitment, barrier, opportunity, qualification.",
         content: septContent,
         type: "resource",
         category: "Unit 1: Word List",
      },
   });
   console.log(`Updated September packet: ${sept.id}`);

   const septFlash = await prisma.activity.update({
      where: { id: septFlashId },
      data: {
         title: "Unit 1: Flash Cards",
         description:
            "September vocabulary flash cards: background, registration, vocational, motivation, transition, immigration, commitment, barrier, opportunity, qualification.",
         content: septFlashcards,
         type: "game",
         category: "Unit 1: Flash Cards",
      },
   });
   console.log(`Updated September flashcards: ${septFlash.id}`);
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });

