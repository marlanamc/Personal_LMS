-- CreateTable
CREATE TABLE "DailyWin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyWin_userId_createdAt_idx" ON "DailyWin"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "DailyWin" ADD CONSTRAINT "DailyWin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
