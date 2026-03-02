import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const BCRYPT_ROUNDS = 12;

async function upsertUser(username: string, name: string, mustChangePassword = false) {
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
  console.log('👤 Setting up personal LMS account...\n');

  // Create the single personal account
  const marlie = await upsertUser('marlie', 'Marlie', false);
  console.log('  ✅ Account created: marlie');

  // Create default class owned by marlie
  const marlieClass = await prisma.class.upsert({
    where: { id: 'marlie-lms-class' },
    update: {
      ownerId: marlie.id,
    },
    create: {
      id: 'marlie-lms-class',
      name: 'Marlie LMS',
      description: 'Personal learning workspace',
      ownerId: marlie.id,
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
