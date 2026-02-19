import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating speaking activities with released: false...\n');

  // Find all speaking activities
  const speakingActivities = await prisma.activity.findMany({
    where: {
      category: 'speaking'
    }
  });

  console.log(`Found ${speakingActivities.length} speaking activities\n`);

  let updateCount = 0;

  for (const activity of speakingActivities) {
    try {
      const content = JSON.parse(activity.content);

      // Reset released to false for all speaking activities
      if (content.released !== false) {
        content.released = false;

        await prisma.activity.update({
          where: { id: activity.id },
          data: {
            content: JSON.stringify(content)
          }
        });

        console.log(`✅ Updated ${activity.title} (${activity.id})`);
        updateCount++;
      } else {
        console.log(`⏭️  Skipped ${activity.title} (already released: false)`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${activity.id}:`, error);
    }
  }

  console.log(`\n📊 Update Summary:`);
  console.log(`   ✅ Updated: ${updateCount} activities`);
  console.log(`   ⏭️  Skipped: ${speakingActivities.length - updateCount} activities`);
  console.log(`\n✨ Update complete!\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during update:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
