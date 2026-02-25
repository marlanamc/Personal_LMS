-- Add per-user Spotify OAuth connection storage for timer integration.
CREATE TABLE IF NOT EXISTS "SpotifyConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotifyUserId" TEXT NOT NULL,
    "displayName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpotifyConnection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SpotifyConnection_userId_key" ON "SpotifyConnection"("userId");
CREATE INDEX IF NOT EXISTS "SpotifyConnection_spotifyUserId_idx" ON "SpotifyConnection"("spotifyUserId");
CREATE INDEX IF NOT EXISTS "SpotifyConnection_expiresAt_idx" ON "SpotifyConnection"("expiresAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'SpotifyConnection_userId_fkey'
          AND table_name = 'SpotifyConnection'
    ) THEN
        ALTER TABLE "SpotifyConnection"
            ADD CONSTRAINT "SpotifyConnection_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
