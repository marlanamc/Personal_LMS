import { describe, expect, it } from "vitest";
import { getMiniCalendarDayPresentation } from "@/lib/mini-calendar";

describe("getMiniCalendarDayPresentation", () => {
  it("keeps today styling while still exposing event markers", () => {
    expect(
      getMiniCalendarDayPresentation({
        isToday: true,
        isSelected: false,
        hasEvent: true,
        hasVacation: false,
      }),
    ).toEqual({
      useTodayFill: true,
      useSelectedFill: false,
      ring: "event",
      showEventDot: true,
      showVacationDot: false,
      showAppointmentDot: false,
      showWorkoutDot: false,
    });
  });

  it("preserves both markers when a day has event and vacation metadata", () => {
    expect(
      getMiniCalendarDayPresentation({
        isToday: false,
        isSelected: false,
        hasEvent: true,
        hasVacation: true,
      }),
    ).toEqual({
      useTodayFill: false,
      useSelectedFill: false,
      ring: "event",
      showEventDot: true,
      showVacationDot: true,
      showAppointmentDot: false,
      showWorkoutDot: false,
    });
  });
});
