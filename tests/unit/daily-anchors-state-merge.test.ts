import { describe, expect, it } from "vitest";
import { mergeDailyAnchorStateWithTemplates, type DailyAnchorState, type DailyAnchorTemplate } from "@/lib/anchors";

describe("mergeDailyAnchorStateWithTemplates", () => {
  it("preserves anchor end times when templates are re-saved", () => {
    const templates: DailyAnchorTemplate[] = [
      { id: "class", label: "Class", icon: "book-open", scheduledTime: "17:00", endTime: "21:00" },
    ];

    const state: DailyAnchorState = {
      date: "2026-03-12",
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: "class",
          label: "Class",
          icon: "book-open",
          scheduledTime: "17:00",
          endTime: "21:00",
          status: "waiting",
        },
      ],
    };

    expect(mergeDailyAnchorStateWithTemplates(state, templates).anchors).toEqual([
      expect.objectContaining({
        id: "class",
        scheduledTime: "17:00",
        endTime: "21:00",
      }),
    ]);
  });

  it("keeps status metadata for existing anchors while applying template updates", () => {
    const templates: DailyAnchorTemplate[] = [
      { id: "class", label: "Evening Class", icon: "calendar", scheduledTime: "17:30", endTime: "21:00" },
    ];

    const state: DailyAnchorState = {
      date: "2026-03-12",
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: "class",
          label: "Class",
          icon: "book-open",
          scheduledTime: "17:00",
          endTime: "21:00",
          status: "done",
          actualTime: "2026-03-12T17:02:00.000Z",
        },
      ],
    };

    expect(mergeDailyAnchorStateWithTemplates(state, templates).anchors).toEqual([
      expect.objectContaining({
        id: "class",
        label: "Evening Class",
        icon: "calendar",
        scheduledTime: "17:00",
        endTime: "21:00",
        status: "done",
        actualTime: "2026-03-12T17:02:00.000Z",
      }),
    ]);
  });
});
