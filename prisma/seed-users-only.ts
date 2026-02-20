import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const BCRYPT_ROUNDS = 12;

async function upsertUser(username: string, name: string, role = 'student', mustChangePassword = true) {
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
  console.log('👥 Upserting users (does NOT affect student progress)...\n');

  // Create the main personal account (as teacher)
  const marlie = await upsertUser('marlie', 'Marlie', 'teacher', true);
  console.log('  ✅ Personal Admin (Teacher):', marlie.username);

  // Preserve the 'teacher' username for backward compatibility if needed, but 'marlie' is the main one
  const teacher = await upsertUser('teacher', 'Teacher', 'teacher', true);
  console.log('  ✅ Legacy Teacher:', teacher.username);

  // Create one optional demo student account
  const demoStudent = await upsertUser('student', 'Marlie', 'student');
  console.log(`  ✅ Student: ${demoStudent.name}`);

  // Create default class
  const marlieClass = await prisma.class.upsert({
    where: { code: 'MARLIE101' },
    update: {},
    create: {
      name: 'Marlie LMS',
      description: 'Default class for Marlie LMS',
      code: 'MARLIE101',
      teacherId: teacher.id,
    },
  });
  console.log('\n  📚 Class:', marlieClass.name);

  // Enroll demo student in default class
  await prisma.classEnrollment.upsert({
    where: {
      classId_studentId: {
        classId: marlieClass.id,
        studentId: demoStudent.id,
      },
    },
    update: {},
    create: {
      classId: marlieClass.id,
      studentId: demoStudent.id,
    },
  });

  console.log(`\n✨ Users seeded successfully!`);
  console.log('   Teacher: 1 | Students: 1 | Enrollments: 1');
  console.log('\n💡 Student progress (ActivityProgress, Submissions) was preserved.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
