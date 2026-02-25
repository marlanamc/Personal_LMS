-- CreateTable
CREATE TABLE "UtilitySubjectState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectKey" TEXT NOT NULL,
    "checklist" JSONB NOT NULL,
    "links" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UtilitySubjectState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UtilitySubjectState_userId_subjectKey_key" ON "UtilitySubjectState"("userId", "subjectKey");

-- CreateIndex
CREATE INDEX "UtilitySubjectState_userId_idx" ON "UtilitySubjectState"("userId");

-- CreateIndex
CREATE INDEX "UtilitySubjectState_subjectKey_idx" ON "UtilitySubjectState"("subjectKey");

-- AddForeignKey
ALTER TABLE "UtilitySubjectState" ADD CONSTRAINT "UtilitySubjectState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
