import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";
import { nonEmptyString, boundedText } from "@/lib/validation/common";

const classCreateSchema = z.object({
    name: nonEmptyString.max(200),
    description: boundedText(2000).nullish(),
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const classes = await prisma.class.findMany({
            where: { ownerId: userId },
            include: {
                assignments: {
                    include: {
                        activity: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(classes);
    } catch (error: unknown) {
        return handleApiError(error, "api/classes:GET");
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description } = classCreateSchema.parse(await request.json());

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                description: description || null,
                ownerId: userId,
            },
        });

        return NextResponse.json(newClass);
    } catch (error: unknown) {
        return handleApiError(error, "api/classes:POST");
    }
}
