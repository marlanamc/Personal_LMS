import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const BCRYPT_ROUNDS = 12;

async function upsertUser(username: string, name: string, role = 'student', mustChangePassword = false) {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
  return prisma.user.upsert({
    where: { username },
    update: {
      name,
      role,
    },
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
  console.log('👤 Setting up personal LMS account...\n');

  // Create the single personal account (as teacher for full access)
  const marlie = await upsertUser('marlie', 'Marlie', 'teacher', false);
  console.log('  ✅ Account created: marlie');

  // Create default class owned by marlie
  const marlieClass = await prisma.class.upsert({
    where: { code: 'MARLIE101' },
    update: {
      teacherId: marlie.id,
    },
    create: {
      name: 'Marlie LMS',
      description: 'Personal learning workspace',
      code: 'MARLIE101',
      teacherId: marlie.id,
    },
  });
  console.log('  📚 Class:', marlieClass.name);

  console.log(`\n✨ Setup complete!`);
  console.log('   Username: marlie');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
