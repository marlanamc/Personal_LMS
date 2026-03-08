import { describe, expect, it } from "vitest";
import {
  buildTimeBlockPlan,
  createDefaultTimeBlockForm,
  roundToNextTimeIncrement,
} from "@/lib/time-block-planner";

describe("time block planner helpers", () => {
  it("alternates want and should blocks until the end time", () => {
    const blocks = buildTimeBlockPlan({
      date: "2026-03-08",
      startTime: "09:00",
      endTime: "11:30",
      wantLabel: "Coding",
      wantMinutes: 60,
      shouldLabel: "Cleaning",
      shouldMinutes: 30,
    });

    expect(blocks.map((block) => `${block.kind}:${block.startTime}-${block.endTime}`)).toEqual([
      "want:09:00-10:00",
      "should:10:00-10:30",
      "want:10:30-11:30",
    ]);
    expect(blocks.at(-1)?.isTrimmed).toBe(false);
  });

  it("trims the final block when the remaining time is shorter than a full round", () => {
    const blocks = buildTimeBlockPlan({
      date: "2026-03-08",
      startTime: "09:00",
      endTime: "11:10",
      wantLabel: "Coding",
      wantMinutes: 60,
      shouldLabel: "Cleaning",
      shouldMinutes: 30,
    });

    expect(blocks.map((block) => block.durationMinutes)).toEqual([60, 30, 40]);
    expect(blocks[2]).toMatchObject({
      kind: "want",
      startTime: "10:30",
      endTime: "11:10",
      isTrimmed: true,
    });
  });

  it("returns no blocks when end is not after start", () => {
    expect(
      buildTimeBlockPlan({
        date: "2026-03-08",
        startTime: "11:00",
        endTime: "11:00",
        wantLabel: "Coding",
        wantMinutes: 60,
        shouldLabel: "Cleaning",
        shouldMinutes: 30,
      }),
    ).toEqual([]);
  });

  it("preserves exact-fit schedules without trimming", () => {
    const blocks = buildTimeBlockPlan({
      date: "2026-03-08",
      startTime: "13:00",
      endTime: "14:30",
      wantLabel: "Coding",
      wantMinutes: 60,
      shouldLabel: "Cleaning",
      shouldMinutes: 30,
    });

    expect(blocks).toHaveLength(2);
    expect(blocks.every((block) => block.isTrimmed === false)).toBe(true);
  });

  it("rounds same-day defaults without rolling into tomorrow", () => {
    expect(roundToNextTimeIncrement(new Date("2026-03-08T10:07:00"))).toBe("10:15");
    expect(roundToNextTimeIncrement(new Date("2026-03-08T23:58:00"))).toBe("23:45");

    const form = createDefaultTimeBlockForm("2026-03-08", new Date("2026-03-08T23:58:00"));
    expect(form.startTime).toBe("23:45");
    expect(form.endTime).toBe("23:59");
  });
});
