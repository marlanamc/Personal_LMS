import { describe, expect, it } from "vitest";
import {
  buildTimeBlockPlan,
  createEqualQuadrants,
  createDefaultTimeBlockForm,
  getActiveTimeBlockStatus,
  getActiveConstraintsForDay,
  normalizeTimeBlockPlannerStore,
  roundToNextTimeIncrement,
} from "@/lib/time-block-planner";

describe("time block planner helpers", () => {
  it("alternates want and should blocks until the end time", () => {
    const blocks = buildTimeBlockPlan({
      date: "2026-03-08",
      startTime: "09:00",
      endTime: "11:30",
      activities: [
        { id: "a", kind: "want", label: "Coding", minutes: 60 },
        { id: "b", kind: "should", label: "Cleaning", minutes: 30 },
      ],
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
      activities: [
        { id: "a", kind: "want", label: "Coding", minutes: 60 },
        { id: "b", kind: "should", label: "Cleaning", minutes: 30 },
      ],
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
        activities: [
          { id: "a", kind: "want", label: "Coding", minutes: 60 },
          { id: "b", kind: "should", label: "Cleaning", minutes: 30 },
        ],
      }),
    ).toEqual([]);
  });

  it("preserves exact-fit schedules without trimming", () => {
    const blocks = buildTimeBlockPlan({
      date: "2026-03-08",
      startTime: "13:00",
      endTime: "14:30",
      activities: [
        { id: "a", kind: "want", label: "Coding", minutes: 60 },
        { id: "b", kind: "should", label: "Cleaning", minutes: 30 },
      ],
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

  it("drops matching blocks after a cutoff constraint", () => {
    const blocks = buildTimeBlockPlan(
      {
        date: "2026-03-08",
        startTime: "09:00",
        endTime: "12:00",
        activities: [
          { id: "a", kind: "should", label: "Work", minutes: 60 },
          { id: "b", kind: "want", label: "Reset", minutes: 30 },
        ],
      },
      [
        {
          id: "constraint-1",
          kind: "cutoff",
          target: { kind: "should" },
          time: "10:30",
          enabled: true,
          displayText: "After 10:30 AM, no Focus",
        },
      ],
    );

    expect(blocks.map((block) => `${block.label}:${block.startTime}-${block.endTime}`)).toEqual([
      "Work:09:00-10:00",
      "Reset:10:00-10:30",
      "Reset:10:30-11:00",
      "Reset:11:00-11:30",
      "Reset:11:30-12:00",
    ]);
  });

  it("trims a matching block at an until constraint", () => {
    const blocks = buildTimeBlockPlan(
      {
        date: "2026-03-08",
        startTime: "13:00",
        endTime: "16:00",
        activities: [
          { id: "a", kind: "should", label: "Clean kitchen", minutes: 60 },
          { id: "b", kind: "want", label: "Break", minutes: 30 },
        ],
      },
      [
        {
          id: "constraint-1",
          kind: "until",
          target: { kind: "should", label: "Clean kitchen" },
          time: "15:00",
          enabled: true,
          displayText: "Clean kitchen until 3:00 PM, then hard stop",
        },
      ],
    );

    expect(blocks.map((block) => `${block.label}:${block.startTime}-${block.endTime}`)).toEqual([
      "Clean kitchen:13:00-14:00",
      "Break:14:00-14:30",
      "Clean kitchen:14:30-15:00",
      "Break:15:00-15:30",
      "Break:15:30-16:00",
    ]);
    expect(blocks[2]?.isTrimmed).toBe(true);
  });

  it("uses earliest matching stop time when constraints overlap", () => {
    const blocks = buildTimeBlockPlan(
      {
        date: "2026-03-08",
        startTime: "09:00",
        endTime: "13:00",
        activities: [
          { id: "a", kind: "should", label: "Work", minutes: 60 },
          { id: "b", kind: "want", label: "Reset", minutes: 30 },
        ],
      },
      [
        {
          id: "constraint-1",
          kind: "cutoff",
          target: { kind: "should" },
          time: "11:00",
          enabled: true,
          displayText: "After 11:00 AM, no Focus",
        },
        {
          id: "constraint-2",
          kind: "until",
          target: { kind: "should", label: "Work" },
          time: "10:15",
          enabled: true,
          displayText: "Work until 10:15 AM, then hard stop",
        },
      ],
    );

    expect(blocks.map((block) => `${block.label}:${block.startTime}-${block.endTime}`)).toEqual([
      "Work:09:00-10:00",
      "Reset:10:00-10:30",
      "Reset:10:30-11:00",
      "Reset:11:00-11:30",
      "Reset:11:30-12:00",
      "Reset:12:00-12:30",
      "Reset:12:30-13:00",
    ]);
  });

  it("pulls a matching block earlier when it must be scheduled by a deadline", () => {
    const blocks = buildTimeBlockPlan(
      {
        date: "2026-03-08",
        startTime: "09:00",
        endTime: "12:00",
        activities: [
          { id: "a", kind: "should", label: "Work", minutes: 60 },
          { id: "b", kind: "want", label: "Reset", minutes: 30 },
        ],
      },
      [
        {
          id: "constraint-1",
          kind: "deadline",
          target: { kind: "want", label: "Reset" },
          time: "09:30",
          enabled: true,
          displayText: "Must be Reset by 9:30 AM",
        },
      ],
    );

    expect(blocks.map((block) => `${block.label}:${block.startTime}-${block.endTime}`)).toEqual([
      "Reset:09:00-09:30",
      "Work:09:30-10:30",
      "Reset:10:30-11:00",
      "Work:11:00-12:00",
    ]);
  });

  it("returns the active time block status and remaining minutes for today", () => {
    const status = getActiveTimeBlockStatus(
      "2026-03-23",
      [
        {
          id: "block-1",
          kind: "should",
          label: "Focus Work",
          startTime: "10:00",
          endTime: "10:30",
          startMinuteOfDay: 600,
          endMinuteOfDay: 630,
          durationMinutes: 30,
          isTrimmed: false,
        },
      ],
      608,
      "2026-03-23",
    );

    expect(status).toMatchObject({
      remainingMinutes: 22,
      block: {
        label: "Focus Work",
        kind: "should",
      },
    });
  });

  it("treats the start minute as active and the end minute as inactive", () => {
    const blocks = [
      {
        id: "block-1",
        kind: "want" as const,
        label: "Reset",
        startTime: "09:00",
        endTime: "09:30",
        startMinuteOfDay: 540,
        endMinuteOfDay: 570,
        durationMinutes: 30,
        isTrimmed: false,
      },
    ];

    expect(getActiveTimeBlockStatus("2026-03-23", blocks, 540, "2026-03-23")).toMatchObject({
      remainingMinutes: 30,
      block: {
        label: "Reset",
      },
    });
    expect(getActiveTimeBlockStatus("2026-03-23", blocks, 570, "2026-03-23")).toBeNull();
  });

  it("returns no active time block status for non-today dates", () => {
    const blocks = [
      {
        id: "block-1",
        kind: "should" as const,
        label: "Focus Work",
        startTime: "10:00",
        endTime: "10:30",
        startMinuteOfDay: 600,
        endMinuteOfDay: 630,
        durationMinutes: 30,
        isTrimmed: false,
      },
    ];

    expect(getActiveTimeBlockStatus("2026-03-24", blocks, 610, "2026-03-23")).toBeNull();
  });

  it("returns no active time block status when there is no current block", () => {
    const blocks = [
      {
        id: "block-1",
        kind: "should" as const,
        label: "Focus Work",
        startTime: "10:00",
        endTime: "10:30",
        startMinuteOfDay: 600,
        endMinuteOfDay: 630,
        durationMinutes: 30,
        isTrimmed: false,
      },
    ];

    expect(getActiveTimeBlockStatus("2026-03-23", [], 610, "2026-03-23")).toBeNull();
    expect(getActiveTimeBlockStatus("2026-03-23", blocks, null, "2026-03-23")).toBeNull();
    expect(getActiveTimeBlockStatus("2026-03-23", blocks, 590, "2026-03-23")).toBeNull();
  });

  it("normalizes legacy store payloads and merges active defaults with day rules", () => {
    const store = normalizeTimeBlockPlannerStore({
      "2026-03-08": {
        form: {
          date: "2026-03-08",
          startTime: "09:00",
          endTime: "11:00",
          wantLabel: "Reset",
          wantMinutes: 30,
          shouldLabel: "Work",
          shouldMinutes: 60,
        },
        blocks: [],
        generatedAt: null,
        constraints: [{ nope: true }],
      },
      defaults: {
        constraints: [
          {
            id: "default-1",
            kind: "cutoff",
            target: { kind: "should" },
            time: "20:00",
          },
        ],
      },
    });

    expect(store.days["2026-03-08"].constraints).toEqual([]);
    expect(store.days["2026-03-08"].sectionStartTime).toBe("09:00");
    expect(store.days["2026-03-08"].sectionEndTime).toBe("11:00");
    expect(store.defaults.constraints[0]).toMatchObject({
      id: "default-1",
      displayText: "Stop scheduling Focus after 8 PM",
    });

    const active = getActiveConstraintsForDay(store.days["2026-03-08"], store.defaults);
    expect(active).toHaveLength(1);
    expect(active[0]?.id).toBe("default-1");
  });

  it("lets a day disable one inherited default without deleting it", () => {
    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "09:00",
            endTime: "11:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [
            {
              id: "day-1",
              kind: "until",
              target: { kind: "should", label: "Clean kitchen" },
              time: "15:00",
            },
          ],
          disabledDefaultConstraintIds: ["default-1"],
        },
      },
      defaults: {
        constraints: [
          {
            id: "default-1",
            kind: "cutoff",
            target: { kind: "should" },
            time: "20:00",
          },
          {
            id: "default-2",
            kind: "cutoff",
            target: { kind: "want" },
            time: "22:00",
          },
        ],
      },
    });

    const active = getActiveConstraintsForDay(store.days["2026-03-08"], store.defaults);
    expect(active.map((rule) => rule.id)).toEqual(["default-2", "day-1"]);
  });

  it("filters repeating defaults by weekdays and custom days", () => {
    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-10": {
          form: {
            date: "2026-03-10",
            startTime: "09:00",
            endTime: "11:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
        },
        "2026-03-11": {
          form: {
            date: "2026-03-11",
            startTime: "09:00",
            endTime: "11:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
        },
        "2026-03-14": {
          form: {
            date: "2026-03-14",
            startTime: "09:00",
            endTime: "11:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
        },
      },
      defaults: {
        constraints: [
          {
            id: "weekday",
            kind: "cutoff",
            target: { kind: "should" },
            time: "18:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            id: "mon-wed",
            kind: "deadline",
            target: { kind: "want" },
            time: "10:00",
            daysOfWeek: [3, 1],
          },
          {
            id: "weekend",
            kind: "cutoff",
            target: { kind: "want" },
            time: "22:00",
            daysOfWeek: [0, 6],
          },
        ],
      },
    });

    expect(store.defaults.constraints[1]?.daysOfWeek).toEqual([1, 3]);
    expect(getActiveConstraintsForDay(store.days["2026-03-10"], store.defaults).map((rule) => rule.id)).toEqual(["weekday"]);
    expect(getActiveConstraintsForDay(store.days["2026-03-11"], store.defaults).map((rule) => rule.id)).toEqual(["weekday", "mon-wed"]);
    expect(getActiveConstraintsForDay(store.days["2026-03-14"], store.defaults).map((rule) => rule.id)).toEqual(["weekend"]);
  });

  it("trims blocks at quadrant boundaries", () => {
    const form = {
        date: "2026-03-08",
        startTime: "09:00",
        endTime: "13:00",
        activities: [
          { id: "a", kind: "should" as const, label: "Work", minutes: 90 },
          { id: "b", kind: "want" as const, label: "Reset", minutes: 30 },
        ],
      };

    const quadrants = createEqualQuadrants(form, 2).map((quadrant, index) =>
      index === 0
        ? { ...quadrant, label: "Morning", startTime: "09:00", endTime: "11:00" }
        : { ...quadrant, label: "Midday", startTime: "11:00", endTime: "13:00" },
    );

    const blocks = buildTimeBlockPlan(form, [], quadrants);
    expect(blocks.map((block) => `${block.label}:${block.startTime}-${block.endTime}`)).toEqual([
      "Work:09:00-10:30",
      "Reset:10:30-11:00",
      "Work:11:00-12:30",
      "Reset:12:30-13:00",
    ]);
  });

  it("lets constraints win over quadrant boundaries", () => {
    const form = {
        date: "2026-03-08",
        startTime: "09:00",
        endTime: "12:00",
        activities: [
          { id: "a", kind: "should" as const, label: "Deep work", minutes: 90 },
          { id: "b", kind: "want" as const, label: "Reset", minutes: 30 },
        ],
      };

    const quadrants = [
      {
        id: "q1",
        label: "Morning",
        startTime: "09:00",
        endTime: "11:00",
        focusItems: ["Deep work"],
        colorToken: "sky" as const,
        enabled: true,
      },
      {
        id: "q2",
        label: "Late morning",
        startTime: "11:00",
        endTime: "12:00",
        focusItems: ["Admin"],
        colorToken: "mint" as const,
        enabled: true,
      },
    ];

    const constraints = [
      {
        id: "constraint-1",
        kind: "cutoff" as const,
        target: { kind: "should" as const },
        time: "10:15",
        enabled: true,
        displayText: "Stop scheduling Focus after 10:15 AM",
      },
    ];

    const blocks = buildTimeBlockPlan(form, constraints, quadrants);
    expect(blocks.map((block) => `${block.label}:${block.startTime}-${block.endTime}`)).toEqual([
      "Deep work:09:00-10:15",
      "Reset:10:15-10:45",
      "Reset:10:45-11:00",
      "Reset:11:00-11:30",
      "Reset:11:30-12:00",
    ]);
  });

  it("keeps quadrants invalid if they are not contiguous within the plan window", () => {
    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "09:00",
            endTime: "13:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
          sectionStartTime: "09:00",
          sectionEndTime: "13:00",
          quadrants: [
            {
              id: "q1",
              label: "Morning",
              startTime: "09:30",
              endTime: "11:00",
              focusItems: ["Workout"],
              colorToken: "dawn",
            },
            {
              id: "q2",
              label: "Work",
              startTime: "11:00",
              endTime: "13:00",
              focusItems: ["Deep work"],
              colorToken: "sky",
            },
          ],
        },
      },
    });

    expect(store.days["2026-03-08"].quadrants).toEqual([]);
  });

  it("normalizes valid quadrants and preserves focus items", () => {
    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "06:00",
            endTime: "12:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
          sectionStartTime: "06:00",
          sectionEndTime: "12:00",
          quadrants: [
            {
              id: "q1",
              label: "Health",
              startTime: "06:00",
              endTime: "09:00",
              focusItems: ["Workout", "Meditation", "Health"],
              colorToken: "mint",
            },
            {
              id: "q2",
              label: "Deep Work",
              startTime: "09:00",
              endTime: "12:00",
              focusItems: ["Coding", "Writing"],
              colorToken: "sky",
            },
          ],
        },
      },
    });

    expect(store.days["2026-03-08"].quadrants).toHaveLength(2);
    expect(store.days["2026-03-08"].quadrants[0]).toMatchObject({
      label: "Health",
      focusItems: ["Workout", "Meditation", "Health"],
      colorToken: "mint",
    });
  });

  it("rejects stores with more than five quadrants", () => {
    const quadrants = Array.from({ length: 6 }, (_, index) => ({
      id: `q${index + 1}`,
      label: `Section ${index + 1}`,
      startTime: `${`${6 + index}`.padStart(2, "0")}:00`,
      endTime: `${`${7 + index}`.padStart(2, "0")}:00`,
      focusItems: [],
      colorToken: "sky",
    }));

    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "06:00",
            endTime: "12:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
          sectionStartTime: "06:00",
          sectionEndTime: "12:00",
          quadrants,
        },
      },
    });

    expect(store.days["2026-03-08"].quadrants).toEqual([]);
  });

  it("clamps saved section hours to the day plan window", () => {
    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "09:00",
            endTime: "17:00",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
          sectionStartTime: "07:00",
          sectionEndTime: "19:00",
          quadrants: [],
        },
      },
    });

    expect(store.days["2026-03-08"].sectionStartTime).toBe("09:00");
    expect(store.days["2026-03-08"].sectionEndTime).toBe("17:00");
  });

  it("uses a workday default for inherited full-day section ranges", () => {
    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "11:15",
            endTime: "23:59",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
          quadrants: [],
        },
      },
    });

    expect(store.days["2026-03-08"].sectionStartTime).toBe("09:00");
    expect(store.days["2026-03-08"].sectionEndTime).toBe("17:00");
  });

  it("normalizes legacy inherited ranges that kept the rounded planner start but saved a 5 PM end", () => {
    const store = normalizeTimeBlockPlannerStore({
      days: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "11:15",
            endTime: "23:59",
            activities: [],
          },
          blocks: [],
          generatedAt: null,
          constraints: [],
          disabledDefaultConstraintIds: [],
          sectionStartTime: "11:15",
          sectionEndTime: "17:00",
          quadrants: [],
        },
      },
    });

    expect(store.days["2026-03-08"].sectionStartTime).toBe("09:00");
    expect(store.days["2026-03-08"].sectionEndTime).toBe("17:00");
  });
});
