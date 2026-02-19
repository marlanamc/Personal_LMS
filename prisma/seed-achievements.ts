import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const achievements = [
  // Streak Achievements
  {
    name: 'First Steps',
    description: 'Complete your first activity',
    icon: '👣',
    type: 'activity',
    requirement: 1,
    points: 10,
  },
  {
    name: 'Getting Started',
    description: 'Complete 5 activities',
    icon: '🌱',
    type: 'activity',
    requirement: 5,
    points: 25,
  },
  {
    name: 'Dedicated Learner',
    description: 'Complete 20 activities',
    icon: '📚',
    type: 'activity',
    requirement: 20,
    points: 50,
  },
  {
    name: 'Activity Master',
    description: 'Complete 50 activities',
    icon: '🏆',
    type: 'activity',
    requirement: 50,
    points: 100,
  },

  // Streak Achievements
  {
    name: 'Day One',
    description: 'Start your first streak',
    icon: '🔥',
    type: 'streak',
    requirement: 1,
    points: 5,
  },
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '💪',
    type: 'streak',
    requirement: 7,
    points: 50,
  },
  {
    name: 'Two Week Champion',
    description: 'Maintain a 14-day streak',
    icon: '⭐',
    type: 'streak',
    requirement: 14,
    points: 100,
  },
  {
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '🎯',
    type: 'streak',
    requirement: 30,
    points: 250,
  },

  // Quiz/Score Achievements
  {
    name: 'Perfect Start',
    description: 'Get 100% on your first quiz',
    icon: '💯',
    type: 'quiz',
    requirement: 1,
    points: 20,
  },
  {
    name: 'Quiz Ace',
    description: 'Get 100% on 5 quizzes',
    icon: '🌟',
    type: 'quiz',
    requirement: 5,
    points: 75,
  },
  {
    name: 'Perfectionist',
    description: 'Get 100% on 10 quizzes',
    icon: '💎',
    type: 'quiz',
    requirement: 10,
    points: 150,
  },

  // Points Achievements
  {
    name: 'Point Collector',
    description: 'Earn 100 total points',
    icon: '🪙',
    type: 'points',
    requirement: 100,
    points: 25,
  },
  {
    name: 'Point Hoarder',
    description: 'Earn 500 total points',
    icon: '💰',
    type: 'points',
    requirement: 500,
    points: 100,
  },
  {
    name: 'Point Legend',
    description: 'Earn 1000 total points',
    icon: '👑',
    type: 'points',
    requirement: 1000,
    points: 250,
  },
];

async function seedAchievements() {
  console.log('Seeding achievements...');

  for (const achievement of achievements) {
    const existing = await prisma.achievement.findFirst({
      where: { name: achievement.name },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: achievement,
      });
    } else {
      await prisma.achievement.create({
        data: achievement,
      });
    }
  }

  console.log(`✅ Seeded ${achievements.length} achievements`);
}

seedAchievements()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
