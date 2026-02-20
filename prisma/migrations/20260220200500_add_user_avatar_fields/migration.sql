-- Add missing user profile fields required by current Prisma schema/client
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatar" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarColor" TEXT;
