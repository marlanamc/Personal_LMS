import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { code } = body;

        // SECURITY: Input validation
        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: "Class code is required" }, { status: 400 });
        }

        const trimmedCode = code.trim().toUpperCase();

        if (trimmedCode.length !== 6) {
            return NextResponse.json({ error: "Invalid class code format" }, { status: 400 });
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find class by code
        const classItem = await prisma.class.findUnique({
            where: { code: trimmedCode },
        });

        if (!classItem) {
            return NextResponse.json({ error: "Class not found. Please check the code." }, { status: 404 });
        }

        if (classItem.teacherId === userId) {
            return NextResponse.json(
                { classId: classItem.id, message: "You already own this class" },
                { status: 200 }
            );
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.classEnrollment.findUnique({
            where: {
                classId_studentId: {
                    classId: classItem.id,
                    studentId: userId,
                },
            },
        });

        if (existingEnrollment) {
            return NextResponse.json(
                { error: "You are already connected to this class", classId: classItem.id },
                { status: 400 }
            );
        }

        // Create enrollment
        await prisma.classEnrollment.create({
            data: {
                classId: classItem.id,
                studentId: userId,
            },
        });

        return NextResponse.json({ classId: classItem.id, message: "Successfully joined class" });
    } catch (error: unknown) {
        return handleApiError(error, "api/classes/join:POST");
    }
}







