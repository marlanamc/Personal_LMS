import { describe, expect, it } from "vitest";
import { getSkipReasonLabel, getSkipReasonSuggestion, getTopWeeklySkipReasonInsight } from "@/lib/anchors";

describe("weekly skip insight helpers", () => {
  it("finds the most repeated anchor and reason pair for the week", () => {
    expect(
      getTopWeeklySkipReasonInsight([
        {
          date: "2026-03-01",
          sleepRhythmDayComplete: false,
          anchors: [
            { id: "gym", label: "Gym", icon: "dumbbell", scheduledTime: "09:00", status: "skipped", skipReason: "tired" },
          ],
        },
        {
          date: "2026-03-02",
          sleepRhythmDayComplete: false,
          anchors: [
            { id: "gym", label: "Gym", icon: "dumbbell", scheduledTime: "09:00", status: "skipped", skipReason: "tired" },
            { id: "job", label: "Job Block", icon: "briefcase", scheduledTime: "11:00", status: "skipped", skipReason: "schedule_changed" },
          ],
        },
        {
          date: "2026-03-03",
          sleepRhythmDayComplete: false,
          anchors: [
            { id: "gym", label: "Gym", icon: "dumbbell", scheduledTime: "09:00", status: "skipped", skipReason: "tired" },
          ],
        },
      ]),
    ).toEqual({
      anchorId: "gym",
      anchorLabel: "Gym",
      count: 3,
      reason: "tired",
    });
  });

  it("formats reason labels and suggestions for the dashboard copy", () => {
    expect(getSkipReasonLabel("tired")).toBe("you were tired");
    expect(getSkipReasonSuggestion("tired")).toBe("Work on sleep or move that anchor later.");
    expect(getSkipReasonLabel("planned_break")).toBe("you were on a break");
    expect(getSkipReasonSuggestion("planned_break")).toBe("If this was temporary, no retime is needed. Just pick back up next week.");
  });
});
