import { describe, expect, it } from "vitest";
import { getRecentSkippedAnchorStreak } from "@/lib/anchors";

describe("getRecentSkippedAnchorStreak", () => {
  it("counts the most recent consecutive skipped anchors", () => {
    expect(
      getRecentSkippedAnchorStreak([
        { scheduledTime: "08:00", status: "done" },
        { scheduledTime: "09:00", status: "skipped" },
        { scheduledTime: "10:00", status: "skipped" },
        { scheduledTime: "11:00", status: "skipped" },
      ], 11 * 60),
    ).toBe(3);
  });

  it("ignores future waiting anchors when checking the latest streak", () => {
    expect(
      getRecentSkippedAnchorStreak([
        { scheduledTime: "08:00", status: "skipped" },
        { scheduledTime: "09:00", status: "skipped" },
        { scheduledTime: "10:00", status: "skipped" },
        { scheduledTime: "18:00", status: "waiting" },
      ], 10 * 60 + 5),
    ).toBe(3);
  });

  it("resets when the latest processed anchor was not skipped", () => {
    expect(
      getRecentSkippedAnchorStreak([
        { scheduledTime: "08:00", status: "skipped" },
        { scheduledTime: "09:00", status: "skipped" },
        { scheduledTime: "10:00", status: "done" },
      ], 10 * 60),
    ).toBe(0);
  });
});
