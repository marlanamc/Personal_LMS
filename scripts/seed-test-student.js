const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;
const TEST_PASSWORD = 'test-password-123';

async function main() {
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, BCRYPT_ROUNDS);
    
    // Create test student
    const student = await prisma.user.upsert({
        where: { username: 'test-student' },
        update: {
            password: passwordHash,
            role: 'student',
            mustChangePassword: false
        },
        create: {
            username: 'test-student',
            name: 'Test Student',
            password: passwordHash,
            role: 'student',
            mustChangePassword: false
        },
    });

    // Find ESOL3 class
    const esolClass = await prisma.class.findFirst({
        where: { code: 'ESOL3' }
    });

    if (esolClass) {
        await prisma.classEnrollment.upsert({
            where: {
                classId_studentId: {
                    classId: esolClass.id,
                    studentId: student.id,
                },
            },
            update: {},
            create: {
                classId: esolClass.id,
                studentId: student.id,
            },
        });
        console.log('✅ Test student created and enrolled in ESOL 3');
    } else {
        console.log('✅ Test student created (no class found for enrollment)');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
