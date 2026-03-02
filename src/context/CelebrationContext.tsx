"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type MilestoneType =
  | "streak_7"
  | "streak_30"
  | "streak_100"
  | "points_100"
  | "points_500"
  | "points_1000"
  | "achievement"
  | "perfect_quiz"
  | "daily_challenge"
  | "first_activity";

export interface Milestone {
  type: MilestoneType;
  title: string;
  subtitle: string;
  emoji: string;
  bonusPoints?: number;
}

const MILESTONE_CONFIGS: Record<MilestoneType, Omit<Milestone, "type">> = {
  streak_7: {
    title: "Weekly Warrior!",
    subtitle: "7-day streak unlocked",
    emoji: "🔥",
    bonusPoints: 25,
  },
  streak_30: {
    title: "Monthly Master!",
    subtitle: "30-day streak achieved",
    emoji: "⚡",
    bonusPoints: 100,
  },
  streak_100: {
    title: "Legendary Learner!",
    subtitle: "100-day streak! Incredible!",
    emoji: "👑",
    bonusPoints: 500,
  },
  points_100: {
    title: "Rising Star!",
    subtitle: "You've earned 100 points",
    emoji: "⭐",
  },
  points_500: {
    title: "Point Powerhouse!",
    subtitle: "500 points milestone",
    emoji: "🌟",
  },
  points_1000: {
    title: "Point Master!",
    subtitle: "1,000 points achieved",
    emoji: "💎",
  },
  achievement: {
    title: "Achievement Unlocked!",
    subtitle: "New badge earned",
    emoji: "🏆",
    bonusPoints: 50,
  },
  perfect_quiz: {
    title: "Perfect Score!",
    subtitle: "100% on your quiz",
    emoji: "💯",
    bonusPoints: 20,
  },
  daily_challenge: {
    title: "Challenge Complete!",
    subtitle: "Daily mission accomplished",
    emoji: "🎯",
  },
  first_activity: {
    title: "Welcome!",
    subtitle: "You completed your first activity",
    emoji: "🎉",
  },
};

interface CelebrationContextType {
  currentMilestone: Milestone | null;
  showMilestone: (type: MilestoneType, customData?: Partial<Milestone>) => void;
  dismissMilestone: () => void;
  queueMilestone: (type: MilestoneType, customData?: Partial<Milestone>) => void;
}

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [_queue, setQueue] = useState<Milestone[]>([]);

  const showMilestone = useCallback(
    (type: MilestoneType, customData?: Partial<Milestone>) => {
      const config = MILESTONE_CONFIGS[type];
      const milestone: Milestone = {
        type,
        ...config,
        ...customData,
      };
      setCurrentMilestone(milestone);
    },
    []
  );

  const dismissMilestone = useCallback(() => {
    setCurrentMilestone(null);

    // Show next in queue if any
    setTimeout(() => {
      setQueue((prev) => {
        if (prev.length > 0) {
          const [next, ...rest] = prev;
          setCurrentMilestone(next);
          return rest;
        }
        return prev;
      });
    }, 300);
  }, []);

  const queueMilestone = useCallback(
    (type: MilestoneType, customData?: Partial<Milestone>) => {
      const config = MILESTONE_CONFIGS[type];
      const milestone: Milestone = {
        type,
        ...config,
        ...customData,
      };

      if (!currentMilestone) {
        setCurrentMilestone(milestone);
      } else {
        setQueue((prev) => [...prev, milestone]);
      }
    },
    [currentMilestone]
  );

  return (
    <CelebrationContext.Provider
      value={{
        currentMilestone,
        showMilestone,
        dismissMilestone,
        queueMilestone,
      }}
    >
      {children}
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error("useCelebration must be used within a CelebrationProvider");
  }
  return context;
}

export { MILESTONE_CONFIGS };
