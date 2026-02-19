import * as fs from 'fs';
import * as path from 'path';

type BackupFile = {
  name: string;
  fullPath: string;
  location: string;
  sizeMB: string;
  modified: Date;
};

function listFilesInDir(dir: string, patterns: RegExp[]): BackupFile[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter((name) => patterns.some((pattern) => pattern.test(name)))
    .map((name) => {
      const fullPath = path.join(dir, name);
      const stats = fs.statSync(fullPath);
      return {
        name,
        fullPath,
        location: path.basename(dir) || dir,
        sizeMB: (stats.size / 1024 / 1024).toFixed(2),
        modified: stats.mtime,
      };
    })
    .sort((a, b) => b.modified.getTime() - a.modified.getTime());
}

function printFiles(title: string, files: BackupFile[]) {
  console.log(`${title}`);
  if (files.length === 0) {
    console.log('   ❌ None found\n');
    return;
  }

  console.log(`   ✅ Found ${files.length} file(s):\n`);
  for (const file of files) {
    console.log(`   📄 ${file.name}`);
    console.log(`      Location: ${file.location}`);
    console.log(`      Size: ${file.sizeMB} MB`);
    console.log(`      Modified: ${file.modified.toLocaleString()}`);
    console.log('');
  }
}

async function main() {
  console.log('🔍 Checking for database backups...\n');

  const projectRoot = process.cwd();
  const backupDir = path.join(projectRoot, 'backups');
  const sqliteBackupDir = path.join(projectRoot, 'prisma', 'backups');

  const backupSearchDirs = [projectRoot, backupDir];

  const jsonPatterns = [
    /^backup-.*\.json$/i,
    /^backup-.*\.json\.gz$/i,
    /^backup-.*\.json\.gz\.enc$/i,
  ];
  const sqlPatterns = [/^backup-.*\.sql$/i];
  const checksumPatterns = [/^backup-.*\.sha256$/i, /^backup-.*\.json\.gz(\.enc)?\.sha256$/i];

  const jsonBackups = backupSearchDirs.flatMap((dir) => listFilesInDir(dir, jsonPatterns));
  const sqlBackups = backupSearchDirs.flatMap((dir) => listFilesInDir(dir, sqlPatterns));
  const checksums = backupSearchDirs.flatMap((dir) => listFilesInDir(dir, checksumPatterns));
  const sqliteBackups = listFilesInDir(sqliteBackupDir, [/\.db$/i, /\.db\.bak$/i, /\.sqlite$/i]);

  printFiles('📦 JSON/GZIP backups', jsonBackups);
  printFiles('🗄️ SQL dump backups', sqlBackups);
  printFiles('🔐 Checksum files', checksums);
  printFiles('💾 SQLite backups', sqliteBackups);

  const total = jsonBackups.length + sqlBackups.length;
  console.log('📋 Summary:');
  console.log(`   JSON/GZIP backups: ${jsonBackups.length}`);
  console.log(`   SQL backups: ${sqlBackups.length}`);
  console.log(`   Checksum files: ${checksums.length}`);
  console.log(`   Total backup files: ${total}`);

  if (total === 0) {
    console.log('\n❌ No backups found.');
    console.log('   Suggested next step: run `npm run db:backup:safe`.');
    return;
  }

  const latest = [...jsonBackups, ...sqlBackups]
    .sort((a, b) => b.modified.getTime() - a.modified.getTime())[0];

  if (latest) {
    console.log(`\n✅ Most recent backup: ${latest.name}`);
    console.log(`   Path: ${latest.fullPath}`);
  }
}

main().catch((error) => {
  console.error('❌ Error checking backups:', error);
  process.exit(1);
});
