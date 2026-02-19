import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import path from "node:path";

export type MonthDay = { year: number; month: number; day: number };

export type TeachingScheduleFlowItem = { time: string; activity: string };

export type TeachingScheduleDay = {
    time: string;
    flow: TeachingScheduleFlowItem[];
};

export type TeachingSchedule = {
    Tuesday: TeachingScheduleDay;
    Thursday: TeachingScheduleDay;
};

export type TeachingScheduleWeekDay = {
    warmup: string;
    grammar?: string;
    quiz?: string;
    notes?: string;
    flow: TeachingScheduleFlowItem[];
};

export type TeachingScheduleWeek = {
    week: string;
    dates: { tue: MonthDay; thu: MonthDay };
    tuesday: TeachingScheduleWeekDay;
    thursday: TeachingScheduleWeekDay;
};

export type TeachingScheduleData = {
    teachingSchedule: TeachingSchedule;
    weeklySchedule: TeachingScheduleWeek[];
    sourcePath: string;
    rawMarkdown?: string;
    loadError?: string;
};

const DEFAULT_TEACHING_SCHEDULE: TeachingSchedule = {
    Tuesday: { time: "6:00-8:15pm", flow: [] },
    Thursday: { time: "6:00-8:15pm", flow: [] },
};

function parseMonthDay(token: string, year = 2026): MonthDay | null {
    const match = token.trim().match(/^(\d{1,2})\/(\d{1,2})$/);
    if (!match) return null;
    const month = Number(match[1]);
    const day = Number(match[2]);
    if (!Number.isFinite(month) || !Number.isFinite(day) || month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { year, month, day };
}

function firstMatchGroup(re: RegExp, text: string): string | undefined {
    const match = text.match(re);
    return match?.[1]?.trim() || undefined;
}

function parseFlowSection(section: string): TeachingScheduleDay {
    const time = firstMatchGroup(/^\s*-\s*\*\*(.+?)\*\*\s*$/m, section) || "";
    const flow: TeachingScheduleFlowItem[] = [];

    // Helper function to strip duration patterns like "(15 min)", "(20 minutes)", etc.
    const stripDuration = (text: string): string => {
        return text.replace(/\s*\(\d+\s*min(?:utes?)?\)/gi, "").trim();
    };

    // Helper function to strip markdown formatting (bold, italic, etc.)
    const stripMarkdown = (text: string): string => {
        return text
            .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold **text**
            .replace(/\*(.+?)\*/g, "$1")     // Remove italic *text*
            .replace(/_(.+?)_/g, "$1")       // Remove italic _text_
            .trim();
    };

    // Try to match new format with sequential numbers: - **1** Activity
    const flowLineWithNumberRe = /^\s*-\s*\*\*(\d+)\*\*\s*(.+)\s*$/gm;
    const matchesWithNumber = Array.from(section.matchAll(flowLineWithNumberRe));

    if (matchesWithNumber.length > 0) {
        // New format with sequential numbers
        for (const match of matchesWithNumber) {
            const activity = stripMarkdown(stripDuration(match[2]!.trim()));
            flow.push({ time: "", activity });
        }
    } else {
        // Try to match lines with times (old format for backward compatibility)
        const flowLineWithTimeRe = /^\s*-\s*\*\*(\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2})\*\*\s*(.+)\s*$/gm;
        const matchesWithTime = Array.from(section.matchAll(flowLineWithTimeRe));

        if (matchesWithTime.length > 0) {
            // Old format with times - ignore times, just extract activities
            for (const match of matchesWithTime) {
                const activity = stripMarkdown(stripDuration(match[2]!.trim()));
                flow.push({ time: "", activity });
            }
        } else {
            // Plain bullet points without any formatting
            const flowLineRe = /^\s*-\s*(.+)\s*$/gm;
            for (const match of section.matchAll(flowLineRe)) {
                const activity = match[1]!.trim();
                // Skip if it's the time header line
                if (!/^\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2}/.test(activity)) {
                    const cleanActivity = stripMarkdown(stripDuration(activity));
                    flow.push({ time: "", activity: cleanActivity });
                }
            }
        }
    }

    return { time, flow };
}

function parseTeachingSchedule(markdown: string): TeachingSchedule {
    const tuesdayBlock = firstMatchGroup(/###\s+Tuesdays[\s\S]*?\n([\s\S]*?)(?=\n###\s+Thursdays|\n##\s+Monthly|\n---|\n##\s+Week)/m, markdown);
    const thursdayBlock = firstMatchGroup(/###\s+Thursdays[\s\S]*?\n([\s\S]*?)(?=\n##\s+Monthly|\n---|\n##\s+Week)/m, markdown);

    return {
        Tuesday: tuesdayBlock ? parseFlowSection(tuesdayBlock) : DEFAULT_TEACHING_SCHEDULE.Tuesday,
        Thursday: thursdayBlock ? parseFlowSection(thursdayBlock) : DEFAULT_TEACHING_SCHEDULE.Thursday,
    };
}

function parseDaySection(section: string): TeachingScheduleWeekDay {
    // Try to extract warmup from old format first (for backward compatibility)
    let warmup = firstMatchGroup(/Warm[\u2011\u2013\u2014-]?up:\*\*\s*(.+)\s*$/m, section) || "";

    // Extract from numbered flow items - look for items containing "Warm-Up" or "Warmup"
    if (!warmup) {
        const warmupFlowRe = /^\s*-\s*\*\*\d+\*\*\s*(.+?)\s*(?:Warm[\u2011\u2013\u2014-]?up|Warmup).*$/im;
        const warmupMatch = section.match(warmupFlowRe);
        if (warmupMatch) {
            warmup = warmupMatch[1]!.trim();
        }
    }

    const quiz = firstMatchGroup(/\*\*Unit quiz:\*\*\s*(.+)\s*$/m, section);
    
    // Try to extract quiz from flow items if not found in old format
    let quizFromFlow = "";
    if (!quiz) {
        const quizFlowRe = /^\s*-\s*\*\*\d+\*\*\s*(.+?)\s*(?:quiz|Quiz).*$/im;
        const quizMatch = section.match(quizFlowRe);
        if (quizMatch) {
            quizFromFlow = quizMatch[1]!.trim();
        }
    }

    const grammar =
        firstMatchGroup(/\*\*Grammar\s*\(new\):\*\*\s*(.+)\s*$/m, section) ||
        firstMatchGroup(/\*\*Grammar review:\*\*\s*(.+)\s*$/m, section) ||
        firstMatchGroup(/\*\*Grammar:\*\*\s*(.+)\s*$/m, section);

    // Try to extract grammar from flow items if not found in old format
    let grammarFromFlow = "";
    if (!grammar) {
        const grammarFlowRe = /^\s*-\s*\*\*\d+\*\*\s*(.+?)\s*\(Grammar:.*?\)/im;
        const grammarMatch = section.match(grammarFlowRe);
        if (grammarMatch) {
            grammarFromFlow = grammarMatch[1]!.trim();
        }
    }

    const rlw = firstMatchGroup(/\*\*R\/L\/W:\*\*\s*(.+)\s*$/m, section);
    const game = firstMatchGroup(/\*\*Game:\*\*\s*(.+)\s*$/m, section);
    const notesParts = [rlw ? `R/L/W: ${rlw}` : null, game ? `Game: ${game}` : null].filter(Boolean) as string[];
    const notes = notesParts.length ? notesParts.join(" • ") : undefined;

    // Extract flow items - numbered activities like "- **1** Activity name"
    const flow: TeachingScheduleFlowItem[] = [];
    const flowLineRe = /^\s*-\s*\*\*(\d+)\*\*\s*(.+)\s*$/gm;
    for (const match of section.matchAll(flowLineRe)) {
        const activity = match[2]!.trim();
        flow.push({ time: "", activity });
        
        // Extract warmup from flow item if it contains "Warm-Up" or "Warmup" (use the full activity text)
        if (!warmup && /Warm[\u2011\u2013\u2014-]?up|Warmup/i.test(activity)) {
            warmup = activity.trim();
        }
        
        // Extract quiz from flow items
        if (!quiz && !quizFromFlow && /quiz/i.test(activity) && /Unit\s+\d+/i.test(activity)) {
            quizFromFlow = activity;
        }
        
        // Extract grammar from flow items (look for items with "(Grammar:" in them)
        if (!grammar && !grammarFromFlow && /\(Grammar:/i.test(activity)) {
            const grammarMatch = activity.match(/^(.+?)\s*\(Grammar:\s*(.+?)\)/i);
            if (grammarMatch) {
                grammarFromFlow = grammarMatch[1]!.trim() + ": " + grammarMatch[2]!.trim();
            }
        }
    }

    return { 
        warmup: warmup || "", 
        grammar: grammar || grammarFromFlow || undefined, 
        quiz: quiz || quizFromFlow || undefined, 
        notes, 
        flow 
    };
}

function parseWeekBlocks(markdown: string): TeachingScheduleWeek[] {
    const lines = markdown.split("\n");

    // Find all week headers (both Tue and Thu)
    const headerIndices: number[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (/^###\s+Week\s+\d+:/i.test(lines[i] || "")) headerIndices.push(i);
    }
    if (!headerIndices.length) return [];

    // Group headers by week number
    const weekMap = new Map<number, { tue?: { index: number; header: string }; thu?: { index: number; header: string } }>();

    for (const idx of headerIndices) {
        const headerLine = lines[idx] || "";
        const weekMatch = headerLine.match(/^###\s+Week\s+(\d+):\s*(Tue|Thu)\s+(\d{1,2}\/\d{1,2})/i);
        if (!weekMatch) continue;

        const weekNum = parseInt(weekMatch[1]!, 10);
        const day = weekMatch[2]!.toLowerCase();
        const dateStr = weekMatch[3]!;

        if (!weekMap.has(weekNum)) {
            weekMap.set(weekNum, {});
        }

        const week = weekMap.get(weekNum)!;
        if (day === "tue") {
            week.tue = { index: idx, header: headerLine };
        } else if (day === "thu") {
            week.thu = { index: idx, header: headerLine };
        }
    }

    const weeks: TeachingScheduleWeek[] = [];

    for (const [weekNum, weekData] of weekMap.entries()) {
        if (!weekData.tue || !weekData.thu) continue;

        // Extract week name from Tuesday header (format: "### Week 16: Tue 1/6 - Parts of Speech Part 1")
        const weekHeader = weekData.tue.header.replace(/^###\s+/, "").trim();
        const week = weekHeader;

        // Extract dates
        const tueDateMatch = weekData.tue.header.match(/(\d{1,2}\/\d{1,2})/);
        const thuDateMatch = weekData.thu.header.match(/(\d{1,2}\/\d{1,2})/);
        if (!tueDateMatch || !thuDateMatch) continue;

        const tueDate = parseMonthDay(tueDateMatch[1]!, 2026);
        const thuDate = parseMonthDay(thuDateMatch[1]!, 2026);
        if (!tueDate || !thuDate) continue;

        // Extract sections
        const tueStart = weekData.tue.index;
        const thuStart = weekData.thu.index;
        const nextWeekStart = Array.from(weekMap.values())
            .map(w => w.tue?.index || w.thu?.index)
            .filter(idx => idx !== undefined && idx > thuStart)
            .sort((a, b) => a! - b!)[0] || lines.length;

        const tuesdaySection = lines.slice(tueStart, thuStart).join("\n");
        const thursdaySection = lines.slice(thuStart, nextWeekStart).join("\n");

        const tuesday = parseDaySection(tuesdaySection);
        const thursday = parseDaySection(thursdaySection);

        weeks.push({
            week,
            dates: { tue: tueDate, thu: thuDate },
            tuesday,
            thursday,
        });
    }

    return weeks;
}

export async function loadEsol3TeachingScheduleData(): Promise<TeachingScheduleData> {
    const cwd = process.cwd();
    const candidates = [
        path.join(cwd, "src", "content", "teacher", "esol-3-teaching-schedule-jan-jun-2026.md"),
        path.join(cwd, "class_uploads", "ESOL 3 Teaching Schedule (Jan–Jun 2026).md"),
        path.join(cwd, "class_uploads", "ESOL 3 Teaching Schedule (Jan-Jun 2026).md"),
        path.join(cwd, "class_uploads", "Printable_Schedule_Jan-Jun_2026.md"),
    ];

    let lastError: unknown = null;

    for (const candidate of candidates) {
        try {
            const markdown = await readFile(candidate, "utf8");
            return {
                teachingSchedule: parseTeachingSchedule(markdown),
                weeklySchedule: parseWeekBlocks(markdown),
                sourcePath: candidate,
                rawMarkdown: markdown,
            };
        } catch (err) {
            lastError = err;
        }
    }

    try {
        const uploadsDir = path.join(cwd, "class_uploads");
        const entries = await readdir(uploadsDir, { withFileTypes: true });
        const match = entries.find(
            (e) => e.isFile() && /teaching schedule/i.test(e.name) && /\.md$/i.test(e.name)
        );
        if (match) {
            const candidate = path.join(uploadsDir, match.name);
            const markdown = await readFile(candidate, "utf8");
            return {
                teachingSchedule: parseTeachingSchedule(markdown),
                weeklySchedule: parseWeekBlocks(markdown),
                sourcePath: candidate,
                rawMarkdown: markdown,
            };
        }
    } catch (err) {
        lastError = lastError || err;
    }

    const loadError =
        lastError instanceof Error ? lastError.message : "Unknown error reading schedule markdown.";
    return {
        teachingSchedule: DEFAULT_TEACHING_SCHEDULE,
        weeklySchedule: [],
        sourcePath: candidates[0]!,
        loadError,
    };
}
