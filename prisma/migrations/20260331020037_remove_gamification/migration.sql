/*
  Warnings:

  - You are about to drop the column `pointsAwarded` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `currentStreak` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastActivityDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastWeekRank` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `longestStreak` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyPoints` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyChallenge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PointsLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAchievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDailyChallenge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PointsLedger" DROP CONSTRAINT "PointsLedger_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDailyChallenge" DROP CONSTRAINT "UserDailyChallenge_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "UserDailyChallenge" DROP CONSTRAINT "UserDailyChallenge_userId_fkey";

-- DropIndex
DROP INDEX "User_weeklyPoints_idx";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "pointsAwarded";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentStreak",
DROP COLUMN "lastActivityDate",
DROP COLUMN "lastWeekRank",
DROP COLUMN "longestStreak",
DROP COLUMN "points",
DROP COLUMN "weeklyPoints";

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "DailyChallenge";

-- DropTable
DROP TABLE "PointsLedger";

-- DropTable
DROP TABLE "UserAchievement";

-- DropTable
DROP TABLE "UserDailyChallenge";

-- CreateTable
CREATE TABLE "HealthTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthTrackerEntry" (
    "id" TEXT NOT NULL,
    "trackerId" TEXT NOT NULL,
    "dateKey" TEXT NOT NULL,
    "valueBool" BOOLEAN,
    "valueNum" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthTrackerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodPressureReading" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "note" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloodPressureReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MomentTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MomentTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MomentReading" (
    "id" TEXT NOT NULL,
    "trackerId" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "note" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MomentReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthTracker_userId_idx" ON "HealthTracker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthTrackerEntry_trackerId_dateKey_key" ON "HealthTrackerEntry"("trackerId", "dateKey");

-- CreateIndex
CREATE INDEX "BloodPressureReading_userId_recordedAt_idx" ON "BloodPressureReading"("userId", "recordedAt");

-- CreateIndex
CREATE INDEX "MomentTracker_userId_idx" ON "MomentTracker"("userId");

-- CreateIndex
CREATE INDEX "MomentReading_trackerId_recordedAt_idx" ON "MomentReading"("trackerId", "recordedAt");

-- AddForeignKey
ALTER TABLE "HealthTracker" ADD CONSTRAINT "HealthTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthTrackerEntry" ADD CONSTRAINT "HealthTrackerEntry_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "HealthTracker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodPressureReading" ADD CONSTRAINT "BloodPressureReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomentTracker" ADD CONSTRAINT "MomentTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomentReading" ADD CONSTRAINT "MomentReading_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "MomentTracker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
