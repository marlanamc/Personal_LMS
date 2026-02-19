const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';

async function createLeah() {
    try {
        console.log('🔍 Creating leah user account...\n');
        
        // Use BCRYPT_ROUNDS = 12 (industry standard for 2025)
        const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
        
        // Create the user
        const user = await prisma.user.upsert({
            where: { username: 'leah' },
            update: {
                name: 'Leah',
                role: 'student',
            },
            create: {
                username: 'leah',
                name: 'Leah',
                password: passwordHash,
                role: 'student',
                mustChangePassword: true,
            },
        });

        console.log(`✅ Created/updated user: ${user.name} (${user.username})`);
        console.log(`📋 User ID: ${user.id}`);
        console.log(`🔑 Password: ${DEFAULT_PASSWORD}`);
        
        // Check if ESOL3 class exists and enroll leah
        const esol3Class = await prisma.class.findUnique({
            where: { code: 'ESOL3' },
        });

        if (esol3Class) {
            // Enroll in ESOL3 class
            await prisma.classEnrollment.upsert({
                where: {
                    classId_studentId: {
                        classId: esol3Class.id,
                        studentId: user.id,
                    },
                },
                update: {},
                create: {
                    classId: esol3Class.id,
                    studentId: user.id,
                },
            });
            console.log(`✅ Enrolled in ESOL3 class`);
        } else {
            console.log(`⚠️  ESOL3 class not found - user created but not enrolled`);
        }
        
        console.log('\n✅ Leah account is ready!');
        console.log('   Username: leah');
        console.log(`   Password: ${DEFAULT_PASSWORD}`);
        console.log('   Note: This account is excluded from leaderboard rankings');
        
    } catch (error) {
        console.error('❌ Error creating user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createLeah();