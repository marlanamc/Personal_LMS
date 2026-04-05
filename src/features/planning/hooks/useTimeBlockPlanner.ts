'use client';

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { type TimeBlockDayPlan, type TimeBlockPlannerDefaults } from "@/lib/time-block-planner";
import {
  timeBlockPlannerEnsureLoaded,
  timeBlockPlannerGetServerSnapshot,
  timeBlockPlannerGetSnapshot,
  timeBlockPlannerRetainBeforeUnloadPrompt,
  timeBlockPlannerSetDefaults,
  timeBlockPlannerSetPlan,
  timeBlockPlannerSubscribe,
} from "../state/timeBlockPlannerClientStore";

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

  const setDefaults = useCallback((defaults: TimeBlockPlannerDefaults) => {
    timeBlockPlannerSetDefaults(defaults);
  }, []);

  return {
    plannerState: snapshot.store,
    plannerStore: snapshot.store.days,
    plannerDefaults: snapshot.store.defaults,
    isLoaded: snapshot.isLoaded,
    isSaving: snapshot.isSaving,
    saveError: snapshot.saveError,
    setPlan,
    setDefaults,
  };
}
