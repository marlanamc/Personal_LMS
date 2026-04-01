-- CreateTable
CREATE TABLE "WorkspaceContext" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastTool" TEXT,
    "lastEditedAt" TIMESTAMP(3) NOT NULL,
    "lastDateKey" TEXT,
    "lastProjectId" TEXT,
    "recentCaptures" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceContext_userId_key" ON "WorkspaceContext"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceContext_userId_idx" ON "WorkspaceContext"("userId");

-- AddForeignKey
ALTER TABLE "WorkspaceContext" ADD CONSTRAINT "WorkspaceContext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
