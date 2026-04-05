-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "emoji" TEXT,
    "color" TEXT NOT NULL DEFAULT 'sakura',
    "status" TEXT NOT NULL DEFAULT 'active',
    "order" INTEGER NOT NULL DEFAULT 0,
    "anchorX" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastFocused" TIMESTAMP(3),
    "lastRested" TIMESTAMP(3),

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Thread_userId_status_idx" ON "Thread"("userId", "status");

-- CreateIndex
CREATE INDEX "Thread_userId_order_idx" ON "Thread"("userId", "order");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
