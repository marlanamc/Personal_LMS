import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueClassCode, isValidClassCodeFormat } from "@/lib/generateClassCode";
import { handleApiError } from "@/lib/api-error";

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
            where: {
                OR: [
                    { teacherId: userId },
                    { enrollments: { some: { studentId: userId } } },
                ],
            },
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

        const body = await request.json();
        const { name, description, code } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: "Class name is required" }, { status: 400 });
        }

        if (name.length > 200) {
            return NextResponse.json({ error: "Class name too long" }, { status: 400 });
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // SECURITY: Generate cryptographically secure code or validate provided code
        let classCode: string;

        if (code) {
            // If a custom code is provided, validate format.
            if (!isValidClassCodeFormat(code)) {
                return NextResponse.json({
                    error: "Invalid class code format. Must be 6 uppercase alphanumeric characters (no 0, O, 1, I, L)"
                }, { status: 400 });
            }

            // Check if code already exists
            const existingClass = await prisma.class.findUnique({
                where: { code: code.toUpperCase() },
            });

            if (existingClass) {
                return NextResponse.json({ error: "Class code already exists" }, { status: 400 });
            }

            classCode = code.toUpperCase();
        } else {
            // Generate cryptographically secure unique code
            classCode = await generateUniqueClassCode();
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                description: description || null,
                code: classCode,
                teacherId: userId,
            },
        });

        return NextResponse.json(newClass);
    } catch (error: unknown) {
        return handleApiError(error, "api/classes:POST");
    }
}







