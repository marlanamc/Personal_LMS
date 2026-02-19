import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEsol3TeachingScheduleData } from "@/lib/teachingSchedule";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = (session.user as unknown as { role?: string })?.role || "student";
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Only teachers can save the schedule" }, { status: 403 });
        }

        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required and must be a string" },
                { status: 400 }
            );
        }

        // Get the current schedule path
        const scheduleData = await loadEsol3TeachingScheduleData();
        const targetPath = scheduleData.sourcePath;

        // Write the updated content
        await writeFile(targetPath, content, "utf8");

        return NextResponse.json({ success: true, path: targetPath });
    } catch (error: unknown) {
        console.error("Error saving teaching schedule:", error);
        const message = error instanceof Error ? error.message : "Failed to save schedule";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

