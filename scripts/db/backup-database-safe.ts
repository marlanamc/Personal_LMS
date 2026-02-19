import { PrismaClient } from '@prisma/client';
import { createHash, createCipheriv, randomBytes } from 'crypto';
import { gzipSync } from 'zlib';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function toFileSafeIso(iso: string): string {
  return iso.replace(/:/g, '-').replace(/\..+$/, '');
}

function sha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

function deriveKey(secret: string): Buffer {
  return createHash('sha256').update(secret, 'utf8').digest();
}

function encryptAesGcm(plain: Buffer, secret: string): Buffer {
  const key = deriveKey(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Binary format: [12-byte IV][16-byte TAG][ciphertext]
  return Buffer.concat([iv, tag, encrypted]);
}

async function main() {
  const timestamp = new Date().toISOString();
  const stamp = toFileSafeIso(timestamp);
  const outputDir = path.join(process.cwd(), 'backups');
  const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY;

  fs.mkdirSync(outputDir, { recursive: true });

  console.log('Starting safe database backup...');
  console.log(`Output directory: ${outputDir}`);
  console.log(`Encryption: ${encryptionKey ? 'enabled' : 'disabled'}`);

  const [
    users,
    classes,
    classEnrollments,
    activities,
    assignments,
    submissions,
    activityProgress,
    quizResponses,
    speakingSubmissions,
    pointsLedger,
    achievements,
    userAchievements,
    calendarEvents,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.class.findMany(),
    prisma.classEnrollment.findMany(),
    prisma.activity.findMany(),
    prisma.assignment.findMany(),
    prisma.submission.findMany(),
    prisma.activityProgress.findMany(),
    prisma.quizResponse.findMany(),
    prisma.speakingSubmission.findMany(),
    prisma.pointsLedger.findMany(),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany(),
    prisma.calendarEvent.findMany(),
  ]);

  const payload = {
    meta: {
      version: 1,
      timestamp,
      encrypted: Boolean(encryptionKey),
      note: 'Contains sensitive data (including password hashes). Keep secure.',
    },
    data: {
      users,
      classes,
      classEnrollments,
      activities,
      assignments,
      submissions,
      activityProgress,
      quizResponses,
      speakingSubmissions,
      pointsLedger,
      achievements,
      userAchievements,
      calendarEvents,
    },
  };

  const jsonBuffer = Buffer.from(JSON.stringify(payload));
  const gzBuffer = gzipSync(jsonBuffer, { level: 9 });

  const baseName = `backup-${stamp}.json.gz`;
  const finalName = encryptionKey ? `${baseName}.enc` : baseName;
  const finalPath = path.join(outputDir, finalName);
  const contentBuffer = encryptionKey ? encryptAesGcm(gzBuffer, encryptionKey) : gzBuffer;

  fs.writeFileSync(finalPath, contentBuffer);

  const checksum = sha256(contentBuffer);
  fs.writeFileSync(`${finalPath}.sha256`, `${checksum}  ${path.basename(finalPath)}\n`, 'utf8');

  console.log('Backup complete.');
  console.log(`File: ${finalPath}`);
  console.log(`Size: ${(contentBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`SHA256: ${checksum}`);
  console.log('Row counts:');
  console.log(`  users: ${users.length}`);
  console.log(`  activities: ${activities.length}`);
  console.log(`  assignments: ${assignments.length}`);
  console.log(`  submissions: ${submissions.length}`);
  console.log(`  activityProgress: ${activityProgress.length}`);
}

main()
  .catch((error) => {
    console.error('Backup failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
