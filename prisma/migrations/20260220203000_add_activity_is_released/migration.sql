-- Add release flag used for grammar/speaking/quiz visibility controls
ALTER TABLE "Activity"
ADD COLUMN IF NOT EXISTS "isReleased" BOOLEAN NOT NULL DEFAULT false;

-- Match current Prisma schema indexes
CREATE INDEX IF NOT EXISTS "Activity_isReleased_idx"
ON "Activity"("isReleased");

CREATE INDEX IF NOT EXISTS "Activity_type_category_isReleased_idx"
ON "Activity"("type", "category", "isReleased");
