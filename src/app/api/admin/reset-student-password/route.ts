import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/auth-config";
import { createAuditLogger } from "@/lib/audit-log";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const audit = createAuditLogger(request);

    if (!session?.user || session.user.role !== "teacher") {
        // Log unauthorized attempt
        if (session?.user) {
            audit.failure(
                'admin.unauthorized_attempt',
                session.user.id,
                session.user.role,
                'Non-teacher attempted to reset student password'
            );
        }
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, newPassword } = await request.json();

    if (!userId || typeof userId !== "string") {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

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

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "student") {
        return NextResponse.json({ error: "Only student passwords can be changed here" }, { status: 400 });
    }

    // SECURITY: Use industry-standard bcrypt rounds (12 in 2025)
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.user.update({
        where: { id: userId },
        data: {
            password: passwordHash,
            mustChangePassword: false,
        },
    });

    // AUDIT: Log password reset action
    audit.success(
        'user.password_reset',
        session.user.id,
        session.user.role,
        {
            targetId: userId,
            targetType: 'user',
            metadata: { resetBy: 'teacher' }
        }
    );

    return NextResponse.json({ ok: true });
}





