-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "focusStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActivityDate" TIMESTAMP(3),
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ThreadActivity" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThreadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ThreadActivity_threadId_idx" ON "ThreadActivity"("threadId");

-- CreateIndex
CREATE INDEX "ThreadActivity_activityId_idx" ON "ThreadActivity"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "ThreadActivity_threadId_activityId_key" ON "ThreadActivity"("threadId", "activityId");

-- AddForeignKey
ALTER TABLE "ThreadActivity" ADD CONSTRAINT "ThreadActivity_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadActivity" ADD CONSTRAINT "ThreadActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
