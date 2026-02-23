/**
 * Seed script for Spanish learning games and vocabulary activities
 *
 * Run with: npx tsx prisma/seed-spanish-games.ts
 */

import { PrismaClient } from "@prisma/client";
import {
  greetingsBasicsCards,
} from "../src/content/spanish/vocabulary/greetings-basics";
import {
  numbers1to100Cards,
} from "../src/content/spanish/vocabulary/numbers-1-100";
import {
  colorsShapesCards,
} from "../src/content/spanish/vocabulary/colors-shapes";
import {
  familyRelationshipsCards,
} from "../src/content/spanish/vocabulary/family-relationships";
import {
  commonVerbCards,
  verbConjugations,
} from "../src/content/spanish/vocabulary/common-verbs";
import {
  everydayPhrasesVocabulary,
  everydayPhrasesCards,
} from "../src/content/spanish/vocabulary/everyday-phrases";
import { SPANISH_CORE_GAME_IDS } from "../src/content/spanish/registry";

const prisma = new PrismaClient();

function validateGameRegistryAlignment(ids: readonly string[], seedIds: string[]): void {
  const missingFromRegistry = seedIds.filter((id) => !ids.includes(id));
  const missingFromSeed = ids.filter((id) => !seedIds.includes(id));

  if (missingFromRegistry.length || missingFromSeed.length) {
    throw new Error(
      `Spanish core game registry mismatch.\n` +
      `Missing in registry: ${missingFromRegistry.join(", ") || "none"}\n` +
      `Missing in seed: ${missingFromSeed.join(", ") || "none"}`
    );
  }
}

async function main() {
  console.log("Seeding Spanish games and vocabulary activities...");

  // Spanish Vocabulary Flashcard Activities
  const vocabularyActivities = [
    {
      id: "spanish-vocab-greetings",
      title: "Spanish Greetings & Basics",
      description: "Learn essential Spanish greetings, introductions, and polite expressions",
      content: JSON.stringify({
        type: "spanish-vocabulary",
        title: "Greetings & Basics",
        cards: greetingsBasicsCards,
        mode: "flashcard",
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "flashcard",
      isReleased: true,
    },
    {
      id: "spanish-vocab-numbers",
      title: "Spanish Numbers 0-100",
      description: "Master Spanish numbers from zero to one hundred",
      content: JSON.stringify({
        type: "spanish-vocabulary",
        title: "Numbers 0-100",
        cards: numbers1to100Cards,
        mode: "flashcard",
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "flashcard",
      isReleased: true,
    },
    {
      id: "spanish-vocab-colors",
      title: "Spanish Colors & Shapes",
      description: "Learn colors and basic shapes in Spanish",
      content: JSON.stringify({
        type: "spanish-vocabulary",
        title: "Colors & Shapes",
        cards: colorsShapesCards,
        mode: "flashcard",
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "flashcard",
      isReleased: true,
    },
    {
      id: "spanish-vocab-family",
      title: "Spanish Family & Relationships",
      description: "Learn family members and relationships in Spanish",
      content: JSON.stringify({
        type: "spanish-vocabulary",
        title: "Family & Relationships",
        cards: familyRelationshipsCards,
        mode: "flashcard",
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "flashcard",
      isReleased: true,
    },
    {
      id: "spanish-vocab-verbs",
      title: "Spanish Common Verbs",
      description: "Essential Spanish verbs for everyday communication",
      content: JSON.stringify({
        type: "spanish-vocabulary",
        title: "Common Verbs",
        cards: commonVerbCards,
        mode: "flashcard",
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "flashcard",
      isReleased: true,
    },
    {
      id: everydayPhrasesVocabulary.id,
      title: "Spanish Everyday Phrases",
      description:
        "Essential conversational phrases for restaurants, shopping, directions, and daily life",
      content: JSON.stringify({
        type: "spanish-vocabulary",
        title: everydayPhrasesVocabulary.title,
        cards: everydayPhrasesCards,
        mode: "flashcard",
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "flashcard",
      isReleased: true,
    },
  ];

  // Spanish Numbers Game Activities
  const numbersGameActivities = [
    {
      id: "spanish-numbers-game-easy",
      title: "Spanish Numbers Game (Easy)",
      description: "Practice typing Spanish numbers 0-20",
      content: JSON.stringify({
        type: "spanish-numbers-game",
        difficulty: "easy",
        timedMode: false,
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "spanish-numbers",
      isReleased: true,
    },
    {
      id: "spanish-numbers-game-medium",
      title: "Spanish Numbers Game (Medium)",
      description: "Practice typing Spanish numbers 0-100",
      content: JSON.stringify({
        type: "spanish-numbers-game",
        difficulty: "medium",
        timedMode: false,
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "spanish-numbers",
      isReleased: true,
    },
    {
      id: "spanish-numbers-game-timed",
      title: "Spanish Numbers Speed Challenge",
      description: "60-second timed challenge for Spanish numbers",
      content: JSON.stringify({
        type: "spanish-numbers-game",
        difficulty: "mixed",
        timedMode: true,
        timeLimit: 60,
      }),
      type: "game",
      category: "personal",
      level: "intermediate",
      ui: "spanish-numbers",
      isReleased: true,
    },
  ];

  // Spanish Verb Conjugation Game Activities
  const verbGameActivities = [
    {
      id: "spanish-verb-game-present-ar",
      title: "Present Tense -AR Verbs",
      description: "Practice conjugating regular -AR verbs in present tense",
      content: JSON.stringify({
        type: "spanish-verb-game",
        tense: "present",
        verbTypes: ["ar"],
        verbs: verbConjugations.filter((v) => v.type === "ar"),
        timedMode: false,
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "spanish-verbs",
      isReleased: true,
    },
    {
      id: "spanish-verb-game-present-er-ir",
      title: "Present Tense -ER/-IR Verbs",
      description: "Practice conjugating regular -ER and -IR verbs in present tense",
      content: JSON.stringify({
        type: "spanish-verb-game",
        tense: "present",
        verbTypes: ["er", "ir"],
        verbs: verbConjugations.filter((v) => v.type === "er" || v.type === "ir"),
        timedMode: false,
      }),
      type: "game",
      category: "personal",
      level: "beginner",
      ui: "spanish-verbs",
      isReleased: true,
    },
    {
      id: "spanish-verb-game-present-irregular",
      title: "Present Tense Irregular Verbs",
      description: "Master irregular verb conjugations: ser, estar, ir, tener, hacer, and more",
      content: JSON.stringify({
        type: "spanish-verb-game",
        tense: "present",
        verbTypes: ["irregular"],
        verbs: verbConjugations.filter((v) => v.type === "irregular"),
        timedMode: false,
      }),
      type: "game",
      category: "personal",
      level: "intermediate",
      ui: "spanish-verbs",
      isReleased: true,
    },
    {
      id: "spanish-verb-game-preterite",
      title: "Preterite (Past) Tense Practice",
      description: "Practice conjugating verbs in the preterite tense",
      content: JSON.stringify({
        type: "spanish-verb-game",
        tense: "preterite",
        verbTypes: ["ar", "er", "ir", "irregular"],
        verbs: verbConjugations.filter((v) => v.preterite),
        timedMode: false,
      }),
      type: "game",
      category: "personal",
      level: "intermediate",
      ui: "spanish-verbs",
      isReleased: true,
    },
    {
      id: "spanish-verb-game-mixed",
      title: "Verb Conjugation Challenge",
      description: "Mixed practice with all verb types and tenses",
      content: JSON.stringify({
        type: "spanish-verb-game",
        tense: "mixed",
        verbTypes: ["ar", "er", "ir", "irregular"],
        verbs: verbConjugations,
        timedMode: false,
      }),
      type: "game",
      category: "personal",
      level: "intermediate",
      ui: "spanish-verbs",
      isReleased: true,
    },
    {
      id: "spanish-verb-race",
      title: "Verb Race (Timed)",
      description: "60-second speed challenge for verb conjugations",
      content: JSON.stringify({
        type: "spanish-verb-game",
        tense: "mixed",
        verbTypes: ["ar", "er", "ir", "irregular"],
        verbs: verbConjugations,
        timedMode: true,
        timeLimit: 60,
      }),
      type: "game",
      category: "personal",
      level: "advanced",
      ui: "spanish-verbs",
      isReleased: true,
    },
  ];

  // Upsert all activities
  const allActivities = [
    ...vocabularyActivities,
    ...numbersGameActivities,
    ...verbGameActivities,
  ];
  validateGameRegistryAlignment(
    SPANISH_CORE_GAME_IDS,
    allActivities.map((activity) => activity.id)
  );

  for (const activity of allActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {
        title: activity.title,
        description: activity.description,
        content: activity.content,
        type: activity.type,
        category: activity.category,
        level: activity.level,
        ui: activity.ui,
        isReleased: activity.isReleased,
      },
      create: activity,
    });
    console.log(`✓ Upserted: ${activity.title}`);
  }

  console.log(`\nSuccessfully seeded ${allActivities.length} Spanish learning activities!`);
  console.log("\nCategories:");
  console.log(`  - Vocabulary Flashcards: ${vocabularyActivities.length}`);
  console.log(`  - Numbers Games: ${numbersGameActivities.length}`);
  console.log(`  - Verb Conjugation Games: ${verbGameActivities.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
