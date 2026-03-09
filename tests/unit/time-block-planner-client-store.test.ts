import { beforeEach, describe, expect, it, vi } from "vitest";

import { createEmptyTimeBlockDayPlan } from "@/lib/time-block-planner";
import {
  __timeBlockPlannerClientStoreResetForTests,
  timeBlockPlannerEnsureLoaded,
  timeBlockPlannerGetSnapshot,
  timeBlockPlannerSetPlan,
  timeBlockPlannerSubscribe,
} from "@/components/dashboard/timeBlockPlannerClientStore";

describe("timeBlockPlannerClientStore", () => {
  beforeEach(() => {
    __timeBlockPlannerClientStoreResetForTests();
  });

  it("updates the shared store and notifies subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = timeBlockPlannerSubscribe(listener);

    const plan = createEmptyTimeBlockDayPlan("2026-03-09");
    timeBlockPlannerSetPlan("2026-03-09", plan);

    expect(listener).toHaveBeenCalled();
    expect(timeBlockPlannerGetSnapshot().dirty).toBe(true);
    expect(timeBlockPlannerGetSnapshot().store["2026-03-09"].blocks).toEqual([]);

    unsubscribe();
  });

  it("can be marked loaded in non-browser environments", async () => {
    expect(timeBlockPlannerGetSnapshot().isLoaded).toBe(false);
    await timeBlockPlannerEnsureLoaded();
    expect(timeBlockPlannerGetSnapshot().isLoaded).toBe(true);
  });
});

