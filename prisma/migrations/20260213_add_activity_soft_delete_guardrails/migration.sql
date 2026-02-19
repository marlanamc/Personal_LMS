-- Add reversible delete support for activities
ALTER TABLE "Activity"
ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Activity_deletedAt_idx"
ON "Activity"("deletedAt");

-- Safety guardrails: prevent cascading deletion chains from Activity
ALTER TABLE IF EXISTS "Assignment"
DROP CONSTRAINT IF EXISTS "Assignment_activityId_fkey";
ALTER TABLE IF EXISTS "Assignment"
ADD CONSTRAINT "Assignment_activityId_fkey"
FOREIGN KEY ("activityId") REFERENCES "Activity"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE IF EXISTS "ActivityProgress"
DROP CONSTRAINT IF EXISTS "ActivityProgress_activityId_fkey";
ALTER TABLE IF EXISTS "ActivityProgress"
ADD CONSTRAINT "ActivityProgress_activityId_fkey"
FOREIGN KEY ("activityId") REFERENCES "Activity"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE IF EXISTS "SpeakingSubmission"
DROP CONSTRAINT IF EXISTS "SpeakingSubmission_activityId_fkey";
ALTER TABLE IF EXISTS "SpeakingSubmission"
ADD CONSTRAINT "SpeakingSubmission_activityId_fkey"
FOREIGN KEY ("activityId") REFERENCES "Activity"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE IF EXISTS "Submission"
DROP CONSTRAINT IF EXISTS "Submission_activityId_fkey";
ALTER TABLE IF EXISTS "Submission"
ADD CONSTRAINT "Submission_activityId_fkey"
FOREIGN KEY ("activityId") REFERENCES "Activity"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE IF EXISTS "QuizResponse"
DROP CONSTRAINT IF EXISTS "QuizResponse_activityId_fkey";
ALTER TABLE IF EXISTS "QuizResponse"
ADD CONSTRAINT "QuizResponse_activityId_fkey"
FOREIGN KEY ("activityId") REFERENCES "Activity"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
