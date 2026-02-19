import { PrismaClient } from '@prisma/client';
import { gerundsInfinitivesContent } from '../src/content/grammar/gerunds-infinitives';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Gerunds & Infinitives grammar guide...');

  await prisma.activity.upsert({
    where: { id: "gerunds-infinitives" },
    update: {
      content: JSON.stringify(gerundsInfinitivesContent),
      title: "Gerunds & Infinitives Guide",
      type: "guide",
      category: "grammar",
      description: "Master the 6 essential patterns for using gerunds (-ing) and infinitives (to + verb). Learn when verbs become nouns, the critical 'preposition + gerund' rule, and how to avoid common mistakes. Pattern-based approach makes this complex grammar simple and memorable.",
    },
    create: {
      id: "gerunds-infinitives",
      title: "Gerunds & Infinitives Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(gerundsInfinitivesContent),
      description: "Master the 6 essential patterns for using gerunds (-ing) and infinitives (to + verb). Learn when verbs become nouns, the critical 'preposition + gerund' rule, and how to avoid common mistakes. Pattern-based approach makes this complex grammar simple and memorable.",
    },
  });

  console.log('✅ Gerunds & Infinitives guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
