import { PrismaClient } from '@prisma/client';
import { codingJsTsContent } from '../src/content/personal/coding-js-ts';
import { spanishRefresherContent } from '../src/content/personal/spanish-refresher';
import { codingVariablesTypesContent } from '../src/content/personal/coding-variables-types';
import { codingFunctionsParametersContent } from '../src/content/personal/coding-functions-parameters';
import { codingLoopsControlFlowContent } from '../src/content/personal/coding-loops-control-flow';
import { codingArraysObjectsContent } from '../src/content/personal/coding-arrays-objects';
import { codingAsyncPromisesContent } from '../src/content/personal/coding-async-promises';

const prisma = new PrismaClient();

const personalActivities = [
  {
    id: 'coding-js-ts',
    title: 'Coding JS/TS Refresher',
    description: 'Quick personal refresher on JavaScript and TypeScript essentials.',
    level: 'beginner',
    content: codingJsTsContent,
  },
  {
    id: 'spanish-refresher',
    title: 'Spanish Basics Refresher',
    description: 'Personal Spanish practice with greetings and core present-tense verbs.',
    level: 'beginner',
    content: spanishRefresherContent,
  },
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
];

async function main() {
  console.log('🧠 Upserting personal activities...\n');

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
