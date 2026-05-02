import { describe, expect, it } from "vitest";
import {
  buildUniformWeeklySchedule,
  mergeDailyAnchorStateWithTemplates,
  resolveAnchorStatuses,
  type DailyAnchorState,
  type DailyAnchorTemplate,
} from "@/lib/anchors";

describe("mergeDailyAnchorStateWithTemplates", () => {
  it("preserves anchor end times when templates are re-saved", () => {
    const templates: DailyAnchorTemplate[] = [
      { id: "class", label: "Class", icon: "book-open", weeklySchedule: buildUniformWeeklySchedule("17:00", "21:00") },
    ];

    const state: DailyAnchorState = {
      date: "2026-03-12",
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: "class",
          label: "Class",
          icon: "book-open",
          weeklySchedule: buildUniformWeeklySchedule("17:00", "21:00"),
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
      {
        id: "class",
        label: "Evening Class",
        icon: "calendar",
        importanceNote: "This protects study time.",
        weeklySchedule: buildUniformWeeklySchedule("17:30", "21:00"),
      },
    ];

    const state: DailyAnchorState = {
      date: "2026-03-12",
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: "class",
          label: "Class",
          icon: "book-open",
          weeklySchedule: buildUniformWeeklySchedule("17:00", "21:00"),
          scheduledTime: "17:00",
          endTime: "21:00",
          status: "done",
          actualTime: "2026-03-12T17:02:00.000Z",
          isTimeOverridden: true,
        },
      ],
    };

    expect(mergeDailyAnchorStateWithTemplates(state, templates).anchors).toEqual([
      expect.objectContaining({
        id: "class",
        label: "Evening Class",
        icon: "calendar",
        importanceNote: "This protects study time.",
        scheduledTime: "17:00",
        endTime: "21:00",
        status: "done",
        actualTime: "2026-03-12T17:02:00.000Z",
        isTimeOverridden: true,
      }),
    ]);
  });

  it("removes anchors from saved daily state when they are deleted from templates", () => {
    const templates: DailyAnchorTemplate[] = [
      { id: "wake", label: "Wake", icon: "sunrise", weeklySchedule: buildUniformWeeklySchedule("08:00") },
    ];

    const state: DailyAnchorState = {
      date: "2026-03-12",
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: "wake",
          label: "Wake",
          icon: "sunrise",
          weeklySchedule: buildUniformWeeklySchedule("08:00"),
          scheduledTime: "08:00",
          status: "waiting",
        },
        {
          id: "gym",
          label: "Gym",
          icon: "dumbbell",
          weeklySchedule: buildUniformWeeklySchedule("09:00"),
          scheduledTime: "09:00",
          status: "waiting",
        },
      ],
    };

    expect(mergeDailyAnchorStateWithTemplates(state, templates).anchors).toEqual([
      expect.objectContaining({ id: "wake" }),
    ]);
  });
});

describe("resolveAnchorStatuses", () => {
  it("keeps a ranged anchor waiting while its time window is in progress", () => {
    const state: DailyAnchorState = {
      date: "2026-03-12",
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: "class",
          label: "Class",
          icon: "book-open",
          weeklySchedule: buildUniformWeeklySchedule("17:00", "18:30"),
          scheduledTime: "17:00",
          endTime: "18:30",
          status: "missed",
        },
      ],
    };

    const resolved = resolveAnchorStatuses(state, new Date(2026, 2, 12, 17, 45));

    expect(resolved[0].status).toBe("waiting");
  });

  it("marks a ranged anchor missed after its end-time grace period", () => {
    const state: DailyAnchorState = {
      date: "2026-03-12",
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: "class",
          label: "Class",
          icon: "book-open",
          weeklySchedule: buildUniformWeeklySchedule("17:00", "18:30"),
          scheduledTime: "17:00",
          endTime: "18:30",
          status: "waiting",
        },
      ],
    };

    const resolved = resolveAnchorStatuses(state, new Date(2026, 2, 12, 18, 46));

    expect(resolved[0].status).toBe("missed");
  });
});
