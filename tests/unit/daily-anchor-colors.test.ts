import { describe, expect, it } from "vitest";
import { anchorToTimelineItem } from "@/lib/unified-scheduler";
import { getAnchorColorPalette, getDefaultAnchorColor } from "@/lib/anchors";

describe("daily anchor colors", () => {
  it("uses the icon-mapped default palette when no custom color is set", () => {
    expect(getDefaultAnchorColor("sunrise")).toBe("peach");
    expect(getDefaultAnchorColor("briefcase")).toBe("sky");
    expect(getDefaultAnchorColor("dumbbell")).toBe("mint");
    expect(getDefaultAnchorColor("book-open")).toBe("periwinkle");
    expect(getDefaultAnchorColor("moon")).toBe("lavender");
  });

  it("returns the chosen palette for custom anchor colors", () => {
    expect(getAnchorColorPalette("rose", "sunrise")).toMatchObject({
      key: "rose",
      solid: "#D48AA6",
    });
  });

  it("passes anchor color through to timeline items", () => {
    expect(
      anchorToTimelineItem({
        id: "class",
        label: "Class",
        icon: "book-open",
        color: "periwinkle",
        scheduledTime: "17:00",
        endTime: "21:00",
        status: "waiting",
      }).anchorColor,
    ).toBe("periwinkle");
  });
});
