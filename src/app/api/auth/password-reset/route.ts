import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/auth-config";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await request.json();

    // SECURITY: Validate password length (min and max)
    if (!newPassword || typeof newPassword !== "string") {
        return NextResponse.json({ error: "Invalid password format." }, { status: 400 });
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }, { status: 400 });
    }

    if (newPassword.length > MAX_PASSWORD_LENGTH) {
        return NextResponse.json({ error: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.` }, { status: 400 });
    }

    // SECURITY: Use industry-standard bcrypt rounds (12 in 2025)
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            password: passwordHash,
            mustChangePassword: false,
        },
    });

    return NextResponse.json({ ok: true });
}





