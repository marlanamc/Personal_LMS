import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/api-error";
import { BCRYPT_ROUNDS, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/auth-config";

const passwordResetSchema = z.object({
    newPassword: z
        .string({ message: "Invalid password format." })
        .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
        .max(MAX_PASSWORD_LENGTH, `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.`),
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rateLimitResponse = await enforceRateLimit({
            request,
            limiterName: "password-reset",
            userId: session.user.id,
        });
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const parsed = passwordResetSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }
        const { newPassword } = parsed.data;

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
    } catch (error) {
        return handleApiError(error, "api/auth/password-reset");
    }
}





