import { describe, expect, it } from "vitest";
import { groupItemsIntoSections, type TimelineItem } from "@/lib/unified-scheduler";

const sections: TimelineItem[] = [
  {
    id: "quadrant-morning",
    type: "quadrant",
    label: "Morning",
    startMinute: 9 * 60,
    endMinute: 12 * 60,
    durationMinutes: 180,
    quadrantFocusItems: ["Workout", "Planning"],
    quadrantColorToken: "sky",
  },
  {
    id: "quadrant-afternoon",
    type: "quadrant",
    label: "Afternoon",
    startMinute: 12 * 60,
    endMinute: 17 * 60,
    durationMinutes: 300,
    quadrantFocusItems: ["Deep work"],
    quadrantColorToken: "mint",
  },
];

describe("groupItemsIntoSections", () => {
  it("assigns time blocks, events, and anchors to the section containing their start time", () => {
    const items: TimelineItem[] = [
      {
        id: "anchor-1",
        type: "anchor",
        label: "Start up",
        startMinute: 9 * 60 + 15,
      },
      {
        id: "event-1",
        type: "event",
        label: "Team sync",
        startMinute: 12 * 60 + 30,
        endMinute: 13 * 60,
        durationMinutes: 30,
      },
      {
        id: "block-1",
        type: "time-block",
        label: "Build feature",
        startMinute: 10 * 60,
        endMinute: 11 * 60,
        durationMinutes: 60,
        blockKind: "should",
      },
    ];

    const grouped = groupItemsIntoSections(sections, items);

    expect(grouped).toHaveLength(2);
    expect(grouped[0]?.items.map((item) => item.id)).toEqual(["anchor-1", "block-1"]);
    expect(grouped[1]?.items.map((item) => item.id)).toEqual(["event-1"]);
  });

  it("keeps spanning items in the section where they start", () => {
    const items: TimelineItem[] = [
      {
        id: "block-span",
        type: "time-block",
        label: "Long session",
        startMinute: 11 * 60 + 30,
        endMinute: 12 * 60 + 30,
        durationMinutes: 60,
        blockKind: "should",
      },
    ];

    const grouped = groupItemsIntoSections(sections, items);

    expect(grouped[0]?.items.map((item) => item.id)).toEqual(["block-span"]);
    expect(grouped[1]?.items).toEqual([]);
  });

  it("excludes timed items that start outside all sections", () => {
    const items: TimelineItem[] = [
      {
        id: "block-early",
        type: "time-block",
        label: "Before workday",
        startMinute: 8 * 60,
        endMinute: 8 * 60 + 30,
        durationMinutes: 30,
        blockKind: "want",
      },
      {
        id: "event-late",
        type: "event",
        label: "After hours",
        startMinute: 18 * 60,
        endMinute: 19 * 60,
        durationMinutes: 60,
      },
    ];

    const grouped = groupItemsIntoSections(sections, items);

    expect(grouped.every((section) => section.items.length === 0)).toBe(true);
  });

  it("assigns constraints to the section containing their effective stop time", () => {
    const constraints: TimelineItem[] = [
      {
        id: "constraint-1",
        type: "constraint",
        label: "No Focus after 1 PM",
        startMinute: 13 * 60,
        constraintKind: "cutoff",
        blockKind: "should",
      },
      {
        id: "constraint-2",
        type: "constraint",
        label: "Kitchen until noon",
        startMinute: 9 * 60,
        endMinute: 12 * 60,
        durationMinutes: 180,
        constraintKind: "until",
        blockKind: "should",
      },
      {
        id: "constraint-3",
        type: "constraint",
        label: "Schedule Workout by 4 PM",
        startMinute: 16 * 60,
        constraintKind: "deadline",
        blockKind: "want",
      },
    ];

    const grouped = groupItemsIntoSections(sections, [], constraints);

    expect(grouped[0]?.constraints.map((item) => item.id)).toEqual([]);
    expect(grouped[1]?.constraints.map((item) => item.id)).toEqual(["constraint-2", "constraint-1", "constraint-3"]);
  });
});
