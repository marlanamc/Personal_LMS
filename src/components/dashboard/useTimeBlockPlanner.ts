'use client';

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { type TimeBlockDayPlan } from "@/lib/time-block-planner";
import {
  timeBlockPlannerEnsureLoaded,
  timeBlockPlannerGetServerSnapshot,
  timeBlockPlannerGetSnapshot,
  timeBlockPlannerRetainBeforeUnloadPrompt,
  timeBlockPlannerSetPlan,
  timeBlockPlannerSubscribe,
} from "./timeBlockPlannerClientStore";

export function useTimeBlockPlanner() {
  const snapshot = useSyncExternalStore(
    timeBlockPlannerSubscribe,
    timeBlockPlannerGetSnapshot,
    timeBlockPlannerGetServerSnapshot,
  );

  useEffect(() => {
    timeBlockPlannerEnsureLoaded();
    return timeBlockPlannerRetainBeforeUnloadPrompt();
  }, []);

  const setPlan = useCallback((dateKey: string, plan: TimeBlockDayPlan) => {
    timeBlockPlannerSetPlan(dateKey, plan);
  }, []);

  return {
    plannerStore: snapshot.store,
    isLoaded: snapshot.isLoaded,
    isSaving: snapshot.isSaving,
    saveError: snapshot.saveError,
    setPlan,
  };
}
