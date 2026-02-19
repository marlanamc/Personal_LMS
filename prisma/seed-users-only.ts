import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const BCRYPT_ROUNDS = 12;

const studentNames = [
  'Ricardo',
  'Andrea',
  'Carolina',
  'Ingrid',
  'Elena',
  'Ever',
  'Carlos M',
  'Edwar',
  'Alexandra',
  'Sonia',
  'Erica',
  'Carlos O',
  'Julian',
  'Esteban',
  'Esmeralda',
  'Susan',
  'Will',
  'Marlie',
  'Tolesa',
  'Yonatan',
  'Hazel',
  'Evelyn',
];

const toUsername = (name: string) => name.trim().toLowerCase().replace(/\s+/g, '');

async function upsertUser(username: string, name: string, role = 'student', mustChangePassword = true) {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
  return prisma.user.upsert({
    where: { username },
    update: {
      // Don't overwrite existing passwords or mustChangePassword flags
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

  // Create teacher
  const teacher = await upsertUser('teacher', 'Teacher User', 'teacher', true);
  console.log('  ✅ Teacher:', teacher.name);

  // Create all students
  const students = [];
  for (const name of studentNames) {
    const username = toUsername(name);
    const student = await upsertUser(username, name, 'student');
    students.push(student);
    console.log(`  ✅ Student: ${student.name}`);
  }

  // Create ESOL 3 class
  const esol3Class = await prisma.class.upsert({
    where: { code: 'ESOL3' },
    update: {},
    create: {
      name: 'ESOL 3',
      description: 'ESOL Level 3 - Your Class',
      code: 'ESOL3',
      teacherId: teacher.id,
    },
  });
  console.log('\n  📚 Class:', esol3Class.name);

  // Enroll all students in ESOL 3
  for (const student of students) {
    await prisma.classEnrollment.upsert({
      where: {
        classId_studentId: {
          classId: esol3Class.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        classId: esol3Class.id,
        studentId: student.id,
      },
    });
  }

  console.log(`\n✨ Users seeded successfully!`);
  console.log(`   Teacher: 1 | Students: ${students.length} | Enrollments: ${students.length}`);
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
