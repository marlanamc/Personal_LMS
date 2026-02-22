import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const activities = await prisma.activity.findMany({
    select: { id: true, title: true, type: true, category: true },
    orderBy: { category: "asc" }
  });

  const byCategory: Record<string, typeof activities> = {};
  for (const a of activities) {
    const cat = a.category || "uncategorized";
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(a);
  }

  console.log("=== ALL ACTIVITIES BY CATEGORY ===\n");
  for (const [cat, acts] of Object.entries(byCategory)) {
    console.log(`\n### ${cat.toUpperCase()} (${acts.length} activities) ###`);
    for (const a of acts) {
      console.log(`  - ${a.id} | ${a.type} | ${a.title}`);
    }
  }
  console.log(`\n\nTOTAL: ${activities.length} activities`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
