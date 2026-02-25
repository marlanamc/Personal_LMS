import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSpotifyConfigured } from "@/lib/spotify";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            {
                configured: isSpotifyConfigured(),
                connected: false,
                displayName: null,
                expiresAt: null,
            },
            { status: 401 }
        );
    }

    const connection = await prisma.spotifyConnection.findUnique({
        where: { userId: session.user.id },
        select: {
            displayName: true,
            expiresAt: true,
        },
    });

    return NextResponse.json({
        configured: isSpotifyConfigured(),
        connected: Boolean(connection),
        displayName: connection?.displayName ?? null,
        expiresAt: connection?.expiresAt.toISOString() ?? null,
    });
}
