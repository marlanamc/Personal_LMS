import { PrismaClient } from '@prisma/client';
import { codingVariablesTypesContent } from '../src/content/personal/coding-variables-types';
import { codingFunctionsParametersContent } from '../src/content/personal/coding-functions-parameters';
import { codingLoopsControlFlowContent } from '../src/content/personal/coding-loops-control-flow';
import { codingArraysObjectsContent } from '../src/content/personal/coding-arrays-objects';
import { codingAsyncPromisesContent } from '../src/content/personal/coding-async-promises';
import { codingOperatorsExpressionsContent } from '../src/content/personal/coding-operators-expressions';
import { codingStringsMethodsContent } from '../src/content/personal/coding-strings-methods';
import { codingErrorHandlingContent } from '../src/content/personal/coding-error-handling';
import { codingDomManipulationContent } from '../src/content/personal/coding-dom-manipulation';
import { codingClassesOopContent } from '../src/content/personal/coding-classes-oop';
import { codingModulesImportsContent } from '../src/content/personal/coding-modules-imports';
import { codingWorkingWithApisContent } from '../src/content/personal/coding-working-with-apis';
import { codingTypescriptDeepDiveContent } from '../src/content/personal/coding-typescript-deep-dive';
import { codingArrayMethodMasteryContent } from '../src/content/personal/coding-array-method-mastery';
import { codingDebuggingDevtoolsContent } from '../src/content/personal/coding-debugging-devtools';
import { CODING_GUIDE_IDS } from '../src/content/coding/registry';

const prisma = new PrismaClient();
const removedSampleActivityIds = ['coding-js-ts', 'spanish-refresher'];

function validateCodingGuideRegistryAlignment(ids: readonly string[], seededIds: string[]): void {
  const missingFromRegistry = seededIds.filter((id) => !ids.includes(id));
  const missingFromSeed = ids.filter((id) => !seededIds.includes(id));

  if (missingFromRegistry.length || missingFromSeed.length) {
    throw new Error(
      `Coding guide registry mismatch.\n` +
      `Missing in registry: ${missingFromRegistry.join(', ') || 'none'}\n` +
      `Missing in seed: ${missingFromSeed.join(', ') || 'none'}`
    );
  }
}

const personalActivities = [
  {
    id: 'coding-variables-types',
    title: 'JavaScript Variables & Data Types',
    description: 'Personal coding guide covering variable declaration and core JavaScript data types.',
    level: 'beginner',
    content: codingVariablesTypesContent,
  },
  {
    id: 'coding-functions-parameters',
    title: 'Functions & Parameters',
    description: 'Personal coding guide on reusable functions, parameters, and return values.',
    level: 'beginner',
    content: codingFunctionsParametersContent,
  },
  {
    id: 'coding-loops-control-flow',
    title: 'Loops & Control Flow',
    description: 'Personal coding guide for conditionals, loops, and decision logic.',
    level: 'beginner',
    content: codingLoopsControlFlowContent,
  },
  {
    id: 'coding-arrays-objects',
    title: 'Arrays & Objects',
    description: 'Personal coding guide for organizing and working with structured JavaScript data.',
    level: 'beginner',
    content: codingArraysObjectsContent,
  },
  {
    id: 'coding-async-promises',
    title: 'Async/Await & Promises',
    description: 'Personal coding guide for asynchronous workflows and promise handling.',
    level: 'intermediate',
    content: codingAsyncPromisesContent,
  },
  // New guides - Foundations
  {
    id: 'coding-operators-expressions',
    title: 'Operators & Expressions',
    description: 'Master arithmetic, comparison, logical, ternary, nullish coalescing, and optional chaining operators.',
    level: 'beginner',
    content: codingOperatorsExpressionsContent,
  },
  {
    id: 'coding-strings-methods',
    title: 'Strings & String Methods',
    description: 'Work with text using template literals and common methods like split, join, trim, includes, and replace.',
    level: 'beginner',
    content: codingStringsMethodsContent,
  },
  {
    id: 'coding-error-handling',
    title: 'Error Handling',
    description: 'Learn try/catch/finally, throwing errors, Error types, and debugging basics.',
    level: 'beginner',
    content: codingErrorHandlingContent,
  },
  // New guides - Intermediate
  {
    id: 'coding-dom-manipulation',
    title: 'DOM Manipulation',
    description: 'Build interactive web pages with element selection, events, and dynamic content.',
    level: 'intermediate',
    content: codingDomManipulationContent,
  },
  {
    id: 'coding-classes-oop',
    title: 'Classes & OOP',
    description: 'Object-oriented programming with constructors, methods, inheritance, and the this keyword.',
    level: 'intermediate',
    content: codingClassesOopContent,
  },
  {
    id: 'coding-modules-imports',
    title: 'Modules & Imports',
    description: 'Organize code with ES modules, named/default exports, and dynamic imports.',
    level: 'intermediate',
    content: codingModulesImportsContent,
  },
  {
    id: 'coding-working-with-apis',
    title: 'Working with APIs',
    description: 'Connect to APIs using fetch(), handle JSON, HTTP methods, and authentication.',
    level: 'intermediate',
    content: codingWorkingWithApisContent,
  },
  // New guides - Advanced
  {
    id: 'coding-typescript-deep-dive',
    title: 'TypeScript Deep Dive',
    description: 'Advanced TypeScript: interfaces, generics, union types, type guards, and utility types.',
    level: 'advanced',
    content: codingTypescriptDeepDiveContent,
  },
  {
    id: 'coding-array-method-mastery',
    title: 'Array Method Mastery',
    description: 'Master map, filter, reduce, find, some, every, and method chaining for data transformation.',
    level: 'advanced',
    content: codingArrayMethodMasteryContent,
  },
  {
    id: 'coding-debugging-devtools',
    title: 'Debugging & Dev Tools',
    description: 'Debug like a pro with console methods, breakpoints, Network tab, and debugging strategies.',
    level: 'advanced',
    content: codingDebuggingDevtoolsContent,
  },
];

async function main() {
  console.log('🧠 Upserting personal activities...\n');
  validateCodingGuideRegistryAlignment(
    CODING_GUIDE_IDS,
    personalActivities.map((activity) => activity.id)
  );

  await prisma.activityProgress.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await prisma.quizResponse.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await prisma.speakingSubmission.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await prisma.submission.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await prisma.assignment.deleteMany({
    where: {
      activityId: {
        in: removedSampleActivityIds,
      },
    },
  });

  await prisma.activity.deleteMany({
    where: {
      id: {
        in: removedSampleActivityIds,
      },
    },
  });

  for (const activity of personalActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {
        title: activity.title,
        description: activity.description,
        type: 'guide',
        category: 'personal',
        level: activity.level,
        content: JSON.stringify(activity.content),
      },
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: 'guide',
        category: 'personal',
        level: activity.level,
        content: JSON.stringify(activity.content),
      },
    });

    console.log(`  ✅ ${activity.title}`);
  }

  console.log('\n✨ Personal activities seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
