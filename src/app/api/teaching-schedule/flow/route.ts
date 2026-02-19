import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readFile, writeFile } from "node:fs/promises";
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
        const { day, flow } = body;

        if (!day || (day !== "Tuesday" && day !== "Thursday")) {
            return NextResponse.json(
                { error: "Day must be 'Tuesday' or 'Thursday'" },
                { status: 400 }
            );
        }

        if (!Array.isArray(flow)) {
            return NextResponse.json(
                { error: "Flow must be an array" },
                { status: 400 }
            );
        }

        // Get the current schedule
        const scheduleData = await loadEsol3TeachingScheduleData();
        const targetPath = scheduleData.sourcePath;
        
        // Read the current markdown
        const markdown = await readFile(targetPath, "utf8");

        // Update the flow section for the specified day
        const daySection = day === "Tuesday" ? "Tuesdays" : "Thursdays";
        
        // Find the section for this day
        const dayHeaderPattern = new RegExp(`###\\s+${daySection}[^\\n]*`, "i");
        const dayHeaderMatch = markdown.match(dayHeaderPattern);
        
        if (!dayHeaderMatch) {
            return NextResponse.json(
                { error: `Could not find ${daySection} section in schedule` },
                { status: 400 }
            );
        }
        
        const dayHeaderIndex = dayHeaderMatch.index!;
        const dayHeaderEnd = dayHeaderIndex + dayHeaderMatch[0]!.length;
        
        // Find the end of this section (next ### or ## or ---)
        const restOfFile = markdown.substring(dayHeaderEnd);
        const nextSectionMatch = restOfFile.match(/\n(?:###|##|---)/);
        const sectionEndIndex = nextSectionMatch 
            ? dayHeaderEnd + nextSectionMatch.index! 
            : markdown.length;
        
        // Extract the current section content
        const currentSection = markdown.substring(dayHeaderIndex, sectionEndIndex);
        
        // Build new flow section with sequential numbering
        const flowLines = flow.map((item: { time: string; activity: string }, index: number) => {
            return `- **${index + 1}** ${item.activity}`;
        }).join("\n");
        
        // Replace the flow items in the section (everything after the header)
        const headerLine = currentSection.split("\n")[0]!;
        const newSection = `${headerLine}\n\n${flowLines}\n`;
        
        // Replace the section in the markdown
        const beforeSection = markdown.substring(0, dayHeaderIndex);
        const afterSection = markdown.substring(sectionEndIndex);
        const updatedMarkdown = beforeSection + newSection + afterSection;

        // Write the updated content
        try {
            await writeFile(targetPath, updatedMarkdown, "utf8");
            return NextResponse.json({ success: true, path: targetPath });
        } catch (writeError: unknown) {
            // Check if it's a read-only filesystem error
            if (writeError instanceof Error && writeError.message.includes("EROFS")) {
                return NextResponse.json({
                    error: "Schedule file is in a read-only location. In production, teaching schedules cannot be edited directly. Please contact your administrator to update the schedule file, or configure a writable storage location.",
                }, { status: 500 });
            }
            throw writeError;
        }
    } catch (error: unknown) {
        console.error("Error saving teaching schedule flow:", error);
        const message = error instanceof Error ? error.message : "Failed to save schedule";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

