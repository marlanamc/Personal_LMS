import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        await prisma.spotifyConnection.deleteMany({
            where: { userId: session.user.id },
        });

        return NextResponse.json({ connected: false });
    } catch (error) {
        return handleApiError(error, "api/spotify/disconnect");
    }
}
