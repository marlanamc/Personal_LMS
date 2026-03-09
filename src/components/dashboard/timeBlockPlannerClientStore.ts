import {
  normalizeTimeBlockPlannerStore,
  type TimeBlockDayPlan,
  type TimeBlockPlannerStore,
} from "@/lib/time-block-planner";

type TimeBlockPlannerClientState = {
  store: TimeBlockPlannerStore;
  isLoaded: boolean;
  isSaving: boolean;
  saveError: string | null;
  dirty: boolean;
};

const listeners = new Set<() => void>();

let state: TimeBlockPlannerClientState = {
  store: {},
  isLoaded: false,
  isSaving: false,
  saveError: null,
  dirty: false,
};

const SERVER_SNAPSHOT: TimeBlockPlannerClientState = {
  store: {},
  isLoaded: false,
  isSaving: false,
  saveError: null,
  dirty: false,
};

let loadPromise: Promise<void> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastLocalMutationAt = 0;
let beforeUnloadUsers = 0;

function emit() {
  for (const listener of listeners) listener();
}

function setState(patch: Partial<TimeBlockPlannerClientState>) {
  state = { ...state, ...patch };
  emit();
}

async function persistToServer(store: TimeBlockPlannerStore): Promise<void> {
  const response = await fetch("/api/time-block-planner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ store }),
  });

  if (!response.ok) {
    throw new Error("Failed to save time blocks");
  }
}

function schedulePersist() {
  if (typeof window === "undefined") return;
  if (!state.isLoaded) return;

  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    setState({ isSaving: true, saveError: null });
    try {
      await persistToServer(state.store);
      setState({ dirty: false });
    } catch (error) {
      console.error("[TimeBlockPlanner] Failed to save store", error);
      setState({ saveError: "Could not save this plan right now." });
    } finally {
      setState({ isSaving: false });
    }
  }, 300);
}

export function timeBlockPlannerSubscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function timeBlockPlannerGetSnapshot(): TimeBlockPlannerClientState {
  return state;
}

export function timeBlockPlannerGetServerSnapshot(): TimeBlockPlannerClientState {
  return SERVER_SNAPSHOT;
}

export async function timeBlockPlannerEnsureLoaded(): Promise<void> {
  if (state.isLoaded) return;
  if (loadPromise) return loadPromise;

  if (typeof window === "undefined") {
    // In Node/SSR we don’t fetch; client will hydrate and load.
    setState({ isLoaded: true });
    return;
  }

  loadPromise = (async () => {
    setState({ isLoaded: false });
    const loadStartedAt = Date.now();
    try {
      const response = await fetch("/api/time-block-planner", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to load time blocks");
      }

      const payload = (await response.json()) as { store?: unknown };
      const loadedStore = normalizeTimeBlockPlannerStore(payload.store);

      const mergedStore =
        lastLocalMutationAt > loadStartedAt ? { ...loadedStore, ...state.store } : loadedStore;

      setState({ store: mergedStore, saveError: null });
    } catch (error) {
      console.error("[TimeBlockPlanner] Failed to load store", error);
      setState({
        store: state.store ?? {},
        saveError: "Sync is temporarily unavailable.",
      });
    } finally {
      setState({ isLoaded: true });
      loadPromise = null;
    }
  })();

  return loadPromise;
}

export function timeBlockPlannerSetPlan(dateKey: string, plan: TimeBlockDayPlan) {
  lastLocalMutationAt = Date.now();
  setState({
    dirty: true,
    store: {
      ...state.store,
      [dateKey]: plan,
    },
  });
  schedulePersist();
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (!state.dirty) return;
  e.preventDefault();
  e.returnValue = "";
}

export function timeBlockPlannerRetainBeforeUnloadPrompt(): () => void {
  if (typeof window === "undefined") return () => {};

  beforeUnloadUsers += 1;
  if (beforeUnloadUsers === 1) {
    window.addEventListener("beforeunload", handleBeforeUnload);
  }

  return () => {
    beforeUnloadUsers = Math.max(0, beforeUnloadUsers - 1);
    if (beforeUnloadUsers === 0) {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  };
}

export function __timeBlockPlannerClientStoreResetForTests() {
  listeners.clear();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  loadPromise = null;
  lastLocalMutationAt = 0;
  beforeUnloadUsers = 0;
  state = {
    store: {},
    isLoaded: false,
    isSaving: false,
    saveError: null,
    dirty: false,
  };
}
