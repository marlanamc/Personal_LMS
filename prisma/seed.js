const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const BCRYPT_ROUNDS = 12;

async function upsertUser(username, name, mustChangePassword = true) {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
  return prisma.user.upsert({
    where: { username },
    update: {
      name,
      password: passwordHash,
      mustChangePassword,
    },
    create: {
      username,
      name,
      password: passwordHash,
      mustChangePassword,
    },
  });
}

async function main() {
  const marlie = await upsertUser('marlie', 'Marlie', false);

  await prisma.class.upsert({
    where: { id: 'marlie-lms-class' },
    update: {
      name: 'Marlie LMS',
      description: 'Personal learning workspace',
      ownerId: marlie.id,
    },
    create: {
      id: 'marlie-lms-class',
      name: 'Marlie LMS',
      description: 'Personal learning workspace',
      ownerId: marlie.id,
    },
  });

  console.log('✅ Seeded personal LMS base account: username "marlie", password "password123"');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
