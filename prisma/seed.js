const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const BCRYPT_ROUNDS = 12;

async function upsertUser(username, name, role = 'student', mustChangePassword = true) {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
  return prisma.user.upsert({
    where: { username },
    update: { name, role },
    create: {
      username,
      name,
      password: passwordHash,
      role,
      mustChangePassword,
    },
  });
}

async function main() {
  const marlie = await upsertUser('marlie', 'Marlie', 'teacher', false);

  await prisma.class.upsert({
    where: { code: 'MARLIE101' },
    update: {
      name: 'Marlie LMS',
      description: 'Personal learning workspace',
      teacherId: marlie.id,
    },
    create: {
      name: 'Marlie LMS',
      description: 'Personal learning workspace',
      code: 'MARLIE101',
      teacherId: marlie.id,
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
