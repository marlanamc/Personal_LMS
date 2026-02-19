const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TITLES_TO_REMOVE = [
  'Future Simple - Complete Guide & Practice | ESOL Teacher Resources',
  'Past Simple - Complete Guide & Practice | ESOL Teacher Resources',
  'Present Simple - Complete Guide & Practice | ESOL Teacher Resources',
  'Simple Tenses Review Guide | ESOL Teacher Resources',
  'Present Perfect - Complete Guide & Practice | ESOL Teacher Resources',
];

async function main() {
  const activities = await prisma.activity.findMany({
    where: { title: { in: TITLES_TO_REMOVE } },
    select: {
      id: true,
      title: true,
      assignments: { select: { id: true } },
    },
  });

  if (!activities.length) {
    console.log('No matching activities found.');
    return;
  }

  const activityIds = activities.map((a) => a.id);
  const assignmentIds = activities.flatMap((a) => a.assignments.map((assn) => assn.id));

  console.log('Removing activities:', activities.map((a) => a.title));
  console.log('Activity IDs:', activityIds);
  console.log('Assignment IDs:', assignmentIds);

  // Remove submissions tied to these activities or their assignments first (due to FK constraints)
  const submissionResult = await prisma.submission.deleteMany({
    where: {
      OR: [
        { activityId: { in: activityIds } },
        { assignmentId: { in: assignmentIds } },
      ],
    },
  });
  console.log(`Deleted ${submissionResult.count} submissions`);

  // Remove assignments for these activities
  const assignmentResult = await prisma.assignment.deleteMany({
    where: { activityId: { in: activityIds } },
  });
  console.log(`Deleted ${assignmentResult.count} assignments`);

  // Finally remove the activities
  const activityResult = await prisma.activity.deleteMany({
    where: { id: { in: activityIds } },
  });
  console.log(`Deleted ${activityResult.count} activities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

