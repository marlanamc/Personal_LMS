-- Add assignment support to ActivityProgress to match schema.prisma
ALTER TABLE "ActivityProgress"
ADD COLUMN IF NOT EXISTS "assignmentId" TEXT;

-- Replace legacy uniqueness with assignment-aware uniqueness
DROP INDEX IF EXISTS "ActivityProgress_userId_activityId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "ActivityProgress_userId_activityId_assignmentId_key"
ON "ActivityProgress"("userId", "activityId", "assignmentId");

-- Add foreign key expected by Prisma relation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ActivityProgress_assignmentId_fkey'
  ) THEN
    ALTER TABLE "ActivityProgress"
    ADD CONSTRAINT "ActivityProgress_assignmentId_fkey"
    FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END $$;
